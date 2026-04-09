const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

let show = null;
let seats = [];

function generateSeats() {
  seats = [];
  const letters = "ABCDEFGHIJK";
  for (let r = 0; r < letters.length; r++) {
    for (let n = 1; n <= 11; n++) {
      seats.push({
        seat: letters[r] + n,
        booked: false,
        name: null
      });
    }
  }
}

// Create show
app.post("/show", (req, res) => {
  if (show) return res.json({ error: "show exists" });
  show = req.body;
  generateSeats();
  io.emit("showCreated", show);
  res.json({ status: "created" });
});

// Get show + seats
app.get("/show", (req, res) => {
  res.json({ show, seats });
});

// Book specific seat
app.post("/book", (req, res) => {
  const { name, seat } = req.body;
  const target = seats.find(s => s.seat === seat);
  if (!target) return res.json({ error: "invalid seat" });
  if (target.booked) return res.json({ error: "seat taken" });

  target.booked = true;
  target.name = name;

  io.emit("seatBooked", target);
  res.json(target);
});

// Delete show
app.delete("/show", (req, res) => {
  show = null;
  seats = [];
  io.emit("showDeleted");
  res.json({ status: "deleted" });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});