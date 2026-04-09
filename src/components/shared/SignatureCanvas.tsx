import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Undo2, Trash2 } from "lucide-react";

interface SignatureCanvasProps {
  onSignatureChange: (hasSignature: boolean, dataUrl: string | null) => void;
  width?: number;
  height?: number;
}

export function SignatureCanvas({ onSignatureChange, width, height = 120 }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(width || 300);
  const strokesRef = useRef<ImageData[]>([]);

  // Responsive width
  useEffect(() => {
    if (width) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [width]);

  // Setup canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Scale for retina
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#1a1a1a";
  }, [canvasWidth, height]);

  const getPos = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  }, []);

  const saveStroke = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    strokesRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }, []);

  const startDrawing = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    saveStroke();
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  }, [getPos, saveStroke]);

  const draw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing, getPos]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (canvas) {
      onSignatureChange(true, canvas.toDataURL("image/png"));
    }
  }, [isDrawing, onSignatureChange]);

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || strokesRef.current.length === 0) return;
    const prev = strokesRef.current.pop()!;
    ctx.putImageData(prev, 0, 0);
    // Check if canvas is blank
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const blank = !data.some((v, i) => i % 4 === 3 && v > 0);
    if (blank) {
      setHasDrawn(false);
      onSignatureChange(false, null);
    } else {
      onSignatureChange(true, canvas.toDataURL("image/png"));
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokesRef.current = [];
    setHasDrawn(false);
    onSignatureChange(false, null);
  };

  return (
    <div ref={containerRef}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-foreground">Firma Digital</p>
        {hasDrawn && (
          <div className="flex gap-1">
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={handleUndo}>
              <Undo2 className="w-3.5 h-3.5" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive" onClick={handleClear}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
      <div className="relative border-2 border-dashed border-outline-variant rounded-2xl overflow-hidden bg-surface-container-low touch-none">
        <canvas
          ref={canvasRef}
          className="cursor-crosshair block"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-muted-foreground text-sm">Firma aquí con el dedo o mouse</p>
          </div>
        )}
        {/* Signature line */}
        <div className="absolute bottom-6 left-6 right-6 border-b border-muted-foreground/30" />
      </div>
    </div>
  );
}
