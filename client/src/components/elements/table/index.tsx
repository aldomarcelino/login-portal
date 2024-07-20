import React, { ReactNode } from "react";
import {
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import { Plus } from "lucide-react";
import { Colors } from "styles/theme/color";

export interface ListHeadItem {
  id: number;
  title: string;
  align: "left" | "right" | "center" | "inherit" | "justify";
}

export interface TabelProps {
  listHead: ListHeadItem[];
  isEmpty: boolean | null;
  isLoading: boolean;
  children: ReactNode;
  onCLickAdd: () => void;
}

const Tabel: React.FC<TabelProps> = ({
  listHead,
  isEmpty,
  onCLickAdd,
  children,
  isLoading,
}) => {
  return (
    <>
      <Table sx={{ borderCollapse: "separate", borderSpacing: "0 21px" }}>
        <TableHead sx={{ position: "relative" }}>
          <TableRow>
            {listHead.map((item) => (
              <TableCell
                align={item.align}
                key={`${item.id}-heading`}
                sx={{
                  textTransform: "uppercase",
                  fontWeight: 550,
                  fontSize: 16,
                }}
              >
                {item.title}
              </TableCell>
            ))}
            <TableCell>
              <Box
                data-testid="add"
                display="flex"
                justifyContent="center"
                alignItems="center"
                position="absolute"
                top="16px"
                right="24px"
                borderRadius="7px"
                padding="3px"
                sx={{
                  backgroundColor: Colors.darkBlue,
                  cursor: "pointer",
                  "&:hover": { opacity: 0.9 },
                }}
                onClick={onCLickAdd}
              >
                <Plus color={Colors.blue} />
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <>
              {[...Array(5)].map((_, id) => (
                <TableRow
                  key={`${id}-TableRow`}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: "white",
                    transition: "0.5s all ease",
                    "&:hover": {
                      boxShadow: Colors.shadowSecond,
                    },
                    "& td, & th": {
                      border: 0,
                      overflow: "hidden",
                    },
                  }}
                >
                  {[...Array(6)].map((_, idx) => (
                    <TableCell key={`${idx}-TableCell`}>
                      <Skeleton
                        data-testid="skeleton"
                        height="21px"
                        variant="rectangular"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          ) : isEmpty ? (
            <TableRow>
              <TableCell colSpan={listHead.length}>
                <Typography margin="100px 0px" textAlign="center">
                  No data
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            <>{children}</>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default Tabel;
