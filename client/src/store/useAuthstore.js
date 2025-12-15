import { create } from 'zustand';
import { instance } from '../lib/axios';
import toast from 'react-hot-toast';
import {io} from "socket.io-client"

const BASE_URl = import.meta.env.VITE_PUBLIC_API_URL ? import.meta.env.VITE_PUBLIC_API_URL.replace('/api', '') : "http://localhost:3000";

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  CheckAuth: async () => {
    try {
      const res = await instance.get('/auth/check');
      set({
        authUser: res.data.user,
        isCheckingAuth: false,
      });
      get().connectSocket();

    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ 
        authUser: null,
        isCheckingAuth: false,
      });
      get().disconnectSocket();
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await instance.post('/auth/signUp', data);
      toast.success("Signup successful!");
      set({ authUser: res.data.user || res.data });
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error(error?.response?.data?.message || "Signup failed. Please try again.");
      set({ authUser: null });
    } finally {
      set({ isSigningUp: false });
      toast.dismiss();
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await instance.post('/auth/login', data);
      toast.success("Login successful!");
      set({ authUser: res.data.user || res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
      set({ authUser: null });
    } finally {
      set({ isLoggingIn: false });
      toast.dismiss();
    }
  },

  logout: async () => {
    try {
      await instance.post('/auth/logout');
      toast.success("Logout successful!");
      set({ authUser: null });
      get().disconnectSocket();
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Logout failed. Please try again.");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await instance.put('/auth/update-profile', data);
      toast.success("Profile updated successfully!");
      set((state) => ({
        authUser: { ...state.authUser, ...res.data },
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Profile update failed. Please try again.");
    } finally {
      set({ isUpdatingProfile: false });
      toast.dismiss();
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(BASE_URl, {
      query: {
        userId: authUser._id,
      },
      autoConnect: false,
      transports: ["websocket"],
    });

    newSocket.connect();

    // Clean up previous listeners if any
    newSocket.removeAllListeners();

    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    newSocket.on("disconnect", () => {
      set({ onlineUsers: [] });
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      toast.error("Socket connection failed.");
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.removeAllListeners();
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },
}))
