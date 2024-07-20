import React from "react";
import { Box, Typography } from "@mui/material";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Colors } from "styles/theme/color";

const Footer = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginBottom="32px"
    >
      <Typography color={Colors.darkBlue}>
        Made by{" "}
        <a
          href="https://github.com/aldomarcelino/"
          style={{ color: Colors.blue }}
        >
          Aldo Marcelino
        </a>
      </Typography>
      <Box display="flex" gap="8px" marginTop="5px">
        <a
          href="https://www.linkedin.com/in/aldomarcelino/"
          target="_blank"
          aria-label="LinkedIn"
        >
          <Linkedin color={Colors.darkBlue} />
        </a>
        <a
          href="https://www.linkedin.com/in/aldomarcelino/"
          target="_blank"
          aria-label="Twitter"
        >
          <Twitter color={Colors.darkBlue} />
        </a>
        <a
          href="https://www.linkedin.com/in/aldomarcelino/"
          target="_blank"
          aria-label="GitHub"
        >
          <Github color={Colors.darkBlue} />
        </a>
      </Box>
    </Box>
  );
};

export default Footer;
