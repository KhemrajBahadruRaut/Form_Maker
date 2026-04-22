import MyRoutes from './MyRoutes/MyRoutes'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <MyRoutes />
    </AuthProvider>
  )
}

export default App
