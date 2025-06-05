import { Button } from "@/components/ui/button";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Project = () => {
  const navigate = useNavigate();

  const handleCreateProject = () => {
    navigate("/create-project");
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-800">Projects</h2>
          <p className="text-gray-500 text-sm">Your canvas projects</p>
        </div>

        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/editor/${i}`)}
              >
                <div className="h-32 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200 flex items-center justify-center mb-4">
                  <FiImage className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="font-medium text-gray-800">Project {i}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Last edited {i} day{i !== 1 ? "s" : ""} ago
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
