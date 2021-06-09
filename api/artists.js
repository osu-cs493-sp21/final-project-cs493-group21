const { getArtistsPage, getArtistById } = require('../models/artist');
const { getAlbumsByArtistId } = require('../models/album');

const router = require('express').Router();


router.get('/', async (req, res) => {
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

/*
 * Endpoint for getting a list of album ids that belong to an artist
 */
router.get('/:id/albums', async (req, res, next) => {
  console.log("requested album by id:", req.params.id);
  try {
    const albums = await getAlbumsByArtistId(req.params.id);
    if (albums) {
      const responseBody = {
        artistid: req.params.id,
        albumids: albums
      }
      res.status(200).send(responseBody);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch albums for that artist.  Please try again later."
    })
  }
});

module.exports = router;
