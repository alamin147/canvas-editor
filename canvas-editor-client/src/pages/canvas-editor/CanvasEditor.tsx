import { Canvas, Circle, Rect, IText, Line } from 'fabric';
import { useState, useRef, useEffect } from "react";
import { FaRegSquare, FaRegCircle } from 'react-icons/fa';
import { PiTextAa } from "react-icons/pi";
import { TbLine } from "react-icons/tb";

const CanvasEditor = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas]: any = useState();
    const [fillColor, setFillColor] = useState("#3498db");
    const [isDrawingLine, setIsDrawingLine] = useState(false);
    const [line, setLine]: any = useState();

    useEffect(() => {
        if (canvasRef.current) {
            const initCanvas = new Canvas(canvasRef.current, {
                width: 1400,
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
                fill: fillColor,
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
                fill: fillColor,
            });
            canvas.add(circ);
            canvas.setActiveObject(circ);
            canvas.renderAll();
            console.log("Circle added:", circ);
        }
    };

    const addText = () => {
        if (canvas) {
            const text = new IText("Type here", {
                left: 100,
                top: 100,
                fontFamily: 'Arial',
                fontSize: 20,
                fill: fillColor,
                editable: true,
                cursorColor: '#333',
                cursorWidth: 2,
                selectionColor: 'rgba(17, 119, 255, 0.3)',
                lockMovementX: false,
                lockMovementY: false
            });

            canvas.add(text);
            canvas.setActiveObject(text);

            text.enterEditing();
            text.selectAll();
            canvas.renderAll();

            console.log("Text added and ready for editing");
        }
    };

    const addLine = () => {
        if (canvas) {
            
            const line = new Line([50, 50, 200, 200], {
                stroke: fillColor,
                strokeWidth: 2,
                selectable: true,
                evented: true,
            });

            canvas.add(line);
            canvas.setActiveObject(line);
            canvas.renderAll();
            console.log("Line added:", line);
        }
    };

    const startLine = (e: any) => {
        if (canvas) {
            const pointer = canvas.getPointer(e);
            const newLine = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
                strokeWidth: 2,
                fill: fillColor,
                stroke: fillColor,
                selectable: false,
            });

            canvas.add(newLine);
            setLine(newLine);
            setIsDrawingLine(true);
            console.log("Line drawing started");
        }
    };

    const drawLine = (e: any) => {
        if (canvas && isDrawingLine && line) {
            const pointer = canvas.getPointer(e);
            line.set({ x2: pointer.x, y2: pointer.y });
            canvas.renderAll();
        }
    };

    const endLine = () => {
        if (canvas && isDrawingLine && line) {
            line.set({ selectable: true });
            setIsDrawingLine(false);
            console.log("Line drawing ended");
        }
    };

    return (
        <>
            <div className="flex flex-col items-center w-full h-screen bg-gray-50 p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Canvas Editor</h1>

                <div className="mb-6 w-full max-w-3xl">
                    <div className="flex justify-center items-center bg-white rounded-lg shadow-sm py-3 px-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={addRectangle}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-all duration-200 flex items-center gap-2"
                            >
                                <FaRegSquare className="text-white" />

                            </button>
                            <button
                                onClick={addCircle}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-all duration-200 flex items-center gap-2"
                            >
                                <FaRegCircle className="text-white" />

                            </button>
                            <button
                                onClick={addText}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-all duration-200 flex items-center gap-2"
                            >
                                <PiTextAa className="text-white font-bold" />

                            </button>

                            <button
                                onClick={addLine}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-all duration-200 flex items-center gap-2"
                            >
                                <TbLine className="text-white" />
                            </button>

                            <div className="mx-4 h-8 w-px bg-gray-200"></div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="fillColor" className="text-sm text-gray-600">Fill:</label>
                                    <div className="flex items-center">
                                        <input
                                            type="color"
                                            id="fillColor"
                                            value={fillColor}
                                            onChange={(e) => setFillColor(e.target.value)}
                                            className="w-6 h-6 rounded overflow-hidden cursor-pointer border-0"
                                        />
                                        <span className="text-xs text-gray-500 ml-1">{fillColor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="canvas-container bg-white p-4 rounded-xl shadow-md">
                    <canvas
                        id="canvas"
                        ref={canvasRef}
                        className="border border-gray-200 rounded-lg shadow-inner"
                        onMouseDown={isDrawingLine ? startLine : undefined}
                        onMouseMove={isDrawingLine ? drawLine : undefined}
                        onMouseUp={endLine}
                    />
                </div>
                <p className="text-gray-500 text-sm mt-4">Click on buttons to add shapes to the canvas</p>
            </div>
        </>
    );
};

export default CanvasEditor;
