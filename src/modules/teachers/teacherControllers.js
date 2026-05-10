import * as teacherService from '#modules/teachers/teacherService'



export const createTeacher = async (req, res, next) => {
    try {
        const teacher = await teacherService.createTeacher(req.body);
        res.status(201). json(teacher);
        
    } catch (error) {
       next (error); 
    };

}
export const bulkCreateTeachers = async (req, res, next) => {
    try {
        const result = await teacherService.bulkCreateTeachers(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    };
};

export const getAllTeachers = async (req, res, next) => {
    try {
       const teachers = await teacherService.getAllTeachers();
       res.json(teachers);
    } catch (error) {
        next (error)
    };

}

export const getTeacherById = async (req, res, next ) => {
    try {
        const teacher = await teacherService.getTeacherById(req.params.id);
        res.json(teacher);
    } catch (error) {
        next(error);
    };
}

export const updateTeacher = async (req, res, next) => {
    try {
        const teacher = await teacherService.updateTeacher(req.params.id , req.body);
        res.json(teacher);

    } catch (error) {
        next(error);
    }
}

export const deleteTeacher = async (req, res ,next ) => {
    try {
        const teacher = await teacherService.deleteTeacher(req.params.id);
        res.json(teacher);
    } catch (error) {
       next(error); 
    }
}

export const assignTeacherToSubject = async (req, res, next) => {
    try{
        const teacher = await teacherService.assignTeacherToSubject(
            req.params.id,
             req.body.subjectId);
        res.json(teacher);
    } catch (error ){
        next(error);
    }
}

export const assignTeacherToClass = async(req, res, next) =>{
    try {
        
        const teacher = await teacherService.assignTeacherToClass(
            req.params.id,
            req.body.classId
            
        );
        res.json(teacher);
    } catch (error){
        next(error);
    };

};

export const getSubjectsByTeacherId = async (req, res, next) => {
    try {
        const teacher = await teacherService.getSubjectsByTeacherId(req.params.id);
        res.json(teacher);
    } catch (error) {
        next(error)
    };

};

export const getClassesByTeacherId = async (req, res, next) => {
    try {
        const teacher = await teacherService.getClassesByTeacherId(req.params.id);
        res.json(teacher);
    } catch (error) {
       next(error); 
    };
};

export const removeTeacherFromClassById = async (req, res, next) => {
    try {
       const teacher = await teacherService.removeTeacherFromClassById(
        req.params.id,
        req.params.classId
       );
       res.json(teacher); 
    } catch (error) {
        next (error)
    };
};


export const removeTeacherFromSubjectById = async (req, res, next) =>           {
    try {
        const teacher = await teacherService.removeTeacherFromSubjectById (
            req.params.id,
            req.params.subjectId
        );
        res.json(teacher);
        

    } catch (error) {
        next(error)
    };
};
