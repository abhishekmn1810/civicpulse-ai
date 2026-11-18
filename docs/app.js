(() => {
  const D = window.SAMPLE, KEY = 'civicpulse-proto-v1';
  let S = D.complaints.map(c => ({ ...c }));
  try { const j = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(j) && j.length === S.length) S = j; } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const $ = s => document.querySelector(s), app = $('#app');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const cls = s => s.replace(/ /g, '-'), tag = (t, c) => `<span class="tag ${cls(c || t)}">${esc(t)}</span>`;
  const pr = c => c.final || c.ai, isOpen = c => c.status !== 'Resolved';
  const fd = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const opts = (arr, sel, all) => (all ? `<option value="">${all}</option>` : '') + arr.map(a => `<option ${a === sel ? 'selected' : ''}>${esc(a)}</option>`).join('');
  const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); setTimeout(() => t.classList.remove('on'), 1800); };
  const F = { q: '', type: '', ward: '', sentiment: '', pr: '', dept: '', status: '' };
  const rank = { Urgent: 0, High: 1, Medium: 2, Low: 3 };

  function dashboard() {
    const open = S.filter(isOpen), urgent = open.filter(c => pr(c) === 'Urgent');
    const wk = Array(12).fill(0), now = Date.now();
    S.forEach(c => { const w = Math.floor((now - new Date(c.date)) / 6048e5); if (w < 12) wk[11 - w]++; });
    const max = Math.max(...wk, 1), pts = wk.map((v, i) => [30 + i * 50, 140 - v / max * 110]);
    const line = `<svg viewBox="0 0 620 175" role="img" aria-label="Complaints per week for the last 12 weeks"><path d="M30 140H600" stroke="#d9e0ea"/>${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="4" fill="#14305a"><title>${wk[i]} complaints</title></circle><text x="${x}" y="${y - 9}" text-anchor="middle">${wk[i]}</text><text x="${x}" y="158" text-anchor="middle">${i === 11 ? 'This wk' : '-' + (11 - i) + 'w'}</text>`).join('')}<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="#14305a" stroke-width="2.5"/></svg>`;
    const cat = D.types.map(t => [t, S.filter(c => c.type === t).length]), cm = Math.max(...cat.map(c => c[1]));
    const sc = { Negative: '#d9701f', Neutral: '#9aa6b5', Positive: '#2e8b57' }, sn = D.sentiments.map(x => [x, S.filter(c => c.sentiment === x).length]);
    const wards = D.wards.map(w => { const o = open.filter(c => c.ward === w), top = D.types.map(t => [t, o.filter(c => c.type === t).length]).sort((a, b) => b[1] - a[1])[0]; return { w, n: o.length, u: o.filter(c => pr(c) === 'Urgent').length, top }; }), wm = Math.max(...wards.map(x => x.n), 1);
    app.innerHTML = `<h1>Dashboard</h1><p class="sub">Overview of fictional sample complaints for staff review.</p>
    <div class="grid g4"><div class="card stat"><b>${S.length}</b><span>Total complaints</span></div><div class="card stat o"><b>${open.length}</b><span>Open issues</span></div><div class="card stat r"><b>${urgent.length}</b><span>Urgent open issues (current priority)</span></div><div class="card stat g"><b>${S.length - open.length}</b><span>Resolved</span></div></div>
    <div class="grid g2" style="margin-top:14px"><section class="card"><h2>Complaints per week</h2>${line}</section>
    <section class="card"><h2>Issue categories</h2>${cat.map(([t, n]) => `<div class="bar"><span>${t}</span><i style="width:${n / cm * 100}%"></i><em>${n}</em></div>`).join('')}</section>
    <section class="card"><h2>Sentiment</h2><div class="stack" role="img" aria-label="Sentiment split">${sn.map(([x, n]) => `<span style="width:${n / S.length * 100}%;background:${sc[x]}"></span>`).join('')}</div><div class="legend">${sn.map(([x, n]) => `<span><i class="dot" style="background:${sc[x]}"></i>${x}: ${n} (${Math.round(n / S.length * 100)}%)</span>`).join('')}</div></section>
    <section class="card"><h2>Ward hotspots (open issues)</h2><div class="wards">${wards.map(x => { const a = x.n / wm, dark = a > .55; return `<button class="ward" data-ward="${esc(x.w)}" style="background:rgba(217,112,31,${(a * .75).toFixed(2)});${dark ? 'color:#fff;--ward-mut:#fff' : ''}"><b>${esc(x.w)}</b><strong>${x.n}</strong><span>${x.u} urgent · top: ${x.top[0]}</span></button>`; }).join('')}</div><p class="key">Schematic ward tiles (no real map). Darker orange = more open issues. Select a ward to see its complaints.</p></section></div>`;
  }

  function filtered() {
    const q = F.q.toLowerCase();
    return S.filter(c => (!q || (c.id + c.text + c.loc + c.type).toLowerCase().includes(q)) && (!F.type || c.type === F.type) && (!F.ward || c.ward === F.ward) && (!F.sentiment || c.sentiment === F.sentiment) && (!F.pr || pr(c) === F.pr) && (!F.dept || (c.dept || '(none)') === F.dept) && (!F.status || c.status === F.status))
      .sort((a, b) => (isOpen(b) - isOpen(a)) || rank[pr(a)] - rank[pr(b)] || b.reports - a.reports);
  }
  function rows() {
    const l = filtered(); $('#count').textContent = `${l.length} of ${S.length} complaints`;
    $('#rows').innerHTML = l.length ? l.map(c => `<a class="row" href="#/complaints/${c.id}"><span><b>${c.id}</b><small>${fd(c.date)}</small></span><span>${esc(c.text)}<small>${c.type} · ${esc(c.loc)}</small></span><span>${tag(c.sentiment)}${c.reports > 1 ? `<span class="tag rep" title="Repeat reports">${c.reports} reports</span>` : ''}</span><span>${tag(pr(c))}${c.final ? '<small>Staff set</small>' : '<small>AI suggested</small>'}</span><span>${tag(c.status)}</span><span><small>${esc(c.dept || 'Unassigned')}</small></span></a>`).join('') : '<div class="empty">No complaints match these filters. Try clearing a filter.</div>';
  }
  function list() {
    const f = (k, label, arr, all) => `<div><label for="f-${k}">${label}</label><select id="f-${k}" data-f="${k}">${opts(arr, F[k], all)}</select></div>`;
    app.innerHTML = `<h1>Complaints</h1><p class="sub">Search and filter sample complaints. Priority shown is the AI suggestion until staff set a final priority.</p>
    <div class="filters"><div><label for="f-q">Search</label><input id="f-q" data-f="q" type="search" placeholder="ID, keyword, location" value="${esc(F.q)}"></div>${f('type', 'Issue type', D.types, 'All types')}${f('ward', 'Ward / location', D.wards, 'All wards')}${f('sentiment', 'Sentiment', D.sentiments, 'All')}${f('pr', 'Urgency', D.priorities, 'All')}${f('dept', 'Department', [...D.depts, '(none)'], 'All departments')}${f('status', 'Status', D.statuses, 'All')}<div style="align-self:end"><button class="btn alt" id="reset">Clear filters</button></div></div>
    <p id="count" class="sub" role="status"></p><div class="card list"><div class="row h"><span>ID / date</span><span>Complaint</span><span>Sentiment</span><span>Priority</span><span>Status</span><span>Department</span></div><div id="rows"></div></div>`;
    rows();
  }

  function detail(id) {
    const c = S.find(x => x.id === id); if (!c) { app.innerHTML = '<div class="empty">Complaint not found. <a href="#/complaints">Back to list</a></div>'; return; }
    app.innerHTML = `<p><a href="#/complaints">← Back to complaints</a></p><h1>${c.id}: ${c.type}</h1><p class="sub">${tag(pr(c))}${tag(c.status)}${tag(c.sentiment)}${c.reports > 1 ? `<span class="tag rep">${c.reports} repeat reports</span>` : ''}${c.reviewed ? tag('Staff reviewed', 'Resolved') : tag('Awaiting staff review', 'High')}</p>
    <div class="grid g2"><div class="grid" style="align-content:start"><section class="card"><h2>Complaint (fictional sample)</h2><p style="margin-top:0">${esc(c.text)}</p><dl><dt>Issue type</dt><dd>${c.type}</dd><dt>Location</dt><dd>${esc(c.loc)}</dd><dt>Date reported</dt><dd>${fd(c.date)}</dd><dt>Sentiment</dt><dd>${c.sentiment}</dd><dt>Reports</dt><dd>${c.reports} (including repeats at this location)</dd></dl></section>
    <section class="card ai"><h2>AI suggestion (simulated)</h2><dl><dt>Category</dt><dd>${c.type}</dd><dt>Priority</dt><dd>${c.ai}</dd><dt>Department</dt><dd>${esc(c.aiDept)}</dd><dt>Confidence</dt><dd>${c.confidence}% (mock value)</dd></dl><div class="note"><b>AI classifications are suggestions only.</b> Staff must review this complaint and make all final decisions on category, priority, department and status.</div></section></div>
    <section class="card"><h2>Staff review</h2><div class="field"><label for="d">Assigned department</label><select id="d">${opts(D.depts, c.dept, 'Unassigned')}</select></div><div class="field"><label for="s">Status</label><select id="s">${opts(D.statuses, c.status)}</select></div><div class="field"><label for="p">Final priority (AI suggested: ${c.ai})</label><select id="p">${opts(D.priorities, pr(c))}</select></div><div class="field"><label for="n">Add internal note</label><textarea id="n" rows="3" placeholder="Visible to staff only. Do not enter personal information."></textarea></div><button class="btn" id="save">Save staff decision</button>
    <ul class="nl">${c.notes.length ? c.notes.map(n => `<li>${esc(n.t)}<br><small>${n.d} · Staff (demo)</small></li>`).join('') : '<li><small>No internal notes yet.</small></li>'}</ul></section></div>`;
    $('#save').onclick = () => {
      c.dept = $('#d').value; c.status = $('#s').value; const p = $('#p').value; c.final = p === c.ai ? '' : p; c.reviewed = true;
      const n = $('#n').value.trim(); if (n) c.notes.unshift({ t: n, d: new Date().toLocaleString('en-IN') });
      save(); toast('Staff decision saved'); detail(id);
    };
  }

  function route() {
    const [v, id] = (location.hash.slice(2) || 'dashboard').split('/');
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === (v === 'complaints' ? 'complaints' : 'dashboard')));
    v === 'complaints' ? (id ? detail(id) : list()) : dashboard();
    window.scrollTo(0, 0);
  }
  app.addEventListener('click', e => {
    const w = e.target.closest('[data-ward]'); if (w) { Object.keys(F).forEach(k => F[k] = ''); F.ward = w.dataset.ward; location.hash = '#/complaints'; }
    if (e.target.id === 'reset') { Object.keys(F).forEach(k => F[k] = ''); list(); }
  });
  app.addEventListener('input', e => { const k = e.target.dataset.f; if (k) { F[k] = e.target.value; rows(); } });
  window.addEventListener('hashchange', route); route();
})();
