export const validateStudentMiddleware = (req, res, next) => {
req.params.id = parseInt(req.params.id, 10); 

 isNaN    


    const { name, age, grade } = req.body;
    if (!name || !age || !grade) {
        return res.status(400).json({ error: 'Name, age, and grade are required' });
    }
    if (typeof name !== 'string' || typeof age !== 'number' || typeof grade !== 'string') {
        return res.status(400).json({ error: 'Invalid data types for name, age, or grade' });
    }
    next();
};  