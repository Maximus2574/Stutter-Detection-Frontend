"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Upload, Loader, Play, Pause, FileAudio, AlertCircle, Camera } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ReadableText from "@/components/ReadableText"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Analyze() {
  const [file, setFile] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState(null)
  const [gradeLevel, setGradeLevel] = useState("Class_1_3")
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const navigate = useNavigate()

  // Initialize camera and microphone
  useEffect(() => {
    async function setupMedia() {
      try {
        if (streamRef.current) {
          // Stop all tracks of the previous stream
          streamRef.current.getTracks().forEach((track) => track.stop())
        }

        // Request access to camera and microphone
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.muted = true // Mute to prevent feedback
        }
      } catch (err) {
        console.error("Error accessing media devices:", err)
        setError("Unable to access camera or microphone. Please check your permissions.")
      }
    }

    if (!isRecording) {
      setupMedia()
    }

    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && (selectedFile.type.startsWith("audio/") || selectedFile.type.startsWith("video/"))) {
      setFile(selectedFile)
      if (selectedFile.type.startsWith("video/")) {
        videoRef.current.srcObject = null // Remove stream
        videoRef.current.src = URL.createObjectURL(selectedFile)
        videoRef.current.muted = false // Ensure uploaded videos are not muted
      }
      setError(null)
    } else {
      setError("Please select a valid audio or video file.")
    }
  }

  const startRecording = () => {
    try {
      if (!streamRef.current) {
        setError("No camera or microphone access. Please refresh and try again.")
        return
      }

      // Check if we have audio
      const audioTracks = streamRef.current.getAudioTracks()
      if (audioTracks.length === 0) {
        setError("No microphone detected. Please check your microphone settings.")
        return
      }

      // Create a new MediaRecorder with the stream
      mediaRecorderRef.current = new MediaRecorder(streamRef.current)

      // Clear previous chunks
      chunksRef.current = []

      // Add data when available
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      // Handle recording stop
      mediaRecorderRef.current.onstop = () => {
        // Create a blob from all chunks
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        saveRecording(blob)
      }

      // Start recording
      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (err) {
      console.error("Error starting recording:", err)
      setError(`Recording error: ${err.message}`)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const saveRecording = (blob) => {
    try {
      // Create a URL for the blob
      const url = URL.createObjectURL(blob)

      // Create a file from the blob
      const newFile = new File([blob], "recorded_video.webm", { type: "video/webm" })
      setFile(newFile)

      // Set up the video element for playback
      videoRef.current.srcObject = null // Remove stream
      videoRef.current.src = url
      videoRef.current.muted = false // Ensure audio is on for playback

      // Create a download link
      const a = document.createElement("a")
      a.href = url
      a.download = "recorded_video.mp4"
      a.click()

      console.log("Recording saved successfully")
    } catch (err) {
      console.error("Error saving recording:", err)
      setError(`Error saving recording: ${err.message}`)
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError("Please upload a file or record a video before analyzing.")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    // Simulating analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsAnalyzing(false)
    navigate("/results")
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-full py-8 px-4"
    >
      <motion.h1
        className="text-4xl font-bold text-center mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Analyze Your Speech
        </span>
      </motion.h1>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white shadow-lg transition-all duration-300 hover:shadow-xl border border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-center gradient-text">Record or Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="media-file" className="text-xl font-medium text-foreground">
                Upload Audio or Video File
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="media-file"
                  type="file"
                  accept="audio/*,video/*,.wav,.mp3,.mp4,.avi,.mov"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 transition-colors"
                />
                <FileAudio className="h-6 w-6 text-primary" />
              </div>
            </motion.div>
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Label className="text-xl font-medium text-foreground">Or Record Video</Label>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-inner relative">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  controls={!isRecording && file} // Show controls when not recording and file exists
                />
                {isRecording && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                    <Mic className="h-12 w-12 animate-pulse" />
                    <span className="ml-2 text-lg">Recording...</span>
                  </div>
                )}
              </div>
              <div className="flex justify-center space-x-4">
                <AnimatePresence mode="wait">
                  {!isRecording ? (
                    <motion.div
                      key="start"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Button
                        onClick={startRecording}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105"
                      >
                        <Camera className="mr-2 h-4 w-4" /> Start Recording
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="stop"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Button
                        onClick={stopRecording}
                        variant="destructive"
                        className="transition-all duration-300 transform hover:scale-105"
                      >
                        Stop Recording
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
                {file && !isRecording && (
                  <Button
                    onClick={togglePlayPause}
                    variant="outline"
                    className="transition-all duration-300 transform hover:scale-105"
                  >
                    {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                )}
              </div>
            </motion.div>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-destructive flex items-center"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                {error}
              </motion.div>
            )}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <Button
                onClick={handleSubmit}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105 text-lg py-6"
                disabled={!file || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Start Analysis
                  </>
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg transition-all duration-300 hover:shadow-xl border border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-center gradient-text">Read Aloud</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="grade-level" className="text-xl font-medium text-foreground">
                Select Your Grade Level
              </Label>
              <Select value={gradeLevel} onValueChange={setGradeLevel}>
                <SelectTrigger id="grade-level" className="w-full">
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Class_1_3">Grades 1-3</SelectItem>
                  <SelectItem value="Class_4_6">Grades 4-6</SelectItem>
                  <SelectItem value="Class_7_9">Grades 7-9</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <p className="text-lg text-muted-foreground mb-4">
                While recording, please read the following text aloud. Use the buttons to navigate through different
                sentences.
              </p>
              <ReadableText gradeLevel={gradeLevel} />
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

export default Analyze

