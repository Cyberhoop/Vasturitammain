import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Sliders, X, Check, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  sponsored: boolean;
  updatedAt: string;
}

const COOKIE_STORAGE_KEY = 'vastu_ritam_cookie_consent_v1';

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  functional: true,
  analytics: true,
  sponsored: true,
  updatedAt: '',
};

export const CookieConsent: React.FC<{
  externalOpen?: boolean;
  onCloseExternal?: () => void;
}> = ({ externalOpen = false, onCloseExternal }) => {
  const { isLight } = useTheme();
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const [prefs, setPrefs] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CookiePreferences;
        setPrefs({
          necessary: true,
          functional: parsed.functional ?? true,
          analytics: parsed.analytics ?? true,
          sponsored: parsed.sponsored ?? true,
          updatedAt: parsed.updatedAt || '',
        });
        setShowBanner(false);
      } else {
        setShowBanner(true);
      }
    } catch {
      setShowBanner(true);
    }
  }, []);

  useEffect(() => {
    if (externalOpen) {
      setShowModal(true);
    }
  }, [externalOpen]);

  const handleCloseModal = () => {
    setShowModal(false);
    if (onCloseExternal) onCloseExternal();
  };

  const persistPreferences = (nextPrefs: CookiePreferences) => {
    const payload: CookiePreferences = {
      ...nextPrefs,
      necessary: true,
      updatedAt: new Date().toISOString(),
    };
    setPrefs(payload);
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Could not persist cookie preferences:', e);
    }
    setShowBanner(false);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      handleCloseModal();
    }, 650);
  };

  const handleAcceptAll = () => {
    persistPreferences({
      necessary: true,
      functional: true,
      analytics: true,
      sponsored: true,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleEssentialOnly = () => {
    persistPreferences({
      necessary: true,
      functional: false,
      analytics: false,
      sponsored: false,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSaveCustom = () => {
    persistPreferences(prefs);
  };

  return (
    <>
      {/* 1. First-Visit Bottom Cookie Consent Banner */}
      {showBanner && !showModal && (
        <div
          className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-5 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300"
          role="region"
          aria-label="Cookie Consent Banner"
        >
          <div
            className={`max-w-6xl mx-auto rounded-2xl border-2 p-4 sm:p-6 shadow-2xl pointer-events-auto transition-colors ${
              isLight
                ? 'bg-[#FFFAF5]/98 border-[var(--color-border)] text-[#2A1515] shadow-stone-900/15'
                : 'bg-[#1A0F12]/98 border-[#44262E] text-[#FFF6F7] shadow-black/70'
            }`}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-start gap-3.5 max-w-3xl">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-pink-tint)] border border-[var(--color-border)] flex items-center justify-center shrink-0 mt-0.5">
                  <Cookie className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-['Cinzel',serif] text-sm sm:text-base font-bold text-[var(--color-primary)]">
                      Cookie & Privacy Preferences
                    </h3>
                    <span className="text-[10px] font-serif uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] font-bold">
                      Simple & Transparent
                    </span>
                  </div>
                  <p
                    className={`font-['Marcellus'] text-xs sm:text-sm leading-relaxed ${
                      isLight ? 'text-[#5A4545]' : 'text-zinc-300'
                    }`}
                  >
                    We use cookies to keep our website safe, remember your reading preferences (like Light/Dark mode and floating petals), and see which Vastu Shabd Kosh terms and Prakaran articles help readers the most. You can accept all cookies or choose your own settings anytime.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-['Marcellus'] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isLight
                      ? 'bg-white border-[var(--color-border)] text-[#2A1515] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                      : 'bg-[#251519] border-[#44262E] text-zinc-200 hover:border-amber-500/50'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
                  <span>Customize</span>
                </button>

                <button
                  type="button"
                  onClick={handleEssentialOnly}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-['Marcellus'] font-bold transition-all cursor-pointer ${
                    isLight
                      ? 'bg-[#FAF3EB] border-[var(--color-border)] text-[#5A4545] hover:text-[#2A1515]'
                      : 'bg-[#221417] border-[#44262E] text-zinc-300 hover:text-white'
                  }`}
                >
                  Essential Only
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-5 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-['Marcellus'] font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept All</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Detailed Cookie Preferences Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Cookie Preferences Center"
        >
          <div
            className={`w-full max-w-2xl rounded-3xl border-2 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
              isLight
                ? 'bg-[#FFFAF5] border-[var(--color-border)] text-[#2A1515]'
                : 'bg-[#1A0F12] border-[#44262E] text-[#FFF6F7]'
            }`}
          >
            {/* Modal Header */}
            <div
              className={`px-6 py-4 border-b flex items-center justify-between ${
                isLight ? 'bg-white border-[var(--color-border)]' : 'bg-[#140E10] border-[#44262E]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-pink-tint)] border border-[var(--color-border)] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h2 className="font-['Cinzel',serif] text-base sm:text-lg font-bold text-[var(--color-primary)]">
                    Cookie Preferences Center
                  </h2>
                  <p className="text-[11px] font-['Marcellus'] text-[var(--color-secondary)]">
                    Control how Vastu Ritam stores preferences on your browser
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-2 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-pink-tint)] transition-colors cursor-pointer"
                aria-label="Close Cookie Preferences"
              >
                <X className="w-4 h-4 text-[var(--color-primary)]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 font-['Marcellus']">
              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isLight ? 'text-[#5A4545]' : 'text-zinc-300'
                }`}
              >
                Choose which types of cookies you want to allow. Essential cookies are always enabled because they keep the website working smoothly and safely.
              </p>

              {/* Category 1: Strictly Necessary */}
              <div
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-white border-[var(--color-border)]' : 'bg-[#221417] border-[#44262E]'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1.5">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[var(--color-secondary)]" />
                    <h4 className="font-['Cinzel',serif] text-sm font-bold">
                      1. Essential & Security Cookies
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--color-secondary)]/15 text-[var(--color-secondary)]">
                    Always Active
                  </span>
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    isLight ? 'text-[#5A4545]' : 'text-zinc-400'
                  }`}
                >
                  Required for page navigation, security protection, handbook access verification, and saving your cookie consent choice.
                </p>
              </div>

              {/* Category 2: Functional & Ambience */}
              <div
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-white border-[var(--color-border)]' : 'bg-[#221417] border-[#44262E]'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1.5">
                  <h4 className="font-['Cinzel',serif] text-sm font-bold">
                    2. Reading & Ambience Preferences
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs.functional}
                      onChange={(e) =>
                        setPrefs((p) => ({ ...p, functional: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-secondary)]" />
                  </label>
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    isLight ? 'text-[#5A4545]' : 'text-zinc-400'
                  }`}
                >
                  Remembers your Light/Dark mode choice, floating lotus petals animation setting, and your last visited Gyan-Kosh tab.
                </p>
              </div>

              {/* Category 3: Analytics & Popular Articles */}
              <div
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-white border-[var(--color-border)]' : 'bg-[#221417] border-[#44262E]'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1.5">
                  <h4 className="font-['Cinzel',serif] text-sm font-bold">
                    3. Article & Glossary Reading Insights
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs.analytics}
                      onChange={(e) =>
                        setPrefs((p) => ({ ...p, analytics: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-secondary)]" />
                  </label>
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    isLight ? 'text-[#5A4545]' : 'text-zinc-400'
                  }`}
                >
                  Helps us understand which Vastu Shabd Kosh terms and Prakaran articles are most helpful so we can write better beginner-friendly guides.
                </p>
              </div>

              {/* Category 4: Sponsored & Educational Banners */}
              <div
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-white border-[var(--color-border)]' : 'bg-[#221417] border-[#44262E]'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1.5">
                  <h4 className="font-['Cinzel',serif] text-sm font-bold">
                    4. Sponsored & Partner Display
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs.sponsored}
                      onChange={(e) =>
                        setPrefs((p) => ({ ...p, sponsored: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-secondary)]" />
                  </label>
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    isLight ? 'text-[#5A4545]' : 'text-zinc-400'
                  }`}
                >
                  Used to display relevant Vastu books, architectural consultation offers, and educational banners without repeating the same notice.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className={`px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3 ${
                isLight ? 'bg-white border-[var(--color-border)]' : 'bg-[#140E10] border-[#44262E]'
              }`}
            >
              <button
                type="button"
                onClick={handleEssentialOnly}
                className={`px-4 py-2 rounded-xl border text-xs font-['Marcellus'] font-bold cursor-pointer ${
                  isLight
                    ? 'bg-[#FAF3EB] border-[var(--color-border)] text-[#5A4545] hover:text-[#2A1515]'
                    : 'bg-[#221417] border-[#44262E] text-zinc-300'
                }`}
              >
                Essential Only
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="px-4 py-2 rounded-xl border border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white font-['Marcellus'] font-bold text-xs transition-all cursor-pointer"
                >
                  {savedNotice ? 'Preferences Saved ✓' : 'Save My Preferences'}
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-5 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-['Marcellus'] font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept All</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
