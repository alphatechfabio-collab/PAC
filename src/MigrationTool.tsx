import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc, initializeFirestore } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { db as newDb } from './firebase';
import { Database, ArrowRight, CheckCircle2, AlertCircle, Loader2, LogIn } from 'lucide-react';

const oldConfig = {
  apiKey: "AIzaSyAtyKRju3oVtpE9UVmmzmhySMqkBPRErhI",
  authDomain: "gen-lang-client-0062684595.firebaseapp.com",
  projectId: "gen-lang-client-0062684595",
  storageBucket: "gen-lang-client-0062684595.firebasestorage.app",
  messagingSenderId: "318133290272",
  appId: "1:318133290272:web:45d49294eeab5872b80345"
};

// Initialize old app
const oldApp = initializeApp(oldConfig, "oldApp");
const oldDb = initializeFirestore(oldApp, {
  experimentalForceLongPolling: true,
}, "ai-studio-f624f048-ea6f-443d-a76b-866e71454233");
const oldAuth = getAuth(oldApp);

export function MigrationTool() {
  const [status, setStatus] = useState<string>('');
  const [migrating, setMigrating] = useState(false);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [isDone, setIsDone] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(oldAuth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const loginToOldApp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(oldAuth, provider);
    } catch (e: any) {
      setStatus('Erro ao fazer login no banco antigo: ' + e.message);
    }
  };

  const collectionsToMigrate = [
    'academies', 
    'athletes', 
    'documents', 
    'graduation_config', 
    'media', 
    'notifications', 
    'plans', 
    'posts', 
    'professors', 
    'techniques'
  ];

  const migrate = async () => {
    setMigrating(true);
    setIsDone(false);
    setStatus('Iniciando migração...');
    
    try {
      for (const collName of collectionsToMigrate) {
        setStatus(`Lendo coleção: ${collName}...`);
        const oldCollRef = collection(oldDb, collName);
        const snapshot = await getDocs(oldCollRef);
        
        let count = 0;
        const total = snapshot.docs.length;
        
        if (total === 0) {
          setProgress(prev => ({ ...prev, [collName]: 100 }));
          continue;
        }

        setStatus(`Copiando ${total} documentos de ${collName}...`);
        
        for (const document of snapshot.docs) {
          const newDocRef = doc(newDb, collName, document.id);
          await setDoc(newDocRef, document.data());
          count++;
          setProgress(prev => ({ ...prev, [collName]: Math.round((count / total) * 100) }));
        }
      }
      setStatus('Migração concluída com sucesso!');
      setIsDone(true);
    } catch (e: any) {
      console.error(e);
      setStatus('Erro durante a migração: ' + e.message);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-emerald-500/30 rounded-xl p-6 mb-8 shadow-lg shadow-emerald-500/5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
          <Database size={24} />
        </div>
        <div>
          <h3 className="font-bold text-xl text-white">Ferramenta de Migração de Dados</h3>
          <p className="text-zinc-400 text-sm">Copiando dados do "Default Gemini Project" para "pac-atleta"</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
          <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Origem</p>
          <p className="text-zinc-300 font-mono text-sm">gen-lang-client-0062684595</p>
        </div>
        <div className="flex items-center justify-center">
          <ArrowRight className="text-zinc-600" />
        </div>
        <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-500/20">
          <p className="text-xs text-emerald-500/70 uppercase font-bold tracking-wider mb-1">Destino</p>
          <p className="text-emerald-400 font-mono text-sm">pac-atleta</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {collectionsToMigrate.map(coll => (
          <div key={coll} className="flex items-center justify-between text-sm">
            <span className="text-zinc-400 font-mono">{coll}</span>
            <div className="flex items-center gap-3 flex-1 ml-4">
              <div className="h-2 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300" 
                  style={{ width: `${progress[coll] || 0}%` }}
                />
              </div>
              <span className="text-zinc-500 w-12 text-right">{progress[coll] || 0}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          {migrating && <Loader2 className="animate-spin text-emerald-500" size={18} />}
          {isDone && <CheckCircle2 className="text-emerald-500" size={18} />}
          {!migrating && !isDone && status && <AlertCircle className="text-red-400" size={18} />}
          <span className={`text-sm ${isDone ? 'text-emerald-400' : migrating ? 'text-emerald-500' : 'text-zinc-400'}`}>
            {status || 'Pronto para iniciar'}
          </span>
        </div>
        
        <button 
          onClick={isAuthenticated ? migrate : loginToOldApp} 
          disabled={migrating || isDone} 
          className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
        >
          {!isAuthenticated ? (
            <>
              <LogIn size={18} />
              Autenticar no Banco Antigo
            </>
          ) : migrating ? (
            'Copiando Dados...'
          ) : isDone ? (
            'Migração Finalizada'
          ) : (
            'Iniciar Migração'
          )}
        </button>
      </div>
    </div>
  );
}
