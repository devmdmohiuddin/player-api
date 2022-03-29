const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const shortid = require("shortid");
const fs = require("fs/promises");
const path = require("path");

const dbLocation = path.resolve("src", "data.json");

const app = express();
app.use([morgan("dev"), cors(), express.json()]);

app.post("/", async (req, res) => {
  const player = {
    id: shortid.generate(),
    ...req.body,
  };

  const data = await fs.readFile(dbLocation, "utf8");
  const players = JSON.parse(data);
  players.push(player);

  await fs.writeFile(dbLocation, JSON.stringify(players));

  res.status(201).json(player);
});

app.get("/", async (req, res) => {
  const data = await fs.readFile(dbLocation, "utf8");
  const players = JSON.parse(data);

  res.status(200).json(players);
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;

  const data = await fs.readFile(dbLocation, "utf8");
  const players = JSON.parse(data);

  const player = players.find((item) => item.id === id);
  console.log(player);

  if (!player) {
    return res.status(404).json({ message: "Player Not Found!" });
  }

  res.status(200).json(player);
});

app.patch("/:id", async (req, res) => {
  const id = req.params.id;

  const data = await fs.readFile(dbLocation, "utf8");
  const players = JSON.parse(data);

  const player = players.find((item) => item.id === id);

  if (!player) {
    return res.status(404).json({ message: "Player Not Found!" });
  }

  player.name = req.body.name || player.name;
  player.country = req.body.country || player.country;
  player.rank = req.body.rank || player.rank;

  await fs.writeFile(dbLocation, JSON.stringify(players));
  res.status(200).json(player);
});

app.put("/:id", async (req, res) => {
  const id = req.params.id;

  const data = await fs.readFile(dbLocation, "utf8");
  const players = JSON.parse(data);

  const player = players.find((item) => item.id === id);

  if (!player) {
    const player = {
      id: shortid.generate(),
      ...req.body,
    };
    players.push(player);
  } else {
    player.name = req.body.name;
    player.country = req.body.country;
    player.rank = req.body.rank;
  }

  await fs.writeFile(dbLocation, JSON.stringify(players));
  res.status(200).json(player);
});

app.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const data = await fs.readFile(dbLocation, "utf8");
  const players = JSON.parse(data);

  const player = players.find((item) => item.id === id);

  if (!player) {
    return res.status(404).json({ message: "Player Not Found!" });
  }

  const newPlayers = players.filter(item => item.id !== id)

  await fs.writeFile(dbLocation, JSON.stringify(newPlayers));
  res.status(203).send();
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  console.log(`localhost: ${port}`);
});
