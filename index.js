const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const app = express();

app.use(cors());
app.use(bodyParser.json());


const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

///////GET//////////
app.get('/', (req, res) => {
    res.send('hello from server');
})

app.get('/items', (req, res) => {
    //client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("foodMenus");
    
        collection.find().toArray((err, documents) => {
            if(err) {
                console.log(err);
            }
            else{
                res.send(documents);
            }
            
        });
        //client.close();
    });  
})

app.get('/item/:id', (req, res) => {
    //client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const id = req.params.id;

    client.connect(err => {
        const collection = client.db("onlineStore").collection("foodMenus");
    
        collection.find({id}).toArray((err, documents) => {
            if(err) {
                console.log(err);
            }
            else{
                res.send(documents[0]);
            }
            
        });
        //client.close();
    });  
})



/////////POST////////////
app.post('/getItemsById', (req, res) => {

    const id = req.params.id;
    const itemId = req.body;

    //client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("foodMenus");
    
        collection.find({id: { $in: itemId }}).toArray((err, documents) => {
            if(err) {
                console.log(err);
            }
            else{
                res.send(documents);
            }
            
        });
        //client.close();
    });  
})

app.post('/addItem', (req, res) => {
    const product = req.body;
    //client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("foodMenus");
        
        collection.insert(product, (err, result) => {
            if(err) {
                console.log(err);
            }
            else{
                res.send(result.ops[0]);
            }
            
        });
        //client.close();
    });  
});

app.post('/placeOrder', (req, res) => {
    const product = req.body;
    //client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("orders");
        
        collection.insertOne(product, (err, result) => {
            if(err) {
                console.log(err);
            }
            else{
                res.send(result.ops[0]);
            }
            
        });
        //client.close();
    });  
});


const port = 4200;
app.listen(port, () => console.log('Listening to port 4200'));