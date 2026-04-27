
function RegisterForm({ username, setUsername, email, setEmail, password, setPassword, handleSubmitRegister }) {
  return (
    <>
    <h1>REGISTER</h1>
    <form onSubmit={handleSubmitRegister}>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Register</button>
    </form>
    </>
  );
}

export default RegisterForm;