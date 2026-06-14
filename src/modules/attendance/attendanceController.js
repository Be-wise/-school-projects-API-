import * as attendanceService from '#modules/attendance/attendanceService';

export const createAttendance = async (req, res, next) => {
    try {
        const attendance = await attendanceService.createAttendance(req.body, req.user);
        res.status(201).json(attendance);
    } catch (error) {  
        next (error)
    }

}

export const bulkCreateAttendance = async (req, res, next) => {
    try {
        const result = await attendanceService.bulkCreateAttendance(req.body, req.user);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    };
};


export const getAllAttendance = async (req, res, next) => {
    try {
        const attendance = await attendanceService.getAllAttendance(req.user);
        res.json(attendance);
    } catch (error) {
        next (error)
    }
}

export const getAttendanceById = async (req, res, next) => {
    try {
        const attendance = await attendanceService.getAttendanceById(req.params.id,req.user);  
        res.json(attendance);
    } catch (error) {
        next (error)
    }
}

export const updateAttendance = async (req, res, next) => {
    try {
        const attendance = await attendanceService.updateAttendance(req.params.id, req.body, req.user); 
        res.json(attendance);
    } catch (error) {
        next (error)
    }
}    

export const deleteAttendance = async (req, res, next) => {
try {
    const attendance = await attendanceService.deleteAttendance(req.params.id, req.user); 
    res.json(attendance);
} catch (error) {
    next (error)
}

}


export const getAttendanceByStudentId = async (req, res, next) => {
    try {
        const attendance = await attendanceService.getAttendanceByStudentId(req.params.studentId, req.user);
        res.json(attendance);
    } catch (error) {
        next (error)
    }
}