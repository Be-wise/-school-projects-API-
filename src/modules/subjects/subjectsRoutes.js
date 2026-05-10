import express from 'express';
import * as subjectController from '#modules/subjects/subjectsController';
import { authenticate} from '#middleware/authenticate';
import { authorize } from '#middleware/authorize';

const router = express.Router();

router.post('/', authenticate, authorize('admin'), subjectController.createSubject);
router.post('/bulk', authenticate, authorize('admin'), subjectController.bulkCreateSubjects);
router.get('/', authenticate, authorize('admin', 'teacher','student', 'parent'), subjectController.getAllSubjects);
router.get('/:id', authenticate, authorize('admin', 'teacher','student', 'parent'), subjectController.getSubjectById);
router.patch('/:id', authenticate, authorize('admin'), subjectController.updateSubject);
router.delete('/:id', authenticate, authorize('admin'), subjectController.deleteSubject);

export default router;