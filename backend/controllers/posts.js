const Post = require('../models/post')

const createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/uploads/' + req.file.filename,
        creator: req.userData.userId
    })
    post.save()
    .then(createdPost => {
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
    .catch(error => {
        res.status(500).json({
            message: 'Creating a post failed'
        })
    })
}

const updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host')
        imagePath = url + '/uploads/' + req.file.filename
    }
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    })
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
        .then(result => {
            if (result.matchedCount > 0){
                res.status(200).json({
                        message: 'Post updated successfully'
                })
            } else {
                res.status(401).json({
                    message: 'Not authorized'
                })
            }
        })
        .catch(error => {
                res.status(500).json({
                    message: 'Could not update post'
                })
            })
}

const getPost = (req, res, next) => {
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
        .catch(error => {
            res.status(500).json({
                message: 'Fetching post failed'
            })
        })
}

const getPosts = (req, res, next)=>{
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
    .catch(error =>
        res.status(500).json({
            message: 'Fetching posts failed'
        })
    )
}

const deletePost = (req,res,next) =>{
    console.log(req.params.id)
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId})
        .then(result => {
            console.log(result)
            if (result.deletedCount > 0){
                    res.status(200).json({
                            message: 'Post deleted successfully'
                    })
                } else {
                    res.status(401).json({
                        message: 'Not authorized'
                    })
                }
            }
            )
        .catch( error => {
            res.status(500).json({
                message: 'Deleting post failed'
            })
        })
    
}


module.exports = {
    createPost,
    updatePost,
    getPost,
    getPosts,
    deletePost
}