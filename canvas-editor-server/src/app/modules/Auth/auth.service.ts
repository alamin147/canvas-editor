import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken, isPasswordMatched } from './auth.utils';
import User from './User.model';
interface SignUpUserData {
    username: string;
    password: string;
    role: string;
    status?: 'active' | 'inactive';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

const signUpUser = async (userData: SignUpUserData) => {
    // checking if the user is exist
    const users = await User.find({_id: userData?.userId })
      .select('+password')
      .lean();
  const user = users[0];
  if (user) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This user is already exist !',
    );
  }
  //hash password
  const hashedPassword = await bcrypt.hash(
    userData?.password,
    Number(config.bcrypt_salt_rounds),
  );
  //create user
  const newUser = await User.create({
    ...userData,
    password: hashedPassword,
  });
  //create token and sent to the  client
  const jwtPayload = {
    userId: newUser._id,
    role: newUser.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  return {
    accessToken,
  };
};

const loginUser = async (payload:{ username: string; password: string } ) => {
  // checking if the user is exist
  const users = await User.find({
    username: payload?.username,
  })
    .select('+password')
    .lean();

  const user = users[0];

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'inactive') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is inactive ! !');
  }
  //checking if the password is correct
  if (!(await isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  //create token and sent to the  client

  const jwtPayload = {
    userId: user._id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const changePassword = async (
  userData: JwtPayload, oldPassword: string, newPassword: string ,
) => {
  // checking if the user is exist
  const users = await User.find({
    _id: userData?.userId,
  })
    .select('+password')
    .lean();

  const user = users[0];
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  const userStatus = user?.status;

  if (userStatus === 'inactive') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is inactive !');
  }

  //checking if the password is correc
  if (!(await isPasswordMatched(oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  //hash new password
  const newHashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      _id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
    },
  );

  const jwtPayload = {
    userId: user._id,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };

};

export const AuthServices = {
  signUpUser,
  loginUser,
  changePassword,
};
