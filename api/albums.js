const router = require('express').Router();

//admin auth
//router.post()

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
