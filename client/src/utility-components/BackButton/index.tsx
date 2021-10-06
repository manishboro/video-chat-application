import React from "react";

import { styled } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface BackButtonProps {
  fn?: any;
  rootStyles?: React.CSSProperties;
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  border: "1px solid #EAEAEA",
  borderRadius: "50%",
  zIndex: 100,
  backgroundColor: "white",
  boxShadow: theme.shadows[3],
  height: "6rem",
  width: "6rem",

  "&:hover": { backgroundColor: "white" },
}));

export default function BackButton({ fn, rootStyles }: BackButtonProps) {
  return (
    <StyledIconButton style={{ ...rootStyles }} onClick={() => (fn ? fn() : null)}>
      <ArrowBackIcon style={{ fontSize: "3rem", color: "#2196f3" }} />
    </StyledIconButton>
  );
}
