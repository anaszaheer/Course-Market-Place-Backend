import { Course } from "./Course.js";
import CourseRating from "./CourseRatings.js";
import { Enrollment } from "./Enrollment.js";
import { User } from "./User.js";


function setupAssociations() {
    // Instructor 
    User.hasMany(Enrollment, { foreignKey: "userId" })
    Enrollment.belongsTo(User, { foreignKey: "userId" })

    Course.hasMany(Enrollment, { foreignKey: "courseId" })
    Enrollment.belongsTo(Course, { foreignKey: "courseId" })

    User.hasMany(Course, {foreignKey: 'instructorId'})
    Course.belongsTo(User, {foreignKey: 'instructorId'})

    // Student
    User.hasMany(CourseRating, { foreignKey: 'userId' })
    CourseRating.belongsTo(User, { foreignKey: 'userId' })

    Course.hasMany(CourseRating, { foreignKey: 'courseId' })
    CourseRating.belongsTo(Course, { foreignKey: 'courseId' })
}

export {
    User,
    Enrollment,
    Course,
    setupAssociations
}