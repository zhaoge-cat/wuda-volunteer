import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Calendar,
  Clock,
  Award,
  Star,
  BookOpen,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { useAuthStore } from "@/store";
import { evaluationAPI } from "@/lib/api";

const serviceRecords = [
  { id: 1, date: "2025-05-01", activity: "五一黄金周景区服务", location: "黄鹤楼景区", hours: 8, score: 95 },
  { id: 2, date: "2025-04-15", activity: "周末文明旅游宣传", location: "户部巷", hours: 4, score: 88 },
  { id: 3, date: "2025-03-20", activity: "春季志愿服务", location: "东湖风景区", hours: 6, score: 92 },
  { id: 4, date: "2025-02-14", activity: "情人节文明引导", location: "武汉大学", hours: 5, score: 90 },
];

const honorRecords = [
  { id: 1, title: "月度之星", period: "2025年4月", level: "gold" },
  { id: 2, title: "优秀志愿者", period: "2025年Q1", level: "silver" },
];

export default function Profile() {
  const { currentUser } = useAuthStore();
  const [evalData, setEvalData] = useState([
    { subject: "服务态度", score: 90, fullMark: 100 },
    { subject: "专业能力", score: 85, fullMark: 100 },
    { subject: "团队协作", score: 88, fullMark: 100 },
    { subject: "纪律遵守", score: 92, fullMark: 100 },
    { subject: "创新能力", score: 78, fullMark: 100 },
  ]);

  useEffect(() => {
    if (currentUser?.id) {
      evaluationAPI.getByUser(currentUser.id).then((data) => {
        if (data?.dimensions) {
          setEvalData(data.dimensions);
        }
      }).catch(() => {});
    }
  }, [currentUser?.id]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-card p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-gold flex items-center justify-center flex-shrink-0">
            <span className="text-white text-3xl font-bold">
              {currentUser?.name?.charAt(0) || "U"}
            </span>
          </div>
          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-secondary">
                {currentUser?.name || "志愿者"}
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary">
                {currentUser?.role === "admin" ? "管理员" : "志愿者"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <User size={14} />
                {currentUser?.phone || "138****0000"}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={14} />
                {currentUser?.school || "武汉大学"}
              </span>
            </div>
          </div>
          {/* Quick Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary tabular-nums">12</p>
              <p className="text-xs text-gray-400">服务班次</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary tabular-nums">86h</p>
              <p className="text-xs text-gray-400">服务时长</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gold-dark tabular-nums">92</p>
              <p className="text-xs text-gray-400">综合评分</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-card p-6"
        >
          <h2 className="text-lg font-semibold text-secondary mb-4">
            能力雷达图
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={evalData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#718096", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "#A0AEC0", fontSize: 10 }}
              />
              <Radar
                name="评分"
                dataKey="score"
                stroke="#FF6B35"
                fill="#FF6B35"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Honor Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-card p-6"
        >
          <h2 className="text-lg font-semibold text-secondary mb-4">
            荣誉记录
          </h2>
          <div className="space-y-3">
            {honorRecords.map((h) => (
              <div
                key={h.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    h.level === "gold"
                      ? "bg-gold/20"
                      : h.level === "silver"
                      ? "bg-gray-200"
                      : "bg-orange-100"
                  }`}
                >
                  <Star
                    size={18}
                    className={
                      h.level === "gold"
                        ? "text-gold-dark"
                        : h.level === "silver"
                        ? "text-gray-500"
                        : "text-orange-600"
                    }
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-secondary text-sm">{h.title}</p>
                  <p className="text-xs text-gray-400">{h.period}</p>
                </div>
                <Award
                  size={16}
                  className={
                    h.level === "gold" ? "text-gold-dark" : "text-gray-400"
                  }
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Service Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-card p-6"
      >
        <h2 className="text-lg font-semibold text-secondary mb-6">
          服务记录
        </h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-6">
            {serviceRecords.map((record, idx) => (
              <div key={record.id} className="flex gap-4 relative">
                {/* Timeline dot */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    idx === 0
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Clock size={16} />
                </div>
                {/* Content */}
                <div className="flex-1 bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-secondary text-sm">
                        {record.activity}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {record.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {record.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary tabular-nums">
                        {record.hours}h
                      </p>
                      <p className="text-xs text-gray-400">
                        评分 {record.score}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
