import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";
import NotificationProvider from "./components/Notifications/NotificationProvider";
import ThemeProvider from "./theme/ThemeProvider";

import DataProvider from './redux/store'
import ChatMessageProvider from './hooks/chatmessage/ChatMessageProvider'
import { AuthProvider } from "./components/AuthContext";

ReactDOM.render(
  <NotificationProvider>
    <ThemeProvider>
      <DataProvider>
        <AuthProvider>
          <App />
          </AuthProvider>
      </DataProvider>
    </ThemeProvider>
  </NotificationProvider>
  ,
  document.getElementById("root")
);
