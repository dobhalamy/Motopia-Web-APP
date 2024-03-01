import * as Yup from 'yup';

export default Yup.object().shape({
  zone: Yup.string().optional(),
  state: Yup.string()
    .required('Please select state'),
  plates: Yup.string()
    .required('Please select plates')
});
