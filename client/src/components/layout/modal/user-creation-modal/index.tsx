import React, { useEffect, useState } from "react";
import { Box, Grid, Modal, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { Button, TextField } from "components/elements";
import { Colors } from "styles/theme/color";
import { X } from "lucide-react";
import { UserProps, userValidation } from "utils/validation";
import { useAppDispatch, useAppSelector } from "hooks";
import { selectUserList, setUserList } from "store/reducer/user-profile";
import { toastSuccess } from "utils/toast-message";
import useResponsive from "utils/use-media-query";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  status: string;
  id: number;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

const Component = styled(Box)(
  ({ width, padding }) => `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${width};
  background-color: ${Colors.white};
  box-shadow: 0px 10px 40px rgba(164, 149, 107, 0.1);
  padding: ${padding};
  border-radius: 20px;
  outline: none;
`
);

const initialForm: UserProps = {
  name: "",
  username: "",
  email: "",
  street: "",
  suite: "",
  city: "",
  zipcode: "",
  lat: "",
  lng: "",
  phone: "",
  compay_name: "",
  catchPhrase: "",
  bs: "",
  website: "",
};

const UserCreationModal: React.FC<UserModalProps> = ({
  open,
  onClose,
  status,
  id,
  setStatus,
}) => {
  const { laptop, tablet } = useResponsive();
  const dispatch = useAppDispatch();
  // Initialize State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const listType = ["personal", "address", "company"];

  // Data from global state
  const data = useAppSelector(selectUserList);

  // Event on change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Clear state handler
  const handleCancel = () => {
    setForm(initialForm);
    setError("");
    setErrors({});
    setLoading(false);
    setCurrentIdx(0);
    onClose();
    setStatus("");
  };

  // Handle create event form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Prevent from over ids
    if (currentIdx >= 2) setCurrentIdx(2);
    setError("");
    setErrors({});

    // Check empty field
    const temp = userValidation(form);

    if (Object.keys(initialForm).some((key) => temp[key] !== "")) {
      setErrors(temp);
      setError("Check your all input!");
      return;
    } else {
      setLoading(true);
      // payload
      let newArr: any = data && [...data];
      const theUser = data && {
        id: status === "Edit" ? id : data.length,
        name: form.name,
        imageUrl:
          form.imageUrl ||
          `https://picsum.photos/id/${
            data.length + Math.floor(Math.random() * 100)
          }/200`,
        username: form.username,
        email: form.email,
        address: {
          street: form.street,
          suite: form.suite,
          city: form.city,
          zipcode: form.city,
          geo: {
            lat: form.lat,
            lng: form.lng,
          },
        },
        phone: form.phone,
        website: form.website,
        company: {
          name: form.compay_name,
          catchPhrase: form.catchPhrase,
          bs: form.bs,
        },
      };
      if (status === "Edit") {
        newArr = newArr?.filter((val: any) => val.id !== id);
      }
      const newList = newArr && [theUser, ...newArr];

      // Create new list
      setTimeout(() => {
        const msg =
          status === "Edit" ? "Edited Succesfully." : "Created Succesfully.";
        dispatch(setUserList(newList));
        handleCancel();
        toastSuccess(msg);
      }, 1000);
    }
  };

  // Handle Wixzard using index
  const handleDecrementIdx = () => {
    if (currentIdx) setCurrentIdx(currentIdx - 1);
  };

  const handleIncrementIdx = () => {
    if (currentIdx < 3) setCurrentIdx(currentIdx + 1);
  };

  // Populate user data
  useEffect(() => {
    if (data && status === "Edit") {
      const user = data.find((val: any) => val.id === id);
      if (user) {
        setForm({
          name: user.name,
          username: user.username,
          website: user.website,
          email: user.email,
          street: user.address.street,
          suite: user.address.suite,
          city: user.address.city,
          zipcode: user.address.zipcode,
          lat: user.address.geo.lat,
          lng: user.address.geo.lng,
          phone: user.phone,
          compay_name: user.company.name,
          catchPhrase: user.company.catchPhrase,
          bs: user.company.bs,
          imageUrl: user.imageUrl,
        });
      }
    } else setForm(initialForm);
  }, [id, data, status]);

  // Handle To show current section
  const handleWizard = () => {
    switch (currentIdx) {
      case 0:
        return (
          <Box
            display="flex"
            flexDirection="column"
            gap="13px"
            marginTop={status === "Edit" ? "0px" : "24px"}
          >
            <Box>
              <TextField
                label="Full Name*"
                name="name"
                value={form.name}
                handleChange={handleChange}
                placeholder="Jhon Dalton"
                errors={errors}
                width="100%"
              />
            </Box>
            <Box>
              <TextField
                label="Username*"
                name="username"
                value={form.username}
                handleChange={handleChange}
                placeholder="jhondoe"
                errors={errors}
                width="100%"
              />
            </Box>
            <Box>
              <TextField
                label="Email*"
                name="email"
                value={form.email}
                handleChange={handleChange}
                placeholder="jhondalton@mailinator.com"
                errors={errors}
                width="100%"
              />
            </Box>
            <Box>
              <TextField
                label="Phone Number*"
                name="phone"
                value={form.phone}
                handleChange={handleChange}
                placeholder="084203742380"
                errors={errors}
                width="100%"
              />
            </Box>
            <Box>
              <TextField
                label="Website"
                name="website"
                value={form.website}
                handleChange={handleChange}
                placeholder="https://jhondoe.org"
                errors={errors}
                width="100%"
              />
            </Box>
          </Box>
        );
      case 1:
        return (
          <Grid
            container
            margin={status === "Edit" ? "0px" : "24px 0px"}
            style={{ maxHeight: "465px", overflowY: "scroll" }}
          >
            <Grid item md={6} xs={tablet ? 6 : 12} paddingRight="5px">
              <Box display="flex" flexDirection="column" gap="13px">
                <Box>
                  <TextField
                    label="Street*"
                    name="street"
                    value={form.street}
                    handleChange={handleChange}
                    placeholder="Kulas Light"
                    errors={errors}
                    width="100%"
                  />
                </Box>
                <Box>
                  <TextField
                    label="Suite*"
                    name="suite"
                    value={form.suite}
                    handleChange={handleChange}
                    placeholder="Apt. 556"
                    errors={errors}
                    width="100%"
                  />
                </Box>
                <Box>
                  <TextField
                    label="City*"
                    name="city"
                    value={form.city}
                    handleChange={handleChange}
                    placeholder="New York"
                    errors={errors}
                    width="100%"
                  />
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              md={6}
              xs={tablet ? 6 : 12}
              paddingLeft="5px"
              marginTop={tablet ? "0px" : "13px"}
            >
              <Box display="flex" flexDirection="column" gap="13px">
                <Box>
                  <TextField
                    label="Zip Code*"
                    name="zipcode"
                    value={form.zipcode}
                    handleChange={handleChange}
                    placeholder="92998-3874"
                    errors={errors}
                    width="100%"
                  />
                </Box>
                <Box>
                  <TextField
                    label="Latitude*"
                    name="lat"
                    value={form.lat}
                    handleChange={handleChange}
                    placeholder="-37.3159"
                    type="number"
                    errors={errors}
                    width="100%"
                  />
                </Box>
                <Box>
                  <TextField
                    label="Longitude*"
                    name="lng"
                    type="number"
                    value={form.lng}
                    handleChange={handleChange}
                    placeholder="81.1496"
                    errors={errors}
                    width="100%"
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        );

      default:
        return (
          <Box
            display="flex"
            flexDirection="column"
            gap="13px"
            marginTop="24px"
          >
            <Box>
              <TextField
                label="Company Name*"
                name="compay_name"
                value={form.compay_name}
                handleChange={handleChange}
                placeholder="Google Inc"
                errors={errors}
                width="100%"
              />
            </Box>
            <Box>
              <TextField
                label="Catch Phrase*"
                name="catchPhrase"
                value={form.catchPhrase}
                handleChange={handleChange}
                placeholder="Proactive didactic contingency"
                errors={errors}
                width="100%"
              />
            </Box>
            <Box>
              <TextField
                label="Business Segment*"
                name="bs"
                value={form.bs}
                handleChange={handleChange}
                placeholder="revolutionize end-to-end systems"
                errors={errors}
                width="100%"
              />
            </Box>
          </Box>
        );
    }
  };

  return (
    <Modal open={open} aria-labelledby="modal-user-creation">
      <Component
        width={tablet ? "643px" : "95%"}
        padding="32px"
        maxHeight="95%"
      >
        <Box position="relative">
          <Box
            position="absolute"
            right="0"
            top="0"
            zIndex="1"
            style={{ cursor: "pointer" }}
            onClick={handleCancel}
          >
            <X size={24} />
          </Box>
        </Box>
        <Typography variant="h3" fontWeight={600} fontSize="32px">
          {`${status} User`}
        </Typography>
        <Typography variant="body2" marginBottom="5px">
          Input form below to make your request.
        </Typography>
        {status === "Edit" && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="end"
            gap="3px"
          >
            {listType.map((val, index) => (
              <Box
                key={`${index}-edit-item`}
                padding="3px 7px"
                borderRadius="7px"
                border={`1px solid ${Colors.darkBlue}`}
                bgcolor={index === currentIdx ? Colors.darkBlue : Colors.white}
                onClick={() => setCurrentIdx(index)}
                sx={{ cursor: "pointer" }}
              >
                <Typography
                  color={index === currentIdx ? Colors.white : Colors.darkBlue}
                >
                  {val}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          {handleWizard()}

          <Typography
            variant="body2"
            color={Colors.red100}
            marginBottom="8px"
            textAlign="center"
          >
            {error}
          </Typography>

          <Box
            display="flex"
            gap="13px"
            justifyContent="center"
            marginTop={laptop ? "33px" : "24px"}
          >
            <Button
              label={currentIdx && status !== "Edit" ? "Previous" : "Cancel"}
              padding={laptop ? "13px 32px" : "10px 24px"}
              borderradius="20px"
              fontSize={laptop ? "18px" : "14px"}
              onClick={
                currentIdx && status !== "Edit"
                  ? handleDecrementIdx
                  : handleCancel
              }
              buttontype="secondary"
            />
            <Button
              label={
                loading
                  ? "Loading..."
                  : currentIdx === 2 || status === "Edit"
                  ? "Submit"
                  : "Next"
              }
              padding={laptop ? "13px 32px" : "10px 24px"}
              borderradius="20px"
              fontSize={laptop ? "18px" : "14px"}
              disabled={loading}
              onClick={status === "Edit" ? () => {} : handleIncrementIdx}
              submit={currentIdx === 3 || status === "Edit"}
            />
          </Box>
        </form>
      </Component>
    </Modal>
  );
};

export default UserCreationModal;
