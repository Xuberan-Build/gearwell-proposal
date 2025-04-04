import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "./firebase";
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a signature to Firebase Storage
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
    
    // Create a path for the signature that includes the userName
    const sanitizedUserName = userName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const fileName = `signatures/${proposalId}/${Date.now()}-${sanitizedUserName}-${signatureId}.png`;
    
    // Create a storage reference
    const storageRef = ref(storage, fileName);
    
    // Upload the data URL as a string
    const snapshot = await uploadString(storageRef, dataUrl, 'data_url');
    
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
 * Saves signature data to Firestore
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
    // Generate a unique ID for this signature record
    const signatureId = uuidv4();
    
    // Prepare the signature data
    const signatureData = {
      id: signatureId,
      proposalId,
      signerName: userName,
      signatureUrl,
      packagePrice,
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
    
    return signatureId;
  } catch (error) {
    console.error("Error saving signature data:", error);
    throw error;
  }
};