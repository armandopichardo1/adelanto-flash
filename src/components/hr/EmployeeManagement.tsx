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
import {
  UserPlus, Search, Edit2, Trash2, Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Employee {
  id: string;
  name: string;
  cedula: string;
  salary: number;
  tenure: number;
  department: string;
  status: "ACTIVO" | "INACTIVO";
  employer: string;
}

interface EmployeeManagementProps {
  employees: Employee[];
  companyName: string;
  onEmployeesChange?: (employees: Employee[]) => void;
}

const DEPARTMENTS = ["Producción", "Calidad", "Empaque", "Logística", "Supervisión", "Mantenimiento", "Control de Calidad", "Administración", "RRHH"];

const emptyForm: { name: string; cedula: string; salary: string; department: string; status: "ACTIVO" | "INACTIVO" } = {
  name: "", cedula: "", salary: "", department: "Producción", status: "ACTIVO",
};

export function EmployeeManagement({ employees: initialEmployees, companyName, onEmployeesChange }: EmployeeManagementProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = employees.filter(
    (e) => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.cedula.includes(searchTerm)
  );

  const updateEmployees = (next: Employee[]) => {
    setEmployees(next);
    onEmployeesChange?.(next);
  };

  const handleCreate = async () => {
    if (!form.name || !form.cedula || !form.salary) {
      toast.error("Todos los campos son obligatorios");
      return;
    }
    if (!/^\d{3}-\d{7}-\d{1}$/.test(form.cedula)) {
      toast.error("Formato de cédula inválido (XXX-XXXXXXX-X)");
      return;
    }
    if (employees.some((e) => e.cedula === form.cedula)) {
      toast.error("Ya existe un empleado con esa cédula");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));

    const newEmp: Employee = {
      id: `e-${Date.now()}`,
      name: form.name,
      cedula: form.cedula,
      salary: parseFloat(form.salary),
      tenure: 0,
      department: form.department,
      status: form.status,
      employer: companyName,
    };
    updateEmployees([...employees, newEmp]);
    setForm(emptyForm);
    setIsCreateOpen(false);
    setSaving(false);
    toast.success(`${newEmp.name} creado exitosamente`);
  };

  const handleEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));

    updateEmployees(
      employees.map((e) =>
        e.id === editingId
          ? { ...e, name: form.name, cedula: form.cedula, salary: parseFloat(form.salary), department: form.department, status: form.status }
          : e
      )
    );
    setEditingId(null);
    setForm(emptyForm);
    setSaving(false);
    toast.success("Empleado actualizado");
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    const emp = employees.find((e) => e.id === id);
    updateEmployees(employees.filter((e) => e.id !== id));
    setDeleteConfirmId(null);
    setSaving(false);
    toast.success(`${emp?.name} eliminado`);
  };

  const openEdit = (emp: Employee) => {
    setForm({ name: emp.name, cedula: emp.cedula, salary: String(emp.salary), department: emp.department, status: emp.status });
    setEditingId(emp.id);
  };

  const formatDOP = (n: number) => `RD$${n.toLocaleString("es-DO")}`;

  return (
    <section className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="font-headline text-lg font-bold text-foreground">Gestión de Empleados</h2>
            <p className="text-sm text-muted-foreground">{employees.length} empleados registrados en {companyName}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por nombre o cédula..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-56" />
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setForm(emptyForm)}>
                  <UserPlus className="w-4 h-4" /> Nuevo Empleado
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Empleado</DialogTitle>
                </DialogHeader>
                <EmployeeForm form={form} setForm={setForm} />
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                  <Button onClick={handleCreate} disabled={saving}>
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />} Crear Empleado
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
            <TableHead>Empleado</TableHead>
            <TableHead>Cédula</TableHead>
            <TableHead>Salario</TableHead>
            <TableHead>Antigüedad</TableHead>
            <TableHead>Depto.</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((emp) => (
            <TableRow key={emp.id} className="border-outline-variant/15">
              <TableCell className="font-medium">{emp.name}</TableCell>
              <TableCell className="font-mono text-sm">{emp.cedula}</TableCell>
              <TableCell>{formatDOP(emp.salary)}</TableCell>
              <TableCell>{emp.tenure > 0 ? `${emp.tenure} años` : "Nuevo"}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{emp.department}</TableCell>
              <TableCell>
                <Badge variant="outline" className={emp.status === "ACTIVO" ? "bg-accent text-accent-foreground" : "bg-surface-container text-muted-foreground"}>
                  {emp.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Dialog open={editingId === emp.id} onOpenChange={(open) => { if (!open) setEditingId(null); }}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(emp)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Editar Empleado</DialogTitle></DialogHeader>
                      <EmployeeForm form={form} setForm={setForm} />
                      <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                        <Button onClick={handleEdit} disabled={saving}>
                          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Guardar Cambios
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={deleteConfirmId === emp.id} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null); }}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteConfirmId(emp.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Confirmar Eliminación</DialogTitle></DialogHeader>
                      <p className="text-muted-foreground">¿Estás seguro de eliminar a <strong>{emp.name}</strong> ({emp.cedula})? Esta acción no se puede deshacer.</p>
                      <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                        <Button variant="destructive" onClick={() => handleDelete(emp.id)} disabled={saving}>
                          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Eliminar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No se encontraron empleados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}

function EmployeeForm({ form, setForm }: { form: typeof emptyForm; setForm: (f: typeof emptyForm) => void }) {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label>Nombre Completo</Label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="María Elena Pérez" />
      </div>
      <div className="space-y-2">
        <Label>Cédula</Label>
        <Input value={form.cedula} onChange={(e) => setForm({ ...form, cedula: e.target.value })} placeholder="001-1234567-8" className="font-mono" />
      </div>
      <div className="space-y-2">
        <Label>Salario Mensual (RD$)</Label>
        <Input type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="28500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Departamento</Label>
          <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Estado</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "ACTIVO" | "INACTIVO" })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVO">Activo</SelectItem>
              <SelectItem value="INACTIVO">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
