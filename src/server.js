const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const shortid = require("shortid");
const fs = require("fs/promises");
const path = require('path')

const dbLocation = path.resolve('src', 'data.json')

const app = express();
app.use([morgan("dev"), cors(), express.json()]);

app.post("/", async (req, res) => {
  const player = {
    id: shortid.generate(),
    ...req.body,
  };

  const data = await fs.readFile(dbLocation, 'utf8');
  const players = JSON.parse(data)
  players.push(player)

  await fs.writeFile(dbLocation, JSON.stringify(players))

  res.status(201).json(player);
});


app.get("/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  console.log(`localhost: ${port}`);
});
