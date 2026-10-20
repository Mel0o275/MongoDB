import { ObjectId } from "mongodb";
import { BadRequestError, NotFoundException } from "../../Common/Exceptions/error.exception.js";
import { UserModel } from "../../DB/Models/user.model.js";
import { BorrowModel } from "../../DB/Models/borrow.model.js";
import { BookModel } from "../../DB/Models/book.model.js";


export const validate = async (userId, bookId) => {
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

    return { user, book };
};

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
    return users;
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
    const { book } = await validate(userId, bookId);

    const existingBorrow = await BorrowModel.findOne({
        userId: new ObjectId(userId),
        bookId: new ObjectId(bookId),
        returnDate: { $exists: false }
    });

    if (existingBorrow) {
        throw BadRequestError({
            message: "You have already borrowed this book"
        });
    }

    if (book.copies <= 0) {
        throw BadRequestError({
            message: "No copies available for borrowing"
        });
    }

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

    await BorrowModel.insertOne({
        userId: new ObjectId(userId),
        bookId: new ObjectId(bookId),
        borrowDate: new Date()
    });

    return { message: "Book borrowed successfully" };
};

export const returnBook = async (userId, bookId) => {
    await validate(userId, bookId);

    const borrow = await BorrowModel.findOne({
        userId: new ObjectId(userId),
        bookId: new ObjectId(bookId),
        returnDate: { $exists: false }
    });

    if (!borrow) {
        const previousBorrow = await BorrowModel.findOne({
            userId: new ObjectId(userId),
            bookId: new ObjectId(bookId),
            returnDate: { $exists: true }
        });

        if (previousBorrow) {
            throw BadRequestError({
                message: "You have already returned this book"
            });
        }

        throw NotFoundException({
            message: "You have not borrowed this book"
        });
    }

    const result = await BorrowModel.updateOne(
        {
            _id: borrow._id,
            returnDate: { $exists: false }
        },
        {
            $set: { returnDate: new Date() }
        }
    );

    if (result.modifiedCount === 0) {
        throw BadRequestError({
            message: "You have already returned this book"
        });
    }

    await BookModel.updateOne(
        { _id: new ObjectId(bookId) },
        { $inc: { copies: 1 } }
    );

    return { message: "Book returned successfully" };
};