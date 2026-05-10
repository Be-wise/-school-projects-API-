import pool from '#config/db';
import { sanitizeString, sanitizeInt,isValidInt } from  '#utils/sanitize';

export const createTeacher = async (body) => {

    const cleanName = sanitizeString(body.name);
   // const cleanSubject = sanitizeString(body.subject);
   // const cleanClass = sanitizeString(body.class);

    if (!cleanName) throw { status:400, message: 'Name is required' };
  //  if (!cleanSubject) throw { status: 400, message: 'Subject is required'};
  //  if (!cleanClass) throw { status: 400, message: 'Class is required'};

    const result = await pool.query(
        'INSERT INTO teachers (name) VALUES ($1) RETURNING *',
        [cleanName]//cleanSubject, cleanClass]

    )
     return result.rows[0];
}

export const bulkCreateTeachers = async (teachersArray) => {
    const results = {
        successfulInserts: [],
        failedInserts: []
    };
    for (const teacher of teachersArray) {
        try {
            const cleanName = sanitizeString(teacher.name);
            if (!cleanName) {
                results.failedInserts.push({ teacher, reason: 'Name is required' });
                continue;
            }
            const result = await pool.query(
                'INSERT INTO teachers (name) VALUES ($1) RETURNING *',
                [cleanName]
            );
            results.successfulInserts.push(result.rows[0]);
        } catch (error) {
            if (error.code === '23505') {
                results.failedInserts.push({ teacher, reason: 'Teacher already exists' });
            } else {
                results.failedInserts.push({ teacher, reason: 'Unexpected error' });
            }
        }
    }
    return {
        message: `${results.successfulInserts.length} records inserted successfully, ${results.failedInserts.length} records failed to insert.`,
        successfulInserts: results.successfulInserts,
        failedInserts: results.failedInserts
    };
};

export const getAllTeachers = async () => {
    const result = await pool.query('SELECT * FROM teachers ORDER BY id ASC');
    return result.rows;

}

export const getTeacherById = async (id) => {
    const teacherId = sanitizeInt(id);
    if (!isValidInt(teacherId)) throw {status: 400, message: 'Invalid ID'};

    const result = await pool.query(
        'SELECT * FROM teachers WHERE id = $1',
        [teacherId]

    );
    if(result.rows.length === 0) throw { status:404, message: 'teacher not found'};

    return result.rows[0];

}

export const updateTeacher = async (id, body) => {
    const teacherId = sanitizeInt(id);
    if (!isValidInt(teacherId)) throw { status:400 , message: 'Invalid teacher ID'};

    const existing = await pool.query(
        'SELECT * FROM teachers WHERE id = $1',
        [teacherId]
    );

    if (existing.rows.length ===0) throw { status:404, message: 'Teacher not found'};

    const cleanName = body.name !== undefined ? sanitizeString(body.name) : existing.rows[0].name;
    const cleanSubject = body.subject !== undefined ? sanitizeString(body.subject) : existing.rows[0].subject;
    const cleanClass = body.class !== undefined ? sanitizeString(body.class) : existing.rows[0].class;

    if (body.name !== undefined && !cleanName) throw { status:400, message: 'Name is required' };
    if (body.subject !== undefined && !cleanSubject) throw { status:400, message: 'Subject is required' };
    if (body.class !== undefined && !cleanClass) throw { status:400, message: 'Class is required' };

    const result = await pool.query(
        'UPDATE teachers SET name = $1, subject = $2, class = $3 WHERE id = $4 RETURNING *',
        [cleanName, cleanSubject, cleanClass, teacherId]
    );

    return result.rows[0];
}

export const deleteTeacher = async (id) => {
    const teacherId = sanitizeInt(id);
    if (!isValidInt(teacherId)) throw { status:400, message: 'Invalid teacher ID'};

    

    const result = await pool.query(
        'DELETE FROM teachers WHERE id = $1 RETURNING *',
        [teacherId]
    );
    if (result.rows.length === 0) throw { status:404, message: 'Teacher not found'};
    return {message: 'Teacher deleted successfully'};
};


export const assignTeacherToSubject = async (subjectId, teacherId) => {
    console.log(subjectId, teacherId);
    
    const cleanSubjectId = sanitizeInt(subjectId)
    const cleanTeacherId = sanitizeInt(teacherId);

    if (!isValidInt(cleanSubjectId)) throw { status:400, message: 'Invalid subject ID' };
    if (!isValidInt(cleanTeacherId)) throw { status:400, message: 'Invalid teacher ID' };
   try {
    const result = await pool.query(
      `INSERT INTO teacher_subjects (teacher_id, subject_id)
      SELECT $1, $2
    WHERE EXISTS (
        SELECT 1 FROM teachers WHERE id = $1 AND is_active = TRUE 
    )
    AND EXISTS (
        SELECT 1 FROM subjects WHERE id = $2 AND is_active = TRUE

    )
    
    RETURNING *`,   
        [cleanTeacherId, cleanSubjectId]
    );

    if (result.rows.length === 0) throw { status:404, message: 'Teacher or Subject not found' };
    return { message: 'Teacher assinged to subject successfully' };

   } catch (error) {
    if (error.code === '23505') {
        throw { status:409, message: 'Teacher is already assigned to this subject' };
    }
    throw error;
   };
};


export const assignTeacherToClass = async (classId, teacherId) => {
    const cleanClassId = sanitizeInt(classId);
    const cleanTeacherId = sanitizeInt(teacherId);

    if (!isValidInt(cleanClassId)) throw { status:400, message: 'Invalid class ID' };
    if (!isValidInt(cleanTeacherId)) throw { status:400, message: 'Invalid teacher ID' };

    try {
        const result = await pool.query(
            `INSERT INTO teacher_classes (teacher_id, class_id)
            SELECT $1, $2
            WHERE EXISTS (
                SELECT 1 FROM teachers WHERE id = $1 AND is_active = TRUE
            )
            AND EXISTS (
                SELECT 1 FROM classes WHERE id = $2 AND is_active = TRUE
            )
            RETURNING *`,
            [cleanTeacherId, cleanClassId]
        );
        if (result.rows.length === 0) throw { status:404, message: 'Teacher or Class not found' };
        return { message: 'Teacher assigned to class successfully' };  
    } catch (error) {
        if (error.code === '23505') {
            throw { status:409, message: 'Teacher is already assigned to this class' };
        }
        throw error;
    }

}


export const getSubjectsByTeacherId = async (teacherId) => {
    const cleanTeacherId = sanitizeInt(teacherId);
    if (!isValidInt(cleanTeacherId)) throw { status:400, message: 'Invalid teacher ID' };

    const teacher = await pool.query(
        'SELECT * FROM teachers WHERE id = $1 AND is_active = TRUE',
        [cleanTeacherId]
    );
    if (teacher.rows.length === 0) throw { status:404, message: 'Teacher not found' };


    const result = await pool.query(
        `SELECT subjects.*
FROM subjects
JOIN teacher_subjects ON subjects.id = teacher_subjects.subject_id
WHERE teacher_subjects.teacher_id = $1
AND subjects.is_active = TRUE`,
     [cleanTeacherId]   
    );
    return result.rows;

}

export const getClassesByTeacherId = async (teacherId) => {
    const cleanTeacherId = sanitizeInt(teacherId);
    if (!isValidInt(cleanTeacherId)) throw { status:400, message: 'Invalid teacher ID' };

    const teacher = await pool.query(
        'SELECT * FROM teachers WHERE id = $1 AND is_active = TRUE',
        [cleanTeacherId]
    );
    if (teacher.rows.length === 0) throw { status:404, message: 'Teacher not found' };

    const result = await pool.query(
         `SELECT classes.*
FROM classes
JOIN teacher_classes ON classes.id = teacher_classes.class_id
WHERE teacher_classes.teacher_id = $1
AND classes.is_active = TRUE`,
 [cleanTeacherId]
);
    return result.rows
 };

export const removeTeacherFromClassById = async (teacherId, classId) => {
   const cleanTeacher = sanitizeInt(teacherId);
   const cleanClass   = sanitizeInt(classId);


    if (!isValidInt(cleanTeacher)) throw { status:400, message: 'Invalid teacher ID' };
    if (!isValidInt(cleanClass)) throw { status:400, message: 'Invalid class ID' };

    const result = await pool.query(
        `DELETE FROM teacher_classes
        WHERE teacherId = $1 AND classId = $2
        RETURNING *`,
        [cleanTeacher, cleanClass]
    );
    if (result.rows.length === 0) throw { status:404, message: 'Teacher not found or not assigned to any class' };
    return { message: 'Teacher removed from class successfully' };
};



export const removeTeacherFromSubjectById = async (teacherId, subjectId) => {
    const cleanTeacher = sanitizeInt(teacherId);
    const cleanSubject = sanitizeInt(subjectId);

    if(!isValidInt(cleanTeacher)) throw { status:400, message: 'Invalid teacher ID' };
    if (!isValidInt(cleanSubject)) throw { status:400, message: 'Invalid subject ID' };

    const result = await pool.query(
        `DELETE FROM teacher_subjects
        WHERE teacher_id = $1 AND subject_id = $2
        RETURNING *`,
        [cleanTeacher, cleanSubject]
    );
    if (result.rows.length === 0) throw { status:404, message: 'Teacher not found or not assigned to any subject' };
    return { message: 'Teacher removed from subject successfully' };
};


