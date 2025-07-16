/** @jsxRuntime classic */
import * as React from 'react';
import { Goal, GoalStatus, LifePlan } from '../types.ts';
import { useNotification } from '../contexts/NotificationContext.tsx';

interface GoalsProps {
  goals: Goal[];
  lifePlan: LifePlan;
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onUpdateGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
}

const GoalCard = ({ goal, onUpdate, onDelete }: { goal: Goal; onUpdate: (goal: Goal) => void; onDelete: (id: string) => void; }) => {
    const statusColor = {
        [GoalStatus.NotStarted]: 'border-gray-500',
        [GoalStatus.InProgress]: 'border-yellow-500',
        [GoalStatus.Completed]: 'border-green-500',
        [GoalStatus.OnHold]: 'border-purple-500',
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ ...goal, status: e.target.value as GoalStatus });
    };

    return (
        <div className={`bg-brand-secondary p-5 rounded-lg border-l-4 ${statusColor[goal.status]} flex flex-col justify-between`}>
            <div>
                <h3 className="text-lg md:text-xl font-bold">{goal.title}</h3>
                <p className="text-sm text-brand-tertiary mt-1 mb-2">Vence: {new Date(goal.dueDate).toLocaleDateString()}</p>
                <p className="text-base mb-4">{goal.description}</p>
                <p className="text-xs italic text-brand-tertiary mb-4">Relevancia: {goal.relevance}</p>
            </div>
            <div className="flex items-center justify-between mt-auto">
                <select value={goal.status} onChange={handleStatusChange} className="bg-brand-primary border border-brand-border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent">
                    {Object.values(GoalStatus).map(status => <option key={status} value={status}>{status}</option>)}
                </select>
                <button onClick={() => onDelete(goal.id)} className="text-red-500 hover:text-red-400 text-sm font-semibold">Eliminar</button>
            </div>
        </div>
    );
};

const Goals = ({ goals, lifePlan, onAddGoal, onUpdateGoal, onDeleteGoal }: GoalsProps) => {
  const [newGoal, setNewGoal] = React.useState({ title: '', description: '', dueDate: '', relevance: '' });
  const { showNotification } = useNotification();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewGoal({ ...newGoal, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.title && newGoal.description && newGoal.dueDate && newGoal.relevance) {
      onAddGoal({ ...newGoal, status: GoalStatus.NotStarted });
      setNewGoal({ title: '', description: '', dueDate: '', relevance: '' });
    } else {
      showNotification('Por favor, completa todos los campos.', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-accent">Traduce Tu "Porqué" en "Qué"</h2>
            <p className="text-brand-tertiary mt-2">Establece metas específicas, desafiantes y significativas que se alineen con tu propósito.</p>
        </div>
        
        <div className="bg-brand-secondary p-6 md:p-8 rounded-lg border border-brand-border">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">Añadir Nueva Meta</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={newGoal.title} onChange={handleInputChange} placeholder="Título de la Meta (Específico y Desafiante)" className="w-full bg-brand-primary p-3 rounded-md border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                <textarea name="description" value={newGoal.description} onChange={handleInputChange} placeholder="Descripción (Resultado Medible)" className="w-full bg-brand-primary p-3 rounded-md border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-accent" rows={3}></textarea>
                <input name="relevance" value={newGoal.relevance} onChange={handleInputChange} placeholder="Relevancia (¿Cómo sirve esto a mi propósito?)" className="w-full bg-brand-primary p-3 rounded-md border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                <input name="dueDate" value={newGoal.dueDate} onChange={handleInputChange} type="date" className="w-full bg-brand-primary p-3 rounded-md border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                <button type="submit" className="w-full py-3 bg-brand-accent hover:bg-blue-500 rounded-md text-white font-bold transition-colors">Añadir Meta</button>
            </form>
        </div>

        <div className="space-y-4">
             <h3 className="text-xl md:text-2xl font-semibold text-center">Tus Metas</h3>
             {goals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => (
                        <GoalCard key={goal.id} goal={goal} onUpdate={onUpdateGoal} onDelete={onDeleteGoal} />
                    ))}
                </div>
             ) : (
                <p className="text-center text-brand-tertiary">Aún no hay metas. ¡Añade una arriba para empezar!</p>
             )}
        </div>
    </div>
  );
};

export default Goals;