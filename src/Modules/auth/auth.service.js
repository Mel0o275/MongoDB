import { ObjectId } from "mongodb";
import { BadRequestError, ConflictException, NotFoundException } from "../../Common/Exceptions/error.exception.js";
import { UserModel } from "../../DB/Models/user.model.js";
import { BorrowModel } from "../../DB/Models/borrow.model.js";
import { BookModel } from "../../DB/Models/book.model.js";

export const signUp = async (body) => {
    const { name, email, password, phone } = body;
    let errors = [];

    if (!name || !email || !password || !phone) {
        errors.push("All fields are required");
    }

    if (name && (name.length < 3 || name.length > 30)) {
        errors.push("Name must be between 3 and 30 characters");
    }

    if (email && !email.includes("@")) {
        errors.push("Invalid email format");
    }

    if (password && (password.length < 3 || password.length > 30)) {
        errors.push("Password must be between 3 and 30 characters");
    }

    const phoneRegex = /^01(0|1|2|5){1}[0-9]{8}$/;

    if (phone && !phoneRegex.test(phone)) {
        errors.push("Invalid phone number format");
    }

    if (errors.length > 0) {
        throw BadRequestError({ message: "Validation errors", options: { cause: { statusCode: 400, errors } } });
    }

    const existingUser = await UserModel.findOne({ $or: [{ email }, { phone }] });

    if (existingUser) {
        throw ConflictException({ message: "User with this email or phone already exists" });
    }

    await UserModel.insertOne({ name, email, password, phone });
    return { message: "User registered successfully" };
}

export const login = async (body) => {
    const { email, password } = body;

    const user = await UserModel.findOne({ email, password });

    if (!user) {
        throw NotFoundException({ message: "Invalid email or password" });
    }

    return user ;
}
