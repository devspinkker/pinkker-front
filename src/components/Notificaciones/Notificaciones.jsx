import React, { useState, useEffect } from "react";

export default function Notificaciones({}) {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const connectWebSocket = () => {
      console.log("AS");
      const REACT_APP_BACKCHATWS = process.env.REACT_APP_BACKCOMMERCIALWS;
      const newSocket = new WebSocket(
        `${REACT_APP_BACKCHATWS}/ws/pinker_notifications/${"token"}`
      );

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      newSocket.onmessage = (event) => {
        const receivedMessage = JSON.parse(event.data);
        console.log(receivedMessage);
      };

      newSocket.onopen = () => {
        console.log("WebSocket connected");
      };

      setSocket(newSocket);

      return () => {
        newSocket.close();
        console.log("WebSocket disconnected");
      };
    };

    if (!socket) {
      connectWebSocket();
    }
  }, []);

  return (
    <div>
      <h1>als</h1>
    </div>
  );
}
