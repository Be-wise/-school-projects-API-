import pool from '#config/db';
import { sanitizeInt, isValidInt, sanitizeString } from "#utils/sanitize";

export const createSubject = async (body) => {

    const cleanName = sanitizeString(body.name);
    if (!cleanName) throw { status:400, message: 'Name is required' };

   try{
     const result = await pool.query(
        'INSERT INTO subjects (name) VALUES ($1) RETURNING *',
        [cleanName]
    );
    return result.rows[0]; 
    } catch(error) {
        if (error.code === '23505') throw { status:409, message: 'Subject already exists' };
        throw Error
        
    }


}

export const bulkCreateSubjects = async (subjectsArray) => {
    const results = {
        successfulInserts: [],
        failedInserts: []
    };
    for (const subject of subjectsArray) {
        try {
            const cleanName = sanitizeString(subject.name);
            if (!cleanName) {
                results.failedInserts.push({ subject, reason: 'Name is required' });
                continue;
            }

            const result = await pool.query(
                'INSERT INTO subjects (name) VALUES ($1) RETURNING *',
                [cleanName]
            );
            results.successfulInserts.push(result.rows[0]);
        } catch (error) {
            if (error.code === '23505') {
                results.failedInserts.push({ subject, reason: 'Subject already exists' });
            } else {
                results.failedInserts.push({ subject, reason: 'Unexpected error' });
            }
        }
    }
    return {
        message: `${results.successfulInserts.length} records inserted successfully, ${results.failedInserts.length} records failed to insert.`,
        successfulInserts: results.successfulInserts,
        failedInserts: results.failedInserts
    };
};

export const getAllSubjects = async () => {
    const result = await pool.query ('SELECT * FROM subjects WHERE is_active = TRUE ORDER BY id ASC');
    return result.rows;

}


export const getSubjectById = async (id) => {
    const subjectId = sanitizeInt(id);
    if (!isValidInt(subjectId)) throw { status:400, message: 'Invalid subject ID' };

    const result = await pool.query(
        'SELECT * FROM subjects WHERE id = $1 AND is_active = TRUE',
        [subjectId]
    );
    if (result.rows.length === 0) throw { status:404, message: 'Subject not found' };
    return result.rows[0];

}

export const updateSubject = async (id,body) => {
    const subjectId = sanitizeInt(id);
   
     const cleanName = sanitizeString(body.name);
    if (!cleanName) throw { status:400, message: 'Name is required' };
     if (!isValidInt(subjectId)) throw { status:400, message: 'Invalid subject ID' };

    const existing = await pool.query(
        'UPDATE subjects SET name = $1 WHERE id = $2 AND is_active = TRUE RETURNING *',

        [subjectId, cleanName]
    );
    if (existing.rows.length === 0) throw { status:404, message: 'Subject not found' };

    return existing.rows[0];
}


export const deleteSubject = async (id) => {
    const subjectId = sanitizeInt(id);
    if (!isValidInt(subjectId)) throw { status:400, message: 'Invalid subject ID' };

    const result = await pool.query(
     'UPDATE subjects SET is_active = FALSE WHERE id = $1 AND is_active = TRUE RETURNING *',
        [subjectId]
       
    );

    if (result.rows.length === 0) throw { status:404, message: 'Subject not found' };
        return { message: 'Subject deleted successfully' };

};

