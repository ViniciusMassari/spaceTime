import { PrismaClient } from "@prisma/client";

// faz um log de todas as queries feitas no bd
// conexão com o bd

export const prisma = new PrismaClient({
  log: ["query"],
});
