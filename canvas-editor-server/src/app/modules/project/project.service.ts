import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import Project from './project.model';


// Create a new project
const createProject = async (userId: string, payload: Record<string, any>) => {
  const result = await Project.create({
    ...payload,
    userId
  });
  return result;
};

// Get a specific project by id
const getProjectById = async (userId: string, projectId: string) => {
  const project = await Project.findOne({
    _id: projectId,
    userId
  });

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
  }

  return project;
};

// Get all projects for a user
const getAllProjects = async (userId: string, query: Record<string, any>) => {
  const result =await Project.find({ userId })

  return {
    data: result,
  };
};

// Update a project
const updateProject = async (userId: string, projectId: string, payload: Record<string, any>) => {
  const project = await Project.findOne({
    _id: projectId,
    userId
  });

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
  }

  // Update lastEdited timestamp
  payload.lastEdited = new Date();

  const result = await Project.findByIdAndUpdate(
    projectId,
    payload,
    { new: true }
  );

  return result;
};

// Delete a project
const deleteProject = async (userId: string, projectId: string) => {
  const project = await Project.findOne({
    _id: projectId,
    userId
  });

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
  }

  const result = await Project.findByIdAndDelete(projectId);

  return result;
};

export const ProjectServices = {
  createProject,
  getProjectById,
  getAllProjects,
  updateProject,
  deleteProject,
};
