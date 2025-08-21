import { User } from "../../models/Index.js"
import bcrypt from 'bcrypt'


export const profile = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) return res.status(400).json({ message: 'parameters missing' })

        const userFound = await User.findOne({
            where: { id }
        })

        if (!userFound) return res.status(400).json({ message: 'no such user exists' })

        res.status(200).json({ message: 'success', userFound })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'error occured' })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params
        const { fullName, email, password, confirmPassword } = req.body

        if (!id) return res.status(400).json({ message: 'parameters missing' })
        if (!fullName || !email || !password) return res.status(400).json({ message: 'values missing' })
        if (password !== confirmPassword) return res.status(400).json({ message: 'passwords do not match' })

        const userFound = await User.findOne({
            where: { id }
        })
        if (!userFound) return res.status(404).json({ message: 'no such user exists' })

        const userEmailFound = await User.findOne({
            where: { email }
        })
        if (userEmailFound && userEmailFound.id !== parseInt(id)) return res.status(400).json({ message: 'user for this email already exists' })

        const hashedPassword = await bcrypt.hash(password, 10)

        const [updatedCount] = await User.update(
            { fullName, email, password: hashedPassword },
            {
                where: { id }
            }
        )

        if (!updatedCount) return res.status(400).json({ message: 'update failed' })

        res.status(200).json({ message: 'success', updatedCount })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'error occured' })
    }
}
