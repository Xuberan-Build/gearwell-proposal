import React, { useState, useRef } from 'react';

interface SignatureSectionProps {
  onSign: (name: string) => void;
}

const SignatureSection: React.FC<SignatureSectionProps> = ({ onSign }) => {
  const [name, setName] = useState('');
  const [signed, setSigned] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  
  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    contextRef.current = context;
  };
  
  React.useEffect(() => {
    prepareCanvas();
  }, []);
  
  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };
  
  const finishDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };
  
  const draw = ({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
  };
  
  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
  };
  
  const handleSign = () => {
    if (name.trim() === '') {
      alert('Please enter your name before signing');
      return;
    }
    
    setSigned(true);
    onSign(name);
  };
  
  return (
    <div className="signature-section">
      <h2>Agreement</h2>
      <p>By signing below, I agree to the terms and conditions outlined in this proposal.</p>
      
      <div className="signature-form">
        <div className="form-group">
          <label htmlFor="clientName">Full Name:</label>
          <input 
            type="text" 
            id="clientName" 
            value={name} 
            onChange={handleNameChange} 
            disabled={signed}
          />
        </div>
        
        <div className="signature-canvas-container">
          <p>Sign here:</p>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            className="signature-canvas"
            style={{ border: '1px solid #ddd', background: '#f9f9f9' }}
          />
          {!signed && (
            <button onClick={clearSignature} className="clear-button">
              Clear
            </button>
          )}
        </div>
        
        {!signed ? (
          <button onClick={handleSign} className="sign-button" disabled={name.trim() === ''}>
            Sign Agreement
          </button>
        ) : (
          <div className="signed-message">
            <p>Agreement signed by {name} on {new Date().toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignatureSection;