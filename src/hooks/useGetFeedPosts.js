import { useEffect, useState } from "react";
import usePostStore from "../store/postStore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetFeedPosts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { posts, setPosts } = usePostStore();
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();
  const { setUserProfile } = useUserProfileStore();

  useEffect(() => {
    const getFeedPosts = async () => {
      setIsLoading(true);
      if (authUser.following.length === 0) {
        // authUser don't follow anyone
        setIsLoading(false);
        setPosts([]); // so set the feed post to be empty
        return;
      }
      const q = query(
        collection(firestore, "posts"),
        where("createdBy", "in", authUser.following)
      ); // It will give all the posts that is created by the users jise authUser follow karta hai
      try {
        const querySnapshot = await getDocs(q);
        const feedPosts = [];

        querySnapshot.forEach((doc) => {
          feedPosts.push({ id: doc.id, ...doc.data() });
        });

        feedPosts.sort((a, b) => b.createdAt - a.createdAt); // latest post will be shown at the top
        setPosts(feedPosts);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (authUser) getFeedPosts(); // if user is authenticated then only show the feed post
  }, [authUser, showToast, setPosts, setUserProfile]); // when authUser changes, when the user that the authUser follows create a new post, then get all the feed posts

  return { isLoading, posts };
};

export default useGetFeedPosts;
