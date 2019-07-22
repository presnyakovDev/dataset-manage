import * as express from 'express';
import * as bodyParser from "body-parser";
import { MongoClient, ObjectId } from 'mongodb';
import { MongooseFacade } from "./mongooseFacade";
const app = express();
const MONGO_URL = 'mongodb://localhost:27017';
const mongoClient = new MongoClient(MONGO_URL, { useNewUrlParser: true });
import * as https from 'https';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoClient.connect(function(err, client){
  const db = client.db('neuroTradeDatasets');
  const Datasets = db.collection("datasets");
  const Examples = db.collection("examples");
  const Lables = db.collection("lables");
  const RawData = db.collection("rawdata");

  app.get('/datasets', function (req, res) {
    Datasets.find().toArray().then((response)=>{
      res.status(200).send(response);
    });
  });

  app.post('/dataset', function (req, res) {
    let description = req.body.description;
    let date = Date.now();
    Datasets.insertOne({description: description, date: date})
      .then((response)=>{
        res.status(200).send({...response, status:"Dataset added!"});
      })
  });

  app.delete('/dataset', function (req, res){
    let id = req.body.id;
    Datasets.deleteOne({_id:ObjectId(id)})
      .then((response)=>{
        Examples.deleteMany({datasetId:id})
          .then((examlesResponse)=>{
              res.status(200).send({...examlesResponse, status:"Dataset removed!"});
          });
      })
  });

  app.get('/examples/:datasetId', function(req, res){
    let datasetId = req.params.datasetId;
    Examples.find({datasetId:datasetId}).toArray().then((response)=>{
      res.status(200).send(response);
    });
  });

  app.post('/examples', function(req, res){
    let datasetId = req.body.datasetId;
    let data = req.body.data;
    let allResponse = [];
    data.forEach((value) => {
      Examples.insertOne({datasetId:datasetId, data:value})
        .then((response)=>{
          allResponse.push(response);
        });
    })
    res.status(200).send({...allResponse, status:"Example added!"});
  });

  app.delete('/example', function(req, res){
    let id = req.body.id;
    Examples.deleteOne({_id:ObjectId(id)})
      .then((response)=>{
        res.status(200).send({...response, status:"Examples removed!"});
      });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on http://localhost:3000/');
});

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
