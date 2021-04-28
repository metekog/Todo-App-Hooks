import React, { useEffect, useReducer, useState } from "react";
import { ACTIONS } from "./actionTypes";
import "../App.css";

const reducer = (todos, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TODO:
      return [...todos, addNewTodo(action.payload.name)];

    case ACTIONS.COMPLETE_TODO:
      return todos.map((todo) => {
        if (todo.id === action.id) {
          return { ...todo, complete: !todo.complete };
        } else {
          return { ...todo };
        }
      });

    case ACTIONS.DELETE_TODO:
      return todos.filter((todo) => todo.id !== action.id);

    default:
      return todos;
  }
};

const addNewTodo = (name) => {
  return { id: Date.now(), name, complete: false };
};

export const Todo = () => {
  const [name, setName] = useState("");

  const [todos, dispatch] = useReducer(reducer, [], () => {
    const localData = localStorage.getItem("todos");
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.ADD_TODO, payload: { name } });
    setName("");
  };

  return (
    <div className="site-container">
      <h1>TO-DO LIST</h1>
      <div style={{ color: "white" }}>
        {todos.length === 0 ? (
          <h2 style={{ color: "#23d41d" }}>All todos are done! Take a rest!</h2>
        ) : (
          <h2 style={{ color: "#e74242" }}>
            {todos.length > 1
              ? `There are ${todos.length} todos.`
              : `There is ${todos.length} todo.`}
          </h2>
        )}
      </div>
      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          className="todo-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter New Todo"
          required
        />
        <button className="todo-button">ADD</button>
      </form>
      <div></div>
      {todos.map((todo) => (
        <div key={todo.id}>
          <div
            style={{
              margin: "auto",
              borderRadius: "10px",
              width: "75%",
              textDecoration: todo.complete ? "line-through" : "",
              background: todo.complete ? "#23d41d" : "#e74242",
            }}
          >
            <div className="todo-list">{todo.name}</div>
          </div>
          <div>
            <button
              onClick={() =>
                dispatch({ type: ACTIONS.COMPLETE_TODO, id: todo.id })
              }
            >
              {todo.complete ? "Not Completed" : "Completed"}
            </button>
            <button
              onClick={() =>
                dispatch({ type: ACTIONS.DELETE_TODO, id: todo.id })
              }
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
