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
  try {
    const id = Number(req.params.id);

    const guest = await prisma.guest.update({
      where: { id },
      data: {
        name: req.body.name,
        groupName: req.body.groupName,
        confirmed: req.body.confirmed,
        advancePaid: req.body.advancePaid,
        menuType: req.body.menuType,
        notes: req.body.notes,
        attending: req.body.attending,
        tableId: req.body.tableId,
      },
    });

    res.json(guest);
  } catch (error) {
    console.error("Guest update failed:", error);
    res.status(500).json({
      error: "Guest update failed",
      details: error.message,
    });
  }
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
