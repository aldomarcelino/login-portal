export interface UserProps {
  name: string;
  username: string;
  email: string;
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  lat: string;
  lng: string;
  phone: string;
  compay_name: string;
  catchPhrase: string;
  website: string;
  bs: string;
  [key: string]: string;
}

export function userValidation(values: UserProps) {
  let errors: UserProps = {
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

  if (!values.name) {
    errors["name"] = "Full name is required.";
  }
  if (!values.username) {
    errors["username"] = "Username is required.";
  }
  if (!values.email) {
    errors["email"] = "Email is required.";
  }
  if (!values.street) {
    errors["street"] = "Street is required.";
  }
  if (!values.suite) {
    errors["suite"] = "Suite is required.";
  }
  if (!values.city) {
    errors["city"] = "City is required.";
  }
  if (!values.zipcode) {
    errors["zipcode"] = "Zipcode is required.";
  }
  if (!values.lat) {
    errors["lat"] = "Latitude is required.";
  }
  if (!values.lng) {
    errors["lng"] = "Longitude is required.";
  }
  if (!values.phone) {
    errors["phone"] = "Phone number is required.";
  }
  if (!values.compay_name) {
    errors["compay_name"] = "Companey name is required.";
  }
  if (!values.catchPhrase) {
    errors["catchPhrase"] = "Catch phrase is required.";
  }
  if (!values.bs) {
    errors["bs"] = "Bussines segment is required.";
  }

  return errors;
}
