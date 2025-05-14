
"use client";

import { useState, useEffect, useCallback } from 'react';

interface UseSpeechSynthesisReturn {
  speak: (text: string, lang?: string) => void;
  cancel: () => void;
  isSpeaking: boolean;
  supportedVoices: SpeechSynthesisVoice[];
}

export const useSpeechSynthesis = (): UseSpeechSynthesisReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supportedVoices, setSupportedVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) {
      console.warn('SpeechSynthesis API not supported in this browser.');
      return;
    }

    const loadVoices = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        setSupportedVoices(voices);
      }
    };

    loadVoices();
    // Some browsers load voices asynchronously.
    synth.onvoiceschanged = loadVoices;

    // Cleanup current speech on component unmount
    return () => {
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, []);
  
  useEffect(() => {
    if (utterance) {
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    }
  }, [utterance]);


  const speak = useCallback((text: string, lang: string = 'en-US') => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    const newUtterance = new SpeechSynthesisUtterance(text);
    const voice = supportedVoices.find(v => v.lang === lang) || supportedVoices.find(v => v.lang.startsWith(lang.split('-')[0])) || supportedVoices.find(v => v.default);
    
    if (voice) {
      newUtterance.voice = voice;
    }
    newUtterance.lang = lang;
    
    setUtterance(newUtterance);
  }, [supportedVoices]);

  const cancel = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, cancel, isSpeaking, supportedVoices };
};

    