   // src/components/shared/Providers.tsx
   "use client";

   import { ReactNode } from 'react';
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
   import { ThirdwebProvider } from 'thirdweb/react';

   const queryClient = new QueryClient();

   type ProvidersProps = {
     children: ReactNode;
   };

   export function Providers({ children }: ProvidersProps) {
     return (
       <ThirdwebProvider>
         <QueryClientProvider client={queryClient}>
           {children}
         </QueryClientProvider>
       </ThirdwebProvider>
     );
   }