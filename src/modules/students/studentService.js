import pool from '#config/db';
import { sanitizeString, sanitizeInt,isValidInt } from '#utils/sanitize';

export const createStudents = async (body ) => {



    const cleanName = sanitizeString(body.name);
    const cleanAge = sanitizeInt(body.age);

   
 
    if (!cleanName) throw { status:400, message: 'Name is required' };
    if (!isValidInt(cleanAge)) throw { status: 400, message : 'Invalid Age' };

    const result  = await pool.query (
        'INSERT INTO students (name,age) VALUES ($1, $2) returning *',
        [cleanName, cleanAge]
    )

    return result.rows [0];
};

export const bulkCreateStudents = async (studentsArray) => {
    const results = {
        successfulInserts: [],
        failedInserts: []
    };
    for (const student of studentsArray) {
        try {
            const cleanName = sanitizeString(student.name);
            const cleanAge = sanitizeInt(student.age);
            if (!cleanName) {
                results.failedInserts.push({ student, reason: 'Name is required' });
                continue;
            }
            if (!isValidInt(cleanAge)) {
                results.failedInserts.push({ student, reason: 'Invalid Age' });
                continue;
            }
            const result = await pool.query(
                'INSERT INTO students (name,age) VALUES ($1, $2) RETURNING  *',
                [cleanName, cleanAge]
            );
            results.successfulInserts.push(result.rows[0]);
        } catch (error) {
            if (error.code === '23505') {
                results.failedInserts.push({ student, reason: 'Student already exists' });
            } else {
                results.failedInserts.push({ student, reason: 'Unexpected error' });
            }
        }
    }
    return {
        message: `${results.successfulInserts.length} records inserted successfully, ${results.failedInserts.length} records failed to insert.`,
        successfulInserts: results.successfulInserts,
        failedInserts: results.failedInserts
    };
};

export const getAllStudents = async () => {
    const result = await pool.query('SELECT * FROM students  ORDER BY id ASC');
    return result.rows;
    
}

export const getStudentById = async (id) =>{
    const studentID = sanitizeInt(id);
    if (!isValidInt(studentID)) throw { status:400, message: ' Invalid student ID '};

    const result = await pool.query(
        'SELECT * FROM students WHERE id = $1',
        [studentID]
    );
    if (result.rows.length === 0) throw {status:404, message: 'Student not found'};

    return result.rows[0];

}

export const updateStudent = async (id, body) => {
    const studentId = sanitizeInt(id);
     if (!isValidInt(studentId)) throw { status: 400, message: 'Invalid student ID'};
     
     const existing = await pool.query(
        'SELECT * FROM students WHERE id = $1',
        [studentId]
     )
     if (existing.rows.length === 0) throw {status: 404, message: 'Student not found'};
      
    const cleanName = body.name !== undefined ? sanitizeString(body.name) :existing.rows[0].name;
    const cleanAge = body.age!== undefined ?sanitizeInt(body.age) :existing.rows[0].age;

   
    if (body.name !== undefined && !cleanName) throw { status: 400, message: 'Name is required'};
    if (body.age !== undefined &&!isValidInt(cleanAge)) throw { status:400, message:'Invalid Age'};
    

    const result = await pool.query(
       'UPDATE students SET name =$1, age = $2 WHERE id = $3 RETURNING *',
       [cleanName, cleanAge, studentId]

    
    )

   

    return result.rows[0];

}

export const deleteStudent = async (id) => {
    const studentId = sanitizeInt(id);
    if (!isValidInt(studeentId)) throw {status: 400, message: 'Invalid student ID'};

    const result = await pool.query(
        'DELETE FROM students WHERE id = $1 RETURNING *',
        [studentId]

    );

    if (result.rows.length === 0) throw { status: 404, message: 'Student not found'};

    return{ message: 'Student deleted successfully'};

}


