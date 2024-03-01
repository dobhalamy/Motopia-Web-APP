import * as Yup from 'yup';

const stockVerificationValidationSchema = Yup.object().shape({
  stockId: Yup.number().typeError('Please enter only numbers'),
  vin: Yup.string(),
  homeZip: Yup.string()
    .max(5, 'Zip must be at most 5 characters')
    .min(5, 'Zip must be at least 5 characters'),
  address: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
});

export default stockVerificationValidationSchema;
