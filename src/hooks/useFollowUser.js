import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/userProfileStore";
import useShowToast from "./useShowToast";
import { firestore } from "../firebase/firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const useFollowUser = (userId) => {
  // userId is the id of the user that we are going to follow or unfollow
  const [isUpdating, setIsUpdating] = useState(false); // we are updating the follower's list so we use isUpdating state hook
  const [isFollowing, setIsFollowing] = useState(false); // state which cheks whether we are currently following the user or not
  const authUser = useAuthStore((state) => state.user); // get the authenticated user from the store
  const setAuthUser = useAuthStore((state) => state.setUser); // takes the user and set it in the store
  const { userProfile, setUserProfile } = useUserProfileStore(); // we should also update the user profile of the user that we are going to follow or unfollow
  const showToast = useShowToast();

  const handleFollowUser = async () => {
    // this function will update the the followers and following list from everywhere
    setIsUpdating(true); // when this function runs it means we need to update so mark the isUpdating to be true
    try {
      const currentUserRef = doc(firestore, "users", authUser.uid); // reference of the authUser
      const userToFollowOrUnfollorRef = doc(firestore, "users", userId); // reference of the user that we are going to follow or unfollow

      // Updating in the firestore database
      await updateDoc(currentUserRef, {
        // if the authUser is already following then remove the user with that userId else if not following add it
        following: isFollowing ? arrayRemove(userId) : arrayUnion(userId),
      });
      await updateDoc(userToFollowOrUnfollorRef, {
        followers: isFollowing
          ? arrayRemove(authUser.uid)
          : arrayUnion(authUser.uid),
      });

      // Updating the user profile
      if (isFollowing) {
        // unfollow
        setAuthUser({
          ...authUser,
          following: authUser.following.filter((uid) => uid !== userId), // filter method will allow to remove the user with the id 'userId'
        });
        if (userProfile)
          // user profile of the user that we are going to follow
          setUserProfile({
            // update its user profile
            ...userProfile,
            followers: userProfile.followers.filter(
              (uid) => uid !== authUser.uid
            ),
          });

        // Updating in the local storage
        localStorage.setItem(
          "user-info",
          JSON.stringify({
            ...authUser,
            following: authUser.following.filter((uid) => uid !== userId), // in local storegae we don't need to save the user profile
          })
        );
        setIsFollowing(false);
      } else {
        // follow
        setAuthUser({
          ...authUser,
          following: [...authUser.following, userId], // add the userId in the following list of authUser
        });

        if (userProfile)
          setUserProfile({
            ...userProfile,
            followers: [...userProfile.followers, authUser.uid],
          });

        localStorage.setItem(
          "user-info",
          JSON.stringify({
            ...authUser,
            following: [...authUser.following, userId],
          })
        );
        setIsFollowing(true);
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    // in order to initialize the following in the first render we will use useEffect
    if (authUser) {
      const isFollowing = authUser.following.includes(userId); // it checks if the user with the id 'userId' is present in the following list or array of the authUser
      setIsFollowing(isFollowing); // if it is present in the array then set the isFollowing to be true
    }
  }, [authUser, userId]); // run this useEffect whenever there is a change in the authUser and the user that we are going to follow

  return { isUpdating, isFollowing, handleFollowUser }; // return these so that we can use it anywhere
};

export default useFollowUser;
