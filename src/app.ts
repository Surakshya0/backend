import express from "express";

import router from "./routes/index"; // remove `.js` when using TS

const app = express();
const PORT: number = Number(process.env.PORT) || 5000;

// middleware
app.use(express.json());

// use routes
app.use("/api", router);

// start server
app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
});

export default app;
