import * as Yup from 'yup';

export default Yup.object().shape({
  password: Yup.string()
    .required('This field is required')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*)(+=._-]{8,20}$/,
      'Password should contain at least 1 uppercase and 1 lowercase letter'
    ),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords doesn\'t match'
  ),
  email: Yup.string()
    .required('Please enter your email')
    .email(),
});
