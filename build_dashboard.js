const fs = require('fs');
const data = JSON.parse(fs.readFileSync('enriched_deals.json', 'utf8'));
const dataJson = JSON.stringify(data);

// Load logo assets
const fullLogoB64 = fs.readFileSync('afcen_design/afcen-design/full.png').toString('base64');
const singleLogoB64 = fs.readFileSync('afcen_design/afcen-design/single.png').toString('base64');
const singleSvg = fs.readFileSync('afcen_design/afcen-design/single.svg', 'utf8');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AfCEN — Climate & Infra Pipeline</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"><\/script>
<style>
:root {
  /* AfCEN Brand Colors */
  --green:   #228B22;
  --green-dark: #006811;
  --green-mid: #00943c;
  --green-light: #63b32e;
  --blue:    #00BFFF;
  --orange:  #FF7F50;

  /* Background system */
  --bg:      #060d06;
  --bg2:     #0b150b;
  --bg3:     #101e10;
  --bg4:     #172617;
  --bg5:     #1e311e;

  /* Borders */
  --border:  rgba(34,139,34,0.12);
  --border2: rgba(34,139,34,0.22);
  --border3: rgba(0,191,255,0.15);

  /* Text */
  --text:    #e8f5e9;
  --text-dim: #6b9a6b;
  --text-muted: #2d4d2d;

  /* Fonts */
  --font-title: 'Montserrat', sans-serif;
  --font-body:  'DM Sans', sans-serif;
  --font-mono:  'JetBrains Mono', monospace;

  /* Stage colors */
  --s-concept:  #6b7280;
  --s-prefeas:  #d97706;
  --s-feas:     #eab308;
  --s-prefinance: #f97316;
  --s-finance:  #84cc16;
  --s-struct:   #14b8a6;
  --s-close:    #00BFFF;
  --s-construct:#228B22;
  --s-impl:     #63b32e;
  --s-ops:      #22c55e;
  --s-other:    #475569;
}

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
html { scroll-behavior:smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 13px;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Subtle dot-grid texture */
body::before {
  content:'';
  position:fixed; inset:0;
  background-image: radial-gradient(circle, rgba(34,139,34,0.07) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events:none; z-index:0;
}

/* Green glow top-left */
body::after {
  content:'';
  position:fixed; top:-100px; left:-100px;
  width:600px; height:600px;
  background: radial-gradient(ellipse, rgba(34,139,34,0.09) 0%, transparent 65%);
  pointer-events:none; z-index:0;
}

/* Orange glow bottom-right */
.bg-glow-2 {
  position:fixed; bottom:-150px; right:-100px;
  width:500px; height:500px;
  background: radial-gradient(ellipse, rgba(255,127,80,0.06) 0%, transparent 65%);
  pointer-events:none; z-index:0;
}

.wrapper { position:relative; z-index:1; max-width:1600px; margin:0 auto; padding:0 28px 64px; }

/* ===== TICKER ===== */
.ticker {
  background: var(--bg3);
  border-bottom: 1px solid var(--border);
  padding: 7px 0;
  overflow:hidden;
}
.ticker-inner { display:flex; animation:ticker 90s linear infinite; white-space:nowrap; }
.ticker-item { font-family:var(--font-mono); font-size:10px; color:var(--text-dim); padding:0 36px; display:inline-flex; align-items:center; gap:10px; }
.ticker-dot { width:4px; height:4px; border-radius:50%; background:var(--green-light); flex-shrink:0; }
.ticker-hi { color:var(--orange); font-weight:500; }
@keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

/* ===== TOPBAR ===== */
.topbar {
  display:flex; align-items:center; justify-content:space-between;
  padding: 20px 0 0;
  border-bottom: 1px solid var(--border);
  margin-bottom: 0;
}
.topbar-logo { display:flex; align-items:center; gap:16px; padding-bottom:20px; }
.topbar-logo img { height: 44px; width:auto; }
.topbar-divider { width:1px; height:32px; background:var(--border2); }
.topbar-tagline {
  font-family: var(--font-title);
  font-size: 11px; font-weight:600;
  letter-spacing:0.08em; text-transform:uppercase;
  color: var(--text-dim);
  line-height:1.4;
}
.topbar-right { display:flex; align-items:center; gap:12px; padding-bottom:20px; }
.live-badge {
  display:flex; align-items:center; gap:7px;
  background: rgba(34,139,34,0.12);
  border: 1px solid rgba(34,139,34,0.3);
  color: var(--green-light);
  padding: 7px 14px;
  font-family: var(--font-mono);
  font-size: 10px; letter-spacing:0.18em; text-transform:uppercase;
}
.live-dot { width:6px; height:6px; border-radius:50%; background:var(--green-light); animation:pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }

.date-badge {
  font-family:var(--font-mono); font-size:10px; color:var(--text-dim);
  background:var(--bg3); border:1px solid var(--border); padding:7px 12px;
}

/* ===== HERO ===== */
.hero {
  padding: 40px 0 32px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 32px;
  display:grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 24px;
}
.hero-eyebrow {
  font-family: var(--font-mono);
  font-size:10px; letter-spacing:0.22em; text-transform:uppercase;
  color:var(--orange); margin-bottom:12px;
  display:flex; align-items:center; gap:10px;
}
.hero-eyebrow::before {
  content:''; display:inline-block;
  width:24px; height:2px; background:var(--orange);
}
.hero-title {
  font-family: var(--font-title);
  font-size: clamp(26px, 3.5vw, 46px);
  font-weight: 900; line-height:1;
  letter-spacing:-0.03em; color:#fff;
}
.hero-title .green { color:var(--green-light); }
.hero-title .blue { color:var(--blue); }
.hero-sub {
  margin-top:14px;
  font-family: var(--font-body);
  font-size:13px; color:var(--text-dim); line-height:1.6;
}
.hero-icon {
  width:80px; height:80px; opacity:0.85;
  flex-shrink:0;
}

/* ===== SECTION LABEL ===== */
.section-label {
  font-family:var(--font-mono); font-size:9px;
  letter-spacing:0.28em; text-transform:uppercase;
  color:var(--text-muted); margin-bottom:14px;
  display:flex; align-items:center; gap:12px;
}
.section-label::after { content:''; flex:1; height:1px; background:var(--border); }

/* ===== KPI CARDS ===== */
.kpi-grid {
  display:grid; grid-template-columns:repeat(4,1fr);
  gap:16px; margin-bottom:32px;
}
@media(max-width:900px){.kpi-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:480px){.kpi-grid{grid-template-columns:1fr}}

.kpi-card {
  background:var(--bg2);
  border:1px solid var(--border);
  border-top: 2px solid var(--card-top, var(--green));
  padding:22px 24px; position:relative; overflow:hidden;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.kpi-card:hover {
  border-color: var(--border2);
  transform:translateY(-2px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
.kpi-card-1 { --card-top: var(--blue); }
.kpi-card-2 { --card-top: var(--green-light); }
.kpi-card-3 { --card-top: var(--orange); }
.kpi-card-4 { --card-top: var(--green); }

.kpi-card::after {
  content:'';
  position:absolute; inset:0;
  background: linear-gradient(135deg, rgba(34,139,34,0.04) 0%, transparent 60%);
  pointer-events:none;
}

.kpi-label {
  font-family:var(--font-mono); font-size:9px;
  letter-spacing:0.2em; text-transform:uppercase;
  color:var(--text-dim); margin-bottom:12px;
}
.kpi-value {
  font-family:var(--font-title); font-size:40px;
  font-weight:900; line-height:1; color:#fff;
  letter-spacing:-0.02em;
}
.kpi-unit { font-family:var(--font-mono); font-size:10px; color:var(--text-dim); margin-top:6px; }
.kpi-accent { position:absolute; bottom:0; right:0; width:60px; height:60px; opacity:0.04; }

/* ===== CHARTS ===== */
.charts-grid {
  display:grid; grid-template-columns:repeat(2,1fr);
  gap:16px; margin-bottom:32px;
}
@media(max-width:900px){.charts-grid{grid-template-columns:1fr}}

.chart-card {
  background:var(--bg2);
  border:1px solid var(--border);
  padding:22px;
  transition: border-color 0.2s;
}
.chart-card:hover { border-color:var(--border2); }

.chart-header {
  display:flex; align-items:center; justify-content:space-between;
  margin-bottom:18px;
}
.chart-title {
  font-family:var(--font-title); font-size:12px;
  font-weight:700; letter-spacing:0.06em;
  text-transform:uppercase; color:var(--text);
}
.chart-badge {
  font-family:var(--font-mono); font-size:9px;
  color:var(--text-dim); background:var(--bg4);
  padding:3px 9px; border:1px solid var(--border);
}
.chart-wrap { position:relative; height:260px; }
.chart-wrap.tall { height:340px; }

/* ===== FILTERS ===== */
.filters-bar {
  background:var(--bg2); border:1px solid var(--border);
  padding:16px 20px; margin-bottom:16px;
  display:flex; align-items:center; gap:12px; flex-wrap:wrap;
}
.filter-label {
  font-family:var(--font-mono); font-size:9px;
  letter-spacing:0.2em; text-transform:uppercase;
  color:var(--green); white-space:nowrap;
}
.filter-select, .filter-input {
  background:var(--bg); border:1px solid var(--border2);
  color:var(--text); font-family:var(--font-mono); font-size:11px;
  padding:8px 12px; outline:none; transition:border-color 0.15s;
  cursor:pointer; appearance:none; -webkit-appearance:none; border-radius:0;
}
.filter-select {
  min-width:145px;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236b9a6b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat:no-repeat; background-position:right 10px center; padding-right:28px;
}
.filter-input { min-width:200px; }
.filter-select:focus, .filter-input:focus { border-color:var(--green-light); }
.filter-select option { background:var(--bg3); color:var(--text); }
.filter-divider { width:1px; height:24px; background:var(--border2); }
.btn-reset {
  background:transparent; border:1px solid var(--border2);
  color:var(--text-dim); font-family:var(--font-mono); font-size:10px;
  letter-spacing:0.1em; text-transform:uppercase;
  padding:8px 16px; cursor:pointer; transition:all 0.15s; white-space:nowrap;
}
.btn-reset:hover { border-color:var(--orange); color:var(--orange); }

/* ===== TABLE ===== */
.table-card { background:var(--bg2); border:1px solid var(--border); overflow:hidden; }
.table-toolbar {
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 20px; border-bottom:1px solid var(--border);
  flex-wrap:wrap; gap:10px;
}
.table-toolbar-left {
  font-family:var(--font-title); font-size:12px;
  font-weight:700; letter-spacing:0.06em;
  text-transform:uppercase; color:var(--text);
}
.table-count { font-family:var(--font-mono); font-size:10px; color:var(--text-dim); margin-left:10px; }
.table-wrap { overflow-x:auto; }

table { width:100%; border-collapse:collapse; font-size:12px; }
thead tr { background:var(--bg3); border-bottom:1px solid var(--border2); }
th {
  font-family:var(--font-title); font-weight:700; font-size:10px;
  letter-spacing:0.1em; text-transform:uppercase; color:var(--text-dim);
  padding:11px 13px; text-align:left; white-space:nowrap;
  cursor:pointer; user-select:none; transition:color 0.15s;
}
th:hover { color:var(--green-light); }
th.sort-asc::after { content:' ↑'; color:var(--green-light); }
th.sort-desc::after { content:' ↓'; color:var(--green-light); }

tbody tr { border-bottom:1px solid rgba(34,139,34,0.06); transition:background 0.1s; }
tbody tr:nth-child(even) { background:rgba(34,139,34,0.025); }
tbody tr:hover { background:rgba(255,127,80,0.06); }

td { padding:10px 13px; color:var(--text); font-family:var(--font-body); font-size:12px; vertical-align:middle; }
td.id { color:var(--text-dim); font-family:var(--font-mono); font-size:10px; }
td.title { font-family:var(--font-title); font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:240px; }
td.num { text-align:right; color:var(--text-dim); font-family:var(--font-mono); font-size:11px; font-variant-numeric:tabular-nums; }

.stage-badge {
  display:inline-block; font-family:var(--font-mono); font-size:9px;
  letter-spacing:0.06em; text-transform:uppercase;
  padding:3px 8px; white-space:nowrap; font-weight:500;
}

/* ===== PAGINATION ===== */
.pagination {
  display:flex; align-items:center; justify-content:space-between;
  padding:13px 20px; border-top:1px solid var(--border);
  flex-wrap:wrap; gap:8px;
}
.pagination-info { font-family:var(--font-mono); font-size:10px; color:var(--text-dim); }
.pagination-controls { display:flex; gap:4px; align-items:center; }
.page-btn {
  background:transparent; border:1px solid var(--border);
  color:var(--text-dim); font-family:var(--font-mono); font-size:10px;
  padding:5px 11px; cursor:pointer; transition:all 0.15s; border-radius:0;
}
.page-btn:hover { border-color:var(--green-light); color:var(--green-light); }
.page-btn.active { background:var(--green); border-color:var(--green); color:#fff; font-weight:600; }
.page-btn:disabled { opacity:0.3; cursor:not-allowed; }

/* ===== EMPTY STATE ===== */
.empty-state { text-align:center; padding:48px; color:var(--text-dim); font-size:13px; }

/* ===== FOOTER ===== */
.footer {
  margin-top:40px; padding-top:24px; border-top:1px solid var(--border);
  display:flex; align-items:center; justify-content:space-between;
  flex-wrap:wrap; gap:12px;
}
.footer-logo { height:28px; opacity:0.5; }
.footer-text { font-family:var(--font-mono); font-size:9px; color:var(--text-muted); letter-spacing:0.1em; }

/* ===== SCROLLBAR ===== */
::-webkit-scrollbar { width:5px; height:5px; }
::-webkit-scrollbar-track { background:var(--bg); }
::-webkit-scrollbar-thumb { background:var(--border2); }
::-webkit-scrollbar-thumb:hover { background:var(--green); }
</style>
</head>
<body>

<div class="bg-glow-2"></div>

<!-- TICKER -->
<div class="ticker">
  <div class="ticker-inner" id="ticker"></div>
</div>

<div class="wrapper">

  <!-- TOP BAR -->
  <div class="topbar">
    <div class="topbar-logo">
      <img src="data:image/png;base64,${fullLogoB64}" alt="AfCEN Logo">
      <div class="topbar-divider"></div>
      <div class="topbar-tagline">Climate &amp; Infra<br>Pipeline Dashboard</div>
    </div>
    <div class="topbar-right">
      <div class="date-badge" id="date-badge"></div>
      <div class="live-badge"><div class="live-dot"></div>Live</div>
    </div>
  </div>

  <!-- HERO -->
  <div class="hero">
    <div>
      <div class="hero-eyebrow">AfCEN Climate &amp; Infra Pipeline</div>
      <h1 class="hero-title">AfCEN <span class="green">Climate</span> &amp;<br><span class="blue">Infra</span> Pipeline</h1>
      <p class="hero-sub">Tracking <strong id="hero-deal-count">240</strong> projects across East, West, Southern, Central &amp; North Africa — spanning energy generation, transmission, mining, logistics, agriculture and water infrastructure.</p>
    </div>
    <div class="hero-icon">
      ${singleSvg}
    </div>
  </div>

  <!-- KPI CARDS -->
  <div class="section-label">Portfolio Overview</div>
  <div class="kpi-grid">
    <div class="kpi-card kpi-card-1">
      <div class="kpi-label">Total Deals</div>
      <div class="kpi-value" id="kpi-deals">240</div>
      <div class="kpi-unit">tracked projects</div>
    </div>
    <div class="kpi-card kpi-card-2">
      <div class="kpi-label">Total Capacity</div>
      <div class="kpi-value" id="kpi-mw">149.1</div>
      <div class="kpi-unit">GW across portfolio</div>
    </div>
    <div class="kpi-card kpi-card-3">
      <div class="kpi-label">Total Project Costs</div>
      <div class="kpi-value" id="kpi-cost">$139.6B</div>
      <div class="kpi-unit">USD estimated</div>
    </div>
    <div class="kpi-card kpi-card-4">
      <div class="kpi-label">PPA Signed</div>
      <div class="kpi-value" id="kpi-ppa">2</div>
      <div class="kpi-unit">deals with signed PPA</div>
    </div>
  </div>

  <!-- CHARTS -->
  <div class="section-label">Portfolio Analytics</div>
  <div class="charts-grid">
    <div class="chart-card">
      <div class="chart-header">
        <div class="chart-title">Deals by Stage</div>
        <div class="chart-badge" id="stage-badge">240 deals</div>
      </div>
      <div class="chart-wrap"><canvas id="stageChart"></canvas></div>
    </div>
    <div class="chart-card">
      <div class="chart-header">
        <div class="chart-title">Top 15 Countries</div>
        <div class="chart-badge">by deal count</div>
      </div>
      <div class="chart-wrap tall"><canvas id="countryChart"></canvas></div>
    </div>
    <div class="chart-card">
      <div class="chart-header">
        <div class="chart-title">Deals by Region</div>
        <div class="chart-badge" id="region-badge">6 regions</div>
      </div>
      <div class="chart-wrap"><canvas id="regionChart"></canvas></div>
    </div>
    <div class="chart-card">
      <div class="chart-header">
        <div class="chart-title">Technology Mix</div>
        <div class="chart-badge">by deal count</div>
      </div>
      <div class="chart-wrap"><canvas id="techChart"></canvas></div>
    </div>
  </div>

  <!-- FILTERS -->
  <div class="section-label">Deal Explorer</div>
  <div class="filters-bar">
    <div class="filter-label">Filter</div>
    <select class="filter-select" id="filter-region"><option value="">All Regions</option></select>
    <select class="filter-select" id="filter-stage"><option value="">All Stages</option></select>
    <select class="filter-select" id="filter-sector"><option value="">All Sectors</option></select>
    <select class="filter-select" id="filter-tech"><option value="">All Technologies</option></select>
    <div class="filter-divider"></div>
    <input type="text" class="filter-input" id="filter-search" placeholder="Search title, country, sponsor…">
    <button class="btn-reset" id="btn-reset">✕ Reset</button>
  </div>

  <!-- TABLE -->
  <div class="table-card">
    <div class="table-toolbar">
      <div class="table-toolbar-left">Deal Pipeline<span class="table-count" id="table-count-label"></span></div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th data-col="id">ID</th>
            <th data-col="title">Title</th>
            <th data-col="stageNorm">Stage</th>
            <th data-col="status">Status</th>
            <th data-col="region">Region</th>
            <th data-col="country">Country</th>
            <th data-col="technology">Technology</th>
            <th data-col="sector">Sector</th>
            <th data-col="capacityMW">MW</th>
            <th data-col="totalCostMUSD">Cost (mUSD)</th>
            <th data-col="sponsor">Sponsor</th>
          </tr>
        </thead>
        <tbody id="table-body"></tbody>
      </table>
      <div class="empty-state" id="empty-state" style="display:none">No deals match the current filters.</div>
    </div>
    <div class="pagination">
      <div class="pagination-info" id="page-info"></div>
      <div class="pagination-controls" id="page-controls"></div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <img src="data:image/png;base64,${fullLogoB64}" class="footer-logo" alt="AfCEN">
    <div class="footer-text">© AfCEN · Climate &amp; Infra Pipeline · ${new Date().getFullYear()}</div>
  </div>

</div>

<script>
const DEALS = ${dataJson};

// AfCEN brand-aligned stage colors
const STAGE_COLORS = {
  'Concept':           '#6b7280',
  'Pre-Feasibility':   '#d97706',
  'Feasibility':       '#eab308',
  'Pre-Financing':     '#f97316',
  'Financing':         '#84cc16',
  'Bid':               '#FF7F50',
  'PPA Negotiated':    '#f43f5e',
  'Project Structuring':'#00BFFF',
  'Financial Close':   '#228B22',
  'Construction':      '#63b32e',
  'Implementation':    '#00943c',
  'Operational':       '#22c55e',
  'Tendering':         '#a78bfa',
  'Re-Financing':      '#fb923c',
  'Other':             '#475569'
};

// AfCEN green gradient for regions
const REGION_COLORS = ['#FF7F50','#00BFFF','#228B22','#63b32e','#00943c','#eab308'];
const TECH_COLORS   = ['#00BFFF','#228B22','#FF7F50','#84cc16','#eab308','#63b32e','#fb923c','#00943c','#f43f5e','#a78bfa','#6b7280'];

let filteredDeals = [...DEALS];
let sortCol = 'id', sortDir = 'asc', currentPage = 1;
const PAGE_SIZE = 25;
let stageChart, countryChart, regionChart, techChart;

// Date badge
document.getElementById('date-badge').textContent = new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase();

// Chart defaults
const chartBase = () => ({
  responsive:true, maintainAspectRatio:false,
  animation:{ duration:400 },
  plugins:{
    legend:{ labels:{ color:'#6b9a6b', font:{family:"'JetBrains Mono',monospace",size:10}, boxWidth:10, padding:10 }},
    tooltip:{
      backgroundColor:'#0b150b', borderColor:'rgba(34,139,34,0.3)', borderWidth:1,
      titleColor:'#e8f5e9', bodyColor:'#6b9a6b',
      titleFont:{family:"'Montserrat',sans-serif",size:12,weight:'700'},
      bodyFont:{family:"'JetBrains Mono',monospace",size:11},
      padding:10, cornerRadius:0
    }
  }
});

const axisStyle = () => ({
  x:{ ticks:{color:'#2d4d2d',font:{family:"'JetBrains Mono'",size:9}}, grid:{color:'rgba(34,139,34,0.06)'}, border:{color:'rgba(34,139,34,0.12)'} },
  y:{ ticks:{color:'#6b9a6b',font:{family:"'JetBrains Mono'",size:9}}, grid:{display:false}, border:{color:'rgba(34,139,34,0.12)'} }
});

function initCharts() {
  stageChart = new Chart(document.getElementById('stageChart'), {
    type:'doughnut',
    data:{ labels:[], datasets:[{ data:[], backgroundColor:[], borderWidth:0, hoverOffset:10 }]},
    options:{ ...chartBase(), cutout:'65%', plugins:{ ...chartBase().plugins, legend:{...chartBase().plugins.legend, position:'right'} }}
  });

  countryChart = new Chart(document.getElementById('countryChart'), {
    type:'bar',
    data:{ labels:[], datasets:[{ data:[], backgroundColor:'rgba(0,191,255,0.65)', borderColor:'#00BFFF', borderWidth:1, borderRadius:0 }]},
    options:{ ...chartBase(), indexAxis:'y',
      scales:{ x:{...axisStyle().x}, y:{...axisStyle().y, ticks:{color:'#6b9a6b',font:{family:"'JetBrains Mono'",size:9}}, grid:{display:false}} },
      plugins:{ ...chartBase().plugins, legend:{display:false} }
    }
  });

  regionChart = new Chart(document.getElementById('regionChart'), {
    type:'bar',
    data:{ labels:[], datasets:[{ data:[], backgroundColor:REGION_COLORS, borderWidth:0, borderRadius:0 }]},
    options:{ ...chartBase(), scales:axisStyle(), plugins:{ ...chartBase().plugins, legend:{display:false} }}
  });

  techChart = new Chart(document.getElementById('techChart'), {
    type:'doughnut',
    data:{ labels:[], datasets:[{ data:[], backgroundColor:TECH_COLORS, borderWidth:0, hoverOffset:10 }]},
    options:{ ...chartBase(), cutout:'62%', plugins:{ ...chartBase().plugins, legend:{...chartBase().plugins.legend, position:'right'} }}
  });
}

function updateCharts(deals) {
  // Stage donut
  const sm={};
  deals.forEach(d=>{ const s=d.stageNorm||'Other'; sm[s]=(sm[s]||0)+1; });
  const se=Object.entries(sm).sort((a,b)=>b[1]-a[1]);
  stageChart.data.labels=se.map(e=>e[0]);
  stageChart.data.datasets[0].data=se.map(e=>e[1]);
  stageChart.data.datasets[0].backgroundColor=se.map(e=>STAGE_COLORS[e[0]]||'#475569');
  stageChart.update();
  document.getElementById('stage-badge').textContent=deals.length+' deals';

  // Country bar
  const cm={};
  deals.forEach(d=>{ const c=(d.country||'Unknown').trim(); cm[c]=(cm[c]||0)+1; });
  const top15=Object.entries(cm).sort((a,b)=>b[1]-a[1]).slice(0,15);
  const maxC=Math.max(...top15.map(e=>e[1]),1);
  countryChart.data.labels=top15.map(e=>e[0]);
  countryChart.data.datasets[0].data=top15.map(e=>e[1]);
  countryChart.data.datasets[0].backgroundColor=top15.map(e=>'rgba(0,191,255,'+(0.3+e[1]/maxC*0.6)+')');
  countryChart.update();

  // Region bar
  const rm={};
  deals.forEach(d=>{ const r=(d.region||'Unknown').trim(); rm[r]=(rm[r]||0)+1; });
  const regionOrder=['West Africa','Southern Africa','East Africa','Central Africa','North Africa','Multi-country'];
  const rl=regionOrder.filter(r=>rm[r]);
  regionChart.data.labels=rl;
  regionChart.data.datasets[0].data=rl.map(r=>rm[r]||0);
  regionChart.update();

  // Tech donut
  const tm={};
  deals.forEach(d=>{ const t=(d.technology||'Other').trim(); tm[t]=(tm[t]||0)+1; });
  const topT=Object.entries(tm).sort((a,b)=>b[1]-a[1]);
  const N=10;
  let tl=topT.slice(0,N).map(e=>e[0]), td=topT.slice(0,N).map(e=>e[1]);
  if(topT.length>N){ const rest=topT.slice(N).reduce((s,e)=>s+e[1],0); tl.push('Other'); td.push(rest); }
  techChart.data.labels=tl;
  techChart.data.datasets[0].data=td;
  techChart.update();
}

function updateKPIs(deals) {
  document.getElementById('kpi-deals').textContent=deals.length;
  document.getElementById('hero-deal-count').textContent=deals.length;
  const mw=deals.reduce((s,d)=>s+(+d.capacityMW||0),0);
  document.getElementById('kpi-mw').textContent=(mw/1000).toFixed(1);
  const cost=deals.reduce((s,d)=>s+(+d.totalCostMUSD||0),0);
  document.getElementById('kpi-cost').textContent='$'+(cost/1000).toFixed(1)+'B';
  const ppa=deals.filter(d=>d.ppaSigned&&d.ppaSigned.toString().trim().toUpperCase()==='Y').length;
  document.getElementById('kpi-ppa').textContent=ppa;
}

function stageHTML(stage) {
  const col=STAGE_COLORS[stage]||'#475569';
  return '<span class="stage-badge" style="color:'+col+';background:'+col+'22;border:1px solid '+col+'44">'+(stage||'—')+'</span>';
}

function renderTable(deals) {
  const tbody=document.getElementById('table-body');
  const empty=document.getElementById('empty-state');
  const start=(currentPage-1)*PAGE_SIZE;
  const page=deals.slice(start,start+PAGE_SIZE);
  document.getElementById('table-count-label').textContent=' — '+deals.length+' result'+(deals.length!==1?'s':'');
  document.getElementById('page-info').textContent=deals.length===0?'':('Showing '+(start+1)+'–'+Math.min(start+PAGE_SIZE,deals.length)+' of '+deals.length);
  if(!deals.length){ tbody.innerHTML=''; empty.style.display='block'; renderPagination(0); return; }
  empty.style.display='none';
  tbody.innerHTML=page.map(d=>{
    const mw=d.capacityMW?Number(d.capacityMW).toLocaleString():'—';
    const cost=d.totalCostMUSD?Number(d.totalCostMUSD).toLocaleString():'—';
    const sp=(d.sponsor||'').length>32?d.sponsor.substring(0,30)+'…':(d.sponsor||'—');
    return '<tr><td class="id">'+d.id+'</td><td class="title" title="'+(d.title||'').replace(/"/g,'&quot;')+'">'+d.title+'</td><td>'+stageHTML(d.stageNorm)+'</td><td>'+(d.status||'—')+'</td><td>'+(d.region||'').trim()+'</td><td>'+(d.country||'').trim()+'</td><td>'+(d.technology||'—')+'</td><td>'+(d.sector||'—')+'</td><td class="num">'+mw+'</td><td class="num">'+cost+'</td><td title="'+(d.sponsor||'').replace(/"/g,'&quot;')+'">'+sp+'</td></tr>';
  }).join('');
  renderPagination(deals.length);
}

function renderPagination(total) {
  const pages=Math.ceil(total/PAGE_SIZE);
  const ctrl=document.getElementById('page-controls');
  if(pages<=1){ ctrl.innerHTML=''; return; }
  const range=[];
  for(let i=1;i<=pages;i++){
    if(i===1||i===pages||Math.abs(i-currentPage)<=2) range.push(i);
    else if(range[range.length-1]!=='…') range.push('…');
  }
  ctrl.innerHTML='<button class="page-btn" onclick="goPage('+(currentPage-1)+')" '+(currentPage===1?'disabled':'')+'>‹</button>'
    +range.map(p=>p==='…'?'<span class="page-btn" style="pointer-events:none;opacity:0.4">…</span>':'<button class="page-btn '+(p===currentPage?'active':'')+'" onclick="goPage('+p+')">'+p+'</button>').join('')
    +'<button class="page-btn" onclick="goPage('+(currentPage+1)+')" '+(currentPage===pages?'disabled':'')+'>›</button>';
}

window.goPage=function(p){
  const pages=Math.ceil(filteredDeals.length/PAGE_SIZE);
  currentPage=Math.max(1,Math.min(p,pages));
  renderTable(filteredDeals);
  document.querySelector('.table-card').scrollIntoView({behavior:'smooth',block:'start'});
};

document.querySelectorAll('th[data-col]').forEach(th=>{
  th.addEventListener('click',()=>{
    const col=th.dataset.col;
    if(sortCol===col) sortDir=sortDir==='asc'?'desc':'asc';
    else { sortCol=col; sortDir='asc'; }
    document.querySelectorAll('th').forEach(t=>t.classList.remove('sort-asc','sort-desc'));
    th.classList.add(sortDir==='asc'?'sort-asc':'sort-desc');
    sortData(); currentPage=1; renderTable(filteredDeals);
  });
});

function sortData() {
  filteredDeals.sort((a,b)=>{
    let va=a[sortCol], vb=b[sortCol];
    if(typeof va==='number'&&typeof vb==='number') return sortDir==='asc'?va-vb:vb-va;
    va=String(va||'').toLowerCase(); vb=String(vb||'').toLowerCase();
    return sortDir==='asc'?va.localeCompare(vb):vb.localeCompare(va);
  });
}

function populateFilters() {
  const regions=[...new Set(DEALS.map(d=>d.region).filter(Boolean).map(s=>s.trim()))].sort();
  const stageOrder=['Concept','Pre-Feasibility','Feasibility','Pre-Financing','Financing','Bid','PPA Negotiated','Project Structuring','Financial Close','Tendering','Construction','Implementation','Re-Financing','Operational','Other'];
  const stages=[...new Set(DEALS.map(d=>d.stageNorm).filter(Boolean))].sort((a,b)=>stageOrder.indexOf(a)-stageOrder.indexOf(b));
  const sectors=[...new Set(DEALS.map(d=>d.sector).filter(Boolean).map(s=>s.trim()))].sort();
  const techs=[...new Set(DEALS.map(d=>d.technology).filter(Boolean).map(s=>s.trim()))].sort();
  const add=(id,vals)=>{ const sel=document.getElementById(id); vals.forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent=v; sel.appendChild(o); }); };
  add('filter-region',regions); add('filter-stage',stages); add('filter-sector',sectors); add('filter-tech',techs);
}

function applyFilters() {
  const region=document.getElementById('filter-region').value;
  const stage=document.getElementById('filter-stage').value;
  const sector=document.getElementById('filter-sector').value;
  const tech=document.getElementById('filter-tech').value;
  const search=document.getElementById('filter-search').value.trim().toLowerCase();
  filteredDeals=DEALS.filter(d=>{
    if(region&&(d.region||'').trim()!==region) return false;
    if(stage&&(d.stageNorm||'')!==stage) return false;
    if(sector&&(d.sector||'').trim()!==sector) return false;
    if(tech&&(d.technology||'').trim()!==tech) return false;
    if(search){ const hay=[(d.title||''),(d.country||''),(d.sponsor||'')].join(' ').toLowerCase(); if(!hay.includes(search)) return false; }
    return true;
  });
  sortData(); currentPage=1;
  updateKPIs(filteredDeals); updateCharts(filteredDeals); renderTable(filteredDeals);
}

['filter-region','filter-stage','filter-sector','filter-tech'].forEach(id=>{
  document.getElementById(id).addEventListener('change',applyFilters);
});
document.getElementById('filter-search').addEventListener('input',applyFilters);
document.getElementById('btn-reset').addEventListener('click',()=>{
  ['filter-region','filter-stage','filter-sector','filter-tech'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('filter-search').value=''; applyFilters();
});

function buildTicker() {
  const items=DEALS.slice(0,30).map(d=>
    '<span class="ticker-item"><span class="ticker-dot"></span><span class="ticker-hi">'+d.id+'</span> '+d.title+' &middot; '+(d.country||'').trim()+' &middot; '+(d.stageNorm||d.stage)+'</span>'
  );
  document.getElementById('ticker').innerHTML=[...items,...items].join('');
}

function init() {
  populateFilters();
  initCharts();
  filteredDeals=[...DEALS];
  sortData();
  updateKPIs(DEALS);
  updateCharts(DEALS);
  renderTable(filteredDeals);
  buildTicker();
}

init();
<\/script>
</body>
</html>`;

fs.writeFileSync('pipeline_dashboard.html', html, 'utf8');
const size = fs.statSync('pipeline_dashboard.html').size;
console.log('Dashboard written:', (size/1024).toFixed(1), 'KB');
