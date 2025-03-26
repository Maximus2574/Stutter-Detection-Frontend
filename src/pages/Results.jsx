import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { FileAudio, BarChart2, Award, ArrowLeft } from "lucide-react"

export function Results() {
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const taskId = new URLSearchParams(location.search).get("task_id")

  useEffect(() => {
    if (!taskId) return

    // Function to fetch results
    async function fetchResults() {
      try {
        const response = await fetch(`http://localhost:5000/task_status/${taskId}`)
        const data = await response.json()

        console.log("Full backend response:", data)

        if (data.status === "completed") {
          // Process only repetitions and fillers
          const stutteringFrequency = [
            { type: "Repetitions", frequency: data.result.num_repetitions },
            { type: "Fillers", frequency: data.result.num_fillers }
          ]

          setResults({
            spectrogram: `http://localhost:5000/get_visualization/${taskId}`,
            transcription: data.result.transcription,
            stutteringFrequency,
            overallScore: 100 - ((data.result.fluency_score / 100) * 100),
            severity: data.result.severity || 'Not Specified'
          })
          setIsLoading(false)
        } else {
          // If not completed, set a timeout to check again
          setTimeout(fetchResults, 5000)
        }
      } catch (error) {
        console.error("Error fetching results:", error)
        // Retry in case of network error
        setTimeout(fetchResults, 5000)
      }
    }

    // Initial call
    fetchResults()
  }, [taskId])

  if (isLoading) {
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

      {/* Severity Display */}
      <div className="text-center text-xl font-semibold">
        Stuttering Severity: <span className="text-primary">{results.severity}</span>
      </div>

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
            <p className="text-muted-foreground bg-muted p-4 rounded-lg shadow-inner">
              {results.transcription}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
              <BarChart2 className="mr-2 h-6 w-6 text-primary" />
              Disfluency Frequency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.stutteringFrequency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis type="number" />
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
    </motion.div>
  )
}

export default Results
