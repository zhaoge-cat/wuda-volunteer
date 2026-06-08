import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, LogOut } from "lucide-react";

interface AttendanceRecord {
  id: number;
  volunteerName: string;
  shiftName: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: "checked_in" | "checked_out" | "absent";
}

const demoRecords: AttendanceRecord[] = [
  { id: 1, volunteerName: "张三", shiftName: "五一黄金周·上午", date: "2025-05-01", checkInTime: "07:55", checkOutTime: "12:05", status: "checked_out" },
  { id: 2, volunteerName: "李四", shiftName: "五一黄金周·上午", date: "2025-05-01", checkInTime: "08:10", checkOutTime: null, status: "checked_in" },
  { id: 3, volunteerName: "王五", shiftName: "五一黄金周·下午", date: "2025-05-01", checkInTime: null, checkOutTime: null, status: "absent" },
  { id: 4, volunteerName: "赵六", shiftName: "暑期志愿·上午", date: "2025-07-15", checkInTime: "08:50", checkOutTime: "12:00", status: "checked_out" },
];

const volunteers = [
  { id: 1, name: "张三" },
  { id: 2, name: "李四" },
  { id: 3, name: "王五" },
  { id: 4, name: "赵六" },
];

const shifts = [
  { id: 1, name: "五一黄金周·上午" },
  { id: 2, name: "五一黄金周·下午" },
  { id: 3, name: "暑期志愿·上午" },
];

export default function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>(demoRecords);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [selectedShift, setSelectedShift] = useState("");

  const handleCheckIn = () => {
    if (!selectedVolunteer || !selectedShift) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const volunteer = volunteers.find((v) => String(v.id) === selectedVolunteer);
    const shift = shifts.find((s) => String(s.id) === selectedShift);
    if (!volunteer || !shift) return;

    const newRecord: AttendanceRecord = {
      id: Date.now(),
      volunteerName: volunteer.name,
      shiftName: shift.name,
      date: now.toISOString().split("T")[0],
      checkInTime: time,
      checkOutTime: null,
      status: "checked_in",
    };
    setRecords((prev) => [newRecord, ...prev]);
    setSelectedVolunteer("");
    setSelectedShift("");
  };

  const handleCheckOut = (id: number) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, checkOutTime: time, status: "checked_out" as const } : r
      )
    );
  };

  const statusLabels = {
    checked_in: { text: "已签到", class: "bg-primary-50 text-primary" },
    checked_out: { text: "已签退", class: "bg-emerald/10 text-emerald-dark" },
    absent: { text: "未签到", class: "bg-gray-100 text-gray-500" },
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-secondary">考勤管理</h1>
        <p className="text-gray-500 text-sm mt-1">签到签退与考勤记录</p>
      </motion.div>

      {/* Check In/Out Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-card p-6"
      >
        <h2 className="text-lg font-semibold text-secondary mb-4">
          签到/签退
        </h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">志愿者</label>
            <select
              value={selectedVolunteer}
              onChange={(e) => setSelectedVolunteer(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm min-w-[160px]"
            >
              <option value="">选择志愿者</option>
              {volunteers.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">班次</label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm min-w-[160px]"
            >
              <option value="">选择班次</option>
              {shifts.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCheckIn}
            disabled={!selectedVolunteer || !selectedShift}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn size={16} />
            签到
          </button>
        </div>
      </motion.div>

      {/* Attendance Records */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">志愿者</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">班次</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">日期</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">签到</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">签退</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">状态</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-secondary">
                    {record.volunteerName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {record.shiftName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 tabular-nums">
                    {record.checkInTime || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 tabular-nums">
                    {record.checkOutTime || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusLabels[record.status].class}`}>
                      {statusLabels[record.status].text}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {record.status === "checked_in" && (
                      <button
                        onClick={() => handleCheckOut(record.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald/10 text-emerald text-xs font-medium hover:bg-emerald/20 transition-colors"
                      >
                        <LogOut size={12} />
                        签退
                      </button>
                    )}
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
