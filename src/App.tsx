import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, Country, UserStats, Continent } from './types';
import { COUNTRIES, COUNTRIES_BY_ID, getRandomCountries } from './data/countries';
import { DifficultyLevel, getFilteredCountries } from './data/difficulty';
import {
  loadUserStats,
  recordAnswer,
  saveUserStats,
  getLevelInfo,
  getActiveUsername,
  setActiveUsername,
  checkDailyStatus,
} from './utils/storage';
import { sound } from './utils/audio';
import { hapticSuccess, hapticError, hapticLevelUp } from './utils/haptics';
import { Navbar } from './components/Navbar';
import { MapQuiz } from './components/MapQuiz';
import { QuizCard } from './components/QuizCard';
import { AtlasView } from './components/AtlasView';
import { PassportView } from './components/PassportView';
import { StatsView } from './components/StatsView';
import { SrsReviewView } from './components/SrsReviewView';
import { DailyRewardModal } from './components/DailyRewardModal';
import { FunFactModal } from './components/FunFactModal';
import { BackupModal } from './components/BackupModal';
import { AccountModal } from './components/AccountModal';

export const App: React.FC = () => {
  const [currentUsername, setCurrentUsername] = useState<string>(() => getActiveUsername());
  const [stats, setStats] = useState<UserStats>(() => loadUserStats());
  const [mode, setMode] = useState<GameMode>('map');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(1);
  const [selectedContinent, setSelectedContinent] = useState<Continent | 'all'>('all');
  const [backupOpen, setBackupOpen] = useState<boolean>(false);
  const [accountOpen, setAccountOpen] = useState<boolean>(false);
  const [dailyRewardOpen, setDailyRewardOpen] = useState<boolean>(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(() => Date.now());

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

  // Auto open daily reward if available on mount
  useEffect(() => {
    const status = checkDailyStatus(stats);
    if (status.canClaim) {
      const t = setTimeout(() => {
        setDailyRewardOpen(true);
      }, 600);
      return () => clearTimeout(t);
    }
  }, []);

  // Switch profile handler
  const handleSwitchUser = (newUsername: string, newStats: UserStats) => {
    setCurrentUsername(newUsername);
    setActiveUsername(newUsername);
    setStats(newStats);
    const status = checkDailyStatus(newStats);
    if (status.canClaim) {
      setDailyRewardOpen(true);
    }
  };

  // Generate question for flags and capitals respecting StudyGe levels & region
  const generateQuestion = useCallback((excludeCountryId?: string) => {
    const pool = getFilteredCountries(COUNTRIES, selectedDifficulty, selectedContinent);
    const validPool = pool.length > 0 ? pool : COUNTRIES;

    const unvisited = validPool.filter((c) => !stats.stamps[c.id]);
    let target: Country;
    if (unvisited.length > 0 && Math.random() < 0.65) {
      target = unvisited[Math.floor(Math.random() * unvisited.length)];
    } else {
      target = validPool[Math.floor(Math.random() * validPool.length)];
    }

    if (excludeCountryId && target.id === excludeCountryId && validPool.length > 1) {
      const remaining = validPool.filter((c) => c.id !== excludeCountryId);
      target = remaining[Math.floor(Math.random() * remaining.length)];
    }

    // Pick 3 decoys
    const decoys = getRandomCountries(3, target.id);
    const allFour = [target, ...decoys].sort(() => 0.5 - Math.random());

    setTargetCountry(target);
    setOptions(allFour);
    setQuestionStartTime(Date.now());
  }, [stats.stamps, selectedDifficulty, selectedContinent]);

  // Initial and level/region change question setup
  useEffect(() => {
    generateQuestion();
  }, [selectedDifficulty, selectedContinent]);

  // Handle correct answer
  const handleSuccess = (country: Country, bonusXp = 0) => {
    const isFirstTime = !stats.stamps[country.id];
    const elapsedMs = Date.now() - questionStartTime;
    const { newStats, leveledUp } = recordAnswer(
      stats,
      true,
      country.id,
      bonusXp,
      elapsedMs,
      country.continent
    );
    setStats(newStats);
    saveUserStats(newStats, currentUsername);

    if (leveledUp) {
      hapticLevelUp();
    } else {
      hapticSuccess();
    }

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
      hapticError();
      const elapsedMs = Date.now() - questionStartTime;
      const { newStats } = recordAnswer(
        stats,
        false,
        targetCountry.id,
        0,
        elapsedMs,
        targetCountry.continent
      );
      setStats(newStats);
      saveUserStats(newStats, currentUsername);
    }
  };

  // Map click guess handler
  const handleMapGuessed = (guessedCountry: Country) => {
    handleSuccess(guessedCountry, 10);
  };

  // SRS answer handler
  const handleSrsAnswer = (
    country: Country,
    isCorrect: boolean,
    responseTimeMs: number
  ) => {
    const { newStats, leveledUp } = recordAnswer(
      stats,
      isCorrect,
      country.id,
      0,
      responseTimeMs,
      country.continent
    );
    setStats(newStats);
    saveUserStats(newStats, currentUsername);
    return { leveledUp };
  };

  // Modal next action
  const handleModalNext = () => {
    setModalOpen(false);
    generateQuestion(targetCountry.id);
  };

  const visitedCountryIds = Object.keys(stats.stamps);
  const dailyStatus = checkDailyStatus(stats);

  const countryMastery: Record<string, number> = {};
  for (const [id, stamp] of Object.entries(stats.stamps || {})) {
    countryMastery[id] = stamp.timesDiscovered || 1;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#16202c] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation Bar - Hidden in landscape map mode so map is 100% full screen */}
      <Navbar
        currentMode={mode}
        onSelectMode={setMode}
        stats={stats}
        currentUsername={currentUsername}
        onOpenAccount={() => setAccountOpen(true)}
        onOpenDailyReward={() => setDailyRewardOpen(true)}
        hasDailyReward={dailyStatus.canClaim}
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
            countryMastery={countryMastery}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={setSelectedDifficulty}
            selectedContinent={selectedContinent}
            onSelectContinent={setSelectedContinent}
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

        {mode === 'srs' && (
          <SrsReviewView
            stats={stats}
            onRecordAnswer={handleSrsAnswer}
            onSwitchToMap={() => setMode('map')}
          />
        )}

        {mode === 'stats' && (
          <StatsView
            stats={stats}
            onPracticeCountry={(c) => {
              setTargetCountry(c);
              setMode('map');
            }}
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

      {/* Daily Login Retention Reward Modal (J1 -> J7) */}
      <DailyRewardModal
        isOpen={dailyRewardOpen}
        onClose={() => setDailyRewardOpen(false)}
        stats={stats}
        onStatsUpdated={(newStats) => {
          setStats(newStats);
          saveUserStats(newStats, currentUsername);
        }}
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
