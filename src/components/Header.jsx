import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { Mic, BarChart2, FileText } from "lucide-react"

function Header() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Mic className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Stutter Detection AI</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link
            to="/analyze"
            className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/analyze" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Mic className="h-4 w-4" />
            <span>Analyze</span>
          </Link>
          <Link
            to="/results"
            className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/results" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <BarChart2 className="h-4 w-4" />
            <span>Results</span>
          </Link>
          <Link
            to="/documentation"
            className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/documentation" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Docs</span>
          </Link>
          <Button asChild>
            <Link to="/analyze">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

export default Header

