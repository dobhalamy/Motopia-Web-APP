import * as Yup from 'yup';

export default Yup.object().shape({
  firstName: Yup.string()
    .test('alphabets', 'Field must contain only letters', (value) => /^[A-Za-z]+$/.test(value))
    .required('Please enter your first name'),
  lastName: Yup.string()
    .test('alphabets', 'Field must contain only letters', (value) => /^[A-Za-z]+$/.test(value))
    .required('Please enter your last name'),
  email: Yup.string()
    .required('Please enter your email')
    .email('Please enter valid email'),
  cellPhone: Yup.string()
    .required('Please enter your contact number')
    .matches(
      /^[+](1\s?)?((\(\d{3}\)))[\s-]?\d{3}[\s-]?\d{4}$|^(?=(?:\D*\d){10})\d+(?:!+\d+)*$/,
      'Please enter a valid phone number'
    ),
});
