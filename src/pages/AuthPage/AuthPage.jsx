import { Container, Flex, VStack, Box, Image } from "@chakra-ui/react";
import AuthForm from "../components/AuthForm/AuthForm";

const AuthPage = () => {
  return (
    // Flex component is a Box component with display set to flex
    <Flex minH={"100vh"} justifyContent={"center"} alignItems={"center"} px={4}>
      {/* Container component is a responsive container that centers its content and restricts its maximum width to the medium size container. It helps to create a consistent and centered layout on the page         */}
      <Container maxW={"container.md"} padding={0}>
        {/* The container has two children Box and VStack but they should be wrapped in Flex so that they will be shown side by side in a horizontal direction */}
        <Flex justifyContent={"center"} alignItems={"center"} gap={10}>
          {/* Left hand-side */}
          {/* base means small size devices in that devices make the display none and in medium size devices make the display block, double corly brackets are for writing objects in a property */}
          <Box display={{ base: "none", md: "none" }}>
            <Image src="/auth.png" h={650} alt="Phone img" />
          </Box>

          {/* Right hand-side */}
          {/* The VStack component on the right side vertically stacks its children with a spacing of 4 units (spacing={4}) and aligns them in a stretch manner (align={"stretch"}). */}
          <VStack spacing={4} align={"stretch"}>
            <AuthForm />
            <Box textAlign={"center"}>Get the app.</Box>
            <Flex gap={5} justifyContent={"center"}>
              <Image src="/playstore.png" h={"10"} alt="Playstore logo" />
              <Image src="/microsoft.png" h={"10"} alt="Microsoft logo" />
            </Flex>
          </VStack>
        </Flex>
      </Container>
    </Flex>
  );
};

export default AuthPage;
