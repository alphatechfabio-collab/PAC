/**
 * REGRAS DE INTEGRIDADE DO CÓDIGO (SOLICITADAS PELO USUÁRIO):
 * 1. Funções validadas devem permanecer exatamente como validadas.
 * 2. Nenhuma alteração em lógica validada sem autorização explícita.
 * 3. Auditoria constante de prompts vs comportamento do app.
 * 
 * FUNÇÕES VALIDADAS ATÉ O MOMENTO:
 * - Upload de Vídeo via YouTube (OK)
 * - Navegação em Carrossel Horizontal (OK)
 * - Dashboard de Atletas (OK)
 */

import React, { useState, useEffect, useMemo, useRef, Component } from 'react';
import { MigrationTool } from './MigrationTool';
import { 
  Users, Activity, Brain, Trophy, ClipboardList, FileText, TrendingUp, Settings, LogOut, 
  ChevronRight, ChevronDown, Search, Plus, Bell, Check, User as UserIcon, Dumbbell, Target, Menu, X, 
  Download, Utensils, Scale, Flame, Zap, ZapOff, Presentation, PlayCircle, PieChart as PieIcon, 
  LogIn, Trash2, ExternalLink, Eye, Video, AlertCircle, Share2, MessageSquare, Clock, Heart, 
  Award, Flag, MapPin, Globe, BookOpen, ChevronLeft, Filter, MoreVertical, Calendar, Info, 
  ArrowUpRight, ArrowDownRight, Layers, Layout, LayoutGrid, List, RefreshCw, Save, Send, 
  Upload, UserPlus, UserMinus, Shield, Lock, Unlock, Key, Mail, Phone, Map, Link, Copy, 
  CheckCircle2, CheckCircle, AlertTriangle, HelpCircle, Settings2, Sliders, Maximize2, Minimize2, Grid, 
  BarChart3, Square, Circle, Triangle, Minus, PlusCircle, MinusCircle, Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, Mic, MicOff, Camera, CameraOff, Monitor, Smartphone, Tablet, Tv, 
  HardDrive, Cpu, Database, Cloud, CloudUpload, CloudDownload, Wifi, WifiOff, Bluetooth, 
  Battery, BatteryCharging, Sun, Moon, CloudSun, CloudMoon, CloudRain, CloudLightning, 
  CloudSnow, Wind, Droplets, Thermometer, Compass, Navigation, Navigation2, Anchor, Ship, 
  Plane, Train, Bus, Car, Bike, Footprints, HeartPulse, Stethoscope, Crosshair, Timer, 
  Watch, AlarmClock, History, Undo, Redo, RotateCcw, RotateCcw as RotateCw, ZoomIn, ZoomOut, Move, 
  Hand, Pointer, Grab, Scissors, Eraser, Pencil, Brush, Palette, Contrast, Type, Bold, 
  Italic, Underline, Strikethrough, Code, Terminal, Hash, AtSign, Tag, Bookmark, StickyNote, 
  Paperclip, Inbox, Archive, Folder, FolderPlus, FolderMinus, File, FilePlus, FileMinus, 
  FileCheck, FileX, FileSearch, FileCode, FileJson, FileSpreadsheet, FileAudio, FileVideo, 
  FileImage, FileArchive, Image as ImageIcon, Music, Headphones, Speaker, Radio, Cast, 
  Airplay, MonitorPlay, Laptop, Printer, Mouse, Keyboard, Gamepad, Gamepad2, Joystick, 
  Headset, Mic2, Ear, EyeOff, Scan, Focus, Aperture, Flashlight, FlashlightOff, Umbrella, 
  Briefcase, ShoppingBag, ShoppingCart, CreditCard, Wallet, Coins, Banknote, Landmark, 
  TrendingDown, ShieldCheck, MoveRight, Sparkles, Loader2, Edit2,
  Building, Building2, Home, Warehouse, Factory, Store, Tent, Mountain, TreePine, Trees, 
  Flower, Flower2, Sprout, Leaf, Bird, Dog, Cat, Fish, Rabbit, Turtle, PawPrint, Bug, 
  Ghost, Skull, Dna, Atom, Microscope, FlaskConical, Beaker, TestTube, GraduationCap, 
  School, Library, Languages, Globe2, Pin, Locate, LocateFixed, Milestone, Signpost, 
  Route, Waypoints, ParkingCircle, ParkingSquare, Waves, CloudFog, CloudDrizzle, CloudHail, 
  CloudSunRain, CloudMoonRain, CloudRainWind, Map as MapIcon, DollarSign, Receipt, BarChart2,
  Wand2
} from 'lucide-react';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type as GenAIType } from "@google/genai";
import { FightTimer } from './components/FightTimer';

const getGenAI = () => {
  const apiKey = (window as any).ENV?.GEMINI_API_KEY || 
                 (import.meta as any).env?.VITE_GEMINI_API_KEY ||
                 (window as any).GEMINI_API_KEY;
  if (!apiKey || apiKey === 'undefined' || apiKey === 'null' || apiKey === '') {
    throw new Error("API Key não configurada. Por favor, contate o suporte ou verifique as configurações do projeto.");
  }
  return new GoogleGenAI({ apiKey });
};
import * as d3 from 'd3-geo';
import * as topojson from 'topojson-client';
import { 
  Athlete, 
  PhysicalEvaluation, 
  PsychologicalEvaluation, 
  TrainingLog, 
  Competition, 
  NutritionPlan, 
  User,
  Media,
  Post,
  Story,
  Challenge,
  Mission,
  Alert,
  Academy,
  Plan,
  ClassSchedule,
  CheckIn,
  MealLog,
  WaterLog,
  Professor,
  Technique,
  TechniqueSubmission,
  StudentTechniqueProgress
} from './types';
import { cn } from './lib/utils';
import { sendTelegramNotification } from './lib/telegram';
import { TournamentManager, TournamentList } from './components/TournamentManager';

// --- Utility Functions ---

const addToWhitelist = async (email: string, role: string, academyId?: string) => {
  if (!email) return;
  try {
    await setDoc(doc(db, 'whitelist', email.toLowerCase()), {
      email: email.toLowerCase(),
      role,
      academy_id: academyId || '',
      created_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding to whitelist:', error);
  }
};

const calculateAge = (birthDate: string) => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  or,
  Timestamp,
  documentId,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  increment,
  writeBatch,
  collectionGroup,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, storage } from './firebase';
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL, uploadString, getBytes } from 'firebase/storage';

// --- Error Handling ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  alert(`Erro ao realizar operação (${operationType}): ${errInfo.error}. Por favor, verifique sua conexão ou permissões.`);
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };
  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-md w-full text-center">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ZapOff size={32} />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Ops! Algo deu errado</h1>
            <p className="text-zinc-400 text-sm mb-6">
              Ocorreu um erro inesperado. Por favor, tente recarregar a página.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all"
            >
              Recarregar Aplicativo
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-6 p-4 bg-black/50 rounded-lg text-left text-[10px] text-rose-400 overflow-auto max-h-40">
                {(this as any).state.error?.message}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

// --- Components ---

const CommunityView = ({ athletes, academyId }: { athletes: Athlete[], academyId: string }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  
  // Stories state
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const [newStoryContent, setNewStoryContent] = useState('');
  const [newStoryImage, setNewStoryImage] = useState<File | null>(null);
  const [isUploadingStory, setIsUploadingStory] = useState(false);
  const [storyUploadProgress, setStoryUploadProgress] = useState(0);
  const [storyFilter, setStoryFilter] = useState('none');
  const [storyObjectFit, setStoryObjectFit] = useState<'cover' | 'contain'>('cover');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!academyId) return;
    const q = query(
      collection(db, 'posts'), 
      where('academy_id', '==', academyId),
      orderBy('created_at', 'desc'), 
      limit(20)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(postsData);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'posts'));

    return () => unsubscribe();
  }, [academyId]);

  useEffect(() => {
    if (!academyId) return;
    const q = query(
      collection(db, 'stories'),
      where('academy_id', '==', academyId),
      orderBy('created_at', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date().toISOString();
      const storiesData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Story))
        .filter(story => story.expires_at > now);
      
      setStories(storiesData);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'stories'));

    return () => unsubscribe();
  }, [academyId]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !academyId) return;
    setIsPosting(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const athlete = athletes.find(a => a.user_id === user.uid);
      
      await addDoc(collection(db, 'posts'), {
        academy_id: academyId,
        athlete_id: athlete?.id || 'system',
        athlete_name: athlete?.name || 'Sistema PAC',
        content: newPostContent,
        type: 'manual',
        likes_count: 0,
        comments_count: 0,
        created_at: new Date().toISOString()
      });
      
      // Send Telegram notification
      await sendTelegramNotification(
        academyId, 
        `<b>Novo post de ${athlete?.name || 'Sistema PAC'}:</b>\n\n${newPostContent}`
      );
      
      setNewPostContent('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes_count: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `posts/${postId}`);
    }
  };

  const handleCreateStory = async () => {
    if ((!newStoryContent.trim() && !newStoryImage) || !academyId) return;
    setIsUploadingStory(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const athlete = athletes.find(a => a.user_id === user.uid);
      
      let imageUrl = '';
      if (newStoryImage) {
        const storageRef = ref(storage, `stories/${academyId}/${Date.now()}_${newStoryImage.name}`);
        const uploadTask = uploadBytesResumable(storageRef, newStoryImage);
        
        await new Promise<void>((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setStoryUploadProgress(progress);
            },
            (error) => reject(error),
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

      await addDoc(collection(db, 'stories'), {
        academy_id: academyId,
        athlete_id: athlete?.id || 'system',
        athlete_name: athlete?.name || 'Sistema PAC',
        content: newStoryContent,
        image_url: imageUrl,
        media_type: newStoryImage?.type.startsWith('video/') ? 'video' : 'image',
        filter: storyFilter,
        object_fit: storyObjectFit,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString()
      });
      
      // Send Telegram notification
      let telegramMessage = `<b>Novo Story de ${athlete?.name || 'Sistema PAC'}</b>`;
      if (newStoryContent) {
        telegramMessage += `\n\n${newStoryContent}`;
      }
      if (imageUrl) {
        telegramMessage += `\n\n<a href="${imageUrl}">Ver Mídia</a>`;
      }
      await sendTelegramNotification(academyId, telegramMessage);
      
      setNewStoryContent('');
      setNewStoryImage(null);
      setStoryFilter('none');
      setStoryObjectFit('cover');
      setIsCreatingStory(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'stories');
    } finally {
      setIsUploadingStory(false);
      setStoryUploadProgress(0);
    }
  };

  // Group stories by athlete for the UI
  const groupedStories = stories.reduce((acc, story) => {
    if (!acc[story.athlete_id]) {
      acc[story.athlete_id] = {
        athlete_id: story.athlete_id,
        athlete_name: story.athlete_name,
        stories: []
      };
    }
    acc[story.athlete_id].stories.push(story);
    return acc;
  }, {} as Record<string, { athlete_id: string, athlete_name: string, stories: Story[] }>);

  const storyGroups = Object.values(groupedStories) as { athlete_id: string, athlete_name: string, stories: Story[] }[];

  const handleNextStory = () => {
    if (!viewingStory) return;
    const currentGroupIndex = storyGroups.findIndex(g => g.athlete_id === viewingStory.athlete_id);
    if (currentGroupIndex !== -1) {
      const currentGroup = storyGroups[currentGroupIndex];
      const currentIndex = currentGroup.stories.findIndex(s => s.id === viewingStory.id);
      if (currentIndex < currentGroup.stories.length - 1) {
        setViewingStory(currentGroup.stories[currentIndex + 1]);
      } else if (currentGroupIndex < storyGroups.length - 1) {
        setViewingStory(storyGroups[currentGroupIndex + 1].stories[0]);
      } else {
        setViewingStory(null);
      }
    } else {
      setViewingStory(null);
    }
  };

  const handlePrevStory = () => {
    if (!viewingStory) return;
    const currentGroupIndex = storyGroups.findIndex(g => g.athlete_id === viewingStory.athlete_id);
    if (currentGroupIndex !== -1) {
      const currentGroup = storyGroups[currentGroupIndex];
      const currentIndex = currentGroup.stories.findIndex(s => s.id === viewingStory.id);
      if (currentIndex > 0) {
        setViewingStory(currentGroup.stories[currentIndex - 1]);
      } else if (currentGroupIndex > 0) {
        const prevGroup = storyGroups[currentGroupIndex - 1];
        setViewingStory(prevGroup.stories[prevGroup.stories.length - 1]);
      } else {
        // At the very first story, maybe just restart it?
        setViewingStory({...viewingStory}); // trigger re-render
      }
    } else {
      setViewingStory(null);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Stories Section */}
      <div className="bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-800 overflow-hidden">
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {/* Add Story Button */}
          <div className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer" onClick={() => setIsCreatingStory(true)}>
            <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-colors text-zinc-400">
              <Plus size={24} />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Seu Story</span>
          </div>

          {/* Story Groups */}
          {storyGroups.map((group) => (
            <div 
              key={group.athlete_id} 
              className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group"
              onClick={() => setViewingStory(group.stories[0])}
            >
              <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-emerald-500 p-1 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-zinc-700 flex items-center justify-center text-emerald-500 font-black text-xl">
                  {group.athlete_name.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <span className="text-[10px] font-bold text-zinc-300 uppercase truncate w-full text-center">
                {group.athlete_name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800">
        <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
          <Share2 className="w-6 h-6 text-emerald-500" />
          COMUNIDADE PAC
        </h2>
        <div className="space-y-4">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Compartilhe seu treino, conquista ou evolução..."
            className="w-full p-6 rounded-2xl bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none h-40 transition-all"
          />
          <div className="flex justify-end">
            <button
              onClick={handleCreatePost}
              disabled={isPosting || !newPostContent.trim()}
              className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isPosting ? 'POSTANDO...' : 'PUBLICAR NO FEED'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800 group hover:border-emerald-500/30 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-black">
                  {post.athlete_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{post.athlete_name}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    {new Date(post.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="px-3 py-1 bg-zinc-800 rounded-full text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                {post.type}
              </div>
            </div>
            
            <p className="text-zinc-300 leading-relaxed mb-8 text-sm">{post.content}</p>
            
            <div className="flex items-center gap-6 pt-6 border-t border-zinc-800">
              <button 
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-2 text-zinc-500 hover:text-rose-500 transition-colors group/btn"
              >
                <Heart size={18} className="group-hover/btn:fill-rose-500 transition-all" />
                <span className="text-xs font-bold">{post.likes_count}</span>
              </button>
              <button className="flex items-center gap-2 text-zinc-500 hover:text-emerald-500 transition-colors">
                <MessageSquare size={18} />
                <span className="text-xs font-bold">{post.comments_count}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Story Modal */}
      <Modal isOpen={isCreatingStory} onClose={() => { setIsCreatingStory(false); setStoryFilter('none'); setStoryObjectFit('cover'); }} title="Criar Story">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Foto ou Vídeo (Curto)</label>
              {newStoryImage && (
                <button
                  onClick={() => setStoryObjectFit(prev => prev === 'cover' ? 'contain' : 'cover')}
                  className="text-[10px] text-emerald-500 hover:text-emerald-400 uppercase font-bold flex items-center gap-1"
                >
                  {storyObjectFit === 'cover' ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                  {storyObjectFit === 'cover' ? 'Ajustar' : 'Preencher'}
                </button>
              )}
            </div>
            <div className="relative h-48 bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-xl overflow-hidden flex items-center justify-center group hover:border-emerald-500 transition-colors">
              {newStoryImage ? (
                newStoryImage.type.startsWith('video/') ? (
                  <video src={URL.createObjectURL(newStoryImage)} className={`w-full h-full ${storyObjectFit === 'contain' ? 'object-contain' : 'object-cover'}`} controls style={{ filter: storyFilter }} />
                ) : (
                  <img src={URL.createObjectURL(newStoryImage)} alt="Preview" className={`w-full h-full ${storyObjectFit === 'contain' ? 'object-contain' : 'object-cover'}`} style={{ filter: storyFilter }} />
                )
              ) : (
                <div className="text-center p-4">
                  <Camera size={24} className="mx-auto text-zinc-600 mb-2 group-hover:text-emerald-500 transition-colors" />
                  <span className="text-xs text-zinc-500 font-medium">Clique para enviar imagem ou vídeo</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*,video/*" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setNewStoryImage(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>

          {newStoryImage && (
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-2">
                <Wand2 size={14} /> Filtros
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {[
                  { name: 'Normal', value: 'none' },
                  { name: 'P&B', value: 'grayscale(100%)' },
                  { name: 'Sépia', value: 'sepia(100%)' },
                  { name: 'Vívido', value: 'saturate(200%)' },
                  { name: 'Drama', value: 'contrast(150%) saturate(120%)' },
                  { name: 'Vintage', value: 'sepia(50%) contrast(120%) saturate(120%)' }
                ].map(f => (
                  <button
                    key={f.name}
                    onClick={() => setStoryFilter(f.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${storyFilter === f.value ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Texto (Opcional)</label>
            <textarea
              value={newStoryContent}
              onChange={(e) => setNewStoryContent(e.target.value)}
              placeholder="Escreva algo..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 h-24 resize-none"
            />
          </div>

          {isUploadingStory && (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-zinc-400">
                <span>Enviando...</span>
                <span>{Math.round(storyUploadProgress)}%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${storyUploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleCreateStory}
            disabled={isUploadingStory || (!newStoryContent.trim() && !newStoryImage)}
            className="w-full bg-emerald-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isUploadingStory ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                PUBLICANDO...
              </>
            ) : (
              'PUBLICAR STORY'
            )}
          </button>
        </div>
      </Modal>

      {/* View Story Modal */}
      {viewingStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setViewingStory(null)}>
          <div className="relative w-full max-w-md h-[80vh] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Progress Bar (Fake for now, just visual) */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800 z-10 flex gap-1 px-2 pt-2">
              <div className="h-1 bg-white/50 rounded-full flex-1 overflow-hidden">
                <motion.div 
                  key={viewingStory.id}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: viewingStory.media_type === 'video' ? 15 : 5, ease: "linear" }}
                  onAnimationComplete={() => {
                    if (viewingStory.media_type !== 'video') {
                      handleNextStory();
                    }
                  }}
                  className="h-full bg-white"
                />
              </div>
            </div>

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 pt-6 z-10 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-500 font-black text-sm">
                  {viewingStory.athlete_name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm shadow-black drop-shadow-md">{viewingStory.athlete_name}</h3>
                  <span className="text-white/70 text-[10px] shadow-black drop-shadow-md">
                    {new Date(viewingStory.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <button onClick={() => setViewingStory(null)} className="text-white/70 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>

            {/* Navigation Click Areas */}
            <div className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer" onClick={handlePrevStory} />
            <div className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer" onClick={handleNextStory} />

            {/* Content */}
            <div className="flex-1 relative flex items-center justify-center bg-zinc-900">
              {viewingStory.image_url ? (
                viewingStory.media_type === 'video' || (viewingStory.image_url.includes('alt=media&token') && !viewingStory.image_url.includes('image') && !viewingStory.media_type) ? (
                  <>
                    <video 
                      src={viewingStory.image_url} 
                      className={`w-full h-full ${viewingStory.object_fit === 'contain' ? 'object-contain' : 'object-cover'}`} 
                      autoPlay 
                      playsInline 
                      muted={isMuted} 
                      onEnded={handleNextStory}
                      style={{ filter: viewingStory.filter || 'none' }} 
                    />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} 
                      className="absolute top-20 right-4 z-20 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-md hover:bg-black/70 transition-colors"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                  </>
                ) : (
                  <img src={viewingStory.image_url} alt="Story" className={`w-full h-full ${viewingStory.object_fit === 'contain' ? 'object-contain' : 'object-cover'}`} style={{ filter: viewingStory.filter || 'none' }} />
                )
              ) : (
                <div className="p-8 text-center">
                  <p className="text-2xl font-bold text-white leading-relaxed">{viewingStory.content}</p>
                </div>
              )}
              
              {viewingStory.image_url && viewingStory.content && (
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 pointer-events-none">
                  <p className="text-white text-lg font-medium text-center shadow-black drop-shadow-lg">{viewingStory.content}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'alerts'),
      where('user_id', '==', user.uid),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedAlerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert));
      // Sort in memory to avoid composite index requirement
      fetchedAlerts.sort((a, b) => {
        const dateA = (a.created_at as any)?.toMillis?.() || (a.created_at ? new Date(a.created_at as any).getTime() : 0);
        const dateB = (b.created_at as any)?.toMillis?.() || (b.created_at ? new Date(b.created_at as any).getTime() : 0);
        return dateB - dateA;
      });
      setAlerts(fetchedAlerts.slice(0, 10));
    }, (error) => console.error('Alerts subscription error:', error));

    return () => unsubscribe();
  }, []);

  const markAsRead = async (alertId: string) => {
    try {
      await updateDoc(doc(db, 'alerts', alertId), { read: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `alerts/${alertId}`);
    }
  };

  return { alerts, markAsRead };
};

const AlertList = ({ alerts, onMarkRead }: { alerts: Alert[], onMarkRead: (id: string) => void }) => {
  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          onClick={() => onMarkRead(alert.id)}
          className={cn(
            "p-4 rounded-2xl border transition-all cursor-pointer",
            alert.read ? "bg-white border-black/5 opacity-60" : "bg-rose-50 border-rose-100 shadow-sm"
          )}
        >
          <div className="flex items-start gap-3">
            <div className={cn(
              "p-2 rounded-lg shrink-0",
              alert.type === 'performance_drop' ? "bg-rose-100 text-rose-600" :
              alert.type === 'attendance_drop' ? "bg-amber-100 text-amber-600" :
              "bg-blue-100 text-blue-600"
            )}>
              <AlertCircle size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 mb-1">{alert.message}</div>
              <div className="text-[10px] text-gray-400 font-medium">
                {new Date(alert.created_at).toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      ))}
      {alerts.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm italic">
          Nenhum alerta no momento.
        </div>
      )}
    </div>
  );
};

export const calculateIntelligentMetrics = (athlete: any) => {
  const latestPsych = athlete.psychological?.[0] || {};
  const latestPhysical = athlete.physical?.[0] || {};
  const physical = athlete.physical || [];
  const training = athlete.training || [];
  const comps = athlete.competitions || [];

  // 1. Strength Index (Relative Power) - Primary source is total_score if available
  const strengthScore = latestPhysical.total_score || (latestPhysical.weight 
    ? Math.min(100, (((latestPhysical.pull_ups || 0) * 3 + (latestPhysical.push_ups || 0) + (latestPhysical.burpees || 0)) / latestPhysical.weight) * 100)
    : 0);

  // 2. Endurance Index
  const enduranceScore = latestPhysical.rounds_resistance 
    ? Math.min(100, ((latestPhysical.rounds_resistance || 0) * 10 + (60 / (latestPhysical.sprint_seconds > 0 ? latestPhysical.sprint_seconds : 15)) * 5))
    : 0;

  // 3. Mental Toughness (Average of PAC indicators)
  const mentalToughness = Math.round(
    ((latestPsych.disciplina || 0) + 
     (latestPsych.resiliencia || 0) + 
     (latestPsych.mentalidade_competitiva || 0) + 
     (latestPsych.controle_emocional || 0) +
     (latestPsych.responsabilidade || 0) +
     (latestPsych.tolerancia_dor || 0) +
     (latestPsych.mentalidade_crescimento || 0)) / 7
  ) || 0;

  // 4. Technical Consistency (Training Volume)
  const last14Days = new Date();
  last14Days.setDate(last14Days.getDate() - 14);
  const recentTraining = training.filter((t: any) => t.date && new Date(t.date) >= last14Days);
  const trainingVolume = recentTraining.reduce((acc: number, curr: any) => acc + ((curr.duration_minutes || 0) * (curr.intensity || 0)), 0);
  const consistencyScore = Math.min(100, (trainingVolume / 2000) * 100) || 0;

  // 5. Technical Efficiency
  const tech = athlete.technical_history || {};
  const efficiencyScore = Math.round(
    ((tech.raspagens_efficiency || 0) + 
     (tech.passagens_efficiency || 0) + 
     (tech.finalizacoes_efficiency || 0) + 
     (tech.quedas_efficiency || 0) + 
     (tech.defesa_efficiency || 0)) / 5
  ) || 0;

  const masteredScore = getMasteredScore(athlete);

  const technicalScore = Math.round((efficiencyScore + masteredScore) / 2);

  // 6. Discipline Score
  const disciplineScore = 85; // Mocked or based on logs

  // 7. Competitive Sharpness
  const competitiveScore = Math.min(100, (comps.length * 10) + ((athlete.score || 0) / 10)) || 0;

  return {
    strengthScore: Math.round(strengthScore),
    enduranceScore: Math.round(enduranceScore),
    mentalToughness,
    consistencyScore: Math.round(consistencyScore),
    technicalScore,
    disciplineScore,
    competitiveScore,
    trainingVolume
  };
};

// --- PAC Meritocracy Algorithm ---
export const getMasteredScore = (athlete: any) => {
  if (athlete.techniques && athlete.technique_progress) {
    const normalizeBelt = (belt: string) => belt ? belt.split(' (')[0].trim().toLowerCase() : '';
    const getEffectiveBelt = (belt: string) => {
      const normalized = normalizeBelt(belt);
      const kidsBelts = ['cinza', 'amarela', 'laranja', 'verde'];
      const isKidsBelt = kidsBelts.some(kb => normalized.includes(kb)) || (belt || '').toLowerCase().includes('infantil');
      return isKidsBelt ? 'branca' : normalized;
    };
    const effectiveAthleteBelt = getEffectiveBelt(athlete.belt);
    const beltTechniques = athlete.techniques.filter((t: any) => normalizeBelt(t.belt) === effectiveAthleteBelt);
    if (beltTechniques.length > 0) {
      const masteredCount = beltTechniques.filter((t: any) => {
        const progress = athlete.technique_progress?.find((p: any) => p.technique_id === t.id);
        return progress?.status === 'validated';
      }).length;
      return Math.round((masteredCount / beltTechniques.length) * 100);
    }
  }
  if (athlete.mastered_techniques_percentage !== undefined) {
    return athlete.mastered_techniques_percentage;
  }
  if (athlete.technical_competencies) {
    return (Object.values(athlete.technical_competencies).reduce((a: number, b: any) => a + (Number(b) || 0), 0) as number) / 8;
  }
  return 0;
};

export const calculatePACScore = (athlete: Athlete) => {
  // 1. Technical (Average of Efficiency + Competencies)
  const efficiencies = (
    (athlete.technical_history?.raspagens_efficiency || 0) +
    (athlete.technical_history?.passagens_efficiency || 0) +
    (athlete.technical_history?.finalizacoes_efficiency || 0) +
    (athlete.technical_history?.quedas_efficiency || 0) +
    (athlete.technical_history?.defesa_efficiency || 0)
  ) / 5;

  const masteredScore = getMasteredScore(athlete);

  const technical = (efficiencies + masteredScore) / 2; // Max 100

  // 2. Physical
  const physical = athlete.latest_physical_power || 0; // Max 100
  
  // 3. Psychological (Normalize 0-200 to 0-100)
  const psychological = (athlete.latest_psych_score || 0) / 2; // Max 100
  
  // 4. Discipline
  const discipline = athlete.latest_discipline_score || 80; // Default to 80 if not yet evaluated
  
  // 5. Results (Medals)
  const results = (athlete.medals_count?.gold || 0) * 25 + 
                  (athlete.medals_count?.silver || 0) * 15 + 
                  (athlete.medals_count?.bronze || 0) * 10;

  // 6. Meritocracy (Direct points from events)
  const merit = athlete.merit_points || 0;

  const total = technical + physical + psychological + discipline + results + merit;
  const score = Math.min(500, Math.round(total));

  let classification = 'Base PAC';
  if (score >= 450) classification = 'Elite PAC';
  else if (score >= 350) classification = 'Pro PAC';
  else if (score >= 200) classification = 'Aspirante PAC';

  return { score, classification };
};

const PublicProfileView = ({ athlete }: { athlete: any }) => {
  const metrics = calculateIntelligentMetrics(athlete);
  
  const radarData = [
    { subject: 'Físico', A: (metrics.strengthScore + metrics.enduranceScore) / 2, fullMark: 100 },
    { subject: 'Técnico', A: metrics.technicalScore, fullMark: 100 },
    { subject: 'Mental', A: metrics.mentalToughness, fullMark: 100 },
    { subject: 'Consistência', A: metrics.consistencyScore, fullMark: 100 },
    { subject: 'Ranking', A: metrics.competitiveScore, fullMark: 100 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="relative mb-24">
        <div className="h-48 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-b-[40px] -mx-4 md:-mx-10 -mt-10 overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-8 flex flex-col md:flex-row items-end gap-6 translate-y-1/2">
          <div className="w-32 h-32 rounded-3xl bg-zinc-900 p-1 shadow-2xl shrink-0">
            <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-4xl font-black text-emerald-500">
              {(athlete.name || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>
          </div>
          <div className="flex-1 pb-4">
            <h1 className="text-3xl font-black text-white drop-shadow-md">{athlete.name}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-emerald-500/20 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">
                {athlete.belt} ({athlete.stripes} {athlete.stripes === 1 ? 'Grau' : 'Graus'})
              </span>
              <span className="bg-zinc-800 backdrop-blur-md text-zinc-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-zinc-700">
                {athlete.weight_class}
              </span>
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Top {athlete.rank || '-'} Ranking
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Evolução de Performance
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#3f3f46" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                  <Radar
                    name="Atleta"
                    dataKey="A"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-500" />
              Histórico de Competições
            </h3>
            <div className="space-y-4">
              {athlete.competitions?.length > 0 ? athlete.competitions.map((comp: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700">
                  <div>
                    <div className="font-bold text-white">{comp.name}</div>
                    <div className="text-xs text-zinc-500">{new Date(comp.date).toLocaleDateString('pt-BR')} • {comp.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-500 font-bold">{comp.result}</div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase">+{comp.points_earned} pts</div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-zinc-500 text-center py-8">Nenhuma competição registrada.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-black text-white rounded-3xl p-8 shadow-2xl border border-zinc-800">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-2">PAC Score Total</div>
            <div className="text-5xl font-black mb-1">{calculatePACScore(athlete).score}</div>
            <div className="text-xs text-emerald-400/60 font-medium">{calculatePACScore(athlete).classification}</div>
            <div className="mt-8 pt-8 border-t border-zinc-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500">Ranking Global</span>
                <span className="font-bold">#{athlete.rank || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500">Taxa de Vitória</span>
                <span className="font-bold">
                  {athlete.competitions?.length > 0 
                    ? Math.round((athlete.competitions.filter((c: any) => c.result === 'Ouro').length / athlete.competitions.length) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Conquistas</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="aspect-square rounded-xl bg-zinc-800 flex flex-col items-center justify-center group relative cursor-help border border-zinc-700">
                <Award className="w-8 h-8 text-amber-400 mb-2" />
                <span className="text-xl font-black text-white">{athlete.medals_count?.gold || 0}</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Ouro
                </div>
              </div>
              <div className="aspect-square rounded-xl bg-zinc-800 flex flex-col items-center justify-center group relative cursor-help border border-zinc-700">
                <Award className="w-8 h-8 text-zinc-300 mb-2" />
                <span className="text-xl font-black text-white">{athlete.medals_count?.silver || 0}</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Prata
                </div>
              </div>
              <div className="aspect-square rounded-xl bg-zinc-800 flex flex-col items-center justify-center group relative cursor-help border border-zinc-700">
                <Award className="w-8 h-8 text-amber-700 mb-2" />
                <span className="text-xl font-black text-white">{athlete.medals_count?.bronze || 0}</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Bronze
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const ScheduleManager = ({ user, currentRole, academies }: { user: User | null, currentRole: string, academies: Academy[] }) => {
  const [selectedAcademyId, setSelectedAcademyId] = useState<string>(user?.academy_id || (academies.length > 0 ? academies[0].id : ''));
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(null);
  const [viewingLessonPlan, setViewingLessonPlan] = useState<ClassSchedule | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planTypes, setPlanTypes] = useState<string[]>(['técnico']);
  const [formData, setFormData] = useState({
    day_of_week: 1,
    start_time: '18:00',
    end_time: '19:30',
    activity: 'Jiu-Jitsu',
    instructor_name: '',
    max_capacity: 30,
    technical_focus: '',
    lesson_plan: '',
    unit_id: ''
  });

  const generateLessonPlan = async () => {
    if (!formData.activity || !formData.technical_focus) {
      alert("Por favor, preencha a Atividade e o Foco Técnico antes de gerar o plano.");
      return;
    }

    setIsGeneratingPlan(true);
    try {
      const ai = getGenAI();
      const prompt = `
        Atue como um professor especialista de artes marciais (foco em ${formData.activity}).
        Crie um plano de aula detalhado.
        Tipo de aula: ${planTypes.join(', ')} (condicionamento, técnico, específico, estratégico, sparring, fortalecimento muscular ou treino de TAF).
        Foco Técnico/Tema: ${formData.activity} - ${formData.technical_focus}.
        Duração: ${formData.start_time} até ${formData.end_time}.
        
        Estruture o plano com:
        - Aquecimento (tempo e exercícios)
        - Parte Principal (drills, posições, técnica)
        - Treino/Sparring (se aplicável)
        - Volta à calma/Alongamento
        
        Retorne apenas o texto do plano de aula, formatado de forma clara e direta.
      `;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      if (response.text) {
        setFormData(prev => ({ ...prev, lesson_plan: response.text }));
      }
    } catch (error) {
      console.error("Erro ao gerar plano de aula:", error);
      alert("Erro ao gerar plano de aula. Tente novamente.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  useEffect(() => {
    if (user?.academy_id && currentRole !== 'developer') {
      setSelectedAcademyId(user.academy_id);
    } else if (academies.length > 0 && !selectedAcademyId) {
      setSelectedAcademyId(user?.academy_id || academies[0].id);
    }
  }, [academies, user?.academy_id, currentRole]);

  useEffect(() => {
    if (!selectedAcademyId) return;
    const q = query(collection(db, `academies/${selectedAcademyId}/schedules`), orderBy('day_of_week'), orderBy('start_time'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSchedules(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClassSchedule)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, `academies/${selectedAcademyId}/schedules`));
    return () => unsubscribe();
  }, [selectedAcademyId]);

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    console.log("handleSubmit triggered!");
    e?.preventDefault();
    console.log("handleSubmit called");
    if (!selectedAcademyId) {
      alert("Erro: ID da academia não encontrado. Por favor, tente recarregar a página.");
      return;
    }

    try {
      const data = {
        ...formData,
        academy_id: selectedAcademyId,
        instructor_id: user?.id,
        created_at: new Date().toISOString()
      };

      if (editingSchedule) {
        await updateDoc(doc(db, `academies/${selectedAcademyId}/schedules`, editingSchedule.id), data);
      } else {
        await addDoc(collection(db, `academies/${selectedAcademyId}/schedules`), data);
      }
      setShowForm(false);
      setEditingSchedule(null);
    } catch (error) {
      handleFirestoreError(error, editingSchedule ? OperationType.UPDATE : OperationType.CREATE, `academies/${selectedAcademyId}/schedules`);
    }
  };

  const handleDelete = async () => {
    if (!selectedAcademyId || !editingSchedule) return;
    try {
      await deleteDoc(doc(db, `academies/${selectedAcademyId}/schedules`, editingSchedule.id));
      setIsDeleting(false);
      setShowForm(false);
      setEditingSchedule(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `academies/${selectedAcademyId}/schedules/${editingSchedule.id}`);
    }
  };

  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">GRADE HORÁRIA</h2>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Gerencie as aulas da sua academia</p>
        </div>
        <div className="flex items-center gap-4">
          {currentRole === 'developer' && (
            <select
              value={selectedAcademyId}
              onChange={(e) => setSelectedAcademyId(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
            >
              {academies.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          )}
          <button 
            onClick={() => { 
              setShowForm(true); 
              setEditingSchedule(null); 
              setFormData({
                day_of_week: 1,
                start_time: '18:00',
                end_time: '19:30',
                activity: 'Jiu-Jitsu',
                instructor_name: user?.name || '',
                max_capacity: 30,
                technical_focus: '',
                lesson_plan: '',
                unit_id: ''
              });
            }}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold transition-all"
          >
            <Plus size={20} />
            Nova Aula
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((day, index) => (
          <div key={day} className="space-y-4">
            <div className="text-center p-2 bg-zinc-900 rounded-xl border border-zinc-800">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{day}</span>
            </div>
            <div className="space-y-2">
              {schedules.filter(s => s.day_of_week === index).map(schedule => (
                <div 
                  key={schedule.id}
                  onClick={() => { 
                    setEditingSchedule(schedule); 
                    setFormData({
                      ...schedule,
                      technical_focus: schedule.technical_focus || '',
                      lesson_plan: schedule.lesson_plan || '',
                      instructor_name: schedule.instructor_name || '',
                      activity: schedule.activity || '',
                      unit_id: schedule.unit_id || ''
                    }); 
                    setShowForm(true); 
                  }}
                  className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 transition-all cursor-pointer group"
                >
                  <div className="text-[10px] font-bold text-zinc-500 mb-1">{schedule.start_time} - {schedule.end_time}</div>
                  <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{schedule.activity}</div>
                  {schedule.technical_focus && (
                    <div className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-tighter mt-1 truncate">
                      {schedule.technical_focus}
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-[10px] text-zinc-500">{schedule.instructor_name}</div>
                    <div className="flex items-center gap-2">
                      {schedule.lesson_plan && <Sparkles size={10} className="text-emerald-500" title="Plano de Aula Gerado" />}
                      <div className="text-[10px] font-bold text-emerald-500">{schedule.max_capacity} vagas</div>
                    </div>
                  </div>
                  {schedule.lesson_plan && (
                    <div className="mt-2 pt-2 border-t border-zinc-800/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Plano de Aula</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingLessonPlan(schedule);
                          }}
                          className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
                        >
                          <Maximize2 size={10} />
                          Ampliar
                        </button>
                      </div>
                      <div className="max-h-24 overflow-y-auto pr-1 custom-scrollbar">
                        <p className="text-[10px] text-zinc-400 whitespace-pre-wrap leading-relaxed">
                          {schedule.lesson_plan}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {viewingLessonPlan && (
        <Modal
          isOpen={!!viewingLessonPlan}
          onClose={() => setViewingLessonPlan(null)}
          title={`Plano de Aula - ${viewingLessonPlan.activity}`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <div>
                <span className="font-bold text-zinc-500">Horário:</span> {viewingLessonPlan.start_time} - {viewingLessonPlan.end_time}
              </div>
              {viewingLessonPlan.instructor_name && (
                <div>
                  <span className="font-bold text-zinc-500">Professor:</span> {viewingLessonPlan.instructor_name}
                </div>
              )}
            </div>
            {viewingLessonPlan.technical_focus && (
              <div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Foco Técnico</span>
                <p className="text-white mt-1">{viewingLessonPlan.technical_focus}</p>
              </div>
            )}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {viewingLessonPlan.lesson_plan}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-md w-full shadow-2xl relative z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-6">{editingSchedule ? 'Editar Aula' : 'Nova Aula'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Dia da Semana</label>
                <select 
                  value={formData.day_of_week}
                  onChange={e => setFormData({...formData, day_of_week: parseInt(e.target.value)})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white"
                >
                  {days.map((day, i) => <option key={i} value={i}>{day}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Início</label>
                  <input 
                    type="time" 
                    value={formData.start_time}
                    onChange={e => setFormData({...formData, start_time: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Fim</label>
                  <input 
                    type="time" 
                    value={formData.end_time}
                    onChange={e => setFormData({...formData, end_time: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Atividade</label>
                <input 
                  type="text" 
                  value={formData.activity}
                  onChange={e => setFormData({...formData, activity: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white"
                  placeholder="Ex: Jiu-Jitsu, Muay Thai"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Instrutor</label>
                <input 
                  type="text" 
                  value={formData.instructor_name}
                  onChange={e => setFormData({...formData, instructor_name: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white"
                  placeholder="Nome do Professor"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Capacidade Máxima (Alunos)</label>
                <input 
                  type="number" 
                  value={formData.max_capacity}
                  onChange={e => setFormData({...formData, max_capacity: parseInt(e.target.value) || 0})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white"
                  placeholder="Ex: 30"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Foco Técnico</label>
                <input 
                  type="text" 
                  value={formData.technical_focus}
                  onChange={e => setFormData({...formData, technical_focus: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white"
                  placeholder="Ex: Passagem de Guarda, Meia-Guarda"
                />
              </div>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold text-emerald-500 uppercase">Gerar Plano de Aula com IA</label>
                  <Sparkles size={14} className="text-emerald-500" />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'técnico', label: 'Técnico' },
                      { id: 'condicionamento', label: 'Condicionamento' },
                      { id: 'específico', label: 'Específico' },
                      { id: 'estratégico', label: 'Estratégico' },
                      { id: 'sparring', label: 'Sparring' },
                      { id: 'fortalecimento', label: 'Fortalecimento Muscular' },
                      { id: 'taf', label: 'Treino de TAF' }
                    ].map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          setPlanTypes(prev => 
                            prev.includes(type.id) 
                              ? prev.filter(t => t !== type.id)
                              : [...prev, type.id]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          planTypes.includes(type.id)
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-emerald-500/50'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={generateLessonPlan}
                    disabled={isGeneratingPlan || !formData.activity || !formData.technical_focus || planTypes.length === 0}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {isGeneratingPlan ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Gerar Plano de Aula
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Plano de Aula (Pedagogia)</label>
                <textarea 
                  value={formData.lesson_plan}
                  onChange={e => setFormData({...formData, lesson_plan: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white h-32"
                  placeholder="Descreva a estrutura da aula (Aquecimento, Técnica, Drills, Sparring) ou gere com IA acima."
                />
              </div>
              <div className="flex gap-4 pt-4 relative z-50">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Cancelar clicked");
                    setShowForm(false);
                  }}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all cursor-pointer pointer-events-auto"
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Salvar clicked directly");
                    handleSubmit(e);
                  }}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 cursor-pointer pointer-events-auto"
                >
                  Salvar
                </button>
              </div>
              {editingSchedule && (
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleting(true);
                  }}
                  className="w-full py-2 text-rose-500 text-xs font-bold hover:text-rose-400 transition-colors cursor-pointer pointer-events-auto"
                >
                  Excluir Aula
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {isDeleting && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl"
          >
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Excluir Aula?</h3>
            <p className="text-zinc-400 text-sm mb-8">Esta ação não pode ser desfeita. A aula será removida permanentemente da grade horária.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsDeleting(false)}
                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-500/20"
              >
                Excluir
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const PhotoCheckIn = ({ academyId, scheduleId, onCheckIn }: { academyId: string, scheduleId: string, onCheckIn: (athlete: Athlete) => void }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAthletes = async () => {
      const q = query(collection(db, 'athletes'), where('academy_id', '==', academyId));
      const snapshot = await getDocs(q);
      setAthletes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Athlete)).filter(a => !!a.profile_photo));
    };
    fetchAthletes();
  }, [academyId]);

  const handleCapture = async (capturedBase64: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      // Try multiple ways to get the API key
      const ai = getGenAI();
      
      const getBase64Data = (base64: string) => {
        if (!base64) return null;
        const parts = base64.split(',');
        return parts.length > 1 ? parts[1] : parts[0];
      };

      const capturedData = getBase64Data(capturedBase64);
      if (!capturedData) {
        throw new Error("Imagem capturada inválida.");
      }

      // Prepare the prompt for Gemini
      const prompt = `
        Você é um sistema de reconhecimento facial de alta precisão para uma academia de Jiu-Jitsu.
        
        ENTRADA:
        1. Uma foto tirada agora (primeira imagem).
        2. Uma lista de fotos de perfil de atletas cadastrados (imagens subsequentes).
        
        TAREFA:
        Identifique qual atleta da lista de perfil é a mesma pessoa que aparece na foto tirada agora.
        
        REGRAS:
        - Responda APENAS o ID do atleta encontrado (ex: "abc123xyz").
        - Se houver dúvida ou não encontrar ninguém, responda exatamente "NOT_FOUND".
        - Não forneça explicações ou textos adicionais.
        
        LISTA DE ATLETAS CADASTRADOS:
        ${athletes.slice(0, 30).map(a => `ID: ${a.id}, Nome: ${a.name}`).join('\n')}
      `;

      // Limit to 30 athletes to be safer with payload size
      const selectedAthletes = athletes.slice(0, 30);

      const imageParts = [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: capturedData,
          },
        },
        ...selectedAthletes.map(a => {
          const data = getBase64Data(a.profile_photo || '');
          return data ? {
            inlineData: {
              mimeType: "image/jpeg",
              data: data,
            },
          } : null;
        }).filter(p => p !== null) as any[]
      ];

      let response;
      let retries = 3;
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ parts: [{ text: prompt }, ...imageParts] }],
          });
          break; // Success
        } catch (error: any) {
          if (error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('429')) {
            retries--;
            if (retries === 0) throw error;
            console.warn(`Rate limit hit. Retrying in ${Math.pow(2, 3 - retries) * 2000}ms...`);
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, 3 - retries) * 2000));
          } else {
            throw error;
          }
        }
      }

      const identifiedId = response?.text?.trim().replace(/['"]/g, '');
      
      if (identifiedId && identifiedId !== "NOT_FOUND") {
        const athlete = athletes.find(a => a.id === identifiedId);
        if (athlete) {
          // Perform check-in
          await addDoc(collection(db, 'checkins'), {
            academy_id: academyId,
            athlete_id: athlete.user_id || athlete.id,
            athlete_name: athlete.name,
            schedule_id: scheduleId,
            date: new Date().toISOString().split('T')[0],
            status: 'confirmed',
            checkin_time: Timestamp.now(),
            confirmed_at: Timestamp.now(),
            method: 'facial_recognition'
          });
          onCheckIn(athlete);
        } else {
          setError("Atleta identificado (" + identifiedId + ") mas não encontrado na lista local.");
        }
      } else {
        setError("Não foi possível identificar o atleta. Tente novamente ou faça o check-in manual.");
      }
    } catch (err: any) {
      console.error("Erro no reconhecimento facial:", err);
      let msg = err.message || 'Erro desconhecido';
      if (msg.includes('API key not valid')) {
        msg = "A chave da API Gemini é inválida ou expirou. Por favor, contate o suporte ou verifique as variáveis de ambiente.";
      }
      setError(`Erro: ${msg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800/50 p-6 rounded-3xl border border-zinc-700/50 text-center">
        <h4 className="text-lg font-bold text-white mb-2">Check-in por Reconhecimento Facial</h4>
        <p className="text-zinc-500 text-sm mb-6">Posicione o atleta em frente à câmera para confirmar a presença automaticamente.</p>
        
        {isProcessing ? (
          <div className="py-12 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-emerald-500 font-bold animate-pulse">Identificando Atleta...</p>
          </div>
        ) : (
          <CameraCapture onCapture={handleCapture} />
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-2 justify-center">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">
          {athletes.length} atletas com foto cadastrada nesta unidade
        </p>
      </div>
    </div>
  );
};

const CheckInSystem = ({ user, currentRole, academies }: { user: User | null, currentRole: string, academies: Academy[] }) => {
  const [resolvedAcademyId, setResolvedAcademyId] = useState<string | undefined>(user?.academy_id);
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<ClassSchedule | null>(null);
  const [showPhotoCheckIn, setShowPhotoCheckIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const dayOfWeek = today.getDay();

  useEffect(() => {
    if (user?.academy_id && currentRole !== 'developer') {
      setResolvedAcademyId(user.academy_id);
      return;
    } else if (academies.length > 0 && !resolvedAcademyId) {
      setResolvedAcademyId(user?.academy_id || academies[0].id);
    }
    if (user && (user.role === 'athlete' || user.role === 'professor')) {
      const q = query(collection(db, 'athletes'), where('user_id', '==', user.id), limit(1));
      getDocs(q).then(snapshot => {
        if (!snapshot.empty) {
          const athleteData = snapshot.docs[0].data();
          setResolvedAcademyId(athleteData.academy_id);
        }
      });
    }
  }, [user, academies, currentRole]);

  useEffect(() => {
    if (!resolvedAcademyId) return;
    const q = query(collection(db, `academies/${resolvedAcademyId}/schedules`), where('day_of_week', '==', dayOfWeek), orderBy('start_time'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSchedules(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClassSchedule)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, `academies/${resolvedAcademyId}/schedules`));
    return () => unsubscribe();
  }, [resolvedAcademyId, dayOfWeek]);

  useEffect(() => {
    if (!resolvedAcademyId) return;
    const q = query(collection(db, 'checkins'), where('date', '==', todayStr));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCheckins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CheckIn)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'checkins'));
    return () => unsubscribe();
  }, [resolvedAcademyId, todayStr]);

  const handleCheckIn = async (scheduleId: string) => {
    if (!user || !resolvedAcademyId) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'checkins'), {
        academy_id: resolvedAcademyId,
        athlete_id: user.id,
        athlete_name: user.name,
        schedule_id: scheduleId,
        date: todayStr,
        status: 'pending',
        checkin_time: Timestamp.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'checkins');
    } finally {
      setLoading(false);
    }
  };

  const handleUndoCheckIn = async (checkinId: string) => {
    if (!user || !resolvedAcademyId) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'checkins', checkinId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `checkins/${checkinId}`);
    } finally {
      setLoading(false);
    }
  };

  const confirmCheckIn = async (checkinId: string) => {
    try {
      await updateDoc(doc(db, 'checkins', checkinId), {
        status: 'confirmed',
        confirmed_at: Timestamp.now(),
        confirmed_by: user?.id
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `checkins/${checkinId}`);
    }
  };

  const isAthlete = currentRole === 'athlete';
  const isStaff = currentRole === 'professor' || currentRole === 'academy' || currentRole === 'developer';

  if (!resolvedAcademyId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
          <Landmark size={32} className="text-zinc-700" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-white uppercase tracking-tight">Academia não vinculada</h3>
          <p className="text-zinc-500 text-sm max-w-xs mx-auto">
            Você precisa estar vinculado a uma academia para realizar check-in nas aulas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">Check-in de Aulas</h2>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Aulas de hoje: {today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        {currentRole === 'developer' && (
          <select
            value={resolvedAcademyId}
            onChange={(e) => setResolvedAcademyId(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
          >
            {academies.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-emerald-500" />
              Próximas Aulas
            </h3>
            {isStaff && (
              <button 
                onClick={() => setShowPhotoCheckIn(true)}
                className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-emerald-500/20"
              >
                <Camera size={14} />
                Check-in por Foto
              </button>
            )}
          </div>
          <div className="space-y-3">
            {schedules.map(schedule => {
              const myCheckIn = checkins.find(c => c.schedule_id === schedule.id && c.athlete_id === user?.id);
              const classCheckins = checkins.filter(c => c.schedule_id === schedule.id);
              
              return (
                <div 
                  key={schedule.id}
                  className={cn(
                    "p-6 rounded-3xl border transition-all cursor-pointer",
                    selectedSchedule?.id === schedule.id ? "bg-emerald-500/10 border-emerald-500/50" : "bg-zinc-900 border-zinc-800"
                  )}
                  onClick={() => isStaff && setSelectedSchedule(schedule)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-2xl font-black text-white">{schedule.start_time}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{schedule.activity}</div>
                        {schedule.lesson_plan && <Sparkles size={10} className="text-emerald-500" title="Plano de Aula Disponível" />}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white">{schedule.instructor_name}</div>
                      <div className="text-[10px] text-zinc-500 uppercase">{classCheckins.length} / {schedule.max_capacity} Alunos</div>
                    </div>
                  </div>

                  {schedule.lesson_plan && (
                    <div className="mb-4 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-500 uppercase">Plano de Aula</span>
                      </div>
                      <div className="max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                        <p className="text-xs text-zinc-400 whitespace-pre-wrap leading-relaxed">
                          {schedule.lesson_plan}
                        </p>
                      </div>
                    </div>
                  )}

                  {isAthlete && (
                    <div className="space-y-2">
                      <button
                        disabled={!!myCheckIn || loading || classCheckins.length >= (schedule.max_capacity || 30)}
                        onClick={(e) => { e.stopPropagation(); handleCheckIn(schedule.id); }}
                        className={cn(
                          "w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                          myCheckIn 
                            ? myCheckIn.status === 'confirmed' 
                              ? "bg-emerald-500 text-white" 
                              : "bg-zinc-800 text-zinc-400"
                            : classCheckins.length >= (schedule.max_capacity || 30)
                              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                              : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                        )}
                      >
                        {myCheckIn ? (
                          <>
                            <CheckCircle size={18} />
                            {myCheckIn.status === 'confirmed' ? 'Presença Confirmada' : 'Check-in Realizado'}
                          </>
                        ) : classCheckins.length >= (schedule.max_capacity || 30) ? (
                          <>
                            <Users size={18} />
                            Aula Lotada
                          </>
                        ) : (
                          <>
                            <LogIn size={18} />
                            Fazer Check-in
                          </>
                        )}
                      </button>
                      {myCheckIn && myCheckIn.status !== 'confirmed' && (
                        <button
                          disabled={loading}
                          onClick={(e) => { e.stopPropagation(); handleUndoCheckIn(myCheckIn.id); }}
                          className="w-full py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs"
                        >
                          <X size={14} />
                          Cancelar Check-in
                        </button>
                      )}
                    </div>
                  )}
                  
                  {isStaff && (
                    <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Clique para gerenciar presença</span>
                      <ChevronRight size={16} className="text-zinc-500" />
                    </div>
                  )}
                </div>
              );
            })}
            {schedules.length === 0 && (
              <div className="text-center py-12 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
                <Calendar size={32} className="text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500 text-sm">Nenhuma aula programada para hoje.</p>
              </div>
            )}
          </div>
        </div>

        {isStaff && selectedSchedule && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users size={16} className="text-emerald-500" />
                Lista de Presença: {selectedSchedule.activity} ({selectedSchedule.start_time})
              </h3>
              <button onClick={() => setSelectedSchedule(null)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {selectedSchedule.lesson_plan && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 space-y-3">
                <h4 className="text-xs font-bold text-emerald-500 uppercase flex items-center gap-2">
                  <Sparkles size={14} />
                  Plano de Aula
                </h4>
                <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {selectedSchedule.lesson_plan}
                </div>
              </div>
            )}

            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
              <div className="p-4 border-b border-zinc-800 bg-zinc-800/30">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Aluno</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Status</span>
                </div>
              </div>
              <div className="divide-y divide-zinc-800">
                {checkins.filter(c => c.schedule_id === selectedSchedule.id).map(checkin => (
                  <div key={checkin.id} className="p-4 flex justify-between items-center hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-emerald-500">
                        {checkin.athlete_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-white">{checkin.athlete_name}</span>
                    </div>
                    {checkin.status === 'confirmed' ? (
                      <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase">
                        <CheckCircle size={14} />
                        Presente
                      </div>
                    ) : (
                      <button 
                        onClick={() => confirmCheckIn(checkin.id)}
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg transition-all"
                      >
                        Confirmar
                      </button>
                    )}
                  </div>
                ))}
                {checkins.filter(c => c.schedule_id === selectedSchedule.id).length === 0 && (
                  <div className="p-12 text-center text-zinc-500 text-sm italic">
                    Nenhum aluno fez check-in para esta aula.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={showPhotoCheckIn}
        onClose={() => setShowPhotoCheckIn(false)}
        title="Check-in por Reconhecimento Facial"
      >
        <PhotoCheckIn 
          academyId={resolvedAcademyId} 
          scheduleId={schedules[0]?.id || ''} 
          onCheckIn={(athlete) => {
            setShowPhotoCheckIn(false);
          }}
        />
      </Modal>
    </div>
  );
};

// --- Mock Geocoder for Brazilian Cities ---

const cityCoords: { [key: string]: [number, number] } = {
  'SÃO PAULO': [-23.5505, -46.6333],
  'RIO DE JANEIRO': [-22.9068, -43.1729],
  'PORTO ALEGRE': [-30.0346, -51.2177],
  'BELO HORIZONTE': [-19.9167, -43.9345],
  'CURITIBA': [-25.4284, -49.2733],
  'BRASÍLIA': [-15.7801, -47.9292],
  'SALVADOR': [-12.9714, -38.5014],
  'FORTALEZA': [-3.7172, -38.5433],
  'MANAUS': [-3.1190, -60.0217],
  'RECIFE': [-8.0543, -34.8813],
  'SÃO JOSÉ DA BARRA': [-20.7231, -46.3114],
  'PASSOS': [-20.7189, -46.6097],
  'CAPITÓLIO': [-20.6751, -46.2903],
  'RIBEIRÃO PRETO': [-21.1704, -47.8103],
  'CAMPINAS': [-22.9099, -47.0626]
};

const getFallbackCoords = (location: string): [number, number] | null => {
  if (!location) return null;
  const normalize = (str: string) => 
    str.toUpperCase()
       .normalize("NFD")
       .replace(/[\u0300-\u036f]/g, "");
  const upperLoc = normalize(location);
  for (const city in cityCoords) {
    if (upperLoc.includes(normalize(city))) return cityCoords[city];
  }
  if (upperLoc.includes('BRASIL') || upperLoc.includes('BRAZIL') || upperLoc.includes('MG') || upperLoc.includes('SP') || upperLoc.includes('MINAS') || upperLoc.includes('SAO PAULO')) {
    return [-14.2350, -51.9253];
  }
  return null;
};

const MapView = ({ athletes, academies }: { athletes: Athlete[], academies: Academy[] }) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number, y: number, lat: number, lng: number } | null>(null);
  const [zoom, setZoom] = useState({ k: 1, center: [0, 0] as [number, number] });
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(res => res.json())
      .then(data => {
        const countries = topojson.feature(data, data.objects.countries);
        setGeoData(countries);
      })
      .catch(err => console.error('Error loading map data:', err));
  }, []);

  const projection = useMemo(() => {
    return d3.geoEquirectangular()
      .scale(160 * zoom.k)
      .center(zoom.center)
      .translate([500, 250]);
  }, [zoom]);

  const pathGenerator = useMemo(() => {
    return d3.geoPath().projection(projection);
  }, [projection]);

  const handleCountryClick = (feature: any) => {
    if (selectedCountry?.id === feature.id) {
      setZoom({ k: 1, center: [0, 0] });
      setSelectedCountry(null);
    } else {
      const centroid = d3.geoCentroid(feature);
      setZoom({ k: 4, center: centroid });
      setSelectedCountry(feature);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const y = ((e.clientY - rect.top) / rect.height) * 500;
    
    const coords = projection.invert?.([x, y]);
    if (coords) {
      setHoverPos({ x, y, lng: coords[0], lat: coords[1] });
    }
  };

  const cityStats = useMemo(() => {
    const stats: Record<string, { athletes: number, academies: number }> = {};
    
    // First, map academies to their cities for quick lookup
    const academyCityMap: Record<string, string> = {};
    academies.forEach(a => {
      const city = a.location.split(',')[0].trim().toUpperCase();
      academyCityMap[a.id] = city;
      if (!stats[city]) stats[city] = { athletes: 0, academies: 0 };
      stats[city].academies++;
    });

    // Count athletes
    athletes.forEach(a => {
      let city = '';
      if (a.location?.city) {
        city = a.location.city.trim().toUpperCase();
      } else if (a.academy_id && academyCityMap[a.academy_id]) {
        city = academyCityMap[a.academy_id];
      }

      if (city) {
        if (!stats[city]) stats[city] = { athletes: 0, academies: 0 };
        stats[city].athletes++;
      }
    });

    return Object.entries(stats).sort((a, b) => (b[1].athletes + b[1].academies) - (a[1].athletes + a[1].academies));
  }, [athletes, academies]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
          <Globe className="w-8 h-8 text-emerald-500" />
          MAPA GLOBAL PAC
        </h2>
        {selectedCountry && (
          <button 
            onClick={() => { setZoom({ k: 1, center: [0, 0] }); setSelectedCountry(null); }}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-zinc-700"
          >
            <RefreshCw size={14} className="text-emerald-500" />
            RESETAR ZOOM MUNDIAL
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900 rounded-3xl p-4 shadow-2xl border border-zinc-800 relative overflow-hidden min-h-[500px] flex items-center justify-center">
          {/* Detailed World Map SVG */}
          <div className="absolute inset-0 opacity-100 p-12 flex items-center justify-center">
            <svg 
              ref={svgRef}
              viewBox="0 0 1000 500" 
              className="w-full h-full max-w-5xl cursor-crosshair overflow-visible"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverPos(null)}
            >
              <defs>
                <filter id="worldGlow">
                  <feGaussianBlur stdDeviation="2" result="blur"/>
                  <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
                <pattern id="dotPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" className="fill-white/20" />
                </pattern>
                <filter id="markerGlow">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feFlood floodColor="currentColor" result="color"/>
                  <feComposite in="color" in2="blur" operator="in" result="glow"/>
                  <feComposite in="SourceGraphic" in2="glow" operator="over"/>
                </filter>
              </defs>
              
              {/* Grid Lines */}
              <g className="stroke-white/5 stroke-[0.5]">
                {[...Array(21)].map((_, i) => (
                  <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
                ))}
                {[...Array(11)].map((_, i) => (
                  <line key={`h-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} />
                ))}
              </g>

              {/* World Map Paths */}
              {geoData && (
                <g className="fill-white/5 stroke-white/20 stroke-[1]" filter="url(#worldGlow)">
                  {geoData.features.map((feature: any, i: number) => (
                    <path
                      key={`country-${i}`}
                      d={pathGenerator(feature) || ''}
                      onClick={() => handleCountryClick(feature)}
                      className={cn(
                        "transition-all duration-500 cursor-pointer",
                        selectedCountry?.id === feature.id ? "fill-emerald-500/20 stroke-emerald-500/50" : "hover:fill-white/10"
                      )}
                    />
                  ))}
                </g>
              )}

              {/* Dot Overlay for Texture */}
              <rect x="0" y="0" width="1000" height="500" fill="url(#dotPattern)" pointerEvents="none" />

              {/* Connection Lines (Athlete to Academy) */}
              <g className="pointer-events-none">
                {athletes.filter(a => a.academy_id && a.location?.lat).map(athlete => {
                  const academy = academies.find(ac => ac.id === athlete.academy_id);
                  if (!academy || !academy.lat) return null;
                  
                  const start = projection([athlete.location?.lng || 0, athlete.location?.lat || 0]);
                  const end = projection([academy.lng || 0, academy.lat || 0]);
                  
                  if (!start || !end) return null;
                  
                  return (
                    <motion.line
                      key={`link-${athlete.id}-${academy.id}`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.15 }}
                      transition={{ duration: 2, delay: 1 }}
                      x1={start[0]} y1={start[1]}
                      x2={end[0]} y2={end[1]}
                      stroke="white"
                      strokeWidth="0.5"
                      strokeDasharray="2 2"
                    />
                  );
                })}
              </g>

              {/* Academy Markers (Inside SVG for perfect alignment) */}
              <g className="academies-layer" style={{ isolation: 'isolate' }}>
                {academies.map((academy) => {
                  // Extremely permissive coordinate detection
                  let rawLat = academy.lat ?? (academy as any).latitude ?? (academy as any).location?.lat;
                  let rawLng = academy.lng ?? (academy as any).longitude ?? (academy as any).lon ?? (academy as any).location?.lng;
                  
                  let lat = Number(rawLat);
                  let lng = Number(rawLng);
                  
                  // Fallback to Mock Geocoder if coordinates are missing or zero
                  if (isNaN(lat) || isNaN(lng) || lat === 0) {
                    const fallback = getFallbackCoords(academy.location);
                    if (fallback) {
                      lat = fallback[0];
                      lng = fallback[1];
                      // Debug log to help identify if fallback is working
                      console.log(`Fallback applied for ${academy.name}: ${lat}, ${lng}`);
                    }
                  }
                  
                  if (isNaN(lat) || isNaN(lng) || lat === 0) return null;
                  
                  const pos = projection([lng, lat]);
                  if (!pos || isNaN(pos[0]) || isNaN(pos[1])) return null;
                  
                  const pinScale = zoom.k === 1 ? 1.5 : 2;
                  
                  return (
                    <g key={`academy-svg-${academy.id}`} transform={`translate(${pos[0]}, ${pos[1]}) scale(${pinScale})`} className="cursor-pointer group">
                      <circle r="30" className="fill-blue-500/20 animate-ping" />
                      <circle r="15" className="fill-blue-600 stroke-white stroke-[3]" />
                      <path d="M0,0 L-10,-20 A10,10 0 1,1 10,-20 Z" className="fill-blue-500 stroke-white stroke-[2]" />
                      
                      <foreignObject x="-100" y="-180" width="200" height="120" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-zinc-950 border-4 border-blue-500 p-4 rounded-3xl shadow-2xl">
                          <p className="text-xs font-black text-white uppercase truncate">{academy.name}</p>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase truncate">{academy.location}</p>
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
              </g>

              {/* Athlete Markers (Inside SVG for perfect alignment) */}
              <g className="athletes-layer" style={{ isolation: 'isolate' }}>
                {athletes.map((athlete) => {
                  const rawLat = athlete.location?.lat ?? (athlete as any).lat ?? (athlete as any).latitude;
                  const rawLng = athlete.location?.lng ?? (athlete as any).lng ?? (athlete as any).longitude;
                  
                  let lat = Number(rawLat);
                  let lng = Number(rawLng);
                  
                  if (isNaN(lat) || isNaN(lng) || lat === 0) {
                    const academy = academies.find(ac => ac.id === athlete.academy_id);
                    if (academy) {
                      let aLat = Number(academy.lat ?? (academy as any).latitude ?? (academy as any).location?.lat);
                      let aLng = Number(academy.lng ?? (academy as any).longitude ?? (academy as any).location?.lng);
                      
                      // Also apply fallback for academy if needed
                      if (isNaN(aLat) || isNaN(aLng) || aLat === 0) {
                        const fallback = getFallbackCoords(academy.location);
                        if (fallback) {
                          aLat = fallback[0];
                          aLng = fallback[1];
                        }
                      }

                      if (!isNaN(aLat) && !isNaN(aLng) && aLat !== 0) {
                        const seed = athlete.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        lat = aLat + ((seed % 100) / 200) - 0.25;
                        lng = aLng + (((seed * 13) % 100) / 200) - 0.25;
                      }
                    }
                  }

                  if (isNaN(lat) || isNaN(lng) || lat === 0) return null;

                  const pos = projection([lng, lat]);
                  if (!pos || isNaN(pos[0]) || isNaN(pos[1])) return null;
                  
                  const pinScale = zoom.k === 1 ? 1.2 : 1.8;

                  return (
                    <g key={`athlete-svg-${athlete.id}`} transform={`translate(${pos[0]}, ${pos[1]}) scale(${pinScale})`} className="cursor-pointer group">
                      <circle r="25" className="fill-orange-500/20 animate-pulse" />
                      <circle r="12" className="fill-orange-600 stroke-white stroke-[2.5]" />
                      <path d="M0,0 L-8,-16 A8,8 0 1,1 8,-16 Z" className="fill-orange-500 stroke-white stroke-[2]" />
                      
                      <foreignObject x="-90" y="-160" width="180" height="110" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-zinc-950 border-4 border-orange-500 p-4 rounded-3xl shadow-2xl">
                          <p className="text-xs font-black text-white uppercase truncate">{athlete.name}</p>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase truncate">{athlete.belt} ({athlete.stripes} {athlete.stripes === 1 ? 'Grau' : 'Graus'})</p>
                          <p className="text-xs text-zinc-200 font-black uppercase">Score: {athlete.score}</p>
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
              </g>

              {/* Coordinate Tracker Tooltip (Address in each pixel) */}
              {hoverPos && (
                <g pointerEvents="none">
                  <line x1={hoverPos.x} y1="0" x2={hoverPos.x} y2="500" className="stroke-emerald-500/20 stroke-[0.5]" />
                  <line x1="0" y1={hoverPos.y} x2="1000" y2={hoverPos.y} className="stroke-emerald-500/20 stroke-[0.5]" />
                  <circle cx={hoverPos.x} cy={hoverPos.y} r="4" className="fill-emerald-500/50" />
                  <foreignObject x={hoverPos.x + 10} y={hoverPos.y + 10} width="150" height="60">
                    <div className="bg-zinc-950/80 backdrop-blur-sm border border-emerald-500/30 p-2 rounded-lg text-[8px] font-mono text-emerald-400 leading-tight">
                      <div className="flex justify-between">
                        <span>LAT:</span>
                        <span>{hoverPos.lat.toFixed(4)}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span>LNG:</span>
                        <span>{hoverPos.lng.toFixed(4)}°</span>
                      </div>
                      <div className="mt-1 pt-1 border-t border-emerald-500/20 text-[6px] opacity-50 uppercase">
                        Localização em Tempo Real
                      </div>
                    </div>
                  </foreignObject>
                </g>
              )}

              {/* Confirmation Label & Debug Info */}
              <g pointerEvents="none">
                <text x="500" y="480" textAnchor="middle" className="fill-white/20 text-[10px] font-black uppercase tracking-[1em]">Mapa Global PAC</text>
                <text x="20" y="480" className="fill-white/30 text-[6px] font-mono">
                  DATA: A:{academies.length} L:{athletes.length} | VIS: A:{academies.filter(a => {
                    const l = a.lat ?? (a as any).latitude ?? (a as any).location?.lat;
                    const lat = Number(l);
                    return (!isNaN(lat) && lat !== 0) || getFallbackCoords(a.location) !== null;
                  }).length} | KEYS: {academies[0] ? Object.keys(academies[0]).join(',') : 'NONE'}
                </text>
              </g>
            </svg>
          </div>

          <div className="absolute bottom-6 left-6 flex gap-8 z-20 bg-zinc-950/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.6)] animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Atletas</span>
                <span className="text-lg font-black text-white leading-none">{athletes.length}</span>
              </div>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-ping" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Academias</span>
                <span className="text-lg font-black text-white leading-none">{academies.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800 overflow-y-auto max-h-[500px] custom-scrollbar">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            Distribuição Geográfica
          </h3>
          <div className="space-y-4">
            {cityStats.length > 0 ? cityStats.map(([city, stats]) => (
              <div key={city} className="bg-zinc-800/30 p-5 rounded-2xl border border-zinc-800/50 hover:border-emerald-500/30 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{city}</span>
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(3, stats.athletes))].map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center">
                        <UserIcon size={10} className="text-zinc-500" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-900/50 p-2 rounded-xl border border-zinc-800">
                    <p className="text-[8px] text-zinc-500 font-black uppercase mb-1">Atletas</p>
                    <p className="text-sm font-black text-emerald-500">{stats.athletes}</p>
                  </div>
                  <div className="bg-zinc-900/50 p-2 rounded-xl border border-zinc-800">
                    <p className="text-[8px] text-zinc-500 font-black uppercase mb-1">Academias</p>
                    <p className="text-sm font-black text-blue-500">{stats.academies}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12">
                <p className="text-sm text-zinc-500 italic">Nenhum dado de localização disponível.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const LibraryView = ({ athletes }: { athletes: any[] }) => {
  const [activeSubTab, setActiveSubTab] = useState<'materials' | 'docs'>('materials');
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);

  const libraryItems = [
    { 
      title: 'Manual do Atleta Campeão', 
      description: 'Missão, Visão, Valores e Princípios do Atleta PAC.', 
      icon: BookOpen,
      content: `MISSÃO\nFormar atletas capazes de competir e vencer nos maiores campeonatos de Jiu-Jitsu do mundo, desenvolvendo excelência física, técnica, mental e comportamental.\n\nVISÃO\nConstruir uma geração de atletas disciplinados, resilientes e preparados para alto rendimento esportivo.\n\nVALORES\nDisciplina, Respeito, Responsabilidade, Excelência e Superação.\n\nPRINCÍPIOS DO ATLETA CAMPEÃO\n1. DISCIPLINA: Campeões fazem o que precisa ser feito, mesmo quando não têm vontade.\n2. CONSISTÊNCIA: Resultados extraordinários são construídos através de esforço consistente ao longo do tempo.\n3. RESPONSABILIDADE: O atleta é responsável por sua evolução. Não existem desculpas.\n4. HUMILDADE: Sempre há algo a aprender. O atleta campeão aceita correções e busca melhorar continuamente.\n5. RESILIÊNCIA: Fracassos fazem parte do processo. Campeões usam derrotas como combustível para evoluir.`
    },
    { 
      title: 'Código Mental do Campeão', 
      description: 'Os 10 princípios que orientam a mentalidade de elite.', 
      icon: Brain,
      content: `O Código Mental do Campeão estabelece princípios que orientam a mentalidade dos atletas do programa.\n\nPRINCÍPIO 1 – COMPROMISSO: O atleta campeão entende que excelência exige dedicação contínua.\nPRINCÍPIO 2 – CONSISTÊNCIA: Pequenas melhorias diárias geram grande evolução.\nPRINCÍPIO 3 – FOCO: Distrações e hábitos prejudiciais são evitados.\nPRINCÍPIO 4 – RESILIÊNCIA: Dificuldades são inevitáveis no caminho do alto rendimento.\nPRINCÍPIO 5 – CONTROLE EMOCIONAL: Em situações de pressão o atleta mantém clareza mental.\nPRINCÍPIO 6 – DISCIPLINA MENTAL: Pensamentos negativos são substituídos por foco em soluções.\nPRINCÍPIO 7 – AUTOCONFIANÇA: Construída através de preparação consistente.\nPRINCÍPIO 8 – CORAGEM: Enfrentar desafios e adversários fortes fora da zona de conforto.\nPRINCÍPIO 9 – HUMILDADE: Aberto a correções e aprendizado contínuo.\nPRINCÍPIO 10 – MENTALIDADE DE CAMPEÃO: Entra em cada treino com a intenção de evoluir e vencer.`
    },
    { 
      title: 'Sistema Operacional PAC', 
      description: 'O fluxo completo de evolução, do recrutamento à elite.', 
      icon: Settings,
      content: `OBJETIVO\nOrganizar todos os processos do programa para garantir funcionamento eficiente e manutenção de alto padrão.\n\nFLUXO DE ENTRADA\nEtapa 1 – Inscrição: Coleta de histórico e objetivos.\nEtapa 2 – Seleção: Avaliação física, técnica e psicológica.\nEtapa 3 – Aprovação: Período de adaptação de 60 dias.\n\nMONITORAMENTO CONTÍNUO\nDurante o treinamento são monitorados: Presença, Intensidade, Comportamento, Condicionamento e Evolução Técnica. Essas informações alimentam o Sistema de Pontuação do Atleta PAC (500 Pontos).`
    },
    { 
      title: 'Mapa de Valências', 
      description: 'As 5 dimensões do desenvolvimento do atleta de Jiu-Jitsu.', 
      icon: Activity,
      content: `O desenvolvimento completo do atleta envolve cinco grandes dimensões:\n\n1. VALÊNCIAS TÉCNICAS: Domínio de fundamentos, precisão, transições, raspagens, passagens e quedas.\n2. VALÊNCIAS FÍSICAS: Força (máxima/explosiva), Potência, Resistência, Velocidade e Mobilidade.\n3. VALÊNCIAS COGNITIVAS: Leitura de adversário, antecipação, tomada de decisão e estratégia.\n4. VALÊNCIAS PSICOLÓGICAS: Controle emocional, agressividade competitiva, foco e perseverança.\n5. VALÊNCIAS COMPORTAMENTAIS: Disciplina de rotina, sono, dieta e responsabilidade pessoal.`
    },
    { 
      title: 'Sistema de Carreira', 
      description: 'As fases da jornada: Descoberta, Desenvolvimento, Alto Rendimento e Elite.', 
      icon: Trophy,
      content: `FASE 1 – DESCOBERTA COMPETITIVA: Foco em fundamentos e disciplina inicial (6 meses a 2 anos).\nFASE 2 – DESENVOLVIMENTO COMPETITIVO: Aprimoramento de jogo técnico principal e inteligência de luta (2 a 4 anos).\nFASE 3 – ALTO RENDIMENTO: Maximização de performance e estratégias avançadas.\nFASE 4 – ELITE COMPETITIVA: Pequeno grupo focado em títulos internacionais e pico de performance.\n\nCRITÉRIOS DE PROGRESSÃO: Resultados competitivos, pontuação no sistema PAC, evolução física e perfil psicológico.`
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 uppercase">
          <BookOpen className="w-8 h-8 text-emerald-500" />
          Biblioteca & Docs
        </h2>
        
        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveSubTab('materials')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
              activeSubTab === 'materials' ? "bg-emerald-500 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Materiais de Estudo
          </button>
          <button 
            onClick={() => setActiveSubTab('docs')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
              activeSubTab === 'docs' ? "bg-emerald-500 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Documentos Oficiais
          </button>
        </div>
      </div>

      {activeSubTab === 'materials' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {libraryItems.map((item, index) => (
            <div 
              key={index} 
              onClick={() => setSelectedMaterial(item)}
              className="bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800 hover:border-emerald-500/50 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <item.icon size={100} className="text-emerald-500" />
              </div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:bg-emerald-500 transition-colors shadow-xl">
                  <item.icon className="w-8 h-8 text-emerald-500 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.description}</p>
                </div>
                <ChevronRight className="text-zinc-700 group-hover:text-emerald-500 transition-all transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DocumentsList athletes={athletes} />
      )}

      <Modal
        isOpen={!!selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        title={selectedMaterial?.title || ''}
        maxWidth="max-w-3xl"
      >
        <div className="p-8">
          <div className="prose prose-invert max-w-none">
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                  {selectedMaterial && <selectedMaterial.icon size={24} />}
                </div>
                <div>
                  <h4 className="text-white font-black uppercase tracking-widest">{selectedMaterial?.title}</h4>
                  <p className="text-xs text-zinc-500 uppercase font-bold">Material de Estudo Oficial PAC</p>
                </div>
              </div>
              <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap font-medium">
                {selectedMaterial?.content}
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all"
              >
                Fechar Leitura
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const AITechniqueGenerator = ({ onGenerated }: { onGenerated: (tech: Partial<Technique>) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const generateTechnique = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const ai = getGenAI();
      let response;
      let retries = 3;
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-3.1-pro-preview",
            contents: `Você é um mestre de Jiu-Jitsu Brasileiro (BJJ) faixa preta de alto nível, especialista em biomecânica, física de alavancas e pedagogia esportiva. 
            Sua tarefa é arquitetar uma entrada técnica precisa e cientificamente embasada para uma biblioteca técnica de elite.
            
            O usuário quer gerar a seguinte técnica: "${prompt}"
            
            ### DIRETRIZES DE TAXONOMIA (Siga rigorosamente):
            1. FUNDAMENTOS (Use EXATAMENTE um destes valores para 'category'):
               - Quedas
               - Guardas
               - Passagens
               - Raspagens
               - Finalizações
               - Costas
               - Cem Quilos
               - Transições
               - Emborcado
            
            2. FAIXA (Use EXATAMENTE um destes valores para 'belt'):
               - Branca
               - Azul
               - Roxa
               - Marrom
               - Preta
            
            3. MODALIDADE (Use EXATAMENTE um destes valores para 'modality'):
               - Gi
               - No-Gi
               - Both
            
            ### ESTRUTURA DO OBJETO JSON (Retorne APENAS o JSON):
            {
              "name": "Nome técnico preciso",
              "position": "Posição fundamental (ex: MEIA GUARDA POR BAIXO)",
              "category": "Sub-categoria específica (ex: Raspagens)",
              "belt": "Faixa mínima recomendada (ex: Azul)",
              "modality": "Modalidade (ex: Gi)",
              "initial_position": "Descrição concisa dos grips e posicionamento",
              "objective": "O objetivo biomecânico",
              "steps": ["Passo 1 (máx 200 caracteres)", "Passo 2...", ...],
              "common_errors": ["Erro 1", "Erro 2", ...],
              "technical_adjustments": "Ajustes finos essenciais",
              "defenses": ["Como anular a técnica"],
              "continuations": ["Transição/Conexão"],
              "variations": ["Variação principal"]
            }
            
            Seja conciso. Cada campo de texto deve ter no máximo 500 caracteres.`,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: GenAIType.OBJECT,
                properties: {
                  name: { type: GenAIType.STRING },
                  position: { type: GenAIType.STRING },
                  category: { type: GenAIType.STRING },
                  belt: { type: GenAIType.STRING },
                  modality: { type: GenAIType.STRING },
                  initial_position: { type: GenAIType.STRING },
                  objective: { type: GenAIType.STRING },
                  steps: { type: GenAIType.ARRAY, items: { type: GenAIType.STRING } },
                  common_errors: { type: GenAIType.ARRAY, items: { type: GenAIType.STRING } },
                  technical_adjustments: { type: GenAIType.STRING },
                  defenses: { type: GenAIType.ARRAY, items: { type: GenAIType.STRING } },
                  continuations: { type: GenAIType.ARRAY, items: { type: GenAIType.STRING } },
                  variations: { type: GenAIType.ARRAY, items: { type: GenAIType.STRING } }
                },
                required: ["name", "position", "category", "belt", "modality", "steps"]
              }
            }
          });
          break; // Success
        } catch (error: any) {
          if (error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('429')) {
            retries--;
            if (retries === 0) throw error;
            console.warn(`Rate limit hit. Retrying in ${Math.pow(2, 3 - retries) * 2000}ms...`);
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, 3 - retries) * 2000));
          } else {
            throw error;
          }
        }
      }

      const tech = JSON.parse(response?.text || '{}');
      onGenerated(tech);
      setIsOpen(false);
      setPrompt('');
    } catch (error) {
      console.error("Erro ao gerar técnica:", error);
      alert("Erro ao gerar técnica com IA. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-emerald-500 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
      >
        <Sparkles className="w-4 h-4" />
        Gerar com IA
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-zinc-800 w-full max-w-xl rounded-[40px] p-12 relative"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                  <Sparkles className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
                    Arquiteto de Técnicas IA
                  </h2>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                    Especialista em Biomecânica BJJ
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest ml-4">
                    Descreva a técnica que deseja criar
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: Raspagem de gancho da guarda borboleta com esgrima..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all h-32 resize-none"
                  />
                </div>

                <button
                  onClick={generateTechnique}
                  disabled={loading || !prompt}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processando Biomecânica...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Gerar Arquitetura Técnica
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const LibraryProgressDashboard = ({ techniques }: { techniques: Technique[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const belts = ['Branca', 'Azul', 'Roxa', 'Marrom', 'Preta'];
  const categories = ['Quedas', 'Guardas', 'Passagens', 'Raspagens', 'Finalizações', 'Costas', 'Cem Quilos', 'Transições', 'Emborcado'];

  const targetPerBelt = 50;
  const targetPerCategory = 30;

  const beltData = belts.map(belt => {
    const normalizeBelt = (b: string) => b ? b.split(' (')[0].trim().toLowerCase() : '';
    const count = techniques.filter(t => normalizeBelt(t.belt) === normalizeBelt(belt)).length;
    return {
      name: belt,
      count,
      target: targetPerBelt,
      percent: Math.min(100, Math.round((count / targetPerBelt) * 100))
    };
  });

  const categoryData = categories.map(cat => {
    const count = techniques.filter(t => t.category === cat).length;
    return {
      name: cat,
      count,
      target: targetPerCategory,
      percent: Math.min(100, Math.round((count / targetPerCategory) * 100))
    };
  });

  const totalTechniques = techniques.length;
  const totalTarget = targetPerBelt * belts.length;
  const totalPercent = Math.min(100, Math.round((totalTechniques / totalTarget) * 100));

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-blue-500 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border border-blue-500/20 shadow-lg shadow-blue-500/5"
      >
        <BarChart2 className="w-4 h-4" />
        Progresso da Biblioteca
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-zinc-800 w-full max-w-5xl rounded-[40px] p-12 relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl transition-all z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                  <BarChart2 className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
                    Progresso da Biblioteca
                  </h2>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                    Acompanhamento do Currículo Técnico
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Total de Técnicas</p>
                  <p className="text-4xl font-black text-white">{totalTechniques} <span className="text-zinc-600 text-lg">/ {totalTarget}</span></p>
                  <div className="w-full bg-zinc-800 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${totalPercent}%` }} />
                  </div>
                  <p className="text-blue-500 text-xs font-bold mt-2">{totalPercent}% Concluído</p>
                </div>
                
                <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                  <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4">Distribuição por Faixa (Meta: {targetPerBelt})</h3>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart data={beltData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <XAxis type="number" hide domain={[0, targetPerBelt]} />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12, fontWeight: 700 }} width={80} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff', fontWeight: 700 }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                          {beltData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={
                              entry.name === 'Branca' ? '#f4f4f5' :
                              entry.name === 'Azul' ? '#3b82f6' :
                              entry.name === 'Roxa' ? '#a855f7' :
                              entry.name === 'Marrom' ? '#78350f' :
                              '#18181b'
                            } stroke={entry.name === 'Preta' ? '#3f3f46' : 'none'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6">Progresso por Fundamento (Meta: {targetPerCategory})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryData.map(cat => (
                    <div key={cat.name}>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-white font-bold text-sm">{cat.name}</span>
                        <span className="text-zinc-500 text-xs font-bold">{cat.count} / {cat.target} ({cat.percent}%)</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            cat.percent >= 100 ? "bg-emerald-500" : cat.percent >= 50 ? "bg-amber-500" : "bg-blue-500"
                          )} 
                          style={{ width: `${cat.percent}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const AIBatchTechniqueGenerator = ({ existingTechniques, onComplete }: { existingTechniques: Technique[], onComplete: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'config' | 'suggest' | 'generate'>('config');
  const [suggestions, setSuggestions] = useState<{ name: string, description: string }[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [focusBelt, setFocusBelt] = useState<string>('');
  const [focusCategory, setFocusCategory] = useState<string>('');
  const [suggestionCount, setSuggestionCount] = useState<number>(5);

  const getSuggestions = async () => {
    setLoading(true);
    setStep('suggest');
    try {
      const ai = getGenAI();
      const existingNames = existingTechniques.map(t => t.name).join(', ');
      
      let response;
      let retries = 3;
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Você é um mestre de Jiu-Jitsu Brasileiro (BJJ) encarregado de expandir uma biblioteca técnica de elite.
            
            Atualmente, a biblioteca possui as seguintes técnicas: [${existingNames}]
            
            Sua tarefa é analisar o que está faltando para um currículo completo (desde iniciante até avançado) e sugerir ${suggestionCount} novas técnicas que complementariam bem o acervo atual.
            NÃO sugira técnicas que já existam na lista acima.
            
            ${focusBelt ? `Foque em sugerir técnicas para a faixa: ${focusBelt}.` : ''}
            ${focusCategory ? `Foque em sugerir técnicas da categoria/fundamento: ${focusCategory}.` : ''}
            
            Considere:
            - Equilíbrio entre Quedas, Guardas, Passagens, Raspagens e Finalizações.
            - Progressão pedagógica.
            - Técnicas modernas e clássicas.
            
            Retorne um objeto JSON com a seguinte estrutura:
            {
              "suggestions": [
                { "name": "Nome da Técnica", "description": "Breve justificativa do porquê esta técnica é importante agora" },
                ...
              ]
            }`,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: GenAIType.OBJECT,
                properties: {
                  suggestions: {
                    type: GenAIType.ARRAY,
                    items: {
                      type: GenAIType.OBJECT,
                      properties: {
                        name: { type: GenAIType.STRING },
                        description: { type: GenAIType.STRING }
                      },
                      required: ["name", "description"]
                    }
                  }
                },
                required: ["suggestions"]
              }
            }
          });
          break; // Success
        } catch (error: any) {
          if (error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('429')) {
            retries--;
            if (retries === 0) throw error;
            const delay = Math.pow(2, 3 - retries) * 5000; // 5s, 10s, 20s
            console.warn(`Rate limit hit. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            throw error;
          }
        }
      }

      const data = JSON.parse(response?.text || '{"suggestions": []}');
      setSuggestions(data.suggestions);
      setStep('suggest');
    } catch (error) {
      console.error("Erro ao obter sugestões:", error);
      alert("Erro ao obter sugestões da IA.");
    } finally {
      setLoading(false);
    }
  };

  const generateBatch = async () => {
    if (selectedSuggestions.length === 0) return;
    setLoading(true);
    setStep('generate');
    setProgress({ current: 0, total: selectedSuggestions.length });

    const ai = getGenAI();

    try {
      for (let i = 0; i < selectedSuggestions.length; i++) {
        const techName = selectedSuggestions[i];
        setProgress(prev => ({ ...prev, current: i + 1 }));

        let response;
        let retries = 3;
        while (retries > 0) {
          try {
            response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: `Gere os detalhes técnicos concisos para a técnica de BJJ: "${techName}".
              
              Siga as diretrizes de biomecânica e taxonomia de elite.
              
              Use EXATAMENTE um destes valores para 'category': Quedas, Guardas, Passagens, Raspagens, Finalizações, Costas, Cem Quilos, Transições, Emborcado.
              Use EXATAMENTE um destes valores para 'belt': Branca, Azul, Roxa, Marrom, Preta.
              Use EXATAMENTE um destes valores para 'modality': Gi, No-Gi, Both.
              
              Retorne um objeto JSON:
              {
                "name": "${techName}",
                "position": "Posição fundamental",
                "category": "Sub-categoria",
                "belt": "Faixa recomendada",
                "modality": "Modalidade",
                "initial_position": "Descrição concisa",
                "objective": "Objetivo",
                "steps": ["Passo 1", "Passo 2", ...],
                "common_errors": ["Erro 1", ...],
                "technical_adjustments": "Ajustes",
                "defenses": ["Defesa 1"],
                "continuations": ["Continuação 1"],
                "variations": ["Variação 1"]
              }
              
              Seja conciso. Cada campo de texto deve ter no máximo 500 caracteres.`,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: GenAIType.OBJECT,
                  properties: {
                    name: { type: GenAIType.STRING },
                    position: { type: GenAIType.STRING },
                    category: { type: GenAIType.STRING },
                    belt: { type: GenAIType.STRING },
                    modality: { type: GenAIType.STRING },
                    initial_position: { type: GenAIType.STRING },
                    objective: { type: GenAIType.STRING },
                    steps: { type: GenAIType.ARRAY, items: { type: GenAIType.STRING } },
                    common_errors: { type: GenAIType.ARRAY, items: { type: GenAIType.STRING } },
                    technical_adjustments: { type: GenAIType.STRING },
                    defenses: { type: GenAIType.ARRAY, items: { type: GenAIType.STRING } },
                    continuations: { type: GenAIType.ARRAY, items: { type: GenAIType.STRING } },
                    variations: { type: GenAIType.ARRAY, items: { type: GenAIType.STRING } }
                  },
                  required: ["name", "position", "category", "belt", "modality", "steps"]
                }
              }
            });
            break; // Success
          } catch (error: any) {
            if (error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('429')) {
              retries--;
              if (retries === 0) throw error;
              const delay = Math.pow(2, 3 - retries) * 5000; // 5s, 10s, 20s
              console.warn(`Rate limit hit. Retrying in ${delay}ms...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            } else {
              throw error;
            }
          }
        }

        const techData = JSON.parse(response?.text || '{}');
        
        // Check for duplicates before adding
        const isDuplicate = existingTechniques.some(
          t => t.name.toLowerCase() === techData.name?.toLowerCase() && 
               t.position.toLowerCase() === techData.position?.toLowerCase()
        );

        if (!isDuplicate) {
          const finalTechData = {
            ...techData,
            created_at: new Date().toISOString(),
            visuals: { image_url: '', gif_url: '', video_url: '', illustration_url: '' }
          };

          const payloadSize = new TextEncoder().encode(JSON.stringify(finalTechData)).length;
          if (payloadSize > 1000000) {
            console.warn(`Técnica "${techData.name}" muito grande (${payloadSize} bytes), pulando.`);
            continue;
          }

          await addDoc(collection(db, 'techniques'), finalTechData);
        } else {
          console.log(`Técnica "${techData.name}" já existe, pulando.`);
        }
        
        // Add a delay between requests to avoid hitting rate limits
        if (i < selectedSuggestions.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds delay between generations
        }
      }

      alert(`${selectedSuggestions.length} técnicas geradas e adicionadas com sucesso!`);
      setStep('suggest');
      setSelectedSuggestions([]);
      onComplete();
      // Optionally trigger a new suggestion fetch immediately:
      // getSuggestions();
    } catch (error) {
      console.error("Erro na geração em lote:", error);
      alert("Ocorreu um erro durante a geração em lote.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (name: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  return (
    <>
      <button 
        onClick={() => { setIsOpen(true); setStep('config'); }}
        className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-amber-500 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border border-amber-500/20 shadow-lg shadow-amber-500/5"
      >
        <Layers className="w-4 h-4" />
        Expansão em Lote
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-[40px] p-12 relative overflow-hidden"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl transition-all z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-amber-500/10 rounded-2xl">
                  <Layers className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
                    Expansão de Biblioteca
                  </h2>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                    Análise Inteligente de Lacunas Técnicas
                  </p>
                </div>
              </div>

              {step === 'config' ? (
                <div className="space-y-6">
                  <p className="text-zinc-400 text-sm font-medium">
                    Configure o foco da expansão em lote. A IA irá priorizar sugestões baseadas nas suas escolhas.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Qtd. Sugestões</label>
                      <select 
                        value={suggestionCount}
                        onChange={(e) => setSuggestionCount(Number(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white outline-none focus:border-amber-500 transition-colors"
                      >
                        <option value={3}>3 Técnicas</option>
                        <option value={5}>5 Técnicas</option>
                        <option value={10}>10 Técnicas</option>
                        <option value={15}>15 Técnicas</option>
                        <option value={20}>20 Técnicas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Foco por Faixa</label>
                      <select 
                        value={focusBelt}
                        onChange={(e) => setFocusBelt(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white outline-none focus:border-amber-500 transition-colors"
                      >
                        <option value="">Todas as Faixas</option>
                        <option value="Branca">Branca</option>
                        <option value="Azul">Azul</option>
                        <option value="Roxa">Roxa</option>
                        <option value="Marrom">Marrom</option>
                        <option value="Preta">Preta</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Foco por Fundamento</label>
                      <select 
                        value={focusCategory}
                        onChange={(e) => setFocusCategory(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white outline-none focus:border-amber-500 transition-colors"
                      >
                        <option value="">Todos os Fundamentos</option>
                        <option value="Quedas">Quedas</option>
                        <option value="Guardas">Guardas</option>
                        <option value="Passagens">Passagens</option>
                        <option value="Raspagens">Raspagens</option>
                        <option value="Finalizações">Finalizações</option>
                        <option value="Costas">Costas</option>
                        <option value="Cem Quilos">Cem Quilos</option>
                        <option value="Transições">Transições</option>
                        <option value="Emborcado">Emborcado</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={getSuggestions}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Analisar Lacunas e Sugerir
                  </button>
                </div>
              ) : loading && step === 'suggest' ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
                  <p className="text-zinc-500 font-black text-xs uppercase tracking-widest animate-pulse">
                    Analisando acervo atual...
                  </p>
                </div>
              ) : step === 'suggest' ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-zinc-400 text-sm font-medium">
                      Com base nas técnicas existentes, a IA sugere adicionar os seguintes fundamentos:
                    </p>
                    <button 
                      onClick={getSuggestions}
                      className="p-2 bg-zinc-900 hover:bg-zinc-800 text-amber-500 rounded-xl transition-colors"
                      title="Analisar Novamente"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {suggestions.map((s, i) => (
                      <div 
                        key={i}
                        onClick={() => toggleSelection(s.name)}
                        className={cn(
                          "p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4",
                          selectedSuggestions.includes(s.name) 
                            ? "bg-amber-500/10 border-amber-500/50" 
                            : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                          selectedSuggestions.includes(s.name)
                            ? "bg-amber-500 border-amber-500 text-white"
                            : "border-zinc-700"
                        )}>
                          {selectedSuggestions.includes(s.name) && <Check className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-black uppercase tracking-tight text-sm mb-1">{s.name}</h4>
                          <p className="text-zinc-500 text-xs leading-relaxed">{s.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={generateBatch}
                    disabled={selectedSuggestions.length === 0}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    Gerar {selectedSuggestions.length} Técnicas Selecionadas
                  </button>
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center gap-8">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-zinc-800"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 60}
                        strokeDashoffset={2 * Math.PI * 60 * (1 - progress.current / progress.total)}
                        className="text-amber-500 transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl font-black text-white">{progress.current}</span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase">de {progress.total}</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">
                      Arquitetando Biomecânica
                    </h3>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                      Gerando: {selectedSuggestions[progress.current - 1]}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const TechniqueForm = ({ technique, onSuccess, existingTechniques }: { technique?: Technique | null, onSuccess: () => void, existingTechniques: Technique[] }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Technique>>(technique || {
    name: '',
    position: '',
    category: '',
    belt: 'Branca',
    modality: 'Gi',
    initial_position: '',
    objective: '',
    steps: [''],
    common_errors: [''],
    technical_adjustments: '',
    defenses: [''],
    continuations: [''],
    variations: [''],
    visuals: {
      image_url: '',
      gif_url: '',
      video_url: '',
      illustration_url: ''
    }
  });

  useEffect(() => {
    if (technique) {
      setFormData(technique);
    } else {
      setFormData({
        name: '',
        position: '',
        category: '',
        belt: 'Branca',
        modality: 'Gi',
        initial_position: '',
        objective: '',
        steps: [''],
        common_errors: [''],
        technical_adjustments: '',
        defenses: [''],
        continuations: [''],
        variations: [''],
        visuals: {
          image_url: '',
          gif_url: '',
          video_url: '',
          illustration_url: ''
        }
      });
    }
  }, [technique]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicates if it's a new technique
    if (!technique?.id) {
      const isDuplicate = existingTechniques.some(
        t => t.name.toLowerCase() === formData.name?.toLowerCase() && 
             t.position.toLowerCase() === formData.position?.toLowerCase()
      );
      
      if (isDuplicate) {
        alert("Uma técnica com este nome e posição já existe na biblioteca.");
        return;
      }
    }

    setLoading(true);
    try {
      // Deep migration helper to scan all strings for base64
      const deepMigrate = async (obj: any): Promise<any> => {
        if (typeof obj === 'string') {
          if (obj.startsWith('data:')) {
            try {
              const response = await fetch(obj);
              const blob = await response.blob();
              const type = blob.type.split('/')[0] || 'media';
              const ext = blob.type.split('/')[1] || 'bin';
              const storageRef = ref(storage, `techniques/${type}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${ext}`);
              await uploadBytes(storageRef, blob);
              return await getDownloadURL(storageRef);
            } catch (err) {
              console.error("Erro na migração de base64:", err);
              return obj; // Fallback to original
            }
          }
          return obj;
        }
        if (Array.isArray(obj)) {
          return Promise.all(obj.map(item => deepMigrate(item)));
        }
        if (typeof obj === 'object' && obj !== null) {
          const newObj: any = {};
          for (const key in obj) {
            newObj[key] = await deepMigrate(obj[key]);
          }
          return newObj;
        }
        return obj;
      };

      const migratedData = await deepMigrate(formData);

      const techData = {
        ...migratedData,
        created_at: technique?.created_at || new Date().toISOString()
      };

      // Final size validation - Firestore limit is 1,048,576 bytes
      const jsonString = JSON.stringify(techData);
      const payloadSize = new TextEncoder().encode(jsonString).length;
      
      if (payloadSize > 1000000) {
        console.error("Payload too large:", payloadSize, techData);
        throw new Error(`A técnica é muito grande (${(payloadSize / 1024).toFixed(0)}KB). O limite do banco de dados é 1MB. Tente reduzir o texto ou remover mídias pesadas.`);
      }

      if (technique?.id) {
        await updateDoc(doc(db, 'techniques', technique.id), techData);
      } else {
        await addDoc(collection(db, 'techniques'), techData);
      }
      onSuccess();
    } catch (error: any) {
      console.error("Error saving technique:", error);
      alert(error.message || "Erro ao salvar técnica. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleArrayChange = (field: keyof Technique, index: number, value: string) => {
    const newArray = [...(formData[field] as string[])];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: keyof Technique) => {
    setFormData({ ...formData, [field]: [...(formData[field] as string[] || []), ''] });
  };

  const removeArrayItem = (field: keyof Technique, index: number) => {
    const newArray = [...(formData[field] as string[])];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest ml-4">Nome da Técnica</label>
          <input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest ml-4">Faixa</label>
          <select
            value={formData.belt}
            onChange={(e) => setFormData({ ...formData, belt: e.target.value as any })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
          >
            <option value="Branca">Branca</option>
            <option value="Azul">Azul</option>
            <option value="Roxa">Roxa</option>
            <option value="Marrom">Marrom</option>
            <option value="Preta">Preta</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest ml-4">Posição Inicial (Ponto de Partida)</label>
          <input
            required
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
            placeholder="Ex: Guarda Fechada, Cem Quilos, Em pé..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest ml-4">Categoria</label>
          <input
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest ml-4">Modalidade</label>
          <select
            value={formData.modality}
            onChange={(e) => setFormData({ ...formData, modality: e.target.value as any })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
          >
            <option value="Gi">Com Kimono (Gi)</option>
            <option value="No-Gi">Sem Kimono (No-Gi)</option>
            <option value="Both">Ambos</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest ml-4">Objetivo</label>
        <textarea
          required
          value={formData.objective}
          onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all h-24"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest ml-4">Passo a Passo</label>
          <button type="button" onClick={() => addArrayItem('steps')} className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
            <Plus className="w-3 h-3" /> Adicionar Passo
          </button>
        </div>
        {formData.steps?.map((step, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={step}
              onChange={(e) => handleArrayChange('steps', i, e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
            />
            <button type="button" onClick={() => removeArrayItem('steps', i)} className="p-3 text-zinc-500 hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest ml-4">Ilustração (GIF/Imagem/Vídeo)</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*,video/*,.gif"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 10 * 1024 * 1024) { // 10MB limit
                    alert("O arquivo é muito grande. O limite é 10MB.");
                    return;
                  }
                  setLoading(true);
                  try {
                    const storageRef = ref(storage, `techniques/illustrations/${Date.now()}_${file.name}`);
                    
                    const dataUrl = await new Promise<string>((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result as string);
                      reader.onerror = () => reject(new Error("Falha ao ler o arquivo localmente."));
                      reader.readAsDataURL(file);
                    });
                    
                    await uploadString(storageRef, dataUrl, 'data_url');
                    const downloadURL = await getDownloadURL(storageRef);
                    setFormData({
                      ...formData,
                      visuals: {
                        ...formData.visuals,
                        illustration_url: downloadURL
                      }
                    });
                  } catch (error) {
                    console.error("Error uploading illustration:", error);
                    alert("Erro ao fazer upload da ilustração. Verifique as permissões do Firebase Storage.");
                  } finally {
                    setLoading(false);
                  }
                }
              }}
              className="hidden"
              id="illustration-upload"
            />
            <label
              htmlFor="illustration-upload"
              className="flex items-center justify-center gap-3 w-full bg-zinc-900 border border-zinc-800 border-dashed rounded-2xl px-6 py-8 text-zinc-500 hover:text-emerald-500 hover:border-emerald-500/50 transition-all cursor-pointer"
            >
              {loading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Enviando...</span>
                </div>
              ) : formData.visuals?.illustration_url ? (
                <div className="flex flex-col items-center gap-2">
                  {formData.visuals.illustration_url.includes('video') || formData.visuals.illustration_url.includes('.mp4') ? (
                    <Video className="w-8 h-8 text-emerald-500" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-emerald-500" />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-widest">Arquivo Carregado</span>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Upload de Mídia</span>
                </>
              )}
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest ml-4">URL do Vídeo (YouTube)</label>
          <input
            value={formData.visuals?.video_url || ''}
            onChange={(e) => setFormData({ ...formData, visuals: { ...formData.visuals, video_url: e.target.value } })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (technique ? 'Salvar Alterações' : 'Criar Técnica')}
      </button>
    </form>
  );
};

const SubmissionForm = ({ technique, user, onSuccess }: { technique: Technique, user: User, onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const storageRef = ref(storage, `submissions/${user.id}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, 'technique_submissions'), {
        athlete_id: user.id,
        athlete_name: user.name,
        technique_id: technique.id,
        technique_name: technique.name,
        video_url: downloadUrl,
        status: 'pending',
        submitted_at: new Date().toISOString()
      });

      const progressId = `${user.id}_${technique.id}`;
      await setDoc(doc(db, 'student_technique_progress', progressId), {
        athlete_id: user.id,
        technique_id: technique.id,
        status: 'submitted',
        last_updated: new Date().toISOString()
      }, { merge: true });

      onSuccess();
    } catch (error) {
      console.error("Error submitting video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest ml-4">Selecione o Vídeo</label>
        <input
          type="file"
          accept="video/*"
          required
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
        />
        <p className="text-[10px] text-zinc-500 ml-4">O vídeo será enviado para avaliação.</p>
      </div>
      <button
        type="submit"
        disabled={loading || !file}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Enviar para Avaliação'}
      </button>
    </form>
  );
};

const SubmissionsList = ({ user }: { user: User | null }) => {
  const [submissions, setSubmissions] = useState<TechniqueSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'technique_submissions'), where('status', '==', 'pending'), orderBy('submitted_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TechniqueSubmission)));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleEvaluate = async (submission: TechniqueSubmission, status: 'validated' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'technique_submissions', submission.id), {
        status,
        professor_feedback: feedback,
        evaluated_by: user?.id,
        evaluated_at: new Date().toISOString()
      });

      const progressId = `${submission.athlete_id}_${submission.technique_id}`;
      
      await setDoc(doc(db, 'student_technique_progress', progressId), {
        status: status,
        last_updated: new Date().toISOString()
      }, { merge: true });

      setEvaluatingId(null);
      setFeedback('');
    } catch (error) {
      console.error("Error evaluating submission:", error);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;

  return (
    <div className="space-y-6">
      {submissions.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Nenhuma avaliação pendente</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {submissions.map(sub => (
            <div key={sub.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-emerald-500/30 transition-all">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h4 className="text-white font-black uppercase tracking-tight text-lg mb-1">{sub.technique_name}</h4>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Atleta: {sub.athlete_name}</p>
                </div>
                <div className="flex gap-2">
                  <a 
                    href={sub.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <PlayCircle className="w-4 h-4" /> Ver Vídeo
                  </a>
                  <button 
                    onClick={() => setEvaluatingId(sub.id)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Avaliar
                  </button>
                </div>
              </div>

              {evaluatingId === sub.id && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 pt-6 border-t border-zinc-800 space-y-4"
                >
                  <textarea
                    placeholder="Feedback técnico para o atleta..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all h-32"
                  />
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleEvaluate(sub, 'validated')}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      Validar Técnica
                    </button>
                    <button 
                      onClick={() => handleEvaluate(sub, 'rejected')}
                      className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      Solicitar Correção
                    </button>
                    <button 
                      onClick={() => setEvaluatingId(null)}
                      className="px-6 bg-zinc-800 text-zinc-400 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface AuditReport {
  duplicates: {
    technique_ids: string[];
    reason: string;
  }[];
  taxonomy_issues: {
    technique_id: string;
    issue: string;
    suggested_fix: string;
    suggested_category?: string;
    suggested_belt?: string;
  }[];
  quality_issues: {
    technique_id: string;
    issue: string;
    suggested_fix: string;
  }[];
  general_feedback: string;
}

const AILibraryAuditor = ({ techniques, onEdit, onDelete }: { techniques: Technique[], onEdit: (tech: Technique) => void, onDelete: (id: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [fixingId, setFixingId] = useState<string | null>(null);

  const handleAutoFix = async (tech: Technique, issue: string, suggested_fix: string, type: 'taxonomy' | 'quality') => {
    setFixingId(tech.id);
    try {
      const ai = getGenAI();
      
      let response;
      let retries = 3;
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-3.1-pro-preview",
            contents: `Você é um mestre faixa preta de Jiu-Jitsu Brasileiro (BJJ).
            Corrija a seguinte técnica baseada no problema e na sugestão fornecidos.
            
            Técnica Atual:
            ${JSON.stringify({
              name: tech.name,
              position: tech.position,
              category: tech.category,
              belt: tech.belt,
              objective: tech.objective
            })}
            
            Problema Identificado: ${issue}
            Sugestão de Correção: ${suggested_fix}
            
            Retorne APENAS o objeto JSON da técnica com os campos corrigidos (mantenha os campos que não precisam de correção iguais).
            Certifique-se de que 'category' e 'belt' sigam as regras de taxonomia se o problema for de taxonomia.`,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: GenAIType.OBJECT,
                properties: {
                  name: { type: GenAIType.STRING },
                  position: { type: GenAIType.STRING },
                  category: { type: GenAIType.STRING },
                  belt: { type: GenAIType.STRING },
                  objective: { type: GenAIType.STRING }
                },
                required: ["name", "position", "category", "belt", "objective"]
              }
            }
          });
          break; // Success
        } catch (error: any) {
          if (error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('429')) {
            retries--;
            if (retries === 0) throw error;
            const delay = Math.pow(2, 3 - retries) * 5000; // 5s, 10s, 20s
            console.warn(`Rate limit hit. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            throw error;
          }
        }
      }

      const correctedData = JSON.parse(response?.text || '{}');
      
      await updateDoc(doc(db, 'techniques', tech.id), {
        name: correctedData.name || tech.name,
        position: correctedData.position || tech.position,
        category: correctedData.category || tech.category,
        belt: correctedData.belt || tech.belt,
        objective: correctedData.objective || tech.objective,
        updated_at: new Date().toISOString()
      });

      if (report) {
        setReport({
          ...report,
          taxonomy_issues: type === 'taxonomy' ? report.taxonomy_issues.filter(i => i.technique_id !== tech.id) : report.taxonomy_issues,
          quality_issues: type === 'quality' ? report.quality_issues.filter(i => i.technique_id !== tech.id) : report.quality_issues,
        });
      }
    } catch (error) {
      console.error("Erro ao auto-corrigir:", error);
    } finally {
      setFixingId(null);
    }
  };

  const [fixing, setFixing] = useState(false);
  const [activeTab, setActiveTab] = useState<'report' | 'chat'>('report');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const ai = getGenAI();
      
      const bulkUpdateTool = {
        name: "bulkUpdateTechniques",
        description: "Atualiza múltiplas técnicas de uma vez. Útil para mudar categorias, faixas ou posições em massa.",
        parameters: {
          type: GenAIType.OBJECT,
          properties: {
            techniqueIds: { 
              type: GenAIType.ARRAY, 
              items: { type: GenAIType.STRING },
              description: "Lista de IDs das técnicas a serem atualizadas"
            },
            updates: {
              type: GenAIType.OBJECT,
              properties: {
                category: { type: GenAIType.STRING, description: "Nova categoria" },
                belt: { type: GenAIType.STRING, description: "Nova faixa" },
                modality: { type: GenAIType.STRING, description: "Nova modalidade" },
                position: { type: GenAIType.STRING, description: "Nova posição" }
              },
              description: "Campos a serem atualizados"
            }
          },
          required: ["techniqueIds", "updates"]
        }
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { 
            role: 'user', 
            parts: [{ 
              text: `Você é um assistente de elite para gerenciamento de biblioteca de Jiu-Jitsu Brasileiro.
              Sua tarefa é ajudar o usuário a organizar a biblioteca técnica através de comandos em massa.
              
              Biblioteca Atual:
              ${JSON.stringify(techniques.map(t => ({ id: t.id, name: t.name, category: t.category, position: t.position, belt: t.belt })))}
              
              Comando do Usuário: "${userMessage}"
              
              Se o usuário pedir para mover técnicas para uma nova categoria, identifique quais técnicas pertencem a essa categoria e use a ferramenta bulkUpdateTechniques.
              Seja proativo e inteligente na identificação das técnicas.` 
            }] 
          }
        ],
        config: {
          tools: [{ functionDeclarations: [bulkUpdateTool] }]
        }
      });

      const functionCalls = response.functionCalls;
      if (functionCalls) {
        for (const call of functionCalls) {
          if (call.name === 'bulkUpdateTechniques') {
            const { techniqueIds, updates } = call.args as any;
            
            // Execute updates
            const batch = techniqueIds.map((id: string) => 
              updateDoc(doc(db, 'techniques', id), {
                ...updates,
                updated_at: new Date().toISOString()
              })
            );
            
            await Promise.all(batch);
            
            setChatMessages(prev => [...prev, { 
              role: 'assistant', 
              content: `Comando executado com sucesso! Atualizei ${techniqueIds.length} técnicas. 
              Mudanças aplicadas: ${Object.entries(updates).map(([k, v]) => `${k}: ${v}`).join(', ')}.` 
            }]);
          }
        }
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: response.text || 'Não consegui processar esse comando. Tente ser mais específico.' }]);
      }
    } catch (error) {
      console.error("Erro no chat da auditoria:", error);
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Ocorreu um erro ao processar seu comando. Verifique sua conexão.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const fixLibrary = async () => {
    setFixing(true);
    try {
      const deepMigrate = async (obj: any): Promise<any> => {
        if (typeof obj === 'string') {
          if (obj.startsWith('data:')) {
            const response = await fetch(obj);
            const blob = await response.blob();
            const type = blob.type.split('/')[0] || 'media';
            const ext = blob.type.split('/')[1] || 'bin';
            const storageRef = ref(storage, `techniques/${type}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${ext}`);
            await uploadBytes(storageRef, blob);
            return await getDownloadURL(storageRef);
          }
          return obj;
        }
        if (Array.isArray(obj)) return Promise.all(obj.map(item => deepMigrate(item)));
        if (typeof obj === 'object' && obj !== null) {
          const newObj: any = {};
          for (const key in obj) newObj[key] = await deepMigrate(obj[key]);
          return newObj;
        }
        return obj;
      };

      let fixedCount = 0;
      for (const tech of techniques) {
        const jsonStr = JSON.stringify(tech);
        if (jsonStr.includes('data:')) {
          const migrated = await deepMigrate(tech);
          await updateDoc(doc(db, 'techniques', tech.id), migrated);
          fixedCount++;
        }
      }
      alert(`${fixedCount} técnicas foram corrigidas e migradas para o Storage.`);
    } catch (error) {
      console.error("Erro ao corrigir biblioteca:", error);
      alert("Erro ao corrigir biblioteca.");
    } finally {
      setFixing(false);
    }
  };

  const runAudit = async () => {
    setLoading(true);
    try {
      const ai = getGenAI();
      
      const simplifiedTechs = techniques.map(t => ({
        id: t.id,
        name: t.name,
        position: t.position,
        category: t.category,
        belt: t.belt,
        objective: t.objective
      }));

      let response;
      let retries = 3;
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Você é um mestre faixa preta de Jiu-Jitsu Brasileiro (BJJ) e um auditor de dados.
            Analise a seguinte biblioteca de técnicas de BJJ e identifique problemas.
            
            Biblioteca:
            ${JSON.stringify(simplifiedTechs)}
            
            Regras de Taxonomia:
            - Categorias permitidas: Quedas, Guardas, Passagens, Raspagens, Finalizações, Costas, Cem Quilos, Transições, Emborcado.
            - Faixas permitidas: Branca, Azul, Roxa, Marrom, Preta.
            
            Identifique:
            1. Duplicatas: Técnicas que são a mesma coisa, mesmo com nomes ligeiramente diferentes.
            2. Problemas de Taxonomia: Técnicas com categorias ou faixas incorretas ou fora do padrão.
            3. Problemas de Qualidade: Nomes confusos, objetivos vagos ou posições incorretas.
            
            Retorne um relatório em JSON.`,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: GenAIType.OBJECT,
                properties: {
                  duplicates: {
                    type: GenAIType.ARRAY,
                    items: {
                      type: GenAIType.OBJECT,
                      properties: {
                        technique_ids: { type: GenAIType.ARRAY, items: { type: GenAIType.STRING } },
                        reason: { type: GenAIType.STRING }
                      }
                    }
                  },
                  taxonomy_issues: {
                    type: GenAIType.ARRAY,
                    items: {
                      type: GenAIType.OBJECT,
                      properties: {
                        technique_id: { type: GenAIType.STRING },
                        issue: { type: GenAIType.STRING },
                        suggested_fix: { type: GenAIType.STRING },
                        suggested_category: { type: GenAIType.STRING },
                        suggested_belt: { type: GenAIType.STRING }
                      }
                    }
                  },
                  quality_issues: {
                    type: GenAIType.ARRAY,
                    items: {
                      type: GenAIType.OBJECT,
                      properties: {
                        technique_id: { type: GenAIType.STRING },
                        issue: { type: GenAIType.STRING },
                        suggested_fix: { type: GenAIType.STRING }
                      }
                    }
                  },
                  general_feedback: { type: GenAIType.STRING }
                }
              }
            }
          });
          break; // Success
        } catch (error: any) {
          if (error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('429')) {
            retries--;
            if (retries === 0) throw error;
            const delay = Math.pow(2, 3 - retries) * 5000; // 5s, 10s, 20s
            console.warn(`Rate limit hit. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            throw error;
          }
        }
      }

      const result = JSON.parse(response?.text || '{}');
      setReport(result);
    } catch (error) {
      console.error("Erro na auditoria:", error);
      alert("Erro ao realizar auditoria.");
    } finally {
      setLoading(false);
    }
  };

  const getTech = (id: string) => techniques.find(t => t.id === id);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-blue-500 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border border-blue-500/20 shadow-lg shadow-blue-500/5"
        title="Auditar Biblioteca com IA"
      >
        <ShieldCheck className="w-4 h-4" />
        Auditar
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] p-12 relative"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-2xl">
                    <ShieldCheck className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
                      Auditoria de Biblioteca
                    </h2>
                    <p className="text-zinc-500 text-sm font-medium">
                      Análise inteligente de duplicidade e taxonomia
                    </p>
                  </div>
                </div>
                <button
                  onClick={fixLibrary}
                  disabled={fixing}
                  className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-blue-500 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border border-blue-500/20 disabled:opacity-50"
                >
                  {fixing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  Otimizar Mídia
                </button>
              </div>

              <div className="flex gap-6 mb-8 border-b border-zinc-800">
                <button
                  onClick={() => setActiveTab('report')}
                  className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                    activeTab === 'report' ? 'text-emerald-500' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Relatório de Auditoria
                  {activeTab === 'report' && <motion.div layoutId="auditTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                    activeTab === 'chat' ? 'text-emerald-500' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Comandos de IA
                  {activeTab === 'chat' && <motion.div layoutId="auditTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
                </button>
              </div>

              {activeTab === 'report' ? (
                <>
                  {!report && !loading && (
                    <div className="text-center py-12">
                      <p className="text-zinc-400 mb-6">
                        A IA analisará todas as {techniques.length} técnicas cadastradas em busca de duplicatas, erros de taxonomia e problemas de qualidade.
                      </p>
                      <button
                        onClick={runAudit}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
                      >
                        Iniciar Auditoria
                      </button>
                    </div>
                  )}

                  {loading && (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                      <p className="text-zinc-400 font-medium animate-pulse">Analisando biblioteca técnica...</p>
                    </div>
                  )}

                  {report && !loading && (
                    <div className="space-y-8">
                      <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                        <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">Feedback Geral</h3>
                        <p className="text-zinc-400 text-sm">{report.general_feedback}</p>
                      </div>

                      {report.duplicates && report.duplicates.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Possíveis Duplicatas ({report.duplicates.length})
                          </h3>
                          {report.duplicates.map((dup, i) => (
                            <div key={i} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                              <p className="text-zinc-300 text-sm mb-4">{dup.reason}</p>
                              <div className="space-y-2">
                                {dup.technique_ids.map(id => {
                                  const tech = getTech(id);
                                  if (!tech) return null;
                                  return (
                                    <div key={id} className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                                      <div>
                                        <span className="text-white font-bold">{tech.name}</span>
                                        <span className="text-zinc-500 text-xs ml-2">{tech.position} • {tech.category}</span>
                                      </div>
                                      <div className="flex gap-2">
                                        <button onClick={() => { onEdit(tech); setIsOpen(false); }} className="p-2 bg-zinc-800 hover:bg-emerald-500 text-white rounded-lg transition-colors" title="Editar">
                                          <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => { onDelete(id); setIsOpen(false); }} className="p-2 bg-zinc-800 hover:bg-red-500 text-white rounded-lg transition-colors" title="Excluir">
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {report.taxonomy_issues && report.taxonomy_issues.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                            <Layers className="w-5 h-5" />
                            Problemas de Taxonomia ({report.taxonomy_issues.length})
                          </h3>
                          {report.taxonomy_issues.map((issue, i) => {
                            const tech = getTech(issue.technique_id);
                            if (!tech) return null;
                            return (
                              <div key={i} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex justify-between items-start">
                                <div>
                                  <h4 className="text-white font-bold mb-1">{tech.name}</h4>
                                  <p className="text-zinc-500 text-xs mb-3">Atual: {tech.category} • {tech.belt}</p>
                                  <p className="text-red-400 text-sm mb-1">Problema: {issue.issue}</p>
                                  <p className="text-emerald-400 text-sm">Sugestão: {issue.suggested_fix}</p>
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleAutoFix(tech, issue.issue, issue.suggested_fix, 'taxonomy')} 
                                    disabled={fixingId === tech.id}
                                    className="p-2 bg-zinc-800 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50" 
                                    title="Corrigir Automaticamente"
                                  >
                                    {fixingId === tech.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                  </button>
                                  <button onClick={() => { onEdit(tech); setIsOpen(false); }} className="p-2 bg-zinc-800 hover:bg-emerald-500 text-white rounded-lg transition-colors" title="Editar Manualmente">
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {report.quality_issues && report.quality_issues.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-black text-purple-500 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Problemas de Qualidade ({report.quality_issues.length})
                          </h3>
                          {report.quality_issues.map((issue, i) => {
                            const tech = getTech(issue.technique_id);
                            if (!tech) return null;
                            return (
                              <div key={i} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex justify-between items-start">
                                <div>
                                  <h4 className="text-white font-bold mb-1">{tech.name}</h4>
                                  <p className="text-red-400 text-sm mb-1">Problema: {issue.issue}</p>
                                  <p className="text-emerald-400 text-sm">Sugestão: {issue.suggested_fix}</p>
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleAutoFix(tech, issue.issue, issue.suggested_fix, 'quality')} 
                                    disabled={fixingId === tech.id}
                                    className="p-2 bg-zinc-800 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50" 
                                    title="Corrigir Automaticamente"
                                  >
                                    {fixingId === tech.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                  </button>
                                  <button onClick={() => { onEdit(tech); setIsOpen(false); }} className="p-2 bg-zinc-800 hover:bg-emerald-500 text-white rounded-lg transition-colors" title="Editar Manualmente">
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex justify-center pt-8">
                        <button
                          onClick={runAudit}
                          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Re-analisar
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col h-[60vh]">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                    {chatMessages.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageSquare className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Comandos de IA</h3>
                        <p className="text-zinc-500 text-xs max-w-xs mx-auto">
                          Dê ordens para organizar sua biblioteca. Ex: "Mova todas as técnicas de defesa para a categoria Defesas" ou "Mude a faixa de todas as raspagens para Azul".
                        </p>
                      </div>
                    )}
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                          msg.role === 'user' 
                            ? 'bg-emerald-500 text-white rounded-tr-none' 
                            : 'bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-tl-none'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-zinc-900 p-4 rounded-2xl rounded-tl-none border border-zinc-800">
                          <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleChatSubmit} className="relative">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Digite seu comando..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all pr-16"
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading || !chatInput.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const TechnicalLibraryView = ({ user }: { user: User | null }) => {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [progress, setProgress] = useState<StudentTechniqueProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBelt, setFilterBelt] = useState<string>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTechnique, setEditingTechnique] = useState<Technique | null>(null);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'evaluations'>('library');
  const [techniqueToDelete, setTechniqueToDelete] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<TechniqueSubmission[]>([]);

  const handleDeleteTechnique = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'techniques', id));
      setTechniqueToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `techniques/${id}`);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'techniques'), orderBy('name'));
    const unsubscribeTechs = onSnapshot(q, (snapshot) => {
      const techs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Technique));
      setTechniques(techs);
      setLoading(false);
    });

    let unsubscribeProgress = () => {};
    let unsubscribeSubmissions = () => {};
    if (user?.role === 'athlete') {
      const qProgress = query(collection(db, 'student_technique_progress'), where('athlete_id', '==', user.id));
      unsubscribeProgress = onSnapshot(qProgress, (snapshot) => {
        const prog = snapshot.docs.map(doc => doc.data() as StudentTechniqueProgress);
        setProgress(prog);
      });

      const qSubmissions = query(collection(db, 'technique_submissions'), where('athlete_id', '==', user.id));
      unsubscribeSubmissions = onSnapshot(qSubmissions, (snapshot) => {
        const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TechniqueSubmission));
        setSubmissions(subs);
      });
    }

    return () => {
      unsubscribeTechs();
      unsubscribeProgress();
      unsubscribeSubmissions();
    };
  }, [user]);

  const filteredTechniques = techniques.filter(tech => {
    const normalizeBelt = (b: string) => b ? b.split(' (')[0].trim().toLowerCase() : '';
    const matchesBelt = filterBelt === 'all' || normalizeBelt(tech.belt) === normalizeBelt(filterBelt);
    const matchesPosition = filterPosition === 'all' || tech.position === filterPosition;
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tech.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tech.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tech.belt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBelt && matchesPosition && matchesSearch;
  });

  const getProgressStatus = (techId: string) => {
    return progress.find(p => p.technique_id === techId)?.status || 'not_started';
  };

  const belts = ['Branca', 'Azul', 'Roxa', 'Marrom', 'Preta'];
  const positions = Array.from(new Set(techniques.map(t => t.position))).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 uppercase">
          <Library className="w-8 h-8 text-emerald-500" />
          Biblioteca Técnica
        </h2>
        
        <div className="flex items-center gap-3">
          {(user?.role === 'professor' || user?.role === 'developer') && (
            <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              <button 
                onClick={() => setActiveTab('library')}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === 'library' ? "bg-emerald-500 text-white" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                Biblioteca
              </button>
              <button 
                onClick={() => setActiveTab('evaluations')}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === 'evaluations' ? "bg-emerald-500 text-white" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                Avaliações
              </button>
            </div>
          )}

          {user?.role === 'developer' && activeTab === 'library' && (
            <div className="flex items-center gap-3">
              <AILibraryAuditor 
                techniques={techniques}
                onEdit={(tech) => {
                  setEditingTechnique(tech);
                  setIsFormOpen(true);
                }}
                onDelete={(id) => {
                  setTechniqueToDelete(id);
                }}
              />
              <LibraryProgressDashboard techniques={techniques} />
              <AIBatchTechniqueGenerator 
                existingTechniques={techniques} 
                onComplete={() => {
                  // The onSnapshot listener in TechnicalLibraryView will handle the update
                }} 
              />
              <AITechniqueGenerator onGenerated={(tech) => {
                setEditingTechnique(tech as Technique);
                setIsFormOpen(true);
              }} />
              <button 
                onClick={() => { setEditingTechnique(null); setIsFormOpen(true); }}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" />
                Adicionar Técnica
              </button>
            </div>
          )}
        </div>
      </div>

      {activeTab === 'evaluations' ? (
        <SubmissionsList user={user} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar técnica ou posição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
        
        <select
          value={filterBelt}
          onChange={(e) => setFilterBelt(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
        >
          <option value="all">Todas as Faixas</option>
          {belts.map(belt => (
            <option key={belt} value={belt}>{belt}</option>
          ))}
        </select>

        <select
          value={filterPosition}
          onChange={(e) => setFilterPosition(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
        >
          <option value="all">Todas as Posições</option>
          {positions.map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechniques.map((tech) => (
          <div 
            key={tech.id}
            onClick={() => setSelectedTechnique(tech)}
            className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 hover:border-emerald-500/50 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit",
                  (() => {
                    const b = tech.belt ? tech.belt.split(' (')[0].trim().toLowerCase() : '';
                    return b === 'branca' ? "bg-white text-black" :
                           b === 'azul' ? "bg-blue-600 text-white" :
                           b === 'roxa' ? "bg-purple-600 text-white" :
                           b === 'marrom' ? "bg-amber-800 text-white" :
                           b === 'preta' ? "bg-black text-white border border-zinc-800" :
                           "bg-zinc-800 text-white border border-zinc-700";
                  })()
                )}>
                  Faixa {tech.belt}
                </span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest w-fit",
                  tech.modality === 'Gi' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                  tech.modality === 'No-Gi' ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                  "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                )}>
                  {tech.modality === 'Gi' ? 'Com Kimono' : tech.modality === 'No-Gi' ? 'Sem Kimono' : 'Gi & No-Gi'}
                </span>
              </div>
              {user?.role === 'athlete' && (
                <span className={cn(
                  "px-2 py-1 rounded-md text-[8px] font-bold uppercase",
                  getProgressStatus(tech.id) === 'validated' ? "bg-emerald-500/20 text-emerald-500" :
                  getProgressStatus(tech.id) === 'submitted' ? "bg-blue-500/20 text-blue-500" :
                  getProgressStatus(tech.id) === 'rejected' ? "bg-amber-500/20 text-amber-500" :
                  getProgressStatus(tech.id) === 'studying' ? "bg-zinc-800 text-zinc-400" :
                  "bg-zinc-800/50 text-zinc-500"
                )}>
                  {getProgressStatus(tech.id) === 'validated' ? 'Validada' :
                   getProgressStatus(tech.id) === 'submitted' ? 'Em Avaliação' :
                   getProgressStatus(tech.id) === 'rejected' ? 'Correções' :
                   getProgressStatus(tech.id) === 'studying' ? 'Estudando' : 'Não Iniciada'}
                </span>
              )}
            </div>

            <h3 className="text-xl font-black text-white mb-2 group-hover:text-emerald-500 transition-colors uppercase tracking-tight">
              {tech.name}
            </h3>
            
            <div className="flex flex-col gap-1 mb-4">
              <div className="flex items-center gap-1.5 text-emerald-500">
                <MapPin className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Ponto de Partida:</span>
              </div>
              <p className="text-zinc-300 text-sm font-bold uppercase tracking-tight">
                {tech.position}
              </p>
              <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-wider">
                Categoria: {tech.category}
              </p>
            </div>

            <div className="flex items-center gap-4 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-1">
                <PlayCircle className="w-3 h-3" />
                {tech.visuals?.video_url ? 'Vídeo Disponível' : 'Sem Vídeo'}
              </div>
              <div className="flex items-center gap-1">
                <List className="w-3 h-3" />
                {tech.steps.length} Passos
              </div>
            </div>

            {user?.role === 'developer' && (
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); setEditingTechnique(tech); setIsFormOpen(true); }}
                  className="p-2 bg-zinc-800 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                  title="Editar Técnica"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setTechniqueToDelete(tech.id); }}
                  className="p-2 bg-zinc-800 hover:bg-red-500 text-white rounded-lg transition-colors"
                  title="Excluir Técnica"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {techniqueToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-[40px] p-12 relative text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">
                Excluir Técnica?
              </h2>
              <p className="text-zinc-400 text-sm mb-8">
                Esta ação não pode ser desfeita. A técnica será removida permanentemente da biblioteca.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setTechniqueToDelete(null)}
                  className="flex-1 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleDeleteTechnique(techniqueToDelete)}
                  className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-500/20"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Technique Details Modal */}
      <AnimatePresence>
        {selectedTechnique && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedTechnique(null)}
                className="absolute top-8 right-8 p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl transition-all z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-12">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest",
                    (() => {
                      const b = selectedTechnique.belt ? selectedTechnique.belt.split(' (')[0].trim().toLowerCase() : '';
                      return b === 'branca' ? "bg-white text-black" :
                             b === 'azul' ? "bg-blue-600 text-white" :
                             b === 'roxa' ? "bg-purple-600 text-white" :
                             b === 'marrom' ? "bg-amber-800 text-white" :
                             b === 'preta' ? "bg-black text-white border border-zinc-800" :
                             "bg-zinc-800 text-white border border-zinc-700";
                    })()
                  )}>
                    Faixa {selectedTechnique.belt}
                  </span>
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest",
                    selectedTechnique.modality === 'Gi' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                    selectedTechnique.modality === 'No-Gi' ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  )}>
                    {selectedTechnique.modality === 'Gi' ? 'Com Kimono (Gi)' : selectedTechnique.modality === 'No-Gi' ? 'Sem Kimono (No-Gi)' : 'Ambos (Gi & No-Gi)'}
                  </span>
                </div>

                <div className="flex flex-col gap-2 mb-8">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Ponto de Partida / Posição Inicial</span>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-3xl font-black text-white uppercase tracking-tighter">{selectedTechnique.position}</span>
                    <span className="text-zinc-600 font-black text-sm uppercase tracking-widest">• {selectedTechnique.category}</span>
                  </div>
                </div>

                <h2 className="text-5xl font-black text-white mb-8 tracking-tighter uppercase leading-none">
                  {selectedTechnique.name}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    {selectedTechnique.visuals?.illustration_url && (
                      <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 relative group/media">
                        {(selectedTechnique.visuals.illustration_url.startsWith('data:video') || 
                          selectedTechnique.visuals.illustration_url.toLowerCase().includes('.mp4') ||
                          selectedTechnique.visuals.illustration_url.toLowerCase().includes('video')) ? (
                          <video 
                            src={selectedTechnique.visuals.illustration_url} 
                            controls 
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                          />
                        ) : (
                          <img 
                            src={selectedTechnique.visuals.illustration_url} 
                            alt={selectedTechnique.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Ilustração Técnica</span>
                        </div>
                      </div>
                    )}

                    {selectedTechnique.visuals?.video_url && (
                      <div className="aspect-video bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
                        <iframe
                          src={selectedTechnique.visuals.video_url.replace('watch?v=', 'embed/')}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    )}

                    <div className="bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800">
                      <h4 className="text-emerald-500 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Objetivo Técnico
                      </h4>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        {selectedTechnique.objective}
                      </p>
                    </div>

                    <div className="bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800">
                      <h4 className="text-amber-500 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Erros Comuns
                      </h4>
                      <ul className="space-y-3">
                        {selectedTechnique.common_errors?.map((error, i) => (
                          <li key={i} className="text-zinc-400 text-sm flex items-start gap-3">
                            <span className="text-amber-500 mt-1">•</span>
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                        <List className="w-4 h-4 text-emerald-500" />
                        Passo a Passo
                      </h4>
                      <div className="space-y-4">
                        {selectedTechnique.steps?.map((step, i) => (
                          <div key={i} className="flex gap-4 group">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-black text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                              {i + 1}
                            </div>
                            <p className="text-zinc-300 text-sm leading-relaxed pt-1">
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-zinc-900/30 rounded-2xl p-6 border border-zinc-800">
                        <h5 className="text-zinc-500 font-black text-[10px] uppercase tracking-widest mb-3">Defesas</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedTechnique.defenses?.map((d, i) => (
                            <span key={i} className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-300">{d}</span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-zinc-900/30 rounded-2xl p-6 border border-zinc-800">
                        <h5 className="text-zinc-500 font-black text-[10px] uppercase tracking-widest mb-3">Continuações</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedTechnique.continuations?.map((c, i) => (
                            <span key={i} className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-300">{c}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {user?.role === 'athlete' && (
                      <div className="pt-8 border-t border-zinc-800 flex flex-col gap-4">
                        <button 
                          onClick={async () => {
                            const progressId = `${user.id}_${selectedTechnique.id}`;
                            await setDoc(doc(db, 'student_technique_progress', progressId), {
                              athlete_id: user.id,
                              technique_id: selectedTechnique.id,
                              status: 'studying',
                              last_updated: new Date().toISOString()
                            }, { merge: true });
                          }}
                          disabled={getProgressStatus(selectedTechnique.id) !== 'not_started'}
                          className={cn(
                            "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                            getProgressStatus(selectedTechnique.id) === 'not_started' 
                              ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                              : getProgressStatus(selectedTechnique.id) === 'rejected'
                              ? "bg-amber-500/20 text-amber-500 cursor-default"
                              : "bg-zinc-900 text-zinc-500 cursor-default"
                          )}
                        >
                          {getProgressStatus(selectedTechnique.id) === 'not_started' ? 'Iniciar Estudo desta Técnica' : 
                           getProgressStatus(selectedTechnique.id) === 'studying' ? 'Você está estudando esta técnica' :
                           getProgressStatus(selectedTechnique.id) === 'rejected' ? 'Correções Solicitadas' :
                           getProgressStatus(selectedTechnique.id) === 'submitted' ? 'Vídeo enviado para avaliação' : 'Técnica Validada'}
                        </button>

                        {(getProgressStatus(selectedTechnique.id) === 'studying' || getProgressStatus(selectedTechnique.id) === 'rejected') && (
                          <button 
                            onClick={() => setIsSubmissionOpen(true)}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                          >
                            <Video className="w-4 h-4" />
                            Enviar Vídeo para Avaliação
                          </button>
                        )}

                        {/* Submission History */}
                        {submissions.filter(s => s.technique_id === selectedTechnique.id).length > 0 && (
                          <div className="mt-6 space-y-4">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Histórico de Avaliações</h4>
                            {submissions
                              .filter(s => s.technique_id === selectedTechnique.id)
                              .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
                              .map(sub => (
                                <div key={sub.id} className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-zinc-400">
                                      {new Date(sub.submitted_at).toLocaleDateString()}
                                    </span>
                                    <span className={cn(
                                      "px-2 py-1 rounded text-[10px] font-bold uppercase",
                                      sub.status === 'validated' ? "bg-emerald-500/20 text-emerald-500" :
                                      sub.status === 'rejected' ? "bg-amber-500/20 text-amber-500" :
                                      "bg-blue-500/20 text-blue-500"
                                    )}>
                                      {sub.status === 'validated' ? 'Validado' :
                                       sub.status === 'rejected' ? 'Correções' : 'Em Análise'}
                                    </span>
                                  </div>
                                  <a 
                                    href={sub.video_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-3"
                                  >
                                    <Video className="w-4 h-4" />
                                    Ver vídeo enviado
                                  </a>
                                  {(sub.professor_feedback || sub.feedback) && (
                                    <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800">
                                      <p className="text-xs text-zinc-400 font-bold mb-1 uppercase">Feedback do Professor:</p>
                                      <p className="text-sm text-zinc-300">{sub.professor_feedback || sub.feedback}</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Technique Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[40px] p-12 relative"
            >
              <button 
                onClick={() => setIsFormOpen(false)}
                className="absolute top-8 right-8 p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase">
                {editingTechnique ? 'Editar Técnica' : 'Nova Técnica'}
              </h2>

              <TechniqueForm 
                technique={editingTechnique} 
                onSuccess={() => setIsFormOpen(false)} 
                existingTechniques={techniques}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* Submission Form Modal */}
      <AnimatePresence>
        {isSubmissionOpen && selectedTechnique && user && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-zinc-800 w-full max-w-xl rounded-[40px] p-12 relative"
            >
              <button 
                onClick={() => setIsSubmissionOpen(false)}
                className="absolute top-8 right-8 p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">
                Enviar Avaliação
              </h2>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-8">
                {selectedTechnique.name}
              </p>

              <SubmissionForm 
                technique={selectedTechnique}
                user={user}
                onSuccess={() => {
                  setIsSubmissionOpen(false);
                  setSelectedTechnique(null);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        </>
      )}
    </div>
  );
};

const ChallengesView = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    const qChallenges = query(collection(db, 'challenges'));
    const unsubscribeChallenges = onSnapshot(qChallenges, (snapshot) => {
      setChallenges(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Challenge)));
    }, (error) => console.error('Challenges subscription error:', error));

    const qMissions = query(collection(db, 'missions'));
    const unsubscribeMissions = onSnapshot(qMissions, (snapshot) => {
      setMissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mission)));
    }, (error) => console.error('Missions subscription error:', error));

    return () => {
      unsubscribeChallenges();
      unsubscribeMissions();
    };
  }, []);

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-8 flex items-center gap-3">
          <Flag className="w-8 h-8 text-emerald-500" />
          DESAFIOS ATIVOS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800 flex flex-col group hover:border-emerald-500/50 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Trophy size={80} className="text-emerald-500" />
              </div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">
                  {challenge.type}
                </span>
                <span className="text-emerald-500 font-black text-lg tracking-tighter">+{challenge.points} PTS</span>
              </div>
              <h3 className="text-xl font-black text-white mb-3 group-hover:text-emerald-400 transition-colors uppercase tracking-tight relative z-10">{challenge.title}</h3>
              <p className="text-zinc-400 text-sm mb-8 flex-1 leading-relaxed relative z-10">{challenge.description}</p>
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-6 relative z-10">
                <Clock size={12} />
                Expira em: {new Date(challenge.end_date).toLocaleDateString('pt-BR')}
              </div>
              <button className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 relative z-10">
                Participar do Desafio
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-8 flex items-center gap-3">
          <Award className="w-8 h-8 text-emerald-500" />
          MISSÕES SEMANAIS
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {missions.map((mission) => (
            <div key={mission.id} className="bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-800 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:bg-emerald-500 transition-colors shadow-xl">
                  <Trophy className="w-8 h-8 text-emerald-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight mb-1">{mission.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{mission.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-500 font-black text-xl tracking-tighter">+{mission.points} PTS</div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Progresso: 0%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const CategoryNavItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-1.5 px-6 py-3 rounded-2xl transition-all min-w-[110px] shrink-0 relative",
      active 
        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
        : "bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
    )}
  >
    <Icon size={20} />
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    {active && (
      <motion.div 
        layoutId="activeCategory"
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
      />
    )}
  </button>
);

const SubNavItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap border shrink-0",
      active 
        ? "bg-zinc-800 text-emerald-500 border-emerald-500/30" 
        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 border-transparent"
    )}
  >
    <Icon size={14} />
    <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
    )}
  >
    <Icon size={20} className={cn(active ? "text-white" : "group-hover:text-emerald-400")} />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const StatCard = ({ label, value, trend, icon: Icon, color }: { label: string, value: string | number, trend?: string, icon: any, color: string }) => (
  <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2 rounded-lg", color)}>
        <Icon size={20} className="text-white" />
      </div>
      {trend && (
        <span className={cn("text-xs font-medium px-2 py-1 rounded-full", trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
          {trend}
        </span>
      )}
    </div>
    <div className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</div>
    <div className="text-2xl font-bold text-white">{value}</div>
  </div>
);

const SearchableAthleteSelect = ({ 
  athletes, 
  academies = [],
  selectedId, 
  onSelect, 
  label = "Selecionar Atleta" 
}: { 
  athletes: any[], 
  academies?: Academy[],
  selectedId: string, 
  onSelect: (id: string, name: string) => void,
  label?: string
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedAthlete = athletes.find(a => a.id === selectedId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAthletes = athletes.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm flex items-center justify-between cursor-pointer hover:border-zinc-600 transition-all"
      >
        <span className={selectedAthlete ? "text-white" : "text-zinc-500"}>
          {selectedAthlete ? selectedAthlete.name : "Buscar atleta..."}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-zinc-500 transition-transform", isOpen && "rotate-180")} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-2 border-b border-zinc-700">
              <div className="flex items-center gap-2 bg-zinc-900 rounded-lg px-3 py-2">
                <Search size={14} className="text-zinc-500" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Filtrar por nome..."
                  className="bg-transparent border-none outline-none text-white text-xs w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filteredAthletes.length > 0 ? (
                filteredAthletes.map(athlete => (
                  <button
                    type="button"
                    key={athlete.id}
                    onClick={() => {
                      onSelect(athlete.id, athlete.name);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-zinc-700 transition-colors border-b border-zinc-700 last:border-none group"
                  >
                    <div className="text-sm font-bold text-white group-hover:text-emerald-400">{athlete.name}</div>
                    <div className="text-[10px] text-zinc-500 uppercase">{athlete.belt} • {academies.find(a => a.id === athlete.academy_id)?.name || athlete.team || 'Sem Academia'}</div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-zinc-500">Nenhum atleta encontrado</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Hooks ---

const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    
    // In a real Firebase app, we'd use a collection for notifications
    // For now, we'll simulate it with a local state but could easily move to Firestore
    const q = query(collection(db, 'notifications'), where('user_id', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setNotifications(newNotifications);
    }, (error) => console.error('Notifications subscription error:', error));

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `notifications/${id}`);
    }
  };

  return { notifications, markAsRead };
};

// --- Views ---

const PhysicalEvaluationForm = ({ athletes, onSuccess, editingMetric }: { athletes: Athlete[], onSuccess: () => void, editingMetric?: any }) => {
  const [formData, setFormData] = useState(() => {
    const defaults = { 
      athlete_id: '', 
      pull_ups: 0, 
      push_ups: 0, 
      kimono_grip_seconds: 0, 
      burpees: 0, 
      abdominals: 0,
      sprint_seconds: 0, 
      shuttle_run_seconds: 0,
      rounds_resistance: 0, 
      weight: 0,
      date: new Date().toISOString().split('T')[0]
    };
    if (editingMetric) {
      const { id, athleteName, athleteScore, athleteId, sit_ups, abdominals, ...rest } = editingMetric;
      return { ...defaults, ...rest, abdominals: abdominals || sit_ups || 0, athlete_id: athleteId, date: editingMetric.date ? editingMetric.date.split('T')[0] : defaults.date };
    }
    return defaults;
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.athlete_id) return;

    try {
      // Calculate TAF Score (0-100) based on Matrix (Page 8)
      // Simplified logic for demo: average of performance levels
      const calculateScore = () => {
        let points = 0;
        // Barra (Elite 16+)
        if (formData.pull_ups >= 16) points += 20;
        else if (formData.pull_ups >= 11) points += 15;
        else if (formData.pull_ups >= 6) points += 10;
        else points += 5;

        // Flexão (Elite 70+)
        if (formData.push_ups >= 70) points += 20;
        else if (formData.push_ups >= 50) points += 15;
        else if (formData.push_ups >= 35) points += 10;
        else points += 5;

        // Grip (Elite 120s+)
        if (formData.kimono_grip_seconds >= 120) points += 20;
        else if (formData.kimono_grip_seconds >= 90) points += 15;
        else if (formData.kimono_grip_seconds >= 60) points += 10;
        else points += 5;

        // Sprint (Elite 5s)
        if (formData.sprint_seconds <= 5) points += 20;
        else if (formData.sprint_seconds <= 6) points += 15;
        else if (formData.sprint_seconds <= 7) points += 10;
        else points += 5;

        // Burpees (Elite 65+)
        if (formData.burpees >= 65) points += 20;
        else if (formData.burpees >= 50) points += 15;
        else if (formData.burpees >= 35) points += 10;
        else points += 5;

        // Abdominais (Elite 50+)
        if (formData.abdominals >= 50) points += 20;
        else if (formData.abdominals >= 40) points += 15;
        else if (formData.abdominals >= 30) points += 10;
        else points += 5;

        return points;
      };

      const totalScore = calculateScore();
      const athlete = athletes.find(a => a.id === formData.athlete_id);
      
      // Calculate new total PAC score and classification
      const updatedAthlete = athlete ? {
        ...athlete,
        latest_physical_power: totalScore,
        latest_weight: formData.weight
      } : null;
      
      const pacMetrics = updatedAthlete ? calculatePACScore(updatedAthlete) : { score: 0, classification: 'Base PAC' };

      const evalData = {
        ...formData,
        total_score: totalScore,
        date: editingMetric && editingMetric.date.startsWith(formData.date) ? editingMetric.date : new Date(`${formData.date}T12:00:00Z`).toISOString(),
      };
      
      const batch = writeBatch(db);
      const evalRef = editingMetric 
        ? doc(db, `athletes/${formData.athlete_id}/physical_evaluations`, editingMetric.id)
        : doc(collection(db, `athletes/${formData.athlete_id}/physical_evaluations`));

      if (editingMetric) {
        batch.update(evalRef, evalData);
      } else {
        batch.set(evalRef, evalData);
      }
      
      const athleteRef = doc(db, 'athletes', formData.athlete_id);
      batch.update(athleteRef, { 
        score: pacMetrics.score,
        classification: pacMetrics.classification,
        latest_weight: formData.weight,
        latest_physical_power: totalScore
      });

      // Add notification
      const notificationRef = doc(collection(db, 'notifications'));
      batch.set(notificationRef, {
        type: 'NOTIFICATION',
        title: 'Nova Avaliação TAF (PAC)',
        message: `Atleta ${athlete?.name} realizou um TAF. Pontuação: ${totalScore}/100`,
        read: false,
        createdAt: Timestamp.now()
      });

      await batch.commit();
      
      if (athlete) {
        createAutomaticPost(
          athlete.academy_id || '',
          formData.athlete_id,
          athlete.name,
          `Finalizou uma Avaliação TAF PAC! 🚀\nScore TAF: ${totalScore}/100\nFoco: Alto Rendimento.`,
          { type: 'taf', score: totalScore }
        );
      }

      onSuccess();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `athletes/${formData.athlete_id}/physical_evaluations`);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <SearchableAthleteSelect 
        athletes={athletes}
        selectedId={formData.athlete_id}
        onSelect={(id) => setFormData({ ...formData, athlete_id: id })}
        label="Atleta"
      />
      <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Data da Avaliação</label>
        <input 
          type="date" 
          value={formData.date}
          max={new Date().toISOString().split('T')[0]}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
          onChange={e => setFormData({...formData, date: e.target.value})} 
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Barra Fixa (Força)</label>
          <input 
            type="number" 
            placeholder="Reps" 
            value={formData.pull_ups}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
            onChange={e => setFormData({...formData, pull_ups: parseInt(e.target.value) || 0})} 
          />
          <p className="text-[9px] text-zinc-600 ml-2 italic">Elite: 16+ | Avançado: 11-15</p>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Flexão 2 min (Resistência)</label>
          <input 
            type="number" 
            placeholder="Reps" 
            value={formData.push_ups}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
            onChange={e => setFormData({...formData, push_ups: parseInt(e.target.value) || 0})} 
          />
          <p className="text-[9px] text-zinc-600 ml-2 italic">Elite: 70+ | Avançado: 50-69</p>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Isometria Pegada (Grip)</label>
          <input 
            type="number" 
            placeholder="Segundos" 
            value={formData.kimono_grip_seconds}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
            onChange={e => setFormData({...formData, kimono_grip_seconds: parseInt(e.target.value) || 0})} 
          />
          <p className="text-[9px] text-zinc-600 ml-2 italic">Elite: 120s+ | Avançado: 90s+</p>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Sprint 50m (Explosão)</label>
          <input 
            type="number" 
            step="0.1" 
            placeholder="Segundos" 
            value={formData.sprint_seconds}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
            onChange={e => setFormData({...formData, sprint_seconds: parseFloat(e.target.value) || 0})} 
          />
          <p className="text-[9px] text-zinc-600 ml-2 italic">Elite: &lt; 5s | Avançado: 5-6s</p>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Burpees 2 min</label>
          <input 
            type="number" 
            placeholder="Reps" 
            value={formData.burpees}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
            onChange={e => setFormData({...formData, burpees: parseInt(e.target.value) || 0})} 
          />
          <p className="text-[9px] text-zinc-600 ml-2 italic">Elite: 65+ | Avançado: 50-64</p>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Abdominais 2 min</label>
          <input 
            type="number" 
            placeholder="Reps" 
            value={formData.abdominals}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
            onChange={e => setFormData({...formData, abdominals: parseInt(e.target.value) || 0})} 
          />
          <p className="text-[9px] text-zinc-600 ml-2 italic">Elite: 50+ | Avançado: 40-49</p>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Shuttle Run (Agilidade)</label>
          <input 
            type="number" 
            step="0.1" 
            placeholder="Segundos" 
            value={formData.shuttle_run_seconds}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
            onChange={e => setFormData({...formData, shuttle_run_seconds: parseFloat(e.target.value) || 0})} 
          />
          <p className="text-[9px] text-zinc-600 ml-2 italic">Elite: &lt; 9s | Avançado: 9-10s</p>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Rounds Resistência (3x5)</label>
          <input 
            type="number" 
            placeholder="Rounds" 
            value={formData.rounds_resistance}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
            onChange={e => setFormData({...formData, rounds_resistance: parseInt(e.target.value) || 0})} 
          />
          <p className="text-[9px] text-zinc-600 ml-2 italic">Rounds completos sem queda de rendimento.</p>
        </div>
        <div className="space-y-1 col-span-2">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Peso Atual (kg)</label>
          <input 
            type="number" 
            step="0.1" 
            placeholder="kg" 
            value={formData.weight}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
            onChange={e => setFormData({...formData, weight: parseFloat(e.target.value) || 0})} 
          />
          <p className="text-[9px] text-zinc-600 ml-2 italic">Peso corporal no momento da avaliação.</p>
        </div>
      </div>
      <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20">Salvar TAF PAC</button>
    </form>
  );
};

const createAutomaticPost = async (academyId: string, athleteId: string, athleteName: string, content: string, metadata?: any) => {
  try {
    await addDoc(collection(db, 'posts'), {
      academy_id: academyId,
      athlete_id: athleteId,
      athlete_name: athleteName,
      content,
      type: 'automatic',
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
      metadata
    });
    
    // Send Telegram notification
    await sendTelegramNotification(
      academyId, 
      `<b>Atualização Automática de ${athleteName}:</b>\n\n${content}`
    );
  } catch (error) {
    console.error('Error creating automatic post:', error);
  }
};

const PerformanceAIView = ({ athletes }: { athletes: Athlete[] }) => {
  const aiInsights = useMemo(() => {
    return athletes.map(a => {
      const consistency = (a.training_count_30d || 0) / 12;
      
      // PAC Readiness: Psych (40%) + Sleep (30%) + HRV (30%)
      const psychNorm = (a.latest_psych_score || 100) / 200;
      const sleepNorm = (a.sleep_telemetry?.deep_sleep_pct || 75) / 100;
      const hrvNorm = Math.min(1, (a.biometrics?.hrv || 60) / 100);
      
      const readiness = (psychNorm * 0.4) + (sleepNorm * 0.3) + (hrvNorm * 0.3);
      
      const performance = a.score / 500;
      
      const injuryRisk = (consistency > 1.3 && readiness < 0.5) ? 'Alto' : (consistency > 1.1 || readiness < 0.6) ? 'Médio' : 'Baixo';
      
      let prediction = 'Evolução constante';
      if (performance > 0.85 && readiness > 0.8) prediction = 'Pico de Performance / Favorito ao Ouro';
      else if (performance > 0.7) prediction = 'Alta probabilidade de pódio';
      else if (readiness < 0.4) prediction = 'Necessita de Descanso / Recuperação';
      
      return {
        name: a.name,
        consistency: (consistency * 100).toFixed(0) + '%',
        performance: (performance * 100).toFixed(0) + '%',
        readiness: (readiness * 100).toFixed(0) + '%',
        injuryRisk,
        prediction
      };
    });
  }, [athletes]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
          <Brain className="w-8 h-8 text-emerald-500" />
          PAC AI INSIGHTS
        </h2>
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
          Motor de Predição Ativo
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target size={80} className="text-emerald-500" />
          </div>
          <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">Precisão do Modelo</div>
          <div className="text-4xl font-black text-white tracking-tighter">94.2%</div>
          <div className="text-[10px] text-emerald-500 font-bold mt-4 flex items-center gap-1">
            <TrendingUp size={12} /> +1.2% vs mês anterior
          </div>
        </div>
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity size={80} className="text-rose-500" />
          </div>
          <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">Atletas em Risco</div>
          <div className="text-4xl font-black text-rose-500 tracking-tighter">{aiInsights.filter(i => i.injuryRisk === 'Alto').length}</div>
          <div className="text-[10px] text-zinc-500 font-bold mt-4">Baseado em carga de treino</div>
        </div>
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Trophy size={80} className="text-amber-500" />
          </div>
          <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">Projeção de Medalhas</div>
          <div className="text-4xl font-black text-amber-500 tracking-tighter">{aiInsights.filter(i => i.prediction.includes('pódio')).length}</div>
          <div className="text-[10px] text-zinc-500 font-bold mt-4">Próximos 90 dias</div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-800/50 border-b border-zinc-800">
              <tr className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                <th className="px-8 py-5">Atleta</th>
                <th className="px-8 py-5">Consistência</th>
                <th className="px-8 py-5">Prontidão</th>
                <th className="px-8 py-5">Risco Lesão</th>
                <th className="px-8 py-5">Predição AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {aiInsights.map((insight, i) => (
                <tr key={i} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-8 py-6 font-bold text-white group-hover:text-emerald-400 transition-colors">{insight.name}</td>
                  <td className="px-8 py-6 text-sm text-zinc-400">{insight.consistency}</td>
                  <td className="px-8 py-6 text-sm text-zinc-400">{insight.readiness}</td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      insight.injuryRisk === 'Alto' ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" :
                      insight.injuryRisk === 'Médio' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                      "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    )}>
                      {insight.injuryRisk}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                      <Zap size={14} className="text-emerald-500" />
                      {insight.prediction}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- PAC Meritocracy Algorithm ---
const Dashboard = ({ athletes, onViewRanking }: { athletes: Athlete[], onViewRanking: () => void }) => {
  const { alerts: smartAlerts, markAsRead } = useAlerts();
  const [graduationConfig, setGraduationConfig] = useState<any>(null);
  const topAthletes = [...athletes].sort((a, b) => b.score - a.score).slice(0, 5);
  
  useEffect(() => {
    const fetchConfig = async () => {
      const docRef = doc(db, 'graduation_config', 'jiujitsu');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.belts) {
          const uniqueBelts: any[] = [];
          const seenIds = new Set();
          for (const belt of data.belts) {
            if (belt.id && !seenIds.has(belt.id)) {
              uniqueBelts.push(belt);
              seenIds.add(belt.id);
            }
          }
          data.belts = uniqueBelts;
        }
        setGraduationConfig(data);
      }
    };
    fetchConfig();
  }, []);

  const teamMatrixData = athletes.map(a => ({
    name: a.name,
    x: a.training_count_30d || 0, // Consistência (Treinos 30d)
    y: a.score, // Resultado (Score PAC)
    z: a.latest_psych_score || 50, // Tamanho da bolha (Estado Mental)
    classification: a.classification
  }));

  // Legacy dynamic alerts for coaches
  const legacyAlerts: any[] = [];
  athletes.forEach(athlete => {
    if (athlete.latest_weight && athlete.latest_weight > 90) {
      legacyAlerts.push({
        type: 'weight',
        title: `Controle de Peso: ${athlete.name}`,
        desc: `Atleta está com ${athlete.latest_weight}kg. Verificar categoria.`,
        color: 'amber'
      });
    }
    if ((athlete.training_count_30d || 0) < 4) {
      legacyAlerts.push({
        type: 'performance',
        title: `Alerta de Evasão: ${athlete.name}`,
        desc: `Apenas ${athlete.training_count_30d} treinos nos últimos 30 dias.`,
        color: 'rose'
      });
    }
    if (graduationConfig) {
      const beltConfig = graduationConfig.belts.find((b: any) => b.id === athlete.belt);
      if (beltConfig) {
        if (beltConfig.graduationType === 'standard') {
          if (athlete.stripes >= beltConfig.maxStripes) {
            legacyAlerts.push({
              type: 'graduation',
              title: `Graduação Pendente: ${athlete.name}`,
              desc: `Atleta está pronto para graduação de faixa!`,
              color: 'emerald'
            });
          }
        } else if (beltConfig.graduationType === 'timeBased') {
          const nextDegree = (athlete.stripes || 0) + 1;
          const rule = beltConfig.timeBasedRules.find((r: any) => r.degree === nextDegree);
          if (rule && athlete.last_graduation_date) {
            const lastDate = new Date(athlete.last_graduation_date);
            const yearsSince = (new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
            if (yearsSince >= rule.yearsRequired) {
              legacyAlerts.push({
                type: 'graduation',
                title: `Graduação Pendente: ${athlete.name}`,
                desc: `Atleta está pronto para ${nextDegree}º grau!`,
                color: 'emerald'
              });
            }
          }
        }
      }
    }
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de Atletas" value={athletes.length} icon={Users} color="bg-blue-500" />
        <StatCard label="Média de Score" value={athletes.length ? (athletes.reduce((acc, curr) => acc + curr.score, 0) / athletes.length).toFixed(1) : 0} icon={TrendingUp} color="bg-emerald-500" />
        <StatCard label="Foco Disciplinar" value={athletes.length ? (athletes.reduce((acc, curr) => acc + (curr.latest_discipline_score || 80), 0) / athletes.length).toFixed(0) + '%' : '80%'} icon={ShieldCheck} color="bg-amber-500" />
        <StatCard label="Prontidão Mental" value={athletes.length ? (athletes.reduce((acc, curr) => acc + (curr.latest_psych_score || 0), 0) / athletes.length).toFixed(0) + '%' : '0%'} icon={Brain} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {smartAlerts.length > 0 && (
            <div className="bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800">
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-rose-500" />
                ALERTAS DE PERFORMANCE
              </h3>
              <AlertList alerts={smartAlerts} onMarkRead={markAsRead} />
            </div>
          )}

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Matriz de Performance da Equipe</h3>
                <p className="text-xs text-zinc-500">Cruzamento: Consistência (X) vs. Resultado (Y)</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> Elite
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /> Regular
                </div>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis type="number" dataKey="x" name="Treinos (30d)" stroke="#71717a" fontSize={12} label={{ value: 'Treinos (30d)', position: 'bottom', fill: '#71717a', fontSize: 10 }} />
                  <YAxis type="number" dataKey="y" name="Score PAC" stroke="#71717a" fontSize={12} label={{ value: 'Score PAC', angle: -90, position: 'left', fill: '#71717a', fontSize: 10 }} />
                  <ZAxis type="number" dataKey="z" range={[50, 400]} name="Saúde Mental" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl shadow-2xl">
                            <p className="text-sm font-bold text-white mb-1">{data.name}</p>
                            <p className="text-xs text-emerald-500">Score: {data.y}</p>
                            <p className="text-xs text-blue-400">Treinos: {data.x}</p>
                            <p className="text-xs text-purple-400">Mental: {data.z}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Atletas" data={teamMatrixData}>
                    {teamMatrixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.y > 300 ? '#10b981' : '#3b82f6'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Alertas de Equipe (Coach)</h3>
            <div className="space-y-3">
              {legacyAlerts.length > 0 ? legacyAlerts.slice(0, 3).map((alert, i) => (
                <div key={i} className={cn(
                  "flex items-center gap-4 p-4 border rounded-xl",
                  alert.color === 'rose' ? "bg-rose-500/10 border-rose-500/20" : "bg-amber-500/10 border-amber-500/20"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0",
                    alert.color === 'rose' ? "bg-rose-500" : "bg-amber-500"
                  )}>
                    {alert.type === 'weight' ? <Activity size={20} /> : <Bell size={20} />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{alert.title}</div>
                    <div className={cn(
                      "text-xs",
                      alert.color === 'rose' ? "text-rose-400" : "text-amber-400"
                    )}>{alert.desc}</div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6 text-zinc-500 text-sm italic">Nenhum alerta crítico no momento.</div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Ranking Top 5</h3>
          <div className="space-y-4">
            {topAthletes.map((athlete, idx) => (
              <div key={athlete.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/30 border border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-white">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{athlete.name}</div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{athlete.belt} ({athlete.stripes} {athlete.stripes === 1 ? 'Grau' : 'Graus'}) • {athlete.classification}</div>
                  </div>
                </div>
                <div className="text-emerald-500 font-bold">{athlete.score}</div>
              </div>
            ))}
          </div>
          <button 
            onClick={onViewRanking}
            className="w-full mt-6 py-3 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Ver Ranking Completo
          </button>
        </div>
      </div>
    </div>
  );
};

import { SearchableCompetitionInput } from './components/SearchableCompetitionInput';

const CompetitionForm = ({ athletes, academies, onSuccess, editingMetric, user }: { athletes: Athlete[], academies: Academy[], onSuccess: () => void, editingMetric?: any, user?: User }) => {
  const [formData, setFormData] = useState(() => {
    const defaults = { athlete_id: '', name: '', date: new Date().toISOString().split('T')[0], category: '', result: 'Participante', points_earned: 0 };
    
    if (user && user.role === 'athlete') {
      const athlete = athletes.find(a => a.user_id === user.id);
      if (athlete) {
        defaults.athlete_id = athlete.id;
      }
    }

    if (editingMetric) {
      const { id, athleteName, athleteScore, athleteId, ...rest } = editingMetric;
      return { ...defaults, ...rest, athlete_id: athleteId || defaults.athlete_id, date: editingMetric.date ? editingMetric.date.split('T')[0] : defaults.date };
    }
    return defaults;
  });

  useEffect(() => {
    if (user && user.role === 'athlete' && athletes.length > 0) {
      const athlete = athletes.find(a => a.user_id === user.id);
      if (athlete && formData.athlete_id !== athlete.id) {
        setFormData(prev => ({ ...prev, athlete_id: athlete.id }));
      }
    }
  }, [user, athletes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.athlete_id) {
      return;
    }

    try {
      const batch = writeBatch(db);
      const compRef = editingMetric 
        ? doc(db, `athletes/${formData.athlete_id}/competitions`, editingMetric.id)
        : doc(collection(db, `athletes/${formData.athlete_id}/competitions`));
      
      const evalData = {
        ...formData,
        date: editingMetric && editingMetric.date.startsWith(formData.date) ? editingMetric.date : new Date(`${formData.date}T12:00:00Z`).toISOString()
      };

      if (editingMetric) {
        batch.update(compRef, evalData);
      } else {
        batch.set(compRef, evalData);
        
        const athleteRef = doc(db, 'athletes', formData.athlete_id);
        const updateData: any = { 
          score: increment(formData.points_earned || 0) 
        };

        if (formData.result === 'Ouro') updateData['medals_count.gold'] = increment(1);
        if (formData.result === 'Prata') updateData['medals_count.silver'] = increment(1);
        if (formData.result === 'Bronze') updateData['medals_count.bronze'] = increment(1);

        batch.update(athleteRef, updateData);
      }

      await batch.commit();
      onSuccess();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `athletes/${formData.athlete_id}/competitions`);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(!user || user.role !== 'athlete') && (
        <SearchableAthleteSelect 
          athletes={athletes}
          academies={academies}
          selectedId={formData.athlete_id}
          onSelect={(id) => setFormData({ ...formData, athlete_id: id })}
          label="Atleta"
        />
      )}
      <SearchableCompetitionInput 
        value={formData.name || ''} 
        onChange={(value) => setFormData({...formData, name: value})} 
      />
      <div className="grid grid-cols-2 gap-4">
        <input type="date" max={new Date().toISOString().split('T')[0]} required className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} />
        <input type="text" placeholder="Categoria" className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <select className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" value={formData.result || 'Ouro'} onChange={e => setFormData({...formData, result: e.target.value})}>
          <option value="Ouro">Ouro</option><option value="Prata">Prata</option><option value="Bronze">Bronze</option><option value="Participante">Participante</option>
        </select>
        <input type="number" placeholder="Pontos Ganhos" value={formData.points_earned || ''} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" onChange={e => setFormData({...formData, points_earned: parseInt(e.target.value) || 0})} />
      </div>
      <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all">Registrar Resultado</button>
    </form>
  );
};

const MealLogForm = ({ athleteId, onSuccess, editingMeal, selectedDate }: { athleteId: string, onSuccess: () => void, editingMeal?: any, selectedDate?: string }) => {
  const [isEstimating, setIsEstimating] = useState(false);
  const [formData, setFormData] = useState({
    meal_type: editingMeal?.meal_type || 'Café da Manhã',
    food_name: editingMeal?.food_name || '',
    amount: editingMeal?.amount || '',
    calories: editingMeal?.calories || 0,
    protein: editingMeal?.protein || 0,
    carbs: editingMeal?.carbs || 0,
    fats: editingMeal?.fats || 0,
    date: editingMeal?.date ? editingMeal.date.split('T')[0] : (selectedDate || new Date().toISOString().split('T')[0])
  });

  const estimateMacros = async () => {
    if (!formData.food_name) return;

    setIsEstimating(true);
    try {
      const ai = getGenAI();
      const prompt = `Estime os macronutrientes (calorias, proteínas, carboidratos, gorduras) para a seguinte refeição: "${formData.food_name}". 
      Retorne APENAS um objeto JSON com as chaves: calories, protein, carbs, fats. Use números inteiros.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      const result = JSON.parse(response.text || '{}');
      setFormData(prev => ({
        ...prev,
        calories: result.calories || 0,
        protein: result.protein || 0,
        carbs: result.carbs || 0,
        fats: result.fats || 0
      }));
    } catch (error: any) {
      console.error('Error estimating macros:', error);
      let msg = "Erro ao calcular macros. Tente novamente.";
      if (error.message?.includes('API key not valid') || error.message?.includes('API Key não configurada')) {
        msg = "Chave da API Gemini inválida ou não configurada. Verifique o painel de Secrets (Chaves) no AI Studio.";
      }
      alert(msg);
    } finally {
      setIsEstimating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const logData = {
        ...formData,
        athlete_id: athleteId,
        date: editingMeal && editingMeal.date.startsWith(formData.date) ? editingMeal.date : new Date(`${formData.date}T12:00:00Z`).toISOString(),
        created_at: editingMeal?.created_at || Timestamp.now()
      };
      if (editingMeal) {
        await updateDoc(doc(db, `athletes/${athleteId}/meal_logs/${editingMeal.id}`), logData);
      } else {
        await addDoc(collection(db, `athletes/${athleteId}/meal_logs`), logData);
      }
      onSuccess();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `athletes/${athleteId}/meal_logs`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold">Data da Refeição</label>
        <input 
          type="date" 
          value={formData.date}
          max={new Date().toISOString().split('T')[0]}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" 
          onChange={e => setFormData({...formData, date: e.target.value})} 
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold">Tipo de Refeição</label>
          <select 
            value={formData.meal_type} 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
            onChange={e => setFormData({...formData, meal_type: e.target.value as any})}
          >
            <option value="Café da Manhã">Café da Manhã</option>
            <option value="Almoço">Almoço</option>
            <option value="Jantar">Jantar</option>
            <option value="Lanche">Lanche</option>
            <option value="Suplementação">Suplementação</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold">Quantidade (ex: 200g, 2 unid)</label>
          <input 
            type="text" 
            value={formData.amount} 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
            onChange={e => setFormData({...formData, amount: e.target.value})}
            placeholder="Opcional"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold">O que você comeu?</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            required
            value={formData.food_name} 
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
            onChange={e => setFormData({...formData, food_name: e.target.value})}
            placeholder="Ex: 2 ovos cozidos e 1 fatia de pão integral"
          />
          <button 
            type="button"
            onClick={estimateMacros}
            disabled={isEstimating || !formData.food_name}
            className="px-4 rounded-xl transition-all disabled:opacity-50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500"
          >
            {isEstimating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="space-y-1">
          <label className="text-[8px] text-zinc-500 uppercase font-bold text-center block">Kcal</label>
          <input type="number" value={formData.calories} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-white text-center text-xs" onChange={e => setFormData({...formData, calories: parseInt(e.target.value)})} />
        </div>
        <div className="space-y-1">
          <label className="text-[8px] text-zinc-500 uppercase font-bold text-center block">Prot (g)</label>
          <input type="number" value={formData.protein} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-white text-center text-xs" onChange={e => setFormData({...formData, protein: parseInt(e.target.value)})} />
        </div>
        <div className="space-y-1">
          <label className="text-[8px] text-zinc-500 uppercase font-bold text-center block">Carb (g)</label>
          <input type="number" value={formData.carbs} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-white text-center text-xs" onChange={e => setFormData({...formData, carbs: parseInt(e.target.value)})} />
        </div>
        <div className="space-y-1">
          <label className="text-[8px] text-zinc-500 uppercase font-bold text-center block">Gord (g)</label>
          <input type="number" value={formData.fats} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-white text-center text-xs" onChange={e => setFormData({...formData, fats: parseInt(e.target.value)})} />
        </div>
      </div>

      <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
        Registrar Refeição
      </button>
    </form>
  );
};

const WaterTracker = ({ athleteId, currentWater, targetWater, selectedDate }: { athleteId: string, currentWater: number, targetWater: number, selectedDate: string }) => {
  const [isAdding, setIsAdding] = useState(false);

  const addWater = async (amount: number) => {
    setIsAdding(true);
    try {
      const logData = {
        athlete_id: athleteId,
        date: selectedDate,
        amount_ml: amount,
        timestamp: Timestamp.now()
      };
      await addDoc(collection(db, `athletes/${athleteId}/water_logs`), logData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `athletes/${athleteId}/water_logs`);
    } finally {
      setIsAdding(false);
    }
  };

  const percentage = Math.min(100, (currentWater / targetWater) * 100);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
            <Droplets size={20} />
          </div>
          <div>
            <h4 className="font-bold text-white">Hidratação</h4>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Meta: {targetWater}ml</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-black text-white">{currentWater} <span className="text-[10px] font-normal text-zinc-500">ml</span></div>
          <div className="text-[10px] font-bold text-blue-500">{percentage.toFixed(0)}% da meta</div>
        </div>
      </div>

      <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[250, 500, 1000].map(amount => (
          <button 
            key={amount}
            onClick={() => addWater(amount)}
            disabled={isAdding}
            className="bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold py-2 rounded-lg transition-all border border-white/5"
          >
            +{amount}ml
          </button>
        ))}
      </div>
    </div>
  );
};

const NutritionHistoryChart = ({ athleteId, targetPlan }: { athleteId: string, targetPlan: any }) => {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const ninetyDaysAgoStr = ninetyDaysAgo.toISOString().split('T')[0];

        const mealsQuery = query(
          collection(db, `athletes/${athleteId}/meal_logs`),
          where('date', '>=', ninetyDaysAgoStr)
        );
        const waterQuery = query(
          collection(db, `athletes/${athleteId}/water_logs`),
          where('date', '>=', ninetyDaysAgoStr)
        );

        const [mealsSnapshot, waterSnapshot] = await Promise.all([
          getDocs(mealsQuery),
          getDocs(waterQuery)
        ]);

        const meals = mealsSnapshot.docs.map(doc => doc.data() as MealLog);
        const water = waterSnapshot.docs.map(doc => doc.data() as WaterLog);

        const days: any = {};
        const last90Days = Array.from({ length: 90 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (89 - i));
          return d.toISOString().split('T')[0];
        });

        last90Days.forEach(date => {
          days[date] = {
            date: date.split('-').slice(1).reverse().join('/'),
            fullDate: date,
            calories: 0,
            water: 0,
            targetCalories: targetPlan?.tdee || 2500,
            targetWater: targetPlan?.water_target_ml || 3000
          };
        });

        meals.forEach(log => {
          const date = log.date.split('T')[0];
          if (days[date]) {
            days[date].calories += log.calories || 0;
          }
        });

        water.forEach(log => {
          const date = log.date;
          if (days[date]) {
            days[date].water += log.amount_ml || 0;
          }
        });

        setHistoryData(Object.values(days));
      } catch (error) {
        console.error("Error fetching nutrition history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [athleteId, targetPlan]);

  if (isLoading) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Activity size={16} className="text-emerald-500" />
          Adesão ao Plano (Últimos 90 Dias)
        </h4>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase text-zinc-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Calorias
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Água
          </div>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={historyData}>
            <defs>
              <linearGradient id="colorCalHistory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorWaterHistory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 10 }} 
              dy={10}
              minTickGap={30}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 10 }}
              domain={[0, 'dataMax + 500']}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 10 }}
              domain={[0, 'dataMax + 1000']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="calories" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCalHistory)" 
              name="Calorias (kcal)"
            />
            <Area 
              yAxisId="right"
              type="monotone" 
              dataKey="water" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorWaterHistory)" 
              name="Água (ml)"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="targetCalories" 
              stroke="#059669" 
              strokeDasharray="3 3" 
              dot={false}
              activeDot={false}
              name="Meta Calorias"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="targetWater" 
              stroke="#2563eb" 
              strokeDasharray="3 3" 
              dot={false}
              activeDot={false}
              name="Meta Água"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const NutritionDiary = ({ athleteId, targetPlan }: { athleteId: string, targetPlan: any }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [weeklyLogs, setWeeklyLogs] = useState<MealLog[]>([]);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [editingMealLog, setEditingMealLog] = useState<any>(null);
  const [isDeleteMealModalOpen, setIsDeleteMealModalOpen] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<any>(null);

  useEffect(() => {
    const sevenDaysAgo = new Date(selectedDate);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
    
    // Fetch meals for selectedDate
    const mealsQuery = query(
      collection(db, `athletes/${athleteId}/meal_logs`),
      orderBy('created_at', 'desc')
    );

    const unsubscribeMeals = onSnapshot(mealsQuery, (snapshot) => {
      const allLogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MealLog));
      
      const todayLogs = allLogs.filter(log => log.date.startsWith(selectedDate));
      const lastSevenDaysLogs = allLogs.filter(log => log.date >= sevenDaysAgoStr && log.date <= selectedDate);
      
      setMealLogs(todayLogs);
      setWeeklyLogs(lastSevenDaysLogs);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `athletes/${athleteId}/meal_logs`);
    });

    // Fetch water for selectedDate
    const waterQuery = query(
      collection(db, `athletes/${athleteId}/water_logs`),
      where('date', '==', selectedDate)
    );

    const unsubscribeWater = onSnapshot(waterQuery, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WaterLog));
      setWaterLogs(logs);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `athletes/${athleteId}/water_logs`);
    });

    return () => {
      unsubscribeMeals();
      unsubscribeWater();
    };
  }, [athleteId, selectedDate]);

  const totals = mealLogs.reduce((acc, curr) => ({
    calories: acc.calories + (curr.calories || 0),
    protein: acc.protein + (curr.protein || 0),
    carbs: acc.carbs + (curr.carbs || 0),
    fats: acc.fats + (curr.fats || 0)
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const currentWater = waterLogs.reduce((acc, curr) => acc + curr.amount_ml, 0);
  const waterTarget = targetPlan?.water_target_ml || 3000;

  // Process weekly data for chart
  const chartData = useMemo(() => {
    const days: any = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    last7Days.forEach(date => {
      days[date] = { 
        date: date.split('-').slice(1).reverse().join('/'), 
        calories: 0, 
        protein: 0, 
        carbs: 0, 
        fats: 0,
        target: targetPlan?.tdee || 2500
      };
    });

    weeklyLogs.forEach(log => {
      const date = log.date.split('T')[0];
      if (days[date]) {
        days[date].calories += log.calories || 0;
        days[date].protein += log.protein || 0;
        days[date].carbs += log.carbs || 0;
        days[date].fats += log.fats || 0;
      }
    });

    return Object.values(days);
  }, [weeklyLogs]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Calendar size={18} className="text-emerald-500" />
          Diário Nutricional
        </h3>
        <input 
          type="date" 
          value={selectedDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-emerald-500" />
              Consumo Diário
            </h4>
            <button 
              onClick={() => setIsMealModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
            >
              Adicionar Alimento
            </button>
          </div>

          <div className="space-y-4">
            <MacroProgressBar label="Calorias" current={totals.calories} target={targetPlan?.tdee || 2500} unit="kcal" color="bg-orange-500" />
            <div className="grid grid-cols-3 gap-4">
              <MacroProgressBar label="Proteína" current={totals.protein} target={targetPlan?.protein_g || 150} unit="g" color="bg-blue-500" />
              <MacroProgressBar label="Carbos" current={totals.carbs} target={targetPlan?.carbs_g || 300} unit="g" color="bg-yellow-500" />
              <MacroProgressBar label="Gorduras" current={totals.fats} target={targetPlan?.fats_g || 70} unit="g" color="bg-emerald-500" />
            </div>
          </div>
        </div>

        <WaterTracker athleteId={athleteId} currentWater={currentWater} targetWater={waterTarget} selectedDate={selectedDate} />
      </div>

      {/* Weekly Evolution Chart */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-500" />
            Evolução Semanal de Calorias
          </h4>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase text-zinc-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              Consumo
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
              Meta ({targetPlan?.tdee || 2500} kcal)
            </div>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 10 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="calories" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCal)" 
                name="Calorias"
              />
              {/* Reference line for target */}
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#3f3f46" 
                strokeDasharray="5 5" 
                dot={false}
                activeDot={false}
                name="Meta"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Diary List */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Diário do Dia</h4>
        <div className="space-y-3">
          {mealLogs.length > 0 ? (
            mealLogs.map(log => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-emerald-500 font-bold text-xs">
                    {log.meal_type.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{log.food_name}</div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{log.meal_type} • {log.amount || 'Qtd não informada'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingMealLog(log);
                        setIsMealModalOpen(true);
                      }}
                      className="text-zinc-500 hover:text-emerald-500 transition-colors p-1"
                      title="Editar Refeição"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setMealToDelete(log);
                        setIsDeleteMealModalOpen(true);
                      }}
                      className="text-zinc-500 hover:text-rose-500 transition-colors p-1"
                      title="Excluir Refeição"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-white">{log.calories} <span className="text-[10px] font-normal text-zinc-500">kcal</span></div>
                    <div className="text-[10px] text-zinc-500">P: {log.protein}g • C: {log.carbs}g • G: {log.fats}g</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-zinc-500 text-sm italic">Nenhuma refeição registrada hoje.</div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isMealModalOpen} 
        onClose={() => {
          setIsMealModalOpen(false);
          setEditingMealLog(null);
        }} 
        title={editingMealLog ? "Editar Refeição" : "Registrar Refeição"}
      >
        <MealLogForm 
          athleteId={athleteId} 
          editingMeal={editingMealLog}
          selectedDate={selectedDate}
          onSuccess={() => {
            setIsMealModalOpen(false);
            setEditingMealLog(null);
          }} 
        />
      </Modal>

      <Modal
        isOpen={isDeleteMealModalOpen}
        onClose={() => {
          setIsDeleteMealModalOpen(false);
          setMealToDelete(null);
        }}
        title="Excluir Refeição"
      >
        <div className="space-y-6">
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
            <h4 className="text-rose-500 font-bold mb-2">Confirmar Exclusão</h4>
            <p className="text-sm text-zinc-400">
              Tem certeza que deseja excluir a refeição "{mealToDelete?.food_name}"? Esta ação não pode ser desfeita.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsDeleteMealModalOpen(false);
                setMealToDelete(null);
              }}
              className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-xl font-bold hover:bg-zinc-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={async () => {
                if (mealToDelete) {
                  try {
                    await deleteDoc(doc(db, `athletes/${athleteId}/meal_logs/${mealToDelete.id}`));
                    setIsDeleteMealModalOpen(false);
                    setMealToDelete(null);
                  } catch (error) {
                    handleFirestoreError(error, OperationType.DELETE, `athletes/${athleteId}/meal_logs`);
                  }
                }
              }}
              className="flex-1 px-4 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors"
            >
              Excluir Refeição
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const MacroProgressBar = ({ label, current, target, unit, color }: { label: string, current: number, target: number, unit: string, color: string }) => {
  const percentage = Math.min(100, (current / target) * 100);
  const isOver = current > target;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
        <span className={cn("text-xs font-black", isOver ? "text-rose-500" : "text-white")}>
          {current} / {target.toFixed(0)} <span className="text-[10px] font-normal text-zinc-500">{unit}</span>
        </span>
      </div>
      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={cn("h-full transition-all", isOver ? "bg-rose-500" : color)}
        />
      </div>
    </div>
  );
};

const NutritionPlanForm = ({ athleteId, athlete, onSuccess, editingPlan }: { athleteId: string, athlete?: any, onSuccess: () => void, editingPlan?: any }) => {
  const [formData, setFormData] = useState({ 
    weight: editingPlan?.weight || 70, 
    height: editingPlan?.height || 175, 
    age: editingPlan?.age || 25, 
    gender: editingPlan?.gender || 'M', 
    activity_level: editingPlan?.activity_level || 1.55, 
    body_fat_pct: editingPlan?.body_fat_pct || 15,
    goal: editingPlan?.goal || 'Maintain',
    tdee: editingPlan?.tdee || 2500,
    protein_g: editingPlan?.protein_g || 150,
    carbs_g: editingPlan?.carbs_g || 300,
    fats_g: editingPlan?.fats_g || 70,
    breakfast: editingPlan?.breakfast || '', 
    lunch: editingPlan?.lunch || '', 
    dinner: editingPlan?.dinner || '', 
    snacks: editingPlan?.snacks || '', 
    supplements: editingPlan?.supplements || '', 
    notes: editingPlan?.notes || '',
    preferences: editingPlan?.preferences || '',
    front_photo_url: editingPlan?.front_photo_url || '',
    side_photo_url: editingPlan?.side_photo_url || '',
    front_photo_base64: '',
    side_photo_base64: '',
    clinical_analysis: editingPlan?.clinical_analysis || '',
    ai_feedback: editingPlan?.ai_feedback || '',
    skinfolds: editingPlan?.skinfolds || {
      triceps: '',
      biceps: '',
      subscapular: '',
      suprailiac: '',
      abdominal: '',
      thigh: '',
      calf: '',
      chest: '',
      midaxillary: ''
    }
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingSide, setUploadingSide] = useState(false);
  const [uploadProgressFront, setUploadProgressFront] = useState(0);
  const [uploadProgressSide, setUploadProgressSide] = useState(0);

  useEffect(() => {
    if (editingPlan) return; // Skip fetching defaults if we are editing
    const fetchAthleteData = async () => {
      try {
        const athleteDoc = await getDoc(doc(db, 'athletes', athleteId));
        if (athleteDoc.exists()) {
          const athleteData = athleteDoc.data() as Athlete;
          const age = calculateAge(athleteData.birth_date);
          const nutritionQuery = query(collection(db, `athletes/${athleteId}/nutrition_plans`), orderBy('date', 'desc'), limit(1));
          const nutritionSnap = await getDocs(nutritionQuery);
          const latestPlan = nutritionSnap.docs[0]?.data();

          setFormData(prev => ({
            ...prev,
            height: athleteData.height || prev.height,
            gender: athleteData.gender || prev.gender,
            age: age || prev.age,
            weight: athleteData.latest_weight || prev.weight,
            preferences: latestPlan?.preferences || prev.preferences,
            skinfolds: latestPlan?.skinfolds || prev.skinfolds,
            front_photo_url: latestPlan?.front_photo_url || prev.front_photo_url,
            side_photo_url: latestPlan?.side_photo_url || prev.side_photo_url
          }));
        }
      } catch (error) {
        console.error("Error fetching athlete data for nutrition plan:", error);
      }
    };
    fetchAthleteData();
  }, [athleteId]);

  const calculateBodyFat = (skinfolds: any, gender: string, age: number) => {
    const s = skinfolds;
    const sum = (
      parseFloat(s.triceps || 0) +
      parseFloat(s.subscapular || 0) +
      parseFloat(s.suprailiac || 0) +
      parseFloat(s.abdominal || 0) +
      parseFloat(s.thigh || 0) +
      parseFloat(s.chest || 0) +
      parseFloat(s.midaxillary || 0)
    );

    if (sum === 0) return 0;

    let density = 0;
    if (gender === 'M') {
      density = 1.112 - (0.00043499 * sum) + (0.00000055 * Math.pow(sum, 2)) - (0.00028826 * age);
    } else {
      density = 1.097 - (0.00046971 * sum) + (0.00000056 * Math.pow(sum, 2)) - (0.00012828 * age);
    }

    const bodyFat = (495 / density) - 450;
    return Math.max(0, Math.round(bodyFat * 10) / 10);
  };

  const calculateMacros = () => {
    console.log("calculateMacros called with formData:", formData);
    // Calculate BMR (Mifflin-St Jeor)
    const bmr = formData.gender === 'M' 
      ? (10 * formData.weight) + (6.25 * formData.height) - (5 * formData.age) + 5
      : (10 * formData.weight) + (6.25 * formData.height) - (5 * formData.age) - 161;
    
    console.log("BMR:", bmr);
    let tdee = bmr * formData.activity_level;
    console.log("TDEE:", tdee);

    // Adjust for goal
    if (formData.goal === 'Cut') tdee -= 500;
    if (formData.goal === 'Bulk') tdee += 500;
    console.log("TDEE after goal adjustment:", tdee);
    
    // Basic macro split (40/30/30)
    const protein_g = Math.round((tdee * 0.3) / 4);
    const carbs_g = Math.round((tdee * 0.4) / 4);
    const fats_g = Math.round((tdee * 0.3) / 9);
    console.log("Macros:", { protein_g, carbs_g, fats_g });

    setFormData(prev => ({
      ...prev,
      tdee: Math.round(tdee),
      protein_g,
      carbs_g,
      fats_g
    }));
  };

  const resizeImage = (base64: string, maxWidth: number = 800): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };

  const handleAnalyzePhotos = async () => {
    if (!formData.front_photo_url || !formData.side_photo_url) {
      console.error("Por favor, faça o upload das fotos de frente e de lado.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const ai = getGenAI();
      
      const prompt = `Você é um especialista em nutrição esportiva e biologia humana de elite.
      Analise as duas fotos fornecidas (frente e lado) do atleta.
      
      Dados atuais do atleta:
      Idade: ${formData.age}
      Peso: ${formData.weight}kg
      Altura: ${formData.height}cm
      Gênero: ${formData.gender === 'M' ? 'Masculino' : 'Feminino'}
      Nível de Atividade: ${formData.activity_level}
      Objetivo: ${formData.goal}
      Preferências Alimentares: ${formData.preferences || 'Nenhuma informada'}
      
      Dobras Cutâneas (mm) - Opcional para cálculo mais preciso:
      - Tríceps: ${formData.skinfolds.triceps || 'N/A'}
      - Bíceps: ${formData.skinfolds.biceps || 'N/A'}
      - Subescapular: ${formData.skinfolds.subscapular || 'N/A'}
      - Supra-ilíaca: ${formData.skinfolds.suprailiac || 'N/A'}
      - Abdominal: ${formData.skinfolds.abdominal || 'N/A'}
      - Coxa: ${formData.skinfolds.thigh || 'N/A'}
      - Panturrilha: ${formData.skinfolds.calf || 'N/A'}
      - Peitoral: ${formData.skinfolds.chest || 'N/A'}
      - Axilar Média: ${formData.skinfolds.midaxillary || 'N/A'}
      
      ${athlete ? `
      Histórico de Saúde Recente:
      ${athlete.health?.slice(0, 5).map((h: any) => `- ${new Date(h.date).toLocaleDateString()}: ${h.metric} = ${h.value}`).join('\n') || 'Nenhum registro'}
      
      Plano Nutricional Anterior (para referência):
      Calorias: ${athlete.nutrition?.[0]?.tdee || 'N/A'} kcal
      Proteínas: ${athlete.nutrition?.[0]?.protein_g || 'N/A'}g
      Carboidratos: ${athlete.nutrition?.[0]?.carbs_g || 'N/A'}g
      Gorduras: ${athlete.nutrition?.[0]?.fats_g || 'N/A'}g
      ` : ''}

      Com base nas fotos e nos dados, forneça:
      1. Estimativa do percentual de gordura corporal (% Gordura).
      2. Análise clínica detalhada (postura, simetria, indícios de ganho de massa muscular, pontos de atenção).
      3. Plano nutricional individualizado e preciso, gerando as refeições (café da manhã, almoço, jantar, lanches) e suplementação, respeitando as preferências alimentares e os macronutrientes necessários para o objetivo.
      4. Considere o histórico de saúde e nutrição anterior (se fornecido) para cruzar dados e gerar um plano evolutivo.
      
      Retorne a resposta ESTRITAMENTE no formato JSON com a seguinte estrutura:
      {
        "body_fat_pct": numero,
        "clinical_analysis": "texto detalhado da análise clínica",
        "ai_feedback": "feedback geral e recomendações",
        "breakfast": "sugestão detalhada",
        "lunch": "sugestão detalhada",
        "dinner": "sugestão detalhada",
        "snacks": "sugestão detalhada",
        "supplements": "sugestão detalhada",
        "notes": "observações nutricionais"
      }`;

      let frontBase64 = formData.front_photo_base64;
      let sideBase64 = formData.side_photo_base64;

      // Fallback if base64 is not in state (e.g. editing an old plan)
      if (!frontBase64 || !sideBase64) {
        const fetchBase64FromStorage = async (url: string) => {
          // Extract path from URL
          let path = url;
          if (url.startsWith('http')) {
            try {
              const urlObj = new URL(url);
              // Path is usually in the pathname, e.g., /v0/b/bucket/o/path%2Fto%2Ffile
              const parts = urlObj.pathname.split('/o/');
              if (parts.length > 1) {
                path = decodeURIComponent(parts[1].split('?')[0]);
              }
            } catch (e) {
              console.error("Error parsing storage URL:", e);
            }
          }
          const storageRef = ref(storage, path);
          const bytes = await getBytes(storageRef);
          const base64String = btoa(
            new Uint8Array(bytes).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          return base64String;
        };
        if (!frontBase64 && formData.front_photo_url) frontBase64 = await fetchBase64FromStorage(formData.front_photo_url);
        if (!sideBase64 && formData.side_photo_url) sideBase64 = await fetchBase64FromStorage(formData.side_photo_url);
      }

      if (!frontBase64 || !sideBase64) {
        throw new Error("Não foi possível carregar as imagens para análise.");
      }

      const resizedFront = await resizeImage(frontBase64.startsWith('data:') ? frontBase64 : `data:image/jpeg;base64,${frontBase64}`);
      const resizedSide = await resizeImage(sideBase64.startsWith('data:') ? sideBase64 : `data:image/jpeg;base64,${sideBase64}`);

      const callGeminiWithRetry = async (retries = 3, delay = 2000): Promise<any> => {
        try {
          return await ai.models.generateContent({
            model: 'gemini-3.1-flash-image-preview',
            contents: [
              {
                role: 'user',
                parts: [
                  { text: prompt },
                  { inlineData: { data: resizedFront.split(',')[1], mimeType: 'image/jpeg' } },
                  { inlineData: { data: resizedSide.split(',')[1], mimeType: 'image/jpeg' } }
                ]
              }
            ],
            // Removed responseSchema and responseMimeType as they are not supported by image models
          });
        } catch (error: any) {
          if (error.status === 429 && retries > 0) {
            console.warn(`Rate limit exceeded, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return callGeminiWithRetry(retries - 1, delay * 2);
          }
          throw error;
        }
      };

      const response = await callGeminiWithRetry();

      let resultText = response.text || '{}';
      // Remove markdown code blocks if present
      resultText = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      let result: any = {};
      try {
        result = JSON.parse(resultText);
      } catch (e) {
        console.error("Failed to parse JSON from AI response:", resultText);
        throw new Error("A resposta da IA não estava em um formato válido. Tente novamente.");
      }
      
      setFormData(prev => ({
        ...prev,
        body_fat_pct: result.body_fat_pct || prev.body_fat_pct,
        breakfast: result.breakfast || prev.breakfast,
        lunch: result.lunch || prev.lunch,
        dinner: result.dinner || prev.dinner,
        snacks: result.snacks || prev.snacks,
        supplements: result.supplements || prev.supplements,
        notes: result.notes || prev.notes,
        clinical_analysis: result.clinical_analysis || prev.clinical_analysis,
        ai_feedback: result.ai_feedback || prev.ai_feedback
      }));
      
      calculateMacros();

    } catch (error: any) {
      console.error("Erro na análise da IA:", error);
      let msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('API key not valid') || msg.includes('API Key não configurada')) {
        msg = "Chave da API Gemini inválida ou não configurada. Verifique o painel de Secrets (Chaves) no AI Studio.";
      }
      alert(`Erro na análise da IA: ${msg}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { front_photo_base64, side_photo_base64, ...dataToSave } = formData;
      const planData = {
        ...dataToSave,
        athlete_id: athleteId,
        date: editingPlan ? editingPlan.date : new Date().toISOString(),
        water_target_ml: formData.weight * 35 // Base recommendation: 35ml per kg
      };

      const batch = writeBatch(db);
      const planRef = editingPlan 
        ? doc(db, `athletes/${athleteId}/nutrition_plans`, editingPlan.id)
        : doc(collection(db, `athletes/${athleteId}/nutrition_plans`));
      
      if (editingPlan) {
        batch.update(planRef, planData);
      } else {
        batch.set(planRef, planData);
      }
      
      const athleteRef = doc(db, 'athletes', athleteId);
      batch.update(athleteRef, { 
        updatedAt: new Date().toISOString(),
        'nutrition_summary': {
          tdee: planData.tdee,
          protein: planData.protein_g,
          carbs: planData.carbs_g,
          fats: planData.fats_g
        }
      });

      await batch.commit();
      onSuccess();
    } catch (error) {
      handleFirestoreError(error, editingPlan ? OperationType.UPDATE : OperationType.CREATE, `athletes/${athleteId}/nutrition_plans`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-4 custom-scrollbar">
      <div className="bg-zinc-800/30 p-6 rounded-2xl border border-zinc-800/50 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Camera size={16} className="text-emerald-500" />
          Análise de IA & Biometria Visual
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Foto de Frente</label>
            <div className="relative h-48 bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-xl overflow-hidden flex items-center justify-center group hover:border-emerald-500 transition-colors">
              {formData.front_photo_url ? (
                <img src={formData.front_photo_url} alt="Frente" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="text-center p-4">
                  <Camera size={24} className="mx-auto text-zinc-600 mb-2 group-hover:text-emerald-500 transition-colors" />
                  <span className="text-xs text-zinc-500 font-medium">Clique para enviar</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 20 * 1024 * 1024) {
                      alert("A imagem é muito grande. Por favor, escolha uma imagem com menos de 20MB.");
                      e.target.value = '';
                      return;
                    }
                    setUploadingFront(true);
                    setUploadProgressFront(0);
                    const ext = file.name.split('.').pop() || 'jpg';
                    const storageRef = ref(storage, `media/${Date.now()}_front_${athleteId}.${ext}`);
                    
                    try {
                      console.log(`Iniciando upload para ${storageRef.fullPath}...`);
                      const metadata = { contentType: file.type };
                      
                      // Ler o arquivo como Data URL para evitar problemas de CORS/Rede em iframes
                      const dataUrl = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = () => reject(new Error("Falha ao ler o arquivo localmente."));
                        reader.readAsDataURL(file);
                      });
                      
                      // Simular progresso inteligente (desacelera ao chegar perto de 95%)
                      const progressInterval = setInterval(() => {
                        setUploadProgressFront(prev => {
                          const remaining = 95 - prev;
                          if (remaining <= 0) return 95;
                          // Avança 15% da distância restante a cada 500ms
                          return prev + Math.max(0.5, remaining * 0.15);
                        });
                      }, 500);

                      const snapshot = await uploadString(storageRef, dataUrl, 'data_url', metadata);
                      console.log("Upload concluído, obtendo URL...", snapshot);
                      const url = await getDownloadURL(snapshot.ref);
                      
                      clearInterval(progressInterval);
                      setUploadProgressFront(100);
                      console.log("URL obtida:", url);
                      
                      setTimeout(() => {
                        setFormData(prev => ({ ...prev, front_photo_url: url, front_photo_base64: dataUrl.split(',')[1] }));
                        setUploadingFront(false);
                        e.target.value = '';
                      }, 500);
                      
                    } catch (error: any) {
                      console.error("Erro ao iniciar upload da foto de frente:", error);
                      if (error.code === 'storage/retry-limit-exceeded' || error.message.includes('retry-limit-exceeded')) {
                        alert("ERRO DE CONFIGURAÇÃO: O Firebase Storage não está ativado no seu projeto.\n\nPara corrigir:\n1. Acesse o console do Firebase\n2. Vá no menu esquerdo em 'Build' > 'Storage'\n3. Clique em 'Get Started' (Começar)\n4. Aceite as configurações padrão.\n\nDepois disso, o upload funcionará normalmente.");
                      } else {
                        alert(`Erro ao iniciar o envio: ${error.message}`);
                      }
                      setUploadingFront(false);
                      setUploadProgressFront(0);
                      e.target.value = '';
                    }
                  }
                }}
              />
              {uploadingFront && (
                <div className="absolute inset-0 bg-zinc-900/90 flex flex-col items-center justify-center p-4">
                  <Loader2 size={24} className="text-emerald-500 animate-spin mb-2" />
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${uploadProgressFront}%` }} />
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-2 font-bold">{Math.round(uploadProgressFront)}%</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Foto de Lado</label>
            <div className="relative h-48 bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-xl overflow-hidden flex items-center justify-center group hover:border-emerald-500 transition-colors">
              {formData.side_photo_url ? (
                <img src={formData.side_photo_url} alt="Lado" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="text-center p-4">
                  <Camera size={24} className="mx-auto text-zinc-600 mb-2 group-hover:text-emerald-500 transition-colors" />
                  <span className="text-xs text-zinc-500 font-medium">Clique para enviar</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 20 * 1024 * 1024) {
                      alert("A imagem é muito grande. Por favor, escolha uma imagem com menos de 20MB.");
                      e.target.value = '';
                      return;
                    }
                    setUploadingSide(true);
                    setUploadProgressSide(0);
                    const ext = file.name.split('.').pop() || 'jpg';
                    const storageRef = ref(storage, `media/${Date.now()}_side_${athleteId}.${ext}`);
                    
                    try {
                      console.log(`Iniciando upload para ${storageRef.fullPath}...`);
                      const metadata = { contentType: file.type };
                      
                      // Ler o arquivo como Data URL para evitar problemas de CORS/Rede em iframes
                      const dataUrl = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = () => reject(new Error("Falha ao ler o arquivo localmente."));
                        reader.readAsDataURL(file);
                      });
                      
                      // Simular progresso inteligente (desacelera ao chegar perto de 95%)
                      const progressInterval = setInterval(() => {
                        setUploadProgressSide(prev => {
                          const remaining = 95 - prev;
                          if (remaining <= 0) return 95;
                          // Avança 15% da distância restante a cada 500ms
                          return prev + Math.max(0.5, remaining * 0.15);
                        });
                      }, 500);

                      const snapshot = await uploadString(storageRef, dataUrl, 'data_url', metadata);
                      console.log("Upload concluído, obtendo URL...", snapshot);
                      const url = await getDownloadURL(snapshot.ref);
                      
                      clearInterval(progressInterval);
                      setUploadProgressSide(100);
                      console.log("URL obtida:", url);
                      
                      setTimeout(() => {
                        setFormData(prev => ({ ...prev, side_photo_url: url, side_photo_base64: dataUrl.split(',')[1] }));
                        setUploadingSide(false);
                        e.target.value = '';
                      }, 500);
                      
                    } catch (error: any) {
                      console.error("Erro ao iniciar upload da foto de lado:", error);
                      if (error.code === 'storage/retry-limit-exceeded' || error.message.includes('retry-limit-exceeded')) {
                        alert("ERRO DE CONFIGURAÇÃO: O Firebase Storage não está ativado no seu projeto.\n\nPara corrigir:\n1. Acesse o console do Firebase\n2. Vá no menu esquerdo em 'Build' > 'Storage'\n3. Clique em 'Get Started' (Começar)\n4. Aceite as configurações padrão.\n\nDepois disso, o upload funcionará normalmente.");
                      } else {
                        alert(`Erro ao iniciar o envio: ${error.message}`);
                      }
                      setUploadingSide(false);
                      setUploadProgressSide(0);
                      e.target.value = '';
                    }
                  }
                }}
              />
              {uploadingSide && (
                <div className="absolute inset-0 bg-zinc-900/90 flex flex-col items-center justify-center p-4">
                  <Loader2 size={24} className="text-emerald-500 animate-spin mb-2" />
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${uploadProgressSide}%` }} />
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-2 font-bold">{Math.round(uploadProgressSide)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] text-zinc-500 uppercase font-bold">Preferências Alimentares & Restrições</label>
          <textarea 
            placeholder="Ex: Intolerância a lactose, prefere frango a carne vermelha, não gosta de brócolis..." 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 h-20" 
            value={formData.preferences}
            onChange={e => setFormData({...formData, preferences: e.target.value})} 
          />
        </div>

        <button 
          type="button"
          onClick={handleAnalyzePhotos}
          disabled={isAnalyzing || !formData.front_photo_url || !formData.side_photo_url}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold py-3 rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Analisando com IA...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Gerar Análise e Plano com IA
            </>
          )}
        </button>

        {formData.clinical_analysis && (
          <div className="mt-4 p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl space-y-3">
            <div>
              <h5 className="text-xs font-bold text-indigo-400 uppercase mb-1">Análise Clínica (IA)</h5>
              <p className="text-sm text-zinc-300 whitespace-pre-wrap">{formData.clinical_analysis}</p>
            </div>
            {formData.ai_feedback && (
              <div>
                <h5 className="text-xs font-bold text-indigo-400 uppercase mb-1">Feedback Nutricional (IA)</h5>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{formData.ai_feedback}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-zinc-800/30 p-6 rounded-2xl border border-zinc-800/50 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Scale size={16} className="text-emerald-500" />
          Anamnese & Biometria
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Peso (kg)</label>
            <input type="number" step="0.1" value={isNaN(formData.weight) ? '' : formData.weight} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Altura (cm) <span className="text-[8px] text-emerald-500">(Global)</span></label>
            <input type="number" readOnly value={isNaN(formData.height) ? '' : formData.height} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-zinc-400 outline-none cursor-not-allowed" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Idade <span className="text-[8px] text-emerald-500">(Global)</span></label>
            <input type="number" readOnly value={isNaN(formData.age) ? '' : formData.age} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-zinc-400 outline-none cursor-not-allowed" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Gênero <span className="text-[8px] text-emerald-500">(Global)</span></label>
            <select disabled value={formData.gender} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-zinc-400 outline-none cursor-not-allowed">
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">% Gordura</label>
            <input type="number" value={isNaN(formData.body_fat_pct) ? '' : formData.body_fat_pct} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" onChange={e => setFormData({...formData, body_fat_pct: parseFloat(e.target.value)})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Objetivo</label>
            <select value={formData.goal} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" onChange={e => setFormData({...formData, goal: e.target.value})}>
              <option value="Maintain">Manutenção</option>
              <option value="Cut">Definição (Cut)</option>
              <option value="Bulk">Ganho (Bulk)</option>
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold">Nível de Atividade (1.2 - 1.9)</label>
          <input type="range" min="1.2" max="1.9" step="0.1" value={formData.activity_level} className="w-full accent-emerald-500" onChange={e => setFormData({...formData, activity_level: parseFloat(e.target.value)})} />
          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>Sedentário</span>
            <span>Ativo</span>
            <span>Atleta Elite</span>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800/50">
          <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" />
            Dobras Cutâneas (mm) - Opcional
          </h5>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {Object.entries({
              triceps: 'Tríceps',
              biceps: 'Bíceps',
              subscapular: 'Subescapular',
              suprailiac: 'Supra-ilíaca',
              abdominal: 'Abdominal',
              thigh: 'Coxa',
              calf: 'Panturrilha',
              chest: 'Peitoral',
              midaxillary: 'Axilar Média'
            }).map(([key, label]) => (
              <div key={key} className="space-y-1">
                <label className="text-[9px] text-zinc-500 uppercase font-bold">{label}</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={formData.skinfolds[key as keyof typeof formData.skinfolds]} 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm text-white outline-none focus:border-emerald-500" 
                  onChange={e => {
                    const newSkinfolds = { ...formData.skinfolds, [key]: e.target.value };
                    const bodyFat = calculateBodyFat(newSkinfolds, formData.gender, formData.age);
                    setFormData({
                      ...formData, 
                      skinfolds: newSkinfolds,
                      body_fat_pct: bodyFat
                    });
                  }} 
                />
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
            <span className="text-emerald-500 font-bold text-xs uppercase tracking-widest">Percentual de Gordura Estimado</span>
            <span className="text-white font-black text-lg">{formData.body_fat_pct}%</span>
          </div>
        </div>

        <button 
          type="button"
          onClick={calculateMacros}
          className="w-full bg-zinc-700 hover:bg-zinc-600 text-white text-[10px] font-bold py-2 rounded-lg uppercase tracking-widest transition-all"
        >
          Calcular Metas Sugeridas
        </button>
      </div>

      <div className="bg-zinc-800/30 p-6 rounded-2xl border border-zinc-800/50 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Flame size={16} className="text-orange-500" />
          Metas Nutricionais (Editáveis)
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Calorias (kcal)</label>
            <input type="number" value={formData.tdee} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" onChange={e => setFormData({...formData, tdee: parseInt(e.target.value)})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Proteína (g)</label>
            <input type="number" value={formData.protein_g} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" onChange={e => setFormData({...formData, protein_g: parseInt(e.target.value)})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Carbos (g)</label>
            <input type="number" value={formData.carbs_g} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" onChange={e => setFormData({...formData, carbs_g: parseInt(e.target.value)})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Gorduras (g)</label>
            <input type="number" value={formData.fats_g} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" onChange={e => setFormData({...formData, fats_g: parseInt(e.target.value)})} />
          </div>
        </div>
      </div>
      <div className="bg-zinc-800/30 p-6 rounded-2xl border border-zinc-800/50 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Utensils size={16} className="text-emerald-500" />
          Plano Alimentar
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea placeholder="Café da Manhã" value={formData.breakfast} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 h-24" onChange={e => setFormData({...formData, breakfast: e.target.value})} />
          <textarea placeholder="Almoço" value={formData.lunch} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 h-24" onChange={e => setFormData({...formData, lunch: e.target.value})} />
          <textarea placeholder="Jantar" value={formData.dinner} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 h-24" onChange={e => setFormData({...formData, dinner: e.target.value})} />
          <textarea placeholder="Lanches" value={formData.snacks} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 h-24" onChange={e => setFormData({...formData, snacks: e.target.value})} />
        </div>
        <textarea placeholder="Suplementação" value={formData.supplements} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 h-24" onChange={e => setFormData({...formData, supplements: e.target.value})} />
        <textarea placeholder="Observações Nutricionais" value={formData.notes} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 h-24" onChange={e => setFormData({...formData, notes: e.target.value})} />
      </div>

      <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-sm">
        Gerar Plano de Alta Performance
      </button>
    </form>
  );
};

const ReportPage = ({ children, pageNumber, totalPages, athlete }: any) => (
  <div className="report-page bg-white p-12 text-zinc-900 w-[800px] h-[1120px] font-sans relative flex flex-col border border-zinc-100 mb-8 shadow-2xl">
    {/* Header on every page */}
    <div className="border-b-2 border-zinc-900 pb-4 flex justify-between items-end mb-8">
      <div>
        <div className="text-zinc-500 text-[8px] font-bold tracking-[0.2em] uppercase mb-1">Technical Dossier • PAC Intelligence</div>
        <div className="text-2xl font-black tracking-tighter text-zinc-900 uppercase">Relatório Técnico</div>
        <div className="flex gap-3 text-[8px] font-bold text-zinc-500 mt-1">
          <span>ID: {athlete.id?.slice(0, 8).toUpperCase()}</span>
          <span>DATA: {new Date().toLocaleDateString('pt-BR')}</span>
          <span className="text-rose-600">CONFIDENCIAL</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xl font-black text-zinc-900 leading-none">PAC</div>
        <div className="text-[6px] font-bold text-zinc-400 uppercase tracking-widest">Performance Athlete Center</div>
      </div>
    </div>

    {/* Content */}
    <div className="flex-1">
      {children}
    </div>

    {/* Footer on every page */}
    <div className="pt-4 border-t border-zinc-200 flex justify-between items-center text-[7px] font-bold text-zinc-400 uppercase tracking-[0.1em] mt-8">
      <div>© 2026 Performance Athlete Center - All Rights Reserved</div>
      <div>Página {pageNumber} de {totalPages}</div>
      <div>Atleta: {athlete.name} • Document Hash: {Math.random().toString(36).substring(7).toUpperCase()}</div>
    </div>
  </div>
);

const DossierFullView = ({ athlete, radarData, metrics, latestPsych, coachInsights, plan, academy, selectedNutritionPlan }: any) => {
  const totalPages = athlete.is_candidate ? 7 : 6;

  const technicalCompetencies = athlete.technical_competencies || {};
  const sortedTech = Object.entries(technicalCompetencies)
    .sort(([,a], [,b]) => (b as number) - (a as number));
  const strongest = sortedTech[0]?.[0] || 'N/A';
  const weakest = sortedTech[sortedTech.length - 1]?.[0] || 'N/A';

  const currentNutrition = selectedNutritionPlan || athlete.nutrition?.[0] || {};
  const health = athlete.health || [];
  
  const latestDiagnostic = athlete.diagnostics && athlete.diagnostics.length > 0 
    ? athlete.diagnostics[athlete.diagnostics.length - 1] 
    : null;
  const competitions = athlete.competitions || [];
  const discipline = athlete.discipline || [];

  return (
    <div className="bg-zinc-200 p-8">
      {/* PAGE 1: IDENTITY & PERFORMANCE */}
      <ReportPage pageNumber={1} totalPages={totalPages} athlete={athlete}>
        <div className="space-y-8">
          {/* Athlete Profile Summary */}
          <div className="grid grid-cols-2 gap-8 py-6 border-b border-zinc-100">
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Identificação do Atleta</h2>
              <div className="grid grid-cols-2 gap-y-3 text-[11px]">
                <div className="font-bold text-zinc-500 uppercase text-[8px]">Nome Completo</div>
                <div className="font-black text-zinc-900">{athlete.name}</div>
                
                <div className="font-bold text-zinc-500 uppercase text-[8px]">Academia</div>
                <div className="font-black text-zinc-900">{academy?.name || 'N/A'}</div>
                
                <div className="font-bold text-zinc-500 uppercase text-[8px]">Graduação</div>
                <div className="font-black text-zinc-900">{athlete.belt} ({athlete.stripes} {athlete.stripes === 1 ? 'Grau' : 'Graus'})</div>
                
                <div className="font-bold text-zinc-500 uppercase text-[8px]">Categoria</div>
                <div className="font-black text-zinc-900">{athlete.weight_class}</div>
              </div>
            </div>
            <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 flex flex-col justify-center items-center">
              <div className="text-[8px] font-black uppercase text-zinc-400 mb-1">Score de Performance Global</div>
              <div className="text-6xl font-black text-zinc-900 tracking-tighter">{athlete.score}</div>
              <div className="text-[10px] font-bold text-zinc-500 mt-1">Percentil: 92º</div>
            </div>
          </div>

          {/* 1. Performance & Physical Metrics */}
          <section className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-tight border-l-4 border-zinc-900 pl-3">1. Avaliação Física e Performance</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-[9px] font-black uppercase text-zinc-400">Evolução TAF (Aptidão Física)</h4>
                <div className="border border-zinc-100 rounded-xl p-3 bg-white flex items-center justify-center h-[200px]">
                  {athlete.physical && athlete.physical.length > 0 ? (
                    <LineChart width={310} height={180} data={athlete.physical.slice().reverse()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                      <XAxis dataKey="date" stroke="#a1a1aa" fontSize={8} tickLine={false} axisLine={false} tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR')} />
                      <YAxis stroke="#a1a1aa" fontSize={8} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '8px', fontWeight: 'bold', paddingTop: '5px' }} />
                      <Line type="monotone" dataKey="pull_ups" name="Barras" stroke="#18181b" strokeWidth={2} dot={{ r: 3, fill: '#18181b' }} isAnimationActive={false} />
                      <Line type="monotone" dataKey="push_ups" name="Flexões" stroke="#71717a" strokeWidth={1.5} dot={{ r: 3, fill: '#71717a' }} isAnimationActive={false} />
                      <Line type="monotone" dataKey="burpees" name="Burpees" stroke="#d4d4d8" strokeWidth={1.5} dot={{ r: 3, fill: '#d4d4d8' }} isAnimationActive={false} />
                    </LineChart>
                  ) : (
                    <span className="text-[10px] text-zinc-400 italic">Nenhum teste físico registrado.</span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-[9px] font-black uppercase text-zinc-400">Volume de Treinamento</h4>
                <div className="border border-zinc-100 rounded-xl p-3 bg-white flex items-center justify-center h-[200px]">
                  {athlete.training && athlete.training.length > 0 ? (
                    <AreaChart width={310} height={180} data={athlete.training.slice(0, 15).reverse()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                      <XAxis dataKey="date" stroke="#a1a1aa" fontSize={8} tickLine={false} axisLine={false} tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} />
                      <YAxis stroke="#a1a1aa" fontSize={8} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="duration_minutes" name="Minutos" stroke="#18181b" fill="#f4f4f5" strokeWidth={2} isAnimationActive={false} />
                    </AreaChart>
                  ) : (
                    <span className="text-[10px] text-zinc-400 italic">Nenhum treino registrado.</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </ReportPage>

      {/* PAGE 2: TECHNICAL & INTELLIGENCE */}
      <ReportPage pageNumber={2} totalPages={totalPages} athlete={athlete}>
        <div className="space-y-8">
          <section className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-tight border-l-4 border-zinc-900 pl-3">2. Análise Técnica e Inteligência</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-[9px] font-black uppercase text-zinc-400">Distribuição de Competências</h4>
                <div className="border border-zinc-100 rounded-xl p-3 bg-white flex justify-center">
                  <RadarChart cx={155} cy={100} outerRadius={65} width={310} height={200} data={radarData}>
                    <PolarGrid stroke="#f4f4f5" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 8, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Atleta" dataKey="A" stroke="#18181b" fill="#18181b" fillOpacity={0.2} isAnimationActive={false} />
                  </RadarChart>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-[9px] font-black uppercase text-zinc-400">Eficiência Técnica (%)</h4>
                <div className="space-y-2 pt-2">
                  {[
                    { label: 'Raspagens', value: athlete.technical_competencies?.raspagens || athlete.technical_history?.raspagens_efficiency || 0 },
                    { label: 'Passagens', value: athlete.technical_competencies?.passagens || athlete.technical_history?.passagens_efficiency || 0 },
                    { label: 'Finalizações', value: athlete.technical_competencies?.finalizacoes || athlete.technical_history?.finalizacoes_efficiency || 0 },
                    { label: 'Quedas', value: athlete.technical_competencies?.quedas || athlete.technical_history?.quedas_efficiency || 0 },
                    { label: 'Defesa', value: athlete.technical_competencies?.defesa || athlete.technical_history?.defesa_efficiency || 0 },
                    { label: 'Costas', value: athlete.technical_competencies?.back_takes || 0 },
                    { label: 'Montada', value: athlete.technical_competencies?.mount_control || 0 },
                    { label: 'Pernas', value: athlete.technical_competencies?.leg_locks || 0 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-20 text-[8px] font-bold uppercase text-zinc-500">{item.label}</div>
                      <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-100">
                        <div className="h-full bg-zinc-900" style={{ width: `${item.value}%` }} />
                      </div>
                      <div className="w-6 text-[8px] font-black text-zinc-900">{item.value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cruzamento de Dados: Insights do Professor</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <div className="text-[7px] font-black text-zinc-400 uppercase mb-1">Ponto Mais Forte</div>
                <div className="text-xs font-black text-emerald-600 uppercase">{strongest}</div>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <div className="text-[7px] font-black text-zinc-400 uppercase mb-1">Ponto Crítico</div>
                <div className="text-xs font-black text-rose-600 uppercase">{weakest}</div>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <div className="text-[7px] font-black text-zinc-400 uppercase mb-1">Prontidão Mental</div>
                <div className="text-xs font-black text-zinc-900">{metrics.mentalToughness}%</div>
              </div>
            </div>
            
            <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100 text-[9px] leading-relaxed text-zinc-700 italic space-y-2">
              {coachInsights && coachInsights.length > 0 ? (
                coachInsights.map((insight: any, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <span className="font-black uppercase text-[7px] text-zinc-900">[{insight.title}]:</span>
                    <span>{insight.text}</span>
                  </div>
                ))
              ) : (
                "Nenhuma observação técnica registrada para este período."
              )}
            </div>
          </section>
        </div>
      </ReportPage>

      {/* PAGE 3: NUTRITION */}
      <ReportPage pageNumber={3} totalPages={totalPages} athlete={athlete}>
        <div className="space-y-8">
          <section className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-tight border-l-4 border-zinc-900 pl-3">3. Planejamento Nutricional Detalhado</h3>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-center">
                <div className="text-[7px] font-black text-zinc-400 uppercase">TDEE</div>
                <div className="text-sm font-black text-zinc-900">{athlete.nutrition_summary?.tdee || currentNutrition.tdee || '--'}</div>
              </div>
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-center">
                <div className="text-[7px] font-black text-zinc-400 uppercase">Proteína</div>
                <div className="text-sm font-black text-zinc-900">{athlete.nutrition_summary?.protein || currentNutrition.protein_g || '--'}g</div>
              </div>
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-center">
                <div className="text-[7px] font-black text-zinc-400 uppercase">Carbos</div>
                <div className="text-sm font-black text-zinc-900">{currentNutrition.carbs_g || '--'}g</div>
              </div>
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-center">
                <div className="text-[7px] font-black text-zinc-400 uppercase">Gorduras</div>
                <div className="text-sm font-black text-zinc-900">{currentNutrition.fats_g || '--'}g</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 space-y-3">
                  <h4 className="text-[8px] font-black uppercase text-zinc-900 border-b border-zinc-200 pb-1">Refeições Principais</h4>
                  <div className="space-y-2 text-[9px]">
                    <div>
                      <span className="font-bold text-zinc-500 uppercase text-[7px]">Café da Manhã:</span>
                      <p className="text-zinc-700 whitespace-pre-line">{currentNutrition.breakfast || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-bold text-zinc-500 uppercase text-[7px]">Almoço:</span>
                      <p className="text-zinc-700 whitespace-pre-line">{currentNutrition.lunch || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-bold text-zinc-500 uppercase text-[7px]">Jantar:</span>
                      <p className="text-zinc-700 whitespace-pre-line">{currentNutrition.dinner || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 space-y-3">
                  <h4 className="text-[8px] font-black uppercase text-zinc-900 border-b border-zinc-200 pb-1">Suplementação & Extras</h4>
                  <div className="space-y-2 text-[9px]">
                    <div>
                      <span className="font-bold text-zinc-500 uppercase text-[7px]">Lanches:</span>
                      <p className="text-zinc-700 whitespace-pre-line">{currentNutrition.snacks || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-bold text-zinc-500 uppercase text-[7px]">Suplementos:</span>
                      <p className="text-zinc-700 whitespace-pre-line">{currentNutrition.supplements || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-bold text-zinc-500 uppercase text-[7px]">Observações:</span>
                      <p className="text-zinc-700 italic">{currentNutrition.notes || 'N/A'}</p>
                    </div>
                    {currentNutrition.preferences && (
                      <div>
                        <span className="font-bold text-zinc-500 uppercase text-[7px]">Preferências/Restrições:</span>
                        <p className="text-zinc-700 italic">{currentNutrition.preferences}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </ReportPage>

      {/* PAGE 4: AI ANALYSIS & VISUAL BIOMETRY */}
      <ReportPage pageNumber={4} totalPages={totalPages} athlete={athlete}>
        <div className="space-y-8">
          <section className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tight border-l-4 border-zinc-900 pl-3">4. Análise de Inteligência Artificial</h3>

            {(currentNutrition.clinical_analysis || currentNutrition.ai_feedback) && (
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 space-y-4">
                <h4 className="text-[10px] font-black uppercase text-zinc-900 border-b border-zinc-200 pb-2 flex items-center gap-2">
                  <Sparkles size={12} />
                  Análise Clínica e Feedback da IA
                </h4>
                <div className="grid grid-cols-1 gap-6 text-[10px]">
                  {currentNutrition.clinical_analysis && (
                    <div className="space-y-1">
                      <span className="font-black text-zinc-500 uppercase text-[8px]">Análise Clínica:</span>
                      <p className="text-zinc-800 whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-xl border border-zinc-200">{currentNutrition.clinical_analysis}</p>
                    </div>
                  )}
                  {currentNutrition.ai_feedback && (
                    <div className="space-y-1">
                      <span className="font-black text-zinc-500 uppercase text-[8px]">Feedback Nutricional:</span>
                      <p className="text-zinc-800 whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-xl border border-zinc-200">{currentNutrition.ai_feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Photos Section */}
            {(currentNutrition.front_photo_url || currentNutrition.side_photo_url) && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Biometria Visual (IA)</h4>
                <div className="grid grid-cols-2 gap-6">
                  {currentNutrition.front_photo_url && (
                    <div className="space-y-2">
                      <div className="text-[8px] font-black text-center py-1 uppercase text-zinc-500 bg-zinc-50 rounded-t-xl border border-zinc-200 border-b-0">Frente</div>
                      <div className="border border-zinc-200 rounded-b-xl overflow-hidden bg-zinc-100">
                        <img 
                          src={currentNutrition.front_photo_base64 ? `data:image/jpeg;base64,${currentNutrition.front_photo_base64}` : currentNutrition.front_photo_url} 
                          alt="Frente" 
                          className="w-full h-[400px] object-cover" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                    </div>
                  )}
                  {currentNutrition.side_photo_url && (
                    <div className="space-y-2">
                      <div className="text-[8px] font-black text-center py-1 uppercase text-zinc-500 bg-zinc-50 rounded-t-xl border border-zinc-200 border-b-0">Lado</div>
                      <div className="border border-zinc-200 rounded-b-xl overflow-hidden bg-zinc-100">
                        <img 
                          src={currentNutrition.side_photo_base64 ? `data:image/jpeg;base64,${currentNutrition.side_photo_base64}` : currentNutrition.side_photo_url} 
                          alt="Lado" 
                          className="w-full h-[400px] object-cover" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* AI Diagnostics Section */}
          <section className="space-y-4">
            <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Diagnósticos e Insights (IA)</h4>
            <div className="grid grid-cols-1 gap-4">
              {athlete.diagnostics && athlete.diagnostics.length > 0 ? (
                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 text-zinc-300 text-[10px] leading-relaxed whitespace-pre-line overflow-hidden max-h-[300px] relative">
                  <div className="text-[8px] font-black text-emerald-500 uppercase mb-3 flex items-center gap-2">
                    <Brain size={12} />
                    Último Diagnóstico Gerado ({new Date(athlete.diagnostics[athlete.diagnostics.length - 1].date).toLocaleDateString()})
                  </div>
                  {athlete.diagnostics[athlete.diagnostics.length - 1].report}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                </div>
              ) : (
                <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 text-[10px] text-zinc-500 italic text-center">
                  Nenhum diagnóstico de inteligência artificial gerado para este atleta.
                </div>
              )}
            </div>
          </section>
        </div>
      </ReportPage>

      {/* PAGE 5: HEALTH & BIOMETRICS */}
      <ReportPage pageNumber={5} totalPages={totalPages} athlete={athlete}>
        <div className="space-y-8">
          <section className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-tight border-l-4 border-zinc-900 pl-3">5. Biometria, Saúde e Histórico Clínico</h3>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <table className="w-full border-collapse border border-zinc-200 text-[10px]">
                  <thead>
                    <tr className="bg-zinc-50">
                      <th className="border border-zinc-200 p-3 text-left font-black uppercase text-[8px]">Indicador</th>
                      <th className="border border-zinc-200 p-3 text-left font-black uppercase text-[8px]">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-zinc-200 p-3 font-bold">Peso Atual</td>
                      <td className="border border-zinc-200 p-3">{athlete.nutrition?.[0]?.weight || '--'} kg</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-200 p-3 font-bold">% Gordura</td>
                      <td className="border border-zinc-200 p-3">{athlete.nutrition?.[0]?.body_fat_pct || '--'}%</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-200 p-3 font-bold">HRV (Variabilidade)</td>
                      <td className="border border-zinc-200 p-3">{athlete.biometrics?.hrv || '--'} ms</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-200 p-3 font-bold">SpO2</td>
                      <td className="border border-zinc-200 p-3">{athlete.biometrics?.spo2 || '--'}%</td>
                    </tr>
                  </tbody>
                </table>
                
                <div className="space-y-3 mt-6">
                  <h4 className="text-[10px] font-black uppercase text-zinc-400">Histórico de Saúde Recente</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {health.slice(0, 10).map((log: any, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-zinc-100 text-[9px] flex justify-between items-center">
                        <span className="font-bold text-zinc-900">{new Date(log.date).toLocaleDateString()}</span>
                        <span className="text-zinc-500 font-medium">
                          HRV: <span className="text-zinc-900 font-black">{log.hrv || '--'}</span> | SpO2: <span className="text-zinc-900 font-black">{log.spo2 || '--'}%</span>
                        </span>
                      </div>
                    ))}
                    {health.length === 0 && <div className="col-span-2 text-[9px] text-zinc-400 italic text-center py-4">Nenhum registro de saúde recente.</div>}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </ReportPage>

      {/* PAGE 6: COMPETITIONS & DISCIPLINE */}
      <ReportPage pageNumber={6} totalPages={totalPages} athlete={athlete}>
        <div className="space-y-8">
          <section className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-tight border-l-4 border-zinc-900 pl-3">6. Histórico Competitivo</h3>
            <table className="w-full border-collapse border border-zinc-200 text-[10px]">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="border border-zinc-200 p-3 text-left font-black uppercase text-[8px]">Data</th>
                  <th className="border border-zinc-200 p-3 text-left font-black uppercase text-[8px]">Competição</th>
                  <th className="border border-zinc-200 p-3 text-left font-black uppercase text-[8px]">Categoria</th>
                  <th className="border border-zinc-200 p-3 text-left font-black uppercase text-[8px]">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {competitions.length > 0 ? competitions.map((comp: any, idx: number) => (
                  <tr key={idx}>
                    <td className="border border-zinc-200 p-3">{new Date(comp.date).toLocaleDateString()}</td>
                    <td className="border border-zinc-200 p-3 font-bold">{comp.name}</td>
                    <td className="border border-zinc-200 p-3">{comp.weight_class} / {comp.belt}</td>
                    <td className="border border-zinc-200 p-3 font-black text-emerald-600">{comp.result}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="border border-zinc-200 p-6 text-center text-zinc-400 italic">Nenhuma competição registrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-tight border-l-4 border-zinc-900 pl-3">7. Cruzamento de Dados e Insights do Professor</h3>
            <div className="grid grid-cols-2 gap-4">
              {coachInsights && coachInsights.length > 0 ? (
                coachInsights.map((insight: any, idx: number) => (
                  <div key={idx} className={cn(
                    "p-4 rounded-xl border flex gap-3 items-start",
                    insight.type === 'warning' ? "bg-rose-50 border-rose-100" :
                    insight.type === 'psych' ? "bg-indigo-50 border-indigo-100" :
                    insight.type === 'nutrition' ? "bg-amber-50 border-amber-100" :
                    "bg-emerald-50 border-emerald-100"
                  )}>
                    <div className={cn(
                      "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
                      insight.type === 'warning' ? "bg-rose-100 text-rose-600" :
                      insight.type === 'psych' ? "bg-indigo-100 text-indigo-600" :
                      insight.type === 'nutrition' ? "bg-amber-100 text-amber-600" :
                      "bg-emerald-100 text-emerald-600"
                    )}>
                      {insight.type === 'warning' ? <Activity size={12} /> : 
                       insight.type === 'psych' ? <Brain size={12} /> :
                       insight.type === 'nutrition' ? <Scale size={12} /> :
                       <Trophy size={12} />}
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-zinc-900 mb-1">{insight.title}</div>
                      <div className="text-[8px] text-zinc-700 leading-relaxed">{insight.text}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-6 text-zinc-500 text-[9px] italic border border-zinc-200 rounded-xl bg-zinc-50">
                  Dados insuficientes para gerar insights automáticos neste período.
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-tight border-l-4 border-zinc-900 pl-3">8. Perfil Disciplinar e Psicológico</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  <h4 className="text-[8px] font-black uppercase text-zinc-900 mb-3">Métricas Psicológicas (Última Avaliação)</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Disciplina', value: latestPsych.disciplina || 0 },
                      { label: 'Resiliência', value: latestPsych.resiliencia || 0 },
                      { label: 'Foco', value: latestPsych.foco || 0 },
                      { label: 'Controle Emocional', value: latestPsych.controle_emocional || 0 },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-20 text-[7px] font-bold uppercase text-zinc-500">{item.label}</div>
                        <div className="flex-1 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                          <div className="h-full bg-zinc-900" style={{ width: `${(item.value / 10) * 100}%` }} />
                        </div>
                        <div className="text-[7px] font-black">{item.value}/10</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[8px] font-black uppercase text-zinc-400">Registros de Disciplina</h4>
                <div className="space-y-2">
                  {discipline.slice(0, 5).map((log: any, idx: number) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-zinc-100 text-[8px] space-y-1">
                      <div className="flex justify-between font-black uppercase">
                        <span>{log.type}</span>
                        <span className="text-zinc-400">{new Date(log.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-zinc-600 italic">"{log.description}"</p>
                    </div>
                  ))}
                  {discipline.length === 0 && <div className="text-[8px] text-zinc-400 italic">Nenhum registro disciplinar.</div>}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-tight border-l-4 border-zinc-900 pl-3">9. Status Financeiro</h3>
            <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100 flex justify-between items-center">
              <div>
                <div className="text-[7px] font-black text-zinc-400 uppercase">Plano de Assinatura</div>
                <div className="text-sm font-black text-zinc-900 uppercase">{plan?.name || 'N/A'}</div>
              </div>
              <div className="text-right">
                <div className="text-[7px] font-black text-zinc-400 uppercase">Situação de Pagamento</div>
                <div className={cn("text-sm font-black uppercase", athlete.payment_status === 'paid' ? 'text-emerald-600' : 'text-rose-600')}>
                  {athlete.payment_status === 'paid' ? 'REGULAR / EM DIA' : 'PENDENTE / EM ATRASO'}
                </div>
              </div>
            </div>
          </section>
        </div>
      </ReportPage>

      {/* PAGE 7: SELECTION REPORT (Only for Candidates) */}
      {athlete.is_candidate && (
        <ReportPage pageNumber={7} totalPages={totalPages} athlete={athlete}>
          <div className="space-y-8">
            <h3 className="text-2xl font-black uppercase tracking-tighter border-l-8 border-emerald-500 pl-4">Relatório de Seleção PAC</h3>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <div className="text-[8px] font-black text-zinc-400 uppercase mb-1">Status Atual</div>
                <div className="text-sm font-black text-emerald-600 uppercase">{athlete.selection_status}</div>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <div className="text-[8px] font-black text-zinc-400 uppercase mb-1">Aptidão Física</div>
                <div className="text-sm font-black text-zinc-900">{athlete.latest_physical_power || 0}%</div>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <div className="text-[8px] font-black text-zinc-400 uppercase mb-1">Prontidão Mental</div>
                <div className="text-sm font-black text-zinc-900">{athlete.latest_psych_score ? Math.round((athlete.latest_psych_score / 200) * 100) : 0}%</div>
              </div>
            </div>

            <section className="space-y-4">
              <h4 className="text-sm font-black uppercase text-zinc-900">Parecer Técnico de Competências</h4>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                {[
                  { id: 'raspagens', label: 'Raspagens' },
                  { id: 'passagens', label: 'Passagens' },
                  { id: 'finalizacoes', label: 'Finalizações' },
                  { id: 'quedas', label: 'Quedas' },
                  { id: 'defesa', label: 'Defesa' },
                  { id: 'back_takes', label: 'Costas' },
                ].map((tech) => (
                  <div key={tech.id} className="flex items-center justify-between border-b border-zinc-100 pb-2">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase">{tech.label}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div 
                          key={star} 
                          className={cn(
                            "w-3 h-3 rounded-sm",
                            (athlete.technical_competencies?.[tech.id] || 0) >= (star * 20) ? "bg-emerald-500" : "bg-zinc-200"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h4 className="text-sm font-black uppercase text-zinc-900">Veredito do Laboratório</h4>
              <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-8 min-h-[200px]">
                <div className="text-zinc-300 font-black text-4xl uppercase opacity-20 text-center mt-10">
                  Espaço para Assinatura e Carimbo do Professor
                </div>
              </div>
              <p className="text-[9px] text-zinc-500 italic text-center">
                Este documento é de uso exclusivo da coordenação do Programa de Atletas de Cristo (PAC).
                A falsificação ou uso indevido está sujeito a sanções disciplinares.
              </p>
            </section>
          </div>
        </ReportPage>
      )}
    </div>
  );
};

const AthleteDossier = ({ athlete: athleteProp, academies, plans, onBack, currentRole }: { athlete: any, academies: Academy[], plans: Plan[], onBack?: (() => void) | null, currentRole: string }) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  console.log('AthleteDossier athleteProp:', athleteProp);
  console.log('AthleteDossier academies:', academies);
  const [activeSubTab, setActiveSubTab] = useState<'performance' | 'nutrition' | 'public' | 'intelligence' | 'finance' | 'technical' | 'discipline'>('performance');
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [editingNutritionPlan, setEditingNutritionPlan] = useState<any>(null);
  const [isDeleteNutritionModalOpen, setIsDeleteNutritionModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<any>(null);
  const [consumption, setConsumption] = useState('');
  const [graduationConfig, setGraduationConfig] = useState<any>(null);
  const [isUpdatingCompetency, setIsUpdatingCompetency] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagnostic, setDiagnostic] = useState<string | null>(null);
  const [selectedNutritionPlan, setSelectedNutritionPlan] = useState<any>(null);
  const [athlete, setAthlete] = useState(athleteProp);

  useEffect(() => {
    setAthlete(athleteProp);
    const fetchSubcollections = async () => {
      if (!athleteProp.id) return;
      
      // Fetch subcollections from Firestore
      const physical = await getDocs(collection(db, `athletes/${athleteProp.id}/physical_evaluations`));
      const psychological = await getDocs(collection(db, `athletes/${athleteProp.id}/psychological_evaluations`));
      const training = await getDocs(collection(db, `athletes/${athleteProp.id}/training_logs`));
      const competitions = await getDocs(collection(db, `athletes/${athleteProp.id}/competitions`));
      const nutritionFirestore = await getDocs(collection(db, `athletes/${athleteProp.id}/nutrition_plans`));
      const technical = await getDocs(collection(db, `athletes/${athleteProp.id}/technical_evaluations`));
      const health = await getDocs(collection(db, `athletes/${athleteProp.id}/health_logs`));
      const discipline = await getDocs(collection(db, `athletes/${athleteProp.id}/discipline_logs`));
      
      // Fetch technique progress and submissions
      let targetAthleteId = athleteProp.user_id;
      
      // Always try to find the correct user_id by email to fix any potential mismatches
      if (athleteProp.email) {
        const userQuery = query(collection(db, 'users'), where('email', '==', athleteProp.email), limit(1));
        const userDocs = await getDocs(userQuery);
        if (!userDocs.empty) {
          const correctUserId = userDocs.docs[0].id;
          if (targetAthleteId !== correctUserId) {
            targetAthleteId = correctUserId;
            // Update the athlete doc with the correct user_id
            try {
              await updateDoc(doc(db, 'athletes', athleteProp.id), { user_id: targetAthleteId });
              setAthlete(prev => ({ ...prev, user_id: targetAthleteId }));
            } catch (e) {
              console.error("Could not update athlete with correct user_id", e);
            }
          }
        }
      }
      
      // Fallback to athleteProp.id if still not found (legacy data)
      targetAthleteId = targetAthleteId || athleteProp.id;

      const progressQuery = query(collection(db, 'student_technique_progress'), where('athlete_id', '==', targetAthleteId));
      const progressDocs = await getDocs(progressQuery);
      
      const submissionsQuery = query(collection(db, 'technique_submissions'), where('athlete_id', '==', targetAthleteId));
      const submissionsDocs = await getDocs(submissionsQuery);
      
      const techniquesSnapshot = await getDocs(collection(db, 'techniques'));
      const techniques = techniquesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Fetch nutrition plans from API
      let nutritionAPI = [];
      try {
        const response = await fetch(`/api/athletes/${athleteProp.user_id}/nutrition`);
        if (response.ok) {
          nutritionAPI = await response.json();
        }
      } catch (error) {
        console.error('Error fetching nutrition from API:', error);
      }
      
      const nutritionData = [
        ...nutritionFirestore.docs.map(d => ({ id: d.id, ...d.data() })),
        ...nutritionAPI
      ];
      
      const progressData = progressDocs.docs.map(d => ({ id: d.id, ...d.data() }));
      console.log('Fetched progress data for athlete', targetAthleteId, ':', progressData);
      
      setAthlete({
        ...athleteProp,
        user_id: targetAthleteId,
        physical: physical.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        psychological: psychological.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        training: training.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        competitions: competitions.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        nutrition: nutritionData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        technical: technical.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        health: health.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        discipline: discipline.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        technique_progress: progressData,
        technique_submissions: submissionsDocs.docs.map(d => ({ id: d.id, ...d.data() })),
        techniques: techniques
      });
      console.log('AthleteDossier athlete state updated with nutrition:', nutritionData.length);
    };
    fetchSubcollections();
  }, [athleteProp.id]);

  useEffect(() => {
    if (!athleteProp.id) return;
    const athleteDocRef = doc(db, 'athletes', athleteProp.id);
    const unsubscribe = onSnapshot(athleteDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setAthlete(prev => ({ ...prev, ...snapshot.data() }));
      }
    });
    return () => unsubscribe();
  }, [athleteProp.id]);

  useEffect(() => {
    if (!athlete.user_id) return;
    const q = query(collection(db, 'student_technique_progress'), where('athlete_id', '==', athlete.user_id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const progressData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setAthlete(prev => ({ ...prev, technique_progress: progressData }));
    });
    return () => unsubscribe();
  }, [athlete.user_id]);

  useEffect(() => {
    if (athlete.techniques && athlete.technique_progress && athlete.belt) {
      const normalizeBelt = (belt: string) => belt ? belt.split(' (')[0].trim().toLowerCase() : '';
      const getEffectiveBelt = (belt: string) => {
        const normalized = normalizeBelt(belt);
        const kidsBelts = ['cinza', 'amarela', 'laranja', 'verde'];
        const isKidsBelt = kidsBelts.some(kb => normalized.includes(kb)) || (belt || '').toLowerCase().includes('infantil');
        return isKidsBelt ? 'branca' : normalized;
      };
      const effectiveAthleteBelt = getEffectiveBelt(athlete.belt);
      const beltTechniques = athlete.techniques.filter((t: any) => normalizeBelt(t.belt) === effectiveAthleteBelt);
      if (beltTechniques.length > 0) {
        const masteredCount = beltTechniques.filter((t: any) => {
          const progress = athlete.technique_progress?.find((p: any) => p.technique_id === t.id);
          return progress?.status === 'validated';
        }).length;
        const newPercentage = Math.round((masteredCount / beltTechniques.length) * 100);
        
        if (athlete.mastered_techniques_percentage !== newPercentage) {
          setAthlete((prev: any) => ({ ...prev, mastered_techniques_percentage: newPercentage }));
          updateDoc(doc(db, 'athletes', athlete.id), {
            mastered_techniques_percentage: newPercentage
          }).catch(err => console.error("Error updating mastered percentage:", err));
        }
      }
    }
  }, [athlete.techniques, athlete.technique_progress, athlete.belt, athlete.id]);

  useEffect(() => {
    if (athlete && athlete.id) {
      const pacMetrics = calculatePACScore(athlete);
      if (pacMetrics.score !== athlete.score || pacMetrics.classification !== athlete.classification) {
        setAthlete((prev: any) => ({
          ...prev,
          score: pacMetrics.score,
          classification: pacMetrics.classification
        }));
        updateDoc(doc(db, 'athletes', athlete.id), {
          score: pacMetrics.score,
          classification: pacMetrics.classification
        }).catch(err => console.error("Error syncing PAC score:", err));
      }
    }
  }, [athlete]);

  const generateDiagnostic = async () => {
    setIsGenerating(true);
    setDiagnostic(null);
    try {
      const ai = getGenAI();
      const prompt = `
        Analise o dossiê do atleta: ${JSON.stringify(athlete)}.
        Dados recentes:
        - Último VO2 Max (Cooper): ${athlete.cooper_tests?.[athlete.cooper_tests.length - 1]?.vo2_max_estimated || 'N/A'}
        - TDEE (Calorimetria): ${athlete.calorimetry_history?.[athlete.calorimetry_history.length - 1]?.tdee_estimated || 'N/A'}
        - Plano nutricional atual: ${JSON.stringify(athlete.nutrition?.[0])}
        
        Diagnostique:
        1. O atleta está atingindo os objetivos de condicionamento?
        2. O plano nutricional está alinhado com o gasto calórico real?
        3. Sugira ajustes no treino e na dieta.
      `;
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
      });
      const reportText = response.text || 'Não foi possível gerar o diagnóstico.';
      setDiagnostic(reportText);

      // Save to Firestore
      const newReport = { date: new Date().toISOString().split('T')[0], report: reportText };
      await updateDoc(doc(db, 'athletes', athlete.id), {
        diagnostics: [...(athlete.diagnostics || []), newReport]
      });

    } catch (error) {
      console.error(error);
      setDiagnostic('Erro ao gerar diagnóstico.');
    } finally {
      setIsGenerating(false);
    }
  };

  const updateAcademy = async (newAcademyId: string) => {
    try {
      await updateDoc(doc(db, 'athletes', athlete.id), {
        academy_id: newAcademyId
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `athletes/${athlete.id}`);
    }
  };

  const updateCompetency = async (technique: string, level: number) => {
    setIsUpdatingCompetency(true);
    try {
      const updatedCompetencies = {
        ...athlete.technical_competencies,
        [technique]: level
      };

      const updatedAthlete = {
        ...athlete,
        technical_competencies: updatedCompetencies
      };

      const pacMetrics = calculatePACScore(updatedAthlete);

      await updateDoc(doc(db, 'athletes', athlete.id), {
        [`technical_competencies.${technique}`]: level,
        score: pacMetrics.score,
        classification: pacMetrics.classification
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `athletes/${athlete.id}`);
    } finally {
      setIsUpdatingCompetency(false);
    }
  };

  useEffect(() => {
    const fetchConfig = async () => {
      const docRef = doc(db, 'graduation_config', 'jiujitsu');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.belts) {
          const uniqueBelts: any[] = [];
          const seenIds = new Set();
          for (const belt of data.belts) {
            if (belt.id && !seenIds.has(belt.id)) {
              uniqueBelts.push(belt);
              seenIds.add(belt.id);
            }
          }
          data.belts = uniqueBelts;
        }
        setGraduationConfig(data);
      }
    };
    fetchConfig();
  }, []);

  const checkEligibility = () => {
    if (!graduationConfig) return null;
    const beltConfig = graduationConfig.belts.find((b: any) => b.id === athlete.belt);
    if (!beltConfig) return null;

    if (beltConfig.graduationType === 'standard') {
      if (athlete.stripes >= beltConfig.maxStripes) return "Pronto para graduação de faixa!";
    } else if (beltConfig.graduationType === 'timeBased') {
      const nextDegree = (athlete.stripes || 0) + 1;
      const rule = beltConfig.timeBasedRules.find((r: any) => r.degree === nextDegree);
      if (rule && athlete.last_graduation_date) {
        const lastDate = new Date(athlete.last_graduation_date);
        const yearsSince = (new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        if (yearsSince >= rule.yearsRequired) return `Pronto para ${nextDegree}º grau!`;
      }
    }
    return null;
  };

  const eligibilityMessage = checkEligibility();

  const academy = academies.find(a => a.id === athlete.academy_id);
  const plan = plans.find(p => p.id === athlete.plan_id);
  const totalPages = athlete.is_candidate ? 7 : 6;

  const exportToPDF = async () => {
    const container = document.getElementById('athlete-dossier-print-container');
    if (!container) return;
    
    const pages = container.querySelectorAll('.report-page');
    if (pages.length === 0) return;

    // Temporarily show the container for capturing
    const originalStyle = container.style.cssText;
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.zIndex = '9999';
    container.style.visibility = 'visible';
    container.style.display = 'block';

    // --- HACK TO FIX OKLCH ERROR IN HTML2CANVAS ---
    const originalGetComputedStyle = window.getComputedStyle;
    const originalGetPropertyValue = CSSStyleDeclaration.prototype.getPropertyValue;

    window.getComputedStyle = function(elt, pseudoElt) {
      const style = originalGetComputedStyle(elt, pseudoElt);
      return new Proxy(style, {
        get(target, prop) {
          const value = target[prop as any];
          if (typeof value === 'string' && (value.includes('oklch') || value.includes('oklab'))) {
            return value.replace(/(oklch|oklab)\([^)]+\)/g, 'rgb(128, 128, 128)');
          }
          if (typeof value === 'function') {
            return (value as Function).bind(target);
          }
          return value;
        }
      });
    };

    CSSStyleDeclaration.prototype.getPropertyValue = function(prop) {
      const value = originalGetPropertyValue.call(this, prop);
      if (value && typeof value === 'string' && (value.includes('oklch') || value.includes('oklab'))) {
        return value.replace(/(oklch|oklab)\([^)]+\)/g, 'rgb(128, 128, 128)');
      }
      return value;
    };
    // ----------------------------------------------

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // --- CONVERT IMAGES TO BASE64 TO AVOID CORS IN PDF ---
      const images = Array.from(container.querySelectorAll('img'));
      
      // Process images sequentially to avoid 429 Too Many Requests
      for (const img of images) {
        if (img.src.startsWith('data:') || img.src.startsWith('blob:')) continue;
        
        const originalSrc = img.src;
        
        const fetchAsBase64 = async (urlToFetch: string, useCors: boolean = true, retries = 3): Promise<string> => {
          for (let i = 0; i < retries; i++) {
            try {
              const options: RequestInit = useCors 
                ? { mode: 'cors', credentials: 'omit', cache: 'no-cache' } 
                : { cache: 'no-cache' };
                
              const response = await fetch(urlToFetch, options);
              
              if (response.status === 429) {
                console.warn(`Rate limited (429) for ${urlToFetch}. Retrying in ${1000 * (i + 1)}ms...`);
                await new Promise(r => setTimeout(r, 1000 * (i + 1)));
                continue;
              }
              
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              
              const contentType = response.headers.get('content-type');
              if (contentType && !contentType.startsWith('image/') && !contentType.includes('octet-stream')) {
                throw new Error(`Invalid content type: ${contentType}`);
              }
              
              const blob = await response.blob();
              return await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
            } catch (error) {
              if (i === retries - 1) throw error;
              await new Promise(r => setTimeout(r, 1000 * (i + 1)));
            }
          }
          throw new Error("Max retries reached");
        };

        const setImgSrcAndWait = async (base64: string) => {
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = base64;
          });
        };

        try {
          // 1. Try direct fetch (no URL modification to avoid breaking Firebase Storage tokens)
          await setImgSrcAndWait(await fetchAsBase64(originalSrc));
        } catch (e1) {
          console.warn("Direct fetch failed, trying proxy 1...", e1);
          try {
            // 2. Try allorigins proxy
            const proxy1 = `https://api.allorigins.win/raw?url=${encodeURIComponent(originalSrc)}`;
            await setImgSrcAndWait(await fetchAsBase64(proxy1, true));
          } catch (e2) {
            console.warn("Proxy 1 failed, trying proxy 2...", e2);
            try {
              // 3. Try corsproxy.io
              const proxy2 = `https://corsproxy.io/?${encodeURIComponent(originalSrc)}`;
              await setImgSrcAndWait(await fetchAsBase64(proxy2, true));
            } catch (e3) {
              console.warn("Proxy 2 failed, trying proxy 3...", e3);
              try {
                // 4. Try codetabs proxy
                const proxy3 = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(originalSrc)}`;
                await setImgSrcAndWait(await fetchAsBase64(proxy3, true));
              } catch (e4) {
                console.error("All fetch attempts failed for image:", originalSrc, e4);
                img.crossOrigin = "anonymous";
              }
            }
          }
        }
        
        // Small delay between images to further prevent rate limiting
        await new Promise(r => setTimeout(r, 300));
      }

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        
        // Ensure images are loaded
        const images = Array.from(page.querySelectorAll('img'));
        await Promise.all(images.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }));

        // Small delay to ensure rendering
        await new Promise(r => setTimeout(r, 1000));

        const canvas = await html2canvas(page, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: false,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`Dossier_${athlete.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
    } finally {
      container.style.cssText = originalStyle;
      window.getComputedStyle = originalGetComputedStyle;
      CSSStyleDeclaration.prototype.getPropertyValue = originalGetPropertyValue;
    }
  };

  const latestPsych = athlete.psychological?.[0] || {};
  const latestPhysical = athlete.physical?.[0] || {};
  const latestNutrition = athlete.nutrition?.[0] || {};
  
  const metrics = calculateIntelligentMetrics(athlete);

  const radarData = [
    { subject: 'Força (TAF)', A: metrics.strengthScore, fullMark: 100 },
    { subject: 'Resistência', A: metrics.enduranceScore, fullMark: 100 },
    { subject: 'Mentalidade', A: metrics.mentalToughness, fullMark: 100 },
    { subject: 'Técnica', A: metrics.technicalScore, fullMark: 100 },
    { subject: 'Disciplina', A: metrics.disciplineScore, fullMark: 100 },
    { subject: 'Competitividade', A: metrics.competitiveScore, fullMark: 100 },
  ];

  const insights = [];
    
  if (metrics.consistencyScore < 40) {
    insights.push({
      type: 'warning',
      title: 'Baixo Volume de Treino',
      text: 'O atleta apresentou uma queda na consistência nas últimas 2 semanas. Risco de perda de ritmo competitivo.'
    });
  }
  
  if (metrics.mentalToughness < metrics.strengthScore - 20) {
    insights.push({
      type: 'psych',
      title: 'Gap Psicológico',
      text: 'O nível de força física supera significativamente a resiliência mental. Foco em controle emocional.'
    });
  }

  if (latestNutrition.body_fat_pct > 18 && athlete.weight_class.includes('Leve')) {
    insights.push({
      type: 'nutrition',
      title: 'Ajuste de Categoria',
      text: 'Percentual de gordura acima do ideal para a categoria. Sugerido protocolo de "Cut" progressivo.'
    });
  }

  if (metrics.enduranceScore > 85 && metrics.strengthScore > 85) {
    insights.push({
      type: 'success',
      title: 'Pico de Performance',
      text: 'Atleta em excelentes condições físicas. Momento ideal para intensificar sparrings e competições de alto nível.'
    });
  }

  const coachInsights = insights;

  return (
    <div className="p-6">
      {eligibilityMessage && (
        <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl mb-6 flex items-center justify-between">
          <span className="font-bold">{eligibilityMessage}</span>
          <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-sm">Graduar</button>
        </div>
      )}
      <div id="athlete-dossier-content" className="space-y-6">
        {/* Hidden full version for PDF export */}
        <div id="athlete-dossier-print-container" style={{ position: 'absolute', left: '-9999px', top: 0, width: '1000px', display: 'none' }}>
          <DossierFullView 
            athlete={athlete} 
            radarData={radarData} 
            metrics={metrics} 
            latestPsych={latestPsych} 
            coachInsights={coachInsights} 
            plan={plan} 
            academy={academy} 
            selectedNutritionPlan={selectedNutritionPlan}
          />
        </div>
      <div className="space-y-8">
      <div className="flex items-center justify-between">
        {onBack ? (
          <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest">
            <ChevronRight className="rotate-180" size={16} />
            Voltar para Lista
          </button>
        ) : (
          <div className="flex items-center gap-2 text-emerald-500 font-black uppercase text-xs tracking-[0.2em]">
            <Activity size={16} />
            Seu Dossiê PAC
          </div>
        )}
        <div className="flex items-center gap-4">
          <select 
            value={athlete.academy_id || ''} 
            onChange={(e) => updateAcademy(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none focus:border-emerald-500 transition-all"
          >
            <option value="">Sem Academia</option>
            {academies.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Download size={16} />
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-zinc-800">
        <button 
          onClick={() => setActiveSubTab('performance')}
          className={cn(
            "pb-4 px-2 text-sm font-bold transition-all border-b-2",
            activeSubTab === 'performance' ? "border-emerald-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          Performance & TAF
        </button>
        <button 
          onClick={() => setActiveSubTab('intelligence')}
          className={cn(
            "pb-4 px-2 text-sm font-bold transition-all border-b-2",
            activeSubTab === 'intelligence' ? "border-emerald-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          Dossiê de Inteligência
        </button>
        <button 
          onClick={() => setActiveSubTab('technical')}
          className={cn(
            "pb-4 px-2 text-sm font-bold transition-all border-b-2",
            activeSubTab === 'technical' ? "border-emerald-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          Técnica
        </button>
        <button 
          onClick={() => setActiveSubTab('nutrition')}
          className={cn(
            "pb-4 px-2 text-sm font-bold transition-all border-b-2",
            activeSubTab === 'nutrition' ? "border-emerald-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          Plano Nutricional
        </button>
        <button 
          onClick={() => setActiveSubTab('public')}
          className={cn(
            "pb-4 px-2 text-sm font-bold transition-all border-b-2",
            activeSubTab === 'public' ? "border-emerald-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          Perfil Público
        </button>
        <button 
          onClick={() => setActiveSubTab('finance')}
          className={cn(
            "pb-4 px-2 text-sm font-bold transition-all border-b-2",
            activeSubTab === 'finance' ? "border-emerald-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          Financeiro
        </button>
        <button 
          onClick={() => setActiveSubTab('discipline')}
          className={cn(
            "pb-4 px-2 text-sm font-bold transition-all border-b-2",
            activeSubTab === 'discipline' ? "border-emerald-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          Disciplina
        </button>
      </div>

      <div className="space-y-8">
        {activeSubTab !== 'public' && (
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-emerald-500/20">
              {(athlete.name || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-white">{athlete.name}</h2>
                {athlete.is_candidate && (
                  <span className={cn(
                    "text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest",
                    athlete.selection_status === 'Aprovado' ? "bg-emerald-500/10 text-emerald-500" :
                    athlete.selection_status === 'Reprovado' ? "bg-rose-500/10 text-rose-500" :
                    athlete.selection_status === 'Teste' ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                  )}>
                    Candidato PAC: {athlete.selection_status === 'Teste' ? 'Teste de Tatame' : athlete.selection_status}
                  </span>
                )}
              </div>
              <p className="text-zinc-500 text-sm uppercase tracking-widest">
                {academy?.name || 'Academia não vinculada'} • {athlete.belt} ({athlete.stripes} {athlete.stripes === 1 ? 'Grau' : 'Graus'}) • {athlete.weight_class} • {athlete.classification}
              </p>
            </div>
          </div>
        )}

        {activeSubTab === 'technical' && (
          <div className="space-y-8">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-tight">Progresso em Técnicas</h3>
              
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Buscar técnica..."
                  className="w-full bg-zinc-800 text-white p-3 rounded-xl border border-zinc-700 focus:outline-none focus:border-emerald-500"
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const allTechElements = document.querySelectorAll('[data-tech-name]');
                    allTechElements.forEach((el: any) => {
                      const name = el.getAttribute('data-tech-name').toLowerCase();
                      el.style.display = name.includes(searchTerm) ? 'block' : 'none';
                    });
                  }}
                />
              </div>

              <div className="space-y-4">
                {(() => {
                  const categories = [
                    { id: 'quedas', label: 'Quedas', match: ['Quedas'] },
                    { id: 'guardas', label: 'Guardas', match: ['Guardas'] },
                    { id: 'passagens', label: 'Passagens', match: ['Passagens'] },
                    { id: 'raspagens', label: 'Raspagens', match: ['Raspagens'] },
                    { id: 'finalizacoes', label: 'Finalizações', match: ['Finalizações', 'Finalização', 'Americana', 'Americana da Montada'] },
                    { id: 'costas', label: 'Costas', match: ['Costas'] },
                    { id: 'cem_quilos', label: 'Cem Quilos', match: ['Cem Quilos'] },
                    { id: 'transicoes', label: 'Transições', match: ['Transições'] },
                    { id: 'emborcado', label: 'Emborcado', match: ['Emborcado'] },
                  ];

                  const startedTechniques = athlete.techniques?.filter((tech: any) => {
                    const progress = athlete.technique_progress?.find((p: any) => p.technique_id === tech.id);
                    return progress && progress.status !== 'not_started';
                  }) || [];
                  
                  const statusCounts = startedTechniques.reduce((acc: any, tech: any) => {
                    const progress = athlete.technique_progress?.find((p: any) => p.technique_id === tech.id);
                    const status = progress?.status || 'not_started';
                    acc[status] = (acc[status] || 0) + 1;
                    return acc;
                  }, {});

                  return (
                    <>
                      <div className="flex flex-wrap gap-4 mb-8 bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                        <div className="text-sm text-zinc-400 font-bold">Total Iniciadas: {startedTechniques.length}</div>
                        {Object.entries(statusCounts).map(([status, count]) => (
                          <div key={status} className={`text-sm font-bold ${
                            status === 'rejected' ? 'text-amber-500' : 
                            status === 'submitted' ? 'text-blue-500' : 
                            status === 'validated' ? 'text-emerald-500' : 
                            'text-zinc-400'
                          }`}>
                            {status === 'studying' ? 'Em Estudo' : 
                             status === 'submitted' ? 'Submetido' : 
                             status === 'rejected' ? 'Correções' : 
                             status === 'validated' ? 'Validado' : status}: {String(count)}
                          </div>
                        ))}
                      </div>

                      {categories.map(cat => {
                        const filteredTechs = athlete.techniques?.filter((tech: any) => cat.match.some(m => m.toLowerCase() === tech.category?.toLowerCase())) || [];
                        const startedFilteredTechs = filteredTechs.filter((tech: any) => {
                          const progress = athlete.technique_progress?.find((p: any) => p.technique_id === tech.id);
                          return progress && progress.status !== 'not_started';
                        });
                        const isExpanded = expandedCategories.includes(cat.id);

                        return (
                          <div key={cat.id} className="mb-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
                            <div className="flex justify-between items-center mb-6">
                              <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{cat.label}</h4>
                              <button 
                                onClick={() => setExpandedCategories(prev => prev.includes(cat.id) ? prev.filter(id => id !== cat.id) : [...prev, cat.id])}
                                className="text-xs font-bold text-emerald-500 hover:text-emerald-400"
                              >
                                {isExpanded ? 'Ocultar' : `Ver técnicas iniciadas (${startedFilteredTechs.length})`}
                              </button>
                            </div>
                            {isExpanded && (
                              startedFilteredTechs.length === 0 ? (
                                <p className="text-xs text-zinc-600 italic">Nenhuma técnica iniciada nesta categoria.</p>
                              ) : (
                                <div className="space-y-4">
                                  {startedFilteredTechs.map((tech: any) => {
                                    const progress = athlete.technique_progress?.find((p: any) => p.technique_id === tech.id);
                                    const submissions = athlete.technique_submissions?.filter((s: any) => s.technique_id === tech.id);
                                    return (
                                      <div key={tech.id} data-tech-name={tech.name} className="bg-zinc-800/30 border border-zinc-800 p-6 rounded-2xl">
                                        <div className="flex justify-between items-center mb-4">
                                          <span className="text-sm font-bold text-white">{tech.name}</span>
                                          {currentRole === 'professor' ? (
                                            <select 
                                              value={progress?.status || 'not_started'}
                                              onChange={async (e) => {
                                                const newStatus = e.target.value;
                                                const targetAthleteId = athlete.user_id || athlete.id;
                                                const progressId = `${targetAthleteId}_${tech.id}`;
                                                try {
                                                  await setDoc(doc(db, 'student_technique_progress', progressId), {
                                                    athlete_id: targetAthleteId,
                                                    technique_id: tech.id,
                                                    status: newStatus,
                                                    last_updated: new Date().toISOString()
                                                  }, { merge: true });
                                                } catch (error) {
                                                  console.error("Error updating progress:", error);
                                                }
                                              }}
                                              className="bg-zinc-900 border border-zinc-700 text-xs text-white rounded-lg px-2 py-1"
                                            >
                                              <option value="not_started">Não Iniciado</option>
                                              <option value="studying">Em Estudo</option>
                                              <option value="submitted">Submetido</option>
                                              <option value="validated">Validado</option>
                                              <option value="rejected">Correções (Rejeitado)</option>
                                            </select>
                                          ) : (
                                            <span className={cn(
                                              "text-xs font-bold",
                                              progress?.status === 'validated' ? "text-emerald-500" :
                                              progress?.status === 'rejected' ? "text-amber-500" :
                                              progress?.status === 'submitted' ? "text-blue-500" :
                                              "text-zinc-400"
                                            )}>
                                              {progress?.status === 'validated' ? 'Validado' :
                                               progress?.status === 'rejected' ? 'Correções Solicitadas' :
                                               progress?.status === 'submitted' ? 'Em Avaliação' :
                                               progress?.status === 'studying' ? 'Em Estudo' : 'Não Iniciado'}
                                            </span>
                                          )}
                                        </div>
                                        
                                        {submissions?.map((sub: any) => (
                                          <div key={sub.id} className="mt-4 bg-zinc-900 p-4 rounded-xl border border-zinc-700">
                                            <div className="flex items-center gap-4 mb-2">
                                              <video src={sub.video_url} controls className="w-32 h-20 rounded-lg bg-black" />
                                              <div className="text-xs text-zinc-400">
                                                <p>Submetido em: {new Date(sub.submitted_at).toLocaleDateString()}</p>
                                                <p className="font-bold">Status: {sub.status}</p>
                                              </div>
                                            </div>
                                            {(sub.professor_feedback || sub.feedback) && (
                                              <div className="mt-2 text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg">
                                                <span className="font-bold">Feedback:</span> {sub.professor_feedback || sub.feedback}
                                              </div>
                                            )}
                                            {currentRole === 'professor' && sub.status === 'pending' && (
                                              <div className="mt-2 flex gap-2">
                                                <input type="text" placeholder="Feedback..." className="flex-1 bg-zinc-800 text-xs p-2 rounded-lg" />
                                                <button className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-lg">Validar</button>
                                                <button className="bg-rose-500 text-white text-xs px-3 py-1 rounded-lg">Rejeitar</button>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                        
                                        {currentRole === 'athlete' && (progress?.status === 'not_started' || progress?.status === 'studying' || submissions.some((s: any) => s.status === 'rejected')) && (
                                          <button className="mt-4 w-full bg-emerald-500/20 text-emerald-500 text-xs font-bold py-2 rounded-lg">
                                            Enviar Vídeo
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )
                            )}
                          </div>
                        );
                      })}
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Matriz de Competências Técnicas</h3>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest">Nível de domínio por fundamento</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" /> Domínio Completo
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {[
                  { id: 'raspagens', label: 'Raspagens (Guarda)', icon: Shield },
                  { id: 'passagens', label: 'Passagens de Guarda', icon: Zap },
                  { id: 'finalizacoes', label: 'Finalizações', icon: Target },
                  { id: 'quedas', label: 'Quedas (Wrestling/Judo)', icon: TrendingDown },
                  { id: 'defesa', label: 'Defesa Pessoal / Saídas', icon: ShieldCheck },
                  { id: 'back_takes', label: 'Tomada de Costas', icon: MoveRight },
                  { id: 'mount_control', label: 'Controle de Montada', icon: Landmark },
                  { id: 'leg_locks', label: 'Chaves de Perna/Pé', icon: Lock },
                ].map((tech) => (
                  <div key={tech.id} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <tech.icon size={16} className="text-emerald-500" />
                        <span className="text-sm font-bold text-white">{tech.label}</span>
                      </div>
                      <span className="text-xs font-black text-emerald-500">
                        {athlete.technical_competencies?.[tech.id] || 0}%
                      </span>
                    </div>
                    <div className="relative pt-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={athlete.technical_competencies?.[tech.id] || 0}
                        onChange={(e) => updateCompetency(tech.id, parseInt(e.target.value))}
                        disabled={isUpdatingCompetency}
                        className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-tighter">Iniciante</span>
                        <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-tighter">Intermediário</span>
                        <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-tighter">Avançado</span>
                        <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-tighter">Mestre</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-tight">Análise de Gap Técnico</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-zinc-800/30 border border-zinc-800 rounded-2xl">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Forte</div>
                  <div className="text-emerald-500 font-black text-sm uppercase">
                    {Object.entries(athlete.technical_competencies || {})
                      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'N/A'}
                  </div>
                </div>
                <div className="p-4 bg-zinc-800/30 border border-zinc-800 rounded-2xl">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold mb-2">A Melhorar</div>
                  <div className="text-amber-500 font-black text-sm uppercase">
                    {Object.entries(athlete.technical_competencies || {})
                      .sort(([,a], [,b]) => (a as number) - (b as number))[0]?.[0] || 'N/A'}
                  </div>
                </div>
                <div className="p-4 bg-zinc-800/30 border border-zinc-800 rounded-2xl">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Equilíbrio Geral</div>
                  <div className="text-blue-500 font-black text-sm uppercase">
                    {(() => {
                      const vals = Object.values(athlete.technical_competencies || {});
                      if (vals.length === 0) return '0%';
                      const sum: number = vals.reduce((acc: number, v: any) => acc + (Number(v) || 0), 0) as number;
                      const avg: number = sum / vals.length;
                      return Math.round(avg) + '%';
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'intelligence' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              {/* Sleep Telemetry */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Moon size={20} className="text-indigo-400" />
                  Telemetria do Sono (PAC)
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-zinc-800/50 p-4 rounded-2xl">
                    <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Média de Horas</div>
                    <div className="text-2xl font-black text-white">{athlete.sleep_telemetry?.avg_hours || '--'}h</div>
                  </div>
                  <div className="bg-zinc-800/50 p-4 rounded-2xl">
                    <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Qualidade (REM)</div>
                    <div className="text-2xl font-black text-white">{athlete.sleep_telemetry?.deep_sleep_pct || '--'}%</div>
                  </div>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart data={[
                      { name: 'Seg', hours: 7.5 },
                      { name: 'Ter', hours: 8.2 },
                      { name: 'Qua', hours: 6.8 },
                      { name: 'Qui', hours: 7.9 },
                      { name: 'Sex', hours: 8.5 },
                      { name: 'Sáb', hours: 9.0 },
                      { name: 'Dom', hours: 8.8 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }} />
                      <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Biometrics */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Heart size={20} className="text-rose-400" />
                  Biometria & Recuperação
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800/50">
                    <span className="text-zinc-400 text-sm">Frequência Cardíaca Repouso</span>
                    <span className="text-white font-bold">{athlete.biometrics?.resting_hr || '--'} BPM</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800/50">
                    <span className="text-zinc-400 text-sm">Variabilidade Cardíaca (HRV)</span>
                    <span className="text-white font-bold">{athlete.biometrics?.hrv || '--'} ms</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800/50">
                    <span className="text-zinc-400 text-sm">Saturação de Oxigênio (SpO2)</span>
                    <span className="text-white font-bold">{athlete.biometrics?.spo2 || '--'}%</span>
                  </div>
                </div>
              </div>

              {/* Physiological Tests */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Activity size={20} className="text-emerald-400" />
                  Testes Fisiológicos
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Último Teste de Cooper</h4>
                    {athlete.cooper_tests && athlete.cooper_tests.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-800/50 p-4 rounded-2xl">
                          <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1">VO2 Max Estimado</div>
                          <div className="text-2xl font-black text-emerald-500">{athlete.cooper_tests[athlete.cooper_tests.length - 1].vo2_max_estimated || '--'}</div>
                          <div className="text-[10px] text-zinc-500 mt-1">ml/kg/min</div>
                        </div>
                        <div className="bg-zinc-800/50 p-4 rounded-2xl">
                          <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Distância (12 min)</div>
                          <div className="text-2xl font-black text-white">{athlete.cooper_tests[athlete.cooper_tests.length - 1].distance_meters || '--'}</div>
                          <div className="text-[10px] text-zinc-500 mt-1">metros</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-zinc-500 italic bg-zinc-800/30 p-4 rounded-2xl border border-zinc-800/50">Nenhum teste de Cooper registrado.</div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Última Calorimetria</h4>
                    {athlete.calorimetry_history && athlete.calorimetry_history.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-800/50 p-4 rounded-2xl">
                          <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Gasto Total (TDEE)</div>
                          <div className="text-2xl font-black text-amber-500">{athlete.calorimetry_history[athlete.calorimetry_history.length - 1].tdee_estimated || '--'}</div>
                          <div className="text-[10px] text-zinc-500 mt-1">kcal/dia</div>
                        </div>
                        <div className="bg-zinc-800/50 p-4 rounded-2xl">
                          <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Metabolismo Basal</div>
                          <div className="text-2xl font-black text-white">{athlete.calorimetry_history[athlete.calorimetry_history.length - 1].resting_metabolic_rate || '--'}</div>
                          <div className="text-[10px] text-zinc-500 mt-1">kcal/dia</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-zinc-500 italic bg-zinc-800/30 p-4 rounded-2xl border border-zinc-800/50">Nenhuma calorimetria registrada.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Technical Efficiency History */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Shield size={20} className="text-emerald-400" />
                  Eficiência Técnica PAC
                </h3>
                
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Eficiência em Combate</h4>
                  <div className="space-y-6">
                    {[
                      { label: 'Raspagens', value: athlete.technical_history?.raspagens_efficiency || 0, color: 'bg-emerald-500' },
                      { label: 'Passagens', value: athlete.technical_history?.passagens_efficiency || 0, color: 'bg-blue-500' },
                      { label: 'Finalizações', value: athlete.technical_history?.finalizacoes_efficiency || 0, color: 'bg-amber-500' },
                      { label: 'Quedas', value: athlete.technical_history?.quedas_efficiency || 0, color: 'bg-rose-500' },
                      { label: 'Defesa', value: athlete.technical_history?.defesa_efficiency || 0, color: 'bg-indigo-500' },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                          <span className="text-zinc-400">{item.label}</span>
                          <span className="text-white">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            className={cn("h-full rounded-full", item.color)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Técnicas Dominadas ({athlete.belt})</h4>
                  <div className="space-y-6">
                    {(() => {
                      const categories = ['Quedas', 'Guardas', 'Passagens', 'Raspagens', 'Finalizações', 'Costas', 'Cem Quilos', 'Transições', 'Emborcado'];
                      const normalizeBelt = (belt: string) => belt ? belt.split(' (')[0].trim().toLowerCase() : '';
                      const getEffectiveBelt = (belt: string) => {
                        const normalized = normalizeBelt(belt);
                        const kidsBelts = ['cinza', 'amarela', 'laranja', 'verde'];
                        const isKidsBelt = kidsBelts.some(kb => normalized.includes(kb)) || (belt || '').toLowerCase().includes('infantil');
                        return isKidsBelt ? 'branca' : normalized;
                      };
                      const effectiveAthleteBelt = getEffectiveBelt(athlete.belt);
                      const masteredData = categories.map(cat => {
                        const beltTechs = athlete.techniques?.filter((t: any) => normalizeBelt(t.belt) === effectiveAthleteBelt && t.category?.toLowerCase() === cat.toLowerCase()) || [];
                        if (beltTechs.length === 0) return null;
                        const mastered = beltTechs.filter((t: any) => {
                          const progress = athlete.technique_progress?.find((p: any) => p.technique_id === t.id);
                          return progress?.status === 'validated';
                        }).length;
                        return {
                          label: cat,
                          value: Math.round((mastered / beltTechs.length) * 100),
                          color: 'bg-emerald-500'
                        };
                      }).filter(Boolean);

                      if (masteredData.length === 0) {
                        return <div className="text-sm text-zinc-500 italic">Nenhuma técnica cadastrada para esta faixa.</div>;
                      }

                      return masteredData.map((item: any, idx: number) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                            <span className="text-zinc-400">{item.label}</span>
                            <span className="text-white">{item.value}%</span>
                          </div>
                          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${item.value}%` }}
                              className={cn("h-full rounded-full", item.color)}
                            />
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              {/* Meritocracy Pillars */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Trophy size={20} className="text-amber-400" />
                  Pilares da Meritocracia (500 pts)
                </h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#27272a" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Atleta"
                        dataKey="A"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Pontuação Total PAC</div>
                  <div className="text-4xl font-black text-white">{calculatePACScore(athlete).score}<span className="text-zinc-700 text-lg">/500</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Coach's Intelligent Insights */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Brain size={120} className="text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Zap size={20} className="text-emerald-500" />
                  Cruzamento de Dados: Insights do Professor
                </h3>
                <button 
                  onClick={generateDiagnostic}
                  disabled={isGenerating}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold mb-4"
                >
                  {isGenerating ? 'Gerando...' : 'Gerar Diagnóstico com IA'}
                </button>
                {(diagnostic || (athlete.diagnostics && athlete.diagnostics.length > 0)) && (
                  <div className="bg-zinc-800 p-4 rounded-xl text-sm text-zinc-300 mb-4 whitespace-pre-line">
                    <div className="text-xs font-bold text-emerald-500 mb-2 uppercase">Diagnóstico da IA:</div>
                    {diagnostic || athlete.diagnostics[athlete.diagnostics.length - 1].report}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coachInsights.length > 0 ? coachInsights.map((insight, i) => (
                    <div key={i} className={cn(
                      "p-4 rounded-2xl border flex gap-4 items-start",
                      insight.type === 'warning' ? "bg-rose-500/5 border-rose-500/20" :
                      insight.type === 'psych' ? "bg-indigo-500/5 border-indigo-500/20" :
                      insight.type === 'nutrition' ? "bg-amber-500/5 border-amber-500/20" :
                      "bg-emerald-500/5 border-emerald-500/20"
                    )}>
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        insight.type === 'warning' ? "bg-rose-500/20 text-rose-500" :
                        insight.type === 'psych' ? "bg-indigo-500/20 text-indigo-500" :
                        insight.type === 'nutrition' ? "bg-amber-500/20 text-amber-500" :
                        "bg-emerald-500/20 text-emerald-500"
                      )}>
                        {insight.type === 'warning' ? <Activity size={16} /> : 
                         insight.type === 'psych' ? <Brain size={16} /> :
                         insight.type === 'nutrition' ? <Scale size={16} /> :
                         <Trophy size={16} />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white mb-1">{insight.title}</div>
                        <div className="text-xs text-zinc-400 leading-relaxed">{insight.text}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-2 text-center py-6 text-zinc-500 text-sm italic">Dados insuficientes para gerar insights automáticos.</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
              <div className="text-zinc-500 text-[10px] uppercase font-bold mb-2">Score Geral</div>
              <div className="text-4xl font-black text-emerald-500">{athlete.score}<span className="text-zinc-700 text-lg">/500</span></div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
              <div className="text-zinc-500 text-[10px] uppercase font-bold mb-2">Peso Atual</div>
              <div className="text-4xl font-black text-white">{athlete.physical?.[0]?.weight || '--'}<span className="text-zinc-700 text-lg">kg</span></div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
              <div className="text-zinc-500 text-[10px] uppercase font-bold mb-2">Competições</div>
              <div className="text-4xl font-black text-white">{athlete.competitions?.length || 0}</div>
              <div className="text-[10px] text-zinc-500">Total acumulado</div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Volume de Treino vs. Intensidade</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={athlete.training?.slice(0, 15).reverse()}>
                  <defs>
                    <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  />
                  <Area type="monotone" dataKey="duration_minutes" name="Duração (min)" stroke="#10b981" fillOpacity={1} fill="url(#colorVol)" strokeWidth={2} />
                  <Area type="monotone" dataKey="intensity" name="Intensidade" stroke="#3b82f6" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Evolução Física (TAF)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart data={athlete.physical?.slice().reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR')} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="pull_ups" name="Barras" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} />
                  <Line type="monotone" dataKey="push_ups" name="Flexões" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
                  <Line type="monotone" dataKey="burpees" name="Burpees" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: '#f59e0b' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Histórico de Competições</h3>
            <div className="space-y-3">
              {athlete.competitions?.map((comp: any) => (
                <div key={comp.id} className="flex items-center justify-between p-4 bg-zinc-800/30 border border-zinc-800/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center text-white",
                      comp.result === 'Ouro' ? "bg-amber-500" : comp.result === 'Prata' ? "bg-zinc-400" : "bg-orange-600"
                    )}>
                      <Trophy size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{comp.name}</div>
                      <div className="text-[10px] text-zinc-500">{new Date(comp.date).toLocaleDateString('pt-BR')} • {comp.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-500">+{comp.points_earned} pts</div>
                    <div className="text-[10px] text-zinc-500 uppercase font-bold">{comp.result}</div>
                  </div>
                </div>
              ))}
              {(!athlete.competitions || athlete.competitions.length === 0) && (
                <div className="text-center py-6 text-zinc-500 text-sm italic">Nenhuma competição registrada.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Matriz de Performance</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#27272a" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Atleta"
                    dataKey="A"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.5}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="p-2 bg-black/20 rounded-lg border border-white/5">
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Consistência</div>
                <div className="text-sm font-bold text-white">{Math.round(metrics.consistencyScore)}%</div>
              </div>
              <div className="p-2 bg-black/20 rounded-lg border border-white/5">
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Mental</div>
                <div className="text-sm font-bold text-white">{metrics.mentalToughness}%</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Perfil Psicológico PAC</h3>
            <div className="space-y-4">
              {[
                { label: 'Disciplina', value: latestPsych.disciplina },
                { label: 'Resiliência', value: latestPsych.resiliencia },
                { label: 'Mentalidade Comp.', value: latestPsych.mentalidade_competitiva },
                { label: 'Controle Emocional', value: latestPsych.controle_emocional },
                { label: 'Responsabilidade', value: latestPsych.responsabilidade },
                { label: 'Tolerância à Dor', value: latestPsych.tolerancia_dor },
                { label: 'Mentalidade Cresc.', value: latestPsych.mentalidade_crescimento },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                    <span className="text-zinc-500">{item.label}</span>
                    <span className="text-emerald-500">{item.value || 0}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value || 0}%` }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {(() => {
            const last30Days = new Date();
            last30Days.setDate(last30Days.getDate() - 30);
            
            const recentTrainings = (athlete.training || []).filter((t: any) => t.date && new Date(t.date) >= last30Days);
            
            const trainingCounts = recentTrainings.reduce((acc: any, curr: any) => {
              const type = curr.type || 'Outro';
              acc[type] = (acc[type] || 0) + 1;
              return acc;
            }, {});
            
            const pieData = Object.keys(trainingCounts).map(key => ({
              name: key.charAt(0).toUpperCase() + key.slice(1),
              value: trainingCounts[key]
            }));
            
            const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

            return (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Distribuição de Treinos (Últimos 30 dias)</h3>
                {pieData.length > 0 ? (
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36} 
                          wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }}
                          formatter={(value, entry: any) => `${value} (${entry.payload.value})`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-6 text-zinc-500 text-sm italic">Nenhum treino registrado nos últimos 30 dias.</div>
                )}
              </div>
            );
          })()}

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Histórico de Treinos</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {athlete.training?.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/30 border border-zinc-800/50">
                  <div>
                    <div className="text-xs font-bold text-white capitalize">{log.type}</div>
                    <div className="text-[10px] text-zinc-500">{new Date(log.date).toLocaleDateString('pt-BR')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-500">{log.duration_minutes} min</div>
                    <div className="text-[10px] text-zinc-500">Intensidade: {log.intensity}/10</div>
                  </div>
                </div>
              ))}
              {(!athlete.training || athlete.training.length === 0) && (
                <div className="text-center py-6 text-zinc-500 text-sm italic">Nenhum treino registrado.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
        {activeSubTab === 'nutrition' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-white">Planejamento Nutricional</h3>
                {selectedNutritionPlan && (
                  <button 
                    onClick={() => setSelectedNutritionPlan(null)}
                    className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="rotate-180" size={12} />
                    Voltar ao Atual
                  </button>
                )}
              </div>
              {currentRole !== 'athlete' && (
                <button 
                  onClick={() => setIsNutritionModalOpen(true)}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  <Plus size={16} />
                  Novo Plano
                </button>
              )}
            </div>

            <Modal 
              isOpen={isNutritionModalOpen} 
              onClose={() => {
                setIsNutritionModalOpen(false);
                setEditingNutritionPlan(null);
              }} 
              title={editingNutritionPlan ? "Editar Plano Nutricional" : "Novo Plano Nutricional"}
            >
              <NutritionPlanForm 
                athleteId={athlete.id} 
                athlete={athlete} 
                editingPlan={editingNutritionPlan}
                onSuccess={() => {
                  setIsNutritionModalOpen(false);
                  setEditingNutritionPlan(null);
                }} 
              />
            </Modal>

            <Modal
              isOpen={isDeleteNutritionModalOpen}
              onClose={() => {
                setIsDeleteNutritionModalOpen(false);
                setPlanToDelete(null);
              }}
              title="Excluir Plano Nutricional"
            >
              <div className="space-y-6">
                <p className="text-zinc-400">
                  Tem certeza que deseja excluir este plano nutricional? Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsDeleteNutritionModalOpen(false);
                      setPlanToDelete(null);
                    }}
                    className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-xl font-bold hover:bg-zinc-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={async () => {
                      if (planToDelete) {
                        try {
                          await deleteDoc(doc(db, `athletes/${athlete.id}/nutrition_plans/${planToDelete.id}`));
                          setIsDeleteNutritionModalOpen(false);
                          setPlanToDelete(null);
                          if (selectedNutritionPlan?.id === planToDelete.id) {
                            setSelectedNutritionPlan(null);
                          }
                        } catch (error) {
                          handleFirestoreError(error, OperationType.DELETE, `athletes/${athlete.id}/nutrition_plans`);
                        }
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </Modal>

            {/* AI Analysis & Visual Biometry Section - MOVED TO TOP */}
            {(selectedNutritionPlan || (athlete.nutrition && athlete.nutrition.length > 0)) && (
              (() => {
                const currentPlan = selectedNutritionPlan || athlete.nutrition[0];
                if (!currentPlan.clinical_analysis && !currentPlan.ai_feedback && !currentPlan.front_photo_url && !currentPlan.side_photo_url) return null;
                
                return (
                  <div className={cn(
                    "bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-8 transition-all",
                    selectedNutritionPlan ? "ring-2 ring-emerald-500/50" : ""
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-emerald-500 mb-2">
                        <Sparkles size={24} />
                        <h4 className="font-black uppercase tracking-widest text-lg">
                          {selectedNutritionPlan ? `Análise Histórica (${new Date(selectedNutritionPlan.date).toLocaleDateString()})` : 'Análise de Inteligência Artificial'}
                        </h4>
                      </div>
                      {selectedNutritionPlan && (
                        <div className="text-[10px] font-bold text-zinc-500 uppercase bg-zinc-800 px-3 py-1 rounded-full">Visualizando Histórico</div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        {currentPlan.clinical_analysis && (
                          <div>
                            <div className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Análise Clínica</div>
                            <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/5">{currentPlan.clinical_analysis}</div>
                          </div>
                        )}
                        {currentPlan.ai_feedback && (
                          <div>
                            <div className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Feedback Nutricional</div>
                            <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/5">{currentPlan.ai_feedback}</div>
                          </div>
                        )}
                      </div>

                      {/* Visual Biometry in UI */}
                      {(currentPlan.front_photo_url || currentPlan.side_photo_url) && (
                        <div className="space-y-4">
                          <div className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Biometria Visual (IA)</div>
                          <div className="grid grid-cols-2 gap-4">
                            {currentPlan.front_photo_url && (
                              <div className="space-y-2">
                                <div className="text-[8px] text-zinc-500 uppercase font-bold text-center">Frente</div>
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800 bg-black/40">
                                  <img 
                                    src={currentPlan.front_photo_url} 
                                    alt="Frente"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              </div>
                            )}
                            {currentPlan.side_photo_url && (
                              <div className="space-y-2">
                                <div className="text-[8px] text-zinc-500 uppercase font-bold text-center">Lado</div>
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800 bg-black/40">
                                  <img 
                                    src={currentPlan.side_photo_url} 
                                    alt="Lado"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()
            )}

            {/* Daily Diary Section */}
            <NutritionDiary athleteId={athlete.id} targetPlan={selectedNutritionPlan || athlete.nutrition?.[0]} />

            {/* Nutrition History Chart */}
            <NutritionHistoryChart athleteId={athlete.id} targetPlan={selectedNutritionPlan || athlete.nutrition?.[0]} />

            <div className="space-y-6">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {selectedNutritionPlan ? `Plano de ${new Date(selectedNutritionPlan.date).toLocaleDateString()}` : 'Plano Atual'}
              </h4>
              {athlete.nutrition && athlete.nutrition.length > 0 ? (
              <>
                {(() => {
                  const currentPlan = selectedNutritionPlan || athlete.nutrition[0];
                  return (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                          <Flame size={24} className="text-orange-500 mb-2" />
                          <div className="text-[10px] text-zinc-500 uppercase font-bold">Meta Calórica</div>
                          <div className="text-xl font-black text-white">{currentPlan.tdee} <span className="text-[10px] font-normal text-zinc-500">kcal</span></div>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                          <Dumbbell size={24} className="text-blue-500 mb-2" />
                          <div className="text-[10px] text-zinc-500 uppercase font-bold">Proteína</div>
                          <div className="text-xl font-black text-white">{currentPlan.protein_g} <span className="text-[10px] font-normal text-zinc-500">g</span></div>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                          <Zap size={24} className="text-yellow-500 mb-2" />
                          <div className="text-[10px] text-zinc-500 uppercase font-bold">Carboidratos</div>
                          <div className="text-xl font-black text-white">{currentPlan.carbs_g} <span className="text-[10px] font-normal text-zinc-500">g</span></div>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                          <PieIcon size={24} className="text-emerald-500 mb-2" />
                          <div className="text-[10px] text-zinc-500 uppercase font-bold">Gorduras</div>
                          <div className="text-xl font-black text-white">{currentPlan.fats_g} <span className="text-[10px] font-normal text-zinc-500">g</span></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
                          <div className="flex items-center gap-3 text-emerald-500 mb-2">
                            <Utensils size={20} />
                            <h4 className="font-bold">Refeições Principais</h4>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Café da Manhã</div>
                              <div className="text-sm text-zinc-300 whitespace-pre-line">{currentPlan.breakfast}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Almoço</div>
                              <div className="text-sm text-zinc-300 whitespace-pre-line">{currentPlan.lunch}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Jantar</div>
                              <div className="text-sm text-zinc-300 whitespace-pre-line">{currentPlan.dinner}</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
                          <div className="flex items-center gap-3 text-emerald-500 mb-2">
                            <Activity size={20} />
                            <h4 className="font-bold">Suplementação & Biometria</h4>
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 p-3 bg-black/20 rounded-xl border border-white/5">
                              <div>
                                <div className="text-[10px] text-zinc-500 uppercase font-bold">Peso Atual</div>
                                <div className="text-sm font-bold text-white">{currentPlan.weight} kg</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-zinc-500 uppercase font-bold">% Gordura</div>
                                <div className="text-sm font-bold text-white">{currentPlan.body_fat_pct}%</div>
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Lanches</div>
                              <div className="text-sm text-zinc-300 whitespace-pre-line">{currentPlan.snacks}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Suplementação</div>
                              <div className="text-sm text-zinc-300 whitespace-pre-line">{currentPlan.supplements}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Observações</div>
                              <div className="text-sm text-zinc-400 italic">{currentPlan.notes}</div>
                            </div>
                            {currentPlan.preferences && (
                              <div>
                                <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Preferências/Restrições</div>
                                <div className="text-sm text-zinc-400 italic">{currentPlan.preferences}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Histórico Nutricional</h4>
                  <div className="space-y-3">
                    {athlete.nutrition.map((plan: any, idx: number) => (
                      <div 
                        key={plan.id} 
                        onClick={() => setSelectedNutritionPlan(plan)}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group",
                          selectedNutritionPlan?.id === plan.id 
                            ? "bg-emerald-500/10 border-emerald-500/50" 
                            : "bg-zinc-800/30 border-zinc-800/50 hover:border-emerald-500/30 hover:bg-zinc-800/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 overflow-hidden border border-zinc-700 group-hover:border-emerald-500/50 transition-colors">
                            {(plan.front_photo_url || plan.side_photo_url) ? (
                              <img 
                                src={plan.front_photo_url || plan.side_photo_url} 
                                alt="Thumbnail" 
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-xs font-bold">{idx + 1}</span>
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-2">
                              {new Date(plan.date).toLocaleDateString()}
                              {idx === 0 && <span className="text-[8px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">Atual</span>}
                            </div>
                            <div className="text-[10px] text-zinc-500">{plan.goal} • {plan.weight}kg</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {currentRole !== 'athlete' && (
                            <div className="flex items-center gap-2 mr-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingNutritionPlan(plan);
                                  setIsNutritionModalOpen(true);
                                }}
                                className="text-zinc-500 hover:text-emerald-500 transition-colors p-1"
                                title="Editar Plano"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPlanToDelete(plan);
                                  setIsDeleteNutritionModalOpen(true);
                                }}
                                className="text-zinc-500 hover:text-rose-500 transition-colors p-1"
                                title="Excluir Plano"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                          <div className="flex flex-col items-end gap-0.5 text-[10px] font-bold">
                            <span className="text-orange-500">{plan.tdee} kcal</span>
                            <span className="text-emerald-500">{plan.body_fat_pct}% BF</span>
                          </div>
                          <ChevronRight size={14} className="text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
                <Utensils className="mx-auto text-zinc-700 mb-4" size={48} />
                <h4 className="text-white font-bold mb-2">Nenhum plano nutricional ativo</h4>
                <p className="text-zinc-500 text-sm max-w-md mx-auto">Crie um plano alimentar personalizado para ajudar o atleta a atingir sua categoria de peso com saúde.</p>
              </div>
            )}
          </div>
        </div>
      )}
      {activeSubTab === 'discipline' && (
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Registro de Disciplina</h3>
                <p className="text-zinc-500 text-xs uppercase tracking-widest">Histórico de méritos e deméritos</p>
              </div>
            </div>

            <div className="space-y-4">
              {athlete.discipline && athlete.discipline.length > 0 ? (
                athlete.discipline.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((log: any, idx: number) => (
                  <div key={idx} className="bg-zinc-800/30 border border-zinc-800 p-6 rounded-2xl flex items-start gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      log.type === 'Mérito' ? "bg-emerald-500/20 text-emerald-500" : 
                      log.type === 'Demérito' ? "bg-rose-500/20 text-rose-500" :
                      "bg-zinc-500/20 text-zinc-500"
                    )}>
                      {log.type === 'Mérito' ? <Trophy size={20} /> : 
                       log.type === 'Demérito' ? <AlertTriangle size={20} /> : 
                       <ClipboardList size={20} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-bold text-white">{log.category || 'Avaliação Periódica'}</span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">{new Date(log.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      
                      {log.average_score !== undefined ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                          <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                            <p className="text-[8px] text-zinc-500 uppercase font-bold mb-1">Média</p>
                            <p className="text-sm font-black text-emerald-500">{log.average_score}%</p>
                          </div>
                          <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                            <p className="text-[8px] text-zinc-500 uppercase font-bold mb-1">Frequência</p>
                            <p className="text-sm font-bold text-white">{log.attendance_score}%</p>
                          </div>
                          <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                            <p className="text-[8px] text-zinc-500 uppercase font-bold mb-1">Pontualidade</p>
                            <p className="text-sm font-bold text-white">{log.punctuality_score}%</p>
                          </div>
                          <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                            <p className="text-[8px] text-zinc-500 uppercase font-bold mb-1">Dieta</p>
                            <p className="text-sm font-bold text-white">{log.diet_adherence}%</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-zinc-400">{log.description}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className={cn(
                              "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                              log.type === 'Mérito' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                            )}>
                              {log.type}
                            </span>
                            {log.points && (
                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                {log.type === 'Mérito' ? '+' : '-'}{log.points} pts PAC
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-zinc-500 text-sm italic">
                  Nenhum registro de disciplina encontrado para este atleta.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {activeSubTab === 'finance' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <DollarSign className="text-emerald-500" />
                Plano Atual
              </h3>
              {plan ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-2xl font-black text-white">{plan.name}</div>
                      <div className="text-sm text-zinc-500">{plan.type} • {plan.frequency}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={cn(
                        "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest",
                        athlete.payment_status === 'paid' ? "bg-emerald-500/10 text-emerald-500" : 
                        athlete.payment_status === 'overdue' ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                      )}>
                        {athlete.payment_status === 'paid' ? 'Pago' : athlete.payment_status === 'overdue' ? 'Atrasado' : 'Pendente'}
                      </div>
                      {athlete.is_blocked && (
                        <div className="flex items-center gap-1.5 bg-rose-500/10 text-rose-500 text-[9px] font-black px-2 py-0.5 rounded-md border border-rose-500/20 uppercase tracking-widest">
                          <Lock size={10} /> Bloqueado
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50">
                      <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Valor Mensal</div>
                      <div className="text-xl font-black text-white">
                        R$ {((plan.basePrice * (100 - plan.discount)) / 100).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50">
                      <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Desconto</div>
                      <div className="text-xl font-black text-emerald-500">{plan.discount}%</div>
                    </div>
                    <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50">
                      <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Vencimento</div>
                      <div className="text-xl font-black text-blue-500">Dia {athlete.payment_day || 10}</div>
                    </div>
                  </div>

                  {(plan.isSocial || plan.isScholarship) && (
                    <div className="flex gap-2">
                      {plan.isSocial && (
                        <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-500/20">
                          <Users size={12} /> PROJETO SOCIAL
                        </div>
                      )}
                      {plan.isScholarship && (
                        <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-500/20">
                          <Award size={12} /> BOLSISTA
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <DollarSign size={32} className="text-zinc-600" />
                  </div>
                  <p className="text-zinc-500 text-sm">Nenhum plano financeiro vinculado a este atleta.</p>
                </div>
              )}
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Receipt className="text-emerald-500" />
                Histórico de Pagamentos
              </h3>
              <div className="space-y-3">
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <History size={24} className="text-zinc-600" />
                  </div>
                  <p className="text-zinc-500 text-xs">Nenhum histórico de pagamento encontrado.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeSubTab === 'public' && (
        <PublicProfileView athlete={athlete} />
      )}
      </div>
      </div>
      </div>
    </div>
  );
};

const DocumentsList = ({ athletes }: { athletes: any[] }) => {
  const [docs, setDocs] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSigning, setIsSigning] = useState(false);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const [signedDocs, setSignedDocs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [isDownloading, setIsDownloading] = useState(false);
  const [isStepTwo, setIsStepTwo] = useState(false);

  useEffect(() => {
    const defaultDocs = [
      { 
        id: 'termo-responsabilidade', 
        title: 'Termo de Responsabilidade e Compromisso', 
        type: 'Legal',
        mandatory: true,
        content: `Eu, abaixo assinado, declaro estar ciente de que o treinamento esportivo de alto rendimento envolve riscos físicos, incluindo lesões musculares, articulares e outras intercorrências.\n\nDeclaro que estou fisicamente apto para participar do programa ou apresentarei liberação médica quando solicitado.\n\nComprometo-me a:\n1. Seguir rigorosamente as orientações da equipe técnica.\n2. Participar das atividades programadas conforme cronograma.\n3. Cumprir as regras de disciplina e conduta do programa.\n4. Informar imediatamente qualquer dor, lesão ou problema de saúde.\n\nReconheço que o Programa PAC tem como objetivo formação de atletas de alto rendimento, exigindo alto nível de comprometimento físico e mental.\n\nDeclaro que participo do programa de forma voluntária.`
      },
      { 
        id: 'codigo-conduta', 
        title: 'Código de Conduta do Atleta', 
        type: 'Disciplina',
        mandatory: true,
        content: `O atleta integrante do PAC compromete-se a seguir os princípios abaixo:\n\n1. DISCIPLINA: O atleta deve cumprir rigorosamente horários, treinos e atividades estabelecidas pelo programa.\n2. OBEDIÊNCIA AO PROGRAMA: O atleta não escolhe treinos ou atividades. Todo planejamento é definido pela equipe técnica.\n3. NUTRIÇÃO: O atleta deve seguir rigorosamente o plano alimentar estabelecido. É proibido consumo frequente de alimentos ultraprocessados.\n4. SONO: O atleta deve manter rotina regular de sono.\n5. CONDUTA: É esperado comportamento respeitoso com treinadores, colegas e equipe.\n6. COMPROMISSO: Faltas injustificadas podem resultar em advertência ou desligamento do programa.\n7. RESPONSABILIDADE: O atleta é responsável por seu comprometimento, esforço e disciplina.\n8. OBJETIVO: O atleta compromete-se com a missão do programa: Buscar excelência e desempenho competitivo máximo.`
      },
      { 
        id: 'ficha-identificacao', 
        title: 'Ficha de Identificação e Dossiê', 
        type: 'Administrativo',
        mandatory: true,
        content: `DOSSIÊ DO ATLETA - IDENTIFICAÇÃO OFICIAL\n\nEste documento formaliza a entrada do atleta no Programa de Formação de Atleta Campeão (PAC).\n\nO dossiê do atleta deve conter:\n- Dados pessoais completos\n- Histórico esportivo e graduação\n- Objetivos competitivos de curto, médio e longo prazo\n- Avaliação física inicial (TAF)\n- Avaliação técnica inicial\n- Perfil psicológico inicial\n\nO atleta autoriza o uso de sua imagem e dados de performance para fins de monitoramento e divulgação do programa PAC.`
      },
      { 
        id: 'contrato-adesao', 
        title: 'Contrato de Adesão ao Programa', 
        type: 'Administrativo',
        mandatory: true,
        content: `CONTRATO DE ADESÃO - PROGRAMA PAC\n\nO presente instrumento tem como objetivo formalizar a adesão do atleta ao Programa de Formação de Atleta Campeão.\n\nO PAC compromete-se a oferecer:\n- Treinamento técnico especializado\n- Preparação física de alto rendimento\n- Suporte nutricional e psicológico\n- Monitoramento de performance contínuo\n\nO atleta aceita as condições de permanência baseadas em mérito, disciplina e evolução constante, ciente de que o não cumprimento dos índices mínimos pode resultar em desligamento.`
      }
    ];

    const unsubscribe = onSnapshot(collection(db, 'documents'), (snapshot) => {
      const firestoreDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      
      // Merge and remove duplicates by title
      const mergedDocs = [...defaultDocs];
      firestoreDocs.forEach(fd => {
        const isDuplicate = mergedDocs.some(md => 
          md.title.toLowerCase().trim() === fd.title.toLowerCase().trim()
        );
        if (!isDuplicate) {
          mergedDocs.push(fd);
        }
      });

      // Sort alphabetically
      const sortedDocs = mergedDocs.sort((a, b) => a.title.localeCompare(b.title));
      setDocs(sortedDocs);
    }, (error) => {
      console.warn('Firestore documents not found, using defaults');
      setDocs(defaultDocs.sort((a, b) => a.title.localeCompare(b.title)));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedAthleteId) {
      const unsubscribe = onSnapshot(collection(db, `athletes/${selectedAthleteId}/signed_documents`), (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`Fetched ${docs.length} signed documents for athlete ${selectedAthleteId}`);
        setSignedDocs(docs);
      }, (error) => handleFirestoreError(error, OperationType.LIST, `athletes/${selectedAthleteId}/signed_documents`));
      
      const athlete = athletes.find(a => a.id === selectedAthleteId);
      if (athlete) {
        setFormData(prev => ({ ...prev, athleteName: athlete.name }));
        setSearchTerm(athlete.name);
      }
      return () => unsubscribe();
    } else {
      setSignedDocs([]);
    }
  }, [selectedAthleteId, athletes]);

  const filteredAthletes = athletes.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSignAndDownload = async () => {
    if (!selectedAthleteId) {
      alert('Por favor, selecione um atleta primeiro.');
      return;
    }

    await handleDownload();

    // Save to Firestore
    try {
      console.log(`Saving signed document ${selectedDoc.id} for athlete ${selectedAthleteId}`);
      await addDoc(collection(db, `athletes/${selectedAthleteId}/signed_documents`), {
        document_id: selectedDoc.id,
        signature_name: formData.signature,
        form_data: formData,
        signed_at: Timestamp.now()
      });
      console.log('Document saved successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `athletes/${selectedAthleteId}/signed_documents`);
    }
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    
    try {
      const element = document.getElementById('document-to-print');
      if (!element) throw new Error('Elemento de impressão não encontrado');

      // Use a higher scale for better quality
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          const replaceUnsupportedColors = (str: string) => {
            if (!str) return '';
            return str.replace(/(oklch|oklab)\([^)]+\)/g, (match) => {
              if (match.includes('oklch(1') || match.includes('oklab(1')) return '#ffffff';
              if (match.includes('oklch(0.9') || match.includes('oklab(0.9')) return '#f4f4f5';
              if (match.includes('oklch(0.1') || match.includes('oklab(0.1')) return '#18181b';
              if (match.includes('oklch(0') || match.includes('oklab(0')) return '#000000';
              return '#71717a'; 
            });
          };

          const elements = clonedDoc.querySelectorAll('*');
          elements.forEach(el => {
            const HTMLElement = el as HTMLElement;
            const style = window.getComputedStyle(el);
            const props = ['color', 'backgroundColor', 'borderColor', 'outlineColor', 'fill', 'stroke'];
            props.forEach(prop => {
              const value = (style as any)[prop];
              if (value && (value.includes('oklch') || value.includes('oklab'))) {
                HTMLElement.style.setProperty(prop === 'backgroundColor' ? 'background-color' : prop, replaceUnsupportedColors(value), 'important');
              }
            });
          });
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 15; // 15mm margin
      const contentHeight = pageHeight - (2 * margin);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      let heightLeft = imgHeight;
      let position = margin;
      let page = 1;

      // Function to add header and footer
      const addHeaderFooter = (p: any, pageNum: number) => {
        const pageWidth = 210;
        const pageHeight = 297;
        
        // Mask margins with white
        p.setFillColor(255, 255, 255);
        p.rect(0, 0, pageWidth, margin, 'F'); // Top
        p.rect(0, pageHeight - margin, pageWidth, margin, 'F'); // Bottom
        
        // Header
        p.setFontSize(8);
        p.setTextColor(113, 113, 122); // zinc-500
        p.setFont('helvetica', 'bold');
        p.text('SISTEMA OPERACIONAL PAC', margin, 10);
        
        p.setFont('helvetica', 'normal');
        const titleText = selectedDoc.title.toUpperCase();
        const titleWidth = p.getTextWidth(titleText);
        p.text(titleText, pageWidth - margin - titleWidth, 10);
        
        p.setDrawColor(228, 228, 231); // zinc-200
        p.line(margin, 12, pageWidth - margin, 12);
        
        // Footer
        p.setDrawColor(228, 228, 231); // zinc-200
        p.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
        
        p.setFontSize(7);
        p.setTextColor(161, 161, 170); // zinc-400
        const footerText = `Oficial PAC • Programa de Formação de Atleta Campeão • ${new Date().getFullYear()}`;
        p.text(footerText, margin, pageHeight - 8);
        
        const pageText = `Página ${pageNum}`;
        const pageTextWidth = p.getTextWidth(pageText);
        p.text(pageText, pageWidth - margin - pageTextWidth, pageHeight - 8);
      };

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      addHeaderFooter(pdf, 1);
      
      heightLeft -= contentHeight;

      // Add subsequent pages
      while (heightLeft > 0) {
        pdf.addPage();
        page++;
        position = margin - (page - 1) * contentHeight;
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        addHeaderFooter(pdf, page);
        heightLeft -= contentHeight;
      }
      
      pdf.save(`${selectedDoc.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  const renderFields = () => {
    if (!selectedDoc) return null;

    const title = selectedDoc.title.toUpperCase();
    const fields = [];

    if (title.includes('TERMO DE RESPONSABILIDADE')) {
      fields.push(
        <div key="termo-fields" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="col-span-full">
            <SearchableAthleteSelect 
              athletes={athletes}
              selectedId={selectedAthleteId || ''}
              onSelect={(id, name) => {
                setSelectedAthleteId(id);
                setFormData(prev => ({ ...prev, athleteName: name }));
              }}
              label="Atleta Selecionado"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Data</label>
            <input 
              type="date" 
              value={formData.date || ''}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-500"
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Responsável Legal (se menor)</label>
            <input 
              type="text" 
              value={formData.guardianName || ''}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-500"
              onChange={e => setFormData({...formData, guardianName: e.target.value})}
              placeholder="Nome do responsável"
            />
          </div>
        </div>
      );
    } else if (title.includes('TAF')) {
      const tests = ['Barra Fixa', 'Flexão', 'Isometria', 'Sprint 50m', 'Burpees', 'Shuttle Run', 'Resistência', 'Abdominal'];
      fields.push(
        <div key="taf-fields" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="col-span-full mb-2">
            <SearchableAthleteSelect 
              athletes={athletes}
              selectedId={selectedAthleteId || ''}
              onSelect={(id, name) => {
                setSelectedAthleteId(id);
                setFormData(prev => ({ ...prev, athleteName: name }));
              }}
              label="Atleta Selecionado"
            />
          </div>
          {tests.map(test => (
            <div key={test} className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">{test}</label>
              <input 
                type="text" 
                value={formData[test] || ''}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-500"
                onChange={e => setFormData({...formData, [test]: e.target.value})}
                placeholder="Resultado"
              />
            </div>
          ))}
        </div>
      );
    } else if (title.includes('SISTEMA OPERACIONAL') || title.includes('SELEÇÃO')) {
      fields.push(
        <div key="so-fields" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Nome do Candidato</label>
            <input 
              type="text" 
              value={formData.candidateName || ''}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-500"
              onChange={e => setFormData({...formData, candidateName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Idade</label>
            <input 
              type="number" 
              value={formData.age || ''}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-500"
              onChange={e => setFormData({...formData, age: e.target.value})}
            />
          </div>
          <div className="col-span-full space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Objetivos Competitivos</label>
            <textarea 
              value={formData.goals || ''}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-500 h-20"
              onChange={e => setFormData({...formData, goals: e.target.value})}
            />
          </div>
        </div>
      );
    } else if (title.includes('PSICOLÓGICO')) {
      const dimensions = ['Disciplina', 'Resiliência', 'Mentalidade Competitiva', 'Controle Emocional', 'Responsabilidade', 'Tolerância à Dor', 'Mentalidade de Crescimento'];
      fields.push(
        <div key="psych-fields" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="col-span-full mb-2">
            <SearchableAthleteSelect 
              athletes={athletes}
              selectedId={selectedAthleteId || ''}
              onSelect={(id, name) => {
                setSelectedAthleteId(id);
                setFormData(prev => ({ ...prev, athleteName: name }));
              }}
              label="Nome do Atleta"
            />
          </div>
          {dimensions.map(dim => (
            <div key={dim} className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">{dim} (Soma 1-5)</label>
              <input 
                type="number" 
                value={formData[dim] || ''}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-500"
                onChange={e => setFormData({...formData, [dim]: e.target.value})}
                placeholder="Pontuação"
              />
            </div>
          ))}
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Pontuação Total</label>
            <input 
              type="number" 
              value={formData.totalScore || ''}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-500"
              onChange={e => setFormData({...formData, totalScore: e.target.value})}
              placeholder="Total"
            />
          </div>
        </div>
      );
    } else {
      fields.push(
        <div key="generic-fields" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="col-span-full md:col-span-1">
            <SearchableAthleteSelect 
              athletes={athletes}
              selectedId={selectedAthleteId || ''}
              onSelect={(id, name) => {
                setSelectedAthleteId(id);
                setFormData(prev => ({ ...prev, athleteName: name }));
              }}
              label="Nome do Atleta"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Data de Referência</label>
            <input 
              type="date" 
              value={formData.referenceDate || ''}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-emerald-500"
              onChange={e => setFormData({...formData, referenceDate: e.target.value})}
            />
          </div>
        </div>
      );
    }

    return fields;
  };

  return (
    <>
      <div className="mb-8 space-y-6">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <SearchableAthleteSelect 
            athletes={athletes}
            selectedId={selectedAthleteId || ''}
            onSelect={(id, name) => {
              setSelectedAthleteId(id);
              setSearchTerm(name);
            }}
            label="Selecionar Atleta para Verificação"
          />
        </div>

        {selectedAthleteId && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Checklist de Documentos</h3>
                <p className="text-[10px] text-zinc-500 uppercase mt-1">Status de assinaturas para {athletes.find(a => a.id === selectedAthleteId)?.name}</p>
              </div>
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <span className="text-[10px] font-bold text-emerald-500 uppercase">
                  {signedDocs.length} / {docs.length} Assinados
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {docs.map(doc => {
                const isSigned = signedDocs.some(sd => 
                  sd.document_id === doc.id || 
                  (sd.form_data && sd.form_data.document_id === doc.id)
                );
                return (
                  <div 
                    key={doc.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all",
                      isSigned 
                        ? "bg-emerald-500/5 border-emerald-500/20" 
                        : "bg-zinc-800/30 border-zinc-800"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        isSigned ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-600"
                      )}>
                        {isSigned ? <Check size={16} /> : <FileText size={16} />}
                      </div>
                      <span className={cn(
                        "text-xs font-medium",
                        isSigned ? "text-white" : "text-zinc-500"
                      )}>
                        {doc.title}
                      </span>
                    </div>
                    {isSigned && (
                      <span className="text-[9px] font-bold text-emerald-500 uppercase">Assinado</span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Mandatory Documents */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="text-emerald-500" size={20} />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Assinatura Obrigatória</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.filter(d => d.mandatory).map(doc => (
              <div 
                key={doc.id} 
                onClick={() => {
                  setSelectedDoc(doc);
                  setFormData({});
                  setIsSigning(false);
                  setIsStepTwo(false);
                }}
                className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-emerald-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{doc.title}</div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{doc.type} • Oficial PAC</div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-zinc-700 group-hover:text-emerald-500 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* General Documents */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-zinc-500" size={20} />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Documentos Gerais</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.filter(d => !d.mandatory).map(doc => (
              <div 
                key={doc.id} 
                onClick={() => {
                  setSelectedDoc(doc);
                  setFormData({});
                  setIsSigning(false);
                  setIsStepTwo(false);
                }}
                className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-emerald-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{doc.title}</div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{doc.type} • PAC</div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-zinc-700 group-hover:text-emerald-500 transition-colors" />
              </div>
            ))}
            {docs.filter(d => !d.mandatory).length === 0 && (
              <div className="col-span-full py-8 text-center bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl">
                <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest">Nenhum documento adicional disponível</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal 
        isOpen={!!selectedDoc} 
        onClose={() => setSelectedDoc(null)} 
        title={selectedDoc?.title || ''}
        maxWidth="max-w-4xl"
      >
          {/* Preview for Export (Off-screen but rendered) */}
          <div className="absolute -left-[9999px] top-0 pointer-events-none">
            <div id="document-to-print" className="p-20 bg-white text-black font-serif w-[210mm] min-h-[297mm] flex flex-col pb-40">
              <div className="text-center mb-16 border-b-4 border-black pb-12">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white font-bold text-3xl">
                    PAC
                  </div>
                </div>
                <h1 className="text-3xl font-bold uppercase mb-2 tracking-tighter">SISTEMA OPERACIONAL DO PAC</h1>
                <h2 className="text-xl font-bold uppercase text-zinc-700 tracking-widest">{selectedDoc?.title}</h2>
                <div className="w-32 h-1 mx-auto mt-4" style={{ backgroundColor: '#059669' }} />
                <p className="text-sm mt-6 font-sans font-bold uppercase tracking-[0.2em]" style={{ color: '#71717a' }}>Programa de Formação de Atleta Campeão</p>
              </div>

              <div className="flex-1 space-y-12 text-base leading-relaxed text-justify">
                <div className="px-6 mb-16">
                  {(selectedDoc?.content || '').split('\n\n').map((paragraph: string, index: number) => (
                    <div key={index} className="mb-10 break-inside-avoid whitespace-pre-wrap">
                      {paragraph}
                    </div>
                  ))}
                </div>

                {/* Dynamic Data in Print */}
                <div className="mt-16 pt-12 grid grid-cols-2 gap-x-12 gap-y-8 px-10 p-12 rounded-[48px] break-inside-avoid shadow-sm" style={{ border: '1px solid #e4e4e7', backgroundColor: '#fafafa' }}>
                  <div className="col-span-full mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] pb-3" style={{ color: '#047857', borderBottom: '2px solid #d1fae5' }}>Autenticação do Registro</h3>
                  </div>
                  {Object.entries(formData).map(([key, value]) => (
                    key !== 'signature' && (
                      <div key={key} className="pb-2" style={{ borderBottom: '1px solid #f4f4f5' }}>
                        <span className="font-bold uppercase text-[9px] block mb-1" style={{ color: '#71717a' }}>{key}</span>
                        <span className="text-sm font-sans font-semibold" style={{ color: '#18181b' }}>{value as string}</span>
                      </div>
                    )
                  ))}
                </div>

                <div className="mt-20 flex flex-col items-center break-inside-avoid pt-10">
                  <div className="relative w-96 text-center">
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none">
                      <Zap size={120} style={{ color: '#059669' }} />
                    </div>
                    <div className="border-b-2 border-black pb-3 font-serif italic text-3xl" style={{ color: '#18181b', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {formData.signature || '__________________________'}
                    </div>
                    <div className="text-xs uppercase font-bold mt-4 tracking-[0.2em]" style={{ color: '#18181b' }}>Assinatura Digital do Atleta</div>
                    <div className="text-[10px] mt-3 font-sans" style={{ color: '#71717a' }}>
                      Este documento foi assinado e autenticado eletronicamente em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
                    </div>
                    <div className="text-[9px] font-bold mt-2 uppercase tracking-wider" style={{ color: '#059669' }}>ID de Autenticidade: {Math.random().toString(36).substring(2, 15).toUpperCase()}</div>
                  </div>
                </div>
              </div>

              <div className="mt-20 pt-10 text-[9px] text-center uppercase tracking-[0.3em] font-sans" style={{ borderTop: '1px solid #f4f4f5', color: '#a1a1aa' }}>
                Oficial PAC • Programa de Formação de Atleta Campeão • {new Date().getFullYear()} • Todos os direitos reservados
              </div>
            </div>
          </div>

        <div className="space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
          {!isStepTwo ? (
            <>
              {/* Preview Step */}
              <div className="bg-white p-12 rounded-2xl border border-zinc-200 font-serif text-black leading-relaxed text-justify shadow-inner overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                <div className="text-center mb-12 border-b-2 border-zinc-100 pb-10">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      PAC
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-black uppercase tracking-tighter mb-1">SISTEMA OPERACIONAL DO PAC</h3>
                  <h4 className="text-sm font-bold uppercase text-zinc-500 tracking-[0.3em]">{selectedDoc?.title}</h4>
                </div>
                
                <div className="space-y-8 text-lg">
                  {(selectedDoc?.content || '').split('\n\n').map((paragraph: string, index: number) => (
                    <div key={index} className="whitespace-pre-wrap">
                      {paragraph}
                    </div>
                  ))}
                </div>

                <div className="mt-16 p-8 bg-zinc-50 border border-zinc-200 rounded-2xl text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-emerald-100 p-2 rounded-full">
                      <FileText size={24} className="text-emerald-600" />
                    </div>
                  </div>
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-[0.2em] mb-3">Confirmação de Leitura</p>
                  <p className="text-sm text-zinc-600 max-w-md mx-auto">Certifique-se de ter compreendido todas as diretrizes acima. Ao prosseguir, você iniciará o processo de autenticação digital.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-all"
                >
                  Fechar
                </button>
                <button 
                  onClick={() => setIsStepTwo(true)}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Prosseguir para Assinatura
                  <ChevronRight size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Form Fields */}
              <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-2 mb-4">
                  <button 
                    onClick={() => setIsStepTwo(false)}
                    className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all"
                  >
                    <ChevronRight size={18} className="rotate-180" />
                  </button>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Informações do Documento</h4>
                </div>
                {renderFields()}
                
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Assinatura Digital</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.signature || ''}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500 font-serif italic"
                      onChange={e => {
                        setFormData({...formData, signature: e.target.value});
                        setIsSigning(e.target.value.length > 0);
                      }}
                      placeholder="Digite seu nome completo para assinar"
                    />
                    {isSigning && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 flex items-center gap-1">
                        <Zap size={14} />
                        <span className="text-[10px] font-bold uppercase">Assinado</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsStepTwo(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all"
                >
                  Voltar para Leitura
                </button>
                <button 
                  onClick={handleSignAndDownload}
                  disabled={isDownloading}
                  className={cn(
                    "flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2",
                    isDownloading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isDownloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Gerando PDF...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Assinar e Baixar PDF
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, maxWidth?: string }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={cn("fixed left-1/2 top-[5vh] -translate-x-1/2 w-full max-h-[90vh] flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl p-8 z-[101] shadow-2xl", maxWidth)}
        >
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <button onClick={onClose} className="text-zinc-500 hover:text-white">
              <Plus size={24} className="rotate-45" />
            </button>
          </div>
          <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
            {children}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const CameraCapture = ({ onCapture, initialImage }: { onCapture: (base64: string) => void, initialImage?: string }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.error("Erro ao dar play no vídeo:", e));
    }
  }, [stream]);

  const startCamera = async () => {
    setError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Seu navegador não suporta acesso à câmera ou você não está em uma conexão segura (HTTPS).");
      return;
    }

    const tryConstraints = async (constraints: MediaStreamConstraints) => {
      try {
        return await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {
        return null;
      }
    };

    try {
      // Strategy 1: Most generic (just video)
      let s = await tryConstraints({ video: true });
      
      // Strategy 2: Specific facing mode if generic fails
      if (!s) {
        s = await tryConstraints({ video: { facingMode: 'user' } });
      }
      
      // Strategy 3: Environment facing mode
      if (!s) {
        s = await tryConstraints({ video: { facingMode: 'environment' } });
      }

      if (s) {
        setStream(s);
      } else {
        throw new Error("DevicesNotFoundError");
      }
    } catch (err: any) {
      console.error("Erro final ao acessar câmera:", err);
      setError("Nenhuma câmera detectada. Verifique se ela está conectada e se você deu permissão no navegador.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Use videoWidth/Height if available, fallback to clientWidth/Height
        let width = video.videoWidth || video.clientWidth;
        let height = video.videoHeight || video.clientHeight;
        
        // Resize if too large (max 800px on longest side)
        const maxDim = 800;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height / width) * maxDim;
            width = maxDim;
          } else {
            width = (width / height) * maxDim;
            height = maxDim;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        
        const base64 = canvas.toDataURL('image/jpeg', 0.7); // Slightly lower quality to save more space
        setPreview(base64);
        onCapture(base64);
        stopCamera();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-32 h-32 mx-auto bg-zinc-800 rounded-full overflow-hidden border-2 border-zinc-700 group">
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <Camera size={32} />
          </div>
        )}
        
        {!stream && (
          <button 
            type="button"
            onClick={startCamera}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
          >
            <RefreshCw size={20} />
          </button>
        )}
      </div>

      {error && (
        <div className="text-center text-red-500 text-xs font-bold animate-pulse">
          {error}
        </div>
      )}

      {stream && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
              <div className="w-full h-full border-2 border-emerald-500/50 rounded-full" />
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button 
              type="button"
              onClick={stopCamera}
              className="px-6 py-3 bg-zinc-800 text-white rounded-xl font-bold"
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={capture}
              className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20"
            >
              Capturar Foto
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
};

const AthleteForm = ({ currentUser, academies, plans, athlete, onSuccess }: { currentUser: User | null, academies: Academy[], plans: Plan[], athlete?: Athlete | null, onSuccess: () => void }) => {
  const [gradConfig, setGradConfig] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    name: athlete?.name || '', 
    email: athlete?.email || '', 
    gender: athlete?.gender || 'M',
    height: athlete?.height ?? '',
    profile_photo: athlete?.profile_photo || '',
    weight_class: athlete?.weight_class || '', 
    belt: athlete?.belt || 'Branca', 
    stripes: athlete?.stripes ?? 0,
    birth_date: athlete?.birth_date || '', 
    goals: athlete?.goals || '', 
    academy_id: athlete?.academy_id || currentUser?.academy_id || (academies.length > 0 ? academies[0].id : ''), 
    plan_id: athlete?.plan_id || '',
    payment_status: athlete?.payment_status || 'pending',
    payment_day: athlete?.payment_day ?? 10,
    is_blocked: athlete?.is_blocked ?? false,
    last_graduation_date: athlete?.last_graduation_date || '',
    is_candidate: athlete?.is_candidate ?? false,
    selection_status: athlete?.selection_status || 'Avaliação'
  });

  useEffect(() => {
    if (athlete) {
      setFormData({
        name: athlete.name || '',
        email: athlete.email || '',
        gender: athlete.gender || 'M',
        height: athlete.height ?? '',
        profile_photo: athlete.profile_photo || '',
        weight_class: athlete.weight_class || '',
        belt: athlete.belt || 'Branca',
        stripes: athlete.stripes ?? 0,
        birth_date: athlete.birth_date || '',
        goals: athlete.goals || '',
        academy_id: athlete.academy_id || '',
        plan_id: athlete.plan_id || '',
        payment_status: athlete.payment_status || 'pending',
        payment_day: athlete.payment_day ?? 10,
        is_blocked: athlete.is_blocked ?? false,
        last_graduation_date: athlete.last_graduation_date || '',
        is_candidate: athlete.is_candidate ?? false,
        selection_status: athlete.selection_status || 'Avaliação'
      });
    }
  }, [athlete]);

  useEffect(() => {
    const fetchGradConfig = async () => {
      const docRef = doc(db, 'graduation_config', 'jiujitsu');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.belts) {
          const uniqueBelts: any[] = [];
          const seenIds = new Set();
          for (const belt of data.belts) {
            if (belt.id && !seenIds.has(belt.id)) {
              uniqueBelts.push(belt);
              seenIds.add(belt.id);
            }
          }
          data.belts = uniqueBelts;
        }
        setGradConfig(data);
      }
    };
    fetchGradConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("AthleteForm submitted", formData);
    
    if (!formData.name || !formData.email || !formData.birth_date) {
      alert("Por favor, preencha o nome, email e data de nascimento.");
      return;
    }

    try {
      const athleteData = {
        ...formData,
        score: athlete?.score || 0,
        classification: athlete?.classification || 'Iniciante',
        user_id: athlete?.user_id || '', // Do not set to creator's uid
        owner_id: athlete?.owner_id || auth.currentUser?.uid || '',
        academy_id: formData.academy_id || currentUser?.academy_id || ''
      };

      if (athlete?.id) {
        await updateDoc(doc(db, 'athletes', athlete.id), athleteData);
      } else {
        await addDoc(collection(db, 'athletes'), athleteData);
        // Link globally via whitelist
        if (formData.email) {
          await addToWhitelist(formData.email, 'athlete', formData.academy_id || currentUser?.academy_id);
        }
      }
      onSuccess();
    } catch (error) {
      handleFirestoreError(error, athlete?.id ? OperationType.UPDATE : OperationType.CREATE, athlete?.id ? `athletes/${athlete.id}` : 'athletes');
    }
  };

  const selectedBeltConfig = gradConfig?.belts?.find((b: any) => b.name === formData.belt);

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <CameraCapture 
        onCapture={(base64) => setFormData({...formData, profile_photo: base64})} 
        initialImage={formData.profile_photo}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Nome Completo" value={formData.name} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" onChange={e => setFormData({...formData, name: e.target.value})} />
        <input type="email" placeholder="Email" value={formData.email} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" onChange={e => setFormData({...formData, email: e.target.value})} />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Gênero</label>
          <select 
            value={formData.gender}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"
            onChange={e => setFormData({...formData, gender: e.target.value as 'M' | 'F'})}
          >
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Altura (cm)</label>
          <input 
            type="number" 
            placeholder="Altura" 
            value={formData.height}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
            onChange={e => setFormData({...formData, height: e.target.value ? parseInt(e.target.value) : ''})} 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Data de Nascimento</label>
          <input 
            type="date" 
            required 
            value={formData.birth_date}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
            onChange={e => setFormData({...formData, birth_date: e.target.value})} 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Última Graduação</label>
          <input 
            type="date" 
            value={formData.last_graduation_date}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
            onChange={e => setFormData({...formData, last_graduation_date: e.target.value})} 
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-2">
          <select 
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
            value={formData.belt}
            onChange={e => setFormData({...formData, belt: e.target.value, stripes: 0})}
          >
            {gradConfig?.belts?.map((b: any) => (
              <option key={b.id} value={b.name}>{b.name}</option>
            )) || (
              <>
                <option>Branca</option><option>Azul</option><option>Roxa</option><option>Marrom</option><option>Preta</option>
              </>
            )}
          </select>
          <select 
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"
            value={formData.stripes}
            onChange={e => setFormData({...formData, stripes: parseInt(e.target.value)})}
          >
            {[...Array((selectedBeltConfig?.maxStripes || 4) + 1)].map((_, i) => (
              <option key={i} value={i}>{i} Graus</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="Categoria de Peso" className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" value={formData.weight_class} onChange={e => setFormData({...formData, weight_class: e.target.value})} />
        <select className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" value={formData.academy_id} onChange={e => setFormData({...formData, academy_id: e.target.value})}>
          <option value="">Selecionar Academia</option>
          {academies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Plano Financeiro</label>
        <select 
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
          value={formData.plan_id}
          onChange={e => setFormData({...formData, plan_id: e.target.value})}
        >
          <option value="">Selecionar Plano</option>
          {plans.filter(p => p.target === 'athletes').map(p => (
            <option key={p.id} value={p.id}>
              {p.name} - R$ {((p.basePrice * (100 - p.discount)) / 100).toLocaleString('pt-BR')} ({p.frequency})
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Dia de Vencimento</label>
        <select 
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
          value={formData.payment_day}
          onChange={e => setFormData({...formData, payment_day: parseInt(e.target.value)})}
        >
          {[...Array(31)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
          <input 
            type="checkbox" 
            id="is_candidate"
            checked={formData.is_candidate}
            onChange={e => setFormData({...formData, is_candidate: e.target.checked})}
            className="w-5 h-5 rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-emerald-500"
          />
          <label htmlFor="is_candidate" className="text-sm font-bold text-white cursor-pointer">Candidato PAC (Laboratório)</label>
        </div>
        {formData.is_candidate && (
          <select 
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"
            value={formData.selection_status}
            onChange={e => setFormData({...formData, selection_status: e.target.value as any})}
          >
            <option value="Avaliação">Avaliação</option>
            <option value="Teste">Teste de Tatame</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Reprovado">Reprovado</option>
          </select>
        )}
      </div>
      <textarea placeholder="Objetivos no PAC" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 h-24" value={formData.goals} onChange={e => setFormData({...formData, goals: e.target.value})} />
      
      <div className="pb-4">
        <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20">Cadastrar Atleta</button>
      </div>
    </form>
  );
};

const AcademyForm = ({ plans, onSuccess, academy }: { plans: Plan[], onSuccess: () => void, academy?: Academy | null }) => {
  const [formData, setFormData] = useState({ 
    name: academy?.name || '', 
    head_coach: academy?.head_coach || '', 
    location: academy?.location || '', 
    contact: academy?.contact || '', 
    lat: academy?.lat || 0, 
    lng: academy?.lng || 0,
    plan_id: academy?.plan_id || '',
    payment_status: academy?.payment_status || 'pending',
    payment_day: academy?.payment_day || 10,
    is_blocked: academy?.is_blocked || false,
    telegram_bot_token: academy?.telegram_bot_token || '',
    telegram_chat_id: academy?.telegram_chat_id || ''
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const academyData = {
        ...formData,
        owner_id: academy?.owner_id || auth.currentUser?.uid,
        created_at: academy?.created_at || new Date().toISOString()
      };
      
      if (academy?.id) {
        await updateDoc(doc(db, 'academies', academy.id), academyData);
      } else {
        const docRef = await addDoc(collection(db, 'academies'), academyData);
        
        // Link globally via whitelist if contact is an email
        if (formData.contact && formData.contact.includes('@')) {
          await addToWhitelist(formData.contact, 'academy', docRef.id);
        }

        if (auth.currentUser) {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), { academy_id: docRef.id });
        }
      }
      onSuccess();
    } catch (error) {
      handleFirestoreError(error, academy?.id ? OperationType.UPDATE : OperationType.CREATE, academy?.id ? `academies/${academy.id}` : 'academies');
    }
  };
  const handleSuggestCoords = () => {
    const coords = getFallbackCoords(formData.location);
    if (coords) {
      setFormData({ ...formData, lat: coords[0], lng: coords[1] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" placeholder="Nome da Academia" required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
      <input type="text" placeholder="Professor Responsável" required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" value={formData.head_coach} onChange={e => setFormData({...formData, head_coach: e.target.value})} />
      <div className="relative">
        <input type="text" placeholder="Localização (Cidade/Estado)" required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 pr-32" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
        <button 
          type="button"
          onClick={handleSuggestCoords}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all border border-emerald-500/30"
        >
          SUGERIR COORD.
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input type="number" step="any" placeholder="Latitude" required className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" value={formData.lat || ''} onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})} />
        <input type="number" step="any" placeholder="Longitude" required className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" value={formData.lng || ''} onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})} />
      </div>
      <input type="text" placeholder="Contato (WhatsApp/Email)" required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Plano Financeiro</label>
          <select 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
            value={formData.plan_id}
            onChange={e => setFormData({...formData, plan_id: e.target.value})}
          >
            <option value="">Selecionar Plano</option>
            {plans.filter(p => p.target === 'academies').map(p => (
              <option key={p.id} value={p.id}>
                {p.name} - R$ {((p.basePrice * (100 - p.discount)) / 100).toLocaleString('pt-BR')} ({p.frequency})
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Dia de Vencimento</label>
          <select 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
            value={formData.payment_day}
            onChange={e => setFormData({...formData, payment_day: parseInt(e.target.value)})}
          >
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Telegram Bot Token</label>
          <input type="text" placeholder="Ex: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" value={formData.telegram_bot_token} onChange={e => setFormData({...formData, telegram_bot_token: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Telegram Chat ID</label>
          <input type="text" placeholder="Ex: -1001234567890" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" value={formData.telegram_chat_id} onChange={e => setFormData({...formData, telegram_chat_id: e.target.value})} />
        </div>
      </div>

      <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
        {academy?.id ? 'Salvar Alterações' : 'Cadastrar Academia'}
      </button>
    </form>
  );
};

const ProfessorForm = ({ academyId, professor, onSuccess }: { academyId: string, professor?: Professor | null, onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    name: professor?.name || '',
    email: professor?.email || '',
    phone: professor?.phone || '',
    specialty: professor?.specialty || '',
    bio: professor?.bio || '',
    permissions: professor?.permissions || {
      gestao: false,
      administrativa: false,
      pedagogica: false
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const professorData: any = {
        ...formData,
        email: formData.email.toLowerCase(),
        academy_id: academyId,
        created_at: professor?.created_at || new Date().toISOString()
      };

      // Fetch academy name for syncing
      const academyDoc = await getDoc(doc(db, 'academies', academyId));
      const academyName = academyDoc.exists() ? academyDoc.data().name : 'Academia';

      if (professor?.id) {
        await updateDoc(doc(db, 'professors', professor.id), professorData);
        // Update user available_academies if user exists
        if (professor.user_id) {
          const userRef = doc(db, 'users', professor.user_id);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const available = userData.available_academies || [];
            const index = available.findIndex((a: any) => a.academy_id === academyId);
            
            if (index !== -1) {
              available[index].permissions = formData.permissions;
              available[index].academy_name = academyName;
            } else {
              available.push({
                academy_id: academyId,
                academy_name: academyName,
                permissions: formData.permissions
              });
            }

            const updates: any = { available_academies: available };
            // If this is the active academy, sync active permissions
            if (userData.academy_id === academyId) {
              updates.professor_permissions = formData.permissions;
            }
            await updateDoc(userRef, updates);
          }
        }
      } else {
        // Check if user already exists to link user_id
        const userQuery = query(collection(db, 'users'), where('email', '==', professorData.email));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          professorData.user_id = userDoc.id;
          
          const userData = userDoc.data();
          const available = userData.available_academies || [];
          if (!available.find((a: any) => a.academy_id === academyId)) {
            available.push({
              academy_id: academyId,
              academy_name: academyName,
              permissions: formData.permissions
            });
            await updateDoc(userDoc.ref, { available_academies: available });
          }
        }

        await addDoc(collection(db, 'professors'), professorData);
        // Link globally via whitelist
        await addToWhitelist(formData.email, 'professor', academyId);
      }
      onSuccess();
    } catch (error) {
      handleFirestoreError(error, professor?.id ? OperationType.UPDATE : OperationType.CREATE, 'professors');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Nome Completo" required value={formData.name} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" onChange={e => setFormData({...formData, name: e.target.value})} />
        <input type="email" placeholder="Email" required value={formData.email} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" onChange={e => setFormData({...formData, email: e.target.value})} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Telefone/WhatsApp" value={formData.phone} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" onChange={e => setFormData({...formData, phone: e.target.value})} />
        <input type="text" placeholder="Especialidade (Ex: BJJ, Muay Thai)" value={formData.specialty} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" onChange={e => setFormData({...formData, specialty: e.target.value})} />
      </div>
      
      <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700">
        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">Delegação de Funções</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={cn(
              "w-5 h-5 rounded border flex items-center justify-center transition-all",
              formData.permissions.gestao ? "bg-emerald-500 border-emerald-500" : "bg-zinc-900 border-zinc-700 group-hover:border-emerald-500/50"
            )}>
              {formData.permissions.gestao && <Check size={14} className="text-white" />}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={formData.permissions.gestao}
              onChange={e => setFormData({...formData, permissions: {...formData.permissions, gestao: e.target.checked}})}
            />
            <span className="text-sm font-bold text-zinc-300">Gestão</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={cn(
              "w-5 h-5 rounded border flex items-center justify-center transition-all",
              formData.permissions.administrativa ? "bg-emerald-500 border-emerald-500" : "bg-zinc-900 border-zinc-700 group-hover:border-emerald-500/50"
            )}>
              {formData.permissions.administrativa && <Check size={14} className="text-white" />}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={formData.permissions.administrativa}
              onChange={e => setFormData({...formData, permissions: {...formData.permissions, administrativa: e.target.checked}})}
            />
            <span className="text-sm font-bold text-zinc-300">Administrativa</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={cn(
              "w-5 h-5 rounded border flex items-center justify-center transition-all",
              formData.permissions.pedagogica ? "bg-emerald-500 border-emerald-500" : "bg-zinc-900 border-zinc-700 group-hover:border-emerald-500/50"
            )}>
              {formData.permissions.pedagogica && <Check size={14} className="text-white" />}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={formData.permissions.pedagogica}
              onChange={e => setFormData({...formData, permissions: {...formData.permissions, pedagogica: e.target.checked}})}
            />
            <span className="text-sm font-bold text-zinc-300">Pedagógica</span>
          </label>
        </div>
      </div>

      <textarea placeholder="Bio / Experiência" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 h-24" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
      
      <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
        {professor ? 'Atualizar Professor' : 'Cadastrar Professor'}
      </button>
    </form>
  );
};

const ProfessorsView = ({ user, academies, currentRole }: { user: User | null, academies: Academy[], currentRole: string }) => {
  const [selectedAcademyId, setSelectedAcademyId] = useState<string>(user?.academy_id || (academies.length > 0 ? academies[0].id : ''));
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);

  useEffect(() => {
    if (user?.academy_id && currentRole !== 'developer') {
      setSelectedAcademyId(user.academy_id);
    } else if (academies.length > 0 && !selectedAcademyId) {
      setSelectedAcademyId(user?.academy_id || academies[0].id);
    }
  }, [academies, user?.academy_id, currentRole]);

  useEffect(() => {
    if (!selectedAcademyId) return;
    const q = query(collection(db, 'professors'), where('academy_id', '==', selectedAcademyId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProfessors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Professor)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'professors'));
    return () => unsubscribe();
  }, [selectedAcademyId]);

  const handleDelete = async (prof: Professor) => {
    if (!confirm('Tem certeza que deseja excluir este professor?')) return;
    try {
      await deleteDoc(doc(db, 'professors', prof.id));
      
      if (prof.user_id) {
        const userRef = doc(db, 'users', prof.user_id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const available = (userData.available_academies || []).filter((a: any) => a.academy_id !== selectedAcademyId);
          
          const updates: any = { available_academies: available };
          if (userData.academy_id === selectedAcademyId) {
            if (available.length > 0) {
              updates.academy_id = available[0].academy_id;
              updates.professor_permissions = available[0].permissions;
            } else {
              updates.academy_id = null;
              updates.professor_permissions = null;
            }
          }
          await updateDoc(userRef, updates);
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `professors/${prof.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">PROFESSORES</h2>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Gestão e delegação de funções</p>
        </div>
        <div className="flex items-center gap-4">
          {currentRole === 'developer' && (
            <select
              value={selectedAcademyId}
              onChange={(e) => setSelectedAcademyId(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
            >
              {academies.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          )}
          <button 
            onClick={() => { setEditingProfessor(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus size={20} />
            Novo Professor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professors.map((prof) => (
          <motion.div 
            key={prof.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-emerald-500/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-black text-xl">
                  {prof.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{prof.name}</h3>
                  <p className="text-xs text-zinc-500">{prof.specialty || 'Professor'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingProfessor(prof); setIsModalOpen(true); }} className="p-2 text-zinc-500 hover:text-emerald-500 transition-colors">
                  <Settings2 size={18} />
                </button>
                <button onClick={() => handleDelete(prof)} className="p-2 text-zinc-500 hover:text-rose-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {prof.permissions.gestao && (
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase tracking-wider">Gestão</span>
                )}
                {prof.permissions.administrativa && (
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-bold rounded-full border border-blue-500/20 uppercase tracking-wider">Administrativa</span>
                )}
                {prof.permissions.pedagogica && (
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-500 text-[10px] font-bold rounded-full border border-purple-500/20 uppercase tracking-wider">Pedagógica</span>
                )}
                {!prof.permissions.gestao && !prof.permissions.administrativa && !prof.permissions.pedagogica && (
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-500 text-[10px] font-bold rounded-full border border-zinc-700 uppercase tracking-wider">Sem Funções Delegadas</span>
                )}
              </div>
              
              <div className="pt-4 border-t border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Mail size={14} className="text-zinc-600" />
                  {prof.email}
                </div>
                {prof.phone && (
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Phone size={14} className="text-zinc-600" />
                    {prof.phone}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-white">{editingProfessor ? 'EDITAR PROFESSOR' : 'NOVO PROFESSOR'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <ProfessorForm 
              academyId={selectedAcademyId} 
              professor={editingProfessor} 
              onSuccess={() => setIsModalOpen(false)} 
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

const AcademiesView = ({ academies, athletes, onAdd, onEdit, user, currentRole }: { academies: Academy[], athletes: Athlete[], onAdd: () => void, onEdit: (academy: Academy) => void, user: User | null, currentRole: string }) => {
  const [academyToDelete, setAcademyToDelete] = useState<string | null>(null);
  const isDeveloper = currentRole === 'developer';

  const handleDelete = async (id: string) => {
    try {
      const batch = writeBatch(db);
      
      // Delete the academy
      batch.delete(doc(db, 'academies', id));
      
      // Update all athletes that were in this academy
      const academyAthletes = athletes.filter(a => a.academy_id === id);
      academyAthletes.forEach(athlete => {
        batch.update(doc(db, 'athletes', athlete.id), { academy_id: '' });
      });
      
      await batch.commit();
      setAcademyToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `academies/${id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {isDeveloper && (
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus size={20} />
            Nova Academia
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {academies.map(academy => {
          const academyAthletes = athletes.filter(a => a.academy_id === academy.id);
          const avgScore = academyAthletes.length 
            ? Math.round(academyAthletes.reduce((acc, curr) => acc + curr.score, 0) / academyAthletes.length)
            : 0;
          const avgMental = academyAthletes.length
            ? Math.round(academyAthletes.reduce((acc, curr) => acc + (curr.latest_psych_score || 0), 0) / academyAthletes.length)
            : 0;
          const avgTAF = academyAthletes.length
            ? Math.round(academyAthletes.reduce((acc, curr) => acc + (curr.latest_physical_power || 0), 0) / academyAthletes.length)
            : 0;
          const totalTrainings = academyAthletes.reduce((acc, curr) => acc + (curr.training_count_30d || 0), 0);
          const totalMedals = academyAthletes.reduce((acc, curr) => {
            return acc + (curr.medals_count?.gold || 0) + (curr.medals_count?.silver || 0) + (curr.medals_count?.bronze || 0);
          }, 0);

          return (
            <motion.div 
              key={academy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl group hover:border-emerald-500/50 transition-all relative"
            >
              {isDeveloper && (
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(academy)}
                    className="p-2 text-zinc-600 hover:text-emerald-500 transition-colors"
                  >
                    <Settings size={18} />
                  </button>
                  <button 
                    onClick={() => setAcademyToDelete(academy.id)}
                    className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-emerald-500">
                  <Landmark size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{academy.name}</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{academy.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Atletas</div>
                  <div className="text-xl font-black text-white">{academyAthletes.length}</div>
                </div>
                <div className="bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Score Médio</div>
                  <div className="text-xl font-black text-emerald-500">{avgScore}</div>
                </div>
                <div className="bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">TAF Médio</div>
                  <div className="text-xl font-black text-blue-500">{avgTAF}</div>
                </div>
                <div className="bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Treinos (Mês)</div>
                  <div className="text-xl font-black text-orange-500">{totalTrainings}</div>
                </div>
                <div className="bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Medalhas</div>
                  <div className="text-xl font-black text-yellow-500">{totalMedals}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Professor</span>
                  <span className="text-white font-medium">{academy.head_coach}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Prontidão Mental Média</span>
                    <span className="text-white font-bold">{avgMental}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500" 
                      style={{ width: `${avgMental}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Contato</span>
                  <span className="text-zinc-300">{academy.contact}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-zinc-800/50">
                  <span className="text-zinc-500">Financeiro</span>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn(
                      "text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest",
                      academy.payment_status === 'paid' ? "bg-emerald-500/10 text-emerald-500" : 
                      academy.payment_status === 'overdue' ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {academy.payment_status === 'paid' ? 'Pago' : academy.payment_status === 'overdue' ? 'Atrasado' : 'Pendente'}
                    </span>
                    {academy.is_blocked && (
                      <span className="flex items-center gap-1 text-rose-500 text-[8px] font-black uppercase tracking-tighter">
                        <Lock size={8} /> BLOQUEADO
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-800">
                <div className="flex -space-x-2">
                  {academyAthletes.slice(0, 5).map(athlete => (
                    <div key={athlete.id} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-emerald-500">
                      {athlete.name.charAt(0)}
                    </div>
                  ))}
                  {academyAthletes.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                      +{academyAthletes.length - 5}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {academyToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Excluir Academia?</h3>
            <p className="text-zinc-500 text-sm mb-8">Esta ação removerá a academia permanentemente. Os atletas vinculados ficarão sem academia associada.</p>
            <div className="flex gap-3">
              <button onClick={() => setAcademyToDelete(null)} className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all">Cancelar</button>
              <button onClick={() => handleDelete(academyToDelete)} className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/20">Excluir</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const SelectionLaboratory = ({ athletes, academies, onSelect }: { athletes: Athlete[], academies: Academy[], onSelect: (id: string) => void }) => {
  const candidates = athletes.filter(a => a.is_candidate);
  const [filter, setFilter] = useState<'all' | 'Avaliação' | 'Teste' | 'Aprovado' | 'Reprovado'>('all');

  const filteredCandidates = filter === 'all' 
    ? candidates 
    : candidates.filter(c => c.selection_status === filter);

  const stats = {
    total: candidates.length,
    evaluating: candidates.filter(c => c.selection_status === 'Avaliação').length,
    testing: candidates.filter(c => c.selection_status === 'Teste').length,
    approved: candidates.filter(c => c.selection_status === 'Aprovado').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">Laboratório de Seleção PAC</h2>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Triagem e Avaliação de Novos Talentos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Candidatos', value: stats.total, icon: Users, color: 'text-white' },
          { label: 'Em Avaliação', value: stats.evaluating, icon: Search, color: 'text-blue-500' },
          { label: 'Teste de Tatame', value: stats.testing, icon: Dumbbell, color: 'text-amber-500' },
          { label: 'Aprovados', value: stats.approved, icon: CheckCircle, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className={cn("p-2 rounded-lg bg-zinc-800", stat.color)}>
                <stat.icon size={16} />
              </div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className={cn("text-2xl font-black", stat.color)}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'Avaliação', 'Teste', 'Aprovado', 'Reprovado'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
              filter === f 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                : "bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800"
            )}
          >
            {f === 'all' ? 'Todos' : f === 'Teste' ? 'Teste de Tatame' : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCandidates.length > 0 ? (
          filteredCandidates.map(candidate => {
            const academy = academies.find(a => a.id === candidate.academy_id);
            return (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onSelect(candidate.id)}
                className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-3xl hover:border-emerald-500/50 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center text-emerald-500 font-black">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{candidate.name}</h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{academy?.name || 'Sem Academia'}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest",
                    candidate.selection_status === 'Aprovado' ? "bg-emerald-500/10 text-emerald-500" :
                    candidate.selection_status === 'Reprovado' ? "bg-rose-500/10 text-rose-500" :
                    candidate.selection_status === 'Teste' ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                  )}>
                    {candidate.selection_status === 'Teste' ? 'Teste de Tatame' : candidate.selection_status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-zinc-800/30 p-2 rounded-xl border border-white/5">
                    <div className="text-[8px] text-zinc-500 uppercase font-bold mb-1">Score Atual</div>
                    <div className="text-lg font-black text-white">{candidate.score}</div>
                  </div>
                  <div className="bg-zinc-800/30 p-2 rounded-xl border border-white/5">
                    <div className="text-[8px] text-zinc-500 uppercase font-bold mb-1">Potencial</div>
                    <div className="text-lg font-black text-emerald-500">A+</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-500 uppercase font-bold">Aptidão Física</span>
                      <span className="text-white font-bold">{candidate.latest_physical_power || 0}%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${candidate.latest_physical_power || 0}%` }} />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    {candidate.selection_status === 'Avaliação' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateDoc(doc(db, 'athletes', candidate.id), { selection_status: 'Teste' });
                        }}
                        className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[8px] font-black py-2 rounded-lg uppercase tracking-widest transition-colors"
                      >
                        Mover p/ Teste
                      </button>
                    )}
                    {candidate.selection_status === 'Teste' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateDoc(doc(db, 'athletes', candidate.id), { selection_status: 'Aprovado' });
                        }}
                        className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[8px] font-black py-2 rounded-lg uppercase tracking-widest transition-colors"
                      >
                        Aprovar
                      </button>
                    )}
                    {candidate.selection_status !== 'Reprovado' && candidate.selection_status !== 'Aprovado' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateDoc(doc(db, 'athletes', candidate.id), { selection_status: 'Reprovado' });
                        }}
                        className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[8px] font-black py-2 rounded-lg uppercase tracking-widest transition-colors"
                      >
                        Reprovar
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl">
            <p className="text-zinc-500 text-sm">Nenhum candidato encontrado nesta fase.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AthleteList = ({ athletes, academies, onSelect, onEdit }: { athletes: Athlete[], academies: Academy[], onSelect: (id: string) => void, onEdit: (athlete: Athlete) => void }) => {
  const [athleteToDelete, setAthleteToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAthletes = athletes.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'athletes', id));
      setAthleteToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `athletes/${id}`);
    }
  };

  return (
    <div className="space-y-6">
      <input 
        type="text" 
        placeholder="Buscar atleta..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAthletes.map((athlete) => {
          const academy = academies.find(a => a.id === athlete.academy_id);
          return (
            <motion.div
              key={athlete.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl group hover:border-emerald-500/50 transition-all relative"
            >
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(athlete); }}
                  className="p-2 text-zinc-600 hover:text-emerald-500 transition-colors"
                  title="Editar Atleta"
                >
                  <Settings2 size={18} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setAthleteToDelete(athlete.id); }}
                  className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                  title="Excluir Atleta"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6" onClick={() => onSelect(athlete.id)}>
                <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-emerald-500 text-xl font-black">
                  {athlete.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{athlete.name}</h3>
                    {athlete.is_candidate && (
                      <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" title="Candidato PAC" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{athlete.belt} ({athlete.stripes} {athlete.stripes === 1 ? 'Grau' : 'Graus'})</span>
                    <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{athlete.weight_class}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Academia</span>
                  <span className="text-white font-medium">{academy?.name || 'Não vinculada'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Pontuação</span>
                  <span className="text-emerald-500 font-black">{athlete.score} pts</span>
                </div>
              </div>

              <button 
                onClick={() => onSelect(athlete.id)}
                className="w-full bg-zinc-800 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
              >
                Ver Dossiê Completo
                <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};


const TrainingLogForm = ({ athletes, onSuccess, editingMetric }: { athletes: Athlete[], onSuccess: () => void, editingMetric?: any }) => {
  const [formData, setFormData] = useState(() => {
    const defaults = { athlete_id: '', type: 'técnico', intensity: 5, duration_minutes: 60, notes: '', date: new Date().toISOString().split('T')[0] };
    if (editingMetric) {
      const { id, athleteName, athleteScore, athleteId, ...rest } = editingMetric;
      return { ...defaults, ...rest, athlete_id: athleteId, date: editingMetric.date ? editingMetric.date.split('T')[0] : defaults.date };
    }
    return defaults;
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.athlete_id) return;

    try {
      const logData = {
        ...formData,
        date: editingMetric && editingMetric.date.startsWith(formData.date) ? editingMetric.date : new Date(`${formData.date}T12:00:00Z`).toISOString(),
      };
      
      const batch = writeBatch(db);
      const logRef = editingMetric 
        ? doc(db, `athletes/${formData.athlete_id}/training_logs`, editingMetric.id)
        : doc(collection(db, `athletes/${formData.athlete_id}/training_logs`));
      
      if (editingMetric) {
        batch.update(logRef, logData);
      } else {
        batch.set(logRef, logData);
        
        const athleteRef = doc(db, 'athletes', formData.athlete_id);
        batch.update(athleteRef, { 
          score: increment(2),
          training_count_30d: increment(1)
        });
      }

      await batch.commit();

      // Create automatic post
      const athlete = athletes.find(a => a.id === formData.athlete_id);
      if (athlete) {
        createAutomaticPost(
          athlete.academy_id || '',
          formData.athlete_id,
          athlete.name,
          `Treino de ${formData.type} concluído! 🥋\nDuração: ${formData.duration_minutes}min | Intensidade: ${formData.intensity}/10`,
          { type: 'training', intensity: formData.intensity }
        );
      }

      onSuccess();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `athletes/${formData.athlete_id}/training_logs`);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SearchableAthleteSelect 
        athletes={athletes}
        selectedId={formData.athlete_id}
        onSelect={(id) => setFormData({ ...formData, athlete_id: id })}
        label="Atleta"
      />
      <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Data do Treino</label>
        <input 
          type="date" 
          value={formData.date}
          max={new Date().toISOString().split('T')[0]}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
          onChange={e => setFormData({...formData, date: e.target.value})} 
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Tipo de Treino</label>
          <select className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
            <option value="técnico">Técnico</option><option value="sparring">Sparring</option><option value="condicionamento">Condicionamento</option><option value="estratégia">Estratégia</option><option value="recuperação">Recuperação</option>
          </select>
          <p className="text-[9px] text-zinc-600 ml-2 italic">Foco principal da sessão.</p>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Duração (minutos)</label>
          <input type="number" placeholder="Duração (min)" required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" value={formData.duration_minutes} onChange={e => setFormData({...formData, duration_minutes: parseInt(e.target.value)})} />
          <p className="text-[9px] text-zinc-600 ml-2 italic">Tempo total de treino ativo.</p>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Intensidade (Percepção Subjetiva de Esforço): {formData.intensity}</label>
        <input type="range" min="1" max="10" value={formData.intensity || 5} className="w-full accent-emerald-500" onChange={e => setFormData({...formData, intensity: parseInt(e.target.value) || 5})} />
        <p className="text-[9px] text-zinc-600 ml-2 italic">1 = Muito Leve | 10 = Esforço Máximo.</p>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Observações</label>
        <textarea placeholder="Observações" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 h-24" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
        <p className="text-[9px] text-zinc-600 ml-2 italic">Anotações sobre o desempenho, dores ou aprendizados.</p>
      </div>
      <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all">Registrar Treino</button>
    </form>
  );
};

const PsychologicalEvaluationForm = ({ athletes, onSuccess, editingMetric }: { athletes: Athlete[], onSuccess: () => void, editingMetric?: any }) => {
  const [formData, setFormData] = useState(() => {
    const defaults = { 
      athlete_id: '', 
      disciplina: 50, 
      resiliencia: 50, 
      mentalidade_competitiva: 50, 
      controle_emocional: 50, 
      responsabilidade: 50, 
      tolerancia_dor: 50, 
      mentalidade_crescimento: 50,
      date: new Date().toISOString().split('T')[0]
    };
    if (editingMetric) {
      const { id, athleteName, athleteScore, athleteId, overall_score, ...rest } = editingMetric;
      return { ...defaults, ...rest, athlete_id: athleteId, date: editingMetric.date ? editingMetric.date.split('T')[0] : defaults.date };
    }
    return defaults;
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.athlete_id) return;

    try {
      const overallScore = Object.entries(formData).reduce((acc: number, [key, curr]) => key !== 'date' && typeof curr === 'number' ? acc + (curr as number) : acc, 0);
      // Normalize to 200 scale (Page 9)
      const normalizedScore = Math.round(((overallScore as number) / 700) * 200);
      const athlete = athletes.find(a => a.id === formData.athlete_id);

      // Calculate new total PAC score and classification
      const updatedAthlete = athlete ? {
        ...athlete,
        latest_psych_score: normalizedScore
      } : null;
      
      const pacMetrics = updatedAthlete ? calculatePACScore(updatedAthlete) : { score: 0, classification: 'Base PAC' };

      const evalData = {
        ...formData,
        overall_score: normalizedScore,
        date: editingMetric && editingMetric.date.startsWith(formData.date) ? editingMetric.date : new Date(`${formData.date}T12:00:00Z`).toISOString(),
      };
      
      const batch = writeBatch(db);
      const evalRef = editingMetric 
        ? doc(db, `athletes/${formData.athlete_id}/psychological_evaluations`, editingMetric.id)
        : doc(collection(db, `athletes/${formData.athlete_id}/psychological_evaluations`));

      if (editingMetric) {
        batch.update(evalRef, evalData);
      } else {
        batch.set(evalRef, evalData);
      }
      
      const athleteRef = doc(db, 'athletes', formData.athlete_id);
      batch.update(athleteRef, { 
        score: pacMetrics.score,
        classification: pacMetrics.classification,
        latest_psych_score: normalizedScore
      });

      const notificationRef = doc(collection(db, 'notifications'));
      batch.set(notificationRef, {
        type: 'NOTIFICATION',
        title: 'Diagnóstico Mental PAC',
        message: `Atleta ${athlete?.name} realizou avaliação mental. Score: ${normalizedScore}/200`,
        read: false,
        createdAt: Timestamp.now()
      });

      await batch.commit();
      
      if (athlete) {
        createAutomaticPost(
          athlete.academy_id || '',
          formData.athlete_id,
          athlete.name,
          `Realizou o Diagnóstico Mental PAC! 🧠\nScore Mental: ${normalizedScore}/200\nFoco: Resiliência e Controle.`,
          { type: 'psych', score: normalizedScore }
        );
      }

      onSuccess();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `athletes/${formData.athlete_id}/psychological_evaluations`);
    }
  };

  const indicators = [
    { key: 'disciplina', label: 'Disciplina', desc: 'Rotinas rígidas, horários e compromisso total.' },
    { key: 'resiliencia', label: 'Resiliência', desc: 'Capacidade de voltar ao foco após derrotas ou frustrações.' },
    { key: 'mentalidade_competitiva', label: 'Mentalidade Competitiva', desc: 'Fome de desafio, desejo de vencer e competir sempre.' },
    { key: 'controle_emocional', label: 'Controle Emocional', desc: 'Calma e clareza sob pressão extrema no combate.' },
    { key: 'responsabilidade', label: 'Responsabilidade', desc: 'Zero desculpas, assume erros e busca soluções imediatas.' },
    { key: 'tolerancia_dor', label: 'Tolerância à Dor', desc: 'Capacidade de lidar com o desconforto físico e fadiga extrema.' },
    { key: 'mentalidade_crescimento', label: 'Mentalidade de Crescimento', desc: 'Receptividade a críticas e busca constante por evolução.' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
      <SearchableAthleteSelect 
        athletes={athletes}
        selectedId={formData.athlete_id}
        onSelect={(id) => setFormData({ ...formData, athlete_id: id })}
        label="Atleta"
      />
      <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Data da Avaliação</label>
        <input 
          type="date" 
          value={formData.date}
          max={new Date().toISOString().split('T')[0]}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
          onChange={e => setFormData({...formData, date: e.target.value})} 
          required
        />
      </div>

      <div className="space-y-8">
        {indicators.map((indicator) => (
          <div key={indicator.key} className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <label className="text-xs font-black text-white uppercase tracking-widest">{indicator.label}</label>
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">{indicator.desc}</p>
              </div>
              <span className="text-emerald-500 font-black text-sm">{(formData as any)[indicator.key]}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={(formData as any)[indicator.key]}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              onChange={e => setFormData({...formData, [indicator.key]: parseInt(e.target.value)})}
            />
          </div>
        ))}
      </div>

      <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
        Finalizar Diagnóstico PAC
      </button>
    </form>
  );
};

const TechnicalEvaluationForm = ({ athletes, onSuccess, editingMetric }: { athletes: Athlete[], onSuccess: () => void, editingMetric?: any }) => {
  const [formData, setFormData] = useState(() => {
    const defaults = { 
      athlete_id: '', 
      raspagens_efficiency: 50, 
      passagens_efficiency: 50, 
      finalizacoes_efficiency: 50,
      quedas_efficiency: 50,
      defesa_efficiency: 50,
      back_takes: 50,
      mount_control: 50,
      leg_locks: 50,
      date: new Date().toISOString().split('T')[0]
    };
    if (editingMetric) {
      const { id, athleteName, athleteScore, athleteId, ...rest } = editingMetric;
      return { ...defaults, ...rest, athlete_id: athleteId, date: editingMetric.date ? editingMetric.date.split('T')[0] : defaults.date };
    }
    return defaults;
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.athlete_id) return;

    try {
      const athlete = athletes.find(a => a.id === formData.athlete_id);
      
      // Calculate new total PAC score and classification
      const updatedAthlete = athlete ? {
        ...athlete,
        technical_history: {
          ...athlete.technical_history,
          raspagens_efficiency: formData.raspagens_efficiency,
          passagens_efficiency: formData.passagens_efficiency,
          finalizacoes_efficiency: formData.finalizacoes_efficiency,
          quedas_efficiency: formData.quedas_efficiency,
          defesa_efficiency: formData.defesa_efficiency
        },
        technical_competencies: {
          ...athlete.technical_competencies,
          raspagens: formData.raspagens_efficiency,
          passagens: formData.passagens_efficiency,
          finalizacoes: formData.finalizacoes_efficiency,
          quedas: formData.quedas_efficiency,
          defesa: formData.defesa_efficiency,
          back_takes: formData.back_takes,
          mount_control: formData.mount_control,
          leg_locks: formData.leg_locks
        }
      } : null;
      
      const pacMetrics = updatedAthlete ? calculatePACScore(updatedAthlete) : { score: 0, classification: 'Base PAC' };

      const batch = writeBatch(db);
      const athleteRef = doc(db, 'athletes', formData.athlete_id);
      
      batch.update(athleteRef, { 
        'technical_history.raspagens_efficiency': formData.raspagens_efficiency,
        'technical_history.passagens_efficiency': formData.passagens_efficiency,
        'technical_history.finalizacoes_efficiency': formData.finalizacoes_efficiency,
        'technical_history.quedas_efficiency': formData.quedas_efficiency,
        'technical_history.defesa_efficiency': formData.defesa_efficiency,
        'technical_competencies.raspagens': formData.raspagens_efficiency,
        'technical_competencies.passagens': formData.passagens_efficiency,
        'technical_competencies.finalizacoes': formData.finalizacoes_efficiency,
        'technical_competencies.quedas': formData.quedas_efficiency,
        'technical_competencies.defesa': formData.defesa_efficiency,
        'technical_competencies.back_takes': formData.back_takes,
        'technical_competencies.mount_control': formData.mount_control,
        'technical_competencies.leg_locks': formData.leg_locks,
        score: pacMetrics.score,
        classification: pacMetrics.classification,
        updatedAt: new Date().toISOString()
      });

      const techEvalRef = editingMetric 
        ? doc(db, `athletes/${formData.athlete_id}/technical_evaluations`, editingMetric.id)
        : doc(collection(db, `athletes/${formData.athlete_id}/technical_evaluations`));
      
      const evalData = {
        ...formData,
        date: editingMetric && editingMetric.date.startsWith(formData.date) ? editingMetric.date : new Date(`${formData.date}T12:00:00Z`).toISOString()
      };

      if (editingMetric) {
        batch.update(techEvalRef, evalData);
      } else {
        batch.set(techEvalRef, evalData);
      }

      const notificationRef = doc(collection(db, 'notifications'));
      batch.set(notificationRef, {
        type: 'NOTIFICATION',
        title: 'Atualização Técnica PAC',
        message: `Atleta ${athlete?.name} teve métricas técnicas atualizadas.`,
        read: false,
        createdAt: Timestamp.now()
      });

      await batch.commit();
      
      if (athlete) {
        createAutomaticPost(
          athlete.academy_id || '',
          formData.athlete_id,
          athlete.name,
          `Evolução Técnica PAC! 🥋\nEficiência em Passagens: ${formData.passagens_efficiency}%\nEficiência em Finalizações: ${formData.finalizacoes_efficiency}%`,
          { type: 'technical', score: 10 }
        );
      }

      onSuccess();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `athletes/${formData.athlete_id}`);
    }
  };

  const metrics = [
    { key: 'raspagens_efficiency', label: 'Raspagens', desc: 'Eficiência em reverter a posição de baixo para cima.' },
    { key: 'passagens_efficiency', label: 'Passagens', desc: 'Capacidade de transpor a guarda do oponente.' },
    { key: 'finalizacoes_efficiency', label: 'Finalizações', desc: 'Eficiência em encerrar a luta antes do tempo.' },
    { key: 'quedas_efficiency', label: 'Quedas', desc: 'Domínio de projeções e quedas em pé.' },
    { key: 'defesa_efficiency', label: 'Defesa', desc: 'Capacidade de evitar ataques e reposicionar com segurança.' },
    { key: 'back_takes', label: 'Tomada de Costas', desc: 'Eficiência em chegar e manter o controle das costas.' },
    { key: 'mount_control', label: 'Controle de Montada', desc: 'Domínio e estabilização na posição de montada.' },
    { key: 'leg_locks', label: 'Leg Locks', desc: 'Domínio de ataques e defesas de chaves de perna.' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
      <SearchableAthleteSelect 
        athletes={athletes}
        selectedId={formData.athlete_id}
        onSelect={(id) => setFormData({ ...formData, athlete_id: id })}
        label="Atleta"
      />
      <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Data da Avaliação</label>
        <input 
          type="date" 
          value={formData.date}
          max={new Date().toISOString().split('T')[0]}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
          onChange={e => setFormData({...formData, date: e.target.value})} 
          required
        />
      </div>

      <div className="space-y-8">
        {metrics.map((metric) => (
          <div key={metric.key} className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <label className="text-xs font-black text-white uppercase tracking-widest">{metric.label}</label>
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">{metric.desc}</p>
              </div>
              <span className="text-emerald-500 font-black text-sm">{(formData as any)[metric.key]}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={(formData as any)[metric.key]}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              onChange={e => setFormData({...formData, [metric.key]: parseInt(e.target.value)})}
            />
          </div>
        ))}
      </div>

      <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
        Salvar Avaliação Técnica
      </button>
    </form>
  );
};

const HealthMetricsForm = ({ athletes, onSuccess, editingMetric }: { athletes: Athlete[], onSuccess: () => void, editingMetric?: any }) => {
  const [isEstimatingVO2, setIsEstimatingVO2] = useState<number | null>(null);
  const [isEstimatingCal, setIsEstimatingCal] = useState<number | null>(null);

  const [formData, setFormData] = useState(() => {
    const defaults = { 
      athlete_id: '', 
      sleep_hours: 8,
      sleep_quality: 80,
      resting_heart_rate: 60,
      hrv: 50,
      spo2: 98,
      cooper_tests: [] as any[],
      calorimetry_history: [] as any[],
      date: new Date().toISOString().split('T')[0]
    };
    if (editingMetric) {
      const { id, athleteName, athleteScore, athleteId, ...rest } = editingMetric;
      return { ...defaults, ...rest, athlete_id: athleteId, date: editingMetric.date ? editingMetric.date.split('T')[0] : defaults.date };
    }
    return defaults;
  });

  const estimateVO2Max = async (index: number) => {
    const test = formData.cooper_tests[index];
    if (!test.distance_meters) {
      return;
    }
    
    const athlete = athletes.find(a => a.id === formData.athlete_id);
    if (!athlete) return;

    setIsEstimatingVO2(index);
    try {
      const ai = getGenAI();
      const prompt = `
        Atue como um fisiologista do esporte.
        Atleta: ${athlete.gender === 'M' ? 'Masculino' : 'Feminino'}, Idade: ${athlete.birth_date ? new Date().getFullYear() - new Date(athlete.birth_date).getFullYear() : 'N/A'}, Peso: ${athlete.latest_weight || 'N/A'}kg.
        O atleta realizou um Teste de Cooper de 12 minutos e percorreu ${test.distance_meters} metros.
        Estime o VO2 Max (ml/kg/min) com base nessa distância.
        Retorne APENAS um objeto JSON com a chave "vo2_max" contendo o valor numérico (pode ter casas decimais).
      `;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const data = JSON.parse(response.text || '{}');
      if (data.vo2_max) {
        const tests = [...formData.cooper_tests];
        tests[index].vo2_max_estimated = data.vo2_max;
        setFormData({...formData, cooper_tests: tests});
      }
    } catch (error) {
      console.error("Erro ao estimar VO2:", error);
    } finally {
      setIsEstimatingVO2(null);
    }
  };

  const estimateCalorimetry = async (index: number) => {
    const athlete = athletes.find(a => a.id === formData.athlete_id);
    if (!athlete) {
      return;
    }

    setIsEstimatingCal(index);
    try {
      const ai = getGenAI();
      
      const recentTrainings = athlete.training?.slice(0, 7) || [];
      const trainingSummary = recentTrainings.length > 0 
        ? `Histórico recente de treinos (últimos ${recentTrainings.length} treinos): \n` + 
          recentTrainings.map((t: any) => `- Tipo: ${t.type}, Duração: ${t.duration_minutes} min, Intensidade: ${t.intensity}/10`).join('\n')
        : 'Nenhum treino registrado recentemente. Considere um nível de atividade base para Jiu-Jitsu.';

      const prompt = `
        Atue como um nutricionista esportivo.
        Atleta: ${athlete.gender === 'M' ? 'Masculino' : 'Feminino'}, Idade: ${athlete.birth_date ? new Date().getFullYear() - new Date(athlete.birth_date).getFullYear() : 30} anos, Peso: ${athlete.latest_weight || 75}kg, Altura: ${athlete.height || 175}cm.
        
        ${trainingSummary}
        
        Com base nesses dados de treino (ou na ausência deles, assumindo treinos de Jiu-Jitsu), estime a calorimetria diária deste atleta.
        Retorne APENAS um objeto JSON com as seguintes chaves (valores numéricos inteiros em kcal):
        - rmr (Resting Metabolic Rate / Taxa Metabólica Basal)
        - amr (Active Metabolic Rate / Gasto com Atividades)
        - tdee (Total Daily Energy Expenditure / Gasto Energético Total)
      `;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const data = JSON.parse(response.text || '{}');
      if (data.rmr && data.amr && data.tdee) {
        const cals = [...formData.calorimetry_history];
        cals[index].resting_metabolic_rate = data.rmr;
        cals[index].active_metabolic_rate = data.amr;
        cals[index].tdee_estimated = data.tdee;
        setFormData({...formData, calorimetry_history: cals});
      }
    } catch (error) {
      console.error("Erro ao estimar Calorimetria:", error);
    } finally {
      setIsEstimatingCal(null);
    }
  };

  useEffect(() => {
    if (formData.athlete_id) {
      const athlete = athletes.find(a => a.id === formData.athlete_id);
      if (athlete) {
        setFormData(prev => ({
          ...prev,
          cooper_tests: athlete.cooper_tests || [],
          calorimetry_history: athlete.calorimetry_history || []
        }));
      }
    }
  }, [formData.athlete_id, athletes]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.athlete_id) return;

    try {
      const athlete = athletes.find(a => a.id === formData.athlete_id);
      const batch = writeBatch(db);
      const athleteRef = doc(db, 'athletes', formData.athlete_id);
      
      // Update current metrics in athlete document
      batch.update(athleteRef, { 
        'sleep_telemetry.avg_hours': formData.sleep_hours,
        'sleep_telemetry.quality_rem': formData.sleep_quality,
        'biometrics.resting_hr': formData.resting_heart_rate,
        'biometrics.hrv': formData.hrv,
        'biometrics.spo2': formData.spo2,
        'cooper_tests': formData.cooper_tests,
        'calorimetry_history': formData.calorimetry_history
      });

      // Log history entry
      const healthLogRef = editingMetric 
        ? doc(db, `athletes/${formData.athlete_id}/health_logs`, editingMetric.id)
        : doc(collection(db, `athletes/${formData.athlete_id}/health_logs`));
      
      const evalData = {
        ...formData,
        date: editingMetric && editingMetric.date.startsWith(formData.date) ? editingMetric.date : new Date(`${formData.date}T12:00:00Z`).toISOString()
      };

      if (editingMetric) {
        batch.update(healthLogRef, evalData);
      } else {
        batch.set(healthLogRef, evalData);
      }

      const notificationRef = doc(collection(db, 'notifications'));
      batch.set(notificationRef, {
        type: 'NOTIFICATION',
        title: 'Novas Métricas de Saúde',
        message: `Dados de biometria e telemetria atualizados para ${athlete?.name}.`,
        read: false,
        createdAt: Timestamp.now()
      });

      await batch.commit();
      
      if (athlete) {
        createAutomaticPost(
          athlete.academy_id || '',
          formData.athlete_id,
          athlete.name,
          `Métricas de Saúde Atualizadas! ❤️\nQualidade do Sono: ${formData.sleep_quality}%\nHRV: ${formData.hrv}ms`,
          { type: 'health', score: 5 }
        );
      }

      onSuccess();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `athletes/${formData.athlete_id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
      <SearchableAthleteSelect 
        athletes={athletes}
        selectedId={formData.athlete_id}
        onSelect={(id) => setFormData({ ...formData, athlete_id: id })}
        label="Atleta"
      />
      <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Data do Registro</label>
        <input 
          type="date" 
          value={formData.date}
          max={new Date().toISOString().split('T')[0]}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
          onChange={e => setFormData({...formData, date: e.target.value})} 
          required
        />
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Moon size={14} className="text-blue-500" /> Telemetria do Sono
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">Média de Horas</label>
              <input 
                type="number" 
                step="0.1"
                value={formData.sleep_hours}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"
                onChange={e => setFormData({...formData, sleep_hours: parseFloat(e.target.value)})}
              />
              <p className="text-[9px] text-zinc-600 italic leading-tight">Total de horas de sono efetivo registrado por wearable.</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">Qualidade (REM %)</label>
              <input 
                type="number" 
                value={formData.sleep_quality}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"
                onChange={e => setFormData({...formData, sleep_quality: parseInt(e.target.value)})}
              />
              <p className="text-[9px] text-zinc-600 italic leading-tight">Percentual de sono profundo/REM (Recuperação Mental).</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Heart size={14} className="text-rose-500" /> Biometria & Recuperação
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">Freq. Cardíaca (BPM)</label>
              <input 
                type="number" 
                value={formData.resting_heart_rate}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"
                onChange={e => setFormData({...formData, resting_heart_rate: parseInt(e.target.value)})}
              />
              <p className="text-[9px] text-zinc-600 italic leading-tight">Medir ao acordar, em repouso absoluto.</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">HRV (ms)</label>
              <input 
                type="number" 
                value={formData.hrv}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"
                onChange={e => setFormData({...formData, hrv: parseInt(e.target.value)})}
              />
              <p className="text-[9px] text-zinc-600 italic leading-tight">Variabilidade Cardíaca (Status do SNC).</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">SpO2 (%)</label>
              <input 
                type="number" 
                value={formData.spo2}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"
                onChange={e => setFormData({...formData, spo2: parseInt(e.target.value)})}
              />
              <p className="text-[9px] text-zinc-600 italic leading-tight">Oxigenação sanguínea (Ideal: 95-100%).</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t border-zinc-700 pt-6">
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" /> Testes Fisiológicos
          </h4>
          
          <div className="space-y-4">
            <label className="text-xs font-bold text-zinc-400">Testes de Cooper</label>
            {formData.cooper_tests?.map((test: any, index: number) => (
              <div key={index} className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 space-y-4">
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => estimateVO2Max(index)}
                    disabled={isEstimatingVO2 === index || !test.distance_meters}
                    className="text-[10px] text-emerald-500 hover:text-emerald-400 font-bold flex items-center gap-1 disabled:opacity-50 bg-emerald-500/10 px-2 py-1.5 rounded-md transition-colors"
                  >
                    {isEstimatingVO2 === index ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    {isEstimatingVO2 === index ? 'Estimando VO2 Max...' : 'Estimar VO2 Max (IA)'}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold">Data</label>
                    <input type="date" value={test.date} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-2 py-2 text-white text-xs outline-none focus:border-emerald-500" onChange={e => {
                      const tests = [...formData.cooper_tests];
                      tests[index].date = e.target.value;
                      setFormData({...formData, cooper_tests: tests});
                    }} />
                    <p className="text-[9px] text-zinc-600 italic leading-tight">Data da realização do teste de 12 minutos.</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold">Distância (m)</label>
                    <input type="number" placeholder="Distância (m)" value={test.distance_meters} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-2 py-2 text-white text-xs outline-none focus:border-emerald-500" onChange={e => {
                      const tests = [...formData.cooper_tests];
                      tests[index].distance_meters = parseInt(e.target.value);
                      setFormData({...formData, cooper_tests: tests});
                    }} />
                    <p className="text-[9px] text-zinc-600 italic leading-tight">Distância total percorrida em metros durante os 12 minutos.</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold">VO2 Max Estimado</label>
                    <input type="number" placeholder="VO2 Max" value={test.vo2_max_estimated} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-2 py-2 text-white text-xs outline-none focus:border-emerald-500" onChange={e => {
                      const tests = [...formData.cooper_tests];
                      tests[index].vo2_max_estimated = parseInt(e.target.value);
                      setFormData({...formData, cooper_tests: tests});
                    }} />
                    <p className="text-[9px] text-zinc-600 italic leading-tight">Volume máximo de oxigênio (ml/kg/min) estimado pelo teste.</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold">RPE (Percepção de Esforço)</label>
                    <input type="number" placeholder="RPE" value={test.rpe_perceived} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-2 py-2 text-white text-xs outline-none focus:border-emerald-500" onChange={e => {
                      const tests = [...formData.cooper_tests];
                      tests[index].rpe_perceived = parseInt(e.target.value);
                      setFormData({...formData, cooper_tests: tests});
                    }} />
                    <p className="text-[9px] text-zinc-600 italic leading-tight">Índice de percepção de esforço (Borg) de 0 a 10 ao final do teste.</p>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => {
              const newTest = { date: new Date().toISOString().split('T')[0], distance_meters: 0, vo2_max_estimated: 0, rpe_perceived: 0 };
              setFormData({ ...formData, cooper_tests: [...(formData.cooper_tests || []), newTest] });
            }} className="text-emerald-500 text-xs font-bold hover:text-emerald-400 transition-colors">+ Adicionar Teste de Cooper</button>
          </div>

          <div className="space-y-4 pt-4">
            <label className="text-xs font-bold text-zinc-400">Histórico de Calorimetria</label>
            {formData.calorimetry_history?.map((cal: any, index: number) => (
              <div key={index} className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 space-y-4">
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => estimateCalorimetry(index)}
                    disabled={isEstimatingCal === index || !formData.athlete_id}
                    className="text-[10px] text-emerald-500 hover:text-emerald-400 font-bold flex items-center gap-1 disabled:opacity-50 bg-emerald-500/10 px-2 py-1.5 rounded-md transition-colors"
                  >
                    {isEstimatingCal === index ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    {isEstimatingCal === index ? 'Estimando Calorimetria...' : 'Preencher Calorimetria com IA'}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold">Data</label>
                    <input type="date" value={cal.date} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-2 py-2 text-white text-xs outline-none focus:border-emerald-500" onChange={e => {
                      const cals = [...formData.calorimetry_history];
                      cals[index].date = e.target.value;
                      setFormData({...formData, calorimetry_history: cals});
                    }} />
                    <p className="text-[9px] text-zinc-600 italic leading-tight">Data da avaliação calorimétrica.</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold">RMR (Metabolismo Basal)</label>
                    <input type="number" placeholder="RMR" value={cal.resting_metabolic_rate} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-2 py-2 text-white text-xs outline-none focus:border-emerald-500" onChange={e => {
                      const cals = [...formData.calorimetry_history];
                      cals[index].resting_metabolic_rate = parseInt(e.target.value);
                      setFormData({...formData, calorimetry_history: cals});
                    }} />
                    <p className="text-[9px] text-zinc-600 italic leading-tight">Taxa Metabólica de Repouso (kcal/dia) - gasto calórico basal.</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold">AMR (Metabolismo Ativo)</label>
                    <input type="number" placeholder="AMR" value={cal.active_metabolic_rate} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-2 py-2 text-white text-xs outline-none focus:border-emerald-500" onChange={e => {
                      const cals = [...formData.calorimetry_history];
                      cals[index].active_metabolic_rate = parseInt(e.target.value);
                      setFormData({...formData, calorimetry_history: cals});
                    }} />
                    <p className="text-[9px] text-zinc-600 italic leading-tight">Taxa Metabólica Ativa (kcal/dia) - gasto calórico com atividades.</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold">TDEE (Gasto Total)</label>
                    <input type="number" placeholder="TDEE" value={cal.tdee_estimated} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-2 py-2 text-white text-xs outline-none focus:border-emerald-500" onChange={e => {
                      const cals = [...formData.calorimetry_history];
                      cals[index].tdee_estimated = parseInt(e.target.value);
                      setFormData({...formData, calorimetry_history: cals});
                    }} />
                    <p className="text-[9px] text-zinc-600 italic leading-tight">Gasto Energético Diário Total (kcal/dia) estimado.</p>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => {
              const newCal = { date: new Date().toISOString().split('T')[0], resting_metabolic_rate: 0, active_metabolic_rate: 0, tdee_estimated: 0 };
              setFormData({ ...formData, calorimetry_history: [...(formData.calorimetry_history || []), newCal] });
            }} className="text-emerald-500 text-xs font-bold hover:text-emerald-400 transition-colors">+ Adicionar Calorimetria</button>
          </div>
        </div>
      </div>

      <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 mt-6">
        Salvar Métricas de Saúde
      </button>
    </form>
  );
};

const DisciplineForm = ({ athletes, onSuccess, editingMetric }: { athletes: Athlete[], onSuccess: () => void, editingMetric?: any }) => {
  const [formData, setFormData] = useState(() => {
    const defaults = { 
      athlete_id: '', 
      attendance_score: 100,
      punctuality_score: 100,
      diet_adherence: 100,
      sleep_quality: 100,
      date: new Date().toISOString().split('T')[0]
    };
    if (editingMetric) {
      const { id, athleteName, athleteScore, athleteId, average_score, ...rest } = editingMetric;
      return { ...defaults, ...rest, athlete_id: athleteId, date: editingMetric.date ? editingMetric.date.split('T')[0] : defaults.date };
    }
    return defaults;
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.athlete_id) return;

    try {
      const athlete = athletes.find(a => a.id === formData.athlete_id);
      
      // Calculate average discipline score
      const disciplineAvg = Math.round(
        (formData.attendance_score + 
         formData.punctuality_score + 
         formData.diet_adherence + 
         formData.sleep_quality) / 4
      );

      // Calculate new total PAC score and classification
      const updatedAthlete = athlete ? {
        ...athlete,
        latest_discipline_score: disciplineAvg
      } : null;
      
      const pacMetrics = updatedAthlete ? calculatePACScore(updatedAthlete) : { score: 0, classification: 'Base PAC' };

      const batch = writeBatch(db);
      const athleteRef = doc(db, 'athletes', formData.athlete_id);
      
      const disciplineRef = editingMetric 
        ? doc(db, `athletes/${formData.athlete_id}/discipline_logs`, editingMetric.id)
        : doc(collection(db, `athletes/${formData.athlete_id}/discipline_logs`));
      
      const evalData = {
        ...formData,
        average_score: disciplineAvg,
        date: editingMetric && editingMetric.date.startsWith(formData.date) ? editingMetric.date : new Date(`${formData.date}T12:00:00Z`).toISOString()
      };

      if (editingMetric) {
        batch.update(disciplineRef, evalData);
      } else {
        batch.set(disciplineRef, evalData);
      }

      batch.update(athleteRef, { 
        score: pacMetrics.score,
        classification: pacMetrics.classification,
        latest_discipline_score: disciplineAvg
      });

      await batch.commit();
      onSuccess();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `athletes/${formData.athlete_id}/discipline_logs`);
    }
  };

  const metrics = [
    { key: 'attendance_score', label: 'Frequência', desc: 'Presença nos treinos e compromissos.' },
    { key: 'punctuality_score', label: 'Pontualidade', desc: 'Chegada no horário e prontidão.' },
    { key: 'diet_adherence', label: 'Adesão à Dieta', desc: 'Compromisso com o plano nutricional.' },
    { key: 'sleep_quality', label: 'Qualidade do Sono', desc: 'Recuperação e higiene do sono.' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SearchableAthleteSelect 
        athletes={athletes}
        selectedId={formData.athlete_id}
        onSelect={(id) => setFormData({ ...formData, athlete_id: id })}
        label="Atleta"
      />
      <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Data do Registro</label>
        <input 
          type="date" 
          value={formData.date}
          max={new Date().toISOString().split('T')[0]}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
          onChange={e => setFormData({...formData, date: e.target.value})} 
          required
        />
      </div>

      <div className="space-y-8">
        {metrics.map((metric) => (
          <div key={metric.key} className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <label className="text-xs font-black text-white uppercase tracking-widest">{metric.label}</label>
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">{metric.desc}</p>
              </div>
              <span className="text-emerald-500 font-black text-sm">{(formData as any)[metric.key]}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={(formData as any)[metric.key]}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              onChange={e => setFormData({...formData, [metric.key]: parseInt(e.target.value)})}
            />
          </div>
        ))}
      </div>

      <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
        Salvar Avaliação de Disciplina
      </button>
    </form>
  );
};

const MeritDemeritForm = ({ athletes, onSuccess, editingMetric }: { athletes: Athlete[], onSuccess: () => void, editingMetric?: any }) => {
  const [formData, setFormData] = useState(() => {
    const defaults = { 
      athlete_id: '', 
      type: 'Mérito' as 'Mérito' | 'Demérito',
      category: 'Comportamento',
      description: '',
      points: 5,
      date: new Date().toISOString().split('T')[0]
    };
    if (editingMetric) {
      const { id, athleteName, athleteScore, athleteId, ...rest } = editingMetric;
      return { ...defaults, ...rest, athlete_id: athleteId, date: editingMetric.date ? editingMetric.date.split('T')[0] : defaults.date };
    }
    return defaults;
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.athlete_id || !formData.description) return;

    try {
      const athlete = athletes.find(a => a.id === formData.athlete_id);
      const batch = writeBatch(db);
      const athleteRef = doc(db, 'athletes', formData.athlete_id);
      
      const disciplineRef = editingMetric 
        ? doc(db, `athletes/${formData.athlete_id}/discipline_logs`, editingMetric.id)
        : doc(collection(db, `athletes/${formData.athlete_id}/discipline_logs`));
      
      const evalData = {
        ...formData,
        date: editingMetric && editingMetric.date.startsWith(formData.date) ? editingMetric.date : new Date(`${formData.date}T12:00:00Z`).toISOString()
      };

      if (editingMetric) {
        batch.update(disciplineRef, evalData);
      } else {
        batch.set(disciplineRef, evalData);
        
        const pointsImpact = formData.type === 'Mérito' ? formData.points : -formData.points;
        const newMeritPoints = (athlete?.merit_points || 0) + pointsImpact;

        // Calculate new total PAC score and classification
        const updatedAthlete = athlete ? {
          ...athlete,
          merit_points: newMeritPoints
        } : null;
        
        const pacMetrics = updatedAthlete ? calculatePACScore(updatedAthlete) : { score: 0, classification: 'Base PAC' };

        batch.update(athleteRef, { 
          score: pacMetrics.score,
          classification: pacMetrics.classification,
          merit_points: newMeritPoints
        });

        const notificationRef = doc(collection(db, 'notifications'));
        batch.set(notificationRef, {
          type: 'NOTIFICATION',
          title: `Novo Registro de ${formData.type}`,
          message: `${formData.type} registrado para ${athlete?.name}: ${formData.description} (${pointsImpact > 0 ? '+' : ''}${pointsImpact} pts)`,
          read: false,
          createdAt: Timestamp.now()
        });
      }

      await batch.commit();
      onSuccess();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `athletes/${formData.athlete_id}/discipline_logs`);
    }
  };

  const categories = [
    'Comportamento',
    'Higiene/Limpeza',
    'Auxílio a Colegas',
    'Respeito à Hierarquia',
    'Manutenção do CT',
    'Outros'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SearchableAthleteSelect 
        athletes={athletes}
        selectedId={formData.athlete_id}
        onSelect={(id) => setFormData({ ...formData, athlete_id: id })}
        label="Atleta"
      />
      <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Data do Registro</label>
        <input 
          type="date" 
          value={formData.date}
          max={new Date().toISOString().split('T')[0]}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
          onChange={e => setFormData({...formData, date: e.target.value})} 
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setFormData({...formData, type: 'Mérito', points: 5})}
          className={cn(
            "py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all border",
            formData.type === 'Mérito' 
              ? "bg-emerald-500/20 border-emerald-500 text-emerald-500" 
              : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
          )}
        >
          Mérito (+)
        </button>
        <button
          type="button"
          onClick={() => setFormData({...formData, type: 'Demérito', points: 5})}
          className={cn(
            "py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all border",
            formData.type === 'Demérito' 
              ? "bg-rose-500/20 border-rose-500 text-rose-500" 
              : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
          )}
        >
          Demérito (-)
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Categoria</label>
          <select 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Pontuação PAC</label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={formData.points}
              className={cn(
                "flex-1 h-1.5 rounded-lg appearance-none cursor-pointer",
                formData.type === 'Mérito' ? "bg-emerald-500/20 accent-emerald-500" : "bg-rose-500/20 accent-rose-500"
              )}
              onChange={e => setFormData({...formData, points: parseInt(e.target.value)})}
            />
            <span className={cn(
              "text-sm font-black w-12 text-center",
              formData.type === 'Mérito' ? "text-emerald-500" : "text-rose-500"
            )}>
              {formData.type === 'Mérito' ? '+' : '-'}{formData.points}
            </span>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Descrição do Evento</label>
          <textarea 
            required
            placeholder="Descreva o motivo deste registro..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 min-h-[100px] resize-none"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>
      </div>

      <button 
        type="submit" 
        className={cn(
          "w-full text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg",
          formData.type === 'Mérito' 
            ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" 
            : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
        )}
      >
        Confirmar {formData.type}
      </button>
    </form>
  );
};

const DeveloperPanel = ({ 
  user, 
  setActiveTab, 
  setActiveCategory, 
  setIsModalOpen 
}: { 
  user: User | null,
  setActiveTab: (tab: string) => void,
  setActiveCategory: (cat: string) => void,
  setIsModalOpen: (open: boolean) => void
}) => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('athlete');
  const [isRegistering, setIsRegistering] = useState(false);

  const handlePreRegister = async () => {
    if (!newEmail.trim()) return;
    setIsRegistering(true);
    try {
      const email = newEmail.trim().toLowerCase();
      
      // Add to whitelist
      await setDoc(doc(db, 'whitelist', email), {
        role: newRole,
        added_at: new Date().toISOString(),
        added_by: user?.id
      });

      setNewEmail('');
      alert('E-mail pré-cadastrado na lista de permissão!');
    } catch (error) {
      console.error('Pre-register error:', error);
      alert('Erro ao pré-cadastrar e-mail.');
    } finally {
      setIsRegistering(false);
    }
  };

  const [deleteEmail, setDeleteEmail] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [whitelist, setWhitelist] = useState<any[]>([]);
  const [isLoadingWhitelist, setIsLoadingWhitelist] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        setAllUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    const fetchWhitelist = async () => {
      setIsLoadingWhitelist(true);
      try {
        const snapshot = await getDocs(collection(db, 'whitelist'));
        setWhitelist(snapshot.docs.map(doc => ({ email: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching whitelist:', error);
      } finally {
        setIsLoadingWhitelist(false);
      }
    };

    fetchUsers();
    fetchWhitelist();
  }, []);

  const handleDeleteUser = async () => {
    if (!deleteEmail) return;
    if (!confirm(`Tem certeza que deseja deletar permanentemente o usuário ${deleteEmail}? Esta ação não pode ser desfeita.`)) return;
    
    setIsDeleting(true);
    try {
      // Find user by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', deleteEmail));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        alert('Usuário não encontrado.');
        setIsDeleting(false);
        return;
      }
      
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // Also remove from whitelist if present
      batch.delete(doc(db, 'whitelist', deleteEmail.toLowerCase()));
      
      await batch.commit();
      alert('Usuário e registro na whitelist deletados com sucesso.');
      setDeleteEmail('');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Erro ao deletar usuário.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    setBackupStatus('Iniciando backup...');
    try {
      const collectionsToBackup = [
        'users', 'whitelist', 'academies', 'athletes', 'checkins', 'posts', 
        'alerts', 'notifications', 'challenges', 'missions', 
        'documents', 'media', 'plans', 'graduation_config'
      ];

      const backupData: any = {};

      for (const colName of collectionsToBackup) {
        try {
          setBackupStatus(`Coletando ${colName}...`);
          const snapshot = await getDocs(collection(db, colName));
          backupData[colName] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Handle subcollections for athletes
          if (colName === 'athletes') {
            for (const athleteDoc of snapshot.docs) {
              const subcols = [
                'physical_evaluations', 'psychological_evaluations', 'technical_evaluations',
                'health_logs', 'discipline_logs', 'training_logs', 'competitions',
                'nutrition_plans', 'meal_logs', 'water_logs', 'signed_documents'
              ];
              backupData[`athletes/${athleteDoc.id}`] = {};
              for (const sub of subcols) {
                const subSnap = await getDocs(collection(db, `athletes/${athleteDoc.id}/${sub}`));
                backupData[`athletes/${athleteDoc.id}`][sub] = subSnap.docs.map(d => ({ id: d.id, ...d.data() }));
              }
            }
          }

          // Handle subcollections for academies
          if (colName === 'academies') {
            for (const academyDoc of snapshot.docs) {
              const subcols = ['units', 'schedules'];
              backupData[`academies/${academyDoc.id}`] = {};
              for (const sub of subcols) {
                const subSnap = await getDocs(collection(db, `academies/${academyDoc.id}/${sub}`));
                backupData[`academies/${academyDoc.id}`][sub] = subSnap.docs.map(d => ({ id: d.id, ...d.data() }));
              }
            }
          }
        } catch (colError) {
          console.error(`Error backing up collection ${colName}:`, colError);
          // Continue with other collections but log the error
        }
      }

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PAC_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setBackupStatus('Backup concluído com sucesso!');
      setTimeout(() => setBackupStatus(null), 3000);
    } catch (error) {
      console.error('Backup error:', error);
      setBackupStatus('Erro ao realizar backup.');
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl">
        <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
          <Shield className="w-6 h-6 text-rose-500" />
          PAINEL DO DESENVOLVEDOR
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700 hover:border-rose-500/30 transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                <Database size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">Backup do Sistema</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Exportar todos os dados</p>
              </div>
            </div>
            <button
              onClick={handleBackup}
              disabled={isBackingUp}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isBackingUp ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
              {isBackingUp ? 'PROCESSANDO...' : 'BAIXAR BACKUP COMPLETO'}
            </button>
            {backupStatus && (
              <p className="mt-3 text-[10px] text-rose-400 font-bold text-center animate-pulse">{backupStatus}</p>
            )}
          </div>

          <div className="p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700 hover:border-emerald-500/30 transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">Gestão de Academias</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Controle total de registros</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Como desenvolvedor, você pode criar, editar ou excluir qualquer academia e seus dados associados.
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setActiveCategory('management');
                  setActiveTab('academies');
                }}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-bold py-2 rounded-lg transition-all"
              >
                LISTAR TODAS
              </button>
              <button 
                onClick={() => {
                  setActiveTab('academies');
                  setIsModalOpen(true);
                }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg transition-all"
              >
                NOVA ACADEMIA
              </button>
            </div>
          </div>

          <div className="p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700 hover:border-amber-500/30 transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                <UserPlus size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">Pré-cadastro de Usuários</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Liberar acesso por e-mail</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Adicione e-mails à lista de permissão para que novos usuários possam acessar o sistema.
            </p>
            <div className="space-y-3">
              <input 
                type="email" 
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-amber-500"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-amber-500"
              >
                <option value="athlete">Atleta</option>
                <option value="professor">Professor</option>
                <option value="academy">Academia</option>
              </select>
              <button 
                onClick={handlePreRegister}
                disabled={isRegistering || !newEmail}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isRegistering ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                {isRegistering ? 'CADASTRANDO...' : 'ADICIONAR E-MAIL'}
              </button>
            </div>
          </div>

          <div className="p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700 hover:border-rose-500/30 transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">Exclusão Permanente</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Remover Usuário e Acesso</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Remova permanentemente um usuário do sistema e da lista de acesso (whitelist).
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="E-mail do usuário para deletar"
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-rose-500 transition-all"
              />
              <button 
                onClick={handleDeleteUser}
                disabled={isDeleting || !deleteEmail}
                className="w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-500 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-rose-500/30 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                {isDeleting ? 'DELETANDO...' : 'DELETAR USUÁRIO'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Usuários Cadastrados</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Gestão de acesso e perfis</p>
                </div>
              </div>
              {isLoadingUsers && <Loader2 className="animate-spin text-emerald-500" size={20} />}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="py-4 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nome</th>
                    <th className="py-4 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.length > 0 ? (
                    allUsers.map(u => (
                      <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="text-sm text-white font-medium">{u.name}</div>
                          <div className="text-[10px] text-zinc-500">{u.email}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={cn(
                            "px-2 py-0.5 text-[10px] font-bold rounded-full uppercase border",
                            u.role === 'developer' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                            u.role === 'academy' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                            u.role === 'professor' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                            "bg-zinc-800 text-zinc-400 border-zinc-700"
                          )}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-zinc-600 text-xs italic">Nenhum usuário encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                  <ClipboardList size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Lista de Permissão (Whitelist)</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">E-mails autorizados</p>
                </div>
              </div>
              {isLoadingWhitelist && <Loader2 className="animate-spin text-amber-500" size={20} />}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="py-4 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">E-mail</th>
                    <th className="py-4 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {whitelist.length > 0 ? (
                    whitelist.map(w => (
                      <tr key={w.email} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                        <td className="py-4 px-4 text-sm text-white font-medium">{w.email}</td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded-full uppercase border border-zinc-700">
                            {w.role}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-zinc-600 text-xs italic">Whitelist vazia.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GlobalAuditView = () => {
  const [auditData, setAuditData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/audit');
      if (!response.ok) throw new Error('Falha ao realizar auditoria');
      const data = await response.json();
      setAuditData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white mb-1">Auditoria Global de Dados</h4>
          <p className="text-xs text-zinc-500">Verificação de integridade, orfandade e fidelidade de métricas em todo o sistema.</p>
        </div>
        <button 
          onClick={runAudit}
          disabled={isLoading}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
        >
          {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
          {isLoading ? 'Auditando...' : 'Executar Auditoria Completa'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-500">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {auditData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Orphaned Records */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-amber-500">
              <AlertTriangle size={18} />
              <h5 className="text-sm font-bold uppercase tracking-wider">Registros Órfãos</h5>
            </div>
            <div className="space-y-3">
              {Object.entries(auditData.orphans).map(([key, value]: [string, any]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400 capitalize">{key}</span>
                  <span className={cn("text-xs font-bold", value > 0 ? "text-rose-500" : "text-emerald-500")}>
                    {value} {value === 1 ? 'item' : 'itens'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Integrity Checks */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-blue-500">
              <CheckCircle size={18} />
              <h5 className="text-sm font-bold uppercase tracking-wider">Integridade de Usuários</h5>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Atletas sem Usuário</span>
                <span className={cn("text-xs font-bold", auditData.integrity.athletesWithoutUsers > 0 ? "text-rose-500" : "text-emerald-500")}>
                  {auditData.integrity.athletesWithoutUsers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Usuários sem Atleta</span>
                <span className={cn("text-xs font-bold", auditData.integrity.usersWithoutAthletes > 0 ? "text-rose-500" : "text-emerald-500")}>
                  {auditData.integrity.usersWithoutAthletes}
                </span>
              </div>
            </div>
          </div>

          {/* Global Stats */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-emerald-500">
              <BarChart3 size={18} />
              <h5 className="text-sm font-bold uppercase tracking-wider">Estatísticas Globais</h5>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Total de Atletas</span>
                <span className="text-xs font-bold text-white">{auditData.stats.totalAthletes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Total de Avaliações</span>
                <span className="text-xs font-bold text-white">{auditData.stats.totalEvaluations}</span>
              </div>
            </div>
          </div>

          {/* Score Faithfulness */}
          <div className="md:col-span-3 bg-zinc-800/50 border border-zinc-700 rounded-xl p-5">
            <div className="flex items-center gap-2 text-purple-500 mb-4">
              <Target size={18} />
              <h5 className="text-sm font-bold uppercase tracking-wider">Fidelidade de Score (Top 10)</h5>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-700">
                    <th className="pb-2 font-bold uppercase">Atleta</th>
                    <th className="pb-2 font-bold uppercase">Score Atual</th>
                    <th className="pb-2 font-bold uppercase">Mínimo Esperado</th>
                    <th className="pb-2 font-bold uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700/50">
                  {auditData.integrity.scoreChecks.map((check: any) => (
                    <tr key={check.id} className="hover:bg-zinc-700/20 transition-colors">
                      <td className="py-3 font-bold text-white">{check.name}</td>
                      <td className="py-3 text-zinc-300">{check.currentScore}</td>
                      <td className="py-3 text-zinc-300">{check.calculatedPoints}</td>
                      <td className="py-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full font-bold uppercase text-[9px]",
                          check.isFaithful ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                        )}>
                          {check.isFaithful ? 'Fiel' : 'Inconsistente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsView = ({ 
  user, 
  currentRole,
  setActiveTab, 
  setActiveCategory, 
  setIsModalOpen 
}: { 
  user: User | null,
  currentRole: string,
  setActiveTab: (tab: string) => void,
  setActiveCategory: (cat: string) => void,
  setIsModalOpen: (open: boolean) => void
}) => {
  const [isFixing, setIsFixing] = useState(false);
  const [fixStatus, setFixStatus] = useState<string | null>(null);
  const [academy, setAcademy] = useState<Academy | null>(null);
  const [tvScrollSpeed, setTvScrollSpeed] = useState<number>(15);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);

  useEffect(() => {
    if (user?.academy_id) {
      const fetchAcademy = async () => {
        const docSnap = await getDoc(doc(db, 'academies', user.academy_id));
        if (docSnap.exists()) {
          const data = docSnap.data() as Academy;
          setAcademy(data);
          if (data.tv_scroll_speed) setTvScrollSpeed(data.tv_scroll_speed);
          if (data.tv_media_ids) setSelectedMediaIds(data.tv_media_ids);
        }
      };
      
      const fetchMedia = async () => {
        const q = query(collection(db, 'media'), where('academy_id', '==', user.academy_id));
        const snapshot = await getDocs(q);
        setMediaList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Media)).filter(m => m.type === 'video'));
      };
      
      fetchAcademy();
      fetchMedia();
    }
  }, [user]);

  const handleToggleMedia = (id: string) => {
    setSelectedMediaIds(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const handleSaveSettings = async () => {
    if (!user?.academy_id) return;
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await updateDoc(doc(db, 'academies', user.academy_id), {
        tv_scroll_speed: tvScrollSpeed,
        tv_media_ids: selectedMediaIds
      });
      setSaveMessage({ text: 'Configurações salvas com sucesso!', type: 'success' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage({ text: 'Erro ao salvar configurações.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFixData = async () => {
    if (!user || user.role !== 'developer') return;
    setIsFixing(true);
    setFixStatus('Iniciando diagnóstico...');
    try {
      const collections = ['academies', 'plans', 'athletes', 'media'];
      let fixedCount = 0;
      
      for (const colName of collections) {
        setFixStatus(`Verificando ${colName}...`);
        const snapshot = await getDocs(collection(db, colName));
        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          if (!data.owner_id) {
            await updateDoc(docSnap.ref, { 
              owner_id: user.id,
              academy_id: user.academy_id || data.academy_id || ''
            });
            fixedCount++;
          }
        }
      }
      
      setFixStatus(`Sucesso! ${fixedCount} registros vinculados ao seu perfil.`);
      setTimeout(() => setFixStatus(null), 5000);
    } catch (err) {
      console.error('Error fixing data:', err);
      setFixStatus('Erro ao processar dados.');
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="space-y-6">
      {currentRole === 'developer' && (
        <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Shield size={20} className="text-amber-500" />
            Ferramentas de Desenvolvedor
          </h3>
          <p className="text-sm text-zinc-400 mb-6">Utilize estas ferramentas para garantir a integridade e persistência dos seus dados.</p>
          
          <div className="space-y-4">
            <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
              <h4 className="text-sm font-bold text-white mb-2">Vincular Dados Órfãos</h4>
              <p className="text-xs text-zinc-500 mb-4">Seus dados antigos podem estar sem um "dono" definido. Clique abaixo para vincular todos os registros sem proprietário ao seu perfil atual.</p>
              <button 
                onClick={handleFixData}
                disabled={isFixing}
                className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
              >
                {isFixing ? <RefreshCw size={16} className="animate-spin" /> : <Database size={16} />}
                {isFixing ? 'Processando...' : 'Corrigir Persistência de Dados'}
              </button>
              {fixStatus && <p className="mt-2 text-xs text-emerald-500 font-medium">{fixStatus}</p>}
            </div>

            <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
              <GlobalAuditView />
            </div>
          </div>
        </div>
      )}

      <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl mb-8">
        <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
          <Settings className="w-6 h-6 text-emerald-500" />
          CONFIGURAÇÕES DO PERFIL
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 text-2xl font-black">
              {user?.name?.[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-white font-bold">{user?.name}</h3>
              <p className="text-zinc-500 text-xs">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-bold rounded-full uppercase tracking-widest border border-emerald-500/20">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {currentRole === 'developer' && (
        <DeveloperPanel 
          user={user} 
          setActiveTab={setActiveTab}
          setActiveCategory={setActiveCategory}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-white mb-6">Configurações do Sistema</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Nome da Instituição</label>
              <input type="text" defaultValue="PAC - Programa Atleta Campeão" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email de Suporte</label>
              <input type="email" defaultValue="suporte@pac.com.br" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div className="pt-6 border-t border-zinc-800">
            <h4 className="text-sm font-bold text-white mb-4">Notificações</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 border-2 border-zinc-700 rounded bg-zinc-800 group-hover:border-emerald-500 transition-colors flex items-center justify-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-sm" />
                </div>
                <span className="text-sm text-zinc-300">Alertas de peso crítico</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 border-2 border-zinc-700 rounded bg-zinc-800 group-hover:border-emerald-500 transition-colors" />
                <span className="text-sm text-zinc-300">Relatórios semanais por email</span>
              </label>
            </div>
          </div>
          <div className="pt-6 border-t border-zinc-800">
            <h4 className="text-sm font-bold text-white mb-4">Configurações do Modo TV</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Velocidade de Rolagem da Grade (segundos por aula)</label>
                <input 
                  type="number" 
                  value={tvScrollSpeed} 
                  onChange={(e) => setTvScrollSpeed(Number(e.target.value))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500" 
                  min="5"
                  max="60"
                />
                <p className="text-xs text-zinc-500">Tempo em segundos que cada aula leva para rolar na tela.</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Vídeos para o Modo TV</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto custom-scrollbar p-2 border border-zinc-800 rounded-xl bg-zinc-900/50">
                  {mediaList.length === 0 ? (
                    <p className="text-sm text-zinc-500 col-span-full text-center py-4">Nenhum vídeo encontrado na biblioteca.</p>
                  ) : (
                    mediaList.map(media => (
                      <div 
                        key={media.id} 
                        onClick={() => handleToggleMedia(media.id)}
                        className={cn(
                        "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                        selectedMediaIds.includes(media.id) ? "bg-emerald-500/10 border-emerald-500/50" : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600"
                      )}>
                        <div className={cn(
                          "w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5",
                          selectedMediaIds.includes(media.id) ? "bg-emerald-500 border-emerald-500" : "bg-zinc-900 border-zinc-600"
                        )}>
                          {selectedMediaIds.includes(media.id) && <Check size={14} className="text-white" />}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-white truncate">{media.title}</p>
                          <p className="text-xs text-zinc-500 truncate">{media.description || 'Sem descrição'}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-xs text-zinc-500">Selecione os vídeos da Biblioteca de Mídia que serão exibidos no Modo TV.</p>
              </div>
            </div>
          </div>
          <div className="pt-6 flex items-center gap-4">
            <button 
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            {saveMessage && (
              <span className={cn(
                "text-sm font-bold",
                saveMessage.type === 'success' ? "text-emerald-500" : "text-red-500"
              )}>
                {saveMessage.text}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MeritocracyView = ({ athlete }: { athlete: Athlete }) => {
  const metrics = calculatePACScore(athlete);
  
  const technical = (
    (athlete.technical_history?.raspagens_efficiency || 0) +
    (athlete.technical_history?.passagens_efficiency || 0) +
    (athlete.technical_history?.finalizacoes_efficiency || 0) +
    (athlete.technical_history?.quedas_efficiency || 0) +
    (athlete.technical_history?.defesa_efficiency || 0)
  ) / 5;

  const physical = athlete.latest_physical_power || 0;
  const psychological = (athlete.latest_psych_score || 0) / 2;
  const discipline = 80;
  const results = (athlete.medals_count?.gold || 0) * 25 + 
                  (athlete.medals_count?.silver || 0) * 15 + 
                  (athlete.medals_count?.bronze || 0) * 10;

  const pillars = [
    { label: 'Técnico', value: technical, max: 100, color: 'bg-blue-500' },
    { label: 'Físico (TAF)', value: physical, max: 100, color: 'bg-emerald-500' },
    { label: 'Mental', value: psychological, max: 100, color: 'bg-purple-500' },
    { label: 'Disciplina', value: discipline, max: 100, color: 'bg-amber-500' },
    { label: 'Resultados', value: results, max: 100, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Trophy size={16} className="text-emerald-500" />
            Composição do Score PAC
          </h3>
          
          <div className="space-y-4">
            {pillars.map((pillar) => (
              <div key={pillar.label} className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-zinc-500">{pillar.label}</span>
                  <span className="text-white">{Math.round(pillar.value)} / {pillar.max}</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(pillar.value / pillar.max) * 100}%` }}
                    className={`h-full ${pillar.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-zinc-800 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Consolidado</p>
              <p className="text-4xl font-black text-white">{metrics.score}<span className="text-zinc-700 text-lg">/500</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Classificação</p>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-black uppercase tracking-widest">
                {metrics.classification}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin-slow" />
            <Trophy size={40} className="text-emerald-500" />
          </div>
          <div>
            <h4 className="text-lg font-black text-white uppercase tracking-tighter">Algoritmo de Meritocracia</h4>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px] mx-auto mt-2">
              O Score PAC é recalculado em tempo real com base em todas as avaliações e logs de treino.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinanceView = ({ athletes, academies, user }: { athletes: Athlete[], academies: Academy[], user: User }) => {
  const [activeSubTab, setActiveSubTab] = useState<'athletes' | 'academies' | 'vincular'>('athletes');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let q = collection(db, 'plans') as any;
    if (user.role === 'developer') {
      q = collection(db, 'plans');
    } else if (user.role === 'academy') {
      q = query(collection(db, 'plans'), or(where('owner_id', '==', user.id), where('owner_id', '==', 'system')));
    } else if (user.academy_id) {
      q = query(collection(db, 'plans'), or(where('academy_id', '==', user.academy_id), where('owner_id', '==', 'system')));
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPlans(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'plans'));
    return () => unsubscribe();
  }, [user]);

  const frequencies = ['Day Use', 'Semanal', 'Mensal', 'Trimestral', 'Anual'];
  const types = ['Presencial', 'A distância'];

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const planData = {
      name: formData.get('name'),
      type: formData.get('type'),
      frequency: formData.get('frequency'),
      basePrice: Number(formData.get('basePrice')),
      discount: Number(formData.get('discount')) || 0,
      isSocial: formData.get('isSocial') === 'on',
      isScholarship: formData.get('isScholarship') === 'on',
      target: activeSubTab,
      academy_id: user.academy_id || '',
      owner_id: auth.currentUser?.uid,
      updatedAt: Timestamp.now()
    };

    try {
      if (selectedPlan) {
        await updateDoc(doc(db, 'plans', selectedPlan.id), planData);
      } else {
        await addDoc(collection(db, 'plans'), { ...planData, createdAt: Timestamp.now() });
      }
      setShowPlanModal(false);
      setSelectedPlan(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'plans');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 uppercase">
          <DollarSign className="w-8 h-8 text-emerald-500" />
          Gestão Financeira
        </h2>
        
        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveSubTab('athletes')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
              activeSubTab === 'athletes' ? "bg-emerald-500 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Planos Atletas
          </button>
          {user.role === 'developer' && (
            <button 
              onClick={() => setActiveSubTab('academies')}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                activeSubTab === 'academies' ? "bg-emerald-500 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              Planos Academias
            </button>
          )}
          <button 
            onClick={() => setActiveSubTab('vincular')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
              activeSubTab === 'vincular' ? "bg-emerald-500 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Vínculos & Status
          </button>
        </div>
      </div>

      {activeSubTab === 'vincular' ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text"
                placeholder="Buscar atleta ou academia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-800/50">
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nome</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tipo</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Plano</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Valor</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Dia Venc.</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status Pagamento</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Acesso</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {(user.role === 'developer' ? [...athletes, ...academies] : athletes)
                    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item) => {
                      const isAthlete = 'belt' in item;
                      const plan = plans.find(p => p.id === item.plan_id);
                      
                      const handleToggleBlock = async () => {
                        try {
                          const collectionName = isAthlete ? 'athletes' : 'academies';
                          await updateDoc(doc(db, collectionName, item.id), {
                            is_blocked: !item.is_blocked
                          });
                        } catch (error) {
                          handleFirestoreError(error, OperationType.UPDATE, `status/${item.id}`);
                        }
                      };

                      const handleUpdateStatus = async (status: string) => {
                        try {
                          const collectionName = isAthlete ? 'athletes' : 'academies';
                          await updateDoc(doc(db, collectionName, item.id), {
                            payment_status: status
                          });
                        } catch (error) {
                          handleFirestoreError(error, OperationType.UPDATE, `status/${item.id}`);
                        }
                      };

                      return (
                        <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-white text-sm">{item.name}</div>
                            <div className="text-[10px] text-zinc-500 uppercase font-bold">{isAthlete ? 'Atleta' : 'Academia'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest",
                              isAthlete ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                            )}>
                              {isAthlete ? 'Atleta' : 'Academia'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              value={item.plan_id || ''}
                              onChange={(e) => {
                                const collectionName = isAthlete ? 'athletes' : 'academies';
                                updateDoc(doc(db, collectionName, item.id), {
                                  plan_id: e.target.value
                                }).catch(error => handleFirestoreError(error, OperationType.UPDATE, `plan/${item.id}`));
                              }}
                              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-[10px] font-bold text-zinc-300 outline-none focus:border-emerald-500 w-full max-w-[150px]"
                            >
                              <option value="">Sem Plano</option>
                              {plans
                                .filter(p => p.target === (isAthlete ? 'athletes' : 'academies'))
                                .map(p => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                                ))
                              }
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-black text-white">
                              {plan ? `R$ ${((plan.basePrice * (100 - plan.discount)) / 100).toLocaleString('pt-BR')}` : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              value={item.payment_day || 10}
                              onChange={(e) => {
                                const collectionName = isAthlete ? 'athletes' : 'academies';
                                updateDoc(doc(db, collectionName, item.id), {
                                  payment_day: parseInt(e.target.value)
                                }).catch(error => handleFirestoreError(error, OperationType.UPDATE, `payment_day/${item.id}`));
                              }}
                              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-[10px] font-bold text-zinc-300 outline-none focus:border-emerald-500"
                            >
                              {[...Array(31)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              value={item.payment_status || 'pending'}
                              onChange={(e) => handleUpdateStatus(e.target.value)}
                              className={cn(
                                "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-emerald-500",
                                item.payment_status === 'paid' ? "text-emerald-500" : 
                                item.payment_status === 'overdue' ? "text-rose-500" : "text-amber-500"
                              )}
                            >
                              <option value="paid">Pago</option>
                              <option value="pending">Pendente</option>
                              <option value="overdue">Atrasado</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {item.is_blocked ? (
                                <span className="flex items-center gap-1.5 text-rose-500 text-[10px] font-black uppercase tracking-widest">
                                  <Lock size={12} /> Bloqueado
                                </span>
                              ) : (
                                <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                  <Unlock size={12} /> Ativo
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={handleToggleBlock}
                              className={cn(
                                "p-2 rounded-xl transition-all",
                                item.is_blocked 
                                  ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" 
                                  : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                              )}
                              title={item.is_blocked ? "Desbloquear Acesso" : "Bloquear Acesso"}
                            >
                              {item.is_blocked ? <Unlock size={18} /> : <Lock size={18} />}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-6">Resumo Financeiro</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                        <TrendingUp size={20} />
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold">Receita Estimada</div>
                        <div className="text-lg font-black text-white">R$ 45.200</div>
                      </div>
                    </div>
                    <ArrowUpRight size={16} className="text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                        <Users size={20} />
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold">Atletas Ativos</div>
                        <div className="text-lg font-black text-white">{athletes.length}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                        <Award size={20} />
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold">Bolsistas / Social</div>
                        <div className="text-lg font-black text-white">
                          {plans.filter(p => p.isSocial || p.isScholarship).length} Planos
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedPlan(null);
                  setShowPlanModal(true);
                }}
                className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Criar Novo Plano
              </button>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.filter(p => p.target === activeSubTab).map((plan) => (
                  <div 
                    key={plan.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <DollarSign size={80} className="text-emerald-500" />
                    </div>
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">
                          {plan.type} • {plan.frequency}
                        </span>
                        <h4 className="text-lg font-black text-white uppercase tracking-tight">{plan.name}</h4>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setSelectedPlan(plan);
                            setShowPlanModal(true);
                          }}
                          className="p-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                        >
                          <Settings2 size={14} />
                        </button>
                        {(user.role === 'academy' || user.role === 'developer') && (
                          <button 
                            onClick={async () => {
                              if (confirm('Tem certeza que deseja excluir este plano?')) {
                                try {
                                  await deleteDoc(doc(db, 'plans', plan.id));
                                } catch (error) {
                                  handleFirestoreError(error, OperationType.DELETE, `plans/${plan.id}`);
                                }
                              }
                            }}
                            className="p-2 bg-zinc-800 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-end gap-2 mb-6 relative z-10">
                      <span className="text-2xl font-black text-white tracking-tighter">
                        R$ {((plan.basePrice * (100 - plan.discount)) / 100).toLocaleString('pt-BR')}
                      </span>
                      {plan.discount > 0 && (
                        <span className="text-xs text-zinc-500 line-through mb-1">
                          R$ {plan.basePrice.toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 relative z-10">
                      {plan.isSocial && (
                        <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md text-[9px] font-black text-blue-500 uppercase">Projeto Social</span>
                      )}
                      {plan.isScholarship && (
                        <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-md text-[9px] font-black text-purple-500 uppercase">Bolsista {plan.discount}%</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {plans.filter(p => p.target === activeSubTab).length === 0 && (
                <div className="py-20 text-center bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl">
                  <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-700">
                    <Receipt size={32} />
                  </div>
                  <h4 className="text-white font-bold mb-1">Nenhum plano cadastrado</h4>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest">Comece criando um plano para {activeSubTab === 'athletes' ? 'atletas' : 'academias'}</p>
                </div>
              )}
            </div>
          </div>

          <Modal
            isOpen={showPlanModal}
            onClose={() => {
              setShowPlanModal(false);
              setSelectedPlan(null);
            }}
            title={selectedPlan ? 'Editar Plano' : 'Novo Plano'}
            maxWidth="max-w-xl"
          >
            <form onSubmit={handleSavePlan} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full space-y-2">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Nome do Plano</label>
                  <input 
                    name="name"
                    defaultValue={selectedPlan?.name}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500 transition-all"
                    placeholder="Ex: Plano Elite Mensal"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Tipo</label>
                  <select 
                    name="type"
                    defaultValue={selectedPlan?.type || 'Presencial'}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500 transition-all"
                  >
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Frequência</label>
                  <select 
                    name="frequency"
                    defaultValue={selectedPlan?.frequency || 'Mensal'}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500 transition-all"
                  >
                    {frequencies.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Preço Base (R$)</label>
                  <input 
                    name="basePrice"
                    type="number"
                    defaultValue={selectedPlan?.basePrice}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500 transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Desconto (%)</label>
                  <input 
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={selectedPlan?.discount || 0}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500 transition-all"
                    placeholder="0"
                  />
                </div>

                <div className="col-span-full flex items-center gap-6 pt-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      name="isSocial"
                      type="checkbox"
                      defaultChecked={selectedPlan?.isSocial}
                      className="w-5 h-5 rounded-lg bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
                    />
                    <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors uppercase tracking-widest">Projeto Social</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      name="isScholarship"
                      type="checkbox"
                      defaultChecked={selectedPlan?.isScholarship}
                      className="w-5 h-5 rounded-lg bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
                    />
                    <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors uppercase tracking-widest">Bolsista</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button 
                  type="button"
                  onClick={() => {
                    setShowPlanModal(false);
                    setSelectedPlan(null);
                  }}
                  className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                >
                  {selectedPlan ? 'Salvar Alterações' : 'Criar Plano'}
                </button>
              </div>
            </form>
          </Modal>
        </>
      )}
    </div>
  );
};

const RankingView = ({ athletes }: { athletes: Athlete[] }) => {
  const sorted = [...athletes].sort((a, b) => b.score - a.score);
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-wider">
            <th className="px-6 py-4 font-medium">Posição</th>
            <th className="px-6 py-4 font-medium">Atleta</th>
            <th className="px-6 py-4 font-medium">Faixa</th>
            <th className="px-6 py-4 font-medium">Score PAC</th>
            <th className="px-6 py-4 font-medium">Classificação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {sorted.map((athlete, idx) => (
            <tr key={athlete.id} className="hover:bg-zinc-800/30 transition-colors">
              <td className="px-6 py-4">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                  idx === 0 ? "bg-amber-500 text-amber-950" : 
                  idx === 1 ? "bg-zinc-300 text-zinc-900" : 
                  idx === 2 ? "bg-orange-600 text-orange-100" : "bg-zinc-800 text-zinc-400"
                )}>
                  {idx + 1}
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-white">{athlete.name}</td>
              <td className="px-6 py-4">
                <span className="text-xs text-zinc-400">{athlete.belt} ({athlete.stripes} {athlete.stripes === 1 ? 'Grau' : 'Graus'})</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-lg font-black text-emerald-500">{athlete.score}</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">
                  {athlete.classification}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MediaForm = ({ currentUser, onSuccess, onCancel }: { currentUser: User | null; onSuccess: () => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'video' as 'video' | 'pdf',
    thumbnail: '',
    description: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
      
      console.log('File selected:', { 
        name: selectedFile.name, 
        type: selectedFile.type, 
        size: selectedFile.size 
      });

      // Robust type detection based on MIME type and extension
      const isPDF = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
      const isVideo = selectedFile.type.startsWith('video/') || 
                      ['mp4', 'webm', 'ogg', 'mov'].some(ext => selectedFile.name.toLowerCase().endsWith('.' + ext));

      if (isPDF) {
        setFormData(prev => ({ ...prev, type: 'pdf' }));
        console.log('Detected type: PDF');
      } else if (isVideo) {
        setFormData(prev => ({ ...prev, type: 'video' }));
        console.log('Detected type: Video');
      }
      
      // Auto-set title if empty
      if (!formData.title) {
        setFormData(prev => ({ ...prev, title: selectedFile.name.split('.')[0] }));
      }
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting upload process...', { file, formData });
    setIsUploading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Você precisa estar logado para fazer upload.');
      
      // Log user info for debugging
      console.log('Current user:', { uid: user.uid, email: user.email });

      let finalUrl = formData.url;
      let finalType = formData.type;

      // If it's a YouTube link, convert it to embed URL and set type to video
      if (finalUrl && (finalUrl.includes('youtube.com') || finalUrl.includes('youtu.be'))) {
        finalUrl = getYouTubeEmbedUrl(finalUrl);
        finalType = 'video';
      }

      if (file) {
        setUploadProgress(10);
        
        // Limit file size to 100MB
        if (file.size > 100 * 1024 * 1024) {
          throw new Error('O arquivo é muito grande. O limite é 100MB.');
        }

        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const storageRef = ref(storage, `media/${Date.now()}_${sanitizedName}`);
        
        console.log('Attempting upload to:', storageRef.fullPath, 'Type:', finalType);
        setUploadProgress(30);
        
        try {
          const metadata = {
            contentType: file.type || (finalType === 'pdf' ? 'application/pdf' : 'video/mp4')
          };
          
          // Ler o arquivo como Data URL para evitar problemas de CORS/Rede em iframes
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Falha ao ler o arquivo localmente."));
            reader.readAsDataURL(file);
          });
          
          const snapshot = await uploadString(storageRef, dataUrl, 'data_url', metadata);
          console.log('Upload successful, getting download URL...');
          setUploadProgress(70);
          finalUrl = await getDownloadURL(snapshot.ref);
          console.log('Download URL obtained:', finalUrl);
          setUploadProgress(100);
        } catch (storageErr: any) {
          console.error('Storage specific error:', storageErr);
          if (storageErr.code === 'storage/retry-limit-exceeded') {
            throw new Error('RETRY_LIMIT_EXCEEDED');
          }
          throw storageErr;
        }
      }

      if (!finalUrl) {
        throw new Error('Por favor, selecione um arquivo ou insira uma URL.');
      }

      console.log('Saving to Firestore...', { ...formData, url: finalUrl, type: finalType });
      
      await addDoc(collection(db, 'media'), {
        title: formData.title,
        url: finalUrl,
        type: finalType,
        thumbnail: formData.thumbnail || (finalUrl.includes('youtube.com/embed/') ? `https://img.youtube.com/vi/${finalUrl.split('/').pop()}/maxresdefault.jpg` : ''),
        description: formData.description,
        createdAt: Timestamp.now(),
        owner_id: auth.currentUser?.uid,
        academy_id: currentUser?.academy_id
      });
      onSuccess();
    } catch (err: any) {
      console.error('Upload error details:', err);
      let errorMessage = 'Erro ao enviar arquivo. Verifique sua conexão.';
      
      if (err.message === 'RETRY_LIMIT_EXCEEDED' || err.code === 'storage/retry-limit-exceeded') {
        errorMessage = 'O navegador bloqueou o envio direto do arquivo (CORS/Network). Isso é comum em ambientes de teste.';
        setError(errorMessage);
        // Special flag to show the fallback button
        (window as any).showUrlFallback = true;
      } else if (err.code === 'permission-denied') {
        errorMessage = 'Você não tem permissão para salvar arquivos. Verifique se sua conta é de administrador.';
        setError(errorMessage);
      } else if (err.message) {
        errorMessage = err.message;
        setError(errorMessage);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus className="text-emerald-500" />
            Novo Arquivo
          </h2>
          <button onClick={onCancel} className="text-zinc-500 hover:text-white transition-colors" disabled={isUploading}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5 ml-1">Selecionar Arquivo</label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept="video/mp4,application/pdf"
                className="hidden"
                id="media-file-input"
                disabled={isUploading}
              />
              <label 
                htmlFor="media-file-input"
                className="w-full bg-zinc-800 border-2 border-dashed border-zinc-700 hover:border-emerald-500/50 rounded-xl px-4 py-6 text-center cursor-pointer transition-all flex flex-col items-center gap-2"
              >
                {file ? (
                  <div className="flex flex-col items-center gap-2 w-full">
                    <Check className="text-emerald-500" size={24} />
                    <span className="text-white text-sm font-medium truncate max-w-full px-4">{file.name}</span>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="text-red-400 text-[10px] font-bold uppercase hover:text-red-300 transition-colors"
                    >
                      Remover Arquivo
                    </button>
                  </div>
                ) : (
                  <>
                    <Plus className="text-zinc-500" size={24} />
                    <span className="text-zinc-400 text-sm">Clique para selecionar Vídeo ou PDF</span>
                    <span className="text-zinc-600 text-[10px]">Máximo recomendado: 50MB</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="relative flex items-center gap-4 py-2">
            <div className="h-px bg-zinc-800 flex-1" />
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">ou use uma URL (Recomendado se o upload falhar)</span>
            <div className="h-px bg-zinc-800 flex-1" />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5 ml-1">Título</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Ex: Apresentação Institucional"
              disabled={isUploading}
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5 ml-1">URL do Arquivo (YouTube, Drive, etc)</label>
            <input
              id="url-input"
              type="text"
              value={formData.url}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Ex: https://youtube.com/watch?v=..."
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5 ml-1">Tipo</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as 'video' | 'pdf' })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              disabled={isUploading}
            >
              <option value="video">Vídeo (MP4)</option>
              <option value="pdf">Documento PDF</option>
            </select>
          </div>

          {uploadProgress !== null && (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-emerald-500">Enviando...</span>
                <span className="text-white">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <div className="space-y-1">
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Erro no Envio</p>
                  <p className="text-xs text-red-400 leading-tight">{error}</p>
                </div>
              </div>
              {(error.includes('bloqueou') || error.includes('RETRY')) && (
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setError(null);
                    setUploadProgress(null);
                    const urlInput = document.getElementById('url-input');
                    if (urlInput) urlInput.focus();
                  }}
                  className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-[10px] font-bold uppercase rounded-lg border border-emerald-500/20 transition-all"
                >
                  Usar Link Externo (Recomendado)
                </button>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isUploading}
              className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUploading || (!file && !formData.url)}
              className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Enviando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const PresentationsView = ({ user }: { user: User | null }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [viewMode, setViewMode] = useState<'video' | 'pdf' | 'slides'>('slides');
  const [media, setMedia] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<string | null>(null);

  const isCoach = user && ['admin', 'coach', 'trainer', 'psychologist', 'professor', 'academy', 'developer'].includes(user.role);

  useEffect(() => {
    if (!user) return;
    let q = query(collection(db, 'media'), orderBy('title'));
    if (user.role !== 'developer') {
      q = query(collection(db, 'media'), or(where('academy_id', '==', user.academy_id), where('academy_id', '==', '')), orderBy('title'));
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mediaData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Media));
      setMedia(mediaData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'media');
    });
    return () => unsubscribe();
  }, [user]);

  const handleDeleteMedia = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'media', id));
      setMediaToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'media');
    }
  };

  const slides = [
    {
      title: "PAC - PROGRAMA DE FORMAÇÃO DE ATLETA CAMPEÃO",
      subtitle: "O Ecossistema de Alto Rendimento do Jiu-Jitsu",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
          <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20">
            <Trophy size={64} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">PAC</h1>
          <p className="text-xl text-zinc-400 font-medium uppercase">Programa de Formação de Atleta Campeão</p>
          <div className="bg-zinc-800/50 px-6 py-2 rounded-full border border-zinc-700">
            <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase">Manual de Metodologia</span>
          </div>
        </div>
      )
    },
    {
      title: "O DESTINO & A BÚSSOLA",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
          <div className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-8 flex flex-col justify-center space-y-6">
            <h3 className="text-2xl font-bold text-white border-l-4 border-emerald-500 pl-4 uppercase tracking-tighter">O Destino</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase mb-1">Missão</p>
                <p className="text-zinc-300 text-sm">Formar atletas capazes de competir e vencer nos maiores campeonatos do mundo, desenvolvendo excelência física, técnica, mental e comportamental.</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase mb-1">Visão</p>
                <p className="text-zinc-300 text-sm">Construir uma geração disciplinada, resiliente e preparada para o mais absoluto alto rendimento.</p>
              </div>
            </div>
          </div>
          <div className="bg-emerald-500 rounded-2xl p-8 flex flex-col justify-center text-white">
            <h3 className="text-2xl font-bold mb-6 uppercase tracking-tighter">A Bússola</h3>
            <div className="space-y-2 font-bold text-base">
              {[
                "DISCIPLINA", "RESPEITO", "RESPONSABILIDADE", "EXCELÊNCIA", "SUPERAÇÃO"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
                  <span className="w-8 h-8 rounded-full bg-white text-emerald-500 flex items-center justify-center text-sm shrink-0">{i + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "CÓDIGO MENTAL",
      content: (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 border-2 border-dashed border-zinc-700 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-4 border-2 border-emerald-500/30 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-full shadow-2xl text-center">
                <p className="text-[8px] text-zinc-500 font-bold uppercase mb-1">O Motor Interno</p>
                <h4 className="text-base font-black text-white leading-tight">CÓDIGO<br/>MENTAL</h4>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800">
              <h5 className="text-emerald-400 font-bold text-[10px] uppercase mb-2">Conduta</h5>
              <p className="text-[10px] text-zinc-400 leading-relaxed">A Execução Diária. Cumprir horários, nutrição restrita, sono inegociável.</p>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800">
              <h5 className="text-emerald-400 font-bold text-[10px] uppercase mb-2">Identidade</h5>
              <p className="text-[10px] text-zinc-400 leading-relaxed">O Caráter. Disciplina, Responsabilidade, Resiliência, Espírito Competitivo.</p>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800">
              <h5 className="text-emerald-400 font-bold text-[10px] uppercase mb-2">Crenças</h5>
              <p className="text-[10px] text-zinc-400 leading-relaxed">Compromisso, Foco, Controle Emocional, Autoconfiança, Coragem.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "AS 5 DIMENSÕES DO DESEMPENHO",
      content: (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <div className="w-full max-w-sm aspect-square bg-zinc-800/20 rounded-full border border-zinc-800 flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-3/4 border border-emerald-500/10 rounded-full" />
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-center w-28">
              <p className="text-[9px] font-bold text-emerald-500 uppercase">Técnica</p>
            </div>
            <div className="absolute top-1/4 right-0 translate-x-1/2 bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-center w-28">
              <p className="text-[9px] font-bold text-blue-500 uppercase">Física</p>
            </div>
            <div className="absolute bottom-1/4 right-0 translate-x-1/2 bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-center w-28">
              <p className="text-[9px] font-bold text-purple-500 uppercase">Cognitiva</p>
            </div>
            <div className="absolute bottom-1/4 left-0 -translate-x-1/2 bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-center w-28">
              <p className="text-[9px] font-bold text-rose-500 uppercase">Psicológica</p>
            </div>
            <div className="absolute top-1/4 left-0 -translate-x-1/2 bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-center w-28">
              <p className="text-[9px] font-bold text-amber-500 uppercase">Comportamental</p>
            </div>
            <div className="text-center px-10">
              <p className="text-xs text-zinc-400 font-medium italic leading-relaxed">"O atleta campeão é o resultado do desenvolvimento biométrico equilibrado destas 5 dimensões."</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "A PIRÂMIDE DE FORMAÇÃO",
      content: (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="w-full max-w-xl space-y-1">
            <div className="bg-emerald-500 h-12 rounded-t-lg flex items-center justify-center text-white font-black text-lg shadow-lg">NÍVEL 4: ELITE COMPETITIVA</div>
            <div className="bg-zinc-800 h-14 flex items-center justify-center text-zinc-300 font-bold border-x border-zinc-800">NÍVEL 3: ALTO RENDIMENTO</div>
            <div className="bg-zinc-800/60 h-16 flex items-center justify-center text-zinc-400 font-bold border-x border-zinc-800">NÍVEL 2: FORMAÇÃO COMPETITIVA</div>
            <div className="bg-zinc-800/30 h-18 rounded-b-lg flex items-center justify-center text-zinc-500 font-bold border-x border-b border-zinc-800">NÍVEL 1: BASE ESPORTIVA</div>
          </div>
          <div className="flex justify-between w-full max-w-xl text-[8px] text-zinc-500 font-bold uppercase tracking-widest px-2">
            <span>Início</span>
            <span>6 Meses</span>
            <span>2 Anos</span>
            <span>4 Anos</span>
            <span>Pico</span>
          </div>
        </div>
      )
    },
    {
      title: "O ECOSSISTEMA DE ENGENHARIA HUMANA",
      content: (
        <div className="grid grid-cols-2 gap-4 h-full">
          {[
            { title: "Zona 1: Tatame", desc: "Treino técnico e sparring intenso.", staff: "Treinador Principal" },
            { title: "Zona 2: Lab Físico", desc: "Barras, kettlebells e funcional.", staff: "Preparador Físico" },
            { title: "Zona 3: Recuperação", desc: "Liberação miofascial e mobilidade.", staff: "Fisioterapeuta" },
            { title: "Zona 4: Controle", desc: "Análise de dados e nutrição.", staff: "Nutricionista/Psicólogo" }
          ].map((zone, i) => (
            <div key={i} className="bg-zinc-800/30 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <h4 className="text-emerald-500 font-bold text-xs uppercase mb-1">{zone.title}</h4>
                <p className="text-[10px] text-zinc-400">{zone.desc}</p>
              </div>
              <div className="mt-2 pt-2 border-t border-zinc-800">
                <p className="text-[8px] text-zinc-500 font-bold uppercase">Suporte: {zone.staff}</p>
              </div>
            </div>
          ))}
          <div className="col-span-2 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-center">
            <p className="text-[10px] text-emerald-400 italic">"Não é apenas uma academia. É um laboratório multidisciplinar projetado para extrair a máxima performance humana."</p>
          </div>
        </div>
      )
    },
    {
      title: "SISTEMA DE 500 PONTOS",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: 'Técnica', color: 'bg-emerald-500', desc: 'Domínio, adaptação, sparring' },
              { label: 'Físico', color: 'bg-blue-500', desc: 'Resultados diretos do TAF' },
              { label: 'Psicológico', color: 'bg-purple-500', desc: 'Teste de perfil, resiliência' },
              { label: 'Disciplina', color: 'bg-amber-500', desc: 'Presença, pontualidade, dieta' },
              { label: 'Resultados', color: 'bg-orange-500', desc: 'Campeonatos oficiais' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-xl border border-zinc-800">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm", item.color)}>100</div>
                <div>
                  <p className="text-[10px] font-bold text-white uppercase">{item.label}</p>
                  <p className="text-[9px] text-zinc-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h4 className="text-base font-bold text-white text-center">Classificação Geral</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <span className="text-emerald-400 font-bold text-xs">450-500</span>
                <span className="text-white font-bold text-xs">Elite PAC</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-zinc-800 rounded-lg">
                <span className="text-zinc-400 font-bold text-xs">350-449</span>
                <span className="text-white font-bold text-xs">Alto Desempenho</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-zinc-800 rounded-lg">
                <span className="text-zinc-400 font-bold text-xs">250-349</span>
                <span className="text-white font-bold text-xs">Em Desenvolvimento</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-zinc-800 rounded-lg">
                <span className="text-zinc-400 font-bold text-xs">150-249</span>
                <span className="text-white font-bold text-xs">Iniciante</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                <span className="text-rose-400 font-bold text-xs">&lt; 150</span>
                <span className="text-white font-bold text-xs">Risco de Desligamento</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "MATRIZ DE APTIDÃO FÍSICA (TAF)",
      content: (
        <div className="flex flex-col h-full space-y-4">
          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <table className="w-full text-[10px]">
              <thead className="bg-zinc-800 text-zinc-400 uppercase font-bold">
                <tr>
                  <th className="p-3 text-left">Métrica</th>
                  <th className="p-3 text-center">Iniciante</th>
                  <th className="p-3 text-center">Intermed.</th>
                  <th className="p-3 text-center">Avançado</th>
                  <th className="p-3 text-center text-emerald-400">Elite PAC</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300 divide-y divide-zinc-800">
                {[
                  { m: "Barra Fixa", v: ["2", "6", "12", "18+"] },
                  { m: "Flexão 2 min", v: ["15", "30", "50", "75+"] },
                  { m: "Isometria Pegada", v: ["20s", "45s", "75s", "120s+"] },
                  { m: "Sprint 50m", v: ["9.5s", "8.5s", "7.5s", "6.5s"] },
                  { m: "Burpees 2 min", v: ["20", "35", "50", "65+"] }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3 font-bold text-white">{row.m}</td>
                    {row.v.map((val, j) => (
                      <td key={j} className={cn("p-3 text-center", j === 3 ? "text-emerald-400 font-black" : "")}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-zinc-800/30 p-4 rounded-xl border border-zinc-800">
            <p className="text-[10px] text-zinc-500 italic">
              <span className="text-emerald-500 font-bold uppercase mr-2">Nota Operacional:</span>
              Além destas métricas, avaliações contínuas de Shuttle Run (Agilidade) e Rounds de Resistência (3x 5min) compõem a nota física final de 100 pontos.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "O DIAGNÓSTICO MENTAL",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-center">
          <div className="space-y-2">
            {[
              { l: "Disciplina", p: 85, s: 170 },
              { l: "Resiliência", p: 90, s: 180 },
              { l: "Mentalidade Competitiva", p: 95, s: 190 },
              { l: "Controle Emocional", p: 80, s: 160 },
              { l: "Responsabilidade", p: 92, s: 184 },
              { l: "Tolerância à Dor", p: 88, s: 176 },
              { l: "Mentalidade de Crescimento", p: 94, s: 188 }
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold uppercase">
                  <span className="text-zinc-400">{item.l}</span>
                  <span className="text-emerald-400">{item.s} pts</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${item.p}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest text-center">Escala de Rendimento</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-zinc-300">160-200: <span className="text-white font-bold">Alto Rendimento</span></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-zinc-300">130-159: <span className="text-white font-bold">Alto Potencial</span></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-[10px] text-zinc-300">100-129: <span className="text-white font-bold">Desenvolvível</span></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[10px] text-zinc-300">&lt; 99: <span className="text-white font-bold">Risco Comportamental</span></span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "O MOTOR DE MERITOCRACIA MENSAL",
      content: (
        <div className="flex flex-col justify-center h-full space-y-8">
          <div className="grid grid-cols-5 gap-4">
            {[
              { l: "Presença", p: "+20" },
              { l: "Treino", p: "+20" },
              { l: "Sparring", p: "+20" },
              { l: "TAF", p: "+20" },
              { l: "Competição", p: "+40" }
            ].map((item, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="aspect-square bg-zinc-800/50 border border-zinc-800 rounded-2xl flex items-center justify-center text-emerald-400 font-black text-lg">{item.p}</div>
                <p className="text-[8px] font-bold text-zinc-500 uppercase">{item.l}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 bg-emerald-500 p-6 rounded-2xl text-white">
            <Trophy size={48} className="shrink-0" />
            <div>
              <h4 className="text-xl font-black uppercase tracking-tighter">Ranking Geral (Top 5)</h4>
              <p className="text-sm opacity-90">Prioridade em treinos especiais, convocações prioritárias e status de destaque no ecossistema.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "O SISTEMA OPERACIONAL PAC",
      content: (
        <div className="flex items-center justify-center h-full">
          <div className="relative w-full max-w-2xl">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -translate-y-1/2" />
            <div className="grid grid-cols-5 gap-4 relative">
              {[
                { t: "Seleção", d: "Filtro 60 dias" },
                { t: "Baseline", d: "Plano Individual" },
                { t: "Execução", d: "Rotina Semanal" },
                { t: "Auditoria", d: "Reavaliação" },
                { t: "Progressão", d: "Subida/Corte" }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-emerald-500 flex items-center justify-center text-white font-bold text-xs z-10">{i + 1}</div>
                  <div className="space-y-1">
                    <h5 className="text-[10px] font-bold text-white uppercase">{step.t}</h5>
                    <p className="text-[8px] text-zinc-500">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "O DOSSIÊ CENTRAL DE INTELIGÊNCIA",
      content: (
        <div className="grid grid-cols-3 gap-6 h-full">
          <div className="col-span-1 bg-zinc-800/30 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center space-y-4">
            <div className="w-24 h-24 bg-zinc-800 rounded-full border border-zinc-700 flex items-center justify-center">
              <UserIcon size={48} className="text-zinc-600" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-[10px] font-bold text-white uppercase">Alvo: Categoria Médio</p>
              <p className="text-[8px] text-zinc-500 uppercase">Prazo: Mundial 2025</p>
            </div>
          </div>
          <div className="col-span-2 space-y-4">
            <div className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-4 h-1/2">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-4">Telemetria de Peso</p>
              <div className="h-16 flex items-end gap-2">
                {[40, 60, 45, 80, 55, 70, 50].map((h, i) => (
                  <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm relative group">
                    <div className="absolute bottom-0 left-0 w-full bg-emerald-500 rounded-t-sm transition-all" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 h-[calc(50%-1rem)]">
              <div className="bg-zinc-800/30 border border-zinc-800 rounded-xl p-3 flex flex-col justify-center text-center">
                <p className="text-[14px] font-black text-white">85%</p>
                <p className="text-[8px] text-zinc-500 uppercase">Raspagens</p>
              </div>
              <div className="bg-zinc-800/30 border border-zinc-800 rounded-xl p-3 flex flex-col justify-center text-center">
                <p className="text-[14px] font-black text-white">92%</p>
                <p className="text-[8px] text-zinc-500 uppercase">Passagens</p>
              </div>
              <div className="bg-zinc-800/30 border border-zinc-800 rounded-xl p-3 flex flex-col justify-center text-center">
                <p className="text-[14px] font-black text-white">70%</p>
                <p className="text-[8px] text-zinc-500 uppercase">Finalizações</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "O COMPROMISSO FINAL",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
          <h2 className="text-4xl font-black text-white tracking-tighter">VOCÊ ESTÁ PRONTO?</h2>
          <p className="text-base text-zinc-400 max-w-xl italic">"O talento garante a entrada. Apenas a disciplina inquebrável garante a permanência."</p>
          <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
            <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-800 text-left">
              <Zap className="text-emerald-500 shrink-0" size={20} />
              <p className="text-zinc-300 font-medium text-xs">Você não escolhe treinos. Você executa o programa.</p>
            </div>
            <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-800 text-left">
              <Zap className="text-emerald-500 shrink-0" size={20} />
              <p className="text-zinc-300 font-medium text-xs">Você não busca desculpas. Você assume responsabilidade.</p>
            </div>
            <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-800 text-left">
              <Zap className="text-emerald-500 shrink-0" size={20} />
              <p className="text-zinc-300 font-medium text-xs">Você não aceita o médio. Você vive em busca da excelência.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {mediaToDelete && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-md w-full shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Trash2 className="text-red-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">Excluir Arquivo?</h3>
              <p className="text-zinc-400 text-center mb-8">Esta ação não pode ser desfeita. O arquivo será removido permanentemente da biblioteca.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setMediaToDelete(null)}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleDeleteMedia(mediaToDelete)}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/20"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Presentation className="text-emerald-500" />
            CENTRAL DE MÍDIA
          </h2>
          {isCoach && (
            <button 
              onClick={() => setShowForm(true)}
              className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl transition-all border border-emerald-500/20"
              title="Adicionar Novo Arquivo"
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        <div className="flex items-center bg-zinc-900/50 border border-zinc-800 p-1 rounded-2xl">
          <button 
            onClick={() => setViewMode('slides')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
              viewMode === 'slides' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Presentation size={14} />
            Slides
          </button>
          <button 
            onClick={() => setViewMode('video')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
              viewMode === 'video' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Video size={14} />
            Vídeos
          </button>
          <button 
            onClick={() => setViewMode('pdf')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
              viewMode === 'pdf' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <FileText size={14} />
            PDFs
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'slides' ? (
          <motion.div 
            key="slides"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="max-w-5xl mx-auto space-y-6"
          >
            <div className="aspect-[16/9] bg-zinc-900 rounded-3xl border border-zinc-800 p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-emerald-500/5">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em] mb-1">Slide {activeSlide + 1} / {slides.length}</h2>
                    <h3 className="text-xl font-bold text-white tracking-tight">{slides[activeSlide].title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-700 font-black text-xl">
                    PAC <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSlide}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="h-full"
                    >
                      {slides[activeSlide].content}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-4">
              <div className="flex flex-wrap gap-1.5 max-w-[60%]">
                {slides.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      activeSlide === i ? "bg-emerald-500 w-6" : "bg-zinc-800 hover:bg-zinc-700"
                    )}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button 
                  disabled={activeSlide === 0}
                  onClick={() => setActiveSlide(prev => prev - 1)}
                  className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all border border-zinc-800"
                >
                  Anterior
                </button>
                <button 
                  disabled={activeSlide === slides.length - 1}
                  onClick={() => setActiveSlide(prev => prev + 1)}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
                >
                  Próximo
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {selectedMedia && selectedMedia.type === viewMode ? (
              <div className="max-w-5xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{selectedMedia.title}</h3>
                  <button 
                    onClick={() => setSelectedMedia(null)}
                    className="text-zinc-500 hover:text-white text-sm font-bold flex items-center gap-2"
                  >
                    <ChevronRight className="rotate-180" size={16} />
                    Voltar para Lista
                  </button>
                </div>
                
                {selectedMedia.type === 'video' ? (
                  <div className="aspect-video bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden relative shadow-2xl">
                    {selectedMedia.url.includes('youtube.com/embed/') ? (
                      <iframe 
                        src={selectedMedia.url} 
                        className="w-full h-full"
                        title={selectedMedia.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video 
                        key={selectedMedia.url}
                        src={selectedMedia.url}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay
                        playsInline
                        poster={selectedMedia.thumbnail || "https://picsum.photos/seed/pac-video/1280/720"}
                      >
                        Seu navegador não suporta o elemento de vídeo.
                      </video>
                    )}
                  </div>
                ) : (
                  <div className="h-[700px] bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
                    <iframe 
                      src={selectedMedia.url} 
                      className="w-full h-full"
                      title={selectedMedia.title}
                    />
                  </div>
                )}
                
                {selectedMedia.description && (
                  <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                    <p className="text-zinc-400 text-sm leading-relaxed">{selectedMedia.description}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {media.filter(m => m.type === viewMode).map((m) => (
                  <motion.div
                    key={m.id}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedMedia(m)}
                    className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all shadow-xl cursor-pointer"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={m.thumbnail || `https://picsum.photos/seed/${m.id}/600/400`} 
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-3 bg-emerald-500 text-white rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                          {m.type === 'video' ? <PlayCircle size={24} /> : <Eye size={24} />}
                        </div>
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{m.title}</h4>
                        <div className="flex gap-2">
                          {isCoach && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setMediaToDelete(m.id);
                              }}
                              className="text-zinc-500 hover:text-red-500 transition-colors"
                              title="Excluir arquivo"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(m.url, '_blank');
                            }}
                            className="text-zinc-500 hover:text-emerald-500 transition-colors"
                            title="Abrir em nova aba"
                          >
                            <ExternalLink size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-500 line-clamp-2">{m.description || 'Sem descrição disponível.'}</p>
                    </div>
                  </motion.div>
                ))}
                
                {media.filter(m => m.type === viewMode).length === 0 && (
                  <div className="col-span-full py-20 text-center space-y-4 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                      {viewMode === 'video' ? <Video className="text-zinc-600" /> : <FileText className="text-zinc-600" />}
                    </div>
                    <div>
                      <h3 className="text-zinc-400 font-bold">Nenhum arquivo encontrado</h3>
                      <p className="text-zinc-600 text-xs mb-4">Adicione novos arquivos usando o botão "+" acima.</p>
                      {isCoach && (
                        <button 
                          onClick={() => setShowForm(true)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
                        >
                          Adicionar Arquivo
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {showForm && (
        <MediaForm 
          currentUser={user}
          onSuccess={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}

      {mediaToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Excluir Arquivo?</h3>
            <p className="text-zinc-500 text-sm mb-8">Esta ação não pode ser desfeita. O arquivo será removido permanentemente da central de mídia.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setMediaToDelete(null)}
                className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDeleteMedia(mediaToDelete)}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/20"
              >
                Excluir
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const BlockedOverlay = () => (
  <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 text-center">
    <div className="max-w-md space-y-6">
      <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
        <Lock size={48} className="text-rose-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Acesso Bloqueado</h2>
        <p className="text-zinc-400 leading-relaxed">
          Seu acesso ao PAC foi temporariamente suspenso devido a pendências financeiras ou administrativas.
        </p>
      </div>
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-left">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">O que fazer?</p>
        <p className="text-xs text-zinc-300">
          Entre em contato com o suporte ou com a secretaria da sua academia para regularizar sua situação.
        </p>
      </div>
      <button 
        onClick={() => signOut(auth)}
        className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase tracking-widest rounded-xl transition-all"
      >
        Sair da Conta
      </button>
    </div>
  </div>
);

const GraduationSettings = () => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'graduation_config', 'jiujitsu'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.belts) {
          const uniqueBelts: any[] = [];
          const seenIds = new Set();
          for (const belt of data.belts) {
            if (belt.id && !seenIds.has(belt.id)) {
              uniqueBelts.push(belt);
              seenIds.add(belt.id);
            }
          }
          data.belts = uniqueBelts;
        }
        setConfig(data);
      } else {
        const defaultConfig = {
          belts: [
            { id: 'white', name: 'Branca', color: '#FFFFFF', maxStripes: 4, minAge: 0, minTimeMonths: 0, isKids: false },
            { id: 'grey_white', name: 'Cinza/Branca', color: '#D1D5DB', maxStripes: 4, minAge: 4, minTimeMonths: 0, isKids: true },
            { id: 'grey', name: 'Cinza', color: '#9CA3AF', maxStripes: 4, minAge: 4, minTimeMonths: 0, isKids: true },
            { id: 'grey_black', name: 'Cinza/Preta', color: '#4B5563', maxStripes: 4, minAge: 4, minTimeMonths: 0, isKids: true },
            { id: 'yellow_white', name: 'Amarela/Branca', color: '#FEF08A', maxStripes: 4, minAge: 7, minTimeMonths: 0, isKids: true },
            { id: 'yellow', name: 'Amarela', color: '#FDE047', maxStripes: 4, minAge: 7, minTimeMonths: 0, isKids: true },
            { id: 'yellow_black', name: 'Amarela/Preta', color: '#EAB308', maxStripes: 4, minAge: 7, minTimeMonths: 0, isKids: true },
            { id: 'orange_white', name: 'Laranja/Branca', color: '#FED7AA', maxStripes: 4, minAge: 10, minTimeMonths: 0, isKids: true },
            { id: 'orange', name: 'Laranja', color: '#FB923C', maxStripes: 4, minAge: 10, minTimeMonths: 0, isKids: true },
            { id: 'orange_black', name: 'Laranja/Preta', color: '#F97316', maxStripes: 4, minAge: 10, minTimeMonths: 0, isKids: true },
            { id: 'green_white', name: 'Verde/Branca', color: '#BBF7D0', maxStripes: 4, minAge: 13, minTimeMonths: 0, isKids: true },
            { id: 'green', name: 'Verde', color: '#4ADE80', maxStripes: 4, minAge: 13, minTimeMonths: 0, isKids: true },
            { id: 'green_black', name: 'Verde/Preta', color: '#22C55E', maxStripes: 4, minAge: 13, minTimeMonths: 0, isKids: true },
            { id: 'blue', name: 'Azul', color: '#3B82F6', maxStripes: 4, minAge: 16, minTimeMonths: 24, isKids: false },
            { id: 'purple', name: 'Roxa', color: '#A855F7', maxStripes: 4, minAge: 16, minTimeMonths: 24, isKids: false, graduationType: 'standard' },
            { id: 'brown', name: 'Marrom', color: '#78350F', maxStripes: 4, minAge: 18, minTimeMonths: 18, isKids: false, graduationType: 'standard' },
            { id: 'black_1_3', name: 'Preta (1º-3º Grau)', color: '#000000', maxStripes: 3, minAge: 19, minTimeMonths: 36, isKids: false, graduationType: 'timeBased', timeBasedRules: [{ degree: 1, yearsRequired: 3 }, { degree: 2, yearsRequired: 3 }, { degree: 3, yearsRequired: 3 }] },
            { id: 'black_4_6', name: 'Preta (4º-6º Grau)', color: '#000000', maxStripes: 3, minAge: 19, minTimeMonths: 60, isKids: false, graduationType: 'timeBased', timeBasedRules: [{ degree: 4, yearsRequired: 5 }, { degree: 5, yearsRequired: 5 }, { degree: 6, yearsRequired: 5 }] },
            { id: 'red_black', name: 'Vermelha e Preta (7º Grau)', color: '#FF0000', maxStripes: 1, minAge: 19, minTimeMonths: 84, isKids: false, graduationType: 'standard' },
            { id: 'red_white', name: 'Vermelha e Branca (8º Grau)', color: '#FF0000', maxStripes: 1, minAge: 19, minTimeMonths: 84, isKids: false, graduationType: 'standard' },
            { id: 'red', name: 'Vermelha (9º Grau)', color: '#FF0000', maxStripes: 1, minAge: 19, minTimeMonths: 120, isKids: false, graduationType: 'standard' },
          ]
        };
        setDoc(doc(db, 'graduation_config', 'jiujitsu'), defaultConfig);
        setConfig(defaultConfig);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const resetToDefaults = async () => {
    const defaultConfig = {
      belts: [
        { id: 'white', name: 'Branca', color: '#FFFFFF', maxStripes: 4, minAge: 0, minTimeMonths: 0, isKids: false, graduationType: 'standard' },
        { id: 'grey_white', name: 'Cinza/Branca', color: '#D1D5DB', maxStripes: 4, minAge: 4, minTimeMonths: 0, isKids: true, graduationType: 'standard' },
        { id: 'grey', name: 'Cinza', color: '#9CA3AF', maxStripes: 4, minAge: 4, minTimeMonths: 0, isKids: true, graduationType: 'standard' },
        { id: 'grey_black', name: 'Cinza/Preta', color: '#4B5563', maxStripes: 4, minAge: 4, minTimeMonths: 0, isKids: true, graduationType: 'standard' },
        { id: 'yellow_white', name: 'Amarela/Branca', color: '#FEF08A', maxStripes: 4, minAge: 7, minTimeMonths: 0, isKids: true, graduationType: 'standard' },
        { id: 'yellow', name: 'Amarela', color: '#FDE047', maxStripes: 4, minAge: 7, minTimeMonths: 0, isKids: true, graduationType: 'standard' },
        { id: 'yellow_black', name: 'Amarela/Preta', color: '#EAB308', maxStripes: 4, minAge: 7, minTimeMonths: 0, isKids: true, graduationType: 'standard' },
        { id: 'orange_white', name: 'Laranja/Branca', color: '#FED7AA', maxStripes: 4, minAge: 10, minTimeMonths: 0, isKids: true, graduationType: 'standard' },
        { id: 'orange', name: 'Laranja', color: '#FB923C', maxStripes: 4, minAge: 10, minTimeMonths: 0, isKids: true, graduationType: 'standard' },
        { id: 'orange_black', name: 'Laranja/Preta', color: '#F97316', maxStripes: 4, minAge: 10, minTimeMonths: 0, isKids: true, graduationType: 'standard' },
        { id: 'green_white', name: 'Verde/Branca', color: '#BBF7D0', maxStripes: 4, minAge: 13, minTimeMonths: 0, isKids: true, graduationType: 'standard' },
        { id: 'green', name: 'Verde', color: '#4ADE80', maxStripes: 4, minAge: 13, minTimeMonths: 0, isKids: true, graduationType: 'standard' },
        { id: 'green_black', name: 'Verde/Preta', color: '#22C55E', maxStripes: 4, minAge: 13, minTimeMonths: 0, isKids: true, graduationType: 'standard' },
        { id: 'blue', name: 'Azul', color: '#3B82F6', maxStripes: 4, minAge: 16, minTimeMonths: 24, isKids: false, graduationType: 'standard' },
        { id: 'purple', name: 'Roxa', color: '#A855F7', maxStripes: 4, minAge: 16, minTimeMonths: 24, isKids: false, graduationType: 'standard' },
        { id: 'brown', name: 'Marrom', color: '#78350F', maxStripes: 4, minAge: 18, minTimeMonths: 18, isKids: false, graduationType: 'standard' },
        { id: 'black_1_3', name: 'Preta (1º-3º Grau)', color: '#000000', maxStripes: 3, minAge: 19, minTimeMonths: 36, isKids: false, graduationType: 'timeBased', timeBasedRules: [{ degree: 1, yearsRequired: 3 }, { degree: 2, yearsRequired: 3 }, { degree: 3, yearsRequired: 3 }] },
        { id: 'black_4_6', name: 'Preta (4º-6º Grau)', color: '#000000', maxStripes: 3, minAge: 19, minTimeMonths: 60, isKids: false, graduationType: 'timeBased', timeBasedRules: [{ degree: 4, yearsRequired: 5 }, { degree: 5, yearsRequired: 5 }, { degree: 6, yearsRequired: 5 }] },
        { id: 'red_black', name: 'Vermelha e Preta (7º Grau)', color: '#FF0000', maxStripes: 1, minAge: 19, minTimeMonths: 84, isKids: false, graduationType: 'standard' },
        { id: 'red_white', name: 'Vermelha e Branca (8º Grau)', color: '#FF0000', maxStripes: 1, minAge: 19, minTimeMonths: 84, isKids: false, graduationType: 'standard' },
        { id: 'red', name: 'Vermelha (9º Grau)', color: '#FF0000', maxStripes: 1, minAge: 19, minTimeMonths: 120, isKids: false, graduationType: 'standard' },
      ]
    };
    await setDoc(doc(db, 'graduation_config', 'jiujitsu'), defaultConfig);
    setConfig(defaultConfig);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'graduation_config', 'jiujitsu'), config);
    } catch (error) {
      console.error('Error saving graduation config:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateBelt = (index: number, field: string, value: any) => {
    const newBelts = [...config.belts];
    newBelts[index] = { ...newBelts[index], [field]: value };
    setConfig({ ...config, belts: newBelts });
  };

  if (loading) return <div className="p-20 text-center text-zinc-500">Carregando configurações...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Sistema de Graduação</h2>
          <p className="text-zinc-500 text-sm">Configure as faixas, graus e requisitos de tempo/idade.</p>
        </div>
        <button 
          onClick={resetToDefaults}
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-bold transition-all mr-4"
        >
          Resetar Padrões
        </button>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {config.belts.map((belt: any, index: number) => (
          <div key={belt.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center gap-6">
            <div className="w-full flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-48 flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-lg border border-white/10 shadow-inner"
                  style={{ backgroundColor: belt.color }}
                />
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={belt.name}
                    onChange={(e) => updateBelt(index, 'name', e.target.value)}
                    className="bg-transparent text-white font-bold outline-none border-b border-transparent focus:border-emerald-500 w-full"
                  />
                  <div className="text-[10px] text-zinc-500 uppercase font-bold">{belt.isKids ? 'Infantil' : 'Adulto'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 w-full">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Máx. Graus</label>
                  <input 
                    type="number" 
                    value={belt.maxStripes}
                    onChange={(e) => updateBelt(index, 'maxStripes', parseInt(e.target.value))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Idade Mín.</label>
                  <input 
                    type="number" 
                    value={belt.minAge}
                    onChange={(e) => updateBelt(index, 'minAge', parseInt(e.target.value))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Tempo Mín. (Meses)</label>
                  <input 
                    type="number" 
                    value={belt.minTimeMonths}
                    onChange={(e) => updateBelt(index, 'minTimeMonths', parseInt(e.target.value))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Cor (Hex)</label>
                  <input 
                    type="text" 
                    value={belt.color}
                    onChange={(e) => updateBelt(index, 'color', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
            {belt.graduationType === 'timeBased' && (
              <div className="mt-4 w-full border-t border-zinc-800 pt-4">
                <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-2">Regras de Tempo (Anos por Grau)</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {belt.timeBasedRules.map((rule: any, ruleIndex: number) => (
                    <div key={ruleIndex} className="bg-zinc-800 p-2 rounded-lg text-center">
                      <div className="text-[10px] text-zinc-400">{rule.degree}º Grau</div>
                      <input 
                        type="number" 
                        value={rule.yearsRequired}
                        onChange={(e) => {
                          const newBelts = [...config.belts];
                          newBelts[index].timeBasedRules[ruleIndex].yearsRequired = parseInt(e.target.value);
                          setConfig({ ...config, belts: newBelts });
                        }}
                        className="w-full bg-transparent text-white text-center font-bold outline-none"
                      />
                      <div className="text-[8px] text-zinc-500 uppercase">Anos</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const AcademySwitcher = ({ user, onSwitch }: { user: User, onSwitch: (academyId: string) => void }) => {
  if (!user.available_academies || user.available_academies.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
      <Building2 size={16} className="text-zinc-500 ml-2" />
      <select 
        value={user.academy_id}
        onChange={(e) => onSwitch(e.target.value)}
        className="bg-transparent text-xs font-bold text-white focus:outline-none pr-2 py-1 cursor-pointer"
      >
        {user.available_academies.map(a => (
          <option key={a.academy_id} value={a.academy_id} className="bg-zinc-900">
            {a.academy_name}
          </option>
        ))}
      </select>
    </div>
  );
};

const RoleSwitcher = ({ currentRole, onSwitch }: { currentRole: string, onSwitch: (role: any) => void }) => {
  const roles = ['athlete', 'professor', 'academy', 'developer'];
  return (
    <div className="flex gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800">
      {roles.map(role => (
        <button
          key={role}
          onClick={() => onSwitch(role)}
          className={cn(
            "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
            currentRole === role ? "bg-emerald-500 text-white" : "text-zinc-500 hover:text-white"
          )}
        >
          {role}
        </button>
      ))}
    </div>
  );
};

const GraduationList = ({ athletes }: { athletes: Athlete[] }) => {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const docRef = doc(db, 'graduation_config', 'jiujitsu');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.belts) {
          const uniqueBelts: any[] = [];
          const seenIds = new Set();
          for (const belt of data.belts) {
            if (belt.id && !seenIds.has(belt.id)) {
              uniqueBelts.push(belt);
              seenIds.add(belt.id);
            }
          }
          data.belts = uniqueBelts;
        }
        setConfig(data);
      }
    };
    fetchConfig();
  }, []);

  const checkEligibility = (athlete: Athlete) => {
    if (!config) return null;
    const beltConfig = config.belts.find((b: any) => b.name.toLowerCase() === athlete.belt.toLowerCase());
    if (!beltConfig) return null;

    if (athlete.stripes >= beltConfig.maxStripes) {
      return "Pronto para nova faixa";
    }
    return null;
  };

  const eligibleAthletes = athletes.filter(a => checkEligibility(a));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Atletas Elegíveis para Graduação</h2>
      {eligibleAthletes.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800 p-12 rounded-3xl text-center text-zinc-500">
          Nenhum atleta elegível no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eligibleAthletes.map(a => (
            <div key={a.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{a.name}</h3>
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">{a.belt} - {a.stripes} Graus</p>
              </div>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all">
                Graduar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const GraduationView = ({ athletes, role }: { athletes: Athlete[], role: string }) => {
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'config'>(role === 'developer' ? 'config' : 'list');
  
  return (
    <div className="space-y-8">
      {role === 'developer' && (
        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveSubTab('list')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
              activeSubTab === 'list' ? "bg-emerald-500 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Elegíveis
          </button>
          <button 
            onClick={() => setActiveSubTab('config')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
              activeSubTab === 'config' ? "bg-emerald-500 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Configuração
          </button>
        </div>
      )}
      
      {activeSubTab === 'list' ? <GraduationList athletes={athletes} /> : <GraduationSettings />}
    </div>
  );
};

const UserManagement = ({ academies, currentUser }: { academies: Academy[], currentUser: User }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [whitelist, setWhitelist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('athlete');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for editing user academies
  const [editAcademies, setEditAcademies] = useState<{
    academy_id: string;
    role: 'athlete' | 'professor' | 'academy';
    permissions: { gestao: boolean; administrativa: boolean; pedagogica: boolean; };
  }[]>([]);

  useEffect(() => {
    // Only developer can access all users
    if (currentUser.role !== 'developer') {
      setLoading(false);
      return;
    }

    // Listen to users
    const qUsers = collection(db, 'users');
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));

    // Listen to whitelist
    const qWhitelist = collection(db, 'whitelist');
    const unsubscribeWhitelist = onSnapshot(qWhitelist, (snapshot) => {
      setWhitelist(snapshot.docs.map(doc => ({ email: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'whitelist'));

    return () => {
      unsubscribeUsers();
      unsubscribeWhitelist();
    };
  }, [currentUser]);

  const combinedUsers = useMemo(() => {
    const activeEmails = new Set(users.map(u => u.email.toLowerCase()));
    
    const pendingUsers = whitelist
      .filter(w => !activeEmails.has(w.email.toLowerCase()))
      .map(w => ({
        id: `pending-${w.email}`,
        email: w.email,
        name: 'Aguardando Primeiro Acesso',
        role: w.role,
        isPending: true,
        academy_id: w.academy_id,
        available_academies: w.academy_id ? [{ 
          academy_id: w.academy_id, 
          role: w.role,
          academy_name: academies.find(a => a.id === w.academy_id)?.name || 'Academia Desconhecida'
        }] : []
      }));

    return [...users, ...pendingUsers];
  }, [users, whitelist, academies]);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditAcademies(user.available_academies || []);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', editingUser.id), {
        available_academies: editAcademies,
        // Also update the primary academy_id if needed, or just keep it as the first one
        academy_id: editAcademies.length > 0 ? editAcademies[0].academy_id : null,
        role: editAcademies.length > 0 ? editAcademies[0].role : editingUser.role
      });
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Erro ao salvar alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  const addAcademyToUser = () => {
    setEditAcademies([...editAcademies, {
      academy_id: '',
      role: 'athlete',
      permissions: { gestao: false, administrativa: false, pedagogica: false }
    }]);
  };

  const removeAcademyFromUser = (index: number) => {
    setEditAcademies(editAcademies.filter((_, i) => i !== index));
  };

  const updateAcademyEntry = (index: number, field: string, value: any) => {
    const newEntries = [...editAcademies];
    if (field === 'permissions') {
      newEntries[index].permissions = { ...newEntries[index].permissions, ...value };
    } else {
      (newEntries[index] as any)[field] = value;
    }
    setEditAcademies(newEntries);
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const updateUserAcademy = async (userId: string, academyId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { academy_id: academyId });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const handleDeleteUser = async (userToDelete: any) => {
    const isPending = userToDelete.isPending;
    const identifier = isPending ? userToDelete.email : userToDelete.email;
    
    if (!confirm(`Tem certeza que deseja deletar ${isPending ? 'o pré-cadastro' : 'permanentemente o usuário'} ${identifier}? Esta ação não pode ser desfeita.`)) return;
    
    try {
      const batch = writeBatch(db);
      if (!isPending) {
        batch.delete(doc(db, 'users', userToDelete.id));
      }
      batch.delete(doc(db, 'whitelist', userToDelete.email.toLowerCase()));
      await batch.commit();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Erro ao deletar usuário.');
    }
  };

  const handlePreRegister = async () => {
    if (!newEmail) return;
    setIsRegistering(true);
    try {
      const whitelistData: any = {
        role: newRole,
        added_at: serverTimestamp(),
        added_by: currentUser.id
      };
      
      if (currentUser.academy_id) {
        whitelistData.academy_id = currentUser.academy_id;
      }
      
      await setDoc(doc(db, 'whitelist', newEmail.toLowerCase()), whitelistData);
      setNewEmail('');
      setIsModalOpen(false);
      alert('E-mail adicionado à whitelist com sucesso!');
    } catch (error) {
      console.error('Error pre-registering:', error);
      alert('Erro ao adicionar e-mail.');
    } finally {
      setIsRegistering(false);
    }
  };

  if (currentUser.role !== 'developer') {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <Shield size={48} className="text-zinc-800" />
        <h3 className="text-xl font-bold text-white">Acesso Restrito</h3>
        <p className="text-zinc-500 max-w-md text-center">Somente o desenvolvedor mestre tem acesso à gestão global de usuários.</p>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Carregando usuários...</p>
    </div>
  );

  const roleOptions = currentUser.role === 'developer' 
    ? ['athlete', 'professor', 'academy', 'developer']
    : ['athlete', 'professor'];

  const filteredUsers = combinedUsers.filter(u => 
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Gestão de Usuários</h2>
          <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] font-bold mt-1">Controle total de acessos e permissões</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text"
              placeholder="BUSCAR USUÁRIO..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-6 py-3 text-sm text-white outline-none focus:border-emerald-500 transition-all w-64 uppercase font-bold tracking-widest"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <UserPlus size={18} />
            Novo Usuário
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800">
                <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Usuário</th>
                <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Email</th>
                <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Role</th>
                <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Academia</th>
                <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 font-black text-xs border border-zinc-700">
                        {(u.name || 'P').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-bold text-lg tracking-tight ${u.isPending ? 'text-zinc-500 italic' : 'text-white'}`}>
                          {u.name || 'Sem Nome'}
                        </span>
                        {u.isPending && (
                          <span className="flex items-center gap-1 text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded-full w-fit mt-1">
                            <Clock size={10} />
                            Pendente
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-zinc-400 text-sm font-medium">{u.email}</td>
                  <td className="px-8 py-6">
                    <select 
                      value={u.role}
                      onChange={(e) => updateUserRole(u.id, e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-emerald-500 transition-all cursor-pointer hover:bg-zinc-900"
                    >
                      {roleOptions.map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2 max-w-[200px]">
                      {u.available_academies && u.available_academies.length > 0 ? (
                        u.available_academies.map((aa, idx) => (
                          <span key={idx} className="px-2 py-1 bg-zinc-800 rounded-lg text-[10px] font-bold text-zinc-400 uppercase border border-zinc-700">
                            {aa.academy_name} ({aa.role})
                          </span>
                        ))
                      ) : (
                        <span className="text-zinc-600 text-[10px] font-bold uppercase italic">Nenhuma vinculada</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditUser(u)}
                        disabled={(u as any).isPending}
                        className={`p-3 rounded-xl transition-all opacity-0 group-hover:opacity-100 ${
                          (u as any).isPending 
                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                            : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                        }`}
                        title={(u as any).isPending ? "Aguarde o primeiro acesso para editar" : "Editar Usuário"}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(u)}
                        className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        title="Excluir Usuário"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Users size={40} className="text-zinc-800" />
                      <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">Nenhum usuário encontrado com os termos da busca.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Usuário */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Novo Usuário</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Pré-cadastro na Whitelist</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">E-mail de Acesso</label>
                  <input 
                    type="email" 
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-emerald-500 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nível de Acesso</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-emerald-500 transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="athlete">Atleta</option>
                    <option value="professor">Professor</option>
                    <option value="academy">Academia</option>
                    {currentUser.role === 'developer' && <option value="developer">Desenvolvedor</option>}
                  </select>
                </div>

                <button 
                  onClick={handlePreRegister}
                  disabled={isRegistering || !newEmail}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-xs"
                >
                  {isRegistering ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                  {isRegistering ? 'CADASTRANDO...' : 'CONFIRMAR PRÉ-CADASTRO'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                    <Edit2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Editar Usuário</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{editingUser.email}</p>
                  </div>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                {/* Academies List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Academias Vinculadas</label>
                    <button 
                      onClick={addAcademyToUser}
                      className="flex items-center gap-2 text-[10px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-widest transition-colors"
                    >
                      <Plus size={14} />
                      Adicionar Academia
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editAcademies.map((entry, index) => (
                      <div key={index} className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-6 relative group">
                        <button 
                          onClick={() => removeAcademyFromUser(index)}
                          className="absolute top-4 right-4 text-zinc-600 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Academia</label>
                            <select
                              value={entry.academy_id}
                              onChange={(e) => updateAcademyEntry(index, 'academy_id', e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-emerald-500 transition-all font-medium appearance-none cursor-pointer"
                            >
                              <option value="">Selecione uma academia</option>
                              {academies.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nível de Acesso</label>
                            <select
                              value={entry.role}
                              onChange={(e) => updateAcademyEntry(index, 'role', e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-emerald-500 transition-all font-medium appearance-none cursor-pointer"
                            >
                              <option value="athlete">Atleta</option>
                              <option value="professor">Professor</option>
                              <option value="academy">Academia</option>
                              <option value="developer">Desenvolvedor</option>
                            </select>
                          </div>
                        </div>

                        {entry.role === 'professor' && (
                          <div className="space-y-4 pt-4 border-t border-zinc-900">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Permissões de Professor</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {[
                                { id: 'gestao', label: 'Gestão' },
                                { id: 'administrativa', label: 'Administrativa' },
                                { id: 'pedagogica', label: 'Pedagógica' }
                              ].map(perm => (
                                <button
                                  key={perm.id}
                                  onClick={() => {
                                    const currentPerms = entry.permissions || { gestao: false, administrativa: false, pedagogica: false };
                                    const newPerms = { ...currentPerms, [perm.id]: !currentPerms[perm.id as keyof typeof currentPerms] };
                                    updateAcademyEntry(index, 'permissions', newPerms);
                                  }}
                                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${
                                    entry.permissions?.[perm.id as keyof typeof entry.permissions]
                                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                                      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                  }`}
                                >
                                  <Shield size={14} />
                                  {perm.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {editAcademies.length === 0 && (
                      <div className="text-center py-12 bg-zinc-950 border border-dashed border-zinc-800 rounded-3xl">
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Nenhuma academia vinculada.</p>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={handleSaveUser}
                  disabled={isSaving}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-xs"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {isSaving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

const NAV_CATEGORIES = [
  {
    id: 'performance',
    label: 'PERFORMANCE',
    icon: TrendingUp,
    items: [
      { id: 'dashboard', label: 'DASHBOARD', icon: LayoutGrid, roles: ['athlete', 'professor', 'academy', 'developer'] },
      { id: 'checkin', label: 'CHECK-IN', icon: CheckCircle2, roles: ['athlete', 'professor', 'academy', 'developer'] },
      { id: 'ranking', label: 'RANKING', icon: Trophy, roles: ['athlete', 'professor', 'academy', 'developer'] },
      { id: 'meritocracy', label: 'MERITOCRACIA', icon: BarChart3, roles: ['professor', 'academy', 'developer'] },
      { id: 'ai', label: 'PAC AI', icon: Brain, roles: ['professor', 'academy', 'developer'] },
    ]
  },
  {
    id: 'management',
    label: 'GESTÃO',
    icon: Users,
    items: [
      { id: 'athletes', label: 'ATLETAS', icon: Users, roles: ['professor', 'academy', 'developer'] },
      { id: 'academies', label: 'ACADEMIAS', icon: Landmark, roles: ['developer'] },
      { id: 'professors', label: 'PROFESSORES', icon: UserPlus, roles: ['academy', 'developer'] },
      { id: 'selection', label: 'LABORATÓRIO PAC', icon: Microscope, roles: ['professor', 'academy', 'developer'] },
      { id: 'schedules', label: 'GRADE HORÁRIA', icon: Calendar, roles: ['professor', 'academy', 'developer'] },
      { id: 'map', label: 'MAPA', icon: Globe, roles: ['developer'] },
      { id: 'finance', label: 'FINANCEIRO', icon: DollarSign, roles: ['academy', 'developer'] },
    ]
  },
  {
    id: 'metrics',
    label: 'LANÇAR MÉTRICAS',
    icon: ClipboardList,
    items: [
      { id: 'taf', label: 'TAF', icon: Activity, roles: ['professor', 'academy', 'developer'] },
      { id: 'technical', label: 'TÉCNICA', icon: Shield, roles: ['professor', 'academy', 'developer'] },
      { id: 'psychology', label: 'PSICOLOGIA', icon: Brain, roles: ['professor', 'academy', 'developer'] },
      { id: 'health', label: 'SAÚDE & BIOMETRIA', icon: Heart, roles: ['professor', 'academy', 'developer'] },
      { id: 'discipline', label: 'DISCIPLINA', icon: CheckCircle, roles: ['professor', 'academy', 'developer'] },
      { id: 'training', label: 'TREINOS', icon: Dumbbell, roles: ['professor', 'academy', 'developer'] },
    ]
  },
  {
    id: 'content',
    label: 'CONTEÚDO',
    icon: BookOpen,
    items: [
      { id: 'community', label: 'COMUNIDADE', icon: Users, roles: ['athlete', 'professor', 'academy', 'developer'] },
      { id: 'competitions', label: 'COMPETIÇÕES', icon: Trophy, roles: ['athlete', 'professor', 'academy', 'developer'] },
      { id: 'challenges', label: 'DESAFIOS', icon: Flag, roles: ['athlete', 'professor', 'academy', 'developer'] },
      { id: 'presentations', label: 'MÍDIA', icon: Presentation, roles: ['athlete', 'professor', 'academy', 'developer'] },
      { id: 'technical_library', label: 'BIBLIOTECA TÉCNICA', icon: Library, roles: ['athlete', 'professor', 'academy', 'developer'] },
      { id: 'library', label: 'BIBLIOTECA & DOCS', icon: BookOpen, roles: ['athlete', 'professor', 'academy', 'developer'] },
    ]
  },
  {
    id: 'system',
    label: 'SISTEMA',
    icon: Settings,
    items: [
      { id: 'settings', label: 'AJUSTES', icon: Settings, roles: ['professor', 'academy', 'developer'] },
      { id: 'audit', label: 'AUDITORIA', icon: ShieldCheck, roles: ['developer'] },
      { id: 'graduation', label: 'GRADUAÇÃO', icon: GraduationCap, roles: ['professor', 'academy', 'developer'] },
      { id: 'users', label: 'USUÁRIOS', icon: Users, roles: ['academy', 'developer'] },
    ]
  }
];

const MetricHistory = ({ type, athletes, onEdit }: { type: string, athletes: any[], onEdit?: (item: any) => void }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = async (item: any) => {
    const collectionName = {
      taf: 'physical_evaluations',
      technical: 'technical_evaluations',
      psychology: 'psychological_evaluations',
      health: 'health_logs',
      discipline: 'discipline_logs',
      training: 'training_logs',
      competitions: 'competitions'
    }[type as keyof any] || '';

    if (!collectionName || !item.athleteId) return;

    try {
      await deleteDoc(doc(db, `athletes/${item.athleteId}/${collectionName}`, item.id));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting metric:", error);
    }
  };

  useEffect(() => {
    const collectionName = {
      taf: 'physical_evaluations',
      technical: 'technical_evaluations',
      psychology: 'psychological_evaluations',
      health: 'health_logs',
      discipline: 'discipline_logs',
      training: 'training_logs',
      competitions: 'competitions'
    }[type as keyof any] || '';

    if (!collectionName) return;

    try {
      const q = query(collectionGroup(db, collectionName), orderBy('date', 'desc'), limit(15));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => {
          const athleteId = doc.ref.parent.parent?.id;
          const athlete = athletes.find(a => a.id === athleteId);
          return {
            id: doc.id,
            ...doc.data(),
            athleteName: athlete?.name || 'Atleta Desconhecido',
            athleteScore: athlete?.score || 0,
            athleteId
          };
        });
        setHistory(data);
        setLoading(false);
      }, (error) => {
        console.error(`History fetch error for ${type}:`, error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up history listener:", err);
      setLoading(false);
    }
  }, [type, athletes]);

  const renderMetricDetails = (item: any) => {
    switch (type) {
      case 'taf':
        return (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Barras:</span>
              <span className="text-xs font-black text-white">{item.pull_ups || 0}</span>
              <span className="text-[9px] text-zinc-600 font-bold">/ 15</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Flexões:</span>
              <span className="text-xs font-black text-white">{item.push_ups || 0}</span>
              <span className="text-[9px] text-zinc-600 font-bold">/ 40</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Burpees:</span>
              <span className="text-xs font-black text-white">{item.burpees || 0}</span>
              <span className="text-[9px] text-zinc-600 font-bold">/ 30</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Abdominais:</span>
              <span className="text-xs font-black text-white">{item.abdominals || item.sit_ups || 0}</span>
            </div>
          </div>
        );
      case 'technical':
        const avgTech = ((item.raspagens_efficiency || 0) + (item.passagens_efficiency || 0) + (item.finalizacoes_efficiency || 0) + (item.quedas_efficiency || 0) + (item.defesa_efficiency || 0)) / 5;
        return (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Média:</span>
              <span className={cn("text-xs font-black", avgTech >= 80 ? "text-emerald-400" : "text-amber-400")}>{avgTech.toFixed(1)}%</span>
              <span className="text-[9px] text-zinc-600 font-bold">Meta: 80%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Raspagens:</span>
              <span className="text-xs font-bold text-zinc-300">{item.raspagens_efficiency || 0}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Passagens:</span>
              <span className="text-xs font-bold text-zinc-300">{item.passagens_efficiency || 0}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Finalizações:</span>
              <span className="text-xs font-bold text-zinc-300">{item.finalizacoes_efficiency || 0}%</span>
            </div>
          </div>
        );
      case 'psychology':
        const avgPsych = ((item.disciplina || 0) + (item.resiliencia || 0) + (item.mentalidade_competitiva || 0) + (item.controle_emocional || 0) + (item.responsabilidade || 0) + (item.tolerancia_dor || 0) + (item.mentalidade_crescimento || 0)) / 7;
        return (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Média:</span>
              <span className="text-xs font-black text-emerald-400">{(avgPsych / 10).toFixed(1)}</span>
              <span className="text-[9px] text-zinc-600 font-bold">/ 10</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Resiliência:</span>
              <span className="text-xs font-bold text-zinc-300">{item.resiliencia || 0}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Disciplina:</span>
              <span className="text-xs font-bold text-zinc-300">{item.disciplina || 0}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Foco:</span>
              <span className="text-xs font-bold text-zinc-300">{item.controle_emocional || 0}%</span>
            </div>
          </div>
        );
      case 'health':
        return (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {item.sleep_hours !== undefined && (
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Sono:</span>
                <span className="text-xs font-black text-white">{item.sleep_hours}h</span>
              </div>
            )}
            {item.resting_heart_rate !== undefined && (
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">BPM:</span>
                <span className="text-xs font-black text-white">{item.resting_heart_rate}</span>
              </div>
            )}
            {item.hrv !== undefined && (
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">HRV:</span>
                <span className="text-xs font-black text-white">{item.hrv}ms</span>
              </div>
            )}
            {item.value !== undefined && (
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">{item.type || 'Métrica'}:</span>
                <span className="text-xs font-black text-white">{item.value} {item.unit}</span>
              </div>
            )}
          </div>
        );
      case 'discipline':
        if (item.average_score !== undefined) {
          return (
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Média:</span>
                <span className="text-xs font-black text-emerald-400">{item.average_score}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Frequência:</span>
                <span className="text-xs font-bold text-zinc-300">{item.attendance_score}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Pontualidade:</span>
                <span className="text-xs font-bold text-zinc-300">{item.punctuality_score}%</span>
              </div>
            </div>
          );
        }
        return (
          <div className="mt-2">
            <p className="text-[10px] text-zinc-400 leading-relaxed italic">"{item.description || 'Sem descrição'}"</p>
          </div>
        );
      case 'training':
        return (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Duração:</span>
              <span className="text-xs font-black text-white">{item.duration_minutes} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Intensidade:</span>
              <span className={cn(
                "text-xs font-black",
                item.intensity >= 8 ? "text-rose-400" : item.intensity >= 5 ? "text-amber-400" : "text-emerald-400"
              )}>{item.intensity}/10</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Tipo:</span>
              <span className="text-xs font-bold text-zinc-300 uppercase">{item.type}</span>
            </div>
          </div>
        );
      case 'competitions':
        return (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Resultado:</span>
              <span className="text-xs font-black text-white">{item.result || 'Pendente'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Pontos:</span>
              <span className="text-xs font-black text-emerald-400">+{item.points_earned || 0} PAC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Evento:</span>
              <span className="text-xs font-bold text-zinc-300">{item.name}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="text-center py-8 text-zinc-500">Carregando histórico...</div>;

  if (history.length === 0) return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-center text-zinc-500 italic">
      Nenhum registro encontrado recentemente para esta categoria.
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <History size={14} className="text-zinc-500" />
        <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Últimos Lançamentos</h4>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {history.map((item) => (
          <div key={item.id} className="bg-zinc-900/30 border border-zinc-800/50 p-5 rounded-2xl flex flex-col hover:bg-zinc-800/30 transition-all group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-500 font-black text-[10px] group-hover:border-emerald-500/30 transition-colors">
                  {(item.athleteName || '??').split(' ').map((n: any) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors leading-none mb-1">{item.athleteName}</div>
                  <div className="flex items-center gap-2">
                    <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                    </div>
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <div className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">
                      Score PAC: {item.athleteScore}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onEdit && (
                    <button 
                      onClick={() => onEdit(item)}
                      className="p-1.5 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
                      title="Editar"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                  {deleteConfirmId === item.id ? (
                    <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-0.5 border border-zinc-700">
                      <button 
                        onClick={() => handleDelete(item)}
                        className="p-1 hover:bg-emerald-500/10 rounded text-emerald-500 transition-colors"
                        title="Confirmar Exclusão"
                      >
                        <Check size={14} />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 hover:bg-rose-500/10 rounded text-rose-500 transition-colors"
                        title="Cancelar"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-1.5 hover:bg-rose-500/10 rounded-lg text-zinc-400 hover:text-rose-500 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="text-right">
                  {type === 'discipline' && (
                    <span className={cn(
                      "text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                      item.type === 'Mérito' ? "bg-emerald-500/10 text-emerald-500" : 
                      item.type === 'Demérito' ? "bg-rose-500/10 text-rose-500" :
                      "bg-zinc-500/10 text-zinc-500"
                    )}>
                      {item.type || 'Avaliação'}
                    </span>
                  )}
                  {type === 'taf' && <span className="text-emerald-500 font-black text-xs">+{item.total_score} pts</span>}
                  {type === 'competitions' && item.result && (
                    <span className={cn(
                      "text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                      item.result === 'Ouro' ? "bg-amber-500/10 text-amber-500" : 
                      item.result === 'Prata' ? "bg-zinc-400/10 text-zinc-400" : "bg-orange-600/10 text-orange-600"
                    )}>
                      {item.result}
                    </span>
                  )}
                  {type === 'technical' && <span className="text-emerald-500 font-black text-xs">Avaliação</span>}
                  {type === 'psychology' && <span className="text-emerald-500 font-black text-xs">Diagnóstico</span>}
                  {type === 'health' && <span className="text-emerald-500 font-black text-xs">Saúde</span>}
                  {type === 'technical' && <span className="text-emerald-500 font-black text-xs">Avaliação</span>}
                  {type === 'psychology' && <span className="text-emerald-500 font-black text-xs">Diagnóstico</span>}
                  {type === 'health' && <span className="text-emerald-500 font-black text-xs">Saúde</span>}
                  {type === 'training' && <span className="text-emerald-500 font-black text-xs">Treino</span>}
                </div>
              </div>
            </div>
            
            {renderMetricDetails(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

const TvMode = ({ user, academies, athletes, onClose, isLooping, setIsLooping }: { user: User | null, academies: Academy[], athletes: Athlete[], onClose: () => void, isLooping: boolean, setIsLooping: (val: boolean) => void }) => {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [selectedAcademyId, setSelectedAcademyId] = useState<string>(user?.academy_id || (academies.length > 0 ? academies[0].id : ''));
  const [graduationConfig, setGraduationConfig] = useState<any>(null);
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [topAthletesData, setTopAthletesData] = useState<any[]>([]);
  const [tvMedia, setTvMedia] = useState<any[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const top3Athletes = [...athletes].sort((a, b) => b.score - a.score).slice(0, 3);
  const selectedAcademy = academies.find(a => a.id === selectedAcademyId);

  useEffect(() => {
    const fetchTechniques = async () => {
      const q = query(collection(db, 'techniques'));
      const snapshot = await getDocs(q);
      setTechniques(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Technique)));
    };
    fetchTechniques();
  }, []);

  useEffect(() => {
    const fetchMedia = async () => {
      if (selectedAcademy?.tv_media_ids && selectedAcademy.tv_media_ids.length > 0) {
        const mediaDocs = await Promise.all(
          selectedAcademy.tv_media_ids.map(id => getDoc(doc(db, 'media', id)))
        );
        setTvMedia(mediaDocs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() })));
      } else {
        setTvMedia([]);
      }
    };
    fetchMedia();
  }, [selectedAcademy?.tv_media_ids]);

  useEffect(() => {
    if (!selectedAcademyId) return;
    const q = query(collection(db, `academies/${selectedAcademyId}/schedules`), orderBy('day_of_week'), orderBy('start_time'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSchedules(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClassSchedule)));
    });
    return () => unsubscribe();
  }, [selectedAcademyId]);

  useEffect(() => {
    const fetchConfig = async () => {
      const docRef = doc(db, 'graduation_config', 'jiujitsu');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGraduationConfig(docSnap.data());
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchTopAthletesData = async () => {
      try {
        const data = await Promise.all(top3Athletes.map(async (athlete) => {
          const trainingSnap = await getDocs(collection(db, `athletes/${athlete.id}/training_logs`));
          const technicalSnap = await getDocs(collection(db, `athletes/${athlete.id}/technical_evaluations`));
          
          const targetAthleteId = athlete.user_id || athlete.id;
          const progressQuery = query(collection(db, 'student_technique_progress'), where('athlete_id', '==', targetAthleteId));
          const progressSnap = await getDocs(progressQuery);
          
          return {
            ...athlete,
            trainingCount: trainingSnap.size,
            technicalCount: technicalSnap.size,
            technique_progress: progressSnap.docs.map(d => d.data())
          };
        }));
        setTopAthletesData(data);
      } catch (error) {
        console.error("Error fetching top athletes data:", error);
      }
    };
    if (top3Athletes.length > 0) {
      fetchTopAthletesData();
    }
  }, [athletes]);

  const getMissingForGraduation = (athlete: any) => {
    if (!graduationConfig || techniques.length === 0) return { msg: "Carregando...", pct: 0, tech: "Pendente" };
    const beltConfig = graduationConfig.belts.find((b: any) => b.id === athlete.belt || b.name.toLowerCase() === athlete.belt.toLowerCase());
    if (!beltConfig) return { msg: "Configuração não encontrada", pct: 0, tech: "Pendente" };

    const currentStripes = athlete.stripes || 0;

    // Calculate technical mastery
    const normalizeBelt = (belt: string) => belt ? belt.split(' (')[0].trim().toLowerCase() : '';
    const getEffectiveBelt = (belt: string) => {
      const normalized = normalizeBelt(belt);
      const kidsBelts = ['cinza', 'amarela', 'laranja', 'verde'];
      const isKidsBelt = kidsBelts.some(kb => normalized.includes(kb)) || (belt || '').toLowerCase().includes('infantil');
      return isKidsBelt ? 'branca' : normalized;
    };

    const effectiveAthleteBelt = getEffectiveBelt(athlete.belt);
    const beltTechniques = techniques.filter(t => normalizeBelt(t.belt) === effectiveAthleteBelt);
    
    const masteredTechniques = beltTechniques.filter(t => {
      const progress = athlete.technique_progress?.find((p: any) => p.technique_id === t.id);
      return progress?.status === 'validated';
    });
    
    const technicalPct = beltTechniques.length > 0 ? Math.round((masteredTechniques.length / beltTechniques.length) * 100) : 0;
    const technicalMsg = beltTechniques.length === 0 ? "0%" : (technicalPct >= 100 ? "Aprovado" : `${technicalPct}%`);

    if (currentStripes >= beltConfig.maxStripes) {
      return { msg: "Pronto para próxima faixa!", pct: 100, tech: technicalMsg };
    }

    const classesPerStripe = 30; // Estimativa padrão
    const classesSinceLastStripe = (athlete.trainingCount || 0) % classesPerStripe;
    const missingClasses = classesPerStripe - classesSinceLastStripe;
    const progressPct = Math.min(100, Math.round((classesSinceLastStripe / classesPerStripe) * 100));
    
    return {
      msg: `Faltam ${missingClasses} aulas`,
      pct: progressPct,
      tech: technicalMsg
    };
  };

  const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const today = new Date().getDay();
  const todaySchedules = schedules.filter(s => s.day_of_week === today);
  
  const scrollSpeed = selectedAcademy?.tv_scroll_speed || 15;
  const currentMedia = tvMedia[currentMediaIndex];

  const handleMediaEnded = () => {
    setCurrentMediaIndex(prev => {
      if (prev < tvMedia.length - 1) {
        return prev + 1;
      }
      return isLooping ? 0 : prev;
    });
  };

  return (
    <div className="fixed inset-0 bg-black z-[200] overflow-y-auto custom-scrollbar flex flex-col">
      <div className="p-6 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <MonitorPlay className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase">Modo TV <span className="text-emerald-500">PAC</span></h1>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.3em]">Painel da Academia</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsLooping(!isLooping)}
            className={cn(
              "p-3 rounded-xl transition-colors",
              isLooping ? "bg-emerald-500 text-white" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400"
            )}
            title={isLooping ? "Loop Ativado" : "Loop Desativado"}
          >
            <RefreshCw size={24} />
          </button>
          <button 
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => console.error(err));
              } else {
                document.exitFullscreen().catch(err => console.error(err));
              }
            }}
            className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
            title="Tela Cheia (F11)"
          >
            <Maximize2 size={24} />
          </button>
          <button onClick={onClose} className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Left Column: Media & Ranking */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {currentMedia && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden aspect-video relative shadow-2xl">
              {currentMedia.url.includes('youtube.com') || currentMedia.url.includes('youtu.be') ? (
                <iframe 
                  src={
                    currentMedia.url.includes('youtube.com/watch?v=') 
                      ? 'https://www.youtube.com/embed/' + currentMedia.url.split('v=')[1].split('&')[0] + '?autoplay=1&mute=1&controls=0&loop=1&playsinline=1&playlist=' + currentMedia.url.split('v=')[1].split('&')[0]
                      : currentMedia.url.includes('youtu.be/')
                      ? 'https://www.youtube.com/embed/' + currentMedia.url.split('youtu.be/')[1].split('?')[0] + '?autoplay=1&mute=1&controls=0&loop=1&playsinline=1&playlist=' + currentMedia.url.split('youtu.be/')[1].split('?')[0]
                      : currentMedia.url
                  } 
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <video 
                  key={currentMedia.url}
                  src={currentMedia.url}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop={tvMedia.length === 1 && isLooping}
                  playsInline
                  onEnded={handleMediaEnded}
                />
              )}
              
              {/* Controles de Navegação */}
              {tvMedia.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentMediaIndex(prev => (prev - 1 + tvMedia.length) % tvMedia.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full text-white backdrop-blur-md transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setCurrentMediaIndex(prev => (prev + 1) % tvMedia.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full text-white backdrop-blur-md transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Carrossel de Vídeos e Controle de Loop */}
              {tvMedia.length > 1 && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <button 
                    onClick={() => setIsLooping(!isLooping)}
                    className={cn(
                      "p-2 rounded-full backdrop-blur-md border transition-all",
                      isLooping 
                        ? "bg-emerald-500/80 border-emerald-400 text-white" 
                        : "bg-black/50 border-white/10 text-zinc-400 hover:text-white"
                    )}
                    title={isLooping ? "Loop Ativado" : "Loop Desativado"}
                  >
                    <RefreshCw size={16} />
                  </button>
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md p-1 rounded-full border border-white/10 overflow-x-auto max-w-[200px] custom-scrollbar">
                    {tvMedia.map((media, index) => (
                      <button
                        key={media.id}
                        onClick={() => setCurrentMediaIndex(index)}
                        className={cn(
                          "w-8 h-8 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 transition-all",
                          index === currentMediaIndex 
                            ? "bg-white text-black" 
                            : "bg-white/10 text-white hover:bg-white/20"
                        )}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex-1 flex flex-col min-h-0">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3 mb-6 shrink-0">
              <Trophy className="text-emerald-500" />
              Top 3 Ranking
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topAthletesData.map((athlete, idx) => (
                <div key={athlete.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex flex-col">
                  <div className={cn(
                    "absolute top-0 right-0 w-12 h-12 flex items-center justify-center font-black text-xl rounded-bl-2xl",
                    idx === 0 ? "bg-amber-500 text-amber-950" : 
                    idx === 1 ? "bg-zinc-300 text-zinc-900" : 
                    "bg-orange-600 text-orange-100"
                  )}>
                    #{idx + 1}
                  </div>
                  
                  <div className="pr-12 mb-4">
                    <h3 className="text-lg font-black text-white uppercase truncate">{athlete.name}</h3>
                    <p className="text-xs text-zinc-400 font-bold">{athlete.belt} - {athlete.stripes} Graus</p>
                  </div>
                    
                  <div className="grid grid-cols-2 gap-2 mb-4 mt-auto">
                    <div className="bg-black/50 p-2 rounded-xl border border-zinc-800/50 text-center">
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold mb-0.5">Score PAC</p>
                      <p className="text-base font-black text-emerald-500">{athlete.score}</p>
                    </div>
                    <div className="bg-black/50 p-2 rounded-xl border border-zinc-800/50 text-center">
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold mb-0.5">Treinos</p>
                      <p className="text-base font-black text-emerald-500">{athlete.trainingCount || 0}</p>
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <p className="text-[9px] text-emerald-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                        <GraduationCap size={10} /> Próximo Grau
                      </p>
                      <span className="text-[10px] font-black text-emerald-400">{getMissingForGraduation(athlete).pct}%</span>
                    </div>
                    
                    <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${getMissingForGraduation(athlete).pct}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[10px] text-emerald-100/70 font-medium">
                        {getMissingForGraduation(athlete).msg}
                      </p>
                      <p className={cn(
                        "text-[9px] font-bold uppercase px-2 py-0.5 rounded-md",
                        getMissingForGraduation(athlete).tech === 'Aprovado' 
                          ? "bg-emerald-500/20 text-emerald-400" 
                          : "bg-amber-500/20 text-amber-400"
                      )}>
                        Técnica: {getMissingForGraduation(athlete).tech}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Schedule */}
        <div className="space-y-8 flex flex-col h-full">
          <div className="flex-1 flex flex-col min-h-0 h-full">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3 mb-6 shrink-0">
              <Calendar className="text-emerald-500" />
              Grade de Hoje ({daysOfWeek[today]})
            </h2>
            
            {todaySchedules.length === 0 ? (
              <div className="bg-zinc-900/50 border border-zinc-800 p-12 rounded-3xl text-center text-zinc-500">
                Nenhuma aula programada para hoje.
              </div>
            ) : (
              <div 
                className="relative overflow-hidden flex-1 min-h-[400px]"
                style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 2%, black 98%, transparent)' }}
              >
                <motion.div
                  className="flex flex-col"
                  animate={{ y: ["0%", "-50%"] }}
                  transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: Math.max(todaySchedules.length * scrollSpeed, 10)
                  }}
                >
                <div className="flex flex-col gap-4 pb-4">
                  {todaySchedules.map(schedule => (
                    <div key={schedule.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shrink-0">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-black text-white uppercase">{schedule.activity}</h3>
                          <p className="text-emerald-500 font-bold">{schedule.start_time} - {schedule.end_time}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-zinc-400 font-bold">Prof. {schedule.instructor_name}</p>
                          <p className="text-xs text-zinc-500 uppercase tracking-wider">{schedule.technical_focus}</p>
                        </div>
                      </div>
                      {schedule.lesson_plan && (
                        <div className="mt-4 pt-4 border-t border-zinc-800">
                          <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Plano de Aula</h4>
                          <div className="text-zinc-300 text-sm whitespace-pre-wrap bg-black/50 p-4 rounded-xl border border-zinc-800/50">
                            {schedule.lesson_plan}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-4 pb-4">
                  {todaySchedules.map(schedule => (
                    <div key={`${schedule.id}-copy`} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shrink-0">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-black text-white uppercase">{schedule.activity}</h3>
                          <p className="text-emerald-500 font-bold">{schedule.start_time} - {schedule.end_time}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-zinc-400 font-bold">Prof. {schedule.instructor_name}</p>
                          <p className="text-xs text-zinc-500 uppercase tracking-wider">{schedule.technical_focus}</p>
                        </div>
                      </div>
                      {schedule.lesson_plan && (
                        <div className="mt-4 pt-4 border-t border-zinc-800">
                          <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Plano de Aula</h4>
                          <div className="text-zinc-300 text-sm whitespace-pre-wrap bg-black/50 p-4 rounded-xl border border-zinc-800/50">
                            {schedule.lesson_plan}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeCategory, setActiveCategory] = useState('performance');
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const [selectedAthleteData, setSelectedAthleteData] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [simulatedRole, setSimulatedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<any>(null);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const [editingAcademy, setEditingAcademy] = useState<Academy | null>(null);
  const [disciplineSubTab, setDisciplineSubTab] = useState<'evaluation' | 'merit'>('evaluation');
  const [competitionTab, setCompetitionTab] = useState<'tournaments' | 'results'>('tournaments');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isTvMode, setIsTvMode] = useState(false);
  const [isFightTimerOpen, setIsFightTimerOpen] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const { notifications, markAsRead } = useNotifications();
  const currentRole = simulatedRole || user?.role || 'athlete';

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthError(null);
      if (firebaseUser) {
        const isDeveloperEmail = firebaseUser.email === 'alphatech.fabio@gmail.com';
        
        try {
          // Try to get whitelist doc, but don't hang forever if offline
          const whitelistDoc = await getDoc(doc(db, 'whitelist', firebaseUser.email?.toLowerCase() || ''));
          const isWhitelisted = whitelistDoc.exists();
          
          if (!isWhitelisted && !isDeveloperEmail) {
            await signOut(auth);
            setAuthError("Seu e-mail não está na lista de permissão. Por favor, contate o administrador.");
            setUser(null);
          } else {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (isDeveloperEmail) {
                if (userData.role !== 'developer') {
                  try {
                    await updateDoc(doc(db, 'users', firebaseUser.uid), { role: 'developer' });
                  } catch (e) {
                    console.warn("Could not update developer role in Firestore (offline?)", e);
                  }
                }
                setUser({ id: firebaseUser.uid, ...userData, role: 'developer' } as User);
              } else {
                // ... (rest of the logic)
                if (userData.role === 'developer') {
                  await updateDoc(doc(db, 'users', firebaseUser.uid), { role: 'athlete' });
                  setUser({ id: firebaseUser.uid, ...userData, role: 'athlete' } as User);
                } else {
                  // Professor logic...
                  if (userData.role === 'professor') {
                    const profQuery = query(collection(db, 'professors'), where('email', '==', firebaseUser.email));
                    const profSnapshot = await getDocs(profQuery);
                    if (!profSnapshot.empty) {
                      const availableAcademies = [];
                      for (const profDoc of profSnapshot.docs) {
                        const profData = profDoc.data();
                        if (!profData.user_id) {
                          try { await updateDoc(profDoc.ref, { user_id: firebaseUser.uid }); } catch(e) {}
                        }
                        const academyDoc = await getDoc(doc(db, 'academies', profData.academy_id));
                        const academyName = academyDoc.exists() ? academyDoc.data().name : 'Academia Desconhecida';
                        availableAcademies.push({
                          academy_id: profData.academy_id,
                          academy_name: academyName,
                          permissions: profData.permissions
                        });
                      }
                      userData.available_academies = availableAcademies;
                      if (!userData.academy_id || !availableAcademies.find(a => a.academy_id === userData.academy_id)) {
                        const first = availableAcademies[0];
                        try {
                          await updateDoc(doc(db, 'users', firebaseUser.uid), { 
                            academy_id: first.academy_id,
                            professor_permissions: first.permissions
                          });
                        } catch(e) {}
                        userData.academy_id = first.academy_id;
                        userData.professor_permissions = first.permissions;
                      } else {
                        const current = availableAcademies.find(a => a.academy_id === userData.academy_id);
                        if (current && JSON.stringify(current.permissions) !== JSON.stringify(userData.professor_permissions)) {
                          try {
                            await updateDoc(doc(db, 'users', firebaseUser.uid), { 
                              professor_permissions: current.permissions
                            });
                          } catch(e) {}
                          userData.professor_permissions = current.permissions;
                        }
                      }
                    }
                  }
                  setUser({ id: firebaseUser.uid, ...userData } as User);
                }
              }
            } else {
              // New user
              let role = 'athlete';
              let academy_id = '';
              
              if (isDeveloperEmail) {
                role = 'developer';
              } else if (isWhitelisted) {
                const whitelistData = whitelistDoc.data();
                if (whitelistData?.role) {
                  role = whitelistData.role;
                }
                if (whitelistData?.academy_id) {
                  academy_id = whitelistData.academy_id;
                }
              }

              const newUser: User = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'Usuário',
                email: firebaseUser.email || '',
                role: role as any,
                academy_id: academy_id,
                created_at: new Date().toISOString()
              };
              
              try {
                await setDoc(doc(db, 'users', firebaseUser.uid), {
                  name: newUser.name,
                  email: newUser.email,
                  role: newUser.role,
                  academy_id: newUser.academy_id,
                  created_at: newUser.created_at
                });
              } catch (e) {
                console.warn("Could not create user doc in Firestore (offline?)", e);
              }
              
              setUser(newUser);
            }
          }
        } catch (error) {
          console.error("Auth sync error (likely Firestore offline):", error);
          // Fallback for developer if offline
          if (isDeveloperEmail) {
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Fabio Possato',
              email: firebaseUser.email || '',
              role: 'developer',
              created_at: new Date().toISOString()
            } as User);
          } else {
            setAuthError("Erro de conexão com o banco de dados. Verifique sua internet.");
          }
        }
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady || !user) return;

    // Seed initial documents if empty or incomplete
    const seedInitialData = async () => {
      if (user?.role !== 'developer') return; // Only developer seeds data
      try {
        const docsSnapshot = await getDocs(collection(db, 'documents'));
        if (docsSnapshot.size < 10) {
          // If less than 10 documents, we likely need to re-seed with the full list
          const initialDocs = [
            { 
              title: 'TAF – Teste de Aptidão Física', 
              type: 'Avaliação', 
              content: 'TAF – TESTE DE APTIDÃO FÍSICA\nPAC – Programa de Formação de Atleta Campeão\n\nObjetivo:\nAvaliar o nível de condicionamento físico específico para atletas de Jiu-Jitsu.\n\nTESTE 1 — BARRA FIXA\nTESTE 2 — FLEXÃO DE BRAÇO\nTESTE 3 — ISOMETRIA DE PEGADA NO QUIMONO\nTESTE 4 — SPRINT 50m\nTESTE 5 — BURPEES 2 MINUTOS\nTESTE 6 — SHUTTLE RUN (IDA E VOLTA)\nTESTE 7 — ROUND DE RESISTÊNCIA\nTESTE 8 — ABDOMINAL 2 MINUTOS' 
            },
            { 
              title: 'Termo de Responsabilidade e Compromisso', 
              type: 'Legal', 
              content: 'TERMO DE RESPONSABILIDADE E COMPROMISSO\nPAC – Programa de Formação de Atleta Campeão\n\nDeclaro estar ciente de que o treinamento esportivo de alto rendimento envolve riscos físicos, incluindo lesões musculares, articulares e outras intercorrências.\n\nDeclaro que estou fisicamente apto para participar do programa ou apresentarei liberação médica quando solicitado.\n\nComprometo-me a:\n1. Seguir rigorosamente as orientações da equipe técnica.\n2. Participar das atividades programadas conforme cronograma.\n3. Cumprir as regras de disciplina e conduta do programa.\n4. Informar imediatamente qualquer dor, lesão ou problema de saúde.' 
            },
            { 
              title: 'Teste Psicológico PAC', 
              type: 'Avaliação', 
              content: 'TESTE PSICOLÓGICO – PAC\nPrograma de Formação de Atleta Campeão\n\nObjetivo:\nAvaliar o perfil psicológico do atleta para identificar sua aptidão para treinamento de alto rendimento no Programa PAC.\n\nO teste avalia as seguintes dimensões psicológicas:\n1. Disciplina\n2. Resiliência\n3. Mentalidade Competitiva\n4. Controle Emocional\n5. Responsabilidade\n6. Tolerância à Dor e Desconforto\n7. Mentalidade de Crescimento' 
            },
            { 
              title: 'Código de Conduta', 
              type: 'Institucional', 
              content: 'CÓDIGO DE CONDUTA\nPAC – Programa de Formação de Atleta Campeão\n\nO atleta integrante do PAC compromete-se a seguir os princípios abaixo:\n\n1. DISCIPLINA: Cumprir rigorosamente horários, treinos e atividades.\n2. OBEDIÊNCIA AO PROGRAMA: Todo planejamento é definido pela equipe técnica.\n3. NUTRIÇÃO: Seguir rigorosamente o plano alimentar estabelecido.\n4. SONO: Manter rotina regular de sono.\n5. CONDUTA: Comportamento respeitoso com todos.\n6. COMPROMISSO: Faltas injustificadas podem resultar em desligamento.\n7. RESPONSABILIDADE: O atleta é responsável por seu esforço.\n8. OBJETIVO: Buscar excelência e desempenho competitivo máximo.' 
            },
            { 
              title: 'Código Mental do Campeão', 
              type: 'Institucional', 
              content: 'CÓDIGO MENTAL DO CAMPEÃO\nPAC – Programa de Formação de Atleta Campeão\n\nPrincípios que orientam a mentalidade dos atletas do programa:\n\n1. COMPROMISSO: Excelência exige dedicação contínua.\n2. CONSISTÊNCIA: Resultados duradouros são construídos através de esforço consistente.\n3. FOCO: Atenção total no processo de treinamento.\n4. RESILIÊNCIA: Aprender com derrotas e retornar mais forte.\n5. CONTROLE EMOCIONAL: Manter clareza mental sob pressão.\n6. DISCIPLINA MENTAL: Foco em soluções e aprendizado.\n7. AUTOCONFIANÇA: Construída através de preparação consistente.\n8. CORAGEM: Enfrentar desafios e adversários fortes.\n9. HUMILDADE: Sempre existe algo a aprender.\n10. MENTALIDADE de CAMPEÃO: Entrar para evoluir e vencer.' 
            },
            { 
              title: 'Dossiê do Atleta', 
              type: 'Administrativo', 
              content: 'DOSSIÊ DO ATLETA\nPAC – Programa de Formação de Atleta Campeão\n\n1. IDENTIFICAÇÃO\n2. OBJETIVOS DO ATLETA\n3. AVALIAÇÃO FÍSICA\n4. AVALIAÇÃO TÉCNICA\n5. AVALIAÇÃO PSICOLÓGICA\n6. AVALIAÇÃO FÍSICA – TAF\n7. PLANO DE DESENVOLVIMENTO INDIVIDUAL\n8. CONTROLE DE PESO\n9. CONTROLE DE SONO\n10. HISTÓRICO DE COMPETIÇÕES\n11. OBSERVAÇÕES DO TREINADOR' 
            },
            { 
              title: 'Manual do Atleta Campeão', 
              type: 'Institucional', 
              content: 'MANUAL DO ATLETA CAMPEÃO\nPAC – Programa de Formação de Atleta Campeão\n\nMISSÃO: Formar atletas capazes de competir e vencer nos maiores campeonatos de Jiu-Jitsu do mundo.\nVISÃO: Construir uma geração de atletas disciplinados, resilientes e preparados.\nVALORES: Disciplina, Respeito, Responsabilidade, Excelência, Superação.\n\nPRINCÍPIOS DO ATLETA CAMPEÃO:\n1. DISCIPLINA\n2. CONSISTÊNCIA\n3. RESPONSABILIDADE\n4. HUMILDADE\n5. RESILIÊNCIA' 
            },
            { 
              title: 'Mapa de Valências do Atleta', 
              type: 'Técnico', 
              content: 'MAPA DE VALÊNCIAS DO ATLETA DE JIU-JITSU\nPAC – Programa de Formação de Atleta Campeão\n\nDimensões do desenvolvimento do atleta:\n1. Valências Técnicas\n2. Valências Físicas\n3. Valências Cognitivas\n4. Valências Psicológicas\n5. Valências Comportamentais' 
            },
            { 
              title: 'Modelo de Centro de Alto Rendimento', 
              type: 'Institucional', 
              content: 'MODELO DE CENTRO DE ALTO RENDIMENTO\nPAC – Programa de Formação de Atleta Campeão\n\nESTRUTURA TÉCNICA: Treinadores, Preparador Físico, Nutricionista, Psicólogo, Fisioterapeuta.\nESTRUTURA DE TREINAMENTO: Tatame, Preparação Física.\nÁREA DE RECUPERAÇÃO: Liberação miofascial, alongamento, mobilidade.\nSUPORTE AO ATLETA: Acompanhamento multidisciplinar.' 
            },
            { 
              title: 'Pirâmide de Formação de Campeões', 
              type: 'Institucional', 
              content: 'PIRÂMIDE DE FORMAÇÃO DE CAMPEÕES\nPAC – Programa de Formação de Atleta Campeão\n\nNÍVEL 1 – BASE ESPORTIVA\nNÍVEL 2 – FORMAÇÃO COMPETITIVA\nNÍVEL 3 – DESENVOLVIMENTO DE ALTO RENDIMENTO\nNÍVEL 4 – ELITE COMPETITIVA' 
            },
            { 
              title: 'Sistema de Carreira do Atleta', 
              type: 'Institucional', 
              content: 'SISTEMA DE CARREIRA DO ATLETA\nPAC – Programa de Formação de Atleta Campeão\n\nFases de desenvolvimento:\nFASE 1 – DESCOBERTA COMPETITIVA\nFASE 2 – DESENVOLVIMENTO COMPETITIVO\nFASE 3 – ALTO RENDIMENTO\nFASE 4 – ELITE COMPETITIVA' 
            },
            { 
              title: 'Sistema de Identidade do Atleta', 
              type: 'Institucional', 
              content: 'SISTEMA DE IDENTIDADE DO ATLETA\nPAC – Programa de Formação de Atleta Campeão\n\nPilares fundamentais:\n1. Disciplina\n2. Responsabilidade\n3. Resiliência\n4. Excelência\n5. Espírito competitivo' 
            },
            { 
              title: 'Sistema de Pontuação do Atleta', 
              type: 'Administrativo', 
              content: 'SISTEMA DE PONTUAÇÃO DO ATLETA\nPAC – Programa de Formação de Atleta Campeão\n\nPilares da pontuação:\n1. TÉCNICA (100 pts)\n2. CONDICIONAMENTO FÍSICO (100 pts)\n3. PSICOLÓGICO (100 pts)\n4. DISCIPLINA (100 pts)\n5. RESULTADOS COMPETITIVOS (100 pts)\n\nTotal máximo: 500 pontos.' 
            },
            { 
              title: 'Sistema de Ranking Interno', 
              type: 'Administrativo', 
              content: 'SISTEMA DE RANKING INTERNO\nPAC – Programa de Formação de Atleta Campeão\n\nCritérios de pontuação:\n1. PRESENÇA EM TREINOS\n2. DESEMPENHO EM TREINOS\n3. RESULTADOS EM SPARRING\n4. RESULTADOS EM COMPETIÇÕES\n5. EVOLUÇÃO FÍSICA' 
            },
            { 
              title: 'Sistema de Seleção de Atletas', 
              type: 'Administrativo', 
              content: 'SISTEMA DE SELEÇÃO DE ATLETAS\nPAC – Programa de Formação de Atleta Campeão\n\nEtapas da seleção:\nETAPA 1 – INSCRIÇÃO\nETAPA 2 – AVALIAÇÃO FÍSICA\nETAPA 3 – AVALIAÇÃO TÉCNICA\nETAPA 4 – AVALIAÇÃO PSICOLÓGICA' 
            },
            { 
              title: 'Sistema Operacional do PAC', 
              type: 'Institucional', 
              content: 'SISTEMA OPERACIONAL DO PAC\nPrograma de Formação de Atleta Campeão\n\nIntegra:\n• seleção de atletas\n• avaliação de desempenho\n• planejamento de treinamento\n• monitoramento de evolução\n• progressão esportiva' 
            }
          ];

          // Add missing initial docs instead of clearing everything
          for (const d of initialDocs) {
            const exists = docsSnapshot.docs.find(doc => doc.data().title === d.title);
            if (!exists) {
              await addDoc(collection(db, 'documents'), d);
            }
          }
        }

        // Media seeding
        const mediaSnapshot = await getDocs(collection(db, 'media'));
        const initialMedia = [
          { 
            title: 'Apresentação Institucional', 
            url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 
            type: 'video', 
            thumbnail: 'https://picsum.photos/seed/pac-video/1280/720', 
            description: 'Vídeo oficial de apresentação do Programa Atleta Campeão.'
          },
          { 
            title: 'Manual de Metodologia PDF', 
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 
            type: 'pdf', 
            thumbnail: 'https://picsum.photos/seed/pac-pdf/1280/720', 
            description: 'Manual completo com a metodologia e pilares do PAC.'
          }
        ];

        for (const m of initialMedia) {
          const exists = mediaSnapshot.docs.find(doc => doc.data().title === m.title);
          if (!exists) {
            await addDoc(collection(db, 'media'), {
              ...m,
              owner_id: user?.id || 'system',
              createdAt: Timestamp.now()
            });
          }
        }

        const academiesSnapshot = await getDocs(collection(db, 'academies'));
        if (academiesSnapshot.empty) {
          const initialAcademies = [
            { name: 'PAC Central', head_coach: 'Fabio Gurgel', location: 'São Paulo, SP', lat: -23.5505, lng: -46.6333, contact: 'contato@pac.com.br', created_at: new Date().toISOString() },
            { name: 'PAC Rio', head_coach: 'Renzo Gracie', location: 'Rio de Janeiro, RJ', lat: -22.9068, lng: -43.1729, contact: 'rio@pac.com.br', created_at: new Date().toISOString() },
            { name: 'PAC Sul', head_coach: 'Mário Reis', location: 'Porto Alegre, RS', lat: -30.0346, lng: -51.2177, contact: 'sul@pac.com.br', created_at: new Date().toISOString() }
          ];
          for (const a of initialAcademies) {
            const docRef = await addDoc(collection(db, 'academies'), a);
            
            // Add a sample athlete for each academy with location
            await addDoc(collection(db, 'athletes'), {
              name: `Atleta ${a.name}`,
              email: `atleta@${a.name.toLowerCase().replace(' ', '')}.com`,
              weight_class: '70kg',
              belt: 'Azul',
              birth_date: '2000-01-01',
              goals: 'Ser campeão mundial',
              academy_id: docRef.id,
              score: 85,
              classification: 'Elite',
              user_id: 'sample-user',
              location: {
                lat: a.lat + (Math.random() * 0.1 - 0.05),
                lng: a.lng + (Math.random() * 0.1 - 0.05),
                city: a.location.split(',')[0],
                country: 'Brasil'
              }
            });
          }
        }

        const plansSnapshot = await getDocs(collection(db, 'plans'));
        if (plansSnapshot.empty) {
          const initialPlans = [
            { 
              name: 'Plano Atleta Mensal', 
              type: 'Presencial', 
              frequency: 'Mensal', 
              basePrice: 250, 
              discount: 0, 
              isSocial: false, 
              isScholarship: false, 
              target: 'athletes',
              owner_id: 'system',
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now()
            },
            { 
              name: 'Plano Atleta Social', 
              type: 'Presencial', 
              frequency: 'Mensal', 
              basePrice: 250, 
              discount: 100, 
              isSocial: true, 
              isScholarship: false, 
              target: 'athletes',
              owner_id: 'system',
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now()
            },
            { 
              name: 'Plano Academia Pro', 
              type: 'A distância', 
              frequency: 'Mensal', 
              basePrice: 1500, 
              discount: 0, 
              isSocial: false, 
              isScholarship: false, 
              target: 'academies',
              owner_id: 'system',
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now()
            }
          ];
          for (const p of initialPlans) {
            await addDoc(collection(db, 'plans'), p);
          }
        }
      } catch (error) {
        console.error('Error seeding data:', error);
      }
    };
    seedInitialData();

    // Role-based queries
    if (!user && currentRole !== 'developer') {
      setAthletes([]);
      setAcademies([]);
      setPlans([]);
      return;
    }

    let athletesQuery = collection(db, 'athletes') as any;
    if (user?.role !== 'developer') {
      if (currentRole === 'academy' && user?.academy_id) {
        athletesQuery = query(collection(db, 'athletes'), where('academy_id', '==', user.academy_id));
      } else if (currentRole === 'professor') {
        if (user?.unit_ids && user.unit_ids.length > 0) {
          athletesQuery = query(collection(db, 'athletes'), where('unit_id', 'in', user.unit_ids));
        } else if (user?.academy_id) {
          athletesQuery = query(collection(db, 'athletes'), where('academy_id', '==', user.academy_id));
        }
      } else if (currentRole === 'athlete') {
        athletesQuery = query(collection(db, 'athletes'), where('email', '==', user?.email));
      } else {
        setAthletes([]);
        return;
      }
    }

    const unsubscribeAthletes = onSnapshot(athletesQuery, (snapshot) => {
      const athleteData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Athlete));
      setAthletes(athleteData);
    }, (error) => {
      console.error('Athletes subscription error:', error);
      // Don't throw here to avoid SDK crash, just log or handle gracefully
    });

    let unsubscribeAcademies: () => void = () => {};
    if (user?.role === 'developer') {
      unsubscribeAcademies = onSnapshot(collection(db, 'academies'), (snapshot) => {
        const academyData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Academy));
        setAcademies(academyData);
      }, (error) => console.error('Academies list subscription error:', error));
    } else {
      // For non-developers, show academies they own OR the one they belong to
      const q = query(collection(db, 'academies'), or(where('owner_id', '==', user?.id), where(documentId(), '==', user?.academy_id || '')));
      unsubscribeAcademies = onSnapshot(q, (snapshot) => {
        const owned = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Academy));
        setAcademies(owned);
      }, (error) => console.error('Academies subscription error:', error));
    }

    let unsubscribePlans: () => void = () => {};
    let plansQuery = collection(db, 'plans') as any;
    if (user?.role === 'developer') {
      // Developers see everything
      plansQuery = collection(db, 'plans');
    } else if (currentRole === 'academy') {
      plansQuery = query(collection(db, 'plans'), or(where('owner_id', '==', user?.id), where('owner_id', '==', 'system')));
    } else if (user?.academy_id) {
      plansQuery = query(collection(db, 'plans'), or(where('academy_id', '==', user.academy_id), where('owner_id', '==', 'system')));
    }

    unsubscribePlans = onSnapshot(plansQuery, (snapshot) => {
      const planData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plan));
      setPlans(planData);
    }, (error) => console.error('Plans subscription error:', error));

    return () => {
      unsubscribeAthletes();
      unsubscribeAcademies();
      unsubscribePlans();
    };
  }, [isAuthReady, user, currentRole]);

  useEffect(() => {
    if (selectedAthleteId) {
      const unsubscribe = onSnapshot(doc(db, 'athletes', selectedAthleteId), async (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          // Fetch subcollections
          const physical = await getDocs(collection(db, `athletes/${selectedAthleteId}/physical_evaluations`));
          const psychological = await getDocs(collection(db, `athletes/${selectedAthleteId}/psychological_evaluations`));
          const training = await getDocs(collection(db, `athletes/${selectedAthleteId}/training_logs`));
          const competitions = await getDocs(collection(db, `athletes/${selectedAthleteId}/competitions`));
          const nutrition = await getDocs(collection(db, `athletes/${selectedAthleteId}/nutrition_plans`));
          const technical = await getDocs(collection(db, `athletes/${selectedAthleteId}/technical_evaluations`));
          const health = await getDocs(collection(db, `athletes/${selectedAthleteId}/health_logs`));
          const discipline = await getDocs(collection(db, `athletes/${selectedAthleteId}/discipline_logs`));
          
          setSelectedAthleteData({
            id: snapshot.id,
            ...data,
            physical: physical.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            psychological: psychological.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            training: training.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            competitions: competitions.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            nutrition: nutrition.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            technical: technical.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            health: health.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            discipline: discipline.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          });
        }
      }, (error) => handleFirestoreError(error, OperationType.GET, `athletes/${selectedAthleteId}`));
      return () => unsubscribe();
    } else {
      setSelectedAthleteData(null);
    }
  }, [selectedAthleteId]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const filteredNavCategories = useMemo(() => {
    return NAV_CATEGORIES.map(cat => ({
      ...cat,
      items: cat.items.filter(item => {
        if (!item.roles) return true;
        if (item.roles.includes(currentRole as any)) {
          // Additional check for professors based on delegated permissions
          if (currentRole === 'professor' && user?.professor_permissions) {
            const perms = user.professor_permissions;
            // Pedagogical functions
            if (['taf', 'technical', 'psychology', 'health', 'discipline', 'training', 'graduation'].includes(item.id)) {
              return perms.pedagogica;
            }
            // Management/Administrative functions
            if (['athletes', 'selection', 'schedules', 'meritocracy', 'ai', 'settings'].includes(item.id)) {
              return perms.gestao || perms.administrativa;
            }
          }
          return true;
        }
        return false;
      })
    })).filter(cat => cat.items.length > 0);
  }, [currentRole, user]);

  const handleAcademySwitch = async (academyId: string) => {
    if (!user || user.role !== 'professor') return;
    
    const academy = user.available_academies?.find(a => a.academy_id === academyId);
    if (!academy) return;

    try {
      await updateDoc(doc(db, 'users', user.id), {
        academy_id: academyId,
        professor_permissions: academy.permissions
      });
      
      setUser({
        ...user,
        academy_id: academyId,
        professor_permissions: academy.permissions
      });
      
      // Reset view to dashboard
      setActiveCategory('performance');
      setActiveTab('dashboard');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.id}`);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setSimulatedRole(null);
  };

  const currentUserAthlete = athletes.find(a => a.email === user?.email);
  const currentUserAcademy = academies.find(a => a.contact === user?.email);
  const isBlocked = currentUserAthlete?.is_blocked || currentUserAcademy?.is_blocked;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/20">
            <Trophy size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">PAC - Atleta Campeão</h1>
          <p className="text-zinc-400 text-sm mb-8">
            Sistema de Gestão de Alto Rendimento. Faça login para acessar seu painel.
          </p>
          
          {authError && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold">
              {authError}
            </div>
          )}

          <button 
            onClick={handleLogin}
            className="w-full bg-white hover:bg-zinc-100 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3"
          >
            <LogIn size={20} />
            Entrar com Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {isTvMode && <TvMode user={user} academies={academies} athletes={athletes} onClose={() => setIsTvMode(false)} isLooping={isLooping} setIsLooping={setIsLooping} />}
      {isFightTimerOpen && <FightTimer onClose={() => setIsFightTimerOpen(false)} />}
      {isBlocked && <BlockedOverlay />}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingAthlete(null); setEditingProfessor(null); setEditingMetric(null); setEditingAcademy(null); }} 
        title={
          activeTab === 'athletes' ? (editingAthlete ? "Editar Atleta" : "Novo Atleta") : 
          activeTab === 'academies' ? (editingAcademy ? "Editar Academia" : "Nova Academia") :
          activeTab === 'professors' ? (editingProfessor ? "Editar Professor" : "Novo Professor") :
          activeTab === 'taf' ? (editingMetric ? "Editar Avaliação TAF" : "Nova Avaliação TAF") : 
          activeTab === 'psychology' ? (editingMetric ? "Editar Diagnóstico Mental" : "Diagnóstico Mental PAC") :
          activeTab === 'technical' ? (editingMetric ? "Editar Avaliação Técnica" : "Avaliação Técnica PAC") :
          activeTab === 'health' ? (editingMetric ? "Editar Telemetria/Biometria" : "Telemetria & Biometria PAC") :
          activeTab === 'discipline' ? (editingMetric ? "Editar Registro Disciplinar" : "Registro de Disciplina PAC") :
          activeTab === 'competitions' ? (editingMetric?.type === 'new_tournament' ? "Criar Campeonato" : (editingMetric ? "Editar Competição" : "Registrar Competição")) :
          (editingMetric ? "Editar Log de Treino" : "Registrar Treino")
        }
      >
        {activeTab === 'athletes' && <AthleteForm currentUser={user} academies={academies} plans={plans} athlete={editingAthlete} onSuccess={() => { setIsModalOpen(false); setEditingAthlete(null); }} />}
        {activeTab === 'academies' && <AcademyForm plans={plans} academy={editingAcademy} onSuccess={() => { setIsModalOpen(false); setEditingAcademy(null); }} />}
        {activeTab === 'professors' && <ProfessorForm academyId={user?.academy_id || ''} professor={editingProfessor} onSuccess={() => { setIsModalOpen(false); setEditingProfessor(null); }} />}
        {activeTab === 'taf' && <PhysicalEvaluationForm athletes={athletes} onSuccess={() => { setIsModalOpen(false); setEditingMetric(null); }} editingMetric={editingMetric} />}
        {activeTab === 'psychology' && <PsychologicalEvaluationForm athletes={athletes} onSuccess={() => { setIsModalOpen(false); setEditingMetric(null); }} editingMetric={editingMetric} />}
        {activeTab === 'technical' && <TechnicalEvaluationForm athletes={athletes} onSuccess={() => { setIsModalOpen(false); setEditingMetric(null); }} editingMetric={editingMetric} />}
        {activeTab === 'health' && <HealthMetricsForm athletes={athletes} onSuccess={() => { setIsModalOpen(false); setEditingMetric(null); }} editingMetric={editingMetric} />}
        {activeTab === 'discipline' && (
          <div className="space-y-6">
            {!editingMetric && (
              <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 mb-6">
                <button 
                  onClick={() => setDisciplineSubTab('evaluation')}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                    disciplineSubTab === 'evaluation' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  Avaliação Periódica
                </button>
                <button 
                  onClick={() => setDisciplineSubTab('merit')}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                    disciplineSubTab === 'merit' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  Mérito / Demérito
                </button>
              </div>
            )}
            {(editingMetric ? (editingMetric.average_score !== undefined ? 'evaluation' : 'merit') : disciplineSubTab) === 'evaluation' ? (
              <DisciplineForm athletes={athletes} onSuccess={() => { setIsModalOpen(false); setEditingMetric(null); }} editingMetric={editingMetric} />
            ) : (
              <MeritDemeritForm athletes={athletes} onSuccess={() => { setIsModalOpen(false); setEditingMetric(null); }} editingMetric={editingMetric} />
            )}
          </div>
        )}
        {activeTab === 'training' && <TrainingLogForm athletes={athletes} onSuccess={() => { setIsModalOpen(false); setEditingMetric(null); }} editingMetric={editingMetric} />}
        {activeTab === 'competitions' && (
          editingMetric?.type === 'new_tournament' && user ? (
            <TournamentManager user={user} onSuccess={() => { setIsModalOpen(false); setEditingMetric(null); }} />
          ) : (
            <CompetitionForm athletes={athletes} academies={academies} onSuccess={() => setIsModalOpen(false)} editingMetric={editingMetric} user={user} />
          )
        )}
      </Modal>

      {/* Main Content */}
      <main className="min-h-screen p-4 md:p-8 lg:p-10 pb-32">
        {/* Header & Carousel Navigation */}
        <div className="max-w-7xl mx-auto space-y-8 mb-12">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Trophy className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-white">PAC <span className="text-emerald-500 text-sm font-bold tracking-widest ml-2 uppercase">Atleta Campeão</span></h1>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] leading-none">Sistema de Gestão de Alto Rendimento</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user?.role === 'professor' && user.available_academies && user.available_academies.length > 1 && (
                <AcademySwitcher user={user} onSwitch={handleAcademySwitch} />
              )}
              {user?.role === 'developer' && (
                <div className="hidden xl:block">
                  <RoleSwitcher currentRole={currentRole} onSwitch={setSimulatedRole} />
                </div>
              )}
              <div className="text-right hidden md:block">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Bem-vindo,</p>
                <p className="text-sm font-black text-white">{user?.name || 'Usuário'}</p>
              </div>
              <div className="flex items-center gap-3 relative">
                {(currentRole === 'professor' || currentRole === 'academy' || currentRole === 'developer') && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsTvMode(true);
                        if (document.documentElement.requestFullscreen) {
                          document.documentElement.requestFullscreen().catch(err => console.error("Erro ao entrar em fullscreen:", err));
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-xl font-bold text-sm transition-colors border border-emerald-500/20"
                    >
                      <MonitorPlay size={18} />
                      <span className="hidden sm:inline">Modo TV</span>
                    </button>
                    <button
                      onClick={() => setIsFightTimerOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white hover:bg-zinc-700 rounded-xl font-bold text-sm transition-colors border border-zinc-700"
                    >
                      <Timer size={18} />
                      <span className="hidden sm:inline">Cronômetro</span>
                    </button>
                  </div>
                )}
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-zinc-900" />
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-4 w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-[100] overflow-hidden"
                    >
                      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                        <h3 className="font-bold text-white text-sm">Notificações</h3>
                        {unreadCount > 0 && <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">{unreadCount} novas</span>}
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                          notifications.map(n => (
                            <div 
                              key={n.id} 
                              onClick={() => markAsRead(n.id)}
                              className={cn(
                                "p-4 border-b border-zinc-800/50 cursor-pointer transition-colors hover:bg-zinc-800/50",
                                !n.read && "bg-emerald-500/5"
                              )}
                            >
                              <div className="font-bold text-xs text-white mb-1">{n.title}</div>
                              <div className="text-xs text-zinc-500 leading-relaxed">{n.message}</div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-zinc-600 text-xs italic">Nenhuma notificação no momento.</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  onClick={() => signOut(auth)}
                  className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-rose-500 transition-all"
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </header>

          {/* Categorized Navigation */}
          <div className="space-y-4">
            {/* Main Categories */}
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {filteredNavCategories.map((category) => (
                <CategoryNavItem 
                  key={category.id}
                  icon={category.icon}
                  label={category.label}
                  active={activeCategory === category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setActiveTab(category.items[0].id);
                    setSelectedAthleteId(null);
                  }}
                />
              ))}
            </div>

            {/* Sub-navigation */}
            <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar border-t border-zinc-900">
              {filteredNavCategories.find(c => c.id === activeCategory)?.items.map((item) => (
                <SubNavItem 
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeTab === item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSelectedAthleteId(null);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Main Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedAthleteId ? `athlete-${selectedAthleteId}` : activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {selectedAthleteId && selectedAthleteData ? (
                <AthleteDossier athlete={selectedAthleteData} academies={academies} plans={plans} onBack={() => setSelectedAthleteId(null)} currentRole={currentRole} />
              ) : (
                <>
                  {activeTab === 'dashboard' && (
                    currentRole === 'athlete' && currentUserAthlete ? (
                      <AthleteDossier athlete={currentUserAthlete} academies={academies} plans={plans} onBack={null} currentRole={currentRole} />
                    ) : (
                      <>
                        {user?.email === 'alphatech.fabio@gmail.com' && <MigrationTool />}
                        <Dashboard athletes={athletes} onViewRanking={() => { setActiveTab('ranking'); setActiveCategory('performance'); }} />
                      </>
                    )
                  )}
                  {activeTab === 'athletes' && (
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <button 
                          onClick={() => { setEditingAthlete(null); setIsModalOpen(true); }}
                          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                        >
                          <Plus size={20} />
                          Novo Atleta
                        </button>
                      </div>
                      <AthleteList 
                        athletes={athletes} 
                        academies={academies} 
                        onSelect={(id) => setSelectedAthleteId(id)} 
                        onEdit={(athlete) => { setEditingAthlete(athlete); setIsModalOpen(true); }}
                      />
                    </div>
                  )}
                  {activeTab === 'academies' && <AcademiesView academies={academies} athletes={athletes} onAdd={() => setIsModalOpen(true)} onEdit={(academy) => { setEditingAcademy(academy); setIsModalOpen(true); }} user={user} currentRole={currentRole} />}
                  {activeTab === 'professors' && <ProfessorsView user={user} academies={academies} currentRole={currentRole} />}
                  {activeTab === 'selection' && <SelectionLaboratory athletes={athletes} academies={academies} onSelect={(id) => setSelectedAthleteId(id)} />}
                  {activeTab === 'finance' && user && <FinanceView athletes={athletes} academies={academies} user={user} />}
                  {activeTab === 'taf' && (
                    <div className="space-y-6">
                      <div className="flex justify-end">
                        <button 
                          onClick={() => { setEditingMetric(null); setIsModalOpen(true); }}
                          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                        >
                          <Plus size={20} />
                          Nova Avaliação
                        </button>
                      </div>
                      <MetricHistory 
                        type="taf" 
                        athletes={athletes} 
                        onEdit={(item) => { setEditingMetric(item); setIsModalOpen(true); }}
                      />
                    </div>
                  )}
                  {activeTab === 'psychology' && (
                    <div className="space-y-6">
                      <div className="flex justify-end">
                        <button 
                          onClick={() => { setEditingMetric(null); setIsModalOpen(true); }}
                          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                        >
                          <Plus size={20} />
                          Novo Diagnóstico
                        </button>
                      </div>
                      <MetricHistory 
                        type="psychology" 
                        athletes={athletes} 
                        onEdit={(item) => { setEditingMetric(item); setIsModalOpen(true); }}
                      />
                    </div>
                  )}
                  {activeTab === 'technical' && (
                    <div className="space-y-6">
                      <div className="flex justify-end">
                        <button 
                          onClick={() => { setEditingMetric(null); setIsModalOpen(true); }}
                          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                        >
                          <Plus size={20} />
                          Nova Avaliação Técnica
                        </button>
                      </div>
                      <MetricHistory 
                        type="technical" 
                        athletes={athletes} 
                        onEdit={(item) => { setEditingMetric(item); setIsModalOpen(true); }}
                      />
                    </div>
                  )}
                  {activeTab === 'health' && (
                    <div className="space-y-6">
                      <div className="flex justify-end">
                        <button 
                          onClick={() => { setEditingMetric(null); setIsModalOpen(true); }}
                          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                        >
                          <Plus size={20} />
                          Lançar Telemetria/Biometria
                        </button>
                      </div>
                      <MetricHistory 
                        type="health" 
                        athletes={athletes} 
                        onEdit={(item) => { setEditingMetric(item); setIsModalOpen(true); }}
                      />
                    </div>
                  )}
                  {activeTab === 'discipline' && (
                    <div className="space-y-6">
                      <div className="flex justify-end">
                        <button 
                          onClick={() => { setEditingMetric(null); setIsModalOpen(true); }}
                          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                        >
                          <Plus size={20} />
                          Novo Registro
                        </button>
                      </div>
                      <MetricHistory 
                        type="discipline" 
                        athletes={athletes} 
                        onEdit={(item) => { setEditingMetric(item); setIsModalOpen(true); }}
                      />
                    </div>
                  )}
                  {activeTab === 'training' && (
                    <div className="space-y-6">
                      <div className="flex justify-end">
                        <button 
                          onClick={() => { setEditingMetric(null); setIsModalOpen(true); }}
                          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                        >
                          <Plus size={20} />
                          Registrar Treino
                        </button>
                      </div>
                      <MetricHistory 
                        type="training" 
                        athletes={athletes} 
                        onEdit={(item) => { setEditingMetric(item); setIsModalOpen(true); }}
                      />
                    </div>
                  )}
                  {activeTab === 'competitions' && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
                        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 w-fit">
                          <button
                            onClick={() => setCompetitionTab('tournaments')}
                            className={cn(
                              "px-6 py-2 rounded-lg font-bold text-sm transition-all",
                              competitionTab === 'tournaments' ? "bg-emerald-500 text-white shadow-lg" : "text-zinc-400 hover:text-white"
                            )}
                          >
                            Campeonatos
                          </button>
                          <button
                            onClick={() => setCompetitionTab('results')}
                            className={cn(
                              "px-6 py-2 rounded-lg font-bold text-sm transition-all",
                              competitionTab === 'results' ? "bg-emerald-500 text-white shadow-lg" : "text-zinc-400 hover:text-white"
                            )}
                          >
                            Meus Resultados
                          </button>
                        </div>
                        {competitionTab === 'tournaments' && user && ['professor', 'academy', 'developer'].includes(user.role) && (
                          <button 
                            onClick={() => { setEditingMetric({ type: 'new_tournament' }); setIsModalOpen(true); }}
                            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                          >
                            <Trophy size={20} />
                            Criar Campeonato
                          </button>
                        )}
                        {competitionTab === 'results' && (
                          <button 
                            onClick={() => { setEditingMetric(null); setIsModalOpen(true); }}
                            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                          >
                            <Plus size={20} />
                            Registrar Resultado
                          </button>
                        )}
                      </div>

                      {competitionTab === 'tournaments' && user && (
                        <TournamentList user={user} athletes={athletes} />
                      )}

                      {competitionTab === 'results' && (
                        <MetricHistory 
                          type="competitions" 
                          athletes={athletes} 
                          onEdit={(item) => { setEditingMetric(item); setIsModalOpen(true); }}
                        />
                      )}
                    </div>
                  )}
                  {activeTab === 'meritocracy' && (
                    <div className="space-y-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-black text-white uppercase tracking-tighter">Algoritmo de Meritocracia PAC</h2>
                          <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mt-1">Análise detalhada da pontuação dos atletas</p>
                        </div>
                        <select 
                          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-emerald-500"
                          onChange={(e) => setSelectedAthleteId(e.target.value)}
                          value={selectedAthleteId || ''}
                        >
                          <option value="">Selecionar Atleta</option>
                          {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                      </div>
                      
                      {selectedAthleteId && selectedAthleteData ? (
                        <MeritocracyView athlete={selectedAthleteData} />
                      ) : (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
                          <BarChart3 size={48} className="text-zinc-700 mx-auto mb-4" />
                          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Selecione um atleta para visualizar o detalhamento da meritocracia</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'ranking' && <RankingView athletes={athletes} />}
                  {activeTab === 'community' && <CommunityView athletes={athletes} academyId={user?.academy_id || ''} />}
                  {activeTab === 'challenges' && <ChallengesView />}
                  {activeTab === 'ai' && <PerformanceAIView athletes={athletes} />}
                  {activeTab === 'map' && <MapView athletes={athletes} academies={academies} />}
                  {activeTab === 'library' && <LibraryView athletes={athletes} />}
                  {activeTab === 'technical_library' && <TechnicalLibraryView user={user} />}
                  {activeTab === 'presentations' && <PresentationsView user={user} />}
                  {activeTab === 'audit' && (
                    <div className="p-8">
                      <GlobalAuditView />
                    </div>
                  )}
                  {activeTab === 'settings' && (
                    <SettingsView 
                      user={user} 
                      currentRole={currentRole}
                      setActiveTab={setActiveTab}
                      setActiveCategory={setActiveCategory}
                      setIsModalOpen={setIsModalOpen}
                    />
                  )}
                  {activeTab === 'graduation' && <GraduationView athletes={athletes} role={currentRole} />}
                  {activeTab === 'checkin' && <CheckInSystem user={user} currentRole={currentRole} academies={academies} />}
                  {activeTab === 'schedules' && <ScheduleManager user={user} currentRole={currentRole} academies={academies} />}
                  {activeTab === 'users' && user && <UserManagement academies={academies} currentUser={user} />}
                  {(activeTab !== 'dashboard' && activeTab !== 'athletes' && activeTab !== 'taf' && activeTab !== 'training' && activeTab !== 'ranking' && activeTab !== 'community' && activeTab !== 'challenges' && activeTab !== 'ai' && activeTab !== 'map' && activeTab !== 'library' && activeTab !== 'presentations' && activeTab !== 'settings' && activeTab !== 'graduation' && activeTab !== 'users' && activeTab !== 'checkin' && activeTab !== 'schedules') && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-zinc-800">
                        <Target className="text-zinc-700" size={40} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Módulo em Desenvolvimento</h3>
                      <p className="text-zinc-500 max-w-md">Estamos preparando as ferramentas de {activeTab} para garantir o máximo desempenho dos seus atletas.</p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
    </ErrorBoundary>
  );
}
