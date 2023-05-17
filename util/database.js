const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (callback) => {
  console.log("aa");
  MongoClient.connect(
    "mongodb+srv://calvindanystudy:DBto2YyVMaLxQfkN@indomaju.zkigycp.mongodb.net"
  )
    .then((client) => {
      _db = client.db("indomaju");
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }

  throw "No database found";
};
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
