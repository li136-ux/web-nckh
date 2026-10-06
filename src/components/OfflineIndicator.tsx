import React from "react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { WifiOff, Wifi } from "lucide-react";

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-xs font-medium text-white shadow-lg border border-zinc-700">
      <WifiOff className="w-3.5 h-3.5 text-amber-400" />
      <span>Chế độ ngoại tuyến · Dữ liệu được lưu trữ an toàn trong máy</span>
    </div>
  );
};
