import React, { useEffect, useRef } from "react"

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

const FloatingLetters = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const createLetter = () => {
      const letter = document.createElement("div")
      letter.classList.add("floating-letter")
      letter.style.left = `${Math.random() * 100}vw`
      letter.style.animationDuration = `${Math.random() * 10 + 10}s`
      letter.style.opacity = Math.random() * 0.3 + 0.1
      letter.innerText = letters[Math.floor(Math.random() * letters.length)]
      container.appendChild(letter)

      setTimeout(() => {
        letter.remove()
      }, 20000)
    }

    const interval = setInterval(createLetter, 1000)

    return () => {
      clearInterval(interval)
      container.innerHTML = ""
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />
}

export default FloatingLetters

