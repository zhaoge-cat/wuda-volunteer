import { motion } from "framer-motion";
import {
  Users,
  CalendarDays,
  Clock,
  Award,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";

const monthlyData = [
  { month: "1月", volunteers: 45, shifts: 120 },
  { month: "2月", volunteers: 52, shifts: 135 },
  { month: "3月", volunteers: 68, shifts: 180 },
  { month: "4月", volunteers: 75, shifts: 210 },
  { month: "5月", volunteers: 90, shifts: 260 },
  { month: "6月", volunteers: 85, shifts: 240 },
];

const scoreData = [
  { range: "60-70", count: 5 },
  { range: "70-80", count: 12 },
  { range: "80-90", count: 28 },
  { range: "90-100", count: 15 },
];

const participationData = [
  { name: "引导", value: 35, color: "#FF6B35" },
  { name: "讲解", value: 25, color: "#1A365D" },
  { name: "秩序维护", value: 20, color: "#48BB78" },
  { name: "急救", value: 10, color: "#F6AD55" },
  { name: "其他", value: 10, color: "#FC8181" },
];

const stats = [
  { icon: Users, label: "志愿者总数", value: 156, color: "from-primary to-primary-dark" },
  { icon: CalendarDays, label: "本月活动", value: 8, color: "from-secondary to-secondary-dark" },
  { icon: Clock, label: "本月班次", value: 240, color: "from-gold-dark to-gold" },
  { icon: Award, label: "本月评优", value: 12, color: "from-emerald-dark to-emerald" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-secondary">管理概览</h1>
        <p className="text-gray-500 text-sm mt-1">平台运营数据一览</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-lg`}
          >
            <s.icon size={20} className="opacity-80" />
            <p className="text-2xl font-bold mt-2 tabular-nums">{s.value}</p>
            <p className="text-sm opacity-80">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-card p-6"
        >
          <h2 className="text-lg font-semibold text-secondary mb-4">
            月度趋势
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#A0AEC0" />
              <YAxis tick={{ fontSize: 12 }} stroke="#A0AEC0" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="volunteers"
                name="志愿者"
                stroke="#FF6B35"
                strokeWidth={2}
                dot={{ fill: "#FF6B35" }}
              />
              <Line
                type="monotone"
                dataKey="shifts"
                name="班次"
                stroke="#1A365D"
                strokeWidth={2}
                dot={{ fill: "#1A365D" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-card p-6"
        >
          <h2 className="text-lg font-semibold text-secondary mb-4">
            评分分布
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="#A0AEC0" />
              <YAxis tick={{ fontSize: 12 }} stroke="#A0AEC0" />
              <Tooltip />
              <Bar dataKey="count" name="人数" fill="#FF6B35" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-card p-6"
        >
          <h2 className="text-lg font-semibold text-secondary mb-4">
            岗位参与分布
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={participationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {participationData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-card p-6"
        >
          <h2 className="text-lg font-semibold text-secondary mb-4">
            快捷管理
          </h2>
          <div className="space-y-3">
            {[
              { to: "/admin/shifts", label: "班次管理", desc: "创建和管理服务班次" },
              { to: "/admin/attendance", label: "考勤管理", desc: "签到签退与考勤记录" },
              { to: "/admin/scoring", label: "评分管理", desc: "志愿者评分与考核" },
              { to: "/admin/stats", label: "数据统计", desc: "详细数据分析与导出" },
            ].map((link) => (
              <button
                key={link.to}
                onClick={() => navigate(link.to)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors text-left"
              >
                <div>
                  <p className="font-medium text-secondary text-sm">
                    {link.label}
                  </p>
                  <p className="text-xs text-gray-400">{link.desc}</p>
                </div>
                <ArrowRight size={16} className="text-gray-400" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
