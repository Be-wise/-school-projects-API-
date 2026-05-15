import express from 'express';
import * as parentsControllers from '#modules/parents/parentsControllers';
import {authenticate} from '#middleware/authenticate';
import {authorize} from '#middleware/authorize';    


const router = express.Router();

router.post('/', authenticate, authorize('admin'), parentsControllers.createParent);
router.post('/bulk', authenticate, authorize('admin'), parentsControllers.bulkCreateParents);
router.get('/', authenticate, authorize('admin', 'teacher'), parentsControllers.getAllParents);
router.get('/:id', authenticate, authorize('admin', 'teacher', 'student', 'parent'), parentsControllers.getParentsById);
router.patch('/:id', authenticate, authorize('admin'), parentsControllers.updateParent);
router.delete('/:id', authenticate, authorize('admin'), parentsControllers.deleteParent);


export default router;
