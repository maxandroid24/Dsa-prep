import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for LeetCode proxy
  app.post("/api/leetcode", async (req, res) => {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ status: "error", message: "Username is required" });
    }

    try {
      const response = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://leetcode.com/"
        },
        body: JSON.stringify({
          query: `
            query userRecentAcSubmissions($username: String!, $limit: Int!) {
              recentAcSubmissionList(username: $username, limit: $limit) {
                id
                title
                titleSlug
                timestamp
              }
            }
          `,
          variables: {
            username: username,
            limit: 200
          }
        })
      });

      if (!response.ok) {
        throw new Error(`LeetCode responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        return res.status(400).json({ status: "error", errors: data.errors });
      }

      res.json({ status: "success", data: data.data });
    } catch (err: any) {
      console.error("LeetCode fetch error:", err);
      res.status(500).json({ status: "error", message: err.message || "Failed to fetch LeetCode profile" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
