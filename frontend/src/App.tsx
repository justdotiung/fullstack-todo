import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}
export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    fetch("/api/todos").then(res => res.json()).then((data: Todo[]) => setTodos(data)).catch(console.error)
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }

  const handleAdd = async (e:FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if(!input.trim()) return;

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({text: input})
    });

    const newTodo = await res.json();
    setTodos(prev => [...prev, newTodo]);
    setInput("")
  }

  const handleToggle = async (id: number):Promise<void> => {
    await fetch(`/api/todos/${id}`, {method: 'PATCH'});
    setTodos(prev => prev.map(t => t.id === id ? {...t, dome:!t.done}: t))
  }

  const handleDelete = async (id: number):Promise<void> => {
    await fetch(`/api/todos/${id}`, {method: 'DELETE'});
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div style= {{maxWidth: 400, margin: "2rem auto", fontFamily: "sans-serif"}}>
      <h1>Todo List</h1>
      <form onSubmit={handleAdd}>
        <input
          value={input}
          onChange={handleChange}
          placeholder="할 일을 입력하세요."
          style={{width:"70%", padding:"0,5rem"}}
          type="text" />

          <button type="submit" style={{ padding:"0.5rem", marginLeft:"0,5rem"}}>추가</button>
      </form>

      <ul style={{listStyle: "none", padding: 0}}>
        {todos.map((todo) => (
          <li key={todo.id} style={{margin:"0.5rem 0"}}>
            <input type="checkbox"
            checked={todo.done}
            onChange={() => handleToggle(todo.id)} />
            <span style={{marginLeft: "0.5rem", textDecoration: todo.done ? "line-through" : "none"}}>
              {todo.text}
            </span>

            <button 
            style={{marginLeft: "0.5rem"}}
            onClick={() => handleDelete(todo.id)}>삭제</button>
        </li>))}
      </ul>
    </div>
  )
}