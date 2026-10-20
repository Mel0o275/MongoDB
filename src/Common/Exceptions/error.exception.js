export const ApplicationError = ({
    message = "Application Error",
    options = { cause: { status: 500 } },
}) => {
    throw new Error(message, options);
};

export const NotFoundException = ({
    message = "Not Found",
    options = { cause: { status: 404 } },
}) => {
    ApplicationError({ message, options });
};

export const BadRequestError = ({
    message = "Bad Request",
    options = { cause: { status: 400, errors: undefined } },
}) => {
    ApplicationError({ message, options });
};

export const UnauthorizedException = ({
    message = "Unauthorized",
    options = { cause: { status: 401 } },
}) => {
    ApplicationError({ message, options });
};

export const ForbidenException = ({
    message = "Forbidden",
    options = { cause: { status: 403 } },
}) => {
    ApplicationError({ message, options });
};

export const ConflictException = ({
    message = "Conflict",
    options = { cause: { status: 409 } },
}) => {
    ApplicationError({ message, options });
};

export const InternalServerError = ({
    message = "Internal Server Error",
    options = { cause: { status: 500 } },
}) => {
    ApplicationError({ message, options });
};