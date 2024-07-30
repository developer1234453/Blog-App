const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middlewares/auth');
const Comment = require('../models/Comment');

// @route    POST api/comments
// @desc     Create a comment
// @access   Private
router.post(
  '/',
  [auth, [
    check('content', 'Content is required').not().isEmpty()
  ]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { post, content } = req.body;

    try {
      const newComment = new Comment({
        post,
        content,
        author: req.user.id
      });

      const comment = await newComment.save();
      res.json(comment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Additional routes for getting comments, approving comments, etc.

module.exports = router;
