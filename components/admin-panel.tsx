"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { db } from "../app/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";




interface Employee {
  id: string
  name: string
  pin: string
}

interface AdminPanelProps {
  employees: Employee[]
  onAddEmployee: (name: string, pin: string) => void
  onRemoveEmployee: (id: string) => void
  onRenameEmployee: (id: string, newName: string) => void
  onResetPin: (id: string, newPin: string) => void
  onLogout: () => void
}

export default function AdminPanel({
  employees,
  onAddEmployee,
  onRemoveEmployee,
  onRenameEmployee,
  onResetPin,
  onLogout,
}: AdminPanelProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [newPin, setNewPin] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editPin, setEditPin] = useState("")

  const handleAddEmployee = () => {
    if (newName && newPin.length === 4) {
      onAddEmployee(newName, newPin)
      setNewName("")
      setNewPin("")
      setShowAddForm(false)
    }
  }

  const handleSaveEdit = (id: string) => {
    if (editName) {
      onRenameEmployee(id, editName)
    }
    if (editPin.length === 4) {
      onResetPin(id, editPin)
    }
    setEditingId(null)
    setEditName("")
    setEditPin("")
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <img src="/epic-tec-logo.png" alt="Epic Tec Logo" className="h-12 object-contain" />
              <h1 className="text-4xl font-bold text-foreground">Adminbereich</h1>
            </div>
            <Button onClick={onLogout} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Abmelden
            </Button>
          </div>

          {!showAddForm ? (
            <Button
              onClick={() => setShowAddForm(true)}
              className="mb-8 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              + Mitarbeiter hinzufügen
            </Button>
          ) : (
            <Card className="p-6 mb-8 bg-muted">
              <h3 className="text-lg font-semibold text-foreground mb-4">Neuer Mitarbeiter</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Name des Mitarbeiters"
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="4-stellige PIN"
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddEmployee}
                    disabled={!newName || newPin.length !== 4}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Hinzufügen
                  </Button>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground"
                  >
                    Abbrechen
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </Card>

        <div className="space-y-4">
          {employees.map((employee) => (
            <Card key={employee.id} className="p-6 shadow-md">
              {editingId === employee.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Name"
                    className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={editPin}
                    onChange={(e) => setEditPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="Neue PIN"
                    className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSaveEdit(employee.id)}
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Speichern
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground"
                    >
                      Abbrechen
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">PIN: {employee.pin}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setEditingId(employee.id)
                        setEditName(employee.name)
                        setEditPin(employee.pin)
                      }}
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    >
                      Bearbeiten
                    </Button>
                    <Button
                      onClick={() => onRemoveEmployee(employee.id)}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                      Entfernen
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Mitarbeiter-Zeiterfassungssystem</p>
        </div>
      </div>
    </div>
  )
}
