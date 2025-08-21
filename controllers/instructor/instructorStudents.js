import { Enrollment, User, Course } from "../../models/Index.js";
import { Op } from "sequelize";


export const addStudent = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body

    if (!name || !email || !password || !confirmPassword) return res.status(400).json({ message: "missing values" })

    if (password !== confirmPassword) return res.status(400).json({ message: "passwords dont match" })

    const existingUser = await User.findOne({ where: { email } })

    if (existingUser) return res.status(409).json({ message: "User with this email already exists" })

    try {
        const userCreated = await User.create(
            { name, email, password }
        )

        res.status(200).send({ message: "User created", userCreated })
    }
    catch (err) {
        res.status().json({ message: "new user not created" })
    }
}

export const getAllStudents = async (req, res) => {

    const allStudents = await User.findAll({
        where: { role: 'student' },
        attributes: { exclude: ['password'] },
        include: [{
            model: Enrollment,
            required: true,
            attributes: [],
            include: [{
                model: Course,
                where: { instructorId: 2 },
                required: true,
                attributes: []
            }]
        }],
    });

    if (!allStudents) return res.status(400).json({ message: 'No students found' })

    // const cleanedStudents = allStudents.map(data => {
    //     const plain = data.toJSON()
    //     const { password, Enrollments, ...rest } = plain
    //     return rest
    // })

    res.status(200).json({ message: 'Found students', allStudents })
}

export const updateStudent = async (req, res) => {

    const { id, email, fullName, password } = req.body

    if (!id || !email || !fullName || !password) return res.status(400).json({ message: "missing values" })

    const [updated] = await User.update(
        { email, fullName, password },
        { where: { id } }
    )

    if (updated === 0) return res.status(400).json({ message: "no user found" })

    res.status(200).json({ message: "updated", updated })

}

export const deleteStudent = async (req, res) => {

    const { id } = req.body

    if (!id) return res.status(400).json({ message: "id required" });

    const foundUser = await User.findOne(
        { where: { id } }
    )

    if (!foundUser) return res.status(400).json({ message: "no user found" })

    const deleted = await User.destroy(
        {
            where: {
                id,
                role: { [Op.ne]: "instructor" }
            }
        }
    )

    if (deleted === 0) return res.status(400).json({ message: "can not delete" })

    res.status(200).json({ message: "deleted user" })
}