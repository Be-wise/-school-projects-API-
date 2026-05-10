import express from 'express';
import * as attendanceController from '#modules/attendance/attendanceController';
import { authenticate} from '#middleware/authenticate';
import { authorize } from '#middleware/authorize';

const router = express.Router();

router.post('/', authenticate, authorize('admin', 'teacher'), attendanceController.createAttendance);
router.get('/', authenticate, authorize('admin', 'teacher'), attendanceController.getAllAttendance);
router.get('/:id', authenticate, authorize('admin', 'teacher', 'student', 'parent'), attendanceController.getAttendanceById);
router.patch('/:id', authenticate, authorize('admin', 'teacher'), attendanceController.updateAttendance);
router.delete('/:id', authenticate, authorize('admin', 'teacher'), attendanceController.deleteAttendance);

export default router;
