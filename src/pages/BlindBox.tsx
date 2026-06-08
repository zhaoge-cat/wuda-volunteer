import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store";
import { blindboxAPI } from "@/lib/api";

interface DrawnBadge {
  id: number;
  name: string;
  icon: string;
  rarity: "common" | "rare" | "legendary";
  series: string;
}

const demoCollection = [
  { series: "樱花系列", badges: [
    { id: 1, name: "樱花·粉", icon: "🌸", rarity: "common" as const, unlocked: true },
    { id: 2, name: "樱花·白", icon: "💮", rarity: "rare" as const, unlocked: true },
    { id: 3, name: "樱花·金", icon: "🏵️", rarity: "legendary" as const, unlocked: false },
  ]},
  { series: "江城系列", badges: [
    { id: 4, name: "江城·桥", icon: "🌉", rarity: "common" as const, unlocked: true },
    { id: 5, name: "江城·塔", icon: "🗼", rarity: "rare" as const, unlocked: false },
    { id: 6, name: "江城·水", icon: "🌊", rarity: "legendary" as const, unlocked: false },
  ]},
  { series: "美食系列", badges: [
    { id: 7, name: "美食·热干面", icon: "🍜", rarity: "common" as const, unlocked: true },
    { id: 8, name: "美食·豆皮", icon: "🥟", rarity: "rare" as const, unlocked: false },
    { id: 9, name: "美食·鸭脖", icon: "🍗", rarity: "legendary" as const, unlocked: false },
  ]},
];

const possibleDraws: DrawnBadge[] = [
  { id: 101, name: "樱花·粉", icon: "🌸", rarity: "common", series: "樱花系列" },
  { id: 102, name: "江城·桥", icon: "🌉", rarity: "common", series: "江城系列" },
  { id: 103, name: "美食·热干面", icon: "🍜", rarity: "common", series: "美食系列" },
  { id: 104, name: "樱花·白", icon: "💮", rarity: "rare", series: "樱花系列" },
  { id: 105, name: "江城·塔", icon: "🗼", rarity: "rare", series: "江城系列" },
  { id: 106, name: "樱花·金", icon: "🏵️", rarity: "legendary", series: "樱花系列" },
];

const rarityLabels = { common: "普通", rare: "稀有", legendary: "传说" };
const rarityColors = {
  common: { bg: "bg-gray-100", text: "text-gray-600", glow: "" },
  rare: { bg: "bg-blue-50", text: "text-blue-600", glow: "ring-2 ring-blue-300" },
  legendary: { bg: "bg-gold/10", text: "text-gold-dark", glow: "ring-2 ring-gold animate-badge-glow" },
};

export default function BlindBox() {
  const { currentUser } = useAuthStore();
  const [drawCount, setDrawCount] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<DrawnBadge | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      blindboxAPI.getDrawCount(currentUser.id).then((data) => {
        if (data?.count !== undefined) setDrawCount(data.count);
      }).catch(() => {});
    }
  }, [currentUser?.id]);

  const handleDraw = async () => {
    if (drawCount <= 0 || isDrawing) return;
    setIsDrawing(true);
    setIsFlipping(true);
    setShowResult(false);
    setResult(null);

    // Simulate draw delay
    await new Promise((r) => setTimeout(r, 800));

    let drawnBadge: DrawnBadge;
    try {
      if (currentUser?.id) {
        const data = await blindboxAPI.draw(currentUser.id);
        drawnBadge = data.badge;
      } else {
        throw new Error("no user");
      }
    } catch {
      // Demo fallback
      const rand = Math.random();
      if (rand < 0.6) {
        drawnBadge = possibleDraws[Math.floor(Math.random() * 3)];
      } else if (rand < 0.9) {
        drawnBadge = possibleDraws[3 + Math.floor(Math.random() * 2)];
      } else {
        drawnBadge = possibleDraws[5];
      }
    }

    setResult(drawnBadge);
    setDrawCount((prev) => prev - 1);

    // Flip animation
    setTimeout(() => {
      setIsFlipping(false);
      setShowResult(true);
      setIsDrawing(false);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-secondary">盲盒中心</h1>
        <p className="text-gray-500 text-sm mt-1">
          每次服务都有惊喜，抽取专属徽章
        </p>
      </motion.div>

      {/* Blind Box Draw Area */}
      <div className="flex flex-col items-center py-8">
        <div className="perspective-1000">
          <motion.div
            animate={{
              rotateY: isFlipping ? [0, 90, 180, 270, 360] : 0,
            }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="relative w-56 h-72"
          >
            {/* Box front */}
            <div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-secondary flex flex-col items-center justify-center shadow-2xl ${
                showResult ? "opacity-0" : "opacity-100"
              } transition-opacity duration-300`}
            >
              <div className="text-6xl mb-4 animate-float">🎁</div>
              <p className="text-white font-bold text-lg">唔嗒盲盒</p>
              <p className="text-white/60 text-sm mt-1">点击抽取</p>
            </div>

            {/* Result */}
            {result && (
              <div
                className={`absolute inset-0 rounded-3xl bg-white shadow-2xl flex flex-col items-center justify-center border-2 ${
                  rarityColors[result.rarity].glow
                } ${showResult ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
              >
                <span className="text-6xl">{result.icon}</span>
                <p className="font-bold text-secondary text-lg mt-3">
                  {result.name}
                </p>
                <span
                  className={`mt-2 text-xs px-3 py-1 rounded-full ${
                    result.rarity === "common"
                      ? "bg-gray-100 text-gray-600"
                      : result.rarity === "rare"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gold/10 text-gold-dark"
                  }`}
                >
                  {rarityLabels[result.rarity]}
                </span>
                <p className="text-gray-400 text-xs mt-2">{result.series}</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Draw Button */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={handleDraw}
            disabled={drawCount <= 0 || isDrawing}
            className={`px-10 py-3.5 rounded-full text-white font-bold text-base shadow-lg transition-all ${
              drawCount > 0 && !isDrawing
                ? "bg-gradient-to-r from-primary to-gold hover:shadow-xl hover:-translate-y-0.5 animate-pulse-slow"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isDrawing ? "抽取中..." : "✨ 抽取盲盒"}
          </button>
          <p className="text-sm text-gray-400">
            剩余抽取次数：
            <span className="text-primary font-bold tabular-nums">{drawCount}</span>
          </p>
        </div>
      </div>

      {/* Collection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-card p-6"
      >
        <h2 className="text-lg font-semibold text-secondary mb-5">
          我的收藏
        </h2>
        <div className="space-y-6">
          {demoCollection.map((group) => {
            const unlocked = group.badges.filter((b) => b.unlocked).length;
            const total = group.badges.length;
            return (
              <div key={group.series}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-secondary">{group.series}</h3>
                  <span className="text-sm text-gray-400">
                    {unlocked}/{total}
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                  {group.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-3 rounded-xl text-center ${
                        badge.unlocked
                          ? rarityColors[badge.rarity].bg
                          : "bg-gray-50"
                      }`}
                    >
                      <span
                        className={`text-3xl ${
                          badge.unlocked ? "" : "grayscale opacity-40"
                        }`}
                      >
                        {badge.unlocked ? badge.icon : "🔒"}
                      </span>
                      <p
                        className={`text-xs mt-1.5 ${
                          badge.unlocked ? "text-secondary" : "text-gray-400"
                        }`}
                      >
                        {badge.name}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-gold rounded-full transition-all duration-500"
                    style={{ width: `${(unlocked / total) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
