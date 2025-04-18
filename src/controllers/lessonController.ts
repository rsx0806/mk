import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Boom } from '@hapi/boom';
import { Lesson, Teacher, Student, LessonStudent } from '../models';

export class LessonController {
  async getLessons(req: Request, res: Response) {
    try {
      const {
        date,
        status,
        teacherIds,
        studentsCount,
        page = 1,
        lessonsPerPage = 5
      } = req.query;

      const where: any = {};
      
      if (date) {
        const dates = String(date).split(',');
        if (dates.length === 1) {
          where.date = dates[0];
        } else if (dates.length === 2) {
          where.date = {
            [Op.between]: dates
          };
        }
      }

      if (status !== undefined) {
        where.status = Number(status);
      }

      const include: any[] = [
        {
          model: Teacher,
          through: { attributes: [] },
        },
        {
          model: Student,
          through: { attributes: ['visit'] },
        }
      ];

      if (teacherIds) {
        const teacherIdsArray = String(teacherIds).split(',').map(Number);
        include[0].where = {
          id: {
            [Op.in]: teacherIdsArray
          }
        };
      }

      const offset = (Number(page) - 1) * Number(lessonsPerPage);
      
      const lessons = await Lesson.findAll({
        where,
        include,
        offset,
        limit: Number(lessonsPerPage),
        subQuery: false
      });

      const enrichedLessons = lessons.map(lesson => {
        const lessonJson = lesson.toJSON();
        const students = lessonJson.Students.map((student: any) => ({
          id: student.id,
          name: student.name,
          visit: student.LessonStudent.visit
        }));

        const visitCount = students.filter((s: { visit: boolean }) => s.visit).length;

        return {
          id: lessonJson.id,
          date: lessonJson.date,
          title: lessonJson.title,
          status: lessonJson.status,
          visitCount,
          students,
          teachers: lessonJson.Teachers
        };
      });

      if (studentsCount) {
        const counts = String(studentsCount).split(',').map(Number);
        const filteredLessons = enrichedLessons.filter(lesson => {
          const studentCount = lesson.students.length;
          if (counts.length === 1) {
            return studentCount === counts[0];
          }
          return studentCount >= counts[0] && studentCount <= counts[1];
        });
        return res.json(filteredLessons);
      }

      res.json(enrichedLessons);
    } catch (error) {
      console.error('Error in getLessons:', error);
      if (error instanceof Boom) {
        throw error;
      }
      res.boom.badImplementation('Database error');
    }
  }
} 