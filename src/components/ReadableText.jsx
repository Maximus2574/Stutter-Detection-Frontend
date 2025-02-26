"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import sentencesData from "@/data/sentences.json";

const ReadableText = ({ gradeLevel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sentences, setSentences] = useState([]);

  useEffect(() => {
    setSentences(sentencesData[gradeLevel] || []);
    setCurrentIndex(0); // Reset index when grade level changes
  }, [gradeLevel]);

  useEffect(() => {
    if (sentences.length === 0) return;

    const prevIndex = 0;

    const changeText = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sentences.length);
    };

    const interval = setInterval(changeText, 15000); // Change text every 10 seconds

    return () => clearInterval(interval);
  }, [sentences]);

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-primary/20">
      <h3 className="text-lg font-semibold mb-2 text-primary">
        Read the following text:
      </h3>
      <AnimatePresence mode="wait">
        <motion.p
          key={sentences[currentIndex] || "loading"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-medium text-foreground"
        >
          {sentences[currentIndex] || "Loading..."}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default ReadableText;