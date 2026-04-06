import router from "./router"; // This will now automatically look for index.js
import "./style.css";
import app from "./app.js";

// Standard Vue instantiation
app.use(router).mount("#app");
