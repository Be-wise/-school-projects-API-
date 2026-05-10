import * as authService from '#auth/authService';

export const register = async (req, res, next) => {
    try {
        const auth = await authService.registerUser(req.body.email, req.body.password, req.body.role, req.body.referenceId);
        res.status(201).json(auth);     
    } catch (error) {
        next(error);
    }
}

export const bulkRegister = async (req, res, next) => {
    try {
        const results = await authService.bulkRegisterUsers(req.body);
        res.status(201).json(results);
    } catch (error) {
        next(error);
    };
};


export const login = async (req, res, next) => {
    try {
        const auth = await authService.loginUser(req.body.email, req.body.password);
        res.status(200).json(auth);
    } catch (error) {
        next(error);
    }
}