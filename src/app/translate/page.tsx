
"use client";

import { useState, useEffect } from 'react';
import { ArrowRightLeft, Copy, Volume2, Trash2, LanguagesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { translateText } from '@/ai/flows/translate-text';
import type { TranslationEntry } from '@/lib/types';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';

const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  // Add more languages as needed by the AI model
];

const TranslatePage = () => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<TranslationEntry[]>([]);
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();

  useEffect(() => {
    const storedHistory = localStorage.getItem('flowserveai-translation-history');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flowserveai-translation-history', JSON.stringify(history));
  }, [history]);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast({ title: "Input empty", description: "Please enter text to translate.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setOutputText('');
    try {
      const result = await translateText({
        text: inputText,
        sourceLanguage: sourceLang === 'auto' ? 'English' : supportedLanguages.find(l=>l.code === sourceLang)?.name || 'English', // AI flow needs language name, auto-detect is a placeholder
        targetLanguage: supportedLanguages.find(l=>l.code === targetLang)?.name || 'Spanish',
      });
      setOutputText(result.translatedText);
      const newEntry: TranslationEntry = {
        id: `trans-${Date.now()}`,
        inputText,
        outputText: result.translatedText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        timestamp: Date.now(),
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 19)]); // Keep last 20 entries
    } catch (error) {
      console.error("Translation failed:", error);
      toast({ title: "Translation Error", description: "Could not translate text.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') { // Cannot swap 'auto' to target
        toast({title: "Cannot swap languages", description: "Auto-detect cannot be a target language.", variant: "destructive"});
        return;
    }
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setInputText(outputText); // Optionally swap text as well
    setOutputText(inputText);
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const handleTTS = (text: string) => {
    if(!text) return;
    if (isSpeaking) {
      cancel();
    } else {
      speak(text);
    }
  };
  
  const deleteHistoryEntry = (id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
    toast({ title: "Translation removed from history" });
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto shadow-2xl">
        <CardHeader className="text-center">
          <LanguagesIcon className="w-12 h-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-3xl font-bold">Translation Module</CardTitle>
          <CardDescription>Translate text between multiple languages with ease.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div className="space-y-2">
              <LabelWithSelect lang={sourceLang} setLang={setSourceLang} title="From" isSource={true} />
              <Textarea
                placeholder="Enter text to translate..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[150px] bg-input focus-visible:ring-1 focus-visible:ring-ring"
                rows={6}
              />
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleCopy(inputText)} disabled={!inputText}><Copy size={16}/></Button>
                <Button variant="ghost" size="icon" onClick={() => handleTTS(inputText)} disabled={!inputText}>
                 {isSpeaking && inputText === (document.activeElement as HTMLTextAreaElement)?.value ? <Volume2 size={16} className="text-secondary-gradient"/> : <Volume2 size={16}/>}
                </Button>
              </div>
            </div>

            <Button variant="outline" size="icon" onClick={handleSwapLanguages} className="mx-auto self-center hidden md:flex">
              <ArrowRightLeft />
            </Button>
             <Button variant="outline" onClick={handleSwapLanguages} className="w-full md:hidden">
              <ArrowRightLeft className="mr-2"/> Swap Languages
            </Button>


            <div className="space-y-2">
              <LabelWithSelect lang={targetLang} setLang={setTargetLang} title="To" />
              <Textarea
                placeholder="Translation will appear here..."
                value={outputText}
                readOnly
                className="min-h-[150px] bg-muted text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                rows={6}
              />
               <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleCopy(outputText)} disabled={!outputText}><Copy size={16}/></Button>
                <Button variant="ghost" size="icon" onClick={() => handleTTS(outputText)} disabled={!outputText}>
                 {isSpeaking && outputText === (document.activeElement as HTMLTextAreaElement)?.value ? <Volume2 size={16} className="text-secondary-gradient"/> : <Volume2 size={16}/>}
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={handleTranslate} disabled={isLoading || !inputText.trim()} className="w-full bg-primary-gradient text-primary-foreground hover:opacity-90">
            {isLoading ? 'Translating...' : 'Translate Text'}
          </Button>

          {history.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3">Translation History</h3>
              <ScrollArea className="h-[300px] border rounded-md p-3 bg-muted/30">
                <div className="space-y-3">
                {history.map(entry => (
                  <Card key={entry.id} className="bg-card shadow-md">
                    <CardContent className="p-3 text-sm relative">
                       <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => deleteHistoryEntry(entry.id)}>
                        <Trash2 size={14} className="text-muted-foreground hover:text-destructive"/>
                      </Button>
                      <p className="font-medium truncate">
                        <span className="text-muted-foreground">{supportedLanguages.find(l=>l.code === entry.sourceLanguage)?.name || entry.sourceLanguage}</span>
                        <ArrowRightLeft size={12} className="inline mx-1" />
                        <span className="text-muted-foreground">{supportedLanguages.find(l=>l.code === entry.targetLanguage)?.name || entry.targetLanguage}</span>
                      </p>
                      <p className="text-foreground mt-1 line-clamp-2"><strong>Original:</strong> {entry.inputText}</p>
                      <p className="text-accent-foreground mt-1 line-clamp-2"><strong>Translated:</strong> {entry.outputText}</p>
                      <p className="text-xs text-muted-foreground mt-1.5">{new Date(entry.timestamp).toLocaleString()}</p>
                    </CardContent>
                  </Card>
                ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const LabelWithSelect = ({ lang, setLang, title, isSource = false }: { lang: string, setLang: (value: string) => void, title: string, isSource?: boolean }) => (
  <div className="flex justify-between items-center mb-1">
    <label className="text-sm font-medium text-muted-foreground">{title}:</label>
    <Select value={lang} onValueChange={setLang}>
      <SelectTrigger className="w-[180px] h-8 text-xs bg-card">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {isSource && <SelectItem value="auto" className="text-xs">Auto-detect</SelectItem>}
        {supportedLanguages.map(l => (
          <SelectItem key={l.code} value={l.code} className="text-xs">{l.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default TranslatePage;


    