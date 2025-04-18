import { Router, Request, Response, NextFunction } from 'express';
import { getLessonsQuerySchema } from '../validators/lessonValidators';
import { LessonController } from '../controllers/lessonController';
import { ValidationError } from 'joi';

const router = Router();
const lessonController = new LessonController();

const validateQuery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getLessonsQuerySchema.validateAsync(req.query);
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

/**
 * @swagger
 * /lessons:
 *   get:
 *     summary: Получение списка занятий
 *     description: Возвращает список занятий с возможностью фильтрации
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Дата или период (YYYY-MM-DD или YYYY-MM-DD,YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         description: Статус занятия (0 - не проведено, 1 - проведено)
 *       - in: query
 *         name: teacherIds
 *         schema:
 *           type: string
 *         description: ID учителей через запятую
 *       - in: query
 *         name: studentsCount
 *         schema:
 *           type: string
 *         description: Количество студентов (число или диапазон через запятую)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: lessonsPerPage
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Количество занятий на странице
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date
 *                   title:
 *                     type: string
 *                   status:
 *                     type: integer
 *                   visitCount:
 *                     type: integer
 *                   students:
 *                     type: array
 *                     items:
 *                       type: object
 *                   teachers:
 *                     type: array
 *                     items:
 *                       type: object
 *       400:
 *         description: Ошибка валидации
 */
router.get('/lessons', validateQuery, async (req: Request, res: Response): Promise<void> => {
  await lessonController.getLessons(req, res);
});

export default router; 