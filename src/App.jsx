import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════ */
const T = {
  // Attex Primary
  primary:    "#4361ee", primaryHover: "#3451d1", primaryLight: "#eef2ff",
  // Attex Status
  success:    "#1abc9c", successLight: "#d4f3ec",
  warning:    "#f7b731", warningLight: "#fef6e4",
  danger:     "#f34943", dangerLight:  "#fde8e7",
  info:       "#4fc6e1", infoLight:    "#e4f7fb",
  purple:     "#6c5dd3", purpleLight:  "#ede9fb",
  // Attex Neutrals
  text:       "#1a2035", textMuted: "#6c757d", textLight: "#98a6ad",
  white:      "#ffffff", bg: "#f0f2f5",
  // Attex Surface / Borders
  surface:    "#ffffff", border: "#e9ecef",
  // Attex Sidebar
  sidebar:    "#1a2035", sidebarActive: "#222840",
};

/* ═══════════════════════════════════════════════════════════════
   DUMMY DATA
═══════════════════════════════════════════════════════════════ */
const TRAINING_TYPES = [
  { id:"onboarding",   label:"Onboarding",   icon:"ri-building-line",    letter:"OB", color:"#4361ee",  bg:"#eef2ff" },
  { id:"compliance",   label:"Compliance",   icon:"ri-shield-check-line", letter:"CO", color:"#f34943",  bg:"#fde8e7" },
  { id:"softskills",   label:"Soft Skills",  icon:"ri-chat-smile-line",   letter:"SS", color:"#1abc9c",  bg:"#d4f3ec" },
  { id:"product",      label:"Product",      icon:"ri-box-3-line",        letter:"PR", color:"#4361ee",  bg:"#eef2ff" },
  { id:"safety",       label:"Safety",       icon:"ri-alarm-warning-line",letter:"SF", color:"#f7b731",  bg:"#fef6e4" },
  { id:"leadership",   label:"Leadership",   icon:"ri-user-star-line",    letter:"LD", color:"#6c5dd3",  bg:"#ede9fb" },
  { id:"technical",    label:"Technical",    icon:"ri-code-s-slash-line", letter:"TC", color:"#4fc6e1",  bg:"#e4f7fb" },
  { id:"sales",        label:"Sales",        icon:"ri-line-chart-line",   letter:"SL", color:"#f7b731",  bg:"#fef6e4" },
];

const TRAININGS = [
  { id:1, title:"New Employee Onboarding — April 2026",     type:"onboarding",  slides:8,  assigned:24, completed:18, inProgress:4, notStarted:2, avgScore:78, deadline:"2026-04-30", status:"active",    mandatory:true,  createdAt:"2026-03-01" },
  { id:2, title:"POSH Compliance Training 2026",            type:"compliance",  slides:6,  assigned:31, completed:31, inProgress:0, notStarted:0, avgScore:82, deadline:"2026-03-31", status:"completed", mandatory:true,  createdAt:"2026-02-10" },
  { id:3, title:"Effective Communication & Presentation",   type:"softskills",  slides:10, assigned:18, completed:7,  inProgress:8, notStarted:3, avgScore:74, deadline:"2026-05-15", status:"active",    mandatory:false, createdAt:"2026-03-05" },
  { id:4, title:"Product Deep Dive — Platform v3.0",        type:"product",     slides:12, assigned:12, completed:4,  inProgress:5, notStarted:3, avgScore:69, deadline:"2026-04-20", status:"active",    mandatory:false, createdAt:"2026-03-08" },
  { id:5, title:"Workplace Safety & Emergency Procedures",  type:"safety",      slides:7,  assigned:45, completed:40, inProgress:3, notStarted:2, avgScore:88, deadline:"2026-03-20", status:"active",    mandatory:true,  createdAt:"2026-02-20" },
  { id:6, title:"Leadership Fundamentals for Managers",     type:"leadership",  slides:9,  assigned:8,  completed:2,  inProgress:4, notStarted:2, avgScore:71, deadline:"2026-06-01", status:"active",    mandatory:false, createdAt:"2026-03-10" },
  { id:7, title:"Data Privacy & GDPR Compliance",           type:"compliance",  slides:5,  assigned:50, completed:48, inProgress:2, notStarted:0, avgScore:91, deadline:"2026-03-15", status:"active",    mandatory:true,  createdAt:"2026-02-01" },
  { id:8, title:"Advanced Excel for Finance Team",          type:"technical",   slides:15, assigned:6,  completed:1,  inProgress:3, notStarted:2, avgScore:66, deadline:"2026-05-30", status:"draft",     mandatory:false, createdAt:"2026-03-12" },
];

const EMPLOYEES = [
  { id:1,  name:"Priya Sharma",   initials:"PS", dept:"HR",        role:"HR Executive",          assigned:4, completed:3, avgScore:84, status:"active",  manager:"Neha Gupta"  },
  { id:2,  name:"Rahul Mehta",    initials:"RM", dept:"Sales",     role:"Sales Executive",       assigned:3, completed:1, avgScore:72, status:"active",  manager:"Vikram Joshi"},
  { id:3,  name:"Anika Singh",    initials:"AS", dept:"Tech",      role:"Software Engineer",     assigned:5, completed:5, avgScore:91, status:"active",  manager:"Amit Kumar"  },
  { id:4,  name:"Deepak Verma",   initials:"DV", dept:"Finance",   role:"Finance Analyst",       assigned:3, completed:2, avgScore:77, status:"active",  manager:"Sunita Rao"  },
  { id:5,  name:"Meera Patel",    initials:"MP", dept:"Operations",role:"Ops Manager",           assigned:6, completed:6, avgScore:88, status:"active",  manager:"Rajiv Nair"  },
  { id:6,  name:"Arjun Kapoor",   initials:"AK", dept:"Sales",     role:"Senior Sales Manager",  assigned:2, completed:0, avgScore:null,status:"active",  manager:"Vikram Joshi"},
  { id:7,  name:"Sneha Joshi",    initials:"SJ", dept:"HR",        role:"Recruiter",             assigned:4, completed:3, avgScore:79, status:"active",  manager:"Neha Gupta"  },
  { id:8,  name:"Rohit Das",      initials:"RD", dept:"Tech",      role:"DevOps Engineer",       assigned:3, completed:1, avgScore:65, status:"inactive",manager:"Amit Kumar"  },
];

const SLIDES = [
  { id:1, title:"Welcome to the Company",           letter:"WC", color:"#4361ee", bg:"#eef2ff", bullets:["Founded in 2018, 500+ employees","Offices in Mumbai, Delhi, Bangalore","Core values: Integrity, Innovation, Impact","Your journey starts here today"] },
  { id:2, title:"Company Culture & Values",         letter:"CV", color:"#1abc9c", bg:"#d4f3ec", bullets:["Open-door policy across all levels","Quarterly town halls with leadership","Employee resource groups (ERGs)","Mental health & wellness programs"] },
  { id:3, title:"Your Role & Responsibilities",     letter:"RR", color:"#f7b731", bg:"#fef6e4", bullets:["Understand your KPIs from Day 1","Weekly 1:1s with your direct manager","30-60-90 day plan to be shared","Reach out to buddy program anytime"] },
  { id:4, title:"IT Setup & Tools",                 letter:"IT", color:"#4fc6e1", bg:"#e4f7fb", bullets:["Laptop + accessories from IT on Day 1","Email, Slack, Jira access in 24 hours","VPN setup guide in your email","IT helpdesk: ext 1100 or it@company.com"] },
  { id:5, title:"HR Policies — Leave & Benefits",  letter:"HR", color:"#6c5dd3", bg:"#ede9fb", bullets:["18 days paid leave per year","5 sick leaves + 3 emergency leaves","Health insurance: Self + family","Provident Fund: Company matches 12%"] },
];

const ASSESS_QS = [
  { q:"Company ke headquarters kahan hain?", opts:["Delhi","Mumbai","Bangalore","Hyderabad"], ans:1 },
  { q:"Employee ko kitne paid leaves milte hain per year?", opts:["12 days","15 days","18 days","21 days"], ans:2 },
  { q:"IT helpdesk ka extension number kya hai?", opts:["1001","1100","1010","1111"], ans:1 },
  { q:"Company ke core values mein kya shamil nahi hai?", opts:["Integrity","Innovation","Profit","Impact"], ans:2 },
  { q:"30-60-90 day plan kaun share karega?", opts:["HR team","IT department","Direct manager","CEO office"], ans:2 },
];

const deptColors = { HR:"#4361ee", Sales:"#f7b731", Tech:"#4361ee", Finance:"#1abc9c", Operations:"#f7b731", "default":"#475569" };

/* ═══════════════════════════════════════════════════════════════
   MICRO COMPONENTS
═══════════════════════════════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Nunito',sans-serif;background:#f5f6fa;color:#313a46;-webkit-font-smoothing:antialiased;}
  ::-webkit-scrollbar{width:5px;height:5px;}
  ::-webkit-scrollbar-track{background:#f1f1f1;}
  ::-webkit-scrollbar-thumb{background:#ced4da;border-radius:3px;}
  ::-webkit-scrollbar-thumb:hover{background:#adb5bd;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes bounceIn{0%{transform:scale(0.85);opacity:0}70%{transform:scale(1.03)}100%{transform:scale(1);opacity:1}}
  @keyframes wave{0%{height:3px}100%{height:16px}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes slideIn{from{transform:translateX(100%)}to{transform:none}}
  .fadeUp{animation:fadeUp 0.3s ease both;}
  .fadeIn{animation:fadeIn 0.2s ease both;}
  input,textarea,select{outline:none;font-family:'Nunito',sans-serif;}
  button{font-family:'Nunito',sans-serif;cursor:pointer;}
  .attex-table th{background:#f8f9fa;font-weight:700;font-size:12px;color:#6c757d;text-transform:uppercase;letter-spacing:0.04em;padding:10px 14px;border-bottom:2px solid #e9ecef;}
  .attex-table td{padding:10px 14px;border-bottom:1px solid #f8f9fa;font-size:13px;color:#313a46;vertical-align:middle;}
  .attex-table tr:hover td{background:#f8f9fa;}
`;

function Sty() { return <style>{css}</style>; }

function Avatar({ initials, size=36, bg="#eef2ff", color="#4361ee", fontSize=13 }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:bg, color, fontWeight:700, fontSize, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{initials}</div>;
}

function Badge({ children, color="#4361ee", bg="transparent", size=11 }) {
  return <span style={{ background:"transparent", color, fontSize:size, fontWeight:700, padding:"2px 9px", borderRadius:100, whiteSpace:"nowrap", display:"inline-block", border:`1px solid ${color}` }}>{children}</span>;
}

function Btn({ children, onClick, variant="primary", size="md", disabled=false, full=false, style={} }) {
  const sz = { sm:{fontSize:12,padding:"4px 10px"}, md:{fontSize:13,padding:"7px 16px"}, lg:{fontSize:14,padding:"9px 22px"} }[size];
  const vars = {
    primary: { background:"#4361ee", color:"#fff",   border:"1px solid #3d7de8" },
    ghost:   { background:"#fff",    color:"#4361ee", border:"1px solid #3d7de8" },
    danger:  { background:"#f34943", color:"#fff",   border:"1px solid #f34943" },
    success: { background:"#1abc9c", color:"#fff",   border:"1px solid #1abc9c" },
    subtle:  { background:"#f0f2f5", color:"#6c757d", border:"1px solid #e9ecef" },
    white:   { background:"#fff",    color:"#1a2035", border:"1px solid #e9ecef" },
    warning: { background:"#f7b731", color:"#fff",   border:"1px solid #f7b731" },
  };
  const v = vars[variant] || vars.primary;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...sz, ...v, borderRadius:4, fontWeight:700, cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.55:1, width:full?"100%":"auto", ...style }}>
      {children}
    </button>
  );
}

function Card({ children, style={}, onClick }) {
  return (
    <div onClick={onClick}
      style={{ background:"#fff", borderRadius:4, border:"1px solid #e9ecef", boxShadow:"0 0 35px 0 rgba(154,161,171,0.12)", cursor:onClick?"pointer":"default", ...style }}>
      {children}
    </div>
  );
}

function ProgressBar({ pct, color="#4361ee", height=5, bg="#e9ecef" }) {
  return (
    <div style={{ height, background:bg, borderRadius:height, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${Math.min(100,pct||0)}%`, background:color, borderRadius:height, transition:"width 0.5s ease" }} />
    </div>
  );
}

function TypeIcon({ type, size=40 }) {
  const t = TRAINING_TYPES.find(x=>x.id===type) || TRAINING_TYPES[0];
  return (
    <div style={{ width:size, height:size, borderRadius:4, background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <span style={{ fontWeight:800, fontSize:size*0.3, color:t.color }}>{t.letter}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    active:         ["Active",      "#1abc9c"],
    completed:      ["Completed",   "#1abc9c"],
    draft:          ["Draft",       "#6c757d"],
    overdue:        ["Overdue",     "#f34943"],
    "not-started":  ["Not Started", "#6c757d"],
    "in-progress":  ["In Progress", "#4361ee"],
    inactive:       ["Inactive",    "#6c757d"],
  };
  const [label,color] = map[status] || map["active"];
  return <span style={{ background:"transparent", color, fontSize:11, fontWeight:700, padding:"2px 9px", borderRadius:100, whiteSpace:"nowrap", border:`1px solid ${color}` }}>{label}</span>;
}

function WaveAnim({ active, color="#4361ee" }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:3 }}>
      {[0.4,0.6,0.8,0.6,0.4].map((d,i)=>(
        <div key={i} style={{ width:3, borderRadius:2, background:active?color:"#ced4da", height:active?undefined:"3px",
          animation:active?`wave ${d}s ease-in-out ${i*0.08}s infinite alternate`:"none", minHeight:3, maxHeight:16 }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROLE SELECTOR
═══════════════════════════════════════════════════════════════ */
function RoleSelector({ onSelect }) {
  return (
    <div style={{ minHeight:"100vh", background:"#f0f2f5", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Nunito',sans-serif", padding:24 }}>
      <Sty/>
      <div style={{ width:"100%", maxWidth:480 }} className="fadeUp">
        {/* Logo / header */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:52, height:52, borderRadius:4, background:"#4361ee", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
            <span style={{ color:"#fff", fontWeight:800, fontSize:22 }}>LF</span>
          </div>
          <h1 style={{ color:"#1a2035", fontSize:26, fontWeight:800, margin:"0 0 6px" }}>LearnFlow</h1>
          <p style={{ color:"#98a6ad", fontSize:13 }}>Enterprise HR Training Platform</p>
        </div>

        {/* Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
          {[
            { role:"admin",    label:"HR Admin",  sub:"Manage trainings, employees & reports",  letter:"A", color:"#4361ee", bg:"#eef2ff" },
            { role:"employee", label:"Employee",  sub:"View & complete your assigned trainings", letter:"E", color:"#1abc9c", bg:"#d4f3ec" },
          ].map(r=>(
            <div key={r.role} onClick={()=>onSelect(r.role)}
              style={{ background:"#fff", border:"1px solid #e9ecef", borderRadius:4, padding:"24px 20px", cursor:"pointer", textAlign:"center", boxShadow:"0 0 35px 0 rgba(154,161,171,0.12)", transition:"border-color 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#4361ee"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="#e9ecef"}>
              <div style={{ width:44, height:44, borderRadius:4, background:r.bg, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                <span style={{ fontWeight:800, fontSize:18, color:r.color }}>{r.letter}</span>
              </div>
              <div style={{ fontWeight:700, fontSize:15, color:"#1a2035", marginBottom:6 }}>{r.label}</div>
              <div style={{ fontSize:12, color:"#98a6ad", lineHeight:1.5 }}>{r.sub}</div>
            </div>
          ))}
        </div>
        <p style={{ textAlign:"center", color:"#ced4da", fontSize:11 }}>UI/UX Prototype · Dummy Data Only</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ADMIN PANEL
═══════════════════════════════════════════════════════════════ */
function AdminPanel({ onExit }) {
  const [nav, setNav]         = useState("dashboard");
  const [createStep, setCS]   = useState(null);
  const [detail, setDetail]   = useState(null);
  const [assignTo, setAssign] = useState(null);

  const navItems = [
    { id:"dashboard",   sym:"▣",  label:"Dashboard"   },
    { id:"trainings",   sym:"☰",  label:"Trainings"   },
    { id:"employees",   sym:"◉",  label:"Employees"   },
    { id:"leaderboard", sym:"★",  label:"Leaderboard" },
    { id:"reports",     sym:"▤",  label:"Reports"     },
    { id:"settings",    sym:"✦",  label:"Settings"    },
  ];

  const goTo = (n) => { setNav(n); setCS(null); setDetail(null); setAssign(null); };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'Nunito',sans-serif" }}>
      <Sty/>
      {/* ── Sidebar ── */}
      <aside style={{ width:220, background:"#1a2035", display:"flex", flexDirection:"column", flexShrink:0, position:"sticky", top:0, height:"100vh" }}>
        {/* Logo */}
        <div style={{ padding:"18px 20px 16px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:4, background:"#4361ee", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"#fff", fontWeight:800, fontSize:14 }}>LF</span>
            </div>
            <div>
              <div style={{ color:"#fff", fontSize:16, fontWeight:800 }}>LearnFlow</div>
              <div style={{ color:"rgba(255,255,255,0.3)", fontSize:10, fontWeight:400 }}>HR Training Platform</div>
            </div>
          </div>
        </div>
        {/* Nav */}
        <nav style={{ flex:1, padding:"10px 0", overflowY:"auto" }}>
          <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.25)", letterSpacing:"0.1em", padding:"10px 20px 6px" }}>NAVIGATION</div>
          {navItems.map(n=>{
            const active = nav===n.id && !createStep && !detail;
            return (
              <div key={n.id} onClick={()=>goTo(n.id)}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 20px", cursor:"pointer",
                  background:active?"rgba(255,255,255,0.07)":"transparent",
                  borderLeft:active?"3px solid #3d7de8":"3px solid transparent",
                  color:active?"#fff":"rgba(255,255,255,0.45)", fontWeight:active?700:400, fontSize:13.5, transition:"all 0.12s" }}
                onMouseEnter={e=>{if(!active) e.currentTarget.style.background="rgba(255,255,255,0.04)";}}
                onMouseLeave={e=>{if(!active) e.currentTarget.style.background="transparent";}}>
                <span style={{ fontSize:14, width:16, textAlign:"center", opacity:active?1:0.6 }}>{n.sym}</span>
                {n.label}
              </div>
            );
          })}
        </nav>
        {/* Footer */}
        <div style={{ padding:"12px 0", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 20px", cursor:"pointer", color:"rgba(255,255,255,0.35)", fontSize:13 }} onClick={onExit}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{ fontSize:14 }}>←</span> Exit Demo
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:9, margin:"6px 12px 0", padding:"10px", background:"rgba(255,255,255,0.05)", borderRadius:4 }}>
            <Avatar initials="NA" size={32} bg="#4361ee" color="#fff" fontSize={11}/>
            <div>
              <div style={{ color:"rgba(255,255,255,0.85)", fontSize:12.5, fontWeight:700 }}>Neha Agarwal</div>
              <div style={{ color:"rgba(255,255,255,0.3)", fontSize:10.5 }}>HR Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* Topbar - matches screenshot */}
        <header style={{ background:"#fff", borderBottom:"1px solid #e9ecef", padding:"0 20px", height:58, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10 }}>
          {/* Left: hamburger + project selector */}
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ fontSize:18, color:"#6c757d", cursor:"pointer" }}>☰</span>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f0f2f5", border:"1px solid #e9ecef", borderRadius:4, padding:"6px 12px", cursor:"pointer", minWidth:200 }}>
              <Avatar initials="NA" size={24} bg="#4361ee" color="#fff" fontSize={10}/>
              <span style={{ fontSize:13, color:"#1a2035", fontWeight:600 }}>Project: LearnFlow</span>
              <span style={{ fontSize:10, color:"#98a6ad", marginLeft:"auto" }}>▾</span>
            </div>
          </div>
          {/* Right: bell + credits + user */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ position:"relative", cursor:"pointer" }}>
              <div style={{ width:34, height:34, borderRadius:4, background:"#f0f2f5", border:"1px solid #e9ecef", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:"#6c757d" }}>🔔</div>
              <span style={{ position:"absolute", top:-4, right:-4, background:"#f34943", color:"#fff", fontSize:9, fontWeight:800, borderRadius:100, padding:"1px 5px" }}>3</span>
            </div>
            <div style={{ border:"1.5px solid #f34943", borderRadius:4, padding:"4px 12px", display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
              <span style={{ background:"#f34943", color:"#fff", width:20, height:20, borderRadius:4, fontSize:10, fontWeight:800, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>◈</span>
              <div>
                <div style={{ fontSize:9, color:"#98a6ad", lineHeight:1 }}>Credits</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#f34943" }}>1002 / 5000</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
              <Avatar initials="NA" size={32} bg="#4361ee" color="#fff" fontSize={12}/>
              <div>
                <div style={{ fontSize:12.5, fontWeight:700, color:"#1a2035", lineHeight:1.2 }}>Neha Agarwal</div>
                <div style={{ fontSize:10.5, color:"#98a6ad" }}>HR Admin</div>
              </div>
            </div>
          </div>
        </header>
        {/* Breadcrumb bar */}
        <div style={{ background:"#f0f2f5", borderBottom:"1px solid #e9ecef", padding:"8px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13 }}>
            <span style={{ color:"#4361ee", cursor:"pointer", fontWeight:600 }}>Dashboard</span>
            <span style={{ color:"#98a6ad" }}>›</span>
            <span style={{ color:"#1a2035", fontWeight:700 }}>
              {createStep!=null ? "Create Training" : assignTo ? "Assign Training" : detail ? detail.title.substring(0,28)+"..." : nav.charAt(0).toUpperCase()+nav.slice(1)}
            </span>
          </div>
          {nav==="trainings" && !createStep && !detail && !assignTo && (
            <div style={{ display:"flex", gap:8 }}>
              <Btn size="sm">All Positions</Btn>
              <Btn size="sm" variant="ghost">All Candidates</Btn>
              <Btn size="sm" onClick={()=>setCS(1)}>+ Add Training</Btn>
            </div>
          )}
        </div>

        <main style={{ flex:1, padding:24, overflowY:"auto", background:"#f0f2f5" }}>
          {nav==="dashboard" && !createStep && !detail && !assignTo && <AdminDashboard onNewTraining={()=>{setCS(1);setNav("trainings");}} onViewTraining={t=>{setDetail(t);setNav("trainings");}} onAssign={t=>{setAssign(t);setNav("trainings");}}/>}
          {nav==="trainings" && !createStep && !detail && !assignTo && <TrainingList onCreate={()=>setCS(1)} onView={t=>setDetail(t)} onAssign={t=>setAssign(t)}/>}
          {nav==="trainings" && createStep && <CreateTraining step={createStep} setStep={setCS} onDone={()=>{setCS(null);setNav("trainings");}} onAssign={t=>{setCS(null);setAssign(t||TRAININGS[0]);}}/>}
          {nav==="trainings" && detail && !assignTo && <TrainingDetail training={detail} onBack={()=>setDetail(null)} onAssign={t=>{setDetail(null);setAssign(t);}} />}
          {nav==="trainings" && assignTo && <AssignTraining training={assignTo} onBack={()=>setAssign(null)} onDone={()=>{setAssign(null);setNav("trainings");}}/>}
          {nav==="employees" && <EmployeeList onAssign={t=>setAssign(t)}/>}
          {nav==="leaderboard" && <OverallLeaderboard />}
          {nav==="reports"   && <Reports />}
          {nav==="settings"  && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

/* Admin Dashboard */
function AdminDashboard({ onNewTraining, onViewTraining }) {
  const stats = [
    { label:"Total Trainings",    val:"8",   icon:"▣", color:"#4361ee", bg:"#eef2ff", delta:"+2 this month" },
    { label:"Active Employees",   val:"247", icon:"◉", color:"#4361ee", bg:"#eef2ff",  delta:"+5 new" },
    { label:"Completions Today",  val:"23",  icon:"✅", color:"#1abc9c",     bg:"#d4f3ec", delta:"↑ 18% vs yesterday" },
    { label:"Pending Compliance", val:"4",   icon:"▲", color:"#f34943",       bg:"#fde8e7",   delta:"Needs attention" },
    { label:"Avg Pass Score",     val:"79%", icon:"⭐", color:"#f7b731",     bg:"#fef6e4", delta:"↑ 2% this week" },
    { label:"Ext. Requests",      val:"3",   icon:"🕐", color:"#6c5dd3",   bg:"#EDE9FE",    delta:"Awaiting review" },
  ];
  return (
    <div className="fadeUp">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:14, color:"#98a6ad" }}>Good morning! 👋</div>
          <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:26, color:"#1a2035", marginTop:2 }}>Here's what's happening</div>
        </div>
        <Btn onClick={onNewTraining}>+ Create Training</Btn>
      </div>

      {/* KPI Row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
        {stats.map(s=>(
          <div key={s.label} style={{ background:s.bg, borderRadius:4, border:`1px solid ${s.color}22`, borderLeft:`4px solid ${s.color}`, padding:"18px 20px", boxShadow:"0 0 35px 0 rgba(154,161,171,0.08)" }}>
            <div style={{ fontSize:12, color:s.color, fontWeight:700, marginBottom:6, letterSpacing:"0.04em", textTransform:"uppercase" }}>{s.label}</div>
            <div style={{ fontSize:30, fontWeight:800, color:s.color, letterSpacing:"-0.5px" }}>{s.val}</div>
            <div style={{ fontSize:12, color:"#6c757d", marginTop:4 }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:20, marginBottom:24 }}>
        {/* Completion bars */}
        <Card style={{ padding:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
            <div style={{ fontWeight:700, fontSize:15, color:"#1a2035" }}>Training Completion Overview</div>
            <select style={{ border:"1px solid #E2E8F0", borderRadius:4, padding:"4px 10px", fontSize:12, color:"#6c757d" }}>
              <option>All Trainings</option>
            </select>
          </div>
          {TRAININGS.filter(t=>t.status!=="draft").slice(0,5).map(t=>{
            const pct = Math.round(t.completed/t.assigned*100);
            const tt = TRAINING_TYPES.find(x=>x.id===t.type);
            return (
              <div key={t.id} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, alignItems:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <span style={{ fontSize:14 }}>{tt?.icon}</span>
                    <span style={{ fontSize:13, color:"#6c757d", fontWeight:500, maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title.split("—")[0].trim()}</span>
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color:pct>=80?"#1abc9c":pct>=50?"#f7b731":"#f34943" }}>{pct}%</span>
                </div>
                <ProgressBar pct={pct} color={pct>=80?"#1abc9c":pct>=50?"#4361ee":"#f7b731"}/>
              </div>
            );
          })}
        </Card>

        {/* Category donut */}
        <Card style={{ padding:24 }}>
          <div style={{ fontWeight:700, fontSize:15, color:"#1a2035", marginBottom:20 }}>By Training Type</div>
          {TRAINING_TYPES.filter(t=>TRAININGS.some(tr=>tr.type===t.id)).map(t=>{
            const count = TRAININGS.filter(tr=>tr.type===t.id).length;
            const total = TRAININGS.length;
            return (
              <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:11 }}>
                <span style={{ fontSize:16 }}>{t.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                    <span style={{ fontSize:12, color:"#6c757d", fontWeight:500 }}>{t.label}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:"#1a2035" }}>{count}</span>
                  </div>
                  <ProgressBar pct={count/total*100} color={t.color} height={5}/>
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Recent + Mandatory */}
      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:20 }}>
        <Card style={{ padding:24 }}>
          <div style={{ fontWeight:700, fontSize:15, color:"#1a2035", marginBottom:18 }}>Recent Activity</div>
          {[
            { emp:"Priya Sharma",  initials:"PS", action:"Completed",  training:"POSH Compliance",        time:"2 min ago",  color:"#1abc9c"  },
            { emp:"Rahul Mehta",   initials:"RM", action:"Started",    training:"New Employee Onboarding", time:"14 min ago", color:"#4361ee"   },
            { emp:"Anika Singh",   initials:"AS", action:"Passed",     training:"Data Privacy & GDPR",     time:"1 hr ago",   color:"#1abc9c"  },
            { emp:"Arjun Kapoor",  initials:"AK", action:"Ext. Req.",  training:"Workplace Safety",        time:"2 hr ago",   color:"#f7b731"  },
            { emp:"Deepak Verma",  initials:"DV", action:"Failed",     training:"Product Deep Dive",       time:"3 hr ago",   color:"#f34943"    },
          ].map((a,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<4?"1px solid #F1F5F9":"none" }}>
              <Avatar initials={a.initials} size={34} bg={"#eef2ff"} color={"#4361ee"} fontSize={12}/>
              <div style={{ flex:1 }}>
                <span style={{ fontSize:13, fontWeight:600, color:"#1a2035" }}>{a.emp} </span>
                <span style={{ fontSize:13, color:"#6c757d" }}>{a.action} </span>
                <span style={{ fontSize:13, fontWeight:500, color:"#1a2035" }}>{a.training}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:11, fontWeight:700, color:a.color, background:a.color+"18", padding:"2px 7px", borderRadius:5 }}>{a.action}</span>
                <span style={{ fontSize:11, color:"#98a6ad" }}>{a.time}</span>
              </div>
            </div>
          ))}
        </Card>
        <Card style={{ padding:24 }}>
          <div style={{ fontWeight:700, fontSize:15, color:"#1a2035", marginBottom:18 }}>⚠️ Mandatory Overdue</div>
          {TRAININGS.filter(t=>t.mandatory && t.notStarted>0).map(t=>(
            <div key={t.id} style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:4, padding:"12px 14px", marginBottom:10, cursor:"pointer" }} onClick={()=>onViewTraining(t)}>
              <div style={{ fontWeight:600, fontSize:13, color:"#1a2035", marginBottom:4 }}>{t.title.substring(0,36)}...</div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
                <span style={{ color:"#f34943", fontWeight:700 }}>{t.notStarted} not started</span>
                <span style={{ color:"#98a6ad" }}>Due: Apr 30</span>
              </div>
            </div>
          ))}
          <div style={{ background:"#fef6e4", border:"1px solid #FDE68A", borderRadius:4, padding:"12px 14px" }}>
            <div style={{ fontWeight:600, fontSize:13, color:"#1a2035", marginBottom:4 }}>3 Extension Requests</div>
            <div style={{ fontSize:12, color:"#6c757d" }}>Pending admin approval</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* Training List */
function TrainingList({ onCreate, onView, onAssign }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [openMenu, setOpenMenu] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 3000); };

  const filtered = TRAININGS.filter(t=>{
    if(filter!=="all" && t.type!==filter) return false;
    if(search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="fadeUp">
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:14 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search trainings..." style={{ paddingLeft:34, paddingRight:14, paddingTop:8, paddingBottom:8, borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:13, width:220, background:"#fff", color:"#1a2035" }}/>
          </div>
          <div style={{ display:"flex", gap:4, background:"#fff", border:"1px solid #E2E8F0", borderRadius:10, padding:3 }}>
            {["⊞","☰"].map((icon,i)=>(
              <button key={i} onClick={()=>setView(i===0?"grid":"list")} style={{ border:"none", padding:"5px 10px", borderRadius:4, background:(view==="grid"&&i===0)||(view==="list"&&i===1)?"#eef2ff":"transparent", color:(view==="grid"&&i===0)||(view==="list"&&i===1)?"#4361ee":"#6c757d", cursor:"pointer", fontSize:14 }}>{icon}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="white" size="sm" onClick={()=>showToast("✅ Trainings exported as CSV successfully!")}>⬇ Export</Btn>
          <Btn onClick={onCreate} size="sm">+ Create Training</Btn>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, background:"#1a2035", color:"#fff", padding:"12px 20px", borderRadius:4, fontSize:13, fontWeight:600, zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"fadeUp 0.3s ease" }}>
          {toast}
        </div>
      )}

      {/* Type filters */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        <button onClick={()=>setFilter("all")} style={{ padding:"6px 16px", borderRadius:100, border:`1.5px solid ${filter==="all"?"#4361ee":"#e9ecef"}`, background:filter==="all"?"#eef2ff":"#fff", color:filter==="all"?"#4361ee":"#6c757d", fontSize:12, fontWeight:600, cursor:"pointer" }}>All ({TRAININGS.length})</button>
        {TRAINING_TYPES.filter(t=>TRAININGS.some(tr=>tr.type===t.id)).map(t=>{
          const cnt = TRAININGS.filter(tr=>tr.type===t.id).length;
          return <button key={t.id} onClick={()=>setFilter(t.id)} style={{ padding:"6px 14px", borderRadius:100, border:`1.5px solid ${filter===t.id?t.color:"#e9ecef"}`, background:filter===t.id?t.bg:"#fff", color:filter===t.id?t.color:"#6c757d", fontSize:12, fontWeight:600, cursor:"pointer" }}>{t.icon} {t.label} ({cnt})</button>;
        })}
      </div>

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:view==="grid"?"repeat(auto-fill,minmax(340px,1fr))":"1fr", gap:16 }}>
        {filtered.map(t=>{
          const tt = TRAINING_TYPES.find(x=>x.id===t.type);
          const pct = Math.round(t.completed/t.assigned*100);
          return (
            <Card key={t.id} hover style={{ overflow:"hidden" }}>
              {/* Color strip */}
              <div style={{ height:5, background:tt?.color||"#4361ee" }}/>
              <div style={{ padding:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <TypeIcon type={t.type} size={42}/>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#1a2035", lineHeight:1.3, maxWidth:180 }}>{t.title}</div>
                      <div style={{ fontSize:11, color:"#98a6ad", marginTop:2 }}>{tt?.label} • {t.slides} slides</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
                    <StatusBadge status={t.status}/>
                    {t.mandatory && <Badge color={"#f34943"} bg={"#fde8e7"} size={10}>MANDATORY</Badge>}
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
                  {[["◉","Assigned",t.assigned],["✓","Done",t.completed],["★","Avg Score",t.avgScore?t.avgScore+"%":"N/A"]].map(([ic,l,v])=>(
                    <div key={l} style={{ background:"#f0f2f5", borderRadius:10, padding:"8px 10px", textAlign:"center" }}>
                      <div style={{ fontSize:14 }}>{ic}</div>
                      <div style={{ fontSize:15, fontWeight:700, color:"#1a2035" }}>{v}</div>
                      <div style={{ fontSize:10, color:"#98a6ad" }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#98a6ad", marginBottom:5 }}>
                    <span>Completion</span><span style={{ fontWeight:700, color:pct>=80?"#1abc9c":pct>=50?"#f7b731":"#f34943" }}>{pct}%</span>
                  </div>
                  <ProgressBar pct={pct} color={pct>=80?"#1abc9c":pct>=50?"#4361ee":"#f7b731"}/>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <Btn onClick={()=>onView(t)} size="sm" style={{ flex:1 }}>View Details</Btn>
                  <Btn variant="ghost" size="sm" onClick={()=>onAssign(t)}>Assign</Btn>
                  <button title="Delete" onClick={()=>showToast("Training archived!")} style={{ width:30, height:30, border:"none", background:"#f34943", color:"#fff", borderRadius:4, cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, flexShrink:0 }}>✕</button>
                  <div style={{ position:"relative" }}>
                    <Btn variant="subtle" size="sm" onClick={()=>setOpenMenu(openMenu===t.id?null:t.id)}>⋯</Btn>
                    {openMenu===t.id && (
                      <div style={{ position:"absolute", right:0, top:36, background:"#fff", border:"1px solid #E4E7EC", borderRadius:4, boxShadow:"0 8px 24px rgba(16,24,40,0.14)", zIndex:50, minWidth:170, overflow:"hidden" }}>
                        <div onClick={()=>{setOpenMenu(null);onView(t);}} style={{ padding:"11px 16px", fontSize:13, cursor:"pointer", color:"#1a2035", display:"flex", gap:8, alignItems:"center" }} onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>✏️ Edit Training</div>
                        <div onClick={()=>{setOpenMenu(null);showToast("📋 Training duplicated!");}} style={{ padding:"11px 16px", fontSize:13, cursor:"pointer", color:"#1a2035", display:"flex", gap:8, alignItems:"center" }} onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>📋 Duplicate</div>
                        <div onClick={()=>{setOpenMenu(null);showToast("📤 Training shared via link!");}} style={{ padding:"11px 16px", fontSize:13, cursor:"pointer", color:"#1a2035", display:"flex", gap:8, alignItems:"center" }} onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>📤 Share Link</div>
                        <div style={{ height:1, background:"#F1F5F9" }}/>
                        <div onClick={()=>{setOpenMenu(null);showToast("🗑 Training archived!");}} style={{ padding:"11px 16px", fontSize:13, cursor:"pointer", color:"#f34943", display:"flex", gap:8, alignItems:"center" }} onMouseEnter={e=>e.currentTarget.style.background="#FEF2F2"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>🗑 Archive</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* Create Training Wizard */
function CreateTraining({ step, setStep, onDone, onAssign }) {
  const [form, setForm] = useState({ title:"", type:"", typeCustom:"", deadline:"", dept:[], mandatory:false });
  const [uploaded, setUploaded] = useState(false);
  const [indexed, setIndexed] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [genLoading, setGenLoading] = useState(false);
  const [slideNotes, setSlideNotes]       = useState({});
  const [expandedSlide, setExpandedSlide] = useState(null);
  const [certType, setCertType]           = useState(1);
  const [rewardsOn, setRewardsOn]         = useState(true);
  const [leaderboardOn, setLeaderboardOn] = useState(true);
  const [pointsPass, setPointsPass]       = useState("100");
  const [pointsFirst, setPointsFirst]     = useState("150");
  const [publishing, setPublishing]       = useState(false);
  const [published, setPublished]         = useState(false);
  // Avatar & Language state
  const [avatarGender, setAvatarGender]   = useState("female");
  const [avatarStyle, setAvatarStyle]     = useState("corporate");
  const [avatarAttire, setAvatarAttire]   = useState("formal");
  const [trainingLang, setTrainingLang]   = useState("hindi");
  // Upload sources
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [webUrl, setWebUrl]               = useState("");
  const [showUrlInput, setShowUrlInput]   = useState(false);

  const STEPS = ["Basic Details","Knowledge Base","Assessment","Avatar & Language","Settings","Publish"];

  const simulateUpload = () => {
    setUploaded(true);
    setTimeout(()=>setIndexed(true), 2000);
  };

  const generateQs = () => {
    setGenLoading(true);
    setTimeout(()=>{
      setQuestions(ASSESS_QS.slice(0,5));
      setGenLoading(false);
    }, 2200);
  };

  const doPublish = () => {
    setPublishing(true);
    setTimeout(()=>{ setPublishing(false); setPublished(true); }, 2000);
  };

  return (
    <div className="fadeUp" style={{ maxWidth:760, margin:"0 auto" }}>
      {/* Stepper */}
      <div style={{ display:"flex", alignItems:"center", marginBottom:32 }}>
        {STEPS.map((s,i)=>(
          <div key={s} style={{ display:"flex", alignItems:"center", flex:i<STEPS.length-1?1:0 }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, margin:"0 auto",
                background:i+1<step?"#1abc9c":i+1===step?"#4361ee":"#e9ecef",
                color:i+1<=step?"#fff":"#98a6ad" }}>
                {i+1<step?"✓":i+1}
              </div>
              <div style={{ fontSize:11, color:i+1===step?"#4361ee":"#98a6ad", fontWeight:i+1===step?700:400, marginTop:5, whiteSpace:"nowrap" }}>{s}</div>
            </div>
            {i<STEPS.length-1 && <div style={{ flex:1, height:2, background:i+1<step?"#1abc9c":"#e9ecef", margin:"0 6px", marginBottom:20 }}/>}
          </div>
        ))}
      </div>

      <Card style={{ padding:32 }}>
        {/* STEP 1 */}
        {step===1 && (
          <div>
            <h3 style={{ fontFamily:"'Nunito',sans-serif", fontSize:22, color:"#1a2035", marginBottom:6, fontWeight:400 }}>Training Basic Details</h3>
            <p style={{ fontSize:13, color:"#98a6ad", marginBottom:24 }}>Training ki foundational information fill karo</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {/* Training Title */}
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ fontSize:13, fontWeight:700, color:"#6c757d", display:"block", marginBottom:6 }}>Training Title *</label>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. New Employee Onboarding — Batch May 2026"
                  style={{ width:"100%", padding:"10px 14px", borderRadius:4, border:"1px solid #e9ecef", fontSize:14, color:"#1a2035", background:"#fff" }}/>
              </div>

              {/* Training Type — text input + suggestions */}
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ fontSize:13, fontWeight:700, color:"#6c757d", display:"block", marginBottom:6 }}>Training Type *</label>
                <input
                  value={form.typeCustom}
                  onChange={e=>setForm({...form, typeCustom:e.target.value, type:e.target.value})}
                  placeholder="Type karo ya niche se select karo — e.g. Onboarding, POSH, Fire Safety..."
                  style={{ width:"100%", padding:"10px 14px", borderRadius:4, border:`1.5px solid ${form.typeCustom?"#4361ee":"#e9ecef"}`, fontSize:14, color:"#1a2035", background:"#fff", marginBottom:10 }}
                />
                <div style={{ fontSize:11, color:"#98a6ad", marginBottom:8, fontWeight:600 }}>SUGGESTED TYPES</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {TRAINING_TYPES.map(t=>{
                    const sel = form.typeCustom===t.label;
                    return (
                      <button key={t.id} onClick={()=>setForm({...form, typeCustom:t.label, type:t.id})}
                        style={{ padding:"5px 14px", borderRadius:100, border:`1.5px solid ${sel?t.color:"#e9ecef"}`, background:sel?t.bg:"#fff", color:sel?t.color:"#6c757d", fontSize:12, fontWeight:sel?700:400, cursor:"pointer", transition:"all 0.15s" }}>
                        {t.letter} {t.label}
                      </button>
                    );
                  })}
                  {["POSH","Fire Safety","First Aid","Leadership","DEI","Anti-Bribery","ESG","Code of Conduct"].map(s=>{
                    const sel = form.typeCustom===s;
                    return (
                      <button key={s} onClick={()=>setForm({...form, typeCustom:s, type:s.toLowerCase().replace(/ /g,"-")})}
                        style={{ padding:"5px 14px", borderRadius:100, border:`1.5px solid ${sel?"#4361ee":"#e9ecef"}`, background:sel?"#eef2ff":"#fff", color:sel?"#4361ee":"#6c757d", fontSize:12, fontWeight:sel?700:400, cursor:"pointer" }}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label style={{ fontSize:13, fontWeight:700, color:"#6c757d", display:"block", marginBottom:6 }}>Completion Deadline *</label>
                <input type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})}
                  style={{ width:"100%", padding:"10px 14px", borderRadius:4, border:"1px solid #e9ecef", fontSize:14, color:"#1a2035" }}/>
              </div>

              {/* Target Departments — dropdown */}
              <div>
                <label style={{ fontSize:13, fontWeight:700, color:"#6c757d", display:"block", marginBottom:6 }}>Target Departments</label>
                <select
                  onChange={e=>{ const v=e.target.value; if(v&&!form.dept.includes(v)) setForm({...form,dept:[...form.dept,v]}); }}
                  value=""
                  style={{ width:"100%", padding:"10px 14px", borderRadius:4, border:"1px solid #e9ecef", fontSize:13, color:"#6c757d", background:"#fff", cursor:"pointer" }}>
                  <option value="">— Select Department —</option>
                  {["HR","Sales","Tech","Finance","Operations","Marketing","Legal","Admin","All Departments"].filter(d=>!form.dept.includes(d)).map(d=>(
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {form.dept.length>0 && (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8 }}>
                    {form.dept.map(d=>(
                      <span key={d} style={{ background:"#eef2ff", color:"#4361ee", fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:100, display:"inline-flex", alignItems:"center", gap:5 }}>
                        {d}
                        <span onClick={()=>setForm({...form,dept:form.dept.filter(x=>x!==d)})} style={{ cursor:"pointer", fontSize:13, color:"#98a6ad" }}>×</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Mandatory toggle */}
              <div style={{ gridColumn:"1/-1", display:"flex", alignItems:"center", gap:10 }}>
                <div onClick={()=>setForm({...form,mandatory:!form.mandatory})} style={{ width:44, height:24, borderRadius:4, background:form.mandatory?"#4361ee":"#CBD5E1", cursor:"pointer", position:"relative", transition:"all 0.2s" }}>
                  <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:form.mandatory?23:3, transition:"all 0.2s" }}/>
                </div>
                <span style={{ fontSize:13, fontWeight:600, color:"#6c757d" }}>Mark as Mandatory Training</span>
                {form.mandatory && <Badge color={"#f34943"} size={11}>MANDATORY</Badge>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step===2 && (
          <div>
            <h3 style={{ fontFamily:"'Nunito',sans-serif", fontSize:22, color:"#1a2035", marginBottom:6, fontWeight:400 }}>Knowledge Base</h3>
            <p style={{ fontSize:13, color:"#98a6ad", marginBottom:20 }}>Upload karo — Avatar isi se training karega aur assessment questions bhi isi se banengi</p>

            {/* Upload source buttons */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
              {[
                { label:"PDF",     ext:".pdf",              sym:"▤", color:"#f34943", bg:"#fde8e7" },
                { label:"PPT / PPTX", ext:".ppt,.pptx",    sym:"▣", color:"#f7b731", bg:"#fef6e4" },
                { label:"Word",    ext:".doc,.docx",        sym:"W", color:"#4361ee", bg:"#eef2ff" },
                { label:"Excel",   ext:".xls,.xlsx",        sym:"X", color:"#1abc9c", bg:"#d4f3ec" },
                { label:"Video",   ext:"video/*",           sym:"▶", color:"#6c5dd3", bg:"#ede9fb" },
                { label:"Web URL", ext:"url",               sym:"⌁", color:"#4fc6e1", bg:"#e4f7fb" },
              ].map(src=>(
                <div key={src.label}
                  onClick={()=>{ if(src.ext==="url"){ setShowUrlInput(v=>!v); } else { const f={id:Date.now(), name:`${src.label}_file_${uploadedFiles.length+1}${src.ext.split(",")[0]}`, type:src.label, size:"2.4 MB", status:"processing"}; setUploadedFiles(p=>[...p,f]); setTimeout(()=>setUploadedFiles(p=>p.map(x=>x.id===f.id?{...x,status:"done"}:x)),2000); }}}
                  style={{ border:`1.5px solid ${src.color}44`, borderRadius:4, padding:"14px 10px", cursor:"pointer", textAlign:"center", background:src.bg, transition:"all 0.15s" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=src.color}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=`${src.color}44`}>
                  <div style={{ width:36, height:36, borderRadius:4, background:src.color, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px", color:"#fff", fontWeight:800, fontSize:16 }}>{src.sym}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:src.color }}>{src.label}</div>
                  <div style={{ fontSize:10, color:"#98a6ad", marginTop:2 }}>Click to upload</div>
                </div>
              ))}
            </div>

            {/* Web URL input */}
            {showUrlInput && (
              <div style={{ background:"#e4f7fb", border:"1px solid #4fc6e1", borderRadius:4, padding:"12px 14px", marginBottom:14, display:"flex", gap:10, alignItems:"center", animation:"fadeIn 0.2s ease" }}>
                <span style={{ color:"#4fc6e1", fontWeight:800, fontSize:16 }}>⌁</span>
                <input value={webUrl} onChange={e=>setWebUrl(e.target.value)}
                  placeholder="https://example.com/training-page ya YouTube video URL"
                  style={{ flex:1, padding:"8px 12px", borderRadius:4, border:"1px solid #4fc6e1", fontSize:13, color:"#1a2035", background:"#fff" }}/>
                <button onClick={()=>{ if(webUrl.trim()){ const f={id:Date.now(),name:webUrl.trim(),type:"Web URL",size:"—",status:"done"}; setUploadedFiles(p=>[...p,f]); setWebUrl(""); setShowUrlInput(false); }}}
                  style={{ background:"#4fc6e1", color:"#fff", border:"none", padding:"8px 16px", borderRadius:4, fontWeight:700, fontSize:13, cursor:"pointer" }}>Add</button>
              </div>
            )}

            {/* Drop zone */}
            <div style={{ border:"2px dashed #c7d2fe", borderRadius:4, padding:"24px", textAlign:"center", background:"#fafafe", marginBottom:uploadedFiles.length?16:0 }}
              onDragOver={e=>e.preventDefault()}
              onDrop={e=>{ e.preventDefault(); Array.from(e.dataTransfer.files).forEach(file=>{ const f={id:Date.now()+Math.random(),name:file.name,type:file.name.split(".").pop().toUpperCase(),size:`${(file.size/1024/1024).toFixed(1)} MB`,status:"processing"}; setUploadedFiles(p=>[...p,f]); setTimeout(()=>setUploadedFiles(p=>p.map(x=>x.id===f.id?{...x,status:"done"}:x)),2000); }); }}>
              <div style={{ color:"#98a6ad", fontSize:13 }}>Ya files yahan <strong style={{color:"#4361ee"}}>drag & drop</strong> karo</div>
            </div>

            {/* Uploaded files list */}
            {uploadedFiles.length>0 && (
              <div style={{ marginTop:14 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#6c757d", marginBottom:8, letterSpacing:"0.05em" }}>UPLOADED FILES ({uploadedFiles.length})</div>
                {uploadedFiles.map(f=>(
                  <div key={f.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:f.status==="done"?"#f0fdf4":"#f0f2f5", border:`1px solid ${f.status==="done"?"#BBF7D0":"#e9ecef"}`, borderRadius:4, marginBottom:8 }}>
                    <div style={{ width:36, height:36, borderRadius:4, background:f.status==="done"?"#1abc9c":"#98a6ad", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:12, flexShrink:0 }}>
                      {f.status==="done"?"✓":f.type.substring(0,2)}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:13, color:"#1a2035", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</div>
                      <div style={{ fontSize:11, color:"#98a6ad", marginTop:2 }}>
                        {f.status==="done"
                          ? <span style={{ color:"#1abc9c", fontWeight:700 }}>✓ Ready — Avatar will use this for training</span>
                          : <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                              <span style={{ display:"inline-block", width:12, height:12, borderRadius:"50%", border:"2px solid #4361ee", borderTopColor:"transparent", animation:"spin 0.8s linear infinite" }}/>
                              Processing...
                            </span>
                        }
                      </div>
                    </div>
                    <span style={{ fontSize:11, color:"#98a6ad", marginRight:8 }}>{f.size}</span>
                    <button onClick={()=>setUploadedFiles(p=>p.filter(x=>x.id!==f.id))} style={{ border:"none", background:"none", color:"#f34943", cursor:"pointer", fontSize:16, padding:0 }}>✕</button>
                  </div>
                ))}
                {uploadedFiles.some(f=>f.status==="done") && (
                  <div style={{ background:"#eef2ff", border:"1px solid #c7d2fe", borderRadius:4, padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:4 }}>
                    <span style={{ fontSize:13, color:"#4361ee", fontWeight:700 }}>
                      {uploadedFiles.filter(f=>f.status==="done").length} file(s) indexed — Avatar is ready
                    </span>
                    <Badge color="#1abc9c" size={11}>Knowledge Base Ready</Badge>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 3 */}
        {step===3 && (
          <div>
            <h3 style={{ fontFamily:"'Nunito',sans-serif", fontSize:22, color:"#1a2035", marginBottom:6, fontWeight:400 }}>Assessment Questions</h3>
            <p style={{ fontSize:13, color:"#98a6ad", marginBottom:20 }}>Training ke end mein employee se pooche jaane wale questions</p>
            {/* AI Generate button */}
            <div style={{ background:"#4361ee", borderRadius:4, padding:20, marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:3 }}>✨ AI se Questions Generate Karo</div>
                <div style={{ color:"rgba(255,255,255,0.65)", fontSize:12 }}>Uploaded PPT/PDF se automatically questions banengi</div>
              </div>
              {genLoading ? (
                <div style={{ display:"flex", alignItems:"center", gap:8, color:"#fff", fontSize:13 }}>
                  <div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", animation:"spin 0.8s linear infinite" }}/>
                  Generating...
                </div>
              ) : (
                <button onClick={generateQs} style={{ background:"rgba(255,255,255,0.2)", border:"1.5px solid rgba(255,255,255,0.35)", color:"#fff", padding:"9px 20px", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:13, backdropFilter:"blur(8px)" }}>🪄 Generate 5 Questions</button>
              )}
            </div>

            {/* Settings row */}
            <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
              {[["Pass Score","70%"],["Time Limit","20 min"],["Retakes","1 allowed"]].map(([l,v])=>(
                <div key={l} style={{ background:"#f0f2f5", borderRadius:10, padding:"8px 14px", display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:12, color:"#98a6ad" }}>{l}:</span>
                  <span style={{ fontSize:13, fontWeight:700, color:"#1a2035" }}>{v}</span>
                  <span style={{ color:"#4361ee", fontSize:11, cursor:"pointer" }}>edit</span>
                </div>
              ))}
            </div>

            {/* Question list */}
            {questions.length===0 ? (
              <div style={{ textAlign:"center", padding:"40px 0", color:"#98a6ad" }}>
                <div style={{ fontSize:40, marginBottom:10 }}>📝</div>
                <div style={{ fontSize:14 }}>Koi question nahi hai. Generate karo ya manually add karo.</div>
              </div>
            ) : (
              <div>
                {questions.map((q,i)=>(
                  <div key={i} style={{ background:"#f0f2f5", borderRadius:4, padding:"14px 16px", marginBottom:10, border:"1px solid #E2E8F0" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <span style={{ background:"#eef2ff", color:"#4361ee", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:5 }}>Q{i+1}</span>
                        <span style={{ background:"#EDE9FE", color:"#6c5dd3", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:5 }}>MCQ</span>
                        <span style={{ background:"#DCFCE7", color:"#1abc9c", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:5 }}>✨ AI Generated</span>
                      </div>
                      <div style={{ display:"flex", gap:6 }}>
                        <button style={{ border:"none", background:"#f0f2f5", padding:"4px 10px", borderRadius:7, cursor:"pointer", fontSize:12, color:"#6c757d" }}>✏ Edit</button>
                        <button onClick={()=>setQuestions(questions.filter((_,j)=>j!==i))} style={{ border:"none", background:"#fde8e7", padding:"4px 10px", borderRadius:7, cursor:"pointer", fontSize:12, color:"#f34943" }}>🗑</button>
                      </div>
                    </div>
                    <div style={{ fontWeight:600, fontSize:14, color:"#1a2035", marginBottom:10 }}>{q.q}</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                      {q.opts.map((o,j)=>(
                        <div key={j} style={{ fontSize:12, padding:"7px 10px", borderRadius:4, background:j===q.ans?"#DCFCE7":"#fff", color:j===q.ans?"#1abc9c":"#6c757d", border:`1px solid ${j===q.ans?"#BBF7D0":"#e9ecef"}`, fontWeight:j===q.ans?700:400 }}>
                          {j===q.ans?"✓ ":""}{o}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={()=>setQuestions([...questions,{q:"New question here?",opts:["Option A","Option B","Option C","Option D"],ans:0}])}
                  style={{ width:"100%", padding:"10px", borderRadius:10, border:`2px dashed ${"#4361ee"}`, background:"#eef2ff", color:"#4361ee", cursor:"pointer", fontSize:13, fontWeight:600 }}>+ Add Manual Question</button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 — Avatar & Language */}
        {step===4 && (
          <div>
            <h3 style={{ fontFamily:"'Nunito',sans-serif", fontSize:22, color:"#1a2035", marginBottom:6, fontWeight:400 }}>Avatar & Language Setup</h3>
            <p style={{ fontSize:13, color:"#98a6ad", marginBottom:24 }}>Choose karo kaun-si avatar training deliver karegi aur kaunsi language mein</p>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              {/* Left: Avatar setup */}
              <div>
                {/* Gender */}
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:13, fontWeight:700, color:"#6c757d", display:"block", marginBottom:10 }}>Avatar Gender</label>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    {[
                      { id:"female", label:"Female", sym:"♀", color:"#6c5dd3", bg:"#ede9fb" },
                      { id:"male",   label:"Male",   sym:"♂", color:"#4361ee", bg:"#eef2ff" },
                    ].map(g=>(
                      <div key={g.id} onClick={()=>setAvatarGender(g.id)}
                        style={{ border:`2px solid ${avatarGender===g.id?g.color:"#e9ecef"}`, borderRadius:4, padding:"16px", textAlign:"center", cursor:"pointer", background:avatarGender===g.id?g.bg:"#fff", transition:"all 0.15s" }}>
                        <div style={{ fontSize:32, color:avatarGender===g.id?g.color:"#ced4da", marginBottom:6 }}>{g.sym}</div>
                        <div style={{ fontSize:13, fontWeight:700, color:avatarGender===g.id?g.color:"#6c757d" }}>{g.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Appearance */}
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:13, fontWeight:700, color:"#6c757d", display:"block", marginBottom:10 }}>Appearance Style</label>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {[
                      { id:"corporate",   label:"Corporate Indian",     desc:"Professional look, office setting" },
                      { id:"casual",      label:"Casual Indian",        desc:"Friendly, approachable look" },
                      { id:"traditional", label:"Traditional Indian",   desc:"Saree / kurta attire" },
                      { id:"tech",        label:"Tech / Modern",        desc:"Contemporary urban look" },
                    ].map(s=>(
                      <div key={s.id} onClick={()=>setAvatarStyle(s.id)}
                        style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", border:`1.5px solid ${avatarStyle===s.id?"#4361ee":"#e9ecef"}`, borderRadius:4, cursor:"pointer", background:avatarStyle===s.id?"#eef2ff":"#fff", transition:"all 0.15s" }}>
                        <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${avatarStyle===s.id?"#4361ee":"#ced4da"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          {avatarStyle===s.id && <div style={{ width:10, height:10, borderRadius:"50%", background:"#4361ee" }}/>}
                        </div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:700, color:avatarStyle===s.id?"#4361ee":"#1a2035" }}>{s.label}</div>
                          <div style={{ fontSize:11, color:"#98a6ad" }}>{s.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attire */}
                <div>
                  <label style={{ fontSize:13, fontWeight:700, color:"#6c757d", display:"block", marginBottom:10 }}>Uniform / Brand Attire</label>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {[
                      { id:"formal",   label:"Formal Wear" },
                      { id:"uniform",  label:"Company Uniform" },
                      { id:"branded",  label:"Brand T-Shirt" },
                      { id:"none",     label:"No Preference" },
                    ].map(a=>(
                      <button key={a.id} onClick={()=>setAvatarAttire(a.id)}
                        style={{ padding:"7px 14px", borderRadius:100, border:`1.5px solid ${avatarAttire===a.id?"#4361ee":"#e9ecef"}`, background:avatarAttire===a.id?"#eef2ff":"#fff", color:avatarAttire===a.id?"#4361ee":"#6c757d", fontSize:12, fontWeight:avatarAttire===a.id?700:400, cursor:"pointer" }}>
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Avatar preview + Language */}
              <div>
                {/* Avatar preview card */}
                <div style={{ background:"#f0f2f5", border:"1px solid #e9ecef", borderRadius:4, padding:"24px 20px", textAlign:"center", marginBottom:20 }}>
                  <div style={{ width:80, height:80, borderRadius:"50%", background:avatarGender==="female"?"#ede9fb":"#eef2ff", border:`3px solid ${avatarGender==="female"?"#6c5dd3":"#4361ee"}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", fontSize:36 }}>
                    {avatarGender==="female"?"👩‍💼":"👨‍💼"}
                  </div>
                  <div style={{ fontWeight:700, fontSize:14, color:"#1a2035", marginBottom:4 }}>
                    {avatarGender==="female"?"Priya":"Raj"} — AI Avatar Trainer
                  </div>
                  <div style={{ fontSize:11, color:"#98a6ad", marginBottom:12 }}>
                    {avatarStyle==="corporate"?"Corporate Indian":avatarStyle==="traditional"?"Traditional Indian":avatarStyle==="tech"?"Tech / Modern":"Casual Indian"} • {avatarAttire==="formal"?"Formal Wear":avatarAttire==="uniform"?"Company Uniform":avatarAttire==="branded"?"Brand T-Shirt":"No Preference"}
                  </div>
                  <div style={{ fontSize:12, color:"#4361ee", fontWeight:600, background:"#eef2ff", padding:"6px 14px", borderRadius:100, display:"inline-block" }}>
                    Language: {trainingLang==="hindi"?"Hindi":trainingLang==="english"?"English":trainingLang==="bengali"?"Bengali":trainingLang==="tamil"?"Tamil":trainingLang==="telugu"?"Telugu":trainingLang==="kannada"?"Kannada":trainingLang==="malayalam"?"Malayalam":trainingLang==="marathi"?"Marathi":trainingLang==="gujarati"?"Gujarati":trainingLang==="odia"?"Odia":trainingLang==="punjabi"?"Punjabi":trainingLang}
                  </div>
                </div>

                {/* Language selection */}
                <div>
                  <label style={{ fontSize:13, fontWeight:700, color:"#6c757d", display:"block", marginBottom:10 }}>Training Language</label>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                    {[
                      { id:"english",   label:"English",   script:"English" },
                      { id:"hindi",     label:"Hindi",     script:"हिंदी" },
                      { id:"bengali",   label:"Bengali",   script:"বাংলা" },
                      { id:"odia",      label:"Odia",      script:"ଓଡ଼ିଆ" },
                      { id:"tamil",     label:"Tamil",     script:"தமிழ்" },
                      { id:"telugu",    label:"Telugu",    script:"తెలుగు" },
                      { id:"kannada",   label:"Kannada",   script:"ಕನ್ನಡ" },
                      { id:"malayalam", label:"Malayalam", script:"മലയാളം" },
                      { id:"marathi",   label:"Marathi",   script:"मराठी" },
                      { id:"gujarati",  label:"Gujarati",  script:"ગુજરાતી" },
                      { id:"punjabi",   label:"Punjabi",   script:"ਪੰਜਾਬੀ" },
                    ].map(l=>(
                      <div key={l.id} onClick={()=>setTrainingLang(l.id)}
                        style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 12px", border:`1.5px solid ${trainingLang===l.id?"#4361ee":"#e9ecef"}`, borderRadius:4, cursor:"pointer", background:trainingLang===l.id?"#eef2ff":"#fff", transition:"all 0.12s" }}>
                        <span style={{ fontSize:13, fontWeight:trainingLang===l.id?700:400, color:trainingLang===l.id?"#4361ee":"#1a2035" }}>{l.label}</span>
                        <span style={{ fontSize:12, color:"#98a6ad" }}>{l.script}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {step===5 && (
          <div>
            <h3 style={{ fontFamily:"'Nunito',sans-serif", fontSize:22, color:"#1a2035", marginBottom:6, fontWeight:400 }}>Training Settings</h3>
            <p style={{ fontSize:13, color:"#98a6ad", marginBottom:24 }}>Completion criteria, certificates aur notifications configure karo</p>
            {[
              { title:"✅ Completion Criteria", desc:"Training complete kab mani jaayegi?",
                content: <div style={{ marginTop:12 }}>
                  {["All Slides Viewed + Assessment Passed (Recommended)","All Slides Viewed Only","Assessment Passed Only"].map((opt,i)=>(
                    <div key={opt} style={{ display:"flex", gap:10, alignItems:"center", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${i===0?"#4361ee":"#e9ecef"}`, background:i===0?"#eef2ff":"#fff", marginBottom:8, cursor:"pointer" }}>
                      <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${i===0?"#4361ee":"#CBD5E1"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {i===0 && <div style={{ width:8, height:8, borderRadius:"50%", background:"#4361ee" }}/>}
                      </div>
                      <span style={{ fontSize:13, color:i===0?"#4361ee":"#6c757d", fontWeight:i===0?700:400 }}>{opt}</span>
                      {i===0 && <Badge color={"#1abc9c"} bg={"#d4f3ec"} size={10}>Best Practice</Badge>}
                    </div>
                  ))}
                </div>
              },
              { title:"🏆 Certificate & Rewards", desc:"Certificate, badges aur points — employee ko kya milega?",
                content: (
                  <div style={{ marginTop:14 }}>
                    {/* Certificate type */}
                    <div style={{ fontWeight:600, fontSize:13, color:"#1a2035", marginBottom:10 }}>Certificate Type</div>
                    <div style={{ display:"flex", gap:10, marginBottom:20 }}>
                      {[["📜","Completion Certificate","Slides complete karo"],["🏅","Achievement Certificate","Pass karna zaroori (Recommended)"],["—","No Certificate","Certificate nahi milegi"]].map(([icon,label,sub],i)=>(
                        <div key={label} onClick={()=>setCertType(i)}
                          style={{ flex:1, padding:"12px 10px", borderRadius:4, border:`1.5px solid ${certType===i?"#4361ee":"#e9ecef"}`, background:certType===i?"#eef2ff":"#fff", textAlign:"center", cursor:"pointer", transition:"all 0.15s" }}>
                          <div style={{ fontSize:22, marginBottom:6 }}>{icon}</div>
                          <div style={{ fontSize:12, fontWeight:700, color:certType===i?"#4361ee":"#1a2035" }}>{label}</div>
                          <div style={{ fontSize:10, color:"#98a6ad", marginTop:3 }}>{sub}</div>
                          {i===1 && <div style={{ marginTop:6 }}><Badge color={"#1abc9c"} bg={"#d4f3ec"} size={9}>Best Practice</Badge></div>}
                        </div>
                      ))}
                    </div>

                    {/* Rewards toggle */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:rewardsOn?"#fef6e4":"#f0f2f5", borderRadius:4, border:`1.5px solid ${rewardsOn?"#FDE68A":"#e9ecef"}`, marginBottom: rewardsOn ? 14 : 0 }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                        <span style={{ fontSize:22 }}>🎖️</span>
                        <div>
                          <div style={{ fontWeight:700, fontSize:13, color:"#1a2035" }}>Rewards & Badges (Employee Side)</div>
                          <div style={{ fontSize:11, color:"#98a6ad", marginTop:1 }}>Training complete karne pe employee ko points aur badges milenge</div>
                        </div>
                      </div>
                      <div onClick={()=>setRewardsOn(v=>!v)} style={{ width:44, height:24, borderRadius:4, background:rewardsOn?"#F59E0B":"#CBD5E1", cursor:"pointer", position:"relative", transition:"all 0.2s", flexShrink:0 }}>
                        <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:rewardsOn?23:3, transition:"all 0.2s" }}/>
                      </div>
                    </div>

                    {/* Rewards config */}
                    {rewardsOn && (
                      <div style={{ background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:4, padding:"14px 16px", marginBottom:14, animation:"fadeIn 0.25s ease" }}>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
                          <div>
                            <div style={{ fontSize:12, fontWeight:700, color:"#92400E", marginBottom:6 }}>⭐ Points on Pass</div>
                            <div style={{ display:"flex", gap:6 }}>
                              {["50","100","150","200"].map(p=>(
                                <button key={p} onClick={()=>setPointsPass(p)}
                                  style={{ padding:"5px 12px", borderRadius:4, border:`1.5px solid ${pointsPass===p?"#F59E0B":"#FDE68A"}`, background:pointsPass===p?"#F59E0B":"#fff", color:pointsPass===p?"#fff":"#92400E", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                                  {p}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize:12, fontWeight:700, color:"#92400E", marginBottom:6 }}>🥇 Bonus — First Completer</div>
                            <div style={{ display:"flex", gap:6 }}>
                              {["50","100","150","200"].map(p=>(
                                <button key={p} onClick={()=>setPointsFirst(p)}
                                  style={{ padding:"5px 12px", borderRadius:4, border:`1.5px solid ${pointsFirst===p?"#F59E0B":"#FDE68A"}`, background:pointsFirst===p?"#F59E0B":"#fff", color:pointsFirst===p?"#fff":"#92400E", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                                  {p}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontWeight:700, fontSize:12, color:"#92400E", marginBottom:8 }}>🎖️ Badges Jo Milenge</div>
                        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                          {[
                            {icon:"🚀",label:"Fast Learner",desc:"Top 10% time mein"},
                            {icon:"💯",label:"Perfect Score",desc:"100% assessment"},
                            {icon:"🔥",label:"On Streak",desc:"Consecutive trainings"},
                            {icon:"⭐",label:"Star Employee",desc:"5+ trainings done"},
                          ].map(b=>(
                            <div key={b.label} style={{ background:"#fff", border:"1px solid #FDE68A", borderRadius:10, padding:"8px 12px", textAlign:"center", minWidth:90 }}>
                              <div style={{ fontSize:20 }}>{b.icon}</div>
                              <div style={{ fontSize:11, fontWeight:700, color:"#92400E", marginTop:3 }}>{b.label}</div>
                              <div style={{ fontSize:9, color:"#B45309", marginTop:1 }}>{b.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Leaderboard toggle */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:leaderboardOn?"#eef2ff":"#f0f2f5", borderRadius:4, border:`1.5px solid ${leaderboardOn?"#c7d2fe":"#e9ecef"}`, marginBottom: leaderboardOn ? 14 : 0 }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                        <span style={{ fontSize:22 }}>📊</span>
                        <div>
                          <div style={{ fontWeight:700, fontSize:13, color:"#1a2035" }}>Leaderboard (Admin View)</div>
                          <div style={{ fontSize:11, color:"#98a6ad", marginTop:1 }}>Is training ka leaderboard admin dashboard mein dikhega</div>
                        </div>
                      </div>
                      <div onClick={()=>setLeaderboardOn(v=>!v)} style={{ width:44, height:24, borderRadius:4, background:leaderboardOn?"#4361ee":"#CBD5E1", cursor:"pointer", position:"relative", transition:"all 0.2s", flexShrink:0 }}>
                        <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:leaderboardOn?23:3, transition:"all 0.2s" }}/>
                      </div>
                    </div>
                    {leaderboardOn && (
                      <div style={{ background:"#eef2ff", border:"1px solid #C7D2FE", borderRadius:4, padding:"12px 16px", animation:"fadeIn 0.25s ease" }}>
                        <div style={{ fontSize:12, color:"#4361ee", fontWeight:700, marginBottom:8 }}>Leaderboard mein dikhega:</div>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                          {["Rank by Score %","Rank by Completion Time","Rank by Points Earned","Department-wise Ranking"].map(item=>(
                            <div key={item} style={{ display:"flex", gap:6, alignItems:"center", fontSize:12, color:"#4361ee" }}>
                              <span style={{ color:"#1abc9c" }}>✓</span>{item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              },
              { title:"🔔 Notifications", desc:"Kab aur kisko notifications jaayengi?",
                content: <div style={{ marginTop:12 }}>
                  {[["Assignment Notification","Employee ko jab training assign ho","ON"],["Reminder — 3 days before deadline","Employee ko deadline reminder","ON"],["Deadline Missed","Manager ko alert","ON"],["Completion Confirmation","Employee ko completion email","ON"]].map(([l,d,v])=>(
                    <div key={l} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #F1F5F9" }}>
                      <div><div style={{ fontSize:13, fontWeight:600, color:"#1a2035" }}>{l}</div><div style={{ fontSize:11, color:"#98a6ad" }}>{d}</div></div>
                      <div style={{ width:40, height:22, borderRadius:11, background:v==="ON"?"#4361ee":"#CBD5E1", cursor:"pointer", position:"relative" }}>
                        <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:v==="ON"?21:3 }}/>
                      </div>
                    </div>
                  ))}
                </div>
              },
            ].map(sec=>(
              <Card key={sec.title} style={{ padding:18, marginBottom:14 }}>
                <div style={{ fontWeight:700, fontSize:14, color:"#1a2035" }}>{sec.title}</div>
                <div style={{ fontSize:12, color:"#98a6ad", marginTop:2 }}>{sec.desc}</div>
                {sec.content}
              </Card>
            ))}
          </div>
        )}

        {/* STEP 6 */}
        {step===6 && !published && (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:52, marginBottom:16 }}>🚀</div>
            <h3 style={{ fontFamily:"'Nunito',sans-serif", fontSize:26, color:"#1a2035", marginBottom:8, fontWeight:400 }}>Ready to Publish!</h3>
            <p style={{ color:"#98a6ad", fontSize:14, marginBottom:24 }}>Sabhi details review karo aur publish karo</p>
            <Card style={{ textAlign:"left", padding:20, marginBottom:24 }}>
              {[["📚 Title","New Employee Onboarding — Batch April 2026"],["🏢 Type","Onboarding"],["📅 Deadline","April 30, 2026"],["📄 Slides","5 slides uploaded & indexed"],["📝 Assessment","5 questions • Pass: 70% • 1 retake"],["🏆 Certificate","Achievement Certificate on pass"],["⚠️ Mandatory","YES"]].map(([l,v])=>(
                <div key={l} style={{ display:"flex", gap:16, padding:"9px 0", borderBottom:"1px solid #F1F5F9", alignItems:"center" }}>
                  <span style={{ fontSize:13, color:"#98a6ad", minWidth:140, fontWeight:500 }}>{l}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:"#1a2035" }}>{v}</span>
                </div>
              ))}
            </Card>
            <Btn onClick={doPublish} full size="lg" style={{ borderRadius:4 }}>
              {publishing ? "Publishing..." : "🚀 Publish Training"}
            </Btn>
          </div>
        )}
        {step===6 && published && (
          <div style={{ textAlign:"center", padding:"24px 0" }}>
            <div style={{ fontSize:64, marginBottom:16, animation:"fadeIn 0.5s ease" }}>🎉</div>
            <h2 style={{ fontFamily:"'Nunito',sans-serif", color:"#1abc9c", fontSize:28, fontWeight:400, marginBottom:8 }}>Training Published!</h2>
            <p style={{ color:"#98a6ad", marginBottom:28 }}>Training successfully publish ho gayi. Ab employees ko assign karo.</p>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <Btn onClick={onDone} size="lg">View All Trainings</Btn>
              <Btn variant="ghost" size="lg" onClick={()=>onAssign && onAssign(TRAININGS[0])}>Assign Employees →</Btn>
            </div>
          </div>
        )}

        {/* Nav */}
        {!(step===6 && published) && (
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:28, paddingTop:20, borderTop:"1px solid #F1F5F9" }}>
            <Btn variant="white" onClick={()=>step===1?onDone():setStep(s=>s-1)}>{step===1?"Cancel":"← Back"}</Btn>
            {step<6 && <Btn onClick={()=>setStep(s=>s+1)} disabled={step===1&&!form.title&&!form.typeCustom}>{step===5?"Review & Publish →":"Next Step →"}</Btn>}
          </div>
        )}
      </Card>
    </div>
  );
}

/* Training Detail */
function TrainingDetail({ training, onBack, onAssign }) {
  const [tab, setTab]         = useState("overview");
  const [reportEmp, setReportEmp] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ title:training.title, deadline:training.deadline||"", mandatory:training.mandatory });
  const [detailToast, setDetailToast] = useState(null);
  const [reminderSent, setReminderSent] = useState({});

  const showDetailToast = (msg) => { setDetailToast(msg); setTimeout(()=>setDetailToast(null),3000); };

  const tt = TRAINING_TYPES.find(x=>x.id===training.type);
  const pct = Math.round(training.completed/training.assigned*100);
  const emps = [
    { ...EMPLOYEES[0], tStatus:"completed",  tProgress:100, score:84, lastActivity:"2 days ago",  timeTaken:"1h 42m", slidesViewed:5, questionsAsked:3, attempts:1, completedOn:"Mar 5, 2026" },
    { ...EMPLOYEES[1], tStatus:"in-progress",tProgress:60,  score:null,lastActivity:"1 hour ago", timeTaken:"52m",    slidesViewed:3, questionsAsked:1, attempts:0, completedOn:null },
    { ...EMPLOYEES[2], tStatus:"completed",  tProgress:100, score:91, lastActivity:"3 days ago",  timeTaken:"2h 05m", slidesViewed:5, questionsAsked:6, attempts:1, completedOn:"Mar 4, 2026" },
    { ...EMPLOYEES[3], tStatus:"not-started",tProgress:0,   score:null,lastActivity:"Never",       timeTaken:"—",      slidesViewed:0, questionsAsked:0, attempts:0, completedOn:null },
    { ...EMPLOYEES[4], tStatus:"completed",  tProgress:100, score:88, lastActivity:"1 week ago",  timeTaken:"1h 58m", slidesViewed:5, questionsAsked:2, attempts:1, completedOn:"Feb 28, 2026" },
    { ...EMPLOYEES[5], tStatus:"not-started",tProgress:0,   score:null,lastActivity:"Never",       timeTaken:"—",      slidesViewed:0, questionsAsked:0, attempts:0, completedOn:null },
  ];

  // Show report modal if open
  if(reportEmp) return <CandidateReport emp={reportEmp} training={training} onClose={()=>setReportEmp(null)}/>;

  return (
    <div className="fadeUp">
      {/* Toast */}
      {detailToast && (
        <div style={{ position:"fixed", bottom:24, right:24, background:"#1a2035", color:"#fff", padding:"12px 20px", borderRadius:4, fontSize:13, fontWeight:600, zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"fadeUp 0.3s ease" }}>{detailToast}</div>
      )}

      {/* Edit Modal */}
      {editMode && (
        <div onClick={()=>setEditMode(false)} style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.5)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:4, padding:32, maxWidth:520, width:"100%", margin:24, boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:20, color:"#1a2035", fontWeight:700, marginBottom:4 }}>✏️ Edit Training</div>
            <div style={{ fontSize:13, color:"#98a6ad", marginBottom:24 }}>Training details update karo</div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:13, fontWeight:600, color:"#6c757d", display:"block", marginBottom:6 }}>Training Title</label>
              <input value={editForm.title} onChange={e=>setEditForm({...editForm,title:e.target.value})}
                style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:14, color:"#1a2035", boxSizing:"border-box" }}/>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:13, fontWeight:600, color:"#6c757d", display:"block", marginBottom:6 }}>Completion Deadline</label>
              <input type="date" value={editForm.deadline} onChange={e=>setEditForm({...editForm,deadline:e.target.value})}
                style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:14, color:"#1a2035" }}/>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
              <div onClick={()=>setEditForm({...editForm,mandatory:!editForm.mandatory})} style={{ width:44, height:24, borderRadius:4, background:editForm.mandatory?"#4361ee":"#CBD5E1", cursor:"pointer", position:"relative", transition:"all 0.2s" }}>
                <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:editForm.mandatory?23:3, transition:"all 0.2s" }}/>
              </div>
              <span style={{ fontSize:13, fontWeight:600, color:"#6c757d" }}>Mandatory Training</span>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <Btn variant="white" onClick={()=>setEditMode(false)}>Cancel</Btn>
              <Btn onClick={()=>{ setEditMode(false); showDetailToast("✅ Training updated successfully!"); }}>Save Changes</Btn>
            </div>
          </div>
        </div>
      )}

      <button onClick={onBack} style={{ background:"none", border:"none", color:"#4361ee", fontWeight:600, fontSize:13, cursor:"pointer", marginBottom:20, padding:0, display:"flex", alignItems:"center", gap:5 }}>← Back to Trainings</button>

      {/* Header Card */}
      <Card style={{ padding:24, marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:16, alignItems:"center" }}>
            <TypeIcon type={training.type} size={56}/>
            <div>
              <h2 style={{ fontFamily:"'Nunito',sans-serif", fontSize:24, color:"#1a2035", fontWeight:700, margin:"0 0 6px" }}>{training.title}</h2>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <Badge color={tt?.color||"#4361ee"} bg={tt?.bg||"#eef2ff"}>{tt?.icon} {tt?.label}</Badge>
                <StatusBadge status={training.status}/>
                {training.mandatory && <Badge color={"#f34943"} bg={"#fde8e7"}>MANDATORY</Badge>}
                <Badge color={"#6c757d"} bg={"#f0f2f5"}>📄 {training.slides} slides</Badge>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn variant="white" size="sm" onClick={()=>setEditMode(true)}>✏ Edit</Btn>
            <Btn size="sm" onClick={()=>onAssign(training)}>👥 Assign Employees</Btn>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginTop:20 }}>
          {[["Total Assigned",training.assigned,"◉","#4361ee"],["Completed",training.completed,"✓","#1abc9c"],["In Progress",training.inProgress,"▶","#4361ee"],["Not Started",training.notStarted,"—","#6c757d"],["Avg Score",(training.avgScore||0)+"%","⭐","#f7b731"]].map(([l,v,ic,c])=>(
            <div key={l} style={{ background:"#f0f2f5", borderRadius:4, padding:"14px 12px", textAlign:"center" }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{ic}</div>
              <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:24, color:c, letterSpacing:"-0.5px" }}>{v}</div>
              <div style={{ fontSize:11, color:"#98a6ad", marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#98a6ad", marginBottom:5 }}>
            <span>Overall Completion</span><span style={{ fontWeight:700, color:pct>=80?"#1abc9c":"#f7b731" }}>{pct}%</span>
          </div>
          <ProgressBar pct={pct} height={8} color={pct>=80?"#1abc9c":"#4361ee"}/>
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:20, background:"#fff", border:"1px solid #E2E8F0", borderRadius:4, padding:4, width:"fit-content" }}>
        {["overview","employees","reports"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:"7px 18px", borderRadius:4, border:"none", background:tab===t?"#eef2ff":"transparent", color:tab===t?"#4361ee":"#6c757d", fontWeight:tab===t?700:400, fontSize:13, cursor:"pointer", textTransform:"capitalize" }}>
            {t==="employees"?"👥 Employees":t==="reports"?"📈 Reports":"📊 Overview"}
          </button>
        ))}
      </div>

      {tab==="employees" && (
        <Card>
          <div style={{ padding:"16px 20px", borderBottom:"1px solid #F1F5F9", display:"flex", justifyContent:"space-between" }}>
            <div style={{ fontWeight:700, color:"#1a2035" }}>Assigned Employees ({emps.length})</div>
            <div style={{ display:"flex", gap:6 }}>
              <Btn variant="subtle" size="sm" onClick={()=>showDetailToast("✅ Employee data exported as CSV!")}>⬇ Export</Btn>
              <Btn variant="subtle" size="sm" onClick={()=>showDetailToast("🔔 Reminders sent to all pending employees!")}>🔔 Send Reminders</Btn>
            </div>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ borderBottom:"2px solid #F1F5F9" }}>
                {["Employee","Status","Progress","Score","Last Activity","Actions"].map(h=>(
                  <th key={h} style={{ textAlign:"left", padding:"10px 16px", fontSize:11, color:"#98a6ad", fontWeight:700, letterSpacing:"0.06em" }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {emps.map((e,i)=>{
                const dC = deptColors[e.dept]||deptColors.default;
                return (
                  <tr key={i} style={{ borderBottom:"1px solid #F8FAFC" }}>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <Avatar initials={e.initials} size={34} bg={"#eef2ff"} color={"#4361ee"} fontSize={12}/>
                        <div>
                          <div style={{ fontWeight:600, fontSize:13, color:"#1a2035" }}>{e.name}</div>
                          <Badge color={dC} bg={dC+"18"} size={10}>{e.dept}</Badge>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:"12px 16px" }}><StatusBadge status={e.tStatus}/></td>
                    <td style={{ padding:"12px 16px", minWidth:120 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ flex:1 }}><ProgressBar pct={e.tProgress} height={6}/></div>
                        <span style={{ fontSize:12, color:"#6c757d", fontWeight:600, minWidth:30 }}>{e.tProgress}%</span>
                      </div>
                    </td>
                    <td style={{ padding:"12px 16px", fontWeight:700, color:e.score?(e.score>=70?"#1abc9c":"#f34943"):"#98a6ad", fontSize:14 }}>
                      {e.score?`${e.score}%`:"—"}
                    </td>
                    <td style={{ padding:"12px 16px", fontSize:12, color:"#98a6ad" }}>{e.lastActivity}</td>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ display:"flex", gap:6 }}>
                        {e.tStatus==="completed" && e.tProgress===100 ? (
                          <button onClick={()=>setReportEmp(e)}
                            style={{ border:"none", background:"#4361ee", padding:"6px 12px", borderRadius:4, cursor:"pointer", fontSize:11, color:"#fff", fontWeight:700, display:"flex", alignItems:"center", gap:5 }}>
                            📊 View Report
                          </button>
                        ) : (
                          <>
                            {e.tStatus!=="completed" && <button onClick={()=>showDetailToast(`🔔 Reminder sent to ${e.name}!`)} style={{ border:"none", background:"#fef6e4", padding:"4px 8px", borderRadius:6, cursor:"pointer", fontSize:11, color:"#f7b731", fontWeight:600 }}>🔔 Remind</button>}
                            <button onClick={()=>showDetailToast(`👤 Opening ${e.name}'s profile...`)} style={{ border:"none", background:"#f0f2f5", padding:"4px 8px", borderRadius:6, cursor:"pointer", fontSize:11, color:"#6c757d" }}>View</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
      {tab==="overview" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {[["Completion Rate",pct+"%"],["Avg Score",(training.avgScore||0)+"%"],["Overdue",training.notStarted+" employees"],["Deadline","Apr 30, 2026"]].map(([l,v])=>(
            <Card key={l} style={{ padding:20 }}>
              <div style={{ fontSize:13, color:"#98a6ad", marginBottom:8 }}>{l}</div>
              <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:28, color:"#1a2035" }}>{v}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CANDIDATE REPORT
═══════════════════════════════════════════════════════════════ */
function CandidateReport({ emp, training, onClose }) {
  const [tab, setTab] = useState("overview");
  const [reportToast, setReportToast] = useState(null);
  const showToast = (msg) => { setReportToast(msg); setTimeout(()=>setReportToast(null),3000); };
  const tt  = TRAINING_TYPES.find(x=>x.id===training.type);
  const passed = emp.score >= 70;
  const dC  = deptColors[emp.dept] || deptColors.default;

  // Mock per-slide data
  const slideData = SLIDES.map((s,i)=>({
    ...s,
    timeSpent: ["4m 12s","3m 48s","5m 02s","2m 55s","6m 18s"][i],
    timeSpentSec: [252,228,302,175,378][i],
    questionsAsked: [1,0,2,0,0][i],
    viewed: true,
    minTime: 30,
  }));

  // Mock Q&A log
  const qaLog = [
    { slide:"Company Culture & Values",   time:"04:32", question:"Company mein casual leaves kab milti hain?", answer:"HR policy ke according 5 casual leaves milti hain alag se." },
    { slide:"IT Setup & Tools",           time:"12:14", question:"Laptop setup mein problem ho to kise contact karo?", answer:"IT helpdesk pe call karo: ext 1100, ya email it@company.com" },
    { slide:"IT Setup & Tools",           time:"14:02", question:"VPN kaise setup karein?", answer:"VPN setup guide aapke onboarding email mein hai. IT se bhi help le sakte hain." },
  ];

  // Mock assessment answers
  const assessAnswers = [
    { q:ASSESS_QS[0].q, selected:1, correct:1, isRight:true  },
    { q:ASSESS_QS[1].q, selected:2, correct:2, isRight:true  },
    { q:ASSESS_QS[2].q, selected:0, correct:1, isRight:false },
    { q:ASSESS_QS[3].q, selected:2, correct:2, isRight:true  },
    { q:ASSESS_QS[4].q, selected:2, correct:2, isRight:true  },
  ];
  const correct = assessAnswers.filter(a=>a.isRight).length;
  const scorePct = emp.score;

  return (
    <div className="fadeUp">
      {/* ── Back ── */}
      <button onClick={onClose}
        style={{ background:"none", border:"none", color:"#4361ee", fontWeight:600, fontSize:13, cursor:"pointer", marginBottom:20, padding:0, display:"flex", alignItems:"center", gap:5 }}>
        ← Back to Training Detail
      </button>

      {/* ── Hero Header ── */}
      <div style={{ background:"#4361ee", borderRadius:4, padding:"20px 24px", marginBottom:24, borderLeft:"4px solid #3451d1" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:20 }}>
          {/* Left: Employee info */}
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(255,255,255,0.2)", border:"2px solid rgba(255,255,255,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:20, color:"#fff" }}>
              {emp.initials}
            </div>
            <div>
              <div style={{ color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:700, letterSpacing:"0.1em", marginBottom:3 }}>CANDIDATE REPORT</div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:20, marginBottom:5 }}>{emp.name}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <span style={{ background:"rgba(255,255,255,0.2)", color:"#fff", fontSize:11, padding:"2px 10px", borderRadius:100, fontWeight:600 }}>{emp.dept}</span>
                <span style={{ background:"rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.85)", fontSize:11, padding:"2px 10px", borderRadius:100 }}>{emp.role}</span>
                <span style={{ background:"rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.85)", fontSize:11, padding:"2px 10px", borderRadius:100 }}>Completed: {emp.completedOn}</span>
              </div>
            </div>
          </div>

          {/* Right: Score */}
          <div style={{ textAlign:"center", background:"rgba(255,255,255,0.15)", borderRadius:4, padding:"14px 24px" }}>
            <div style={{ color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:700, letterSpacing:"0.08em", marginBottom:6 }}>FINAL SCORE</div>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:44, color:"#fff", lineHeight:1, letterSpacing:"-2px" }}>{scorePct}%</div>
            <div style={{ marginTop:8 }}>
              <span style={{ background:passed?"rgba(26,188,156,0.3)":"rgba(243,73,67,0.3)", color:passed?"#6EE7B7":"#fca5a5", fontSize:11, fontWeight:800, padding:"3px 12px", borderRadius:100, border:`1px solid ${passed?"rgba(26,188,156,0.5)":"rgba(243,73,67,0.5)"}` }}>
                {passed ? "✓ PASSED" : "✕ FAILED"}
              </span>
            </div>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, marginTop:4 }}>Pass score: 70%</div>
          </div>
        </div>

        {/* Training name */}
        <div style={{ marginTop:16, paddingTop:14, borderTop:"1px solid rgba(255,255,255,0.15)", display:"flex", alignItems:"center", gap:10 }}>
          <TypeIcon type={training.type} size={32}/>
          <div>
            <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>Training</div>
            <div style={{ color:"rgba(255,255,255,0.85)", fontSize:14, fontWeight:600 }}>{training.title}</div>
          </div>
        </div>
      </div>

      {/* ── Summary KPI Cards ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14, marginBottom:24 }}>
        {[
          { icon:"⏱", label:"Time Spent",      val:emp.timeTaken,          sub:"Total training duration",  color:"#4361ee",      bg:"#eef2ff"  },
          { icon:"📄", label:"Slides Viewed",   val:`${emp.slidesViewed}/${training.slides}`, sub:"All slides completed", color:"#1abc9c",     bg:"#d4f3ec" },
          { icon:"❓", label:"Questions Asked",  val:emp.questionsAsked,     sub:"To the AI Avatar",         color:"#6c5dd3",   bg:"#EDE9FE"    },
          { icon:"🔄", label:"Attempts",         val:emp.attempts,           sub:"Assessment attempts",       color:"#f7b731",     bg:"#fef6e4" },
          { icon:"🏆", label:"Certificate",      val:"Issued",               sub:emp.completedOn,            color:"#1abc9c",     bg:"#d4f3ec" },
        ].map(k=>(
          <Card key={k.label} style={{ padding:"16px 14px", textAlign:"center" }}>
            <div style={{ width:40, height:40, borderRadius:4, background:k.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, margin:"0 auto 10px" }}>{k.icon}</div>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:22, color:k.color, letterSpacing:"-0.5px" }}>{k.val}</div>
            <div style={{ fontSize:11, fontWeight:700, color:"#1a2035", marginTop:3 }}>{k.label}</div>
            <div style={{ fontSize:10, color:"#98a6ad", marginTop:2 }}>{k.sub}</div>
          </Card>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display:"flex", gap:4, marginBottom:20, background:"#fff", border:"1px solid #E2E8F0", borderRadius:4, padding:4, width:"fit-content" }}>
        {[["overview","📊 Overview"],["slides","📄 Slide Activity"],["assessment","📝 Assessment"],["qa","❓ Q&A Log"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{ padding:"7px 18px", borderRadius:4, border:"none", background:tab===id?"#eef2ff":"transparent", color:tab===id?"#4361ee":"#6c757d", fontWeight:tab===id?700:400, fontSize:13, cursor:"pointer" }}>
            {label}
          </button>
        ))}
      </div>

      {/* ══ TAB: OVERVIEW ══ */}
      {tab==="overview" && (
        <div className="fadeIn" style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:20 }}>
          {/* Timeline */}
          <Card style={{ padding:24 }}>
            <div style={{ fontWeight:700, fontSize:15, color:"#1a2035", marginBottom:20 }}>Training Timeline</div>
            {[
              { icon:"🚀", label:"Training Assigned",   date:"Mar 1, 2026",  time:"9:00 AM",  color:"#4361ee", done:true  },
              { icon:"▶",  label:"Training Started",    date:"Mar 4, 2026",  time:"10:22 AM", color:"#4361ee",      done:true  },
              { icon:"📄", label:"All Slides Completed",date:"Mar 4, 2026",  time:"12:04 PM", color:"#4361ee",      done:true  },
              { icon:"📝", label:"Assessment Taken",    date:"Mar 5, 2026",  time:"9:45 AM",  color:"#f7b731",     done:true  },
              { icon:"✅", label:"Training Completed",  date:"Mar 5, 2026",  time:"9:58 AM",  color:"#1abc9c",     done:true  },
              { icon:"🏆", label:"Certificate Issued",  date:"Mar 5, 2026",  time:"10:00 AM", color:"#f7b731",   done:true  },
            ].map((ev,i,arr)=>(
              <div key={ev.label} style={{ display:"flex", gap:14, position:"relative" }}>
                {/* Line */}
                {i < arr.length-1 && <div style={{ position:"absolute", left:19, top:36, width:2, height:"calc(100% - 4px)", background:"#f0f2f5" }}/>}
                {/* Dot */}
                <div style={{ width:38, height:38, borderRadius:"50%", background:ev.done?ev.color+"18":"#f0f2f5", border:`2px solid ${ev.done?ev.color:"#e9ecef"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, zIndex:1, fontSize:15 }}>{ev.icon}</div>
                <div style={{ paddingBottom:20, flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:13, color:"#1a2035" }}>{ev.label}</div>
                  <div style={{ fontSize:11, color:"#98a6ad", marginTop:2 }}>{ev.date} at {ev.time}</div>
                </div>
              </div>
            ))}
          </Card>

          {/* Score breakdown + engagement */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <Card style={{ padding:22 }}>
              <div style={{ fontWeight:700, fontSize:14, color:"#1a2035", marginBottom:16 }}>📊 Score Breakdown</div>
              <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:16 }}>
                {/* Score arc visual */}
                <div style={{ position:"relative", width:90, height:90, flexShrink:0 }}>
                  <svg viewBox="0 0 90 90" style={{ width:90, height:90, transform:"rotate(-90deg)" }}>
                    <circle cx="45" cy="45" r="36" fill="none" stroke="#f0f2f5" strokeWidth="10"/>
                    <circle cx="45" cy="45" r="36" fill="none" stroke={passed?"#1abc9c":"#f34943"} strokeWidth="10"
                      strokeDasharray={`${2*Math.PI*36*scorePct/100} ${2*Math.PI*36}`} strokeLinecap="round"/>
                  </svg>
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
                    <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:20, color:"#1a2035", lineHeight:1 }}>{scorePct}%</div>
                  </div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#6c757d", marginBottom:5 }}>
                    <span>Correct</span><span style={{ fontWeight:700, color:"#1abc9c" }}>{correct}/{ASSESS_QS.length}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#6c757d", marginBottom:5 }}>
                    <span>Wrong</span><span style={{ fontWeight:700, color:"#f34943" }}>{ASSESS_QS.length-correct}/{ASSESS_QS.length}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#6c757d" }}>
                    <span>Pass threshold</span><span style={{ fontWeight:700 }}>70%</span>
                  </div>
                </div>
              </div>
              <ProgressBar pct={scorePct} color={passed?"#1abc9c":"#f34943"} height={8}/>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#98a6ad", marginTop:5 }}>
                <span>0%</span><span style={{ color:"#f7b731" }}>70% pass</span><span>100%</span>
              </div>
            </Card>

            <Card style={{ padding:22 }}>
              <div style={{ fontWeight:700, fontSize:14, color:"#1a2035", marginBottom:14 }}>🎯 Engagement Score</div>
              {[
                ["Slides Completed", 100, "#1abc9c"],
                ["Avg Time per Slide", 74, "#4361ee"],
                ["Questions Asked", 60, "#6c5dd3"],
                ["Assessment Score", scorePct, passed?"#1abc9c":"#f34943"],
              ].map(([label,pct_,color])=>(
                <div key={label} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#6c757d", marginBottom:4 }}>
                    <span>{label}</span><span style={{ fontWeight:700, color }}>{pct_}%</span>
                  </div>
                  <ProgressBar pct={pct_} color={color} height={6}/>
                </div>
              ))}
            </Card>

            {/* AI Feedback */}
            <Card style={{ padding:20, background:"#f0f2f5", border:"1px solid #e9ecef" }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:10 }}>
                <span style={{ fontSize:18 }}>✨</span>
                <div style={{ fontWeight:700, fontSize:13, color:"#4361ee" }}>AI Performance Feedback</div>
              </div>
              <div style={{ fontSize:13, color:"#3730A3", lineHeight:1.7 }}>
                {emp.name.split(" ")[0]} ne training bahut achhe se complete ki. Slides pe average {Math.round(emp.timeTaken?.split("h")[0]*60 + parseInt(emp.timeTaken?.split("m")[0]?.split(" ").pop()))/SLIDES.length|0} min spend ki. {emp.questionsAsked} questions avatar se pooche — yeh engagement ka achha sign hai.
                {!passed && " Assessment mein IT setup section mein improvement ki zaroorat hai."}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ══ TAB: SLIDE ACTIVITY ══ */}
      {tab==="slides" && (
        <div className="fadeIn">
          <Card style={{ padding:24, marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:15, color:"#1a2035", marginBottom:18 }}>Slide-by-Slide Activity</div>
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {slideData.map((s,i)=>{
                const pctTime = Math.min(100, Math.round(s.timeSpentSec / 400 * 100));
                const isFast = s.timeSpentSec < s.minTime;
                return (
                  <div key={s.id} style={{ display:"grid", gridTemplateColumns:"36px 1fr 120px 100px 80px", gap:16, alignItems:"center", padding:"14px 0", borderBottom:i<slideData.length-1?"1px solid #F8FAFC":"none" }}>
                    {/* Slide number */}
                    <div style={{ width:36, height:36, borderRadius:10, background:s.gradient, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{s.icon}</div>

                    {/* Title */}
                    <div>
                      <div style={{ fontWeight:600, fontSize:13, color:"#1a2035" }}>{s.title}</div>
                      <div style={{ fontSize:11, color:"#98a6ad", marginTop:2 }}>Slide {i+1} of {SLIDES.length}</div>
                    </div>

                    {/* Time bar */}
                    <div>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#98a6ad", marginBottom:4 }}>
                        <span>Time</span>
                        <span style={{ fontWeight:700, color:isFast?"#f34943":"#6c757d" }}>{s.timeSpent}</span>
                      </div>
                      <ProgressBar pct={pctTime} color={isFast?"#f34943":"#4361ee"} height={5}/>
                      {isFast && <div style={{ fontSize:10, color:"#f34943", marginTop:2 }}>⚡ Too fast</div>}
                    </div>

                    {/* Questions */}
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:18, marginBottom:2 }}>{s.questionsAsked > 0 ? "❓" : "—"}</div>
                      <div style={{ fontSize:11, color:"#98a6ad" }}>{s.questionsAsked} question{s.questionsAsked!==1?"s":""}</div>
                    </div>

                    {/* Status */}
                    <div>
                      <Badge color={"#1abc9c"} bg={"#d4f3ec"} size={10}>✓ Viewed</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Total row */}
          <Card style={{ padding:"14px 24px", background:"#eef2ff", border:`1px solid #C7D2FE` }}>
            <div style={{ display:"flex", justifyContent:"space-around", textAlign:"center" }}>
              {[["Total Time",emp.timeTaken],["Slides Viewed",`${emp.slidesViewed}/${training.slides}`],["Total Questions",emp.questionsAsked],["Completion","100%"]].map(([l,v])=>(
                <div key={l}>
                  <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:22, color:"#4361ee" }}>{v}</div>
                  <div style={{ fontSize:11, color:"#6c757d", marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ══ TAB: ASSESSMENT ══ */}
      {tab==="assessment" && (
        <div className="fadeIn">
          {/* Result header */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:20 }}>
            {[
              ["📝 Score", `${correct}/${ASSESS_QS.length} correct`, `${scorePct}%`, passed?"#1abc9c":"#f34943", passed?"#d4f3ec":"#fde8e7"],
              ["⏱ Time Taken", "Assessment duration","13 min 02 sec", "#4361ee", "#eef2ff"],
              ["🔄 Attempts", "Assessment attempts","1st attempt","#f7b731","#fef6e4"],
            ].map(([title,sub,val,c,bg])=>(
              <Card key={title} style={{ padding:18, textAlign:"center" }}>
                <div style={{ fontSize:13, color:"#98a6ad", marginBottom:4 }}>{title}</div>
                <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:26, color:c, letterSpacing:"-0.5px" }}>{val}</div>
                <div style={{ fontSize:11, color:"#98a6ad", marginTop:3 }}>{sub}</div>
              </Card>
            ))}
          </div>

          {/* Q&A answers */}
          <Card style={{ padding:24 }}>
            <div style={{ fontWeight:700, fontSize:15, color:"#1a2035", marginBottom:20 }}>Answer Review</div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {assessAnswers.map((a,i)=>(
                <div key={i} style={{ borderRadius:4, border:`1.5px solid ${a.isRight?"#BBF7D0":"#FECACA"}`, background:a.isRight?"#F0FDF4":"#FEF2F2", padding:"16px 18px" }}>
                  <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:12 }}>
                    <div style={{ width:26, height:26, borderRadius:4, background:a.isRight?"#1abc9c":"#f34943", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:800, flexShrink:0 }}>{a.isRight?"✓":"✗"}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", gap:6, marginBottom:6 }}>
                        <Badge color={"#4361ee"} bg={"#eef2ff"} size={10}>Q{i+1}</Badge>
                        <Badge color={a.isRight?"#1abc9c":"#f34943"} bg={a.isRight?"#d4f3ec":"#fde8e7"} size={10}>{a.isRight?"Correct":"Wrong"}</Badge>
                      </div>
                      <div style={{ fontWeight:600, fontSize:14, color:"#1a2035", marginBottom:10, lineHeight:1.4 }}>{a.q}</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                        {ASSESS_QS[i].opts.map((opt,j)=>{
                          const isCorrect = j === a.correct;
                          const isSelected = j === a.selected;
                          const isWrongSelected = isSelected && !isCorrect;
                          return (
                            <div key={j} style={{ fontSize:12, padding:"7px 10px", borderRadius:4,
                              background:isCorrect?"#DCFCE7":isWrongSelected?"#fde8e7":"#fff",
                              color:isCorrect?"#1abc9c":isWrongSelected?"#f34943":"#6c757d",
                              border:`1px solid ${isCorrect?"#BBF7D0":isWrongSelected?"#FECACA":"#e9ecef"}`,
                              fontWeight:isCorrect||isWrongSelected?700:400,
                              display:"flex", gap:6, alignItems:"center" }}>
                              {isCorrect && <span>✓</span>}
                              {isWrongSelected && <span>✗</span>}
                              {opt}
                              {isSelected && !isCorrect && <span style={{ fontSize:10, color:"#f34943" }}>(Employee's answer)</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ══ TAB: Q&A LOG ══ */}
      {tab==="qa" && (
        <div className="fadeIn">
          <Card style={{ padding:24, marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:15, color:"#1a2035" }}>Avatar Q&A Log</div>
                <div style={{ fontSize:12, color:"#98a6ad", marginTop:2 }}>{emp.name} ne training ke dauran ye questions pooche</div>
              </div>
              <Badge color="#6c5dd3" bg="#EDE9FE">{emp.questionsAsked} questions asked</Badge>
            </div>

            {qaLog.length === 0 ? (
              <div style={{ textAlign:"center", padding:"40px 0", color:"#98a6ad" }}>
                <div style={{ fontSize:36, marginBottom:10 }}>💬</div>
                <div>Koi questions nahi pooche gaye</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {qaLog.map((qa,i)=>(
                  <div key={i} style={{ background:"#f0f2f5", borderRadius:4, padding:"16px 18px", border:"1px solid #E2E8F0" }}>
                    {/* Meta */}
                    <div style={{ display:"flex", gap:8, marginBottom:12, alignItems:"center" }}>
                      <Badge color={"#4361ee"} bg={"#eef2ff"} size={10}>Q{i+1}</Badge>
                      <span style={{ fontSize:11, color:"#98a6ad" }}>📄 {qa.slide}</span>
                      <span style={{ fontSize:11, color:"#98a6ad" }}>⏱ {qa.time} into training</span>
                    </div>

                    {/* Employee question */}
                    <div style={{ display:"flex", gap:10, marginBottom:12 }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:11, color:"#4361ee", flexShrink:0 }}>{emp.initials}</div>
                      <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"0 12px 12px 12px", padding:"10px 14px", flex:1 }}>
                        <div style={{ fontSize:11, color:"#98a6ad", marginBottom:4, fontWeight:600 }}>{emp.name}</div>
                        <div style={{ fontSize:13, color:"#1a2035" }}>{qa.question}</div>
                      </div>
                    </div>

                    {/* Avatar answer */}
                    <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                      <div style={{ background:"#eef2ff", border:"1px solid #c5d7f5", borderRadius:4, padding:"10px 14px", maxWidth:"75%" }}>
                        <div style={{ fontSize:11, color:"#4361ee", marginBottom:4, fontWeight:700 }}>👩‍💼 Priya (AI Avatar)</div>
                        <div style={{ fontSize:13, color:"#3730A3", lineHeight:1.6 }}>{qa.answer}</div>
                      </div>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>👩‍💼</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Insight box */}
          <Card style={{ padding:20, background:"#FFFBEB", border:"1px solid #FDE68A" }}>
            <div style={{ display:"flex", gap:10 }}>
              <span style={{ fontSize:20 }}>💡</span>
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:"#f7b731", marginBottom:4 }}>Insight</div>
                <div style={{ fontSize:13, color:"#92400E", lineHeight:1.6 }}>
                  {emp.name.split(" ")[0]} ne IT Setup slide pe sabse zyada questions pooche (2 questions). Iska matlab yeh topic thoda complex laga. Future trainings mein IT section ko thoda simplify karna help karega.
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── Action Bar ── */}
      {reportToast && <div style={{ position:"fixed", bottom:24, right:24, background:"#1a2035", color:"#fff", padding:"12px 20px", borderRadius:4, fontSize:13, fontWeight:600, zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"fadeUp 0.3s ease" }}>{reportToast}</div>}
      <div style={{ display:"flex", gap:10, marginTop:24, paddingTop:20, borderTop:"1px solid #E2E8F0", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:13, color:"#98a6ad" }}>Report generated: {emp.completedOn}</div>
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="white" size="sm" onClick={()=>showToast("🖨 Report sent to printer!")}>🖨 Print Report</Btn>
          <Btn variant="white" size="sm" onClick={()=>showToast("✅ Report exported as PDF!")}>⬇ Export PDF</Btn>
          {passed && <Btn variant="success" size="sm" onClick={()=>showToast(`🏆 Certificate downloaded for ${emp.name}!`)}>🏆 Download Certificate</Btn>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ASSIGN TRAINING FLOW
═══════════════════════════════════════════════════════════════ */
function AssignTraining({ training, onBack, onDone }) {
  const tt = TRAINING_TYPES.find(x=>x.id===training.type);

  // Step: "select" | "configure" | "confirm" | "done"
  const [step, setStep]               = useState("select");
  const [selMode, setSelMode]         = useState("individual"); // individual | department | designation
  const [selectedEmp, setSelectedEmp] = useState([]);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [selectedDesig, setSelectedDesig] = useState([]);
  const [search, setSearch]           = useState("");
  const [deadline, setDeadline]       = useState(training.deadline || "");
  const [priority, setPriority]       = useState("mandatory");
  const [notify, setNotify]           = useState(true);
  const [sendReminder, setSendReminder] = useState(true);
  const [reminderDays, setReminderDays] = useState("3");
  const [sending, setSending]         = useState(false);
  const [done, setDone]               = useState(false);

  const DEPTS = ["HR","Sales","Tech","Finance","Operations","All Departments"];
  const DESIGS = ["HR Executive","Sales Executive","Software Engineer","Finance Analyst","Ops Manager","Recruiter","DevOps Engineer","Sales Manager"];

  const filteredEmps = EMPLOYEES.filter(e => {
    if(!search) return true;
    return e.name.toLowerCase().includes(search.toLowerCase()) ||
           e.dept.toLowerCase().includes(search.toLowerCase()) ||
           e.role.toLowerCase().includes(search.toLowerCase());
  });

  // Already assigned employees (mock)
  const alreadyAssigned = [1, 3];

  const toggleEmp = (id) => {
    if(alreadyAssigned.includes(id)) return;
    setSelectedEmp(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };

  const toggleDept = (d) => setSelectedDepts(prev => prev.includes(d) ? prev.filter(x=>x!==d) : [...prev, d]);
  const toggleDesig = (d) => setSelectedDesig(prev => prev.includes(d) ? prev.filter(x=>x!==d) : [...prev, d]);

  // Count how many will be assigned
  const getAssignCount = () => {
    if(selMode==="individual") return selectedEmp.length;
    if(selMode==="department") {
      if(selectedDepts.includes("All Departments")) return EMPLOYEES.length;
      return EMPLOYEES.filter(e => selectedDepts.includes(e.dept)).length;
    }
    return EMPLOYEES.filter(e => selectedDesig.includes(e.role)).length;
  };

  const canProceed = () => {
    if(selMode==="individual") return selectedEmp.length > 0;
    if(selMode==="department") return selectedDepts.length > 0;
    return selectedDesig.length > 0;
  };

  const doAssign = () => {
    setSending(true);
    setTimeout(()=>{ setSending(false); setDone(true); }, 2200);
  };

  const PRIORITY_OPTIONS = [
    { id:"mandatory", label:"Mandatory", icon:"🔴", desc:"Employee ko yeh karna hi hoga", color:"#f34943", bg:"#fde8e7" },
    { id:"high",      label:"High",      icon:"🟠", desc:"Jaldi complete karna chahiye", color:"#f7b731", bg:"#fef6e4" },
    { id:"medium",    label:"Medium",    icon:"🟡", desc:"Normal priority",              color:"#CA8A04", bg:"#FEF9C3" },
    { id:"low",       label:"Low",       icon:"🟢", desc:"Jab time ho tab karo",         color:"#1abc9c", bg:"#d4f3ec" },
  ];

  if(done) return (
    <div className="fadeUp" style={{ maxWidth:520, margin:"60px auto", textAlign:"center" }}>
      <div style={{ background:"#fff", borderRadius:4, padding:"20px 24px", color:"#1a2035", marginBottom:24, border:"1px solid #e9ecef", borderLeft:"4px solid #4361ee" }}>
        <div style={{ fontSize:64, marginBottom:16 }}>✅</div>
        <h2 style={{ fontFamily:"'Nunito',sans-serif", fontSize:28, fontWeight:400, marginBottom:8 }}>Training Assigned!</h2>
        <p style={{ color:"#6c757d", fontSize:15, marginBottom:0 }}>
          {getAssignCount()} employee{getAssignCount()!==1?"s":""} ko <strong>"{training.title.substring(0,35)}..."</strong> assign ho gayi.
        </p>
        {notify && <p style={{ color:"#1abc9c", fontSize:13, marginTop:8 }}>✓ Email notification bhej di gayi hai.</p>}
      </div>
      <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
        <Btn onClick={onDone} size="lg">View Training Details</Btn>
        <Btn variant="ghost" size="lg" onClick={onBack}>← Back to Trainings</Btn>
      </div>
    </div>
  );

  return (
    <div className="fadeUp" style={{ maxWidth:860, margin:"0 auto" }}>
      {/* Back */}
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#4361ee", fontWeight:600, fontSize:13, cursor:"pointer", marginBottom:20, padding:0, display:"flex", alignItems:"center", gap:5 }}>← Back</button>

      {/* Training summary strip */}
      <div style={{ background:"#fff", borderRadius:4, padding:"14px 20px", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between", border:"1px solid #e9ecef", borderLeft:"4px solid #4361ee" }}>
        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          <TypeIcon type={training.type} size={48}/>
          <div>
            <div style={{ color:"#98a6ad", fontSize:11, fontWeight:700, letterSpacing:"0.08em", marginBottom:3 }}>ASSIGNING TRAINING</div>
            <div style={{ color:"#1a2035", fontWeight:700, fontSize:16, lineHeight:1.3 }}>{training.title}</div>
            <div style={{ display:"flex", gap:8, marginTop:5 }}>
              <Badge color="#4361ee" size={10}>{tt?.label}</Badge>
              <Badge color="#6c757d" size={10}>{training.slides} slides</Badge>
              {training.mandatory && <Badge color="#f34943" size={10}>MANDATORY</Badge>}
            </div>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ color:"#98a6ad", fontSize:11 }}>Already assigned to</div>
          <div style={{ fontFamily:"'Nunito',sans-serif", color:"#1a2035", fontSize:28 }}>{training.assigned}</div>
          <div style={{ color:"#98a6ad", fontSize:11 }}>employees</div>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display:"flex", alignItems:"center", marginBottom:28, gap:0 }}>
        {[["select","1","Select Employees"],["configure","2","Settings & Deadline"],["confirm","3","Review & Assign"]].map(([sid,num,label],i,arr)=>{
          const states = ["select","configure","confirm"];
          const idx = states.indexOf(step);
          const thisIdx = states.indexOf(sid);
          const done_ = idx > thisIdx;
          const active = idx === thisIdx;
          return (
            <div key={sid} style={{ display:"flex", alignItems:"center", flex: i < arr.length-1 ? 1 : 0 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ width:36, height:36, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, margin:"0 auto",
                  background:done_?"#1abc9c":active?"#4361ee":"#e9ecef",
                  color:done_||active?"#fff":"#98a6ad" }}>
                  {done_?"✓":num}
                </div>
                <div style={{ fontSize:11, color:active?"#4361ee":done_?"#1abc9c":"#98a6ad", fontWeight:active||done_?700:400, marginTop:5, whiteSpace:"nowrap" }}>{label}</div>
              </div>
              {i < arr.length-1 && <div style={{ flex:1, height:2, background:done_?"#1abc9c":"#e9ecef", margin:"0 8px", marginBottom:20 }}/>}
            </div>
          );
        })}
      </div>

      <Card style={{ padding:28 }}>

        {/* ── STEP 1: SELECT EMPLOYEES ── */}
        {step==="select" && (
          <div>
            <h3 style={{ fontFamily:"'Nunito',sans-serif", fontSize:22, fontWeight:400, color:"#1a2035", marginBottom:4 }}>Employees Select Karo</h3>
            <p style={{ fontSize:13, color:"#98a6ad", marginBottom:22 }}>Yeh training kisko assign karni hai?</p>

            {/* Mode tabs */}
            <div style={{ display:"flex", gap:0, marginBottom:22, background:"#f0f2f5", borderRadius:4, padding:4, width:"fit-content" }}>
              {[["individual","👤 Individual"],["department","🏢 By Department"],["designation","💼 By Designation"]].map(([mode,label])=>(
                <button key={mode} onClick={()=>{ setSelMode(mode); setSelectedEmp([]); setSelectedDepts([]); setSelectedDesig([]); }}
                  style={{ padding:"8px 20px", borderRadius:4, border:"none", background:selMode===mode?"#fff":"transparent", color:selMode===mode?"#1a2035":"#6c757d", fontWeight:selMode===mode?700:400, fontSize:13, cursor:"pointer", boxShadow:selMode===mode?"0 1px 4px rgba(0,0,0,0.08)":"none", transition:"all 0.15s" }}>
                  {label}
                </button>
              ))}
            </div>

            {/* INDIVIDUAL */}
            {selMode==="individual" && (
              <div>
                <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center" }}>
                  <div style={{ position:"relative", flex:1 }}>
                    <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:13 }}>🔍</span>
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Name, department ya role se search karo..." style={{ paddingLeft:34, paddingRight:14, paddingTop:9, paddingBottom:9, borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:13, width:"100%", color:"#1a2035" }}/>
                  </div>
                  {selectedEmp.length>0 && (
                    <div style={{ background:"#eef2ff", color:"#4361ee", fontSize:13, fontWeight:700, padding:"8px 16px", borderRadius:10, whiteSpace:"nowrap" }}>
                      {selectedEmp.length} selected
                    </div>
                  )}
                  <button onClick={()=>{ const ids = filteredEmps.filter(e=>!alreadyAssigned.includes(e.id)).map(e=>e.id); setSelectedEmp(ids); }}
                    style={{ border:"1.5px solid #1447E6", background:"#eef2ff", color:"#4361ee", padding:"8px 14px", borderRadius:10, cursor:"pointer", fontSize:12, fontWeight:700, whiteSpace:"nowrap" }}>
                    Select All
                  </button>
                </div>

                <div style={{ display:"grid", gap:8 }}>
                  {filteredEmps.map(e=>{
                    const isSelected = selectedEmp.includes(e.id);
                    const isAlready  = alreadyAssigned.includes(e.id);
                    const dC = deptColors[e.dept]||deptColors.default;
                    return (
                      <div key={e.id} onClick={()=>toggleEmp(e.id)}
                        style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", borderRadius:4, border:`1.5px solid ${isSelected?"#4361ee":isAlready?"#BBF7D0":"#e9ecef"}`,
                          background:isSelected?"#eef2ff":isAlready?"#F0FDF4":"#fff",
                          cursor:isAlready?"default":"pointer", transition:"all 0.15s", opacity:isAlready?0.75:1 }}
                        onMouseEnter={e_=>{ if(!isAlready&&!isSelected) e_.currentTarget.style.borderColor="#c7d2fe"; e_.currentTarget.style.background=!isAlready&&!isSelected?"#FAFAFE":e_.currentTarget.style.background; }}
                        onMouseLeave={e_=>{ if(!isAlready&&!isSelected){ e_.currentTarget.style.borderColor="#e9ecef"; e_.currentTarget.style.background="#fff"; }}}>

                        {/* Checkbox */}
                        <div style={{ width:20, height:20, borderRadius:6, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                          background:isAlready?"#10B981":isSelected?"#4361ee":"#fff",
                          border:`2px solid ${isAlready?"#10B981":isSelected?"#4361ee":"#CBD5E1"}` }}>
                          {(isSelected || isAlready) && <span style={{ color:"#fff", fontSize:11, fontWeight:900 }}>✓</span>}
                        </div>

                        <Avatar initials={e.initials} size={38} bg={"#eef2ff"} color={"#4361ee"} fontSize={13}/>

                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:14, color:"#1a2035" }}>{e.name}</div>
                          <div style={{ display:"flex", gap:6, marginTop:3, alignItems:"center" }}>
                            <Badge color={dC} bg={dC+"18"} size={10}>{e.dept}</Badge>
                            <span style={{ fontSize:11, color:"#98a6ad" }}>{e.role}</span>
                          </div>
                        </div>

                        <div style={{ textAlign:"right" }}>
                          {isAlready ? (
                            <Badge color={"#1abc9c"} bg={"#d4f3ec"} size={10}>✓ Already Assigned</Badge>
                          ) : (
                            <div style={{ fontSize:11, color:"#98a6ad" }}>
                              {e.completed}/{e.assigned} done
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DEPARTMENT */}
            {selMode==="department" && (
              <div>
                <p style={{ fontSize:13, color:"#98a6ad", marginBottom:16 }}>Kaunse departments ko assign karni hai?</p>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                  {DEPTS.map(d=>{
                    const empCount = d==="All Departments" ? EMPLOYEES.length : EMPLOYEES.filter(e=>e.dept===d).length;
                    const isSelected = selectedDepts.includes(d);
                    return (
                      <div key={d} onClick={()=>toggleDept(d)}
                        style={{ border:`1.5px solid ${isSelected?"#4361ee":"#e9ecef"}`, borderRadius:4, padding:"16px", cursor:"pointer", textAlign:"center",
                          background:isSelected?"#eef2ff":"#fff", transition:"all 0.15s" }}
                        onMouseEnter={e=>{if(!isSelected){e.currentTarget.style.borderColor="#c7d2fe";e.currentTarget.style.background="#FAFAFE";}}}
                        onMouseLeave={e=>{if(!isSelected){e.currentTarget.style.borderColor="#e9ecef";e.currentTarget.style.background="#fff";}}}>
                        <div style={{ fontSize:28, marginBottom:8 }}>{d==="All Departments"?"🌐":["💼","📈","💻","💰","⚙️"][DEPTS.indexOf(d)]||"🏢"}</div>
                        <div style={{ fontWeight:700, fontSize:14, color:isSelected?"#4361ee":"#1a2035", marginBottom:3 }}>{d}</div>
                        <div style={{ fontSize:12, color:"#98a6ad" }}>{empCount} employee{empCount!==1?"s":""}</div>
                        {isSelected && <div style={{ marginTop:8 }}><Badge color={"#4361ee"} bg="#c7d2fe" size={10}>✓ Selected</Badge></div>}
                      </div>
                    );
                  })}
                </div>
                {selectedDepts.length>0 && (
                  <div style={{ background:"#eef2ff", border:`1px solid #C7D2FE`, borderRadius:4, padding:"12px 16px", marginTop:16, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontSize:13, color:"#4361ee", fontWeight:600 }}>
                      📊 {getAssignCount()} employees will be assigned
                    </span>
                    <span style={{ fontSize:12, color:"#98a6ad" }}>Selected: {selectedDepts.join(", ")}</span>
                  </div>
                )}
              </div>
            )}

            {/* DESIGNATION */}
            {selMode==="designation" && (
              <div>
                <p style={{ fontSize:13, color:"#98a6ad", marginBottom:16 }}>Kaunsi designations ko assign karni hai?</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {DESIGS.map(d=>{
                    const cnt = EMPLOYEES.filter(e=>e.role===d).length;
                    const isSelected = selectedDesig.includes(d);
                    return (
                      <div key={d} onClick={()=>toggleDesig(d)}
                        style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderRadius:4, border:`1.5px solid ${isSelected?"#4361ee":"#e9ecef"}`, background:isSelected?"#eef2ff":"#fff", cursor:"pointer", transition:"all 0.15s" }}>
                        <div style={{ width:20, height:20, borderRadius:6, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                          background:isSelected?"#4361ee":"#fff", border:`2px solid ${isSelected?"#4361ee":"#CBD5E1"}` }}>
                          {isSelected && <span style={{ color:"#fff", fontSize:11, fontWeight:900 }}>✓</span>}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:13, color:isSelected?"#4361ee":"#1a2035" }}>{d}</div>
                          <div style={{ fontSize:11, color:"#98a6ad" }}>{cnt} employee{cnt!==1?"s":""}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedDesig.length>0 && (
                  <div style={{ background:"#eef2ff", border:`1px solid #C7D2FE`, borderRadius:4, padding:"12px 16px", marginTop:16 }}>
                    <span style={{ fontSize:13, color:"#4361ee", fontWeight:600 }}>📊 {getAssignCount()} employees will be assigned</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: CONFIGURE ── */}
        {step==="configure" && (
          <div>
            <h3 style={{ fontFamily:"'Nunito',sans-serif", fontSize:22, fontWeight:400, color:"#1a2035", marginBottom:4 }}>Settings & Deadline</h3>
            <p style={{ fontSize:13, color:"#98a6ad", marginBottom:24 }}>Deadline, priority aur notifications configure karo</p>

            {/* Deadline */}
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:13, fontWeight:700, color:"#1a2035", display:"block", marginBottom:10 }}>📅 Completion Deadline *</label>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {["2026-03-31","2026-04-15","2026-04-30","2026-05-15"].map(d=>{
                  const labels = {"2026-03-31":"Mar 31 (24 days)","2026-04-15":"Apr 15 (39 days)","2026-04-30":"Apr 30 (54 days)","2026-05-15":"May 15 (69 days)"};
                  return (
                    <button key={d} onClick={()=>setDeadline(d)}
                      style={{ padding:"9px 18px", borderRadius:10, border:`1.5px solid ${deadline===d?"#4361ee":"#e9ecef"}`, background:deadline===d?"#eef2ff":"#fff", color:deadline===d?"#4361ee":"#6c757d", fontSize:13, fontWeight:deadline===d?700:400, cursor:"pointer" }}>
                      {labels[d]}
                    </button>
                  );
                })}
                <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)}
                  style={{ padding:"9px 14px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:13, color:"#1a2035" }}/>
              </div>
            </div>

            {/* Priority */}
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:13, fontWeight:700, color:"#1a2035", display:"block", marginBottom:10 }}>⚡ Priority Level</label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                {[
                  {id:"mandatory",label:"Mandatory",icon:"🔴",desc:"Karna hi hoga",color:"#f34943",bg:"#fde8e7"},
                  {id:"high",     label:"High",     icon:"🟠",desc:"Jaldi karni chahiye",color:"#f7b731",bg:"#fef6e4"},
                  {id:"medium",   label:"Medium",   icon:"🟡",desc:"Normal priority",color:"#CA8A04",bg:"#FEF9C3"},
                  {id:"low",      label:"Low",      icon:"🟢",desc:"Jab time ho",color:"#1abc9c",bg:"#d4f3ec"},
                ].map(p=>(
                  <div key={p.id} onClick={()=>setPriority(p.id)}
                    style={{ border:`1.5px solid ${priority===p.id?p.color:"#e9ecef"}`, borderRadius:4, padding:"14px 12px", cursor:"pointer", textAlign:"center",
                      background:priority===p.id?p.bg:"#fff", transition:"all 0.15s" }}>
                    <div style={{ fontSize:24, marginBottom:6 }}>{p.icon}</div>
                    <div style={{ fontWeight:700, fontSize:13, color:priority===p.id?p.color:"#1a2035", marginBottom:2 }}>{p.label}</div>
                    <div style={{ fontSize:11, color:"#98a6ad" }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div style={{ borderTop:"1px solid #F1F5F9", paddingTop:20 }}>
              <label style={{ fontSize:13, fontWeight:700, color:"#1a2035", display:"block", marginBottom:14 }}>🔔 Notifications</label>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {[
                  { label:"Assignment notification bhejo", sub:"Employee ko immediately email milegi", val:notify, set:setNotify },
                  { label:"Deadline reminder bhejo", sub:`${reminderDays} days pehle reminder jaayega`, val:sendReminder, set:setSendReminder },
                ].map(n=>(
                  <div key={n.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:"#f0f2f5", borderRadius:4 }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:"#1a2035" }}>{n.label}</div>
                      <div style={{ fontSize:12, color:"#98a6ad", marginTop:2 }}>{n.sub}</div>
                    </div>
                    <div onClick={()=>n.set(v=>!v)} style={{ width:44, height:24, borderRadius:4, background:n.val?"#4361ee":"#CBD5E1", cursor:"pointer", position:"relative", transition:"all 0.2s", flexShrink:0 }}>
                      <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:n.val?23:3, transition:"all 0.2s" }}/>
                    </div>
                  </div>
                ))}
                {sendReminder && (
                  <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", background:"#fef6e4", borderRadius:10 }}>
                    <span style={{ fontSize:13, color:"#f7b731" }}>📅 Deadline se</span>
                    <select value={reminderDays} onChange={e=>setReminderDays(e.target.value)} style={{ border:"1px solid #FDE68A", borderRadius:4, padding:"4px 10px", fontSize:13, background:"#fff", color:"#1a2035" }}>
                      {["1","2","3","5","7"].map(d=><option key={d} value={d}>{d} din pehle</option>)}
                    </select>
                    <span style={{ fontSize:13, color:"#f7b731" }}>reminder jaayega</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: CONFIRM ── */}
        {step==="confirm" && (
          <div>
            <h3 style={{ fontFamily:"'Nunito',sans-serif", fontSize:22, fontWeight:400, color:"#1a2035", marginBottom:4 }}>Review & Assign</h3>
            <p style={{ fontSize:13, color:"#98a6ad", marginBottom:22 }}>Sab kuch check karo, phir assign karo</p>

            {/* Summary box */}
            <div style={{ background:"#f0f2f5", border:"1px solid #e9ecef", borderRadius:4, padding:"20px 24px", marginBottom:24 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {[
                  ["📚 Training", training.title.substring(0,40)+"..."],
                  ["👥 Assigning To", `${getAssignCount()} employee${getAssignCount()!==1?"s":""}` + (selMode==="department" ? ` (${selectedDepts.join(", ")})` : selMode==="designation" ? ` (${selectedDesig.join(", ")})` : "")],
                  ["📅 Deadline", deadline ? new Date(deadline).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) : "Not set"],
                  ["⚡ Priority", priority.charAt(0).toUpperCase()+priority.slice(1)],
                  ["📧 Notification", notify ? "Email jaayegi immediately" : "No notification"],
                  ["🔔 Reminder", sendReminder ? `${reminderDays} days before deadline` : "No reminder"],
                ].map(([l,v])=>(
                  <div key={l} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                    <div style={{ fontSize:13, color:"#98a6ad", minWidth:110, fontWeight:500 }}>{l}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#1a2035", lineHeight:1.4 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Employee preview (individual mode only) */}
            {selMode==="individual" && selectedEmp.length > 0 && (
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#1a2035", marginBottom:12 }}>Assigned Employees Preview:</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:240, overflowY:"auto", paddingRight:4 }}>
                  {EMPLOYEES.filter(e=>selectedEmp.includes(e.id)).map(e=>{
                    const dC = deptColors[e.dept]||deptColors.default;
                    return (
                      <div key={e.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"#f0f2f5", borderRadius:10 }}>
                        <Avatar initials={e.initials} size={34} bg={"#eef2ff"} color={"#4361ee"} fontSize={12}/>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:13, color:"#1a2035" }}>{e.name}</div>
                          <Badge color={dC} bg={dC+"18"} size={10}>{e.dept} • {e.role}</Badge>
                        </div>
                        <button onClick={()=>setSelectedEmp(prev=>prev.filter(x=>x!==e.id))} style={{ border:"none", background:"none", color:"#98a6ad", cursor:"pointer", fontSize:16, lineHeight:1 }}>×</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Warning if mandatory */}
            {priority==="mandatory" && (
              <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:4, padding:"12px 16px", marginBottom:20, display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:18 }}>⚠️</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:"#f34943" }}>Mandatory Training</div>
                  <div style={{ fontSize:12, color:"#B91C1C", marginTop:2 }}>
                    Yeh training Mandatory mark hai. Employees ko deadline miss karne pe manager ko alert jaayega.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom nav */}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:28, paddingTop:20, borderTop:"1px solid #F1F5F9", alignItems:"center" }}>
          <Btn variant="white" onClick={()=>{ if(step==="select") onBack(); else if(step==="configure") setStep("select"); else setStep("configure"); }}>
            {step==="select"?"Cancel":"← Back"}
          </Btn>

          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            {canProceed() && step==="select" && (
              <span style={{ fontSize:13, color:"#98a6ad" }}>{getAssignCount()} employee{getAssignCount()!==1?"s":""} selected</span>
            )}
            {step==="select" && (
              <Btn onClick={()=>setStep("configure")} disabled={!canProceed()}>Next: Settings →</Btn>
            )}
            {step==="configure" && (
              <Btn onClick={()=>setStep("confirm")} disabled={!deadline}>Review Assignment →</Btn>
            )}
            {step==="confirm" && (
              <Btn onClick={doAssign} variant="success" style={{ minWidth:160 }}>
                {sending ? (
                  <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ width:14, height:14, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", display:"inline-block", animation:"spin 0.8s linear infinite" }}/>
                    Assigning...
                  </span>
                ) : `✓ Assign to ${getAssignCount()} Employee${getAssignCount()!==1?"s":""}`}
              </Btn>
            )}
          </div>
        </div>

      </Card>
    </div>
  );
}

/* Employee List */
// Per-employee mock training data
const EMP_TRAININGS = {
  1: [ // Priya Sharma
    { id:1, tStatus:"completed",   tProgress:100, score:84,  completedOn:"Mar 5, 2026"  },
    { id:2, tStatus:"completed",   tProgress:100, score:88,  completedOn:"Mar 1, 2026"  },
    { id:3, tStatus:"in-progress", tProgress:65,  score:null,completedOn:null           },
    { id:7, tStatus:"completed",   tProgress:100, score:79,  completedOn:"Feb 28, 2026" },
  ],
  2: [ // Rahul Mehta
    { id:1, tStatus:"in-progress", tProgress:40,  score:null,completedOn:null           },
    { id:5, tStatus:"not-started", tProgress:0,   score:null,completedOn:null           },
    { id:7, tStatus:"completed",   tProgress:100, score:72,  completedOn:"Mar 3, 2026"  },
  ],
  3: [ // Anika Singh
    { id:1, tStatus:"completed",   tProgress:100, score:95,  completedOn:"Mar 2, 2026"  },
    { id:2, tStatus:"completed",   tProgress:100, score:91,  completedOn:"Feb 25, 2026" },
    { id:4, tStatus:"completed",   tProgress:100, score:88,  completedOn:"Mar 6, 2026"  },
    { id:5, tStatus:"completed",   tProgress:100, score:90,  completedOn:"Mar 1, 2026"  },
    { id:7, tStatus:"completed",   tProgress:100, score:94,  completedOn:"Feb 20, 2026" },
  ],
  4: [ // Deepak Verma
    { id:1, tStatus:"completed",   tProgress:100, score:77,  completedOn:"Mar 4, 2026"  },
    { id:7, tStatus:"completed",   tProgress:100, score:80,  completedOn:"Feb 22, 2026" },
    { id:8, tStatus:"in-progress", tProgress:30,  score:null,completedOn:null           },
  ],
  5: [ // Meera Patel
    { id:1, tStatus:"completed",   tProgress:100, score:91,  completedOn:"Mar 3, 2026"  },
    { id:2, tStatus:"completed",   tProgress:100, score:85,  completedOn:"Feb 28, 2026" },
    { id:3, tStatus:"completed",   tProgress:100, score:88,  completedOn:"Mar 5, 2026"  },
    { id:5, tStatus:"completed",   tProgress:100, score:92,  completedOn:"Mar 1, 2026"  },
    { id:6, tStatus:"completed",   tProgress:100, score:86,  completedOn:"Mar 6, 2026"  },
    { id:7, tStatus:"completed",   tProgress:100, score:89,  completedOn:"Feb 20, 2026" },
  ],
  6: [ // Arjun Kapoor
    { id:1, tStatus:"not-started", tProgress:0,   score:null,completedOn:null           },
    { id:5, tStatus:"not-started", tProgress:0,   score:null,completedOn:null           },
  ],
  7: [ // Sneha Joshi
    { id:1, tStatus:"completed",   tProgress:100, score:82,  completedOn:"Mar 4, 2026"  },
    { id:2, tStatus:"completed",   tProgress:100, score:79,  completedOn:"Mar 1, 2026"  },
    { id:3, tStatus:"in-progress", tProgress:55,  score:null,completedOn:null           },
    { id:7, tStatus:"completed",   tProgress:100, score:76,  completedOn:"Feb 25, 2026" },
  ],
  8: [ // Rohit Das
    { id:1, tStatus:"completed",   tProgress:100, score:65,  completedOn:"Mar 3, 2026"  },
    { id:4, tStatus:"in-progress", tProgress:20,  score:null,completedOn:null           },
    { id:7, tStatus:"not-started", tProgress:0,   score:null,completedOn:null           },
  ],
};

function EmployeeTrainingsModal({ emp, onClose }) {
  const empTrainings = EMP_TRAININGS[emp.id] || [];
  const dC = deptColors[emp.dept] || deptColors.default;
  const completed = empTrainings.filter(t => t.tStatus === "completed").length;
  const inProgress = empTrainings.filter(t => t.tStatus === "in-progress").length;
  const notStarted = empTrainings.filter(t => t.tStatus === "not-started").length;
  const avgScore = empTrainings.filter(t=>t.score).length
    ? Math.round(empTrainings.filter(t=>t.score).reduce((s,t)=>s+t.score,0) / empTrainings.filter(t=>t.score).length)
    : null;

  return (
    // Backdrop
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.55)", zIndex:100, display:"flex", alignItems:"flex-start", justifyContent:"flex-end", backdropFilter:"blur(3px)" }}>
      {/* Drawer */}
      <div onClick={e=>e.stopPropagation()}
        style={{ width:520, height:"100vh", background:"#fff", boxShadow:"-8px 0 40px rgba(0,0,0,0.18)", display:"flex", flexDirection:"column", animation:"slideIn 0.25s ease" }}>
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:none}}`}</style>

        {/* Header */}
        <div style={{ background:"#fff", padding:"18px 24px", flexShrink:0, borderBottom:"1px solid #e9ecef" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <Avatar initials={emp.initials} size={48} bg="#4361ee" color="#fff" fontSize={16}/>
              <div>
                <div style={{ color:"#1a2035", fontWeight:700, fontSize:18 }}>{emp.name}</div>
                <div style={{ display:"flex", gap:6, marginTop:4 }}>
                  <Badge color="#4361ee" size={10}>{emp.dept}</Badge>
                  <Badge color="#6c757d" size={10}>{emp.role}</Badge>
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background:"#f0f2f5", border:"1px solid #e9ecef", color:"#6c757d", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>

          {/* KPI row */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
            {[
              ["Total",       empTrainings.length, "#4361ee", "#eef2ff"],
              ["Completed",   completed,           "#1abc9c", "#d4f3ec"],
              ["In Progress", inProgress,          "#f7b731", "#fef6e4"],
              ["Avg Score",   avgScore ? avgScore+"%" : "—", "#6c5dd3", "#ede9fb"],
            ].map(([label,val,c,bg])=>(
              <div key={label} style={{ background:bg, border:`1px solid ${c}22`, borderLeft:`3px solid ${c}`, borderRadius:4, padding:"10px 8px", textAlign:"center" }}>
                <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:20, color:c, lineHeight:1, fontWeight:800 }}>{val}</div>
                <div style={{ fontSize:10, color:"#6c757d", marginTop:3, fontWeight:600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Training list */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#98a6ad", letterSpacing:"0.08em", marginBottom:12 }}>
            ASSIGNED TRAININGS ({empTrainings.length})
          </div>

          {empTrainings.length === 0 ? (
            <div style={{ textAlign:"center", padding:"48px 0", color:"#98a6ad" }}>
              <div style={{ fontSize:40, marginBottom:10 }}>📭</div>
              <div style={{ fontSize:14 }}>Koi training assign nahi hui abhi</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {empTrainings.map((et, i) => {
                const tr = TRAININGS.find(t => t.id === et.id);
                if(!tr) return null;
                const tt = TRAINING_TYPES.find(x => x.id === tr.type);
                const isCompleted = et.tStatus === "completed" && et.tProgress === 100;
                const passed = et.score && et.score >= 70;

                return (
                  <div key={i} style={{ borderRadius:4, border:`1.5px solid ${isCompleted?"#BBF7D0":et.tStatus==="in-progress"?"#BFDBFE":"#e9ecef"}`, background:isCompleted?"#F0FDF4":et.tStatus==="in-progress"?"#EFF6FF":"#fff", padding:"14px 16px" }}>
                    <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                      <TypeIcon type={tr.type} size={40}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        {/* Title + badges */}
                        <div style={{ fontWeight:700, fontSize:13, color:"#1a2035", marginBottom:6, lineHeight:1.3 }}>{tr.title}</div>
                        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
                          <Badge color={tt?.color||"#4361ee"} bg={tt?.bg||"#eef2ff"} size={10}>{tt?.icon} {tt?.label}</Badge>
                          <StatusBadge status={et.tStatus}/>
                          {tr.mandatory && <Badge color={"#f34943"} bg={"#fde8e7"} size={10}>MANDATORY</Badge>}
                        </div>

                        {/* Progress bar */}
                        <div style={{ marginBottom:8 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#98a6ad", marginBottom:4 }}>
                            <span>Progress</span>
                            <span style={{ fontWeight:700, color:isCompleted?"#1abc9c":"#4361ee" }}>{et.tProgress}%</span>
                          </div>
                          <ProgressBar pct={et.tProgress} color={isCompleted?"#1abc9c":"#4361ee"} height={5}/>
                        </div>

                        {/* Score row — only for completed */}
                        {isCompleted && (
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:4 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                                <span style={{ fontSize:11, color:"#98a6ad" }}>Score:</span>
                                <span style={{ fontSize:16, fontWeight:800, color:passed?"#1abc9c":"#f34943" }}>{et.score}%</span>
                                <span style={{ fontSize:11, fontWeight:700, color:passed?"#1abc9c":"#f34943" }}>{passed?"✅ Pass":"❌ Fail"}</span>
                              </div>
                            </div>
                            <span style={{ fontSize:10, color:"#98a6ad" }}>✓ {et.completedOn}</span>
                          </div>
                        )}

                        {/* Not started deadline nudge */}
                        {et.tStatus === "not-started" && (
                          <div style={{ fontSize:11, color:"#f34943", fontWeight:600 }}>📅 Due: Apr 30, 2026 — Not started yet</div>
                        )}

                        {/* In progress: slide info */}
                        {et.tStatus === "in-progress" && (
                          <div style={{ fontSize:11, color:"#4361ee", fontWeight:600 }}>📖 In progress — {et.tProgress}% complete</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:"14px 20px", borderTop:"1px solid #F1F5F9", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div style={{ fontSize:12, color:"#98a6ad" }}>{completed} of {empTrainings.length} completed</div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn variant="white" size="sm" onClick={onClose}>Close</Btn>
            <Btn size="sm" onClick={()=>{ onClose(); }}>📚 Assign New Training</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmployeeList({ onAssign }) {
  const [viewEmp, setViewEmp] = useState(null);
  const [empSearch, setEmpSearch] = useState("");
  const [empDept, setEmpDept] = useState("All Departments");
  const [empToast, setEmpToast] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const showToast = (msg) => { setEmpToast(msg); setTimeout(()=>setEmpToast(null),3000); };

  const filteredEmps = EMPLOYEES.filter(e=>{
    const matchSearch = !empSearch || e.name.toLowerCase().includes(empSearch.toLowerCase()) || e.dept.toLowerCase().includes(empSearch.toLowerCase());
    const matchDept = empDept==="All Departments" || e.dept===empDept;
    return matchSearch && matchDept;
  });

  return (
    <div className="fadeUp">
      {empToast && <div style={{ position:"fixed", bottom:24, right:24, background:"#1a2035", color:"#fff", padding:"12px 20px", borderRadius:4, fontSize:13, fontWeight:600, zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"fadeUp 0.3s ease" }}>{empToast}</div>}
      {viewEmp && <EmployeeTrainingsModal emp={viewEmp} onClose={()=>setViewEmp(null)}/>}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div onClick={()=>setShowAddModal(false)} style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.5)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:4, padding:32, maxWidth:480, width:"100%", margin:24, boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:18, color:"#1a2035", fontWeight:700, marginBottom:20 }}>+ Add New Employee</div>
            {[["Full Name","e.g. Rahul Sharma"],["Email","rahul@company.com"],["Department","HR / Sales / Tech..."],["Designation","Role / Job Title"]].map(([label,ph])=>(
              <div key={label} style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:600, color:"#6c757d", display:"block", marginBottom:5 }}>{label}</label>
                <input placeholder={ph} style={{ width:"100%", padding:"9px 12px", borderRadius:4, border:"1.5px solid #E2E8F0", fontSize:13, boxSizing:"border-box" }}/>
              </div>
            ))}
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:20 }}>
              <Btn variant="white" onClick={()=>setShowAddModal(false)}>Cancel</Btn>
              <Btn onClick={()=>{ setShowAddModal(false); showToast("✅ Employee added & invitation sent!"); }}>Add Employee</Btn>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:13 }}>🔍</span>
            <input value={empSearch} onChange={e=>setEmpSearch(e.target.value)} placeholder="Search employees..." style={{ paddingLeft:32, paddingRight:12, paddingTop:8, paddingBottom:8, borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:13, width:200 }}/>
          </div>
          <select value={empDept} onChange={e=>setEmpDept(e.target.value)} style={{ padding:"8px 14px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:13, color:"#6c757d" }}>
            <option>All Departments</option>
            {["HR","Sales","Tech","Finance","Operations"].map(d=><option key={d}>{d}</option>)}
          </select>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <Btn variant="white" size="sm" onClick={()=>showToast("📋 CSV template downloaded!")}>⬆ Import CSV</Btn>
          <Btn size="sm" onClick={()=>setShowAddModal(true)}>+ Add Employee</Btn>
        </div>
      </div>
      <Card>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:"2px solid #F1F5F9" }}>
              {["Employee","Department","Role","Trainings","Avg Score","Status","Actions"].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"10px 16px", fontSize:11, color:"#98a6ad", fontWeight:700, letterSpacing:"0.06em" }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredEmps.map((e,i)=>{
              const dC = deptColors[e.dept]||deptColors.default;
              return (
                <tr key={i} style={{ borderBottom:"1px solid #F8FAFC" }}>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Avatar initials={e.initials} size={36} bg={"#eef2ff"} color={"#4361ee"} fontSize={13}/>
                      <div>
                        <div style={{ fontWeight:600, fontSize:13, color:"#1a2035" }}>{e.name}</div>
                        <div style={{ fontSize:11, color:"#98a6ad" }}>Reports to: {e.manager}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:"12px 16px" }}><Badge color={dC} bg={dC+"18"}>{e.dept}</Badge></td>
                  <td style={{ padding:"12px 16px", fontSize:13, color:"#6c757d" }}>{e.role}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ fontSize:13, color:"#1a2035" }}>{e.completed}/{e.assigned}</div>
                    <ProgressBar pct={e.completed/e.assigned*100} height={4}/>
                  </td>
                  <td style={{ padding:"12px 16px", fontWeight:700, color:e.avgScore?(e.avgScore>=70?"#1abc9c":"#f34943"):"#98a6ad", fontSize:13 }}>
                    {e.avgScore?`${e.avgScore}%`:"—"}
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <Badge color={e.status==="active"?"#1abc9c":"#6c757d"} bg={e.status==="active"?"#d4f3ec":"#f0f2f5"}>{e.status==="active"?"● Active":"○ Inactive"}</Badge>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={()=>setViewEmp(e)} title="View" style={{ width:32, height:32, border:"none", background:"#4fc6e1", color:"#fff", borderRadius:4, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>◉</button>
                      <button title="Edit" style={{ width:32, height:32, border:"none", background:"#4361ee", color:"#fff", borderRadius:4, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>✎</button>
                      <button title="Delete" style={{ width:32, height:32, border:"none", background:"#f34943", color:"#fff", borderRadius:4, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>✕</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OVERALL LEADERBOARD
═══════════════════════════════════════════════════════════════ */
function OverallLeaderboard() {
  const [sortBy, setSortBy] = useState("points");
  const [filterDept, setFilterDept] = useState("All");
  const [lbToast, setLbToast] = useState(null);
  const showToast = (msg) => { setLbToast(msg); setTimeout(()=>setLbToast(null),3000); };

  // Build leaderboard data from EMP_TRAININGS
  const leaderboardData = EMPLOYEES.map(emp => {
    const empT = EMP_TRAININGS[emp.id] || [];
    const completed = empT.filter(t=>t.tStatus==="completed").length;
    const scores = empT.filter(t=>t.score).map(t=>t.score);
    const avgScore = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
    const totalPoints = scores.reduce((sum,s)=>{
      if(s>=90) return sum+150;
      if(s>=80) return sum+120;
      if(s>=70) return sum+100;
      return sum+50;
    }, 0);
    const badges = [];
    if(completed>=5) badges.push("⭐");
    if(avgScore>=90) badges.push("💯");
    if(completed>=3) badges.push("🔥");
    badges.push("🚀");
    return { emp, completed, avgScore, totalPoints, badges: badges.slice(0,3), totalTrainings: empT.length };
  });

  const sorted = [...leaderboardData].filter(d=>filterDept==="All"||d.emp.dept===filterDept)
    .sort((a,b)=> sortBy==="points"? b.totalPoints-a.totalPoints : sortBy==="score" ? b.avgScore-a.avgScore : b.completed-a.completed);

  const top3 = sorted.slice(0,3);
  const podiumOrder = top3.length>=3 ? [top3[1],top3[0],top3[2]] : top3;

  return (
    <div className="fadeUp">
      {lbToast && <div style={{ position:"fixed", bottom:24, right:24, background:"#1a2035", color:"#fff", padding:"12px 20px", borderRadius:4, fontSize:13, fontWeight:600, zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"fadeUp 0.3s ease" }}>{lbToast}</div>}

      {/* Header */}
      <div style={{ background:"#fff", borderRadius:4, padding:"18px 24px", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between", border:"1px solid #e9ecef", borderLeft:"4px solid #4361ee" }}>
        <div>
          <div style={{ color:"#98a6ad", fontSize:11, fontWeight:700, letterSpacing:"0.1em", marginBottom:4 }}>OVERALL PLATFORM LEADERBOARD</div>
          <div style={{ fontFamily:"'Nunito',sans-serif", color:"#1a2035", fontSize:22, fontWeight:800 }}>Employee Rankings</div>
          <div style={{ color:"#6c757d", fontSize:13, marginTop:3 }}>Sab trainings ke across — points, score aur completions ke basis pe ranked</div>
        </div>
        <Btn size="sm" onClick={()=>showToast("Leaderboard exported!")}>Export</Btn>
      </div>

      {/* Filters + Sort */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div style={{ display:"flex", gap:8 }}>
          {["All","HR","Sales","Tech","Finance","Operations"].map(d=>(
            <button key={d} onClick={()=>setFilterDept(d)} style={{ padding:"6px 16px", borderRadius:100, border:`1.5px solid ${filterDept===d?"#4361ee":"#e9ecef"}`, background:filterDept===d?"#eef2ff":"#fff", color:filterDept===d?"#4361ee":"#6c757d", fontSize:12, fontWeight:600, cursor:"pointer" }}>{d}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:12, color:"#98a6ad" }}>Sort by:</span>
          {[["points","⭐ Points"],["score","📊 Avg Score"],["completed","✅ Completed"]].map(([id,label])=>(
            <button key={id} onClick={()=>setSortBy(id)} style={{ padding:"6px 14px", borderRadius:4, border:`1px solid ${sortBy===id?"#4361ee":"#e9ecef"}`, background:sortBy===id?"#eef2ff":"#fff", color:sortBy===id?"#4361ee":"#6c757d", fontSize:12, fontWeight:600, cursor:"pointer" }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Podium */}
      {sorted.length >= 3 && (
        <Card style={{ padding:"28px 24px", marginBottom:24 }}>
          <div style={{ fontWeight:700, fontSize:15, color:"#1a2035", marginBottom:24, textAlign:"center" }}>🏅 Top Performers</div>
          <div style={{ display:"flex", gap:16, justifyContent:"center", alignItems:"flex-end" }}>
            {podiumOrder.map((d,pi)=>{
              const medals = ["🥈","🥇","🥉"];
              const heights = [110, 140, 90];
              const borders = ["#A8A8A8","#F59E0B","#CD7F32"];
              const bgs = ["#9ca3af","#f7b731","#a0784a"];
              return (
                <div key={d.emp.id} style={{ textAlign:"center", flex:1, maxWidth:200 }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>{medals[pi]}</div>
                  <div style={{ width:52, height:52, borderRadius:"50%", background:"#eef2ff", border:`3px solid ${borders[pi]}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:16, color:"#4361ee", margin:"0 auto 8px" }}>{d.emp.initials}</div>
                  <div style={{ fontWeight:700, fontSize:13, color:"#1a2035" }}>{d.emp.name}</div>
                  <div style={{ fontSize:11, color:"#98a6ad", marginBottom:10 }}>{d.emp.dept}</div>
                  <div style={{ height:heights[pi], background:bgs[pi], borderRadius:"12px 12px 0 0", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4 }}>
                    <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:24, color:"#fff" }}>⭐ {d.totalPoints}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.85)" }}>Avg: {d.avgScore}%</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.65)" }}>✅ {d.completed} done</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Full Rankings Table */}
      <Card>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid #F1F5F9", fontWeight:700, color:"#1a2035" }}>
          Full Rankings ({sorted.length} employees)
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:"2px solid #F1F5F9" }}>
              {["Rank","Employee","Department","Trainings Done","Avg Score","Total Points","Badges"].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"10px 16px", fontSize:11, color:"#98a6ad", fontWeight:700, letterSpacing:"0.05em" }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((d,i)=>{
              const rank = i+1;
              const dC = deptColors[d.emp.dept]||deptColors.default;
              const rankBg = rank===1?"#fef6e4":rank===2?"#f0f2f5":rank===3?"#FEF3E7":"transparent";
              const rankColor = rank===1?"#f7b731":rank===2?"#64748B":rank===3?"#B45309":"#6c757d";
              return (
                <tr key={d.emp.id} style={{ borderBottom:"1px solid #F8FAFC", background:rank<=3?"#FFFBEB":"#fff" }}>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, background:rankBg, color:rankColor }}>
                      {rank===1?"🥇":rank===2?"🥈":rank===3?"🥉":rank}
                    </div>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Avatar initials={d.emp.initials} size={36} bg={"#eef2ff"} color={"#4361ee"} fontSize={12}/>
                      <div>
                        <div style={{ fontWeight:600, fontSize:13, color:"#1a2035" }}>{d.emp.name}</div>
                        <div style={{ fontSize:11, color:"#98a6ad" }}>{d.emp.role}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:"12px 16px" }}><Badge color={dC} bg={dC+"18"} size={11}>{d.emp.dept}</Badge></td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ flex:1, maxWidth:80 }}><ProgressBar pct={d.completed/d.totalTrainings*100||0} height={5}/></div>
                      <span style={{ fontSize:13, fontWeight:700, color:"#1a2035" }}>{d.completed}/{d.totalTrainings}</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ fontWeight:800, fontSize:15, color:d.avgScore>=80?"#1abc9c":d.avgScore>=70?"#f7b731":"#f34943" }}>{d.avgScore>0?d.avgScore+"%":"—"}</span>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ fontWeight:700, fontSize:14, color:"#f7b731" }}>⭐ {d.totalPoints}</span>
                  </td>
                  <td style={{ padding:"12px 16px", fontSize:18, letterSpacing:2 }}>{d.badges.join(" ")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Reports() {
  const [repToast, setRepToast] = useState(null);
  const showToast = (msg) => { setRepToast(msg); setTimeout(()=>setRepToast(null),3000); };
  return (
    <div className="fadeUp">
      {repToast && <div style={{ position:"fixed", bottom:24, right:24, background:"#1a2035", color:"#fff", padding:"12px 20px", borderRadius:4, fontSize:13, fontWeight:600, zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"fadeUp 0.3s ease" }}>{repToast}</div>}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:24, color:"#1a2035", fontWeight:400 }}>Analytics & Reports</div>
        <div style={{ display:"flex", gap:8 }}>
          <Btn variant="white" size="sm" onClick={()=>showToast("📊 Report exported as PDF!")}>⬇ Export PDF</Btn>
          <Btn variant="white" size="sm" onClick={()=>showToast("📧 Report emailed to admin@company.com!")}>📧 Email Report</Btn>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {[["Total Hours Trained","1,284 hrs","⏱","#4361ee"],["Org Completion Rate","74%","📊","#1abc9c"],["Compliance Done","92%","⚖️","#f7b731"],["Certificates Issued","143","🏆","#4361ee"]].map(([l,v,ic,c])=>(
          <Card key={l} style={{ padding:18, textAlign:"center" }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{ic}</div>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:30, color:c, letterSpacing:"-1px" }}>{v}</div>
            <div style={{ fontSize:12, color:"#98a6ad", marginTop:3 }}>{l}</div>
          </Card>
        ))}
      </div>
      <Card style={{ padding:24 }}>
        <div style={{ fontWeight:700, fontSize:15, color:"#1a2035", marginBottom:16 }}>Training Completion by Department</div>
        {["HR","Sales","Tech","Finance","Operations"].map((dept,i)=>{
          const pct = [92,64,88,76,71][i];
          return (
            <div key={dept} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
              <div style={{ width:90, fontSize:13, color:"#6c757d", fontWeight:500, textAlign:"right" }}>{dept}</div>
              <div style={{ flex:1 }}><ProgressBar pct={pct} color={pct>=80?"#1abc9c":"#4361ee"} height={10}/></div>
              <div style={{ width:40, fontSize:13, fontWeight:700, color:pct>=80?"#1abc9c":"#f7b731" }}>{pct}%</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function SettingsPage() {
  const [activeModal, setActiveModal] = useState(null);
  const [settingsToast, setSettingsToast] = useState(null);
  const showToast = (msg) => { setSettingsToast(msg); setTimeout(()=>setSettingsToast(null),3000); };

  const settingSections = {
    "🏢 Organisation Profile": {
      desc:"Company name, logo, timezone",
      fields:[["Company Name","LearnFlow Pvt Ltd"],["Timezone","Asia/Kolkata (IST)"],["Industry","HR & Training"],["Website","www.learnflow.in"]]
    },
    "🔔 Default Notifications": {
      desc:"Global notification settings",
      fields:[["Assignment Email","Enabled"],["Deadline Reminder","3 days before"],["Completion Email","Enabled"],["Weekly Summary","Every Monday"]]
    },
    "👥 Role Management": {
      desc:"Admin, Manager roles assign karo",
      fields:[["Super Admin","Neha Agarwal"],["HR Admin","Priya Sharma"],["Manager","Vikram Joshi"],["Viewer","Sunita Rao"]]
    },
    "🎨 Certificate Template": {
      desc:"Certificate ka design customize karo",
      fields:[["Template Style","Professional Blue"],["Signature Name","Neha Agarwal, HR Head"],["Logo Position","Top Center"],["Validity","Permanent"]]
    },
    "🔗 Integrations": {
      desc:"HRMS, Slack, Email integrations",
      fields:[["HRMS","Keka HR — Connected ✅"],["Email","Gmail SMTP — Connected ✅"],["Slack","Slack Workspace — Not configured"],["SSO","Google SSO — Connected ✅"]]
    },
  };

  return (
    <div className="fadeUp">
      {settingsToast && <div style={{ position:"fixed", bottom:24, right:24, background:"#1a2035", color:"#fff", padding:"12px 20px", borderRadius:4, fontSize:13, fontWeight:600, zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"fadeUp 0.3s ease" }}>{settingsToast}</div>}

      {/* Settings Modal */}
      {activeModal && (
        <div onClick={()=>setActiveModal(null)} style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.5)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:4, padding:32, maxWidth:480, width:"100%", margin:24, boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:18, color:"#1a2035", fontWeight:700, marginBottom:4 }}>{activeModal}</div>
            <div style={{ fontSize:13, color:"#98a6ad", marginBottom:24 }}>{settingSections[activeModal]?.desc}</div>
            {settingSections[activeModal]?.fields.map(([label,val])=>(
              <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid #F1F5F9" }}>
                <span style={{ fontSize:13, color:"#6c757d", fontWeight:500 }}>{label}</span>
                <span style={{ fontSize:13, fontWeight:700, color:"#1a2035" }}>{val}</span>
              </div>
            ))}
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:24 }}>
              <Btn variant="white" onClick={()=>setActiveModal(null)}>Cancel</Btn>
              <Btn onClick={()=>{ setActiveModal(null); showToast("✅ Settings saved successfully!"); }}>Save Changes</Btn>
            </div>
          </div>
        </div>
      )}

      <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:24, color:"#1a2035", marginBottom:20, fontWeight:400 }}>Settings</div>
      <div style={{ display:"grid", gap:16 }}>
        {Object.entries(settingSections).map(([title,data])=>(
          <Card key={title} style={{ padding:20, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:"#1a2035" }}>{title}</div>
              <div style={{ fontSize:12, color:"#98a6ad", marginTop:3 }}>{data.desc}</div>
            </div>
            <button onClick={()=>setActiveModal(title)} style={{ border:"1px solid #E2E8F0", background:"#fff", padding:"6px 16px", borderRadius:4, fontSize:13, cursor:"pointer", color:"#6c757d" }}>Configure →</button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EMPLOYEE PANEL
═══════════════════════════════════════════════════════════════ */
function EmployeePanel({ onExit }) {
  const [nav, setNav] = useState("dashboard");
  const [activeTraining, setActiveTraining] = useState(null);
  const [trainingPhase, setTrainingPhase] = useState("landing"); // landing|room|assessment|result

  const myTrainings = [
    { ...TRAININGS[0], myStatus:"in-progress", myPct:40, mySlide:2 },
    { ...TRAININGS[4], myStatus:"not-started",  myPct:0,  mySlide:0 },
    { ...TRAININGS[2], myStatus:"completed",    myPct:100,mySlide:5, myScore:84 },
    { ...TRAININGS[6], myStatus:"completed",    myPct:100,mySlide:5, myScore:91 },
  ];

  const startTraining = (t) => { setActiveTraining({...t,...myTrainings.find(x=>x.id===t.id)}); setTrainingPhase("landing"); setNav("training"); };

  if(nav==="training" && activeTraining) {
    if(trainingPhase==="landing") return <><Sty/><TrainingLanding training={activeTraining} onStart={()=>setTrainingPhase("room")} onExit={()=>setNav("my-trainings")}/></>;
    if(trainingPhase==="room")    return <><Sty/><TrainingRoom training={activeTraining} onAssessment={()=>setTrainingPhase("assessment")} onExit={()=>setNav("my-trainings")}/></>;
    if(trainingPhase==="assessment") return <><Sty/><AssessmentScreen training={activeTraining} onDone={score=>{ setActiveTraining({...activeTraining,finalScore:score}); setTrainingPhase("result"); }}/></>;
    if(trainingPhase==="result") return <><Sty/><ResultScreen training={activeTraining} onDone={()=>setNav("my-trainings")}/></>;
  }

  return (
    <div style={{ minHeight:"100vh", background:"#f0f2f5", fontFamily:"'Nunito',sans-serif" }}>
      <Sty/>
      {/* Navbar */}
      <nav style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60, position:"sticky", top:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:22 }}>🤖</span>
          <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:20, color:"#1a2035" }}>LearnFlow</span>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[["dashboard","Dashboard"],["my-trainings","My Trainings"],["my-reports","My Reports"]].map(([id,label])=>(
            <button key={id} onClick={()=>setNav(id)} style={{ padding:"6px 16px", borderRadius:4, border:"none", background:nav===id?"#eef2ff":"transparent", color:nav===id?"#4361ee":"#6c757d", fontWeight:nav===id?700:400, fontSize:13, cursor:"pointer" }}>{label}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Avatar initials="RS" size={34} bg={"#eef2ff"} color={"#4361ee"}/>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:"#1a2035" }}>Rahul Sharma</div>
            <div style={{ fontSize:11, color:"#98a6ad" }}>Sales Executive</div>
          </div>
          <button onClick={onExit} style={{ border:"none", background:"none", color:"#98a6ad", fontSize:12, cursor:"pointer", marginLeft:8 }}>Exit</button>
        </div>
      </nav>

      <div style={{ padding:28 }}>
        {nav==="dashboard" && <EmpDashboard myTrainings={myTrainings} onStart={startTraining}/>}
        {nav==="my-trainings" && <EmpTrainings myTrainings={myTrainings} onStart={startTraining}/>}
        {nav==="my-reports" && <EmpReports/>}
      </div>
    </div>
  );
}

function EmpDashboard({ myTrainings, onStart }) {
  const pending = myTrainings.filter(t=>t.myStatus!=="completed");
  const mandatory = myTrainings.filter(t=>t.mandatory && t.myStatus!=="completed");
  return (
    <div className="fadeUp">
      {/* Welcome banner */}
      <div style={{ background:"#4361ee", borderRadius:4, padding:"24px 28px", color:"#fff", marginBottom:24 }}>
        <div style={{ position:"absolute", right:24, top:"50%", transform:"translateY(-50%)", fontSize:90, opacity:0.08 }}>🎓</div>
        <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:28, fontWeight:400, marginBottom:4 }}>Good morning, Rahul! 👋</div>
        <div style={{ color:"rgba(255,255,255,0.7)", fontSize:15, marginBottom:20 }}>
          {pending.length} training{pending.length!==1?"s":""} pending. {mandatory.length>0?`${mandatory.length} mandatory!`:"Keep up the great work!"}
        </div>
        {mandatory.length>0 && (
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>onStart(mandatory[0])} style={{ background:"#fff", color:"#4361ee", border:"none", padding:"10px 22px", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer" }}>Start Mandatory Training →</button>
          </div>
        )}
        {/* Streak */}
        <div style={{ position:"absolute", top:20, right:24, background:"rgba(255,255,255,0.15)", borderRadius:10, padding:"8px 14px", textAlign:"center", backdropFilter:"blur(8px)" }}>
          <div style={{ fontSize:22 }}>🔥</div>
          <div style={{ color:"#fff", fontSize:18, fontWeight:800 }}>5</div>
          <div style={{ color:"rgba(255,255,255,0.65)", fontSize:10 }}>Day streak</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {[["📚","Assigned",myTrainings.length,"#4361ee","#eef2ff"],["▶","In Progress",myTrainings.filter(t=>t.myStatus==="in-progress").length,"#4361ee","#eef2ff"],["✅","Completed",myTrainings.filter(t=>t.myStatus==="completed").length,"#1abc9c","#d4f3ec"],["🏆","Certificates",myTrainings.filter(t=>t.myStatus==="completed").length,"#f7b731","#fef6e4"]].map(([ic,l,v,c,bg])=>(
          <Card key={l} style={{ padding:18, textAlign:"center" }}>
            <div style={{ width:44, height:44, borderRadius:4, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, margin:"0 auto 10px" }}>{ic}</div>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:28, color:c, letterSpacing:"-0.5px" }}>{v}</div>
            <div style={{ fontSize:12, color:"#98a6ad", marginTop:2 }}>{l}</div>
          </Card>
        ))}
      </div>

      {/* In-progress + Mandatory */}
      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:20 }}>
        <Card style={{ padding:24 }}>
          <div style={{ fontWeight:700, color:"#1a2035", fontSize:15, marginBottom:16 }}>Continue Learning</div>
          {myTrainings.filter(t=>t.myStatus==="in-progress").map(t=>{
            const tt = TRAINING_TYPES.find(x=>x.id===t.type);
            return (
              <div key={t.id} style={{ display:"flex", gap:14, alignItems:"center", padding:"12px 0", borderBottom:"1px solid #F1F5F9" }}>
                <TypeIcon type={t.type} size={46}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:13, color:"#1a2035", marginBottom:2 }}>{t.title.substring(0,40)}...</div>
                  <div style={{ fontSize:11, color:"#98a6ad", marginBottom:8 }}>{tt?.label} • Slide {t.mySlide}/{t.slides}</div>
                  <ProgressBar pct={t.myPct}/>
                  <div style={{ fontSize:11, color:"#98a6ad", marginTop:4 }}>{t.myPct}% complete</div>
                </div>
                <Btn onClick={()=>onStart(t)} size="sm">Resume →</Btn>
              </div>
            );
          })}
        </Card>
        <Card style={{ padding:24 }}>
          <div style={{ fontWeight:700, color:"#1a2035", fontSize:15, marginBottom:16 }}>⚠️ Mandatory Pending</div>
          {myTrainings.filter(t=>t.mandatory && t.myStatus!=="completed").map(t=>{
            const tt = TRAINING_TYPES.find(x=>x.id===t.type);
            return (
              <div key={t.id} style={{ background:"#FEF2F2", border:"1.5px solid #FECACA", borderRadius:4, padding:"14px 16px", marginBottom:12 }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <TypeIcon type={t.type} size={38}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13, color:"#1a2035", marginBottom:3 }}>{t.title.substring(0,36)}...</div>
                    <div style={{ fontSize:11, color:"#f34943", fontWeight:600, marginBottom:10 }}>📅 Due: Apr 30, 2026</div>
                    <Btn onClick={()=>onStart(t)} size="sm" variant="danger" full>Start Now</Btn>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ background:"#fef6e4", border:"1px solid #FDE68A", borderRadius:4, padding:"12px 14px" }}>
            <div style={{ fontSize:12, color:"#f7b731", fontWeight:700 }}>🔔 Reminder</div>
            <div style={{ fontSize:12, color:"#92400E", marginTop:3 }}>Workplace Safety Training — 2 days left</div>
          </div>
        </Card>
      </div>

      {/* My Rewards & Badges */}
      <Card style={{ padding:24, marginTop:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <div>
            <div style={{ fontWeight:700, color:"#1a2035", fontSize:15 }}>🎖️ My Rewards & Badges</div>
            <div style={{ fontSize:12, color:"#98a6ad", marginTop:2 }}>Trainings complete karne pe earned kiye</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:28, color:"#f7b731" }}>⭐ 340</div>
            <div style={{ fontSize:11, color:"#98a6ad" }}>Total Points</div>
          </div>
        </div>

        {/* Points breakdown */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:18 }}>
          {[
            { icon:"⭐", label:"This Month",   pts:200, color:"#f7b731", bg:"#fef6e4" },
            { icon:"🏅", label:"Total Earned", pts:340, color:"#4361ee", bg:"#eef2ff" },
            { icon:"🥇", label:"Best Rank",    pts:"#1", color:"#1abc9c", bg:"#d4f3ec" },
            { icon:"🔥", label:"Day Streak",   pts:"5",  color:"#f34943", bg:"#fde8e7" },
          ].map(k=>(
            <div key={k.label} style={{ background:k.bg, borderRadius:4, padding:"12px 10px", textAlign:"center" }}>
              <div style={{ fontSize:22, marginBottom:4 }}>{k.icon}</div>
              <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:22, color:k.color }}>{k.pts}</div>
              <div style={{ fontSize:10, color:"#6c757d", marginTop:2 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div style={{ fontSize:11, fontWeight:700, color:"#98a6ad", letterSpacing:"0.08em", marginBottom:12 }}>BADGES EARNED</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[
            { icon:"🚀", label:"Fast Learner",   desc:"Top 10% time mein complete", earned:true  },
            { icon:"🔥", label:"On a Streak",    desc:"5 consecutive trainings",     earned:true  },
            { icon:"⭐", label:"Star Employee",  desc:"5+ trainings complete",       earned:true  },
            { icon:"💯", label:"Perfect Score",  desc:"100% assessment score",       earned:false },
            { icon:"🏆", label:"Top of Class",   desc:"Batch mein #1 rank",          earned:false },
            { icon:"📚", label:"Knowledge Guru", desc:"10+ trainings complete",      earned:false },
          ].map(b=>(
            <div key={b.label} style={{ borderRadius:4, border:`1.5px solid ${b.earned?"#FDE68A":"#e9ecef"}`, background:b.earned?"#FFFBEB":"#f0f2f5", padding:"12px 16px", textAlign:"center", minWidth:110, opacity:b.earned?1:0.5, position:"relative" }}>
              <div style={{ fontSize:26, marginBottom:6, filter:b.earned?"none":"grayscale(1)" }}>{b.icon}</div>
              <div style={{ fontSize:12, fontWeight:700, color:b.earned?"#92400E":"#6c757d" }}>{b.label}</div>
              <div style={{ fontSize:10, color:"#98a6ad", marginTop:2, lineHeight:1.3 }}>{b.desc}</div>
              {!b.earned && <div style={{ position:"absolute", inset:0, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:16 }}>🔒</span></div>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function EmpTrainings({ myTrainings, onStart }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter,   setTypeFilter]   = useState("all");
  const [mandatoryFilter, setMandatoryFilter] = useState("all"); // all | mandatory | optional
  const [sortBy,       setSortBy]       = useState("default");   // default | deadline | score | progress
  const [search,       setSearch]       = useState("");

  // ── Certificate Modal ──
  const [certTraining, setCertTraining] = useState(null);

  // ── Extension Modal ──
  const [extTraining,  setExtTraining]  = useState(null);
  const [extStep,      setExtStep]      = useState(1);   // 1=reason, 2=confirm, 3=done
  const [extReason,    setExtReason]    = useState("");
  const [extDate,      setExtDate]      = useState("");
  const [extNote,      setExtNote]      = useState("");

  const openExt = (t) => { setExtTraining(t); setExtStep(1); setExtReason(""); setExtDate(""); setExtNote(""); };

  // ── Filtered + sorted list ──
  const counts = {
    all:        myTrainings.length,
    "not-started": myTrainings.filter(t=>t.myStatus==="not-started").length,
    "in-progress": myTrainings.filter(t=>t.myStatus==="in-progress").length,
    completed:  myTrainings.filter(t=>t.myStatus==="completed").length,
  };

  let filtered = myTrainings.filter(t=>{
    if(statusFilter!=="all" && t.myStatus!==statusFilter) return false;
    if(typeFilter!=="all"   && t.type!==typeFilter) return false;
    if(mandatoryFilter==="mandatory" && !t.mandatory) return false;
    if(mandatoryFilter==="optional"  && t.mandatory)  return false;
    if(search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if(sortBy==="deadline") filtered = [...filtered].sort((a,b)=>new Date(a.deadline||"9999")-new Date(b.deadline||"9999"));
  if(sortBy==="score")    filtered = [...filtered].sort((a,b)=>(b.myScore||0)-(a.myScore||0));
  if(sortBy==="progress") filtered = [...filtered].sort((a,b)=>b.myPct-a.myPct);

  const usedTypes = [...new Set(myTrainings.map(t=>t.type))];

  return (
    <div className="fadeUp">

      {/* ─── Certificate Modal ─── */}
      {certTraining && (
        <div onClick={()=>setCertTraining(null)} style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.6)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:4, maxWidth:560, width:"100%", margin:24, boxShadow:"0 24px 80px rgba(0,0,0,0.25)", overflow:"hidden" }}>
            {/* Certificate display */}
            <div style={{ background:"#4361ee", padding:"28px 40px", textAlign:"center" }}>
              <div style={{ display: "none" }}> </div>
              <div style={{ fontSize:52, marginBottom:10 }}>🏆</div>
              <div style={{ color:"rgba(255,255,255,0.6)", fontSize:11, letterSpacing:"0.2em", fontWeight:700, marginBottom:6 }}>CERTIFICATE OF COMPLETION</div>
              <div style={{ fontFamily:"'Nunito',sans-serif", color:"#fff", fontSize:13, marginBottom:16, opacity:0.7 }}>This is to certify that</div>
              <div style={{ fontFamily:"'Nunito',sans-serif", color:"#FCD34D", fontSize:28, fontWeight:800, marginBottom:8, letterSpacing:"-0.5px" }}>Rahul Sharma</div>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:13, marginBottom:12 }}>has successfully completed</div>
              <div style={{ fontFamily:"'Nunito',sans-serif", color:"#fff", fontSize:18, fontWeight:700, maxWidth:360, margin:"0 auto 16px", lineHeight:1.4 }}>{certTraining.title}</div>
              <div style={{ display:"flex", justifyContent:"center", gap:24, color:"rgba(255,255,255,0.6)", fontSize:12 }}>
                <span>⭐ Score: {certTraining.myScore}%</span>
                <span>•</span>
                <span>📅 Completed: Mar 5, 2026</span>
                <span>•</span>
                <span>✅ {certTraining.myScore>=70?"PASSED":""}</span>
              </div>
              <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.15)", display:"flex", justifyContent:"center", gap:40 }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ borderTop:"1px solid rgba(255,255,255,0.4)", paddingTop:6, color:"rgba(255,255,255,0.55)", fontSize:10 }}>Neha Agarwal — HR Head</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ color:"rgba(255,255,255,0.4)", fontSize:18, marginBottom:2 }}>🤖</div>
                  <div style={{ borderTop:"1px solid rgba(255,255,255,0.4)", paddingTop:6, color:"rgba(255,255,255,0.55)", fontSize:10 }}>LearnFlow Platform</div>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div style={{ padding:"20px 32px", display:"flex", gap:10, justifyContent:"flex-end", borderTop:"1px solid #F1F5F9" }}>
              <Btn variant="white" onClick={()=>setCertTraining(null)}>Close</Btn>
              <Btn variant="white" onClick={()=>alert("🖨 Certificate sent to printer!")}>🖨 Print</Btn>
              <Btn onClick={()=>{ setCertTraining(null); alert("✅ Certificate downloaded as PDF!"); }}>⬇ Download PDF</Btn>
            </div>
          </div>
        </div>
      )}

      {/* ─── Extension Request Modal ─── */}
      {extTraining && (
        <div onClick={()=>setExtTraining(null)} style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.55)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(5px)" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:4, maxWidth:480, width:"100%", margin:24, boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>

            {/* Header */}
            <div style={{ background:"#fef6e4", padding:"16px 22px", borderBottom:"1px solid #fde68a", borderRadius:"4px 4px 0 0" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:26 }}>⏱</span>
                <div>
                  <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:17, color:"#1a2035" }}>Deadline Extension Request</div>
                  <div style={{ fontSize:12, color:"#98a6ad", marginTop:2 }}>{extTraining.title.substring(0,50)}...</div>
                </div>
              </div>
              {/* Step indicator */}
              <div style={{ display:"flex", gap:6, marginTop:16, alignItems:"center" }}>
                {[1,2,3].map(s=>(
                  <div key={s} style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:12,
                      background:extStep>s?"#10B981":extStep===s?"#F59E0B":"#e9ecef",
                      color:extStep>=s?"#fff":"#6c757d" }}>
                      {extStep>s?"✓":s}
                    </div>
                    <span style={{ fontSize:11, color:extStep===s?"#f7b731":"#98a6ad", fontWeight:extStep===s?700:400 }}>
                      {["Reason","New Date","Confirm"][s-1]}
                    </span>
                    {s<3 && <div style={{ width:24, height:2, background:extStep>s?"#10B981":"#e9ecef" }}/>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding:"24px 28px" }}>

              {/* Step 1: Reason */}
              {extStep===1 && (
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1a2035", marginBottom:12 }}>Extension kyun chahiye? *</div>
                  <div style={{ display:"grid", gap:8, marginBottom:16 }}>
                    {["Workload zyada tha — time nahi mila","Health issue ki wajah se complete nahi hua","Training material samajhne mein time laga","Project deadline clash ho gayi","Personal emergency aa gayi","Kuch aur wajah hai"].map(r=>(
                      <div key={r} onClick={()=>setExtReason(r)}
                        style={{ padding:"11px 14px", borderRadius:10, border:`1.5px solid ${extReason===r?"#F59E0B":"#e9ecef"}`, background:extReason===r?"#FFFBEB":"#fff", cursor:"pointer", fontSize:13, color:extReason===r?"#92400E":"#6c757d", fontWeight:extReason===r?600:400, transition:"all 0.12s" }}>
                        {extReason===r ? "● " : "○ "}{r}
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
                    <Btn variant="white" onClick={()=>setExtTraining(null)}>Cancel</Btn>
                    <Btn disabled={!extReason} onClick={()=>setExtStep(2)}>Next →</Btn>
                  </div>
                </div>
              )}

              {/* Step 2: New Date */}
              {extStep===2 && (
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1a2035", marginBottom:4 }}>Naya deadline date choose karo *</div>
                  <div style={{ fontSize:12, color:"#98a6ad", marginBottom:16 }}>Current deadline: <strong>Apr 30, 2026</strong></div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
                    {[["2026-05-15","May 15 (+15 days)"],["2026-05-31","May 31 (+31 days)"],["2026-06-15","Jun 15 (+46 days)"]].map(([d,label])=>(
                      <button key={d} onClick={()=>setExtDate(d)}
                        style={{ padding:"9px 16px", borderRadius:10, border:`1.5px solid ${extDate===d?"#F59E0B":"#e9ecef"}`, background:extDate===d?"#FFFBEB":"#fff", color:extDate===d?"#92400E":"#6c757d", fontSize:13, fontWeight:extDate===d?700:400, cursor:"pointer" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:"#6c757d", display:"block", marginBottom:6 }}>Ya custom date select karo</label>
                    <input type="date" value={extDate} onChange={e=>setExtDate(e.target.value)}
                      style={{ padding:"9px 12px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:13, color:"#1a2035" }}/>
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:"#6c757d", display:"block", marginBottom:6 }}>Additional note (optional)</label>
                    <textarea value={extNote} onChange={e=>setExtNote(e.target.value)} rows={2} placeholder="Manager ke liye koi extra detail..."
                      style={{ width:"100%", padding:"9px 12px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:13, resize:"none", fontFamily:"'Nunito',sans-serif", boxSizing:"border-box" }}/>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:10 }}>
                    <Btn variant="white" onClick={()=>setExtStep(1)}>← Back</Btn>
                    <Btn disabled={!extDate} onClick={()=>setExtStep(3)}>Review Request →</Btn>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {extStep===3 && (
                <div>
                  <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:4, padding:"16px 18px", marginBottom:16 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#1abc9c", marginBottom:10 }}>📋 Request Summary</div>
                    {[["Training", extTraining.title.substring(0,45)+"..."],["Current Deadline","Apr 30, 2026"],["Requested Deadline", new Date(extDate).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})],["Reason", extReason]].map(([l,v])=>(
                      <div key={l} style={{ display:"flex", gap:12, padding:"6px 0", borderBottom:"1px solid #D1FAE5", fontSize:13 }}>
                        <span style={{ color:"#98a6ad", minWidth:140 }}>{l}</span>
                        <span style={{ color:"#1a2035", fontWeight:600 }}>{v}</span>
                      </div>
                    ))}
                    {extNote && <div style={{ marginTop:8, fontSize:12, color:"#6c757d" }}>Note: {extNote}</div>}
                  </div>
                  <div style={{ background:"#fef6e4", border:"1px solid #FDE68A", borderRadius:10, padding:"10px 14px", fontSize:12, color:"#92400E", marginBottom:20 }}>
                    ℹ️ Yeh request aapke manager aur HR ko jaayegi. Approval milne pe naya deadline set ho jaayega.
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:10 }}>
                    <Btn variant="white" onClick={()=>setExtStep(2)}>← Back</Btn>
                    <Btn variant="success" onClick={()=>{ setExtTraining(null); alert(`✅ Extension request submitted!\n\nAapke manager ko notification send ho gayi. Approval milne par aapko email aayega.`); }}>✓ Submit Request</Btn>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Filter Bar ─── */}
      <div style={{ background:"#fff", border:"1px solid #E4E7EC", borderRadius:4, padding:"16px 20px", marginBottom:20, display:"flex", gap:16, flexWrap:"wrap", alignItems:"center", justifyContent:"space-between" }}>

        {/* Left: Search + Status */}
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          {/* Search */}
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:13 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search trainings..." style={{ paddingLeft:32, paddingRight:12, paddingTop:7, paddingBottom:7, borderRadius:4, border:"1.5px solid #E2E8F0", fontSize:13, width:190, color:"#1a2035" }}/>
          </div>

          {/* Status filter pills */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {[["all","All",counts.all],["not-started","Not Started",counts["not-started"]],["in-progress","In Progress",counts["in-progress"]],["completed","Completed",counts.completed]].map(([id,label,cnt])=>(
              <button key={id} onClick={()=>setStatusFilter(id)}
                style={{ padding:"5px 13px", borderRadius:100, border:`1.5px solid ${statusFilter===id?"#4361ee":"#e9ecef"}`, background:statusFilter===id?"#eef2ff":"#fff", color:statusFilter===id?"#4361ee":"#6c757d", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                {label} <span style={{ opacity:0.7 }}>({cnt})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Type + Mandatory + Sort */}
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          {/* Type filter */}
          <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}
            style={{ padding:"6px 12px", borderRadius:4, border:"1.5px solid #E2E8F0", fontSize:12, color:"#6c757d", background:"#fff", cursor:"pointer" }}>
            <option value="all">All Types</option>
            {usedTypes.map(tid=>{
              const tt = TRAINING_TYPES.find(x=>x.id===tid);
              return <option key={tid} value={tid}>{tt?.icon} {tt?.label}</option>;
            })}
          </select>

          {/* Mandatory filter */}
          <select value={mandatoryFilter} onChange={e=>setMandatoryFilter(e.target.value)}
            style={{ padding:"6px 12px", borderRadius:4, border:"1.5px solid #E2E8F0", fontSize:12, color:"#6c757d", background:"#fff", cursor:"pointer" }}>
            <option value="all">All Priority</option>
            <option value="mandatory">🔴 Mandatory Only</option>
            <option value="optional">🟢 Optional Only</option>
          </select>

          {/* Sort */}
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
            style={{ padding:"6px 12px", borderRadius:4, border:"1.5px solid #E2E8F0", fontSize:12, color:"#6c757d", background:"#fff", cursor:"pointer" }}>
            <option value="default">Sort: Default</option>
            <option value="deadline">Sort: Deadline ↑</option>
            <option value="progress">Sort: Progress ↓</option>
            <option value="score">Sort: Score ↓</option>
          </select>
        </div>
      </div>

      {/* ─── Results count ─── */}
      {(search || statusFilter!=="all" || typeFilter!=="all" || mandatoryFilter!=="all") && (
        <div style={{ fontSize:12, color:"#98a6ad", marginBottom:12 }}>
          {filtered.length} training{filtered.length!==1?"s":""} found
          {search && <> for "<strong>{search}</strong>"</>}
          <button onClick={()=>{ setSearch(""); setStatusFilter("all"); setTypeFilter("all"); setMandatoryFilter("all"); setSortBy("default"); }}
            style={{ border:"none", background:"none", color:"#4361ee", fontSize:12, cursor:"pointer", marginLeft:8, fontWeight:600 }}>✕ Clear filters</button>
        </div>
      )}

      {/* ─── Training Cards ─── */}
      {filtered.length===0 ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:"#98a6ad" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
          <div style={{ fontSize:16, fontWeight:600, color:"#6c757d" }}>Koi training nahi mili</div>
          <div style={{ fontSize:13, marginTop:6 }}>Filters change karo ya search clear karo</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:16 }}>
          {filtered.map(t=>{
            const tt = TRAINING_TYPES.find(x=>x.id===t.type);
            const isCompleted = t.myStatus==="completed";
            return (
              <Card key={t.id} hover style={{ overflow:"hidden" }}>
                <div style={{ height:6, background:tt?.color||"#4361ee" }}/>
                <div style={{ padding:20 }}>
                  <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:14 }}>
                    <TypeIcon type={t.type} size={44}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#1a2035", lineHeight:1.3, marginBottom:6 }}>{t.title}</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        <Badge color={tt?.color||"#4361ee"} bg={tt?.bg||"#eef2ff"} size={10}>{tt?.icon} {tt?.label}</Badge>
                        <StatusBadge status={t.myStatus}/>
                        {t.mandatory && <Badge color={"#f34943"} bg={"#fde8e7"} size={10}>MANDATORY</Badge>}
                      </div>
                    </div>
                  </div>

                  <div style={{ display:"flex", gap:8, fontSize:12, color:"#98a6ad", marginBottom:12 }}>
                    <span>📄 {t.slides} slides</span>
                    <span>•</span>
                    <span>🤖 AI Avatar</span>
                    {t.myScore && <><span>•</span><span style={{ color:"#1abc9c", fontWeight:700 }}>⭐ {t.myScore}%</span></>}
                  </div>

                  {/* Progress bar — for in-progress only */}
                  {t.myStatus==="in-progress" && (
                    <div style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#98a6ad", marginBottom:4 }}>
                        <span>Progress</span><span style={{ fontWeight:700 }}>{t.myPct}%</span>
                      </div>
                      <ProgressBar pct={t.myPct} color={"#4361ee"}/>
                    </div>
                  )}

                  {/* Completed summary row */}
                  {isCompleted && (
                    <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:10, padding:"10px 14px", marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ display:"flex", gap:14 }}>
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:18, color:"#1abc9c", fontWeight:700 }}>{t.myScore}%</div>
                          <div style={{ fontSize:10, color:"#98a6ad" }}>Score</div>
                        </div>
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:18, color:"#1a2035", fontWeight:700 }}>100%</div>
                          <div style={{ fontSize:10, color:"#98a6ad" }}>Progress</div>
                        </div>
                      </div>
                      <Badge color={"#1abc9c"} bg={"#d4f3ec"} size={11}>✅ Completed</Badge>
                    </div>
                  )}

                  {/* Deadline for non-completed */}
                  {!isCompleted && (
                    <div style={{ fontSize:11, color:t.mandatory?"#f34943":"#98a6ad", fontWeight:t.mandatory?600:400, marginBottom:10 }}>
                      📅 Due: Apr 30, 2026{t.mandatory?" — Mandatory":""}</div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display:"flex", gap:8 }}>
                    {isCompleted ? (
                      <>
                        <Btn variant="success" size="sm" style={{ flex:1 }} onClick={()=>setCertTraining(t)}>🏆 View Certificate</Btn>
                        <Btn variant="subtle" size="sm" onClick={()=>setCertTraining(t)}>📊 My Score</Btn>
                      </>
                    ) : t.myStatus==="in-progress" ? (
                      <>
                        <Btn onClick={()=>onStart(t)} variant="ghost" size="sm" style={{ flex:1 }}>▶ Continue</Btn>
                        <Btn variant="subtle" size="sm" onClick={()=>openExt(t)}>⏱ Request Extension</Btn>
                      </>
                    ) : (
                      <>
                        <Btn onClick={()=>onStart(t)} variant="primary" size="sm" style={{ flex:1 }}>▶ Start Training</Btn>
                        <Btn variant="subtle" size="sm" onClick={()=>openExt(t)}>⏱ Request Extension</Btn>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}


/* ─── Training Landing ─── */
function TrainingLanding({ training, onStart, onExit }) {
  const slide = SLIDES[0];
  return (
    <div style={{ height:"100vh", position:"relative", overflow:"hidden", fontFamily:"'Nunito',sans-serif" }}>
      <div style={{ position:"absolute", inset:0, background:slide.gradient }}/>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.52)" }}/>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:1 }}>
        <div style={{ fontSize:150, opacity:0.06 }}>{slide.icon}</div>
      </div>
      {/* Top bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0, padding:"14px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", zIndex:3 }}>
        <button onClick={onExit} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", padding:"7px 16px", borderRadius:4, cursor:"pointer", fontSize:13, fontWeight:700, backdropFilter:"blur(8px)" }}>← Back</button>
        <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:4, padding:"6px 14px", backdropFilter:"blur(8px)" }}>
          <span style={{ color:"rgba(255,255,255,0.8)", fontSize:12 }}>{training.slides} slides · ~{training.slides*3} min</span>
        </div>
      </div>
      {/* Center */}
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:2, padding:24, textAlign:"center" }}>
        {training.mandatory && (
          <span style={{ background:"rgba(243,73,67,0.25)", color:"#fca5a5", fontSize:11, fontWeight:700, padding:"4px 14px", borderRadius:100, border:"1px solid rgba(243,73,67,0.4)", marginBottom:14 }}>
            ⚠️ MANDATORY TRAINING
          </span>
        )}
        <h1 style={{ fontFamily:"'Nunito',sans-serif", color:"#fff", fontSize:32, fontWeight:800, maxWidth:580, lineHeight:1.25, margin:"0 0 12px", letterSpacing:"-0.5px" }}>{training.title}</h1>
        <p style={{ color:"rgba(255,255,255,0.6)", fontSize:14, marginBottom:28, maxWidth:420 }}>AI Avatar Trainer slide-by-slide explain karegi. Beech mein questions pooch sakte ho.</p>
        <button onClick={onStart}
          style={{ background:"#4361ee", color:"#fff", border:"none", padding:"14px 44px", borderRadius:4, fontSize:16, fontWeight:800, cursor:"pointer", boxShadow:"0 8px 24px rgba(61,125,232,0.45)", transition:"all 0.2s" }}
          onMouseEnter={e=>{e.currentTarget.style.background="#3451d1"; e.currentTarget.style.transform="translateY(-2px)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="#4361ee"; e.currentTarget.style.transform="none";}}>
          ▶ Start Training
        </button>
        {training.myPct>0 && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:13, marginTop:12 }}>Resume from Slide {training.mySlide} ({training.myPct}% done)</div>}
      </div>
      {/* Avatar */}
      <div style={{ position:"absolute", bottom:0, right:60, zIndex:3, textAlign:"center" }}>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginBottom:6, background:"rgba(0,0,0,0.35)", borderRadius:100, padding:"4px 12px" }}>👩‍🏫 Priya — Your AI Trainer</div>
        <div style={{ width:110, height:130, background:"rgba(61,125,232,0.08)", borderRadius:"4px 4px 0 0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:68, animation:"fadeUp 0.6s ease" }}>👩‍💼</div>
      </div>
    </div>
  );
}

/* ─── Training Room ─── */
function TrainingRoom({ training, onAssessment, onExit }) {
  const [slideIdx, setSlideIdx]   = useState(0);
  const [paused, setPaused]       = useState(false);
  const [speaking, setSpeaking]   = useState(true);
  const [showAsk, setShowAsk]     = useState(false);
  const [question, setQuestion]   = useState("");
  const [answer, setAnswer]       = useState(null);
  const [thinking, setThinking]   = useState(false);
  const [slideReady, setSlideReady] = useState(false);

  const slide = SLIDES[Math.min(slideIdx, SLIDES.length-1)];
  const isLast = slideIdx >= SLIDES.length-1;

  useEffect(()=>{
    setSpeaking(true); setSlideReady(false); setAnswer(null); setShowAsk(false);
    const t = setTimeout(()=>{ setSpeaking(false); setSlideReady(true); }, 3000);
    return ()=>clearTimeout(t);
  }, [slideIdx]);

  const askQ = () => {
    if(!question.trim()) return;
    setThinking(true); setAnswer(null);
    setTimeout(()=>{
      const map = { salary:"Compensation bands HR se confirm karein.", leave:"18 paid leaves per year, 5 sick leaves alag se.", laptop:"IT helpdesk se Day 1 pe milta hai. Ext 1100." };
      let resp = `Bahut accha sawaal! ${slide.title} ke baare mein: ${slide.bullets[0]}.`;
      Object.entries(map).forEach(([k,v])=>{ if(question.toLowerCase().includes(k)) resp=v; });
      setAnswer(resp); setThinking(false); setQuestion("");
    }, 1800);
  };

  return (
    <div style={{ height:"100vh", background:"#1a1f2e", display:"flex", flexDirection:"column", fontFamily:"'Nunito',sans-serif", overflow:"hidden" }}>
      <style>{`@keyframes wave{0%{height:4px}100%{height:20px}}`}</style>
      {/* Top bar */}
      <div style={{ background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"11px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <button onClick={()=>{ if(window.confirm("Progress save ho jaayega. Exit?")) onExit(); }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:13, fontWeight:600 }}>← Exit & Save</button>
        <div style={{ textAlign:"center" }}>
          <div style={{ color:"#e2e8f0", fontWeight:700, fontSize:14 }}>{training.title.substring(0,48)}</div>
          <div style={{ color:"rgba(255,255,255,0.3)", fontSize:11, marginTop:2 }}>Slide {slideIdx+1} of {SLIDES.length}: {slide.title}</div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ color:"rgba(255,255,255,0.35)", fontSize:12 }}>⏱ 08:32</span>
          <button onClick={()=>setPaused(p=>!p)} style={{ background:"rgba(61,125,232,0.2)", border:"1px solid rgba(61,125,232,0.4)", color:"#93b8f8", padding:"5px 14px", borderRadius:4, cursor:"pointer", fontSize:12, fontWeight:700 }}>
            {paused?"▶ Resume":"⏸ Pause"}
          </button>
        </div>
      </div>

      {paused && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.88)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ textAlign:"center", color:"#fff" }}>
            <div style={{ fontSize:44, marginBottom:14 }}>⏸</div>
            <h2 style={{ fontWeight:800, marginBottom:6, fontSize:24 }}>Training Paused</h2>
            <p style={{ color:"rgba(255,255,255,0.45)", marginBottom:22 }}>Aapki progress save ho gayi</p>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={()=>setPaused(false)} style={{ background:"#4361ee", color:"#fff", border:"none", padding:"11px 28px", borderRadius:4, fontWeight:700, fontSize:14, cursor:"pointer" }}>▶ Resume</button>
              <button onClick={onExit} style={{ background:"transparent", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.2)", padding:"11px 28px", borderRadius:4, fontWeight:700, fontSize:14, cursor:"pointer" }}>Exit & Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {/* Left: Slide */}
        <div style={{ flex:1, padding:20, display:"flex", flexDirection:"column", gap:14, overflowY:"auto" }}>
          {/* Slide card */}
          <div style={{ borderRadius:6, overflow:"hidden", border:"1px solid rgba(255,255,255,0.07)", flexShrink:0 }}>
            <div style={{ background:slide.gradient, padding:"28px 24px", display:"flex", alignItems:"center", gap:16, minHeight:120 }}>
              <div style={{ fontSize:60, filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>{slide.icon}</div>
              <div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:700, letterSpacing:"0.1em" }}>SLIDE {slideIdx+1} OF {SLIDES.length}</div>
                <h2 style={{ color:"#fff", fontSize:22, fontWeight:800, marginTop:4 }}>{slide.title}</h2>
              </div>
            </div>
            <div style={{ background:"#242938", padding:"18px 22px" }}>
              {speaking ? (
                <div style={{ display:"flex", align:"center", gap:12, padding:"12px 0" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    {[0.4,0.6,0.8,0.6,0.4].map((d,i)=>(
                      <div key={i} style={{ width:3, borderRadius:2, background:"#4361ee", animation:`wave ${d}s ease-in-out ${i*0.08}s infinite alternate`, minHeight:4, maxHeight:20 }}/>
                    ))}
                  </div>
                  <span style={{ color:"rgba(255,255,255,0.5)", fontSize:13 }}>Priya is explaining this slide...</span>
                </div>
              ) : (
                <ul style={{ listStyle:"none", padding:0, margin:0 }}>
                  {slide.bullets.map((b,i)=>(
                    <li key={i} style={{ display:"flex", gap:10, padding:"7px 0", borderBottom:i<slide.bullets.length-1?"1px solid rgba(255,255,255,0.05)":"none", fontSize:14, color:"#cbd5e1", alignItems:"flex-start" }}>
                      <span style={{ color:"#4361ee", flexShrink:0, marginTop:2 }}>→</span>{b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Slide nav */}
          <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
            {SLIDES.map((s,i)=>(
              <div key={i} style={{ width:i===slideIdx?28:8, height:8, borderRadius:4, background:i===slideIdx?"#4361ee":i<slideIdx?"#1abc9c":"rgba(255,255,255,0.15)", transition:"all 0.3s", cursor:i<slideIdx?"pointer":"default" }}
                onClick={()=>{ if(i<slideIdx) setSlideIdx(i); }}/>
            ))}
          </div>

          {/* Quick responses */}
          {slideReady && !showAsk && (
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {[["👍 Samajh aaya",()=>{}],["😕 Dobara explain karo",()=>setAnswer(`${slide.bullets.join(". ")}`)],["💡 Example chahiye",()=>setAnswer(`Example: ${slide.bullets[1]}`)],["⏭ Next slide",()=>{ if(!isLast) setSlideIdx(i=>i+1); else onAssessment(); }]].map(([label,action])=>(
                <button key={label} onClick={action}
                  style={{ background:"rgba(61,125,232,0.15)", border:"1px solid rgba(61,125,232,0.3)", color:"#93b8f8", padding:"6px 14px", borderRadius:4, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {answer && (
            <div style={{ background:"rgba(26,188,156,0.1)", border:"1px solid rgba(26,188,156,0.3)", borderRadius:6, padding:"12px 16px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#34d399", marginBottom:6 }}>👩‍🏫 Priya says:</div>
              <div style={{ fontSize:13, color:"#cbd5e1", lineHeight:1.6 }}>{answer}</div>
            </div>
          )}
        </div>

        {/* Right: Avatar + Next */}
        <div style={{ width:240, background:"rgba(255,255,255,0.03)", borderLeft:"1px solid rgba(255,255,255,0.07)", display:"flex", flexDirection:"column", padding:16, gap:14, flexShrink:0 }}>
          {/* Avatar */}
          <div style={{ textAlign:"center", padding:"16px 0" }}>
            <div style={{ width:80, height:80, borderRadius:"50%", background:"#4361ee", display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, margin:"0 auto 10px", boxShadow:"0 4px 20px rgba(61,125,232,0.4)" }}>👩‍💼</div>
            <div style={{ color:"#e2e8f0", fontWeight:700, fontSize:13 }}>Priya</div>
            <div style={{ color:"rgba(255,255,255,0.35)", fontSize:11 }}>AI Trainer</div>
            <div style={{ marginTop:10, display:"flex", justifyContent:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                {[0.4,0.6,0.8,0.6,0.4].map((d,i)=>(
                  <div key={i} style={{ width:3, borderRadius:2, background:speaking?"#4361ee":"rgba(255,255,255,0.15)", height:speaking?undefined:"4px",
                    animation:speaking?`wave ${d}s ease-in-out ${i*0.08}s infinite alternate`:"none", minHeight:4, maxHeight:20 }}/>
                ))}
              </div>
            </div>
          </div>

          {/* Ask Priya */}
          <div style={{ flex:1 }}>
            <button onClick={()=>setShowAsk(s=>!s)}
              style={{ width:"100%", background:"rgba(61,125,232,0.15)", border:"1px solid rgba(61,125,232,0.3)", color:"#93b8f8", padding:"8px 14px", borderRadius:4, fontSize:12, fontWeight:700, cursor:"pointer", marginBottom:10 }}>
              💬 Ask Priya
            </button>
            {showAsk && (
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <input value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>e.key==="Enter"&&askQ()}
                  placeholder="Kuch bhi poocho..."
                  style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:4, padding:"8px 10px", color:"#e2e8f0", fontSize:12, fontFamily:"'Nunito',sans-serif" }}/>
                {thinking ? (
                  <div style={{ display:"flex", gap:6, alignItems:"center", padding:"6px 0" }}>
                    <div style={{ width:12, height:12, borderRadius:"50%", border:"2px solid #3d7de8", borderTopColor:"transparent", animation:"spin 0.8s linear infinite" }}/>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>Thinking...</span>
                  </div>
                ) : (
                  <button onClick={askQ} disabled={!question.trim()}
                    style={{ background:"#4361ee", border:"none", color:"#fff", padding:"7px 12px", borderRadius:4, fontSize:12, fontWeight:700, cursor:"pointer", opacity:question.trim()?1:0.4 }}>
                    Send →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Next button */}
          <button onClick={()=>{ if(!slideReady) return; if(!isLast) setSlideIdx(i=>i+1); else onAssessment(); }}
            disabled={!slideReady}
            style={{ width:"100%", background:slideReady?"#4361ee":"rgba(255,255,255,0.08)", border:"none", color:slideReady?"#fff":"rgba(255,255,255,0.25)", padding:"11px 0", borderRadius:4, fontWeight:800, fontSize:14, cursor:slideReady?"pointer":"not-allowed", transition:"all 0.2s" }}>
            {!slideReady ? "⏳ Please wait..." : isLast ? "Take Assessment →" : "Next Slide →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Assessment Screen ─── */
function AssessmentScreen({ training, onDone }) {
  const [qIdx, setQIdx]     = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const current = ASSESS_QS[qIdx];
  const allAnswered = Object.keys(answers).length === ASSESS_QS.length;
  const score = submitted ? Math.round(ASSESS_QS.filter((q,i)=>answers[i]===q.ans).length / ASSESS_QS.length * 100) : 0;

  return (
    <div style={{ minHeight:"100vh", background:"#1a1f2e", display:"flex", flexDirection:"column", fontFamily:"'Nunito',sans-serif", padding:24 }}>
      <style>{`@keyframes bounceIn{0%{transform:scale(0.8);opacity:0}70%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}`}</style>

      {/* Header */}
      <div style={{ maxWidth:640, margin:"0 auto", width:"100%", marginBottom:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, fontWeight:600 }}>{training.title.substring(0,44)}...</div>
          <div style={{ color:"rgba(255,255,255,0.35)", fontSize:12 }}>Q {Math.min(qIdx+1,ASSESS_QS.length)}/{ASSESS_QS.length}</div>
        </div>
        <div style={{ height:6, background:"rgba(255,255,255,0.08)", borderRadius:4 }}>
          <div style={{ height:"100%", width:`${(qIdx/ASSESS_QS.length)*100}%`, background:"#4361ee", borderRadius:4, transition:"width 0.4s ease" }}/>
        </div>
      </div>

      {!submitted ? (
        <div style={{ maxWidth:640, margin:"0 auto", width:"100%" }} className="fadeIn">
          <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"24px 26px", marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"rgba(61,125,232,0.8)", letterSpacing:"0.1em", marginBottom:12 }}>QUESTION {qIdx+1}</div>
            <div style={{ fontSize:18, fontWeight:700, color:"#e2e8f0", lineHeight:1.5 }}>{current.q}</div>
          </div>
          <div style={{ display:"grid", gap:10, marginBottom:24 }}>
            {current.opts.map((opt,i)=>(
              <div key={i} onClick={()=>setAnswers({...answers,[qIdx]:i})}
                style={{ padding:"14px 18px", borderRadius:6, border:`1px solid ${answers[qIdx]===i?"#4361ee":"rgba(255,255,255,0.1)"}`, background:answers[qIdx]===i?"rgba(61,125,232,0.2)":"rgba(255,255,255,0.03)", cursor:"pointer", color:answers[qIdx]===i?"#93b8f8":"#cbd5e1", fontWeight:answers[qIdx]===i?700:400, fontSize:14, transition:"all 0.15s", display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ width:24, height:24, borderRadius:"50%", border:`2px solid ${answers[qIdx]===i?"#4361ee":"rgba(255,255,255,0.2)"}`, background:answers[qIdx]===i?"#4361ee":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {answers[qIdx]===i && <span style={{ color:"#fff", fontSize:12, fontWeight:900 }}>✓</span>}
                </div>
                {opt}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <button onClick={()=>{ if(qIdx>0) setQIdx(q=>q-1); }}
              disabled={qIdx===0}
              style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)", padding:"10px 22px", borderRadius:4, fontWeight:700, fontSize:13, cursor:qIdx===0?"not-allowed":"pointer", opacity:qIdx===0?0.4:1 }}>
              ← Back
            </button>
            {qIdx < ASSESS_QS.length-1 ? (
              <button onClick={()=>{ if(answers[qIdx]!==undefined) setQIdx(q=>q+1); }}
                disabled={answers[qIdx]===undefined}
                style={{ background:"#4361ee", border:"none", color:"#fff", padding:"10px 26px", borderRadius:4, fontWeight:700, fontSize:13, cursor:answers[qIdx]===undefined?"not-allowed":"pointer", opacity:answers[qIdx]===undefined?0.45:1 }}>
                Next →
              </button>
            ) : (
              <button onClick={()=>{ if(allAnswered) setSubmitted(true); }}
                disabled={!allAnswered}
                style={{ background:"#1abc9c", border:"none", color:"#fff", padding:"10px 26px", borderRadius:4, fontWeight:700, fontSize:13, cursor:!allAnswered?"not-allowed":"pointer", opacity:!allAnswered?0.45:1 }}>
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ textAlign:"center", maxWidth:500, margin:"0 auto", width:"100%" }}>
          <div style={{ fontSize:80, marginBottom:16, animation:"bounceIn 0.5s ease" }}>{score>=70?"🎉":"😔"}</div>
          <div style={{ fontSize:28, fontWeight:800, color:"#fff", marginBottom:6 }}>{score>=70?"Assessment Passed!":"Not Quite There"}</div>
          <div style={{ fontSize:15, color:"rgba(255,255,255,0.5)", marginBottom:24 }}>Your score: <span style={{ color:score>=70?"#1abc9c":"#f34943", fontWeight:800, fontSize:20 }}>{score}%</span></div>
          <button onClick={()=>onDone(score)}
            style={{ background:"#4361ee", color:"#fff", border:"none", padding:"12px 32px", borderRadius:4, fontWeight:800, fontSize:14, cursor:"pointer" }}>
            {score>=70?"View Results →":"Try Again →"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Result Screen ─── */
function ResultScreen({ training, onDone }) {
  const score = training.finalScore || 78;
  const passed = score >= 70;
  const isPerfect = score >= 95;
  const isFast = score >= 80;

  return (
    <div style={{ minHeight:"100vh", background:"#1a1f2e", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Nunito',sans-serif", padding:24 }}>
      <div style={{ textAlign:"center", maxWidth:540, width:"100%" }}>
        {/* Score circle */}
        <div style={{ width:100, height:100, borderRadius:"50%", background:passed?"rgba(26,188,156,0.15)":"rgba(243,73,67,0.15)", border:`3px solid ${passed?"#1abc9c":"#f34943"}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", animation:"bounceIn 0.5s ease" }}>
          <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:30, fontWeight:800, color:passed?"#1abc9c":"#f34943", lineHeight:1 }}>{score}%</div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", fontWeight:700 }}>SCORE</div>
        </div>
        <h2 style={{ fontWeight:800, fontSize:26, color:"#fff", marginBottom:6 }}>{passed?"🎉 Training Complete!":"😔 Better Luck Next Time"}</h2>
        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:14, marginBottom:28 }}>{passed?"Congratulations! You have passed the assessment.":"You need 70% to pass. Review the material and try again."}</p>

        {/* Rewards */}
        {passed && (
          <div style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(251,191,36,0.3)", borderRadius:6, padding:"18px 20px", marginBottom:22, textAlign:"left", animation:"fadeIn 0.5s 0.3s ease both" }}>
            <div style={{ fontWeight:800, fontSize:14, color:"#fcd34d", marginBottom:14, textAlign:"center" }}>🎖️ Rewards Earned</div>
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              <div style={{ flex:1, background:"rgba(245,158,11,0.15)", borderRadius:6, padding:"10px 12px", textAlign:"center", border:"1px solid rgba(245,158,11,0.25)" }}>
                <div style={{ fontSize:26, fontWeight:800, color:"#fcd34d" }}>+100</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)", marginTop:2 }}>⭐ Points</div>
              </div>
              {isPerfect && (
                <div style={{ flex:1, background:"rgba(245,158,11,0.15)", borderRadius:6, padding:"10px 12px", textAlign:"center", border:"1px solid rgba(245,158,11,0.25)" }}>
                  <div style={{ fontSize:26, fontWeight:800, color:"#fcd34d" }}>+50</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)", marginTop:2 }}>💯 Perfect Bonus</div>
                </div>
              )}
              {isFast && (
                <div style={{ flex:1, background:"rgba(245,158,11,0.15)", borderRadius:6, padding:"10px 12px", textAlign:"center", border:"1px solid rgba(245,158,11,0.25)" }}>
                  <div style={{ fontSize:26, fontWeight:800, color:"#fcd34d" }}>+50</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)", marginTop:2 }}>🚀 Fast Bonus</div>
                </div>
              )}
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", fontWeight:700, letterSpacing:"0.06em", marginBottom:8 }}>BADGES UNLOCKED</div>
            <div style={{ display:"flex", gap:8 }}>
              {[{ icon:"🚀", label:"Fast Learner" }, ...(isPerfect?[{icon:"💯",label:"Perfect"}]:[]), {icon:"🔥",label:"On a Streak"}].map(b=>(
                <div key={b.label} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(251,191,36,0.25)", borderRadius:6, padding:"8px 12px", display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:18 }}>{b.icon}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:"#fcd34d" }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick review */}
        <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:6, padding:14, marginBottom:20, textAlign:"left" }}>
          <div style={{ fontWeight:700, fontSize:13, color:"rgba(255,255,255,0.7)", marginBottom:10 }}>Quick Review</div>
          {ASSESS_QS.slice(0,3).map((q,i)=>(
            <div key={i} style={{ display:"flex", gap:8, marginBottom:6, fontSize:12, color:"rgba(255,255,255,0.55)", alignItems:"flex-start" }}>
              <span style={{ color:i===0||i===2?"#1abc9c":"#f34943", flexShrink:0 }}>{i===0||i===2?"✓":"✗"}</span>
              <span>{q.q.substring(0,50)}...</span>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          {passed && (
            <button onClick={()=>alert("🏆 Certificate downloaded!")}
              style={{ background:"#f59e0b", color:"#1c1917", border:"none", padding:"11px 22px", borderRadius:4, fontWeight:800, fontSize:13, cursor:"pointer" }}>
              🏆 Download Certificate
            </button>
          )}
          <button onClick={onDone}
            style={{ background:"rgba(255,255,255,0.12)", color:"#fff", border:"1px solid rgba(255,255,255,0.2)", padding:"11px 22px", borderRadius:4, fontWeight:800, fontSize:13, cursor:"pointer" }}>
            {passed?"Back to Dashboard":"Retry Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Employee Reports ─── */
function EmpReports() {
  return (
    <div className="fadeUp">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h4 style={{ fontSize:18, fontWeight:700, color:"#1a2035", margin:0 }}>My Reports</h4>
          <p style={{ fontSize:13, color:"#6c757d", margin:"4px 0 0" }}>Aapki training performance history</p>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
        {[["✅","Completed","2","#1abc9c","#d4f3ec"],["⏱","Hours Trained","6.5h","#4361ee","#eef2ff"],["📊","Avg Score","87.5%","#f7b731","#fef6e4"]].map(([ic,l,v,c,bg])=>(
          <div key={l} style={{ background:"#fff", border:"1px solid #e9ecef", borderRadius:4, padding:18, textAlign:"center", boxShadow:"0 0 35px 0 rgba(154,161,171,0.1)" }}>
            <div style={{ width:42, height:42, borderRadius:4, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, margin:"0 auto 10px" }}>{ic}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c }}>{v}</div>
            <div style={{ fontSize:12, color:"#6c757d", fontWeight:600, marginTop:3 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"#fff", border:"1px solid #e9ecef", borderRadius:4, boxShadow:"0 0 35px 0 rgba(154,161,171,0.1)" }}>
        <div style={{ padding:"14px 18px", borderBottom:"1px solid #e9ecef", fontWeight:700, color:"#1a2035", fontSize:14 }}>My Training History</div>
        {[
          {title:"Effective Communication & Presentation",type:"softskills",date:"Mar 5, 2026",score:84,time:"2h 10m"},
          {title:"Data Privacy & GDPR Compliance",type:"compliance",date:"Feb 20, 2026",score:91,time:"1h 45m"},
        ].map((r,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderBottom:i<1?"1px solid #f8f9fa":"none" }}>
            <TypeIcon type={r.type} size={42}/>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14, color:"#1a2035" }}>{r.title}</div>
              <div style={{ fontSize:12, color:"#98a6ad", marginTop:2 }}>Completed: {r.date} · Time: {r.time}</div>
            </div>
            <div style={{ textAlign:"right", marginRight:12 }}>
              <div style={{ fontSize:22, fontWeight:800, color:"#1abc9c" }}>{r.score}%</div>
              <span style={{ background:"#d4f3ec", color:"#1abc9c", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:100 }}>✅ PASSED</span>
            </div>
            <button onClick={()=>alert("🏆 Certificate downloaded!")}
              style={{ border:"1px solid #3d7de8", background:"#eef2ff", padding:"6px 14px", borderRadius:4, cursor:"pointer", fontSize:12, color:"#4361ee", fontWeight:700 }}>
              🏆 Certificate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [role, setRole] = useState(null);
  if(!role) return <RoleSelector onSelect={setRole}/>;
  if(role==="admin") return <AdminPanel onExit={()=>setRole(null)}/>;
  return <EmployeePanel onExit={()=>setRole(null)}/>;
}
