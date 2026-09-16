// src/core/constants.js
var STATE_VERSION = 3;
var LOT = 100;
var BASE_MONTHLY = 3100;
var FACTOR = { 满额: 1, 保守: 0.75, 减半: 0.5, 暂停: 0, 债券池: 0 };
var GEARS = ["满额", "保守", "减半", "暂停", "债券池"];
var BATCHES = ["8日", "22日", "月结"];
var BOND_INITIAL = 1800;
var BACKUP_REMIND_DAYS = 14;
var DEFAULT_FUNDS = [
  {
    id: "f1",
    code: "515450",
    name: "南方红利低波50ETF",
    channel: "场内",
    sector: "A股红利",
    plan: 620,
    daily: null,
    market: "",
    gear: "满额",
    split: true,
    side: "防守",
    last: 1.401,
    active: true,
    order: 0,
    note: ""
  },
  {
    id: "f2",
    code: "018043",
    name: "天弘纳斯达克100指数A",
    channel: "场外",
    sector: "海外科技",
    plan: 0,
    daily: 35,
    market: "us",
    gear: "满额",
    split: false,
    side: "进攻",
    last: 1.502,
    active: true,
    order: 1,
    note: ""
  },
  {
    id: "f3",
    code: "000369",
    name: "广发全球医疗保健指数A",
    channel: "场外",
    sector: "海外防御",
    plan: 0,
    daily: 23,
    market: "us",
    gear: "满额",
    split: false,
    side: "防守",
    last: 2.685,
    active: true,
    order: 2,
    note: ""
  },
  {
    id: "f4",
    code: "159559",
    name: "景顺长城国证机器人产业ETF",
    channel: "场内",
    sector: "A股科技",
    plan: 400,
    daily: null,
    market: "",
    gear: "满额",
    split: false,
    side: "进攻",
    last: 1.142,
    active: true,
    order: 3,
    note: ""
  },
  {
    id: "f5",
    code: "512930",
    name: "平安人工智能ETF",
    channel: "场内",
    sector: "A股科技",
    plan: 400,
    daily: null,
    market: "",
    gear: "减半",
    split: false,
    side: "进攻",
    last: 0.601,
    active: true,
    order: 4,
    note: ""
  },
  {
    id: "f6",
    code: "588280",
    name: "华安科创50ETF",
    channel: "场内",
    sector: "A股科技",
    plan: 240,
    daily: null,
    market: "",
    gear: "保守",
    split: false,
    side: "进攻",
    last: 1.115,
    active: true,
    order: 5,
    note: ""
  },
  {
    id: "f7",
    code: "159810",
    name: "浦银安盛创业板ETF",
    channel: "场内",
    sector: "A股科技",
    plan: 240,
    daily: null,
    market: "",
    gear: "满额",
    split: false,
    side: "进攻",
    last: 1.339,
    active: true,
    order: 6,
    note: ""
  },
  {
    id: "f8",
    code: "015823",
    name: "银华中证同业存单AAA7天持有",
    channel: "场外",
    sector: "债券池",
    plan: 0,
    daily: null,
    market: "",
    gear: "债券池",
    split: false,
    side: "防守",
    last: 1,
    active: true,
    order: 7,
    note: ""
  }
];

// src/core/money.js
function round2(n) {
  const v2 = Number(n) || 0;
  return Math.round((v2 + Number.EPSILON * Math.abs(v2)) * 100) / 100;
}
function round0(n) {
  return Math.round(Number(n) || 0);
}
function amountOf(channel, sh, price) {
  const n = Number(sh) || 0;
  if (channel === "场外") return round2(n);
  return round2(n * (Number(price) || 0));
}

// src/core/calendar.js
var OVERSEAS_HOLIDAYS = {
  us: {
    2026: [
      "01-01",
      "01-19",
      "02-16",
      "04-03",
      "05-25",
      "06-19",
      "07-03",
      "09-07",
      "11-26",
      "12-25"
    ]
  },
  hk: {
    2026: [
      "01-01",
      "02-17",
      "02-18",
      "02-19",
      "04-03",
      "04-04",
      "04-07",
      "05-01",
      "05-05",
      "05-24",
      "06-19",
      "07-01",
      "10-01",
      "10-19",
      "12-25",
      "12-26"
    ]
  }
};
function overseasClosed(dateStr, market) {
  if (!market || market === "无") return false;
  const y = Number(String(dateStr).slice(0, 4));
  const list = OVERSEAS_HOLIDAYS[market] && OVERSEAS_HOLIDAYS[market][y];
  if (!list) return false;
  return list.includes(String(dateStr).slice(5));
}
function deductionDays(month, market) {
  const base = workdaysOfMonth(month);
  if (!market || market === "无") return base;
  const [y, m] = month.split("-").map(Number);
  const total = new Date(y, m, 0).getDate();
  let off = 0;
  for (let d = 1; d <= total; d++) {
    const s = `${y}-${pad2(m)}-${pad2(d)}`;
    if (isTradingDay(s) && overseasClosed(s, market)) off++;
  }
  return base - off;
}
var HOLIDAYS = {
  2026: {
    off: [
      "01-01",
      "01-02",
      "01-03",
      "02-15",
      "02-16",
      "02-17",
      "02-18",
      "02-19",
      "02-20",
      "02-21",
      "02-22",
      "02-23",
      "04-04",
      "04-05",
      "04-06",
      "05-01",
      "05-02",
      "05-03",
      "05-04",
      "05-05",
      "06-19",
      "06-20",
      "06-21",
      "09-25",
      "09-26",
      "09-27",
      "10-01",
      "10-02",
      "10-03",
      "10-04",
      "10-05",
      "10-06",
      "10-07"
    ],
    on: ["01-04", "02-14", "02-28", "05-09", "09-20", "10-10"]
  }
};
function parseDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return { y, m, d };
}
function mmdd(dateStr) {
  return dateStr.slice(5);
}
function pad2(n) {
  return String(n).padStart(2, "0");
}
function holidayOf(year) {
  return HOLIDAYS[String(year)] || null;
}
function isTradingDay(dateStr) {
  const { y, m, d } = parseDate(dateStr);
  const h = holidayOf(y);
  const key = mmdd(dateStr);
  if (h) {
    if (h.on.includes(key)) return true;
    if (h.off.includes(key)) return false;
  }
  const w = new Date(y, m - 1, d).getDay();
  return w !== 0 && w !== 6;
}
function workdaysOfMonth(month) {
  const [y, m] = month.split("-").map(Number);
  const total = new Date(y, m, 0).getDate();
  let c = 0;
  for (let d = 1; d <= total; d++) {
    if (isTradingDay(`${y}-${pad2(m)}-${pad2(d)}`)) c++;
  }
  return c;
}
function parseBatchKey(key) {
  const i = key.indexOf("|");
  return i < 0 ? { month: key, batch: "8日" } : { month: key.slice(0, i), batch: key.slice(i + 1) };
}

// src/core/plan.js
function daysOfMonth(state, month, fund = null) {
  if (fund) {
    const byCode = state.daysFund && state.daysFund[month];
    if (byCode && byCode[fund.code] > 0) return byCode[fund.code];
    if (fund.channel === "场外" && fund.market) return deductionDays(month, fund.market);
  }
  const override = state.days && state.days[month];
  if (override > 0) return override;
  return workdaysOfMonth(month);
}
function gearOf(state, code, month) {
  const byMonth = state.gears && state.gears[month];
  if (byMonth && byMonth[code]) return byMonth[code];
  const fund = state.funds.find((f) => f.code === code);
  return fund && fund.gear || "满额";
}
function fundOf(state, code) {
  return state.funds.find((f) => f.code === code) || null;
}
function priceOf(state, code) {
  const p2 = state.prices && state.prices[code];
  if (p2 > 0) return p2;
  const f = fundOf(state, code);
  return f && f.last || 0;
}
function scaleOf(state, month) {
  const s = state.meta?.scale;
  if (!s || !(Number(s.value) > 0)) return 1;
  if (!s.from) return Number(s.value);
  return String(month) >= String(s.from) ? Number(s.value) : 1;
}
function planFull(state, fund, month) {
  const k = scaleOf(state, month);
  if (fund.channel === "场外") {
    if (fund.daily > 0) return round0(fund.daily * daysOfMonth(state, month, fund) * k);
    return round0((fund.plan || 0) * k);
  }
  return round0((fund.plan || 0) * k);
}
function dueOf(state, fund, month) {
  return round0(planFull(state, fund, month) * (FACTOR[gearOf(state, fund.code, month)] ?? 0)) + extraDueOf(state, fund.code, month);
}
function extraDueOf(state, code, month) {
  let s = 0;
  for (const x of state.extra || []) {
    if (x.dest !== "spread" || !x.splits || !(x.splits[code] > 0)) continue;
    const n = Math.max(1, Math.round(Number(x.spreadMonths) || 1));
    const start = String(x.month || "");
    if (!start) continue;
    if (String(month) < start || String(month) >= addMonths(start, n)) continue;
    s += Number(x.splits[code]) / n;
  }
  return round0(s);
}
function addMonths(month, n) {
  const [y, m] = String(month).split("-").map(Number);
  const d = new Date(y, (m || 1) - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// src/core/side.js
function sideOf(state, code) {
  const ov = state.sideOverride && state.sideOverride[code];
  if (ov) return ov;
  const f = fundOf(state, code);
  return f && f.side || "进攻";
}
function monthActualByCode(state, month) {
  const out = {};
  const prefix = `${month}|`;
  for (const [key, rows] of Object.entries(state.records || {})) {
    if (!key.startsWith(prefix)) continue;
    for (const [code, r] of Object.entries(rows || {})) {
      if (r.sh == null || r.sh === "") continue;
      const f = fundOf(state, code);
      if (!f) continue;
      const px = r.px > 0 ? r.px : priceOf(state, code);
      out[code] = round2((out[code] || 0) + amountOf(f.channel, r.sh, px));
    }
  }
  return out;
}

// src/core/aggregate.js
function monthList(state) {
  const set = /* @__PURE__ */ new Set();
  for (const k of Object.keys(state.records || {})) set.add(parseBatchKey(k).month);
  for (const m of Object.keys(state.gears || {})) set.add(m);
  return [...set].sort();
}
function monthAgg(state, month) {
  const actual = monthActualByCode(state, month);
  const out = {};
  for (const f of state.funds.filter((x) => x.active !== false)) {
    let shares = 0;
    const prefix = `${month}|`;
    for (const [key, rows] of Object.entries(state.records || {})) {
      if (!key.startsWith(prefix)) continue;
      const r = rows[f.code];
      if (r && r.sh != null && r.sh !== "") shares += Number(r.sh) || 0;
    }
    out[f.code] = {
      name: f.name,
      code: f.code,
      planFull: planFull(state, f, month),
      due: dueOf(state, f, month),
      actual: round2(actual[f.code] || 0),
      shares: f.channel === "场外" ? 0 : shares,
      gear: gearOf(state, f.code, month),
      side: sideOf(state, f.code),
      price: priceOf(state, f.code)
    };
  }
  return out;
}
function monthTripleTrack(state, month) {
  const agg = monthAgg(state, month);
  const byCode = {};
  const total = { planFull: 0, due: 0, actual: 0, gearSaved: 0, execDiff: 0 };
  for (const [code, a] of Object.entries(agg)) {
    const gearSaved = round2(a.planFull - a.due);
    const execDiff = round2(a.actual - a.due);
    byCode[code] = { ...a, gearSaved, execDiff };
    total.planFull += a.planFull;
    total.due += a.due;
    total.actual += a.actual;
    total.gearSaved += gearSaved;
    total.execDiff += execDiff;
  }
  for (const k of Object.keys(total)) total[k] = round2(total[k]);
  total.surplus = round2((state.meta?.baseMonthly || 0) - total.due);
  return { byCode, total };
}
function cumTripleTrack(state) {
  const months = monthList(state);
  const total = { planFull: 0, due: 0, actual: 0, gearSaved: 0, execDiff: 0 };
  for (const m of months) {
    const t = monthTripleTrack(state, m).total;
    total.planFull += t.planFull;
    total.due += t.due;
    total.actual += t.actual;
    total.gearSaved += t.gearSaved;
    total.execDiff += t.execDiff;
  }
  for (const k of Object.keys(total)) total[k] = round2(total[k]);
  return { total, months };
}

// src/core/fingerprint.js
function canonicalJSON(v2) {
  if (v2 === void 0) return "null";
  if (v2 === null || typeof v2 !== "object") {
    const s = JSON.stringify(v2);
    return s === void 0 ? "null" : s;
  }
  if (Array.isArray(v2)) return `[${v2.map(canonicalJSON).join(",")}]`;
  const keys = Object.keys(v2).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalJSON(v2[k])}`).join(",")}}`;
}
function fnv1a(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}
function countEntries(state) {
  let n = 0;
  for (const rows of Object.values(state.records || {})) {
    n += Object.keys(rows || {}).length;
  }
  return n;
}
function fingerprint(state) {
  const s = canonicalJSON(state);
  let amount = 0;
  try {
    amount = cumTripleTrack(state).total.actual;
  } catch {
    amount = 0;
  }
  return {
    v: state._v ?? null,
    batches: Object.keys(state.records || {}).length,
    entries: countEntries(state),
    funds: (state.funds || []).length,
    amount: round2(amount),
    bytes: s.length,
    hash: fnv1a(s)
  };
}
function fpShort(fp2) {
  if (!fp2) return "—";
  return `${fp2.hash} · ${fp2.entries} 笔 · ${fp2.amount} 元`;
}
function verifyState(state) {
  const problems = [];
  if (!state || typeof state !== "object") {
    return { ok: false, problems: [{ level: "error", text: "数据不是对象，无法校验" }] };
  }
  if (!Array.isArray(state.funds)) {
    problems.push({ level: "error", text: "标的清单丢失（funds 不是数组）" });
  }
  if (state.records && typeof state.records !== "object") {
    problems.push({ level: "error", text: "买入记录结构损坏（records 不是对象）" });
  }
  if (!state.meta || typeof state.meta !== "object") {
    problems.push({ level: "error", text: "参数丢失（meta 不是对象）" });
  }
  if (problems.length) return { ok: false, problems };
  const codes = new Set((state.funds || []).map((f) => f.code));
  let badNum = 0;
  let orphan = 0;
  for (const [key, rows] of Object.entries(state.records || {})) {
    for (const [code, r] of Object.entries(rows || {})) {
      if (r == null || r.sh === "" || r.sh == null) continue;
      const sh = Number(r.sh);
      const px = Number(r.px);
      if (!Number.isFinite(sh) || r.px !== void 0 && r.px !== null && r.px !== "" && !Number.isFinite(px)) {
        badNum++;
      }
      if (!codes.has(code)) orphan++;
    }
  }
  if (badNum > 0) problems.push({ level: "error", text: `${badNum} 条记录的股数或价格不是有效数字` });
  if (orphan > 0) {
    problems.push({ level: "warn", text: `${orphan} 条记录的代码不在标的清单里（标的可能被删了）` });
  }
  let badGear = 0;
  for (const [month, map] of Object.entries(state.gears || {})) {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      badGear++;
      continue;
    }
    for (const g of Object.values(map || {})) {
      if (!GEARS.includes(g)) badGear++;
    }
  }
  if (badGear > 0) problems.push({ level: "error", text: `${badGear} 个档位值不合法（应为 满额/保守/减半/暂停/债券池 之一）` });
  let badLot = 0;
  let badPx = 0;
  let badKey = 0;
  let badBatch = 0;
  for (const [key, rows] of Object.entries(state.records || {})) {
    const [month, batch] = String(key).split("|");
    if (!/^\d{4}-\d{2}$/.test(month)) {
      badKey++;
      continue;
    }
    if (!BATCHES.includes(batch)) badBatch++;
    for (const [code, r] of Object.entries(rows || {})) {
      if (r == null || r.sh === "" || r.sh == null) continue;
      const f = (state.funds || []).find((x) => x.code === code);
      const sh = Number(r.sh);
      const px = Number(r.px);
      if (f && f.channel !== "场外") {
        if (!Number.isInteger(sh) || sh <= 0 || sh % LOT !== 0) badLot++;
      } else if (!(sh > 0)) {
        badLot++;
      }
      if (!(px > 0)) badPx++;
    }
  }
  if (badKey > 0) problems.push({ level: "error", text: `${badKey} 个批次键的月份格式不对（应为 2026-09）` });
  if (badBatch > 0) problems.push({ level: "error", text: `${badBatch} 个批次不属于 8日/22日/月结` });
  if (badLot > 0) problems.push({ level: "error", text: `${badLot} 条记录不是合法的买入量（场内必须是 100 的正整数倍）` });
  if (badPx > 0) problems.push({ level: "warn", text: `${badPx} 条记录没填价格（会退回用标的上次价估算）` });
  try {
    for (const m of monthList(state)) {
      const t = monthTripleTrack(state, m).total;
      if (Math.abs(t.actual - (t.due + t.execDiff)) > 0.02) {
        problems.push({ level: "error", text: `${m} 三轨对不上：实投 ${t.actual} ≠ 应投 ${t.due} + 执行差异 ${t.execDiff}` });
      }
      if (Math.abs(t.planFull - (t.due + t.gearSaved)) > 0.02) {
        problems.push({ level: "error", text: `${m} 档位对不上：满额 ${t.planFull} ≠ 应投 ${t.due} + 省下 ${t.gearSaved}` });
      }
    }
  } catch (e) {
    problems.push({ level: "error", text: `三轨校验跑不起来：${e.message}` });
  }
  for (const b of state.bond || []) {
    if (!b || b.dir !== "in" && b.dir !== "out" || !(Number(b.amount) > 0)) {
      problems.push({ level: "error", text: "债券池里有一条流水方向或金额不合法" });
      break;
    }
  }
  return { ok: problems.every((p2) => p2.level !== "error"), problems };
}
function verifySummary(state) {
  const r = verifyState(state);
  const fp2 = fingerprint(state);
  const errs = r.problems.filter((p2) => p2.level === "error");
  const warns = r.problems.filter((p2) => p2.level === "warn");
  return {
    ok: errs.length === 0,
    fp: fp2,
    errors: errs.map((p2) => p2.text),
    warns: warns.map((p2) => p2.text)
  };
}

// src/store/schema.js
function createMeta(o = {}) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const { sync, scale, ...rest } = o;
  return {
    createdAt: now,
    lastWriteAt: null,
    lastBackupAt: null,
    onboardingDone: false,
    baseMonthly: BASE_MONTHLY,
    bondInitial: BOND_INITIAL,
    backupRemindDays: BACKUP_REMIND_DAYS,
    gearEditLog: [],
    theme: "auto",
    /**
     * 定投金额拉条。value 是倍数（1 = 计划原样），from 是生效起始月。
     * 为什么必须带 from：改一次就把历史所有月的"应投"重算，去年那张季报的数字会变，
     * 账本就没有锚了。所以 from 之前的月份永远用旧值。
     */
    scale: { value: 1, from: "", ...scale || {} },
    // 同步锚点：只存"上次同步成功的时间与远端指纹"，不存 token（token 在独立键里）
    sync: { lastSyncAt: null, lastRemoteHash: null, gistId: "", ...sync || {} },
    ...rest
  };
}
function createDefaultState(o = {}) {
  return {
    _v: STATE_VERSION,
    meta: createMeta(o.meta),
    funds: o.funds ? o.funds : DEFAULT_FUNDS.map((f) => ({ ...f })),
    prices: o.prices || {},
    gears: o.gears || {},
    gearNotes: o.gearNotes || {},
    days: o.days || {},
    // 单标的某月的扣款天数覆盖（基金公司口径与你算的不一致时用）
    daysFund: o.daysFund || {},
    sideOverride: o.sideOverride || {},
    records: o.records || {},
    bond: o.bond || [],
    carryAdjust: o.carryAdjust || [],
    archived: o.archived || [],
    /**
     * 持仓覆盖层。自动汇总来自 records，这里只存"机器算不出来的部分"：
     * adj   = 对某标的累计投入的手工修正（在别处也买过同一只、或记录有漏）
     * extra = 计划外持仓（不在 8 个定投标的里，比如以前买的、家里给的）
     * gone  = 已清仓归档的（不再计入总额，但保留历史）
     */
    holdings: o.holdings || { adj: {}, extra: [], gone: [] },
    /**
     * 闲钱（一次性余钱）流水。
     * 与定投分开记：它是"额外的钱"，混进定投会掩盖真实的执行率。
     */
    extra: o.extra || [],
    /** 规则本覆盖层：星标 / 备注 / 改写 / 新增 / 隐藏。底本永远不动 */
    rules: o.rules || { stars: [], notes: {}, edits: {}, added: [], hidden: [] },
    /**
     * 月收入分配。数字一律留空等你自己填，不猜、不编。
     * months[YYYY-MM] = { income, need, want, save }
     */
    budget: o.budget || { months: {}, needCap: 0.5, wantCap: 0.3, saveMin: 0.2 },
    ui: o.ui || { lastView: "execute", lastMonth: null, lastBatch: null, dismissedBanners: [] }
  };
}
function createFund(o = {}) {
  return {
    id: `f${Date.now()}${Math.floor(Math.random() * 1e3)}`,
    code: "",
    name: "",
    channel: "场内",
    sector: "其他",
    plan: 0,
    daily: null,
    market: "",
    // 场内/境内场外为 ''；QDII 填 us / hk，决定扣款天数怎么算
    gear: "满额",
    split: false,
    side: "进攻",
    last: 0,
    active: true,
    order: 999,
    note: "",
    ...o
  };
}

// src/store/migrate.js
var isObj = (x) => x && typeof x === "object" && !Array.isArray(x);
function looksLikeV2(raw) {
  if (!isObj(raw)) return false;
  return "rec" in raw || "bond" in raw && Array.isArray(raw.bond) && raw.bond.some((b) => "m" in b);
}
function fromV2(raw) {
  const base = createDefaultState();
  const records = {};
  for (const [key, rows] of Object.entries(raw.rec || {})) {
    if (!isObj(rows)) continue;
    const out = {};
    for (const [code, r] of Object.entries(rows)) {
      if (r == null) continue;
      const sh = typeof r === "object" ? r.sh : r;
      if (sh == null || sh === "") continue;
      out[code] = {
        sh: Number(sh) || 0,
        px: Number(typeof r === "object" ? r.px : 0) || 0,
        at: typeof r === "object" && r.at || "",
        note: typeof r === "object" && r.note || ""
      };
    }
    if (Object.keys(out).length) records[key] = out;
  }
  const bond = (raw.bond || []).filter((b) => b && (b.a != null || b.amount != null)).map((b, i) => ({
    id: b.id || `b${i}`,
    month: b.m || b.month || "",
    dir: b.t === "出" || b.dir === "out" ? "out" : "in",
    amount: Number(b.a != null ? b.a : b.amount) || 0,
    source: b.source || "manual",
    note: b.note || "",
    at: b.at || ""
  }));
  const next = {
    ...base,
    _v: STATE_VERSION,
    meta: { ...base.meta, onboardingDone: true },
    records,
    bond,
    prices: isObj(raw.px) ? { ...raw.px } : {},
    gears: isObj(raw.gear) ? { ...raw.gear } : {},
    gearNotes: isObj(raw.note) ? { ...raw.note } : {},
    days: isObj(raw.days) ? { ...raw.days } : {},
    sideOverride: isObj(raw.side) ? { ...raw.side } : {}
  };
  const count = Object.values(records).reduce((a, r) => a + Object.keys(r).length, 0);
  return { state: next, warnings: [`已从旧版（v2）升级：${count} 条买入记录、${bond.length} 条债券池流水`] };
}
function ensureShape(state) {
  const base = createDefaultState();
  const out = { ...base, ...state };
  out._v = STATE_VERSION;
  out.meta = { ...base.meta, ...state.meta || {} };
  out.meta.sync = { ...base.meta.sync, ...isObj(state.meta?.sync) ? state.meta.sync : {} };
  out.meta.scale = { ...base.meta.scale, ...isObj(state.meta?.scale) ? state.meta.scale : {} };
  out.meta.gearEditLog = Array.isArray(out.meta.gearEditLog) ? out.meta.gearEditLog : [];
  out.funds = Array.isArray(state.funds) && state.funds.length ? state.funds.map((f) => ({ ...createFund(), ...f })) : base.funds;
  for (const k of ["prices", "gears", "gearNotes", "days", "sideOverride", "records", "daysFund"]) {
    out[k] = isObj(state[k]) ? state[k] : {};
  }
  for (const k of ["bond", "carryAdjust", "archived", "extra"]) {
    out[k] = Array.isArray(state[k]) ? state[k] : [];
  }
  out.holdings = {
    adj: isObj(state.holdings?.adj) ? state.holdings.adj : {},
    extra: Array.isArray(state.holdings?.extra) ? state.holdings.extra : [],
    gone: Array.isArray(state.holdings?.gone) ? state.holdings.gone : []
  };
  out.rules = {
    stars: Array.isArray(state.rules?.stars) ? state.rules.stars : [],
    notes: isObj(state.rules?.notes) ? state.rules.notes : {},
    edits: isObj(state.rules?.edits) ? state.rules.edits : {},
    added: Array.isArray(state.rules?.added) ? state.rules.added : [],
    hidden: Array.isArray(state.rules?.hidden) ? state.rules.hidden : []
  };
  out.budget = {
    months: isObj(state.budget?.months) ? state.budget.months : {},
    needCap: Number(state.budget?.needCap) || base.budget.needCap,
    wantCap: Number(state.budget?.wantCap) || base.budget.wantCap,
    saveMin: Number(state.budget?.saveMin) || base.budget.saveMin
  };
  out.ui = { ...base.ui, ...state.ui || {} };
  out.ui.dismissedBanners = Array.isArray(out.ui.dismissedBanners) ? out.ui.dismissedBanners : [];
  return out;
}
function migrate(raw) {
  if (!isObj(raw)) return { state: createDefaultState(), from: "empty", warnings: [] };
  if (looksLikeV2(raw)) {
    const r = fromV2(raw);
    return { state: ensureShape(r.state), from: "v2", warnings: r.warnings };
  }
  if (raw.state && isObj(raw.state)) {
    return { state: ensureShape(raw.state), from: `v${raw.state._v || "?"}`, warnings: [] };
  }
  const from = raw._v === STATE_VERSION ? "current" : `v${raw._v || "?"}`;
  const warnings = raw._v === STATE_VERSION ? [] : [`数据版本 ${raw._v || "未知"} → ${STATE_VERSION}，已自动补齐字段`];
  return { state: ensureShape(raw), from, warnings };
}

// src/store/backup.js
function parseBackup(text) {
  let o;
  try {
    o = JSON.parse(text);
  } catch {
    return { ok: false, reason: "这个文件不是有效的 JSON。请选择从本应用导出的 .json 备份文件。" };
  }
  if (!o || typeof o !== "object") {
    return { ok: false, reason: "文件内容为空或不是对象。请选择从本应用导出的 .json 备份文件。" };
  }
  const isObj2 = (x) => x && typeof x === "object" && !Array.isArray(x);
  let inner = null;
  if (isObj2(o.state)) inner = o.state;
  else if (o.records || o.funds || o.rec) inner = o;
  else {
    return { ok: false, reason: "这个文件不是定投工作台的备份（缺少 state 字段）。请选择从本应用导出的 .json 文件。" };
  }
  if (!inner.records && !inner.funds) {
    return { ok: false, reason: "这个文件缺少定投数据（records / funds）。请选择从本应用导出的 .json 文件。" };
  }
  const m = migrate(inner);
  return { ok: true, state: m.state, from: m.from, warnings: m.warnings };
}

// scripts/watchdog.mjs
var GIST_API = "https://api.github.com/gists";
var SCT_API = "https://sctapi.ftqq.com";
var GIST_FILE = "dingtou.json";
var GIST_ID = process.env.GIST_ID || "";
var GH_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "";
var SENDKEY = process.env.SENDKEY || "";
var FRESH_DAYS = Number(process.env.FRESH_DAYS || 14);
function die(msg) {
  console.error("[watchdog] " + msg);
  process.exit(1);
}
async function gistGet() {
  if (!GIST_ID || !GH_TOKEN) die("缺少 GIST_ID 或 GH_TOKEN，先去仓库 Secrets 里配置。");
  const res = await fetch(`${GIST_API}/${GIST_ID}`, {
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });
  if (res.status === 401) die("GitHub token 无效或过期，重新生成一个（只勾 gist 权限）。");
  if (res.status === 404) die("找不到这个 Gist，检查 GIST_ID。");
  if (!res.ok) die(`GitHub 返回 HTTP ${res.status}`);
  return res.json();
}
async function push(title, desp) {
  if (!SENDKEY) {
    console.warn("[watchdog] 未配置 SENDKEY，只在 Actions 里记录，不推微信：" + title);
    return false;
  }
  const body = new URLSearchParams({ title, desp });
  const res = await fetch(`${SCT_API}/${SENDKEY}.send`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!res.ok) {
    console.error(`[watchdog] Server酱推送失败 HTTP ${res.status}`);
    return false;
  }
  const j = await res.json().catch(() => ({}));
  if (j && j.code !== 0) {
    console.error(`[watchdog] Server酱返回错误：${JSON.stringify(j)}`);
    return false;
  }
  console.log(`[watchdog] 已推送告警：${title}`);
  return true;
}
function daysSince(iso, now = /* @__PURE__ */ new Date()) {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;
  return Math.floor((now.getTime() - t) / 864e5);
}
var gist = await gistGet();
var updatedAt = gist.updated_at;
var file = gist.files && gist.files[GIST_FILE];
if (!file || typeof file.content !== "string") {
  await push(
    "定投看门狗：云端备份文件不见了",
    `Gist 里没有 ${GIST_FILE}。可能被手动删了或改名了。
去工作台「设置 → 立即同步」重新推一份。`
  );
  die("gist 文件缺失");
}
var p = parseBackup(file.content);
if (!p.ok) {
  await push("定投看门狗：云端数据读不出来", p.reason + "\n\n快去工作台导出一份本机备份覆盖它。");
  die("远端数据解析失败");
}
var v = verifySummary(p.state);
var fp = fingerprint(p.state);
var age = daysSince(updatedAt);
var lines = [
  `指纹：${fpShort(fp)}`,
  `云端更新于：${updatedAt}（${age} 天前）`
];
var bad = false;
if (v.errors.length > 0) {
  bad = true;
  lines.push("", "**数据有问题：**", ...v.errors.map((e) => "- " + e));
}
if (v.warns.length > 0) lines.push("", "警告（不阻塞）：", ...v.warns.map((e) => "- " + e));
if (age !== null && age > FRESH_DAYS) {
  bad = true;
  lines.push("", `**${age} 天没有更新了。**两种可能：你很久没打开页面，或者同步坏了。打开页面看一眼。`);
}
if (bad) {
  const ok = await push("定投看门狗：" + (v.errors.length ? "数据有问题" : "该看一眼了"), lines.join("\n"));
  console.log(ok ? "已推送告警" : "告警推送失败（见上方日志）");
  die(lines.join("\n"));
}
console.log("[watchdog] 一切正常");
console.log(lines.join("\n"));
