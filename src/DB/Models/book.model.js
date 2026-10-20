import { db } from "../connection.db.js"

const bookSchema = {
    bsonType: "object",
    required: ["title", "author", "copies"],
    properties: {
        title: {
            bsonType: "string",
            minLength: 3,
            maxLength: 30,
            description: "Title is required"
        },

        author: {
            bsonType: "string",
            minLength: 3,
            maxLength: 30,
            description: "Author is required"
        },

        copies: {
            bsonType: "int",
            minimum: 0,
            description: "Copies is required"
        }
    }
}

export const BookModel = await db.createCollection("Books", {validator: {$jsonSchema: bookSchema}})