import express from "express";
import webhookRoutes from "./routes/webhookRoutes.js";
// import dashboardRoutes from "./routes/dashboardRoutes.js";
// import messageRoutes from "./routes/messageRoutes.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use("/webhook", webhookRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
