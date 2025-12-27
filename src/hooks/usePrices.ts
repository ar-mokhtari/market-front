import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { APP_CONFIG } from '../config';
import { PriceResponse } from '../types/price';

const fetchPrices = async (): Promise<PriceResponse> => {
  const response = await fetch(`${APP_CONFIG.apiUrl}/prices/all`);
  if (!response.ok) throw new Error('Network error');
  return response.json();
};

export const usePrices = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);


  useEffect(() => {
    let socket: WebSocket;
    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let isComponentMounted = true;

    const connect = () => {
      // Add a small delay to ensure page is fully stable
      reconnectTimeout = setTimeout(() => {
        if (!isComponentMounted) return;

        socket = new WebSocket(APP_CONFIG.wsUrl);

        socket.onopen = () => {
          if (isComponentMounted) setIsConnected(true);
        };

        socket.onmessage = (event) => {
          try {
            const newData = JSON.parse(event.data);
            queryClient.setQueryData(['prices'], newData);
          } catch (err) {
            console.error("WS Parse Error:", err);
          }
        };

        socket.onclose = () => {
          if (isComponentMounted) {
            setIsConnected(false);
            reconnectTimeout = setTimeout(connect, 3000);
          }
        };
      }, 100); // 100ms delay
    };

    connect();

    return () => {
      isComponentMounted = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socket) socket.close();
    };
  }, [queryClient]);

  const query = useQuery({
    queryKey: ['prices'],
    queryFn: fetchPrices,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return { ...query, isConnected };
};
