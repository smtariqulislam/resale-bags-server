const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(cors());
app.use(express.json());

//database connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.781yldu.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri);
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
    const catorgoryNameCollection = client.db("oldBagShop").collection("catorgory");
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

    /*

                product add and remove delete
      
      
      */


                app.get('/catorgory',async(req,res)=>{
                  const query={}
                  const catorgoryName = await catorgoryNameCollection.find(query).toArray();
                  res.send(catorgoryName);
                })

    app.get("/product", async (req, res) => {
      const query = {};
      const options = await catorgoryCollection.find(query).toArray();
      res.send(options);
    });

    // Post A product
    app.post("/product", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await catorgoryCollection.insertOne(product);
      // console.log(result);
      res.send(result);
    });

    // product cato
    app.get("/product/:catorgory", async (req, res) => {
      const catorgory = req.params.catorgory;
      // console.log(id);
      const query ={catorgory: catorgory}
      const result = await catorgoryCollection.find(query).toArray();
      // res.send(user);
      // console.log(result);
      res.send(result);
    });

    // Delete a product
    

    // Update A product
    app.put("/product", async (req, res) => {
      const product = req.body;
      // console.log(product);
      const filter = {};
      const options = { upsert: true };
      const updateDoc = {
        $set: product,
      };
      const result = await catorgoryCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    /*

                booking 
      
      
      */

    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const booking = await bookingCollection.find(query).toArray();
      res.send(booking);
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      // console.log(result);
      res.send(result);
    });

    app.get("/booking", async (req, res) => {
      let query = {};
      const options = await bookingCollection.find(query).toArray();
      res.send(options);
    });

    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const booking = await bookingCollection.findOne(query);
      // console.log(id);
      res.send(booking);
    });

    // Cancel a booking  ai matro likhsi
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    /*

                user and admin routes
      
      
      */

    // Get A Single User
    app.get("/user/:email", async (req, res) => {
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
      // console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // console.log("Database Connected...");
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Server is running check client...");
});

app.listen(port, () => {
  console.log(`Server is running Port ${port}`);
});
