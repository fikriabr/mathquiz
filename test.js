const fs=require('fs'),vm=require('vm');
const files=process.argv.slice(2).length?process.argv.slice(2):['core','gen_sd','gen_smp','gen_sma','gen_trig','gen_sd2','gen_smp2','gen_sma2','gen_kuliah','gen_kuliah2','gen_umum'];
const code=['core',...files.filter(f=>f!=='core')].map(f=>fs.readFileSync(`src/${f}.js`,'utf8')).join('\n')+'\n;this.__T=TOPICS;this.__seed=seedRng;';
const ctx={console};vm.createContext(ctx);vm.runInContext(code,ctx);
const T=ctx.__T;let bad=0,total=0;const uniq={};
for(const lv in T)for(const tp of T[lv])for(let d=1;d<=3;d++){
  const gens=tp.gens.filter(g=>g.min<=d);
  for(const g of gens){let ok=0,nul=0;
    for(let i=0;i<300;i++){ctx.__seed(i*7919+d);let r;try{r=g.fn(d)}catch(e){console.log('ERR',lv,tp.id,d,g.fn.name,e.message);bad++;break}
      total++;
      if(!r||!r.o){nul++;continue}
      const o=r.o;const set=new Set(o.opts);
      if(o.opts.length!==4||set.size!==4||o.ans<0||o.ans>3||/NaN|undefined|Infinity|\[object/.test(r.q+o.opts.join('|')+(r.exp||''))){console.log('BAD',lv,tp.id,d,g.fn.name,r.q.slice(0,80),o.opts);bad++;break}
      ok++;(uniq[tp.id]??=new Set()).add(r.q+'|'+o.opts[o.ans]);
    }
    if(nul>60)console.log('many nulls',lv,tp.id,d,g.fn.name,nul);
  }}
console.log('checked',total,'bad',bad);
for(const k in uniq)console.log(k,uniq[k].size);
