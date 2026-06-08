import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  Users,
  X,
  CheckCircle,
} from "lucide-react";
import { useAuthStore } from "@/store";
import { activityAPI } from "@/lib/api";

type StatusFilter = "all" | "upcoming" | "ongoing" | "ended";
type ViewTab = "all" | "my";

interface Activity {
  id: number;
  title: string;
  date: string;
  endDate: string;
  location: string;
  totalShifts: number;
  filledShifts: number;
  status: "upcoming" | "ongoing" | "ended";
  description: string;
  registered?: boolean;
}

const statusFilters: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "upcoming", label: "即将开始" },
  { key: "ongoing", label: "进行中" },
  { key: "ended", label: "已结束" },
];

const demoActivities: Activity[] = [
  { id: 1, title: "五一黄金周景区服务", date: "2025-05-01", endDate: "2025-05-03", location: "黄鹤楼景区", totalShifts: 30, filledShifts: 28, status: "ended", description: "五一假期黄鹤楼景区志愿服务，负责游客引导、秩序维护等工作。", registered: true },
  { id: 2, title: "暑期志愿服务", date: "2025-07-15", endDate: "2025-07-20", location: "东湖风景区", totalShifts: 50, filledShifts: 35, status: "upcoming", description: "暑期东湖风景区志愿服务，提供讲解、引导等服务。", registered: false },
  { id: 3, title: "国庆假期引导", date: "2025-10-01", endDate: "2025-10-07", location: "武汉大学", totalShifts: 40, filledShifts: 12, status: "upcoming", description: "国庆期间武汉大学校园引导志愿服务。", registered: false },
  { id: 4, title: "周末文明旅游宣传", date: "2025-06-20", endDate: "2025-06-20", location: "户部巷", totalShifts: 15, filledShifts: 15, status: "ongoing", description: "户部巷文明旅游宣传志愿服务。", registered: true },
  { id: 5, title: "中秋佳节志愿服务", date: "2025-09-14", endDate: "2025-09-15", location: "归元寺", totalShifts: 20, filledShifts: 8, status: "upcoming", description: "中秋节期间归元寺景区志愿服务。", registered: false },
];

const statusLabels: Record<string, { text: string; class: string }> = {
  upcoming: { text: "即将开始", class: "bg-gold/10 text-gold-dark" },
  ongoing: { text: "进行中", class: "bg-emerald/10 text-emerald-dark" },
  ended: { text: "已结束", class: "bg-gray-100 text-gray-500" },
};

export default function Activities() {
  const { currentUser } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [viewTab, setViewTab] = useState<ViewTab>("all");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [registering, setRegistering] = useState(false);

  const filtered = demoActivities.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (viewTab === "my" && !a.registered) return false;
    return true;
  });

  const handleRegister = async (activity: Activity) => {
    if (!currentUser?.id || registering) return;
    setRegistering(true);
    try {
      await activityAPI.register(activity.id, currentUser.id, "volunteer");
      setSelectedActivity(null);
    } catch {
      // Demo: just close
      setSelectedActivity(null);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-secondary">活动中心</h1>
        <p className="text-gray-500 text-sm mt-1">
          发现志愿活动，贡献你的力量
        </p>
      </motion.div>

      {/* View Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-card w-fit">
        <button
          onClick={() => setViewTab("all")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            viewTab === "all"
              ? "bg-primary text-white shadow-md"
              : "text-gray-500 hover:text-secondary"
          }`}
        >
          全部活动
        </button>
        <button
          onClick={() => setViewTab("my")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            viewTab === "my"
              ? "bg-primary text-white shadow-md"
              : "text-gray-500 hover:text-secondary"
          }`}
        >
          我的活动
        </button>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              statusFilter === f.key
                ? "bg-secondary text-white"
                : "bg-white text-gray-500 hover:bg-gray-100 shadow-sm"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activity Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((activity, idx) => {
          const progress = (activity.filledShifts / activity.totalShifts) * 100;
          const status = statusLabels[activity.status];
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedActivity(activity)}
              className="bg-white rounded-2xl shadow-card p-5 card-hover cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-secondary text-sm flex-1">
                  {activity.title}
                </h3>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ml-2 ${status.class}`}
                >
                  {status.text}
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <CalendarDays size={13} />
                  <span>{activity.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} />
                  <span>{activity.location}</span>
                </div>
              </div>

              {/* Shifts progress */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-400">班次进度</span>
                  <span className="text-secondary font-medium tabular-nums">
                    {activity.filledShifts}/{activity.totalShifts}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-gold rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {activity.registered && (
                <div className="mt-3 flex items-center gap-1 text-xs text-emerald">
                  <CheckCircle size={13} />
                  <span>已报名</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <CalendarDays size={40} className="mx-auto mb-3 opacity-40" />
          <p>暂无活动</p>
        </div>
      )}

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedActivity(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full relative"
            >
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold text-secondary">
                {selectedActivity.title}
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <CalendarDays size={16} className="text-primary" />
                  {selectedActivity.date} ~ {selectedActivity.endDate}
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={16} className="text-primary" />
                  {selectedActivity.location}
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Users size={16} className="text-primary" />
                  班次 {selectedActivity.filledShifts}/{selectedActivity.totalShifts}
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                {selectedActivity.description}
              </p>

              <div className="mt-6 flex gap-3">
                {selectedActivity.registered ? (
                  <div className="flex-1 py-2.5 rounded-xl bg-emerald/10 text-emerald text-center text-sm font-medium flex items-center justify-center gap-2">
                    <CheckCircle size={16} />
                    已报名
                  </div>
                ) : selectedActivity.status === "ended" ? (
                  <div className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-400 text-center text-sm font-medium">
                    活动已结束
                  </div>
                ) : (
                  <button
                    onClick={() => handleRegister(selectedActivity)}
                    disabled={registering}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium hover:shadow-lg transition-all disabled:opacity-60"
                  >
                    {registering ? "报名中..." : "立即报名"}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
