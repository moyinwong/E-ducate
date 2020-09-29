import { LessonService, IChoice, ILessonWithoutCourseId } from "../services/LessonService";
import { Request, Response } from "express";
import { logger } from "../logger";

export class LessonController {
  constructor(private lessonService: LessonService) {}

  courseLessons = async (req: Request, res: Response) => {
    try {
      const { course, user } = req.params;
      logger.debug(course, user);

      let lessons;
      if (user) {
        lessons = await this.lessonService.getLessonSummaryByCourseAndUser(
          course,
          user
        );
        console.log("lessons with user", lessons);
        if (lessons.length !== 0) {
          return res.status(200).json({ lessons });
        }
      }

      lessons = await this.lessonService.getLessonSummaryByCourse(course);
      console.log("lessons", lessons);
      if (lessons.length === 0) {
        return res.status(401).json({ message: "no lesson found" });
      }
      return res.status(200).json({ lessons });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "internal server error" });
    }
  };

  lesson = async (req: Request, res: Response) => {
    try {
      const { lesson } = req.params;
      const lessonInfo = await this.lessonService.getLessonAccessibility(
        lesson
      );
      return res.json({ lessonInfo });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "internal server error" });
    }
  };

  lessonQuestionAndAnswer = async (req: Request, res: Response) => {
    try {
      const { lesson } = req.params;
      const questionAndAnswer = await this.lessonService.getLessonQuestionAndAnswer(
        lesson
      );
      return res.json({ questionAndAnswer });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "internal server error" });
    }
  };

  lessonFile = async (req: Request, res: Response) => {
    try {
      const { lesson } = req.params;
      const files = await this.lessonService.getLessonFiles(lesson);
      return res.json({ files });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "internal server error" });
    }
  };

  checkAnswer = async (req: Request, res: Response) => {
    try {
      const { lesson } = req.params;
      const questionAndAnswers = req.body;

      const questionAndCorrectAnswers: Array<{
        question: string;
        answer_body: string;
      }> = await this.lessonService.getCorrectAnswer(lesson);

      const result = [];

      for (let correctAnswer of questionAndCorrectAnswers) {
        logger.debug(questionAndCorrectAnswers[correctAnswer.question]);
        logger.debug(correctAnswer.answer_body);
        if (
          questionAndAnswers[correctAnswer.question] ===
          correctAnswer.answer_body
        ) {
          const newObj = {};
          newObj[correctAnswer.question] = "correct";
          result.push(newObj);
        } else {
          const newObj = {};
          newObj[correctAnswer.question] = "wrong";
          result.push(newObj);
        }
      }
      return res.json({ result });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "internal server error" });
    }
  };

  createLesson = async (req: Request, res: Response) => {
    try {
      const { courseName } = req.params;
      const lessonInfo = req.body;
      let courseMaterial = req.files;

      let materialArray: any[] = [];
      if (courseMaterial.length > 0) {
        for (let material of courseMaterial) {
          materialArray.push(material.filename);
          console.log("materialarray", materialArray);
        }
        // let courseMaterial = req.files
        const createdLesson = await this.lessonService.createLesson(
          lessonInfo,
          courseName,
          materialArray
        );
        return res.status(200).json({ createdLesson });
      } else {
        const createdLesson = await this.lessonService.createLesson(
          lessonInfo,
          courseName
        );
        return res.status(200).json({ createdLesson });
      }

    } catch (e) {
      console.log(e.message);
      return res
        .status(500)
        .json({ message: "createLesson: internal server error" });
    }
  };

  createLessonQuestion = async (req: Request, res: Response) => {
    try {
      const { lessonName } = req.params;
      const questionInfos = req.body;

      let questionAndAnswersId: any[] = [];
      for (let item of questionInfos) {
        let question = item.value;
        let choices = item.choices;

        let questionId = await this.lessonService.createLessonQuestion(
          question,
          lessonName,
          choices
        );
        questionAndAnswersId.push(questionId);
      }

      console.log(questionAndAnswersId);

      return res
        .status(200)
        .json({ message: "successfully created questions" });
    } catch (e) {
      console.log(e.message);
      return res
        .status(500)
        .json({ message: "createQuestion: internal server error" });
    }
  };
}
