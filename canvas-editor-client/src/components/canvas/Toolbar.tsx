import { useEffect, useState } from "react";
import * as fabric from "fabric";


interface ToolbarProps {
  canvas: fabric.Canvas | null;
}

const Toolbar = ({ canvas }: ToolbarProps) => {
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [fontSize, setFontSize] = useState(24);

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", () => {
        const activeObj = canvas.getActiveObject();
        if (activeObj) {
          setSelectedObject(activeObj);
        }
      });

      canvas.on("selection:updated", () => {
        const activeObj = canvas.getActiveObject();
        if (activeObj) {
          setSelectedObject(activeObj);
        }
      });

      canvas.on("selection:cleared", () => {
        setSelectedObject(null);
      });

      return () => {
        canvas.off("selection:created");
        canvas.off("selection:updated");
        canvas.off("selection:cleared");
      };
    }
  }, [canvas]);

  const addRectangle = () => {
    if (canvas) {
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: selectedColor,
        width: 100,
        height: 100,
        cornerColor: "#4F46E5",
        cornerStrokeColor: "#4F46E5",
        cornerStyle: "circle",
        transparentCorners: false,
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
      });
      canvas.add(rect);
      canvas.setActiveObject(rect);
      canvas.renderAll();
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circle = new fabric.Circle({
        left: 300,
        top: 100,
        fill: selectedColor,
        radius: 50,
        cornerColor: "#4F46E5",
        cornerStrokeColor: "#4F46E5",
        cornerStyle: "circle",
        transparentCorners: false,
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
      });
      canvas.add(circle);
      canvas.setActiveObject(circle);
      canvas.renderAll();
    }
  };

  const addTriangle = () => {
    if (canvas) {
      const triangle = new fabric.Triangle({
        left: 150,
        top: 150,
        fill: selectedColor,
        width: 100,
        height: 100,
        cornerColor: "#4F46E5",
        cornerStrokeColor: "#4F46E5",
        cornerStyle: "circle",
        transparentCorners: false,
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
      });
      canvas.add(triangle);
      canvas.setActiveObject(triangle);
      canvas.renderAll();
    }
  };

  const addLine = () => {
    if (canvas) {
      const line = new fabric.Line([50, 50, 200, 200], {
        stroke: selectedColor,
        strokeWidth: 3,
        cornerColor: "#4F46E5",
        cornerStrokeColor: "#4F46E5",
        cornerStyle: "circle",
        transparentCorners: false,
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
      });
      canvas.add(line);
      canvas.setActiveObject(line);
      canvas.renderAll();
    }
  };

  const addText = () => {
    if (canvas) {
      const text = new fabric.IText("Edit this text", {
        left: 200,
        top: 200,
        fontFamily: "Arial",
        fontSize: fontSize,
        fill: selectedColor,
        cornerColor: "#4F46E5",
        cornerStrokeColor: "#4F46E5",
        cornerStyle: "circle",
        transparentCorners: false,
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        editable: true, 
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    }
  };

  const removeSelected = () => {
    if (canvas && selectedObject) {
      canvas.remove(selectedObject);
      setSelectedObject(null);
      canvas.renderAll();
    }
  };

  const changeColor = () => {
    if (canvas && selectedObject) {
      selectedObject.set("fill", selectedColor);
      canvas.renderAll();
    }
  };

  const changeFontSize = () => {
    if (canvas && selectedObject && selectedObject.type === "text") {
      (selectedObject as fabric.Text).set("fontSize", fontSize);
      canvas.renderAll();
    }
  };

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = "#ffffff";
      canvas.renderAll();
    }
  };

  return (
    <div className="flex flex-wrap justify-between mb-4 bg-gray-100 p-4 rounded-lg">
      <div className="flex flex-wrap space-x-2 mb-2">
        <button
          className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 mb-2"
          onClick={addRectangle}
        >
          Rectangle
        </button>
        <button
          className="px-3 py-2 bg-pink-600 text-white rounded text-sm hover:bg-pink-700 mb-2"
          onClick={addCircle}
        >
          Circle
        </button>
        <button
          className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 mb-2"
          onClick={addTriangle}
        >
          Triangle
        </button>
        <button
          className="px-3 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 mb-2"
          onClick={addLine}
        >
          Line
        </button>
        <button
          className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 mb-2"
          onClick={addText}
        >
          Text
        </button>
      </div>

      <div className="flex space-x-2 mb-2">
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="h-10 w-10 rounded cursor-pointer"
        />
        <button
          className="px-3 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
          disabled={!selectedObject}
          onClick={changeColor}
        >
          Apply Color
        </button>

        {selectedObject?.type === "text" && (
          <>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="h-10 w-20 rounded border border-gray-300 px-2"
              min={8}
              max={72}
            />
            <button
              className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
              onClick={changeFontSize}
            >
              Font Size
            </button>
          </>
        )}

        <button
          className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
          disabled={!selectedObject}
          onClick={removeSelected}
        >
          Delete
        </button>
      </div>

      <div className="flex space-x-2">
        <button
          className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          onClick={clearCanvas}
        >
          Clear All
        </button>
        <button
          className="px-3 py-2 bg-teal-600 text-white rounded text-sm hover:bg-teal-700"
          onClick={() => {
            if (canvas) {
              const dataURL = canvas.toDataURL({
                format: 'png',
                quality: 1.0,
                multiplier: 1
              });

              const link = document.createElement('a');
              link.download = 'canvas-design.png';
              link.href = dataURL;

              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}
        >
          Download as PNG
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
