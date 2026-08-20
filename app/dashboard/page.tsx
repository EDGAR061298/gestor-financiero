// app/dashboard/page.tsx
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

type TxType = "income" | "expense";

interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
}

interface BudgetLimit {
  id: string;
  category: string;
  limit: number;
}

const DEFAULT_INCOME_CATS = ["Salario", "Freelance", "Inversiones", "Bonos", "Otro"];
const DEFAULT_EXPENSE_CATS = ["Renta", "Alimentos", "Transporte", "Servicios", "Entretenimiento", "Salud", "Otro"];

// Datos Demo para carga opcional
const DEMO_TRANSACTIONS: Transaction[] = [
  { id: "1", type: "income", amount: 18500, category: "Salario", description: "Nómina quincenal", date: "2026-08-01" },
  { id: "2", type: "income", amount: 3200, category: "Freelance", description: "Proyecto independiente", date: "2026-08-05" },
  { id: "3", type: "expense", amount: 4200, category: "Renta", description: "Renta departamental", date: "2026-08-02" },
  { id: "4", type: "expense", amount: 1350, category: "Alimentos", description: "Supermercado básico", date: "2026-08-03" },
  { id: "5", type: "expense", amount: 680, category: "Transporte", description: "Gasolina quincenal", date: "2026-08-08" },
  { id: "6", type: "expense", amount: 950, category: "Entretenimiento", description: "Cena & cine", date: "2026-08-10" },
];

const DEMO_GOALS: Goal[] = [
  { id: "1", title: "Fondo de Emergencia", target: 45000, current: 18500 },
  { id: "2", title: "Portafolio Inversión", target: 20000, current: 12000 },
  { id: "3", title: "Vacaciones Cancún", target: 15000, current: 6500 },
];

const DEMO_BUDGETS: BudgetLimit[] = [
  { id: "1", category: "Renta", limit: 4500 },
  { id: "2", category: "Alimentos", limit: 2500 },
  { id: "3", category: "Transporte", limit: 1200 },
  { id: "4", category: "Entretenimiento", limit: 1500 },
];

function fmtMXN(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "investments" | "budgetRule">("overview");

  // Inicia en 0 para usuarios reales
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [budgets, setBudgets] = useState<BudgetLimit[]>([]);
  const [incomeCats, setIncomeCats] = useState<string[]>(DEFAULT_INCOME_CATS);
  const [expenseCats, setExpenseCats] = useState<string[]>(DEFAULT_EXPENSE_CATS);

  // Modales
  const [showTxForm, setShowTxForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Formularios
  const [txType, setTxType] = useState<TxType>("expense");
  const [txAmount, setTxAmount] = useState("");
  const [txCategory, setTxCategory] = useState(DEFAULT_EXPENSE_CATS[0]);
  const [txDescription, setTxDescription] = useState("");

  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalCurrent, setGoalCurrent] = useState("");

  // Modal Aportar/Retirar Meta
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [goalAmountChange, setGoalAmountChange] = useState("");
  const [goalActionType, setGoalActionType] = useState<"deposit" | "withdraw">("deposit");

  // Presupuestos & Categorías
  const [newBudgetCat, setNewBudgetCat] = useState(DEFAULT_EXPENSE_CATS[0]);
  const [newBudgetLimit, setNewBudgetLimit] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatType, setNewCatType] = useState<TxType>("expense");

  // Simulador de Inversiones
  const [investInitial, setInvestInitial] = useState("10000");
  const [investMonthly, setInvestMonthly] = useState("2000");
  const [investYears, setInvestYears] = useState("3");
  const [investRate, setInvestRate] = useState("10.5");

  // Métricas
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : "0.0";

  const expenseByCategory: Record<string, number> = {};
  transactions.filter((t) => t.type === "expense").forEach((t) => {
    expenseByCategory[t.category] = (expenseByCategory[t.category] ?? 0) + t.amount;
  });

  // Regla 50/30/20
  const needsExpense = transactions
    .filter((t) => t.type === "expense" && ["Renta", "Alimentos", "Transporte", "Servicios", "Salud"].includes(t.category))
    .reduce((s, t) => s + t.amount, 0);
  const wantsExpense = transactions
    .filter((t) => t.type === "expense" && !["Renta", "Alimentos", "Transporte", "Servicios", "Salud"].includes(t.category))
    .reduce((s, t) => s + t.amount, 0);
  const pctNeeds = totalIncome > 0 ? (needsExpense / totalIncome) * 100 : 0;
  const pctWants = totalIncome > 0 ? (wantsExpense / totalIncome) * 100 : 0;
  const pctSavings = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  // Interés Compuesto
  const P = parseFloat(investInitial) || 0;
  const PMT = parseFloat(investMonthly) || 0;
  const t = parseFloat(investYears) || 1;
  const r = (parseFloat(investRate) || 0) / 100 / 12;
  const n = t * 12;
  const futureValue = P * Math.pow(1 + r, n) + (PMT * (Math.pow(1 + r, n) - 1)) / (r || 1);
  const totalContributed = P + (PMT * n);
  const totalGains = Math.max(0, futureValue - totalContributed);

  // Acciones
  function handleLoadDemoData() {
    setTransactions(DEMO_TRANSACTIONS);
    setGoals(DEMO_GOALS);
    setBudgets(DEMO_BUDGETS);
  }

  function handleAddTransaction(e: FormEvent) {
    e.preventDefault();
    const newTx: Transaction = {
      id: Date.now().toString(),
      type: txType,
      amount: parseFloat(txAmount),
      category: txCategory,
      description: txDescription,
      date: new Date().toISOString().split("T")[0],
    };
    setTransactions([newTx, ...transactions]);
    setTxAmount("");
    setTxDescription("");
    setShowTxForm(false);
  }

  function handleDeleteTransaction(id: string) {
    setTransactions(transactions.filter((t) => t.id !== id));
  }

  function handleAddGoal(e: FormEvent) {
    e.preventDefault();
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: goalTitle,
      target: parseFloat(goalTarget),
      current: parseFloat(goalCurrent) || 0,
    };
    setGoals([...goals, newGoal]);
    setGoalTitle("");
    setGoalTarget("");
    setGoalCurrent("");
    setShowGoalForm(false);
  }

  function handleDeleteGoal(id: string) {
    setGoals(goals.filter((g) => g.id !== id));
  }

  function handleUpdateGoalAmount(e: FormEvent) {
    e.preventDefault();
    if (!selectedGoal) return;
    const delta = parseFloat(goalAmountChange) || 0;

    setGoals(
      goals.map((g) => {
        if (g.id === selectedGoal.id) {
          const updated = goalActionType === "deposit" ? g.current + delta : Math.max(0, g.current - delta);
          return { ...g, current: updated };
        }
        return g;
      })
    );

    const newTx: Transaction = {
      id: Date.now().toString(),
      type: goalActionType === "deposit" ? "expense" : "income",
      amount: delta,
      category: "Ahorro/Meta",
      description: `${goalActionType === "deposit" ? "Aporte" : "Retiro"}: ${selectedGoal.title}`,
      date: new Date().toISOString().split("T")[0],
    };
    setTransactions([newTx, ...transactions]);

    setSelectedGoal(null);
    setGoalAmountChange("");
  }

  function handleSaveBudget(e: FormEvent) {
    e.preventDefault();
    const limitNum = parseFloat(newBudgetLimit);
    if (!limitNum) return;

    const existingIndex = budgets.findIndex((b) => b.category === newBudgetCat);
    if (existingIndex >= 0) {
      const updated = [...budgets];
      updated[existingIndex].limit = limitNum;
      setBudgets(updated);
    } else {
      setBudgets([...budgets, { id: Date.now().toString(), category: newBudgetCat, limit: limitNum }]);
    }
    setNewBudgetLimit("");
    setShowBudgetModal(false);
  }

  function handleDeleteBudget(id: string) {
    setBudgets(budgets.filter((b) => b.id !== id));
  }

  function handleAddCustomCategory(e: FormEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;

    if (newCatType === "income") {
      if (!incomeCats.includes(newCatName.trim())) {
        setIncomeCats([...incomeCats, newCatName.trim()]);
      }
    } else {
      if (!expenseCats.includes(newCatName.trim())) {
        setExpenseCats([...expenseCats, newCatName.trim()]);
      }
    }
    setNewCatName("");
    setShowCatModal(false);
  }

  function handleResetAll() {
    setTransactions([]);
    setGoals([]);
    setBudgets([]);
    setShowResetModal(false);
  }

  function handleExportCSV() {
    const headers = "ID,Tipo,Monto,Categoria,Descripcion,Fecha\n";
    const rows = transactions
      .map((t) => `${t.id},${t.type},${t.amount},${t.category},"${t.description}",${t.date}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `reporte_finsalud_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const currentCategories = txType === "income" ? incomeCats : expenseCats;
  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesSearch =
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#080b12] text-white selection:bg-[#00d4ff]/30">
      {/* Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full bg-[#0f4c75] opacity-20 blur-[150px]" />
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-[#1a0533] opacity-30 blur-[140px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center shadow-[0_0_25px_rgba(0,212,255,0.25)]">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth={2}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-xl tracking-tight">FinSalud Suite</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#22d3a4]/10 text-[#22d3a4] border border-[#22d3a4]/20">Personalizable</span>
              </div>
              <p className="text-xs text-white/50">Centro inteligente de gestión patrimonial adaptado a ti</p>
            </div>
          </div>

          {/* Botones de Barra Superior */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCatModal(true)}
              className="flex items-center gap-1.5 border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-medium px-3 py-2 rounded-xl transition-all"
            >
              🏷️ Categorías
            </button>
            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-1.5 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium px-3 py-2 rounded-xl transition-all"
            >
              🔄 Empezar de Nuevo
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-medium px-3 py-2 rounded-xl transition-all"
            >
              📥 Exportar
            </button>
            <button
              onClick={() => setShowGoalForm(!showGoalForm)}
              className="flex items-center gap-1.5 border border-[#7c3aed]/40 bg-[#7c3aed]/20 hover:bg-[#7c3aed]/30 text-white text-xs font-medium px-3.5 py-2 rounded-xl transition-all"
            >
              🎯 Nueva Meta
            </button>
            <button
              onClick={() => setShowTxForm(!showTxForm)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] hover:opacity-90 text-white text-xs font-medium px-4 py-2 rounded-xl transition-all shadow-[0_0_20px_rgba(0,212,255,0.2)]"
            >
              <span className="text-base leading-none">+</span> Transacción
            </button>
            <Link href="/" className="text-xs text-white/40 hover:text-white/80 transition-colors ml-1 px-2 py-1">
              Salir
            </Link>
          </div>
        </header>

        {/* Banner de Onboarding (Se muestra si está todo en cero) */}
        {transactions.length === 0 && goals.length === 0 && (
          <div className="rounded-2xl border border-[#00d4ff]/30 bg-gradient-to-r from-[#00d4ff]/10 via-[#7c3aed]/10 to-transparent p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>✨</span> ¡Tu espacio financiero está listo!
              </h3>
              <p className="text-xs text-white/60 mt-1">
                Puedes empezar a registrar tus movimientos reales o cargar datos de prueba para explorar los gráficos y funciones.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleLoadDemoData}
                className="flex-1 sm:flex-none bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm"
              >
                ⚡ Ver con Datos Demo
              </button>
              <button
                onClick={() => setShowTxForm(true)}
                className="flex-1 sm:flex-none bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white text-xs font-medium px-4 py-2.5 rounded-xl transition-all shadow-md"
              >
                + Registrar Movimiento
              </button>
            </div>
          </div>
        )}

        {/* Modal: Administrar Categorías */}
        {showCatModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0d111a] p-6 text-white shadow-2xl">
              <h3 className="text-base font-bold text-white mb-1">Personalizar Categorías</h3>
              <p className="text-xs text-white/50 mb-4">Añade categorías que se adapten a tus gastos e ingresos cotidianos.</p>

              <form onSubmit={handleAddCustomCategory} className="space-y-3 mb-5">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCatType("expense")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      newCatType === "expense" ? "bg-[#f97316]/20 border border-[#f97316]/40 text-[#f97316]" : "bg-white/5 border border-white/10 text-white/40"
                    }`}
                  >
                    Gasto
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCatType("income")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      newCatType === "income" ? "bg-[#22d3a4]/20 border border-[#22d3a4]/40 text-[#22d3a4]" : "bg-white/5 border border-white/10 text-white/40"
                    }`}
                  >
                    Ingreso
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mascotas, Cursos, Gimnasio..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00d4ff]/50"
                  />
                  <button type="submit" className="bg-[#00d4ff] text-black font-semibold px-4 py-2 rounded-xl text-xs">
                    + Añadir
                  </button>
                </div>
              </form>

              <div className="border-t border-white/10 pt-3">
                <span className="text-[11px] text-white/40 uppercase tracking-wider block mb-2">Tus categorías activas:</span>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                  {expenseCats.map((c) => (
                    <span key={c} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="bg-white/10 hover:bg-white/15 text-white text-xs px-4 py-2 rounded-xl transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Administrar Presupuesto */}
        {showBudgetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0d111a] p-6 text-white shadow-2xl">
              <h3 className="text-base font-bold text-white mb-1">Ajustar Límite de Presupuesto</h3>
              <p className="text-xs text-white/50 mb-4">Define cuánto deseas gastar como máximo por categoría al mes.</p>

              <form onSubmit={handleSaveBudget} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/60 mb-1">Selecciona Rubro / Categoría</label>
                  <select
                    value={newBudgetCat}
                    onChange={(e) => setNewBudgetCat(e.target.value)}
                    className="w-full bg-[#080b12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80 focus:outline-none"
                  >
                    {expenseCats.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-white/60 mb-1">Límite Máximo Mensual (MXN)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Ej. 3000"
                    value={newBudgetLimit}
                    onChange={(e) => setNewBudgetLimit(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00d4ff]/50"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBudgetModal(false)}
                    className="flex-1 bg-white/5 text-white/70 text-xs py-2.5 rounded-xl border border-white/10"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white text-xs font-medium py-2.5 rounded-xl shadow-md"
                  >
                    Guardar Presupuesto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Reinicio */}
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-[#0d111a] p-6 text-white shadow-2xl">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center text-xl mb-4">
                ⚠️
              </div>
              <h3 className="text-lg font-bold text-white mb-2">¿Empezar de nuevo desde cero?</h3>
              <p className="text-xs text-white/70 leading-relaxed mb-6">
                Esta acción borrará todas las transacciones actuales y metas para que puedas estructurar tus finanzas sin datos previos.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium py-2.5 rounded-xl border border-white/10"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleResetAll}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-2.5 rounded-xl shadow-lg"
                >
                  Sí, reiniciar todo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Aportar/Retirar Meta */}
        {selectedGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-[#00d4ff]/30 bg-[#0d111a] p-6 text-white shadow-2xl">
              <h3 className="text-base font-bold text-white mb-1">{selectedGoal.title}</h3>
              <p className="text-xs text-white/50 mb-4">
                Progreso actual: <strong>{fmtMXN(selectedGoal.current)}</strong> de {fmtMXN(selectedGoal.target)}
              </p>

              <form onSubmit={handleUpdateGoalAmount} className="space-y-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGoalActionType("deposit")}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                      goalActionType === "deposit"
                        ? "bg-[#22d3a4]/20 border border-[#22d3a4]/40 text-[#22d3a4]"
                        : "bg-white/5 border border-white/10 text-white/40"
                    }`}
                  >
                    + Aportar Ahorro
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoalActionType("withdraw")}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                      goalActionType === "withdraw"
                        ? "bg-[#f97316]/20 border border-[#f97316]/40 text-[#f97316]"
                        : "bg-white/5 border border-white/10 text-white/40"
                    }`}
                  >
                    − Retirar Fondos
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-white/60 mb-1">Monto (MXN)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    value={goalAmountChange}
                    onChange={(e) => setGoalAmountChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00d4ff]/50"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setSelectedGoal(null); setGoalAmountChange(""); }}
                    className="flex-1 bg-white/5 text-white/70 text-xs py-2.5 rounded-xl border border-white/10"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white text-xs font-medium py-2.5 rounded-xl shadow-md"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Pestañas */}
        <div className="flex gap-2 border-b border-white/10 pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === "overview"
                ? "bg-white/10 text-[#00d4ff] border border-[#00d4ff]/30 shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            📊 Balance & Resumen
          </button>
          <button
            onClick={() => setActiveTab("budgetRule")}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === "budgetRule"
                ? "bg-white/10 text-[#00d4ff] border border-[#00d4ff]/30 shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            ⚖️ Diagnóstico 50/30/20
          </button>
          <button
            onClick={() => setActiveTab("investments")}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === "investments"
                ? "bg-white/10 text-[#00d4ff] border border-[#00d4ff]/30 shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            📈 Simulador & Estrategia Inversión
          </button>
        </div>

        {/* Formularios Desplegables de Acción */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {showTxForm && (
            <div className="rounded-2xl border border-[#00d4ff]/30 bg-[#0d111a] p-5">
              <h3 className="text-xs text-white/50 uppercase tracking-widest mb-3">Registrar Movimiento</h3>
              <form onSubmit={handleAddTransaction} className="space-y-3">
                <div className="flex gap-2">
                  {(["income", "expense"] as TxType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setTxType(t); setTxCategory((t === "income" ? incomeCats : expenseCats)[0]); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                        txType === t
                          ? t === "income"
                            ? "bg-[#22d3a4]/20 border border-[#22d3a4]/40 text-[#22d3a4]"
                            : "bg-[#f97316]/20 border border-[#f97316]/40 text-[#f97316]"
                          : "bg-white/5 border border-white/10 text-white/40"
                      }`}
                    >
                      {t === "income" ? "↑ Ingreso" : "↓ Gasto"}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Monto (MXN)"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  required
                  min="1"
                  step="0.01"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-xs focus:outline-none focus:border-[#00d4ff]/50"
                />
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-white/80 text-xs focus:outline-none focus:border-[#00d4ff]/50"
                >
                  {currentCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Descripción o comercio"
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-xs focus:outline-none focus:border-[#00d4ff]/50"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white font-medium rounded-xl py-2.5 text-xs shadow-md"
                >
                  Guardar Movimiento
                </button>
              </form>
            </div>
          )}

          {showGoalForm && (
            <div className="rounded-2xl border border-[#7c3aed]/30 bg-[#0d111a] p-5">
              <h3 className="text-xs text-white/50 uppercase tracking-widest mb-3">Definir Meta Financiera</h3>
              <form onSubmit={handleAddGoal} className="space-y-3">
                <input
                  type="text"
                  placeholder="Título de tu meta personalizada"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-xs focus:outline-none focus:border-[#7c3aed]/50"
                />
                <input
                  type="number"
                  placeholder="Monto objetivo (MXN)"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  required
                  min="1"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-xs focus:outline-none focus:border-[#7c3aed]/50"
                />
                <input
                  type="number"
                  placeholder="Capital inicial ahorrado (MXN)"
                  value={goalCurrent}
                  onChange={(e) => setGoalCurrent(e.target.value)}
                  min="0"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-xs focus:outline-none focus:border-[#7c3aed]/50"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white font-medium rounded-xl py-2.5 text-xs shadow-md"
                >
                  Crear Meta
                </button>
              </form>
            </div>
          )}
        </div>

        {/* TAB 1: RESUMEN GENERAL */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Flujo Libre (Balance)" value={fmtMXN(balance)} accent={balance >= 0 ? "#00d4ff" : "#f43f5e"} icon="◈" />
              <StatCard label="Ingresos Registrados" value={fmtMXN(totalIncome)} accent="#22d3a4" icon="↑" />
              <StatCard label="Gastos Operativos" value={fmtMXN(totalExpense)} accent="#f97316" icon="↓" />
            </div>

            {/* Tasa de Ahorro */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/50 uppercase tracking-widest">Capacidad de Retención (Tasa de Ahorro)</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {parseFloat(savingsRate) >= 20 ? "Óptimo (+20%)" : "Atención (-20%)"}
                  </span>
                </div>
                <span className="text-sm font-semibold text-[#00d4ff]">{savingsRate}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] transition-all duration-700"
                  style={{ width: `${Math.min(Math.max(parseFloat(savingsRate), 0), 100)}%` }}
                />
              </div>
              <p className="text-xs text-white/60">
                💡 <strong>Diagnóstico:</strong> {balance > 0 ? `Cuentas con un excedente disponible de ${fmtMXN(balance)}. Puedes asignarlo a tus metas o iniciar aportaciones de inversión.` : "Tus gastos igualan o superan tus ingresos este período. Considera revisar tus límites de gasto."}
              </p>
            </div>

            {/* Presupuestos Personalizables & Metas Dinámicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Presupuestos */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xs text-white/50 uppercase tracking-widest">Presupuesto por Rubro</h3>
                    <span className="text-[11px] text-white/40">Límites personalizados</span>
                  </div>
                  <button
                    onClick={() => setShowBudgetModal(true)}
                    className="text-xs text-[#00d4ff] hover:underline flex items-center gap-1"
                  >
                    ⚙️ Configurar Límite
                  </button>
                </div>

                <div className="space-y-4">
                  {budgets.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-xs text-white/40 mb-2">No has establecido límites de presupuesto.</p>
                      <button
                        onClick={() => setShowBudgetModal(true)}
                        className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[#00d4ff]"
                      >
                        + Crear primer presupuesto
                      </button>
                    </div>
                  ) : (
                    budgets.map((b) => {
                      const spent = expenseByCategory[b.category] ?? 0;
                      const pct = Math.min((spent / b.limit) * 100, 100);
                      const isOver = spent > b.limit;
                      return (
                        <div key={b.id} className="group">
                          <div className="flex justify-between text-xs mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white/80">{b.category}</span>
                              <button
                                onClick={() => handleDeleteBudget(b.id)}
                                className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 text-[10px]"
                                title="Eliminar límite"
                              >
                                ✕
                              </button>
                            </div>
                            <span className={isOver ? "text-red-400 font-semibold" : "text-white/50"}>
                              {fmtMXN(spent)} / {fmtMXN(b.limit)} {isOver && "⚠️ Excedido"}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isOver ? "bg-red-500" : "bg-gradient-to-r from-[#00d4ff] to-[#22d3a4]"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Metas Dinámicas */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs text-white/50 uppercase tracking-widest">Progreso de Fondos & Metas</h3>
                  <span className="text-[11px] text-white/40">{goals.length} activas</span>
                </div>
                <div className="space-y-3.5">
                  {goals.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-xs text-white/40 mb-2">No tienes metas registradas.</p>
                      <button
                        onClick={() => setShowGoalForm(true)}
                        className="text-xs px-3 py-1.5 bg-[#7c3aed]/20 hover:bg-[#7c3aed]/30 border border-[#7c3aed]/40 rounded-lg text-white"
                      >
                        🎯 Crear meta de ahorro
                      </button>
                    </div>
                  ) : (
                    goals.map((g) => {
                      const pct = Math.min((g.current / g.target) * 100, 100).toFixed(0);
                      return (
                        <div key={g.id} className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02]">
                          <div className="flex justify-between items-start text-xs mb-2">
                            <div>
                              <span className="font-medium text-white/90 block">{g.title}</span>
                              <span className="text-[11px] text-white/40">
                                {fmtMXN(g.current)} de {fmtMXN(g.target)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[#22d3a4] font-semibold text-xs">{pct}%</span>
                              <button
                                onClick={() => setSelectedGoal(g)}
                                className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[11px] text-[#00d4ff] transition-all"
                              >
                                Administrar
                              </button>
                              <button
                                onClick={() => handleDeleteGoal(g.id)}
                                className="text-white/30 hover:text-red-400 text-xs px-1"
                                title="Eliminar meta"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Historial de Movimientos */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-xs text-white/50 uppercase tracking-widest">Movimientos Registrados</h3>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Filtrar por nombre o categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00d4ff]/50 w-full sm:w-56"
                  />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-[#0d1117] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white/80 focus:outline-none"
                  >
                    <option value="all">Todos</option>
                    <option value="income">Ingresos</option>
                    <option value="expense">Gastos</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                {filteredTransactions.length === 0 ? (
                  <p className="text-xs text-white/40 text-center py-6">No hay movimientos en este historial.</p>
                ) : (
                  filteredTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            tx.type === "income" ? "bg-[#22d3a4]/10 text-[#22d3a4]" : "bg-[#f97316]/10 text-[#f97316]"
                          }`}
                        >
                          {tx.type === "income" ? "↑" : "↓"}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white/80">{tx.category}</p>
                          <p className="text-[10px] text-white/40">{tx.description || tx.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-semibold ${
                            tx.type === "income" ? "text-[#22d3a4]" : "text-[#f97316]"
                          }`}
                        >
                          {tx.type === "income" ? "+" : "-"}{fmtMXN(tx.amount)}
                        </span>
                        <button
                          onClick={() => handleDeleteTransaction(tx.id)}
                          className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 text-xs px-1 transition-all"
                          title="Eliminar movimiento"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIAGNÓSTICO 50/30/20 */}
        {activeTab === "budgetRule" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h2 className="text-lg font-bold mb-1">Estructura Financiera Saludable (Regla 50 / 30 / 20)</h2>
              <p className="text-xs text-white/60 mb-6">
                Este marco divide tus ingresos netos en tres pilares: Necesidades básicas (50%), Deseos y estilo de vida (30%), y Ahorro / Inversión (20%).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-blue-400 font-semibold">1. Necesidades (50%)</span>
                    <span className="text-xs text-white/60">{pctNeeds.toFixed(1)}% Real</span>
                  </div>
                  <p className="text-xl font-bold text-white mb-1">{fmtMXN(needsExpense)}</p>
                  <p className="text-[11px] text-white/40">Renta, super, transporte, salud y servicios básicos.</p>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-3">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.min(pctNeeds * 2, 100)}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-purple-400 font-semibold">2. Estilo de Vida (30%)</span>
                    <span className="text-xs text-white/60">{pctWants.toFixed(1)}% Real</span>
                  </div>
                  <p className="text-xl font-bold text-white mb-1">{fmtMXN(wantsExpense)}</p>
                  <p className="text-[11px] text-white/40">Salidas, ocio y compras personales.</p>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-3">
                    <div className="h-full bg-purple-400 rounded-full" style={{ width: `${Math.min(pctWants * 3.3, 100)}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-emerald-400 font-semibold">3. Ahorro / Inversión (20%)</span>
                    <span className="text-xs text-white/60">{pctSavings.toFixed(1)}% Real</span>
                  </div>
                  <p className="text-xl font-bold text-white mb-1">{fmtMXN(balance)}</p>
                  <p className="text-[11px] text-white/40">Fondo de emergencia, aportaciones y patrimonio.</p>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-3">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min(pctSavings * 5, 100)}%` }} />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <h3 className="text-xs font-semibold text-white mb-1 uppercase tracking-wider">Diagnóstico Dinámico</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Tus necesidades representan el <strong>{pctNeeds.toFixed(0)}%</strong> de tus ingresos. Tu tasa de retención del <strong>{pctSavings.toFixed(0)}%</strong> te permite alimentar fondos de emergencia y proyectos a mediano/largo plazo.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SIMULADOR DE INVERSIONES */}
        {activeTab === "investments" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white tracking-wide">Parámetros de Inversión</h3>
                
                <div>
                  <label className="block text-[11px] text-white/60 mb-1">Monto Inicial (MXN)</label>
                  <input
                    type="number"
                    value={investInitial}
                    onChange={(e) => setInvestInitial(e.target.value)}
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00d4ff]/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-white/60 mb-1">Aportación Mensual (MXN)</label>
                  <input
                    type="number"
                    value={investMonthly}
                    onChange={(e) => setInvestMonthly(e.target.value)}
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00d4ff]/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-white/60 mb-1">Plazo (Años)</label>
                    <input
                      type="number"
                      value={investYears}
                      onChange={(e) => setInvestYears(e.target.value)}
                      min="1"
                      max="30"
                      className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00d4ff]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-white/60 mb-1">Rendimiento Anual (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={investRate}
                      onChange={(e) => setInvestRate(e.target.value)}
                      className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00d4ff]/50"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-white/40 pt-2 border-t border-white/10">
                  Tip: <strong>10.5%</strong> tasa estándar estimada de renta fija.
                </div>
              </div>

              <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-xs text-white/50 uppercase tracking-widest">Proyección de Capital Acumulado</span>
                      <h2 className="text-3xl font-extrabold text-[#00d4ff] mt-1">{fmtMXN(futureValue)}</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-white/40">Plazo</span>
                      <p className="text-sm font-semibold text-white">{investYears} Años ({n} meses)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                      <span className="text-xs text-white/50">Tu Capital Aportado</span>
                      <p className="text-lg font-semibold text-white mt-0.5">{fmtMXN(totalContributed)}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                      <span className="text-xs text-emerald-400">Rendimientos Ganados (Interés Compuesto)</span>
                      <p className="text-lg font-bold text-[#22d3a4] mt-0.5">+{fmtMXN(totalGains)}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-white/60">
                      <span>Capital Propio ({futureValue > 0 ? ((totalContributed / futureValue) * 100).toFixed(0) : 0}%)</span>
                      <span>Ganancia ({futureValue > 0 ? ((totalGains / futureValue) * 100).toFixed(0) : 0}%)</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                        style={{ width: `${futureValue > 0 ? (totalContributed / futureValue) * 100 : 0}%` }}
                      />
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                        style={{ width: `${futureValue > 0 ? (totalGains / futureValue) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-xs text-white/50 flex items-center justify-between">
                  <span>Instrumento sugerido: Bonos Gubernamentales / Fondos Indexados</span>
                  <span className="text-[#00d4ff]">Estrategia pasiva recomendada</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent, icon }: { label: string; value: string; accent: string; icon: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] opacity-20"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-white/50 uppercase tracking-widest">{label}</span>
        <span className="text-base" style={{ color: accent }}>{icon}</span>
      </div>
      <p className="text-2xl font-semibold text-white tracking-tight">{value}</p>
    </div>
  );
}