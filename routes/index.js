var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const assert = require('assert');
const { count } = require('console');


//-----Connection URL
var url = 'mongodb://localhost:27017';
const namedb = 'breaddb';
function connect(cb) {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    const db = client.db(namedb);
    cb(db)
  })
}

/* GET home page. */
router.get('/', function (req, res, next) {
  const { check1, check2, check3, check4, check5, check6, id, string, integer, float, startdate, enddate, boolean } = req.query
  let result = {};
  let filter = false;

  if (check1 && id) {
    result._id = ObjectId(id)
    filter = true;
  }
  if (check2 && string) {
    result.string = string
    filter = true;
  }
  if (check3 && integer) {
    result.integer = integer
    filter = true;
  }
  if (check4 && float) {
    result.float = float
    filter = true;
  }
  if (check5 && startdate && enddate) {
    result.date = { $gte: startdate, $lte: enddate }
    filter = true;
  }
  if (check6 && boolean) {
    result.data = boolean
    filter = true;
  }
  if (req.url == '/') {
    MongoClient.connect(url, function (err, client) {

      const db = client.db(namedb);
      const collection = db.collection('bread')
      page = req.query.page || 1;
      limit = 3;
      let url = req.url == '/' ? '/?page=1' : req.url;
      offset = (page - 1) * limit;

      collection.find({}).limit(3).skip(offset).toArray().then(row => {
        collection.find({}).count().then(count => {
          res.render('index', {
            data: row, page,
            pages: Math.ceil(count / limit),
            query: req.query,
            url
          })
        })
      })
    })
  } else if (check1 || check2 || check3 || check4 || check5 || check6) {
    MongoClient.connect(url, (err, client) => {

      const db = client.db(namedb);
      const collection = db.collection('bread')
      page = req.query.page || 1;
      limit = 3;
      let url = req.url == '/' ? '/?page=1' : req.url;
      offset = (page - 1) * limit;

      collection.find(result).limit(3).skip(offset).toArray().then(row => {
        collection.find(result).count().then(count => {
          res.render('index', {
            data: row, page,
            pages: Math.ceil(count / limit),
            query: req.query,
            url
          })
        })
      })
    })
  } else {
    MongoClient.connect(url, (err, client) => {

      const db = client.db(namedb);
      const collection = db.collection('bread')
      page = req.query.page || 1;
      limit = 3;
      let url = req.url == '/' ? '/?page=1' : req.url;
      offset = (page - 1) * limit;

      collection.find({}).limit(3).skip(offset).toArray().then(row => {
        collection.find({}).count().then(count => {
          res.render('index', {
            data: row, page,
            pages: Math.ceil(count / limit),
            query: req.query,
            url
          })
        })
      })
    })
  }
})
router.get('/add', (req, res, next) => {
  res.render('add');
})


router.post('/add', function (req, res, next) {
  let string = req.body.string;
  let integer = req.body.integer;
  let float = req.body.float;
  let date = req.body.date;
  let boolean = req.body.boolean;
  let myObj = { string: string, integer: integer, float: float, date: date, boolean: boolean };
  connect(function (db) {
    db.collection("bread").insertOne(myObj, function (err, data) {
      if (err) throw err;
      res.redirect('/');
    });
  });
});
router.get('/edit/:id', (req, res) => {
  connect(function (db) {
    const collection = db.collection('bread')
    id = req.params.id;
    collection.findOne({ _id: ObjectId(id) }).then(result => {
      if (err) throw err;
        res.render('edit', { item: result, title: 'Edit' })
        .catch(err => console.log(err));
      
    })
  })
})
router.post('/edit/:id', (req, res, next) => {
  collection.upadate.Many({ _id: ObjectId(req.params.id) }, {
    $set: {
      string: req.body.string,
      integer: parseInt(req.body.integer),
      float: parseFloat(req.body.float),
      date: new Date(req.body.date),
      boolean: req.body.boolean
    }
  }, (err, row) => {
    if (err) throw err;
    console.log('Update Berhasil');
    res.redirect('/');
  })
})


//<=====D E L E T E 
router.get('/delete/:id', (req, res, next) => {
  connect(function (db) {
    id = req.params.id;
    const collection = db.collection("bread")
    collection.deleteOne({ "_id": ObjectId(id) }, (err) => {
      if (err) throw err;
      res.redirect('/');
    })
  })
  console.log('Delete berhasil');
})
module.exports = router;

