import { isEmail } from 'validator';

export const validateRegistration = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}) => {
  const errors: { [key: string]: string } = {};

  if (!data.firstName) {
    errors.firstName = 'First Name is required';
  }

  if (!data.lastName) {
    errors.lastName = 'Last Name is required';
  }

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (!data.phone) {
    errors.phone = 'Phone Number is required';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};