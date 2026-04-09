// Contract template based on Dominican Republic labor law
// Código de Trabajo de la República Dominicana (Ley 16-92)

export interface ContractData {
  employerName: string;
  employerRNC: string;
  employeeName: string;
  employeeCedula: string;
  employeeDepartment: string;
  employeeSalary: number;
  maxAdvancePercent: number;
  date: string;
}

export function generateContractHTML(data: ContractData): string {
  const formattedSalary = new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 2,
  }).format(data.employeeSalary);

  return `
<div style="font-family: serif; line-height: 1.8; color: #1a1a1a; max-width: 700px; margin: 0 auto;">
  <h2 style="text-align: center; font-size: 1.2rem; margin-bottom: 0.5rem;">ACUERDO DE ADELANTO DE SALARIO</h2>
  <p style="text-align: center; font-size: 0.85rem; color: #555; margin-bottom: 2rem;">
    Conforme al Código de Trabajo de la República Dominicana (Ley 16-92)<br/>
    y la Resolución No. 07/2007 del Ministerio de Trabajo
  </p>

  <p><strong>En la ciudad de Santo Domingo, Distrito Nacional,</strong> a los <strong>${data.date}</strong>, las partes abajo indicadas convienen en celebrar el presente acuerdo:</p>

  <h3 style="margin-top: 1.5rem;">ENTRE:</h3>

  <p><strong>PRIMERA PARTE (EL EMPLEADOR):</strong><br/>
  <strong>${data.employerName}</strong>, empresa debidamente constituida y organizada de conformidad con las leyes de la República Dominicana, con RNC No. <strong>${data.employerRNC}</strong>, representada por su Director de Recursos Humanos, en lo adelante denominada "El Empleador".</p>

  <p><strong>SEGUNDA PARTE (EL EMPLEADO):</strong><br/>
  <strong>${data.employeeName}</strong>, dominicano(a), mayor de edad, portador(a) de la Cédula de Identidad y Electoral No. <strong>${data.employeeCedula}</strong>, empleado(a) del departamento de <strong>${data.employeeDepartment}</strong>, en lo adelante denominado(a) "El Empleado".</p>

  <h3 style="margin-top: 1.5rem;">OBJETO DEL ACUERDO:</h3>
  <p>El presente acuerdo tiene por objeto regular las condiciones bajo las cuales El Empleado podrá solicitar y recibir adelantos parciales de su salario a través de la plataforma digital <strong>"Adelanto Ya"</strong>, operada como intermediario tecnológico autorizado por El Empleador.</p>

  <h3 style="margin-top: 1.5rem;">CLÁUSULAS:</h3>

  <p><strong>PRIMERA:</strong> AUTORIZACIÓN DE DESCUENTO. — El Empleado autoriza libre y voluntariamente a El Empleador a descontar de su salario las sumas correspondientes a los adelantos recibidos, más las comisiones de servicio aplicables, conforme a lo dispuesto en el <strong>Artículo 201 del Código de Trabajo</strong>, el cual establece que los descuentos al salario del trabajador deben ser autorizados por este.</p>

  <p><strong>SEGUNDA:</strong> LÍMITE DE ADELANTOS. — El monto máximo de cada adelanto no excederá el <strong>${data.maxAdvancePercent}%</strong> del salario mensual del Empleado, actualmente de <strong>${formattedSalary}</strong>. Los descuentos totales por concepto de adelantos no superarán el <strong>30%</strong> del salario neto quincenal, en cumplimiento con el <strong>Principio V del Código de Trabajo</strong> sobre la intangibilidad del salario mínimo.</p>

  <p><strong>TERCERA:</strong> COMISIÓN DE SERVICIO. — El Empleado reconoce que el servicio de adelanto de nómina genera una comisión de servicio transparente, la cual será informada de forma clara y detallada <strong>antes</strong> de confirmar cada solicitud. Dicha comisión <strong>no constituye interés</strong> en los términos de la Ley Monetaria y Financiera (Ley 183-02), por tratarse de un servicio de gestión y administración de nómina.</p>

  <p><strong>CUARTA:</strong> FRECUENCIA Y MODALIDAD. — Los descuentos se aplicarán de forma <strong>quincenal</strong> a través de la nómina regular del Empleador. En caso de terminación del contrato de trabajo, cualquier saldo pendiente será descontado de las prestaciones laborales correspondientes, conforme al <strong>Artículo 86</strong> del Código de Trabajo.</p>

  <p><strong>QUINTA:</strong> PROTECCIÓN DE DATOS. — Ambas partes se comprometen a proteger la información personal y financiera compartida en virtud de este acuerdo, conforme a la <strong>Ley 172-13</strong> sobre Protección Integral de los Datos Personales.</p>

  <p><strong>SEXTA:</strong> VOLUNTARIEDAD. — El presente acuerdo es de naturaleza estrictamente voluntaria. El Empleado podrá revocar esta autorización en cualquier momento mediante notificación escrita al Departamento de Recursos Humanos, sin que ello afecte su relación laboral.</p>

  <p><strong>SÉPTIMA:</strong> VIGENCIA. — Este acuerdo tendrá vigencia mientras dure la relación laboral entre las partes o hasta que sea revocado por cualquiera de ellas con <strong>quince (15) días</strong> de antelación.</p>

  <p><strong>OCTAVA:</strong> JURISDICCIÓN. — Para cualquier controversia derivada del presente acuerdo, las partes se someten a la jurisdicción de los <strong>Juzgados de Trabajo</strong> del Distrito Nacional, República Dominicana.</p>

  <div style="margin-top: 3rem; display: flex; justify-content: space-between;">
    <div style="text-align: center; width: 45%;">
      <div style="border-bottom: 2px solid #333; min-height: 60px; margin-bottom: 0.5rem; display:flex; align-items:flex-end; justify-content:center; padding-bottom:4px;" id="employer-signature">
        <span style="color: #999; font-size: 0.8rem;">Firma del Empleador</span>
      </div>
      <p style="font-size: 0.85rem;"><strong>${data.employerName}</strong><br/>RNC: ${data.employerRNC}</p>
    </div>
    <div style="text-align: center; width: 45%;">
      <div style="border-bottom: 2px solid #333; min-height: 60px; margin-bottom: 0.5rem; display:flex; align-items:flex-end; justify-content:center; padding-bottom:4px;" id="employee-signature">
        <span style="color: #999; font-size: 0.8rem;">Firma del Empleado</span>
      </div>
      <p style="font-size: 0.85rem;"><strong>${data.employeeName}</strong><br/>Cédula: ${data.employeeCedula}</p>
    </div>
  </div>
</div>`;
}

// Contract store (localStorage-based for demo)
export interface ContractRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCedula: string;
  employerSigned: boolean;
  employerSignedAt?: string;
  employerSignatureDataUrl?: string;
  employeeSigned: boolean;
  employeeSignedAt?: string;
  employeeSignatureDataUrl?: string;
  createdAt: string;
  status: "pending_employer" | "pending_employee" | "active" | "revoked";
}

const CONTRACTS_KEY = "adelantoYa_contracts";

export function getContracts(): ContractRecord[] {
  try {
    return JSON.parse(localStorage.getItem(CONTRACTS_KEY) || "[]");
  } catch { return []; }
}

export function saveContracts(contracts: ContractRecord[]) {
  localStorage.setItem(CONTRACTS_KEY, JSON.stringify(contracts));
}

export function getContractForEmployee(employeeId: string): ContractRecord | undefined {
  return getContracts().find(c => c.employeeId === employeeId && c.status !== "revoked");
}

export function isEmployeeContractFullySigned(employeeId: string): boolean {
  const contract = getContractForEmployee(employeeId);
  return !!contract && contract.status === "active";
}

export function createContract(employeeId: string, employeeName: string, employeeCedula: string): ContractRecord {
  const contracts = getContracts();
  contracts.forEach(c => {
    if (c.employeeId === employeeId && c.status !== "revoked") c.status = "revoked";
  });
  const newContract: ContractRecord = {
    id: `contract-${Date.now()}`,
    employeeId,
    employeeName,
    employeeCedula,
    employerSigned: false,
    employeeSigned: false,
    createdAt: new Date().toISOString(),
    status: "pending_employer",
  };
  contracts.push(newContract);
  saveContracts(contracts);
  return newContract;
}

export function signContractAsEmployer(contractId: string, signatureDataUrl?: string): ContractRecord | undefined {
  const contracts = getContracts();
  const c = contracts.find(x => x.id === contractId);
  if (!c) return undefined;
  c.employerSigned = true;
  c.employerSignedAt = new Date().toISOString();
  if (signatureDataUrl) c.employerSignatureDataUrl = signatureDataUrl;
  c.status = c.employeeSigned ? "active" : "pending_employee";
  saveContracts(contracts);
  return c;
}

export function signContractAsEmployee(contractId: string, signatureDataUrl?: string): ContractRecord | undefined {
  const contracts = getContracts();
  const c = contracts.find(x => x.id === contractId);
  if (!c) return undefined;
  c.employeeSigned = true;
  c.employeeSignedAt = new Date().toISOString();
  if (signatureDataUrl) c.employeeSignatureDataUrl = signatureDataUrl;
  c.status = c.employerSigned ? "active" : "pending_employer";
  saveContracts(contracts);
  return c;
}
