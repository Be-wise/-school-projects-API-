export const errorHandler = (error, req, res, next) => {
    console.error(`[${req.method}] ${req.path}`, error);

    if (error.status && error.message) {
        return res.status(error.status).json({ error: error.message});
    }
    res.status(500).json({error: 'Something went bang'});
}