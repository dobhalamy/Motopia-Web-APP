import * as Yup from 'yup';

const stepOneValidationSchema = Yup.object().shape({
  incidentDate: Yup.string()
    .required('Please enter incident date')
    .nullable(),
  incidentTime: Yup.string()
    .required('Please enter incident time')
    .nullable(),
  policeReport: Yup.string().required('Please select an option'),
  incidentIntersection: Yup.string().required(
    'Please enter incident intersection'
  ),
  incidentHappened: Yup.string().required('Please enter how incudent happened'),
  fault: Yup.string().required('Please select an option'),
});

const stepTwoValidationSchema = Yup.object().shape({
  doingRideShareJob: Yup.string().required('Please select an option'),
  vehiclesInvolved: Yup.string().required(
    'Please enter number of vehicles involved'
  ),
  numberInjured: Yup.string().required('Please enter number of injured'),
  rideSharePlatform: Yup.string().required(
    'Please enter the ride share platform'
  ),
});

export { stepOneValidationSchema, stepTwoValidationSchema };
