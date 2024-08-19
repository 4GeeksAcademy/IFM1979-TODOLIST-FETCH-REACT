import React, { useState, useEffect } from "react";

const Home = () => {
  const [task, setTask] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showRegenerateButton, setShowRegenerateButton] = useState(false);

  useEffect(() => {
    getTasks();
  }, []);

  async function getTasks() {
    try {
      const response = await fetch(
        "https://playground.4geeks.com/todo/users/ivan_fuentes"
      );
      if (!response.ok) {
        if (response.status === 404) {
          await createUser();
          await getTasks();
        } else {
          throw new Error(`Error: ${response.statusText}`);
        }
      } else {
        const data = await response.json();
        setTask(data.todos);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function createUser() {
    try {
      const response = await fetch(
        "https://playground.4geeks.com/todo/users/ivan_fuentes",
        {
          method: "POST",
          headers: {
            accept: "application/json",
          },
          body: JSON.stringify([]),
        }
      );
      if (!response.ok) {
        throw new Error(`Error al crear usuario: ${response.statusText}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function addTask(e) {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      try {
        const newTask = { label: inputValue, is_done: false };
        const response = await fetch(
          "https://playground.4geeks.com/todo/todos/ivan_fuentes",
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
          }
        );
        if (response.ok) {
          const addedTask = await response.json();
          setTask((prevTask) => [...prevTask, addedTask]); // Añadir nueva tarea sin recargar
          setInputValue(""); // Limpiar el campo de entrada
        } else {
          console.error("Error adding task:", response.statusText);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function deleteOne(id) {
    try {
      const response = await fetch(
        `https://playground.4geeks.com/todo/todos/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setTask((prevTask) => prevTask.filter((task) => task.id !== id)); // Eliminar la tarea sin recargar
      } else {
        console.error("Error deleting task:", response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const deleteAll = async () => {
    try {
      const response = await fetch(
        "https://playground.4geeks.com/todo/users/ivan_fuentes",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setTask([]); // Limpiar el estado de tareas en el front-end sin recargar
        setShowRegenerateButton(true); // Mostrar el botón para regenerar usuario
        console.log("Todas las tereas se borraron con éxito");
      } else {
        console.error("Error al borrar todas las tareas");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const regenerateUser = async () => {
    await createUser(); // Regenerar usuario
    await getTasks(); // Recargar las tareas
    setShowRegenerateButton(false); // Ocultar el botón después de regenerar el usuario
  };

  return (
    <div className="App">
      <h1>To Do List</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={addTask}
        className="newTask-input"
        placeholder="Añadir nueva tarea"
      />
      <div>
        {task.length === 0 ? (
          <>
            <p>No hay tareas, añadir tareas</p>
            {showRegenerateButton && (
              <button className="regenerate-button" onClick={regenerateUser}>
                Regenerar usuario
              </button>
            )}
          </>
        ) : (
          <ul>
            {task.map((task, index) => (
              <li key={index} className="task-item">
                <span className="task-text">{task.label}</span>
                <button
                  className="delete-button"
                  onClick={() => deleteOne(task.id)}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p>Número de tareas: {task.length}</p>
      {task.length > 0 && (
        <button className="clear-button" onClick={deleteAll}>
          Borrar todas las tareas
        </button>
      )}
    </div>
  );
};

export default Home;









