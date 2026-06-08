import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Award,
  Gift,
  Trophy,
  CalendarDays,
  Shield,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  Menu,
  X,
  ClipboardList,
  Clock,
  Star,
  BarChart3,
  LogIn,
} from "lucide-react";
import { useAuthStore, useUIStore } from "@/store";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "仪表盘" },
  { to: "/checkin", icon: LogIn, label: "签到签退" },
  { to: "/profile", icon: User, label: "个人中心" },
  { to: "/badges", icon: Award, label: "徽章展馆" },
  { to: "/blindbox", icon: Gift, label: "盲盒中心" },
  { to: "/honors", icon: Trophy, label: "荣誉榜单" },
  { to: "/activities", icon: CalendarDays, label: "活动中心" },
  { to: "/benefits", icon: Shield, label: "权益中心" },
];

const adminItems = [
  { to: "/admin", icon: LayoutDashboard, label: "管理概览" },
  { to: "/admin/shifts", icon: ClipboardList, label: "班次管理" },
  { to: "/admin/attendance", icon: Clock, label: "考勤管理" },
  { to: "/admin/scoring", icon: Star, label: "评分管理" },
  { to: "/admin/stats", icon: BarChart3, label: "数据统计" },
];

export default function Layout() {
  const { currentUser, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === "admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-secondary-light/20">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-gold flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">唔</span>
        </div>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden"
          >
            <h1 className="text-white font-bold text-base whitespace-nowrap">
              唔嗒志愿
            </h1>
            <p className="text-secondary-100/60 text-xs whitespace-nowrap">
              旅游志愿服务平台
            </p>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "text-secondary-100/70 hover:bg-white/10 hover:text-white"
                } ${sidebarCollapsed ? "justify-center" : ""}`
              }
            >
              <item.icon size={20} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {isAdmin && (
          <>
            <div className="mt-6 mb-3 px-3">
              {!sidebarCollapsed && (
                <p className="text-xs text-secondary-100/40 uppercase tracking-wider">
                  管理后台
                </p>
              )}
              {sidebarCollapsed && (
                <div className="border-t border-secondary-light/20" />
              )}
            </div>
            <div className="space-y-1">
              {adminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/admin"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "text-secondary-100/70 hover:bg-white/10 hover:text-white"
                    } ${sidebarCollapsed ? "justify-center" : ""}`
                  }
                >
                  <item.icon size={20} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </>
        )}
      </nav>

      {/* Collapse toggle (desktop) */}
      <div className="hidden lg:block border-t border-secondary-light/20 p-3">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-secondary-100/60 hover:bg-white/10 hover:text-white transition-colors text-sm"
        >
          {sidebarCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronLeft size={18} />
              <span>收起侧栏</span>
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden lg:flex flex-col bg-gradient-to-b from-secondary to-secondary-dark shadow-sidebar flex-shrink-0 overflow-hidden"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-gradient-to-b from-secondary to-secondary-dark shadow-xl z-50 flex flex-col lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-secondary hidden sm:block">
              唔嗛旅游志愿服务平台
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={20} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral rounded-full" />
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {currentUser?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-secondary">
                  {currentUser?.name || "用户"}
                </p>
                <p className="text-xs text-gray-400">
                  {currentUser?.role === "admin" ? "管理员" : "志愿者"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="退出登录"
              >
                <LogOut size={18} className="text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
