import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import Comment from "../Comment/Comment";
import usePostComment from "../../../hooks/usePostComment";
import { useEffect, useRef } from "react";

const CommentsModal = ({ isOpen, onClose, post }) => {
  const { handlePostComment, isCommenting } = usePostComment();
  const commentRef = useRef(null);
  const commentsContainerRef = useRef(null);
  const handleSubmitComment = async (e) => {
    // do not refresh the page, prevent it
    e.preventDefault();
    await handlePostComment(post.id, commentRef.current.value); // this function takes the post id and the comment itself, we can get the comment using the comment ref
    commentRef.current.value = ""; // after posting the comment clear the input of the comment
  };

  useEffect(() => {
    const scrollToBottom = () => {
      commentsContainerRef.current.scrollTop =
        commentsContainerRef.current.scrollHeight; // scroll this container to its height means scroll to the bottom
    };
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
      }, 100); // we have used setTimeOut because at the start commentsContainerRef.current is undefined so to avoid this use setTimeOut
    }
  }, [isOpen, post.comments.length]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInLeft">
      <ModalOverlay />
      <ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
        <ModalHeader>Comments</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Flex
            mb={4}
            gap={4}
            flexDir={"column"}
            maxH={"250px"}
            overflowY={"auto"}
            ref={commentsContainerRef} // we are storing the reference of the comments container in order to scroll the comment section automatically for me so that we can see the new comment if it overflows
          >
            {post.comments.map((comment, idx) => (
              <Comment key={idx} comment={comment} /> // we don't have id for the comments so we have passed index as the key
            ))}
          </Flex>
          <form onSubmit={handleSubmitComment} style={{ marginTop: "2rem" }}>
            <Input placeholder="Comment" size={"sm"} ref={commentRef} />{" "}
            {/* Input ka ref store ho jayega commentRef me */}
            <Flex w={"full"} justifyContent={"flex-end"}>
              <Button
                type="submit"
                ml={"auto"}
                size={"sm"}
                my={4}
                isLoading={isCommenting}
              >
                Post
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CommentsModal;

// COPY AND PASTE AS THE STARTER CODE FOR THE COMMENTS MODAL COMPONENT
// import {
// 	Button,
// 	Flex,
// 	Input,
// 	Modal,
// 	ModalBody,
// 	ModalCloseButton,
// 	ModalContent,
// 	ModalHeader,
// 	ModalOverlay,
// } from "@chakra-ui/react";

// const CommentsModal = ({ isOpen, onClose }) => {
// 	return (
// 		<Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInLeft'>
// 			<ModalOverlay />
// 			<ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
// 				<ModalHeader>Comments</ModalHeader>
// 				<ModalCloseButton />
// 				<ModalBody pb={6}>
// 					<Flex mb={4} gap={4} flexDir={"column"} maxH={"250px"} overflowY={"auto"}></Flex>
// 					<form style={{ marginTop: "2rem" }}>
// 						<Input placeholder='Comment' size={"sm"} />
// 						<Flex w={"full"} justifyContent={"flex-end"}>
// 							<Button type='submit' ml={"auto"} size={"sm"} my={4}>
// 								Post
// 							</Button>
// 						</Flex>
// 					</form>
// 				</ModalBody>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

// export default CommentsModal;
