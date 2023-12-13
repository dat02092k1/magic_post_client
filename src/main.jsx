import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { StoreProvider } from "easy-peasy";
import { store } from "./store/store.js";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfigProvider
    theme={{
      token: {
        // Seed Token
        colorPrimary: "#266191",
      },
    }}
  >
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  </ConfigProvider>
);
