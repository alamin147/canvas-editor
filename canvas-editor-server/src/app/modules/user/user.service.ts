import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import User from '../Auth/User.model';

const getMe = async (userId: string) => {

  const users = await User.find({ _id: userId }).lean();
  const user = users[0];
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found !');
  }
  return user;
};
export const UserServices = {
  getMe,
};
