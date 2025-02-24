"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import sentencesData from "@/data/sentences.json"

const ReadableText = ({ gradeLevel }) => {
  const [currentText, setCurrentText] = useState("")
  const [sentences, setSentences] = useState([])

  useEffect(() => {
    setSentences(sentencesData[gradeLevel] || [])
  }, [gradeLevel])

  useEffect(() => {
    if (sentences.length === 0) return

    const changeText = () => {
      const newText = sentences[Math.floor(Math.random() * sentences.length)]
      setCurrentText(newText)
    }

    changeText()
    const interval = setInterval(changeText, 10000) // Change text every 10 seconds

    return () => clearInterval(interval)
  }, [sentences])

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-primary/20">
      <h3 className="text-lg font-semibold mb-2 text-primary">Read the following text:</h3>
      <AnimatePresence mode="wait">
        <motion.p
          key={currentText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-medium text-foreground"
        >
          {currentText}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

export default ReadableText

