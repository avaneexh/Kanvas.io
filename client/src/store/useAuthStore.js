import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isLoggingIn: false,
  isCheckingAuth: true,
  isSigningUp: false,

  isAuthModalOpen: false,

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/check");
      // console.log("auth check res", response);
      set({ authUser: response.data.user });
      return true;
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ authUser: null });
      return false;
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/register", data);
      // console.log("Sign up response:", response.data);
      set({ authUser: response.data.user });
      toast.success(
        "Account created successfully!",
        "Welcome to HOS!",
        4000
      );
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.error || "Sign up failed. Please try again.";
      toast.error(errorMessage, "Sign Up Error", 5000);

      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", data);
      console.log("Login response:", response.data);

      toast.success("Login successful!", "Welcome back!", 4000);
      set({ authUser: response.data.user });
    } catch (error) {
      console.error("Error logging in:", error);

      let errorMessage = "Login failed. Please try again.";
      let errorTitle = "Login Error";
      toast.error(errorMessage, errorTitle, 6000);
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successful", "See you later!", 3000);
    } catch (error) {
      console.error("Error logging out:", error);
      set({ authUser: null });
      toast.warning("Logged out locally", "Session cleared", 3000);
    }
  },
}));