const router = require('express').Router();
const {Howl, Howler} = require('howler');

const { requireAuthentication } = require('../lib/auth');
const { getSongByArtistAndTitle,
        getSongDownloadStreamByFilename
 } = require('../models/song');

router.get('/songs/:artistid/:title', async (req, res, next) => {
        var artistid = req.params.artistid;
        var title = req.params.title;
        
        console.log("== [GET] artistid:", artistid);
        console.log("== [GET] title:", title);
        try {
          const song = await getSongByArtistAndTitle(artistid, title);
          console.log("== [GET] song:", song.Spotify_URL);

          var sound = new Howl({
                  src: ['C:/CS493/final-project-cs493-group21/api/uploads/c9a06b81e8176350b796341d5be923fc.mp3']
                ,autoplay: true
                });
          sound.play();
          res.status(200).send({
                uri: song.Spotify_URL
          });
          } catch (err) {
            console.error(err);
            res.status(500).send({
              err: "The requested song is not available"
            });
          } 
});


module.exports = router;