import * as classesService from '#modules/classes/classesService';


export const createClass = async (req, res, next) => {
    try {
        const classes = await classesService.createClass(req.body);
        res.status(201).json(classes);
    } catch (error) {
       next (error); 
    };
};

export const getAllClasses = async(req, res, next) => {
    try {
        const classes = await classesService.getAllClasses();
        res.json(classes)
    } catch (error) {
        next(error);
    };
};

export const getClassById = async(req,res, next) => {
    try {
        const classes = await classesService.getClassById(req.params.id);
        res.json(classes)
    } catch (error) {
        next(error);
    };
};

export const updateClassById = async(req, res, next) => {
    try {
        const classes = await classesService.updateClassById(req.params.id, req.body);
        res.json(classes);
    } catch (error) {
        next (error);
    };
};


export const deleteClass = async(req, res, next) =>{
    try {
        const classes = await classesService.deleteClass(req.params.id);
        res.json(classes);  
    } catch (error) {
       next(error) 
    };
};