import * as Yup from 'yup';

export const simpleRegistration = Yup.object().shape({
  firstName: Yup.string()
    .test('alphabets', 'Field must contain only letters', (value) => /^[A-Za-z]+$/.test(value))
    .required('Please enter your name'),
  lastName: Yup.string()
    .test('alphabets', 'Field must contain only letters', (value) => /^[A-Za-z]+$/.test(value))
    .required('Please enter your last name'),
  email: Yup.string()
    .required('Please enter your email')
    .email('Invalid email'),
  phone: Yup.string()
    .required('Please enter your contact number')
    .matches(
      /^[+](1\s?)?((\(\d{3}\)))[\s-]?\d{3}[\s-]?\d{4}$|^(?=(?:\D*\d){10})\d+(?:!+\d+)*$/,
      'Please enter a valid phone number'
    ),
  // NOTE: we temporary hide this field
  // zip: Yup.string().required('Please enter zip code'),
  password: Yup.string()
    .required('Please enter your password')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*)(+=._-]{8,20}$/,
      'Password should contain at least 1 uppercase and 1 lowercase letter'
    ),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref('password'), null],
    // eslint-disable-next-line quotes
    "Passwords doesn't match"
  ),
});

export const googleValidation = Yup.object().shape({
  firstName: Yup.string()
    .test('alphabets', 'Field must contain only letters', (value) => /^[A-Za-z]+$/.test(value))
    .required('Please enter your name'),
  lastName: Yup.string()
    .test('alphabets', 'Field must contain only letters', (value) => /^[A-Za-z]+$/.test(value))
    .required('Please enter your last name'),
  email: Yup.string()
    .required('Please enter your email')
    .email('Invalid email'),
  phone: Yup.string()
    .required('Please enter your contact number')
    .matches(
      /^[+](1\s?)?((\(\d{3}\)))[\s-]?\d{3}[\s-]?\d{4}$|^(?=(?:\D*\d){10})\d+(?:!+\d+)*$/,
      'Please enter a valid phone number'
    ),
});
