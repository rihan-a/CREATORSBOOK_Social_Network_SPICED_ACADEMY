import { useState } from "react";
import Board from "./Board/Board";
import { useDispatch } from "react-redux";
import {
    setBrushColor,
    setBrushSize,
} from "../../../redux/features/board/boardSlice";

import "./CollabSpaces.css";

function CollabSpaces() {
    const dispatch = useDispatch();
    const [brushColor, setColor] = useState("#00000");
    const [brushSize, setSize] = useState(5);

    const changeColorHandler = (e) => {
        setColor(e.target.value);
        dispatch(setBrushColor(e.target.value));
    };

    const changeSizeHandler = (e) => {
        setSize(e.target.value);
        dispatch(setBrushSize(e.target.value));
    };

    return (
        <>
            <div className="collab-spaces-container">
                <div> COLLAB - SPACES</div>
                <div className="tools-section">
                    <div className="color-picker-container">
                        Select color : &nbsp;
                        <input
                            type="color"
                            value={brushColor}
                            onChange={changeColorHandler}
                        />
                    </div>
                    <div className="brushsize-container">
                        Select brush size : &nbsp;
                        <select value={brushSize} onChange={changeSizeHandler}>
                            <option>5</option>
                            <option>10</option>
                            <option>15</option>
                            <option>20</option>
                            <option>25</option>
                        </select>
                    </div>
                </div>

                <Board />
            </div>
        </>
    );
}

export default CollabSpaces;
