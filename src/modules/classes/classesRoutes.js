import express from 'express';
import * as classController from '#modules/classes/classesController';

const router = express.Router();    

router.post('/', classController.createClass);
router.get('/', classController.getAllClasses);
router.get('/:id', classController.getClassById);
router.patch('/:id', classController.updateClassById);
router.delete('/:id', classController.deleteClass); 

export default router;