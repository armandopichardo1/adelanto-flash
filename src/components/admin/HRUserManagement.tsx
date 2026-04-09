import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { UserPlus, Trash2, Loader2, Eye, Building2, Mail, Shield } from "lucide-react";
import { toast } from "sonner";
import { mockEmployers } from "@/lib/mock-data";

export interface HRUser {
  id: string;
  name: string;
  email: string;
  company: string;
  role: "hr_admin" | "hr_viewer";
  status: "activo" | "inactivo";
  createdAt: string;
}

// Mock HR users
const initialHRUsers: HRUser[] = [
  { id: "hr-01", name: "Laura Martínez", email: "laura.martinez@corripio.com.do", company: "Grupo Corripio ZF", role: "hr_admin", status: "activo", createdAt: "2023-06-15" },
  { id: "hr-02", name: "Miguel Ángel Sosa", email: "m.sosa@corripio.com.do", company: "Grupo Corripio ZF", role: "hr_viewer", status: "activo", createdAt: "2023-09-20" },
  { id: "hr-03", name: "Juana Rodríguez", email: "j.rodriguez@codevi.com", company: "CODEVI S.A.", role: "hr_admin", status: "activo", createdAt: "2023-04-10" },
  { id: "hr-04", name: "Fernando Peña", email: "f.pena@hanes.com.do", company: "Hanes Caribbean", role: "hr_admin", status: "activo", createdAt: "2023-07-01" },
  { id: "hr-05", name: "Carolina Vásquez", email: "c.vasquez@gildan.com.do", company: "Gildan Activewear DR", role: "hr_admin", status: "activo", createdAt: "2023-11-05" },
  { id: "hr-06", name: "Rafael Brito", email: "r.brito@nigua-zf.com.do", company: "Industrias Nigua ZF", role: "hr_admin", status: "inactivo", createdAt: "2023-03-22" },
];

interface HRUserManagementProps {
  onViewCompany?: (companyName: string) => void;
}

const emptyForm = { name: "", email: "", company: "", role: "hr_admin" as const };

export function HRUserManagement({ onViewCompany }: HRUserManagementProps) {
  const [users, setUsers] = useState<HRUser[]>(initialHRUsers);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.company) {
      toast.error("Todos los campos son obligatorios");
      return;
    }
    if (users.some((u) => u.email === form.email)) {
      toast.error("Ya existe un usuario con ese correo");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));

    const newUser: HRUser = {
      id: `hr-${Date.now()}`,
      name: form.name,
      email: form.email,
      company: form.company,
      role: form.role,
      status: "activo",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers([...users, newUser]);
    setForm(emptyForm);
    setIsCreateOpen(false);
    setSaving(false);
    toast.success(`Usuario RRHH "${newUser.name}" creado para ${newUser.company}`);
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    const user = users.find((u) => u.id === id);
    setUsers(users.filter((u) => u.id !== id));
    setDeleteConfirmId(null);
    setSaving(false);
    toast.success(`${user?.name} eliminado`);
  };

  const toggleStatus = (id: string) => {
    setUsers(users.map((u) => u.id === id ? { ...u, status: u.status === "activo" ? "inactivo" : "activo" } : u));
    toast.success("Estado actualizado");
  };

  // Group by company
  const companyCounts = users.reduce((acc, u) => {
    acc[u.company] = (acc[u.company] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <section className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
          <div>
            <h2 className="font-headline text-xl font-bold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-secondary" /> Gestión de Usuarios RRHH
            </h2>
            <p className="text-sm text-muted-foreground">{users.length} usuarios RRHH en {Object.keys(companyCounts).length} empresas</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setForm(emptyForm)}>
                <UserPlus className="w-4 h-4" /> Nuevo Usuario RRHH
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Usuario RRHH</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Nombre Completo</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Laura Martínez" />
                </div>
                <div className="space-y-2">
                  <Label>Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="usuario@empresa.com" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Empresa</Label>
                  <Select value={form.company} onValueChange={(v) => setForm({ ...form, company: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEmployers.map((emp) => (
                        <SelectItem key={emp.id} value={emp.name}>{emp.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as "hr_admin" | "hr_viewer" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr_admin">Administrador RRHH</SelectItem>
                      <SelectItem value="hr_viewer">Solo Lectura</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {form.role === "hr_admin" ? "Puede crear, editar y eliminar empleados" : "Solo puede ver datos y exportar reportes"}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                <Button onClick={handleCreate} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} Crear Usuario
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Company summary chips */}
        <div className="flex flex-wrap gap-2 mt-3 mb-4">
          {Object.entries(companyCounts).map(([company, count]) => (
            <Badge key={company} variant="outline" className="py-1 px-3 text-xs">
              <Building2 className="w-3 h-3 mr-1" /> {company}: {count}
            </Badge>
          ))}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
            <TableHead>Usuario</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-outline-variant/15">
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-sm">{user.email}</TableCell>
              <TableCell>
                <span className="text-sm">{user.company}</span>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={user.role === "hr_admin" ? "bg-secondary/10 text-secondary" : "bg-surface-container text-muted-foreground"}>
                  {user.role === "hr_admin" ? "Admin" : "Lectura"}
                </Badge>
              </TableCell>
              <TableCell>
                <button onClick={() => toggleStatus(user.id)}>
                  <Badge variant="outline" className={`cursor-pointer ${user.status === "activo" ? "bg-accent text-accent-foreground" : "bg-surface-container text-muted-foreground"}`}>
                    {user.status === "activo" ? "Activo" : "Inactivo"}
                  </Badge>
                </button>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{user.createdAt}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {onViewCompany && (
                    <Button variant="ghost" size="icon" onClick={() => onViewCompany(user.company)} title="Ver módulo RRHH de esta empresa">
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Dialog open={deleteConfirmId === user.id} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null); }}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteConfirmId(user.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Confirmar Eliminación</DialogTitle></DialogHeader>
                      <p className="text-muted-foreground">
                        ¿Eliminar a <strong>{user.name}</strong> ({user.email}) de <strong>{user.company}</strong>?
                        Este usuario perderá acceso al panel de RRHH.
                      </p>
                      <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                        <Button variant="destructive" onClick={() => handleDelete(user.id)} disabled={saving}>
                          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Eliminar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
