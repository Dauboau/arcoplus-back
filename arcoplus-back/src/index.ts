import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import { HttpStatusCode } from "elysia-http-status-code";
import { Logestic } from "logestic";

const app = new Elysia()
  .use(cors())
  .use(Logestic.preset('fancy'))
  .use(HttpStatusCode())

  .get("/", () => "Arcoplus API")
  
  .get("/123", () => "teste")

  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
