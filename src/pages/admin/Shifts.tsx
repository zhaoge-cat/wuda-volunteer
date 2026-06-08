import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";

interface Shift {
  id: number;
  activityName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  registered: number;
}

const demoShifts: Shift[] = [
  { id: 1, activityName: "五一黄金周景区服务", date: "2025-05-01", startTime: "08:00", endTime: "12:00", location: "黄鹤楼景区", capacity: 10, registered: 8 },
  { id: 2, activityName: "五一黄金周景区服务", date: "2025-05-01", startTime: "13:00", endTime: "17:00", location: "黄鹤楼景区", capacity: 10, registered: 10 },
  { id: 3, activityName: "暑期志愿服务", date: "2025-07-15", startTime: "09:00", endTime: "12:00", location: "东湖风景区", capacity: 15, registered: 6 },
  { id: 4, activityName: "周末文明旅游宣传", date: "2025-06-20", startTime: "10:00", endTime: "16:00", location: "户部巷", capacity: 8, registered: 8 },
];

export default function Shifts() {
  const [shifts, setShifts] = useState<Shift[]>(demoShifts);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    activityName: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    capacity: 10,
  });

  const handleCreate = () => {
    if (!form.activityName || !form.date || !form.startTime || !form.endTime) return;
    const newShift: Shift = {
      id: Date.now(),
      ...form,
      registered: 0,
    };
    setShifts((prev) => [...prev, newShift]);
    setForm({ activityName: "", date: "", startTime: "", endTime: "", location: "", capacity: 10 });
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setShifts((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-secondary">班次管理</h1>
          <p className="text-gray-500 text-sm mt-1">创建和管理服务班次</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} />
          创建班次
        </button>
      </motion.div>

      {/* Create Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-white rounded-2xl shadow-card p-6"
        >
          <h2 className="text-lg font-semibold text-secondary mb-4">
            新建班次
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">活动名称</label>
              <input
                type="text"
                value={form.activityName}
                onChange={(e) => setForm({ ...form, activityName: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                placeholder="输入活动名称"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">日期</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">开始时间</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">结束时间</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">地点</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                placeholder="输入服务地点"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">容量</label>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                min={1}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCreate}
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              确认创建
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
          </div>
        </motion.div>
      )}

      {/* Shifts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">活动</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">日期</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">时间</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">地点</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">人数</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {shifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-secondary">
                    {shift.activityName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {shift.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {shift.startTime} - {shift.endTime}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {shift.location}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-primary font-medium tabular-nums">
                      {shift.registered}
                    </span>
                    <span className="text-gray-400">/{shift.capacity}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(shift.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-coral hover:bg-coral/10 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
