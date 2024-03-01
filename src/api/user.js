import API from './API_Base';
import unifyHandler from './unifyHandler';

export const SignUp = params =>
  unifyHandler(API.post('/Account/SignUp', { ...params }));

export const Update = params =>
  unifyHandler(API.post('/Account/ChangeAccountDetails', { ...params }));

export const Login = params =>
  unifyHandler(API.post('/Account/Login', { ...params }));

export const GoogleSignUp = params =>
  unifyHandler(API.post('/Account/GoogleSignUp', { ...params }));

export const GoogleSignIn = query =>
  unifyHandler(API.get(`/Account/GoogleSignIn?googleId=${query}`));

export const VerifyPhoneNumber = phone =>
  unifyHandler(
    API.post('/Account/VerifyPhoneNumber', null, {
      params: { contactNumber: phone },
    })
  );

export const GenerateOtp = phone =>
  unifyHandler(
    API.post('/Account/GenerateOtp', null, { params: { contactNumber: phone } })
  );

export const ResetPassword = (otp, newPassword) =>
  unifyHandler(
    API.post('/Account/ResetPassword', null, {
      params: { OTP: otp, newPassword },
    })
  );

export const ChangePassword = params =>
  unifyHandler(API.post('/Account/ChangePassword', null, { params }));

export const ChangeAccountDetails = params =>
  unifyHandler(API.post('/Account/ChangeAccountDetails', { ...params }));

export const GetAccountDetails = () =>
  unifyHandler(API.get('/Account/GetAccountDetails'));
