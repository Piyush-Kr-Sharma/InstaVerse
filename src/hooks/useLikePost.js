import { useState } from "react";
import useShowToast from "./useShowToast";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import useAuthStore from "../store/authStore";
import { firestore } from "../firebase/firebase";

const useLikePost = (post) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const authUser = useAuthStore((state) => state.user); // get the authenticated user
  const [likes, setLikes] = useState(post?.likes.length);
  const [isLiked, setIsLiked] = useState(post?.likes.includes(authUser?.uid)); // checks if the authUser is included in the likes of the post, if included so isLiked will be true;
  const showToast = useShowToast();

  const handleLikePost = async () => {
    if (isUpdating) return; // if updating or liking and the user clicks again to the like button then just return
    if (!authUser)
      return showToast(
        "Error",
        "You must be logged in to like a post",
        "error"
      );
    setIsUpdating(true);

    try {
      const postRef = doc(firestore, "posts", post.id); // reference of the post with the help of its id
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(authUser.uid) : arrayUnion(authUser.uid),
      });

      setIsLiked(!isLiked);
      isLiked ? setLikes(likes - 1) : setLikes(likes + 1);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return { isLiked, likes, handleLikePost, isUpdating };
};

export default useLikePost;
