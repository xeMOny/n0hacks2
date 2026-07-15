import { Router } from "express";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { validateBody } from "../../middleware/validate.js";
import { env } from "../../config/env.js";
import { CHAT_SYSTEM_PROMPT } from "./knowledge.js";

export const chatRouter = Router();

// Cliente único, creado solo si hay clave — evita instanciar el SDK sin
// credenciales y deja clarísimo en /api/chat cuándo la feature no está
// configurada, en vez de fallar de forma críptica en la primera petición.
const client = env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: env.ANTHROPIC_API_KEY }) : null;

const MAX_HISTORY_TURNS = 12;

const chatSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      })
    )
    .max(MAX_HISTORY_TURNS)
    .optional()
    .default([]),
});

// POST /api/chat — chatbot público de la landing, sin autenticación (lo usan
// visitantes anónimos). Sin persistencia: el historial de la conversación lo
// guarda el navegador y lo reenvía completo en cada turno (acotado a
// MAX_HISTORY_TURNS para no descontrolar el coste por request).
chatRouter.post("/", validateBody(chatSchema), async (req, res) => {
  if (!client) {
    return res.status(503).json({ error: "El chat no está configurado todavía" });
  }

  const { message, history } = req.body as z.infer<typeof chatSchema>;

  try {
    const response = await client.messages.create({
      model: env.CHAT_MODEL,
      max_tokens: 1024,
      system: CHAT_SYSTEM_PROMPT,
      messages: [...history, { role: "user", content: message }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    res.json({ reply: textBlock?.type === "text" ? textBlock.text : "" });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error("Error del chat (Anthropic):", err.status, err.message);
      return res.status(502).json({ error: "El asistente no está disponible en este momento, inténtalo de nuevo en unos segundos" });
    }
    throw err;
  }
});
