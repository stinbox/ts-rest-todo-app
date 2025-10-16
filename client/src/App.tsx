import { LoginForm } from "./components/login-form";
import { authClient } from "./lib/auth-client";

function App() {
  const sessionQuery = authClient.useSession();

  if (sessionQuery.isPending) {
    return null;
  }

  if (sessionQuery.error) {
    return <p>Error: Cannot get session: {sessionQuery.error.message}</p>;
  }

  if (sessionQuery.data == null) {
    return <LoginForm />;
  }

  return (
    <div>
      <p>Welcome {sessionQuery.data.user.email}!</p>
      <button
        className="btn"
        onClick={async () => {
          await authClient.signOut();
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

export default App;
