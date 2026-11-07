(function () {
'use strict';
if (window.__TCM_CHATBOX_V3__) return;
window.__TCM_CHATBOX_V3__ = true;

const $ = (s, root=document) => root.querySelector(s);
const nativeTargets = {
  ai: ['#leftNavDrawerIcon', '#ai-config-button .drawer-toggle'],
  characters: ['#rightNavDrawerIcon', '#rightNavHolder .drawer-toggle'],
  world: ['#WIDrawerIcon', '#WI-SP-button .drawer-toggle'],
  extensions: ['#extensions-settings-button .drawer-toggle'],
  user: ['#user-settings-button .drawer-toggle'],
  api: ['#API-status-top', '#sys-settings-button .drawer-toggle'],
  formatting: ['#advanced-formatting-button .drawer-toggle'],
};
function activateNative(name) {
  const candidates = nativeTargets[name] || [];
  let target = null;
  for (const selector of candidates) {
    target = $(selector);
    if (target) break;
  }
  if (!target) {
    setStatus('没有找到酒馆原生面板：' + name + '。请检查酒馆前端版本。');
    console.warn('[TCM] Native panel target missing:', name, candidates);
    return false;
  }
  target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  setStatus('已请求打开原生面板：' + name);
  return true;
}
function setStatus(message) {
  const node = $('#tcm-status');
  if (node) node.textContent = message;
}
const old = $('#tcm-chatbox-top'); if (old) old.remove();
const top = document.createElement('div');
top.id = 'tcm-chatbox-top';
top.innerHTML = '<button type="button" id="tcm-open-left" aria-label="打开导航">☰</button><div id="tcm-chatbox-title">SillyTavern</div><button type="button" id="tcm-open-right" aria-label="打开工具">⚙</button>';
const topBar = $('#top-bar');
if (topBar) topBar.replaceChildren(top); else document.body.prepend(top);

const priorScrim = $('#tcm-scrim'); if (priorScrim) priorScrim.remove();
const scrim = document.createElement('div');
scrim.id = 'tcm-scrim';
document.body.appendChild(scrim);

const leftItems = [
  { label: 'AI 参数 / Presets', run: () => activateNative('ai') },
  { label: '角色 / 聊天管理', run: () => activateNative('characters') },
  { label: '世界书 / Lorebook', run: () => activateNative('world') },
  { label: '扩展管理', run: () => activateNative('extensions') },
  { label: '用户设置', run: () => activateNative('user') }
];
const rightItems = [
  { label: 'API / 模型连接', run: () => activateNative('api') },
  { label: 'AI 格式设置', run: () => activateNative('formatting') },
  { label: '预设管理', run: () => { if (activateNative('ai')) setTimeout(() => {
      const el = $('#respective-presets-block') || $('[id*="preset"]');
      if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
      else setStatus('AI 参数面板已打开；当前版本未找到预设区域定位点。');
    }, 450); } },
  { label: '正则 / Regex', run: () => { if (activateNative('extensions')) setTimeout(() => {
      const el = $('#regex_container') || $('[id*="regex"]');
      if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
      else setStatus('扩展面板已打开；未找到正则扩展区域，请确认 Regex 扩展已安装。');
    }, 450); } },
  { label: '扩展管理', run: () => activateNative('extensions') },
  { label: '主题与用户设置', run: () => activateNative('user') }
];

function makeDrawer(id, title, items) {
  const d = document.createElement('aside');
  d.className = 'tcm-drawer';
  d.id = id;
  d.innerHTML = '<h3>' + title + '</h3>' +
    items.map((item, i) => '<button type="button" data-action="' + i + '">' + item.label + '</button>').join('') +
    '<p id="tcm-status">选择功能后将调用酒馆原生面板。</p><button type="button" data-close="1">关闭</button>';
  d.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.close) { close(); return; }
    const item = items[Number(button.dataset.action)];
    if (item && item.run) item.run();
  });
  document.body.appendChild(d);
  return d;
}
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
const title = $('#character_name_pole') || $('#chat_name') || $('.character_name');
if (title && title.textContent.trim()) $('#tcm-chatbox-title').textContent = title.textContent.trim();
document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
console.info('[TCM] Chatbox mobile UI v0.3 ready');
})();