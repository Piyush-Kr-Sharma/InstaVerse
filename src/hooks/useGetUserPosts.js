import { useEffect, useState } from "react";
import usePostStore from "../store/postStore";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetUserPosts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { posts, setPosts } = usePostStore();
  const showToast = useShowToast();
  const userProfile = useUserProfileStore((state) => state.userProfile);

  useEffect(() => {
    const getPosts = async () => {
      if (!userProfile) return;
      setIsLoading(true);
      setPosts([]);

      try {
        const q = query(
          collection(firestore, "posts"),
          where("createdBy", "==", userProfile.uid)
        ); // from the posts collection get all the post created by userProfile.uid means jo abhi post kar rha hai
        const querySnapshot = await getDocs(q);

        const posts = []; // make an empty posts array
        querySnapshot.forEach((doc) => {
          // from the Snapshot fill the post one by one in posts array
          posts.push({ ...doc.data(), id: doc.id });
        });

        posts.sort((a, b) => b.createdAt - a.createdAt); // sort them based on the time at which they are created, new post will shown in the first and then so on
        setPosts(posts); // set the posts array in the posts store
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    getPosts();
  }, [setPosts, userProfile, showToast]);

  return { isLoading, posts };
};

export default useGetUserPosts;
