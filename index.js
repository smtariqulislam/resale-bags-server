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


//database connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.781yldu.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});



// Decode JWT


// function verifyJWT(req, res, next) {
//   const authHeader = req.headers.authorization

//   if (!authHeader) {
//     return res.status(401).send({ message: 'unauthorized access' })
//   }
//   const token = authHeader.split(' ')[1]

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//     if (err) {
//       return res.status(403).send({ message: 'Forbidden access' })
//     }
//     console.log(decoded)
//     req.decoded = decoded
//     next()
//   })
// }

async function run() {
  try {
    const catorgoryCollection = client.db("oldBagShop").collection("product");
    const usersCollection = client.db("oldBagShop").collection("users");
    const bookingCollection = client.db("oldBagShop").collection("booking");

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

      // console.log(result);

      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });

      // console.log(token);

      res.send({ result, token });
    });

    app.get("/product", async (req, res) => {
      const query = {};
      const options = await catorgoryCollection.find(query).toArray();
      res.send(options);
    });

    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const booking = await bookingCollection.find(query).toArray();
      res.send(booking);
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;

      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

      
      /*

                user and admin routes
      
      
      */

    // Get A Single User
    app.get("/user/:email",  async (req, res) => {
      const email = req.params.email;
      // const decodedEmail = req.decoded.email;

      // if (email !== decodedEmail) {
      //   return res.status(403).send({ message: "forbidden access" });
      // }
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // console.log("Database Connected...");
  }
   finally {
  }
}

run().catch((err) => console.error(err));





app.get("/", (req, res) => {
  res.send("Server is running check client...");
});

app.listen(port, () => {
  console.log(`Server is running...on ${port}`);
});
