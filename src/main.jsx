import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { BrowserRouter } from "react-router-dom";

// chakra uses blue as default color for dark mode but we need complete black so we made changes in style
const styles = {
  global: (props) => ({
    // making a global style for all the page bodies that are going to used in this application
    body: {
      bg: mode("gray.100", "#000")(props), // color for the background
      color: mode("gray.800", "whiteAlpha.900")(props), // color for the text
    },
  }),
};

// Add your color mode config
const config = {
  initialColorMode: "dark", // now our application will have the dark mode by default
  useSystemColorMode: false,
};

// extend the theme
const theme = extendTheme({ config, styles });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
