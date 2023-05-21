import "dotenv/config";

import fastify from "fastify";
import { memoriesRoutes } from "./routes/memories";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import { authRoutes } from "./routes/auth";
import { uploadRoutes } from "./routes/upload";
import { resolve } from "node:path";

const app = fastify();

app.register(multipart);

app.register(require("@fastify/static"), {
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads",
});

// registro do jwt
// o secret é uma maneira de diferenciar os jwt
// do nosso back-end de jwt's de outros back-ends
// não deve ser uma string simples
app.register(jwt, {
  secret: "spacetime",
});

// registro do cors, true = qualquer url
// também pode ser uma array com as urls
app.register(cors, {
  origin: true,
});
// método usado para registrar um arquivo de rotas separado

app.register(authRoutes);
app.register(memoriesRoutes);
app.register(uploadRoutes);
/* listen recebe um objeto de configurações, no momento
estamos configurando a porta usada em desenvolvimento e como retorna uma promise
usamos um then que nos avisa quando o servidor foi subido */
// host é para a autenticação funcionar no mobile
app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => console.log("HTTP server running on http://localhost:3333 👀"));
