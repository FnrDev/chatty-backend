const verifyToken = require('../middleware/verifyToken')
const uploadController = require('../controllers/upload.controller')
const router = require('express').Router()
const multer = require('multer')

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter(req, file, cb) {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only images are allowed"));
    }

    cb(null, true);
  },
});

router.post('/', verifyToken, upload.single("image"), uploadController.upload)

module.exports = router