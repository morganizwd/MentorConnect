const { Post } = require('../models/models'); // Ensure the correct path to your models

const postController = {
    // Create a new post
    create: async (req, res) => {
        try {
            const { authorId, content, forumId } = req.body;
            const post = await Post.create({ authorId, content, forumId });
            res.status(201).json(post);
        } catch (error) {
            res.status(500).json({ message: 'Error creating the post', error: error.message });
        }
    },

    // Retrieve all posts
    findAll: async (req, res) => {
        try {
            const posts = await Post.findAll();
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving posts', error: error.message });
        }
    },

    // Retrieve a single post by id
    findOne: async (req, res) => {
        try {
            const post = await Post.findByPk(req.params.id);
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Post not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error finding the post', error: error.message });
        }
    },

    // Update a post by id
    update: async (req, res) => {
        try {
            const { content, authorId, forumId } = req.body;
            const result = await Post.update({ content, authorId, forumId }, { where: { id: req.params.id } });
            if (result[0] === 1) {
                res.status(200).json({ message: 'Post updated successfully' });
            } else {
                res.status(404).json({ message: 'Post not found or no update necessary' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating the post', error: error.message });
        }
    },

    // Delete a post by id
    delete: async (req, res) => {
        try {
            const result = await Post.destroy({ where: { id: req.params.id } });
            if (result === 1) {
                res.status(200).json({ message: 'Post deleted successfully' });
            } else {
                res.status(404).json({ message: 'Post not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting the post', error: error.message });
        }
    }
};

module.exports = postController;