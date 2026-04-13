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

}

export const getAllStudents = async () => {
    const result = await pool.query('SELECT * FROM students  ORDER BY id ASC');
    return result.rows[0];
    
}

export const getStudentById = async (id) =>{
    const studentID = sanitizeInt(Id);
    if (!isValidInt(studentId)) throw { status:400, message: ' Invalid student ID '};

    const result = await pool.query(
        'SELECT * FROM students WHERE id = $1',
        [studentId]
    );
    if (result.rows.length === 0) throw {status:404, message: 'Student not found'};

    return result.rows[0];

}

export const updateStudent = async (id, body) => {
    const studentId = sanitizeInt(id);
    const cleanName = sanitizeString(body.name);
    const cleanAge = sanitizeInt(body.age);

    if (!isValidInt(studentId)) throw { status: 400, message: 'Invalid student ID'};
    if (!cleanName) throw { status: 400, message: 'Name is required'};
    if (!isValidInt(cleanAge)) throw { status:400, message:'Invalid Age'};
    
    const result = await pool.query(
       'UPDATE students SET name =$1, age = $2 WHERE id = $3 RETURNING *',
       [cleanName, cleanAge, studentId] 
    )

    if (result.rows.length === 0 ) throw { status:404, message: 'Student not found'};

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


