const multer = require('multer')

const MIME_TYPE_MAP = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = MIME_TYPE_MAP[file.mimetype]
        if (isValid) {
            error = null
        }
        cb(error, 'uploads')
    },

    filename: function (req, file, cb) {
        const name = file.originalname.toLowerCase().split(' ').join('-')
        const extension = MIME_TYPE_MAP[file.mimetype]
        cb(null, name + '-' + Date.now() + '.' + extension)
    }
})

module.exports = multer({storage: storage}).single("image")