import * as Yup from 'yup';

const contactUsValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('Please enter your name'),
  lastName: Yup.string().required('Please enter your name'),
  phone: Yup.string()
    .required('Please enter your contact number')
    .matches(
      /^[+](1\s?)?((\(\d{3}\)))[\s-]?\d{3}[\s-]?\d{4}$|^(?=(?:\D*\d){10})\d+(?:!+\d+)*$/,
      'Please enter a valid phone number'
    ),
  email: Yup.string()
    .required('This field is required')
    .email('Invalid email'),
  bestTimeToContact: Yup.string().required('Please enter your name'),
  timeZone: Yup.string().required('Please enter your name'),
  comments: Yup.string().required('Please enter your name'),
});

export default contactUsValidationSchema;
