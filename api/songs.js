const router = require('express').Router();

const multer = require('multer');
const crypto = require('crypto');
const mm = require('music-metadata');

const { generateAuthToken, requireAuthentication, requireAuthentication_createUser } = require('../lib/auth');

const { SongSchema,
        saveAudioFile,
        getSongById } = require('../models/song');
const { validateAgainstSchema } = require('../lib/validation');

const acceptedFileTypes = {
  'audio/mp3': 'mp3',
  'audio/wav': 'wav'
};

const upload = multer({
  storage: multer.diskStorage({
    destination: `${__dirname}/uploads`,
    filename: (req, file, callback) => {
      const filename = file.originalname;
      console.log(filename)
      const extension = acceptedFileTypes[file.mimetype];
      console.log(extension)
      callback(null, `${filename}.${extension}`); 
    }
  }),
  fileFilter: (req, file, callback) => {
    callback(null, !!acceptedFileTypes[file.mimetype])  // !! means falsey -> true -> false, 
                                                        // falsey can be false, but not the same 

  }
});

/*
 * Route to create a new song.
 */
router.post('/', upload.single('file'), async (req, res) => {
        console.log("== req.body:", req.body);
        // console.log("== req.file:", req.file);
      
        if (validateAgainstSchema(req.body, SongSchema)) {
          const song = {
        //     contentType: req.file.mimetype,
        //     filename: req.file.filename,
        //    path: req.file.path,
                title: req.body.title,
                duration: req.body.duration,
                lyrics: req.body.lyrics,
                genre: req.body.genre,
                artistid: req.body.artistid,
                spotify_URL: req.body.spotify_URL
          };
      
          try {
            const id = await saveAudioFile(song);
            res.status(201).send({
              id: id,
              links: {
                song: `/songs/${id}`,
                artist: `/artists/${req.body.artistid}`
              }
            });
          } catch (err) {
            console.error(err);
            res.status(500).send({
              error: "Error inserting song into DB.  Please try again later."
            });
          }
        } else {
          res.status(400).send({
            error: "Request body is not a valid song object"
          });
        }
});

router.get('/:id', requireAuthentication, async (req, res, next) => {
        console.log("requested song id:", req.params.id);
        try {
                const song = await getSongById(parseInt(req.params.id));
                if (song) {
                  res.status(200).send(song);
                } else {
                  next();
                }
              } catch (err) {
                console.error(err);
                res.status(500).send({
                  error: "Unable to fetch song data.  Please try again later."
                });
              }
});


module.exports = router;