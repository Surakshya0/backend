import express from "express";
import router from "./routes/index";
import authRoutes from "./routes/auth";
import productRouter from "./routes/product.route";

const app = express();
const PORT: number = Number(process.env.PORT) || 5000;

// Global middleware
app.use(express.json());

//  Routes
app.use("/api", router);      // all general routes
app.use("/auth", authRoutes); // authentication routes

app.use("/api/product", productRouter);



//  Start server
app.listen(PORT, () => {
  console.log(`✅ YAYY API running at http://localhost:${PORT}`);
});

export default app;
