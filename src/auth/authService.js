import dotenv from 'dotenv'
dotenv.config()

import pool from '#config/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {sanitizeString,
    sanitizeInt,
    isValidInt }
from '#utils/sanitize'
//import { use } from 'react'



export const registerUser = async (email, password, role, referenceId) => {
    const sanitizedEmail = sanitizeString(email);
    const sanitizedRole = sanitizeString(role);
    const cleanReferenceId = referenceId ? sanitizeInt(referenceId) : null;
    


    if (!sanitizedEmail) throw { status:400, message: 'Email is required' };
    if (!password|| password.length < 8) throw { status:400, message: 'Password must be at least 8 characters' };
    if (!sanitizedRole) throw { status:400, message: 'Role is required' };
  try{
    const  existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [sanitizedEmail]
    );
    if (existingUser.rows.length > 0) {
        throw { status:409, message: 'Email already in use' };
    }

    if(role=== 'student' && referenceId) {
        const student= await pool.query(
            'SELECT id FROM students WHERE id = $1 AND is_active = true',
            [referenceId]
        );
        if (student.rows.length === 0) {
            throw { status:404, message: 'Student not found' };
        }
    }

    if(role === 'teacher' && referenceId) {
        const teacher = await pool.query(
            'SELECT id FROM teachers WHERE id = $1 AND is_active = true',
            [referenceId]
        );
        if (teacher.rows.length === 0) {
            throw { status:404, message: 'Teacher not found' };
        }
    }
    if(role ==='parent'&& referenceId){
        const parent = await pool.query(
            'SELECT id FROM parents WHERE id = $1',
            [referenceId]
        );
        if(parent.rows.length ===0) {
            throw {status:404, message: 'Parent not found'};
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
 
     const existing = await pool.query(
        `INSERT INTO users (email, password, role, reference_id) VALUES ($1,$2,$3,$4) RETURNING *`,
        [sanitizedEmail,hashedPassword, sanitizedRole, cleanReferenceId]
    );
    const {password:_, ...userWithoutPassword} = existing.rows[0];
    return userWithoutPassword;

    } catch(error) {
         if(error.code === '23505') {
         throw { status:409, message: 'Email already in use' };
        }
    if (error.code === '23514') {
        throw { status:400, message: 'Invalid role' };
    }
    if (error.code === '23503') {
        throw { status:404, message: 'Reference ID does not exist' };
    }
    if (error.code === '23502') {
    throw { status:400, message: 'Required field is missing' };
    };
    throw error;
    };

}

export const registerBulkUsers = async(usersArray) =>{
    const results = {
        successfulInserts: [],
        failedInserts: []
    };
      for (const user of usersArray) {

        try{
        const sanitizedEmail = sanitizeString(user.email);
        const sanitizedRole = sanitizeString(user.role);
        const cleanReferenceId = user.reference_id ? sanitizeInt(user.reference_id) : null;
        const password = user.password; 
        
    if (!sanitizedEmail) {
        results.failedInserts.push({ user, reason: 'Email is required' });
        continue;
    }
    if (!password || password.length < 8) {
        results.failedInserts.push({ user, reason: 'Password must be at least 8 characters' });
        continue;
    }
    if (!sanitizedRole) {
        results.failedInserts.push({ user, reason: 'Role is required' });
        continue;
    }

    if (!cleanReferenceId && (sanitizedRole === 'student' || sanitizedRole === 'teacher')) {
        results.failedInserts.push({ user, reason: 'Reference ID is required' });
        continue;
    }

    const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [sanitizedEmail]
    );
        if (existingUser.rows.length > 0) {
     results.failedInserts.push({ user, reason: 'Email already in use' });
        continue;
    }

    if(sanitizedRole=== 'student' && cleanReferenceId) {
        const student= await pool.query(
            'SELECT id FROM students WHERE id = $1 AND is_active = true',
            [cleanReferenceId]
        );
        if (student.rows.length === 0) {
             results.failedInserts.push({ user, reason: 'Student not found' });
            continue;
        }
    }

    if(sanitizedRole === 'teacher' && cleanReferenceId) {
        const teacher = await pool.query(
            'SELECT id FROM teachers WHERE id = $1 AND is_active = true',
            [cleanReferenceId]
        );
        if (teacher.rows.length === 0) {
             results.failedInserts.push({ user, reason: 'Teacher not found' });
            continue;   
        }
    }

    if(sanitizedRole === 'parent' && cleanReferenceId) {
        const parent = await pool.query(
            'SELECT id FROM parents WHERE id = $1',
            [cleanReferenceId]
        );
        if(parent.rows.length === 0) {
            results.failedInserts.push({user, reason: ' Parent not found'});
            continue;
        }
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
        `INSERT INTO users (email, password, role, reference_id) VALUES ($1,$2,$3,$4) RETURNING *`,
        [sanitizedEmail,hashedPassword, sanitizedRole, cleanReferenceId]
    );
    const {password:_, ...userWithoutPassword} = newUser.rows[0];
    results.successfulInserts.push(userWithoutPassword);


  //
} catch (error) {
     if(error.code === '23505') {
           results.failedInserts.push({ user, reason: 'Email already in use' });
        }
    else if (error.code === '23514') {
          results.failedInserts.push({ user, reason: 'Invalid role' });
        }
    
    else if (error.code === '23503') {
         results.failedInserts.push({ user, reason: 'Reference ID does not exist' });
    }
     else if (error.code === '23502') {
    results.failedInserts.push({ user, reason: 'Required field is missing' });
     }  else
        { results.failedInserts.push({ user, reason: 'Unexpected error' })};
    };
 
};
return {
    message: `${results.successfulInserts.length} users inserted successfully, ${results.failedInserts.length} users failed to insert.`,
    successfulInserts: results.successfulInserts,
    failedInserts: results.failedInserts
   }


}



export const loginUser = async (email, password) => {
    const sanitizedEmail = sanitizeString(email);
    if (!sanitizedEmail) throw { status:400, message: 'Email is required' };
    if (!password) throw { status:400, message: 'Password is required' };

    
    try {
        const user = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [sanitizedEmail]
    );
    if (user.rows.length === 0) throw { status:401, message: 'Invalid CREDENTIALS' };

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) throw { status:401, message: 'Invalid CREDENTIALS' };

    if (user.rows[0].is_active === false) throw { status:403, message: 'Account is deactivated' };


       const token = jwt.sign(
        { userId: user.rows[0].id,
             role: user.rows[0].role,
            referenceId: user.rows[0].reference_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN  } 
        )
    const { password: _, ...userWithoutPassword } = user.rows[0];
    return { token, user: userWithoutPassword };
 
    } catch (error) {
        throw error
    }
}   





