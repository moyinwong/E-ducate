import Knex from "knex";
import { tables } from "../tables";

// import { logger } from "../logger";

interface IPopularCourses {
  name: string;
  count: string;
}

export interface ICourseInfo {
  courseTitle: string;
  courseCategory: number;
  coursePrice: number;
  courseObjective: string;
  courseDescription: string;
  coursePrerequisite: string;
}

export class CourseService {
  constructor(private knex: Knex) {}

  test = async () => {
    console.log("hello");
  };

  getMostPurchasedCourses = async () => {
    const courses: Array<IPopularCourses> = await this.knex
      .table(tables.PURCHASED_COURSES)
      .select(`${tables.COURSES}.name`)
      .count(`${tables.COURSES}.id`)
      .innerJoin(
        "courses",
        "courses.id",
        `${tables.PURCHASED_COURSES}.course_id`
      )
      .groupBy(`${tables.COURSES}.id`);
    courses.sort((a, b) => parseInt(b.count) - parseInt(a.count));

    return courses;
  };

  getCourseInfoByName = async (courseName: string) => {
    const courseInfo = await this.knex
      .with(
        "T1",
        this.knex
          .select(
            "courses.name as course_name",
            "courses.objective",
            "courses.description as course_description",
            "courses.prerequisites",
            "courses.price",
            "courses.id",
            "category_id",
            "users.name as tutor_name",
            "courses.image"
          )
          .count("purchased_courses.user_id", { as: "purchased_users_num" })
          .count("rated_score", { as: "rated_num" })
          .avg("rated_score", { as: "rated_score" })
          .from(tables.PURCHASED_COURSES)
          .rightJoin(
            "courses",
            "courses.id",
            `${tables.PURCHASED_COURSES}.course_id`
          )
          .leftJoin("users", "users.id", `${tables.COURSES}.tutor_id`)
          .groupBy(
            "courses.name",
            "courses.objective",
            "courses.description",
            "courses.prerequisites",
            "courses.price",
            "courses.id",
            "category_id",
            "users.name",
            "courses.image"
          )
      )
      .select(
        "course_name",
        "objective",
        "course_description",
        "prerequisites",
        "price",
        "T1.id",
        "category_id",
        "purchased_users_num",
        "rated_num",
        "rated_score",

        "tutor_name",
        "image"
      )
      .count("lessons.id", { as: "lessons_number" })
      .from("T1")
      .innerJoin("lessons", "T1.id", "lessons.course_id")
      .groupBy(
        "course_name",
        "objective",
        "course_description",
        "prerequisites",
        "price",
        "T1.id",
        "category_id",
        "purchased_users_num",
        "rated_num",
        "rated_score",
        "tutor_name",
        "image"
      )
      .where("course_name", courseName)
      .limit(1);

    return courseInfo;
  };

  getCourseComments = async (courseName: string) => {
    const comments = await this.knex
      .select(
        `${tables.USERS}.name as user_name`,
        `${tables.PURCHASED_COURSES}.comment`,
        `${tables.PURCHASED_COURSES}.rated_score`
      )
      .from(`${tables.COURSES}`)
      .leftJoin(
        tables.PURCHASED_COURSES,
        `${tables.COURSES}.id`,
        `${tables.PURCHASED_COURSES}.course_id`
      )
      .leftJoin(
        tables.USERS,
        `${tables.PURCHASED_COURSES}.user_id`,
        `${tables.USERS}.id`
      )
      .where(`${tables.COURSES}.name`, courseName);

    return comments;
  };

  getCourseByInstructor = async (tutorEmail: string) => {

    console.log(tutorEmail)

    const courses = await this.knex
      .with(
        "T1",
        this.knex
          .select(
            "courses.name as course_name",
            "courses.objective",
            "courses.description as course_description",
            "courses.prerequisites",
            "courses.price",
            "courses.id",
            "category_id",
            "users.email as tutor_email",
            "courses.image"
          )
          .count("purchased_courses.user_id", { as: "purchased_users_num" })
          .count("rated_score", { as: "rated_num" })
          .avg("rated_score", { as: "rated_score" })
          .from(tables.PURCHASED_COURSES)
          .rightJoin(
            "courses",
            "courses.id",
            `${tables.PURCHASED_COURSES}.course_id`
          )
          .leftJoin("users", "users.id", `${tables.COURSES}.tutor_id`)
          .groupBy(
            "courses.name",
            "courses.objective",
            "courses.description",
            "courses.prerequisites",
            "courses.price",
            "courses.id",
            "category_id",
            "users.email",
            "courses.image"
          )
      )
      .select(
        "course_name",
        "objective",
        "course_description",
        "prerequisites",
        "price",
        "T1.id",
        "category_id",
        "purchased_users_num",
        "rated_num",
        "rated_score",

        "tutor_email",
        "image"
      )
      .count("lessons.id", { as: "lessons_number" })
      .from("T1")
      .innerJoin("lessons", "T1.id", "lessons.course_id")
      .groupBy(
        "course_name",
        "objective",
        "course_description",
        "prerequisites",
        "price",
        "T1.id",
        "category_id",
        "purchased_users_num",
        "rated_num",
        "rated_score",
        "tutor_email",
        "image"
      )
      .where("tutor_email", tutorEmail)
    
    console.log(courses)
    return courses
  }


  createCourse = async (userEmail: string, courseInfo: ICourseInfo, courseCover: string) => {
    const userIdArray = await (this.knex
    .select('id')
    .from(tables.USERS)
    .where('email', userEmail))
    const userId = userIdArray[0]

    const course = await this.knex
    .insert({
      name: courseInfo.courseTitle,
      price: courseInfo.coursePrice,
      category_id: courseInfo.courseCategory,
      tutor_id: userId.id,
      image: courseCover,
      description: courseInfo.courseDescription,
      objective: courseInfo.courseObjective,
      prerequisites: courseInfo.coursePrerequisite
    })
    .returning('id')
    .into(tables.COURSES);

    return course
  }
}
