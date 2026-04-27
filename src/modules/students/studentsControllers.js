import * as studentService from '#modules/students/studentService';

export const createStudents = async (req, res, next) => {
    try {
        const student = await studentService.createStudents(req.body);
        res.status(201).json(student);
    
    } catch (error) {
        next(error);
    }
}

export const getAllStudents = async (req, res, next) => {
    try {
        const students = await studentService.getAllStudents();
        res.json(students);

    } catch (error) {
        next(error);
    }
}

export const getStudentById = async (req, res, next) => {
    try {
        const student = await studentService.getStudentById(req.params.id);
        res.json(student);
    
    } catch (error) {
        next(error);
    }
}

export const updateStudent = async (req, res, next) => {
    try {
        const student = await studentService.updateStudent(req.params.id, req.body);
        res.json(student);

    } catch (error) {
        next(error);
    }
}

export const deleteStudent = async (req, res, next) => {
    try {
        const result = await studentService.deleteStudent(req.params.id);
        res.json(result);
    } catch (error) {
       next(error); 
    }
}
