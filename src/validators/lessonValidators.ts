import Joi from 'joi';

export const getLessonsQuerySchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}(,\d{4}-\d{2}-\d{2})?$/)
    .optional(),
  status: Joi.number()
    .valid(0, 1)
    .optional(),
  teacherIds: Joi.string()
    .pattern(/^\d+(,\d+)*$/)
    .optional(),
  studentsCount: Joi.string()
    .pattern(/^\d+(,\d+)?$/)
    .optional(),
  page: Joi.number()
    .min(1)
    .default(1),
  lessonsPerPage: Joi.number()
    .min(1)
    .default(5)
}); 