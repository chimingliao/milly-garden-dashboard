import React, { useState, useEffect } from 'react';
import {
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart
} from 'recharts';
import {
  LayoutDashboard, Droplets, Thermometer, Sun, Wind,
  Settings, Lightbulb, Fan, Flame, CloudDrizzle,
  Sprout, Waves, Gauge, Power, Check, ChevronDown, Palette,
  ChevronLeft, Menu, Activity, Zap, Monitor, Moon, SunMedium, User,
  Atom, Globe, Cpu, X
} from 'lucide-react';

// ---------------------------------------------------------
// 1. 多語言配置
// ---------------------------------------------------------
const DICT = {
  'zh-TW': {
    brand: "MILLY GARDEN", version: "v2.5.0-MOBILE", mainTitle: "智能控制中心", subtitle: "即時環境數據管理核心",
    dashboard: "監控總覽", analytics: "趨勢分析", settings: "系統設定",
    temp: "環境溫度", moisture: "土壤濕度", lux: "光照強度", co2: "二氧化碳",
    tab1: "核心設備", tab2: "氣候調節", butler: "智慧管家", lang: "語言", mode: "模式", theme: "配色",
    k1: "白光燈", k2: "暖光燈", k3: "生長燈", k4: "新風", k5: "通風", k6: "加熱", k7: "加濕", k8: "自動澆灌",
    admin: "管理員", dialogue1: "環境穩定。歡迎回來。", dialogue2: "水分略低，建議啟動澆灌。"
  },
  'zh-CN': {
    brand: "MILLY GARDEN", version: "v2.5.0-MOBILE", mainTitle: "智能控制中心", subtitle: "实时环境数据管理核心",
    dashboard: "监控总览", analytics: "趋势分析", settings: "系统设定",
    temp: "环境温度", moisture: "土壤湿度", lux: "光照强度", co2: "二氧化碳",
    tab1: "核心设备", tab2: "气候调节", butler: "智慧管家", lang: "语言", mode: "模式", theme: "配色",
    k1: "白光灯", k2: "暖光灯", k3: "生长灯", k4: "新风", k5: "通风", k6: "加热", k7: "加湿", k8: "自动浇灌",
    admin: "管理员", dialogue1: "环境稳定。欢迎回来。", dialogue2: "水分略低，建议启动浇灌。"
  },
  'en': {
    brand: "MILLY GARDEN", version: "v2.5.0", mainTitle: "INTELLIGENCE HUB", subtitle: "Real-time Telemetry Hub",
    dashboard: "Overview", analytics: "Analytics", settings: "Settings",
    temp: "Temp", moisture: "Moisture", lux: "Light", co2: "CO2",
    tab1: "Core", tab2: "Climate", butler: "BUTLER", lang: "Language", mode: "Mode", theme: "Theme",
    k1: "White", k2: "Warm", k3: "Grow", k4: "Air", k5: "Fan", k6: "Heat", k7: "Mist", k8: "Irrigation",
    admin: "Admin", dialogue1: "System optimal. Welcome back.", dialogue2: "Soil dry. Suggest irrigation."
  },
  'jp': {
    brand: "MILLY GARDEN", version: "v2.5.0", mainTitle: "インテリジェンス・ハブ", subtitle: "環境監視と制御コア",
    dashboard: "概要", analytics: "分析", settings: "設定",
    temp: "温度", moisture: "湿度", lux: "照度", co2: "二酸化炭素",
    tab1: "コア", tab2: "気候", butler: "執事", lang: "言語", mode: "モード", theme: "テーマ",
    k1: "白色灯", k2: "暖色灯", k3: "育成灯", k4: "換気扇", k5: "循環ファン", k6: "ヒーター", k7: "加湿器", k8: "自動給水",
    admin: "管理者", dialogue1: "庭園は良好です。おかえりなさい。", dialogue2: "土が乾燥中。給水を推奨します。"
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
// 2. SVG 培養艙 (響應式高度調整)
// ---------------------------------------------------------
const BioPodSVG = ({ themeColor, displayMode }: any) => (
  <div className="relative w-full h-[300px] lg:h-[400px] flex items-center justify-center p-4">
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
          <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 手機端側邊欄控制
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
      setData(prev => [...prev.slice(1), { ...prev[prev.length - 1], moisture: Math.max(30, Math.min(70, prev[prev.length - 1].moisture + (Math.random() - 0.5) * 5)) }]);
    }, 3000);
    return () => clearInterval(itv);
  }, []);

  const styles = {
    bg: displayMode === 'light' ? 'bg-zinc-100' : displayMode === 'glass' ? 'bg-black' : 'bg-[#09090b]',
    sidebar: displayMode === 'light' ? 'bg-white border-zinc-200' : 'bg-[#09090b] border-zinc-800',
    card: displayMode === 'light' ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900/30 border-zinc-800',
    text: displayMode === 'light' ? 'text-zinc-900' : 'text-white'
  };

  return (
    <div className={`flex flex-col lg:flex-row h-screen w-full font-sans overflow-hidden transition-all duration-700 ${styles.bg} ${styles.text}`}>

      {/* 1. 移動端頂部列 */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <Sprout size={20} className="text-emerald-500" />
          <span className="font-black text-sm tracking-widest">{t.brand}</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
      </div>

      {/* 2. 側邊欄 (支援響應式抽屜) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col border-r ${styles.sidebar}
      `}>
        <div className="h-20 px-6 flex flex-col justify-center border-b border-zinc-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout size={16} style={{ color: theme.chart }} />
              <span className="font-black text-base italic uppercase">{t.brand}</span>
            </div>
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}><X size={20} /></button>
          </div>
          <span className="text-[10px] font-black text-zinc-600 tracking-widest mt-1 ml-6">{t.version}</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[{ icon: <LayoutDashboard size={18} />, label: t.dashboard, active: true }, { icon: <Gauge size={18} />, label: t.analytics }, { icon: <Settings size={18} />, label: t.settings }].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer ${item.active ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>
              {item.icon} <span className="text-sm font-bold uppercase">{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="p-6 border-t border-zinc-800/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-white/5"><User size={20} className="opacity-40" /></div>
          <div className="flex-1 overflow-hidden font-black uppercase text-[10px]">VINCENT<p className="text-[8px] opacity-40">{t.admin}</p></div>
        </div>
      </aside>

      {/* 3. 主要內容區 */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto lg:overflow-hidden p-4 lg:p-8 relative">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
          <div className="hidden sm:block">
            <h1 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase italic leading-none">{t.mainTitle}</h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase mt-2 tracking-widest italic opacity-60">{t.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 shrink-0 shadow-2xl">
              {['zh-TW', 'zh-CN', 'en', 'jp'].map(l => (
                <button key={l} onClick={() => setLang(l as any)} className={`px-2 py-1 text-[9px] font-black rounded ${lang === l ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}>{l.toUpperCase().substring(0, 2)}</button>
              ))}
            </div>
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 shrink-0 shadow-2xl">
              {Object.entries(THEMES).map(([k, v]) => (
                <button key={k} onClick={() => setCurrentTheme(k as any)} className={`w-5 h-5 rounded-md m-0.5 ${currentTheme === k ? 'ring-2 ring-white' : 'opacity-40'}`} style={{ backgroundColor: v.chart }} />
              ))}
            </div>
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 shrink-0 shadow-2xl">
              {Object.entries(DISPLAY_MODES).map(([k, v]) => (
                <button key={k} onClick={() => setDisplayMode(k as any)} className={`p-1 px-2 text-zinc-500 ${displayMode === k ? 'text-white' : ''}`}>{v.icon}</button>
              ))}
            </div>
          </div>
        </header>

        {/* 數據卡片 (響應式欄位) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
          {[{ l: t.temp, v: stats.temp, u: '℃', i: Thermometer }, { l: t.moisture, v: stats.moisture, u: '%', i: Droplets }, { l: t.lux, v: stats.lux, u: 'Lux', i: Sun }, { l: t.co2, v: stats.co2, u: 'ppm', i: Zap }].map((s, i) => (
            <div key={i} className={`${styles.card} p-5 rounded-3xl flex items-center justify-between`}>
              <div><p className="text-[9px] font-black uppercase opacity-30 mb-1">{s.l}</p><p className="text-xl lg:text-2xl font-black tracking-tighter leading-none">{s.v.toFixed(1)} <span className="text-[10px] opacity-20">{s.u}</span></p></div>
              <s.i size={20} style={{ color: theme.chart }} />
            </div>
          ))}
        </div>

        {/* 圖表網格 (響應式高度與佈局) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 grid-rows-none lg:grid-rows-2 gap-4 min-h-[600px] lg:min-h-0 mb-6">
          <div className={`${styles.card} col-span-1 lg:col-span-2 row-span-1 lg:row-span-2 rounded-[3.5rem] p-6 lg:p-10 flex flex-col relative overflow-hidden`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}><defs><linearGradient id="mainG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={theme.chart} stopOpacity={0.2} /><stop offset="95%" stopColor={theme.chart} stopOpacity={0} /></linearGradient></defs><Area type="monotone" dataKey="moisture" stroke={theme.chart} strokeWidth={4} fill="url(#mainG)" isAnimationActive={true} /><XAxis dataKey="time" hide /><YAxis hide domain={['dataMin-5', 'dataMax+5']} /></AreaChart>
            </ResponsiveContainer>
          </div>
          <div className={`${styles.card} rounded-[2rem] p-6 hidden lg:flex flex-col`}>
            <p className="text-[9px] font-black opacity-30 uppercase mb-4">{t.lux}</p>
            <ResponsiveContainer><AreaChart data={data}><Area type="step" dataKey="lux" stroke={theme.chart} strokeWidth={2} fill={theme.chart} fillOpacity={0.1} /><YAxis hide /></AreaChart></ResponsiveContainer>
          </div>
          <div className={`${styles.card} rounded-[2rem] p-6 hidden lg:flex flex-col`}>
            <p className="text-[9px] font-black opacity-30 uppercase mb-4">{t.co2}</p>
            <ResponsiveContainer><LineChart data={data}><Line type="monotone" dataKey="co2" stroke={theme.chart} strokeWidth={2} dot={false} /><YAxis hide /></LineChart></ResponsiveContainer>
          </div>
        </div>

        {/* 分頁控制 (響應式欄位) */}
        <div className="shrink-0 space-y-4">
          <div className="flex gap-6 border-b border-zinc-800 pb-2">
            {['group1', 'group2'].map(gid => (
              <button key={gid} onClick={() => setActiveTab(gid)} className={`text-[10px] font-black uppercase tracking-widest relative pb-2 ${activeTab === gid ? 'text-white' : 'text-zinc-600'}`}>
                {gid === 'group1' ? t.tab1 : t.tab2}
                {activeTab === gid && <div className={`absolute bottom-0 left-0 right-0 h-[3px] rounded-full ${theme.bg}`} />}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
            {(activeTab === 'group1' ? switchGroups.group1 : switchGroups.group2).map(sw => (
              <div key={sw.id} onClick={() => setSwitches(p => ({ ...p, [sw.id]: !p[sw.id] }))} className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-center gap-4 ${switches[sw.id] ? `${theme.bg} border-transparent shadow-xl scale-[1.02]` : `${styles.card}`}`}>
                <div className={`p-2 rounded-xl ${switches[sw.id] ? 'bg-black/10 text-white' : 'bg-zinc-800'}`}><sw.icon size={18} strokeWidth={2.5} /></div>
                <div className="flex-1 min-w-0"><p className="text-xs font-black truncate">{sw.label}</p><p className="text-[8px] font-black opacity-30 uppercase">ID: {sw.id}</p></div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 4. 右側管家 (手機端縮小顯示) */}
      <aside className={`w-full lg:w-[320px] h-auto lg:h-full flex flex-col border-l ${styles.sidebar} shrink-0`}>
        <div className="hidden lg:flex h-20 border-b border-zinc-800/10 items-center px-10 gap-3">
          <Cpu size={18} className="text-zinc-600 animate-pulse" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 italic">{t.butler}</h3>
        </div>
        <BioPodSVG themeColor={theme.chart} displayMode={displayMode} />
        <div className="p-6 lg:p-10 bg-black/20 flex flex-col gap-6">
          <p className="text-[10px] font-bold text-white/80 leading-relaxed italic text-center uppercase tracking-tighter shadow-sm">
            “ {stats.moisture < 40 ? t.dialogue2 : t.dialogue1} ”
          </p>
          <div className="space-y-2 pb-10 lg:pb-0">
            <div className="flex justify-between items-center text-[9px] font-black uppercase opacity-40 tracking-widest"><span>Bio-Link Stable</span><span>100%</span></div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden shadow-inner"><div className="h-full transition-all duration-1000" style={{ width: '100%', backgroundColor: theme.chart }} /></div>
          </div>
        </div>
      </aside>
    </div>
  );
}