class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}


class ErrorNoEncontrado extends CustomError {
    constructor(message = "No se encontro ‼︎") {
        super(message, 404);
    }
}


class ErrorSolicitudIncorrecta extends CustomError{
    constructor(message = "Solicitud incorrecta ‼︎"){
        super(message, 400)
    }
}

module.exports ={
    CustomError,
    ErrorNoEncontrado,
    ErrorSolicitudIncorrecta
}