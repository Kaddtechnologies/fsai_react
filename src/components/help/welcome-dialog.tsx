"use client";

import type { FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, FileText, Globe, UploadCloud, MessageSquareText, Info, ChevronRight, PlayCircle, X } from 'lucide-react';
import Image from 'next/image';
import type { ChartNode, FlowStep } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';
import useTranslation from '@/app/hooks/useTranslation';

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WelcomeDialog: FC<WelcomeDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  
  const AiCapabilitiesChart: ChartNode = {
    id: 'root',
    label: t('welcomeDialog.ai.capabilities.root'),
    children: [
      { id: 'ans', label: t('welcomeDialog.ai.capabilities.answer') },
      { id: 'exp', label: t('welcomeDialog.ai.capabilities.explain') },
      { id: 'ast', label: t('welcomeDialog.ai.capabilities.assist') },
    ],
  };
  
  const DocumentFlow: FlowStep[] = [
    { id: 'up', icon: UploadCloud, title: t('welcomeDialog.documents.flow.upload.title'), description: t('welcomeDialog.documents.flow.upload.description') },
    { id: 'conv', icon: MessageSquareText, title: t('welcomeDialog.documents.flow.conversation.title'), description: t('welcomeDialog.documents.flow.conversation.description') },
    { id: 'ext', icon: Info, title: t('welcomeDialog.documents.flow.insights.title'), description: t('welcomeDialog.documents.flow.insights.description') },
  ];
  
  const TranslationFlow: FlowStep[] = [
    { id: 'up-trans', icon: UploadCloud, title: t('welcomeDialog.translation.flow.upload.title'), description: t('welcomeDialog.translation.flow.upload.description') },
    { id: 'lang', icon: Globe, title: t('welcomeDialog.translation.flow.selectLanguage.title'), description: t('welcomeDialog.translation.flow.selectLanguage.description') },
    { id: 'receive', icon: FileText, title: t('welcomeDialog.translation.flow.receiveTranslation.title'), description: t('welcomeDialog.translation.flow.receiveTranslation.description') },
    { id: 'feedback', icon: MessageSquareText, title: t('welcomeDialog.translation.flow.provideFeedback.title'), description: t('welcomeDialog.translation.flow.provideFeedback.description') },
  ];
  
  const supportedTranslationLanguages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Chinese'];
  const supportedDocTypes = ['Word', 'PowerPoint', 'Excel', 'PDF'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="max-w-3xl w-[90vw] p-0 border-[3px] border-yellow-500 rounded-[24px] shadow-2xl bg-background">
        <DialogHeader className="p-6 pb-4 border-b border-border relative">
          <DialogTitle className="text-2xl font-bold text-center text-primary-gradient">{t('welcomeDialog.title')}</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground mt-1">
            {t('welcomeDialog.subtitle')}
          </DialogDescription>       
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] max-h-[70vh]">
          <div className="p-6 space-y-8">
            {/* Flowserve AI Section */}
            <Card className="bg-card/50 border-border shadow-lg">
              <CardHeader className="flex flex-row items-center gap-3">
                <Bot size={32} className="text-primary" />
                <div>
                  <CardTitle className="text-xl">{t('welcomeDialog.ai.title')}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t('welcomeDialog.ai.subtitle')}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-foreground">
                  {t('welcomeDialog.ai.description')}
                </p>
                <div className="p-3 bg-muted/30 rounded-md">
                   <ChartNodeDisplay node={AiCapabilitiesChart} />
                </div>
              </CardContent>
            </Card>

            {/* Document Analysis Section */}
            <Card className="bg-card/50 border-border shadow-lg">
              <CardHeader className="flex flex-row items-center gap-3">
                <FileText size={32} className="text-primary" />
                <div>
                  <CardTitle className="text-xl">{t('welcomeDialog.documents.title')}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t('welcomeDialog.documents.subtitle')}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{t('welcomeDialog.documents.maxFileSize')}</Badge>
                  <Badge variant="outline">{t('welcomeDialog.documents.onlyPDF')}</Badge>
                  <Badge variant="outline">{t('welcomeDialog.documents.extractInfo')}</Badge>
                </div>
                <p className="text-sm text-foreground">
                  {t('welcomeDialog.documents.description')}
                </p>
                <div className="p-3 bg-muted/30 rounded-md relative overflow-x-auto">
                  <FlowChartDisplay steps={DocumentFlow} />
                </div>
              </CardContent>
            </Card>

            {/* Translation Section */}
            <Card className="bg-card/50 border-border shadow-lg">
              <CardHeader className="flex flex-row items-center gap-3">
                <Globe size={32} className="text-primary" />
                <div>
                  <CardTitle className="text-xl">{t('welcomeDialog.translation.title')}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t('welcomeDialog.translation.subtitle')}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-foreground">
                  {t('welcomeDialog.translation.description')}
                </p>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">{t('welcomeDialog.translation.supportedLanguages')}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {supportedTranslationLanguages.map(lang => <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>)}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">{t('welcomeDialog.translation.supportedDocTypes')}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {supportedDocTypes.map(type => <Badge key={type} variant="secondary" className="text-xs">{type}</Badge>)}
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-md relative overflow-x-auto">
                  <FlowChartDisplay steps={TranslationFlow} />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">{t('welcomeDialog.translation.videoTutorial')}</p>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border">
                    <video 
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                    >
                      <source src="/assets/videos/Translation_app_demo 1.mp4" type="video/mp4" />
                      {t('welcomeDialog.translation.unsupportedVideo')}
                    </video>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Helper components moved inside main component to avoid redeclaring translations
const ChartNodeDisplay: FC<{ node: ChartNode; level?: number }> = ({ node, level = 0 }) => {
  // For the root node
  if (level === 0) {
    return (
      <div className="relative">
        {/* Root node */}
        <div className="mb-4 flex justify-center">
          <Badge variant="default" className="py-1.5 px-4 text-sm bg-primary-gradient text-primary-foreground">
            {node.label}
          </Badge>
        </div>
        
        {/* Vertical line connecting root to children */}
        {node.children && node.children.length > 0 && (
          <div className="absolute left-1/2 top-8 h-6 w-0.5 -translate-x-1/2 bg-muted-foreground/30" />
        )}
        
        {/* Children nodes */}
        {node.children && node.children.length > 0 && (
          <div className="mt-6 flex flex-col md:flex-row justify-center items-center md:items-start gap-4 md:gap-8">
            {node.children.map((child, index) => (
              <div key={child.id} className="relative flex flex-col items-center">
                {/* Horizontal line before node (for all except first) */}
                {index > 0 && level === 0 && (
                  <div className="absolute left-[-2rem] top-3 h-0.5 w-4 bg-muted-foreground/30 hidden md:block" />
                )}
                {/* Horizontal line after node (for all except last) */}
                {index < (node.children?.length || 0) - 1 && level === 0 && (
                  <div className="absolute right-[-2rem] top-3 h-0.5 w-4 bg-muted-foreground/30 hidden md:block" />
                )}
                <Badge variant="secondary" className="py-1 px-3 text-sm">
                  {child.label}
                </Badge>
                
                {/* Render child's children if any */}
                {child.children && child.children.length > 0 && (
                  <div className="mt-4 border-l-2 border-muted-foreground/30 pl-4">
                    {child.children.map(grandchild => (
                      <div key={grandchild.id} className="mb-2">
                        <Badge variant="secondary" className="py-1 px-3 text-xs">
                          {grandchild.label}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // For child nodes (these won't be used for level 0 because we handle that above)
  return (
    <div className={`mb-2 ${level > 0 ? `ml-${level * 4}` : ''}`}>
      <Badge variant={level === 0 ? "default" : "secondary"} className={`py-1 px-3 text-sm ${level === 0 ? "bg-primary-gradient text-primary-foreground" : ""}`}>
        {node.label}
      </Badge>
      {node.children && (
        <div className={`mt-2 pl-4 border-l-2 border-muted-foreground/30 ${level > 0 ? `ml-${level * 2}` : ''}`}>
          {node.children.map(child => <ChartNodeDisplay key={child.id} node={child} level={level + 1} />)}
        </div>
      )}
    </div>
  );
};

const FlowChartDisplay: FC<{ steps: FlowStep[] }> = ({ steps }) => (
  <div className="flex flex-col md:flex-row items-stretch justify-between space-y-4 md:space-y-0 md:space-x-2 mt-3">
    {steps.map((step, index) => (
      <div key={step.id} className="flex-1 flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary-gradient text-secondary-foreground mb-2">
          <step.icon size={24} />
        </div>
        <p className="font-semibold text-sm mb-0.5">{step.title}</p>
        <p className="text-xs text-muted-foreground">{step.description}</p>
      </div>
    ))}
  </div>
);

export default WelcomeDialog;
