import { useEffect } from "react";
import { socket } from "../../../../socket";
import { saveSketch } from "../../../../redux/features/board/boardSlice";
import { useSelector, useDispatch } from "react-redux";

import "./Board.css";

function Board() {
    let timeout;

    const dispatch = useDispatch();

    const brushColor = useSelector((state) => {
        return state.board.brushColor;
    });

    const brushSize = useSelector((state) => {
        return state.board.brushSize;
    });

    useEffect(() => {
        drawOnCanvas();
        let image = new Image();
        let canvas = document.querySelector("#board");
        let ctx = canvas.getContext("2d");
        image.onload = () => {
            ctx.drawImage(image, 0, 0);
        };
        image.src = savedSketch;
    }, [brushColor, brushSize]);

    socket.on("canvas-data", (data) => {
        dispatch(saveSketch(data));
        let image = new Image();
        let canvas = document.querySelector("#board");
        let ctx = canvas.getContext("2d");
        image.onload = () => {
            ctx.drawImage(image, 0, 0);
        };
        image.src = data;
    });

    const savedSketch = useSelector((state) => {
        return state.board.recentSketch;
    });

    useEffect(() => {
        let image = new Image();
        let canvas = document.querySelector("#board");
        let ctx = canvas.getContext("2d");
        image.onload = () => {
            ctx.drawImage(image, 0, 0);
        };
        image.src = savedSketch;
        return function storeSketchToDb() {
            let sketchData = canvas.toDataURL("image/png");
            socket.emit("canvas-data-to-db", sketchData);
        };
    }, []);

    const drawOnCanvas = () => {
        let canvas = document.querySelector("#board");
        let ctx = canvas.getContext("2d");
        let sketch = document.querySelector("#sketch");
        let sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue("width"));
        canvas.height = parseInt(sketch_style.getPropertyValue("height"));

        let mouse = { x: 0, y: 0 };
        let last_mouse = { x: 0, y: 0 };

        /* Mouse Capturing Work */
        canvas.addEventListener(
            "mousemove",
            function (e) {
                last_mouse.x = mouse.x;
                last_mouse.y = mouse.y;
                mouse.x = e.pageX - this.offsetLeft;
                mouse.y = e.pageY - this.offsetTop;
            },
            false
        );

        /* Drawing on Paint App */
        ctx.lineWidth = 5;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.strokeStyle = `${brushColor}`;

        //drawLine(ctx);

        canvas.addEventListener(
            "mousedown",
            function () {
                canvas.addEventListener("mousemove", onPaint, false);
            },
            false
        );

        canvas.addEventListener(
            "mouseup",
            function () {
                canvas.removeEventListener("mousemove", onPaint, false);
            },
            false
        );

        let onPaint = function () {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();

            if (timeout != undefined) clearTimeout(timeout);

            timeout = setTimeout(() => {
                let sketchData = canvas.toDataURL("image/png");
                dispatch(saveSketch(sketchData));
                socket.emit("canvas-data", sketchData);
            }, 1000);
        };
    };

    return (
        <>
            <div id="sketch">
                <canvas id="board"></canvas>
            </div>
        </>
    );
}

export default Board;
