import { useRef, useEffect, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { useSelector } from "react-redux";
import { socket } from "../../../../socket";
import Switch from "react-switch";

import "./Board.css";

const WhiteBoard = () => {
    const canvas = useRef();

    const [checked, setChecked] = useState(false);

    const brushColor = useSelector((state) => {
        return state.board.brushColor;
    });

    const brushSize = useSelector((state) => {
        return state.board.brushSize;
    });

    socket.on("canvas-data", (CanvasPath) => {
        canvas.current.loadPaths(CanvasPath);
    });

    const handleChange = (nextChecked) => {
        canvas.current.eraseMode(nextChecked);
        setChecked(nextChecked);
    };

    useEffect(() => {
        document.querySelector(".canvas-container").addEventListener(
            "mouseup",
            function () {
                canvas.current
                    .exportPaths()
                    .then((CanvasPath) => {
                        socket.emit("canvas-data", CanvasPath);
                        console.log(CanvasPath);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            },
            false
        );
    }, []);

    useEffect(() => {});

    return (
        <>
            <div className="canvas-container">
                <ReactSketchCanvas
                    ref={canvas}
                    className="react-canvas"
                    id="react-canvas"
                    strokeWidth={brushSize}
                    strokeColor={brushColor}
                    eraserWidth={20}

                    // backgroundImage="/images/placeholder.png"
                />
            </div>
            <button
                onClick={() => {
                    canvas.current.clearCanvas();
                }}
            >
                Clear Space
            </button>
            <div>
                <span>Eraser</span>
                <Switch
                    onChange={handleChange}
                    checked={checked}
                    onColor="#86d3ff"
                    onHandleColor="#2693e6"
                    handleDiameter={30}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={20}
                    width={48}
                    className="react-switch"
                    id="material-switch"
                />
            </div>
        </>
    );
};

export default WhiteBoard;
