import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON parsing middleware
  app.use(express.json());

  const overridesPath = path.join(process.cwd(), "src", "data", "image_overrides.json");

  // API Route: Get image overrides directly from the codebase
  app.get("/api/image-overrides", async (req, res) => {
    try {
      const data = await fs.readFile(overridesPath, "utf-8");
      res.json(JSON.parse(data));
    } catch (e) {
      res.json({});
    }
  });

  // API Route: Securely update an image override in the codebase (with passcode verification)
  app.post("/api/update-image", async (req, res) => {
    const { key, imageUrl, passcode, action } = req.body;
    
    // We require a passcode for security and authorization
    const teacherPasscode = process.env.TEACHER_PASSCODE || "20302060";

    if (passcode !== teacherPasscode) {
      return res.status(403).json({ error: "خطأ في رمز مرور الصلاحية! يرجى إدخال الباسورد الصحيح لإجراء التعديل." });
    }

    if (!key) {
      return res.status(400).json({ error: "المفتاح التعريفي للسلايد مطلوب." });
    }

    try {
      let overrides: Record<string, string> = {};
      try {
        const fileContent = await fs.readFile(overridesPath, "utf-8");
        overrides = JSON.parse(fileContent);
      } catch (e) {
        overrides = {};
      }

      if (action === "delete") {
        delete overrides[key];
      } else {
        if (!imageUrl || !imageUrl.trim()) {
          return res.status(400).json({ error: "رابط الصورة مطلوب لمتابعة الحفظ." });
        }
        overrides[key] = imageUrl.trim();
      }

      // Write changes back to the actual workspace file
      await fs.writeFile(overridesPath, JSON.stringify(overrides, null, 2), "utf-8");
      
      res.json({ success: true, overrides });
    } catch (error: any) {
      res.status(500).json({ error: "فشل حفظ الملف البرمجي: " + error.message });
    }
  });

  // Serve Vite / UI static build
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
