import { PlanMode } from "../types/plan/planTargetTypes"

export const modeTextLabels: Record<PlanMode, string> = {
  common: "通常",
  priority: "優先",
  emergency: "緊急" 
}

export const modeColorLabels: Record<PlanMode, string> = {
  common: "skyblue",
  priority: "skyblue",
  emergency: "skyblue"//"#FF4B4B" 
}