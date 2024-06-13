import { create } from "zustand";

const useUserProfileStore = create((set) => ({
  userProfile: null,
  setUserProfile: (userProfile) => set({ userProfile }),
  // this is used to update the number of posts in the profile page when we create a post
  addPost: (
    post // takes the post
  ) =>
    set((state) => ({
      // using the set function takes the initial state of user profile
      userProfile: {
        ...state.userProfile,
        posts: [post.id, ...state.userProfile.posts],
      }, // split the user profile and in posts array add the post at the front
    })),
  deletePost: (postId) =>
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        posts: state.userProfile.posts.filter((id) => id !== postId),
      },
    })),
}));

export default useUserProfileStore;
