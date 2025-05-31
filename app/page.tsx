"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock, Play, Pause, RotateCcw, Flag } from "lucide-react"

// Add custom animation classes
const customAnimations = `
  @keyframes glow {
    0% { text-shadow: 0 0 5px rgba(var(--primary-rgb), 0.3); }
    50% { text-shadow: 0 0 20px rgba(var(--primary-rgb), 0.5); }
    100% { text-shadow: 0 0 5px rgba(var(--primary-rgb), 0.3); }
  }
  
  @keyframes pulse-subtle {
    0% { transform: scale(1); }
    50% { transform: scale(1.01); }
    100% { transform: scale(1); }
  }
  
  @keyframes bounce-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  
  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-5deg); }
    75% { transform: rotate(5deg); }
  }
  
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-glow { animation: glow 2s infinite; }
  .animate-pulse-subtle { animation: pulse-subtle 2s infinite; }
  .animate-bounce-subtle { animation: bounce-subtle 2s infinite; }
  .animate-wiggle { animation: wiggle 0.5s infinite; }
  .animate-fade-in { animation: fade-in 0.5s forwards; }
  .hover\\:scale-102:hover { transform: scale(1.02); }
`

export default function Stopwatch() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    // Inject custom animationsnpm
    const style = document.createElement("style")
    style.innerHTML = customAnimations
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true)
      startTimeRef.current = Date.now() - lastTimeRef.current
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current)
      }, 10)
    }
  }

  const pauseTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current!)
      lastTimeRef.current = time
      setIsRunning(false)
    }
  }

  const resetTimer = () => {
    clearInterval(intervalRef.current!)
    setTime(0)
    setIsRunning(false)
    setLaps([])
    lastTimeRef.current = 0
  }

  const addLap = () => {
    if (isRunning) {
      setLaps([...laps, time])
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    const milliseconds = Math.floor((time % 1000) / 10)

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      style={{ "--primary-rgb": "79, 70, 229" } as React.CSSProperties}
    >
      <Card
        className={`w-full max-w-md p-6 shadow-lg transition-all duration-500 ${
          isRunning
            ? "hover:shadow-xl hover:shadow-primary/20 border-primary/30"
            : "hover:shadow-xl bg-white dark:bg-gray-800"
        }`}
      >
        <div className="flex flex-col items-center space-y-8">
          <div className="flex items-center justify-center w-full">
            <Clock className="w-8 h-8 mr-2 text-primary" />
            <h1 className="text-2xl font-bold text-center">Stopwatch</h1>
          </div>

          <div
            className={`flex items-center justify-center w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-inner transition-all duration-300 ${
              isRunning ? "animate-pulse-subtle" : ""
            }`}
          >
            <span
              className={`text-5xl font-mono font-bold tracking-wider ${
                isRunning ? "text-primary animate-glow" : "text-primary"
              }`}
            >
              {formatTime(time)}
            </span>
          </div>

          {isRunning && (
            <div className="absolute top-4 right-4 flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <span className="text-xs font-medium text-green-500">Running</span>
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              onClick={isRunning ? pauseTimer : startTimer}
              className={`w-24 transition-all duration-300 ${
                isRunning
                  ? "hover:bg-red-600 hover:scale-105 active:scale-95"
                  : "hover:bg-green-600 hover:scale-105 active:scale-95"
              }`}
              variant="default"
            >
              {isRunning ? (
                <Pause className="w-5 h-5 mr-2 animate-wiggle" />
              ) : (
                <Play className="w-5 h-5 mr-2 animate-bounce-subtle" />
              )}
              {isRunning ? "Pause" : "Start"}
            </Button>

            <Button
              onClick={resetTimer}
              className="w-24 transition-all duration-300 hover:scale-105 active:scale-95"
              variant="outline"
            >
              <RotateCcw className="w-5 h-5 mr-2 hover:animate-spin" />
              Reset
            </Button>

            <Button
              onClick={addLap}
              className="w-24 transition-all duration-300 hover:scale-105 active:scale-95"
              variant="secondary"
              disabled={!isRunning}
            >
              <Flag className="w-5 h-5 mr-2" />
              Lap
            </Button>
          </div>

          {laps.length > 0 && (
            <div className="w-full mt-6">
              <h2 className="text-lg font-semibold mb-2">Lap Times</h2>
              <div className="max-h-60 overflow-y-auto pr-2">
                <ul className="space-y-2">
                  {laps.map((lapTime, index) => (
                    <li
                      key={index}
                      className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm transform transition-all duration-300 hover:scale-102 animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <span className="font-medium">Lap {laps.length - index}</span>
                      <span className="font-mono">{formatTime(lapTime)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </Card>
    </main>
  )
}
