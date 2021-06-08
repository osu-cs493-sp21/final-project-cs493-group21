const mysqlPool = require('../lib/mysqlPool');
const { ObjectId, GridFSBucket } = require('mongodb');
const { getDBReference } = require('../lib/mongo');

async function getAlbumById (id) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'albums' });
  if(!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await bucket.find({ _id: new ObjectId(id) }).toArray();
    console.log(results);
    return results[0];
  }
}
exports.getAlbumById = getAlbumById;
