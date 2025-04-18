import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

// Модель Lesson
export class Lesson extends Model {
  public id!: number;
  public date!: Date;
  public title!: string;
  public status!: number;
}

Lesson.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'lessons',
  timestamps: false,
});

// Модель Teacher
export class Teacher extends Model {
  public id!: number;
  public name!: string;
}

Teacher.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'teachers',
  timestamps: false,
});

// Модель Student
export class Student extends Model {
  public id!: number;
  public name!: string;
}

Student.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'students',
  timestamps: false,
});

// Модель LessonTeacher
export class LessonTeacher extends Model {}

LessonTeacher.init({}, {
  sequelize,
  tableName: 'lesson_teachers',
  timestamps: false,
});

// Модель LessonStudent
export class LessonStudent extends Model {
  public visit!: boolean;
}

LessonStudent.init({
  visit: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'lesson_students',
  timestamps: false,
});

// Определение связей
Lesson.belongsToMany(Teacher, { through: LessonTeacher, foreignKey: 'lesson_id' });
Teacher.belongsToMany(Lesson, { through: LessonTeacher, foreignKey: 'teacher_id' });

Lesson.belongsToMany(Student, { through: LessonStudent, foreignKey: 'lesson_id' });
Student.belongsToMany(Lesson, { through: LessonStudent, foreignKey: 'student_id' }); 