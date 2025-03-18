"use client";

import { useState, useEffect, useRef } from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Box, Code } from "@chakra-ui/react";

export function ClientIdAlert() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [consoleErrors, setConsoleErrors] = useState<string[]>([]);
  const [alertStatus, setAlertStatus] = useState<'error' | 'warning' | 'info'>('error');
  const errorsCollected = useRef(false);

  useEffect(() => {
    // Only collect errors once to avoid infinite loops
    if (errorsCollected.current) return;
    errorsCollected.current = true;
    
    // Override console.error to capture Thirdweb-related errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Call the original console.error
      originalConsoleError(...args);
      
      // Check if this is a Thirdweb-related error
      const errorString = args.map(arg => 
        typeof arg === 'string' ? arg : JSON.stringify(arg)
      ).join(' ');
      
      if (errorString.includes('thirdweb') || 
          errorString.includes('401') || 
          errorString.includes('Unauthorized') || 
          errorString.includes('clientId')) {
        setConsoleErrors(prev => [...prev, errorString.substring(0, 150) + (errorString.length > 150 ? '...' : '')]);
        setShowAlert(true);
        setAlertStatus('warning');
      }
    };

    // Basic client ID validation
    const clientId = process.env.NEXT_PUBLIC_TW_CLIENT_ID || "";
    const isValidFormat = typeof clientId === 'string' && clientId.length === 32;
    
    if (!clientId) {
      setAlertMessage('Thirdweb client ID is missing. Authentication will fail.');
      setShowAlert(true);
      return;
    }
    
    if (!isValidFormat) {
      setAlertMessage(`Thirdweb client ID format is invalid. Expected 32 characters, got ${clientId.length}.`);
      setShowAlert(true);
      return;
    }
    
    // Set a more generic message initially
    setAlertMessage('Checking Thirdweb authentication...');
    
    // Wait a few seconds to collect any console errors during initialization
    setTimeout(() => {
      if (consoleErrors.length > 0) {
        setAlertMessage('Thirdweb authentication issues detected. See details below.');
      } else {
        // If no specific errors were captured but we still have issues
        const hasAuthIssues = document.querySelectorAll('[data-error="auth"]').length > 0;
        if (hasAuthIssues) {
          setAlertMessage('Thirdweb authentication issues detected. Client ID may be invalid or restricted.');
          setShowAlert(true);
        } else {
          // No visible errors, hide the alert
          setShowAlert(false);
        }
      }
    }, 3000);
    
    // Cleanup
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  if (!showAlert) return null;

  return (
    <Box position="fixed" top="0" left="0" right="0" zIndex="toast">
      <Alert status={alertStatus} variant="solid" flexDirection="column" alignItems="flex-start">
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Flex>
            <AlertIcon />
            <AlertTitle mr={2}>Authentication Issue:</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Flex>
          <CloseButton 
            position="relative"
            onClick={() => setShowAlert(false)} 
          />
        </Flex>
        
        {consoleErrors.length > 0 && (
          <Box mt={4} p={2} bg="blackAlpha.300" borderRadius="md" w="100%" maxH="200px" overflowY="auto">
            <Text fontSize="sm" fontWeight="bold" mb={2}>Console Errors:</Text>
            {consoleErrors.map((error, index) => (
              <Code key={index} display="block" mb={1} fontSize="xs" whiteSpace="pre-wrap" bg="transparent" color="white">
                {error}
              </Code>
            ))}
          </Box>
        )}
      </Alert>
    </Box>
  );
}

// Helper component for Flex since it wasn't imported
const Flex = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <Box display="flex" {...props}>{children}</Box>;
};

// Helper component for Text since it wasn't imported
const Text = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <Box as="p" {...props}>{children}</Box>;
};
