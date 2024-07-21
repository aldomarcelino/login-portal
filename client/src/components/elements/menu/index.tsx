import React, {
  useState,
  MouseEvent,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { Box, Menu, MenuItem } from "@mui/material";
import styled from "@emotion/styled";
import { Colors } from "styles/theme/color";
import { Pen, Trash2 } from "lucide-react";

interface StyledMenuProps {
  minwidth: string;
  width: string;
}

const StyledMenu = React.memo(
  styled(Menu)<StyledMenuProps>(
    ({ minwidth, width }) => `
      & .MuiPaper-root {
        box-shadow: ${Colors.shadowDark};
        background-color: ${Colors.white};
        border-radius: 13px;
        min-width: ${minwidth};
        width: ${width};
      }

      & .MuiMenu-list {
        padding: 0;
      }

      & .MuiMenuItem-root {
        padding: 12px 18px;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        display: flex;
      }

      & ::-webkit-scrollbar {
        width: 6px;
      }
      & ::-webkit-scrollbar-thumb {
        background-color: #3E95CC;
        border-radius: 20px;
      }
    `
  )
);

export interface MenuItem {
  id: number;
  label: string;
  handleClick: () => void;
}

interface CustomMenuProps {
  buttonBase: React.ReactNode;
  menuItems?: MenuItem[];
  width?: string;
  children?: ReactNode;
}

const CustomMenu: React.FC<CustomMenuProps> = ({
  buttonBase,
  menuItems,
  width = "160px",
  children,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const menuItemRef = useRef<HTMLLIElement | null>(null);

  // Handle open
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle how icon
  const handleShowIcon = (status: string) => {
    if (status === "Delete")
      return <Trash2 style={{ marginRight: "5px" }} size={17} />;
    return <Pen style={{ marginRight: "5px" }} size={17} />;
  };

  useEffect(() => {
    if (menuItemRef.current) {
      menuItemRef.current.blur();
    }
  }, [open]);

  return (
    <>
      <Box onClick={handleClick}>{buttonBase}</Box>

      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        minwidth={width}
        width={width}
        elevation={0}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        MenuListProps={{ disablePadding: true, autoFocusItem: false }} // Disable auto focus
      >
        {children ? (
          children
        ) : (
          <>
            {menuItems?.map((item, index) => (
              <MenuItem
                key={`${index}-item`}
                ref={index === 0 ? menuItemRef : null}
                onClick={() => {
                  setAnchorEl(null);
                  item.handleClick();
                }}
                sx={{
                  color: Colors.darkGrey,
                  "&:hover": {
                    color:
                      item.label === "Delete" ? Colors.red100 : Colors.darkBlue,
                  },
                }}
              >
                {handleShowIcon(item.label)}
                {item.label}
              </MenuItem>
            ))}
          </>
        )}
      </StyledMenu>
    </>
  );
};

export default CustomMenu;
