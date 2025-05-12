import  express, { NextFunction, Request, Response }  from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

interface Todo {
    id: number;
    text: string;
    done: boolean;
}

let todos: Todo[] = [];
let nextId = 1;


app.get("/", (req:Request, res:Response) => {
    res.send('api server running')
})

app.get("/api/todos", (req:Request, res: Response) => {
    res.json(todos);
})

app.post("/api/todos", (req:Request, res: Response) => {
    const {text} = req.body;

    
    res.json(todos);
    if(typeof text !== "string"|| text.trim() === "") {
        return res.status(400).json({error:"text 필수"});
    }

    const newTodo:Todo = {
        id: nextId++,
        done:false,
        text: text.trim()
    }

    todos.push(newTodo);
    res.status(201).json(newTodo);
})


app.patch("/api/todos/:id", (req:Request, res:Response) => {
    const id = Number(req.params.id);
    const todo = todos.find(t => t.id === id);
    if(!todo) {
        return res.status(404).json({error: 'not found'});
    }

    todo.done = !todo.done;
    res.json(todo);
})

app.delete("/api/todos/:id", (req:Request, res:Response) => {
    const id = Number(req.params.id);
    const idx = todos.findIndex(t => t.id === id);
    
    if(idx === -1) {
        return res.status(404).json({error: 'not found'})
    }

    todos.splice(idx, 1);
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
  