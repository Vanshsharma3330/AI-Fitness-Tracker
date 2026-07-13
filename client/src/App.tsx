import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./pages/Layout"
import Dashboard from "./pages/Dashboard"
import FoodLog from "./pages/FoodLog"
import ActivityLog from "./pages/ActivityLog"
import Profile from "./pages/Profile"
import { useAppContext } from "./context/AppContext"
import Login from "./pages/Login"
import Loading from "./components/Loading"
import Onboarding from "./pages/Onboarding"
import { Toaster } from "react-hot-toast"

const App = () => {
  const { user, isUserFetched, onboardingCompleted } = useAppContext()

  if (!isUserFetched) {
    return <Loading />
  }

  return (
    <>
      <Toaster/>
      <Routes>
      <Route path="/" element={user ? <Navigate to={onboardingCompleted ? "/dashboard" : "/onboarding"} replace /> : <Login />} />
      <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/" replace />} />
      <Route
        path="/dashboard"
        element={user ? <Layout /> : <Navigate to="/" replace />}
      >
        <Route
          index
          element={user ? (onboardingCompleted ? <Dashboard /> : <Navigate to="/onboarding" replace />) : null}
        />
        <Route
          path="food"
          element={user ? (onboardingCompleted ? <FoodLog /> : <Navigate to="/onboarding" replace />) : null}
        />
        <Route
          path="activity"
          element={user ? (onboardingCompleted ? <ActivityLog /> : <Navigate to="/onboarding" replace />) : null}
        />
        <Route
          path="profile"
          element={user ? (onboardingCompleted ? <Profile /> : <Navigate to="/onboarding" replace />) : null}
        />
      </Route>
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
    </Routes>
    </>
  )
}

export default App
