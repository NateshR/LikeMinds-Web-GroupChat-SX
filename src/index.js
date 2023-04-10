import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import LikeMinds from "likeminds-chat-beta";

export const myClient = new LikeMinds({
  apiKey: process.env.REACT_APP_API_KEY,
  baseUrl: process.env.REACT_APP_BASE_URL,
  xVersionCode: process.env.REACT_APP_XVERSION_CODE,
  xPlatformCode: process.env.REACT_APP_XPLATFORM_CODE,
  baseUrlCaravan: process.env.REACT_APP_BASE_URL_CARAVAN,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(// console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export const UserContext = React.createContext({
  currentUser: null,
  setCurrentUser: () => {},
  community: {},
  setCommunity: () => {},
});
