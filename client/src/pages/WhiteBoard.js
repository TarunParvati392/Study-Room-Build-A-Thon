import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://study-room-build-a-thon.onrender.com"); // replace with backend URL

export default function Whiteboard({ roomId }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [lineWidth, setLineWidth] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;

    // Listen for drawing from others
    socket.on("draw", ({ x0, y0, x1, y1, color, lineWidth }) => {
      drawLine(x0, y0, x1, y1, color, lineWidth, false);
    });

    socket.emit("join-room", roomId);

    return () => {
      socket.off("draw");
    };
  }, [roomId]);

  const drawLine = (x0, y0, x1, y1, strokeColor, width, emit = true) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();

    if (!emit) return;
    socket.emit("draw", {
      roomId,
      data: { x0, y0, x1, y1, color: strokeColor, lineWidth: width },
    });
  };

  const handleMouseDown = (e) => {
    setDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.lastX = offsetX;
    ctxRef.current.lastY = offsetY;
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    drawLine(
      ctxRef.current.lastX,
      ctxRef.current.lastY,
      offsetX,
      offsetY,
      color,
      lineWidth
    );
    ctxRef.current.lastX = offsetX;
    ctxRef.current.lastY = offsetY;
  };

  const handleMouseUp = () => setDrawing(false);
  const handleMouseLeave = () => setDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Toolbar */}
      <div className="flex items-center p-2 bg-gray-800 space-x-2">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded"
        />
        <input
          type="range"
          min="1"
          max="10"
          value={lineWidth}
          onChange={(e) => setLineWidth(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
          onClick={clearCanvas}
        >
          Clear
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        ></canvas>
      </div>
    </div>
  );
}
