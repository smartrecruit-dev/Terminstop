"use client"
import { useEffect } from "react"

export default function LeadRedirect() {
  useEffect(() => {
    window.location.replace("/register")
  }, [])
  return null
}
