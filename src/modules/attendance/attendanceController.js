import * as attendanceService from '#modules/attendance/attendanceService';

export const createAttendance = async (req, res, next) => {
    try {
        const attendance = await attendanceService.createAttendance(req.body);
        res.status(201).json(attendance);
    } catch (error) {  
        next (error)
    }

}

export const bulkCreateAttendance = async (req, res, next) => {
    try {
        const result = await attendanceService.bulkCreateAttendance(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    };
};


export const getAllAttendance = async (req, res, next) => {
    try {
        const attendance = await attendanceService.getAllAttendance();
        res.json(attendance);
    } catch (error) {
        next (error)
    }
}

export const getAttendanceById = async (req, res, next) => {
    try {
        const attendance = await attendanceService.getAttendanceById(req.params.id);  
        res.json(attendance);
    } catch (error) {
        next (error)
    }
}

export const updateAttendance = async (req, res, next) => {
    try {
        const attendance = await attendanceService.updateAttendance(req.params.id, req.body); 
        res.json(attendance);
    } catch (error) {
        next (error)
    }
}    

export const deleteAttendance = async (req, res, next) => {
try {
    const attendance = await attendanceService.deleteAttendance(req.params.id); 
    res.json(attendance);
} catch (error) {
    next (error)
}

}