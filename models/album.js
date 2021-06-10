//const mysqlPool = require('../lib/mysqlPool');
const { ObjectId, GridFSBucket } = require('mongodb');
const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');


const AlbumSchema = {
  name: { required: true },
  artistid: { required: true },
  songs: { required: true }
}
exports.AlbumSchema = AlbumSchema;

async function getAlbumById (id) {
  const db = getDBReference();
  const collection = db.collection('albums');
  if(!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection.find({ _id: new ObjectId(id) }).toArray();
    console.log(results);
    return results[0];
  }
}
exports.getAlbumById = getAlbumById;


async function getAlbumsByArtistId (id) {
  const db = getDBReference();
  const collection = db.collection('albums');
  if(!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection.find({ artistid: id }).toArray();
    console.log(results);
    var i;
    var ids = [];
    for(i = 0; i < results.length; i++){
      ids.push(results[i]._id);
    }
    console.log(ids);
    return ids;
  }
}
exports.getAlbumsByArtistId = getAlbumsByArtistId;


async function insertNewAlbum(album) {
  album = extractValidFields(album, AlbumSchema);
  const db = getDBReference();
  const collection = db.collection('albums');
  const result = await collection.insertOne(album);
  return result.insertedId;
}
exports.insertNewAlbum = insertNewAlbum;
