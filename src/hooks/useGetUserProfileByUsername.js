import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { firestore } from "../firebase/firebase";

const useGetUserProfileByUsername = (username) => {
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useShowToast();
  const { userProfile, setUserProfile } = useUserProfileStore(); // bringing these 2 functions from the user prfolie store

  useEffect(() => {
    const getUserProfile = async () => {
      setIsLoading(true);
      try {
        const q = query(
          collection(firestore, "users"),
          where("username", "==", username)
        ); // firestore ke users collection me search karo ki username jo ki hum params ke form me de rhe hai wo humare database me kaha hai??
        const querySnapshot = await getDocs(q); // using the getDocs function get the user and make a snapshot

        if (querySnapshot.empty) return setUserProfile(null);

        let userDoc; // if the user exists with that username then store it in the userDoc
        querySnapshot.forEach((doc) => {
          // user ke jitne bhi data hai wo array ke form me hoga isiliye forEach function ka use kar rhe hai
          userDoc = doc.data();
        });

        setUserProfile(userDoc); // set those value in the user profile store
        console.log(userDoc);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setIsLoading(false); // finally sab hone ke baad loading ko false kardo
      }
    };

    getUserProfile(); // call this function on initial time to get the data from firebase
  }, [setUserProfile, username, showToast]); // triger this function on changing any of the three parameters

  return { isLoading, userProfile };
};

export default useGetUserProfileByUsername;
