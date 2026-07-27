import { createRoot } from "react-dom/client";
import "./index.css";
import "./style_vars.css";
import App from "./App.jsx";
import UserContext from "./context/UserContext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <UserContext>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: { background: "#18181B", color: "#fff", borderRadius: "10px", fontSize: "14px" },
        success: { iconTheme: { primary: "#22C55E", secondary: "#fff" } },
        error: { iconTheme: { primary: "#EF4444", secondary: "#fff" } },
      }}
    />
  </UserContext>,
);
