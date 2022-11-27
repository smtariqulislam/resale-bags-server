const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion} = require("mongodb");
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
    const catorgoryCollection = client.db("oldBagShop").collection("product");
    const usersCollection = client.db("oldBagShop").collection("users");
    const bookingCollection = client.db("oldBagShop").collection('booking')
      app.get("/product", async (req, res) => {
        const query = {};
        const options = await catorgoryCollection.find(query).toArray();
        res.send(options);
      });

    // Save user email & generate JWT
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result);

      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      console.log(token);
      res.send({ result, token });
    });


    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      // console.log(booking);
      // const query = {
      //   appointmentDate: booking.appointmentDate,
      //   email: booking.email,
      //   treatment: booking.treatment,
      // };

      // const alreadyBooked = await bookingCollection.find(query).toArray();

      // if (alreadyBooked.length) {
      //   const message = `You already have a booking on ${booking.appointmentDate}`;
      //   return res.send({ acknowledged: false, message });
      // }

      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });


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
