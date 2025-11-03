"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { db } from "../app/firebase"
import { collection, addDoc, Timestamp } from "firebase/firestore"

interface EmployeeDashboardProps {
  employeeName: string
  onLogout: () => void
  onSuccess: () => void
}

export default function EmployeeDashboard({ employeeName, onLogout, onSuccess }: EmployeeDashboardProps) {
  const [status, setStatus] = useState<"idle" | "clocked-in" | "on-break">("idle")
  const [comment, setComment] = useState("")
  const [clockInTime, setClockInTime] = useState<string | null>(null)
  const [totalWorkTime, setTotalWorkTime] = useState(0) // in minutes
  const [isClockedInDisabled, setIsClockedInDisabled] = useState(false)

  useEffect(() => {
    const savedStatus = localStorage.getItem(`employee-${employeeName}-status`)
    const savedClockInTime = localStorage.getItem(`employee-${employeeName}-clockInTime`)
    const savedWorkTime = localStorage.getItem(`employee-${employeeName}-workTime`)

    if (savedStatus && savedClockInTime) {
      setStatus(savedStatus as any)
      setClockInTime(savedClockInTime)
      setTotalWorkTime(Number.parseInt(savedWorkTime || "0"))

      if (savedStatus === "clocked-in") {
        setIsClockedInDisabled(true)
      }
    }
  }, [employeeName])

  const calculateBreakDeduction = (workMinutes: number) => {
    if (workMinutes >= 540) return 45 // 9 hours
    if (workMinutes >= 360) return 30 // 6 hours
    return 0
  }

  const handleClockIn = async () => {
    setStatus("clocked-in")
    const now = new Date()
    setClockInTime(now.toLocaleTimeString("de-DE"))
    setIsClockedInDisabled(true)

    // ✅ Firestore me attendance add karna
    await addDoc(collection(db, "attendance"), {
      name: employeeName,
      timeIn: Timestamp.fromDate(now),
      status: "clocked-in",
      comment: comment || "",
    })

    localStorage.setItem(`employee-${employeeName}-status`, "clocked-in")
    localStorage.setItem(`employee-${employeeName}-clockInTime`, now.toISOString())
    onSuccess()

    setTimeout(() => handleAutoLogout(), 3000)
  }

  const handleClockOut = async () => {
    if (clockInTime) {
      const clockOutTime = new Date()
      const clockInDate = new Date(clockInTime)
      const workDuration = Math.floor((clockOutTime.getTime() - clockInDate.getTime()) / 60000)
      const breakDeduction = calculateBreakDeduction(workDuration)
      const netWorkTime = workDuration - breakDeduction

      console.log(`[v0] Work time: ${workDuration}min, Break deducted: ${breakDeduction}min, Net time: ${netWorkTime}min`)

      // ✅ Firestore me clock out save karna
      await addDoc(collection(db, "attendance"), {
        name: employeeName,
        timeOut: Timestamp.fromDate(clockOutTime),
        status: "clocked-out",
        comment: comment || "",
        netWorkTime,
      })
    }

    setStatus("idle")
    setClockInTime(null)
    setTotalWorkTime(0)
    setIsClockedInDisabled(false)
    localStorage.removeItem(`employee-${employeeName}-status`)
    localStorage.removeItem(`employee-${employeeName}-clockInTime`)
    localStorage.removeItem(`employee-${employeeName}-workTime`)
    onSuccess()

    setTimeout(() => handleAutoLogout(), 3000)
  }

  const handleBreak = async () => {
    setStatus("on-break")
    localStorage.setItem(`employee-${employeeName}-status`, "on-break")

    // ✅ Firestore me break save karna
    await addDoc(collection(db, "attendance"), {
      name: employeeName,
      time: new Date(),
      status: "on-break",
      comment: comment || "",
    })

    onSuccess()
    setTimeout(() => handleAutoLogout(), 3000)
  }

  const handleAutoLogout = () => {
    setStatus("idle")
    setClockInTime(null)
    setTotalWorkTime(0)
    setIsClockedInDisabled(false)
    localStorage.removeItem(`employee-${employeeName}-status`)
    localStorage.removeItem(`employee-${employeeName}-clockInTime`)
    localStorage.removeItem(`employee-${employeeName}-workTime`)
    onLogout()
  }

  const getStatusText = () => {
    switch (status) {
      case "clocked-in": return "Angemeldet"
      case "on-break": return "In Pause"
      default: return "Abgemeldet"
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "clocked-in": return "bg-accent text-accent-foreground"
      case "on-break": return "bg-secondary text-secondary-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
      <Card className="w-full max-w-2xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <img src="/epic-tec-logo.png" alt="Epic Tec Logo" className="h-16 mx-auto mb-6 object-contain" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Willkommen, {employeeName}</h1>
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          {clockInTime && <p className="text-muted-foreground text-sm mt-2">Angemeldet seit: {clockInTime}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={handleClockIn}
            disabled={isClockedInDisabled}
            className={`py-6 text-lg font-semibold rounded-full transition-all ${
              isClockedInDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            <span className="text-2xl mr-2">✓</span>
            Kommen
          </Button>

          <Button
            onClick={handleBreak}
            disabled={status === "idle"}
            className="py-6 text-lg font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full transition-all"
          >
            <span className="text-2xl mr-2">☕</span>
            Pause
          </Button>

          <Button
            onClick={handleClockOut}
            disabled={status === "idle"}
            className="py-6 text-lg font-semibold bg-red-500 hover:bg-red-600 text-white rounded-full transition-all"
          >
            <span className="text-2xl mr-2">✓</span>
            Gehen
          </Button>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-foreground mb-2">Kommentar (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Notizen hinzufügen..."
            className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            rows={3}
          />
        </div>

        <Button
          onClick={handleAutoLogout}
          className="w-full py-3 text-lg font-semibold bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-all"
        >
          Abmelden
        </Button>
      </Card>
    </div>
  )
}
