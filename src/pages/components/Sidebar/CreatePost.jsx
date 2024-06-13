import {
  Box,
  Button,
  CloseButton,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { CreatePostLogo } from "../../../assets/constants";
import { BsFillImageFill } from "react-icons/bs";
import { useRef, useState } from "react";
import useShowToast from "../../../hooks/useShowToast";
import usePreviewImg from "../../../hooks/usePreviewImg";
import useAuthStore from "../../../store/authStore";
import usePostStore from "../../../store/postStore";
import useUserProfileStore from "../../../store/userProfileStore";
import { useLocation } from "react-router-dom";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "../../../firebase/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [caption, setCaption] = useState("");
  const imageRef = useRef(null); // stores the reference of the image
  const { handleImageChange, selectedFile, setSelectedFile } = usePreviewImg(); // To render the selected imahe we use this hook
  const showToast = useShowToast();
  const { isLoading, handleCreatePost } = useCreatePost();

  const handlePostCreation = async () => {
    try {
      await handleCreatePost(selectedFile, caption);
      onClose();
      setCaption("");
      setSelectedFile(null);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <>
      <Tooltip
        hasArrow
        label={"Create"}
        placement="right"
        ml={1}
        openDelay={500}
        display={{ base: "block", md: "none" }}
      >
        <Flex
          alignItems={"center"}
          gap={4}
          _hover={{ bg: "whiteAlpha.400" }}
          borderRadius={6}
          p={2}
          w={{ base: 10, md: "full" }}
          justifyContent={{ base: "center", md: "flex-start" }}
          onClick={onOpen}
        >
          <CreatePostLogo />
          <Box display={{ base: "none", md: "block" }}>Create</Box>
        </Flex>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />

        <ModalContent bg={"black"} border={"1px solid gray"}>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Textarea
              placeholder="Post caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <Input
              type="file"
              hidden // a text Choose file is showing so we hide it by hidden property
              ref={imageRef} // uska reference hum store kar lenge
              onChange={handleImageChange} // selecting a file from the computer will lead to run the function
            />

            <BsFillImageFill // this is the logo of select image from chakra ui
              onClick={() => imageRef.current.click()} // when we click that logo then by using the reference we are clicking the Input file in the background
              style={{
                marginTop: "15px",
                marginLeft: "5px",
                cursor: "pointer",
              }}
              size={16}
            />
            {selectedFile && ( // if we select a file from our computer then the selectedFile is not empty it contains the url of the image in the form of string and we show the below flex
              <Flex
                mt={5}
                w={"full"}
                position={"relative"}
                justifyContent={"center"}
              >
                <Image src={selectedFile} alt="Selected img" />
                <CloseButton
                  position={"absolute"}
                  top={2}
                  right={2}
                  onClick={() => {
                    setSelectedFile(null); // closing the button will remove the selected file
                  }}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={handlePostCreation} isLoading={isLoading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;

// Hook for creating a post
function useCreatePost() {
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const createPost = usePostStore((state) => state.createPost); // bringing out the createPost function from the store
  const addPost = useUserProfileStore((state) => state.addPost);
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const { pathname } = useLocation();

  const handleCreatePost = async (selectedFile, caption) => {
    if (isLoading) return;
    if (!selectedFile) throw new Error("Please select an image");
    setIsLoading(true);
    const newPost = {
      caption: caption,
      likes: [],
      comments: [],
      createdAt: Date.now(),
      createdBy: authUser.uid,
    };

    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost); // newPost ko firestore ke posts collection me add kar dega, if there is no collection named posts then it will create one
      const userDocRef = doc(firestore, "users", authUser.uid); // reference of the authUser that is posting
      const imageRef = ref(storage, `posts/${postDocRef.id}`); // store the image in the storage of the firebase database, inside the posts folder and the path name is postDoc ka id

      await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) }); // authUser ke posts collection me post ko add kardo
      await uploadString(imageRef, selectedFile, "data_url"); // this will upload the image in the form of string
      const downloadURL = await getDownloadURL(imageRef); // download the URL of the image

      await updateDoc(postDocRef, { imageURL: downloadURL }); // add the imageURL field to the postDoc

      newPost.imageURL = downloadURL;

      if (userProfile.uid === authUser.uid)
        // if the authUser has opened his own profile
        createPost({ ...newPost, id: postDocRef.id }); // call the createPost which will add the post in the posts collection of the database

      if (pathname !== "/" && userProfile.uid === authUser.uid)
        // if page is not homepage means it is a profile page and it is the profile page of the authUser itself then only add the post
        addPost({ ...newPost, id: postDocRef.id }); // so that the no of post get incremented in the post header section

      showToast("Success", "Post created successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleCreatePost };
}

// 1- COPY AND PASTE AS THE STARTER CODE FOR THE CRAETEPOST COMPONENT
// import { Box, Flex, Tooltip } from "@chakra-ui/react";
// import { CreatePostLogo } from "../../../assets/constants";

// const CreatePost = () => {
//   return (
//     <>
//       <Tooltip
//         hasArrow
//         label={"Create"}
//         placement="right"
//         ml={1}
//         openDelay={500}
//         display={{ base: "block", md: "none" }}
//       >
//         <Flex
//           alignItems={"center"}
//           gap={4}
//           _hover={{ bg: "whiteAlpha.400" }}
//           borderRadius={6}
//           p={2}
//           w={{ base: 10, md: "full" }}
//           justifyContent={{ base: "center", md: "flex-start" }}
//         >
//           <CreatePostLogo />
//           <Box display={{ base: "none", md: "block" }}>Create</Box>
//         </Flex>
//       </Tooltip>
//     </>
//   );
// };

// export default CreatePost;

// 2-COPY AND PASTE FOR THE MODAL
{
  /* <Modal isOpen={isOpen} onClose={onClose} size='xl'>
				<ModalOverlay />

				<ModalContent bg={"black"} border={"1px solid gray"}>
					<ModalHeader>Create Post</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<Textarea placeholder='Post caption...' />

						<Input type='file' hidden />

						<BsFillImageFill
							style={{ marginTop: "15px", marginLeft: "5px", cursor: "pointer" }}
							size={16}
						/>
					</ModalBody>

					<ModalFooter>
						<Button mr={3}>Post</Button>
					</ModalFooter>
				</ModalContent>
			</Modal> */
}
