import * as subjectsService from '#modules/subjects/subjectsService';

export const createSubject = async (req, res, next ) =>{
    try {
        const subject = await subjectsService.createSubject(req.body);
        res.status(201).json(subject);
    } catch (error) {
        next(error)
    };
};

export const getAllSubjects = async (req, res, next ) =>{
    try {
       const subject = await subjectsService.getAllSubjects();
       res.json(subject); 
    } catch (error) {

      next(error)  
    };
};

export const getSubjectById = async (req, res, next ) =>{
    try {
       const subject = await subjectsService.getSubjectById(req.params.id);
       res.json(subject);  
    } catch (error) {
        next(error)
    };
};

export const updateSubject = async (req, res, next)  =>{
    try {
       const subjects = await subjectsService.updateSubject(
        req.params.id,
         req.body);
         res.json(subjects); 
    } catch (error) {
        next(error);
    };
};

export const deleteSubject = async (req, res, next) => {
    try {
       const subject = await subjectsService.deleteSubject(req.params.id);
       res.json(subject); 
    } catch (error) {
       next(error) 
    };
};



