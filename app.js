/* ═══════════════════════════════════════════════════
   MONETAG EARN PRO — Application v2
   Dark/Light Theme | Global Search | Service Worker
   Skeleton Loading | Toast | Modal | Push | Ads
   ═══════════════════════════════════════════════════ */
'use strict';

const App = (function() {
  const C = {
    zoneId: '4d812b3e49e9fbb4acd04dbca11b6193',
    ads: true,
    jobsPP: 8,
    debounceMs: 100,
  };

  /* ─── Utils ─── */
  const $ = (s, p=document) => (typeof s === 'string' ? p.querySelector(s) : s);
  const $$ = (s, p=document) => [...p.querySelectorAll(s)];
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const toast = (msg, type='info') => {
    const c = $('#toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>${msg}`;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(40px)'; t.style.transition = '300ms'; setTimeout(() => t.remove(), 300); }, 3000);
  };

  /* ─── Theme ─── */
  const Theme = {
    init() {
      this.btn = $('#theme-toggle');
      if (!this.btn) return;
      const saved = localStorage.getItem('theme');
      if (saved) document.documentElement.setAttribute('data-theme', saved);
      else if (window.matchMedia('(prefers-color-scheme: light)').matches) document.documentElement.setAttribute('data-theme', 'light');
      this.btn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      });
    }
  };

  /* ─── Monetag ─── */
  const Monetag = {
    init() { if (!C.ads) return; this._load('//cdn.monetag.com/v/2025.js','mt-main'); this._load('//cdn.monetag.com/p/2025.js','mt-push'); },
    _load(src, id) { if ($(`#${id}`)) return; const s = document.createElement('script'); s.id = id; s.src = src; s.async = true; s.setAttribute('data-zone', C.zoneId); document.head.appendChild(s); },
    initSlots() { if (!C.ads) return; $$('[data-ad-slot]').forEach(el => { const c = el.querySelector('.ad-container'); if (c && !c.children.length) c.innerHTML = '<!-- ad slot -->'; }); }
  };

  /* ─── Nav ─── */
  const Nav = {
    init() {
      this.toggle = $('.nav-toggle'); this.menu = $('.nav-list'); this.header = $('.header');
      if (!this.toggle || !this.menu) return;
      this.toggle.addEventListener('click', () => {
        const o = this.toggle.getAttribute('aria-expanded') === 'true';
        this.toggle.setAttribute('aria-expanded', String(!o));
        this.menu.classList.toggle('open');
        document.body.style.overflow = o ? '' : 'hidden';
      });
      $$('[data-nav]').forEach(l => l.addEventListener('click', () => this._close()));
      document.addEventListener('keydown', e => { if (e.key === 'Escape') this._close(); });
      const cb = () => this.header.classList.toggle('scrolled', window.scrollY > 50);
      window.addEventListener('scroll', cb, { passive: true }); cb();
    },
    _close() { if (!this.toggle) return; this.toggle.setAttribute('aria-expanded','false'); this.menu.classList.remove('open'); document.body.style.overflow = ''; }
  };

  /* ─── Reading Progress ─── */
  const Progress = {
    init() {
      this.bar = $('#progress-bar');
      if (!this.bar) return;
      window.addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const p = h > 0 ? Math.min((window.scrollY / h) * 100, 100) : 0;
        this.bar.style.width = p + '%';
        this.bar.setAttribute('aria-valuenow', Math.round(p));
      }, { passive: true });
    }
  };

  /* ─── Animated Counters ─── */
  const Counters = {
    init() {
      $$('.stat-value[data-count]').forEach(el => {
        const obs = new IntersectionObserver(([e]) => {
          if (e.isIntersecting) { this._run(el); obs.unobserve(el); }
        }, { threshold: 0.1 });
        obs.observe(el);
      });
    },
    _run(el) {
      const target = parseInt(el.dataset.count, 10);
      const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / 2000, 1);
        el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target).toLocaleString('en-IN');
        if (p < 1) requestAnimationFrame(tick); else el.textContent = target.toLocaleString('en-IN');
      };
      requestAnimationFrame(tick);
    }
  };

  /* ─── Scroll Animations ─── */
  const ScrollAnim = {
    init() {
      $$('.animate-on-scroll').forEach(el => {
        new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); this.obs.unobserve(el); }}, { threshold: 0.05 }).observe(el);
      });
    }
  };

  /* ─── Tabs ─── */
  const Tabs = {
    init() {
      $$('.tabs, .results-tabs').forEach(g => {
        $$('[role="tab"]', g).forEach(tab => {
          tab.addEventListener('click', () => {
            $$('[role="tab"]', g).forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
            tab.classList.add('active'); tab.setAttribute('aria-selected','true');
            const panel = $(`#${tab.getAttribute('aria-controls')}`);
            if (panel) { $$('[role="tabpanel"]', panel.closest('.tab-panels,.results-list') || panel.parentNode).forEach(p => p.classList.remove('active')); panel.classList.add('active'); }
          });
        });
      });
    }
  };

  /* ─── Data ─── */
  const Data = {
    schemes: [
      { title:'PM Kisan Samman Nidhi', desc:'₹6,000/year to farmer families. Direct bank transfer in 3 installments.', tag:'Central', icon:'leaf' },
      { title:'Ayushman Bharat', desc:'Health cover up to ₹5 lakh per family per year. Cashless treatment at empaneled hospitals.', tag:'Health', icon:'heart' },
      { title:'PM Awas Yojana', desc:'Housing for all by 2029. Interest subsidy on home loans up to ₹2.67 lakh.', tag:'Housing', icon:'home' },
      { title:'Ujjwala Yojana', desc:'Free LPG connections to below-poverty-line households. Clean cooking fuel.', tag:'Energy', icon:'flame' },
      { title:'Digital India', desc:'Digital infrastructure, e-governance, digital literacy for all citizens.', tag:'Tech', icon:'monitor' },
      { title:'Skill India Mission', desc:'Free skill training programs. Industry-recognized certificates.', tag:'Education', icon:'book' },
      { title:'PM Jan Dhan Yojana', desc:'Universal banking access. Zero-balance accounts, overdraft up to ₹10,000.', tag:'Finance', icon:'wallet' },
      { title:'Make in India', desc:'Manufacturing boost. Tax incentives, single-window clearance for businesses.', tag:'Industry', icon:'gear' },
      { title:'Startup India', desc:'Tax holidays, fund support, IPR benefits for registered startups.', tag:'Business', icon:'rocket' },
      { title:'PM Mudra Yojana', desc:'Loans up to ₹10 lakh for small businesses. Shishu, Kishor, Tarun categories.', tag:'Finance', icon:'banknote' },
      { title:'Swasth Bharat', desc:'Focus on preventive healthcare. Yoga, nutrition awareness, free health camps.', tag:'Health', icon:'heart-pulse' },
      { title:'Beti Bachao Beti Padhao', desc:'Save girl child, educate girl child. Awareness campaigns, financial incentives.', tag:'Social', icon:'users' },
    ],
    allItems: [],
    exams: {
      upsc: [
        { name:'UPSC Civil Services Prelims 2025', date:'June 15, 2025', vac:'1,056', status:'Open' },
        { name:'UPSC CAPF AC 2025', date:'August 10, 2025', vac:'187', status:'Open' },
        { name:'UPSC EPFO 2025', date:'September 21, 2025', vac:'576', status:'Open' },
        { name:'UPSC CMS 2025', date:'July 27, 2025', vac:'1,200', status:'Open' },
        { name:'UPSC NDA/NA II 2025', date:'September 7, 2025', vac:'485', status:'Open' },
        { name:'UPSC Combined Geo-Scientist', date:'October 2025', vac:'150', status:'Announced' },
      ],
      ssc: [
        { name:'SSC CGL Tier-I 2025', date:'June 20-30, 2025', vac:'18,000', status:'Open' },
        { name:'SSC CHSL 2025', date:'August 4-18, 2025', vac:'5,000', status:'Open' },
        { name:'SSC MTS 2025', date:'October 2025', vac:'15,000', status:'Announced' },
        { name:'SSC GD Constable 2025', date:'February 2026', vac:'25,000', status:'Announced' },
        { name:'SSC Stenographer 2025', date:'November 2025', vac:'2,500', status:'Announced' },
        { name:'SSC JE 2025', date:'December 2025', vac:'1,200', status:'Announced' },
      ],
      banking: [
        { name:'IBPS PO 2025', date:'October 2025', vac:'10,000', status:'Open' },
        { name:'IBPS Clerk 2025', date:'December 2025', vac:'18,000', status:'Open' },
        { name:'IBPS RRB 2025', date:'August 2025', vac:'12,000', status:'Open' },
        { name:'SBI PO 2025', date:'November 2025', vac:'3,500', status:'Announced' },
        { name:'RBI Grade B 2025', date:'September 2025', vac:'500', status:'Open' },
        { name:'NABARD Grade A/B 2025', date:'October 2025', vac:'200', status:'Announced' },
      ],
      railway: [
        { name:'RRB NTPC Graduate 2025', date:'July 2025', vac:'35,000', status:'Open' },
        { name:'RRB Group D 2025', date:'September 2025', vac:'50,000', status:'Open' },
        { name:'RRB ALP 2025', date:'November 2025', vac:'8,000', status:'Announced' },
        { name:'RRB JE 2025', date:'December 2025', vac:'12,000', status:'Announced' },
        { name:'RRB Paramedical 2025', date:'August 2025', vac:'2,000', status:'Open' },
      ],
      state: [
        { name:'UPPSC PCS 2025', date:'July 2025', vac:'1,500', status:'Open' },
        { name:'BPSC 69th Combined Competitive', date:'August 2025', vac:'2,000', status:'Open' },
        { name:'MPPSC State Service 2025', date:'September 2025', vac:'800', status:'Open' },
        { name:'RPSC RAS 2025', date:'October 2025', vac:'1,000', status:'Announced' },
        { name:'WBPSC Civil Service 2025', date:'July-Aug 2025', vac:'600', status:'Open' },
      ],
      defence: [
        { name:'Indian Army GD 2025', date:'August 2025', vac:'20,000', status:'Open' },
        { name:'Indian Navy SSR/AA 2025', date:'July 2025', vac:'3,000', status:'Open' },
        { name:'IAF Agniveer 2025', date:'September 2025', vac:'8,000', status:'Open' },
        { name:'Indian Coast Guard 2025', date:'October 2025', vac:'1,500', status:'Announced' },
      ],
    },
    jobs: [
      { title:'SSC CGL Recruitment 2025', org:'Staff Selection Commission', cat:'central', qual:'graduate', loc:'All India', last:'June 30, 2025', sal:'₹35,400-1,42,400', desc:'Combined Graduate Level exam for Group B & C posts across ministries.' },
      { title:'UPSC Civil Services 2025', org:'Union Public Service Commission', cat:'central', qual:'graduate', loc:'All India', last:'July 15, 2025', sal:'₹56,100-2,50,000', desc:'India\'s premier civil services exam for IAS, IPS, IFS & allied services.' },
      { title:'IBPS PO 2025', org:'Institute of Banking Personnel', cat:'banking', qual:'graduate', loc:'All India', last:'Aug 20, 2025', sal:'₹52,000-65,000', desc:'Probationary Officer recruitment for public sector banks.' },
      { title:'RRB NTPC Graduate 2025', org:'Railway Recruitment Board', cat:'railway', qual:'graduate', loc:'All India', last:'July 10, 2025', sal:'₹35,400-1,12,400', desc:'Non-Technical Popular Categories for Indian Railways.' },
      { title:'Indian Army GD 2025', org:'Indian Army', cat:'defence', qual:'10th', loc:'All India', last:'Aug 5, 2025', sal:'₹31,000-46,000', desc:'General Duty soldier recruitment in Indian Army.' },
      { title:'UPSC EPFO 2025', org:'EPFO', cat:'central', qual:'graduate', loc:'All India', last:'June 25, 2025', sal:'₹44,900-1,42,400', desc:'Enforcement Officer/Accountant in Employees Provident Fund Organization.' },
      { title:'SBI PO 2025', org:'State Bank of India', cat:'banking', qual:'graduate', loc:'All India', last:'Sep 1, 2025', sal:'₹48,480-68,300', desc:'Probationary Officer in India\'s largest bank.' },
      { title:'RRB Group D 2025', org:'Railway Recruitment Board', cat:'railway', qual:'10th', loc:'All India', last:'Aug 15, 2025', sal:'₹18,000-22,000', desc:'Level 1 posts in Indian Railways (Track Maintainer, Helper etc).' },
      { title:'CTET 2025', org:'CBSE', cat:'teaching', qual:'graduate', loc:'All India', last:'July 5, 2025', sal:'₹35,000-50,000', desc:'Central Teacher Eligibility Test for school teachers.' },
      { title:'PSU Recruitment 2025', org:'Various PSUs', cat:'psu', qual:'engineering', loc:'All India', last:'Oct 2025', sal:'₹60,000-1,80,000', desc:'Management trainee & executive posts in public sector undertakings.' },
      { title:'UPPSC PCS 2025', org:'Uttar Pradesh PSC', cat:'state', qual:'graduate', loc:'UP', last:'July 20, 2025', sal:'₹38,600-1,25,000', desc:'Provincial Civil Service for Uttar Pradesh.' },
      { title:'KVS TGT/PGT 2025', org:'KVS', cat:'teaching', qual:'postgraduate', loc:'All India', last:'Aug 10, 2025', sal:'₹35,400-1,12,400', desc:'Teacher recruitment in Kendriya Vidyalayas nationwide.' },
      { title:'NTPC Executive 2025', org:'NTPC Limited', cat:'psu', qual:'engineering', loc:'All India', last:'Sep 15, 2025', sal:'₹50,000-1,60,000', desc:'Executive engineer posts in India\'s largest power utility.' },
      { title:'IBPS Clerk 2025', org:'Institute of Banking Personnel', cat:'banking', qual:'12th', loc:'All India', last:'Oct 5, 2025', sal:'₹28,000-38,000', desc:'Clerical cadre recruitment for public sector banks.' },
      { title:'Indian Navy SSR 2025', org:'Indian Navy', cat:'defence', qual:'12th', loc:'All India', last:'July 25, 2025', sal:'₹30,000-48,000', desc:'Senior Secondary Recruit for technical & non-technical roles.' },
      { title:'MPPSC State Service 2025', org:'Madhya Pradesh PSC', cat:'state', qual:'graduate', loc:'MP', last:'Aug 30, 2025', sal:'₹38,600-1,25,000', desc:'State service examination for Madhya Pradesh.' },
    ],
    results: [
      { name:'UPSC Civil Services Prelims 2024', status:'declared', date:'May 15, 2025', desc:'Prelims result for CSE 2024 announced' },
      { name:'SSC CGL Tier-I 2024', status:'declared', date:'May 10, 2025', desc:'Tier-I result with cut-off marks released' },
      { name:'IBPS PO Prelims 2024', status:'declared', date:'Apr 28, 2025', desc:'Preliminary exam result declared' },
      { name:'RRB NTPC CBT-1 2024', status:'declared', date:'May 5, 2025', desc:'CBT-1 result with scorecard available' },
      { name:'UPPSC PCS Prelims 2024', status:'declared', date:'Apr 20, 2025', desc:'Preliminary exam result with cut-off' },
      { name:'SSC CHSL Tier-I 2025', status:'pending', date:'June 2025', desc:'Result awaited' },
      { name:'CTET January 2025', status:'declared', date:'Mar 15, 2025', desc:'CTET result with certificate available' },
      { name:'KVS TGT/PGT 2024-25', status:'pending', date:'June 2025', desc:'Result pending evaluation' },
      { name:'BPSC 68th Combined', status:'declared', date:'Apr 10, 2025', desc:'Bihar PSC 68th combined result out' },
      { name:'Indian Navy SSR 01/2024', status:'declared', date:'Mar 25, 2025', desc:'SSR written exam result declared' },
    ],
    admitCards: [
      { name:'SSC CGL Tier-I 2025', date:'June 15, 2025', exam:'SSC CGL 2025' },
      { name:'UPSC NDA/NA II 2024', date:'Sep 1, 2024', exam:'UPSC NDA 2024' },
      { name:'IBPS PO Prelims 2024', date:'Oct 15, 2024', exam:'IBPS PO 2024' },
      { name:'RRB NTPC CBT-2 2024', date:'Nov 10, 2024', exam:'RRB NTPC 2024' },
      { name:'CTET January 2025', date:'Jan 10, 2025', exam:'CTET 2025' },
      { name:'UPPSC PCS 2025', date:'July 5, 2025', exam:'UPPSC PCS 2025' },
    ],
    answerKeys: [
      { name:'UPSC Civil Services Prelims 2024', date:'June 1, 2024', exam:'UPSC CSE 2024' },
      { name:'SSC CGL Tier-I 2024', date:'Oct 15, 2024', exam:'SSC CGL 2024' },
      { name:'IBPS PO Prelims 2024', date:'Nov 5, 2024', exam:'IBPS PO 2024' },
      { name:'CTET January 2025', date:'Feb 15, 2025', exam:'CTET 2025' },
      { name:'UPPSC PCS Prelims 2024', date:'Jan 10, 2025', exam:'UPPSC 2024' },
      { name:'RRB NTPC CBT-1 2024', date:'Dec 20, 2024', exam:'RRB NTPC 2024' },
    ],
  };

  /* Build search index */
  Data.schemes.forEach(s => Data.allItems.push({ type:'scheme', title:s.title, desc:s.desc, tag:s.tag }));
  Object.entries(Data.exams).forEach(([k,vs]) => vs.forEach(v => Data.allItems.push({ type:'exam', title:v.name, desc:`${v.date} • ${v.vac} vacancies`, tag:k.toUpperCase() })));
  Data.jobs.forEach(j => Data.allItems.push({ type:'job', title:j.title, desc:`${j.org} • ${j.loc} • ${j.sal}`, tag:j.cat }));
  Data.results.forEach(r => Data.allItems.push({ type:'result', title:r.name, desc:r.desc, tag:r.status }));

  /* ─── Icons ─── */
  const Icons = {
    leaf:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C8 7 8 13 12 18M12 2C16 7 16 13 12 18M12 2v16"/></svg>',
    heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 000-7.8z"/></svg>',
    home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 10l9-7 9 7v11h-7v-7h-4v7H3V10z"/></svg>',
    flame:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C8 8 4 12 4 16a8 8 0 1016 0c0-4-4-8-8-14z"/></svg>',
    monitor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
    wallet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2v-2"/><path d="M3 10V6a2 2 0 012-2h14a2 2 0 012 2v2"/><circle cx="17" cy="15" r="1"/></svg>',
    gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
    rocket:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 15l-3-3m0 0l3-3m-3 3H3m12-4.5V3m0 0l-2.5 2.5M15 3l2.5 2.5M21 12h-3m0 0l-3 3m3-3l-3-3"/></svg>',
    banknote:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></svg>',
    'heart-pulse':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 14c1.5-1.5 2.5-3 2.5-4.5A4.5 4.5 0 0017 5c-1.5 0-2.8.7-3.5 1.7L12 8.5l-1.5-1.8C9.8 5.7 8.5 5 7 5a4.5 4.5 0 00-4.5 4.5c0 1.5 1 3 2.5 4.5l7 7 7-7z"/></svg>',
    users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><circle cx="16" cy="7" r="4"/></svg>',
  };

  /* ─── Render ─── */
  const Render = {
    schemes() {
      const grid = $('#schemes-grid'), skel = $('#schemes-skeleton');
      setTimeout(() => {
        if (skel) skel.hidden = true;
        if (!grid) return;
        grid.hidden = false;
        grid.innerHTML = Data.schemes.map(s => `
          <div class="card glass glass-hover" role="listitem" tabindex="0">
            <div class="card-icon">${Icons[s.icon] || ''}</div>
            <h3 class="card-title">${s.title}</h3>
            <p class="card-desc">${s.desc}</p>
            <span class="card-tag">${s.tag}</span>
            <span class="card-link" onclick="App.showToast('Details coming soon','info')">Learn More</span>
          </div>
        `).join('');
      }, 400);
    },
    exams() {
      Object.entries(Data.exams).forEach(([k,vs]) => {
        const c = $(`#exams-${k}`);
        if (!c) return;
        c.innerHTML = vs.map(e => `
          <a href="#" class="exam-item" onclick="event.preventDefault();App.showToast('${e.name} — More details coming','info');return false">
            <div class="exam-info">
              <div class="exam-name">${e.name}</div>
              <div class="exam-meta"><span>📅 ${e.date}</span><span>👥 ${e.vac} vacancies</span><span>${e.status === 'Open' ? '✅ Open' : '📢 Announced'}</span></div>
            </div>
            <span class="exam-action">Apply →</span>
          </a>
        `).join('');
      });
    },
    jobs() { this._renderJobs(Data.jobs.slice(0, C.jobsPP)); this._filters(); this._loadMore(); },
    _renderJobs(jobs) {
      const grid = $('#jobs-grid'), skel = $('#jobs-skeleton');
      if (!grid) return;
      if (skel) skel.hidden = true;
      grid.hidden = false;
      grid.innerHTML = jobs.map((j,i) => `
        <div class="job-card" role="listitem" tabindex="0" data-idx="${i}" data-cat="${j.cat}" data-qual="${j.qual}">
          <div class="job-logo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg></div>
          <div class="job-info">
            <div class="job-title">${j.title}</div>
            <div class="job-details"><span>🏢 ${j.org}</span><span>📍 ${j.loc}</span><span>💰 ${j.sal}</span></div>
          </div>
          <span class="job-deadline">⏰ ${j.last}</span>
        </div>
      `).join('');
      // Click to open modal
      $$('.job-card', grid).forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.dataset.idx, 10);
          const job = this._getFilteredJobs()[idx];
          if (job) openJobModal(job);
        });
      });
      const lm = $('#load-more-jobs');
      if (lm) lm.style.display = jobs.length >= this._getFilteredJobs().length ? 'none' : '';
      $('#job-count-badge').textContent = this._getFilteredJobs().length;
    },
    _getFilteredJobs() {
      const cat = $('#filter-category')?.value || '';
      const qual = $('#filter-qualification')?.value || '';
      const search = ($('#filter-search')?.value || '').toLowerCase();
      return Data.jobs.filter(j => (!cat || j.cat === cat) && (!qual || j.qual === qual) && (!search || j.title.toLowerCase().includes(search) || j.org.toLowerCase().includes(search)));
    },
    _filters() {
      ['filter-category','filter-qualification','filter-search'].forEach(id => {
        const el = $(`#${id}`);
        if (!el) return;
        el.addEventListener('input', debounce(() => { this._renderJobs(this._getFilteredJobs().slice(0, C.jobsPP)); }, 150));
      });
      const r = $('#filter-reset');
      if (r) r.addEventListener('click', () => { $('#filter-category').value = ''; $('#filter-qualification').value = ''; $('#filter-search').value = ''; this._renderJobs(Data.jobs.slice(0, C.jobsPP)); });
    },
    _loadMore() {
      const lm = $('#load-more-jobs');
      if (!lm) return;
      lm.addEventListener('click', () => {
        const cur = $$('.job-card').length;
        this._renderJobs(this._getFilteredJobs().slice(0, cur + C.jobsPP));
      });
    },
    results() {
      const list = $('#results-list');
      if (!list) return;
      list.innerHTML = Data.results.map(r => `
        <a href="#" class="result-item" onclick="event.preventDefault();App.showToast('${r.name}','info');return false">
          <div class="exam-info"><div class="exam-name">${r.name}</div><div class="exam-meta"><span>📅 ${r.date}</span></div></div>
          <span class="result-status ${r.status}">${r.status === 'declared' ? '✅ Declared' : '⏳ Pending'}</span>
        </a>
      `).join('');
    },
    admitCards() {
      const grid = $('#admit-grid');
      if (!grid) return;
      grid.innerHTML = Data.admitCards.map(a => `
        <div class="card glass glass-hover" tabindex="0" onclick="App.showToast('Download link coming soon','info')">
          <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></div>
          <h3 class="card-title">${a.name}</h3>
          <p class="card-desc">Exam: ${a.exam}<br>Available: ${a.date}</p>
          <span class="card-link">Download →</span>
        </div>
      `).join('');
    },
    answerKeys() {
      const grid = $('#answer-grid');
      if (!grid) return;
      grid.innerHTML = Data.answerKeys.map(a => `
        <div class="card glass glass-hover" tabindex="0" onclick="App.showToast('Answer key link coming soon','info')">
          <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div>
          <h3 class="card-title">${a.name}</h3>
          <p class="card-desc">Exam: ${a.exam}<br>Released: ${a.date}</p>
          <span class="card-link">View →</span>
        </div>
      `).join('');
    },
  };

  /* ─── Global Search ─── */
  const Search = {
    init() {
      this.overlay = $('#search-overlay');
      this.input = $('#search-input');
      this.results = $('#search-results');
      this.empty = $('#search-empty');
      if (!this.overlay || !this.input) return;

      $('#search-trigger')?.addEventListener('click', () => this.open());
      $('#search-close')?.addEventListener('click', () => this.close());

      document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); this.toggle(); }
        if (e.key === 'Escape' && !this.overlay.hidden) this.close();
      });

      this.input.addEventListener('input', debounce(() => this._search(), 200));
      this.input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const first = $('.search-result-item', this.results);
          if (first) first.click();
        }
      });
    },

    open() { this.overlay.hidden = false; this.input.value = ''; this.results.innerHTML = ''; this.empty.hidden = false; setTimeout(() => this.input.focus(), 100); document.body.style.overflow = 'hidden'; },
    close() { this.overlay.hidden = true; document.body.style.overflow = ''; },
    toggle() { this.overlay.hidden ? this.open() : this.close(); },

    _search() {
      const q = this.input.value.trim().toLowerCase();
      if (!q) { this.results.innerHTML = ''; this.empty.hidden = false; return; }
      this.empty.hidden = true;

      const matches = Data.allItems.filter(i =>
        i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q) || (i.tag && i.tag.toLowerCase().includes(q))
      ).slice(0, 20);

      if (!matches.length) { this.results.innerHTML = `<div class="search-empty"><p>No results found for "${q}"</p></div>`; return; }

      this.results.innerHTML = matches.map((m, idx) => {
        const icons = { scheme:'📋', exam:'📝', job:'💼', result:'🏆' };
        return `<div class="search-result-item" role="option" tabindex="0" data-idx="${idx}">
          <div class="search-result-title">${icons[m.type] || '•'} ${this._highlight(m.title, q)}</div>
          <div class="search-result-desc">${this._highlight(m.desc, q)}</div>
          <span class="search-result-tag">${m.tag}</span>
        </div>`;
      }).join('');

      $$('.search-result-item', this.results).forEach(el => {
        el.addEventListener('click', () => { this.close(); toast(`Opening: ${matches[parseInt(el.dataset.idx, 10)].title}`, 'info'); });
        el.addEventListener('keydown', e => { if (e.key === 'Enter') el.click(); });
      });
    },

    _highlight(text, q) {
      if (!q) return text;
      const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(re, '<strong style="color:var(--text-primary)">$1</strong>');
    }
  };

  /* ─── Job Modal ─── */
  function openJobModal(job) {
    const modal = $('#job-modal'), body = $('#modal-body');
    if (!modal || !body) return;
    body.innerHTML = `
      <div style="margin-bottom:var(--space-lg)"><h2 style="font-size:1.3rem;font-weight:700;margin-bottom:var(--space-xs)">${job.title}</h2>
      <p style="color:var(--text-secondary);font-size:0.9rem">${job.org}</p></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);margin-bottom:var(--space-lg)">
        <div class="glass" style="padding:var(--space-md);border-radius:var(--radius-sm)"><small style="color:var(--text-tertiary)">Category</small><div style="font-weight:600;text-transform:capitalize">${job.cat}</div></div>
        <div class="glass" style="padding:var(--space-md);border-radius:var(--radius-sm)"><small style="color:var(--text-tertiary)">Qualification</small><div style="font-weight:600;text-transform:capitalize">${job.qual}</div></div>
        <div class="glass" style="padding:var(--space-md);border-radius:var(--radius-sm)"><small style="color:var(--text-tertiary)">Location</small><div style="font-weight:600">${job.loc}</div></div>
        <div class="glass" style="padding:var(--space-md);border-radius:var(--radius-sm)"><small style="color:var(--text-tertiary)">Salary</small><div style="font-weight:600">${job.sal}</div></div>
      </div>
      <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:var(--space-lg);line-height:1.6">${job.desc || ''}</p>
      <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap">
        <button class="btn btn-primary glass" onclick="App.showToast('Application link coming soon','success')">Apply Now</button>
        <button class="btn btn-secondary glass" onclick="App.showToast('Saved to bookmarks','success')">Save</button>
      </div>
      <p style="margin-top:var(--space-md);font-size:0.8rem;color:var(--text-tertiary)">⏰ Last Date: ${job.last}</p>
    `;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.addEventListener('click', e => { if (e.target === modal) closeJobModal(); }, { once: true });
    const c = $('#modal-close'); if (c) { c.onclick = closeJobModal; c.focus(); }
    document.addEventListener('keydown', _closeOnEsc = e => { if (e.key === 'Escape') closeJobModal(); });
  }

  function closeJobModal() {
    const modal = $('#job-modal');
    if (modal) modal.hidden = true;
    document.body.style.overflow = '';
    if (typeof _closeOnEsc === 'function') document.removeEventListener('keydown', _closeOnEsc);
  }

  /* ─── Back to Top ─── */
  const BackTop = {
    init() {
      this.btn = $('#back-to-top');
      if (!this.btn) return;
      window.addEventListener('scroll', () => { this.btn.hidden = window.scrollY < 400; }, { passive: true });
      this.btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  };

  /* ─── Newsletter ─── */
  const Newsletter = {
    init() {
      const form = $('#newsletter-form');
      if (!form) return;
      form.addEventListener('submit', e => {
        e.preventDefault();
        const email = ($('#email')?.value || '').trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast('Please enter a valid email', 'error'); return; }
        toast('✓ Subscribed successfully!', 'success');
        $('#email').value = '';
      });
    }
  };

  /* ─── Push Prompt ─── */
  const PushPrompt = {
    init() {
      const p = $('#push-prompt');
      if (!p || localStorage.getItem('push-dismissed')) return;
      setTimeout(() => { p.removeAttribute('hidden'); }, 5000);
      $('#push-allow')?.addEventListener('click', () => { p.setAttribute('hidden',''); localStorage.setItem('push-dismissed','true'); });
      $('#push-deny')?.addEventListener('click', () => { p.setAttribute('hidden',''); localStorage.setItem('push-dismissed','true'); });
    }
  };

  /* ─── Service Worker ─── */
  const SW = {
    init() {
      if (!('serviceWorker' in navigator)) return;
      window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
    }
  };

  /* ─── Init ─── */
  function init() {
    Theme.init();
    Nav.init();
    Progress.init();
    ScrollAnim.init();
    Tabs.init();
    Render.schemes();
    Render.exams();
    Render.jobs();
    Render.results();
    Render.admitCards();
    Render.answerKeys();
    Counters.init();
    Search.init();
    BackTop.init();
    Newsletter.init();
    PushPrompt.init();
    Monetag.init();
    Monetag.initSlots();
    SW.init();
    console.log('Sarkari Suvidha Pro — v2 Initialized ✓');
  }

  /* Public API */
  const App = {
    init,
    showToast: toast,
    closeJobModal,
    openJobModal,
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  return App;
})();
