const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bqqvk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");
        //GET API 
        app.get('/services', async (req, res) =>{
            const result = await servicesCollection.find({}).toArray();
            
            res.send(result);
        })

        //GET Single Service 
        app.get('/services/:id', async(req, res) =>{

            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.findOne(query);

            res.send(result);
        })

        // POST API 
        app.post('/services', async (req, res) =>{
            const service = req.body;
            console.log("Het api", service)
           
            const result = await servicesCollection.insertOne(service);
            console.log(result)

            res.json(result);
        })

    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Genius Car Mechanics Server")
})

app.listen(port, () => {
    console.log("Listening on port: ", port);
})