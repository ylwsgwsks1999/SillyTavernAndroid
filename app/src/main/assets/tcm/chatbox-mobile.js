(function () {
'use strict';
if (window.__TCM_CHATBOX_V2__) return;
window.__TCM_CHATBOX_V2__ = true;
const $ = (s) => document.querySelector(s);
const click = (selector) => {
  const el = $(selector);
  if (!el) { console.warn('[TCM] Missing target:', selector); return false; }
  el.click();
  return true;
};
const scrollTo = (selector) => {
  const el = $(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
const old = $('#tcm-chatbox-top'); if (old) old.remove();
const top = document.createElement('div');
top.id = 'tcm-chatbox-top';
top.innerHTML = '<button type="button" id="tcm-open-left" aria-label="打开导航">☰</button><div id="tcm-chatbox-title">SillyTavern</div><button type="button" id="tcm-open-right" aria-label="打开工具">⚙</button>';
const topBar = $('#top-bar');
if (topBar) { topBar.replaceChildren(top); }
else { document.body.prepend(top); }
const scrim = document.createElement('div');
scrim.id = 'tcm-scrim';
document.body.appendChild(scrim);
const makeDrawer = (id, title, items) => {
  const d = document.createElement('aside');
  d.className = 'tcm-drawer';
  d.id = id;
  d.innerHTML = '<h3>' + title + '</h3>' +
    items.map((item, i) => '<button type="button" data-action="' + i + '">' + item.label + '</button>').join('') +
    '<p id="tcm-status">快捷入口会打开酒馆原生面板，不会替代或删除原有功能。</p><button type="button" data-close="1">关闭</button>';
  d.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.close) { close(); return; }
    const item = items[Number(button.dataset.action)];
    if (item && item.run) { item.run(); close(); }
  });
  document.body.appendChild(d);
  return d;
};
const leftItems = [
  { label: 'AI 参数 / Presets', run: () => { click('#leftNavDrawerIcon'); setTimeout(() => scrollTo('#respective-presets-block'), 250); } },
  { label: '角色 / 聊天管理', run: () => click('#rightNavDrawerIcon') },
  { label: '世界书 / Lorebook', run: () => click('#WIDrawerIcon') },
  { label: '扩展管理', run: () => click('#extensions-settings-button .drawer-toggle') },
  { label: '用户设置', run: () => click('#user-settings-button .drawer-toggle') }
];
const rightItems = [
  { label: 'API / 模型参数', run: () => click('#leftNavDrawerIcon') },
  { label: '预设管理', run: () => { click('#leftNavDrawerIcon'); setTimeout(() => scrollTo('#respective-presets-block'), 250); } },
  { label: '正则 / Regex', run: () => { click('#extensions-settings-button .drawer-toggle'); setTimeout(() => scrollTo('#regex_container'), 350); } },
  { label: '扩展管理', run: () => click('#extensions-settings-button .drawer-toggle') },
  { label: '主题与用户设置', run: () => click('#user-settings-button .drawer-toggle') }
];
const left = makeDrawer('tcm-left', '导航与内容', leftItems);
const right = makeDrawer('tcm-right', '设置与高级工具', rightItems);
function open(drawer) {
  left.classList.remove('open'); right.classList.remove('open');
  drawer.classList.add('open'); scrim.classList.add('open');
}
function close() {
  left.classList.remove('open'); right.classList.remove('open');
  scrim.classList.remove('open');
}
$('#tcm-open-left').addEventListener('click', () => open(left));
$('#tcm-open-right').addEventListener('click', () => open(right));
scrim.addEventListener('click', close);
const title = $('#character_name_pole') || $('#chat_name') || $('#top-bar .character_name');
if (title && title.textContent.trim()) $('#tcm-chatbox-title').textContent = title.textContent.trim();
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
console.info('[TCM] Chatbox mobile UI v0.2 ready');
})();