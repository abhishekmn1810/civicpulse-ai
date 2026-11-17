// SAMPLE DATA ONLY: fictional complaints generated with a seeded random generator.
// "AI" suggestions below are pre-computed mock values; no model or external service is used.
(() => {
  let s = 11; const r = () => (s = s * 16807 % 2147483647) / 2147483647, p = a => a[Math.floor(r() * a.length)];
  const T = {
    Roads: ['Roads & Engineering', [['Deep pothole at the junction; two-wheelers are swerving into traffic', 'Negative', 'Urgent'], ['Road surface broken up after the recent rain', 'Negative', 'High'], ['Faded zebra crossing near the school needs repainting', 'Neutral', 'Medium'], ['Resurfacing was finished quickly and neatly, thank you', 'Positive', 'Low']]],
    Garbage: ['Solid Waste Management', [['Garbage not collected for several days; overflowing bins attract stray animals', 'Negative', 'High'], ['Waste dumped beside the market lane, strong smell', 'Negative', 'Medium'], ['Please add a second collection time for our lane', 'Neutral', 'Low'], ['Collection crew was prompt and the lane is clean now', 'Positive', 'Low']]],
    Water: ['Water Supply', [['Main pipeline leaking, water running onto the road all day', 'Negative', 'Urgent'], ['Very low water pressure during the morning supply', 'Negative', 'High'], ['Will the supply timing change next month?', 'Neutral', 'Low'], ['Supply restored quickly after repair, appreciated', 'Positive', 'Low']]],
    Drainage: ['Drainage & Sewerage', [['Sewage overflowing near homes after rain; health risk', 'Negative', 'Urgent'], ['Blocked storm drain causing waterlogging at the crossing', 'Negative', 'High'], ['Manhole cover slightly loose, please inspect', 'Neutral', 'Medium'], ['Drain cleaning was done before monsoon, thanks to the team', 'Positive', 'Low']]],
    Streetlights: ['Electrical (Streetlights)', [['Streetlights out along the whole stretch, unsafe at night', 'Negative', 'High'], ['Light flickers near the bus stop', 'Neutral', 'Medium'], ['Lamp pole leaning with exposed wires', 'Negative', 'Urgent'], ['New LED lights make the road feel much safer', 'Positive', 'Low']]]
  };
  const wards = ['Ward 1 – Sample North', 'Ward 2 – Sample Market', 'Ward 3 – Sample Station', 'Ward 4 – Sample Riverside', 'Ward 5 – Sample Campus', 'Ward 6 – Sample East', 'Ward 7 – Sample Industrial', 'Ward 8 – Sample Outskirts'];
  const spots = ['Main Road', 'Society Gate', 'Market Lane', 'School Circle', 'Temple Chowk', 'Bus Stop'];
  const complaints = [];
  for (let i = 0; i < 72; i++) {
    const t = p(Object.keys(T)), dept = T[t][0], [text, sentiment, ai0] = p(T[t][1]);
    const ward = r() < .3 ? wards[1] : p(wards), reports = sentiment === 'Positive' ? 1 : 1 + Math.floor(r() * r() * 7);
    const age = Math.floor(r() * 84);
    const status = sentiment === 'Positive' ? 'Resolved' : age > 40 ? p(['Resolved', 'Resolved', 'In progress', 'Assigned']) : p(['New', 'New', 'In review', 'Assigned', 'In progress', 'Resolved']);
    complaints.push({ id: 'CP-' + (1001 + i), type: t, ward, loc: p(spots) + ', ' + ward.split(' – ')[1], date: new Date(Date.now() - age * 864e5).toISOString().slice(0, 10), text, sentiment, ai: reports >= 5 && ai0 === 'High' ? 'Urgent' : ai0, confidence: 70 + Math.floor(r() * 26), reports, aiDept: dept, dept: ['New', 'In review'].includes(status) ? '' : dept, status, final: '', reviewed: status !== 'New', notes: [] });
  }
  complaints.sort((a, b) => b.date.localeCompare(a.date));
  window.SAMPLE = { complaints, wards, types: Object.keys(T), depts: Object.values(T).map(v => v[0]), statuses: ['New', 'In review', 'Assigned', 'In progress', 'Resolved'], priorities: ['Urgent', 'High', 'Medium', 'Low'], sentiments: ['Negative', 'Neutral', 'Positive'] };
})();
