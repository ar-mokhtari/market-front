// src/config.ts
export const APP_CONFIG = {
    apiUrl: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8080/api/v1',
    wsUrl: process.env.REACT_APP_WS_URL || 'ws://127.0.0.1:8080/ws',
};
