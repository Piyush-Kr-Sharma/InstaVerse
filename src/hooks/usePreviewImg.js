// when we want to render an image from our computer then we create such hooks and call it as required

import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
  const [selectedFile, setSelectedFile] = useState(null); // initiallt there is no selected file
  const showToast = useShowToast();
  const maxFileSizeInBytes = 2 * 1024 * 1024; // 2MB -> this hook only allows max of 2MB of images

  const handleImageChange = (e) => {
    // once we select an image this function will run in background
    const file = e.target.files[0]; // this will take the file that we will choose from the machine
    if (file && file.type.startsWith("image/")) {
      // startsWith("image/") -> this will check if the file is image or not
      if (file.size > maxFileSizeInBytes) {
        showToast("Error", "File size must be less than 2MB", "error");
        setSelectedFile(null);
        return;
      }
      const reader = new FileReader(); // we will use this hook to read the files

      reader.onloadend = () => {
        setSelectedFile(reader.result); // it will take the reader ka result and set it to the selected file
      };

      reader.readAsDataURL(file); // convert the image file into a default string and then set it in selected file
    } else {
      showToast("Error", "Please select an image file", "error");
      setSelectedFile(null);
    }
  };

  return { selectedFile, handleImageChange, setSelectedFile };
};

export default usePreviewImg;
