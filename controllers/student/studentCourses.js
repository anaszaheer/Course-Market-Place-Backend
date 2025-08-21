import { col, fn } from "sequelize"
import CourseRating from "../../models/CourseRatings.js"
import { Course, Enrollment, User } from "../../models/Index.js"


export const getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.findAll({
            include: [{
                model: User,
                attributes: [['fullName', 'instructorName']]
            }]
        })

        if (!allCourses.length) return res.status(200).json({ message: 'no courses found' })

        res.status(200).json({ message: 'success', allCourses })
    }
    catch (error) {
        console.log({ error: error.message })
        res.status(500).json({ message: 'an error occured' })
    }
}

export const recentlyEnrolled = async (req, res) => {
    try {

        const userId = req.userId

        if (!userId) return res.status(400).json({ message: 'values missing', userId })

        const userFound = await User.findOne({
            where: { id: userId }
        })

        if (!userFound) return res.status(404).json({ message: 'User not found' });

        const recentlyEnrolled = await Course.findAll({
            include: [{
                model: Enrollment,
                attributes: [],
                where: { userId },
            }],
            order: [[Enrollment, 'createdAt', 'DESC']],
            limit: 4
        })

        res.status(200).json({ message: 'success', recentlyEnrolled })
    }
    catch (error) {
        console.log({ error: error.message })
        res.status(500).json({ message: 'an error occured' })
    }
}

export const coursesEnrolled = async (req, res) => {
    try {

        const userId = req.userId

        if (!userId) return res.status(400).json({ message: 'values missing' })

        const userFound = await User.findOne({
            where: { id: userId }
        })

        if (!userFound) return res.status(404).json({ message: 'User not found' });

        const coursesEnrolled = await Course.findAll({
            include: [
                {
                    model: Enrollment,
                    attributes: ['createdAt', 'completed'],
                    where: { userId },
                },
                {
                    model: User,
                    attributes: [['fullName', 'instructorName']]
                }
            ]
        })

        res.status(200).json({ message: 'success', coursesEnrolled })
    }
    catch (error) {
        console.log({ error: error.message })
        res.status(500).json({ message: 'an error occured' })
    }
}

export const coursesCompleted = async (req, res) => {
    try {
        const userId = req.userId

        if (!userId) return res.status(400).json({ message: 'values missing' })

        const userFound = await User.findOne({
            where: { id: userId }
        })

        if (!userFound) return res.status(400).json({ message: 'no such user exists' })

        const coursesCompleted = await Course.findAll({
            include: [{
                model: Enrollment,
                attributes: [],
                where: { userId, completed: true }
            }]
        })

        res.status(200).json({ message: 'success', numberOfCoursesCompleted: coursesCompleted.length, coursesCompleted })
    }
    catch (error) {
        console.log({ error: error.message })
        res.status(500).json({ message: 'an error occured' })
    }
}

export const averageRating = async (req, res) => {
    try {
        const userId = req.userId

        if (!userId) return res.status(400).json({ message: 'values missing' })

        const userFound = await User.findOne({
            where: { id: userId }
        })

        if (!userFound) return res.status(400).json({ message: 'no such user exists' })

        const averageRating = await CourseRating.findOne({
            where: { userId: userId },
            attributes: [[fn('AVG', col('rating')), 'rating']],
        })

        res.status(200).json({ message: 'success', averageRating: Math.ceil(averageRating.rating) })
    }
    catch (error) {
        console.log({ error: error.message })
        res.status(500).json({ message: 'an error occured' })
    }
}

export const courseDetails = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) return res.status(400).json({ message: 'parameters missing' })

        const courseFound = await Course.findOne({
            where: { id },
            include: [{
                model: User,
                attributes: ['fullName']
            }]
        })

        if (!courseFound) return res.status(400).json({ message: 'no such course exists' })

        let averageRating = await CourseRating.findOne({
            where: { courseId: id },
            attributes: [[fn('AVG', col('rating')), 'rating']],
            raw: true
        })
        averageRating = averageRating.rating ? parseFloat(averageRating.rating) : 0

        const courseRatingAndComments = await CourseRating.findAll({
            where: { courseId: id },
            attributes: ['rating', 'comment'],
            include: [{
                model: User,
                attributes: ['fullName']
            }]
        })

        const numberOfStudents = await Enrollment.count({
            where: { 'courseId': id }
        })

        res.status(200).json({
            message: 'success',
            courseFound,
            averageRating,
            numberOfStudents,
            courseRatingAndComments,
        })
    }
    catch (error) {
        console.log({ error: error.message })
        res.status(500).json({ message: 'an error occured' })
    }
}

export const myReviews = async (req, res) => {
    try {
        const userId = req.userId

        if (!userId) return res.status(400).json({ message: 'values missing' })

        const userFound = await User.findOne({
            where: { id: userId }
        })

        if (!userFound) return res.status(400).json({ message: 'no such user exists' })

        const myReviews = await Course.findAll({
            attributes: ['title'],
            include: [
                {
                    model: CourseRating,
                    attributes: ['rating', 'comment'],
                    where: { userId },
                    include: [{
                        model: User,
                        attributes: [['fullName', 'studentName']],
                    }]
                },
                {
                    model: User,
                    attributes: [['fullName', 'instructorName']],
                }
            ]
        })

        if (myReviews.length === 0) return res.status(200).json({ message: 'no reviews found' })

        res.status(200).json({ message: 'success', myReviews })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'error occured' })
    }
}

export const coursesReviewed = async (req, res) => {
    try {
        const userId = req.userId

        if (!userId) return res.status(400).json({ message: 'values missing' })

        const myReviews = await Course.findAll({
            attributes: ['title'],
            include: [
                {
                    model: CourseRating,
                    where: { userId },
                    attributes: []
                }
            ]
        })

        if (myReviews.length === 0) return res.status(200).json({ message: 'no reviewed courses found' })

        res.status(200).json({ message: 'success', myReviews })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'error occured' })
    }
}

export const coursesToBeReviewed = async (req, res) => {
    try {
        const userId = req.userId

        if (!userId) return res.status(400).json({ message: 'values missing' })

        const coursesToBeReviewed = await Course.findAll({
            attributes: ['title'],
            include: [
                {
                    model: Enrollment,
                    where: { userId },
                    attributes: []
                },
                {
                    model: CourseRating,
                    required: false,
                    where: { userId },
                    attributes: []
                }
            ],
            where: {
                '$CourseRatings.id$': null
            }
        })

        if (coursesToBeReviewed.length === 0) return res.status(200).json({ message: 'no courses to be reviewed found' })

        res.status(200).json({ message: 'success', coursesToBeReviewed })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'error occured' })
    }
}