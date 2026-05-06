import { useEffect, useState } from 'react';
import './index.css';
import './App.css';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import API_URL from './config';
import ProjectsForm from './ProjectsForm';
import ProjectList from './ProjectList';

function App() {
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('register');
  const [error, setError] = useState('');

  //===============
  const [color, setColor] = useState('#3b82f6');
  const [projectname, setProjectname] = useState('');
  const [projectdescription, setProjectdescription] = useState('');
  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectDescription, setEditProjectDescription] = useState('');
  const [editProjectColor, setEditProjectColor] = useState('#3b82f6');

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [editingTaskId, setEditingTaskId] = useState(null);
  //================

  const isOwner = selectedProject && selectedProject.username === username;

  useEffect(() => { // get token and username from localstorage
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      const savedusername = localStorage.getItem('username');
      const savedemail = localStorage.getItem('email');

      if (token && savedusername) {
        setIsLoggedIn(true);
        setUsername(savedusername || '');
        setEmail(savedemail || '');
      } else {
        return;
      }
    };

    checkToken();
  }, []);

  async function handleSubmitRegister(e) {
    e.preventDefault();
    setRegisterError('');

    if (!registerUsername || !registerEmail || !registerPassword) {
      setRegisterError('All fields are required');
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRegisterError(data.error || 'Register failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('email', data.user.email);
      setIsLoggedIn(true);
      setUsername(data.user.username);
      setEmail(data.user.email);
      setRegisterError('');
    } catch (err) {
      console.error('REGISTER ERROR:', err);
      setRegisterError('Server error');
    }
  }

  async function handleSubmitLogin(e) {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Email and password are required');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('email', data.user.email);
      setIsLoggedIn(true);
      setUsername(data.user.username);
      setEmail(data.user.email);
      setLoginError('');
    } catch (err) {
      console.error('LOGIN ERROR:', err);
      setLoginError('Server error');
    }
  }

  async function fetchProjects() {
    const res = await fetch(`${API_URL}/api/projects`);
    const data = await res.json();

    if (res.ok) {
      setProjects(Array.isArray(data) ? data : []);
    }
  }

  async function handleSubmitProjectSearch(e) {
    e.preventDefault();
    setError('');

    if (!projectname.trim() || !projectdescription.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: projectname,
          description: projectdescription,
          color,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Create project failed');
        return;
      }

      setProjects((prev) => [data, ...prev]);
      setProjectname('');
      setProjectdescription('');
      setError('');
    } catch (err) {
      console.error('CREATE PROJECT ERROR:', err);
      setError('Server error');
    }
  }

 useEffect(() => {
  if (!isLoggedIn) return;

  async function loadProjects() {
    await fetchProjects();
  }

  loadProjects();
}, [isLoggedIn]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    setIsLoggedIn(false);
    setUsername('');
    setEmail('');
    setProjects([]);
    closePopup();
  }

  async function openTasks(project) {
    setSelectedProject(project);
    setShowTaskForm(false);
    setEditingTaskId(null);

    try {
      const res = await fetch(`${API_URL}/api/projects/${project.id}/tasks`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Cannot load tasks');
        return;
      }

      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      alert('Cannot connect to server');
    }
  }

  function closePopup() {
    setSelectedProject(null);
    setTasks([]);
    setShowTaskForm(false);
    setEditingTaskId(null);
  }

  function resetTaskForm() {
    setTaskName('');
    setTaskDescription('');
    setTaskDueDate('');
    setTaskStatus('todo');
    setTaskPriority('medium');
    setEditingTaskId(null);
  }

  function startEditProject(project) {
    setEditingProjectId(project.id);
    setEditProjectName(project.name || '');
    setEditProjectDescription(project.description || '');
    setEditProjectColor(project.color || '#3b82f6');
  }

  function cancelEditProject() {
    setEditingProjectId(null);
    setEditProjectName('');
    setEditProjectDescription('');
    setEditProjectColor('#3b82f6');
  }

  async function handleUpdateProject(projectId) {
    if (!editProjectName.trim() || !editProjectDescription.trim()) {
      alert('Project name and description are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/projects/${projectId}/edit`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editProjectName,
          description: editProjectDescription,
          color: editProjectColor,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Update project failed');
        return;
      }

      setProjects((prev) =>
        prev.map((project) => (project.id === projectId ? data : project))
      );

      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(data);
      }

      cancelEditProject();
    } catch (err) {
      console.log(err);
      alert('Cannot connect to server');
    }
  }

  async function handleDeleteProject(projectId) {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/projects/${projectId}/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Delete project failed');
        return;
      }

      setProjects((prev) => prev.filter((p) => p.id !== projectId));

      if (selectedProject && selectedProject.id === projectId) {
        closePopup();
      }
    } catch (err) {
      console.log(err);
      alert('Cannot connect to server');
    }
  }

  async function handleCreateTask(e) {
    e.preventDefault();

    if (!taskName.trim()) {
      alert('Task name is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/projects/${selectedProject.id}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: taskName,
          description: taskDescription,
          due_date: taskDueDate || null,
          status: taskStatus,
          priority: taskPriority,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Create task failed');
        return;
      }

      setTasks((prev) => [data, ...prev]);
      resetTaskForm();
      setShowTaskForm(false);
    } catch (err) {
      console.log(err);
      alert('Cannot connect to server');
    }
  }

  function startEditTask(task) {
    setEditingTaskId(task.id);
    setTaskName(task.name || '');
    setTaskDescription(task.description || '');
    setTaskDueDate(task.due_date ? task.due_date.slice(0, 10) : '');
    setTaskStatus(task.status || 'todo');
    setTaskPriority(task.priority || 'medium');
    setShowTaskForm(true);
  }

  async function handleUpdateTask(e) {
    e.preventDefault();

    if (!taskName.trim()) {
      alert('Task name is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(
        `${API_URL}/api/projects/${selectedProject.id}/tasks/${editingTaskId}/edit`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: taskName,
            description: taskDescription,
            due_date: taskDueDate || null,
            status: taskStatus,
            priority: taskPriority,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Update task failed');
        return;
      }

      setTasks((prev) =>
        prev.map((task) => (task.id === editingTaskId ? data : task))
      );

      resetTaskForm();
      setShowTaskForm(false);
    } catch (err) {
      console.log(err);
      alert('Cannot connect to server');
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(
        `${API_URL}/api/projects/${selectedProject.id}/tasks/${taskId}/delete`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Delete task failed');
        return;
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.log(err);
      alert('Cannot connect to server');
    }
  }

  async function handleChangeStatus(task, newStatus) {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(
        `${API_URL}/api/projects/${selectedProject.id}/tasks/${task.id}/edit`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Update status failed');
        return;
      }

      setTasks((prev) => prev.map((t) => (t.id === task.id ? data : t)));
    } catch (err) {
      console.log(err);
      alert('Cannot connect to server');
    }
  }

  return (
    <div id="app-shell" className="app-shell">
  
      {isLoggedIn && (
        <>
          <button
            id="logout-button" className="top-action-btn"
            onClick={handleLogout}
          >
            {username} - Logout
          </button>

          <ProjectsForm
            username={username}
            email={email}
            color={color}
            setColor={setColor}
            projectname={projectname}
            setProjectname={setProjectname}
            projectdescription={projectdescription}
            setProjectdescription={setProjectdescription}
            handleSubmitProjectSearch={handleSubmitProjectSearch}
          />

          {error && <p className="error-text">{error}</p>}

          <ProjectList
            projects={projects}
            username={username}
            selectedProject={selectedProject}
            tasks={tasks}
            editingProjectId={editingProjectId}
            editProjectName={editProjectName}
            setEditProjectName={setEditProjectName}
            editProjectDescription={editProjectDescription}
            setEditProjectDescription={setEditProjectDescription}
            editProjectColor={editProjectColor}
            setEditProjectColor={setEditProjectColor}
            showTaskForm={showTaskForm}
            setShowTaskForm={setShowTaskForm}
            taskName={taskName}
            setTaskName={setTaskName}
            taskDescription={taskDescription}
            setTaskDescription={setTaskDescription}
            taskDueDate={taskDueDate}
            setTaskDueDate={setTaskDueDate}
            taskStatus={taskStatus}
            setTaskStatus={setTaskStatus}
            taskPriority={taskPriority}
            setTaskPriority={setTaskPriority}
            editingTaskId={editingTaskId}
            isOwner={isOwner}
            openTasks={openTasks}
            closePopup={closePopup}
            resetTaskForm={resetTaskForm}
            startEditProject={startEditProject}
            cancelEditProject={cancelEditProject}
            handleUpdateProject={handleUpdateProject}
            handleDeleteProject={handleDeleteProject}
            handleCreateTask={handleCreateTask}
            startEditTask={startEditTask}
            handleUpdateTask={handleUpdateTask}
            handleDeleteTask={handleDeleteTask}
            handleChangeStatus={handleChangeStatus}
          />
        </>
      )}

      {!isLoggedIn && (
        <>
          {activeTab === 'register' ? (
            <>
              <RegisterForm
                email={registerEmail}
                password={registerPassword}
                setEmail={setRegisterEmail}
                setPassword={setRegisterPassword}
                setUsername={setRegisterUsername}
                username={registerUsername}
                handleSubmitRegister={handleSubmitRegister}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              {registerError && <p className="error-text">{registerError}</p>}
            </>
          ) : (
            <>
              <LoginForm
                email={loginEmail}
                password={loginPassword}
                setEmail={setLoginEmail}
                setPassword={setLoginPassword}
                handleSubmitLogin={handleSubmitLogin}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              {loginError && <p className="error-text">{loginError}</p>}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
