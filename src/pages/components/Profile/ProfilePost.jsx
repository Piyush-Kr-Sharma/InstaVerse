import {
  Avatar,
  Button,
  Divider,
  Flex,
  GridItem,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Comment from "../Comment/Comment";
import PostFooter from "../FeedPosts/PostFooter";
import useUserProfileStore from "../../../store/userProfileStore";
import useAuthStore from "../../../store/authStore";
import useShowToast from "../../../hooks/useShowToast";
import { useState } from "react";
import usePostStore from "../../../store/postStore";
import { firestore, storage } from "../../../firebase/firebase";
import { deleteObject, ref } from "firebase/storage";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Caption from "../Comment/Caption";

const ProfilePost = ({ post }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePost = usePostStore((state) => state.deletePost); // deletes the post from the profile
  const decrementPostsCount = useUserProfileStore((state) => state.deletePost); // reduces the post count by deleting the post

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    if (isDeleting) return; // while deleting if the user clicks the delete button again then just return

    // first we will delete the image from the storage and then delete the post from the posts collection
    try {
      const imageRef = ref(storage, `posts/${post.id}`); // post that we are going to delete
      await deleteObject(imageRef);
      const userRef = doc(firestore, "users", authUser.uid); // users collection me se authUser ke id ka reference that we will update
      await deleteDoc(doc(firestore, "posts", post.id)); // us post ko delete kardo

      await updateDoc(userRef, {
        // user ke posts me se us post ki id ko hata do
        posts: arrayRemove(post.id),
      });

      deletePost(post.id);
      decrementPostsCount(post.id);
      showToast("Success", "Post deleted successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* This component will contain 2 things, 1-> photo & 2-> when we hover on the photo then we will show the no of likes and comment by making the opacity of post lower*/}
      <GridItem
        cursor={"pointer"}
        borderRadius={4}
        overflow={"hidden"} // to make the image not overflow the outer white border
        border={"1px solid"}
        borderColor={"whiteAlpha.300"}
        position={"relative"}
        aspectRatio={1 / 1} // to make the height and width of all the GridItems to be equal 1/1 for square
        onClick={onOpen}
      >
        {/* showing the likes and comment on hovering the post*/}
        <Flex
          opacity={0} // initial opacity of this component is 0
          _hover={{ opacity: 1 }} // when we hover the post then its opacity will be 1 and we can see the no of likes and comments
          position={"absolute"}
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={"blackAlpha.700"}
          transition={"all 0.3s ease"}
          zIndex={1} // show the likes and comments text above the text else it will hide under the post
          justifyContent={"center"}
        >
          <Flex alignItems={"center"} justifyContent={"center"} gap={50}>
            <Flex>
              <AiFillHeart size={20} /> {/* Like Symbol */}
              <Text fontWeight={"bold"} ml={2}>
                {post.likes.length}
              </Text>
            </Flex>

            <Flex>
              <FaComment size={20} />
              <Text fontWeight={"bold"} ml={2}>
                {post.comments.length}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Image
          src={post.imageURL} // passed as props which it gets its value from ProfilePosts.jsx
          alt="profile post"
          w={"100%"}
          h={"100%"}
          objectFit={"cover"}
        />
      </GridItem>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered={true}
        size={{ base: "3xl", md: "5xl" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody bg={"black"} pb={5}>
            <Flex
              gap="4"
              w={{ base: "90%", sm: "70%", md: "full" }}
              mx={"auto"}
              maxH={"90vh"}
              minH={"70vh"}
            >
              {/* Left side of the modal which contains the image */}
              <Flex
                borderRadius={4}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"whiteAlpha.300"}
                flex={1.5} // larger width of the modal will be taken by image
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Image src={post.imageURL} alt="profile post" />
              </Flex>
              {/* Right side of the modal which contain different things of the user */}
              <Flex
                flex={1} // will take the remaining part of the modal
                flexDir={"column"} // ek ke niche ek show karo
                px={10}
                display={{ base: "none", md: "flex" }} // small screens me modal ka right side nhi dikhayenge
              >
                {/* first flex me avatar, username left side me delete button right side me hoga */}
                <Flex alignItems={"center"} justifyContent={"space-between"}>
                  {/* Iske andar jo flex hai aur ek box hai uske bich space-between apply ho jayega */}
                  <Flex alignItems={"center"} gap={4}>
                    <Avatar
                      src={userProfile.profilePicURL}
                      size={"sm"}
                      name="Piyush Kumar Sharma"
                    />
                    <Text fontWeight={"bold"} fontSize={12}>
                      {userProfile.username}
                    </Text>
                  </Flex>
                  {authUser?.uid === userProfile.uid && ( // show the delete button only if he is the owner of the profile page
                    <Button
                      size={"sm"}
                      bg={"transparent"}
                      _hover={{ bg: "whiteAlpha.300", color: "red.600" }}
                      borderRadius={4}
                      p={1}
                      onClick={handleDeletePost}
                      isLoading={isDeleting}
                    >
                      <MdDelete size={20} cursor="pointer" />
                    </Button>
                  )}
                </Flex>

                {/* Second component of the flex with flex direction column so it will be seen below the above component */}
                <Divider my={4} bg={"gray.500"} />

                <VStack
                  w="full"
                  alignItems={"start"}
                  maxH={"380px"}
                  overflowY={"auto"} // it will allow to make a scrollbar in case of overflow
                >
                  {/* CAPTION */}
                  {post.caption && <Caption post={post} />}
                  {/* COMMENTS */}
                  {post.comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                  ))}
                </VStack>
                <Divider my={4} bg={"gray.8000"} />

                <PostFooter isProfilePage={true} post={post} />
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfilePost;
