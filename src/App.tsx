import { useEffect, useRef, useState } from 'react';
import { ArrowUp, BookOpen, Check, ChevronRight, FileText, LifeBuoy, MessageSquare, Plus, RotateCcw, Search, ShieldCheck, Trash2, X } from 'lucide-react';
import { Category, Draft, State, emptyState, key, parseState, passages, retrieve } from './model';

const examples = ['Reopen ready task', 'Send reminder messages', 'Booking staff conflicts', 'Reset data'];
const categories = ['All','Onboarding','Operations','Demo boundaries'] as const;
function readSession() {try{return parseState(sessionStorage.getItem(key));}catch{return emptyState();}}
export default function App() {
  const [state,setState]=useState<State>(readSession);
  const [view,setView]=useState<'Assistant'|'Library'|'Support drafts'>('Assistant');
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState<Category|'All'>('All');
  const [filter,setFilter]=useState('');
  const [source,setSource]=useState<string|null>(null);
  const [draft,setDraft]=useState<Draft|null>(null);
  const [reset,setReset]=useState(false);
  const [notice,setNotice]=useState('');
  const [searchStatus,setSearchStatus]=useState('');
  const [storageError,setStorageError]=useState(false);
  const bottom=useRef<HTMLDivElement>(null);
  const input=useRef<HTMLTextAreaElement>(null);
  useEffect(()=>{try{sessionStorage.setItem(key,JSON.stringify(state));setStorageError(false);}catch{setStorageError(true);}},[state]);
  useEffect(()=>{bottom.current?.scrollIntoView({block:'nearest'});},[state.turns]);
  function ask(text=query) {
    if(!text.trim()) return;
    const sources=retrieve(text,category).map(p=>p.id);
    setSearchStatus(`${sources.length ? `${sources.length} matching source passages` : 'No matching source'} for ${text.trim()}.`);
    setState(s=>({...s,turns:[...s.turns,{id:crypto.randomUUID(),query:text.trim().slice(0,500),category,sources}].slice(-100)}));
    setQuery('');setView('Assistant');
  }
  function newDraft(subject:string) {if(state.drafts.length>=100){setNotice('Draft limit reached (100). Delete a saved draft before creating another.');return;}setDraft({id:crypto.randomUUID(),subject:subject.slice(0,160),body:'',status:'Draft'});}
  const visible=passages.filter(p=>(category==='All'||p.category===category)&&`${p.title} ${p.section} ${p.text}`.toLowerCase().includes(filter.toLowerCase()));
  const selected=passages.find(p=>p.id===source);
  return <div className="app">
    <header className="brandbar"><a className="brand" href="#" onClick={e=>{e.preventDefault();setView('Assistant');}}><img src="/branding/navrenlo-icon.png" alt=""/><span>Navrenlo<span className="brand-sub">TECHNOLOGIES</span></span></a><span className="tagline">Custom software. Built for growth.</span><span className="demo-badge">FICTIONAL DEMO</span></header>
    <div className="shell"><aside className="sidebar"><div className="workspace-label">KNOWLEDGE WORKSPACE</div><nav aria-label="Workspace">{([{name:'Assistant',icon:MessageSquare},{name:'Library',icon:BookOpen},{name:'Support drafts',icon:LifeBuoy}] as const).map(({name,icon:Icon})=><button key={name} className={view===name?'active':''} onClick={()=>setView(name)}><Icon size={18}/><span>{name}</span><span className="count">{name==='Library'?passages.length:name==='Support drafts'?state.drafts.length:''}</span></button>)}</nav><div className="sidebar-bottom"><ShieldCheck size={20}/><strong>Local, source-backed</strong><p>No live AI model connected.<br/>No messages are sent.</p><button className="reset" onClick={()=>setReset(true)}><RotateCcw size={15}/> Reset assistant</button></div></aside>
    <main><div className="page-heading"><div><div className="eyebrow">NAVRENLO / SUPPORT LAB</div><h1>{view==='Assistant'?'Knowledge & Support':view==='Library'?'Source library':'Support drafts'}</h1><p>{view==='Assistant'?'Fictional sample policies and workflow notes.':view==='Library'?'10 fictional source passages.':'Local drafts only. Nothing is submitted or sent.'}</p></div><div className="heading-actions"><span className="local"><span/>Local retrieval demo</span><button title="Reset assistant" aria-label="Reset assistant" onClick={()=>setReset(true)}><RotateCcw size={16}/></button></div></div>
    {storageError&&<div className="warning" role="alert">Browser storage unavailable. Changes last until reload only.</div>}
    <div className="sr-only" role="status" aria-live="polite">{searchStatus}</div>
    {notice&&<div className="notice" role="status">{notice}<button title="Dismiss notification" aria-label="Dismiss notification" onClick={()=>setNotice('')}><X size={16}/></button></div>}
    {view!=='Support drafts'&&<div className="filterbar"><label htmlFor="category">Collection</label><select id="category" value={category} onChange={e=>setCategory(e.target.value as Category|'All')}>{categories.map(c=><option key={c}>{c}</option>)}</select><span>{category==='All'?'10':passages.filter(p=>p.category===category).length} passages</span></div>}
    {view==='Assistant'&&<section className="assistant" aria-label="Assistant conversation"><div className="conversation">
      {!state.turns.length&&<div className="empty"><div className="symbol"><BookOpen size={28}/></div><h2>Find the source. Keep the context.</h2><p>Sample knowledge across onboarding, operations and demo boundaries.</p><div className="suggestions">{examples.map(q=><button key={q} onClick={()=>ask(q)}>{q}<ChevronRight size={16}/></button>)}</div></div>}
      {state.turns.map(t=><article className="turn" key={t.id}><div className="question"><span className="eyebrow">YOUR QUESTION / {t.category}</span><h2>{t.query}</h2></div><div className="answer"><div className="answer-label"><BookOpen size={16}/>{t.sources.length?'Retrieved excerpts':'No matching source'}</div>{t.sources.map(id=>{const p=passages.find(p=>p.id===id)!;return <div className="excerpt" key={id}><button className="source-link" onClick={()=>setSource(id)}><FileText size={15}/>{p.title}<ChevronRight size={14}/></button><p>{p.text}</p></div>;})}{!t.sources.length&&<p>No passage matches all searchable terms in this collection. Try a shorter question, another collection, or create a support draft.</p>}<button className="text-action" onClick={()=>newDraft(t.query)}><Plus size={15}/>Create support draft</button></div></article>)}<div ref={bottom}/>
      </div><form className="composer" onSubmit={e=>{e.preventDefault();ask();}}><label className="sr-only" htmlFor="question">Ask the sample library</label><textarea ref={input} id="question" value={query} maxLength={500} placeholder="Ask the sample library..." onChange={e=>setQuery(e.target.value)}/><button className="send" type="submit" disabled={!query.trim()} title="Search sources" aria-label="Search sources"><ArrowUp size={20}/></button><div className="composer-meta"><span>Source excerpts, not AI-generated answers</span><span>{query.length}/500</span></div></form></section>}
    {view==='Library'&&<section><label className="library-search"><Search size={18}/><span className="sr-only">Filter source library</span><input placeholder="Filter source library" value={filter} onChange={e=>setFilter(e.target.value)} maxLength={160}/></label><div className="library-list">{visible.map(p=><button key={p.id} className="document" onClick={()=>setSource(p.id)}><div className="document-icon"><FileText size={22}/></div><div><span className="eyebrow">{p.category}</span><h2>{p.title}</h2><p>{p.section}</p></div><ChevronRight size={18}/></button>)}</div>{!visible.length&&<p className="empty-message">No sources match this filter.</p>}</section>}
    {view==='Support drafts'&&<section><div className="draft-toolbar"><span>{state.drafts.length} saved drafts</span><button className="primary" onClick={()=>newDraft('')}><Plus size={16}/>New draft</button></div>{!state.drafts.length&&<div className="empty"><LifeBuoy size={32}/><h2>No support drafts yet</h2><p>Questions that need more context can be kept here.</p></div>}{state.drafts.map(d=><article className="draft-row" key={d.id}><FileText size={20}/><div><button className="draft-title" onClick={()=>setDraft({...d})}>{d.subject}</button><p>{d.body.slice(0,140)}</p></div><span className={`status ${d.status.toLowerCase()}`}>{d.status}</span><button aria-label={`Delete ${d.subject}`} title="Delete draft" onClick={()=>{setState(s=>({...s,drafts:s.drafts.filter(x=>x.id!==d.id)}));setNotice('Draft deleted.');}}><Trash2 size={17}/></button></article>)}</section>}
    <footer>Fictional demonstration, not client work. <span>Navrenlo Technologies</span></footer></main></div>
    {selected&&<Modal title={selected.title} close={()=>setSource(null)}><div className="source-category">{selected.category} / Fictional source</div><h3>{selected.section}</h3><p className="source-text">{selected.text}</p><div className="source-note">Source ID: {selected.id} · Sample policy, not real client documentation.</div></Modal>}
    {draft&&<Modal title="Support draft" close={()=>setDraft(null)}><p className="muted">Saved in this tab only. Nothing is sent.</p><form className="draft-form" onSubmit={e=>{e.preventDefault();if(!draft.subject.trim()||!draft.body.trim())return;setState(s=>({...s,drafts:[...s.drafts.filter(d=>d.id!==draft.id),{...draft,subject:draft.subject.trim(),body:draft.body.trim()}]}));setDraft(null);setNotice('Support draft saved locally.');}}><label>Subject<input required maxLength={160} value={draft.subject} onChange={e=>setDraft({...draft,subject:e.target.value})}/></label><label>Notes<textarea required maxLength={4000} rows={6} value={draft.body} onChange={e=>setDraft({...draft,body:e.target.value})}/></label><label>Status<select aria-label="Status" value={draft.status} onChange={e=>setDraft({...draft,status:e.target.value as Draft['status']})}><option>Draft</option><option>Reviewed</option></select></label><button className="primary" disabled={!draft.subject.trim()||!draft.body.trim()}><Check size={16}/>Save draft</button></form></Modal>}
    {reset&&<Modal title="Reset assistant?" close={()=>setReset(false)}><p>All conversations and support drafts in this assistant will be removed. Other demos are unchanged.</p><div className="modal-actions"><button onClick={()=>setReset(false)}>Cancel</button><button className="danger" onClick={()=>{setState(emptyState());setQuery('');setFilter('');setCategory('All');setView('Assistant');setSource(null);setDraft(null);setReset(false);setNotice('Assistant reset.');}}>Reset assistant</button></div></Modal>}
  </div>;
}
function Modal({title,close,children}:{title:string;close:()=>void;children:React.ReactNode}) {
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const dialog=ref.current!;const opener=document.activeElement as HTMLElement|null;dialog.showModal();return()=>{dialog.close();opener?.focus();};},[]);
  return <dialog ref={ref} aria-label={title} onCancel={e=>{e.preventDefault();close();}}><div className="modal-header"><h2>{title}</h2><button onClick={close} title="Close dialog" aria-label="Close dialog"><X size={20}/></button></div>{children}</dialog>;
}
