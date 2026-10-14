"""Read-only diagram gate for the selective edited view; writes evidence only."""
from pathlib import Path
import argparse, collections, hashlib, json, re, xml.etree.ElementTree as ET
from usecase_trace import TRACE

p=argparse.ArgumentParser()
p.add_argument('--input',type=Path)
p.add_argument('--out',type=Path,required=True)
a=p.parse_args()
base=Path(__file__).resolve().parents[1]
ev=base.parents[1]/'Reviews/evidence/use-case-edited-remediation-2026-09-29'
target=a.input or base/'saas-sentry-use-case-diagram-edited.drawio'
raw=target.read_bytes(); root=ET.fromstring(raw)
nodes=root.findall('.//mxCell'); cells={c.get('id'):c for c in nodes}
before=json.loads((ev/'before-inventory.json').read_text(encoding='utf-8'))
def inv(c):
    g=c.find('mxGeometry')
    return dict(attributes=dict(c.attrib),geometry=ET.tostring(g,encoding='unicode') if g is not None else None)
after={i:inv(c) for i,c in cells.items()}
edges=[c for c in nodes if c.get('edge')=='1']
actors={i for i in cells if re.fullmatch(r'A\d{2}',i)}
ucs={i for i in cells if re.fullmatch(r'UC\d{2}',i)}
assoc=[c for c in edges if 'endArrow=none' in c.get('style','')]
pairs=[(c.get('source'),c.get('target')) for c in assoc]
checks={}
skipped=[]
def check(n,v):checks[n]=bool(v)
check('one_page',len(root.findall('diagram'))==1)
check('unique_ids',len(nodes)==len(cells))
check('endpoints_and_parents',all(c.get(k) in cells for c in nodes for k in ('source','target','parent') if c.get(k)))
check('no_dangling_edge',all(c.get('source') in cells and c.get('target') in cells for c in edges))
check('no_duplicate_association',len(pairs)==len(set(tuple(sorted(x)) for x in pairs)))
# Owner's selective view (QĐ-46 removed A09; the Owner dropped the other technical actors on the teacher's advice)
check('selected_actors_only',actors=={'A01','A02','A03','A04','A05','A06','A08','A12'})
check('no_identity_provider',not any('A09'==c.get('id') or 'A09' in (c.get('source'),c.get('target')) or 'Identity' in c.get('value','') for c in nodes))
check('system_user_label',any('System User' in c.get('value','') for c in nodes))
# ---- expected content derived from the single model + the spec of the edited view (not from historical counts)
import usecase_model as M
EDITED_UCS=set('UC%02d'%n for n in (1,2,3,4,5,6,7,8,9,10,11,13,14,15,16,17,20,21,22,23,24,26,27,28,29,30,32,33,36,42,43,44,47,48,54,55,56,59,60))
check('use_cases_are_the_edited_set',ucs==EDITED_UCS)
VIEW_ACTORS={'A02','A03','A04','A05','A06','A08'}
expected={(a,u) for a,u,_ in M.ASSOCIATIONS if a in VIEW_ACTORS and u in EDITED_UCS}
expected|={('A01',u) for u in ('UC11','UC13','UC27','UC44','UC48')}
expected|={('A12','UC01'),('A12','UC59'),('A06','UC60'),('A04','UC56'),('A05','UC56')}
# The view has no Governance User: A12 is System User (only UC01/UC59) and every role generalizes only to A12, so the
# role links that the full model inherits must be drawn directly (spec, edited view "Vai trò và quyền"/"Truy vết"):
# UC56 for each report audience of BRD 5.5.3 (FR-5.9..5.12, FR-0.3); UC11 for the Manager acting for a new hire (US-03-02).
expected|={(a,'UC56') for a in ('A02','A03','A06')}|{('A02','UC11')}
# Presentation-only omissions. Emptied 04/10/2026: the eight pairs the hand edit of 02/10/2026 left out (A03-UC07,
# A02-UC11, A03/A04/A06-UC29, A02/A03/A06-UC56) are required by BRD/User Stories (spec, "Truy vết" of the edited view)
# and are drawn. A future entry needs a cited business source; it is listed under "not_verified" and the run does NOT
# pass: exit code 2 (= not verified) when every check passes but an omission remains, exit 1 when any check fails.
KNOWN_OMISSIONS={}
drawn={(a,u) if re.fullmatch(r'A\d\d',a) else (u,a) for a,u in pairs}
required=expected-set(KNOWN_OMISSIONS)
missing=sorted(required-drawn); extra=sorted(drawn-expected)
check('associations_match_model_except_known_omissions',not missing and not extra)
not_verified=['association %s-%s omitted (presentation only): %s'%(k[0],k[1],v) for k,v in sorted(KNOWN_OMISSIONS.items()) if k not in drawn]
omitted=sorted(k for k in KNOWN_OMISSIONS if k not in drawn)
check('uc01_and_uc59_belong_to_system_user_only',sorted(u for a,u in drawn if a=='A12')==['UC01','UC59'])
check('uc56_only_governance_roles',{a for a,u in drawn if u=='UC56'}<={'A02','A03','A04','A05','A06'} and {'A04','A05'}<={a for a,u in drawn if u=='UC56'})
check('uc60_only_super_admin',[a for a,u in drawn if u=='UC60']==['A06'])
check('self_service_employee',all(('A01',u) in drawn for u in ['UC11','UC13','UC27','UC44','UC48']))
check('no_finance_spend',not any(a=='A04' and u in ['UC55','UC16','UC30','UC43'] for a,u in drawn))
check('super_admin_no_business_decision',not any(a=='A06' and u in ['UC16','UC30','UC43','UC55','UC21','UC22'] for a,u in drawn))
check('profile_and_credentials_goal_is_coded',cells.get('UC59') is not None and 'Manage My Account' in cells['UC59'].get('value','') and not any(c.get('value')=='Manage Profile' for c in nodes))
check('transfer_goal_named',cells.get('UC60') is not None and 'Transfer Super Admin Role' in cells['UC60'].get('value',''))
# ---- UML relations of the view: what the business model requires, not what a past inventory held
def rel(i):
    c=cells.get(i)
    return None if c is None else (c.get('source'),c.get('target'),c.get('style',''))
gens=[('GA01','A01'),('GA02','A02'),('GA03','A03'),('GA04','A04'),('GA05','A05'),('GA06','A06')]
check('actor_generalizations_to_system_user',all(rel(g) and rel(g)[0]==a and rel(g)[1]=='A12' and 'endArrow=block' in rel(g)[2] for g,a in gens))
check('use_case_generalizations_to_uc55',all(rel(g) and rel(g)[1]=='UC55' and rel(g)[0]==u and 'endArrow=block' in rel(g)[2] for g,u in [('GU01','UC16'),('GU02','UC30'),('GU03','UC43')]))
check('include_extend_relations',all(rel(i) and rel(i)[:2]==pr for i,pr in [('IN02',('UC06','UC54')),('IN03',('UC32','UC54')),('EX04',('UC17','UC55')),('EX05',('UC22','UC08'))]))
orig=base/'saas-sentry-use-case-diagram.drawio'
if orig.exists():
    check('original_unchanged',hashlib.sha256(orig.read_bytes()).hexdigest()==before['original_sha256'])
else:
    skipped.append('original_unchanged: saas-sentry-use-case-diagram.drawio is absent from the folder (pre-existing; not verified)')
check('trace_all_ucs',all(u in TRACE for u in ucs))
docs=base.parents[1]
source_text={
    'FR':'\n'.join(f.read_text(encoding='utf-8') for f in (docs/'Requiments').glob('BRD*.md')),
    'US':(docs/'BE-UserStory/user-stories-and-epics.md').read_text(encoding='utf-8'),
    'BR':'\n'.join(f.read_text(encoding='utf-8') for f in (base.parent/'user-flows').rglob('*.md')),
}
missing_trace={kind:sorted({code for u in ucs for code in TRACE.get(u,{}).get(kind,[]) if code not in src}) for kind,src in source_text.items()}
check('trace_codes_exist',not any(missing_trace.values()))
def box(i):
    g=cells[i].find('mxGeometry')
    x,y,w,h=(float(g.get(k,0)) for k in ('x','y','width','height'))
    parent=cells[i].get('parent')
    if parent in cells and cells[parent].find('mxGeometry') is not None:
        px,py,_,_=box(parent);x+=px;y+=py
    return x,y,w,h
bx,by,bw,bh=box('boundary')
check('all_ovals_inside_boundary',all(bx<=box(u)[0] and by<=box(u)[1] and box(u)[0]+box(u)[2]<=bx+bw and box(u)[1]+box(u)[3]<=by+bh for u in ucs))
check('actors_outside_boundary',all(box(i)[0]+box(i)[2]<=bx or box(i)[0]>=bx+bw or box(i)[1]+box(i)[3]<=by or box(i)[1]>=by+bh for i in actors))
def cpt(i,st,pre):
    x,y,w,h=box(i); m={k:float(v) for k,v in re.findall(r'(%sX|%sY)=([0-9.]+)'%(pre,pre),st)}
    return (x+w*m[pre+'X'],y+h*m[pre+'Y']) if pre+'X' in m else (x+w/2,y+h/2)
def wire(c):
    st=c.get('style',''); ox,oy,_,_=box(c.get('parent')) if cells[c.get('parent')].find('mxGeometry') is not None else (0,0,0,0)
    pts=[(ox+float(q.get('x')),oy+float(q.get('y'))) for q in c.findall('mxGeometry/Array/mxPoint')]
    return [cpt(c.get('source'),st,'exit')]+pts+[cpt(c.get('target'),st,'entry')]
def inside(pt,u,f=0.97):
    x,y,w,h=box(u); return ((pt[0]-x-w/2)/(w/2))**2+((pt[1]-y-h/2)/(h/2))**2<f
pierced=sorted({(c.get('id'),u) for c in assoc for P in [wire(c)] for p0,p1 in zip(P,P[1:]) for t in range(1,200)
                for u in ucs if u not in (c.get('source'),c.get('target')) and inside((p0[0]+(p1[0]-p0[0])*t/200,p0[1]+(p1[1]-p0[1])*t/200),u)})
check('associations_do_not_cross_other_ovals',not pierced)
mapping={u:dict(label=cells[u].get('value'),direct_actors=sorted(a for a,x in drawn if x==u),trace=TRACE.get(u)) for u in sorted(ucs)}
check('new_ovals_named',all(u in cells and name in cells[u].get('value','') for u,name in [('UC47','Process Data Subject Requests'),('UC56','Review Governance Reports'),('UC59','Manage My Account'),('UC60','Transfer Super Admin Role')]))
# informational only: the 2026-09-29 inventory is history (Owner hand edits followed on 02/10/2026); it no longer gates
changed={i:dict(before=before['cells'][i],after=after[i]) for i in after.keys() & before['cells'].keys() if after[i]!=before['cells'][i]}
result=dict(input=str(target),sha256=hashlib.sha256(raw).hexdigest(),original_sha256=before['original_sha256'],checks=checks,skipped=skipped,missing_trace=missing_trace,known_omissions={'%s-%s'%k:KNOWN_OMISSIONS[k] for k in omitted},not_verified=not_verified,pierced=pierced,counts=dict(actors=len(actors),use_cases=len(ucs),associations=len(assoc),edges=len(edges)),added=sorted(after.keys()-before['cells'].keys()),removed=sorted(before['cells'].keys()-after.keys()),changed=changed,mapping=mapping)
a.out.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(dict(counts=result['counts'],skipped=skipped,not_verified=not_verified,failed=[k for k,v in checks.items() if not v],sha256=result['sha256']),ensure_ascii=False))
raise SystemExit(1 if not all(checks.values()) else (2 if not_verified else 0))
