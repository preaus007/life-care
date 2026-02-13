import { useAuthStore } from '../store/authStore'

function HomePage() {
    const {user, isAuthenticated, logout} = useAuthStore();
  return (
    <div>
        <h1>Welcome to the Home Page</h1>
        {isAuthenticated ? (
            <div>
                <p>You are logged in as {user.name}</p>
            </div>
        ) : (
            <p>You are not logged in.</p>
        )}
        <button onClick={logout}>Logout</button>
    </div>
  )
}

export default HomePage