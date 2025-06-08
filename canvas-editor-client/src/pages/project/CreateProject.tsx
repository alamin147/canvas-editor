import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateProjectMutation } from "@/redux/features/project/projectApi";
import { toast } from "react-hot-toast";

const CreateProject = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [createProject] = useCreateProjectMutation();

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;

    setIsCreating(true);

    try {
    
      const payload = {
        title: projectName,
        canvasData: JSON.stringify([]),
        backgroundColor: "#f8f9fa",
        width: 1400,
        height: 600
      };

      const response = await createProject(payload).unwrap();

      toast.success("Project created successfully!");
      navigate(`/editor/${response.data._id}`);
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Project</h1>

      <div className="space-y-4">
        <div>
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="My Awesome Canvas Project"
            className="mt-1"
          />
        </div>

        <div className="pt-4">
          <Button
            onClick={handleCreateProject}
            disabled={isCreating || !projectName.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
          >
            {isCreating ? "Creating..." : "Create & Open Editor"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
