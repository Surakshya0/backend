import { Client } from "pg";

// ✅ Setup database connection
const client = new Client({
  connectionString: "postgres://postgres:postgres123@localhost:5324/Intern",
});

// connect to DB
client.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err: Error) => console.error("❌ DB connection error:", err));

export default client;
