// Centralized Mock Data — Zona Franca Scale
// Realistic Dominican Republic data for demo/investor presentations

import { ArrowUpRight, ArrowDownLeft, type LucideIcon } from "lucide-react";

// ─── Employers ───────────────────────────────────────────────
export const mockEmployers = [
  { id: "emp-01", name: "Grupo Corripio ZF", rnc: "1-01-12345-6", workers: 1842, active: 1204, sector: "Manufactura", riskRating: "A", collateral: 48500000 },
  { id: "emp-02", name: "CODEVI S.A.", rnc: "1-02-67890-1", workers: 3200, active: 2156, sector: "Textil", riskRating: "A", collateral: 72000000 },
  { id: "emp-03", name: "Hanes Caribbean", rnc: "4-02-11111-2", workers: 2650, active: 1890, sector: "Textil", riskRating: "A+", collateral: 65000000 },
  { id: "emp-04", name: "Gildan Activewear DR", rnc: "4-01-22222-3", workers: 1950, active: 1320, sector: "Textil", riskRating: "A", collateral: 42000000 },
  { id: "emp-05", name: "Industrias Nigua ZF", rnc: "1-03-33333-4", workers: 890, active: 610, sector: "Electrónica", riskRating: "B+", collateral: 18500000 },
];

// ─── Employees (ZF-scale realistic) ─────────────────────────
export const mockEmployees = [
  { id: "e-01", name: "María Elena Pérez", cedula: "001-1234567-8", salary: 28500, tenure: 2.3, score: 680, department: "Producción", status: "ACTIVO" as const, employer: "Grupo Corripio ZF" },
  { id: "e-02", name: "Carlos Ramón Díaz", cedula: "402-9876543-1", salary: 35000, tenure: 4.1, score: 820, department: "Calidad", status: "ACTIVO" as const, employer: "Grupo Corripio ZF" },
  { id: "e-03", name: "Ana Luisa Santos", cedula: "001-5678901-2", salary: 22000, tenure: 0.8, score: 540, department: "Empaque", status: "ACTIVO" as const, employer: "CODEVI S.A." },
  { id: "e-04", name: "Roberto José Mejía", cedula: "031-3456789-0", salary: 42000, tenure: 5.7, score: 910, department: "Supervisión", status: "ACTIVO" as const, employer: "CODEVI S.A." },
  { id: "e-05", name: "Yesenia del Carmen Rivas", cedula: "001-2345678-9", salary: 25000, tenure: 1.5, score: 610, department: "Producción", status: "ACTIVO" as const, employer: "Hanes Caribbean" },
  { id: "e-06", name: "Juan Pablo Hernández", cedula: "402-8765432-3", salary: 31000, tenure: 3.2, score: 750, department: "Logística", status: "ACTIVO" as const, employer: "Hanes Caribbean" },
  { id: "e-07", name: "Luz María Castillo", cedula: "001-4567890-1", salary: 26500, tenure: 1.1, score: 570, department: "Producción", status: "ACTIVO" as const, employer: "Gildan Activewear DR" },
  { id: "e-08", name: "Pedro Antonio Vargas", cedula: "031-6789012-4", salary: 38000, tenure: 6.2, score: 940, department: "Mantenimiento", status: "ACTIVO" as const, employer: "Gildan Activewear DR" },
  { id: "e-09", name: "Ramona Altagracia Núñez", cedula: "001-3456780-5", salary: 24000, tenure: 0.4, score: 500, department: "Empaque", status: "ACTIVO" as const, employer: "Industrias Nigua ZF" },
  { id: "e-10", name: "Francisco Javier Marte", cedula: "402-1234560-6", salary: 32000, tenure: 2.8, score: 720, department: "Control de Calidad", status: "INACTIVO" as const, employer: "Industrias Nigua ZF" },
];

// ─── Current Employee (for Employee Dashboard) ──────────────
export const currentEmployee = {
  name: "María Elena Pérez",
  company: "Grupo Corripio ZF",
  monthlySalary: 28500,
  tenureYears: 2.3,
  riskMode: "conservative" as const,
  preApproved: true,
  repaidCycles: 4,
  joinYear: 2022,
  department: "Producción",
  cedula: "001-1234567-8",
  dineroScore: 680,
  birthDate: "1995-06-12",
  phone: "+18091234567",
  email: "maria.perez@corripio.com.do",
  bankName: "Banco Popular Dominicano",
  bankAccountType: "Ahorro" as const,
  bankAccountNumber: "****4523",
};

// ─── Active Advance ─────────────────────────────────────────
export const currentActiveAdvance = {
  id: "adv-2024-0147",
  amount: 6000,
  fee: 200,
  totalToDeduct: 6200,
  disbursedDate: "2024-01-15",
  status: "active" as const,
};

// ─── Activity Feed ──────────────────────────────────────────
export interface ActivityItem {
  id: number;
  type: "advance" | "deduction";
  label: string;
  amount: number;
  date: string;
  icon: LucideIcon;
}

export const mockActivity: ActivityItem[] = [
  { id: 1, type: "advance", label: "Adelanto Flash", amount: 6000, date: "15 Ene 2024", icon: ArrowUpRight },
  { id: 2, type: "deduction", label: "Descuento Nómina", amount: -6200, date: "31 Dic 2023", icon: ArrowDownLeft },
  { id: 3, type: "advance", label: "Adelanto Flash", amount: 4500, date: "12 Dic 2023", icon: ArrowUpRight },
  { id: 4, type: "deduction", label: "Descuento Nómina", amount: -4700, date: "30 Nov 2023", icon: ArrowDownLeft },
  { id: 5, type: "advance", label: "Recarga Adelanto", amount: 3000, date: "20 Nov 2023", icon: ArrowUpRight },
  { id: 6, type: "deduction", label: "Descuento Nómina", amount: -3200, date: "15 Nov 2023", icon: ArrowDownLeft },
];

// ─── HR Dashboard Mock Data ─────────────────────────────────
export const hrCompany = {
  name: "Grupo Corripio ZF",
  rnc: "1-01-12345-6",
  sector: "Manufactura",
  totalEmployees: 1842,
  activeUsers: 1204,
  totalCollateral: 48500000,
};

export const hrPendingRequests = [
  { id: 1, employee: "Carlos Ramón Díaz", cedula: "402-9876543-1", amount: 12000, requestDate: "2024-01-18", tenure: 4.1, avatar: "CD", department: "Calidad" },
  { id: 2, employee: "Ana Luisa Santos", cedula: "001-5678901-2", amount: 5500, requestDate: "2024-01-18", tenure: 0.8, avatar: "AS", department: "Empaque" },
  { id: 3, employee: "Juan Pablo Hernández", cedula: "402-8765432-3", amount: 9000, requestDate: "2024-01-17", tenure: 3.2, avatar: "JH", department: "Logística" },
  { id: 4, employee: "Luz María Castillo", cedula: "001-4567890-1", amount: 7500, requestDate: "2024-01-17", tenure: 1.1, avatar: "LC", department: "Producción" },
  { id: 5, employee: "Pedro Antonio Vargas", cedula: "031-6789012-4", amount: 15000, requestDate: "2024-01-16", tenure: 6.2, avatar: "PV", department: "Mantenimiento" },
];

export const hrActiveAdvances = [
  { id: 1, employee: "María Elena Pérez", cedula: "001-1234567-8", amount: 6000, totalToDeduct: 6200, disbursedDate: "2024-01-15", status: "active" },
  { id: 2, employee: "Roberto José Mejía", cedula: "031-3456789-0", amount: 18000, totalToDeduct: 18200, disbursedDate: "2024-01-12", status: "active" },
  { id: 3, employee: "Yesenia del Carmen Rivas", cedula: "001-2345678-9", amount: 5000, totalToDeduct: 5200, disbursedDate: "2024-01-10", status: "active" },
  { id: 4, employee: "Francisco Javier Marte", cedula: "402-1234560-6", amount: 10000, totalToDeduct: 10200, disbursedDate: "2024-01-08", status: "active" },
  { id: 5, employee: "Carlos Ramón Díaz", cedula: "402-9876543-1", amount: 8000, totalToDeduct: 8200, disbursedDate: "2024-01-05", status: "active" },
  { id: 6, employee: "Pedro Antonio Vargas", cedula: "031-6789012-4", amount: 14000, totalToDeduct: 14200, disbursedDate: "2024-01-03", status: "active" },
];

// ─── Admin Dashboard Mock Data ──────────────────────────────
export const adminKPIs = {
  collateralCoverage: 3.8,
  defaultRate: 0.018,
  capitalVelocity: 8.2,
  totalActivePending: 16300000,
  totalCollateralHeld: 61900000,
  adoptionRate: 0.65,
  totalEmployers: 5,
  totalEmployees: 10532,
};

export const adminMonthlyData = [
  { month: "Sep", disbursed: 2800000, recovered: 2720000, advances: 320, users: 890, corripio: 800000, codevi: 900000, hanes: 600000, gildan: 350000, nigua: 150000 },
  { month: "Oct", disbursed: 4900000, recovered: 4780000, advances: 580, users: 1450, corripio: 1400000, codevi: 1500000, hanes: 1100000, gildan: 600000, nigua: 300000 },
  { month: "Nov", disbursed: 7600000, recovered: 7400000, advances: 890, users: 2100, corripio: 2100000, codevi: 2400000, hanes: 1700000, gildan: 950000, nigua: 450000 },
  { month: "Dic", disbursed: 12100000, recovered: 11800000, advances: 1420, users: 3200, corripio: 3400000, codevi: 3800000, hanes: 2700000, gildan: 1500000, nigua: 700000 },
  { month: "Ene", disbursed: 16300000, recovered: 15900000, advances: 1890, users: 4100, corripio: 4600000, codevi: 5100000, hanes: 3600000, gildan: 2000000, nigua: 1000000 },
  { month: "Feb", disbursed: 20100000, recovered: 19600000, advances: 2340, users: 5250, corripio: 5700000, codevi: 6300000, hanes: 4400000, gildan: 2500000, nigua: 1200000 },
];

export const adminCompanyProfitData = [
  { name: "Grupo Corripio ZF", profit: 480000, default: 12000, status: "healthy" as const },
  { name: "CODEVI S.A.", profit: 620000, default: 0, status: "healthy" as const },
  { name: "Hanes Caribbean", profit: 390000, default: 8500, status: "healthy" as const },
  { name: "Gildan Activewear DR", profit: 285000, default: 42000, status: "warning" as const },
  { name: "Industrias Nigua ZF", profit: 95000, default: 68000, status: "toxic" as const },
];

export const adminPortfolioData = [
  { name: "Bajo Riesgo", value: 78, color: "hsl(var(--primary))" },
  { name: "En Observación", value: 22, color: "hsl(var(--warning))" },
];

export const adminPendingDisbursements = [
  { id: 1, employee: "Roberto José Mejía", company: "CODEVI S.A.", amount: 18000, collateralRatio: 4.8, requestDate: "2024-01-18" },
  { id: 2, employee: "Pedro Antonio Vargas", company: "Gildan Activewear DR", amount: 15000, collateralRatio: 3.1, requestDate: "2024-01-18" },
  { id: 3, employee: "Juan Pablo Hernández", company: "Hanes Caribbean", amount: 9000, collateralRatio: 5.6, requestDate: "2024-01-17" },
  { id: 4, employee: "Carlos Ramón Díaz", company: "Grupo Corripio ZF", amount: 12000, collateralRatio: 4.2, requestDate: "2024-01-17" },
  { id: 5, employee: "Luz María Castillo", company: "Gildan Activewear DR", amount: 7500, collateralRatio: 1.9, requestDate: "2024-01-16" },
];

// ─── Tenure Level UI Config ─────────────────────────────────
export const tenureLevelConfig: Record<string, {
  label: string;
  color: string;
  bg: string;
  progress: number;
  next: string;
  nextYears: number;
}> = {
  bronze: { label: "Bronce", color: "text-amber-600", bg: "bg-amber-50", progress: 20, next: "Plata", nextYears: 1 },
  silver: { label: "Plata", color: "text-muted-foreground", bg: "bg-surface-container", progress: 40, next: "Oro", nextYears: 2 },
  gold: { label: "Oro", color: "text-yellow-500", bg: "bg-yellow-50", progress: 65, next: "Platino", nextYears: 3 },
  platinum: { label: "Platino", color: "text-secondary", bg: "bg-secondary-container/20", progress: 85, next: "Diamante", nextYears: 5 },
  diamond: { label: "Diamante", color: "text-primary", bg: "bg-accent", progress: 100, next: "", nextYears: 0 },
};
