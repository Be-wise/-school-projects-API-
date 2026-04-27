import express from 'express' ;
import * as teacherController from '#modules/teachers/teacherControllers';

const router = express.Router();


router.post('/',teacherController.createTeacher);
router.get('/', teacherController.getAllTeachers);
router.get('/:id', teacherController.getTeacherById);
router.patch('/:id', teacherController.updateTeacher);
router.delete('/:id', teacherController.deleteTeacher);
router.post('/:id/subjects', teacherController.assignTeacherToSubject);
router.post('/:id/classes',  teacherController.assignTeacherToClass);
router.get('/:id/subjects', teacherController.getSubjectsByTeacherId);
router.get('/:id/classes', teacherController.getClassesByTeacherId);
router.delete('/:id/subjects/:subjectId', teacherController.removeTeacherFromSubjectById);
router.delete('/:id/classes/:classId', teacherController.removeTeacherFromClassById);




export default router;