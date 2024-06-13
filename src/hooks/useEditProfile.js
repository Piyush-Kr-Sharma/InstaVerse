import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { firestore, storage } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import useUserProfileStore from "../store/userProfileStore";

const useEditProfile = () => {
  const [isUpdating, setIsUpdating] = useState(false); // takes some time on submit so we handle the edit function using this state
  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
  const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

  const showToast = useShowToast();

  const editProfile = async (inputs, selectedFile) => {
    if (isUpdating || !authUser) return; // if we click again the submit button while it is updating then it should not try to update it again so we will check if the it is updating right now or not
    setIsUpdating(true); // set the updating to be true

    // now when we choose a file then it will be in the form of string so we convert it to the image and
    // then set it to the firestore database
    const storageRef = ref(storage, `profilePics/${authUser.uid}`); // we will get the reference of the storage where we will upload the image selected from the computer and it will be the path of the user id
    const userDocRef = doc(firestore, "users", authUser.uid); // it will contain the user document reference from the firestore database which is being searched with the help of its id

    let URL = "";
    try {
      if (selectedFile) {
        await uploadString(storageRef, selectedFile, "data_url"); // upload the data_url which is the url of the selected image in the form of string at the storageRef
        URL = await getDownloadURL(ref(storage, `profilePics/${authUser.uid}`)); // now we are getting the url from the storage
      }

      const updatedUser = {
        ...authUser, // if we don't add this line then it will delete all the values and update the below parameters
        fullName: inputs.fullName || authUser.fullName,
        username: inputs.username || authUser.username,
        bio: inputs.bio || authUser.bio,
        profilePicURL: URL || authUser.profilePicURL,
      };

      await updateDoc(userDocRef, updatedUser); // pas this updated user in the userDoc
      localStorage.setItem("user-info", JSON.stringify(updatedUser));
      setAuthUser(updatedUser); // also update the authenticated user using the function imported from the auth store
      setUserProfile(updatedUser); // now we also need to update the user profile also
      showToast("Success", "Profile updated successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return { editProfile, isUpdating };
};

export default useEditProfile;
