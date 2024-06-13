import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetSuggestedUsers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setIsLoading(true);
      try {
        const usersRef = collection(firestore, "users"); // reference of the collection of users in the firebase database
        const q = query(
          usersRef, // take the reference of the users collection
          where("uid", "not-in", [authUser.uid, ...authUser.following]), // skip the authUser itself and the users that the authUser is following
          orderBy("uid"), // authUser.following is an array so we use ... to split them one by one
          limit(3) // show only 3 users
        );

        const querySnapshot = await getDocs(q); // querySnapshot will contain 3 suggested users
        const users = []; // making an empty array to store them

        querySnapshot.forEach((doc) => {
          // using forEach loop to store them one by one
          users.push({ ...doc.data(), id: doc.id }); // push the data in the users array with its id also to remove the key based error of react
        });

        setSuggestedUsers(users); // set the users array as suggest users
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (authUser) getSuggestedUsers();
  }, [authUser, showToast]);

  return { isLoading, suggestedUsers };
};

export default useGetSuggestedUsers;
