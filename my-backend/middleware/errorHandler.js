export const notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.method} ${req.url}`);
    error.statusCode = 404;

    next(error);
};

export const errorHandler = (err, req, res, next) => {
    console.error('\n Error Caught:');
    console.error(`Message : ${err.message}`);
    console.error(`   Route   : ${req.method} ${req.url}`);
    console.error(`   Stack   : ${err.stack}\n`);

    const statusCode = err.statusCode ?? 500;

    res.status(statusCode).json({
        success: false,
        message: err.message ?? "Internal Server Error",

        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack
        })
    });
};