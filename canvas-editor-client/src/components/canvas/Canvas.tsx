import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from "react";
import * as  fabric  from "fabric";
import Toolbar from "./Toolbar";
import { useCallback } from "react";

interface CanvasProps {
  projectId: string;
  onSave?: (canvasData: any) => void;
  onCanvasChange?: (hasChanges: boolean) => void;
}

export interface CanvasRef {
  getCanvasJSON: () => any;
  loadCanvasFromJSON: (json: any) => void;
}

const Canvas = forwardRef<CanvasRef, CanvasProps>(({ projectId, onSave, onCanvasChange }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });


  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
        selection: true,
        selectionBorderColor: '#2563eb',
        selectionLineWidth: 1,
        interactive: true,
        isDrawingMode: false,
      });


      fabric.Object.prototype.set({
        cornerColor: "#4F46E5",
        cornerStrokeColor: "#4F46E5",
        cornerStyle: "circle",
        transparentCorners: false,
        borderColor: '#4F46E5',
        cornerSize: 10,
      });


      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.key === 'Delete' || e.key === 'Backspace') && fabricCanvas.getActiveObject()) {
          const activeObject = fabricCanvas.getActiveObject();
          if (activeObject) {
            fabricCanvas.remove(activeObject);
            fabricCanvas.discardActiveObject();
            fabricCanvas.renderAll();
            if (onCanvasChange) onCanvasChange(true);
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);


      fabricCanvas.on('object:added', () => {
        console.log('Object added');
        if (onCanvasChange) onCanvasChange(true);
      });

      fabricCanvas.on('object:modified', () => {
        console.log('Object modified');
        if (onCanvasChange) onCanvasChange(true);
      });

      fabricCanvas.on('object:removed', () => {
        console.log('Object removed');
        if (onCanvasChange) onCanvasChange(true);
      });


      fabricCanvas.on('mouse:down', (options) => {
        if (options.target) {
          fabricCanvas.setActiveObject(options.target);
          console.log('Object selected:', options.target);


          if (options.e && options.target.type === 'i-text') {
            const evt = options.e as MouseEvent;
            if (evt.detail === 2) {
              (options.target as fabric.IText).enterEditing();
              console.log('Editing text');
              fabricCanvas.renderAll();
            }
          }

          fabricCanvas.renderAll();
        }
      });


      fabricCanvas.on('object:moving', () => {
        console.log('Object moving');
        fabricCanvas.renderAll();
        if (onCanvasChange) onCanvasChange(true);
      });


      fabricCanvas.on('object:scaling', () => {
        console.log('Object scaling');
        fabricCanvas.renderAll();
        if (onCanvasChange) onCanvasChange(true);
      });


      fabricCanvas.on('object:rotating', () => {
        console.log('Object rotating');
        fabricCanvas.renderAll();
        if (onCanvasChange) onCanvasChange(true);
      });


      setCanvas(fabricCanvas);


      if (projectId !== 'new') {
        
        const savedProject = localStorage.getItem(`canvas_project_${projectId}`);

        if (savedProject) {
          try {
            const projectData = JSON.parse(savedProject);
            if (projectData.data) {
              fabricCanvas.loadFromJSON(projectData.data, fabricCanvas.renderAll.bind(fabricCanvas));
              console.log(`Project ${projectId} loaded from localStorage`);
            }
          } catch (error) {
            console.error('Failed to load project data:', error);
          }
        } else {
          
          console.log(`No saved data found for project ${projectId}`);
        }
      }

      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        fabricCanvas.dispose();
      };
    }
  }, [canvasRef, canvas, canvasSize, projectId, onCanvasChange]);

  
  const getCanvasJSON = useCallback(() => {
    if (canvas) {
      const jsonData = canvas.toJSON();
      if (onSave) {
        onSave(jsonData);
      }
      return jsonData;
    }
    return null;
  }, [canvas, onSave]);

  
  const loadCanvasFromJSON = useCallback((json: any) => {
    if (canvas) {
      canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));
    }
  }, [canvas]);

  
  useImperativeHandle(ref, () => ({
    getCanvasJSON,
    loadCanvasFromJSON
  }));

  return (
    <div className="space-y-4">
      <Toolbar canvas={canvas} />
      <div className="border border-gray-300 rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-100 p-2 flex justify-between items-center text-sm">
          <div>
            Canvas Size: {canvasSize.width} x {canvasSize.height}
          </div>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            onChange={(e) => {
              const [width, height] = e.target.value.split("x").map(Number);
              if (canvas) {
                canvas.setWidth(width);
                canvas.setHeight(height);
                setCanvasSize({ width, height });
              }
            }}
          >
            <option value="800x600">800 x 600</option>
            <option value="1024x768">1024 x 768</option>
            <option value="1280x720">1280 x 720 (720p)</option>
            <option value="1920x1080">1920 x 1080 (1080p)</option>
          </select>
        </div>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
});

export default Canvas;
