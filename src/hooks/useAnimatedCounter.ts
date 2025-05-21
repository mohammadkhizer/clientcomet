
"use client";

import { useState, useEffect, useRef } from 'react';

function parseValue(valueString: string): { target: number; suffix: string } {
  if (!valueString) {
    return { target: 0, suffix: '' };
  }
  const match = valueString.match(/^(\d+)(.*)$/);
  if (match && match[1]) {
    return { target: parseInt(match[1], 10), suffix: match[2] || '' };
  }
  // Fallback for non-numeric or unparseable strings, or if only suffix is present.
  const numericPart = parseInt(valueString, 10);
  if (!isNaN(numericPart)) {
    return { target: numericPart, suffix: valueString.replace(String(numericPart), '') };
  }
  return { target: 0, suffix: valueString }; // Treat whole string as suffix if no number found
}

export function useAnimatedCounter(endValueString: string, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const parsedRef = useRef(parseValue(endValueString)); // Parse once and store

  useEffect(() => {
    // Update parsed value if endValueString changes
    parsedRef.current = parseValue(endValueString);
  }, [endValueString]);
  
  const targetValue = parsedRef.current.target;

  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      const currentVal = Math.floor(percentage * targetValue);

      setCount(currentVal);

      if (percentage < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    // Reset for new targetValue or duration
    startTimeRef.current = null;
    setCount(0); // Start from 0
    if (targetValue > 0 || duration > 0) { // Only animate if there's a target and duration
        frameRef.current = requestAnimationFrame(animate);
    } else {
        setCount(targetValue); // If target is 0 or duration is 0, set directly
    }


    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [targetValue, duration]); // Rerun effect if targetValue or duration changes

  return { animatedValue: count, suffix: parsedRef.current.suffix };
}
