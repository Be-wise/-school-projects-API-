import * as gradesService from '#modules/grades/gradesService';

export const createGrade = async (req, res, next) => {
    try {
        const grade = await gradesService.createGrade(req.body);
        res.status(201).json(grade);
    } catch (error) {  
        next (error)
    }
}

export const bulkCreateGrades = async (req, res, next) => {
    try {
        const result = await gradesService.bulkCreateGrades(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    };

};

export const getAllGrades = async (req, res, next) => {
    try {
        const grades = await gradesService.getAllGrades();
        res.json(grades);
    } catch (error) {
        next (error)
    }
}


export const getGradeById = async (req, res, next) => {
    try {
        const grade = await gradesService.getGradeById(req.params.id);  
        res.json(grade);
    } catch (error) {
        next (error)
    }    

}


export const updateGrade = async (req, res, next) => {
    try {
        const grade = await gradesService.updateGrade(req.params.id, req.body); 
        res.json(grade);
    } catch (error) {
        next (error)
    }   
}

export const deleteGrade = async (req, res, next) => {
    try {
        const grade = await gradesService.deleteGrade(req.params.id); 
        res.json(grade);
    } catch (error) {
        next (error)
    }
}