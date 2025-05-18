import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { 
  X, FileText, Briefcase, Moon, Sun,
  Languages, ChevronRight, Globe, Check,
  MessageSquare, Bot, PanelLeft, User,
  Search, HelpCircle, Shield, Save, Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { MOCK_USER, TRANSLATION_CONFIG } from '@/app/utils/constants';
import FlowServeLogo from '@/assets/images/flowserve_logo_transparent.svg';
import WelcomeDialog from '@/components/help/welcome-dialog';
import useTranslation from '@/app/hooks/useTranslation';
import { supportedLanguages, translations } from '@/app/translate/translations';



interface MoreBottomSheetProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

const MoreBottomSheet = ({ isOpen: propIsOpen, setIsOpen: propSetIsOpen }: MoreBottomSheetProps = {}) => {
  // Sheet state management
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : localIsOpen;
  const setIsOpen = propSetIsOpen || setLocalIsOpen;
  
  const [sheetState, setSheetState] = useState('full'); // full by default, can snap to half
  const sheetRef = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('flowserveai-darkMode');
      return savedDarkMode !== null ? savedDarkMode === 'true' : true;
    }
    return true;
  });
  
  const [searchLanguage, setSearchLanguage] = useState('');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(false);
  
  // Get translations using the global hook
  const { language: currentLanguage, t } = useTranslation();
  
  // Track if settings have changed for save button
  const [initialSettings, setInitialSettings] = useState({ darkMode, language: currentLanguage });
  const [hasChanges, setHasChanges] = useState(false);

  // Apply dark/light mode to the document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  // Set initial settings when props change
  useEffect(() => {
    if (isOpen) {
      setInitialSettings({ darkMode, language: currentLanguage });
      setHasChanges(false);
      
      // Reset language search when opening
      setSearchLanguage('');
      setShowLanguageSelector(false);
    }
  }, [isOpen, darkMode, currentLanguage]);

  // Check for changes when settings change
  useEffect(() => {
    if (isOpen) {
      // For now, we only track changes to darkMode as language changes are applied immediately
      setHasChanges(initialSettings.darkMode !== darkMode);
    }
  }, [darkMode, initialSettings, isOpen]);

  // Save settings
  const saveSettings = () => {
    // Save to localStorage using the same keys as in the global system
    localStorage.setItem('flowserveai-darkMode', darkMode.toString());
    
    // Don't need to save language here since it's handled by updateLanguage
    
    // Dispatch custom event to notify other components about the changes
    window.dispatchEvent(new CustomEvent('flowserveai-settings-updated', {
      detail: { darkMode }
    }));
    
    setInitialSettings({ darkMode, language: currentLanguage });
    setHasChanges(false);
    
    toast({
      title: t('settings.saveStatus.success'),
      description: t('settings.saveStatus.description')
    });
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Handle navigation and close sheet
  const handleNavigation = (path: string) => {
    // First close the sheet
    setIsOpen(false);
    // Then navigate after the animation has completed
    setTimeout(() => {
      router.push(path);
    }, 300);
  };

  // Handle help button click
  const handleHelpClick = () => {
    // First close the sheet
    setIsOpen(false);
    // Then show welcome dialog after the animation has completed
    setTimeout(() => {
      setIsWelcomeDialogOpen(true);
    }, 300);
  };

  // Filtered languages based on search
  const filteredLanguages = TRANSLATION_CONFIG.availableLanguages.filter(
      (lang: { name: string; nativeName: string; code: string; }) => 
        lang.name.toLowerCase().includes(searchLanguage.toLowerCase()) || 
        lang.nativeName.toLowerCase().includes(searchLanguage.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchLanguage.toLowerCase())
  );

  // Handle touch gestures for the sheet
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isOpen || !sheetRef.current) return;
    
    const startY = e.touches[0].clientY;
    const currentHeight = sheetRef.current.getBoundingClientRect().height;
    const viewportHeight = window.innerHeight;
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!sheetRef.current) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      
      e.preventDefault();
      
      if (deltaY > 0) {
        // Dragging down
        sheetRef.current.style.transform = `translateY(${deltaY}px)`;
      } else if (deltaY < 0 && sheetState === 'half') {
        // Dragging up from half state
        const newHeight = Math.min(viewportHeight * 0.9, currentHeight - deltaY);
        sheetRef.current.style.height = `${newHeight}px`;
      }
    };
    
    const handleTouchEnd = () => {
      if (!sheetRef.current) return;
      
      const translateY = getTranslateY(sheetRef.current);
      const currentHeight = sheetRef.current.getBoundingClientRect().height;
      
      sheetRef.current.style.transition = 'transform 0.3s ease, height 0.3s ease';
      
      if (translateY > 150) {
        // Close the sheet if dragged down significantly
        setIsOpen(false);
      } else if (currentHeight > viewportHeight * 0.75 && sheetState === 'half') {
        // Expand to full if dragged up significantly from half state
        setSheetState('full');
        sheetRef.current.style.height = '90vh';
        sheetRef.current.style.transform = 'translateY(0)';
      } else if (translateY > 50 && sheetState === 'full') {
        // Collapse to half if dragged down from full state
        setSheetState('half');
        sheetRef.current.style.height = '50vh';
        sheetRef.current.style.transform = 'translateY(0)';
      } else {
        // Reset to current state
        sheetRef.current.style.transform = 'translateY(0)';
      }
      
      setTimeout(() => {
        if (sheetRef.current) {
          sheetRef.current.style.transition = '';
        }
      }, 300);
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Helper function to get translateY value
  const getTranslateY = (element: HTMLElement): number => {
    if (!element) return 0;
    const style = window.getComputedStyle(element);
    const transform = style.transform;
    if (transform === 'none') return 0;
    
    const matrix = new DOMMatrixReadOnly(transform);
    return matrix.m42;
  };

  // We need to add a function to update the language since we don't have setLanguage anymore
  const updateLanguage = (langCode: string) => {
    localStorage.setItem('flowserveai-language', langCode);
    
    // Dispatch custom event to notify other components about the changes
    window.dispatchEvent(new CustomEvent('flowserveai-settings-updated', {
      detail: { language: langCode }
    }));
    
    // Optional: Close the language selector after selection
    setTimeout(() => setShowLanguageSelector(false), 300);
  };

  return (
    <>
      {/* BOTTOM SHEET MODAL */}
      <div 
        ref={sheetRef}
        className={`fixed inset-x-0 bottom-0 ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-t-2xl shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          isOpen 
            ? sheetState === 'full' 
              ? 'translate-y-0 h-[90vh]' 
              : 'translate-y-0 h-[50vh]'
            : 'translate-y-full h-[90vh]'
        }`}
      >
        {!showLanguageSelector ? (
          <>
            {/* Drag Handle */}
            <div 
              className="w-full flex justify-center pt-3 pb-2 cursor-grab touch-manipulation"
              onTouchStart={handleTouchStart}
            >
              <div className={`w-12 h-1.5 ${darkMode ? 'bg-slate-600' : 'bg-slate-300'} rounded-full`}></div>
            </div>
            
            {/* Sheet Header */}
            <div className={`flex justify-between items-center px-6 py-3 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold">
                  {t('settings.title')} {currentLanguage && `(${TRANSLATION_CONFIG.availableLanguages.find((lang: { code: string; }) => lang.code === currentLanguage)?.name || currentLanguage})`}
                </h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-full ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} transition-colors`}
                aria-label="Close settings"
              >
                <X size={20} className={darkMode ? "text-slate-400" : "text-slate-500"} />
              </button>
            </div>
            
            {/* Sheet Content - Modernized Design */}
            <div className="overflow-y-auto h-full pb-28 px-4"> {/* Extra bottom padding for save button */}
              {/* Profile Section */}
              <div className={`my-4 p-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} rounded-xl flex items-center justify-between`}>
                <div className="flex items-center">
                  <img src={MOCK_USER.avatarUrl} className="rounded-full mr-3" alt="Profile" />
                  <div>
                    <div className="font-medium">{MOCK_USER.name}</div>
                    <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{MOCK_USER.email}</div>
                  </div>
                </div>
              </div>
              
              {/* Tools Section */}
              <div className="mt-6">
                <h3 className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'} px-2 mb-2`}>{t('settings.tools').toUpperCase()}</h3>
                <div className="rounded-xl overflow-hidden">
                  <BottomSheetItem 
                    icon={<FileText size={20} className="text-blue-500" />}
                    label={t('tools.documents')}
                    description={t('tools.documentsDesc')}
                    darkMode={darkMode}
                    onClick={() => handleNavigation('/documents')}
                  />
                  <BottomSheetItem 
                    icon={<Bot size={20} className="text-purple-500" />}
                    label={t('tools.chat')}
                    description={t('tools.chatDesc')}
                    darkMode={darkMode}
                    onClick={() => handleNavigation('/')}
                  />
                  <BottomSheetItem 
                    icon={<Languages size={20} className="text-green-500" />}
                    label={t('tools.jobs')}
                    description={t('tools.jobsDesc')}
                    darkMode={darkMode}
                    onClick={() => handleNavigation('/translate')}
                  />
                </div>
              </div>
              
              {/* Preferences Section */}
              <div className="mt-6">
                <h3 className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'} px-2 mb-2`}>{t('settings.preferences').toUpperCase()}</h3>
                <div className="rounded-xl overflow-hidden">
                  <BottomSheetToggleItem 
                    icon={<Moon size={20} className={darkMode ? "text-blue-400" : "text-slate-400"} />} 
                    label={t('settings.darkMode')} 
                    isActive={darkMode}
                    onToggle={toggleDarkMode}
                    darkMode={darkMode}
                  />
                  <BottomSheetItem 
                    icon={<Globe size={20} className="text-blue-500" />} 
                    label={t('settings.language')} 
                    description={TRANSLATION_CONFIG.availableLanguages.find((lang: { code: string; }) => lang.code === currentLanguage)?.nativeName}
                    darkMode={darkMode}
                    onClick={() => setShowLanguageSelector(true)}
                  />
                </div>
              </div>
              
              {/* Help & Support Section */}
              <div className="mt-6">
                <h3 className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'} px-2 mb-2`}>{t('settings.support').toUpperCase()}</h3>
                <div className="rounded-xl overflow-hidden">
                  <BottomSheetItem 
                    icon={<HelpCircle size={20} className="text-teal-500" />}
                    label={t('support.help')}
                    description={t('support.helpDesc')}
                    darkMode={darkMode} 
                    onClick={handleHelpClick}
                  />
                </div>
              </div>
              
              {/* Policies Section */}
              <div className="mt-6">
                <h3 className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'} px-2 mb-2`}>{t('settings.policies').toUpperCase()}</h3>
                <div className="rounded-xl overflow-hidden">
                  <BottomSheetItem 
                    icon={<Shield size={20} className="text-indigo-500" />}
                    label={t('policies.privacy')}
                    description={t('policies.privacyDesc')}
                    darkMode={darkMode} 
                    onClick={undefined}
                  />
                  <BottomSheetItem 
                    icon={<Info size={20} className="text-orange-500" />}
                    label={t('policies.ai')}
                    description={t('policies.aiDesc')}
                    darkMode={darkMode} 
                    onClick={undefined}
                  />
                </div>
              </div>
              
              {/* Version Info */}
              <div className={`text-center text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'} mt-8 mb-4`}>
                {new Date().getFullYear()} @ Flowserve AI v1.0.0
              </div>
            </div>
            
            {/* Save Button - Fixed at Bottom */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <button
                id="save-settings-button"
                className={`w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center ${
                  hasChanges 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : `${darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'} cursor-not-allowed`
                }`}
                onClick={saveSettings}
                disabled={!hasChanges}
              >
                <Save size={18} className="mr-2" />
                {t('settings.save')}
              </button>
            </div>
          </>
        ) : (
          // Language Selector View
          <>
            {/* Language Selector Header */}
            <div className={`flex justify-between items-center px-6 py-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowLanguageSelector(false)}
                  className={`p-1 rounded-full ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                >
                  <ChevronRight size={20} className="rotate-180" />
                </button>
                <h2 className="text-lg font-semibold">{t('settings.selectLanguage')}</h2>
              </div>
            </div>
            
            {/* Search Languages */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('settings.search')}
                  value={searchLanguage}
                  onChange={(e) => setSearchLanguage(e.target.value)}
                  className={`w-full pl-9 py-3 pr-4 rounded-lg ${
                    darkMode 
                      ? 'bg-slate-700 text-white placeholder-slate-400 focus:ring-blue-500' 
                      : 'bg-slate-100 text-slate-900 placeholder-slate-500 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2`}
                />
              </div>
            </div>
            
            {/* Language List */}
            <div className="overflow-y-auto h-full pb-20">
              <div className="px-4 space-y-1">
                {filteredLanguages.map((lang: { code: string; name: string; nativeName: string; }) => (
                  <button
                    key={lang.code}
                    className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                      currentLanguage === lang.code 
                        ? darkMode 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-100 text-blue-800'
                        : darkMode 
                          ? 'hover:bg-slate-700' 
                          : 'hover:bg-slate-100'
                    }`}
                    onClick={() => {
                      updateLanguage(lang.code);
                    }}
                  >
                    <div className="flex items-center">
                      <span className="text-lg font-medium mr-2">{lang.name}</span>
                      <span className={`text-sm ${currentLanguage === lang.code ? '' : darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {lang.nativeName !== lang.name ? `(${lang.nativeName})` : ''}
                      </span>
                    </div>
                    {currentLanguage === lang.code && (
                      <Check size={20} className={darkMode ? "text-white" : "text-blue-600"} />
                    )}
                  </button>
                ))}
                
                {filteredLanguages.length === 0 && (
                  <div className={`p-8 text-center ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t('settings.noLanguageMatch')}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Backdrop when sheet is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Welcome Dialog */}
      <WelcomeDialog open={isWelcomeDialogOpen} onOpenChange={setIsWelcomeDialogOpen} />
    </>
  );
};

// Helper components
interface BottomSheetItemProps {
  icon: ReactNode;
  label: string;
  description?: string;
  darkMode: boolean;
  onClick?: () => void;
}

const BottomSheetItem = ({ icon, label, description, darkMode, onClick }: BottomSheetItemProps) => (
  <button 
    className={`w-full flex items-center justify-between p-4 ${
      darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
    } cursor-pointer transition-colors`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <div className="font-medium text-left">{label}</div>
        {description && <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{description}</div>}
      </div>
    </div>
    <ChevronRight size={18} className={darkMode ? "text-slate-500" : "text-slate-400"} />
  </button>
);

interface BottomSheetToggleItemProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onToggle: () => void;
  darkMode: boolean;
}

const BottomSheetToggleItem = ({ icon, label, isActive, onToggle, darkMode }: BottomSheetToggleItemProps) => (
  <div 
    className={`w-full flex items-center justify-between p-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={isActive}
        onChange={onToggle}
      />
      <div className={`w-11 h-6 ${darkMode ? 'bg-slate-600' : 'bg-gray-300'} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer ${darkMode ? 'peer-checked:bg-blue-600' : 'peer-checked:bg-blue-500'} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full`}></div>
    </label>
  </div>
);

export default MoreBottomSheet;
