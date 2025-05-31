import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const signUpUser = catchAsync(async (req, res) => {
  const { ...userData } = req.body;
  const result = await AuthServices.signUpUser(userData);
  res.cookie('token', result.accessToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User is created succesfully!',
    data: {
      accessToken: result.accessToken,
    },
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { accessToken } = result;

  res.cookie('token', accessToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in succesfully!',
    data: {
      accessToken,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {

const {oldPassword, newPassword}=req.body;
const result = await AuthServices.changePassword(req.user, oldPassword, newPassword);
const { accessToken } = result;

  res.cookie('token', accessToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated succesfully!',
    data: result,
  });
});


export const AuthControllers = {
  loginUser,
  signUpUser,
  changePassword,
};
