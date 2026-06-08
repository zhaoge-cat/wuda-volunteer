import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown } from "lucide-react";
import { useAuthStore } from "@/store";

type Period = "monthly" | "quarterly";
type Category = "all" | "excellent_volunteer" | "excellent_leader" | "excellent_station" | "collection_master";

const periodTabs: { key: Period; label: string }[] = [
  { key: "monthly", label: "月度之星" },
  { key: "quarterly", label: "季度之星" },
];

const categoryFilters: { key: Category; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "excellent_volunteer", label: "优秀志愿者" },
  { key: "excellent_leader", label: "优秀小队长" },
  { key: "excellent_station", label: "优秀站长" },
  { key: "collection_master", label: "收藏达人" },
];

interface HonorEntry {
  id: number;
  name: string;
  school: string;
  score: number;
  shifts: number;
  avatar?: string;
}

const demoHonors: HonorEntry[] = [
  { id: 1, name: "张三", school: "武汉大学", score: 98, shifts: 24 },
  { id: 2, name: "李四", school: "华中科技大学", score: 96, shifts: 22 },
  { id: 3, name: "王五", school: "武汉理工大学", score: 94, shifts: 20 },
  { id: 4, name: "赵六", school: "中南财经政法大学", score: 92, shifts: 18 },
  { id: 5, name: "孙七", school: "中国地质大学", score: 90, shifts: 16 },
  { id: 6, name: "周八", school: "华中师范大学", score: 88, shifts: 15 },
  { id: 7, name: "吴九", school: "湖北大学", score: 86, shifts: 14 },
  { id: 8, name: "郑十", school: "武汉科技大学", score: 84, shifts: 13 },
];

const medalStyles = [
  {
    bg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    icon: <Crown size={28} className="text-yellow-800" />,
    ring: "ring-4 ring-yellow-300",
    label: "🥇",
  },
  {
    bg: "bg-gradient-to-br from-gray-300 to-gray-400",
    icon: <Medal size={28} className="text-gray-600" />,
    ring: "ring-4 ring-gray-200",
    label: "🥈",
  },
  {
    bg: "bg-gradient-to-br from-orange-400 to-orange-600",
    icon: <Trophy size={28} className="text-orange-800" />,
    ring: "ring-4 ring-orange-200",
    label: "🥉",
  },
];

export default function Honors() {
  const { currentUser } = useAuthStore();
  const [period, setPeriod] = useState<Period>("monthly");
  const [category, setCategory] = useState<Category>("all");

  const top3 = demoHonors.slice(0, 3);
  const rest = demoHonors.slice(3);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-secondary">荣誉榜单</h1>
        <p className="text-gray-500 text-sm mt-1">
          优秀的志愿者值得被看见
        </p>
      </motion.div>

      {/* Personal Honor */}
      {currentUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-primary to-gold rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Trophy size={28} />
            </div>
            <div>
              <h2 className="text-lg font-bold">我的荣誉</h2>
              <p className="text-white/80 text-sm mt-1">
                月度之星 · 优秀志愿者
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Period Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-card w-fit">
        {periodTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setPeriod(tab.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              period === tab.key
                ? "bg-primary text-white shadow-md"
                : "text-gray-500 hover:text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categoryFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setCategory(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              category === f.key
                ? "bg-secondary text-white"
                : "bg-white text-gray-500 hover:bg-gray-100 shadow-sm"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 2nd place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-card p-6 text-center mt-8"
        >
          <div
            className={`w-16 h-16 mx-auto rounded-full ${medalStyles[1].bg} ${medalStyles[1].ring} flex items-center justify-center`}
          >
            {medalStyles[1].icon}
          </div>
          <p className="font-bold text-secondary mt-3">{top3[1]?.name}</p>
          <p className="text-xs text-gray-400">{top3[1]?.school}</p>
          <p className="text-lg font-bold text-secondary mt-2 tabular-nums">
            {top3[1]?.score}
          </p>
          <p className="text-xs text-gray-400">{top3[1]?.shifts} 班次</p>
        </motion.div>

        {/* 1st place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-card p-6 text-center ring-2 ring-gold/30"
        >
          <div className="text-3xl mb-1">👑</div>
          <div
            className={`w-20 h-20 mx-auto rounded-full ${medalStyles[0].bg} ${medalStyles[0].ring} flex items-center justify-center`}
          >
            {medalStyles[0].icon}
          </div>
          <p className="font-bold text-secondary mt-3 text-lg">
            {top3[0]?.name}
          </p>
          <p className="text-xs text-gray-400">{top3[0]?.school}</p>
          <p className="text-2xl font-bold text-primary mt-2 tabular-nums">
            {top3[0]?.score}
          </p>
          <p className="text-xs text-gray-400">{top3[0]?.shifts} 班次</p>
        </motion.div>

        {/* 3rd place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-card p-6 text-center mt-8"
        >
          <div
            className={`w-16 h-16 mx-auto rounded-full ${medalStyles[2].bg} ${medalStyles[2].ring} flex items-center justify-center`}
          >
            {medalStyles[2].icon}
          </div>
          <p className="font-bold text-secondary mt-3">{top3[2]?.name}</p>
          <p className="text-xs text-gray-400">{top3[2]?.school}</p>
          <p className="text-lg font-bold text-secondary mt-2 tabular-nums">
            {top3[2]?.score}
          </p>
          <p className="text-xs text-gray-400">{top3[2]?.shifts} 班次</p>
        </motion.div>
      </div>

      {/* Rest of list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-card overflow-hidden"
      >
        <div className="divide-y divide-gray-100">
          {rest.map((entry, idx) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="w-8 text-center font-bold text-gray-400 tabular-nums">
                {idx + 4}
              </span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-light to-secondary flex items-center justify-center text-white text-sm font-bold">
                {entry.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-secondary text-sm">
                  {entry.name}
                </p>
                <p className="text-xs text-gray-400">{entry.school}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-secondary tabular-nums">
                  {entry.score}
                </p>
                <p className="text-xs text-gray-400">{entry.shifts} 班次</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
