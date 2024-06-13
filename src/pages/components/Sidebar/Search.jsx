import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { SearchLogo } from "../../../assets/constants";
import { useRef } from "react";
import SuggestedUser from "../SuggestedUsers/SuggestedUser";
import useSearchUser from "../../../hooks/useSearchUser";

const Search = () => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // we need these 3 values for a modal
  const searchRef = useRef(null); // get the reference using this hook
  const { user, isLoading, getUserProfile, setUser } = useSearchUser();

  const handleSearchUser = (e) => {
    e.preventDefault();
    getUserProfile(searchRef.current.value); // searchRef.current.value will contain the reference of the username entered by the user for search
  }; // through the getUserProfile function that we have defined in the hook will help to get that user

  return (
    <>
      <Tooltip
        hasArrow
        label={"Search"}
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
          onClick={onOpen} // clicking is allowed to the entire flex whether logo or text
        >
          <SearchLogo />
          <Box display={{ base: "none", md: "block" }}>Search</Box>
        </Flex>
      </Tooltip>

      {/* motionPreset="slideInLeft" this will make the modal to move from left to middle */}
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInLeft">
        <ModalOverlay />
        <ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
          <ModalHeader>Search user</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSearchUser}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input placeholder="asaprogrammer" ref={searchRef} />{" "}
                {/* For finding the user with the input username we have to remind it so we make a reference for that */}
              </FormControl>

              <Flex w={"full"} justifyContent={"flex-end"}>
                <Button
                  type="submit"
                  ml={"auto"}
                  size={"sm"}
                  my={4}
                  isLoading={isLoading}
                >
                  Search
                </Button>
              </Flex>
            </form>
            {user && <SuggestedUser user={user} setUser={setUser} />}
            {/* if user exists show the user */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Search;

// COPY AND PASTE AS THE STARTER CODE FOR THE SEARCH COMPONENT
// import { Box, Flex, Tooltip } from "@chakra-ui/react";
// import { SearchLogo } from "../../../assets/constants";

// const Search = () => {
//   return (
//     <>
//       <Tooltip
//         hasArrow
//         label={"Search"}
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
//           <SearchLogo />
//           <Box display={{ base: "none", md: "block" }}>Search</Box>
//         </Flex>
//       </Tooltip>
//     </>
//   );
// };

// export default Search;
