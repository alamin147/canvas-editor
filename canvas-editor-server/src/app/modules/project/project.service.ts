import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import Project from './project.model';
import mongoose from 'mongoose';


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
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const project = await Project.findOne({
    _id: projectId,
    $or: [
      { userId: userObjectId },
      { contributors: { $in: [userObjectId] } }
    ]
  });
  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
  }
  return project;
};

// Get all projects for a user
const getAllProjects = async (userId: string, query: Record<string, any>) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const result = await Project.find({
    $or: [
      { userId: userObjectId },
      { contributors: { $in: [userObjectId] } }
    ]
  }).populate('userId', 'name username');

  return {
    data: result,
  };
};

// Update a project
const updateProject = async (userId: string, projectId: string, payload: Record<string, any>) => {

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const project = await Project.findOne({
    _id: projectId,
    $or: [
      { userId: userObjectId },
      { contributors: { $in: [userObjectId] } }
    ]
  });

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, 'Project not found or you do not have permission to edit it');
  }

  const isOwner = project.userId.toString() === userId.toString();
  if (payload.contributors && !isOwner) {
    throw new AppError(httpStatus.FORBIDDEN, 'Only the project owner can modify contributors');
  }

  const result = await Project.findByIdAndUpdate(
    projectId,
    payload,
    { new: true }
  );

  return result;
};

// Delete a project
const deleteProject = async (userId: string, projectId: string) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const project = await Project.findOne({
    _id: projectId,
    userId: userObjectId
  });

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, 'Project not found or you do not have permission to delete it');
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
