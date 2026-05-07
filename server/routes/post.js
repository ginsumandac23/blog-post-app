const express = require('express');
const postController = require('../controllers/post.js');
const bcrypt = require('bcryptjs');
const { verify, verifyAdmin } = require('../auth.js');

const router = express.Router();

router.post("/addPost", verify, postController.addPost);
router.get("/", postController.getAllPost);
router.get("/:postId", postController.getSinglePost);
router.patch("/update-post/:postId", verify, postController.updatePost);
router.delete("/:postId", verify, postController.deleteOwnPost);
router.delete("/delete/:postId", verify, verifyAdmin, postController.deleteAnyPost)
router.post("/comments/:postId", verify, postController.addComment);

module.exports = router;