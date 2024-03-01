import * as Yup from 'yup';

const informationValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .test('alphabets', 'Field must contain only letters', (value) => /^[A-Za-z ]+$/.test(value))
    .required('Please enter your first name'),
  middleName: Yup.string()
    .test('alphabets', 'Field must contain only letters', (value) => /^[A-Za-z ]+$/.test(value)),
  lastName: Yup.string()
    .test('alphabets', 'Field must contain only letters', (value) => /^[A-Za-z ]+$/.test(value))
    .required('Please enter your last name'),
  email: Yup.string()
    .required('Please enter your email')
    .email('Please enter valid email'),
  cellPhone: Yup.string()
    .required('Please enter your contact number')
    .matches(
      /^[+](1\s?)?((\(\d{3}\)))[\s-]?\d{3}[\s-]?\d{4}$|^(?=(?:\D*\d){10})\d+(?:!+\d+)*$/,
      'Please enter a valid phone number'
    ).nullable(),
});

const addressValidationSchema = Yup.object().shape({
  socialSecurity: Yup.string()
    .required('Please enter your social security')
    .matches(
      /^\d+-\d+-\d+$|\d{5}/,
      'Please enter valid social security number'
    ),
  dob: Yup.string().required('Please enter your date of birth'),
  homeZip: Yup.string()
    .max(5, 'Zip must be at most 5 characters')
    .min(5, 'Zip must be at least 5 characters')
    .required('Please enter your Zip'),
  address: Yup.string().required('Please enter your address'),
  city: Yup.string().required('Please enter your city'),
  state: Yup.string().required('Please enter your state'),
  address2: Yup.string(),
  travelTimeToAddressYears: Yup.number().min(1, 'Please enter the period in years'),
  travelTimeToAddressMonths: Yup.number().when('travelTimeToAddressYears', {
    is: value => Number(value) > 10,
    then: Yup.string(),
    otherwise: Yup.number().required('Please enter how long at address'),
  }),
  hoveManyDependents: Yup.number().required('Please enter how many dependents'),
  priorAddress: Yup.string().when('travelTimeToAddressYears', {
    is: value => +value >= 3,
    then: Yup.string(),
    otherwise: Yup.string().required('Please enter your prior address')
  }),
  priorCity: Yup.string().when('travelTimeToAddressYears', {
    is: value => +value >= 3,
    then: Yup.string(),
    otherwise: Yup.string().required('Please enter your prior city')
  }),
  priorState: Yup.string().when('travelTimeToAddressYears', {
    is: value => +value >= 3,
    then: Yup.string(),
    otherwise: Yup.string().required('Please enter your prior state')
  }),
  priorZip: Yup.string().when('travelTimeToAddressYears', {
    is: value => +value >= 3,
    then: Yup.string(),
    otherwise: Yup.string().required('Please enter your prior ZIP')
  }),
  travelTimeToPriorAddress: Yup.mixed(),
});

const retailAddressValidationSchema = Yup.object().shape({
  dob: Yup.string().required('Please enter your date of birth'),
  homeZip: Yup.string()
    .max(5, 'Zip must be at most 5 characters')
    .min(5, 'Zip must be at least 5 characters')
    .required('Please enter your Zip'),
  address: Yup.string().required('Please enter your address'),
  city: Yup.string().required('Please enter your city'),
  state: Yup.string().required('Please enter your state'),
  address2: Yup.string(),
});

const rentValidationSchema = Yup.object().shape({
  rentOrOwn: Yup.string().required('Please enter type'),
  amount: Yup.number()
    .typeError('Please enter only numbers')
    .required('Please enter amount'),
  registrationState: Yup.string().required('Please select state'),
});

const retailRentValidationSchema = Yup.object().shape({
  state: Yup.string().required('Please enter state'),
  transfer: Yup.string().required('Please enter your plans'),
  zip: Yup.string()
    .max(5, 'Zip must be at most 5 characters')
    .min(5, 'Zip must be at least 5 characters'),
});

export {
  informationValidationSchema,
  addressValidationSchema,
  rentValidationSchema,
  retailAddressValidationSchema,
  retailRentValidationSchema,
};
