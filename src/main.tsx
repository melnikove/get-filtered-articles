import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { resetLS } from "./helpers.ts";

resetLS();

createRoot(document.getElementById("root")!).render(<App />);
