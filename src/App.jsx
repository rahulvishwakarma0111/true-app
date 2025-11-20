import { Routes, Route } from 'react-router-dom';
import './App.css'
import MainLayout from './Layout/MainLayout';
import Homepage from './pages/Homepage';

function App() {

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Homepage />} />
      </Route>
    </Routes>
  )
}

export default App
