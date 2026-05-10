import express from 'express';
import * as authController from '#auth/authController';

const router = express.Router();

router.post('/register', authController.register);
router.post('/register/bulk', authController.bulkRegister);
router.post('/login', authController.login);

export default router;