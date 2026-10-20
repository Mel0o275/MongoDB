import { db } from "../connection.db.js"

const borrowSchema = {
    bsonType: "object",
    required: ["userId", "bookId", "borrowDate"],
    properties: {
        userId: {
            bsonType: "objectId",
            description: "userId is required"
        },

        bookId: {
            bsonType: "objectId",
            description: "bookId is required"
        },

        borrowDate: {
            bsonType: "date",
            description: "borrowDate is required"
        },

        returnDate: {
            bsonType: "date",
            description: "returnDate is required"
        }
    }
}

export const BorrowModel = await db.createCollection("Borrows", {validator: {$jsonSchema: borrowSchema}})