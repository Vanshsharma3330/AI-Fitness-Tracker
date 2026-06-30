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

const App = () => {
  const { user, isUserFetched, onboardingCompleted } = useAppContext()

  if (!isUserFetched) {
    return <Loading />
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={user ? <Layout /> : <Navigate to="/" replace />}
      >
        <Route
          index
          element={user ? (onboardingCompleted ? <Dashboard /> : <Onboarding />) : null}
        />
        <Route
          path="food"
          element={user ? (onboardingCompleted ? <FoodLog /> : <Onboarding />) : null}
        />
        <Route
          path="activity"
          element={user ? (onboardingCompleted ? <ActivityLog /> : <Onboarding />) : null}
        />
        <Route
          path="profile"
          element={user ? (onboardingCompleted ? <Profile /> : <Onboarding />) : null}
        />
      </Route>
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
    </Routes>
  )
}

export default App
