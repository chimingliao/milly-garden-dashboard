import { useState, useEffect } from 'react';
import {
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Line, LineChart
} from 'recharts';
import {
  LayoutDashboard, Droplets, Thermometer, Sun, Wind,
  Settings, Lightbulb, Fan, Flame, CloudDrizzle,
  Sprout, Waves, Gauge, ChevronDown,
  ChevronLeft, Menu, Zap, Monitor, Moon, SunMedium, User,
  Globe, Cpu
} from 'lucide-react';

// ---------------------------------------------------------
// 1. 多語言詞典 (繁、簡、英、日)
// ---------------------------------------------------------
const DICT = {
  'zh-TW': {
    brand: "MILLY GARDEN", version: "v2.4.6-PRO", mainTitle: "智能控制中心", subtitle: "即時環境數據與 AIOT 管理核心",
    dashboard: "監控總覽", analytics: "趨勢分析", settings: "系統設定",
    temp: "環境溫度", moisture: "土壤濕度", lux: "光照強度", co2: "二氧化碳",
    tab1: "核心設備", tab2: "氣候調節", butler: "智慧管家", lang: "語言", mode: "顯示模式", theme: "主題配色",
    k1: "白光燈", k2: "暖光燈", k3: "生長燈", k4: "新風系統", k5: "通風系統", k6: "加熱技術", k7: "加濕技術", k8: "自動澆灌",
    admin: "管理員", dialogue1: "環境極其穩定。歡迎回來。", dialogue2: "水分略低，建議啟動澆灌。"
  },
  'zh-CN': {
    brand: "MILLY GARDEN", version: "v2.4.6-PRO", mainTitle: "智能控制中心", subtitle: "实时环境数据与 AIOT 管理核心",
    dashboard: "监控总览", analytics: "趋势分析", settings: "系统设定",
    temp: "环境温度", moisture: "土壤湿度", lux: "光照强度", co2: "二氧化碳",
    tab1: "核心设备", tab2: "气候调节", butler: "智慧管家", lang: "语言", mode: "显示模式", theme: "主题配色",
    k1: "白光灯", k2: "暖光灯", k3: "生长灯", k4: "新风系统", k5: "通风系统", k6: "加热技术", k7: "加湿技术", k8: "自动浇灌",
    admin: "管理员", dialogue1: "环境极其稳定。欢迎回来。", dialogue2: "水分略低，建议启动浇灌。"
  },
  'en': {
    brand: "MILLY GARDEN", version: "v2.4.6-PRO", mainTitle: "INTELLIGENCE HUB", subtitle: "Real-time Telemetry & AIOT Core",
    dashboard: "Dashboard", analytics: "Analytics", settings: "Settings",
    temp: "Temp", moisture: "Moisture", lux: "Light", co2: "CO2",
    tab1: "Core Units", tab2: "Climate", butler: "INTELLIGENCE", lang: "Language", mode: "Display", theme: "Theme",
    k1: "White Light", k2: "Warm Light", k3: "Grow Light", k4: "Air System", k5: "Fan System", k6: "Heater", k7: "Fogger", k8: "Pump",
    admin: "Admin", dialogue1: "Optimal status. Welcome back.", dialogue2: "Soil is dry. Suggest irrigation."
  },
  'jp': {
    brand: "MILLY GARDEN", version: "v2.4.6-PRO", mainTitle: "インテリジェンス・ハブ", subtitle: "環境監視と AIOT 制御コア",
    dashboard: "概要", analytics: "分析", settings: "設定",
    temp: "環境温度", moisture: "土壌水分", lux: "照度", co2: "二酸化炭素",
    tab1: "コア設備", tab2: "気候制御", butler: "執事コア", lang: "言語", mode: "モード", theme: "テーマ",
    k1: "白色灯", k2: "暖色灯", k3: "育成ライト", k4: "換気システム", k5: "サーキュレーター", k6: "ヒーター", k7: "加湿器", k8: "自動給水",
    admin: "管理者", dialogue1: "庭園は良好です。おかえりなさい。", dialogue2: "土が乾燥中。給水を推奨します。"
  }
};

const THEMES = {
  emerald: { bg: 'bg-emerald-500', chart: '#10b981', shadow: 'shadow-emerald-500/20' },
  rose: { bg: 'bg-rose-500', chart: '#f43f5e', shadow: 'shadow-rose-500/20' },
  blue: { bg: 'bg-blue-500', chart: '#3b82f6', shadow: 'shadow-blue-500/20' },
  orange: { bg: 'bg-orange-500', chart: '#f97316', shadow: 'shadow-orange-500/20' },
};

const DISPLAY_MODES = {
  dark: { name: 'Dark Mode', icon: <Moon size={14} /> },
  light: { name: 'Light Mode', icon: <SunMedium size={14} /> },
  glass: { name: 'Glass Mode', icon: <Monitor size={14} /> },
};

// ---------------------------------------------------------
// 2. 工業風 SVG 培養艙
// ---------------------------------------------------------
const BioPodSVG = ({ themeColor, displayMode }: any) => (
  <div className="relative w-full h-[400px] flex items-center justify-center p-4">
    <svg viewBox="0 0 200 450" className="h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={displayMode === 'light' ? '#d4d4d8' : '#18181b'} />
          <stop offset="50%" stopColor={displayMode === 'light' ? '#f4f4f5' : '#3f3f46'} />
          <stop offset="100%" stopColor={displayMode === 'light' ? '#d4d4d8' : '#18181b'} />
        </linearGradient>
        <linearGradient id="bottomGlow" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={themeColor} stopOpacity="0.5" />
          <stop offset="100%" stopColor={themeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="420" rx="80" ry="15" fill={themeColor} fillOpacity="0.1" className="animate-pulse" />
      <path d="M30 45 Q100 20 170 45 L175 75 Q100 95 25 75 Z" fill="url(#metalGrad)" />
      <rect x="35" y="70" width="130" height="320" fill={displayMode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.02)'} stroke="rgba(255,255,255,0.05)" />
      <rect x="35" y="70" width="130" height="320" fill="url(#bottomGlow)" />
      <g className="animate-float">
        <circle cx="100" cy="230" r="35" fill={themeColor} fillOpacity="0.05" />
        <foreignObject x="70" y="200" width="60" height="60">
          <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
            <Sprout size={32} style={{ color: themeColor }} />
          </div>
        </foreignObject>
      </g>
      <path d="M20 390 Q100 365 180 390 L190 430 Q100 460 10 430 Z" fill="url(#metalGrad)" />
    </svg>
  </div>
);

// ---------------------------------------------------------
// 3. 主程式
// ---------------------------------------------------------
export default function MillyGardenDashboard() {
  const [lang, setLang] = useState<keyof typeof DICT>('zh-TW');
  const [currentTheme, setCurrentTheme] = useState<keyof typeof THEMES>('emerald');
  const [displayMode, setDisplayMode] = useState<keyof typeof DISPLAY_MODES>('dark');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('group1');
  const [switches, setSwitches] = useState<Record<string, boolean>>({
    K1: false, K2: false, K3: true, K4: false, K5: true, K6: false, K7: false, K8: false
  });
  const [data, setData] = useState(() => Array.from({ length: 20 }, (_, i) => ({
    time: `${i}:00`, moisture: 45, lux: 5000, co2: 700, temp: 23
  })));

  const t = DICT[lang];
  const theme = THEMES[currentTheme];
  const stats = data[data.length - 1];

  useEffect(() => {
    const itv = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        return [...prev.slice(1), {
          time: `+1`,
          moisture: Math.max(30, Math.min(70, last.moisture + (Math.random() - 0.5) * 5)),
          temp: Math.max(18, Math.min(32, last.temp + (Math.random() - 0.5) * 1.5)),
          lux: Math.max(0, Math.min(10000, last.lux + (Math.random() - 0.5) * 1000)),
          co2: Math.max(400, Math.min(1000, last.co2 + (Math.random() - 0.5) * 20))
        }];
      });
    }, 3000);
    return () => clearInterval(itv);
  }, []);

  const styles = {
    bg: displayMode === 'light' ? 'bg-zinc-100' : displayMode === 'glass' ? 'bg-black' : 'bg-[#09090b]',
    sidebar: displayMode === 'light' ? 'bg-white border-zinc-200' : 'bg-[#09090b] border-zinc-800',
    card: displayMode === 'light' ? 'bg-white border-zinc-200 shadow-sm' : displayMode === 'glass' ? 'bg-white/5 backdrop-blur-xl border-white/10' : 'bg-zinc-900/30 border-zinc-800',
    text: displayMode === 'light' ? 'text-zinc-900' : 'text-white',
    subText: displayMode === 'light' ? 'text-zinc-400 font-bold' : 'text-zinc-500 font-medium',
  };

  const switchGroups = {
    group1: [{ id: "K1", label: t.k1, icon: Lightbulb }, { id: "K2", label: t.k2, icon: Lightbulb }, { id: "K3", label: t.k3, icon: Sprout }, { id: "K4", label: t.k4, icon: Wind }],
    group2: [{ id: "K5", label: t.k5, icon: Fan }, { id: "K6", label: t.k6, icon: Flame }, { id: "K7", label: t.k7, icon: CloudDrizzle }, { id: "K8", label: t.k8, icon: Waves }]
  };

  return (
    <div className={`flex h-screen w-full font-sans overflow-hidden transition-all duration-700 ${styles.bg} ${styles.text}`}>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float ease-in-out infinite 3s; }
      `}</style>

      {/* 1. 左側導覽列 */}
      <aside className={`flex flex-col border-r transition-all duration-300 z-30 h-full ${isSidebarCollapsed ? 'w-20' : 'w-64'} ${styles.sidebar}`}>
        <div className={`flex items-center h-20 px-6 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${theme.bg} flex items-center justify-center shadow-lg`}><Sprout size={10} className="text-black" /></div>
                <span className="font-black text-[15px] tracking-wider uppercase italic leading-none">{t.brand}</span>
              </div>
              <span className={`text-[9px] font-black tracking-widest uppercase mt-2 ml-6 ${styles.subText}`}>{t.version}</span>
            </div>
          )}
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-zinc-500/10 rounded-xl text-zinc-500">
            {isSidebarCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-6">
          {[{ icon: <LayoutDashboard size={18} />, label: t.dashboard, active: true }, { icon: <Gauge size={18} />, label: t.analytics }, { icon: <Settings size={18} />, label: t.settings }].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all ${item.active ? (displayMode === 'light' ? 'bg-zinc-900 text-white shadow-xl' : 'bg-zinc-800 text-white') : 'text-zinc-500'} ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}>
              {item.icon} {!isSidebarCollapsed && <span className="text-sm font-bold uppercase">{item.label}</span>}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800/10">
          <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : 'p-3 bg-zinc-900/40 border border-zinc-800 rounded-3xl'}`}>
            <div className="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center border border-white/5"><User size={20} className="opacity-40" /></div>
            {!isSidebarCollapsed && <div className="flex-1 overflow-hidden font-black uppercase text-[10px]">Vincent<p className="text-[8px] opacity-40">{t.admin}</p></div>}
          </div>
        </div>
      </aside>

      {/* 2. 中央區域 */}
      <main className="flex-1 flex flex-col h-full overflow-hidden p-8 pr-12 relative z-10">
        <header className="flex justify-between items-start mb-8 shrink-0">
          <div>
            <h1 className={`text-4xl font-black tracking-tighter uppercase italic leading-none`}>{t.mainTitle}</h1>
            <p className={`${styles.subText} text-[10px] font-bold uppercase mt-3 tracking-widest italic`}>{t.subtitle}</p>
          </div>
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${displayMode === 'light' ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-zinc-400'} border px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-3 shadow-2xl transition-all`}>
              <Globe size={14} style={{ color: theme.chart }} /> {t.lang} / {t.theme} <ChevronDown size={14} className={isMenuOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>
            {isMenuOpen && (
              <div className={`absolute right-0 mt-2 w-52 ${displayMode === 'light' ? 'bg-white border-zinc-200' : 'bg-zinc-950 border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'} border rounded-3xl z-50 py-4 overflow-hidden`}>
                <div className="px-5 py-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">{t.lang}</div>
                {(Object.keys(DICT) as (keyof typeof DICT)[]).map(l => (
                  <button key={l} onClick={() => setLang(l)} className={`w-full text-left px-5 py-2 text-[10px] font-black ${lang === l ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}>{l.toUpperCase()}</button>
                ))}
                <div className="h-[1px] bg-zinc-800/10 my-3 mx-4" />
                <div className="px-5 py-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">{t.mode}</div>
                {Object.entries(DISPLAY_MODES).map(([k, v]) => (
                  <button key={k} onClick={() => setDisplayMode(k as any)} className={`w-full flex items-center gap-3 px-5 py-2 text-[10px] font-bold ${displayMode === k ? 'text-emerald-500' : 'text-zinc-500'}`}>{v.icon} {v.name}</button>
                ))}
                <div className="h-[1px] bg-zinc-800/10 my-3 mx-4" />
                <div className="px-5 py-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">{t.theme}</div>
                {Object.entries(THEMES).map(([k, v]) => (
                  <button key={k} onClick={() => setCurrentTheme(k as any)} className={`w-full flex items-center gap-3 px-5 py-2 text-[10px] font-bold ${currentTheme === k ? 'text-emerald-500' : 'text-zinc-500'}`}><div className={`w-2 h-2 rounded-full ${v.bg}`} /> {k.toUpperCase()}</button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* 核心數據卡片 */}
        <div className="grid grid-cols-4 gap-4 mb-6 shrink-0">
          {[{ l: t.temp, v: stats.temp, u: '℃', i: Thermometer }, { l: t.moisture, v: stats.moisture, u: '%', i: Droplets }, { l: t.lux, v: stats.lux, u: 'Lux', i: Sun }, { l: t.co2, v: stats.co2, u: 'ppm', i: Zap }].map((s, i) => (
            <div key={i} className={`${styles.card} p-6 rounded-[2.5rem] flex items-center justify-between transition-all duration-500`}>
              <div><p className={`text-[9px] font-black uppercase opacity-30 mb-1 tracking-widest`}>{s.l}</p><p className="text-2xl font-black leading-none tracking-tighter">{s.v.toFixed(1)} <span className="text-[9px] opacity-20 uppercase font-black">{s.u}</span></p></div>
              <s.i size={20} style={{ color: theme.chart }} />
            </div>
          ))}
        </div>

        {/* 多圖表網格 */}
        <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-4 min-h-0 mb-6">
          <div className={`${styles.card} col-span-2 row-span-2 rounded-[3.5rem] p-10 flex flex-col relative overflow-hidden transition-all duration-500`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs><linearGradient id="mainG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={theme.chart} stopOpacity={0.2} /><stop offset="95%" stopColor={theme.chart} stopOpacity={0} /></linearGradient></defs>
                <Area type="monotone" dataKey="moisture" stroke={theme.chart} strokeWidth={4} fill="url(#mainG)" isAnimationActive={true} />
                <XAxis dataKey="time" hide /><YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className={`${styles.card} rounded-[2.5rem] p-6 flex flex-col transition-all duration-500 shadow-sm`}>
            <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.4em] mb-4">{t.lux}</p>
            <ResponsiveContainer><AreaChart data={data}><Area type="step" dataKey="lux" stroke={theme.chart} strokeWidth={2} fill={theme.chart} fillOpacity={0.1} /><YAxis hide /></AreaChart></ResponsiveContainer>
          </div>
          <div className={`${styles.card} rounded-[2.5rem] p-6 flex flex-col transition-all duration-500 shadow-sm`}>
            <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.4em] mb-4">{t.co2}</p>
            <ResponsiveContainer><LineChart data={data}><Line type="monotone" dataKey="co2" stroke={theme.chart} strokeWidth={2} dot={false} /><YAxis hide /></LineChart></ResponsiveContainer>
          </div>
        </div>

        {/* 控制分頁與開關 */}
        <div className="shrink-0 space-y-4 pt-2">
          <div className="flex gap-8 border-b border-zinc-800/10 pb-2">
            {['group1', 'group2'].map((gid) => (
              <button key={gid} onClick={() => setActiveTab(gid)} className={`flex items-center gap-2 pb-2 transition-all relative ${activeTab === gid ? styles.text : 'text-zinc-600'}`}>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{gid === 'group1' ? t.tab1 : t.tab2}</span>
                {activeTab === gid && <div className={`absolute bottom-0 left-0 right-0 h-[3px] rounded-full transition-all duration-500 ${theme.bg} ${theme.shadow}`} />}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-4 h-28 shrink-0 pb-2">
            {switchGroups[activeTab as keyof typeof switchGroups].map((sw) => (
              <div key={sw.id} onClick={() => setSwitches(p => ({ ...p, [sw.id]: !p[sw.id] }))} className={`p-6 rounded-[2.2rem] border transition-all cursor-pointer flex items-center gap-5 ${switches[sw.id] ? `${theme.bg} border-transparent shadow-2xl scale-[1.03]` : `${styles.card}`}`}>
                <div className={`p-4 rounded-2xl transition-all ${switches[sw.id] ? 'bg-black/10 text-white' : 'bg-zinc-800 text-zinc-500'}`}><sw.icon size={22} strokeWidth={2.5} /></div>
                <div className="flex-1 overflow-hidden"><p className={`text-sm font-black tracking-tighter truncate ${switches[sw.id] ? 'text-white' : ''}`}>{sw.label}</p><p className={`text-[9px] font-bold ${switches[sw.id] ? 'text-white/40' : 'text-zinc-600'}`}>#{sw.id}</p></div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 3. 右側管家區 (整合 SVG 智能艙) */}
      <aside className={`w-[340px] h-full flex flex-col border-l transition-all duration-500 ${styles.sidebar} shrink-0`}>
        <div className="h-20 border-b border-zinc-800/10 flex items-center px-10 gap-3">
          <Cpu size={18} className="text-zinc-600 animate-pulse" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 italic">{t.butler}</h3>
        </div>

        <BioPodSVG themeColor={theme.chart} displayMode={displayMode} />

        <div className="mt-auto p-10 bg-black/20 flex flex-col gap-6 border-t border-zinc-800/10">
          <p className="text-[10px] font-bold text-white/80 leading-relaxed italic text-center uppercase tracking-tighter shadow-sm">
            “ {stats.moisture < 40 ? t.dialogue2 : t.dialogue1} ”
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[9px] font-black uppercase opacity-40 tracking-widest"><span>Bio-Link Stable</span><span>100%</span></div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden shadow-inner"><div className="h-full transition-all duration-1000" style={{ width: '100%', backgroundColor: theme.chart }} /></div>
          </div>
        </div>
      </aside>
    </div>
  );
}