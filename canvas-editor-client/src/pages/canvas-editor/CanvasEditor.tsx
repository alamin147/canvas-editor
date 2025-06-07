import { Canvas, Circle, Rect } from 'fabric';
import { useState, useRef, useEffect } from "react";
import {FaRegSquare, FaRegCircle} from 'react-icons/fa';

const CanvasEditor = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas]: any = useState();

    useEffect(() => {
        if (canvasRef.current) {
            const initCanvas = new Canvas(canvasRef.current, {
                width: 1200,
                height: 600,
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
            radius: 50,
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
            <div className="flex flex-col items-center w-full h-screen bg-gray-50 p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Canvas Editor</h1>
                <div className="mb-6 flex gap-4">
                    <button
                        onClick={addRectangle}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-5 rounded-md shadow-sm transition-all duration-200 flex items-center gap-2"
                    >
                        <FaRegSquare className="text-white" />
                        Add Rectangle
                    </button>
                    <button
                        onClick={addCircle}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-5 rounded-md shadow-sm transition-all duration-200 flex items-center gap-2"
                    >
                    <FaRegCircle className="text-white" />
                        Add Circle
                    </button>
                </div>
                <div className="canvas-container bg-white p-4 rounded-xl shadow-md">
                    <canvas
                        id="canvas"
                        ref={canvasRef}
                        className="border border-gray-200 rounded-lg shadow-inner"
                    />
                </div>
                <p className="text-gray-500 text-sm mt-4">Click on buttons to add shapes to the canvas</p>
            </div>
        </>
    );
};

export default CanvasEditor;
