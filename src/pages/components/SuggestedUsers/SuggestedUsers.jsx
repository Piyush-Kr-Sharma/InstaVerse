import { Box, Flex, Text, VStack, Link } from "@chakra-ui/react";
import SuggestedHeader from "./SuggestedHeader";
import SuggestedUser from "./SuggestedUser";
import useGetSuggestedUsers from "../../../hooks/useGetSuggestedUsers";

const SuggestedUsers = () => {
  const { isLoading, suggestedUsers } = useGetSuggestedUsers(); // using the hook to get the suggested users at initial time

  if (isLoading) return null;

  return (
    <VStack py={8} px={6} gap={4}>
      <SuggestedHeader />

      {suggestedUsers.length !== 0 && (
        <Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}>
          <Text fontSize={12} fontWeight={"bold"} color={"gray.500"}>
            Suggested for you
          </Text>
          <Text
            fontSize={12}
            fontWeight={"bold"}
            _hover={{ color: "gray.400" }}
            cursor={"pointer"}
          >
            See All
          </Text>
        </Flex>
      )}

      {/* Now we will show the suggested users using the map function from the suggestedUsers list*/}
      {suggestedUsers.map((user) => (
        <SuggestedUser user={user} key={user.uid} />
      ))}

      <Box fontSize={12} color={"gray.500"} mt={5} alignSelf={"start"}>
        {/* alignSelf=start will ensure that the text will start from the left corner*/}
        © 2023 Built By{" "}
        <Link
          href="https://www.linkedin.com/in/piyush-kumar-08b432258/"
          target="_blank"
          color="blue.500"
          fontSize={14}
        >
          Piyush kumar Sharma
        </Link>
      </Box>
    </VStack>
  );
};

export default SuggestedUsers;
