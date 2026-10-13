import { describe, expect, it } from 'vitest';
import { emptyState, parseState, passages, retrieve } from './model';
describe('Source retrieval',()=>{
  it('returns exact corpus passages for the sample prompts',()=>{
    for(const [query,id] of [['Reopen ready task','ready'],['Send reminder messages','reminders'],['Booking staff conflicts','booking'],['Reset data','session']]) {
      expect(retrieve(query).map(p=>p.id)).toContain(id);
      for(const result of retrieve(query)) expect(result).toEqual(passages.find(p=>p.id===result.id));
    }
  });
  it('does not answer unknown or stop-word-only questions',()=>{
    expect(retrieve('quantum mars hologram')).toEqual([]);
    expect(retrieve('What is the')).toEqual([]);
    expect(retrieve('')).toEqual([]);
    expect(retrieve('x'.repeat(501))).toEqual([]);
  });
  it('requires all meaningful terms instead of matching only a generic word',()=>{
    expect(retrieve('booking unicorn')).toEqual([]);
  });
  it('isolates collections',()=>{
    expect(retrieve('Booking staff conflicts','Onboarding')).toEqual([]);
    expect(retrieve('Booking staff conflicts','Operations')[0].id).toBe('booking');
  });
});
describe('Session validation',()=>{
  it('falls back safely for malformed or unrelated data',()=>{
    for(const value of [null,'garbage','{}','null','{"turns":[null],"drafts":[]}']) expect(parseState(value)).toEqual(emptyState());
  });
  it('rejects missing sources and invalid draft statuses',()=>{
    expect(parseState(JSON.stringify({turns:[{id:'1',query:'hello',category:'All',sources:['missing']}],drafts:[]}))).toEqual(emptyState());
    expect(parseState(JSON.stringify({turns:[],drafts:[{id:'1',subject:'Test',body:'Notes',status:'Sent'}]}))).toEqual(emptyState());
  });
  it('retains valid conversations and drafts',()=>{
    const state={turns:[{id:'1',query:'Reset data',category:'All',sources:['session']}],drafts:[{id:'2',subject:'Question',body:'Additional notes',status:'Draft'}]};
    expect(parseState(JSON.stringify(state))).toEqual(state);
  });
});
