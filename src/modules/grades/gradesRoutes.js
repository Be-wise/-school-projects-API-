import express from 'express';
import * as gradesController from '#modules/grades/gradesController';
import { authenticate} from '#middleware/authenticate';
import { authorize } from '#middleware/authorize';

const router = express.Router();

router.post('/', authenticate, authorize('admin'), gradesController.createGrade);
router.post('/bulk', authenticate, authorize('admin'), gradesController.bulkCreateGrades);
router.get('/', authenticate, authorize('admin', 'teacher'), gradesController.getAllGrades);
router.get('/:id', authenticate, authorize('admin', 'teacher', 'student', 'parent'), gradesController.getGradeById);
router.patch('/:id', authenticate, authorize('admin'), gradesController.updateGrade);
router.delete('/:id', authenticate, authorize('admin'), gradesController.deleteGrade);

export default router;