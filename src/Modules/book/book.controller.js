import { Router } from "express"
import * as bookService from "./book.service.js"
import { successResponse } from "../../Common/index.js"

const router = Router()

router.post("/", async (req, res) => {
    const result = await bookService.createBook(req.body)
    return successResponse({
        res,
        message: result.message,
        status: 201,
    })
})

router.delete("/:bookId", async (req, res) => {
    const result = await bookService.deleteBook(req.params.bookId)
    return successResponse({
        res,
        message: result.message,
        status: 200,
    })
})

router.get("/", async (req, res) => {
    const result = await bookService.getAllBooks()
    return successResponse({
        res,
        message: result.message,
        status: 200,
        data: result.books
    });
})

router.get("/:bookId", async (req, res) => {
    const result = await bookService.getBookById(req.params.bookId)
    return successResponse({
        res,
        message: result.message,
        status: 200,
        data: result
    })
})

router.put("/:bookId", async (req, res) => {
    const result = await bookService.updateBook(req.params.bookId, req.body)
    return successResponse({
        res,
        message: result.message,
        status: 200,
    })
})

export default router