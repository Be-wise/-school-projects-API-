import express  from 'express';
import * as classSubjectsController from '#modules/class-subjects/classSubjectsControllers';
import {authenticate} from '#middleware/authenticate';
import {authorize} from '#middleware/authorize';

const router = express.Router();

router.post('/', authenticate, authorize('admin'), classSubjectsController.createClassSubject)
router.post('/bulk', authenticate, authorize('admin'), classSubjectsController.bulkCreateClassSubjects);
router.get('/', authenticate, authorize('admin', 'teacher'), classSubjectsController.getAllClassSubjects);
router.get('/:id', authenticate, authorize('admin', 'teacher'), classSubjectsController.getClassSubjectById);
router.patch('/:id', authenticate, authorize('admin'), classSubjectsController.updateClassSubjectById);
router.delete('/:id', authenticate, authorize('admin'), classSubjectsController.deleteClassSubject);


router.post('/:id/enroll', authenticate, authorize('admin'), classSubjectsController.enrollStudentInClassSubject);
router.post('/bulk-enroll', authenticate, authorize('admin'), classSubjectsController.bulkEnrollStudentsInClassSubject);
router.get('/:id/students', authenticate, authorize('admin', 'teacher'), classSubjectsController.getStudentsByClassSubjectId);
router.delete('/:id/unenroll/:studentId', authenticate, authorize('admin'), classSubjectsController.unenrollStudentFromClassSubject);


export default router;
