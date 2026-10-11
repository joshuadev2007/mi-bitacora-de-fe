/* Josh Cloud Sync v1: autenticación Supabase + sincronización con revisión y resolución de conflictos.
   No almacena contraseñas. Nunca envía datos sin sesión. Usa RLS y la anon/publishable key. */
(()=>{
'use strict';
if (window.top !== window.self) return; // En JoshOS el contenedor gestiona las apps embebidas.
const TAG = 'joshos-cloud-v1';
const SK = TAG+'-session', CK = TAG+'-config';
const options = window.CloudAppOptions || {channels:[{id:'bitacora-fe',key:'mi-bitacora-fe-v1',title:'Mi Bitácora de Fe'}]};
const channels = options.channels || [];
const el = (id)=>document.getElementById(id);
const safe = v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fromStorage=(key)=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}};
const savedConfig=fromStorage(CK)||{};
const fixedCloud=!!(window.CloudDefaultConfig?.url && window.CloudDefaultConfig?.anonKey);
// La pantalla Data API de Supabase puede mostrar /rest/v1/. Auth usa la URL base.
function normalizeProjectUrl(raw){
 const v=String(raw||'').trim();if(!v)return '';
 try{
  const u=new URL(v);const p=u.pathname.replace(/\/+$/,'');
  if(u.protocol==='https:'&&!u.username&&!u.password&&!u.search&&!u.hash&&(!p||/^\/(?:rest|auth|storage|functions|realtime|graphql)\/v1(?:\/.*)?$/i.test(p)))return u.origin;
 }catch{}
 return v.replace(/\/+$/,'');
}
let config={url:normalizeProjectUrl(window.CloudDefaultConfig?.url || savedConfig.url ||''), key:(window.CloudDefaultConfig?.anonKey || savedConfig.key ||'').trim()};
let session=fromStorage(SK), account=null, busy=false, started=false, pending={}, state={}, interval=null, debounce=null;
for (const c of channels) state[c.id]={revision:0,dirty:false,baseline:null,ready:false};
function configured(){return /^https:\/\//i.test(config.url)&&config.key.length>15&&!/sb_secret_|service_role/i.test(config.key)}
function storeSession(s){session=s?{access_token:s.access_token,refresh_token:s.refresh_token,expires_at:s.expires_at || Math.floor(Date.now()/1000)+(s.expires_in||3600)}:null;if(session)localStorage.setItem(SK,JSON.stringify(session));else localStorage.removeItem(SK)}
function setStatus(t){const x=el('cloud-status');if(x)x.textContent=t;const badge=el('cloud-button');if(badge)badge.textContent=(account?'☁️ ✓':'☁️')+' Cuenta'}
function toast(t){setStatus(t);const x=el('cloud-notice');if(x){x.textContent=t;x.hidden=false}}
function jsonLocal(c){return fromStorage(c.key)}
function canonical(obj){try{return JSON.stringify(obj)}catch{return ''}}
function same(a,b){return canonical(a)===canonical(b)}
function validateConfig(url,key){
 const base=normalizeProjectUrl(url);
 let parsed;try{parsed=new URL(base)}catch{throw Error('Pegá la URL base del proyecto de Supabase, que comienza con https://')}
 if(parsed.protocol!=='https:'||parsed.username||parsed.password||parsed.search||parsed.hash||parsed.pathname!=='/')throw Error('Usá únicamente la URL base del proyecto, sin /rest/v1/ ni otras rutas.');
 if(key.length<16||/sb_secret_|service_role/i.test(key))throw Error('Usá exclusivamente la clave pública publishable/anon, nunca una clave secreta.');
 return {url:parsed.origin,key};
}
async function request(path,{method='GET',body,token=true,prefer,signal}={}){
 if(!configured())throw Error('Primero configurá tu proyecto Supabase.');
 if(token)await ensureToken();
 const headers={'apikey':config.key,'Content-Type':'application/json'};
 if(token && session?.access_token)headers.Authorization='Bearer '+session.access_token;
 if(prefer)headers.Prefer=prefer;
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),16000);
 try{
 const res=await fetch(config.url+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),signal:signal||controller.signal,cache:'no-store'});
 const text=await res.text();let data;try{data=text?JSON.parse(text):null}catch{data=text}
 if(!res.ok){const error=new Error(data?.msg||data?.message||data?.error_description||`Error de servidor ${res.status}`);error.status=res.status;throw error}
 return data;
 }catch(e){if(e.name==='AbortError')throw Error('La conexión tardó demasiado. Revisá tu internet.');throw e}finally{clearTimeout(timer)}
}
let refreshPromise=null;
async function ensureToken(){
 if(!session?.access_token)throw Error('Iniciá sesión para sincronizar.');
 if(Number(session.expires_at||0)>Math.floor(Date.now()/1000)+90)return;
 if(refreshPromise)return refreshPromise;
 refreshPromise=(async()=>{
 const res=await fetch(config.url+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:config.key,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:session.refresh_token})});
 const data=await res.json();if(!res.ok){storeSession(null);account=null;throw Error('Tu sesión venció. Volvé a iniciar sesión.')}storeSession(data);
 })().finally(()=>refreshPromise=null);return refreshPromise;
}
async function checkAccount(){if(!session)return false;try{const u=await request('/auth/v1/user');account=u?.id?{id:u.id,email:u.email}:null;return !!account}catch(e){if(e.status===401||e.status===403){storeSession(null);account=null;}return false}}
function rowPath(c){return '/rest/v1/user_app_data?app_id=eq.'+encodeURIComponent(c.id)+'&select=payload,revision,updated_at'}
async function getRow(c){const a=await request(rowPath(c));return Array.isArray(a)?a[0]||null:null}
async function putRow(c,local,revision){
 if(revision>0){
 const a=await request('/rest/v1/user_app_data?app_id=eq.'+encodeURIComponent(c.id)+'&revision=eq.'+revision,{method:'PATCH',body:{payload:local,revision:revision+1,updated_at:new Date().toISOString()},prefer:'return=representation'});
 if(!Array.isArray(a)||a.length!==1)throw Error('La nube cambió en otro dispositivo. Resolvé el conflicto antes de continuar.');
 return a[0];
 }
 const a=await request('/rest/v1/user_app_data',{method:'POST',body:{app_id:c.id,user_id:account.id,payload:local,revision:1},prefer:'return=representation'});
 if(!Array.isArray(a)||a.length!==1)throw Error('No se confirmó el respaldo en nube.');
 return a[0];
}
function mark(c){const s=state[c.id];if(!s)return;s.dirty=true;if(account&&s.ready){setStatus('Cambios pendientes de sincronizar…');clearTimeout(debounce);debounce=setTimeout(()=>syncNow(),1800)}}
function setLocal(c,payload){localStorage.setItem(c.key,JSON.stringify(payload));state[c.id].dirty=false;state[c.id].baseline=canonical(payload)}
async function initializeChannels(){
 for(const c of channels){
  const s=state[c.id];s.ready=false;
  try{
   const remote=await getRow(c),local=jsonLocal(c);
   if(!remote){if(local!==null){const updated=await putRow(c,local,0);s.revision=updated.revision;s.baseline=canonical(local)}else{s.revision=0;s.baseline=null} s.dirty=false;s.ready=true;continue}
   s.revision=Number(remote.revision);const remoteData=remote.payload;
   if(local===null){setLocal(c,remoteData);s.ready=true;location.reload();return}
   if(same(local,remoteData)){s.baseline=canonical(local);s.dirty=false;s.ready=true;continue}
   pending[c.id]={remote:remoteData,revision:Number(remote.revision)};s.ready=false;
  }catch(e){toast('Error sincronizando '+c.title+': '+e.message)}
 }
 refreshPanel();if(!Object.keys(pending).length)setStatus('Sincronizado ✓');else setStatus('Hay datos para comparar antes de sincronizar.');
}
async function syncNow(){
 if(!account||busy||Object.keys(pending).length)return;
 busy=true;setStatus('Sincronizando…');
 try{
 for(const c of channels){
  const s=state[c.id];if(!s.ready)continue;
  const local=jsonLocal(c),remote=await getRow(c),version=remote?Number(remote.revision):0;
  if(remote && version!==s.revision){
   if(s.dirty || (local!==null&&s.baseline!==canonical(local))){pending[c.id]={remote:remote.payload,revision:version};s.ready=false;continue}
   setLocal(c,remote.payload);s.revision=version;location.reload();return;
  }
  if(local===null)continue;
  if(s.dirty||s.baseline!==canonical(local)){
   try{const updated=await putRow(c,local,version);s.revision=Number(updated.revision);s.baseline=canonical(local);s.dirty=false;}catch(e){if(e.status===409||e.message.includes('cambió')){const latest=await getRow(c);if(latest){pending[c.id]={remote:latest.payload,revision:Number(latest.revision)};s.ready=false;continue}}throw e}
  }
 }
 if(Object.keys(pending).length)setStatus('Hay una diferencia entre dispositivos: elegí qué conservar.');else setStatus('Todo sincronizado ✓');
 }catch(e){toast('Guardado local ✓ · Nube pendiente: '+e.message)}finally{busy=false;refreshPanel()}
}
async function chooseConflict(appId,which){
 const c=channels.find(c=>c.id===appId),p=pending[appId];if(!c||!p||busy)return;
 if(which==='cloud'){
  const ok=confirm('¿Reemplazar los datos locales de «'+c.title+'» por los de la nube? Exportá un respaldo JSON antes si hay información importante.');if(!ok)return;
  setLocal(c,p.remote);delete pending[appId];location.reload();return;
 }
 const ok=confirm('¿Guardar ESTA copia local de «'+c.title+'» en la nube, sustituyendo la copia remota? Confirmá que respaldaste la otra versión.');if(!ok)return;
 busy=true;
 try{
 const updated=await putRow(c,jsonLocal(c),p.revision);state[c.id]={revision:Number(updated.revision),ready:true,dirty:false,baseline:canonical(jsonLocal(c))};delete pending[appId];toast('Copia de este dispositivo guardada ✓');
 }catch(e){toast('No se guardó: '+e.message)}finally{busy=false;refreshPanel()}
}
function refreshPanel(){
 const body=el('cloud-state');if(!body)return;
 if(!configured()){body.innerHTML='<p>Configurá primero Supabase con la URL de tu proyecto y su clave <strong>pública</strong> (publishable/anon).</p>';return}
 if(!account){body.innerHTML='<p>Iniciá sesión con el mismo correo en PC y Android. Podés seguir usando tus apps sin internet.</p>';return}
 body.innerHTML=`<p>Sesión activa: <strong>${safe(account.email)}</strong></p>${channels.map(c=>`<div class="cloud-row"><strong>${safe(c.title)}</strong><small>${pending[c.id]?'⚠️ Dos copias diferentes':state[c.id].ready?'✓ Sincronización activada':'Revisando…'}</small>${pending[c.id]?`<div class="cloud-options"><button data-cloud-choose="cloud" data-cloud-id="${safe(c.id)}">Usar copia de nube</button><button data-cloud-choose="local" data-cloud-id="${safe(c.id)}">Usar copia de este equipo</button></div>`:''}</div>`).join('')}`;
}
function show(){el('cloud-edit-connection').hidden=fixedCloud;el('cloud-config-reset').hidden=fixedCloud;el('cloud-dialog').hidden=false;el('cloud-button').setAttribute('aria-expanded','true');el('cloud-connect').hidden=configured();el('cloud-auth').hidden=!configured()||!!account;el('cloud-signed').hidden=!account;el('cloud-config-url').value=config.url;el('cloud-config-key').value=config.key;refreshPanel()}
function hide(){el('cloud-dialog').hidden=true;el('cloud-button').setAttribute('aria-expanded','false')}
async function login(e){e.preventDefault();if(busy)return;const form=e.currentTarget;const email=form.elements.email.value.trim(),password=form.elements.password.value;const action=e.submitter?.value||'login';if(password.length<6){toast('La contraseña debe tener al menos 6 caracteres.');return}
 busy=true;toast(action==='register'?'Creando cuenta…':'Iniciando sesión…');
 try{
 const path=action==='register'?'/auth/v1/signup':'/auth/v1/token?grant_type=password';
 const data=await request(path,{method:'POST',body:{email,password},token:false});
 if(!data?.access_token){toast('Revisá tu correo y confirmá la cuenta. Luego iniciá sesión.');return}
 storeSession(data);account={id:data.user?.id,email:data.user?.email||email};pending={};await initializeChannels();toast('¡Bienvenido! Tu cuenta está conectada.');show();
 }catch(e){toast('No se pudo iniciar sesión: '+e.message)}finally{busy=false}
}
function mount(){
 if(started)return;started=true;
 const css=document.createElement('link');css.rel='stylesheet';css.href=(window.CloudAppOptions?.base||'./')+'cloud-sync.css';document.head.append(css);
 const button=document.createElement('button');button.id='cloud-button';button.className='cloud-button';button.type='button';button.setAttribute('aria-label','Cuenta y sincronización');button.setAttribute('aria-expanded','false');button.textContent='☁️ Cuenta';document.body.append(button);
 const dialog=document.createElement('section');dialog.id='cloud-dialog';dialog.className='cloud-dialog';dialog.hidden=true;dialog.setAttribute('aria-label','Cuenta y sincronización');dialog.innerHTML=`<div class="cloud-top"><h2>☁️ Tu cuenta y tus datos</h2><button type="button" id="cloud-close" aria-label="Cerrar">✕</button></div><p id="cloud-status" role="status">${configured()?'Listo para iniciar sesión':'Falta configurar la nube'}</p><p id="cloud-notice" role="alert" hidden></p><div id="cloud-connect"><form id="cloud-config-form"><label>URL de Supabase <input id="cloud-config-url" type="url" placeholder="https://tuproyecto.supabase.co" required></label><label>Clave pública publishable / anon <input id="cloud-config-key" type="text" autocomplete="off" placeholder="sb_publishable_..." required></label><button type="submit">Guardar conexión</button></form><small>Nunca pegues una clave secreta o service_role. Esta conexión se guarda solo en el dispositivo.</small></div><div id="cloud-auth"><form id="cloud-login-form"><label>Correo electrónico <input name="email" type="email" autocomplete="username" required></label><label>Contraseña <input name="password" type="password" autocomplete="current-password" minlength="6" required></label><div class="cloud-options"><button type="submit" value="login">Entrar</button><button type="submit" value="register">Crear cuenta</button></div></form><button type="button" id="cloud-edit-connection" class="cloud-muted">Cambiar URL o clave pública</button></div><div id="cloud-signed" hidden><div id="cloud-state"></div><div class="cloud-options"><button type="button" id="cloud-refresh">Sincronizar ahora</button><button type="button" id="cloud-signout">Cerrar sesión</button></div><button type="button" id="cloud-config-reset" class="cloud-muted">Cambiar servidor</button></div><p class="cloud-help">Tus apuntes se conservan en este dispositivo. El contenido sincronizado se guarda en tu proyecto de Supabase, protegido mediante reglas de acceso por usuario. No está cifrado de extremo a extremo. Exportá respaldos periódicos. Los PDF importados localmente no se envían a la nube.</p>`;document.body.append(dialog);
 button.addEventListener('click',()=>el('cloud-dialog').hidden?show():hide());el('cloud-close').addEventListener('click',hide);
 el('cloud-config-form').addEventListener('submit',e=>{e.preventDefault();try{config=validateConfig(el('cloud-config-url').value.trim(),el('cloud-config-key').value.trim());localStorage.setItem(CK,JSON.stringify(config));el('cloud-connect').hidden=true;el('cloud-auth').hidden=false;toast('Conexión guardada. Ya podés crear tu cuenta.')}catch(err){toast(err.message)}});
 el('cloud-login-form').addEventListener('submit',login);
  el('cloud-edit-connection').addEventListener('click',()=>{el('cloud-connect').hidden=false;el('cloud-auth').hidden=true;el('cloud-config-url').value=config.url;el('cloud-config-key').value=config.key;toast('Corregí la URL o la clave pública; tus notas no se borrarán.');});
 el('cloud-refresh').addEventListener('click',()=>syncNow());
 el('cloud-signout').addEventListener('click',async()=>{if(!confirm('¿Cerrar sesión? Los datos guardados en este dispositivo permanecerán aquí.'))return;const old=session;storeSession(null);account=null;pending={};for(const c of channels)state[c.id].ready=false;show();toast('Sesión cerrada. Tus datos locales siguen en este dispositivo.');if(old?.access_token)fetch(config.url+'/auth/v1/logout',{method:'POST',headers:{apikey:config.key,Authorization:'Bearer '+old.access_token}}).catch(()=>{})});
 el('cloud-config-reset').addEventListener('click',()=>{if(!confirm('¿Cambiar la configuración de nube? Primero exportá un respaldo.'))return;storeSession(null);account=null;config={url:'',key:''};localStorage.removeItem(CK);show();toast('Configuración borrada en este dispositivo.');});
 dialog.addEventListener('click',e=>{const b=e.target.closest('button[data-cloud-choose]');if(b)void chooseConflict(b.dataset.cloudId,b.dataset.cloudChoose)});
 window.addEventListener('cloud-local-change',e=>{const c=channels.find(c=>c.key===e.detail?.key);if(c)mark(c)});
 window.addEventListener('storage',e=>{const c=channels.find(c=>c.key===e.key);if(c)mark(c)});
 window.addEventListener('online',()=>{if(account)void syncNow()});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden && account)void syncNow()});
 interval=setInterval(()=>{if(account && navigator.onLine)void syncNow()},60000);
 if(configured()&&session){checkAccount().then(yes=>{if(yes){initializeChannels().catch(e=>toast(e.message));setStatus('Cuenta conectada ✓')}else setStatus('Iniciá sesión para sincronizar')})}
 }
window.JoshCloud={notify:key=>window.dispatchEvent(new CustomEvent('cloud-local-change',{detail:{key}})),open:show,sync:syncNow};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
