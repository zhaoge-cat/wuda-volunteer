import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Download, TrendingUp, Users, Award, Clock } from "lucide-react";

const monthlyTrend = [
  { month: "1月", volunteers: 45, shifts: 120, hours: 480 },
  { month: "2月", volunteers: 52, shifts: 135, hours: 540 },
  { month: "3月", volunteers: 68, shifts: 180, hours: 720 },
  { month: "4月", volunteers: 75, shifts: 210, hours: 840 },
  { month: "5月", volunteers: 90, shifts: 260, hours: 1040 },
  { month: "6月", volunteers: 85, shifts: 240, hours: 960 },
];

const levelDistribution = [
  { level: "初心", count: 45, color: "#A0AEC0" },
  { level: "热心", count: 38, color: "#48BB78" },
  { level: "优秀", count: 28, color: "#4299E1" },
  { level: "星级", count: 15, color: "#F6AD55" },
  { level: "金牌", count: 8, color: "#FF6B35" },
  { level: "传奇", count: 2, color: "#E53E3E" },
];

const activityTypeData = [
  { name: "景区引导", value: 35, color: "#FF6B35" },
  { name: "讲解服务", value: 25, color: "#1A365D" },
  { name: "秩序维护", value: 20, color: "#48BB78" },
  { name: "文明宣传", value: 12, color: "#F6AD55" },
  { name: "急救服务", value: 8, color: "#FC8181" },
];

const weeklyHours = [
  { day: "周一", hours: 12 },
  { day: "周二", hours: 8 },
  { day: "周三", hours: 15 },
  { day: "周四", hours: 10 },
  { day: "周五", hours: 18 },
  { day: "周六", hours: 35 },
  { day: "周日", hours: 28 },
];

const summaryStats = [
  { icon: Users, label: "总志愿者", value: "156", change: "+12" },
  { icon: Clock, label: "总服务时长", value: "4,580h", change: "+380h" },
  { icon: Award, label: "颁发徽章", value: "328", change: "+45" },
  { icon: TrendingUp, label: "平均评分", value: "87.5", change: "+2.3" },
];

export default function Stats() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-secondary">数据统计</h1>
          <p className="text-gray-500 text-sm mt-1">详细数据分析与导出</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-white text-sm font-medium hover:bg-secondary-dark transition-colors">
          <Download size={16} />
          导出报表
        </button>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((s, idx) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl shadow-card p-5"
          >
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <s.icon size={16} />
              <span className="text-xs">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-secondary tabular-nums">
              {s.value}
            </p>
            <p className="text-xs text-emerald mt-1">↑ {s.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
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
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#A0AEC0" />
              <YAxis tick={{ fontSize: 12 }} stroke="#A0AEC0" />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="volunteers"
                name="志愿者数"
                stroke="#FF6B35"
                fill="#FF6B35"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="shifts"
                name="班次数"
                stroke="#1A365D"
                fill="#1A365D"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-card p-6"
        >
          <h2 className="text-lg font-semibold text-secondary mb-4">
            等级分布
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={levelDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="level" tick={{ fontSize: 12 }} stroke="#A0AEC0" />
              <YAxis tick={{ fontSize: 12 }} stroke="#A0AEC0" />
              <Tooltip />
              <Bar dataKey="count" name="人数" radius={[6, 6, 0, 0]}>
                {levelDistribution.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-card p-6"
        >
          <h2 className="text-lg font-semibold text-secondary mb-4">
            活动类型分布
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={activityTypeData}
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
                {activityTypeData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-card p-6"
        >
          <h2 className="text-lg font-semibold text-secondary mb-4">
            每周服务时长分布
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#A0AEC0" />
              <YAxis tick={{ fontSize: 12 }} stroke="#A0AEC0" />
              <Tooltip />
              <Bar dataKey="hours" name="时长(h)" fill="#48BB78" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
