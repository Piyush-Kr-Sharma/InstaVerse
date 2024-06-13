import { Box, Image } from "@chakra-ui/react";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import useGetUserProfileById from "../../../hooks/useGetUserProfileById";

const FeedPost = ({ post }) => {
  const { userProfile } = useGetUserProfileById(post.createdBy); // get the profile of the user that has created this post
  return (
    <>
      <PostHeader post={post} creatorProfile={userProfile} />
      <Box my={2} borderRadius={6} overflow={"hidden"}>
        {/* changin the borderRadius only will not work as it overflows the content so we should make it hidden */}
        <Image src={post.imageURL} alt={"FEED POST IMG"} />
      </Box>
      <PostFooter post={post} creatorProfile={userProfile} />
    </>
  );
};

export default FeedPost;
