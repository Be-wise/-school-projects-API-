import express from 'express';
import * as classController from '#modules/classes/classesController';
import { authenticate} from '#middleware/authenticate';
import { authorize } from '#middleware/authorize';

const router = express.Router();    

router.post('/', authenticate, authorize('admin'), classController.createClass);
router.get('/', authenticate, authorize('admin', 'teacher','student', 'parent'), classController.getAllClasses);
router.get('/:id', authenticate, authorize('admin', 'teacher','student', 'parent'), classController.getClassById);
router.patch('/:id', authenticate, authorize('admin'), classController.updateClassById);
router.delete('/:id', authenticate, authorize('admin'), classController.deleteClass); 

export default router;