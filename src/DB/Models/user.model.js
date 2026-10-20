import { db } from "../connection.db.js"

const userSchema = {
    bsonType: "object",
    required: ["name", "email", "phone"],
    properties: {
        name: {
            bsonType: "string",
            minLength: 3,
            maxLength: 30,
            description: "Name is required"
        },

        email: {
            bsonType: "string",
            description: "Email is required"
        },

        phone: {
            bsonType: "string",
            pattern: "^01(0|1|2|5){1}[0-9]{8}$",
            description: "Name is required"
        },

        password: {
            bsonType: "string",
            minLength: 3,
            maxLength: 30,
            description: "Password is required"
        },
    }
}

export const UserModel = await db.createCollection("Users", {validator: {$jsonSchema: userSchema}})

await UserModel.createIndex({email: 1}, {unique: true})
await UserModel.createIndex({phone: 1}, {unique: true})