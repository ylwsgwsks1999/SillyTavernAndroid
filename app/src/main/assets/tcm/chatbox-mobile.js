(function(){
'use strict';
if(window.__TCM_CHATBOX_V1__) return; window.__TCM_CHATBOX_V1__=true;
const $=s=>document.querySelector(s);
const click=selectors=>{for(const s of selectors){const el=$(s);if(el){el.click();return true;}}return false;};
const old=$('#tcm-chatbox-top'); if(old)old.remove();
const top=document.createElement('div');top.id='tcm-chatbox-top';
top.innerHTML='<button type="button" id="tcm-open-left" aria-label="打开导航">☰</button><div id="tcm-chatbox-title">SillyTavern</div><button type="button" id="tcm-open-right" aria-label="打开设置">⚙</button>';
const host=$('#top-bar')||$('#chat')||document.body;host.parentNode.insertBefore(top,host);
const scrim=document.createElement('div');scrim.id='tcm-scrim';document.body.appendChild(scrim);
function drawer(id,title,items){const d=document.createElement('aside');d.className='tcm-drawer';d.id=id;d.innerHTML='<h3>'+title+'</h3>'+items.map((x,i)=>'<button type="button" data-i="'+i+'">'+x[0]+'</button>').join('')+'<button type="button" data-close="1">关闭</button>';d.addEventListener('click',e=>{if(e.target.dataset.close){close();return;}const i=e.target.dataset.i;if(i!==undefined){const item=items[Number(i)];if(item&&item[1]){click(item[1]);close();}}});document.body.appendChild(d);return d;}
const leftItems=[
['角色 / 聊天列表',['#leftNavDrawerIcon','#rm_button_panel']],
['角色管理',['#character_search_button','#rm_button_panel']],
['世界书 / Lorebook',['#WIDrawerIcon']],
['扩展 / Extensions',['.drawer-icon[title="Extensions"]','#extensions_button']],
['群组聊天',['#rm_button_panel']]
];
const rightItems=[
['API / 模型连接',['#rightNavDrawerIcon']],
['预设 / Presets',['#respective-presets-block','#preset_manager']],
['正则 / Regex',['#regex_container']],
['扩展管理',['.drawer-icon[title="Extensions"]','#extensions_button']],
['用户设置',['#user-settings-button','#advanced formatting']],
['主题 / 显示设置',['#user-settings-button']]
];
const left=drawer('tcm-left','导航',leftItems),right=drawer('tcm-right','设置与工具',rightItems);
function open(d){left.classList.remove('open');right.classList.remove('open');d.classList.add('open');scrim.classList.add('open');}
function close(){left.classList.remove('open');right.classList.remove('open');scrim.classList.remove('open');}
$('#tcm-open-left').addEventListener('click',()=>open(left));$('#tcm-open-right').addEventListener('click',()=>open(right));scrim.addEventListener('click',close);
const title=$('#character_name_pole')||$('#chat_name')||$('#top-bar .character_name');
if(title&&title.textContent.trim())$('#tcm-chatbox-title').textContent=title.textContent.trim();
document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
})();