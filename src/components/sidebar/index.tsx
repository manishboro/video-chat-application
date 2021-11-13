import React from "react";

import { Box } from "@mui/system";
import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { nanoid } from "nanoid";

interface SidebarProps {
  name: string;
  show: boolean;
  Icon?: React.ElementType;
  onClick?: () => void;
  button?: any;
}

export default function Sidebar({ items }: { items: SidebarProps[] }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setIsOpen(open);
  };

  return (
    <>
      <IconButton
        sx={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          backgroundColor: "#646464",
          boxShadow: 20,
          border: "1px solid white",

          "&:hover": {
            backgroundColor: "#646464",
          },
        }}
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon sx={{ color: "white", fontSize: "2.5rem" }} />
      </IconButton>

      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: "280px", backgroundColor: "white", padding: ".5rem 0" }}>
          <List>
            {items.map(
              (item) =>
                item.show && (
                  <ListItem
                    key={nanoid()}
                    button={item.button === undefined ? false : item.button}
                    onClick={() => (item.onClick ? item.onClick() : null)}
                  >
                    {item.Icon && (
                      <ListItemIcon>
                        <item.Icon />
                      </ListItemIcon>
                    )}
                    <ListItemText primary={item.name} />
                  </ListItem>
                )
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
