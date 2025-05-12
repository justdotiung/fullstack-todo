import { PrismaClient } from "@prisma/client";
import  express, { NextFunction, Request, Response }  from "express";


const app = express();
const PORT = 3000;
const prisma = new PrismaClient();

app.use(express.json());

interface Todo {
    id: number;
    text: string;
    done: boolean;
}

app.get("/", (req:Request, res:Response) => {
    res.send('api server running')
})

app.get("/api/todos", async (req:Request, res: Response) => {
    const todos = await prisma.todo.findMany();
    res.json(todos);
})

app.post("/api/todos", async (req:Request, res: Response) => {
    const {text} = req.body;

    if(typeof text !== "string"|| text.trim() === "") {
        res.status(400).json({error:"text 필수"});
        return 
    }

    const newTodo = await prisma.todo.create({
        data: {text: text.trim()}
    });

    res.status(201).json(newTodo);
})


app.patch("/api/todos/:id", async (req:Request, res:Response) => {
    const id = Number(req.params.id);
    const todo = await prisma.todo.findUnique({where: {id}});
    if(!todo) {
        res.status(404).json({error: 'not found'});
        return 
    }

    const updated = await prisma.todo.update({
        where: {id},
        data: {done: !todo.done }
    });
    res.json(updated);
})

app.delete("/api/todos/:id", async (req:Request, res:Response) => {
    const id = Number(req.params.id);
     await prisma.todo.delete({where: {id}});
    res.sendStatus(204);

})

app.use((err:any, req:Request, res: Response, next: NextFunction) => {
    console.log(err.stack);
    res.status(500).json({error: "internal sever error"});
})

/**
 * @description 서버 실행
 */
app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
  