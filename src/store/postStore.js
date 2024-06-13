import { create } from "zustand";

const usePostStore = create((set) => ({
  posts: [],
  createPost: (post) => set((state) => ({ posts: [post, ...state.posts] })), // takes the current post set the post in the posts array at the front and the remaining posts as it is after that post
  deletePost: (id) =>
    set((state) => ({ posts: state.posts.filter((post) => post.id !== id) })),
  setPosts: (posts) => set({ posts }),
  addComment: (postId, comment) =>
    set((state) => ({
      // we are setting our state which is posts
      posts: state.posts.map((post) => {
        // we are mapping all the posts
        if (post.id === postId) {
          // if we get the required post id on which we will comment
          return {
            ...post, // split all the parameters of the post
            comments: [...post.comments, comment], // from all the parameters only change the comments array
          }; // add the new comment at the end of all the comments
        }
        return post;
      }),
    })),
}));

export default usePostStore;
