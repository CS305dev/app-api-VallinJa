import { PrismaClient } from '@prisma/client';
import express, {Request, Response} from 'express';
import {Student} from '../src/types/Students';
import { Calendar } from '../src/types/Calendars';
import { Class } from '../src/types/Classes';
import cors from 'cors';

const port = process.env.PORT || 4000;
const prisma  = new PrismaClient();
const app = express()
app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000' }));



app.get('/students', async(_, res)=>{
  res.json(await prisma.student.findMany());
})

app.get('/students/:id', async(req,res)=>{
  const { id }  = req.params;

  const getData = await prisma.student.findUnique({
    where: { id : Number(id)}
  });

  res.json(getData);
})

app.post('/students', async (req,res)=>{
  const data: Student[] = req.body;

 
  const createData = await prisma.student.create({
    data:data
    
  });

  res.json(createData);
});

app.put('/students/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: Student[] = req.body;

  const updatedStudent = await prisma.student.update({
    where: { id: Number(id) },
    data: data,
  });

  res.json(updatedStudent);
});

app.delete('/students/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedStudent = await prisma.student.delete({
    where: { id: Number(id) },
  });

  res.json(deletedStudent);
});

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
        class: true,
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
        class: true,
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
  const { studentId, calendarId, classId } = req.body;

  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: Number(studentId),
        calendarId: Number(calendarId),
        classId: Number(classId),
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
  const { studentId, calendarId, classId } = req.body;

  try {
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: Number(id) },
      data: {
        studentId: Number(studentId),
        calendarId: Number(calendarId),
        classId: Number(classId),
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