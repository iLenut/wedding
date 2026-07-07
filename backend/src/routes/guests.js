import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

/*
    GET all guests
*/
router.get("/", async (req, res) => {
  const guests = await prisma.guest.findMany({
    include: {
      table: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  res.json(guests);
});

/*
    GET guest
*/
router.get("/:id", async (req, res) => {
  const guest = await prisma.guest.findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: {
      table: true,
    },
  });

  if (!guest)
    return res.status(404).json({
      message: "Guest not found",
    });

  res.json(guest);
});

/*
    CREATE
*/
router.post("/", async (req, res) => {
  const guest = await prisma.guest.create({
    data: req.body,
  });

  res.status(201).json(guest);
});

/*
    UPDATE
*/
router.put("/:id", async (req, res) => {
  const guest = await prisma.guest.update({
    where: {
      id: Number(req.params.id),
    },
    data: req.body,
  });

  res.json(guest);
});

/*
    DELETE
*/
router.delete("/:id", async (req, res) => {
  await prisma.guest.delete({
    where: {
      id: Number(req.params.id),
    },
  });

  res.sendStatus(204);
});

export default router;
