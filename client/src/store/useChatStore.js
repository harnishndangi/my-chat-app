import { create } from "zustand";
import toast from "react-hot-toast";
import { instance } from "../lib/axios";
import { useAuthStore } from "./useAuthstore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    onlineUsers: [],
    isUserLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await instance.get("/messages/users");
            set({ users: res.data, isUserLoading: false });
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
            set({ isUserLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await instance.get(`/messages/${userId}`);
            set({ messages: res.data, isMessagesLoading: false });
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to fetch messages");
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser || !selectedUser._id) {
            toast.error("No user selected");
            return;
        }
        try {
            const res = await instance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
        }
    },

    subscribeToMessages: () => {
      const { selectedUser } = get();
      if (!selectedUser) return;

      const socket = useAuthStore.getState().socket;
      if (!socket) return;

      // Remove previous listeners to avoid duplicates
      socket.off("newMessage");
      socket.off("getOnlineUsers");

      socket.on("newMessage", (newMessage) => {
        // Accept messages where either sender or receiver is the selected user
        const isRelevant =
          newMessage.senderId === selectedUser._id ||
          newMessage.receiverId === selectedUser._id;
        if (!isRelevant) return;

        set({
          messages: [...get().messages, newMessage],
        });
      });

      // Listen for online users
      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });
    },

    unsubscribeFromMessages: () => {
      const socket = useAuthStore.getState().socket;
      if (!socket) return;
      socket.off("newMessage");
      socket.off("getOnlineUsers");
    },

    setSelectedUser: (selectedUser) => {
      // Unsubscribe from previous user
      get().unsubscribeFromMessages();
      set({ selectedUser, messages: [] });
      if (selectedUser) {
        get().getMessages(selectedUser._id);
        get().subscribeToMessages();
      }
    },
 }));

   