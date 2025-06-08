import { Canvas, Circle, Rect, IText, Line, ActiveSelection } from 'fabric';
import { useState, useRef, useEffect } from "react";
import { FaRegSquare, FaRegCircle, FaSave } from 'react-icons/fa';
import { PiTextAa } from "react-icons/pi";
import { TbLine } from "react-icons/tb";
import { FaTrash } from "react-icons/fa";
import { MdFormatColorFill, MdBorderColor } from 'react-icons/md';
import { MdContentCopy, MdContentPaste } from 'react-icons/md';


import { FaRegSave } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProjectQuery, useUpdateProjectMutation } from '@/redux/features/project/projectApi';
import Loader from '@/components/ui/Loader';
import { toast } from 'react-hot-toast';

const CanvasEditor = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas]: any = useState();
    const [fillColor, setFillColor] = useState("#3498db");
    const [isDrawingLine, setIsDrawingLine] = useState(false);
    const [line, setLine]: any = useState();
    const [hasSelection, setHasSelection] = useState(false);
    const [selectedObjectColor, setSelectedObjectColor] = useState("#000000");
    const [selectedObjectType, setSelectedObjectType] = useState<"fill" | "stroke" | null>(null);
    const [copiedObjects, setCopiedObjects] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [projectTitle, setProjectTitle] = useState("");

    // Get project data if editing an existing project
    const { data: projectData, isLoading: isLoadingProject, isError: projectError } =
        id && id !== 'new' ? useGetProjectQuery(id) : { data: null, isLoading: false, isError: false };

    const [updateProject] = useUpdateProjectMutation();

    useEffect(() => {
        if (canvasRef.current) {
            const initCanvas = new Canvas(canvasRef.current, {
                width: 1400,
                height: 600,
            });

            initCanvas.backgroundColor = "#f8f9fa";
            initCanvas.renderAll();
            setCanvas(initCanvas);

            // Set up event listeners
            initCanvas.on('selection:created', (e: any) => {
                setHasSelection(true);
                const selectedObject = e.selected?.[0] || e.target;
                if (selectedObject) {
                    updateSelectedObjectState(selectedObject);
                }
            });

            initCanvas.on('selection:updated', (e: any) => {
                setHasSelection(true);
                const selectedObject = e.selected?.[0] || e.target;
                if (selectedObject) {
                    updateSelectedObjectState(selectedObject);
                }
            });

            initCanvas.on('selection:cleared', () => {
                setHasSelection(false);
                setSelectedObjectType(null);
            });

            // Set up object modified event for auto-save functionality
            initCanvas.on('object:modified', () => {
                if (id && id !== 'new') {
                    // Debounced auto-save - only save after 2 seconds of inactivity
                    if (window.autoSaveTimer) {
                        clearTimeout(window.autoSaveTimer);
                    }
                    window.autoSaveTimer = setTimeout(() => {
                        saveCanvas();
                    }, 2000);
                }
            });

            return () => {
                initCanvas.dispose();
            };
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                saveCanvas();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [canvas, id]);
    useEffect(() => {
        if (projectData?.data && canvas) {
            try {
                setProjectTitle(projectData.data.title);

                if (projectData.data.backgroundColor) {
                    canvas.backgroundColor = projectData.data.backgroundColor;
                }

                if (projectData.data.canvasData) {
                    try {
                        const canvasData = JSON.parse(projectData.data.canvasData);
                        console.log("Loading canvas data:", canvasData);

                        canvas.clear();

                        canvas.loadFromJSON(canvasData, () => {
                            canvas.renderAll();
                            console.log('Canvas loaded from saved data');
                        });
                    } catch (error) {
                        console.error("Error parsing canvas data:", error);
                        toast.error("Failed to load canvas data");
                    }
                }
            } catch (error) {
                console.error('Error loading canvas data:', error);
                toast.error('Failed to load project data');
            }
        }
    }, [projectData, canvas]);

    // Save canvas state to database
    const saveCanvas = async () => {
        if (!canvas || !id || id === 'new') return;

        try {
            setIsSaving(true);

            const canvasJSON = canvas.toJSON(['id', 'selectable']);

            const updateData = {
                canvasData: JSON.stringify(canvasJSON),
                backgroundColor: canvas.backgroundColor,
                lastEdited: new Date().toISOString(),
            };
            console.log("Saving canvas data:", updateData);
            try {
                await updateProject({
                    id,
                    data: updateData,
                }).unwrap();

                toast.success('Project saved successfully');
            } catch (apiError: any) {
                console.error('API Error saving canvas:', apiError);
                let errorMessage = 'Failed to save project';

                if (apiError.data?.message) {
                    errorMessage = apiError.data.message;
                }

                toast.error(errorMessage);
                throw apiError; 
            }
        } catch (error) {
            console.error('Error saving canvas:', error);
            toast.error('Failed to save project. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

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

    const deleteSelectedObject = () => {
        if (canvas) {
            const activeObject = canvas.getActiveObject();
            if (activeObject) {

                if (activeObject.type === 'activeSelection') {
                    activeObject.forEachObject((obj: any) => {
                        canvas.remove(obj);
                    });
                } else {

                    canvas.remove(activeObject);
                }
                canvas.discardActiveObject();
                canvas.renderAll();
                setHasSelection(false);
                console.log("Object(s) deleted");
            }
        }
    };




    const updateObjectColor = (color: string) => {
        if (canvas) {
            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                if (activeObject.type === 'line') {
                    activeObject.set({ stroke: color });
                } else {
                    activeObject.set({ fill: color });
                }
                canvas.renderAll();
                setSelectedObjectColor(color);
                console.log("Object color updated to:", color);
            }
        }
    };


    const toggleColorProperty = () => {
        if (selectedObjectType === "fill") {
            setSelectedObjectType("stroke");
            const activeObject = canvas.getActiveObject();
            setSelectedObjectColor(activeObject.stroke || "#000000");
        } else {
            setSelectedObjectType("fill");
            const activeObject = canvas.getActiveObject();
            setSelectedObjectColor(activeObject.fill || "#000000");
        }
    };


    const copySelectedObjects = () => {
        if (!canvas || !hasSelection) return;

        const activeObject = canvas.getActiveObject();
        if (!activeObject) return;

        try {

            if (activeObject.type === 'activeSelection') {

                const objectsData: any[] = [];
                activeObject.forEachObject((obj: any) => {
                    const objData: any = {
                        type: obj.type,
                        left: obj.left,
                        top: obj.top,
                        width: obj.width,
                        height: obj.height,
                        scaleX: obj.scaleX,
                        scaleY: obj.scaleY,
                        angle: obj.angle,
                        fill: obj.fill,
                        stroke: obj.stroke,
                        strokeWidth: obj.strokeWidth,
                    };


                    if (obj.type === 'circle') {
                        objData.radius = obj.radius;
                    } else if (obj.type === 'i-text') {
                        objData.text = obj.text;
                        objData.fontSize = obj.fontSize;
                        objData.fontFamily = obj.fontFamily;
                        objData.fontStyle = obj.fontStyle;
                        objData.fontWeight = obj.fontWeight;
                        objData.textAlign = obj.textAlign;
                        objData.lineHeight = obj.lineHeight;
                    } else if (obj.type === 'line') {
                        objData.x1 = obj.x1;
                        objData.y1 = obj.y1;
                        objData.x2 = obj.x2;
                        objData.y2 = obj.y2;
                    }

                    objectsData.push(objData);
                });
                setCopiedObjects(objectsData);
                console.log("Multiple objects copied:", objectsData.length);
            } else {

                const objData: any = {
                    type: activeObject.type,
                    left: activeObject.left,
                    top: activeObject.top,
                    width: activeObject.width,
                    height: activeObject.height,
                    scaleX: activeObject.scaleX,
                    scaleY: activeObject.scaleY,
                    angle: activeObject.angle,
                    fill: activeObject.fill,
                    stroke: activeObject.stroke,
                    strokeWidth: activeObject.strokeWidth,
                };


                if (activeObject.type === 'circle') {
                    objData.radius = activeObject.radius;
                } else if (activeObject.type === 'i-text') {
                    objData.text = activeObject.text;
                    objData.fontSize = activeObject.fontSize;
                    objData.fontFamily = activeObject.fontFamily;
                    objData.fontStyle = activeObject.fontStyle;
                    objData.fontWeight = activeObject.fontWeight;
                    objData.textAlign = activeObject.textAlign;
                    objData.lineHeight = activeObject.lineHeight;
                } else if (activeObject.type === 'line') {
                    objData.x1 = activeObject.x1;
                    objData.y1 = activeObject.y1;
                    objData.x2 = activeObject.x2;
                    objData.y2 = activeObject.y2;
                }

                setCopiedObjects([objData]);
                console.log("Object copied:", objData.type);
            }
        } catch (error) {
            console.error("Error copying objects:", error);
        }
    };


    const pasteObjects = () => {
        if (!canvas || copiedObjects.length === 0) return;

        try {

            canvas.discardActiveObject();


            const newObjects: any[] = [];
            const offset = 20;

            copiedObjects.forEach((objData: any) => {
                let newObj;

                switch(objData.type) {
                    case 'rect':
                        newObj = new Rect({
                            left: objData.left + offset,
                            top: objData.top + offset,
                            width: objData.width,
                            height: objData.height,
                            scaleX: objData.scaleX,
                            scaleY: objData.scaleY,
                            angle: objData.angle,
                            fill: objData.fill,
                            stroke: objData.stroke,
                            strokeWidth: objData.strokeWidth
                        });
                        break;
                    case 'circle':
                        newObj = new Circle({
                            left: objData.left + offset,
                            top: objData.top + offset,
                            radius: objData.radius,
                            scaleX: objData.scaleX,
                            scaleY: objData.scaleY,
                            angle: objData.angle,
                            fill: objData.fill,
                            stroke: objData.stroke,
                            strokeWidth: objData.strokeWidth
                        });
                        break;
                    case 'i-text':
                        newObj = new IText(objData.text || "Text", {
                            left: objData.left + offset,
                            top: objData.top + offset,
                            width: objData.width,
                            height: objData.height,
                            scaleX: objData.scaleX,
                            scaleY: objData.scaleY,
                            angle: objData.angle,
                            fill: objData.fill,
                            stroke: objData.stroke,
                            strokeWidth: objData.strokeWidth,
                            fontSize: objData.fontSize,
                            fontFamily: objData.fontFamily,
                            fontStyle: objData.fontStyle,
                            fontWeight: objData.fontWeight,
                            textAlign: objData.textAlign,
                            lineHeight: objData.lineHeight
                        });
                        break;
                    case 'line':
                        newObj = new Line([objData.x1, objData.y1, objData.x2, objData.y2], {
                            left: objData.left + offset,
                            top: objData.top + offset,
                            scaleX: objData.scaleX,
                            scaleY: objData.scaleY,
                            angle: objData.angle,
                            fill: objData.fill,
                            stroke: objData.stroke,
                            strokeWidth: objData.strokeWidth
                        });
                        break;
                    default:
                        console.warn(`Unknown object type: ${objData.type}`);
                        return;
                }


            canvas.add(newObj);
            newObjects.push(newObj);
            console.log("Object pasted:", newObj.type);
        });


            if (newObjects.length > 1) {
                const selection = new ActiveSelection(newObjects, {
                    canvas: canvas
                });
                canvas.setActiveObject(selection);
            } else if (newObjects.length === 1) {
                canvas.setActiveObject(newObjects[0]);
            }

            canvas.renderAll();
        } catch (error) {
            console.error("Error pasting objects:", error);
        }
    };


    const updateSelectedObjectState = (obj: any) => {
        if (!obj) return;

        if (obj.type === 'line') {
            setSelectedObjectType("stroke");
            setSelectedObjectColor(obj.stroke || "#000000");
        } else {

            setSelectedObjectType("fill");
            setSelectedObjectColor(obj.fill || "#000000");
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

                                <div className="mx-4 h-8 w-px bg-gray-200"></div>

                                <button
                                    onClick={deleteSelectedObject}
                                    disabled={!hasSelection}
                                    className={`${
                                        hasSelection ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'
                                    } text-white font-medium py-2 px-4 rounded-md shadow-sm transition-all duration-200 flex items-center gap-2`}
                                    title="Delete selected object"
                                >
                                    <FaTrash className="text-white" />
                                </button>

                                <button
                                    onClick={copySelectedObjects}
                                    disabled={!hasSelection}
                                    className={`${
                                        hasSelection ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'
                                    } text-white font-medium py-2 px-4 rounded-md shadow-sm transition-all duration-200 flex items-center gap-2`}
                                    title="Copy selected object (Ctrl+C)"
                                >
                                    <MdContentCopy className="text-white" />
                                </button>

                                <button
                                    onClick={pasteObjects}
                                    disabled={copiedObjects.length === 0}
                                    className={`${
                                        copiedObjects.length > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
                                    } text-white font-medium py-2 px-4 rounded-md shadow-sm transition-all duration-200 flex items-center gap-2`}
                                    title="Paste copied object (Ctrl+V)"
                                >
                                    <MdContentPaste className="text-white" />
                                </button>

                                <button
                                    onClick={() => {
                                        if (hasSelection) {
                                            copySelectedObjects();
                                            pasteObjects();
                                        }
                                    }}
                                    disabled={!hasSelection}
                                    className={`${
                                        hasSelection ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-300 cursor-not-allowed'
                                    } text-white font-medium py-2 px-4 rounded-md shadow-sm transition-all duration-200 flex items-center gap-2`}
                                    title="Duplicate selected object (Ctrl+D)"
                                >
                                    <span className="text-white">Duplicate</span>
                                </button>

                                <div className="mx-4 h-8 w-px bg-gray-200"></div>

                                <button
                                    onClick={saveCanvas}
                                    disabled={isSaving}
                                    className={`${
                                        isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                                    } text-white font-medium py-2 px-4 rounded-md shadow-sm transition-all duration-200 flex items-center gap-2`}
                                    title="Save project (Ctrl+S)"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader size="sm" text="" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaRegSave className="text-white" />
                                            <span>Save</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="canvas-container bg-white p-4 rounded-xl shadow-md relative">
                    <canvas
                        id="canvas"
                        ref={canvasRef}
                        className="border border-gray-200 rounded-lg shadow-inner"
                        onMouseDown={isDrawingLine ? startLine : undefined}
                        onMouseMove={isDrawingLine ? drawLine : undefined}
                        onMouseUp={endLine}
                    />

                    {/* Color editor menu that appears when an object is selected */}
                    {hasSelection && (
                        <div className="absolute top-8 right-8 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">
                                        Edit {selectedObjectType === "fill" ? "Fill" : "Stroke"} Color
                                    </h3>
                                    <button
                                        onClick={toggleColorProperty}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                        title="Toggle between fill and stroke"
                                    >
                                        {selectedObjectType === "fill" ? (
                                            <MdBorderColor className="h-5 w-5" />
                                        ) : (
                                            <MdFormatColorFill className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={selectedObjectColor}
                                        onChange={(e) => updateObjectColor(e.target.value)}
                                        className="w-8 h-8 rounded overflow-hidden cursor-pointer border-0"
                                    />
                                    <span className="text-xs text-gray-600">{selectedObjectColor}</span>
                                </div>

                                <div className="grid grid-cols-6 gap-2 mt-1">
                                    {["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
                                      "#000000", "#FFFFFF", "#888888", "#FF8800", "#8800FF", "#00FF88"].map(color => (
                                        <div
                                            key={color}
                                            onClick={() => updateObjectColor(color)}
                                            className="w-6 h-6 rounded-full cursor-pointer border border-gray-200"
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <p className="text-gray-500 text-sm mt-4">
                    Click on buttons to add shapes to the canvas. Select a shape and press Delete key or use the trash button to remove it.
                    Click on a shape to select it and edit its colors. Use the copy and paste buttons or keyboard shortcuts (Ctrl+C / Ctrl+V) to duplicate shapes.
                    You can also use the Duplicate button or press Ctrl+D to quickly duplicate selected objects.
                </p>
            </div>
        </>
    );
};

export default CanvasEditor;
