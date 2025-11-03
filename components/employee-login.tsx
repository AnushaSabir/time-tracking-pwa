"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { auth } from "../app/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";



interface Employee {
  id: String
  name: string
  pin: string
}

interface EmployeeLoginProps {
  employees: Employee[]
  onLogin: (name: string) => void
  onAdminClick: () => void
}

export default function EmployeeLogin({ employees, onLogin, onAdminClick }: EmployeeLoginProps) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")

  const handleLogin = () => {
    const employee = employees.find((e) => e.pin === pin)
    if (employee) {
      setError("")
      onLogin(employee.name)
    } else {
      setError("PIN ungültig. Bitte versuchen Sie es erneut.")
      setPin("")
    }
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setPin(value)
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <img src="/epic-tec-logo.png" alt="Epic Tec Logo" className="h-16 mx-auto mb-6 object-contain" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Mitarbeiter Login</h1>
          <p className="text-muted-foreground">Geben Sie Ihre 4-stellige PIN ein</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={handlePinChange}
              placeholder="••••"
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
          </div>

          <Button
            onClick={handleLogin}
            disabled={pin.length !== 4}
            className="w-full py-3 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all"
          >
            Einloggen
          </Button>

          <button
            onClick={onAdminClick}
            className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Admin-Bereich
          </button>
        </div>
      </Card>
    </div>
  )
}
