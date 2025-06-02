import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const getMe = catchAsync(async (req, res) => {
  const result = await UserServices.getMe(req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieve succesfully!',
    data: result,
  });
});

export const UserControllers = {
 getMe
};
