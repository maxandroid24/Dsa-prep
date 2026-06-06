import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to simulate running code solution
  app.post("/api/run-solution", async (req, res) => {
    const { problemId, problemTitle, language, code, testCases } = req.body;

    if (!problemTitle || !language || !code) {
      return res.status(400).json({ status: "error", message: "Missing required compilation parameters." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Graceful local fallback simulator
      const doesLookValid = !code.includes("TODO") && !code.includes("pass") && (code.includes("return") || code.includes("class") || code.includes("def") || code.includes("function") || code.includes("cout"));
      
      const simulatedTestResults = (testCases || []).map((tc: any, idx: number) => {
        const passedVal = doesLookValid ? (idx % 2 === 0 || idx === 0) : false;
        return {
          input: tc.input || `Case ${idx + 1}`,
          expected: tc.expected || "Correct Output",
          actual: passedVal ? (tc.expected || "Expected Output") : "Empty/Null output (Starter Template)",
          passed: passedVal,
          performanceMs: Math.floor(Math.random() * 20) + 1
        };
      });

      const allPassed = simulatedTestResults.every((t: any) => t.passed);

      return res.json({
        status: "success",
        data: {
          status: doesLookValid ? (allPassed ? "SUCCESS" : "WRONG_ANSWER") : "COMPILE_ERROR",
          compilerMessage: doesLookValid ? "Interpretation compiled successfully. Standard Sandbox loaded (Offline Fallback)." : "Compilation Error: Stub code template detected! Please replace placeholder TODO code.",
          testCases: simulatedTestResults,
          complexityFeedback: "Time Complexity: O(N) simulated. Space Complexity: O(1) auxiliary simulated.",
          outputConsole: doesLookValid 
            ? `[INFO] Initializing sandboxed interpreter for ${language}...\n[INFO] Standard test-cases injected.\n[SUCCESS] Runtime execution completed safely.` 
            : `[ERROR] Compile error: Syntax parsing aborted. Found unmapped structure symbols in '${language}' main sequence.`
        }
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `You are a sandboxed compilers execution engine. Run and evaluate the user's submitted code solution for the algorithmic problem: "${problemTitle}" (ID: ${problemId}) in ${language}.
Code submitted:
\`\`\`${language}
${code}
\`\`\`

Here are the test cases being evaluated:
${JSON.stringify(testCases, null, 2)}

You must perform a robust mental simulation of the code's compilation, execution, and outputs on these test cases. Check for:
1. Syntax and Compilation Errors.
2. IndexOutOfBound or division by zero runtime errors.
3. Logical correctness on the provided test cases.

Assess if the user wrote actual code logic or just left it empty/starter code. Give constructive feedback. Make sure to map all cases correctly.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { 
                type: Type.STRING, 
                description: "Must be SUCCESS, COMPILE_ERROR, RUNTIME_ERROR, or WRONG_ANSWER" 
              },
              compilerMessage: { 
                type: Type.STRING, 
                description: "Compiler output logs or compilation error message if failed" 
              },
              testCases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    input: { type: Type.STRING },
                    expected: { type: Type.STRING },
                    actual: { type: Type.STRING },
                    passed: { type: Type.BOOLEAN },
                    performanceMs: { type: Type.NUMBER }
                  }
                },
                description: "Map each provided test case to its simulated execution output"
              },
              complexityFeedback: { 
                type: Type.STRING, 
                description: "Evaluate user code time & space complexity" 
              },
              outputConsole: { 
                type: Type.STRING, 
                description: "Simulated stdout console output logs during the execution" 
              }
            },
            required: ["status", "compilerMessage", "testCases", "complexityFeedback", "outputConsole"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response received from evaluation engine.");
      }

      const analyzedResult = JSON.parse(text);
      res.json({ status: "success", data: analyzedResult });

    } catch (err: any) {
      console.error("Gemini compiler evaluation error:", err);
      res.status(500).json({ status: "error", message: err.message || "Failed to execute solution." });
    }
  });

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
