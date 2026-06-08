import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  CheckCircle,
  Lock,
  Award,
  FileText,
  IdCard,
} from "lucide-react";

type BenefitType = "activity" | "certificate" | "identity";

interface Benefit {
  id: number;
  name: string;
  description: string;
  type: BenefitType;
  unlocked: boolean;
  requirement?: string;
  icon: string;
}

const benefitGroups: { key: BenefitType; label: string; icon: React.ReactNode }[] = [
  { key: "activity", label: "活动权益", icon: <Award size={18} /> },
  { key: "certificate", label: "证书权益", icon: <FileText size={18} /> },
  { key: "identity", label: "身份权益", icon: <IdCard size={18} /> },
];

const demoBenefits: Benefit[] = [
  { id: 1, name: "优先报名权", description: "热门活动可提前24小时报名", type: "activity", unlocked: true, icon: "⚡" },
  { id: 2, name: "活动积分加成", description: "参与活动获得1.5倍积分", type: "activity", unlocked: true, icon: "✨" },
  { id: 3, name: "专属活动通道", description: "解锁VIP专属志愿活动", type: "activity", unlocked: false, requirement: "需达到星级志愿者", icon: "🎯" },
  { id: 4, name: "志愿服务证书", description: "累计服务满20小时可下载", type: "certificate", unlocked: true, icon: "📜" },
  { id: 5, name: "优秀志愿者证书", description: "获得月度之星可下载", type: "certificate", unlocked: true, icon: "🏆" },
  { id: 6, name: "星级志愿者证书", description: "达到星级志愿者等级可下载", type: "certificate", unlocked: false, requirement: "需达到星级志愿者", icon: "🌟" },
  { id: 7, name: "金牌志愿者证书", description: "达到金牌志愿者等级可下载", type: "certificate", unlocked: false, requirement: "需达到金牌志愿者", icon: "👑" },
  { id: 8, name: "志愿者身份卡", description: "官方认证志愿者身份标识", type: "identity", unlocked: true, icon: "🪪" },
  { id: 9, name: "专属头像框", description: "解锁金色头像框", type: "identity", unlocked: false, requirement: "需集齐樱花系列", icon: "🖼️" },
  { id: 10, name: "专属称号", description: "解锁平台专属称号", type: "identity", unlocked: false, requirement: "需达到传奇志愿者", icon: "💎" },
];

export default function Benefits() {
  const [activeType, setActiveType] = useState<BenefitType>("activity");

  const filtered = demoBenefits.filter((b) => b.type === activeType);
  const unlockedCount = demoBenefits.filter((b) => b.unlocked).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-secondary">权益中心</h1>
          <p className="text-gray-500 text-sm mt-1">
            服务越多，权益越多
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-card px-4 py-2 text-center">
          <p className="text-2xl font-bold text-primary tabular-nums">
            {unlockedCount}
          </p>
          <p className="text-xs text-gray-400">已解锁</p>
        </div>
      </motion.div>

      {/* Type Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-card">
        {benefitGroups.map((group) => (
          <button
            key={group.key}
            onClick={() => setActiveType(group.key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeType === group.key
                ? "bg-primary text-white shadow-md"
                : "text-gray-500 hover:text-secondary"
            }`}
          >
            {group.icon}
            {group.label}
          </button>
        ))}
      </div>

      {/* Benefits Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((benefit, idx) => (
          <motion.div
            key={benefit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`rounded-2xl p-5 border-2 transition-all ${
              benefit.unlocked
                ? "bg-white border-primary/20 shadow-card card-hover"
                : "bg-gray-50 border-gray-200 opacity-70"
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{benefit.icon}</span>
              {benefit.unlocked ? (
                <CheckCircle size={20} className="text-emerald" />
              ) : (
                <Lock size={20} className="text-gray-300" />
              )}
            </div>

            <h3
              className={`font-semibold mt-3 ${
                benefit.unlocked ? "text-secondary" : "text-gray-400"
              }`}
            >
              {benefit.name}
            </h3>
            <p
              className={`text-sm mt-1 ${
                benefit.unlocked ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {benefit.description}
            </p>

            {!benefit.unlocked && benefit.requirement && (
              <p className="text-xs text-coral mt-2 flex items-center gap-1">
                <Lock size={12} />
                {benefit.requirement}
              </p>
            )}

            {benefit.unlocked && benefit.type === "certificate" && (
              <button className="mt-3 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-50 text-primary text-sm font-medium hover:bg-primary-100 transition-colors">
                <Download size={14} />
                下载证书
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
