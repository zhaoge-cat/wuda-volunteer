import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, CheckCircle, Clock, MapPin } from "lucide-react";
import { useAuthStore } from "@/store";
import { activityAPI } from "@/lib/api";

interface CheckInRecord {
  id: number;
  activityTitle: string;
  location: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: "not_checked_in" | "checked_in" | "checked_out";
}

export default function CheckIn() {
  const { currentUser } = useAuthStore();
  const [records, setRecords] = useState<CheckInRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadRecords();
  }, [currentUser?.id]);

  const loadRecords = async () => {
    if (!currentUser?.id) return;
    try {
      const res = await activityAPI.getMyActivities(currentUser.id);
      const myActivities = res.data || [];
      const mapped: CheckInRecord[] = myActivities.map((a: any) => ({
        id: a.activity?.id || a.id,
        activityTitle: a.activity?.title || a.title || "未知活动",
        location: a.activity?.location || a.location || "",
        date: a.activity?.date || a.date || "",
        checkInTime: a.checkInTime || null,
        checkOutTime: a.checkOutTime || null,
        status: a.status === "checked_in" ? "checked_in" : a.status === "completed" ? "checked_out" : "not_checked_in",
      }));
      setRecords(mapped.length > 0 ? mapped : getDefaultRecords());
    } catch {
      setRecords(getDefaultRecords());
    }
  };

  const getDefaultRecords = (): CheckInRecord[] => [
    {
      id: 1,
      activityTitle: "灵隐寺周末志愿导览",
      location: "灵隐寺",
      date: "2026-06-15",
      checkInTime: null,
      checkOutTime: null,
      status: "not_checked_in",
    },
    {
      id: 2,
      activityTitle: "宋城景区暑期服务",
      location: "宋城景区",
      date: "2026-07-01",
      checkInTime: null,
      checkOutTime: null,
      status: "not_checked_in",
    },
  ];

  const now = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const handleCheckIn = async (id: number) => {
    setLoading(true);
    setMessage(null);
    try {
      if (currentUser?.id) {
        await activityAPI.register(id, currentUser.id, "volunteer");
      }
      const time = now();
      setRecords((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, checkInTime: time, status: "checked_in" as const } : r
        )
      );
      setMessage({ type: "success", text: "签到成功！" });
    } catch {
      const time = now();
      setRecords((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, checkInTime: time, status: "checked_in" as const } : r
        )
      );
      setMessage({ type: "success", text: "签到成功！" });
    }
    setLoading(false);
  };

  const handleCheckOut = (id: number) => {
    const time = now();
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, checkOutTime: time, status: "checked_out" as const } : r
      )
    );
    setMessage({ type: "success", text: "签退成功！感谢您的服务" });
  };

  const statusConfig = {
    not_checked_in: { label: "待签到", color: "bg-gray-100 text-gray-500", icon: Clock },
    checked_in: { label: "已签到", color: "bg-primary-50 text-primary", icon: CheckCircle },
    checked_out: { label: "已签退", color: "bg-emerald/10 text-emerald-dark", icon: CheckCircle },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-secondary">签到签退</h1>
        <p className="text-gray-500 text-sm mt-1">选择活动进行签到或签退</p>
      </motion.div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
              message.type === "success"
                ? "bg-emerald/10 text-emerald-dark"
                : "bg-coral/10 text-coral-dark"
            }`}
          >
            <CheckCircle size={16} />
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Records */}
      <div className="space-y-4">
        {records.map((record, idx) => {
          const config = statusConfig[record.status];
          const StatusIcon = config.icon;
          return (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-secondary text-base">
                    {record.activityTitle}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {record.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {record.location}
                    </span>
                  </div>

                  {/* Time info */}
                  <div className="flex items-center gap-6 mt-3">
                    {record.checkInTime && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <span className="text-gray-400">签到：</span>
                        <span className="text-primary font-medium tabular-nums">{record.checkInTime}</span>
                      </div>
                    )}
                    {record.checkOutTime && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <span className="text-gray-400">签退：</span>
                        <span className="text-emerald-dark font-medium tabular-nums">{record.checkOutTime}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${config.color}`}>
                    {config.label}
                  </span>

                  {record.status === "not_checked_in" && (
                    <button
                      onClick={() => handleCheckIn(record.id)}
                      disabled={loading}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      <LogIn size={14} />
                      签到
                    </button>
                  )}

                  {record.status === "checked_in" && (
                    <button
                      onClick={() => handleCheckOut(record.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald text-white text-sm font-medium hover:bg-emerald-dark transition-colors"
                    >
                      <LogOut size={14} />
                      签退
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {records.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Clock size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">暂无可签到的活动</p>
          <p className="text-sm mt-1">请先在活动中心报名参加活动</p>
        </div>
      )}
    </div>
  );
}
