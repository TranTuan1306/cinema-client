import React from "react";
import ReactDOM from "react-dom";
import Axios from "axios";
import App from "./App";
import { AuthContextProvider } from "./authContext/AuthContext";

Axios.defaults.baseURL = process.env.API_URL || "https://ute-cinema-api.herokuapp.com/api/";

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
