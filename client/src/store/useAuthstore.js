import { create } from 'zustand';
import { instance } from '../lib/axios';
import toast from 'react-hot-toast';
import {io} from "socket.io-client"

const BASE_URl = "http://localhost:3000"

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [0],
  socket:null,

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
      toast.error("Signup failed. Please try again.");
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
      toast.error("Login failed. Please try again.");
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

  connectSocket:()=>{
    const {authUser} =get();
    if(!authUser || get().socket?.connected) return ;

    const socket = io(BASE_URl,{
      query:{
        userId:authUser._id,
      },
    });
    socket.connect();

    set({socket:socket});
    socket.on("getOnlineUsers",(userIds)=>{
      set({onlineUsers:userIds});
    });
  },

  disconnectSocket:()=>{
    if(get().socket?.connected)
      get().socket.disconnect();
    },
}))
