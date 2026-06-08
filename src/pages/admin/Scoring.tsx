import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";

const volunteers = [
  { id: 1, name: "张三" },
  { id: 2, name: "李四" },
  { id: 3, name: "王五" },
  { id: 4, name: "赵六" },
];

const dimensions = [
  { key: "attitude", label: "服务态度", max: 100 },
  { key: "professional", label: "专业能力", max: 100 },
  { key: "teamwork", label: "团队协作", max: 100 },
  { key: "discipline", label: "纪律遵守", max: 100 },
];

function getLevel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "优秀", color: "text-emerald" };
  if (score >= 80) return { label: "良好", color: "text-primary" };
  if (score >= 70) return { label: "合格", color: "text-gold-dark" };
  return { label: "待改进", color: "text-coral" };
}

export default function Scoring() {
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [scores, setScores] = useState<Record<string, number>>({
    attitude: 0,
    professional: 0,
    teamwork: 0,
    discipline: 0,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const avgScore = totalScore / dimensions.length;
  const level = getLevel(avgScore);

  const handleSubmit = () => {
    setError("");
    if (!selectedVolunteer) {
      setError("请选择志愿者");
      return;
    }
    const hasZero = dimensions.some((d) => scores[d.key] === 0);
    if (hasZero) {
      setError("请填写所有评分项");
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setScores({ attitude: 0, professional: 0, teamwork: 0, discipline: 0 });
      setSelectedVolunteer("");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-secondary">评分管理</h1>
        <p className="text-gray-500 text-sm mt-1">志愿者评分与考核</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-card p-6"
      >
        {/* Volunteer Select */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            选择志愿者
          </label>
          <select
            value={selectedVolunteer}
            onChange={(e) => setSelectedVolunteer(e.target.value)}
            className="w-full sm:w-64 px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
          >
            <option value="">请选择</option>
            {volunteers.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* Score Inputs */}
        <div className="grid sm:grid-cols-2 gap-6">
          {dimensions.map((dim) => (
            <div key={dim.key}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-600">
                  {dim.label}
                </label>
                <span className="text-sm font-bold text-secondary tabular-nums">
                  {scores[dim.key]}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={dim.max}
                value={scores[dim.key]}
                onChange={(e) =>
                  setScores({ ...scores, [dim.key]: Number(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span>
                <span>{dim.max}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Result Preview */}
        <div className="mt-8 p-4 rounded-xl bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">综合评分</p>
              <p className="text-3xl font-bold text-secondary tabular-nums">
                {avgScore.toFixed(1)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">等级</p>
              <p className={`text-2xl font-bold ${level.color}`}>
                {level.label}
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center gap-2 text-coral text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Success */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-2 text-emerald text-sm"
          >
            <CheckCircle size={16} />
            评分提交成功！
          </motion.div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitted}
          className="mt-6 w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-medium text-sm hover:shadow-lg transition-all disabled:opacity-60"
        >
          提交评分
        </button>
      </motion.div>
    </div>
  );
}
