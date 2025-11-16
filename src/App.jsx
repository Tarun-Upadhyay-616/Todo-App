import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import HomePage from './Pages/HomePage'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element = {<HomePage/>} />
      <Route path='/all-todos' />
    </Routes>
    </BrowserRouter>
  )
}

export default App
