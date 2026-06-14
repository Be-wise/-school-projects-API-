import { sanitizeString, sanitizeInt, isValidInt } from "#utils/sanitize";
import pool from "#config/db";
 
export const createGrade = async (body,user) => {
const cleanStudentId = sanitizeInt(body.student_id);
const cleanClassSubjectId = sanitizeInt(body.class_subject_id);
const cleanMark = sanitizeInt(body.mark);
const cleanTerm = sanitizeInt(body.term);
const cleanAssessmentType = sanitizeString(body.assessment_type);
const cleanTotalMark = body.total_mark !== undefined ? sanitizeInt(body.total_mark) : undefined;

if (!isValidInt(cleanStudentId)) throw { status:400, message: 'Invalid student ID' };
if (!isValidInt(cleanClassSubjectId)) throw { status:400, message: 'Invalid class subject ID' };
if (!isValidInt(cleanMark) || cleanMark < 0) throw { status:400, message: 'Invalid mark' };
if (!isValidInt(cleanTerm)) throw { status:400, message: 'Invalid term' };
if (!cleanAssessmentType) throw { status:400, message: 'Assessment type is required' };
if ( cleanTotalMark !== undefined && 
   (!isValidInt(cleanTotalMark)|| cleanTotalMark <0 )
) throw { status:400, message: 'Invalid total mark' };

if(user.role === 'teacher') {
    const classSubject = await pool.query(
        `SELECT * FROM class_subjects WHERE id = $1 AND is_active = TRUE`,
        [cleanClassSubjectId]
    );
    if (classSubject.rows.length === 0) throw { status:404, message: 'Class subject not found' };

    if (classSubject.rows[0].teacher_id !== user.referenceId) throw { status:403, message: 'Access denied' };
}

try {
    const result = await pool.query(
        'INSERT INTO grades (student_id, class_subject_id, mark, term, assessment_type, total_mark) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [cleanStudentId, cleanClassSubjectId, cleanMark, cleanTerm, cleanAssessmentType, cleanTotalMark]
    );
    return result.rows[0];

} catch (error) {
    if (error.code === '23503') throw { status:400, message: 'Student ID or Class Subject ID does not exist' };
    throw error;
}
};

export const bulkCreateGrades = async (gradesArray, user) => {
    const results = {
        successfulInserts: [],
        failedInserts: []
    };
    for (const grade of gradesArray) {
        try {
            const cleanStudentId = sanitizeInt(grade.student_id);
            const cleanClassSubjectId = sanitizeInt(grade.class_subject_id);
            const cleanMark = sanitizeInt(grade.mark);
            const cleanTerm = sanitizeInt(grade.term);
            const cleanAssessmentType = sanitizeString(grade.assessment_type);
            const cleanTotalMark = grade.total_mark !== undefined ? sanitizeInt(grade.total_mark) : undefined;

            if (!isValidInt(cleanStudentId)) {
                results.failedInserts.push({ grade, reason: 'Invalid student ID' });
                continue;
            }

            if (!isValidInt(cleanClassSubjectId)) {
                results.failedInserts.push({ grade, reason: 'Invalid class subject ID' });
                continue;
            }

            if (!isValidInt(cleanMark) || cleanMark < 0) {
                results.failedInserts.push({ grade, reason: 'Invalid mark' });
                continue;
            }

            if (!isValidInt(cleanTerm)) {
                results.failedInserts.push({ grade, reason: 'Invalid term' });
                continue;
            }

            if (!cleanAssessmentType) {
                results.failedInserts.push({ grade, reason: 'Assessment type is required' });
                continue;
            }

            if (cleanTotalMark !== undefined && (!isValidInt(cleanTotalMark) || cleanTotalMark < 0)) {
                results.failedInserts.push({ grade, reason: 'Invalid total mark' });
                continue;
            }

            if(user.role === 'teacher') {
                const classSubject = await pool.query(
                    `SELECT * FROM class_subjects WHERE id = $1 AND is_active = TRUE`,
                    [cleanClassSubjectId]
                );
                if (classSubject.rows.length === 0) {
                    results.failedInserts.push({ grade, reason: 'Class subject not  found' });
                    continue;
                }

                if (classSubject.rows[0].teacher_id !== user.referenceId) {
                    results.failedInserts.push ({ grade, reason: 'Access denied' });
                    continue;
                }
            
        }

            const result = await pool.query(
                'INSERT INTO grades (student_id, class_subject_id, mark, term, assessment_type, total_mark) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [cleanStudentId, cleanClassSubjectId, cleanMark, cleanTerm, cleanAssessmentType, cleanTotalMark]
            );
            results.successfulInserts.push(result.rows[0]);

        } catch (error) {
            if (error.code === '23505') {
                results.failedInserts.push({ grade, reason: 'Grade already exists' });
            } else if (error.code === '23503') {
                results.failedInserts.push({ grade, reason: 'Reference does not exist ' });
            } else {
                results.failedInserts.push({ grade, reason: 'Unexpected error' });
            }
        }
    }
    return {
        message: `${results.successfulInserts.length} records inserted successfully, ${results.failedInserts.length} records failed to insert.`,
        successfulInserts: results.successfulInserts,
        failedInserts: results.failedInserts
    };
};

export const getAllGrades = async (user) => {
    let result 
    if (user.role === 'admin') {
     result = await pool.query('SELECT * FROM grades ORDER BY id ASC');
    }

    if (user.role === 'teacher') {
        result = await pool.query(
            'SELECT * FROM grades WHERE teacher_id = $1 ORDER BY id ASC',
            [user.referenceId]
        );
    }

    if (user.role === 'student') {
        result = await pool.query(
            'SELECT * FROM grades WHERE student_id = $1 ORDER BY id ASC',
            [user.referenceId]
        );
        
    }

    if (user.role === 'parent') {
        result = await pool.query(
            'SELECT * FROM grades WHERE student_id IN (SELECT student_id FROM parent_students WHERE parent_id = $1) ORDER BY id ASC',
            [user.referenceId]
        );
    }

    return result.rows;
};

export const getGradeById = async (id, user) => {
    const gradeId = sanitizeInt(id);
    if (!isValidInt(gradeId)) throw { status:400, message: 'Invalid grade ID' };

    let result;

    if (user.role === 'admin') {
        result = await pool.query(
            'SELECT * FROM grades WHERE id = $1',
            [gradeId]
        );
    }

    if (user.role === 'teacher') {
        
        result = await pool.query(
            'SELECT * FROM grades WHERE id = $1 AND teacher_id = $2',
            [gradeId, user.referenceId]
        );
    }

    if (user.role === 'student') {
        
        result = await pool.query(
            'SELECT * FROM grades WHERE id = $1 AND student_id = $2',
            [gradeId, user.referenceId]
        );
    }


    if (user.role === 'parent') {

        result = await pool.query(
            'SELECT * FROM grades WHERE id = $1 AND student_id IN (SELECT student_id FROM parent_students WHERE parent_id = $2)',
            [gradeId, user.referenceId]
        );
    }
    
    if (result.rows.length === 0) throw { status:404, message: 'Grade not found' };
    return result.rows[0];
};

export const updateGrade = async (id, body, user) => {
    const gradeId = sanitizeInt(id);
    if (!isValidInt(gradeId)) throw { status:400, message: 'Invalid grade ID' };
    const existing = await pool.query(  
        'SELECT * FROM grades WHERE id = $1',
        [gradeId]
    );
    if (existing.rows.length === 0) throw { status:404, message: 'Grade not found' }; 
    
    
    const cleanStudentId = body.student_id !== undefined ? sanitizeInt(body.student_id) : existing.rows[0].student_id;
    const cleanClassSubjectId = body.class_subject_id !== undefined ? sanitizeInt(body.class_subject_id) : existing.rows[0].class_subject_id;
    const cleanMark = body.mark !== undefined ? sanitizeInt(body.mark) : existing.rows[0].mark;
    const cleanTerm = body.term !== undefined ? sanitizeInt(body.term) : existing.rows[0].term;
    const cleanAssessmentType = body.assessment_type !== undefined ? sanitizeString(body.assessment_type) : existing.rows[0].assessment_type;
    const cleanTotalMark = body.total_mark !== undefined ? sanitizeInt(body.total_mark) : existing.rows[0].total_mark;

    if (body.student_id !== undefined && !isValidInt(cleanStudentId)) throw { status:400, message: 'Invalid student ID' };
    if (body.class_subject_id !== undefined && !isValidInt(cleanClassSubjectId)) throw { status:400, message: 'Invalid class subject ID' };
    if (body.mark !== undefined && (!isValidInt(cleanMark) || cleanMark < 0)) throw { status:400, message: 'Invalid mark' };
    if (body.term !== undefined && !isValidInt(cleanTerm)) throw { status:400, message: 'Invalid term' };
    if (body.assessment_type !== undefined && !cleanAssessmentType) throw { status:400, message: 'Assessment type is required' };
    if (body.total_mark !== undefined && (!isValidInt(cleanTotalMark) || cleanTotalMark < 0 || cleanTotalMark > 100)) throw { status:400, message: 'Invalid total mark' };

    if(user.role === 'teacher') {
    const classSubject = await pool.query(
        `SELECT * FROM class_subjects WHERE id = $1 AND is_active = TRUE`,
        [cleanClassSubjectId]
    );
    if(classSubject.rows.length === 0) throw {
         status:404, message: 'Class subject not found' };    

    if (classSubject.rows[0].teacher_id !== user.referenceId) throw {
         status:403, message: 'Access denied' };

}
  try{
    const result = await pool.query(
        'UPDATE grades SET student_id = $1, class_subject_id = $2, mark = $3, term = $4, assessment_type = $5, total_mark = $6 WHERE id = $7 RETURNING *',
        [cleanStudentId, cleanClassSubjectId, cleanMark, cleanTerm, cleanAssessmentType, cleanTotalMark, gradeId]
    );
    return result.rows[0];
}   catch (error){
    if (error.code === '23505') throw { status:409, message: 'Grade already exists' };
    throw error;
}

};


export const deleteGrade = async (id, user) => {
    const gradeId = sanitizeInt(id);
    if (!isValidInt(gradeId)) throw { status:400, message: 'Invalid grade ID' };

    const  existing = await pool .query(
        'SELECT * FROM grades WHERE id = $1',
        [gradeId]
    );
    if (existing.rows.length === 0) throw { status:404, message: 'Grade not found' };
    
    
    if(user.role === 'teacher') {
    const classSubject = await pool.query(
        `SELECT * FROM class_subjects WHERE id = $1 AND is_active = TRUE`,
        [existing.rows[0].class_subject_id]
    );
  

    if (classSubject.rows[0].teacher_id !== user.referenceId) throw {
         status:403, message: 'Access denied' };
    }
    
    const result = await pool.query(
        'DELETE FROM grades WHERE id = $1 RETURNING *',
        [gradeId]
    );
    if (result.rows.length === 0) throw { status:404, message: 'Grade not found' };
    return {message: 'Grade deleted successfully'};

}; 



export const  getGradesByStudentId = async (studentId, user) => {
    const cleanStudentId = sanitizeInt(studentId);
    if (!isValidInt(cleanStudentId)) throw { status:400, message: 'Invalid student ID' };

  let result;

  if (user.role === 'admin') {
    result = await pool.query(
        'SELECT * FROM grades WHERE student_id = $1 ORDER BY id ASC',
        [cleanStudentId]
    );
  }

  if (user.role === 'teacher') {
    result = await pool.query(
        'SELECT * FROM grades WHERE student_id = $1 AND teacher_id = $2 ORDER BY id ASC',
        [cleanStudentId, user.referenceId]
    );
  }

  if (user.role === 'student') {
    if (cleanStudentId !== user.referenceId) throw { status:403, message: 'Access denied' };
    result = await pool.query(
        'SELECT * FROM grades WHERE student_id = $1 ORDER BY id ASC',
        [cleanStudentId]
    );
  }

  if (user.role === 'parent') {
    result = await pool.query(
        'SELECT * FROM grades WHERE student_id = $1 AND student_id IN (SELECT student_id FROM parent_students WHERE parent_id = $2) ORDER BY id ASC',
        [cleanStudentId, user.referenceId]
    );
  }

  return result.rows;


}