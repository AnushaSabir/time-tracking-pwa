"use client"

import { Card } from "@/components/ui/card"

export default function SuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md p-8 text-center shadow-lg">
        <div className="mb-6">
          <img src="/epic-tec-logo.png" alt="Epic Tec Logo" className="h-12 mx-auto mb-4 object-contain" />
        </div>
        <div className="mb-6">
          <div className="w-24 h-24 bg-accent rounded-full mx-auto flex items-center justify-center animate-pulse">
            <span className="text-5xl">✓</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Zeit erfolgreich erfasst</h1>
        <p className="text-muted-foreground mb-6">Ihre Zeiterfassung wurde gespeichert.</p>
        <div className="w-full h-1 bg-accent rounded-full overflow-hidden">
          <div className="h-full bg-accent animate-pulse" />
        </div>
      </Card>
    </div>
  )
}
