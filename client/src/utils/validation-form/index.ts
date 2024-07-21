export const password = (value: string) =>
  value &&
  !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*,.?]).{8,34}$/.test(
    value
  )
    ? "Password must contain min 8 characters, lowercase and uppercase letters, numbers and symbols"
    : "";

export const phoneNumber = (value: string) =>
  value && !/^[1-9][0-9]*$/i.test(value)
    ? "Enter a valid format phone number (without 0)"
    : "";
