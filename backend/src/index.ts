import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/task", async (req, res) => {
  const task = await prisma.task.findMany();
  res.send(task);
});

app.post("/api/task", async (req, res) => {
  const { task, description } = req.body;

  if (!task || !description) {
    return res.status(400).send("Task and description is required...");
  }

  try {
    const newTask = await prisma.task.create({
      data: {
        task,
        description,
      },
    });

    res.json(newTask);
  } catch (e) {
    res.status(500).send("Intenal Error");
  }
});

app.put("/api/task/:id", async (req, res) => {
  const { task, description } = req.body;
  const id = parseInt(req.params.id);

  if (!task || !description) {
    return res.status(400).send("Task and description is required...");
  }

  if (!id || isNaN(id)) {
    res.status(400).send("Id must be a number...");
  }

  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        task,
        description,
      },
    });

    res.json(updatedTask);
  } catch (e) {
    res.status(500).send("Internal error");
  }
});

app.delete("/api/task/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    res.status(400).send("Id must be a number...");
  }

  // const lastId = await prisma.task.findMany({
  //   orderBy: {
  //     id: "desc",
  //   },
  //   take: 1,
  // });
  //
  // if (id > lastId[0].id) {
  //   res.status(400).send("Data not found");
  // }

  try {
    await prisma.task.delete({
      where: { id },
    });
    res.status(200).send("Task deleted");
  } catch (e) {
    res.status(500).send("Internal error");
  }
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
