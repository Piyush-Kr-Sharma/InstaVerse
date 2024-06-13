import {
  Container,
  Flex,
  Link,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import useGetUserProfileByUsername from "../../hooks/useGetUserProfileByUsername";
import ProfileHeader from "../../pages/components/Profile/ProfileHeader";
import ProfileTabs from "../../pages/components/Profile/ProfileTabs";
import ProfilePosts from "../../pages/components/Profile/ProfilePosts";

const ProfilePage = () => {
  const { username } = useParams(); // in app.jsx when we define the route as /:username so we get this username with the help of useParams
  const { isLoading, userProfile } = useGetUserProfileByUsername(username); // get these 2 states from the hook

  const userNotFound = !isLoading && !userProfile;
  if (userNotFound) return <UserNotFound />; // when we don't have the user then show the user not found page

  return (
    <Container maxW="container.lg" py={5}>
      <Flex
        py={10}
        px={4}
        pl={{ base: 4, md: 10 }}
        w={"full"}
        mx={"auto"}
        flexDirection={"column"}
      >
        {!isLoading && userProfile && <ProfileHeader />}{" "}
        {/* if the user exists then only show the profile header*/}
        {isLoading && <ProfileHeaderSkeleton />}{" "}
        {/* if it is loading then show the skeleton */}
      </Flex>
      <Flex
        px={{ base: 2, sm: 4 }}
        maxW={"full"}
        mx={"auto"}
        borderTop={"1px solid"}
        borderColor={"whiteAlpha.300"}
        direction={"column"}
      >
        <ProfileTabs />
        <ProfilePosts />
      </Flex>
    </Container>
  );
};

export default ProfilePage;

// skeleton for profile header
const ProfileHeaderSkeleton = () => {
  return (
    <Flex
      gap={{ base: 4, sm: 10 }}
      py={10}
      direction={{ base: "column", sm: "row" }}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <SkeletonCircle size="24" />

      <VStack
        alignItems={{ base: "center", sm: "flex-start" }}
        gap={2}
        mx={"auto"}
        flex={1}
      >
        <Skeleton height="12px" width="150px" />
        <Skeleton height="12px" width="100px" />
      </VStack>
    </Flex>
  );
};

const UserNotFound = () => {
  return (
    <Flex flexDir="column" textAlign={"center"} mx={"auto"}>
      <Text fontSize={"2xl"}>User Not Found</Text>
      <Link
        as={RouterLink}
        to={"/"}
        color={"blue.500"}
        w={"max-content"}
        mx={"auto"}
      >
        Go home
      </Link>
    </Flex>
  );
};
