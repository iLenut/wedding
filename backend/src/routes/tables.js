import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

/*
    GET tables
*/
router.get("/", async (req, res) => {
  const tables = await prisma.table.findMany({
    include: {
      guests: {
        orderBy: {
          name: "asc",
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  res.json(tables);
});

/*
    CREATE table
*/
router.post("/", async (req, res) => {
  const table = await prisma.table.create({
    data: req.body,
  });

  res.status(201).json(table);
});

/*
    UPDATE table
*/
router.put("/:id", async (req, res) => {
  const table = await prisma.table.update({
    where: {
      id: Number(req.params.id),
    },
    data: req.body,
  });

  res.json(table);
});

/*
    DELETE table
*/
router.delete("/:id", async (req, res) => {
  await prisma.table.delete({
    where: {
      id: Number(req.params.id),
    },
  });

  res.sendStatus(204);
});

export default router;
