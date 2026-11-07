(function () {
'use strict';
if (window.__TCM_CHATBOX_V4__) return;
window.__TCM_CHATBOX_V4__ = true;

function boot(tries) {
  const topBar = document.getElementById('top-bar');
  if (!document.body || !topBar) {
    if (tries < 30) setTimeout(() => boot(tries + 1), 500);
    console.warn('[TCM] Waiting for SillyTavern DOM', tries);
    return;
  }

  document.getElementById('tcm-left')?.remove();
  document.getElementById('tcm-right')?.remove();
  document.getElementById('tcm-scrim')?.remove();
  document.getElementById('tcm-chatbox-top')?.remove();

  const top = document.createElement('div');
  top.id = 'tcm-chatbox-top';
  top.innerHTML = '<button type="button" id="tcm-open-left">☰</button><div id="tcm-chatbox-title">SillyTavern</div><button type="button" id="tcm-open-right">⚙</button>';
  topBar.replaceChildren(top);

  const scrim = document.createElement('div');
  scrim.id = 'tcm-scrim';
  document.body.appendChild(scrim);

  const leftItems = [
    ['AI 参数 / Presets', '#leftNavDrawerIcon'],
    ['角色 / 聊天管理', '#rightNavDrawerIcon'],
    ['世界书 / Lorebook', '#WIDrawerIcon'],
    ['扩展管理', '[data-target="extensions-settings-button"]'],
    ['用户设置', '#user-settings-button']
  ];
  const rightItems = [
    ['API / 模型连接', '[data-target="sys-settings-button"]'],
    ['AI 格式设置', '#advanced-formatting-button'],
    ['预设管理', '#leftNavDrawerIcon'],
    ['正则 / Regex', '[data-target="extensions-settings-button"]'],
    ['扩展管理', '[data-target="extensions-settings-button"]'],
    ['主题与用户设置', '#user-settings-button']
  ];

  function makeDrawer(id, heading, items, side) {
    const drawer = document.createElement('aside');
    drawer.id = id;
    drawer.className = 'tcm-drawer ' + side;
    drawer.innerHTML = '<h3>' + heading + '</h3>' +
      items.map((item, i) => '<button type="button" data-action="' + i + '">' + item[0] + '</button>').join('') +
      '<p class="tcm-status">Chatbox v0.4 已加载。点击功能将调用酒馆原生入口。</p><button type="button" data-close="1">关闭</button>';
    drawer.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.dataset.close) { closeAll(); return; }
      const item = items[Number(button.dataset.action)];
      if (!item) return;
      const target = document.querySelector(item[1]);
      if (!target) {
        drawer.querySelector('.tcm-status').textContent = '找不到原生入口：' + item[1];
        console.warn('[TCM] Native target missing', item[1]);
        return;
      }
      target.click();
      drawer.querySelector('.tcm-status').textContent = '已触发原生入口：' + item[0];
    });
    document.body.appendChild(drawer);
    return drawer;
  }

  const left = makeDrawer('tcm-left', '导航与内容', leftItems, 'left');
  const right = makeDrawer('tcm-right', '设置与高级工具', rightItems, 'right');

  function openDrawer(drawer) {
    [left, right].forEach(d => {
      d.classList.remove('open');
      d.style.transform = d.classList.contains('left') ? 'translate3d(-105%,0,0)' : 'translate3d(105%,0,0)';
      d.style.visibility = 'hidden';
    });
    drawer.style.visibility = 'visible';
    drawer.style.transform = 'translate3d(0,0,0)';
    drawer.classList.add('open');
    scrim.style.display = 'block';
    scrim.style.visibility = 'visible';
  }
  function closeAll() {
    left.classList.remove('open');
    right.classList.remove('open');
    left.style.transform = 'translate3d(-105%,0,0)';
    right.style.transform = 'translate3d(105%,0,0)';
    left.style.visibility = 'hidden';
    right.style.visibility = 'hidden';
    scrim.style.display = 'none';
  }

  document.getElementById('tcm-open-left').addEventListener('click', event => {
    event.preventDefault(); event.stopPropagation(); openDrawer(left);
  }, true);
  document.getElementById('tcm-open-right').addEventListener('click', event => {
    event.preventDefault(); event.stopPropagation(); openDrawer(right);
  }, true);
  scrim.addEventListener('click', closeAll);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeAll(); });

  const title = document.getElementById('character_name_pole') || document.getElementById('chat_name') || document.querySelector('.character_name');
  if (title && title.textContent.trim()) document.getElementById('tcm-chatbox-title').textContent = title.textContent.trim();

  console.info('[TCM] Chatbox mobile UI v0.4 ready');
}
boot(0);
})();