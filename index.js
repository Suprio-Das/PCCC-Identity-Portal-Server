const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const committeeMembersCollection = client.db('PCCCStudentIdentityPortal').collection('committeeMembers');

        // -----------------------------Club Members Related APIs-----------------------------\\
        // Get all club members
        app.get('/clubMembers', async (req, res) => {
            const result = await clubMembersCollection.find().toArray();
            res.send(result);
        })

        // Get Members Batch-wise
        app.get('/batchWiseClubMembers', async (req, res) => {
            const batch = req.query.batch;
            const query = { "Batch": batch };
            console.log(query)
            const result = await clubMembersCollection.find(query).toArray();
            console.log(result)
            res.send(result)
        })

        // Add a single Club member
        app.post('/clubMembers', async (req, res) => {
            const data = req.body;
            const result = await clubMembersCollection.insertOne(data);
            res.send(result);
        })

        // -----------------------------Club Committee Members Related APIs-----------------------------\\
        app.get('/committeeMembers', async (req, res) => {
            const result = await committeeMembersCollection.find().toArray();
            res.send(result);
        })

        // Update single member info
        app.put('/committeeMembers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedInfo = {
                $set: {
                    Name: req.body.name,
                    Designation: req.body.designation,
                    Batch: req.body.batch,
                    StudentId: req.body.studentId,
                    ContactNo: req.body.contactNo,
                }
            }

            const result = await committeeMembersCollection.updateOne(query, updatedInfo);
            res.send(result);
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(PORT);