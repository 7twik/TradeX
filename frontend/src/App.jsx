import { LeftSidebar } from './Analysis/LeftSidebar'
import './App.css'
import { Home } from './Home'
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom'
function App() {

  return (
    <>
      <Router>
        <Routes>
        <Route path="/analysis" element={<LeftSidebar />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
      
    </>
  )
}

export default App
