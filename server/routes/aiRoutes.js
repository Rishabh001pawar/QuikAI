import express from 'express';
import { auth } from '../middlewares/auth.js';
import {
  genrateArticle,
  genrateBlogTitle,
  generateImage,
  removeImageBackground,
  removeImageObject,
  resumeReview,
  } from '../controllers/aiController.js';


import { upload } from '../config/multer.js';
import { getPublishedCreations, getUserCreations,  } from '../controllers/userController.js';

const aiRouter = express.Router();

// Text Generation
aiRouter.post('/genrate-article', auth, genrateArticle);
aiRouter.post('/genrate-blog-title', auth, genrateBlogTitle);

// Image Generation
aiRouter.post('/genrate-image', auth, generateImage);

// Image Processing
aiRouter.post('/remove-image-background', auth, upload.single('image'), removeImageBackground);
aiRouter.post('/remove-object', auth, upload.single('image'), removeImageObject);

// Resume Review
aiRouter.post('/resume-review', auth, upload.single('resume'), resumeReview);

// Community routes
aiRouter.get('/published-creations', auth, getPublishedCreations);
aiRouter.get('/published-creations', auth, getUserCreations);


export default aiRouter;
