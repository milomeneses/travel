import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "data", "newsletter.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const readNewsletterEntries = async () => {
  try {
    const raw = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
};

const writeNewsletterEntries = async (entries) => {
  await fs.writeFile(dataFile, JSON.stringify(entries, null, 2));
};

app.get("/api/newsletter", async (_req, res) => {
  const entries = await readNewsletterEntries();
  res.json({ entries });
});

app.post("/api/newsletter", async (req, res) => {
  const { name, email } = req.body;
  if (!email) {
    res.status(400).json({ message: "Email is required." });
    return;
  }

  const entries = await readNewsletterEntries();
  const entry = {
    id: Date.now(),
    name: name || "",
    email,
    createdAt: new Date().toISOString()
  };
  entries.unshift(entry);
  await writeNewsletterEntries(entries);
  res.status(201).json({ entry });
});

app.get("/admin", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
