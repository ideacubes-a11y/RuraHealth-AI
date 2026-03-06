import express from 'express';
import multer from 'multer';
import { getPosts, createPost, votePost } from '../controllers/communityController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/posts', getPosts);
router.post('/posts', upload.single('image'), createPost);
router.post('/posts/:id/vote', votePost);

export default router;
