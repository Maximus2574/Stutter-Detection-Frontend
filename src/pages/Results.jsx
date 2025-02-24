import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FileAudio, BarChart2, Award, ArrowLeft } from "lucide-react"

export function Results() {
  const [results, setResults] = useState(null)

  useEffect(() => {
    // TODO: Fetch results from backend
    // For now, we'll use mock data
    const mockResults = {
      spectrogram: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Spectrogram-19thC.png",
      transcription:
        "This is a sample transcription with some stuttering patterns highlighted. Words with <span class='bg-yellow-200'>yellow highlight</span> indicate repetitions, <span class='bg-green-200'>green highlight</span> indicate prolongations, and <span class='bg-red-200'>red highlight</span> indicate blocks.",
      stutteringFrequency: [
        { type: "Repetitions", frequency: 5 },
        { type: "Prolongations", frequency: 3 },
        { type: "Blocks", frequency: 2 },
      ],
      overallScore: 75,
    }
    setResults(mockResults)
  }, [])

  if (!results) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8 py-8"
    >
      <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
        Analysis Results
      </h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
              <FileAudio className="mr-2 h-6 w-6 text-primary" />
              Spectrogram
            </CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={results.spectrogram || "/placeholder.svg"}
              alt="Spectrogram"
              className="w-full rounded-lg shadow-md"
            />
          </CardContent>
        </Card>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Transcription</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className="text-muted-foreground bg-muted p-4 rounded-lg shadow-inner"
              dangerouslySetInnerHTML={{ __html: results.transcription }}
            />
          </CardContent>
        </Card>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
              <BarChart2 className="mr-2 h-6 w-6 text-primary" />
              Stuttering Frequency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.stutteringFrequency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="frequency" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
              <Award className="mr-2 h-6 w-6 text-primary" />
              Overall Fluency Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="w-full bg-muted rounded-full h-4 mr-2 overflow-hidden">
                <motion.div
                  className="bg-primary h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${results.overallScore}%` }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </div>
              <span className="text-lg font-semibold">{results.overallScore}%</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex justify-center"
      >
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105"
        >
          <Link to="/analyze" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Analyze Another Recording
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default Results

