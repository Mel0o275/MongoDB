import { Router } from "express"
import * as userService from "./user.service.js"
import { successResponse } from "../../Common/index.js"

const router = Router()

router.post("/signup", async(req, res) => {
    const result = await userService.signUp(req.body)
    return successResponse({
        res,
        message: result.message,
        status: 201,
    })
})

router.post("/login", async(req, res) => {
    const result = await userService.login(req.body)
    return successResponse({
        res,
        message: result.message,
        status: 200,
    })
})

router.delete("/:userId", async(req, res) => {
    const result = await userService.deleteUser(req.params.userId)
    return successResponse({
        res,
        message: result.message,
        status: 200,
    })
})

router.get("/", async(req, res) => {
    const result = await userService.getAllUsers()
    return successResponse({
        res,
        message: result.message,
        status: 200,
        data: result.users
    })
})

router.get("/:userId", async(req, res) => {
    const result = await userService.getUserById(req.params.userId)
    return successResponse({
        res,
        message: result.message,
        status: 200,
        data: result.user
    })
})

router.put("/:userId", async(req, res) => {
    const result = await userService.updateUser(req.params.userId, req.body)
    return successResponse({
        res,
        message: result.message,
        status: 200,
    })
})

router.post("/:userId/book/:bookId/borrow", async(req, res) => {
    const result = await userService.borrowBook(req.params.userId, req.params.bookId)
    return successResponse({
        res,
        message: result.message,
        status: 200,
    })
})

router.post("/:userId/book/:bookId/return", async (req, res) => {
    const result = await userService.returnBook(
        req.params.userId,
        req.params.bookId
    );

    return successResponse({
        res,
        message: result.message,
        status: 200
    });
});

export default router