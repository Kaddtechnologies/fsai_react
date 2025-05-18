"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

import { Sun, Moon, Monitor } from "lucide-react"
import useTranslation from '@/app/hooks/useTranslation'
import { TRANSLATION_CONFIG } from '@/app/utils/constants'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { language: currentLanguage, t } = useTranslation()
  const [language, setLanguage] = useState<string>("en")
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('flowserveai-language')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    const savedTheme = localStorage.getItem('flowserveai-theme') as "light" | "dark" | "system" | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Check if the user has a preferred color scheme
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme("system")
      }
    }
  }, [])
  
  // Update language when the current language changes
  useEffect(() => {
    if (currentLanguage) {
      setLanguage(currentLanguage)
    }
  }, [currentLanguage])
  
  // Apply theme class to document when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark")
    } else if (theme === "system") {
      // Check system preference
      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isDarkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      
      // Listen for changes to system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const handleSaveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem('flowserveai-language', language)
    localStorage.setItem('flowserveai-theme', theme)
    
    // Notify the application of settings changes
    window.dispatchEvent(
      new CustomEvent('flowserveai-settings-updated', {
        detail: { language, theme }
      })
    )
    
    toast({ 
      title: t('settings.save'),
      description: t('settings.description')
    })
    
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t('settings.title')} {language && `(${TRANSLATION_CONFIG.availableLanguages.find((lang: { code: string }) => lang.code === language)?.name || language})`}
          </DialogTitle>
          <DialogDescription>
            {t('settings.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="language" className="text-right">
              {t('settings.language')}
            </Label>
            <Select 
              value={language} 
              onValueChange={setLanguage}
            >
              <SelectTrigger className="col-span-3" id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {TRANSLATION_CONFIG.availableLanguages.map((lang: { code: string; name: string; nativeName: string }) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name} ({lang.nativeName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="theme" className="text-right">
              {t('settings.theme')}
            </Label>
            <Select 
              value={theme} 
              onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
            >
              <SelectTrigger className="col-span-3" id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <span>{t('settings.themeOptions.light')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span>{t('settings.themeOptions.dark')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <span>{t('settings.themeOptions.system')}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveSettings}>{t('settings.save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}