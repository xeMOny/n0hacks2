import express from "express";
import cors from "cors";
import "dotenv/config";
import { authRouter } from "./modules/auth/routes.js";
import { lmsRouter } from "./modules/lms/routes.js";
import { crmRouter } from "./modules/crm/routes.js";
import { intranetRouter } from "./modules/intranet/routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/lms", lmsRouter);
app.use("/api/crm", crmRouter);
app.use("/api/intranet", intranetRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Malta API escuchando en :${port}`));
