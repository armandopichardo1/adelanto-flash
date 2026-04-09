import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus, CheckCircle2, Clock, Eye, PenLine } from "lucide-react";
import { toast } from "sonner";
import {
  getContracts,
  createContract,
  signContractAsEmployer,
  generateContractHTML,
  type ContractRecord,
  type ContractData,
} from "@/lib/contract-template";

interface ContractManagementProps {
  employees: Array<{
    id: string;
    name: string;
    cedula: string;
    salary: number;
    department: string;
  }>;
  companyName: string;
  companyRNC: string;
}

export function ContractManagement({ employees, companyName, companyRNC }: ContractManagementProps) {
  const [contracts, setContracts] = useState<ContractRecord[]>([]);
  const [previewContractData, setPreviewContractData] = useState<ContractData | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const refreshContracts = () => setContracts(getContracts());
  useEffect(refreshContracts, []);

  const handleCreateContract = (emp: typeof employees[0]) => {
    createContract(emp.id, emp.name, emp.cedula);
    refreshContracts();
    toast.success(`Contrato creado para ${emp.name}`);
  };

  const handleSignAsEmployer = (contractId: string) => {
    signContractAsEmployer(contractId);
    refreshContracts();
    toast.success("Contrato firmado por el empleador");
  };

  const handlePreview = (emp: typeof employees[0]) => {
    setPreviewContractData({
      employerName: companyName,
      employerRNC: companyRNC,
      employeeName: emp.name,
      employeeCedula: emp.cedula,
      employeeDepartment: emp.department,
      employeeSalary: emp.salary,
      maxAdvancePercent: 30,
      date: new Date().toLocaleDateString("es-DO", { day: "numeric", month: "long", year: "numeric" }),
    });
    setPreviewOpen(true);
  };

  const getEmployeeContract = (empId: string) =>
    contracts.find(c => c.employeeId === empId && c.status !== "revoked");

  const getStatusBadge = (contract?: ContractRecord) => {
    if (!contract) return <Badge variant="outline" className="text-muted-foreground">Sin contrato</Badge>;
    switch (contract.status) {
      case "pending_employer":
        return <Badge variant="outline" className="border-warning text-warning">Pendiente firma RH</Badge>;
      case "pending_employee":
        return <Badge variant="outline" className="border-primary text-primary">Pendiente firma empleado</Badge>;
      case "active":
        return <Badge className="bg-primary text-primary-foreground">Activo ✓</Badge>;
      default:
        return <Badge variant="outline">Revocado</Badge>;
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-card">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          <div>
            <h2 className="font-headline text-lg font-bold text-foreground">Contratos de Adelanto</h2>
            <p className="text-muted-foreground text-sm">Gestiona los contratos de autorización de descuento</p>
          </div>
        </div>
        <Badge variant="outline" className="border-primary text-primary">
          {contracts.filter(c => c.status === "active").length} Activos
        </Badge>
      </div>

      <div className="px-4 pb-6 space-y-3">
        {employees.map(emp => {
          const contract = getEmployeeContract(emp.id);
          return (
            <div key={emp.id} className="rounded-xl border border-outline-variant/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">{emp.cedula}</p>
                </div>
                {getStatusBadge(contract)}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="ghost" size="sm" onClick={() => handlePreview(emp)}>
                  <Eye className="w-4 h-4" /> Ver
                </Button>
                {!contract && (
                  <Button variant="default" size="sm" onClick={() => handleCreateContract(emp)}>
                    <Plus className="w-4 h-4" /> Crear
                  </Button>
                )}
                {contract?.status === "pending_employer" && (
                  <Button variant="default" size="sm" onClick={() => handleSignAsEmployer(contract.id)}>
                    <PenLine className="w-4 h-4" /> Firmar
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contract Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-headline">Vista Previa del Contrato</DialogTitle>
          </DialogHeader>
          {previewContractData && (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: generateContractHTML(previewContractData) }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
