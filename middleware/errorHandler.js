// middleware/errorHandler.js

export const notFound = (req, res, next) => {

    // ─── Ignore HEAD requests to common paths ───
    // Health checkers use HEAD — don't log as errors
    if (req.method === 'HEAD') {
        return res.status(200).end();
        // ↑ just return 200 for any HEAD request
        // HEAD = alive check — server IS running
    }

    const error = new Error(
        `Route not found: ${req.method} ${req.url}`
    );
    error.statusCode = 404;
    next(error);
};


export const errorHandler = (err, req, res, next) => {

    // Don't log HEAD requests as errors
    if (req.method !== 'HEAD') {
        console.error('\n🔴 ERROR CAUGHT:');
        console.error(`   Message : ${err.message}`);
        console.error(`   Route   : ${req.method} ${req.url}`);
        console.error(`   Stack   : ${err.stack}\n`);
    }

    const statusCode = err.statusCode ?? 500;

    // HEAD responses must have no body
    if (req.method === 'HEAD') {
        return res.status(statusCode).end();
    }

    res.status(statusCode).json({
        success: false,
        message: err.message ?? 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
        }),
    });
};