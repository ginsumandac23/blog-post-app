const Post = require('../models/Post.js');
const bcrypt = require('bcryptjs');
const auth = require('../auth.js');


module.exports.addPost = async(req, res, next) => {

	try {

		const newPost = new Post({
			title: req.body.title,
			content: req.body.content,
			author: req.user.id
		});

		const result = await newPost.save();

		res.status(201).json(result);

	}catch(err){
		next(err);
	}

}


module.exports.getAllPost = async(req, res, next) => {

	try {

		const postResult = await Post.find({});

		if(postResult.length === 0){
			return res.status(404).send({message: "No post found"});
		}

		res.status(200).json(postResult);

	}catch(err){
		next(err);
	}

}

module.exports.getSinglePost = async(req, res, next) => {
	try{
		const postId = req.params.postId;
		const post = await Post.findById(postId).populate('comments.user', 'username');
		if(!post){                    // ← was "result", should be "post"
			return res.status(404).send({message: "Blog post not found"});
		}
		res.status(200).json(post);   // ← was "result", should be "post"
	}catch(err){
		next(err);
	}
}


module.exports.updatePost = async(req, res, next) => {

	try {

		const postId = req.params.postId;

		const updatePost = {
			title: req.body.title,
			content: req.body.content,
			author: req.user.id
		}

		const result = await Post.findByIdAndUpdate(postId, updatePost, {new: true});

		if(!result){
			return res.status(404).send({message: "Post not found"})
		}

		return res.status(200).send({
			success: true,
			message: "Post updated successfully",
			result
		})

	}catch(err){
		next(err);
	}

}


module.exports.deleteOwnPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // allow if admin OR owner
    if (
      post.author.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        auth: "Failed",
        message: "Action Forbidden"
      });
    }

    await post.deleteOne();

    return res.status(200).json({
      message: "Post successfully deleted"
    });

  } catch (err) {
    next(err);
  }
};


module.exports.deleteAnyPost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted by admin" });
  } catch (err) {
    next(err);
  }
};


module.exports.addComment = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.comments.push({
      user: req.user.id,
      comment: comment
    });
    await post.save();

    // Populate username before returning
    await post.populate('comments.user', 'username');

    return res.status(200).json({
      message: "Comment added successfully",
      comments: post.comments
    });
  } catch (err) {
    next(err);
  }
};