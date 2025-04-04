import { useState, useRef, useEffect } from 'react';
import './App.css';
import { marketingProposal } from './assets/proposalData';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "./firebase/firebase";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [isSigned, setIsSigned] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [showPaymentLink, setShowPaymentLink] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  const paymentLink = "https://invoice.stripe.com/i/acct_1KUhViFPt1MDyndB/live_YWNjdF8xS1VoVmlGUHQxTUR5bmRCLF9TNEFKZDJOTDNxZGZuVTVmSDVhbmVnbzd5Vk1xb0RBLDEzNDI4NTk0Mg0200UldeQFQQ?s=db";
  
  // Prepare the canvas when component mounts
  useEffect(() => {
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
  
  const handleSign = async () => {
    if (name.trim() === '') {
      alert('Please enter your name before signing');
      return;
    }
    
    // Check if signature is drawn
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        const pixelData = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const hasSignature = pixelData.some(channel => channel !== 0);
        
        if (!hasSignature) {
          alert('Please draw your signature before signing the agreement');
          return;
        }
        
        // Immediately set as signed before attempting Firebase operations
        setDate(new Date().toLocaleDateString());
        setIsSigned(true);
        setShowPaymentLink(true);
        
        // Show loading state for button
        setIsLoading(true);
        
        // Try to upload to Firebase in the background
        try {
          // Generate a unique ID for this signature
          const signatureId = uuidv4();
          
          // Convert canvas to data URL (PNG format)
          const dataUrl = canvas.toDataURL("image/png");
          
          // Create a path for the signature
          const fileName = `signatures/${marketingProposal.id}/${Date.now()}-${signatureId}.png`;
          
          // Create a storage reference
          const storageRef = ref(storage, fileName);
          
          // Upload the data URL as a string
          const snapshot = await uploadString(storageRef, dataUrl, 'data_url');
          
          // Get the download URL
          const downloadURL = await getDownloadURL(snapshot.ref);
          
          // Set the signature URL to display the image
          setSignatureUrl(downloadURL);
          
          // Prepare the signature data
          const signatureData = {
            id: signatureId,
            proposalId: marketingProposal.id,
            signerName: name,
            signatureUrl: downloadURL,
            packagePrice: marketingProposal.pricing.completePackage.price,
            timestamp: serverTimestamp(),
            status: 'signed',
            clientInfo: {
              userAgent: navigator.userAgent,
              platform: navigator.platform,
              language: navigator.language
            }
          };
          
          // Save to Firestore with the custom ID
          await setDoc(doc(db, "signatures", signatureId), signatureData);
          
        } catch (error) {
          console.error('Error storing signature:', error);
          // We won't alert the user since we've already shown success
        } finally {
          setIsLoading(false);
        }
      }
    }
  };
  
  const handleProceedToPayment = () => {
    window.open(paymentLink, '_blank');
  };
  
  return (
    <div className="app-container">
      <div className="proposal-container">
        {/* Header Section */}
        <div className="proposal-header">
          <h1>{marketingProposal.title}</h1>
          <div className="proposal-info">
            <p><strong>Client:</strong> {marketingProposal.clientName}</p>
            <p><strong>Proposal ID:</strong> {marketingProposal.id}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        {/* Description Section */}
        <div className="proposal-section">
          <p className="proposal-description">{marketingProposal.description}</p>
        </div>
        
        {/* Timeline Section */}
        <div className="proposal-section">
          <h2>Project Phases & Timeline</h2>
          <div className="timeline-container">
            <table className="timeline-table">
              <thead>
                <tr>
                  <th>Phase</th>
                  <th>Key Components</th>
                  <th>Duration</th>
                  <th>Completion Date</th>
                </tr>
              </thead>
              <tbody>
                {marketingProposal.phases.map((phase, index) => (
                  <tr key={index}>
                    <td>{phase.name}</td>
                    <td>
                      <ul className="component-list">
                        {phase.components.map((component, compIndex) => (
                          <li key={compIndex}>{component}</li>
                        ))}
                      </ul>
                    </td>
                    <td>{phase.duration}</td>
                    <td>{phase.completionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Package Details Section */}
        <div className="proposal-section">
          <h2>Detailed Phase Descriptions</h2>
          <div className="phases-details">
            {marketingProposal.phases.map((phase, index) => (
              <div key={index} className="phase-detail">
                <h3>{index + 1}. {phase.name} Phase</h3>
                <p>{phase.description}</p>
                <div className="phase-components">
                  <h4>Components:</h4>
                  <ul>
                    {phase.components.map((component, compIndex) => (
                      <li key={compIndex}>{component}</li>
                    ))}
                  </ul>
                </div>
                <div className="phase-deliverables">
                  <h4>Deliverables:</h4>
                  <ul>
                    {phase.deliverables.map((deliverable, delIndex) => (
                      <li key={delIndex}>{deliverable}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Package Pricing Section */}
        <div className="proposal-section pricing-section">
          <h2>Complete Package</h2>
          <div className="package-card">
            <h3>{marketingProposal.pricing.completePackage.name}</h3>
            <p>{marketingProposal.pricing.completePackage.description}</p>
            <div className="package-price">
              <span className="price">${marketingProposal.pricing.completePackage.price.toLocaleString()}</span>
            </div>
            <div className="package-benefits">
              <h4>Package Benefits:</h4>
              <ul>
                {marketingProposal.pricing.completePackage.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Next Steps Section */}
        <div className="proposal-section">
          <h2>Next Steps</h2>
          <ol className="next-steps-list">
            {marketingProposal.nextSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
        
        {/* Signature Section */}
        <div className="signature-section">
          <h2>Agreement</h2>
          <p>By signing below, I agree to proceed with the Complete Business Package for ${marketingProposal.pricing.completePackage.price.toLocaleString()} as outlined in this proposal.</p>
          
          {!isSigned ? (
            <div className="signature-form">
              <div className="form-group">
                <label htmlFor="clientName">Full Name:</label>
                <input 
                  type="text" 
                  id="clientName" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              
              <div className="signature-canvas-container">
                <p>Sign here:</p>
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseUp={finishDrawing}
                  onMouseMove={draw}
                  onMouseLeave={finishDrawing}
                  className="signature-canvas"
                />
                <button 
                  onClick={clearSignature} 
                  className="clear-button"
                  type="button"
                >
                  Clear Signature
                </button>
              </div>
              
              <button 
                onClick={handleSign} 
                className="sign-button" 
                disabled={name.trim() === '' || isLoading}
                type="button"
              >
                {isLoading ? 'Saving Signature...' : 'Sign Agreement'}
              </button>
            </div>
          ) : (
            <div className="signed-message">
              <p>Agreement signed by <strong>{name}</strong> on <strong>{date}</strong></p>
              <p>Thank you for your business! We'll be in touch shortly to begin the project.</p>
              
              {signatureUrl && (
                <div className="signature-preview">
                  <p>Your signature has been recorded:</p>
                  <img 
                    src={signatureUrl} 
                    alt="Your signature" 
                    className="signature-image" 
                  />
                </div>
              )}
              
              {showPaymentLink && (
                <div className="payment-section">
                  <h3>Payment</h3>
                  <p>To complete your order, please submit your payment using the link below:</p>
                  <button 
                    onClick={handleProceedToPayment} 
                    className="payment-button"
                    type="button"
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;