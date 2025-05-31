import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import User from '../modules/Auth/User.model';
type TUserRole = 'user' | 'admin';

const auth = (...requiredRoles: TUserRole[]) => {

  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, userId } = decoded;

const users = await User.find({
    _id: userId,
  }).lean();

    const user = users[0];

  if (!users) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

    // checking if the user is blocked
    const userStatus = user?.status;

    if (userStatus === 'inactive') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is inactive ! !');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized  hi!',
      );
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
