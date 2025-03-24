import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Analyze from "./pages/Analyze"
import Results from "./pages/Results"
import Documentation from "./pages/Documentation"
import GuidedTour from "./components/GuidedTour"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/results" element={<Results />} />
            <Route path="/documentation" element={<Documentation />} />
          </Routes>
          <GuidedTour />
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App

