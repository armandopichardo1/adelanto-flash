import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, PenLine, Check, Download } from "lucide-react";
import { toast } from "sonner";
import { SignatureCanvas } from "@/components/shared/SignatureCanvas";
import {
  generateContractHTML,
  signContractAsEmployee,
  getContracts,
  type ContractRecord,
  type ContractData,
} from "@/lib/contract-template";
import { generateContractPDF } from "@/lib/contract-pdf";

interface ContractSigningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: ContractRecord;
  contractData: ContractData;
  onSigned: () => void;
}

export function ContractSigningModal({ open, onOpenChange, contract, contractData, onSigned }: ContractSigningModalProps) {
  const [accepted, setAccepted] = useState(false);
  const [signed, setSigned] = useState(false);
  const [hasSig, setHasSig] = useState(false);
  const [sigDataUrl, setSigDataUrl] = useState<string | null>(null);

  const handleSign = () => {
    signContractAsEmployee(contract.id, sigDataUrl || undefined);
    setSigned(true);
    toast.success("¡Contrato firmado exitosamente!");
    setTimeout(() => {
      onOpenChange(false);
      onSigned();
    }, 1500);
  };

  const handleDownloadPDF = () => {
    const freshContract = getContracts().find(c => c.id === contract.id);
    generateContractPDF(contractData, freshContract || contract);
    toast.success("PDF descargado");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Contrato de Autorización de Adelanto
          </DialogTitle>
        </DialogHeader>

        {signed ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary mx-auto flex items-center justify-center mb-4">
              <Check className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="font-headline text-xl font-bold text-foreground">¡Contrato Firmado!</h3>
            <p className="text-muted-foreground">Ya puedes solicitar adelantos de nómina.</p>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4" /> Descargar PDF
            </Button>
          </div>
        ) : (
          <>
            <div
              className="prose prose-sm max-w-none border border-outline-variant/20 rounded-xl p-6 bg-surface-container-low max-h-[50vh] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: generateContractHTML(contractData) }}
            />

            <div className="space-y-4 mt-4">
              <SignatureCanvas
                onSignatureChange={(has, dataUrl) => {
                  setHasSig(has);
                  setSigDataUrl(dataUrl);
                }}
              />

              <div className="flex items-start gap-3">
                <Checkbox
                  id="contract-accept"
                  checked={accepted}
                  onCheckedChange={(c) => setAccepted(c === true)}
                  className="mt-1"
                />
                <label htmlFor="contract-accept" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                  He leído y acepto los términos del presente acuerdo. Autorizo los descuentos de nómina correspondientes a los adelantos que solicite a través de <strong className="text-foreground">Adelanto Ya</strong>.
                </label>
              </div>

              <Button
                variant="flash"
                size="xl"
                className="w-full"
                onClick={handleSign}
                disabled={!accepted || !hasSig}
              >
                <PenLine className="w-5 h-5" /> Firmar Contrato
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
