import { Router } from "express"
import * as userService from "./auth.service.js"
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


export default router