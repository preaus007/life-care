import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignUpPage from "./pages/SignUpPage";

// const ProtectedRoute = ({ children }) => {
// 	const { isAuthenticated, user } = useAuthStore();

// 	if( !isAuthenticated ) {
// 		return <Navigate to='/login' replace />;
// 	}

// 	if( !user.isVerified ) {
// 		return <Navigate to='/verify-email' replace />;
// 	}

// 	return children;
// };

// const RedirectAuthenticatedUser = ({ children }) => {
// 	const { isAuthenticated, user } = useAuthStore();

// 	if( isAuthenticated && user.isVerified ) {
// 		return <Navigate to='/' replace />;
// 	}

// 	return children;
// };

function App() {

  return (
    <div>
      <Routes>
        <Route
          path="/signup"
          element={
            <SignUpPage />
          }
          />
      </Routes>

      <Toaster position="top-right" />
    </div>
  )
}

export default App;