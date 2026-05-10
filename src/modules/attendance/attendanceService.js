import pool from '#config/db';
import { sanitizeString, sanitizeInt, isValidInt } from '#utils/sanitize';

export const createAttendance = async (body) => {
    const cleanStudentId = sanitizeInt(body.student_id);
    const cleanClassSubjectId = sanitizeInt(body.class_subject_id);
    const cleanStatus = sanitizeString(body.status);
    const cleanDayDate = sanitizeString(body.day_date);

    if(!isValidInt(cleanStudentId)) throw { status:400, message: 'Invalid student ID' };
    if(!isValidInt(cleanClassSubjectId)) throw { status:400, message: 'Invalid class subject ID' };
    if(!cleanStatus) throw { status:400, message: 'Status is required' };
    if(!cleanDayDate) throw { status:400, message: 'Day date is required' };
  try{
    const result = await pool.query(
        'INSERT INTO attendance (student_id, class_subject_id, status, day_date) VALUES ($1, $2, $3, $4) RETURNING *',
        [cleanStudentId, cleanClassSubjectId, cleanStatus, cleanDayDate] 
    )
    return result.rows[0];
    }catch(error){
        if(error.code === '23505') throw { status:409, message: 'Attendance record already exists' };
        throw error;
    }
}

export const bulkCreateAttendance = async (attendanceArray) => {
  const results = {
    successfulInserts: [],
    failedInserts: []
  };

  for (const attendance of attendanceArray) { 
    try {
        const cleanStudentId = sanitizeInt(attendance.student_id);
        const cleanClassSubjectId = sanitizeInt(attendance.class_subject_id);
        const cleanStatus = sanitizeString(attendance.status);
        const cleanDayDate = sanitizeString(attendance.day_date);

        if(!isValidInt(cleanStudentId)) {results.failedInserts.push({ attendance, reason: 'Invalid student ID' });
         continue;
        };

        if(!isValidInt(cleanClassSubjectId)) {results.failedInserts.push({ attendance, reason: 'Invalid class subject ID' });
         continue;
        };

        if(!cleanStatus) {results.failedInserts.push({ attendance, reason: 'Status is required' });
         continue;
        };

        if(!cleanDayDate) {results.failedInserts.push({ attendance, reason: 'Day date is required' });
         continue;
        };

        const result = await pool.query(
            `INSERT INTO attendance (student_id, class_subject_id, status, day_date) VALUES ($1, $2, $3, $4) RETURNING *`,
            [cleanStudentId, cleanClassSubjectId, cleanStatus, cleanDayDate]
        );
        results.successfulInserts.push(result.rows[0]);
        

    } catch (error) {
        if (error.code === '23505') {
            results.failedInserts.push({ attendance, reason: 'Attendance record already exists' });
        } else if (error.code === '23503') {
            results.failedInserts.push({ attendance, reason: 'Referenced record does not exist' });
        } else {
            results.failedInserts.push({ attendance, reason: 'Unexpected error' });
        }
    }
   
}
return {
    message: `${results.successfulInserts.length} records inserted successfully, ${results.failedInserts.length} records failed to insert.`,
    successfulInserts: results.successfulInserts,
    failedInserts: results.failedInserts
   }
}

export const getAllAttendance = async () => {
    const result = await pool.query('SELECT * FROM attendance ORDER BY id ASC');
    return result.rows;
}

export const getAttendanceById = async (id) => {
    const cleanAttendanceId = sanitizeInt(id);

    if(!isValidInt(cleanAttendanceId)) throw{status:400 , message: 'Invalid Attendance Id'}

    const result = await pool.query('SELECT * FROM attendance WHERE id = $1',
     [cleanAttendanceId])

     if(result.rows.length===0) throw{status:404 , message: 'Attendance id not found'}
     return result.rows[0];
}


export const updateAttendance = async(id, body) =>{
    const cleanAttendanceId = sanitizeInt(id);

    if(!isValidInt(cleanAttendanceId)) throw{status:400 , message: 'Invalid Attendance Id'}

    const existing = await pool.query('SELECT * FROM attendance WHERE id =$1',
        [cleanAttendanceId]
    )
    if(existing.rows.length===0) throw {status:404, message: 'Attendance id not found'}
    
    const cleanClassSubjectId =body.classSubjectId !== undefined ? sanitizeInt(body.classSubjectId): existing.rows[0].class_subject_id;
    const cleanStatus = body.status !== undefined  ? sanitizeString(body.status): existing.rows[0].status;
    const cleanStudentId =body.studentId !== undefined ? sanitizeInt(body.studentId): existing.rows[0].student_id;

    if(body.classSubjectId !== undefined && !isValidInt(cleanClassSubjectId)) throw {status:400, message: 'Invalid class subject ID'};
    if(body.status !== undefined && !cleanStatus) throw {status:400, message: 'Status is required'};
    if(body.studentId!== undefined && !isValidInt(cleanStudentId)) throw {status:400, message: 'Invalid student ID'};

   try {
    const result = await pool.query(
        'UPDATE attendance SET class_subject_id = $1, status = $2 ,student_id = $3 WHERE id = $4 RETURNING *',
        [cleanClassSubjectId, cleanStatus, cleanStudentId, cleanAttendanceId]
    );

    return result.rows[0];
   } catch (error) {
    if(error.code === '23505') throw { status:409, message: 'Attendance record already exists' };
    throw error;
    
   } 


}

export const deleteAttendance = async (id) => {
    const cleanAttendanceId = sanitizeInt(id);
    if(!isValidInt(cleanAttendanceId)) throw {status:400, message: 'Invalid attendance ID'};

    const existing = await pool.query('SELECT * FROM attendance WHERE id = $1', [cleanAttendanceId]);
    if(existing.rows.length === 0) throw {status:404, message: 'Attendance ID not found'};

    const result =await pool.query('DELETE FROM attendance WHERE id = $1 RETURNING *',
         [cleanAttendanceId]);
    return { message: 'Attendance record deleted successfully' };
};


export const getAttendanceByStudentId = async (studentId) => {
    const cleanStudentId = sanitizeInt(studentId);
    if(!isValidInt(cleanStudentId)) throw {status:400, message: 'Invalid student ID'};

    const result = await pool.query('SELECT * FROM attendance WHERE student_id = $1 ORDER BY id ASC',
     [cleanStudentId]);
    return result.rows;
};
