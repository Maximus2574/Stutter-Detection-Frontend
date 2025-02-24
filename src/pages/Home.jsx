import React from "react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Mic, BarChart2, FileAudio, ArrowRight, Zap } from "lucide-react"
import { motion } from "framer-motion"

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.05 }}
  >
    <Icon className="h-12 w-12 text-primary" />
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-muted-foreground text-center">{description}</p>
  </motion.div>
)

function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-12 text-center py-16">
      <motion.div
        className="space-y-6 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Revolutionize Speech Analysis with AI-Powered Stutter Detection
        </motion.h1>
        <motion.p
          className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Harness the power of artificial intelligence to analyze speech patterns, detect stuttering, and provide
          valuable insights for speech therapy and personal improvement.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl px-4">
        <FeatureCard
          icon={Mic}
          title="Advanced Audio Processing"
          description="State-of-the-art analysis of speech patterns from uploaded or recorded audio samples."
          delay={0.6}
        />
        <FeatureCard
          icon={BarChart2}
          title="Comprehensive Visual Results"
          description="Clear, intuitive visualizations of detected stuttering patterns and frequency data."
          delay={0.8}
        />
        <FeatureCard
          icon={FileAudio}
          title="Precise Transcription"
          description="Accurate speech-to-text conversion with highlighted stuttering indicators for in-depth analysis."
          delay={1}
        />
      </div>

      <motion.div
        className="flex flex-wrap items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105"
        >
          <Link to="/analyze" className="flex items-center">
            Start Your Analysis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="transition-all duration-300 transform hover:scale-105">
          <Link to="/documentation" className="flex items-center">
            Explore Our Technology
            <Zap className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}

export default Home

