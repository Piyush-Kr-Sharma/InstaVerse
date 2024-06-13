import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import useShowToast from "./useShowToast";
import { auth, firestore } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import useAuthStore from "../store/authStore";

const useLogin = () => {
  const showToast = useShowToast();
  const [signInWithEmailAndPassword, , loading, error] =
    useSignInWithEmailAndPassword(auth);
  const loginUser = useAuthStore((state) => state.login);

  const login = async (inputs) => {
    // check if the inputs are filled or not
    if (!inputs.email || !inputs.password) {
      return showToast("Error", "Please fill all the fields", "error");
    }
    try {
      // if the inputs are filled then check if the user's email and password is correct or not using the below function
      const userCred = await signInWithEmailAndPassword(
        inputs.email,
        inputs.password
      );

      if (userCred) {
        // if the user credentials are correct then try to get his data
        const docRef = doc(firestore, "users", userCred.user.uid); // get the reference of the user using its id in the firestore database
        const docSnap = await getDoc(docRef); // take a snapshot of the doc

        const userData = docSnap.data();
        localStorage.setItem("user-info", JSON.stringify(userData)); // set it in the local storage
        loginUser(userData); // set the user data in the store
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return { loading, error, login };
};

export default useLogin;
