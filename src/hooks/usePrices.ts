// src/hooks/usePrices.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { APP_CONFIG } from '../config';
import { PriceResponse } from '../types/price'; // Import from your types file

const fetchPrices = async (): Promise<PriceResponse> => {
  const response = await fetch(`${APP_CONFIG.apiUrl}/prices/all`);
  if (!response.ok) throw new Error('Network error');
  return response.json();
};

export const usePrices = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let socket: WebSocket;
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      socket = new WebSocket(APP_CONFIG.wsUrl);

      socket.onmessage = (event) => {
        try {
          const newData = JSON.parse(event.data);
          // Directly update the 'prices' cache with new data
          queryClient.setQueryData(['prices'], newData);
        } catch (err) {
          console.error("WebSocket Parse Error:", err);
        }
      };

      socket.onclose = (e) => {
        console.log('Socket closed. Reconnecting...', e.reason);
        reconnectTimeout = setTimeout(connect, 3000);
      };

      socket.onerror = (err) => {
        console.error("WebSocket Error:", err);
        socket.close();
      };
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socket) socket.close();
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['prices'],
    queryFn: fetchPrices,
    refetchOnWindowFocus: false,
    staleTime: Infinity, // Rely on WS for updates
  });
};
