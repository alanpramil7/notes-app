import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

type Task = {
  id: number;
  task: string;
  description: string;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // useEffect(() => {
  //    async function fetchMyAPI() {
  //      let response = await fetch('api/data')
  //      response = await response.json()
  //      dataSet(response)
  //    }
  //
  //    fetchMyAPI()
  //  }, [])

  useEffect(() => {
    const fetchMyAPI = async () => {
      try {
        // const response = await fetch("http://localhost:5000/api/task");
        const response = await axios.get("http://localhost:5000/api/task");
        const tasks: Task[] = await response.data;

        setTasks(tasks);
      } catch (e) {
        console.log(e);
      }
    };

    fetchMyAPI();
  }, []);

  //   async function postJSON(data) {
  //   try {
  //     const response = await fetch("https://example.com/profile", {
  //       method: "POST", // or 'PUT'
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });
  //
  //     const result = await response.json();
  //     console.log("Success:", result);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // }

  const handleTaskCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    // const response = await fetch("http://localhost:5000/api/task", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     task,
    //     description,
    //   }),
    // });

    const response = await axios.post("http://localhost:5000/api/task", {
      task,
      description,
    });

    const newTask = await response.data;
    console.log(newTask);
    setTasks([newTask, ...tasks]);

    setTask("");
    setDescription("");
  };

  const handleTaskDelete = async (event: React.MouseEvent, taskId: number) => {
    event.stopPropagation();

    // await fetch(`http://localhost:5000/api/task/${taskId}`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    await axios.delete(`http://localhost:5000/api/task/${taskId}`);

    const newTask = tasks.filter((task) => taskId !== task.id);
    setTasks(newTask);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTask(task.task);
    setDescription(task.description);
  };

  const handleCancel = () => {
    setTask("");
    setDescription("");
    setSelectedTask(null);
  };

  const handleTaskUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedTask) {
      return;
    }

    // const response = await fetch(
    //   `http://localhost:5000/api/task/${selectedTask?.id}`,
    //   {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       task,
    //       description,
    //     }),
    //   },
    // );

    const response = await axios.put(
      `http://localhost:5000/api/task/${selectedTask?.id}`,
      {
        task,
        description,
      },
    );

    const updatedTask = await response.data;

    const newTasks = tasks.map((task) =>
      task.id === selectedTask.id ? updatedTask : task,
    );
    setTasks(newTasks);
    setTask("");
    setDescription("");
    setSelectedTask(null);
  };

  return (
    <div className="container">
      <form
        onSubmit={(event) =>
          selectedTask ? handleTaskUpdate(event) : handleTaskCreate(event)
        }
      >
        <input
          type="text"
          placeholder="Task"
          required
          value={task}
          onChange={(event) => setTask(event.target.value)}
        />
        <textarea
          rows={10}
          required
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        {selectedTask ? (
          <div className="edit-btn">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>cancel</button>
          </div>
        ) : (
          <button type="submit">Add Task</button>
        )}
      </form>
      <div className="grid">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="task"
            onClick={() => handleTaskClick(task)}
          >
            <div className="header">
              <button onClick={(event) => handleTaskDelete(event, task.id)}>
                X
              </button>
            </div>
            <h2>{task.task}</h2>
            <p>{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
