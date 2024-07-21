import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Skeleton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Menu, Pagination, SearchBar, Table } from "components/elements";
import { Colors } from "styles/theme/color";
import { EllipsisVertical, Plus } from "lucide-react";
import { useAppDispatch } from "hooks";
import { setUserDetail } from "store/reducer/user-profile";
import useResponsive from "utils/use-media-query";
import UserCard from "components/elements/card";
import axios from "axios";
import { getLocalStorage } from "utils/local-storage";
import moment from "moment";

interface ListHead {
  id: number;
  title: string;
  align: "left" | "right" | "center" | "inherit" | "justify";
}

export interface User {
  id: string;
  full_name: string;
  image_url: string;
  phone_number?: string;
  email: string;
  login_count?: string;
  is_login: boolean;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const Dashboard = () => {
  const { laptop, tablet } = useResponsive();
  const dispatch = useAppDispatch();
  // Initialize State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [data, setData] = useState<User[] | null>(null);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentIdx, setCurrentIdx] = useState("");
  const [dataLimit] = useState(5);
  const [_, setError] = useState("");

  const listHead: ListHead[] = [
    {
      id: 1,
      title: "Name",
      align: "left",
    },
    {
      id: 2,
      title: "Email",
      align: "left",
    },
    {
      id: 4,
      title: "Login Count",
      align: "center",
    },
    {
      id: 5,
      title: "Status",
      align: "left",
    },
    {
      id: 5,
      title: "Logout Time",
      align: "left",
    },
    {
      id: 3,
      title: "SignUp on",
      align: "left",
    },
  ];

  const itemList = [
    {
      id: 1,
      label: "Edit",
      handleClick: () => {
        setShowCreationModal(true);
        setStatus("Edit");
      },
    },
    { id: 2, label: "Delete", handleClick: () => setShowDeleteModal(true) },
  ];

  // Handle filter
  const handleFilter = (arr: User[] | null | undefined = []) =>
    arr?.filter((user: { full_name: string }) =>
      user.full_name.toLowerCase().includes(search.toLowerCase())
    );

  // Paginated the lsit
  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    const final: User[] | null | undefined = data?.slice(startIndex, endIndex);
    return final ? handleFilter(final) : null;
  };

  // Handle status

  const handleShowStatus = (status: boolean) => {
    let color = Colors.green100;
    if (!status) color = Colors.red100;
    return (
      <Typography variant="body2" color={color} textAlign="center">
        {status ? "Log In" : "Log Out"}
      </Typography>
    );
  };

  // Get Users
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/users`,
          {
            headers: {
              access_token: getLocalStorage("access_token"),
              "Content-Type": "application/json",
            },
          }
        );

        const temp = response?.data.map((v: any, idx: number) => ({
          ...v,
          image_url: `https://picsum.photos/id/${
            idx + Math.floor(Math.random() * 100)
          }/200`,
        }));

        setData(temp);
      } catch (error: any) {
        setError(error);
      }
    };

    // Call
    setTimeout(() => {
      getUsers();
    }, 1500);
  }, []);

  return (
    <>
      <Container
        fixed={true}
        maxWidth={"lg"}
        sx={{ padding: laptop ? "100px" : "90px 0px 0px" }}
      >
        <Box padding="0px 12px" position="relative">
          {/* Search Bar */}
          <SearchBar
            search={search}
            setSearch={setSearch}
            resetPage={setCurrentPage}
          />

          {/* START - Table */}
          {laptop ? (
            <Table
              listHead={listHead}
              isLoading={!data}
              isEmpty={data && getPaginatedData()?.length === 0}
              onCLickAdd={() => {
                setShowCreationModal(true);
                setStatus("Create");
              }}
            >
              {getPaginatedData()?.map((item: User) => (
                <TableRow
                  key={item.full_name}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: "white",
                    transition: "0.5s all ease",
                    "&:hover": {
                      boxShadow: Colors.shadowLightBlue,
                    },
                    "& td, & th": {
                      border: 0,
                      overflow: "hidden",
                      color: Colors.darkGrey,
                    },
                  }}
                  onClick={() => {
                    dispatch(setUserDetail(item));
                    setShowProfileModal(true);
                  }}
                >
                  <TableCell
                    align="left"
                    sx={{
                      borderTopLeftRadius: "9px",
                      borderBottomLeftRadius: "9px",
                    }}
                  >
                    <Box
                      display="flex"
                      gap={2}
                      alignItems="center"
                      sx={{ color: Colors.black, fontWeight: 500 }}
                    >
                      <img
                        alt={item.full_name}
                        src={item.image_url}
                        style={{
                          height: 44,
                          width: 44,
                          borderRadius: 44,
                          objectFit: "cover",
                        }}
                      />
                      {item.full_name}
                    </Box>
                  </TableCell>
                  <TableCell align="left">{item.email}</TableCell>
                  <TableCell align="center">{item.login_count}</TableCell>
                  <TableCell align="left">
                    {handleShowStatus(item.is_login)}
                  </TableCell>
                  <TableCell align="left">
                    {moment(item.updatedAt).format("DD MMM YYYY, HH:mm")}
                  </TableCell>
                  <TableCell align="left">
                    {moment(item.createdAt).format("DD MMM YYYY, HH:mm")}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      borderTopRightRadius: "9px",
                      borderBottomRightRadius: "9px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIdx(item.id);
                    }}
                  >
                    <Menu
                      menuItems={itemList}
                      width="180px"
                      buttonBase={
                        <EllipsisVertical
                          style={{ cursor: "pointer" }}
                          color={Colors.black}
                        />
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          ) : (
            <>
              <Box display="flex" justifyContent="end" marginTop="14px">
                <Box
                  width="32px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="7px"
                  padding="3px"
                  sx={{
                    backgroundColor: Colors.darkBlue,
                    cursor: "pointer",
                    "&:hover": { opacity: 0.9 },
                  }}
                  onClick={() => {
                    setShowCreationModal(true);
                    setStatus("Create");
                  }}
                >
                  <Plus color={Colors.blue} />
                </Box>
              </Box>
              <Grid container justifyContent={tablet ? "left" : "center"}>
                {!data ? (
                  [1, 2].map((val) => (
                    <Grid
                      item
                      md={6}
                      key={`${val}-empty`}
                      paddingRight={val === 1 && tablet ? "9px" : "0px"}
                      paddingLeft={val === 2 && tablet ? "9px" : "0px"}
                    >
                      <Skeleton
                        style={{
                          borderRadius: "20px",
                          margin: "14px 0px 32px",
                        }}
                        variant="rectangular"
                        width="240px"
                        height="360px"
                      />
                    </Grid>
                  ))
                ) : data && !data.length ? (
                  <Typography>No Data</Typography>
                ) : (
                  <>
                    {getPaginatedData()?.map((item, idx) => (
                      <Grid
                        key={`${idx}-card`}
                        item
                        md={6}
                        marginTop="15px"
                        paddingRight={
                          (idx + 1) % 2 !== 0 && tablet ? "9px" : "0px"
                        }
                        paddingLeft={
                          (idx + 1) % 2 === 0 && tablet ? "9px" : "0px"
                        }
                      >
                        <UserCard
                          data={item}
                          handleClick={() => {
                            dispatch(setUserDetail(item));
                            setShowProfileModal(true);
                          }}
                          handleDelete={() => {
                            setShowDeleteModal(true);
                            // setCurrentIdx(item.id);
                          }}
                          handleEdit={() => {
                            // setCurrentIdx(item.id);
                            setShowCreationModal(true);
                            setStatus("Edit");
                          }}
                        />
                      </Grid>
                    ))}
                  </>
                )}
              </Grid>
            </>
          )}
          {/* END - Table */}
        </Box>

        {/* START - Pagination */}
        {data?.length && (
          <Box display="flex" justifyContent="end" margin="32px 0px">
            {data.filter((user: User) =>
              user.full_name.toLowerCase().includes(search.toLowerCase())
            ).length ? (
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageLimit={Math.ceil(
                  (search
                    ? data.filter((user: User) =>
                        user.full_name
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      ).length
                    : data.length) / dataLimit
                )}
              />
            ) : (
              ""
            )}
          </Box>
        )}
        {/* END - Pagination */}
      </Container>

      {/* START - Profile Modal */}
      {/* <ProfileDetailModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      /> */}
      {/* END - Profile Modal */}
    </>
  );
};

export default Dashboard;
