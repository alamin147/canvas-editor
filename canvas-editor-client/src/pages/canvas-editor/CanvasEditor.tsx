import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Canvas from "@/components/canvas/Canvas";

const CanvasEditor = () => {
  const { id } = useParams<{ id: string }>();
  const [projectName, setProjectName] = useState("My Canvas Project");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  useEffect(() => {
    if (id) {
      const savedProject = localStorage.getItem(`canvas_project_${id}`);
      if (savedProject) {
        try {
          const projectData = JSON.parse(savedProject);
          if (projectData.name) {
            setProjectName(projectData.name);
          }
        } catch (error) {
          console.error('Failed to load project name:', error);
        }
      }
    }
  }, [id]);

  const handleSave = (canvasData: any) => {

    console.log("Canvas Data:", canvasData);
    localStorage.setItem(`canvas_project_${id || 'new'}`, JSON.stringify({
      name: projectName,
      data: canvasData,
      updatedAt: new Date().toISOString()
    }));

    alert("Project saved successfully!");
    setIsSaving(false);
    setHasChanges(false);
  };

  const saveProject = () => {
    setIsSaving(true);

    if (canvasRef.current && canvasRef.current.getCanvasJSON) {
      canvasRef.current.getCanvasJSON();
    } else {
      setIsSaving(false);
      alert("Canvas not ready. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-3xl font-bold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
          />
          <p className="text-gray-600 mt-1">
            Use the toolbar to add elements to your canvas
          </p>
        </div>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          onClick={saveProject}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Project"}
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <Canvas
          projectId={id || "new"}
          onSave={handleSave}
          onCanvasChange={setHasChanges}
          ref={canvasRef}
        />
      </div>
    </div>
  );
};

export default CanvasEditor;
