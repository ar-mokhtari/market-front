import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PriceList } from './components/PriceList';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-950">
        <PriceList />
      </div>
    </QueryClientProvider>
  );
}

export default App;
