import { Button } from "@/components/ui/button";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useGetAllProjectsQuery, useDeleteProjectMutation } from "@/redux/features/project/projectApi";
import Loader from "@/components/ui/Loader";
import { toast } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { formatDistanceToNow } from 'date-fns';

const Project = () => {
  const navigate = useNavigate();
  const { data: projectsData, isLoading, isError, refetch } = useGetAllProjectsQuery(undefined);
  const [deleteProject] = useDeleteProjectMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreateProject = () => {
    navigate("/create-project");
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project?")) {
      setDeletingId(id);

      try {
        await deleteProject(id).unwrap();
        toast.success("Project deleted successfully");
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project");
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 ">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Create projects</h1>
          <p className="text-gray-600 mt-1">
            Here's an overview of your canvas projects
          </p>
        </div>
        <div></div>
        <div></div>
        <div className="flex justify-end items-center">
          <Button
            onClick={handleCreateProject}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
            Create Project
          </Button>
        </div>
        <div></div>
      </div>
      {isLoading ? (
        <div className="py-12">
          <Loader size="lg" text="Loading projects..." />
        </div>
      ) : isError ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-red-500">Error loading projects. Please try again.</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-800">Projects</h2>
            <p className="text-gray-500 text-sm">Your canvas projects</p>
          </div>

          {projectsData?.data?.length === 0 ? (
            <div className="p-12 text-center border-t border-gray-200">
              <FiImage className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No projects yet. Create your first project!</p>
              <Button onClick={handleCreateProject} className="mt-4 bg-blue-500 hover:bg-blue-600">
                Create New Project
              </Button>
            </div>
          ) : (
            <div className="border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                {projectsData?.data?.map((project: any) => (
                  <div
                    key={project._id}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer relative"
                    onClick={() => navigate(`/editor/${project._id}`)}
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        className="p-2 text-gray-500 hover:text-red-500 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
                        onClick={(e) => handleDeleteProject(project._id, e)}
                        disabled={deletingId === project._id}
                      >
                        {deletingId === project._id ? (
                          <div className="h-4 w-4 border-2 border-t-transparent border-red-500 rounded-full animate-spin"></div>
                        ) : (
                          <FaTrash size={14} />
                        )}
                      </button>
                    </div>
                    <div className="h-32 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200 flex items-center justify-center mb-4">
                      <FiImage className="h-12 w-12 text-blue-500" />
                    </div>
                    <h3 className="font-medium text-gray-800">{project.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Last edited {formatDistanceToNow(new Date(project.lastEdited || project.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Project;
