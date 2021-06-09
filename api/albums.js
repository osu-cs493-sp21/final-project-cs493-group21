const router = require('express').Router();
const { generateAuthToken,
        requireAuthentication,
        requireAuthentication_createUser } = require('../lib/auth');
const { AlbumSchema,
        getAlbumById,
        insertNewAlbum } = require('../models/album');
const { validateAgainstSchema } = require('../lib/validation');
//admin auth
//router.post()
//router.post('/', requireAuthentication, async (req, res, next) => {
router.post('/', async (req, res, next) => {
  if(validateAgainstSchema(req.body, AlbumSchema)){
    const album = {
      name: req.body.name,
      artistid: req.body.artistid,
      songs: req.body.songs
    }

    try {
      const id = await insertNewAlbum(album);
      res.status(201).send({
        id: id,
        links: {
          album: `/albums/${id}`,
          artistsAlbums: `/artists/${req.body.artistid}/albums`
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error:  "Error inserting album into DB.  Please try again later."
      })
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid song object"
    });
  }
})

//admin auth
//router.patch()

router.get('/:id', async (req, res, next) => {
  console.log("requested album by id:", req.params. id);
  try {
    const album = await getAlbumById(req.params.id);
    if (album) {
      const responseBody = {
        _id: album._id,
        albumName: album.name,
        artistid: album.artistid,
        songs: album.songs
      }
      res.status(200).send(responseBody);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch album data.  Please try again later."
    })
  }
});
module.exports = router;

//pagination
//artists/:id/albums
