import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, Country, UserStats } from './types';
import { COUNTRIES, COUNTRIES_BY_ID, getRandomCountries } from './data/countries';
import {
  loadUserStats,
  recordAnswer,
  saveUserStats,
  getLevelInfo,
  getActiveUsername,
  setActiveUsername,
} from './utils/storage';
import { sound } from './utils/audio';
import { Navbar } from './components/Navbar';
import { MapQuiz } from './components/MapQuiz';
import { QuizCard } from './components/QuizCard';
import { AtlasView } from './components/AtlasView';
import { PassportView } from './components/PassportView';
import { FunFactModal } from './components/FunFactModal';
import { BackupModal } from './components/BackupModal';
import { AccountModal } from './components/AccountModal';

export const App: React.FC = () => {
  const [currentUsername, setCurrentUsername] = useState<string>(() => getActiveUsername());
  const [stats, setStats] = useState<UserStats>(() => loadUserStats());
  const [mode, setMode] = useState<GameMode>('map');
  const [backupOpen, setBackupOpen] = useState<boolean>(false);
  const [accountOpen, setAccountOpen] = useState<boolean>(false);

  // Landscape orientation detection (StudyGe full horizontal layout)
  const [isLandscape, setIsLandscape] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth > window.innerHeight && window.innerHeight < 650;
  });

  useEffect(() => {
    const handleOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight && window.innerHeight < 650);
    };
    window.addEventListener('resize', handleOrientation);
    window.addEventListener('orientationchange', handleOrientation);
    return () => {
      window.removeEventListener('resize', handleOrientation);
      window.removeEventListener('orientationchange', handleOrientation);
    };
  }, []);

  // Active quiz state
  const [targetCountry, setTargetCountry] = useState<Country>(() => {
    return COUNTRIES_BY_ID['275'] || COUNTRIES[0];
  });
  const [options, setOptions] = useState<Country[]>([]);

  // Modal celebration state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalEarnedXp, setModalEarnedXp] = useState<number>(15);
  const [modalLeveledUp, setModalLeveledUp] = useState<boolean>(false);
  const [modalNewLevelTitle, setModalNewLevelTitle] = useState<string>('');
  const [modalIsFirstDiscovery, setModalIsFirstDiscovery] = useState<boolean>(false);

  // Switch profile handler
  const handleSwitchUser = (newUsername: string, newStats: UserStats) => {
    setCurrentUsername(newUsername);
    setActiveUsername(newUsername);
    setStats(newStats);
  };

  // Generate question for flags and capitals
  const generateQuestion = useCallback((excludeCountryId?: string) => {
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

  // Initial question setup
  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  // Handle correct answer
  const handleSuccess = (country: Country, bonusXp = 0) => {
    const isFirstTime = !stats.stamps[country.id];
    const { newStats, leveledUp } = recordAnswer(stats, true, country.id, bonusXp);
    setStats(newStats);
    saveUserStats(newStats, currentUsername);

    const newLevelInfo = getLevelInfo(newStats.xp);

    setModalEarnedXp(15 + bonusXp);
    setModalLeveledUp(leveledUp);
    setModalNewLevelTitle(newLevelInfo.title);
    setModalIsFirstDiscovery(isFirstTime);
    setModalOpen(true);
  };

  // Handle multiple choice answer
  const handleMultipleChoiceAnswer = (selected: Country) => {
    if (selected.id === targetCountry.id) {
      handleSuccess(selected);
    } else {
      sound.playWrong();
      const { newStats } = recordAnswer(stats, false, targetCountry.id, 0);
      setStats(newStats);
      saveUserStats(newStats, currentUsername);
    }
  };

  // Map click guess handler
  const handleMapGuessed = (guessedCountry: Country) => {
    handleSuccess(guessedCountry, 10);
  };

  // Modal next action
  const handleModalNext = () => {
    setModalOpen(false);
    generateQuestion(targetCountry.id);
  };

  const visitedCountryIds = Object.keys(stats.stamps);

  return (
    <div className="min-h-screen flex flex-col bg-[#16202c] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation Bar - Hidden in landscape map mode so map is 100% full screen */}
      <Navbar
        currentMode={mode}
        onSelectMode={setMode}
        stats={stats}
        currentUsername={currentUsername}
        onOpenAccount={() => setAccountOpen(true)}
        className={isLandscape && mode === 'map' ? 'hidden' : ''}
      />

      {/* Main Content Area */}
      <main className={`flex-1 w-full mx-auto flex flex-col ${
        isLandscape && mode === 'map' ? 'p-0 max-w-none' : 'max-w-6xl px-3 sm:px-6 py-2.5 sm:py-5'
      }`}>
        {mode === 'map' && (
          <MapQuiz
            targetCountry={targetCountry}
            onCountryGuessed={handleMapGuessed}
            visitedCountryIds={visitedCountryIds}
            isLandscape={isLandscape}
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

      {/* Account Login / Switcher Modal */}
      <AccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        currentUsername={currentUsername}
        onSwitchUser={handleSwitchUser}
      />

      {/* Backup & Transfer Modal */}
      <BackupModal
        isOpen={backupOpen}
        onClose={() => setBackupOpen(false)}
        stats={stats}
        onStatsUpdated={(newStats) => {
          setStats(newStats);
          saveUserStats(newStats, currentUsername);
        }}
      />
    </div>
  );
};

export default App;
