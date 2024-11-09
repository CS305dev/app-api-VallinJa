import { PrismaClient } from '@prisma/client';
import express, {Request, Response} from 'express';
import {Student} from '../src/types/Students';
import { Calendar } from '../src/types/Calendars';
import { Class } from '../src/types/Classes';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const port = process.env.PORT || 4000;
const prisma  = new PrismaClient();
const app = express()
app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000' }));


// Middleware configuration
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Create the "images" folder if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// Multer configuration to store uploaded files in the "images" folder
const storage = multer.diskStorage({
  destination: imagesDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generates unique file names
  },
});

const upload = multer({ storage });

// Middleware to serve static files from the "images" directory
app.use('/images', express.static(imagesDir));

// Fetch all students
app.get('/students', async (_, res) => {
  try {
    const students = await prisma.student.findMany();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// Fetch a single student by ID
app.get('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await prisma.student.findUnique({ where: { id: Number(id) } });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

// Add a new student with an optional photo upload
app.post('/students', upload.single('photo'), async (req: Request, res: Response) => {
  const { firstName, middleName, lastName, dateofbirth, address, enroll, email, contact } = req.body;
  const photo = req.file ? `/images/${req.file.filename}` : null; // Store the path or URL of the uploaded file

  try {
    const newStudent = await prisma.student.create({
      data: { firstName, middleName, lastName, dateofbirth, address, enroll, email, contact, photo },
    });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: "Failed to create student" });
  }
});

// Update a student with support for updating their photo
app.put('/students/:id', upload.single('photo'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, middleName, lastName, dateofbirth, address, enroll, email, contact } = req.body;
  const photo = req.file ? `/images/${req.file.filename}` : undefined; // Update the photo if a new one is uploaded

  try {
    const updatedStudent = await prisma.student.update({
      where: { id: Number(id) },
      data: { firstName, middleName, lastName, dateofbirth, address, enroll, email, contact, ...(photo && { photo }) },
    });
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: "Failed to update student" });
  }
});

// Delete a student
app.delete('/students/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedStudent = await prisma.student.delete({ where: { id: Number(id) } });
    res.json(deletedStudent);
  } catch (error) {
    res.status(400).json({ error: "Failed to delete student" });
  }
});

// Serve images statically
app.use('/images', express.static(path.join(__dirname, 'images')));

//Calendar

app.get('/calendars', async(_, res)=>{
  res.json(await prisma.calendar.findMany());
})

app.get('/calendars/:id', async(req,res)=>{
  const { id }  = req.params;

  const getData = await prisma.calendar.findUnique({
    where: { id : Number(id)}
  });

  res.json(getData);
})

app.post('/calendars', async (req: Request, res: Response) => {
  const data: Calendar = req.body;

  try {
    const createData = await prisma.calendar.create({
      data: data,
    });

    res.json(createData);
  } catch (error) {
    res.status(400).json({ error: "Failed to create calendar" });
  }
});

app.put('/calendars/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: Calendar[] = req.body;

  const updatedCalendar = await prisma.calendar.update({
    where: { id: Number(id) },
    data: data,
  });

  res.json(updatedCalendar);
});

app.delete('/calendars/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedCalendar = await prisma.calendar.delete({
    where: { id: Number(id) },
  });

  res.json(deletedCalendar);
});

//Classes

app.get('/classes', async(_, res)=>{
  res.json(await prisma.classes.findMany());
})

app.get('/classes/:id', async(req,res)=>{
  const { id }  = req.params;

  const getData = await prisma.classes.findUnique({
    where: { id : Number(id)}
  });

  res.json(getData);
})

app.post('/classes', async (req: Request, res: Response) => {
  const data: Class = req.body;

  try {
    const createData = await prisma.classes.create({
      data: data,
    });

    res.json(createData);
  } catch (error) {
    res.status(400).json({ error: "Failed to create class" });
  }
});

app.put('/classes/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: Class[] = req.body;

  const updatedClass = await prisma.classes.update({
    where: { id: Number(id) },
    data: data,
  });

  res.json(updatedClass);
});

app.delete('/classes/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedClass = await prisma.classes.delete({
    where: { id: Number(id) },
  });

  res.json(deletedClass);
});

//Enrollment

// Get all enrollments
app.get('/enrollments', async (_, res: Response) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: true,
        calendar: true,
        studentClasses: {
          include: {
            classes: true,
          },
        },
      },
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
});

// Get an enrollment by ID
app.get('/enrollments/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: Number(id) },
      include: {
        student: true,
        calendar: true,
        studentClasses: {
          include: {
            classes: true,
          },
        },
      },
    });

    if (enrollment) {
      res.json(enrollment);
    } else {
      res.status(404).json({ error: "Enrollment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enrollment" });
  }
});

// Create a new enrollment
app.post('/enrollments', async (req: Request, res: Response) => {
  const { studentId, calendarId, classIds } = req.body; // classIds is an array

  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: Number(studentId),
        calendarId: Number(calendarId),
        studentClasses: {
          create: classIds.map((classId: number) => ({
            classId: classId,
          })),
        },
      },
      include: {
        studentClasses: {
          include: {
            classes: true,
          },
        },
      },
    });
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(400).json({ error: "Failed to create enrollment" });
  }
});

// Update an enrollment by ID
app.put('/enrollments/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { studentId, calendarId, classIds } = req.body;

  try {
    // Remove existing classes for the enrollment
    await prisma.studentClass.deleteMany({
      where: { enrollmentId: Number(id) },
    });

    // Update enrollment and add new classes
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: Number(id) },
      data: {
        studentId: Number(studentId),
        calendarId: Number(calendarId),
        studentClasses: {
          create: classIds.map((classId: number) => ({
            classId: classId,
          })),
        },
      },
      include: {
        studentClasses: {
          include: {
            classes: true,
          },
        },
      },
    });
    res.json(updatedEnrollment);
  } catch (error) {
    res.status(400).json({ error: "Failed to update enrollment" });
  }
});

// Delete an enrollment by ID
app.delete('/enrollments/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Delete related studentClasses entries
    await prisma.studentClass.deleteMany({
      where: { enrollmentId: Number(id) },
    });

    // Delete the enrollment
    const deletedEnrollment = await prisma.enrollment.delete({
      where: { id: Number(id) },
    });
    res.json(deletedEnrollment);
  } catch (error) {
    res.status(400).json({ error: "Failed to delete enrollment" });
  }
});

app.listen(port, () => {
  console.log(`Serving REST API at http://localhost:${port}`);
});