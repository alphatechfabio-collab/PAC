import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User, Tournament } from '../types';
import { Trophy, Calendar, MapPin, DollarSign, FileText, Settings, Users, CheckCircle, AlertCircle, Trash2, Edit2, Ticket } from 'lucide-react';
import { cn } from '../lib/utils';

const IBJJF_AGES = [
  'Pré-Mirim I, II, III (4-6)', 'Mirim I, II, III (7-9)', 'Infantil I, II, III (10-12)',
  'Infanto-Juvenil I, II, III (13-15)', 'Juvenil I, II (16-17)', 'Adulto (18-29)',
  'Master 1 (30+)', 'Master 2 (36+)', 'Master 3 (41+)', 'Master 4 (46+)',
  'Master 5 (51+)', 'Master 6 (56+)', 'Master 7 (61+)'
];

const IBJJF_BELTS = [
  'Branca', 'Cinza', 'Amarela', 'Laranja', 'Verde', 'Azul', 'Roxa', 'Marrom', 'Preta'
];

const IBJJF_WEIGHTS = [
  'Galo', 'Pluma', 'Pena', 'Leve', 'Médio', 'Meio-Pesado', 'Pesado', 'Super-Pesado', 'Pesadíssimo', 'Absoluto'
];

const getAgeCategory = (birthDate: string, tournamentDate: string) => {
  if (!birthDate || !tournamentDate) return 'Adulto (18-29)';
  const birthYear = new Date(birthDate).getFullYear();
  const tournamentYear = new Date(tournamentDate).getFullYear();
  const age = tournamentYear - birthYear;

  if (age >= 4 && age <= 6) return 'Pré-Mirim I, II, III (4-6)';
  if (age >= 7 && age <= 9) return 'Mirim I, II, III (7-9)';
  if (age >= 10 && age <= 12) return 'Infantil I, II, III (10-12)';
  if (age >= 13 && age <= 15) return 'Infanto-Juvenil I, II, III (13-15)';
  if (age >= 16 && age <= 17) return 'Juvenil I, II (16-17)';
  if (age >= 18 && age <= 29) return 'Adulto (18-29)';
  if (age >= 30 && age <= 35) return 'Master 1 (30+)';
  if (age >= 36 && age <= 40) return 'Master 2 (36+)';
  if (age >= 41 && age <= 45) return 'Master 3 (41+)';
  if (age >= 46 && age <= 50) return 'Master 4 (46+)';
  if (age >= 51 && age <= 55) return 'Master 5 (51+)';
  if (age >= 56 && age <= 60) return 'Master 6 (56+)';
  if (age >= 61) return 'Master 7 (61+)';
  return 'Adulto (18-29)'; // Default fallback
};

const getWeightClass = (weightStr: string | number, gender: string) => {
  if (!weightStr && weightStr !== 0) return 'Absoluto';
  const str = String(weightStr);
  // Check if it's already a valid IBJJF weight class name
  if (IBJJF_WEIGHTS.includes(str)) return str;

  const weight = parseFloat(str.replace(/[^0-9.]/g, ''));
  if (isNaN(weight)) return str; // Fallback to whatever they typed

  if (gender === 'M') {
    if (weight <= 57.5) return 'Galo';
    if (weight <= 64) return 'Pluma';
    if (weight <= 70) return 'Pena';
    if (weight <= 76) return 'Leve';
    if (weight <= 82.3) return 'Médio';
    if (weight <= 88.3) return 'Meio-Pesado';
    if (weight <= 94.3) return 'Pesado';
    if (weight <= 100.5) return 'Super-Pesado';
    return 'Pesadíssimo';
  } else {
    if (weight <= 48.5) return 'Galo';
    if (weight <= 53.5) return 'Pluma';
    if (weight <= 58.5) return 'Pena';
    if (weight <= 64) return 'Leve';
    if (weight <= 69) return 'Médio';
    if (weight <= 74) return 'Meio-Pesado';
    if (weight <= 79.3) return 'Pesado';
    return 'Super-Pesado';
  }
};

const formatBelt = (belt: string, stripes?: number) => {
  if (!belt) return 'Branca';
  const baseBelt = belt.split(' (')[0];
  if (stripes === undefined || stripes === 0) return baseBelt;
  return `${baseBelt} ${stripes} grau${stripes > 1 ? 's' : ''}`;
};

const IBJJF_RULES = `Regras Oficiais da IBJJF.
- Tempo de luta conforme a categoria de idade e faixa.
- Sistema de eliminação simples (exceto chaves de 3).
- Pesagem realizada com o kimono antes da primeira luta.
- Obrigatório uso de kimono dentro dos padrões (cor, medidas, patches).`;

const IBJJF_PRIZES = `Premiação Oficial:
- Medalha de Ouro para o Campeão.
- Medalha de Prata para o Vice-Campeão.
- Medalhas de Bronze para os dois terceiros colocados.
- Pontuação para o ranking de academias (Ouro: 9, Prata: 3, Bronze: 1).`;

export const TournamentList = ({ user, athletes }: { user: User, athletes: any[] }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [brackets, setBrackets] = useState<any[]>([]);
  const [notification, setNotification] = useState<{type: 'success'|'error', text: string} | null>(null);

  const showNotification = (type: 'success'|'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'tournaments'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
        setTournaments(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  const handleRegister = async (tournament: Tournament) => {
    const athlete = athletes.find(a => a.user_id === user.id);
    if (!athlete) {
      showNotification('error', 'Perfil de atleta não encontrado. Complete seu cadastro primeiro.');
      return;
    }

    // Check if already registered
    const q = query(
      collection(db, 'tournament_registrations'),
      where('tournament_id', '==', tournament.id),
      where('athlete_id', '==', athlete.id)
    );
    const existingReg = await getDocs(q);
    if (!existingReg.empty) {
      showNotification('error', 'Você já está inscrito neste campeonato.');
      return;
    }

    try {
      const regData = {
        tournament_id: tournament.id,
        athlete_id: athlete.id,
        athlete_name: athlete.name,
        academy_id: athlete.academy_id || '',
        academy_name: athlete.team || '',
        belt: (athlete.belt || 'Branca').split(' (')[0],
        stripes: athlete.stripes || 0,
        weight_class: getWeightClass(athlete.weight_class || '', athlete.gender || 'M'),
        age_category: getAgeCategory(athlete.birth_date || '', tournament.date),
        gender: athlete.gender || 'M',
        payment_status: 'pending',
        approved: false,
        registration_date: new Date().toISOString()
      };
      await addDoc(collection(db, 'tournament_registrations'), regData);
      showNotification('success', 'Inscrição realizada com sucesso! Aguarde a aprovação do pagamento.');
      // Refresh registrations if we are viewing this tournament
      if (selectedTournament?.id === tournament.id) {
        loadRegistrations(tournament.id);
      }
    } catch (error) {
      console.error('Error registering:', error);
      showNotification('error', 'Erro ao realizar inscrição.');
    }
  };

  const loadRegistrations = async (tournamentId: string) => {
    try {
      const q = query(collection(db, 'tournament_registrations'), where('tournament_id', '==', tournamentId));
      const snapshot = await getDocs(q);
      const regs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegistrations(regs);
      setBrackets([]); // Reset brackets when loading new tournament
    } catch (error) {
      console.error('Error loading registrations:', error);
    }
  };

  const togglePaymentStatus = async (regId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
      await updateDoc(doc(db, 'tournament_registrations', regId), { payment_status: newStatus });
      setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, payment_status: newStatus } : r));
    } catch (error) {
      console.error('Error updating payment status:', error);
      showNotification('error', 'Erro ao atualizar status de pagamento.');
    }
  };

  const toggleApproval = async (regId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'tournament_registrations', regId), { approved: !currentStatus });
      setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, approved: !currentStatus } : r));
    } catch (error) {
      console.error('Error updating approval status:', error);
      showNotification('error', 'Erro ao atualizar permissão.');
    }
  };

  const generateBrackets = () => {
    try {
      const approvedRegistrations = registrations.filter(r => r.payment_status === 'paid' || r.approved);
      
      if (approvedRegistrations.length === 0) {
        showNotification('error', 'Nenhum atleta com pagamento confirmado ou aprovado para gerar chaves.');
        return;
      }

      // Group by category (Age + Belt + Weight)
      const grouped = approvedRegistrations.reduce((acc: any, reg: any) => {
        const athlete = athletes.find(a => a.id === reg.athlete_id);
        const ageCategory = athlete && selectedTournament ? getAgeCategory(athlete.birth_date || '', selectedTournament.date) : (reg.age_category || 'Adulto (18-29)');
        
        const baseBelt = (reg.belt || 'Branca').split(' (')[0];
        const normalizedWeight = getWeightClass(reg.weight_class || '', reg.gender || 'M');
        const key = `${ageCategory} - ${baseBelt} - ${normalizedWeight} - ${reg.gender || 'M'}`;
        
        // Update the reg object so the bracket displays the normalized weight
        const normalizedReg = { 
          ...reg, 
          belt: baseBelt, 
          weight_class: normalizedWeight, 
          age_category: ageCategory,
          stripes: reg.stripes !== undefined ? reg.stripes : (athlete?.stripes || 0)
        };
        
        if (!acc[key]) acc[key] = [];
        acc[key].push(normalizedReg);
        return acc;
      }, {});

      const newBrackets = Object.keys(grouped).map(key => {
        const athletes = grouped[key];
        // Simple random shuffle
        const shuffled = [...athletes].sort(() => 0.5 - Math.random());
        const matches = [];
        for (let i = 0; i < shuffled.length; i += 2) {
          if (i + 1 < shuffled.length) {
            matches.push({ p1: shuffled[i], p2: shuffled[i+1] });
          } else {
            matches.push({ p1: shuffled[i], p2: null, bye: true }); // Bye
          }
        }
        return { category: key, matches };
      });

      setBrackets(newBrackets);
      showNotification('success', 'Chaves geradas com sucesso!');
    } catch (error) {
      console.error('Error generating brackets:', error);
      showNotification('error', 'Erro ao gerar chaves. Verifique os dados dos atletas.');
    }
  };

  if (loading) return <div className="text-center text-zinc-500 py-8">Carregando campeonatos...</div>;

  if (selectedTournament) {
    return (
      <div className="space-y-6 relative">
        {notification && (
          <div className={cn(
            "fixed top-4 right-4 p-4 rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-top-4 font-bold",
            notification.type === 'success' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
          )}>
            {notification.text}
          </div>
        )}
        <button onClick={() => setSelectedTournament(null)} className="text-zinc-400 hover:text-white text-sm font-bold flex items-center gap-2">
          ← Voltar para lista
        </button>
        <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-white">{selectedTournament.name}</h2>
              <div className="flex gap-4 mt-2 text-sm text-zinc-400">
                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(selectedTournament.date).toLocaleDateString('pt-BR')}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {selectedTournament.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-emerald-500">R$ {selectedTournament.registration_fee}</div>
              <div className="text-xs text-zinc-500">Inscrições até {new Date(selectedTournament.registration_deadline).toLocaleDateString('pt-BR')}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Regras</h3>
              <div className="bg-black p-4 rounded-xl text-zinc-400 text-sm whitespace-pre-wrap border border-zinc-800">
                {selectedTournament.rules}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Premiação</h3>
              <div className="bg-black p-4 rounded-xl text-zinc-400 text-sm whitespace-pre-wrap border border-zinc-800">
                {selectedTournament.prizes}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-zinc-800">
            {['professor', 'academy', 'developer'].includes(user.role) ? (
              <div className="flex gap-4">
                <button 
                  onClick={() => loadRegistrations(selectedTournament.id)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
                >
                  <Users size={18} /> Ver Inscritos
                </button>
                <button 
                  onClick={generateBrackets}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
                >
                  <Settings size={18} /> Organizar Chaves
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleRegister(selectedTournament)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-black transition-colors flex items-center gap-2 w-full justify-center text-lg"
              >
                <Ticket size={24} /> Comprar Ingresso / Inscrever-se
              </button>
            )}
          </div>

          {brackets.length > 0 ? (
            <div className="mt-8 pt-8 border-t border-zinc-800">
              <h3 className="text-lg font-bold text-white mb-4">Chaves do Campeonato</h3>
              <div className="space-y-6">
                {brackets.map((bracket, index) => (
                  <div key={index} className="bg-black p-6 rounded-2xl border border-zinc-800">
                    <h4 className="font-bold text-emerald-500 mb-4">{bracket.category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {bracket.matches.map((match: any, mIndex: number) => (
                        <div key={mIndex} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                          <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
                            <div>
                              <div className="text-white font-bold">{match.p1.athlete_name}</div>
                              <div className="text-[10px] text-zinc-500">{match.p1.academy_name} • {formatBelt(match.p1.belt, match.p1.stripes)} • {match.p1.weight_class}</div>
                            </div>
                          </div>
                          <div className="p-3 flex justify-between items-center">
                            {match.bye ? (
                              <span className="text-zinc-500 italic text-sm">Avança direto (Bye)</span>
                            ) : (
                              <div>
                                <div className="text-white font-bold">{match.p2.athlete_name}</div>
                                <div className="text-[10px] text-zinc-500">{match.p2.academy_name} • {formatBelt(match.p2.belt, match.p2.stripes)} • {match.p2.weight_class}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : registrations.length > 0 && (
            <div className="mt-8 pt-8 border-t border-zinc-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-lg font-bold text-white">Atletas Inscritos ({registrations.length})</h3>
                
                {['professor', 'academy', 'developer'].includes(user.role) && (
                  <div className="flex gap-4 bg-black p-4 rounded-xl border border-zinc-800">
                    <div>
                      <div className="text-xs text-zinc-500 uppercase font-bold">Total Esperado</div>
                      <div className="text-lg font-black text-white">R$ {registrations.length * selectedTournament.registration_fee}</div>
                    </div>
                    <div className="w-px bg-zinc-800"></div>
                    <div>
                      <div className="text-xs text-zinc-500 uppercase font-bold">Total Recebido</div>
                      <div className="text-lg font-black text-emerald-500">
                        R$ {registrations.filter(r => r.payment_status === 'paid').length * selectedTournament.registration_fee}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {registrations.map(reg => (
                  <div key={reg.id} className="bg-black p-4 rounded-xl border border-zinc-800 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-white">{reg.athlete_name}</div>
                        {reg.approved && (
                          <CheckCircle size={16} className="text-emerald-500" />
                        )}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">{reg.academy_name}</div>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <span className="bg-zinc-800 text-zinc-300 text-[10px] px-2 py-1 rounded">
                          {athletes.find(a => a.id === reg.athlete_id) && selectedTournament 
                            ? getAgeCategory(athletes.find(a => a.id === reg.athlete_id)?.birth_date || '', selectedTournament.date) 
                            : reg.age_category}
                        </span>
                        <span className="bg-zinc-800 text-zinc-300 text-[10px] px-2 py-1 rounded">{formatBelt(reg.belt, reg.stripes)}</span>
                        <span className="bg-zinc-800 text-zinc-300 text-[10px] px-2 py-1 rounded">{getWeightClass(reg.weight_class || '', reg.gender || 'M')}</span>
                      </div>
                    </div>

                    {['professor', 'academy', 'developer'].includes(user.role) && (
                      <div className="mt-4 pt-4 border-t border-zinc-800/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-400">Pagamento:</span>
                          <button
                            onClick={() => togglePaymentStatus(reg.id, reg.payment_status)}
                            className={cn(
                              "text-xs px-3 py-1 rounded-full font-bold transition-colors",
                              reg.payment_status === 'paid' 
                                ? "bg-emerald-500/20 text-emerald-400" 
                                : "bg-yellow-500/20 text-yellow-500"
                            )}
                          >
                            {reg.payment_status === 'paid' ? 'Pago' : 'Pendente'}
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-400">Permissão:</span>
                          <button
                            onClick={() => toggleApproval(reg.id, reg.approved)}
                            className={cn(
                              "text-xs px-3 py-1 rounded-full font-bold transition-colors",
                              reg.approved 
                                ? "bg-emerald-500/20 text-emerald-400" 
                                : "bg-red-500/20 text-red-500"
                            )}
                          >
                            {reg.approved ? 'Aprovado' : 'Bloqueado'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      {notification && (
        <div className={cn(
          "fixed top-4 right-4 p-4 rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-top-4 font-bold",
          notification.type === 'success' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        )}>
          {notification.text}
        </div>
      )}
      {tournaments.length === 0 ? (
        <div className="text-center text-zinc-500 py-8">Nenhum campeonato encontrado.</div>
      ) : (
        tournaments.map(tournament => (
          <div key={tournament.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0">
                <Trophy className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-zinc-400">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(tournament.date).toLocaleDateString('pt-BR')}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {tournament.location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <div className="text-lg font-black text-emerald-500">R$ {tournament.registration_fee}</div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Inscrição</div>
              </div>
              <button 
                onClick={() => setSelectedTournament(tournament)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap"
              >
                Ver Detalhes
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
export const TournamentManager = ({ user, onSuccess }: { user: User, onSuccess: () => void }) => {
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState<{type: 'success'|'error', text: string} | null>(null);

  const showNotification = (type: 'success'|'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  const [formData, setFormData] = useState<Partial<Tournament>>({
    name: '',
    date: '',
    location: '',
    registration_fee: 0,
    registration_deadline: '',
    status: 'draft',
    rules: IBJJF_RULES,
    prizes: IBJJF_PRIZES,
    categories: {
      age: [...IBJJF_AGES],
      belts: [...IBJJF_BELTS],
      weights: [...IBJJF_WEIGHTS]
    }
  });

  const toggleCategory = (type: 'age' | 'belts' | 'weights', value: string) => {
    setFormData(prev => {
      const current = prev.categories?.[type] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return {
        ...prev,
        categories: {
          ...prev.categories!,
          [type]: updated
        }
      };
    });
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...formData,
        organizer_id: user.id,
        created_at: new Date().toISOString()
      };
      await addDoc(collection(db, 'tournaments'), dataToSave);
      onSuccess();
    } catch (error) {
      console.error('Error saving tournament:', error);
      showNotification('error', 'Erro ao salvar campeonato.');
    }
  };

  return (
    <div className="space-y-6 relative">
      {notification && (
        <div className={cn(
          "fixed top-4 right-4 p-4 rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-top-4 font-bold",
          notification.type === 'success' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        )}>
          {notification.text}
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          <Trophy className="text-emerald-500" />
          Criar Campeonato Padrão IBJJF
        </h2>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {['Informações Básicas', 'Categorias', 'Regras & Premiação', 'Revisão'].map((label, i) => (
          <button
            key={i}
            onClick={() => setStep(i + 1)}
            className={cn(
              "px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors",
              step === i + 1 ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            )}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Nome do Campeonato</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-emerald-500"
              placeholder="Ex: Open de Jiu-Jitsu 2026"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Data do Evento</label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Data Limite de Inscrição</label>
              <input
                type="date"
                value={formData.registration_deadline}
                onChange={e => setFormData({ ...formData, registration_deadline: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Local</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-emerald-500"
                placeholder="Ginásio Poliesportivo..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Valor da Inscrição (R$)</label>
              <input
                type="number"
                value={formData.registration_fee}
                onChange={e => setFormData({ ...formData, registration_fee: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-emerald-500"
                placeholder="Ex: 120"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button onClick={() => setStep(2)} className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold">Próximo</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
            <h3 className="text-white font-bold mb-4 flex items-center justify-between">
              Idades
              <span className="text-xs text-zinc-500 font-normal">Selecione as categorias permitidas</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {IBJJF_AGES.map(a => {
                const isSelected = formData.categories?.age.includes(a);
                return (
                  <button
                    key={a}
                    onClick={() => toggleCategory('age', a)}
                    className={cn(
                      "text-xs px-3 py-1 rounded-full border transition-colors",
                      isSelected 
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30" 
                        : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-300"
                    )}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
            <h3 className="text-white font-bold mb-4 flex items-center justify-between">
              Faixas
              <span className="text-xs text-zinc-500 font-normal">Selecione as faixas permitidas</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {IBJJF_BELTS.map(b => {
                const isSelected = formData.categories?.belts.includes(b);
                return (
                  <button
                    key={b}
                    onClick={() => toggleCategory('belts', b)}
                    className={cn(
                      "text-xs px-3 py-1 rounded-full border transition-colors",
                      isSelected 
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30" 
                        : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-300"
                    )}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
            <h3 className="text-white font-bold mb-4 flex items-center justify-between">
              Pesos
              <span className="text-xs text-zinc-500 font-normal">Selecione os pesos permitidos</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {IBJJF_WEIGHTS.map(w => {
                const isSelected = formData.categories?.weights.includes(w);
                return (
                  <button
                    key={w}
                    onClick={() => toggleCategory('weights', w)}
                    className={cn(
                      "text-xs px-3 py-1 rounded-full border transition-colors",
                      isSelected 
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30" 
                        : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-300"
                    )}
                  >
                    {w}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-xs text-zinc-500 italic">* As categorias vêm pré-selecionadas com o padrão oficial da IBJJF. Clique para adicionar ou remover.</p>
          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(1)} className="bg-zinc-800 text-white px-6 py-3 rounded-xl font-bold">Voltar</button>
            <button onClick={() => setStep(3)} className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold">Próximo</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Regras do Campeonato</label>
            <textarea
              value={formData.rules}
              onChange={e => setFormData({ ...formData, rules: e.target.value })}
              className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-emerald-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Premiação</label>
            <textarea
              value={formData.prizes}
              onChange={e => setFormData({ ...formData, prizes: e.target.value })}
              className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-emerald-500 resize-none"
            />
          </div>
          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(2)} className="bg-zinc-800 text-white px-6 py-3 rounded-xl font-bold">Voltar</button>
            <button onClick={() => setStep(4)} className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold">Próximo</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
            <h3 className="text-xl font-black text-emerald-500 mb-2">{formData.name || 'Campeonato Sem Nome'}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-zinc-300 mt-4">
              <div className="flex items-center gap-2"><Calendar size={16} className="text-emerald-500" /> {formData.date ? new Date(formData.date).toLocaleDateString('pt-BR') : '-'}</div>
              <div className="flex items-center gap-2"><MapPin size={16} className="text-emerald-500" /> {formData.location || '-'}</div>
              <div className="flex items-center gap-2"><DollarSign size={16} className="text-emerald-500" /> R$ {formData.registration_fee}</div>
              <div className="flex items-center gap-2"><AlertCircle size={16} className="text-emerald-500" /> Inscrições até {formData.registration_deadline ? new Date(formData.registration_deadline).toLocaleDateString('pt-BR') : '-'}</div>
            </div>
          </div>
          
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <h4 className="font-bold text-white mb-2">Status Inicial</h4>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-emerald-500"
            >
              <option value="draft">Rascunho (Apenas organizadores veem)</option>
              <option value="open">Inscrições Abertas (Atletas podem comprar ingressos)</option>
            </select>
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(3)} className="bg-zinc-800 text-white px-6 py-3 rounded-xl font-bold">Voltar</button>
            <button onClick={handleSave} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-black flex items-center gap-2">
              <CheckCircle size={20} />
              Publicar Campeonato
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
