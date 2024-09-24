import { PrismaClient } from '@prisma/client';
import express, {Request, Response} from 'express';
import {Student} from '../src/types/Students';


const port = process.env.PORT || 3000;
const prisma = new PrismaClient();
const app = express()
app.use(express.json());

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
  const data: Student = req.body;

 
  const createData = await prisma.student.create({
    data:data
    
  });

  res.json(createData);
});

app.put('/students/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: Student = req.body;

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



app.listen(3000, () =>
  console.log(`serving REST API at http://localhost:${port}`),
)