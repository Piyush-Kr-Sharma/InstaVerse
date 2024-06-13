import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user-info")), // initially when the application is opened, it will take the users from the local storage

  login: (user) => set({ user }), // on login set the user
  logout: () => set({ user: null }), // on logout set the user as null
  setUser: (user) => set({ user }), // on signup take the user and set the user
}));

export default useAuthStore;
