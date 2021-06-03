const mysqlPool = require('../lib/mysqlPool');
const bcrypt = require('bcryptjs');

const { extractValidFields } = require('../lib/validation');


/*
 * Fetch a song from the DB based on song ID.
 */
exports.getSongById = async function (id) {
        const result = await mysqlPool.query(
          "SELECT * FROM songs WHERE id=?",
          [id]
        );
        console.log("getUserbyId: ",result[0][0]);
        if (result[0].length < 1){
          throw new Error("ID is not valid in DB");
        } else {
        return result[0][0];
      }
};