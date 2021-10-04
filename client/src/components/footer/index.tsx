import IconButton from "@mui/material/IconButton";

import { FooterRoot, ListContainer, StyledMicIcon, StyledVideocamIcon } from "./styles";

export default function Footer() {
  return (
    <FooterRoot>
      <ListContainer>
        <li>
          <IconButton>
            <StyledMicIcon />
          </IconButton>
        </li>
        <li>
          <IconButton>
            <StyledVideocamIcon />
          </IconButton>
        </li>
      </ListContainer>
    </FooterRoot>
  );
}
