import { Canvas,Circle,Rect,  } from 'fabric';
import { useState, useRef, useEffect  } from "react";


const CanvasEditor = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas]: any = useState();

    useEffect(() => {
        if (canvasRef.current) {
            const initCanvas = new Canvas(canvasRef.current, {
                width: 500,
                height: 500,
            });

            initCanvas.backgroundColor= "#f8f9fa",
            initCanvas.renderAll();
            setCanvas(initCanvas);

            return () => {
                initCanvas.dispose();
            };
        }
    }, []);


    const addRectangle = () => {
        if (canvas) {
            const rect = new Rect({
                left: 100,
                top: 100,
                width: 100,
                height: 80,
                fill: "#3498db",
                stroke: "#2980b9",
            });
            canvas.add(rect);
            canvas.setActiveObject(rect);
            canvas.renderAll();
            console.log("Rectangle added:", rect);
        }
    };
    const addCircle = () => {
    if (canvas) {
        const circ = new Circle({
            left: 100,
            top: 100,
            radius: 50,  // circles use radius instead of width/height
            fill: "#e74c3c",
            stroke: "#c0392b",
        });
        canvas.add(circ);
        canvas.setActiveObject(circ);
        canvas.renderAll();
        console.log("Circle added:", circ);
    }
};
    return (
        <>
            <div className="flex flex-col justify-center items-center w-full h-screen gap-4">
                <div className="mb-4 flex gap-4">
                    <button
                        onClick={addRectangle}
                        className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
                    >
                        Add Rectangle
                    </button>
                    <button
                        onClick={addCircle}
                        className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
                    >
                        Add Circle
                    </button>
                </div>
                <div className="canvas-container">
                    <canvas
                        id="canvas"
                        ref={canvasRef}
                        className="border border-gray-300 rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </>
    );
};

export default CanvasEditor;
