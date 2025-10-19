import { LoginForm } from "./components/login-form";
import { TodoList } from "./components/todo-list";
import { authClient } from "./lib/auth-client";

function App() {
  const sessionQuery = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  if (sessionQuery.isPending) {
    return null;
  }

  if (sessionQuery.error) {
    return <p>Error: Cannot get session: {sessionQuery.error.message}</p>;
  }

  if (sessionQuery.data == null) {
    return <LoginForm />;
  }

  const email = sessionQuery.data.user.email ?? "";

  return (
    <div className="min-h-dvh bg-base-200 bg-[radial-gradient(circle_at_top,_theme(colors.primary/20),_transparent_60%)] text-base-content">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-8 md:py-12">
        <header className="card border border-base-300 bg-base-100/90 shadow-xl backdrop-blur">
          <div className="card-body flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <span className="inline-flex items-center justify-center rounded-full border border-primary bg-gradient-to-r from-primary via-secondary to-accent px-6 py-3 text-lg font-semibold text-primary-content shadow-lg shadow-primary/30">
              {email}
            </span>
            <button
              className="btn btn-error btn-wide md:btn-md md:w-auto"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </header>

        <main>
          <TodoList />
        </main>
      </div>
    </div>
  );
}

export default App;
