import { Enrollment, User, Course } from "../../models/Index.js";
import { Op } from "sequelize";


export const addCourse = async (req, res) => {

    const { title, descripton, price, instructorId } = req.body

    if (!title || !descripton || !price || !instructorId) return res.status(400).json({ message: "missing values" })

    const existingCourse = await Course.findOne({ where: { title } })

    if (existingCourse) return res.status(409).json({ message: "Course with this title already exists" })

    try {
        const courseCreated = await Course.create(
            { title, descripton, price, instructorId }
        )

        res.status(200).send({ message: "Course created", courseCreated })
    }
    catch (err) {
        res.status(500).json({ message: "new course not created" })
    }
}

export const getAllCourses = async (req, res) => {

    const allCourses = await Course.findAll()

    if (!allCourses) return res.status(400).json({ message: 'No courses found' })

    res.status(200).json({ message: 'Found students', allCourses })
}

export const updateCourses = async (req, res) => {

    const { id, title, description, price } = req.body

    if (!id || !title || !description || !price) return res.status(400).json({ message: "missing values" })

    const [updated] = await Course.update(
        { title, description, price },
        { where: { id } }
    )

    if (updated === 0) return res.status(400).json({ message: "no course found" })

    res.status(200).json({ message: "updated", updated })

}

export const deleteCourses = async (req, res) => {

    const { id } = req.body

    if (!id) return res.status(400).json({ message: "id required" });

    const foundCourse = await Course.findOne(
        { where: { id } }
    )

    if (!foundCourse) return res.status(400).json({ message: "no course found" })

    const deleted = await Course.destroy(
        { where: { id } }
    )

    if (deleted === 0) return res.status(400).json({ message: "not deleted" })

    res.status(200).json({ message: "deleted course" })
}