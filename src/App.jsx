import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import MainLayout from './Layout/MainLayout';
import Homepage from './pages/Homepage';
import { Provider } from 'react-redux';
import store from './store/store';
import ViewProduct from './pages/ViewProduct';

function App() {

  return (
    <Provider store={store}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/view-product/:id" element={<ViewProduct />} />
          </Route>
        </Routes>
    </Provider>
  )
}

export default App
