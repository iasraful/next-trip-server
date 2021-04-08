const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 3003

console.log(process.env.DB_USER);


app.use(cors());
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('Hello Programing Hero Team!!!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lai8j.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);
client.connect(err => {
  console.log('connrct err', err);
  const prodCollection = client.db("fresh").collection("valley");
  // perform actions on the collection object
  console.log('DB connected Finally');

  app.get("/products" , (req, res) =>{
    prodCollection.find()
    .toArray((err , items) => {
      res.send(items);
    })
  })

  app.post("/addProduct" , (req, res) =>{
    const newProduct = req.body;
    console.log("request from client" ,newProduct);
    prodCollection.insertOne(newProduct)
    .then(result => {
      console.log("inserted count" , result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  app.delete("/deleteProd/:id" , (req, res) =>{
    const id = req.params.id;
    console.log(id);
    prodCollection.deleteOne({_id : ObjectId(id)})
    .then(documents => res.send("send"))
  })
//   client.close();
});

// add order

client.connect(err => {
  console.log('connect err', err);
  const orderCollection = client.db("orders").collection("order");
  // perform actions on the collection object
  console.log('DB connected Finally');

  app.post("/addOrders" , (req, res) =>{
    const newOrders = req.body;
    console.log("request from client" ,newOrders);
    orderCollection.insertMany(newOrders)
    .then(result => {
      console.log("inserted count" , result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  app.get("/orders" , (req, res) =>{
    orderCollection.find()
    .toArray((err , orders) => {
      res.send(orders);
    })
  })

//   client.close();
});



app.listen(process.env.PORT || port)