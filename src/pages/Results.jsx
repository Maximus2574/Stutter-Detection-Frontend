"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileAudio,
  BarChart2,
  Award,
  ArrowLeft,
  Clock,
  AlertCircle,
  FileText,
  Repeat,
  Pause,
  Volume2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "../contexts/AuthContext";

// Define the API base URL
const API_BASE_URL = "http://localhost:5000";

export function Results() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const taskId = new URLSearchParams(location.search).get("task_id");
  const { userType, isPatient, isSLP } = useAuth();

  useEffect(() => {
    if (!taskId) {
      setError("No task ID provided");
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    let timeoutId = null;

    // Function to fetch results
    async function fetchResults() {
      try {
        // Check task status first
        const statusResponse = await fetch(
          `${API_BASE_URL}/task_status/${taskId}`
        );
        const statusData = await statusResponse.json();

        console.log("Task status response:", statusData);

        if (!isMounted) return;

        if (statusData.status === "completed") {
          // If completed, get the full result
          const resultResponse = await fetch(
            `${API_BASE_URL}/get_result/${taskId}`
          );
          const resultData = await resultResponse.json();

          console.log("Full result data:", resultData);

          if (!isMounted) return;

          // Process all stutter types
          const stutteringFrequency = [
            { type: "Repetitions", frequency: resultData.num_repetitions },
            { type: "Blocks", frequency: resultData.num_blocks },
            { type: "Prolongations", frequency: resultData.num_prolongations },
            { type: "Fillers", frequency: resultData.num_fillers },
          ];

          // Get passage comparison data
          let passageComparison = null;
          if (resultData.passage_comparison) {
            passageComparison = resultData.passage_comparison;
          }

          // Create visualization URL using base64 data if available
          const visualizationSrc = resultData.visualization
            ? `data:image/png;base64,${resultData.visualization}`
            : null;

          setResults({
            spectrogram: visualizationSrc,
            transcription: resultData.transcription,
            stutteringFrequency,
            stutterEvents: resultData.stutter_events || [],
            overallScore: resultData.fluency_score,
            severity: resultData.severity || "Not Specified",
            passageComparison,
          });
          setIsLoading(false);
        } else if (statusData.status === "failed") {
          // Handle failure case
          setError(`Analysis failed: ${statusData.error || "Unknown error"}`);
          setIsLoading(false);
        } else {
          // If not completed yet, check again after delay
          timeoutId = setTimeout(fetchResults, 5000);
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        if (!isMounted) return;

        // Show error but keep retrying
        setError(`Connection error: ${error.message}. Retrying...`);
        timeoutId = setTimeout(fetchResults, 5000);
      }
    }

    // Initial call
    fetchResults();

    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [taskId]);

  // Helper function to format time in seconds to MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Helper function to get icon for stutter type
  const getStutterIcon = (type) => {
    switch (type) {
      case "repetition":
        return <Repeat className="h-5 w-5 text-blue-500" />;
      case "block":
        return <Pause className="h-5 w-5 text-red-500" />;
      case "prolongation":
        return <Volume2 className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  // Helper function to get color for stutter type
  const getStutterColor = (type) => {
    switch (type) {
      case "repetition":
        return "bg-blue-100 border-blue-300";
      case "block":
        return "bg-red-100 border-red-300";
      case "prolongation":
        return "bg-green-100 border-green-300";
      default:
        return "bg-yellow-100 border-yellow-300";
    }
  };

  // Error state display
  if (error && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
        <p className="text-center mb-6">{error}</p>
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Link to="/analyze" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Analysis
          </Link>
        </Button>
      </div>
    );
  }

  // Loading state display
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-lg font-medium">Analyzing your speech data...</p>
      </div>
    );
  }

  // Patient view - simplified results
  if (isPatient) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8 py-8"
      >
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Your Speech Analysis Results
        </h1>

        {/* Severity Display */}
        <div className="text-center text-xl font-semibold">
          Stuttering Severity:{" "}
          <span className="text-primary">{results.severity}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center">
                <FileText className="mr-2 h-6 w-6 text-primary" />
                Transcription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground bg-muted p-4 rounded-lg shadow-inner">
                {results.transcription}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
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
                    <Legend />
                    <Bar dataKey="frequency" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
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
                <span className="text-lg font-semibold">
                  {results.overallScore}%
                </span>
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
    );
  }

  // SLP view - detailed results
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8 py-8"
    >
      <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
        Detailed Analysis Results
      </h1>

      {/* Severity Display */}
      <div className="text-center text-xl font-semibold">
        Stuttering Severity:{" "}
        <span className="text-primary">{results.severity}</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
              <FileAudio className="mr-2 h-6 w-6 text-primary" />
              Spectrogram
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.spectrogram ? (
              <img
                src={results.spectrogram}
                alt="Spectrogram"
                className="w-full rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-64 bg-muted flex items-center justify-center rounded-lg">
                <p className="text-muted-foreground">
                  Spectrogram not available
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
              <FileText className="mr-2 h-6 w-6 text-primary" />
              Transcription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground bg-muted p-4 rounded-lg shadow-inner">
              {results.transcription}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
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
                  <Legend />
                  <Bar dataKey="frequency" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stutter Events Section */}
      {results.stutterEvents && results.stutterEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center">
                <Clock className="mr-2 h-6 w-6 text-primary" />
                Stutter Events Timeline
              </CardTitle>
              <CardDescription>
                Detailed breakdown of each stutter event detected in the
                recording
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.stutterEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getStutterColor(
                      event.type
                    )} flex items-start`}
                  >
                    <div className="mr-3 mt-1">
                      {getStutterIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold capitalize">
                          {event.type}{" "}
                          {event.subtype ? `(${event.subtype})` : ""}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {formatTime(event.start)} - {formatTime(event.end)} (
                          {event.duration.toFixed(2)}s)
                        </span>
                      </div>
                      {event.text && (
                        <p className="text-sm">Text: "{event.text}"</p>
                      )}
                      {event.count && (
                        <p className="text-sm">Count: {event.count}</p>
                      )}
                      <p className="text-sm">
                        Confidence: {(event.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Passage Comparison Section */}
      {results.passageComparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center">
                <AlertCircle className="mr-2 h-6 w-6 text-primary" />
                Passage Comparison
              </CardTitle>
              <CardDescription>
                Comparison between expected text and actual transcription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-4x4 font-bold">Similarity Score:</p>
                    <p className="text-1xl font-medium">
                      Spoken Words:{" "}
                      {results.passageComparison.spoken_word_count}
                    </p>
                    <p className="text-1xl font-medium">
                      Reference Words:{" "}
                      {results.passageComparison.reference_word_count}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Discrepancies:</p>
                    <p className="text-2xl font-bold">
                      {results.passageComparison.discrepancy_count}
                    </p>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="discrepancies">
                    <AccordionTrigger>
                      View Discrepancy Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="max-h-60 overflow-y-auto p-2 border rounded-md">
                        {results.passageComparison.discrepancies
                          .slice(0, 20)
                          .map((disc, index) => (
                            <div key={index} className="mb-2 p-2 border-b">
                              <p className="font-medium capitalize">
                                {disc.type}:
                              </p>
                              {disc.reference && (
                                <p className="text-sm">
                                  Reference: "{disc.reference}"
                                </p>
                              )}
                              {disc.transcribed && (
                                <p className="text-sm">
                                  Transcribed: "{disc.transcribed}"
                                </p>
                              )}
                              {disc.similarity !== undefined && (
                                <p className="text-sm">
                                  Similarity:{" "}
                                  {(disc.similarity * 100).toFixed(1)}%
                                </p>
                              )}
                            </div>
                          ))}
                        {results.passageComparison.discrepancies.length >
                          20 && (
                          <p className="text-center text-sm text-muted-foreground mt-2">
                            Showing 20 of{" "}
                            {results.passageComparison.discrepancies.length}{" "}
                            discrepancies
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
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
              <span className="text-lg font-semibold">
                {results.overallScore}%
              </span>
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
  );
}

export default Results;
