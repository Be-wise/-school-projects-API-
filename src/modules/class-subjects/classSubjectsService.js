import pool from '#config/db';
import { sanitizeString, sanitizeInt, isValidInt } from "#utils/sanitize";

export const createClassSubject = async (body) => {
    const cleanClassId = sanitizeInt(body.classes_id);
    const cleanSubjectId = sanitizeInt(body.subjects_id);
    const cleanTeacherId = sanitizeInt(body.teacher_id);

    if (!isValidInt(cleanClassId)) throw { status:400, message: 'Invalid class ID' };
    if (!isValidInt(cleanSubjectId)) throw { status:400, message: 'Invalid subject ID' };
    if (!isValidInt(cleanTeacherId)) throw { status:400, message: 'Invalid teacher ID' };
    try {
        const result = await pool.query(
        'INSERT INTO class_subjects (classes_id, subjects_id, teacher_id) VALUES ($1, $2, $3) RETURNING *',
        [cleanClassId, cleanSubjectId, cleanTeacherId]
    );
    return result.rows[0];
    } catch (error) {
       if (error.code === '23505') {
            throw { status:409, message: 'This subject is already assigned to the class' };
        } else if (error.code === '23503') {
            throw { status:404, message: 'Class, Subject, or Teacher not found' };
       
     } 
        throw error;
    }
};

export const bulkCreateClassSubjects = async (classSubjectsArray) => {
    const results = {
        successfulInserts: [],
        failedInserts: []
    }; for (const classSubject of classSubjectsArray) {
        try {
            const cleanClassId = sanitizeInt(classSubject.class_id);
            const cleanSubjectId = sanitizeInt(classSubject.subject_id);
            const cleanTeacherId = sanitizeInt(classSubject.teacher_id);

            if (!isValidInt(cleanClassId)) {
                results.failedInserts.push({ ...classSubject, error: 'Invalid class ID' });
                continue;
            }
            if (!isValidInt(cleanSubjectId)) {
                results.failedInserts.push({ ...classSubject, error: 'Invalid subject ID' });
                continue;
            }
            if (!isValidInt(cleanTeacherId)) {
                results.failedInserts.push({ ...classSubject, error: 'Invalid teacher ID' });
                continue;
            }

            const result = await pool.query(
                'INSERT INTO class_subjects (classes_id, subjects_id, teacher_id) VALUES ($1, $2, $3) RETURNING *',
                [cleanClassId, cleanSubjectId, cleanTeacherId]
            );
            results.successfulInserts.push(result.rows[0]);
        } catch (error) {
            if (error.code === '23505') {
                results.failedInserts.push({ ...classSubject, error: 'This subject is already assigned to the class' });
            } else if (error.code === '23503') {
                results.failedInserts.push({ ...classSubject, error: 'Class, Subject, or Teacher not found' });
            } else {
                results.failedInserts.push({ ...classSubject, error: 'Unexpected error' });
            }
        }
    }
    return {message: `${results.successfulInserts.length} records inserted successfully, ${results.failedInserts.length} records failed to insert.`,
     successfulInserts: results.successfulInserts,
      failedInserts: results.failedInserts};
};


export const getAllClassSubjects = async (user) => {
    let result;
    if (user.role === 'admin') {
        result = await pool.query('SELECT * FROM class_subjects WHERE is_active = TRUE ORDER BY id ASC');
    }

    if (user.role === 'teacher') {
        result = await pool.query(
            'SELECT * FROM class_subjects WHERE teacher_id = $1 AND is_active = TRUE ORDER BY id ASC',
            [user.referenceId]
        );
    }
    return result.rows;
};

export const getClassSubjectById = async (id) => {
    const cleanId = sanitizeInt(id);
    if (!isValidInt(cleanId)) throw { status:400, message: 'Invalid class subject ID' };
    const result = await pool.query(
        'SELECT * FROM class_subjects WHERE id = $1 AND is_active = TRUE',
        [cleanId]
    );
    if (result.rows.length === 0) throw { status:404, message: 'Class subject not found' };
    return result.rows[0];
}

export const updateClassSubjectById = async (id, body) => {
    const classSubjectId = sanitizeInt(id);
    if (!isValidInt(classSubjectId)) throw { status:400, message: 'Invalid class subject ID' };

    const existing = await pool.query(
        'SELECT * FROM class_subjects WHERE id = $1 AND is_active = TRUE ',
        [classSubjectId]
    );
    if (existing.rows.length === 0) throw { status:404, message: 'Class subject not found' };

    
    const cleanTeacherId = body.teacher_id !== undefined ? sanitizeInt(body.teacher_id) : existing.rows[0].teacher_id;
    if (body.teacher_id !== undefined && !isValidInt(sanitizeInt(body.teacher_id))) throw { status:400, message: 'Invalid teacher ID' };
    
    
    try {
        const result = await pool.query(
            'UPDATE class_subjects SET teacher_id = $1 WHERE id = $2 AND is_active = TRUE RETURNING *',
            [ cleanTeacherId, classSubjectId ]
        );
        return result.rows[0];
    } catch (error) {
        if (error.code === '23505') {
            throw { status:409, message: 'This teacher is already assigned to the combo' };
        
    }
        throw error;
    };

};



export const deleteClassSubject = async (id) => {
    const classSubjectId = sanitizeInt(id);
    if (!isValidInt(classSubjectId)) throw { status:400, message: 'Invalid class subject ID' };

   try {
    const result = await pool.query(
        'DELETE FROM class_subjects WHERE id = $1 AND is_active = TRUE RETURNING *',
        [classSubjectId]
    );
    if (result.rows.length === 0) throw { status:404, message: 'Class subject not found' };
    return { message: 'Class subject deleted successfully' };
   } catch (error) {
    if (error.code === '23503') {
        await pool.query(
            'UPDATE class_subjects SET is_active = FALSE WHERE id = $1 AND is_active = TRUE',
            [classSubjectId]
        );
        return { message: 'Class subject deactivated successfully due to existing dependencies' };
    }

    throw error;
    
   }
};


export const enrollStudentInClassSubject = async (studentId, classSubjectId, user) => {
    const cleanStudentId = sanitizeInt(studentId);
    const cleanClassSubjectId = sanitizeInt(classSubjectId);

    if(!isValidInt(cleanStudentId)) throw { status:400, message: 'Invalid student ID' };
    if(!isValidInt(cleanClassSubjectId)) throw { status:400, message: 'Invalid class subject ID' };

    if(user.role === 'teacher') {
        const classSubject = await pool.query(
            `SELECT * FROM class_subjects WHERE id = $1 AND is_active = TRUE`,
            [cleanClassSubjectId]
        );
        if(classSubject.rows.length === 0) throw {
            status:404, message: 'Class subject not found' };

        if(classSubject.rows[0].teacher_id !== user.referenceId) throw { 
            status:403, message: 'Access denied' };
    }

    try {
        const result = await pool.query(
            `INSERT INTO enrollments (student_id, class_subject_id)
            SELECT $1, $2
            WHERE EXISTS (
                SELECT 1 FROM students WHERE id = $1 AND is_active = TRUE
            )
            AND EXISTS (
                SELECT 1 FROM class_subjects WHERE id = $2 AND is_active = TRUE
            )
        
        RETURNING *`,
        [cleanStudentId, cleanClassSubjectId] 
        );

        if(result.rows.length === 0) throw { status:404, message: 'Student or class subject not found' };
        return { message: 'Student enrolled in class subject successfully' };
    } catch (error) {
        if (error.code === '23505') {
            throw { status:409, message: 'Student is already enrolled in this class subject' };
        }
        throw error;
    }
};

export const bulkEnrollStudentsInClassSubject = async (enrollmentsArray, user) => {
    const results = {
        successfulInserts: [],
        failedInserts: []
    }; for (const enrollment of enrollmentsArray) {
        try {
            const cleanStudentId = sanitizeInt(enrollment.student_id);
            const cleanClassSubjectId = sanitizeInt(enrollment.class_subject_id);

            if (!isValidInt(cleanStudentId)) {
                results.failedInserts.push({ ...enrollment, error: 'Invalid student ID' });
                continue;
            }

            if (!isValidInt(cleanClassSubjectId)) {
                results.failedInserts.push({ ...enrollment, error: 'Invalid class subject ID' });
                continue;
            }

            if(user.role === 'teacher') {
                const classSubject = await pool.query(
                    `SELECT * FROM class_subjects WHERE id = $1 AND is_active = TRUE`,
                    [cleanClassSubjectId]
                );
                if(classSubject.rows.length === 0) {
                    results.failedInserts.push({ ...enrollment, error: 'Class subject not found' });
                    continue;
                }

                if(classSubject.rows[0].teacher_id !== user.referenceId) {
                    results.failedInserts.push({ ...enrollment, error: 'Access denied' });
                    continue;
                }

            }

            const result = await pool.query(
                `INSERT INTO enrollments (student_id, class_subject_id)
                SELECT $1, $2
                WHERE EXISTS (
                    SELECT 1 FROM students WHERE id = $1 AND is_active = TRUE
                )
                AND EXISTS (
                    SELECT 1 FROM class_subjects WHERE id = $2 AND is_active = TRUE
                )
            RETURNING *`,
            [cleanStudentId, cleanClassSubjectId]
         );

            if(result.rows.length === 0) {
                results.failedInserts.push({ ...enrollment, error: 'Student or class subject not found' });
                continue;
            }

            results.successfulInserts.push(result.rows[0]);
        } catch (error) {
            if (error.code === '23505') {
                results.failedInserts.push({ ...enrollment, error: 'Student is already enrolled in this class subject' });
            } else {
                results.failedInserts.push({ ...enrollment, error: 'Unexpected error' });
            
            }
        }
    }

    return {message: `${results.successfulInserts.length} records inserted successfully, ${results.failedInserts.length} records failed to insert.`,
     successfulInserts: results.successfulInserts,
      failedInserts: results.failedInserts};
};



export const unenrollStudentFromClassSubject = async (studentId, classSubjectId, user) => {
    const cleanStudentId = sanitizeInt(studentId);
    const cleanClassSubjectId = sanitizeInt(classSubjectId);

    if(!isValidInt(cleanStudentId)) throw { status:400, message: 'Invalid student ID' };
    if(!isValidInt(cleanClassSubjectId)) throw { status:400, message: 'Invalid class subject ID' };

    const existing = await pool.query (
        'SELECT * FROM enrollments WHERE student_id = $1 AND class_subject_id = $2 AND is_active = TRUE',
        [cleanStudentId, cleanClassSubjectId]
    );

    if(existing.rows.length === 0) throw { status:404, message: 'Enrollment not found' };

    if(user.role === 'teacher') {
        const classSubject = await pool.query(
            `SELECT * FROM class_subjects WHERE id = $1 AND is_active = TRUE`,
            [cleanClassSubjectId]
        );
        if(classSubject.rows.length === 0) throw { 
            status:404, message: 'Class subject not found' };

        if(classSubject.rows[0].teacher_id !== user.referenceId) throw {
             status:403, message: 'Access denied' };
    }

    const result = await pool.query(
    'UPDATE enrollments SET is_active = FALSE WHERE student_id = $1 AND class_subject_id = $2 AND is_active = TRUE RETURNING *',
    [cleanStudentId, cleanClassSubjectId]);

    if(result.rows.length === 0) throw { status:404, message: 'Enrollment not found' };
    return { message: 'Student unenrolled from class subject successfully' };
}


export const getStudentsByClassSubjectId = async (classSubjectId,user)=>{
    const cleanClassSubjectId = sanitizeInt(classSubjectId);
    if (!isValidInt(cleanClassSubjectId)) throw { status:400, message: 'Invalid class subject ID' };

    if (user.role === 'teacher') {
        const classSubject = await pool.query(
            `SELECT * FROM class_subjects WHERE id = $1 AND is_active = TRUE`,
            [cleanClassSubjectId]
        );
        if(classSubject.rows.length === 0) throw { 
            status:404, message: 'Class subject not found' };

        if(classSubject.rows[0].teacher_id !== user.referenceId) throw {
             status:403, message: 'Access denied' };

    }

    const result = await pool.query(
        `SELECT students.*
        FROM enrollments
        JOIN students ON enrollments.student_id = students.id
        WHERE enrollments.class_subject_id = $1
        AND enrollments.is_active = TRUE
        AND students.is_active = TRUE`,
        [cleanClassSubjectId]
    );
    return result.rows;
};
