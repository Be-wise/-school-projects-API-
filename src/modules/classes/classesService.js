import pool from '#config/db';
import { sanitizeString, sanitizeInt , isValidInt} from "#utils/sanitize";


export const createClass = async (body) => {
    const cleanName = sanitizeString(body.name);
    if(!cleanName) throw {status:400, message: 'class name is required'}

   try {
    const result = await pool.query (
        'INSERT INTO classes (name) VALUES ($1) RETURNING *',
        [cleanName]
    );
 return result.rows[0];
     } catch (error){
        if (error.code ==='23505') throw {status: 409, message:'Class already exists'};
        throw error 
     }; 

};
 export const bulkCreateClasses = async (classesArray) => {
    const results = {
        successfulInserts: [],
        failedInserts: []
    };
    for (const classItem of classesArray) {
        try {
            const cleanName = sanitizeString(classItem.name);

            if (!cleanName) {
                results.failedInserts.push({ classItem, reason: 'Class name is required' });
                continue;
            }
            const result = await pool.query(
                'INSERT INTO classes (name) VALUES ($1) RETURNING *',
                [cleanName]
            );
            results.successfulInserts.push(result.rows[0]);
        } catch (error) {
            if (error.code === '23505') {
                results.failedInserts.push({ classItem, reason: 'Class already exists' });
            } else {
                results.failedInserts.push({ classItem, reason: 'Unexpected error' });
            }
        }
    }
    return {
        message: `${results.successfulInserts.length} records inserted successfully, ${results.failedInserts.length} records failed to insert.`,
        successfulInserts: results.successfulInserts,
        failedInserts: results.failedInserts
    };
};


export const getAllClasses = async () => {
    const result = await pool.query('SELECT * FROM classes WHERE is_active = TRUE ORDER BY id ASC');
    return result.rows;

};


export const getClassById = async (id) => {
    const cleanClass = sanitizeInt(id) 

    if(!isValidInt(cleanClass)) throw { status:400, message: 'Invalid class ID'};

    const result = await pool.query (
        'SELECT * FROM classes WHERE id = $1 AND is_active = TRUE',
        [cleanClass]
    );
    if (result.rows.length === 0) throw { status:404, message: 'Class not found' };
    return result.rows[0];
};

export const updateClassById = async (id, body) => {
const classId = sanitizeInt(id);
const cleanName = sanitizeString(body.name);


if(!isValidInt(classId)) throw { status:400, message: 'Invalid class ID'};
if(!cleanName) throw {status:400, message: 'Class name is required'};

 
    const existing = await pool.query(
        'UPDATE classes SET name = $1 WHERE id = $2 AND is_active = TRUE RETURNING *',
        [cleanName, classId]
    );

    if(existing.rows.length === 0) throw { status:404, message: 'Class not found'};
   
    return existing.rows[0]

};


export const deleteClass = async (id) => {
    const classId = sanitizeInt(id)
    if (!isValidInt(classId)) throw { status:400, message: 'Invalid class ID' };

    const result = await pool.query(
        'UPDATE classes SET is_active = FALSE WHERE id = $1 AND is_active = TRUE RETURNING *',
        [classId]
    );

    if(result.rows.length === 0) throw { status:404, message: 'Class not found' };
    return {message: 'Class deleted successfully'};

};
