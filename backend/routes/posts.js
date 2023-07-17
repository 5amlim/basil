const express = require("express")
const router = express.Router()

const checkAuth = require('../middleware/check-auth')
const extractFile = require('../middleware/file')
const postsController = require('../controllers/posts')

router.post('', checkAuth, extractFile, postsController.createPost)

router.put('/:id', checkAuth, extractFile, postsController.updatePost)

router.get('/:id', postsController.getPost)

router.get('', postsController.getPosts)

router.delete('/:id', checkAuth, postsController.deletePost)

module.exports = router