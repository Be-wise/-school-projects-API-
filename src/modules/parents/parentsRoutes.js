import express from 'express';
import {authenticate} from '#middleware/authenticate';
import {authorize} from '#middleware/authorize';    
import * as parentsController from '#modules/parents/parentsController.js';

const router = express.Router();

router.post('/', authenticate, authorize('admin'), parentsController.createParent);
router.post('/bulk', authenticate, authorize('admin'), parentsController.bulkCreateParents);
router.get('/', authenticate, authorize('admin', 'teacher'), parentsController.getAllParents);
router.get('/:id', authenticate, authorize('admin', 'teacher', 'student', 'parent'), parentsController.getParentsById);
router.patch('/:id', authenticate, authorize('admin'), parentsController.updateParent);
router.delete('/:id', authenticate, authorize('admin'), parentsController.deleteParent);
