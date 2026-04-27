import { useEffect, useState } from 'react'
import './App.css'
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'
import API_URL from './config'

function App() {
const [registerEmail, setRegisterEmail] = useState('');
const [registerPassword, setRegisterPassword] = useState('');
const [registerUsername, setRegisterUsername] = useState('');

const [loginEmail, setLoginEmail] = useState('');
const [loginPassword, setLoginPassword] = useState('');
const [registerError, setRegisterError] = useState("");
const [loginError, setLoginError] = useState("");
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [usercreated, setUserCreated] = useState(false);
const [username, setUsername] = useState("");
const [activeTab, setActiveTab] = useState("register");
const [books, setBooks] = useState([]);
const [title, setTitle] = useState("");
const [genre, setGenre] = useState("");
const [error, setError] = useState("");
useEffect(() => {
  const checkToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        return;
      }

      if (data.user) {
        setIsLoggedIn(true);
      }
    } catch (err) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    }
  };

  checkToken();
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
      setRegisterError(data.error);
      return;
    }

    localStorage.setItem("token", data.token);
    setIsLoggedIn(true);
    setUsername(data.username)
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
      setLoginError(data.error);
      return;
    }

    localStorage.setItem("token", data.token);
    setIsLoggedIn(true);
    console.log(data)
    setUsername(data.user.username);
    setLoginError("");
  } catch (err) {
    setLoginError("Server error");
  }
}
  
 return (
  <div className="app-shell">
    {isLoggedIn && (
      <>
        <button
          className="top-action-btn"
          onClick={() => {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
          }}
        >
          {username} - Logout
        </button>

      
      </>
    )}

    {!isLoggedIn && (
      <>
        <div className="tab-row">
          <button onClick={() => setActiveTab("register")}>
            Register
          </button>
          <button onClick={() => setActiveTab("login")}>
            Login
          </button>
        </div>

        {activeTab === "register" ? (
          <button
            className="switch-btn"
            onClick={() => {
              setUserCreated(true);
              setActiveTab("login");
            }}
          >
            Already have an account? Login here
          </button>
        ) : (
          <button
            className="switch-btn"
            onClick={() => {
              setUserCreated(false);
              setActiveTab("register");
            }}
          >
            Don't have an account? Register here
          </button>
        )}

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
          </>
        )}
      </>
    )}
  </div>
);
}

export default App
