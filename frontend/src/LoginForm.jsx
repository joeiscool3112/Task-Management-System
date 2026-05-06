function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmitLogin,
  activeTab,
  setActiveTab
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-margin bg-surface">
      <section className="w-full max-w-[440px]">
        <div className="text-center mb-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-container rounded-lg mb-md">
            <span className="material-symbols-outlined text-[32px] text-on-primary-fixed">
              task_alt
            </span>
          </div>

          <h1 className="font-h2 text-h2 text-on-surface mb-xs">
            TaskEngine Pro
          </h1>

          <p className="font-body-md text-body-md text-on-surface-variant">
            Enterprise Edition
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-2xl rounded-lg shadow-sm">
          <form
            id="login-form"
            className="space-y-lg"
            onSubmit={handleSubmitLogin}
          >
            <div className="space-y-base">
              <label
                htmlFor="login-email-input"
                className="font-label-sm text-label-sm text-on-surface-variant"
              >
                Email Address
              </label>

              <input
                id="login-email-input"
                name="email"
                className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-base">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="login-password-input"
                  className="font-label-sm text-label-sm text-on-surface-variant"
                >
                  Password
                </label>

                <a
                  className="font-label-sm text-label-sm text-on-tertiary-container hover:underline"
                  href="#"
                >
                  Forgot Password?
                </a>
              </div>

              <input
                id="login-password-input"
                name="password"
                className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              id="login-submit-button"
              className="w-full bg-primary text-on-primary py-md rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center justify-center gap-sm"
              type="submit"
            >
              Sign In
            </button>
            {activeTab === 'register' ? (
            <div class="text-center">
              <p class="font-body-sm text-body-sm text-on-surface-variant">
                    Already have an account? 
                    <a class="text-secondary font-bold hover:underline ml-xs" href="#" onClick={() => {
                setActiveTab('login');
              }} >Sign In</a>
              </p>
            </div>
          ) : (
            <div class="text-center">
              <p class="font-body-sm text-body-sm text-on-surface-variant">
                    Don't have an account? 
                    <a class="text-secondary font-bold hover:underline ml-xs" href="#" onClick={() => {
                setActiveTab('register');
              }} >Sign Up</a>
              </p>
            </div>

          )}
          </form>
        </div>
      </section>
    </main>
  );
}

export default LoginForm;