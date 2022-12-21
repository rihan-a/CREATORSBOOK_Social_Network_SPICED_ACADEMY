import { useRef, useEffect, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../../../../socket";
import Switch from "react-switch";

// import {
//     setBrushColor,
//     setBrushSize,
// } from "../../../../redux/features/board/boardSlice";

import "./Board.css";

const WhiteBoard = () => {
    const dispatch = useDispatch();
    const canvas = useRef();

    // states for Brush color and Size
    const [brushColorState, setColor] = useState("#000000");
    const [brushSizeState, setSize] = useState(15);
    const [spaceColorState, setSpaceColor] = useState("#FFFFFF");

    // OnChange functions to handle change of brush size and color
    const changeColorHandler = (e) => {
        setColor(e.target.value);
        //dispatch(setBrushColor(e.target.value));
    };
    const changeSpaceColorHandler = (e) => {
        setSpaceColor(e.target.value);
    };

    const changeSizeHandler = (e) => {
        setSize(e.target.value);
        //dispatch(setBrushSize(e.target.value));
    };

    // Eraser switch state
    const [checked, setChecked] = useState(false);
    const handleChange = (nextChecked) => {
        canvas.current.eraseMode(nextChecked);
        setChecked(nextChecked);
    };

    // getting brush color and size from redux
    // const brushColor = useSelector((state) => {
    //     return state.board.brushColor;
    // });

    // const brushSize = useSelector((state) => {
    //     return state.board.brushSize;
    // });

    // updating sketch from other users
    socket.on("canvas-data", (CanvasPath) => {
        canvas.current.loadPaths(CanvasPath);
    });

    // function to export sketch
    const exportSketch = () => {
        console.log("clicked");
        canvas.current
            .exportImage("png")
            .then((exportedImg) => {
                //console.log(exportedImg);
                let img = "data:image/png" + exportedImg;
                let downloadLink = document.querySelector("#downloadPNG");
                downloadLink.setAttribute("href", img);
                downloadLink.click();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <div className="canvas-container">
            <div className="tools-container-wrapper">
                <div className="tools-container">
                    <div className="color-picker-container">
                        Space Color : &nbsp;
                        <input
                            type="color"
                            value={spaceColorState}
                            onChange={changeSpaceColorHandler}
                        />
                    </div>
                    <div className="color-picker-container">
                        Brush Color : &nbsp;
                        <input
                            type="color"
                            value={brushColorState}
                            onChange={changeColorHandler}
                        />
                    </div>
                    <div className="brushsize-container">
                        Brush Size : &nbsp;
                        <select
                            value={brushSizeState}
                            onChange={changeSizeHandler}
                        >
                            <option>5</option>
                            <option>10</option>
                            <option>15</option>
                            <option>20</option>
                            <option>25</option>
                            <option>30</option>
                        </select>
                    </div>
                    <button
                        onClick={() => {
                            canvas.current.clearCanvas();
                            socket.emit("clear-board", true);
                        }}
                    >
                        Clear
                    </button>

                    <div className="eraser-switch">
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
                    <div>
                        <button onClick={() => exportSketch()}>Export</button>
                        <a download="test.png" id="downloadPNG"></a>
                    </div>
                </div>
            </div>

            <ReactSketchCanvas
                ref={canvas}
                className="react-canvas"
                id="react-canvas"
                strokeWidth={brushSizeState}
                strokeColor={brushColorState}
                eraserWidth={20}
                canvasColor={spaceColorState}
                onStroke={(CanvasPath) => {
                    //console.log(CanvasPath);
                    socket.emit("canvas-data", CanvasPath);
                }}

                // backgroundImage="/images/placeholder.png"
            />
        </div>
    );
};

export default WhiteBoard;
