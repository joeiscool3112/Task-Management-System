import { useEffect, useState } from 'react';
import './App.css';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import API_URL from './config';
import ProjectsForm from './ProjectsForm';
import ProjectList from "./ProjectList";

function App() {
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerError, setRegisterError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState("register");
  const [error, setError] = useState("");

  const [color, setColor] = useState("#3b82f6");
  const [projectname, setProjectname] = useState("");
  const [projectdescription, setProjectdescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    const savedEmail = localStorage.getItem("email");

    if (token && savedUsername) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
      setEmail(savedEmail || "");
    }
  }, []);


  async function handleSubmitRegister(e) {
    e.preventDefault();
    setRegisterError("");

    if (!registerUsername || !registerEmail || !registerPassword) {
      setRegisterError("All fields are required");
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRegisterError(data.error || "Register failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("email", data.user.email);
      setIsLoggedIn(true);
      setUsername(data.user.username);
      setEmail(data.user.email);
      setRegisterError("");
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      setRegisterError("Server error");
    }
  }

  async function handleSubmitLogin(e) {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail || !loginPassword) {
      setLoginError("Email and password are required");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("email", data.user.email);
      setIsLoggedIn(true);
      setUsername(data.user.username);
      setEmail(data.user.email);
      setLoginError("");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setLoginError("Server error");
    }
  }

  async function handleSubmitProjectSearch(e) {
    e.preventDefault();
    setError("");

    if (!projectname.trim() || !projectdescription.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: projectname,
          description: projectdescription,
          color: color,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Create project failed");
        return;
      }

      setProjects((prev) => [data, ...prev]);
      setProjectname("");
      setProjectdescription("");
      setColor("#3b82f6");
      setError("");
    } catch (err) {
      console.error("CREATE PROJECT ERROR:", err);
      setError("Server error");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setUsername("");
    setEmail("");
    setProjects([]);
  }

useEffect(() => {
  if (!isLoggedIn) return;

  async function loadProjects() {
    try {
      setLoadingProjects(true);

      const res = await fetch(`${API_URL}/api/projects`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Cannot load projects");
        return;
      }

      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH PROJECTS ERROR:", err);
      setError("Cannot connect to server");
    } finally {
      setLoadingProjects(false);
    }
  }

  loadProjects();
}, [isLoggedIn]);

  return (
    <div className="app-shell">
      {isLoggedIn && (
        <>
          <header className="app-header">
            <div>
              <p className="eyebrow">Task Management System</p>
              <h1>Projects</h1>
              <p className="muted-text">Logged in as <b>{username}</b>{email ? ` · ${email}` : ""}</p>
            </div>

            <button
              className="top-action-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </header>

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
          {loadingProjects && <p className="muted-text">Loading projects...</p>}

          <ProjectList
            projects={projects}
            username={username}
            setProjects={setProjects}
          />
        </>
      )}

      {!isLoggedIn && (
        <div className="auth-card">
          <p className="eyebrow">Welcome back</p>

          <div className="tab-row">
            <button
              className={activeTab === "register" ? "active-tab" : ""}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
            <button
              className={activeTab === "login" ? "active-tab" : ""}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
          </div>

          {activeTab === "register" ? (
            <>
              <RegisterForm
                email={registerEmail}
                password={registerPassword}
                setEmail={setRegisterEmail}
                setPassword={setRegisterPassword}
                setUsername={setRegisterUsername}
                username={registerUsername}
                handleSubmitRegister={handleSubmitRegister}
              />
              {registerError && <p className="error-text">{registerError}</p>}

              <button
                className="switch-btn"
                onClick={() => setActiveTab("login")}
              >
                Already have an account? Login here
              </button>
            </>
          ) : (
            <>
              <LoginForm
                email={loginEmail}
                password={loginPassword}
                setEmail={setLoginEmail}
                setPassword={setLoginPassword}
                handleSubmitLogin={handleSubmitLogin}
              />
              {loginError && <p className="error-text">{loginError}</p>}

              <button
                className="switch-btn"
                onClick={() => setActiveTab("register")}
              >
                Don't have an account? Register here
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
