import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import Project from './project.model';
import mongoose from 'mongoose';

// Create a new project
const createProject = async (userId: string, payload: Record<string, any>) => {
  const result = await Project.create({
    ...payload,
    userId,
  });
  return result;
};

// Get a specific project by id
const getProjectById = async (userId: string, projectId: string) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const project = await Project.findOne({
    _id: projectId,
    $or: [{ userId: userObjectId }, { contributors: { $in: [userObjectId] } }],
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
    $or: [{ userId: userObjectId }, { contributors: { $in: [userObjectId] } }],
  }).populate('userId', 'name username');

  return {
    data: result,
  };
};

// Update a project
const updateProject = async (
  userId: string,
  projectId: string,
  payload: Record<string, any>,
) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const project = await Project.findOne({
    _id: projectId,
    $or: [{ userId: userObjectId }, { contributors: { $in: [userObjectId] } }],
  });

  if (!project) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Project not found or you do not have permission to edit it',
    );
  }

  const isOwner = project.userId.toString() === userId.toString();
  if (payload.contributors && !isOwner) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Only the project owner can modify contributors',
    );
  }

  const result = await Project.findByIdAndUpdate(projectId, payload, {
    new: true,
  });

  return result;
};

// Delete a project
const deleteProject = async (userId: string, projectId: string) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const project = await Project.findOne({
    _id: projectId,
    userId: userObjectId,
  });

  if (!project) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Project not found or you do not have permission to delete it',
    );
  }

  const result = await Project.findByIdAndDelete(projectId);

  return result;
};

// Add a contributor to a project
const addContributor = async (
  userId: string,
  projectId: string,
  contributorEmail: string,
) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const project = await Project.findOne({
    _id: projectId,
    userId: userObjectId,
  });

  if (!project) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Project not found or you are not the owner',
    );
  }

  const User = mongoose.model('User');
  const contributor = await User.findOne({ email: contributorEmail });

  if (!contributor) {
    throw new AppError(httpStatus.NOT_FOUND, 'User with this email not found');
  }

  if (
    project.contributors &&
    project.contributors.some((id) => id.equals(contributor._id))
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User is already a contributor to this project',
    );
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { $push: { contributors: contributor._id } },
    { new: true },
  ).populate('contributors', 'name email username');

  return updatedProject;
};

// Remove a contributor from a project
const removeContributor = async (
  userId: string,
  projectId: string,
  contributorId: string,
) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const project = await Project.findOne({
    _id: projectId,
    userId: userObjectId,
  });

  if (!project) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Project not found or you are not the owner',
    );
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { $pull: { contributors: contributorId } },
    { new: true },
  ).populate('contributors', 'name email username');

  return updatedProject;
};

// Get all contributors for a project
const getContributors = async (userId: string, projectId: string) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const project = await Project.findOne({
    _id: projectId,
    $or: [{ userId: userObjectId }, { contributors: { $in: [userObjectId] } }],
  }).populate('contributors', 'name email username');

  if (!project) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Project not found or you do not have access',
    );
  }
  return project.contributors || [];
};

export const ProjectServices = {
  createProject,
  getProjectById,
  getAllProjects,
  updateProject,
  deleteProject,
  addContributor,
  removeContributor,
  getContributors,
};
