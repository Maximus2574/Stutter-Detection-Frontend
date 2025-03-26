import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { Mic, BarChart2, FileText } from "lucide-react"

function Header() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6">
            <div className="h-10 flex items-center justify-center">
              <img src="/Images/viit-logo.png" alt="VIIT Logo" className="h-10 w-auto object-contain" />
            </div>
            <div className="h-8 flex items-center justify-center">
              <img src="/Images/dassault-logo.png" alt="Dassault Systèmes Logo" className="h-8 w-auto object-contain" />
            </div>
            <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">StutterSense</span>
          </Link>
          </div>
        </div>
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

