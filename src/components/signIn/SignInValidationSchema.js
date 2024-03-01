import * as Yup from 'yup';

export default Yup.object().shape({
  contactNumber: Yup.string()
    .required('Please enter your contact number')
    .matches(
      /^[+](1\s?)?((\(\d{3}\)))[\s-]?\d{3}[\s-]?\d{4}$|^(?=(?:\D*\d){10})\d+(?:!+\d+)*$/,
      'Please enter a valid phone number'
    ),
  password: Yup.string().required('Please enter your password'),
});
