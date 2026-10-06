import React, { useState } from "react";
import { AppState } from "../types";
import { exportSyncToken, importSyncToken, downloadJsonBackup, saveAppState } from "../services/storage";
import { sounds } from "../services/audio";
import { 
  RefreshCw, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  Smartphone, 
  Laptop, 
  ShieldCheck, 
  X,
  AlertCircle
} from "lucide-react";

interface DeviceSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppState;
  onStateRestored: (newState: AppState) => void;
}

export const DeviceSyncModal: React.FC<DeviceSyncModalProps> = ({
  isOpen,
  onClose,
  state,
  onStateRestored,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [inputToken, setInputToken] = useState("");
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const syncToken = exportSyncToken(state);

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(syncToken);
      setCopied(true);
      sounds.playSuccess();
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyToken = () => {
    if (!inputToken.trim()) return;
    const restored = importSyncToken(inputToken.trim());
    if (restored) {
      onStateRestored(restored);
      sounds.playSuccess();
      setImportStatus("Đồng bộ thành công! Toàn bộ dữ liệu đã được cập nhật.");
      setTimeout(() => {
        setImportStatus(null);
        onClose();
      }, 1500);
    } else {
      sounds.playFailure();
      setImportStatus("Mã đồng bộ không hợp lệ. Vui lòng kiểm tra lại chuỗi mã.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as AppState;
        if (parsed.subjects && parsed.flashcards) {
          saveAppState(parsed);
          onStateRestored(parsed);
          sounds.playSuccess();
          setImportStatus("Khôi phục từ tệp tin JSON thành công!");
          setTimeout(() => {
            setImportStatus(null);
            onClose();
          }, 1500);
        } else {
          throw new Error("Invalid structure");
        }
      } catch (err) {
        sounds.playFailure();
        setImportStatus("Tệp sao lưu không đúng định dạng CogniLearn.");
      }
    };
    reader.readAsText(file);
  };

  const lastSyncDate = new Date(state.lastSyncTimestamp).toLocaleString("vi-VN");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border border-zinc-200 space-y-5 animate-in fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-zinc-700" />
            <h3 className="text-sm font-semibold text-zinc-900">
              Đồng bộ Đa Thiết bị & Chế độ Ngoại tuyến
            </h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Offline & Persistence Status Callout */}
        <div className="flex items-start gap-3 rounded-lg border border-emerald-200/80 bg-emerald-50/50 p-3 text-xs text-emerald-950">
          <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold">Bảo lưu Ngoại tuyến 100%:</span> Toàn bộ thẻ ghi nhớ, tiến độ 6 mức Bloom và lịch trình đều được lưu trữ trực tiếp trên thiết bị này. Bạn có thể sử dụng bình thường kể cả khi mất kết nối mạng.
            <div className="mt-1 text-[11px] text-emerald-800 font-mono">
              Lần cập nhật gần nhất: {lastSyncDate}
            </div>
          </div>
        </div>

        {/* Sync via Token Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-zinc-500" />
              <span>1. Mã Đồng bộ Nhanh sang Điện thoại / Laptop khác</span>
            </h4>
            <button
              onClick={handleCopyToken}
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-900 hover:underline cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Đã sao chép!" : "Sao chép mã"}</span>
            </button>
          </div>

          <textarea
            readOnly
            value={syncToken}
            rows={2}
            className="w-full rounded-md border border-zinc-200 bg-zinc-50 p-2 font-mono text-[11px] text-zinc-600 focus:outline-none select-all"
          />
          <p className="text-[11px] text-zinc-500">
            Dán mã này vào thiết bị mới để đồng bộ ngay toàn bộ flashcards và điểm số.
          </p>
        </div>

        {/* Import Token Section */}
        <div className="space-y-2 pt-2 border-t border-zinc-100">
          <h4 className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-zinc-500" />
            <span>2. Nhập Mã Đồng bộ từ Thiết bị khác</span>
          </h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="Dán mã bắt đầu bằng CGN-..."
              className="flex-1 rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-mono"
            />
            <button
              onClick={handleApplyToken}
              className="rounded-md bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 cursor-pointer"
            >
              Đồng bộ
            </button>
          </div>
        </div>

        {/* JSON Backup & Restore Option */}
        <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={() => downloadJsonBackup(state)}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải tệp sao lưu JSON</span>
          </button>

          <label className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Khôi phục từ tệp JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {importStatus && (
          <div className="p-2.5 rounded-md bg-zinc-100 text-xs text-zinc-800 text-center font-medium animate-in fade-in">
            {importStatus}
          </div>
        )}
      </div>
    </div>
  );
};
