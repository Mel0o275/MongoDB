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

export const deleteUser = async (userId) => {
    if (!ObjectId.isValid(userId)) {
        throw BadRequestError({ message: "Invalid user ID" });
    }

    const result = await UserModel.deleteOne({
        _id: new ObjectId(userId)
    });

    if (result.deletedCount === 0) {
        throw NotFoundException({ message: "User not found" });
    }

    return { message: "User deleted successfully" };
};

export const getAllUsers = async () => {
    const users = await UserModel.find().toArray();
    return { message: "Users retrieved successfully", users };
}

export const getUserById = async (userId) => {
    if (!ObjectId.isValid(userId)) {
        throw BadRequestError({ message: "Invalid user ID" });
    }

    const user = await UserModel.findOne({
        _id: new ObjectId(userId)
    });

    if (!user) {
        throw NotFoundException({ message: "User not found" });
    }

    return user ;
}

export const updateUser = async (userId, body) => {
    if (!ObjectId.isValid(userId)) {
        throw BadRequestError({ message: "Invalid user ID" });
    }

    const user = await UserModel.findOne({
        _id: new ObjectId(userId)
    });

    if (!user) {
        throw NotFoundException({ message: "User not found" });
    }

    await UserModel.updateOne({
        _id: new ObjectId(userId)
    }, {
        $set: body
    });

    return { message: "User updated successfully" };
};

export const borrowBook = async (userId, bookId) => {
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(bookId)) {
        throw BadRequestError({ message: "Invalid user ID or book ID" });
    }
    const user = await UserModel.findOne({ _id: new ObjectId(userId) });
    if (!user) {
        throw NotFoundException({ message: "User not found" });
    }

    const book = await BookModel.findOne({ _id: new ObjectId(bookId) });
    if (!book) {
        throw NotFoundException({ message: "Book not found" });
    }

    if (book.copies <= 0) {
        throw BadRequestError({ message: "No copies available for borrowing" });
    }

    await BorrowModel.insertOne({
        userId: new ObjectId(userId),
        bookId: new ObjectId(bookId),
        borrowDate: new Date(),
    });

    const result = await BookModel.updateOne(
        {
            _id: new ObjectId(bookId),
            copies: { $gt: 0 }
        },
        {
            $inc: { copies: -1 }
        }
    );

    if (result.modifiedCount === 0) {
        throw BadRequestError({
            message: "No copies available for borrowing"
        });
    }

    return { message: "Book borrowed successfully" };

}

export const returnBook = async (userId, bookId) => {
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(bookId)) {
        throw BadRequestError({
            message: "Invalid user ID or book ID"
        });
    }

    const user = await UserModel.findOne({
        _id: new ObjectId(userId)
    });

    if (!user) {
        throw NotFoundException({ message: "User not found" });
    }

    const book = await BookModel.findOne({
        _id: new ObjectId(bookId)
    });

    if (!book) {
        throw NotFoundException({ message: "Book not found" });
    }

    const borrow = await BorrowModel.findOne({
        userId: new ObjectId(userId),
        bookId: new ObjectId(bookId),
        returnDate: { $exists: false }
    });

    if (!borrow) {
        throw NotFoundException({
            message: "No active borrowing record found for this book"
        });
    }

    await BorrowModel.updateOne(
        { _id: borrow._id },
        { $set: { returnedAt: new Date() } }
    );

    await BookModel.updateOne(
        { _id: new ObjectId(bookId) },
        { $inc: { copies: 1 } }
    );

    return { message: "Book returned successfully" };
};