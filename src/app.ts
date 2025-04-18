import express from 'express';
import boom from 'express-boom';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import lessonRoutes from './routes/lessonRoutes';
import { sequelize } from './config/database';
// import { seeds } from './database/seeders';
// import { Lesson, Teacher, Student, LessonTeacher, LessonStudent } from './models';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(boom());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api', lessonRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    await sequelize.sync();

    //await sequelize.sync({ force: true });
    // console.log('Database tables created');

    // await Teacher.bulkCreate(seeds.teachers);
    // await Student.bulkCreate(seeds.students);
    // await Lesson.bulkCreate(seeds.lessons);
    // await LessonTeacher.bulkCreate(seeds.lesson_teachers);
    // await LessonStudent.bulkCreate(seeds.lesson_students);
    
    // console.log('Seed data imported successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Unable to connect to the database or start the server:', error);
    process.exit(1);
  }
};

startServer(); 