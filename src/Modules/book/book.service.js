import { ObjectId } from "mongodb";
import { BadRequestError, ConflictException, NotFoundException } from "../../Common/Exceptions/error.exception.js";
import { BookModel } from "../../DB/Models/book.model.js";

export const createBook = async(body) => {
    const {title, author, copies} = body;
    let errors = [];

    if(!title || !author || !copies) {
        errors.push("All fields are required");
    }

    if(title && (title.length < 3 || title.length > 30)) {
        errors.push("Title must be between 3 and 30 characters");
    }

    if(author && (author.length < 3 || author.length > 30)) {
        errors.push("Author must be between 3 and 30 characters");
    }

    if(copies && (isNaN(copies) || copies < 0)) {
        errors.push("Copies must be a positive number");
    }

    if(errors.length > 0) {
        throw BadRequestError({message: "Validation errors", options: {cause: {statusCode: 400, errors}}});
    }

    const existingBook = await BookModel.findOne({title, author});

    if(existingBook) {
        throw ConflictException({message: "Book with this title and author already exists"});
    }

    await BookModel.insertOne({title, author, copies});
    return {message: "Book created successfully"};
}

export const deleteBook = async (bookId) => {
    if (!ObjectId.isValid(bookId)) {
        throw BadRequestError({ message: "Invalid book ID" });
    }

    const result = await BookModel.deleteOne({
        _id: new ObjectId(bookId)
    });

    if (result.deletedCount === 0) {
        throw NotFoundException({ message: "Book not found" });
    }

    return { message: "Book deleted successfully" };
};

export const getAllBooks = async () => {
    const books = await BookModel.find().toArray();
    return { message: "Books retrieved successfully", books };
}

export const getBookById = async (bookId) => {
    if (!ObjectId.isValid(bookId)) {
        throw BadRequestError({ message: "Invalid book ID" });
    }

    const book = await BookModel.findOne({
        _id: new ObjectId(bookId)
    });

    if (!book) {
        throw NotFoundException({ message: "Book not found" });
    }

    return book;
}

export const updateBook = async (bookId, body) => {
    if (!ObjectId.isValid(bookId)) {
        throw BadRequestError({ message: "Invalid book ID" });
    }

    const book = await BookModel.findOne({
        _id: new ObjectId(bookId)
    });

    if (!book) {
        throw NotFoundException({ message: "Book not found" });
    }

    await BookModel.updateOne({
        _id: new ObjectId(bookId)
    }, {
        $set: body
    });

    return { message: "Book updated successfully" };
};
