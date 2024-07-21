import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/globals.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
document.title = "Profile Portal";
root.render(
  <html lang="en">
    <head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <title>Profile Portal</title>
    </head>
    <body>
      <App />
    </body>
  </html>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
