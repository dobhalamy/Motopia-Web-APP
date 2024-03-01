/* eslint-disable func-names */
/* eslint-disable indent */
import * as Yup from 'yup';
import { formatNumber } from 'utils/formatNumbersToLocale';

const validationSchema = Yup.object().shape({
  employerName: Yup.string()
  .test('alphabets', 'Field must contain only letters', (value) => /^[A-Za-z\s]+$/.test(value))
  .required('Please enter your name'),
  // employerAddress: Yup.string().required('Please enter address'),
  employerCity: Yup.string().required('Please enter city'),
  // employerState: Yup.string().required('Please enter state'),
  employerPosition: Yup.string().required('Please enter position'),
  // manager: Yup.string().required('Please enter manager'),
  totalMonthlyDebt: Yup.number(),

  // employerZip: Yup.string()
  //   .required('Please enter your home zip')
  //   .min(5, 'Zip must be at least 5 characters')
  //   .max(5, 'Zip must be at most 5 characters'),
  employerPhone: Yup.string()
    .required('Please enter your cell phone')
    .matches(
      /^[+](1\s?)?((\(\d{3}\)))[\s-]?\d{3}[\s-]?\d{4}$|^(?=(?:\D*\d){10})\d+(?:!+\d+)*$/,
      'Please enter valid phone XXX-XXX-XXXX'),
  annualIncome: Yup.number()
    .typeError('Please enter only numbers')
    .required('Please enter annual income')
    .test({
      name: 'test',
      // eslint-disable-next-line object-shorthand
      test: function(value) {
        const { totalMonthlyDebt } = this.parent;
        return value < totalMonthlyDebt * 24
          ? this.createError({
              message: `Recommended annual income: $ ${formatNumber(totalMonthlyDebt * 24)}`,
              path: 'annualIncome',
            })
          : true;
      },
    }),
});

export default validationSchema;
