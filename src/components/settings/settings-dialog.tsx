import React, { useState, useEffect, ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Moon, Sun, User, Palette, Link as LinkIcon, Info,
  FileText, Bot, Languages, Globe, Check, Search, Shield, HelpCircle, Save, X, ChevronRight, ArrowLeft, LogOut, Bell, Lock, Briefcase, Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { MOCK_USER, TRANSLATION_CONFIG } from '@/app/utils/constants';
import WelcomeDialog from '@/components/help/welcome-dialog';
import useTranslation from '@/app/hooks/useTranslation';
// Assuming supportedLanguages is exported or part of TRANSLATION_CONFIG
// import { supportedLanguages } from '@/app/translate/translations';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('flowserveai-darkMode');
      return savedDarkMode !== null ? savedDarkMode === 'true' : true;
    }
    return true;
  });

  const { language: currentLanguage, t, setLanguage } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(false);

  const [initialDarkMode, setInitialDarkMode] = useState(darkMode);
  const [initialLanguage, setInitialLanguage] = useState(currentLanguage);
  const [hasChanges, setHasChanges] = useState(false);

  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [searchLanguage, setSearchLanguage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  useEffect(() => {
    if (open) {
      const savedDarkMode = localStorage.getItem('flowserveai-darkMode');
      const currentDark = savedDarkMode !== null ? savedDarkMode === 'true' : true;
      setDarkMode(currentDark);
      setInitialDarkMode(currentDark);

      const savedLanguage = localStorage.getItem('flowserveai-language') || TRANSLATION_CONFIG.defaultLanguage;
      // Ensure setLanguage from useTranslation updates the global state
      // For now, we assume currentLanguage from useTranslation is correctly initialized
      setInitialLanguage(savedLanguage!);
      
      setHasChanges(false);
      setShowLanguageSelector(false);
      setSearchLanguage('');
    }
  }, [open, currentLanguage]);

  useEffect(() => {
    if (open) {
      setHasChanges(initialDarkMode !== darkMode || initialLanguage !== currentLanguage);
    }
  }, [darkMode, currentLanguage, initialDarkMode, initialLanguage, open]);

  const handleSaveSettings = () => {
    localStorage.setItem('flowserveai-darkMode', darkMode.toString());
    localStorage.setItem('flowserveai-language', currentLanguage);

    window.dispatchEvent(new CustomEvent('flowserveai-settings-updated', {
      detail: { darkMode, language: currentLanguage }
    }));

    setInitialDarkMode(darkMode);
    setInitialLanguage(currentLanguage);
    setHasChanges(false);

    toast({
      title: t('settings.saveStatus.success'),
      description: t('settings.saveStatus.description')
    });
    onOpenChange(false); // Close dialog on save
  };

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode); // This should update context and localStorage via useTranslation hook
    // The effect watching currentLanguage will pick up the change for hasChanges
    setShowLanguageSelector(false);
  };
  
  const handleClose = () => {
    // Reset to initial settings if not saved
    setDarkMode(initialDarkMode);
    setLanguage(initialLanguage);
    if (initialDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    onOpenChange(false);
  };

  const filteredLanguages = TRANSLATION_CONFIG.availableLanguages.filter(
    (lang: { name: string; nativeName: string; code: string; }) =>
      lang.name.toLowerCase().includes(searchLanguage.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchLanguage.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchLanguage.toLowerCase())
  );

  const navigateAndClose = (path: string) => {
    onOpenChange(false);
    router.push(path);
  };
  
  const openHelpDialogAndClose = () => {
    onOpenChange(false);
    // Delay showing welcome dialog to allow settings dialog to close first
    setTimeout(() => setIsWelcomeDialogOpen(true), 150);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) handleClose(); else onOpenChange(true);
      }}>
        <DialogContent className={`sm:max-w-[550px] md:max-w-[650px] lg:max-w-[700px] p-0 ${darkMode ? 'dark' : ''} overflow-hidden rounded-lg border ${darkMode ? 'border-slate-700' : 'border-slate-200'} shadow-xl`}>
          <DialogHeader className={`px-6 pt-6 pb-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <DialogTitle className={`${darkMode ? 'text-white' : 'text-slate-900'} text-xl`}>{t('settings.title')}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="general" className={`w-full ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-700'}`}>
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <TabsList className={`grid w-full grid-cols-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <TabsTrigger value="general" className={`${darkMode ? 'data-[state=active]:bg-slate-600 data-[state=active]:text-white' : ''}`}>{t('settings.tabs.general')}</TabsTrigger>
                <TabsTrigger value="account" className={`${darkMode ? 'data-[state=active]:bg-slate-600 data-[state=active]:text-white' : ''}`}>{t('settings.tabs.account')}</TabsTrigger>
                <TabsTrigger value="navigation" className={`${darkMode ? 'data-[state=active]:bg-slate-600 data-[state=active]:text-white' : ''}`}>{t('settings.tabs.navigation')}</TabsTrigger>
                <TabsTrigger value="about" className={`${darkMode ? 'data-[state=active]:bg-slate-600 data-[state=active]:text-white' : ''}`}>{t('settings.tabs.about')}</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 min-h-[350px] max-h-[60vh] overflow-y-auto">
              <TabsContent value="general">
                {!showLanguageSelector ? (
                  <div className="space-y-6">
                    <div className={`flex items-center justify-between p-5 rounded-lg transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-650' : 'bg-slate-50 hover:bg-slate-100'}`}>
                      <div className="flex items-center">
                        {darkMode ? 
                          <Moon className="mr-3 h-6 w-6 text-blue-400" /> : 
                          <Sun className="mr-3 h-6 w-6 text-yellow-500" />
                        }
                        <div>
                          <Label htmlFor="dark-mode-switch" className={`text-base font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                            {t('settings.darkMode')}
                          </Label>
                          <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {darkMode ? t('settings.darkModeDesc') : t('settings.lightModeDesc')}
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="dark-mode-switch"
                        checked={darkMode}
                        onCheckedChange={setDarkMode}
                        className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-slate-300"
                      />
                    </div>
                    <div 
                      className={`flex items-center justify-between p-5 rounded-lg cursor-pointer transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-650' : 'bg-slate-50 hover:bg-slate-100'}`}
                      onClick={() => setShowLanguageSelector(true)}
                    >
                      <div className="flex items-center">
                        <Globe className="mr-3 h-6 w-6 text-green-500" />
                        <div>
                          <span className={`text-base font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                            {t('settings.language')}
                          </span>
                          <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {t('settings.languageDesc')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`mr-2 px-2 py-1 rounded ${darkMode ? 'bg-slate-600 text-slate-200' : 'bg-slate-200 text-slate-700'}`}>
                          {TRANSLATION_CONFIG.availableLanguages.find(lang => lang.code === currentLanguage)?.name || currentLanguage}
                        </span>
                        <ChevronRight size={18} className={`${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <h3 className={`text-lg font-medium ${darkMode?'text-white':'text-slate-900'}`}>{t('settings.selectLanguage')}</h3>
                       <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowLanguageSelector(false)} 
                        className={`${darkMode? 'text-slate-300 hover:bg-slate-700 border-slate-600':''}`}
                      >
                         <ArrowLeft size={16} className="mr-1" /> {t('settings.backButton')}
                       </Button>
                    </div>
                    <div className="relative">
                      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-muted-foreground'}`} />
                      <input
                        type="text"
                        placeholder={t('settings.search')}
                        value={searchLanguage}
                        onChange={(e) => setSearchLanguage(e.target.value)}
                        className={`w-full pl-9 py-2 pr-4 rounded-md border ${
                          darkMode 
                            ? 'bg-slate-700 text-white placeholder-slate-400 border-slate-600 focus:ring-blue-500' 
                            : 'bg-white text-slate-900 placeholder-slate-500 border-slate-300 focus:ring-blue-500'
                        } focus:outline-none focus:ring-1`}
                      />
                    </div>
                    <div className="max-h-[250px] overflow-y-auto space-y-1 pr-1 rounded-md">
                      {filteredLanguages.map((lang: { code: string; name: string; nativeName: string; }) => (
                        <Button
                          key={lang.code}
                          variant="ghost"
                          className={`w-full justify-start items-center text-left h-auto py-3 px-4 ${
                            currentLanguage === lang.code
                              ? darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : darkMode ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                          }`}
                          onClick={() => handleLanguageChange(lang.code)}
                        >
                          <div className="flex-grow flex items-center">
                            <span className="font-medium">{lang.name}</span>
                            {lang.nativeName !== lang.name && (
                              <span className={`ml-2 text-xs ${
                                currentLanguage === lang.code 
                                  ? (darkMode ? 'text-blue-200' : 'text-blue-500') 
                                  : (darkMode ? 'text-slate-400' : 'text-slate-500')
                              }`}>
                                ({lang.nativeName})
                              </span>
                            )}
                          </div>
                          {currentLanguage === lang.code && <Check size={18} className="ml-2 flex-shrink-0" />}
                        </Button>
                      ))}
                      {filteredLanguages.length === 0 && (
                        <div className={`text-center py-6 px-4 rounded-md ${darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                          <Search size={24} className="mx-auto mb-2 opacity-40" />
                          <p>{t('settings.noLanguageMatch')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="account">
                <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                  <div className={`p-6 ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                    <div className="flex items-center">
                      <img 
                        src={MOCK_USER.avatarUrl} 
                        className={`rounded-full w-20 h-20 mr-6 object-cover border-2 ${darkMode ? 'border-slate-600' : 'border-slate-200'}`} 
                        alt="User Avatar" 
                      />
                      <div>
                        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{MOCK_USER.name}</h3>
                        <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-1`}>{MOCK_USER.email}</p>
                        <div className="flex mt-4">
                          <Button size="sm" variant="outline" disabled className={`mr-3 ${darkMode ? 'text-slate-400 border-slate-600' : ''}`}>
                            <User size={14} className="mr-1" /> {t('account.profile')}
                          </Button>
                          <Button size="sm" variant="outline" disabled className={`${darkMode ? 'text-slate-400 border-slate-600' : ''}`}>
                            <LogOut size={14} className="mr-1" /> {t('account.logout')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-6 py-4 border-t ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                    <h4 className={`font-medium mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t('account.preferences')}</h4>
                    <div className="space-y-3">
                      <div className={`flex items-center justify-between p-3 rounded-md ${darkMode ? 'bg-slate-600' : 'bg-slate-100'}`}>
                        <div className="flex items-center">
                          <Bell size={18} className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                          <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{t('account.notifications')}</span>
                        </div>
                        <Switch disabled className="opacity-50" />
                      </div>
                      
                      <div className={`flex items-center justify-between p-3 rounded-md ${darkMode ? 'bg-slate-600' : 'bg-slate-100'}`}>
                        <div className="flex items-center">
                          <Lock size={18} className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                          <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{t('account.privacy')}</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t('account.mockUserNotice')}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="navigation" className="space-y-4">
                <div className={`p-4 rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-slate-50'}`}>
                  <h3 className={`font-medium mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t('settings.quickNavigation')}</h3>
                  <div className="grid gap-3">
                    {(
                      [
                        { icon: <FileText size={18} />, label: t('tools.documents'), path: '/documents', color: 'text-blue-500' },
                        { icon: <Bot size={18} />, label: t('tools.chat'), path: '/', color: 'text-purple-500' },
                        { icon: <Languages size={18} />, label: t('tools.translate'), path: '/translate', color: 'text-green-500' },
                      ] as const
                    ).map(item => (
                      <Button 
                        key={item.path}
                        variant="outline" 
                        className={`justify-start text-left h-auto py-3 px-4 transition-colors ${darkMode ? 'border-slate-600 hover:bg-slate-600 text-slate-200' : 'hover:bg-slate-100'}`}
                        onClick={() => navigateAndClose(item.path)}
                      >
                        {React.cloneElement(item.icon, { className: `mr-3 ${item.color}` })}
                        <div className="flex flex-col items-start">
                          <span>{item.label}</span>
                          <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {item.path === '/' ? t('navigation.chatDesc') :
                            item.path === '/documents' ? t('navigation.documentsDesc') :
                            t('navigation.translateDesc')}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
                <div className={`p-4 rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-slate-50'}`}>
                  <h3 className={`font-medium mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t('settings.comingSoon')}</h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      disabled 
                      className={`w-full justify-start text-left h-auto py-3 px-4 ${darkMode ? 'border-slate-600 text-slate-400 bg-slate-600/30' : 'text-slate-500 bg-slate-100 cursor-not-allowed'}`}
                    >
                      <Briefcase size={18} className={`mr-3 ${darkMode ? 'text-amber-400/70' : 'text-amber-500/70'}`} />
                      {t('tools.products')}
                    </Button>
                    <Button 
                      variant="outline" 
                      disabled 
                      className={`w-full justify-start text-left h-auto py-3 px-4 ${darkMode ? 'border-slate-600 text-slate-400 bg-slate-600/30' : 'text-slate-500 bg-slate-100 cursor-not-allowed'}`}
                    >
                      <Users size={18} className={`mr-3 ${darkMode ? 'text-pink-400/70' : 'text-pink-500/70'}`} />
                      {t('tools.community')}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="about" className="space-y-4">
                <div className={`p-5 rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center mb-4">
                    <img src="/assets/images/flowserve_logo_transparent.svg" alt="Flowserve AI" className="h-10 w-10 mr-3" />
                    <div>
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Flowserve AI</h3>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>v1.0.0</p>
                    </div>
                  </div>
                  <p className={`mb-4 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {t('about.description')}
                  </p>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className={`w-full justify-start text-left h-auto py-3 px-4 transition-colors ${darkMode ? 'border-slate-600 hover:bg-slate-600 text-slate-200' : 'hover:bg-slate-100'}`}
                      onClick={openHelpDialogAndClose}
                    >
                      <HelpCircle size={18} className={`mr-3 ${darkMode ? 'text-teal-400' : 'text-teal-500'}`} />
                      <div className="flex flex-col items-start">
                        <span>{t('support.help')}</span>
                        <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t('support.helpDesc')}</span>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      disabled 
                      className={`w-full justify-start text-left h-auto py-3 px-4 ${darkMode ? 'border-slate-600 text-slate-400 bg-slate-600/30' : 'text-slate-500 bg-slate-100 cursor-not-allowed'}`}
                    >
                      <Shield size={18} className={`mr-3 ${darkMode ? 'text-indigo-400/70' : 'text-indigo-500/70'}`} />
                      <div className="flex flex-col items-start">
                        <span>{t('policies.privacy')}</span>
                        <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t('settings.comingSoon')}</span>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      disabled 
                      className={`w-full justify-start text-left h-auto py-3 px-4 ${darkMode ? 'border-slate-600 text-slate-400 bg-slate-600/30' : 'text-slate-500 bg-slate-100 cursor-not-allowed'}`}
                    >
                      <Info size={18} className={`mr-3 ${darkMode ? 'text-orange-400/70' : 'text-orange-500/70'}`} />
                      <div className="flex flex-col items-start">
                        <span>{t('policies.ai')}</span>
                        <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t('settings.comingSoon')}</span>
                      </div>
                    </Button>
                  </div>
                </div>
                
                <div className={`mt-6 text-center p-4 rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-700/50' : 'border-slate-200 bg-slate-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    &copy; {new Date().getFullYear()} Flowserve Corporation
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Flowserve AI v1.0.0
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className={`px-6 pb-6 pt-4 border-t ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} flex justify-between items-center`}>
            <Button variant="ghost" onClick={handleClose} className={`${darkMode?'text-slate-300 hover:bg-slate-700':''}`}>{t('common.close')}</Button>
            <Button 
              onClick={handleSaveSettings} 
              disabled={!hasChanges}
              className={`${hasChanges ? 'bg-blue-600 hover:bg-blue-700 text-white transition-colors' : (darkMode ? 'bg-slate-600 text-slate-400' : 'bg-slate-300 text-slate-500')} `}
            >
              <Save size={16} className="mr-2" /> {t('settings.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <WelcomeDialog open={isWelcomeDialogOpen} onOpenChange={setIsWelcomeDialogOpen} />
    </>
  );
};

export default SettingsDialog;
