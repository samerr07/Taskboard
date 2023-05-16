import React, { useState, useEffect } from "react";
import './App.css';
// import {AiFillDelete} from "react-icons/ai"
import {TiTick,TiDelete} from "react-icons/ti"

function App() {
  const [user, setUser] = useState("username");
  const [password, setPassword] = useState("password");

  // Dummy data for lists and tasks
  const [lists, setLists] = useState([
    {
      id: 1,
      name: "List - 1",
      tasks: [
        { id: 1, name: "Task 1", completed: false },
        { id: 2, name: "Task 2", completed: false },
        { id: 3, name: "Task 3", completed: false }
      ]
    },
    {
      id: 2,
      name: "List - 2",
      tasks: [
        { id: 4, name: "Task 4", completed: false },
        { id: 5, name: "Task 5", completed: false }
      ]
    }
  ]);

  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    // Save lists to dummy database
    localStorage.setItem("lists", JSON.stringify(lists));
  }, [lists]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Authenticate user with dummy data
    if (user === "username" && password === "password") {
      
      // Retrieve lists from dummy database
      const savedLists = JSON.parse(localStorage.getItem("lists"));
      if (savedLists !== null) {
        setLists(savedLists);
      }
      
    } else {
      alert("Invalid username or password.");
    }
  };

  const handleListAdd = () => {
    // Create new list with dummy data
    const newList = {
      id: lists.length + 1,
      name: `List ${lists.length + 1}`,
      tasks: []
    };
    // Add new list to state
    setLists([...lists, newList]);
  };

  const handleListDelete = (listId) => {
    // Filter out list to be deleted
    const updatedLists = lists.filter((list) => list.id !== listId);
    // Update state with new list array
    setLists(updatedLists);
  };

  const handleTaskAdd = (listId, taskName) => {
    // Create new task with dummy data
    const newTask = {
      id: Date.now(),
      name: taskName,
      completed: false
    };
    // Find list to add task to
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        // Add new task to list
        list.tasks.push(newTask);
      }
      return list;
    });
    // Update state with new list array
    setLists(updatedLists);
  };

  const handleTaskDelete = (listId, taskId) => {
    // Find list to remove task from
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        // Filter out task to be deleted
        list.tasks = list.tasks.filter((task) => task.id !== taskId);
      }
      return list;
    });
    // Update state with new list array
    setLists(updatedLists);
  };

  const handleTaskCompleted = (listId, taskId) => {
    // Find list and task to mark as completed
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id === taskId) {
            task.completed = true;
          }
          return task;
        });
      }
      return list;
    });
    // Update state with new list array
    setLists(updatedLists);
  };

  const handleDragStart = (e, task, listId) => {
    // Store dragged task and list ID
    setDraggedTask({ task, listId });
  };

  const handleDragOver = (e) => {
    // Prevent default behavior
    e.preventDefault();
  };

  const handleDrop = (e, listId) => {
    // Prevent default behavior
    e.preventDefault();
    // Find list to move task to
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        // Add dragged task to new list
        list.tasks.push(draggedTask.task);
      }
      if (list.id === draggedTask.listId) {
        // Remove dragged task from old list
        list.tasks = list.tasks.filter(
          (task) => task.id !== draggedTask.task.id
        );
      }
      return list;
    });
    // Update state with new list array
    setLists(updatedLists);
  };

  const handleLogout = () => {
    localStorage.removeItem("lists");
    setUser("");
  };

  if(user !== "username"){
    return (
      <div className="login">
        <h1>Welcome to Taskboard </h1>
        <form onSubmit={handleLogin}>
          <h1>LOGIN</h1>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      </div>
    )
  }

  return (
    <div className="task-board">
      <div className="nav">
      <h2>Welcome, {user}!</h2>
      <button onClick={handleLogout}>Logout</button>
      </div>
      
      
      <div className="lists-container">
        {lists.map((list) => (
          <div key={list.id} className="list">
            <h2>{list.name}</h2>
            <ul
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, list.id)}
            >
              {list.tasks.map((task) => (
                <li
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, list.id)}
                >
                  <span>{task.name}</span>
                  <button className="delTask" onClick={() => handleTaskDelete(list.id, task.id)}>
                  <TiDelete/>
                  </button>
                  {!task.completed && (
                    <button
                      className="completeBtn" onClick={() => handleTaskCompleted(list.id, task.id)}
                    >
                      <TiTick/>
                    </button>
                  )}
          
                </li>
              ))}
            </ul>
            <button className="addTask"
              onClick={() => handleTaskAdd(list.id, prompt("Enter task name:"))}
              
            >
              ➕ Add Task
            </button>
            <button className="delList" onClick={() => handleListDelete(list.id)}>
            <TiDelete/>Delete List
            </button>
          </div>
        ))}
        <button className="createList" onClick={handleListAdd}>Create New List <p>➕</p></button>
      </div>
    </div>
  );
}

export default App;
