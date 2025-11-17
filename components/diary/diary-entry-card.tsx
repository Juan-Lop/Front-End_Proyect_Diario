"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { DiaryEntry } from "@/lib/api"
import { Calendar, Sparkles, Edit, Brain, Moon, AlertCircle } from "lucide-react"

interface DiaryEntryCardProps {
  entry: DiaryEntry
  onEdit?: (entry: DiaryEntry) => void
}

export function DiaryEntryCard({ entry, onEdit }: DiaryEntryCardProps) {
  const dateString = entry.entryDate;
  const date = dateString ? new Date(dateString.replace(' ', 'T')) : null;

  const formattedDate = date
    ? date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Fecha inválida";

  const formattedTime = date
    ? date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // Usar el campo correcto del backend (detectedEmotion o aiEmotion para retrocompatibilidad)
  const emotion = entry.detectedEmotion || entry.aiEmotion;
  const intensity = entry.emotionalIntensity || entry.aiIntensity;

  const getSentimentColor = (aiEmotion?: string) => {
    if (!aiEmotion) return "secondary"
    const emotionLower = aiEmotion.toLowerCase();
    // Soporte para emociones específicas del backend
    if (emotionLower.includes("alegr") || emotionLower.includes("feliz") || emotionLower === "positive" || emotionLower === "positivo") {
      return "default"
    }
    if (emotionLower.includes("trist") || emotionLower.includes("enojo") || emotionLower === "negative" || emotionLower === "negativo") {
      return "destructive"
    }
    return "secondary"
  }

  const getSentimentLabel = (aiEmotion?: string) => {
    if (!aiEmotion) return "Sin análisis"
    // Capitalizar primera letra
    return aiEmotion.charAt(0).toUpperCase() + aiEmotion.slice(1);
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-normal mb-1">
                <Calendar className="w-4 h-4" />
                {formattedDate}, {formattedTime}
              </div>
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {emotion && (
              <Badge variant={getSentimentColor(emotion)}>
                {getSentimentLabel(emotion)}
                {intensity && ` (${Math.round(intensity)}/10)`}
              </Badge>
            )}
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(entry)}>
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">{entry.entryText}</p>

        {(entry.moodRating !== undefined || entry.stressLevel !== undefined || entry.sleepHours !== undefined || entry.mainWorry) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {entry.moodRating !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Humor:</span>
                <span className="font-medium">{entry.moodRating}/5</span>
              </div>
            )}
            {entry.stressLevel !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <Brain className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Estrés:</span>
                <span className="font-medium">{entry.stressLevel}/10</span>
              </div>
            )}
            {entry.sleepHours !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <Moon className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Sueño:</span>
                <span className="font-medium">{entry.sleepHours}h</span>
              </div>
            )}
            {entry.mainWorry && (
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Preocupación:</span>
                <span className="font-medium">{entry.mainWorry}</span>
              </div>
            )}
          </div>
        )}

        {entry.aiSummary && (
          <div className="pt-4 border-t border-border bg-primary/5 -mx-6 px-6 py-4 rounded-b-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">Análisis IA:</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{entry.aiSummary}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
