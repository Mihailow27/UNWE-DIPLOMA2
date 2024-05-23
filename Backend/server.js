const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "server.quacksea.com",
  user: "admin_void",
  password: "SsMWcLd7ceam7afb",
  database: "admin_void",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

app.get("/", (req, res) => {
  return res.json("From backend");
});

app.get("/all", (req, res) => {
  const sql = "SELECT * FROM 20118055_posts";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.delete("/del", (req, res) => {
  const { id } = req.query;
  const sql = "DELETE FROM orders WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.json(err);
    return res.send("Order Deleted");
  });
});

app.get("/show", (req, res) => {
  const sql = "SELECT * FROM orders";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/add", (req, res) => {
  const { img, name, content, price } = req.body;
  const sql =
    "INSERT INTO products (img, name, content, price) VALUES (?, ?, ?, ?)";
  db.query(sql, [img, name, content, price], (err, result) => {
    if (err) return res.json(err);
    const newPost = {
      id: result.insertId,
      img,
      name,
      content,
      price,
    };
    return res.json(newPost);
  });
});

// Define the /buy route
app.post("/buy", (req, res) => {
  const { product_id, name, phone } = req.body;
  const sql = "INSERT INTO orders (product_id, name, phone) VALUES (?, ?, ?)";
  db.query(sql, [product_id, name, phone], (err, result) => {
    if (err) return res.json(err);
    const newOrder = {
      id: result.insertId,
      product_id,
      name,
      phone,
    };
    return res.send("Order Completed");
  });
});

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
