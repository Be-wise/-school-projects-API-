import pool from '#config/db';
import {sanitizeString , sanitizeInt, isValidInt} from '#utils/sanitize';

export const createParent = async(body) => {
    const cleanName = sanitizeString(body.name);
    const cleanPhone = sanitizeString(body.phone);
    const cleanAddress = sanitizeString(body.address);
    const cleanRelationship = sanitizeString(body.relationship);

    if(!cleanName) throw {status:400, message: 'Name is required'};
    if(!cleanPhone) throw {status:400, message: 'Phone number is required'};
    if(!cleanAddress) throw{status:400, message: 'address is required'};
    if(!cleanRelationship) throw {status:400 , message:'Relationship is required'};

        const result = await pool.query(
        'INSERT INTO parents (name, phone, address, relationship) VALUES ($1, $2, $3, $4) RETURNING *',
        [cleanName, cleanPhone, cleanAddress, cleanRelationship]
    )

    return result.rows[0];

    
}

export const bulkCreateParents = async (parentsArray) => {
    const results = {
        successfulInserts: [],
        failedInserts: []
    };  for (const parent of parentsArray) {
        try {
            const cleanName = sanitizeString(parent.name);
            const cleanPhone = sanitizeString(parent.phone);
            const cleanAddress = sanitizeString(parent.address);
            const cleanRelationship = sanitizeString(parent.relationship);

            if (!cleanName) {
                results.failedInserts.push({ parent, reason: 'Name is required' });
                continue;
            }
            if (!cleanPhone) {
                results.failedInserts.push({ parent, reason: 'Phone number is required' });
                continue;
            }
            if (!cleanAddress) {
                results.failedInserts.push({ parent, reason: 'Address is required' });
                continue;
            }
            if (!cleanRelationship) {
                results.failedInserts.push({ parent, reason: 'Relationship is required' });
                continue;
            }
            const result = await pool.query(
                'INSERT INTO parents (name, phone, address, relationship) VALUES ($1, $2, $3, $4) RETURNING *',
                [cleanName, cleanPhone, cleanAddress, cleanRelationship]
            );
            results.successfulInserts.push(result.rows[0]);
        } catch (error) {
           if (error.code === '23505') {
                results.failedInserts.push({ parent, reason: 'Parent already exists' });
            } else {
                results.failedInserts.push({ parent, reason: 'Unexpected error' });
            } 
        }
    }
    return {
        message: `${results.successfulInserts.length} records inserted successfully, ${results.failedInserts.length} records failed to insert.`,
        successfulInserts: results.successfulInserts,
        failedInserts: results.failedInserts
    };
}

export const getAllParents = async () => {
    const result = await pool.query('SELECT * FROM parents ORDER BY id ASC');
    return result.rows;
}

export const getParentsById = async(id) =>{
    const parentsId = sanitizeInt(id)

    if(isValidInt(parentsId)) throw {status:400, message: 'Invalid id'}; 

    const result = await pool.query(
        'SELECT * FROM parents WHERE id=$1 AND is_active = TRUE',
        [parentsId]
    )
    if (result.rows.length === 0) throw {status:404, message: 'Parent not found'};
    return result.rows[0];
}

export const updateParent =async(id, body) =>{
    const parentId = sanitizeInt(id);

    if(!isValidInt(parentId)) throw {status:400, message: 'Invalid id'};

    const existing = await pool.query(
        'SELECT * FROM parents WHERE id =$1 AND is_active = TRUE RETURNING *',
        [parentId]
    )
    if(existing.rows.length === 0) throw{status:404, message: 'parent not found'}

    const cleanName = body.name !==undefined? sanitizeString(body.name) : existing.rows[0].name;
    const cleanPhone = body.phone !==undefined? sanitizeString(body.phone) : existing.rows[0].phone;
    const cleanAddress = body.address !==undefined? sanitizeString(body.address) : existing.rows[0].address;
    const cleanRelationship = body.relationship !==undefined? sanitizeString(body.relationship) : existing.rows[0].relationship;

    if(body.name !==undefined && !cleanName) throw {status:400, message: 'Name is required'};
    if(body.phone !==undefined && !cleanPhone) throw {status:400, message: 'Phone number is required'};
    if(body.address !==undefined && !cleanAddress) throw {status:400, message: 'Address is required'};
    if(body.relationship !==undefined && !cleanRelationship) throw {status:400, message: 'Relationship is required'};

    const result = await pool.query(
        'UPDATE parents SET name = $1, phone = $2, address = $3, relationship = $4 WHERE id = $5 AND is_active = TRUE RETURNING *',
        [cleanName, cleanPhone, cleanAddress, cleanRelationship, parentId]
    )
    return result.rows[0];
}

export const deleteParent = async(id) =>{
    const parentId = sanitizeInt(id);
    if(!isValidInt(parentId)) throw {status:404, message: 'Invalid id'};

    const result = await pool.query(
        'UPDATE parents SET is_active = FALSE WHERE id = $1 AND is_active = TRUE RETURNING *',
        [parentId]
    )
    if(result.rows.length === 0) throw {status:404, message: 'Parent not found'};  
    return {message: 'Parent deleted successfully'};
    
};


export const assignParentToStudent = async(parentId, studentId) => {
    const cleanParent = sanitizeInt(parentId);
    const cleanStudent = sanitizeInt(studentId);

    if(!isValidInt(cleanParent)) throw {status:400 , message : 'Parent Id is required'};
    if(!isValidInt(cleanStudent)) throw {status:400, message :'Student Id is required'};

    try {
        const result = await pool.query(
            `INSERT INTO parent_students(parent_id, student_id)
            SELECT $1, $2
            WHERE EXISTS (
                SELECT 1 FROM parents WHERE id = $1 AND is_active = TRUE
            )
            AND EXISTS (
                SELECT 1 FROM students WHERE id = $2 AND is_active = TRUE
                RETURNING *
            )`
            [cleanParent, cleanStudent]
        ); if(result.rows.length === 0) throw {status:404, message: 'Parent or student not found'};
        return {message: 'Parent assigned to student successfully'};
    } catch (error) {
        if (error.code === '23505') {
            throw {status:409, message: 'Parent already assigned to student'};
        }
        throw error;
        
    }

}

