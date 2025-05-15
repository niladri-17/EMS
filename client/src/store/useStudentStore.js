// useAuthStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios.js";
import { saveAttempt } from "../../../server/controllers/student.controller.js";

const BASE_URL = "http://localhost:500";

// Create a slice for persisted state
const createPersistedSlice = (set, get) => ({
  studentAuthUser: null,
  isPermissionsAccepted: false,
  isExamPrepared: false,
  examId: null,
  examAttemptId: null,
});

// Create a slice for non-persisted state
const createNonPersistedSlice = (set, get) => ({
  socket: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isUsersSearching: false,
  examQuestions: [],
  examAnswers: [],
});

export const useStudentStore = create(
  persist(
    (set, get) => ({
      ...createPersistedSlice(set, get),
      ...createNonPersistedSlice(set, get),

      // checkAuth: async () => {
      //   try {
      //     const res = await axiosInstance.get("/auth/check");
      //     set({
      //       studentAuthUser: res.data,
      //       isCheckingAuth: false,
      //     });
      // get().connectSocket();
      //   } catch (error) {
      //     console.log("Error in checkAuth:", error);
      //     set({
      //       studentAuthUser: null,
      //       isCheckingAuth: false,
      //     });
      //   }
      // },

      setstudentAuthUser: (user) => set({ studentAuthUser: user }),
      setOnlineUsers: (users) => set({ onlineUsers: users }),
      setIsPermissionsAccepted: (value) =>
        set({ isPermissionsAccepted: value }),
      setIsExamPrepared: (value) => set({ isExamPrepared: value }),
      setExamId: (examId) => set({ examId: examId }),

      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const examId = get().examId;
          const res = await axiosInstance.post(`/login`, data);
          set({ studentAuthUser: res.data.data.user });
          set({ examAttemptId: res.data.data.examAttemptId });
          toast.success(res.data.message);
          //   get().connectSocket();
        } catch (error) {
          // if (error.response.status !== 401)
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          const res = await axiosInstance.post("/auth/logout");

          toast.success(res.data.message);

          get().disconnectSocket();
        } catch (error) {
          console.log("Error in logout:", error);
          // toast.error(error.response.data.message);
        } finally {
          set({ studentAuthUser: null, onlineUsers: [] });
        }
      },

      fetchExamQuestions: async (examId) => {
        // set({ isFetchingExamQuestions: true });
        try {
          const res = await axiosInstance.get(`questions/${examId}`);
          set({ examQuestions: res.data.data });
          get().examQuestions.map((q) => set({ [`answer${q._id}`]: "" }));
          console.log("Exam Questions:", res.data.data);
        } catch (error) {
          console.log("Error in fetchExamQuestions:", error);
          toast.error(error.response.data.message);
        } finally {
          // set({ isFetchingExamQuestions: false });
        }
      },

      saveAttempt: async (data) => {
        // set({ isSavingAttempt: true });
        try {
          const res = await axiosInstance.post(`answers/save`, data);
          toast.success(res.data.message);
        } catch (error) {
          console.log("Error in saveAttempt:", error);
          toast.error(error.response.data.message);
        } finally {
          // set({ isSavingAttempt: false });
        }
      },

      connectSocket: () => {
        const { studentAuthUser } = get();
        if (!studentAuthUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
          query: {
            userId: studentAuthUser._id,
          },
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
      },

      disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
          socket.disconnect();
          set({ socket: null });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        studentAuthUser: state.studentAuthUser,
        isPermissionsAccepted: state.isPermissionsAccepted,
        isExamPrepared: state.isExamPrepared,
        examId: state.examId,
        // socket: state.socket,
      }),
    }
  )
);
