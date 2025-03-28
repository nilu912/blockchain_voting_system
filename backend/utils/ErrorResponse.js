// utils/ErrorResponse.js
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);  // To capture stack trace
    }
}

module.exports = ErrorResponse;
