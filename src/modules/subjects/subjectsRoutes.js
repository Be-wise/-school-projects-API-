import express from 'express';
import * as subjectController from '#modules/subjects/subjectsController';

const router = express.Router();

router.post('/', subjectController.createSubject);
router.get('/', subjectController.getAllSubjects);
router.get('/:id', subjectController.getSubjectById);
router.patch('/:id', subjectController.updateSubject);
router.delete('/:id', subjectController.deleteSubject);

export default router;