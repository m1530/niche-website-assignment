const express = require('express');
const app = express();
const port = process.env.PORT || 7000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1u7a3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('car-website');
        const productsCollection = database.collection('products');
        const orderCollection = database.collection('orders');
        const usersCollection = database.collection('users');
        const reviewCollection = database.collection('review');
        const newsCollection = database.collection('news');

        // get all services from database
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
        });
        // create a new product
        app.post('/products', async (req, res) => {
            const data = req.body;
            const product = await productsCollection.insertOne(data);
            res.json(product);
        });

        // get product by id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.json(product);
        });

        // delete my product
        app.delete('/products/:id', async (req, res) => {
            const itemId = req.params.id;
            const query = { _id: ObjectId(itemId) };
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        });

        // insert order
        app.post('/order', async (req, res) => {
            const data = req.body;
            const result = await orderCollection.insertOne(data);
            res.json(result);
        });

        // get all order
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });
        // delete Order
        app.delete('/order/:id', async (req, res) => {
            const itemId = req.params.id;
            const query = { _id: ObjectId(itemId) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });

        // insert user info from email
        app.post('/users', async (req, res) => {
            const data = req.body;
            const result = await usersCollection.insertOne(data);
            res.json(result);
        });
        // create review
        app.post('/makeReview', async (req, res) => {
            const data = req.body;
            const result = await reviewCollection.insertOne(data);
            res.json(result);
        });
        // get all review
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.json(reviews);
        });
        // insert user info from google
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email, displayName: user.displayName };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // get my order
        app.get('/myorders/:email', async (req, res) => {
            const data = { email: req.params.email };
            const result = await orderCollection.find(data).toArray();
            res.json(result);
        });


        // delete my order
        app.delete('/orders/:id', async (req, res) => {
            const itemId = req.params.id;
            const query = { _id: ObjectId(itemId) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });

        // make admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });
        // Check admin
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });


        //update status
        app.put('/order/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        });

        // get all News
        app.get('/news', async (req, res) => {
            const cursor = newsCollection.find({});
            const news = await cursor.toArray();
            res.json(news);
        });

        // read specific news
        app.get('/news/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const news = await newsCollection.findOne(query);
            res.json(news);
        });

        // create news
        app.post('/addNews', async (req, res) => {
            const data = req.body;
            const result = await newsCollection.insertOne(data);
            res.json(result);
        });


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('add connection');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})