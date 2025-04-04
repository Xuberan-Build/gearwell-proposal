import { ref, uploadString, getDownloadURL, getMetadata, updateMetadata } from "firebase/storage";
import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db, auth } from "./firebase";
import { v4 as uuidv4 } from 'uuid';

/**
 * Securely uploads a signature to Firebase Storage with enhanced security
 * @param canvas - The canvas element containing the signature
 * @param proposalId - The ID of the proposal being signed
 * @param userName - The name of the user signing the document
 * @returns Promise with the download URL of the uploaded signature
 */
export const uploadSignatureToStorage = async (
  canvas: HTMLCanvasElement,
  proposalId: string,
  userName: string
): Promise<string> => {
  try {
    // Generate a unique ID for this signature
    const signatureId = uuidv4();
    
    // Convert canvas to data URL (PNG format)
    const dataUrl = canvas.toDataURL("image/png");
    
    // Create a structured path for better security and organization
    // Format: signatures/proposalId/timestamp-signatureId.png
    const fileName = `signatures/${proposalId}/${Date.now()}-${signatureId}.png`;
    
    // Create a storage reference
    const storageRef = ref(storage, fileName);
    
    // Set custom metadata for the file for better tracking and security
    const metadata = {
      contentType: 'image/png',
      customMetadata: {
        proposalId,
        signerName: userName,
        uploadedAt: new Date().toISOString(),
        signatureId,
      }
    };
    
    // Upload the data URL as a string with metadata
    const snapshot = await uploadString(storageRef, dataUrl, 'data_url', metadata);
    
    // Add content disposition to prevent direct browser rendering
    await updateMetadata(storageRef, {
      contentDisposition: `attachment; filename="${signatureId}.png"`
    });
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Return the download URL
    return downloadURL;
  } catch (error) {
    console.error("Error uploading signature:", error);
    throw error;
  }
};

/**
 * Saves signature data to Firestore with additional security metadata
 * @param proposalId - The ID of the proposal being signed
 * @param userName - The name of the user signing the document
 * @param signatureUrl - The download URL of the uploaded signature
 * @param packagePrice - The price of the package being purchased
 * @returns Promise with the ID of the created document
 */
export const saveSignatureData = async (
  proposalId: string,
  userName: string,
  signatureUrl: string,
  packagePrice: number
): Promise<string> => {
  try {
    // Create a unique ID for this signature record
    const signatureId = uuidv4();
    
    // Prepare the signature data with comprehensive metadata
    const signatureData = {
      id: signatureId,
      proposalId,
      signerName: userName,
      signatureUrl,
      packagePrice,
      // Use server timestamp for more accurate record-keeping
      timestamp: serverTimestamp(),
      status: 'signed',
      clientInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        // Add IP address later via a secure server function
      },
      // For audit trail
      eventLog: [{
        event: 'signature_created',
        timestamp: new Date().toISOString()
      }]
    };
    
    // Save to Firestore with the custom ID
    await setDoc(doc(db, "signatures", signatureId), signatureData);
    
    // Store a record in the proposals collection too for easier lookup
    const proposalRef = doc(db, "proposals", proposalId);
    const signatureRef = doc(db, "signatures", signatureId);
    
    // Update the proposal with the signature reference
    await setDoc(
      proposalRef, 
      { 
        status: 'signed',
        signedBy: userName,
        signedAt: serverTimestamp(),
        signatureReference: signatureRef
      }, 
      { merge: true }
    );
    
    // Return the signature document ID
    return signatureId;
  } catch (error) {
    console.error("Error saving signature data:", error);
    throw error;
  }
};

/**
 * Validates if a signature exists for a specific proposal
 * @param proposalId - The ID of the proposal to check
 * @returns Promise with boolean indicating if the proposal has been signed
 */
export const checkProposalSignature = async (proposalId: string): Promise<boolean> => {
  try {
    // Implementation would depend on your Firestore structure
    // This is a placeholder for the validation logic
    return false;
  } catch (error) {
    console.error("Error checking signature:", error);
    return false;
  }
};