import MiniSearch from 'minisearch';

export type Category = 'Onboarding' | 'Operations' | 'Demo boundaries';
export type Passage = {id: string; title: string; section: string; category: Category; text: string; keywords: string};
export const passages: Passage[] = [
  {id:'review',title:'Onboarding approvals',section:'Review and approval',category:'Onboarding',keywords:'intake approve approval checklist kickoff',text:'In this fictional workflow, intake collects a sample company, contact, email, project notes and target kickoff. A coordinator moves the record to Review. Review notes must contain at least 10 non-whitespace characters. Approval creates four checklist tasks once.'},
  {id:'ownership',title:'Checklist ownership',section:'Client and team tasks',category:'Onboarding',keywords:'assigned assignee client team edit assignment',text:'Clients can complete their own checklist tasks. Team tasks are read-only in the client view. A coordinator can change task assignments; assignment edits must be saved before they take effect. These role views simulate permissions and are not production authentication.'},
  {id:'ready',title:'Readiness and handover',section:'Reopening a ready task',category:'Onboarding',keywords:'reopen ready readiness handover incomplete',text:'All checklist tasks must be complete before the onboarding is ready. Reopening a completed task withdraws readiness. Automatic readiness is optional; manual readiness still checks the entire checklist. Handover requires at least 10 non-whitespace characters of notes and freezes further task changes.'},
  {id:'reminders',title:'Message previews',section:'Reminders and delivery',category:'Onboarding',keywords:'send sending messages email reminder automation welcome overdue',text:'Welcome and reminder previews create local message drafts only. They never send email or contact clients. Reminder previews use overdue task sets and the current day to avoid duplicate drafts for the same set. No background scheduler or delivery service is connected.'},
  {id:'quote',title:'Quote approvals',section:'Draft estimates',category:'Operations',keywords:'price pricing quote cost estimate approval GBP invoice',text:'A fictional quote requires line descriptions, positive quantities, non-negative rates and a positive total. The owner approves a draft before scheduling. GBP totals are sample estimates, not invoices, tax calculations or payment requests.'},
  {id:'booking',title:'Booking rules',section:'Staff conflicts',category:'Operations',keywords:'book booking schedule overlap conflict staff hours duration appointment',text:'Sample bookings use local hours from 08:00 to 18:00 and a duration between 15 and 480 minutes. Overlapping active bookings for the same staff member are rejected. Adjacent bookings and bookings for different staff members are allowed. Booking dates must be in the future.'},
  {id:'completion',title:'Job completion',section:'Assigned staff workflow',category:'Operations',keywords:'job complete completed start staff notes scheduled',text:'Assigned staff can start scheduled jobs. Completion requires notes with at least 10 trimmed characters. Completed jobs are no longer active bookings. This is a fictional operational workflow and does not record real work or client outcomes.'},
  {id:'session',title:'Local data and reset',section:'Session storage',category:'Demo boundaries',keywords:'reset clear delete reload refresh storage persistence data browser',text:'Demo data is stored in sessionStorage for the current browser tab. Reloading retains that tab session. Resetting this assistant removes its conversations and support drafts. It does not reset the other portfolio demos. Browser storage may be unavailable; in that case changes remain in memory until reload.'},
  {id:'support',title:'Unsupported questions',section:'Support drafts',category:'Demo boundaries',keywords:'support escalation unknown answer unavailable draft escalation response',text:'When the sample library does not contain a matching passage, this assistant does not invent an answer. You can save an editable support draft locally and mark it Reviewed. No ticket is submitted, no message is sent, and no response-time promise is made.'},
  {id:'limits',title:'Demo scope',section:'No live AI connection',category:'Demo boundaries',keywords:'AI model LLM live artificial intelligence API privacy source retrieval fictional',text:'This is a local retrieval demonstration, not a live AI model. MiniSearch retrieves fictional sample passages; displayed excerpts are copied directly from those passages. There are no external model calls, accounts, analytics, payments or real client records. Source matches are not confidence scores.'}
];
const stop = new Set('a an the is are was were to of for in on at and or i me my you your we our it this that what when how can do does will please'.split(' '));
const processTerm = (term: string) => {const normalized = term.toLowerCase(); return stop.has(normalized) ? null : normalized;};
const index = new MiniSearch<Passage>({fields:['title','section','text','keywords'],storeFields:['id'],processTerm});
index.addAll(passages);
export function retrieve(query: string, category: Category | 'All' = 'All'): Passage[] {
  if (!query.trim() || query.length > 500) return [];
  const results = index.search(query,{combineWith:'AND',prefix:true,fuzzy:false,filter: result => category === 'All' || passages.find(p=>p.id===result.id)?.category===category});
  return results.slice(0,3).map(result=>passages.find(p=>p.id===result.id)!);
}
export type Turn = {id:string; query:string; category:Category|'All'; sources:string[]};
export type Draft = {id:string; subject:string; body:string; status:'Draft'|'Reviewed'};
export type State = {turns:Turn[]; drafts:Draft[]};
export const emptyState = ():State => ({turns:[],drafts:[]});
export const key = 'navrenlo-knowledge-v1';
export function parseState(raw:string|null):State {
  try {
    const value:unknown = JSON.parse(raw || 'null');
    if (!value || typeof value!=='object') return emptyState();
    const s=value as State;
    if (!Array.isArray(s.turns)||!Array.isArray(s.drafts)||s.turns.length>100||s.drafts.length>100) return emptyState();
    if (!s.turns.every(t=>t && typeof t.id==='string' && typeof t.query==='string' && t.query.length<=500 && ['All','Onboarding','Operations','Demo boundaries'].includes(t.category) && Array.isArray(t.sources) && t.sources.every(id=>passages.some(p=>p.id===id)))) return emptyState();
    if (!s.drafts.every(d=>d && typeof d.id==='string' && typeof d.subject==='string' && d.subject.length<=160 && typeof d.body==='string' && d.body.length<=4000 && ['Draft','Reviewed'].includes(d.status))) return emptyState();
    return s;
  } catch {return emptyState();}
}
