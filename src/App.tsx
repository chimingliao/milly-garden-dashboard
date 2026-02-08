import { useState, useEffect } from 'react';
import {
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis
} from 'recharts';
import {
  LayoutDashboard, Droplets, Thermometer, Sun, Wind,
  Settings, Lightbulb, Fan, Flame, CloudDrizzle,
  Sprout, Waves, Gauge,
  Menu, Zap, Monitor, Moon, SunMedium, User,
  Cpu, X
} from 'lucide-react';

// ---------------------------------------------------------
// 1. 多語言配置
// ---------------------------------------------------------
const DICT = {
  'zh-TW': {
    brand: "MILLY GARDEN", version: "v2.5.2", mainTitle: "智能控制中心", subtitle: "即時數據管理核心",
    dashboard: "監控總覽", analytics: "趨勢分析", settings: "系統設定",
    temp: "溫度", moisture: "濕度", lux: "光照", co2: "二氧化碳",
    tab1: "核心設備", tab2: "氣候調節", butler: "智慧管家", lang: "語言", mode: "模式", theme: "配色",
    k1: "白光燈", k2: "暖光燈", k3: "生長燈", k4: "新風", k5: "通風", k6: "加熱", k7: "加濕", k8: "自動澆灌",
    admin: "管理員", dialogue1: "環境穩定，主人。", dialogue2: "水分略低，建議澆灌。"
  },
  'zh-CN': {
    brand: "MILLY GARDEN", version: "v2.5.2", mainTitle: "智能控制中心", subtitle: "实时数据管理核心",
    dashboard: "监控总览", analytics: "趋势分析", settings: "系统设定",
    temp: "温度", moisture: "湿度", lux: "光照", co2: "二氧化碳",
    tab1: "核心设备", tab2: "气候调节", butler: "智慧管家", lang: "语言", mode: "模式", theme: "配色",
    k1: "白光灯", k2: "暖光灯", k3: "生长灯", k4: "新风", k5: "通风", k6: "加热", k7: "加湿", k8: "自动浇灌",
    admin: "管理员", dialogue1: "环境稳定，主人。", dialogue2: "水分略低，建议浇灌。"
  },
  'en': {
    brand: "MILLY GARDEN", version: "v2.5.2", mainTitle: "INTEL HUB", subtitle: "Real-time Telemetry",
    dashboard: "Overview", analytics: "Analytics", settings: "Settings",
    temp: "Temp", moisture: "Humidity", lux: "Light", co2: "CO2",
    tab1: "Core", tab2: "Climate", butler: "BUTLER", lang: "Lang", mode: "Mode", theme: "Theme",
    k1: "White", k2: "Warm", k3: "Grow", k4: "Air", k5: "Fan", k6: "Heat", k7: "Mist", k8: "Pump",
    admin: "Admin", dialogue1: "Optimal. Master.", dialogue2: "Soil dry. Water now."
  },
  'jp': {
    brand: "MILLY GARDEN", version: "v2.5.2", mainTitle: "インテリジェンス・ハブ", subtitle: "環境監視コア",
    dashboard: "概要", analytics: "分析", settings: "設定",
    temp: "温度", moisture: "湿度", lux: "照度", co2: "CO2",
    tab1: "コア", tab2: "気候", butler: "執事", lang: "言語", mode: "モード", theme: "テーマ",
    k1: "白色灯", k2: "暖色灯", k3: "育成灯", k4: "換気扇", k5: "循環ファン", k6: "ヒーター", k7: "加湿器", k8: "自動給水",
    admin: "管理者", dialogue1: "良好です、主人。", dialogue2: "土が乾燥中。給水を。"
  }
};

const THEMES = {
  emerald: { bg: 'bg-emerald-500', chart: '#10b981' },
  rose: { bg: 'bg-rose-500', chart: '#f43f5e' },
  blue: { bg: 'bg-blue-500', chart: '#3b82f6' },
  orange: { bg: 'bg-orange-500', chart: '#f97316' },
};

const DISPLAY_MODES = {
  dark: { name: 'Dark', icon: <Moon size={14} /> },
  light: { name: 'Light', icon: <SunMedium size={14} /> },
  glass: { name: 'Glass', icon: <Monitor size={14} /> },
};

// ---------------------------------------------------------
// 2. SVG 培養艙 (手機版自動縮小高度)
// ---------------------------------------------------------
const BioPodSVG = ({ themeColor, displayMode }: any) => (
  <div className="relative w-full h-[180px] sm:h-[250px] lg:h-[380px] flex items-center justify-center">
    <svg viewBox="0 0 200 450" className="h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={displayMode === 'light' ? '#d4d4d8' : '#18181b'} />
          <stop offset="50%" stopColor={displayMode === 'light' ? '#f4f4f5' : '#3f3f46'} />
          <stop offset="100%" stopColor={displayMode === 'light' ? '#d4d4d8' : '#18181b'} />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="420" rx="80" ry="15" fill={themeColor} fillOpacity="0.1" className="animate-pulse" />
      <path d="M30 45 Q100 20 170 45 L175 75 Q100 95 25 75 Z" fill="url(#metalGrad)" />
      <rect x="35" y="70" width="130" height="320" fill={displayMode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.02)'} stroke="rgba(255,255,255,0.05)" />
      <g className="animate-float">
        <circle cx="100" cy="230" r="35" fill={themeColor} fillOpacity="0.05" />
        <foreignObject x="70" y="200" width="60" height="60">
          <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full border border-white/10">
            <Sprout size={32} style={{ color: themeColor }} />
          </div>
        </foreignObject>
      </g>
      <path d="M20 390 Q100 365 180 390 L190 430 Q100 460 10 430 Z" fill="url(#metalGrad)" />
    </svg>
  </div>
);

export default function MillyGardenDashboard() {
  const [lang, setLang] = useState<keyof typeof DICT>('zh-TW');
  const [currentTheme, setCurrentTheme] = useState<keyof typeof THEMES>('emerald');
  const [displayMode, setDisplayMode] = useState<keyof typeof DISPLAY_MODES>('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('group1');
  const [switches, setSwitches] = useState<Record<string, boolean>>({
    K1: false, K2: false, K3: true, K4: false, K5: true, K6: false, K7: false, K8: false
  });
  const [data, setData] = useState(() => Array.from({ length: 15 }, (_, i) => ({
    time: `${i}:00`, moisture: 42, temp: 23, lux: 5000, co2: 700
  })));

  const t = DICT[lang];
  const theme = THEMES[currentTheme];
  const stats = data[data.length - 1];

  useEffect(() => {
    const itv = setInterval(() => {
      setData(prev => [...prev.slice(1), { ...prev[prev.length - 1], moisture: Math.max(30, Math.min(70, prev[prev.length - 1].moisture + (Math.random() - 0.5) * 5)) }]);
    }, 3000);
    return () => clearInterval(itv);
  }, []);

  const switchGroups = {
    group1: [{ id: "K1", label: t.k1, icon: Lightbulb }, { id: "K2", label: t.k2, icon: Lightbulb }, { id: "K3", label: t.k3, icon: Sprout }, { id: "K4", label: t.k4, icon: Wind }],
    group2: [{ id: "K5", label: t.k5, icon: Fan }, { id: "K6", label: t.k6, icon: Flame }, { id: "K7", label: t.k7, icon: CloudDrizzle }, { id: "K8", label: t.k8, icon: Waves }]
  };

  const styles = {
    bg: displayMode === 'light' ? 'bg-zinc-100' : displayMode === 'glass' ? 'bg-black' : 'bg-[#09090b]',
    sidebar: displayMode === 'light' ? 'bg-white border-zinc-200 shadow-xl' : 'bg-[#09090b] border-zinc-800',
    card: displayMode === 'light' ? 'bg-white border-zinc-200' : 'bg-zinc-900/40 border-zinc-800',
    text: displayMode === 'light' ? 'text-zinc-900' : 'text-white'
  };

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen lg:h-screen w-full font-sans overflow-y-auto lg:overflow-hidden transition-all duration-700 ${styles.bg} ${styles.text}`}>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float ease-in-out infinite 3s; }
      `}</style>

      {/* 手機版頂部 */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800 shrink-0 sticky top-0 bg-[#09090b]/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-2">
          <Sprout size={18} className="text-emerald-500" />
          <span className="font-black text-xs tracking-widest italic">{t.brand}</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2"><Menu size={20} /></button>
      </div>

      {/* 側邊欄 */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col border-r ${styles.sidebar}`}>
        <div className="h-20 px-6 flex flex-col justify-center border-b border-zinc-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Sprout size={16} style={{ color: theme.chart }} /><span className="font-black text-base uppercase italic">{t.brand}</span></div>
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}><X size={20} /></button>
          </div>
          <span className="text-[10px] font-bold text-zinc-600 tracking-widest mt-1 ml-6">{t.version}</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[{ icon: <LayoutDashboard size={18} />, label: t.dashboard, active: true }, { icon: <Gauge size={18} />, label: t.analytics }, { icon: <Settings size={18} />, label: t.settings }].map((item, i) => (
            <div key={i} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer ${item.active ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>
              {item.icon} <span className="text-sm font-bold">{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800/10 flex items-center gap-3"><User size={20} className="opacity-40" /><div className="flex-1 overflow-hidden font-black text-[10px]">VINCENT<p className="text-[8px] opacity-40">{t.admin}</p></div></div>
      </aside>

      {/* 主要內容區 */}
      <main className="flex-1 flex flex-col min-w-0 p-4 lg:p-8 relative">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="hidden sm:block">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">{t.mainTitle}</h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest opacity-60">{t.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto shrink-0">
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
              {['zh-TW', 'en'].map(l => (
                <button key={l} onClick={() => setLang(l as any)} className={`px-2 py-0.5 text-[9px] font-black rounded ${lang === l ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}>{l.toUpperCase().substring(3)}</button>
              ))}
            </div>
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 justify-around">
              {Object.entries(THEMES).map(([k, v]) => (
                <button key={k} onClick={() => setCurrentTheme(k as any)} className={`w-4 h-4 rounded-sm mx-0.5 ${currentTheme === k ? 'ring-1 ring-white' : 'opacity-40'}`} style={{ backgroundColor: v.chart }} />
              ))}
            </div>
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 col-span-2 justify-center">
              {Object.entries(DISPLAY_MODES).map(([k, v]) => (
                <button key={k} onClick={() => setDisplayMode(k as any)} className={`px-4 text-zinc-500 ${displayMode === k ? 'text-white' : ''}`}>{v.icon}</button>
              ))}
            </div>
          </div>
        </header>

        {/* 數據卡片 - 手機 2x2 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[{ l: t.temp, v: stats.temp, u: '℃', i: Thermometer }, { l: t.moisture, v: stats.moisture, u: '%', i: Droplets }, { l: t.lux, v: stats.lux, u: 'Lx', i: Sun }, { l: t.co2, v: stats.co2, u: 'ppm', i: Zap }].map((s, i) => (
            <div key={i} className={`${styles.card} p-4 rounded-2xl flex flex-col gap-1`}>
              <div className="flex justify-between items-center opacity-30"><p className="text-[8px] font-black uppercase">{s.l}</p><s.i size={12} style={{ color: theme.chart }} /></div>
              <p className="text-xl font-black leading-none">{s.v.toFixed(1)}<span className="text-[8px] ml-1 opacity-20">{s.u}</span></p>
            </div>
          ))}
        </div>

        {/* 圖表 - 手機縮小高度 */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[250px] lg:min-h-0 mb-6">
          <div className={`${styles.card} col-span-1 lg:col-span-2 rounded-3xl p-4 lg:p-10 flex flex-col relative`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}><defs><linearGradient id="mainG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={theme.chart} stopOpacity={0.2} /><stop offset="95%" stopColor={theme.chart} stopOpacity={0} /></linearGradient></defs><Area type="monotone" dataKey="moisture" stroke={theme.chart} strokeWidth={3} fill="url(#mainG)" isAnimationActive={true} /><XAxis dataKey="time" hide /><YAxis hide domain={['dataMin-5', 'dataMax+5']} /></AreaChart>
            </ResponsiveContainer>
          </div>
          <div className={`${styles.card} rounded-[2rem] p-6 hidden lg:flex flex-col`}><p className="text-[9px] font-black opacity-30 uppercase mb-4">{t.lux}</p><ResponsiveContainer><AreaChart data={data}><Area type="step" dataKey="lux" stroke={theme.chart} strokeWidth={2} fill={theme.chart} fillOpacity={0.1} /><YAxis hide /></AreaChart></ResponsiveContainer></div>
        </div>

        {/* 控制按鈕 - 手機 2x2 */}
        <div className="shrink-0 space-y-4">
          <div className="flex gap-6 border-b border-zinc-800 pb-1">
            {['group1', 'group2'].map(gid => (
              <button key={gid} onClick={() => setActiveTab(gid)} className={`text-[10px] font-black uppercase relative pb-1 ${activeTab === gid ? 'text-white' : 'text-zinc-600'}`}>{gid === 'group1' ? t.tab1 : t.tab2}{activeTab === gid && <div className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${theme.bg}`} />}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {switchGroups[activeTab as keyof typeof switchGroups].map(sw => (
              <div key={sw.id} onClick={() => setSwitches(p => ({ ...p, [sw.id]: !p[sw.id] }))} className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${switches[sw.id] ? `${theme.bg} border-transparent shadow-xl` : `${styles.card}`}`}>
                <div className={`p-2 rounded-lg ${switches[sw.id] ? 'bg-black/10 text-white' : 'bg-zinc-800'}`}><sw.icon size={16} strokeWidth={2.5} /></div>
                <p className="text-xs font-black truncate">{sw.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 右側管家 - 手機版改為最後一屏 */}
      <aside className={`w-full lg:w-[320px] h-auto lg:h-full flex flex-col border-t lg:border-t-0 lg:border-l ${styles.sidebar} shrink-0`}>
        <div className="hidden lg:flex h-16 border-b border-zinc-800/10 items-center px-10 gap-3"><Cpu size={16} className="text-zinc-600 animate-pulse" /><h3 className="text-[10px] font-black uppercase opacity-40 italic">{t.butler}</h3></div>
        <BioPodSVG themeColor={theme.chart} displayMode={displayMode} />
        <div className="p-6 lg:p-10 bg-black/20 flex flex-col gap-4">
          <p className="text-[10px] font-bold text-white text-center italic opacity-80">“ {stats.moisture < 40 ? t.dialogue2 : t.dialogue1} ”</p>
          <div className="space-y-2 pb-6 lg:pb-0">
            <div className="flex justify-between text-[8px] font-black opacity-30 uppercase tracking-widest"><span>Bio-Link Stable</span><span>100%</span></div>
            <div className="h-0.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full transition-all duration-1000" style={{ width: '100%', backgroundColor: theme.chart }} /></div>
          </div>
        </div>
      </aside>
    </div>
  );
}