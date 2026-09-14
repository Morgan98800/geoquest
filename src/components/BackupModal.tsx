import React, { useState } from 'react';
import { UserStats } from '../types';
import { exportStatsAsCode, importStatsFromCode, downloadBackupFile, DEFAULT_STATS } from '../utils/storage';
import { sound } from '../utils/audio';
import { Download, Upload, Copy, Check, Share2, ShieldCheck, X } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  onStatsUpdated: (newStats: UserStats) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  stats,
  onStatsUpdated,
}) => {
  const [importCode, setImportCode] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  if (!isOpen) return null;

  const code = exportStatsAsCode(stats);

  const handleCopyCode = async () => {
    sound.playClick();
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopyMagicLink = async () => {
    sound.playClick();
    try {
      const url = `${window.location.origin}${window.location.pathname}#backup=${code}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    sound.playStamp();
    downloadBackupFile(stats);
  };

  const handleImport = () => {
    sound.playClick();
    setErrorMessage('');
    setSuccessMessage('');

    if (!importCode.trim()) {
      setErrorMessage('Veuillez coller un code de sauvegarde valide.');
      return;
    }

    const imported = importStatsFromCode(importCode);
    if (imported) {
      sound.playLevelUp();
      onStatsUpdated(imported);
      setSuccessMessage('🎉 Progression restaurée avec succès !');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      sound.playWrong();
      setErrorMessage('Code de sauvegarde invalide ou corrompu.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const parsed = JSON.parse(json);
        if (typeof parsed.xp === 'number') {
          sound.playLevelUp();
          const merged = { ...DEFAULT_STATS, ...parsed };
          onStatsUpdated(merged);
          setSuccessMessage('🎉 Fichier restauré avec succès !');
          setTimeout(() => onClose(), 1500);
        } else {
          sound.playWrong();
          setErrorMessage('Format de fichier invalide.');
        }
      } catch {
        sound.playWrong();
        setErrorMessage('Impossible de lire ce fichier JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-sky-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl animate-pop text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Sauvegarde & Synchronisation</h3>
            <p className="text-xs text-slate-400">Ne perds jamais tes points, records et pays tamponnés !</p>
          </div>
        </div>

        {/* Status Notice */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 mb-5 flex items-start gap-2.5">
          <span className="text-base">✅</span>
          <div className="leading-relaxed">
            <strong>Sauvegarde locale active :</strong> Ta progression est enregistrée automatiquement sur cet appareil à chaque bonne réponse.
          </div>
        </div>

        {/* Success / Error alerts */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-200 text-xs font-bold text-center">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-200 text-xs font-bold text-center">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          {/* Option 1: Magic Link & Code Export */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/5 space-y-2.5">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" /> Transférer vers mon Téléphone ou un autre ordi
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={handleCopyMagicLink}
                className="py-2.5 px-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Lien copié !' : 'Lien magique'}</span>
              </button>

              <button
                onClick={handleCopyCode}
                className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                <span>{copiedCode ? 'Code copié !' : 'Copier code'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Télécharger</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Envoie-toi le lien par SMS, WhatsApp ou e-mail pour ouvrir ta partie sur n'importe quel autre écran !
            </p>
          </div>

          {/* Option 2: Restore / Import */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/5 space-y-2.5">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Restaurer une partie
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Colle ton code de sauvegarde ici..."
                value={importCode}
                onChange={(e) => setImportCode(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Restaurer
              </button>
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>Ou importe un fichier :</span>
              <label className="text-sky-400 hover:underline cursor-pointer font-semibold">
                Choisir le fichier
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
