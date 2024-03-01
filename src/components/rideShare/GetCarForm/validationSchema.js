import * as Yup from 'yup';

const informationValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .test('alphabets', 'Field must contain only letters', value =>
      /^[A-Za-z]+$/.test(value)
    )
    .required('Please enter your first name'),
  middleName: Yup.string().test(
    'alphabets',
    'Field must contain only letters',
    value => /^[A-Za-z]+$/.test(value)
  ),
  lastName: Yup.string()
    .test('alphabets', 'Field must contain only letters', value =>
      /^[A-Za-z]+$/.test(value)
    )
    .required('Please enter your last name'),
  email: Yup.string()
    .required('Please enter your email')
    .email('Please enter valid email'),
  cellPhone: Yup.string()
    .required('Please enter your contact number')
    .matches(
      /^[+](1\s?)?((\(\d{3}\)))[\s-]?\d{3}[\s-]?\d{4}$|^(?=(?:\D*\d){10})\d+(?:!+\d+)*$/,
      'Please enter a valid phone number'
    )
    .nullable(),
});

const rdsValidationSchema = Yup.object().shape({
  dateOfBirth: Yup.string().required('Please enter your date of birth'),
  licenseState: Yup.string().required('Please enter license state'),
  licenseNumber: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, 'Number can contain only letters and numbers')
    .required('Please enter license number'),
  rdsCompany: Yup.string(),
  socialSecurity: Yup.string()
    .matches(/^\d+-\d+-\d+$|\d{9}/, 'Please enter 9 digits value only')
    .required('Please enter social security number'),
  jobsAmount: Yup.number()
    .required('Enter total # of completed rideshare rides')
    .typeError('Enter total # of completed rideshare rides'),
});

const rdsAddressValidationSchema = Yup.object().shape({
  address: Yup.string().required('Please enter address'),
  homeZip: Yup.string()
    .max(5, 'Maximum 5 digits allowd')
    .required('Please enter home zip'),
  city: Yup.string().required('Please enter city'),
  state: Yup.string().required('Please enter state'),
});

export {
  informationValidationSchema,
  rdsValidationSchema,
  rdsAddressValidationSchema,
};
