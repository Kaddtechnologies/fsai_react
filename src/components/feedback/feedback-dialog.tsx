"use client";

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import useTranslation from '@/app/hooks/useTranslation';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  // Calculate character count excluding spaces
  const characterCount = feedback.replace(/\s/g, '').length;
  const isValidFeedback = characterCount >= 100 && feedback.length <= 3000;
  
  // Translate with params helper function
  const translateWithParams = (key: string, params: Record<string, string | number>) => {
    let translated = t(key);
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      translated = translated.replace(`{${paramKey}}`, String(paramValue));
    });
    return translated;
  };
  
  const handleSubmit = async () => {
    if (!isValidFeedback) return;
    
    setStatus('submitting');
    
    try {
      // Simulate API call to send feedback
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would send the feedback to your backend
      // const response = await fetch('/api/feedback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ feedback })
      // });
      
      // if (!response.ok) throw new Error('Failed to send feedback');
      
      setStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setFeedback('');
        setStatus('idle');
        onOpenChange(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error sending feedback:', error);
      setStatus('error');
      
      // Reset to idle state after error
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] px-4">
        <DialogHeader>
          <DialogTitle>{t('feedback.title')}</DialogTitle>
          <DialogDescription>
            {t('feedback.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 px-4">
          <Textarea
            placeholder={t('feedback.placeholder')}
            className="min-h-[120px]"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value.substring(0, 3000))}
            disabled={status === 'submitting' || status === 'success'}
            maxLength={3000}
          />
          <div className="flex justify-between mt-2 text-sm">
            <span className={characterCount < 100 ? "text-red-500" : "text-muted-foreground"}>
              {characterCount < 100 ? t('feedback.minCharacters') : ''}
            </span>
            <span className={characterCount < 100 ? "text-red-500" : "text-muted-foreground"}>
              {translateWithParams('feedback.characterCount', { count: feedback.length })}
            </span>
          </div>
        </div>
        
        <DialogFooter>
          {status === 'idle' && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t('feedback.cancel')}
              </Button>
              <Button onClick={handleSubmit} disabled={!isValidFeedback}>
                {t('feedback.send')}
              </Button>
            </>
          )}
          
          {status === 'submitting' && (
            <div className="flex items-center justify-center w-full">
              <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
              <span>{t('feedback.sending')}</span>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex items-center justify-center w-full text-green-500">
              <CheckCircle className="h-6 w-6 mr-2" />
              <span>{t('feedback.success')}</span>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex items-center justify-center w-full text-red-500">
              <XCircle className="h-6 w-6 mr-2" />
              <span>{t('feedback.error')}</span>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}