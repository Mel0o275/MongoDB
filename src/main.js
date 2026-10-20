import express from 'express';
import { globalErrorHandler } from './Middleware/error.middleware.js';
import { PORT } from './Config/config.js';
import { connectDB } from './DB/connection.db.js';
import { NotFoundException } from './Common/Exceptions/error.exception.js';
import { authController, bookController, userController } from './Modules/index.js';


const app = express();

app.use(express.json());

await connectDB()

app.use('/auth', authController)
app.use('/user', userController)
app.use('/book', bookController)

app.use('{/*dummy}', (req, res) => {
    return NotFoundException({message : "Page not found"})
})

app.use(globalErrorHandler)


app.listen(PORT, () => {
    console.log(`Server is running on port :: ${PORT}`);
})