// Create web server

// Import express
const express = require('express');

// Create router
const router = express.Router();

// Import comment model
const Comment = require('../models/comment');

// Import user model
const User = require('../models/user');

// Import middleware
const middleware = require('../middleware');

// Import config
const config = require('../config');

// Import helper
const helper = require('../helper');

// Import async
const async = require('async');

// Import nodemailer
const nodemailer = require('nodemailer');

// Import crypto
const crypto = require('crypto');

// Import cloudinary
const cloudinary = require('cloudinary');

// Import multer
const multer = require('multer');

// Set storage
const storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

// Image filter
const imageFilter = function(req, file, callback) {
    // Accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};

// Set upload
const upload = multer({
    storage: storage,
    fileFilter: imageFilter
});

// Set cloudinary config
cloudinary.config({
    cloud_name: 'dtxq2aeyq',
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret
});

// Index route
router.get('/', function(req, res) {
    // Check if there is a query string
    if (req.query.search) {
        // Make regex out of query string
        const regex = new RegExp(helper.escapeRegex(req.query.search), 'gi');
        // Find all comments from DB
        Comment.find({text: regex}, function(err, comments) {
            // Check for error
            if (err) {
                console.log(err);
            } else {
                // Check if comments were found
                if (comments.length < 1) {
                    req.flash('error', 'No comments found.');
                    res.redirect('back');
                } else {
                    // Render index page with comments
                    res.render('comments/index', {comments: comments});
                }
            }
        });
    } else {
        // Find all comments from DB
        Comment.find({}, function(err, comments) {