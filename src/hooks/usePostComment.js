import { useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import usePostStore from "../store/postStore";

const usePostComment = () => {
  const [isCommenting, setIsCommenting] = useState(false);
  const showToast = useShowToast();
  const authUser = useAuthStore((state) => state.user);
  const addComment = usePostStore((state) => state.addComment);

  const handlePostComment = async (postId, comment) => {
    if (isCommenting) return;
    if (!authUser)
      return showToast("Error", "You must be logged in to comment", "error");
    setIsCommenting(true);
    const newComment = {
      comment: comment,
      createdAt: Date.now(),
      createdBy: authUser.uid,
      postId: postId,
    };
    try {
      // This will add the comment in the database
      await updateDoc(doc(firestore, "posts", postId), {
        // posts collection me se postId wale post me comments array hai
        comments: arrayUnion(newComment), // us comments array me newComment add kardo
      });

      // To see the comment in the frontend we will create a function
      addComment(postId, newComment); // add the comment in the post store also
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsCommenting(false);
    }
  };

  return { isCommenting, handlePostComment };
};

export default usePostComment;
