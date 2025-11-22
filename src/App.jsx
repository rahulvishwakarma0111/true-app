import { Routes, Route } from 'react-router-dom';
import './App.css'
import MainLayout from './Layout/MainLayout';
import Homepage from './pages/Homepage';
import { Provider } from 'react-redux';
import store from './store/store';

function App() {

  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
        </Route>
      </Routes>
    </Provider>
  )
}

export default App
