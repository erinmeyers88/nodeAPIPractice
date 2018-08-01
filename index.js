import express from 'express';
import {MongoClient} from 'mongodb';
import bodyParser from 'body-parser';
import routes from './app/routes';
import db from './config/db';

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({extended: true}));

MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err);

  const db = database.db("test");

  routes(app, db);
  app.listen(port, () => {
    console.log('Listening on port ', port);
  });

});

