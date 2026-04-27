
function LoginForm({email, setEmail, password, setPassword, handleSubmitLogin}) {
  return (
    <>
    <h1>LOGIN</h1>
    <form onSubmit={handleSubmitLogin}>
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

      <button type="submit">Login</button>
    </form>
    </>
  );
}

export default LoginForm;