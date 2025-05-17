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

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AiCapabilitiesChart: ChartNode = {
  id: 'root',
  label: 'What can Flowserve AI do for you?',
  children: [
    { id: 'ans', label: 'Answer questions' },
    { id: 'exp', label: 'Provide explanations' },
    { id: 'ast', label: 'Assist with tasks' },
  ],
};

const DocumentFlow: FlowStep[] = [
  { id: 'up', icon: UploadCloud, title: 'Upload Document', description: 'Securely upload your PDF files.' },
  { id: 'conv', icon: MessageSquareText, title: 'Start Conversation', description: 'Ask questions about your document.' },
  { id: 'ext', icon: Info, title: 'Extract Insights', description: 'Get summaries and key information.' },
];

const TranslationFlow: FlowStep[] = [
  { id: 'up-trans', icon: UploadCloud, title: 'Upload', description: 'Word, PowerPoint, Excel, PDF files.' },
  { id: 'lang', icon: Globe, title: 'Select Language', description: 'Choose your target language.' },
  { id: 'receive', icon: FileText, title: 'Receive Translation', description: 'Get your translated content.' },
  { id: 'feedback', icon: MessageSquareText, title: 'Provide Feedback', description: 'Help improve future translations.' },
];

const supportedTranslationLanguages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Chinese'];
const supportedDocTypes = ['Word', 'PowerPoint', 'Excel', 'PDF'];


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


const WelcomeDialog: FC<WelcomeDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="max-w-3xl w-[90vw] p-0 border-[3px] border-yellow-500 rounded-[24px] shadow-2xl bg-background">
        <DialogHeader className="p-6 pb-4 border-b border-border relative">
          <DialogTitle className="text-2xl font-bold text-center text-primary-gradient">Welcome to Flowserve AI</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground mt-1">
            Your unified platform for intelligent assistance, document analysis, and product knowledge.
          </DialogDescription>       
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] max-h-[70vh]">
          <div className="p-6 space-y-8">
            {/* Flowserve AI Section */}
            <Card className="bg-card/50 border-border shadow-lg">
              <CardHeader className="flex flex-row items-center gap-3">
                <Bot size={32} className="text-primary" />
                <div>
                  <CardTitle className="text-xl">Flowserve AI</CardTitle>
                  <p className="text-sm text-muted-foreground">Your Digital Assistant</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-foreground">
                  Engage in natural conversations to get answers, understand complex topics, and receive assistance with various tasks related to Flowserve's offerings.
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
                  <CardTitle className="text-xl">Document Analysis</CardTitle>
                  <p className="text-sm text-muted-foreground">Chat with Your Documents</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Max File Size 5MB</Badge>
                  <Badge variant="outline">Only PDF files</Badge>
                  <Badge variant="outline">Extract info from documents</Badge>
                </div>
                <p className="text-sm text-foreground">
                  Upload your documents (PDFs) and interact with them directly in the chat. Ask questions, get summaries, and find information quickly.
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
                  <CardTitle className="text-xl">Translation</CardTitle>
                  <p className="text-sm text-muted-foreground">Multi-Language Support</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-foreground">
                  Translate text and documents between various languages. Use the dedicated "Translate" tool in the sidebar.
                </p>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Supported Languages for Text:</p>
                    <div className="flex flex-wrap gap-1.5">
                        {supportedTranslationLanguages.map(lang => <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>)}
                    </div>
                </div>
                 <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Supported Document Types for Translation Module (Future):</p>
                     <div className="flex flex-wrap gap-1.5">
                        {supportedDocTypes.map(type => <Badge key={type} variant="secondary" className="text-xs">{type}</Badge>)}
                    </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-md relative overflow-x-auto">
                   <FlowChartDisplay steps={TranslationFlow} />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Video Tutorial</p>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border">
                    <video 
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                    >
                      <source src="/assets/videos/Translation_app_demo 1.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
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

export default WelcomeDialog;
