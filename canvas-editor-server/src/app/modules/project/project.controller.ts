import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProjectServices } from './project.service';

const createProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectServices.createProject(req.user.userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Project created successfully',
    data: result,
  });
});

const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const result = await ProjectServices.getProjectById(req.user.userId, projectId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project retrieved successfully',
    data: result,
  });
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectServices.getAllProjects(req.user.userId, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Projects retrieved successfully',
    data: result.data,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {

  const { projectId } = req.params;
  const result = await ProjectServices.updateProject(req.user.userId, projectId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project updated successfully',
    data: result,
  });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const result = await ProjectServices.deleteProject(req.user.userId, projectId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project deleted successfully',
    data: result,
  });
});

export const ProjectControllers = {
  createProject,
  getProjectById,
  getAllProjects,
  updateProject,
  deleteProject,
};
