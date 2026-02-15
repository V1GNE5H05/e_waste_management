const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
const mobileRegex = /^\d{10}$/;
const pincodeRegex = /^\d{6}$/;

export const passwordRequirements =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";

export function validateEmail(email) {
  if (!email) return "Email is required.";
  if (!emailRegex.test(email)) return "Enter a valid email address.";
  return "";
}

export function validatePassword(password) {
  if (!password) return "Password is required.";
  if (!passwordRegex.test(password)) return passwordRequirements;
  return "";
}

export function validateMobile(mobile) {
  if (!mobile) return "";
  if (!mobileRegex.test(mobile)) return "Mobile number must be exactly 10 digits.";
  return "";
}

export function validatePincode(pincode) {
  if (!pincode) return "";
  if (!pincodeRegex.test(pincode)) return "Pincode must be exactly 6 digits.";
  return "";
}
