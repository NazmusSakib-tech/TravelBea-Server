const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o7umd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("travel_bea");
        const servicesCollection = database.collection("services_home");
        const bookCollection = database.collection("booking");

        // GET API for all data in home page
        app.get("/services", async (req, res) => {
            const cursor = servicesCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
            // console.log(result);
        })

        // GET API for all data for my orders
        app.get("/myOrders", async (req, res) => {
            const cursor = bookCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
            // console.log(result);
        })

        // GET API for all data for Manage All orders
        app.get("/manageAllOrders", async (req, res) => {
            const cursor = bookCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
            // console.log(result);
        })



         //GET API for single product
         app.get('/serviceDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.findOne(query)
            res.send(result);
            
        })


        // POST API for booking insert
        app.post('/booking', async (req, res) => {
            const bookingUser = req.body;
            console.log('this is product', bookingUser)
            const result = await bookCollection.insertOne(bookingUser);
            res.send(result)
            console.log('this is result', result);
        })

        // POST API for single insert
        app.post('/addSinglePackage', async (req, res) => {
            const product = req.body;
            const result = await servicesCollection.insertOne(product);
            res.send(result)
            console.log('this is result', result);
        })


         //DELETE API
         app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookCollection.deleteOne(query);
            res.send(result);
            
        })


        // Update Single Product From Manage All Orders
        app.put('/updateSingleOrder/:id', async (req, res) =>{
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  status: "Approved"
                }
              };

              const result = await bookCollection.updateOne(filter, updateDoc, options);
              res.json(result);

        })


        console.log("database Connect Successfully");

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('TravelBea server running')
})




app.listen(port, () => {
    console.log("Server running Successfully", port);

});