import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  Timer,
  Star,
  Award,
  LogIn,
  CalendarPlus,
  Gift,
  Trophy,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { useAuthStore } from "@/store";
import { userAPI } from "@/lib/api";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  gradient: string;
  delay: number;
}

const StatCard = ({ icon, label, value, gradient, delay }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className={`relative overflow-hidden rounded-2xl p-5 text-white ${gradient} shadow-lg`}
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-3 opacity-90">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-3xl font-bold tabular-nums">{value}</p>
    </div>
  </motion.div>
);

const quickActions = [
  { icon: LogIn, label: "签到", to: "/checkin", color: "bg-primary" },
  { icon: CalendarPlus, label: "活动报名", to: "/activities", color: "bg-secondary" },
  { icon: Gift, label: "抽盲盒", to: "/blindbox", color: "bg-coral" },
  { icon: Trophy, label: "徽章展馆", to: "/badges", color: "bg-gold-dark" },
];

const recentActivities = [
  { id: 1, title: "五一黄金周景区服务", date: "2025-05-01", location: "黄鹤楼景区", status: "已结束" },
  { id: 2, title: "暑期志愿服务", date: "2025-07-15", location: "东湖风景区", status: "即将开始" },
  { id: 3, title: "国庆假期引导", date: "2025-10-01", location: "武汉大学", status: "报名中" },
  { id: 4, title: "周末文明旅游宣传", date: "2025-06-20", location: "户部巷", status: "进行中" },
];

const notifications = [
  { id: 1, text: "您已获得新徽章「服务之星」", time: "2小时前", type: "badge" },
  { id: 2, text: "五一活动评分已出，综合评分 92 分", time: "1天前", type: "score" },
  { id: 3, text: "暑期志愿活动开始报名", time: "3天前", type: "activity" },
];

export default function Dashboard() {
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ shifts: 0, hours: 0, score: 0, badges: 0 });

  useEffect(() => {
    if (currentUser?.id) {
      userAPI.getProfile(currentUser.id).then((data) => {
        setStats({
          shifts: data.shifts ?? 12,
          hours: data.totalHours ?? 86,
          score: data.score ?? 92,
          badges: data.badgeCount ?? 8,
        });
      }).catch(() => {
        setStats({ shifts: 12, hours: 86, score: 92, badges: 8 });
      });
    }
  }, [currentUser?.id]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-secondary">
            你好，{currentUser?.name || "志愿者"} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            今天也是充满热情的一天
          </p>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Clock size={18} />}
          label="累计服务班次"
          value={stats.shifts}
          gradient="bg-gradient-to-br from-primary to-primary-dark"
          delay={0}
        />
        <StatCard
          icon={<Timer size={18} />}
          label="总服务时长"
          value={`${stats.hours}h`}
          gradient="bg-gradient-to-br from-secondary to-secondary-dark"
          delay={0.1}
        />
        <StatCard
          icon={<Star size={18} />}
          label="综合评分"
          value={stats.score}
          gradient="bg-gradient-to-br from-gold-dark to-gold"
          delay={0.2}
        />
        <StatCard
          icon={<Award size={18} />}
          label="徽章数量"
          value={stats.badges}
          gradient="bg-gradient-to-br from-emerald-dark to-emerald"
          delay={0.3}
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-secondary mb-3">快捷操作</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.to)}
              className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-card card-hover"
            >
              <div
                className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}
              >
                <action.icon size={20} className="text-white" />
              </div>
              <span className="text-sm font-medium text-secondary">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-secondary">近期活动</h2>
            <button
              onClick={() => navigate("/activities")}
              className="text-sm text-primary hover:text-primary-dark"
            >
              查看全部 →
            </button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-card card-hover cursor-pointer"
                onClick={() => navigate("/activities")}
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-secondary text-sm truncate">
                    {act.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>{act.date}</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {act.location}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    act.status === "已结束"
                      ? "bg-gray-100 text-gray-500"
                      : act.status === "进行中"
                      ? "bg-emerald-50 text-emerald-dark"
                      : act.status === "报名中"
                      ? "bg-primary-50 text-primary"
                      : "bg-gold/10 text-gold-dark"
                  }`}
                >
                  {act.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold text-secondary mb-3">通知</h2>
          <div className="bg-white rounded-xl shadow-card p-4 space-y-4">
            {notifications.map((n) => (
              <div key={n.id} className="flex gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    n.type === "badge"
                      ? "bg-gold/10"
                      : n.type === "score"
                      ? "bg-emerald/10"
                      : "bg-primary-50"
                  }`}
                >
                  {n.type === "badge" ? (
                    <Award size={14} className="text-gold-dark" />
                  ) : n.type === "score" ? (
                    <Star size={14} className="text-emerald" />
                  ) : (
                    <CalendarPlus size={14} className="text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-secondary">{n.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
