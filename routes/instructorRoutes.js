import express from 'express'
const instructorRouter = express.Router()
import authMiddleware from '../middleware/authMiddleware.js'

import {
    addCourse,
    deleteCourses,
    getAllCourses,
    updateCourses,
} from '../controllers/instructor/instructorCourses.js'
import {
    addStudent,
    deleteStudent,
    getAllStudents,
    updateStudent
} from '../controllers/instructor/instructorStudents.js'


// courses
instructorRouter.get('/addCourse', authMiddleware, addCourse)
instructorRouter.get('/getCourses', authMiddleware, getAllCourses)
instructorRouter.put('/updateCourse', authMiddleware, updateCourses)
instructorRouter.delete('/deleteCourse', authMiddleware, deleteCourses)

// students
instructorRouter.get('/addStudent', authMiddleware, addStudent)
instructorRouter.get('/getAllStudents', authMiddleware, getAllStudents)
instructorRouter.put('/updateStudent', authMiddleware, updateStudent)
instructorRouter.delete('/deleteStudent', authMiddleware, deleteStudent)



export default instructorRouter