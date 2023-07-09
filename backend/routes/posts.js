const express = require("express")
const router = express.Router()
const Post = require('../models/post')
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
        cb(error, 'backend/uploads')
    },

    filename: function (req, file, cb) {
        const name = file.originalname.toLowerCase().split(' ').join('-')
        const extension = MIME_TYPE_MAP[file.mimetype]
        cb(null, name + '-' + Date.now() + '.' + extension)
    }
})


router.post('', multer({storage: storage}).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/uploads/' + req.file.filename
    })
    post.save().then(createdPost => {
            console.log(createdPost)
            res.status(201).json({
                message: 'Post added successfully',
                post: {
                    id: createdPost._id,
                    title: createdPost.title,
                    content: createdPost.content,
                    imagePath: createdPost.imagePath
                }
            })
        }
        )
}
)

router.put('/:id', multer({storage: storage}).single("image"), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host')
        imagePath = url + '/uploads/' + req.file.filename
    }
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    })
    console.log('🪲', post)
    Post.updateOne({_id: req.params.id}, post)
        .then(result=>console.log(result))
    res.status(200).json({
            message: 'Post updated successfully'
    })
})


router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({
                    message: 'Post not found'
                })
            }
        })
})

router.get('', (req, res, next)=>{
    console.log(req.query)
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts = null
    if (pageSize && currentPage) {
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)

    }
    postQuery
    .then(documents =>{
        fetchedPosts = documents
        return Post.count()
        })
    .then(count => {
        res.status(200).json({
            message: 'Posts fetched successfully',
            posts: fetchedPosts,
            maxPosts: count
         })
        })
})

router.delete('/:id', (req,res,next) =>{
    console.log(req.params.id)
    Post.deleteOne({ _id: req.params.id })
        .then( 
            result => 
            {console.log(result)
            res.status(200).json({ message:'Post deleted' })}
            )
        .catch( error => console.log(error))
    
})

module.exports = router