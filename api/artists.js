<<<<<<< HEAD
const { getArtistsPage, getArtistById } = require('../models/artist');
const { getSongInfoById } = require('../models/song');

=======
const { getArtistsPage, getArtistById, ArtistSchema, insertNewArtist } = require('../models/artist');
const { validateAgainstSchema } = require('../lib/validation');
>>>>>>> master
const router = require('express').Router();


router.get('/', async (req, res, next) => {
  try{
    /*
     * Fetch page info about all artists
     */
    const artistPage = await getArtistsPage(parseInt(req.query.page) || 1);

    /*
     * Generate HATEOAS links for surrounding pages
     */
    artistPage.links = {};
    if(artistPage.page < artistPage.totalPages) {
      artistPage.links.nextPage = `artists?page=${artistPage.page + 1}`;
      artistPage.links.lastPage = `artists?page=${artistPage.totalPages}`;
    }
    if (artistPage.page > 1) {
      artistPage.links.prevPage = `artists?page=${artistPage.page - 1}`;
      artistPage.links.firstPage = `artists?page=1`;
    }

    /*
     * Return the page of all artists as the response
     */
    res.status(200).send(artistPage);

  }catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching artist list. PLease try again later."
    });
  }
});

router.get('/:id', async (req, res, next) => {
  try{
    const artist = await getArtistById(req.params.id);
    if (artist) {
      artist.links = {};
      links.song = `artists/${req.params.id}/songs`;

      res.status(200).send(artist);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching artist using id. Please try again later."
    });
  }
});

router.get('/:id/songs', async (req, res, next) => {
  try{
    const songs = await getSongInfoById(req.param.id);
    if (songs) {
      res.status(200).send(artist);
    } else {
      next();
    }
  } catch (err) {
    console.err(err);
    res.status(500).send({
      error: "Error fetching songs by the given artist. Please try again later."
    });
  }
}); 
module.exports = router;

router.post('/', async (req, res, next) => {
  if(validateAgainstSchema(req.body, ArtistSchema)){

    try {
      const id = await insertNewArtist(req.body);
      res.status(201).send({
        id: id,
        links: {
          artist: `/artists/${id}`,
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error:  "Error inserting artist into DB.  Please try again later."
      })
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid artist object"
    });
  }
});

module.exports = router;
