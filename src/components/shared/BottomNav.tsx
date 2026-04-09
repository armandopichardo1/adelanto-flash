import { useNavigate } from "react-router-dom";

interface BottomNavProps {
  activeTab?: string;
}

export function BottomNav({ activeTab = "home" }: BottomNavProps) {
  const navigate = useNavigate();

  const items = [
    { icon: "home", label: "Inicio", id: "home", path: "/employee" },
    { icon: "payments", label: "Adelantos", id: "advances", path: "/advance-request" },
    { icon: "receipt_long", label: "Historial", id: "history", path: "/history" },
    { icon: "person", label: "Perfil", id: "profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-2 pb-6 bg-surface-container-lowest/80 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_30px_rgba(0,110,42,0.04)] md:hidden">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
            activeTab === item.id ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
          <span className="text-[11px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
