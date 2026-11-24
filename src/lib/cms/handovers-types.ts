export const HANDOVER_SERVICES = [
  "Leštění laku",
  "Renovace laku",
  "Keramická ochrana",
  "Čištění interiéru",
  "Renovace světlometů",
  "Ostatní",
] as const;

export type HandoverStatus = "draft" | "awaiting_signature" | "signed";

export type HandoverProtocol = {
  id: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  status: HandoverStatus;
  handoverDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehiclePlate: string;
  vehicleColor: string;
  vehicleMileage: string;
  services: string[];
  servicesNote: string;
  conditionNotes: string;
  reservations: string;
  technicianSignature: string | null;
  customerSignature: string | null;
  customerSignedAt: string | null;
};

export type HandoverDraft = Omit<
  HandoverProtocol,
  "id" | "token" | "createdAt" | "updatedAt" | "status"
>;

export function emptyHandoverDraft(): HandoverDraft {
  const today = new Date().toISOString().slice(0, 10);
  return {
    handoverDate: today,
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    vehicleBrand: "",
    vehicleModel: "",
    vehiclePlate: "",
    vehicleColor: "",
    vehicleMileage: "",
    services: [],
    servicesNote: "",
    conditionNotes: "",
    reservations: "",
    technicianSignature: null,
    customerSignature: null,
    customerSignedAt: null,
  };
}
