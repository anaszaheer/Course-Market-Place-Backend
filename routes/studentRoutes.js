import express from 'express'
const studentRouter = express.Router()
import authMiddleware from '../middleware/authMiddleware.js'

import {
    coursesCompleted,
    coursesEnrolled,
    averageRating,
    recentlyEnrolled,
    getAllCourses,
    courseDetails,
    myReviews,
    coursesReviewed,
    coursesToBeReviewed,
} from '../controllers/student/studentCourses.js'
import {
    profile,
    updateProfile
} from '../controllers/student/studentProfile.js'


studentRouter.get('/getAllCourses', authMiddleware, getAllCourses)
studentRouter.get('/recentlyEnrolled', authMiddleware, recentlyEnrolled)
studentRouter.get('/coursesEnrolled', authMiddleware, coursesEnrolled)
studentRouter.get('/coursesCompleted', authMiddleware, coursesCompleted)
studentRouter.get('/averageRating', authMiddleware, averageRating)
studentRouter.get('/courseDetails/:id', authMiddleware, courseDetails)
studentRouter.get('/profile/:id', authMiddleware, profile)
studentRouter.put('/updateProfile/:id', authMiddleware, updateProfile)
studentRouter.get('/myReviews/:id', authMiddleware, myReviews)
studentRouter.get('/coursesReviewed/:id', authMiddleware, coursesReviewed)
studentRouter.get('/coursesToBeReviewed/:id', authMiddleware, coursesToBeReviewed)

export default studentRouter