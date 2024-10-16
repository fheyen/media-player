var Ne=Object.defineProperty;var Pe=(e,t,n)=>t in e?Ne(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var x=(e,t,n)=>Pe(e,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const f of o.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&i(f)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();function P(){}function ke(e){return e()}function me(){return Object.create(null)}function G(e){e.forEach(ke)}function $e(e){return typeof e=="function"}function re(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}function Re(e){return Object.keys(e).length===0}function H(e){return e??""}function A(e,t){e.appendChild(t)}function F(e,t,n){e.insertBefore(t,n||null)}function E(e){e.parentNode&&e.parentNode.removeChild(e)}function ne(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function S(e){return document.createElement(e)}function J(e){return document.createTextNode(e)}function M(){return J(" ")}function N(e,t,n,i){return e.addEventListener(t,n,i),()=>e.removeEventListener(t,n,i)}function $(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function Oe(e){return Array.from(e.childNodes)}function Te(e,t){t=""+t,e.data!==t&&(e.data=t)}function K(e,t){e.value=t??""}let z;function j(e){z=e}function Ee(){if(!z)throw new Error("Function called outside component initialization");return z}function Be(e){Ee().$$.on_mount.push(e)}function Ue(e){Ee().$$.on_destroy.push(e)}const B=[],se=[];let C=[];const ie=[],Ce=Promise.resolve();let le=!1;function De(){le||(le=!0,Ce.then(Fe))}function oe(e){C.push(e)}function je(e){ie.push(e)}const ee=new Set;let O=0;function Fe(){if(O!==0)return;const e=z;do{try{for(;O<B.length;){const t=B[O];O++,j(t),ze(t.$$)}}catch(t){throw B.length=0,O=0,t}for(j(null),B.length=0,O=0;se.length;)se.pop()();for(let t=0;t<C.length;t+=1){const n=C[t];ee.has(n)||(ee.add(n),n())}C.length=0}while(B.length);for(;ie.length;)ie.pop()();le=!1,ee.clear(),j(e)}function ze(e){if(e.fragment!==null){e.update(),G(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(oe)}}function Ge(e){const t=[],n=[];C.forEach(i=>e.indexOf(i)===-1?t.push(i):n.push(i)),n.forEach(i=>i()),C=t}const Y=new Set;let Ve;function q(e,t){e&&e.i&&(Y.delete(e),e.i(t))}function ae(e,t,n,i){if(e&&e.o){if(Y.has(e))return;Y.add(e),Ve.c.push(()=>{Y.delete(e)}),e.o(t)}}function U(e){return(e==null?void 0:e.length)!==void 0?e:Array.from(e)}function We(e,t,n){const i=e.$$.props[t];i!==void 0&&(e.$$.bound[i]=n,n(e.$$.ctx[i]))}function Le(e){e&&e.c()}function ue(e,t,n){const{fragment:i,after_update:s}=e.$$;i&&i.m(t,n),oe(()=>{const o=e.$$.on_mount.map(ke).filter($e);e.$$.on_destroy?e.$$.on_destroy.push(...o):G(o),e.$$.on_mount=[]}),s.forEach(oe)}function ce(e,t){const n=e.$$;n.fragment!==null&&(Ge(n.after_update),G(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function Ye(e,t){e.$$.dirty[0]===-1&&(B.push(e),De(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function fe(e,t,n,i,s,o,f=null,g=[-1]){const u=z;j(e);const l=e.$$={fragment:null,ctx:[],props:o,update:P,not_equal:s,bound:me(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(u?u.$$.context:[])),callbacks:me(),dirty:g,skip_bound:!1,root:t.target||u.$$.root};f&&f(l.root);let a=!1;if(l.ctx=n?n(e,t.props||{},(c,m,...b)=>{const v=b.length?b[0]:m;return l.ctx&&s(l.ctx[c],l.ctx[c]=v)&&(!l.skip_bound&&l.bound[c]&&l.bound[c](v),a&&Ye(e,c)),m}):[],l.update(),a=!0,G(l.before_update),l.fragment=i?i(l.ctx):!1,t.target){if(t.hydrate){const c=Oe(t.target);l.fragment&&l.fragment.l(c),c.forEach(E)}else l.fragment&&l.fragment.c();t.intro&&q(e.$$.fragment),ue(e,t.target,t.anchor),Fe()}j(u)}class de{constructor(){x(this,"$$");x(this,"$$set")}$destroy(){ce(this,1),this.$destroy=P}$on(t,n){if(!$e(n))return P;const i=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return i.push(n),()=>{const s=i.indexOf(n);s!==-1&&i.splice(s,1)}}$set(t){this.$$set&&!Re(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const He="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(He);const ge=new Set(["jpg","jpeg","png","gif","webp"]),pe=new Set(["mp4","flv","mpg","mpeg","webm","3gp","avi"]);function W(e){let t=e.split(/(\[|\])/);return t=t.slice(1,t.length-1).filter(n=>n!==""&&n!=="["&&n!=="]"),t}function te(e){const t=e.split(".");if(!(t.length<2))return t[t.length-1].toLowerCase()}function Ke(e){let t=e.length,n,i;for(;t;)i=Math.floor(Math.random()*t--),n=e[t],e[t]=e[i],e[i]=n;return e}function qe(e,t){return new URLSearchParams(e.location.search).get(t)}function he(e,t,n){const i=e.slice();return i[6]=t[n],i}function _e(e){let t,n,i;return{c(){t=S("option"),n=J("tag"),t.__value=i=e[6],K(t,t.__value)},m(s,o){F(s,t,o),A(t,n)},p(s,o){o&1&&i!==(i=s[6])&&(t.__value=i,K(t,t.__value))},d(s){s&&E(t)}}}function Je(e){let t,n,i,s,o,f,g,u=U(e[0].keys()),l=[];for(let a=0;a<u.length;a+=1)l[a]=_e(he(e,u,a));return{c(){t=S("input"),n=M(),i=S("button"),i.textContent="+",s=M(),o=S("datalist");for(let a=0;a<l.length;a+=1)l[a].c();$(t,"type","text"),$(t,"placeholder","add tag"),$(t,"list","tag-suggestions"),$(o,"id","tag-suggestions")},m(a,c){F(a,t,c),K(t,e[1]),F(a,n,c),F(a,i,c),F(a,s,c),F(a,o,c);for(let m=0;m<l.length;m+=1)l[m]&&l[m].m(o,null);f||(g=[N(t,"input",e[5]),N(t,"keydown",e[3]),N(t,"keyup",e[3]),N(t,"keypress",e[3]),N(i,"click",e[2])],f=!0)},p(a,[c]){if(c&2&&t.value!==a[1]&&K(t,a[1]),c&1){u=U(a[0].keys());let m;for(m=0;m<u.length;m+=1){const b=he(a,u,m);l[m]?l[m].p(b,c):(l[m]=_e(b),l[m].c(),l[m].m(o,null))}for(;m<l.length;m+=1)l[m].d(1);l.length=u.length}},i:P,o:P,d(a){a&&(E(t),E(n),E(i),E(s),E(o)),ne(l,a),f=!1,G(g)}}}function Qe(e,t,n){let{tags:i=new Set}=t,{allTags:s=new Map}=t,o="";const f=()=>{console.log("add");const l=o.trim();l.length>0&&(i.add(l),n(4,i=new Set(i))),n(1,o="")},g=l=>{console.log(l),l.stopPropagation(),l.key==="Enter"&&f()};function u(){o=this.value,n(1,o)}return e.$$set=l=>{"tags"in l&&n(4,i=l.tags),"allTags"in l&&n(0,s=l.allTags)},[s,o,f,g,i,u]}class Xe extends de{constructor(t){super(),fe(this,t,Qe,Je,re,{tags:4,allTags:0})}}function Ze(e){let t;return{c(){t=S("div"),t.innerHTML=`<div><span>c</span> choose directory
    <div><span>🢀</span> / <span>🢂</span> previous / next item</div> <div><span>🢁</span> / <span>🢃</span> 5 seconds backward / forward</div> <div><span>+</span> / <span>-</span> / <span>m</span> volume up / down / muted</div> <div><span>s</span> / <span>f</span> play video slower / faster</div> <div><span>a</span> toggle autoplay</div> <div><span>Delete</span> delete file</div> <div><span>F2</span> rename file</div> <div><span>F5</span> refresh</div> <div><span>F11</span> fullscreen</div> <div>sort:
      <span>1</span> shuffle
      <span>2</span> name
      <span>3</span> date
      <span>4</span> size</div></div>`,$(t,"class","info")},m(n,i){F(n,t,i)},p:P,i:P,o:P,d(n){n&&E(t)}}}class xe extends de{constructor(t){super(),fe(this,t,null,Ze,re,{})}}function we(e,t,n){const i=e.slice();return i[26]=t[n],i}function ve(e,t,n){const i=e.slice();return i[26]=t[n],i}function et(e){let t,n,i,s,o,f,g,u,l,a,c,m,b=U([...e[2]]),v=[];for(let r=0;r<b.length;r+=1)v[r]=ye(ve(e,b,r));function Q(r){e[6](r)}let D={allTags:e[1]};e[2]!==void 0&&(D.tags=e[2]),f=new Xe({props:D}),se.push(()=>We(f,"tags",Q));let I=U(e[1].keys()),T=[];for(let r=0;r<I.length;r+=1)T[r]=be(we(e,I,r));return{c(){t=S("div"),n=S("form"),n.innerHTML='<input id="filterInput" type="text" placeholder="filter by tags" title="Press enter to apply"/>',i=M(),s=S("div");for(let r=0;r<v.length;r+=1)v[r].c();o=M(),Le(f.$$.fragment),u=M(),l=S("div");for(let r=0;r<T.length;r+=1)T[r].c();$(t,"class","filterContainer"),$(s,"class","tags"),$(l,"class","alltags")},m(r,k){F(r,t,k),A(t,n),F(r,i,k),F(r,s,k);for(let L=0;L<v.length;L+=1)v[L]&&v[L].m(s,null);F(r,o,k),ue(f,r,k),F(r,u,k),F(r,l,k);for(let L=0;L<T.length;L+=1)T[L]&&T[L].m(l,null);a=!0,c||(m=N(n,"submit",e[4]),c=!0)},p(r,k){if(k&6){b=U([...r[2]]);let _;for(_=0;_<b.length;_+=1){const R=ve(r,b,_);v[_]?v[_].p(R,k):(v[_]=ye(R),v[_].c(),v[_].m(s,null))}for(;_<v.length;_+=1)v[_].d(1);v.length=b.length}const L={};if(k&2&&(L.allTags=r[1]),!g&&k&4&&(g=!0,L.tags=r[2],je(()=>g=!1)),f.$set(L),k&7){I=U(r[1].keys());let _;for(_=0;_<I.length;_+=1){const R=we(r,I,_);T[_]?T[_].p(R,k):(T[_]=be(R),T[_].c(),T[_].m(l,null))}for(;_<T.length;_+=1)T[_].d(1);T.length=I.length}},i(r){a||(q(f.$$.fragment,r),a=!0)},o(r){ae(f.$$.fragment,r),a=!1},d(r){r&&(E(t),E(i),E(s),E(o),E(u),E(l)),ne(v,r),ce(f,r),ne(T,r),c=!1,m()}}}function ye(e){let t,n=e[26]+"",i,s,o,f,g,u;function l(){return e[5](e[26])}return{c(){t=S("button"),i=J(n),s=M(),$(t,"class",o=H(e[1].get(e[26])<3?"rare":"")+" svelte-1m8kk25"),$(t,"title",f="occurs "+e[1].get(e[26])+" times")},m(a,c){F(a,t,c),A(t,i),A(t,s),g||(u=N(t,"click",l),g=!0)},p(a,c){e=a,c&4&&n!==(n=e[26]+"")&&Te(i,n),c&6&&o!==(o=H(e[1].get(e[26])<3?"rare":"")+" svelte-1m8kk25")&&$(t,"class",o),c&6&&f!==(f="occurs "+e[1].get(e[26])+" times")&&$(t,"title",f)},d(a){a&&E(t),g=!1,u()}}}function be(e){let t,n=e[26]+"",i,s,o,f,g,u;function l(){return e[7](e[26])}return{c(){t=S("button"),i=J(n),s=M(),$(t,"class",o=H(e[1].get(e[26])<3?"rare":"")+" svelte-1m8kk25"),$(t,"title",f=`${e[26]} ${e[1].get(e[26])} ${(e[1].get(e[26])/e[0].length*100).toFixed(1)}%. Click to add tag to current file.`)},m(a,c){F(a,t,c),A(t,i),A(t,s),g||(u=N(t,"click",l),g=!0)},p(a,c){e=a,c&2&&n!==(n=e[26]+"")&&Te(i,n),c&2&&o!==(o=H(e[1].get(e[26])<3?"rare":"")+" svelte-1m8kk25")&&$(t,"class",o),c&3&&f!==(f=`${e[26]} ${e[1].get(e[26])} ${(e[1].get(e[26])/e[0].length*100).toFixed(1)}%. Click to add tag to current file.`)&&$(t,"title",f)},d(a){a&&E(t),g=!1,u()}}}function tt(e){let t,n,i,s,o,f,g,u,l,a,c=e[3]&&et(e);return l=new xe({}),{c(){t=S("main"),n=S("div"),n.innerHTML='<div id="progressBar"></div>',i=M(),s=S("div"),o=M(),f=S("div"),f.innerHTML=`<video autoplay="true" controls="true" loop="true" muted="true" volume="${.5}"></video> <img/>`,g=M(),c&&c.c(),u=M(),Le(l.$$.fragment),$(n,"id","progress"),$(s,"id","status")},m(m,b){F(m,t,b),A(t,n),A(t,i),A(t,s),A(t,o),A(t,f),A(t,g),c&&c.m(t,null),A(t,u),ue(l,t,null),a=!0},p(m,[b]){m[3]&&c.p(m,b)},i(m){a||(q(c),q(l.$$.fragment,m),a=!0)},o(m){ae(c),ae(l.$$.fragment,m),a=!1},d(m){m&&E(t),c&&c.d(),ce(l)}}}const nt=3e3;function st(e,t,n){const i=qe(window,"tags")!==null;let s=[],o=[],f=new Map,g=new Set,u=0,l=null,a=!1,c=null,m=1;window.showDirectoryPicker||alert("Local file access does not work in this browser!");async function b(){s=[],n(1,f=new Map),l=await window.showDirectoryPicker();for await(const d of l.values())if(d.kind==="file"){const h=te(d.name);(ge.has(h)||pe.has(h))&&s.push(d);let p=W(d.name);for(const w of p)f.has(w)?f.set(w,f.get(w)+1):f.set(w,1)}I(),n(0,o=[...s]),_(s[u])}async function v(d){const h=document.getElementById("filterInput");if(d.target===h)return;new Set(["F2","F5","F11","F12"]).has(d.key)||d.preventDefault();const w=document.getElementsByTagName("video")[0],y=s[u];switch(d.key){case"c":b();break;case"ArrowLeft":L();break;case"ArrowRight":k();break;case"ArrowUp":w.currentTime-=5;break;case"ArrowDown":w.currentTime+=5;break;case"m":w.muted=!w.muted;break;case"-":w.volume=Math.max(w.volume-.05,0);break;case"+":w.volume=Math.min(w.volume+.01,1);break;case"s":w.playbackRate=Math.max(w.playbackRate/2,.125),m=w.playbackRate;break;case"f":w.playbackRate=Math.min(w.playbackRate*2,16),m=w.playbackRate;break;case"a":a=!a,w.loop=!a;break;case"Delete":l&&confirm(`Delete ${y.name}? Cannot be undone!`)&&D(y),s=[...s.slice(0,u),...s.slice(u+1)],_(s[u]);break;case"1":r("shuffle");break;case"2":r("name");break;case"3":r("date");break;case"4":r("size");break;case"F2":let V=y.name;y.name.indexOf("[")>0&&(V=y.name.substring(0,y.name.indexOf("[")));const X=te(y.name),Z=`${V} [${[...g].join("][")}].${X}`;await Q(y,Z);break}I()}Be(()=>{document.body.addEventListener("keydown",v)}),Ue(()=>{document.body.removeEventListener("keydown",v)});async function Q(d,h=null){const p=await d.getFile(),y=await(await window.showSaveFilePicker({suggestedName:h??d.name,startIn:l})).createWritable();await y.write(p),await y.close(),D(d),u=Math.min(u,s.length-1),u>0&&_(s[u])}async function D(d){n(0,o=o.filter(h=>h.name!==d.name)),s.splice(u,1),l.removeEntry(d.name)}async function I(){if(s.length===0)return;const d=s[u].name,h=document.getElementsByTagName("video")[0],p=`${u+1} / ${s.length} files - ${d} - Vol: ${h.muted?"muted":Math.round(h.volume*100)} - Rate: ${m} - ${Math.round(h.currentTime)} / ${Math.round(h.duration)} sec`;document.getElementById("status").innerText=p,document.getElementById("progressBar").style.width=h!=null&&h.duration?h.currentTime/h.duration*100+"%":"0"}async function T(d){d&&d.preventDefault();const p=document.getElementById("filterInput").value.split(" ").map(y=>y.trim()).filter(y=>y.length>0),w=new Set(p);s=o.filter(y=>{const V=W(y.name);{const X=new Set(V);for(const Z of w.values())if(!X.has(Z))return!1;return!0}}),I()}async function r(d){if(d==="name")s.sort((h,p)=>h.name<p.name?-1:1);else if(d==="date"||d==="size"){const h=d==="date"?await Promise.all(s.map(async p=>[await p.getFile().lastModified,p])):await Promise.all(s.map(async p=>[await p.getFile().size,p]));h.sort((p,w)=>p[0]<w[0]?-1:1),s=h.map(p=>p[1])}else d==="shuffle"?Ke(s):console.error("Invalid sorting mode")}async function k(){u=u>=s.length-1?0:u+1,_(s[u])}async function L(){u=u<=0?s.length-1:u-1,_(s[u])}async function _(d){window.clearTimeout(c);const h=te(d.name);if(!h)throw new Error("No file extension");pe.has(h)?(R(d),n(2,g=new Set(W(d.name)))):ge.has(h)?(Ae(d),n(2,g=new Set(W(d.name)))):alert("Not a image or video file")}async function R(d){const h=document.getElementsByTagName("img")[0];h.style.display="none";const p=document.getElementsByTagName("video")[0];p.style.display="block";const w=await d.getFile(),y=URL.createObjectURL(w);p.onloadeddata=()=>{p.play()},p.onended=Se,p.ontimeupdate=I,p.playbackRate=m,p.src=y,p.load()}function Se(){a&&k()}async function Ae(d){const h=document.getElementsByTagName("video")[0];h.style.display="none";const p=document.getElementsByTagName("img")[0];p.style.display="block";const w=await d.getFile(),y=URL.createObjectURL(w);p.onload=()=>{a&&(c=window.setTimeout(k,nt))},p.src=y}const Ie=d=>{confirm("Remove tag?")&&(g.delete(d),n(2,g=new Set(g)))};function Me(d){g=d,n(2,g)}return[o,f,g,i,T,Ie,Me,d=>{g.add(d),n(2,g=new Set(g))}]}class it extends de{constructor(t){super(),fe(this,t,st,tt,re,{})}}new it({target:document.getElementById("app")});
