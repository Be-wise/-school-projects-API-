import * as classSubjectsService from '#modules/class-subjects/classSubjectsService';

export const createClassSubject = async (req, res, next) => {
    try {
        const classSubject = await classSubjectsService.createClassSubject(req.body);
        res.status(201).json(classSubject);
    } catch (error) {
        next(error);
    }
};

export const bulkCreateClassSubjects = async (req, res, next) => {
    try {
        const result = await classSubjectsService.bulkCreateClassSubjects(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }  
};

export const getClassSubjectById = async (req, res, next) => {
    try {
        const classSubject = await classSubjectsService.getClassSubjectById(req.params.id, req.user);
        res.json(classSubject);
    } catch (error) {
        next(error);
    }
};


export const getAllClassSubjects = async (req, res, next) => {
    try {
        const classSubjects = await classSubjectsService.getAllClassSubjects(req.user);
        res.json(classSubjects);
    } catch (error) {
        next(error);
    }
};


export const updateClassSubjectById = async (req, res, next) => {  
    try {  
        const classSubject = await classSubjectsService.updateClassSubjectById(req.params.id, req.body, req.user);
        res.json(classSubject);
    } catch (error) {
        next(error);
    }
};


export const deleteClassSubject = async (req, res, next) => {
    try {
        const classSubject = await classSubjectsService.deleteClassSubject(req.params.id, req.user);  
        res.json(classSubject);
    }   catch (error) {
        next(error);
    }
};



export const enrollStudentInClassSubject = async (req, res, next) => {
    try {
        const enrollments = await classSubjectsService.enrollStudentInClassSubject(req.params.id, req.body.studentId, req.user);
        res.status(200).json(enrollments);
    } catch (error) {
        next(error);
    }

};

export const bulkEnrollStudentsInClassSubject = async (req, res, next) => {
    try {
        const enrollments = await classSubjectsService.bulkEnrollStudentsInClassSubject( req.body, req.user);
        res.status(200).json(enrollments);
    } catch (error) {
        next(error);
    }
};

export const unenrollStudentFromClassSubject = async (req, res, next) => {
    try{
        const enrollments = await classSubjectsService.unenrollStudentFromClassSubject(req.params.id, req.body.studentId, req.user);
        res.json(enrollments);
    } catch (error) {
        next(error);
    }
}


export const getStudentsByClassSubjectId = async (req, res, next) => {
    try {
        const students = await classSubjectsService.getStudentsByClassSubjectId(req.params.id, req.user);
        res.json(students);
    } catch (error) {
        next(error);
    }
};
