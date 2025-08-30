import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import "dotenv/config";


const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

let notes = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) => {
  try {
    let sortBy = req.query.sort || "rating DESC";
    const result = await db.query(`SELECT * FROM notes ORDER BY ${sortBy}`);
    notes = result.rows;
    res.render("index.ejs", {
      notes: notes,
    });
  } catch (err){
    console.log(err);
  }
});

app.get("/book/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM notes WHERE id = $1", [req.params.id]);
    res.render("book.ejs", {
      note: result.rows[0],
    });
  } catch(err) {
    console.log(err);
  }
});

app.get("/search/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM notes WHERE title LIKE '%' || $1 || '%'", [req.query.q]);
    notes = result.rows;
    res.render("search.ejs", {
      notes: notes,
    });
  } catch(err) {
    console.log(err);
  }
})




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});