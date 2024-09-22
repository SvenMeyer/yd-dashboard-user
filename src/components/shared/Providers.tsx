   // src/components/shared/Providers.tsx
   "use client";

   import { ReactNode } from 'react';
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
   import { ThirdwebProvider } from 'thirdweb/react';
   import { ChakraProvider, extendTheme } from '@chakra-ui/react';

   const theme = extendTheme({
     fonts: {
       body: 'Poppins, sans-serif',
       heading: 'Poppins, sans-serif',
     },
   });

   const queryClient = new QueryClient();

   type ProvidersProps = {
     children: ReactNode;
   };

   export function Providers({ children }: ProvidersProps) {
     return (
       <ChakraProvider theme={theme}>
         <ThirdwebProvider>
           <QueryClientProvider client={queryClient}>
             {children}
           </QueryClientProvider>
         </ThirdwebProvider>
       </ChakraProvider>
     );
   }