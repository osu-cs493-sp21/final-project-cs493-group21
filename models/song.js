const mysqlPool = require('../lib/mysqlPool');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { ObjectId, GridFSBucket } = require('mongodb');
const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');

/*
 * Schema for a Song.
 */
const SongSchema = {
        title: { required: true },
        duration: { required: true },
        lyrics: { required: true },
        genre: {required: true},
        artistid: {required: true},
        spotify_URL: {required: true}                           
};

exports.SongSchema = SongSchema;

exports.saveAudioFile = (song) => {
        // const [ result ] = await mysqlPool.query(
        //         'INSERT INTO songs SET ?',
        //         song
        //       );
        // return result.insertId;
        return new Promise((resolve, reject) => {
          const db = getDBReference();
          const bucket = new GridFSBucket(db, { bucketName: 'songs' });
          const metadata = {
            contentType: song.contentType,
            artistid: song.artistid,
            spotify_URL: song.spotify_URL,
            lyrics: song.lyrics,
            duration: song.duration,
            genre: song.genre
          };
      
          const uploadStream = bucket.openUploadStream(
            song.filename,
            { metadata: metadata }
          );
          fs.createReadStream(song.path).pipe(uploadStream)
          .on('error', (err) => {
            reject(err)
          })
          .on('finish', (result) => {
            resolve(result._id);
          });
        });
};

/*
 * Fetch a song from the DB based on song ID.
 */
exports.getSongById = async function (id) {
      //   const result = await mysqlPool.query(
      //     "SELECT * FROM songs WHERE id=?",
      //     [id]
      //   );
      //   console.log("getSongbyId: ",result[0][0]);
      //   if (result[0].length < 1){
      //     throw new Error("ID is not valid in DB");
      //   } else {
      //   return result[0][0];
      // }
      const db = getDBReference();
      const collection = db.collection('songs');
      if (!ObjectId.isValid(id)) {
        return null;
      } else {
        const results = await collection
          .find({ _id: new ObjectId(id) })
          .toArray();
        return results[0];
      }
};

exports.getSongInfoById = async function (id) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'songs' });
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await bucket.find({ _id: new ObjectId(id) })
      .toArray();
    console.log(results);
    return results[0];
  }
};

exports.streamSongById = async function (id){
  // const result = await mysqlPool.query(
  //   "SELECT * FROM songs WHERE artistid=? AND title=?",
  //   [artistid, title]
  // );
  // console.log("getSongByArtistAndTitle: ",result[0][0]);
  // return result[0][0]
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'songs' });

  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await bucket.find({ _id: new ObjectId(id) })
    .toArray();
    console.log(results);
    return results[0].filename;
  }
};

exports.getSongDownloadStreamByFilename = async (filename) => {
  // const result = await mysqlPool.query(
  //   "SELECT * FROM songs WHERE filename=?",
  //   [filename]
  // );
  // console.log(result);
  // // var buff = Buffer.from(result[0][1]._buf, 'base64');
  // // return fs.writeFileSync('test.mp3', buff); 
  // return result[0][0].path
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'songs' });
  return bucket.openDownloadStreamByName(filename);
};