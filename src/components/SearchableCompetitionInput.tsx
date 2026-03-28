import React, { useState, useEffect, useRef } from 'react';
import { collectionGroup, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Search, ChevronDown, Check, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from '@google/genai';

const MAJOR_COMPETITIONS = [
  "IBJJF World Championship (Mundial)",
  "ADCC World Championship",
  "IBJJF Pan American Championship",
  "IBJJF European Championship",
  "CBJJ Campeonato Brasileiro",
  "AJP Abu Dhabi World Pro",
  "CBJJE Mundial",
  "BJJ Stars",
  "Polaris Pro Grappling",
  "Who's Number One (WNO)",
  "Fight to Win (F2W)",
  "Grappling Industries",
  "NAGA",
  "SJJIF World Jiu-Jitsu Championship",
  "AJP Grand Slam",
  "IBJJF Asian Championship",
  "IBJJF South American Championship"
];

export const SearchableCompetitionInput = ({ 
  value, 
  onChange 
}: { 
  value: string, 
  onChange: (value: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [suggestions, setSuggestions] = useState<string[]>(MAJOR_COMPETITIONS);
  const [dbCompetitions, setDbCompetitions] = useState<string[]>([]);
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  useEffect(() => {
    const fetchDbCompetitions = async () => {
      try {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        
        const q = query(
          collectionGroup(db, 'competitions'),
          where('date', '>=', twelveMonthsAgo.toISOString()),
          orderBy('date', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const compNames = new Set<string>();
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.name) {
            compNames.add(data.name);
          }
        });
        
        setDbCompetitions(Array.from(compNames));
      } catch (error) {
        console.error("Error fetching competitions:", error);
      }
    };
    
    fetchDbCompetitions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchWithAI = async () => {
    if (!searchTerm) return;
    setIsSearchingAI(true);
    try {
      const apiKey = (window as any).ENV?.GEMINI_API_KEY || 
                     (import.meta as any).env?.VITE_GEMINI_API_KEY ||
                     (window as any).GEMINI_API_KEY;
      if (!apiKey || apiKey === 'undefined' || apiKey === 'null' || apiKey === '') {
        throw new Error("API Key não configurada.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Liste 5 campeonatos de Jiu-Jitsu (BJJ) ou Grappling recentes ou famosos que correspondam à busca: "${searchTerm}". Retorne apenas os nomes, um por linha, sem numeração ou marcadores.`,
      });
      
      const aiSuggestions = response.text?.split('\n').map(s => s.trim()).filter(s => s.length > 0) || [];
      if (aiSuggestions.length > 0) {
        const newSuggestions = Array.from(new Set([...aiSuggestions, ...suggestions]));
        setSuggestions(newSuggestions);
      }
    } catch (error) {
      console.error("Error searching with AI:", error);
    } finally {
      setIsSearchingAI(false);
    }
  };

  const allSuggestions = Array.from(new Set([...dbCompetitions, ...suggestions]));
  const filteredSuggestions = allSuggestions.filter(s => 
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative flex items-center">
        <input 
          type="text" 
          placeholder="Nome do Campeonato (ex: Mundial, ADCC)" 
          required 
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 pr-24" 
          value={searchTerm} 
          onChange={e => {
            setSearchTerm(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute right-2 flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              searchWithAI();
            }}
            disabled={isSearchingAI || !searchTerm}
            className="p-2 text-zinc-400 hover:text-emerald-400 disabled:opacity-50 disabled:hover:text-zinc-400 transition-colors"
            title="Busca Inteligente na Internet"
          >
            {isSearchingAI ? (
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Globe className="w-5 h-5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronDown className={cn("w-5 h-5 transition-transform", isOpen && "rotate-180")} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (filteredSuggestions.length > 0 || searchTerm) && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => {
                  setSearchTerm(suggestion);
                  onChange(suggestion);
                  setIsOpen(false);
                }}
                className={cn(
                  "px-4 py-3 cursor-pointer flex items-center justify-between transition-colors",
                  suggestion === value ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-300 hover:bg-zinc-700/50 hover:text-white"
                )}
              >
                <span>{suggestion}</span>
                {suggestion === value && <Check className="w-4 h-4" />}
              </div>
            ))}
            {searchTerm && !filteredSuggestions.includes(searchTerm) && (
              <div
                onClick={() => {
                  onChange(searchTerm);
                  setIsOpen(false);
                }}
                className="px-4 py-3 cursor-pointer text-emerald-400 hover:bg-zinc-700/50 transition-colors border-t border-zinc-700/50"
              >
                Usar "{searchTerm}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
