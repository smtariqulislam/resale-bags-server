const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.781yldu.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


async function run() {
  try {
    const userCollection = client.db("oldBagShop").collection("users");


    console.log("Database Connected...");
  } finally {
  }
}

run().catch((err) => console.error(err));



app.get("/", (req, res) => {
  res.send("Server is running check client...");
});

app.listen(port, () => {
  console.log(`Server is running...on ${port}`);
});
