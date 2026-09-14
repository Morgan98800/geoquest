import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameMode, Country, UserStats, Continent } from './types';
import { COUNTRIES, COUNTRIES_BY_ID } from './data/countries';
import { DifficultyLevel } from './data/difficulty';
import {
  getProgressivePool,
  pickWeightedCountry,
  computeDynamicNoiseLevel,
  generateSmartDistractors,
  ANCHOR_COUNTRY_IDS,
} from './data/progressivePool';
import {
  loadUserStats,
  recordAnswer,
  saveUserStats,
  getLevelInfo,
  getActiveUsername,
  setActiveUsername,
  checkDailyStatus,
} from './utils/storage';
import { hapticSuccess, hapticError, hapticLevelUp } from './utils/haptics';
import { sound } from './utils/audio';
import { LogOut } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { MapQuiz } from './components/MapQuiz';
import { QuizCard } from './components/QuizCard';
import { AtlasView } from './components/AtlasView';
import { StatsView } from './components/StatsView';
import { DailyRewardModal } from './components/DailyRewardModal';
import { FunFactModal } from './components/FunFactModal';
import { BackupModal } from './components/BackupModal';
import { AccountModal } from './components/AccountModal';

export const App: React.FC = () => {
  const [currentUsername, setCurrentUsername] = useState<string>(() => getActiveUsername());
  const [stats, setStats] = useState<UserStats>(() => loadUserStats());
  const [mode, setMode] = useState<GameMode>('home');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(1);
  const [selectedContinent, setSelectedContinent] = useState<Continent | 'all'>('all');
  const [backupOpen, setBackupOpen] = useState<boolean>(false);
  const [accountOpen, setAccountOpen] = useState<boolean>(false);
  const [dailyRewardOpen, setDailyRewardOpen] = useState<boolean>(false);
  const [exitModalOpen, setExitModalOpen] = useState<boolean>(false);
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
    return COUNTRIES_BY_ID[ANCHOR_COUNTRY_IDS[0]] || COUNTRIES[0];
  });
  const [options, setOptions] = useState<Country[]>([]);
  const [consecutiveErrors, setConsecutiveErrors] = useState<number>(0);
  const recentPicksRef = useRef<string[]>([]);

  // Modal celebration state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalCountry, setModalCountry] = useState<Country | null>(null);
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

  // Generate question using Progressive Pool (P0) & Smart Distractors (P1) with DDA
  const generateQuestion = useCallback(
    (excludeCountryId?: string) => {
      // 1. Get progressive pool (10 ancres -> 30 consolidés -> 174 mondiaux pondérés)
      const { pool } = getProgressivePool(stats, COUNTRIES, selectedDifficulty, selectedContinent);
      const validPool = pool.length > 0 ? pool : COUNTRIES;

      // 2. Pick target country using weighted roulette wheel with freshness boost
      const target = pickWeightedCountry(validPool, stats, excludeCountryId, recentPicksRef.current);

      // 3. Track recent picks to avoid immediate repeats
      recentPicksRef.current = [...recentPicksRef.current.slice(-5), target.id];

      // 4. Compute dynamic noise level (DDA based on XP + streak & errors)
      const noiseLevel = computeDynamicNoiseLevel(stats.xp, stats.currentStreak, consecutiveErrors);

      // 5. Generate 3 smart distractors according to noise level
      const distractors = generateSmartDistractors(target, COUNTRIES, noiseLevel);
      const allFour = [target, ...distractors].sort(() => 0.5 - Math.random());

      setTargetCountry(target);
      setOptions(allFour);
      setQuestionStartTime(Date.now());
    },
    [stats, selectedDifficulty, selectedContinent, consecutiveErrors]
  );

  // Initial and level/region change question setup
  useEffect(() => {
    generateQuestion();
  }, [selectedDifficulty, selectedContinent]);

  // Handle multiple choice answer (StudyGe fast quiz flow without modal desynchronization)
  const handleMultipleChoiceAnswer = (selected: Country) => {
    const currentTarget = targetCountry;
    const elapsedMs = Date.now() - questionStartTime;
    const isCorrect = selected.id === currentTarget.id;

    if (isCorrect) {
      setConsecutiveErrors(0);
      const isFirstTime = !stats.stamps[currentTarget.id];
      const { newStats, leveledUp } = recordAnswer(
        stats,
        true,
        currentTarget.id,
        0,
        elapsedMs,
        currentTarget.continent
      );
      setStats(newStats);
      saveUserStats(newStats, currentUsername);

      if (leveledUp) {
        hapticLevelUp();
        const newLevelInfo = getLevelInfo(newStats.xp);
        setModalCountry(currentTarget);
        setModalEarnedXp(15);
        setModalLeveledUp(true);
        setModalNewLevelTitle(newLevelInfo.title);
        setModalIsFirstDiscovery(isFirstTime);
        setModalOpen(true);
      } else {
        hapticSuccess();
        generateQuestion(currentTarget.id);
      }
    } else {
      setConsecutiveErrors((prev) => prev + 1);
      hapticError();
      const { newStats } = recordAnswer(
        stats,
        false,
        currentTarget.id,
        0,
        elapsedMs,
        currentTarget.continent
      );
      setStats(newStats);
      saveUserStats(newStats, currentUsername);
      generateQuestion(currentTarget.id);
    }
  };

  // Map click guess handler (correct answer)
  const handleMapGuessed = (_guessedCountry: Country) => {
    setConsecutiveErrors(0);
    const currentTarget = targetCountry;
    const elapsedMs = Date.now() - questionStartTime;
    const isFirstTime = !stats.stamps[currentTarget.id];
    const { newStats, leveledUp } = recordAnswer(
      stats,
      true,
      currentTarget.id,
      10,
      elapsedMs,
      currentTarget.continent
    );
    setStats(newStats);
    saveUserStats(newStats, currentUsername);

    if (leveledUp) {
      hapticLevelUp();
      const newLevelInfo = getLevelInfo(newStats.xp);
      setModalCountry(currentTarget);
      setModalEarnedXp(25);
      setModalLeveledUp(true);
      setModalNewLevelTitle(newLevelInfo.title);
      setModalIsFirstDiscovery(isFirstTime);
      setModalOpen(true);
    } else {
      hapticSuccess();
      generateQuestion(currentTarget.id);
    }
  };

  // Map click wrong handler (DDA error recording)
  const handleMapWrong = (_clickedCountry: Country) => {
    setConsecutiveErrors((prev) => prev + 1);
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
  };

  // Handle game exit request
  const handleRequestExit = () => {
    sound.playClick();
    setExitModalOpen(true);
  };

  const handleConfirmExit = () => {
    sound.playClick();
    setExitModalOpen(false);
    setMode('home');
  };

  const handleCancelExit = () => {
    sound.playClick();
    setExitModalOpen(false);
  };

  // Modal next action
  const handleModalNext = () => {
    setModalOpen(false);
    generateQuestion(modalCountry?.id || targetCountry.id);
  };

  const visitedCountryIds = Object.keys(stats.stamps);
  const dailyStatus = checkDailyStatus(stats);

  const countryMastery: Record<string, number> = {};
  for (const [id, stamp] of Object.entries(stats.stamps || {})) {
    countryMastery[id] = stamp.timesDiscovered || 1;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e17] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation Bar - Hidden in landscape map mode so map is 100% full screen */}
      <Navbar
        currentMode={mode}
        onSelectMode={setMode}
        stats={stats}
        currentUsername={currentUsername}
        onOpenAccount={() => setAccountOpen(true)}
        onOpenDailyReward={() => setDailyRewardOpen(true)}
        onExit={handleRequestExit}
        hasDailyReward={dailyStatus.canClaim}
        className={isLandscape && mode === 'map' ? 'hidden' : ''}
      />

      {/* Main Content Area */}
      <main className={`flex-1 w-full mx-auto flex flex-col ${
        isLandscape && mode === 'map' ? 'p-0 max-w-none' : 'max-w-6xl px-3 sm:px-6 py-2.5 sm:py-5'
      }`}>
        {mode === 'home' && (
          <HomeView
            stats={stats}
            currentUsername={currentUsername}
            onSelectMode={setMode}
            onOpenDailyReward={() => setDailyRewardOpen(true)}
            hasDailyReward={dailyStatus.canClaim}
          />
        )}

        {mode === 'map' && (
          <MapQuiz
            targetCountry={targetCountry}
            onCountryGuessed={handleMapGuessed}
            onCountryWrong={handleMapWrong}
            onExit={handleRequestExit}
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
            onExit={handleRequestExit}
            streak={stats.currentStreak}
          />
        )}

        {mode === 'capitals' && (
          <QuizCard
            type="capitals"
            targetCountry={targetCountry}
            options={options}
            onAnswer={handleMultipleChoiceAnswer}
            onExit={handleRequestExit}
            streak={stats.currentStreak}
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
      </main>

      {/* Fun Fact Modal Popup */}
      <FunFactModal
        isOpen={modalOpen}
        country={modalCountry || targetCountry}
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

      {/* Exit Game Confirmation Modal */}
      {exitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
          <div className="w-full max-w-sm bg-[#121927] border border-[#1f2c42] rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center gap-4 animate-pop">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-white">Quitter la partie ?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ta série de <span className="text-amber-400 font-extrabold">{stats.currentStreak} 🔥</span> et toute ton XP acquise sont bien sauvegardées.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-2">
              <button
                onClick={handleCancelExit}
                className="flex-1 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm transition-all active:scale-95 cursor-pointer shadow-lg shadow-sky-500/25"
              >
                Continuer
              </button>

              <button
                onClick={handleConfirmExit}
                className="flex-1 py-3 px-4 rounded-xl bg-[#1a2436] hover:bg-rose-950/50 hover:text-rose-200 border border-[#2c3f58] hover:border-rose-500/40 text-slate-300 font-bold text-sm transition-all active:scale-95 cursor-pointer"
              >
                Quitter au menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
