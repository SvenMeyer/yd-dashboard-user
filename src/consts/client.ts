import { createThirdwebClient, type ThirdwebClient } from "thirdweb";
import { NFT_CONTRACTS } from "./nft_contracts";

// Get the client ID from environment variables
const clientId = process.env.NEXT_PUBLIC_TW_CLIENT_ID || "";

// Validate client ID format (should be a string with 32 characters)
let isValidClientId = false;
try {
  isValidClientId = typeof clientId === 'string' && clientId.length === 32;
  
  if (typeof window !== 'undefined') {
    if (!clientId) {
      console.error('Thirdweb client ID is missing. Authentication will fail.');
    } else if (!isValidClientId) {
      console.error(`Thirdweb client ID format is invalid. Expected 32 characters, got ${clientId.length}.`);
    } else {
      console.log('Thirdweb client ID validation passed.');
    }
  }
} catch (error) {
  console.error('Error validating client ID:', error);
}

// Create the client using the approach from ThirdWeb example
let client: ThirdwebClient;
try {
  client = createThirdwebClient({
    clientId,
  });
  
  if (typeof window !== 'undefined') {
    console.log('Thirdweb client created successfully.');
  }
} catch (error) {
  console.error('Error creating Thirdweb client:', error);
  // Create a fallback client to prevent app from crashing
  client = createThirdwebClient({
    clientId: "",
  });
}

// Get the default contract configuration
const defaultContract = NFT_CONTRACTS[0];

// Export only what's needed
export { 
  client, 
  clientId,
  defaultContract
};
