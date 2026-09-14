import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, Country, UserStats } from './types';
import { COUNTRIES, COUNTRIES_BY_ID, getRandomCountries } from './data/countries';
import { loadUserStats, recordAnswer, saveUserStats, getLevelInfo } from './utils/storage';
import { sound } from './utils/audio';
import { Navbar } from './components/Navbar';
import { MapQuiz } from './components/MapQuiz';
import { QuizCard } from './components/QuizCard';
import { AtlasView } from './components/AtlasView';
import { PassportView } from './components/PassportView';
import { FunFactModal } from './components/FunFactModal';
import { BackupModal } from './components/BackupModal';
import { Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [mode, setMode] = useState<GameMode>('map');
  const [backupOpen, setBackupOpen] = useState<boolean>(false);

  // Active quiz state
  const [targetCountry, setTargetCountry] = useState<Country>(() => {
    // Initial priority to Palestine or Taiwan so they appear early in the experience
    return COUNTRIES_BY_ID['275'] || COUNTRIES[0];
  });
  const [options, setOptions] = useState<Country[]>([]);

  // Modal celebration state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalEarnedXp, setModalEarnedXp] = useState<number>(15);
  const [modalLeveledUp, setModalLeveledUp] = useState<boolean>(false);
  const [modalNewLevelTitle, setModalNewLevelTitle] = useState<string>('');
  const [modalIsFirstDiscovery, setModalIsFirstDiscovery] = useState<boolean>(false);

  // Generate question for flags and capitals
  const generateQuestion = useCallback((excludeCountryId?: string) => {
    // Pick target: 60% chance to pick an unvisited country, or completely random
    const unvisited = COUNTRIES.filter((c) => !stats.stamps[c.id]);
    let target: Country;
    if (unvisited.length > 0 && Math.random() < 0.6) {
      target = unvisited[Math.floor(Math.random() * unvisited.length)];
    } else {
      target = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    }

    if (excludeCountryId && target.id === excludeCountryId) {
      const remaining = COUNTRIES.filter((c) => c.id !== excludeCountryId);
      target = remaining[Math.floor(Math.random() * remaining.length)];
    }

    // Pick 3 decoys
    const decoys = getRandomCountries(3, target.id);
    const allFour = [target, ...decoys].sort(() => 0.5 - Math.random());

    setTargetCountry(target);
    setOptions(allFour);
  }, [stats.stamps]);

  // Generate question on mode change or first mount
  useEffect(() => {
    generateQuestion();
  }, [mode, generateQuestion]);

  // Handle correct response from any mode
  const handleSuccess = (country: Country, bonusXp = 0) => {
    const result = recordAnswer(stats, true, country.id, bonusXp);
    setStats(result.newStats);

    const levelInfo = getLevelInfo(result.newStats.xp);
    setModalEarnedXp(15 + bonusXp);
    setModalLeveledUp(result.leveledUp);
    setModalNewLevelTitle(levelInfo.title);
    setModalIsFirstDiscovery(result.newStamp);
    setModalOpen(true);
  };

  // Multiple-choice answer handler
  const handleMultipleChoiceAnswer = (selected: Country) => {
    if (selected.id === targetCountry.id) {
      handleSuccess(targetCountry);
    } else {
      const result = recordAnswer(stats, false, targetCountry.id);
      setStats(result.newStats);
    }
  };

  // Map click guess handler
  const handleMapGuessed = (guessedCountry: Country) => {
    handleSuccess(guessedCountry, 10); // Bonus +10 XP for finding directly on map!
  };

  // Modal next action
  const handleModalNext = () => {
    setModalOpen(false);
    generateQuestion(targetCountry.id);
  };

  // Sound toggle handler
  const handleToggleSound = () => {
    const newSound = !stats.soundEnabled;
    const updated = { ...stats, soundEnabled: newSound };
    sound.setEnabled(newSound);
    if (newSound) sound.playClick();
    setStats(updated);
    saveUserStats(updated);
  };

  const visitedCountryIds = Object.keys(stats.stamps);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sticky Navigation (Desktop Top Bar + Mobile Top Header & Mobile Bottom Bar) */}
      <Navbar
        currentMode={mode}
        onSelectMode={setMode}
        stats={stats}
        onToggleSound={handleToggleSound}
        onOpenBackup={() => setBackupOpen(true)}
      />

      {/* Main Content Area - padded for mobile bottom nav */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 pt-3 sm:pt-6 pb-24 md:pb-8 flex flex-col">
        {mode === 'map' && (
          <MapQuiz
            targetCountry={targetCountry}
            onCountryGuessed={handleMapGuessed}
            visitedCountryIds={visitedCountryIds}
          />
        )}

        {mode === 'flags' && (
          <QuizCard
            type="flags"
            targetCountry={targetCountry}
            options={options}
            onAnswer={handleMultipleChoiceAnswer}
            streak={stats.currentStreak}
          />
        )}

        {mode === 'capitals' && (
          <QuizCard
            type="capitals"
            targetCountry={targetCountry}
            options={options}
            onAnswer={handleMultipleChoiceAnswer}
            streak={stats.currentStreak}
          />
        )}

        {mode === 'atlas' && (
          <AtlasView visitedCountryIds={visitedCountryIds} />
        )}

        {mode === 'passport' && (
          <PassportView
            stats={stats}
            onSelectCountryForAtlas={(c) => {
              setTargetCountry(c);
              setMode('atlas');
            }}
            onOpenBackup={() => setBackupOpen(true)}
          />
        )}
      </main>

      {/* Fun Fact Modal Popup */}
      <FunFactModal
        isOpen={modalOpen}
        country={targetCountry}
        onNext={handleModalNext}
        earnedXp={modalEarnedXp}
        currentStreak={stats.currentStreak}
        leveledUp={modalLeveledUp}
        newLevelTitle={modalNewLevelTitle}
        isFirstDiscovery={modalIsFirstDiscovery}
      />

      {/* Backup & Transfer Modal */}
      <BackupModal
        isOpen={backupOpen}
        onClose={() => setBackupOpen(false)}
        stats={stats}
        onStatsUpdated={(newStats) => {
          setStats(newStats);
          saveUserStats(newStats);
        }}
      />

      {/* Footer (hidden on mobile or spaced above bottom bar) */}
      <footer className="w-full border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500 mb-16 md:mb-0">
        <div className="flex items-center justify-center gap-1 mb-1">
          <span>Créé avec</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>pour explorer les merveilles de notre Terre</span>
        </div>
        <p>
          Reconnaît pleinement la Palestine 🇵🇸 et Taïwan 🇹🇼 comme des nations souveraines et indépendantes.
        </p>
      </footer>
    </div>
  );
};

export default App;
