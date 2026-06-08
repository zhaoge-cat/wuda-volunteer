import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Pin, X } from "lucide-react";
import { useAuthStore } from "@/store";
import { badgeAPI } from "@/lib/api";

type BadgeTab = "level" | "position" | "series";

interface Badge {
  id: number;
  name: string;
  icon: string;
  description: string;
  rarity: "common" | "rare" | "legendary";
  unlocked: boolean;
  pinned: boolean;
  series?: string;
  color?: string;
}

const rarityColors = {
  common: { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200", glow: "" },
  rare: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", glow: "shadow-blue-200 shadow-lg" },
  legendary: { bg: "bg-gold/10", text: "text-gold-dark", border: "border-gold/30", glow: "shadow-gold/40 shadow-xl animate-badge-glow" },
};

const demoBadges: Record<BadgeTab, Badge[]> = {
  level: [
    { id: 1, name: "初心志愿者", icon: "🌱", description: "完成首次志愿服务", rarity: "common", unlocked: true, pinned: true },
    { id: 2, name: "热心志愿者", icon: "🔥", description: "累计服务5个班次", rarity: "common", unlocked: true, pinned: false },
    { id: 3, name: "优秀志愿者", icon: "⭐", description: "累计服务10个班次且评分≥85", rarity: "rare", unlocked: true, pinned: false },
    { id: 4, name: "星级志愿者", icon: "🌟", description: "累计服务20个班次且评分≥90", rarity: "rare", unlocked: false, pinned: false },
    { id: 5, name: "金牌志愿者", icon: "👑", description: "累计服务50个班次且评分≥95", rarity: "legendary", unlocked: false, pinned: false },
    { id: 6, name: "传奇志愿者", icon: "💎", description: "累计服务100个班次且评分≥98", rarity: "legendary", unlocked: false, pinned: false },
  ],
  position: [
    { id: 10, name: "引导员", icon: "🧭", description: "完成引导岗位服务", rarity: "common", unlocked: true, pinned: false },
    { id: 11, name: "讲解员", icon: "🎤", description: "完成讲解岗位服务", rarity: "common", unlocked: true, pinned: false },
    { id: 12, name: "秩序维护员", icon: "🛡️", description: "完成秩序维护岗位服务", rarity: "rare", unlocked: true, pinned: false },
    { id: 13, name: "急救员", icon: "🚑", description: "完成急救岗位服务", rarity: "rare", unlocked: false, pinned: false },
    { id: 14, name: "小队长", icon: "🎖️", description: "担任小队长3次以上", rarity: "rare", unlocked: false, pinned: false },
    { id: 15, name: "站长", icon: "🏅", description: "担任站长2次以上", rarity: "legendary", unlocked: false, pinned: false },
  ],
  series: [
    { id: 20, name: "樱花系列·粉", icon: "🌸", description: "樱花系列徽章", rarity: "common", unlocked: true, pinned: false, series: "樱花系列", color: "#FFB7C5" },
    { id: 21, name: "樱花系列·白", icon: "💮", description: "樱花系列徽章", rarity: "rare", unlocked: true, pinned: false, series: "樱花系列", color: "#FFF5EE" },
    { id: 22, name: "樱花系列·金", icon: "🏵️", description: "樱花系列徽章", rarity: "legendary", unlocked: false, pinned: false, series: "樱花系列", color: "#FFD700" },
    { id: 23, name: "江城系列·桥", icon: "🌉", description: "江城系列徽章", rarity: "common", unlocked: true, pinned: false, series: "江城系列", color: "#4A90D9" },
    { id: 24, name: "江城系列·塔", icon: "🗼", description: "江城系列徽章", rarity: "rare", unlocked: false, pinned: false, series: "江城系列", color: "#5B6ABF" },
    { id: 25, name: "江城系列·水", icon: "🌊", description: "江城系列徽章", rarity: "legendary", unlocked: false, pinned: false, series: "江城系列", color: "#1E90FF" },
    { id: 26, name: "美食系列·热干面", icon: "🍜", description: "美食系列徽章", rarity: "common", unlocked: true, pinned: false, series: "美食系列", color: "#D4A574" },
    { id: 27, name: "美食系列·豆皮", icon: "🥟", description: "美食系列徽章", rarity: "rare", unlocked: false, pinned: false, series: "美食系列", color: "#C49A6C" },
  ],
};

const tabs: { key: BadgeTab; label: string }[] = [
  { key: "level", label: "等级徽章" },
  { key: "position", label: "岗位徽章" },
  { key: "series", label: "盲盒系列" },
];

export default function Badges() {
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<BadgeTab>("level");
  const [badges, setBadges] = useState<Badge[]>(demoBadges.level);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    if (currentUser?.id) {
      badgeAPI.getAll(currentUser.id).then((data) => {
        if (data?.badges?.length) setBadges(data.badges);
      }).catch(() => {});
    }
  }, [currentUser?.id]);

  useEffect(() => {
    setBadges(demoBadges[activeTab]);
  }, [activeTab]);

  const handleTogglePin = (badgeId: number) => {
    setBadges((prev) =>
      prev.map((b) =>
        b.id === badgeId ? { ...b, pinned: !b.pinned } : b
      )
    );
    if (currentUser?.id) {
      badgeAPI.togglePin(badgeId, currentUser.id).catch(() => {});
    }
  };

  const seriesProgress = activeTab === "series"
    ? Object.entries(
        badges.reduce<Record<string, { total: number; unlocked: number }>>(
          (acc, b) => {
            const s = b.series || "其他";
            if (!acc[s]) acc[s] = { total: 0, unlocked: 0 };
            acc[s].total++;
            if (b.unlocked) acc[s].unlocked++;
            return acc;
          },
          {}
        )
      )
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-secondary">徽章展馆</h1>
        <p className="text-gray-500 text-sm mt-1">收集徽章，记录你的志愿足迹</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-card w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-primary text-white shadow-md"
                : "text-gray-500 hover:text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {badges.map((badge, idx) => {
          const rarity = rarityColors[badge.rarity];
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => badge.unlocked && setSelectedBadge(badge)}
              className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                badge.unlocked
                  ? `${rarity.bg} ${rarity.border} ${rarity.glow} card-hover`
                  : "bg-gray-50 border-gray-200 opacity-60"
              }`}
            >
              {badge.pinned && (
                <div className="absolute top-2 right-2">
                  <Pin size={14} className="text-primary rotate-45" />
                </div>
              )}
              <div className="text-center">
                <span className={`text-4xl ${badge.unlocked ? "" : "grayscale"}`}>
                  {badge.unlocked ? badge.icon : "🔒"}
                </span>
                <p className={`mt-3 text-sm font-medium ${badge.unlocked ? "text-secondary" : "text-gray-400"}`}>
                  {badge.name}
                </p>
                <span
                  className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full ${
                    badge.rarity === "common"
                      ? "bg-gray-200 text-gray-600"
                      : badge.rarity === "rare"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gold/20 text-gold-dark"
                  }`}
                >
                  {badge.rarity === "common"
                    ? "普通"
                    : badge.rarity === "rare"
                    ? "稀有"
                    : "传说"}
                </span>
              </div>
              {!badge.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock size={24} className="text-gray-300" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Series Progress */}
      {activeTab === "series" && seriesProgress.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card p-6"
        >
          <h2 className="text-lg font-semibold text-secondary mb-4">
            系列进度
          </h2>
          <div className="space-y-4">
            {seriesProgress.map(([series, { total, unlocked }]) => (
              <div key={series}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-secondary">{series}</span>
                  <span className="text-gray-400">
                    {unlocked}/{total}
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(unlocked / total) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-gold rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center relative"
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              <span className="text-6xl">{selectedBadge.icon}</span>
              <h3 className="text-xl font-bold text-secondary mt-4">
                {selectedBadge.name}
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                {selectedBadge.description}
              </p>
              <span
                className={`inline-block mt-3 text-xs px-3 py-1 rounded-full ${
                  selectedBadge.rarity === "common"
                    ? "bg-gray-100 text-gray-600"
                    : selectedBadge.rarity === "rare"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-gold/10 text-gold-dark"
                }`}
              >
                {selectedBadge.rarity === "common"
                  ? "普通"
                  : selectedBadge.rarity === "rare"
                  ? "稀有"
                  : "传说"}
              </span>
              <button
                onClick={() => handleTogglePin(selectedBadge.id)}
                className={`mt-5 w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                  selectedBadge.pinned
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                {selectedBadge.pinned ? "取消置顶" : "置顶徽章"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
