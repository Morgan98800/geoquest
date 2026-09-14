import React from 'react';
import { X, Share, PlusSquare, CheckCircle, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl text-white">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-2xl shrink-0 shadow-inner">
            🌍
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-400 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-sky-400" />
              Expérience Plein Écran
            </div>
            <h3 className="text-lg font-black text-white">
              Installer l'application
            </h3>
          </div>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm mb-5 leading-relaxed">
          Ajoute GeoQuest directement sur l'écran d'accueil de ton téléphone pour y jouer comme une vraie application, <strong>sans la barre d'onglets Safari / Chrome</strong> !
        </p>

        {/* Steps for iOS / Android */}
        <div className="space-y-3 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 mb-5">
          {isIOS ? (
            <>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-sky-600/30 text-sky-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-xs sm:text-sm text-slate-200">
                  Dans Safari, clique sur le bouton <strong>Partager</strong> <Share className="w-4 h-4 inline-block text-sky-400 mx-1 -mt-0.5" /> (en bas de l'écran).
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-sky-600/30 text-sky-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs sm:text-sm text-slate-200">
                  Fais défiler la liste vers le bas et appuie sur <strong className="text-amber-300">« Sur l'écran d'accueil »</strong> <PlusSquare className="w-4 h-4 inline-block text-amber-300 mx-1 -mt-0.5" />.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-600/30 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div className="text-xs sm:text-sm text-slate-200">
                  Clique sur <strong>Ajouter</strong> en haut à droite. C'est prêt !
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-sky-600/30 text-sky-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-xs sm:text-sm text-slate-200">
                  Dans Chrome, appuie sur le menu <strong>⋮</strong> (les 3 petits points en haut à droite).
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-sky-600/30 text-sky-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs sm:text-sm text-slate-200">
                  Sélectionne <strong className="text-amber-300">« Installer l'application »</strong> ou <strong className="text-amber-300">« Ajouter à l'écran d'accueil »</strong>.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-600/30 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div className="text-xs sm:text-sm text-slate-200">
                  Confirme l'installation pour ouvrir le jeu en plein écran.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Benefits list */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 mb-5">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Zéro barre d'onglets</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Chargement instantané</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Icône dédiée sur l'accueil</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Mode horizontal plein écran</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-black text-sm transition-all active:scale-98 cursor-pointer shadow-lg shadow-sky-900/40"
        >
          J'ai compris !
        </button>
      </div>
    </div>
  );
};
