function RegisterForm({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmitRegister,
  activeTab,
  setActiveTab
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-md">
      <section className="w-full max-w-[480px]">
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_20px_50px_rgba(30,41,59,0.06)] p-xl flex flex-col items-center">
          <div className="flex flex-col items-center mb-xl">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-on-primary text-headline-md">
                pulse_alert
              </span>
            </div>

            <h1 className="font-headline-md text-headline-md text-primary">
              TaskPulse
            </h1>

            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
              Create your professional workspace
            </p>
          </div>

          <form
            id="register-form"
            className="w-full space-y-lg"
            onSubmit={handleSubmitRegister}
          >
            <div className="flex flex-col gap-xs">
              <label
                htmlFor="register-username-input"
                className="font-label-md text-label-md text-on-surface-variant ml-xs"
              >
                Username
              </label>

              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-md text-outline">
                  person
                </span>

                <input
                  id="register-username-input"
                  className="w-full pl-[44px] pr-md py-md bg-surface-bright border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  placeholder="johndoe"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <label
                htmlFor="register-email-input"
                className="font-label-md text-label-md text-on-surface-variant ml-xs"
              >
                Email Address
              </label>

              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-md text-outline">
                  mail
                </span>

                <input
                  id="register-email-input"
                  className="w-full pl-[44px] pr-md py-md bg-surface-bright border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <label
                htmlFor="register-password-input"
                className="font-label-md text-label-md text-on-surface-variant ml-xs"
              >
                Password
              </label>

              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-md text-outline">
                  lock
                </span>

                <input
                  id="register-password-input"
                  className="w-full pl-[44px] pr-[44px] py-md bg-surface-bright border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">
                Must be at least 8 characters long.
              </p>
            </div>

            <button
              className="w-full bg-primary text-on-primary py-md rounded-lg font-headline-sm text-headline-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
              type="submit"
            >
              Sign Up
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

export default RegisterForm;