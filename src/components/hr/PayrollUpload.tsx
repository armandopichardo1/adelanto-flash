import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  Download,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface ParsedEmployee {
  row: number;
  cedula: string;
  name: string;
  salary: number;
  department: string;
  joinDate: string;
  errors: string[];
}

const REQUIRED_HEADERS = ["cedula", "nombre", "salario", "departamento", "fecha_ingreso"];

function validateCedula(cedula: string): boolean {
  return /^\d{3}-\d{7}-\d{1}$/.test(cedula.trim());
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function PayrollUpload({
  onImportComplete,
}: {
  onImportComplete?: (count: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [parsed, setParsed] = useState<ParsedEmployee[]>([]);
  const [importing, setImporting] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Solo se aceptan archivos CSV");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("El archivo excede 5MB");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) {
        toast.error("El archivo está vacío o no tiene datos");
        return;
      }

      const headers = parseCsvLine(lines[0]).map((h) =>
        h.toLowerCase().replace(/\s+/g, "_").replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u")
      );

      const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
      if (missing.length > 0) {
        toast.error(`Columnas faltantes: ${missing.join(", ")}`);
        return;
      }

      const cedulaIdx = headers.indexOf("cedula");
      const nameIdx = headers.indexOf("nombre");
      const salaryIdx = headers.indexOf("salario");
      const deptIdx = headers.indexOf("departamento");
      const dateIdx = headers.indexOf("fecha_ingreso");

      const employees: ParsedEmployee[] = [];
      const seenCedulas = new Set<string>();

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCsvLine(lines[i]);
        if (cols.length < REQUIRED_HEADERS.length) continue;

        const errors: string[] = [];
        const cedula = cols[cedulaIdx]?.trim() || "";
        const name = cols[nameIdx]?.trim() || "";
        const salaryRaw = cols[salaryIdx]?.replace(/[^0-9.]/g, "") || "0";
        const salary = parseFloat(salaryRaw);
        const department = cols[deptIdx]?.trim() || "";
        const joinDate = cols[dateIdx]?.trim() || "";

        if (!cedula) errors.push("Cédula vacía");
        else if (!validateCedula(cedula)) errors.push("Formato cédula inválido (XXX-XXXXXXX-X)");
        if (seenCedulas.has(cedula)) errors.push("Cédula duplicada");
        seenCedulas.add(cedula);
        if (!name || name.length < 3) errors.push("Nombre muy corto");
        if (isNaN(salary) || salary < 1000) errors.push("Salario inválido (mín. RD$1,000)");
        if (salary > 500000) errors.push("Salario excesivo (>RD$500,000)");
        if (!department) errors.push("Departamento vacío");
        if (!joinDate) errors.push("Fecha de ingreso vacía");

        employees.push({ row: i + 1, cedula, name, salary, department, joinDate, errors });
      }

      setParsed(employees);
    };
    reader.readAsText(file, "UTF-8");
  }, []);

  const validCount = parsed.filter((e) => e.errors.length === 0).length;
  const errorCount = parsed.filter((e) => e.errors.length > 0).length;

  const handleImport = async () => {
    setImporting(true);
    // Simulate DB import delay
    await new Promise((r) => setTimeout(r, 1500));
    toast.success(`${validCount} empleados importados exitosamente`);
    if (errorCount > 0) toast.warning(`${errorCount} registros con errores fueron omitidos`);
    onImportComplete?.(validCount);
    setImporting(false);
    setParsed([]);
    setIsOpen(false);
    setFileName("");
  };

  const handleDownloadTemplate = () => {
    const template = [
      "cedula,nombre,salario,departamento,fecha_ingreso",
      "001-1234567-8,María Elena Pérez,28500,Producción,2022-03-15",
      "402-9876543-1,Carlos Ramón Díaz,35000,Calidad,2020-08-01",
    ].join("\n");
    const blob = new Blob([template], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_empleados_adelanto_ya.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Upload className="w-4 h-4" /> Importar Empleados (CSV)
      </Button>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <h3 className="font-headline text-lg font-bold text-foreground">Importar Empleados</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleDownloadTemplate}>
              <Download className="w-4 h-4" /> Descargar Plantilla
            </Button>
            <Button variant="ghost" size="icon" onClick={() => { setIsOpen(false); setParsed([]); setFileName(""); }}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {parsed.length === 0 ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
              dragOver ? "border-primary bg-accent" : "border-outline-variant/30 hover:border-primary/50"
            }`}
          >
            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium text-foreground">Arrastra tu archivo CSV aquí</p>
            <p className="text-sm text-muted-foreground mt-1">o haz clic para seleccionar</p>
            <p className="text-xs text-muted-foreground mt-3">
              Columnas requeridas: <code className="text-primary">cedula, nombre, salario, departamento, fecha_ingreso</code>
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) processFile(file);
              }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="outline" className="text-sm py-1 px-3">
                <FileSpreadsheet className="w-3 h-3 mr-1" /> {fileName}
              </Badge>
              <Badge className="bg-accent text-accent-foreground py-1 px-3">
                <CheckCircle2 className="w-3 h-3 mr-1" /> {validCount} válidos
              </Badge>
              {errorCount > 0 && (
                <Badge className="bg-destructive/10 text-destructive py-1 px-3">
                  <AlertTriangle className="w-3 h-3 mr-1" /> {errorCount} con errores
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">{parsed.length} registros total</span>
            </div>

            {/* Preview Table */}
            <div className="max-h-80 overflow-auto rounded-xl border border-outline-variant/15">
              <Table>
                <TableHeader>
                  <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Cédula</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Salario</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Fecha Ingreso</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsed.slice(0, 50).map((emp) => (
                    <TableRow
                      key={emp.row}
                      className={`border-outline-variant/15 ${emp.errors.length > 0 ? "bg-destructive/5" : ""}`}
                    >
                      <TableCell className="text-xs text-muted-foreground">{emp.row}</TableCell>
                      <TableCell className="font-mono text-sm">{emp.cedula || "—"}</TableCell>
                      <TableCell className="font-medium">{emp.name || "—"}</TableCell>
                      <TableCell>{emp.salary > 0 ? `RD$${emp.salary.toLocaleString("es-DO")}` : "—"}</TableCell>
                      <TableCell className="text-sm">{emp.department || "—"}</TableCell>
                      <TableCell className="text-sm">{emp.joinDate || "—"}</TableCell>
                      <TableCell>
                        {emp.errors.length === 0 ? (
                          <Badge variant="outline" className="bg-accent text-accent-foreground text-xs">✓ OK</Badge>
                        ) : (
                          <span className="text-xs text-destructive">{emp.errors.join("; ")}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {parsed.length > 50 && (
              <p className="text-xs text-muted-foreground text-center">Mostrando 50 de {parsed.length} registros</p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => { setParsed([]); setFileName(""); }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleImport}
                disabled={validCount === 0 || importing}
              >
                {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {importing ? "Importando..." : `Importar ${validCount} Empleados`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
