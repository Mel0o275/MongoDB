
export const globalErrorHandler = (err, req, res, next) => {
    return res.status(err.cause?.status || 500).json({
        status: err.cause?.status || 500,
        message: err.message || "Internal Server Error",
        err: err.cause?.errors || [], 
        stack: err.stack
    })
}