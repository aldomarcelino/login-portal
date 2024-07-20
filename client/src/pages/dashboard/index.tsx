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
import ProfileDetailModal from "components/layout/modal/detail-profile-modal";
import VerificationModal from "components/layout/modal/verify-action-modal";
import UserCreationModal from "components/layout/modal/user-creation-modal";
import { useAppDispatch, useAppSelector } from "hooks";
import {
  selectUserList,
  setUserDetail,
  setUserList,
} from "store/reducer/user-profile";
import useResponsive from "utils/use-media-query";
import UserCard from "components/elements/card";

interface ListHead {
  id: number;
  title: string;
  align: "left" | "right" | "center" | "inherit" | "justify";
}

const Dashboard = () => {
  const { laptop, tablet } = useResponsive();
  const dispatch = useAppDispatch();
  // Initialize State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentIdx, setCurrentIdx] = useState(1);
  const [dataLimit] = useState(5);
  const [_, setError] = useState("");

  // Data from global state
  const data = useAppSelector(selectUserList);

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
      id: 3,
      title: "Phone Number",
      align: "left",
    },
    {
      id: 4,
      title: "Website",
      align: "left",
    },
    {
      id: 5,
      title: "Company",
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

  // Paginated the lsit
  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    const final = data?.slice(startIndex, endIndex);
    return final;
  };

  // Get Users
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_SERVER}/users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Something's wrong!`);
        }
        const data = await response.json();

        const temp = data.map((v: any, idx: number) => ({
          ...v,
          imageUrl: `https://picsum.photos/id/${
            idx + Math.floor(Math.random() * 100)
          }/200`,
        }));

        dispatch(setUserList(temp));
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
              isEmpty={data && data?.length === 0}
              onCLickAdd={() => {
                setShowCreationModal(true);
                setStatus("Create");
              }}
            >
              {getPaginatedData()
                ?.filter((user) =>
                  user.name.toLowerCase().includes(search.toLowerCase())
                )
                ?.map((item) => (
                  <TableRow
                    key={item.name}
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
                          alt={item.name}
                          src={item.imageUrl}
                          style={{
                            height: 44,
                            width: 44,
                            borderRadius: 44,
                            objectFit: "cover",
                          }}
                        />
                        {item.name}
                      </Box>
                    </TableCell>
                    <TableCell align="left">{item.email}</TableCell>
                    <TableCell align="left">{item.phone}</TableCell>
                    <TableCell
                      align="left"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a
                        href={"https://" + item.website}
                        target="_blank"
                        style={{ color: Colors.blue100 }}
                      >
                        {item.website}
                      </a>
                    </TableCell>
                    <TableCell align="left">{item.company.name}</TableCell>
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
                    {getPaginatedData()
                      ?.filter((user) =>
                        user.name.toLowerCase().includes(search.toLowerCase())
                      )
                      ?.map((item, idx) => (
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
                              setCurrentIdx(item.id);
                            }}
                            handleEdit={() => {
                              setCurrentIdx(item.id);
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
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageLimit={Math.ceil(
                (search
                  ? data?.filter((user) =>
                      user.name.toLowerCase().includes(search.toLowerCase())
                    ).length
                  : data?.length) / dataLimit
              )}
            />
          </Box>
        )}
        {/* END - Pagination */}
      </Container>

      {/* START - Profile Modal */}
      <ProfileDetailModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      {/* END - Profile Modal */}

      {/* START - Delete User Modal */}
      <VerificationModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        id={currentIdx}
      />
      {/* END - Delete User Modal */}

      {/* START - Creation User Modal */}
      <UserCreationModal
        open={showCreationModal}
        onClose={() => setShowCreationModal(false)}
        status={status}
        setStatus={setStatus}
        id={currentIdx}
      />
      {/* END - Creation User Modal */}
    </>
  );
};

export default Dashboard;
