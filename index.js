const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('PCCC Identity Portal Server is boiling!');
})

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.63zdo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        // Fetching database collection
        const clubMembersCollection = client.db('PCCCStudentIdentityPortal').collection('clubMembers');

        // -----------------------------Club Members Related APIs-----------------------------\\
        // Get all club members
        app.get('/clubMembers', async (req, res) => {
            const result = await clubMembersCollection.find().toArray();
            res.send(result);
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(PORT);