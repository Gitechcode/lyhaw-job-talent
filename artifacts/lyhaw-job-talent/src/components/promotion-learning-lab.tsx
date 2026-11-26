import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, BookOpen, Check, CheckCircle2, ClipboardCheck, FlaskConical, LockKeyhole, Target, TrendingUp } from 'lucide-react';

type Question = { question: string; choices: string[]; answer: number; explanation: string };
type Stage = { id: string; from: string; to: string; title: string; overview: string; learn: string[]; practice: string[]; evidence: string[]; questions: Question[] };

const stages: Stage[] = [
  {
    id: 'intern-officer', from: 'Intern', to: 'Officer', title: 'ពីអ្នករៀនការងារ ទៅអ្នកទទួលខុសត្រូវការងារ', overview: 'Officer មិនត្រឹមតែធ្វើតាមការបញ្ជាទេ។ គាត់យល់ពីគោលដៅ រៀបចំអាទិភាព សួរឱ្យច្បាស់ រាយការណ៍មុន deadline និងអាចបញ្ចប់ការងារស្តង់ដារដោយខ្លួនឯង។',
    learn: ['យល់ពី JD, SOP, KPI និងរបៀបដែលការងាររបស់អ្នកភ្ជាប់ទៅលទ្ធផលក្រុម', 'ប្រើ Daily Priority និង Weekly Plan ដើម្បីគ្រប់គ្រង deadline', 'សរសេរ email, chat និង report ខ្លី ច្បាស់ និងមាន action', 'សួរសំណួរបែប outcome–deadline–standard មុនចាប់ផ្តើមការងារ', 'ទទួល feedback ដោយមិនការពារខ្លួន ហើយបម្លែងវាទៅ action plan'],
    practice: ['រៀបចំ Weekly Plan ១ សប្តាហ៍ និងផ្ញើ update ចុងសប្តាហ៍', 'បំពេញការងារស្តង់ដារមួយដោយប្រើ SOP ហើយ self-check មុនប្រគល់', 'សុំ feedback ពី supervisor លើចំណុចខ្លាំង ១ និងចំណុចកែលម្អ ១'],
    evidence: ['SOP checklist ដែលបានចុះកាលបរិច្ឆេទ', 'Weekly plan និង result report', 'Work sample មុន/ក្រោយ feedback', 'Feedback note និង action ដែលបានកែលម្អ'],
    questions: [
      { question: 'មេទម្លាក់ការងារថ្មី តែមិនប្រាប់ deadline។ តើជំហានដំបូងល្អបំផុតគឺអ្វី?', choices: ['ចាប់ធ្វើភ្លាម ហើយសង្ឃឹមថាទាន់', 'សួរ outcome, deadline និងអាទិភាព', 'រង់ចាំរហូតមេសួរ'], answer: 1, explanation: 'ការសួរឱ្យច្បាស់មុនធ្វើជួយកាត់បន្ថយ rework និងបង្ហាញ ownership។' },
      { question: 'អ្នកដឹងថាមិនអាចទាន់ deadline នៅថ្ងៃស្អែក។ តើគួរធ្វើដូចម្តេច?', choices: ['ស្ងាត់រហូតដល់ deadline', 'រាយការណ៍ឥឡូវនេះជាមួយស្ថានភាព ហានិភ័យ និងជម្រើស', 'ផ្ទេរកំហុសទៅមិត្តរួមការងារ'], answer: 1, explanation: 'Officer ត្រូវរាយការណ៍មុនបញ្ហាក្លាយជាវិបត្តិ និងនាំយកជម្រើសដោះស្រាយ។' },
      { question: 'Feedback ថា report របស់អ្នកមិនច្បាស់។ តើការឆ្លើយតបណាបង្ហាញ Growth Mindset?', choices: ['និយាយថាអ្នកផ្សេងក៏ធ្វើដូចគ្នា', 'សុំឧទាហរណ៍ និងកែ template សម្រាប់ report បន្ទាប់', 'ឈប់សរសេរ report'], answer: 1, explanation: 'Growth Mindset ទទួលការពិត ស្វែងរកស្តង់ដារ និងអនុវត្តការកែលម្អ។' },
    ],
  },
  {
    id: 'officer-senior', from: 'Officer', to: 'Senior', title: 'ពីអ្នកអនុវត្ត ទៅអ្នកជំនាញដែលបង្កើតតម្លៃ', overview: 'Senior ត្រូវដោះស្រាយបញ្ហាស្មុគស្មាញ បង្កើនគុណភាពការងារ បង្រៀនអ្នកថ្មី និងអាចកាន់ mini-project ដោយមិនត្រូវតាមដានរាល់ជំហាន។',
    learn: ['ប្រើ 5 Whys និង data ដើម្បីរក root cause មិនដោះស្រាយតែរោគសញ្ញា', 'បង្កើត process map និងស្វែងរក bottleneck, waste និង risk', 'សរសេរ recommendation ដែលមាន option, impact, cost និង risk', 'បង្រៀនអ្នកថ្មីដោយ Explain–Demonstrate–Practice–Feedback', 'គ្រប់គ្រង mini-project ដោយមាន scope, milestone, owner និង review'],
    practice: ['ដឹកនាំ improvement project មួយដែលកាត់ពេល កំហុស ឬថ្លៃដើម', 'បង្កើត SOP/checklist ថ្មីមួយ និងសាកល្បងជាមួយអ្នកប្រើ', 'Mentor Intern/Officer ម្នាក់រយៈពេល ២ សប្តាហ៍ និងកត់ progress'],
    evidence: ['Before/after metric របស់ improvement project', 'Problem analysis និង recommendation memo', 'SOP/checklist ដែលក្រុមបានប្រើ', 'Mentoring plan និង feedback ពីអ្នករៀន'],
    questions: [
      { question: 'បញ្ហាដដែលកើតឡើងរាល់សប្តាហ៍។ Senior គួរធ្វើអ្វី?', choices: ['ជួសជុលរាល់លើកដូចមុន', 'រក root cause និងកែ process/control', 'រង់ចាំ manager ដោះស្រាយ'], answer: 1, explanation: 'Senior បង្កើតដំណោះស្រាយដែលបញ្ឈប់ការកើតឡើងម្តងទៀត មិនត្រឹមតែពន្លត់ភ្លើង។' },
      { question: 'ពេលបង្ហាត់អ្នកថ្មី តើវិធីណាមានប្រសិទ្ធភាពជាងគេ?', choices: ['ផ្តល់ឯកសារហើយទុកឱ្យរៀនឯង', 'ធ្វើឱ្យមើល ឱ្យសាកធ្វើ សង្កេត និងផ្តល់ feedback', 'ធ្វើជំនួសគេគ្រប់ពេល'], answer: 1, explanation: 'ការអនុវត្តជាមួយ feedback បង្កើតសមត្ថភាព និងទំនុកចិត្តបានលឿន។' },
      { question: 'Recommendation ល្អគួរមានអ្វី?', choices: ['មតិផ្ទាល់ខ្លួនតែមួយ', 'Data, options, impact, risk និងសំណើ', 'បញ្ជីបញ្ហាវែងដោយគ្មាន action'], answer: 1, explanation: 'អ្នកសម្រេចចិត្តត្រូវការភស្តុតាង ជម្រើស និង trade-off ច្បាស់។' },
    ],
  },
  {
    id: 'senior-supervisor', from: 'Senior', to: 'Supervisor', title: 'ពីជំនាញផ្ទាល់ខ្លួន ទៅលទ្ធផលរបស់ក្រុម', overview: 'Supervisor ជោគជ័យតាមរយៈក្រុម។ តួនាទីថ្មីគឺកំណត់លទ្ធផល បែងចែកការងារ តាមដាន KPI ផ្តល់ feedback និងបង្កើតបរិយាកាសដែលមនុស្សហ៊ានរាយការណ៍បញ្ហា។',
    learn: ['បម្លែង target ទៅ daily/weekly team KPI និងស្តង់ដារច្បាស់', 'ប្រគល់ការងារតាម skill និង readiness មិនតាមចំណូលចិត្ត', 'ធ្វើ daily huddle, one-on-one និង performance follow-up', 'ផ្តល់ feedback តាម Situation–Behavior–Impact–Next Step', 'ដោះស្រាយជម្លោះដោយស្តាប់ភាគីទាំងពីរ និងព្រមព្រៀង action'],
    practice: ['ដឹកនាំ daily huddle ១០ នាទីរយៈពេល ៥ ថ្ងៃ', 'ធ្វើ one-on-one ជាមួយសមាជិក ២ នាក់ និងកំណត់ development action', 'ប្រគល់ការងារមួយជាមួយ outcome, authority, checkpoint និង deadline'],
    evidence: ['Team KPI board មុន/ក្រោយ', 'One-on-one note និង development commitment', 'Delegation brief និង checkpoint result', 'Feedback ពីសមាជិកក្រុមអំពីភាពច្បាស់លាស់'],
    questions: [
      { question: 'សមាជិកធ្វើការខុសលើកដំបូង។ Supervisor គួរធ្វើអ្វីមុន?', choices: ['ស្តីបន្ទោសជាសាធារណៈ', 'សួរអ្វីកើតឡើង ពិនិត្យ skill/process ហើយ coach', 'យកការងារទាំងអស់មកធ្វើខ្លួនឯង'], answer: 1, explanation: 'ការស្វែងរកមូលហេតុជួយបែងចែកថាត្រូវ coach, clarify ឬកែ process។' },
      { question: 'Delegation ល្អមានអ្វីខ្លះ?', choices: ['ប្រាប់តែ “ធ្វើឱ្យល្អ”', 'Outcome, authority, deadline, resource និង checkpoint', 'ប្រគល់ហើយមិនតាមដាន'], answer: 1, explanation: 'ភាពច្បាស់ និង checkpoint ផ្តល់ទាំង ownership និងការគ្រប់គ្រងហានិភ័យ។' },
      { question: 'KPI ក្រុមធ្លាក់។ តើ Supervisor គួរចាប់ផ្តើមពីណា?', choices: ['រកអ្នកទទួលកំហុស', 'មើល data, process, capacity និង blocker ជាមួយក្រុម', 'បង្កើនសម្ពាធភ្លាម'], answer: 1, explanation: 'Data និងការសន្ទនាជាមួយក្រុមជួយរក root cause មុនជ្រើស intervention។' },
    ],
  },
  {
    id: 'supervisor-manager', from: 'Supervisor', to: 'Manager', title: 'ពីគ្រប់គ្រងប្រចាំថ្ងៃ ទៅដឹកនាំប្រព័ន្ធ', overview: 'Manager ត្រូវភ្ជាប់ strategy ទៅផែនការនាយកដ្ឋាន គ្រប់គ្រងថវិកា និងហានិភ័យ ហើយអភិវឌ្ឍ supervisor ឱ្យអាចដឹកនាំក្រុមដោយខ្លួនឯង។',
    learn: ['បង្កើត annual/quarterly plan ដែលភ្ជាប់ objective, KPI, initiative និង owner', 'រៀបចំ budget, resource plan និង scenario សម្រាប់ហានិភ័យ', 'ប្រើ dashboard ដើម្បីមើល trend មិនត្រឹមតែ snapshot', 'គ្រប់គ្រង manager/supervisor តាម outcome និង coaching cadence', 'ធ្វើ talent review, performance calibration និង succession plan'],
    practice: ['បង្កើត 90-day department plan ជាមួយ KPI និង resource', 'រៀបចំ monthly business review ដោយប្រើ dashboard', 'ធ្វើ talent review សម្រាប់ក្រុម និងកំណត់ successor សម្រាប់តួនាទីសំខាន់'],
    evidence: ['Approved 90-day plan និង KPI dashboard', 'Budget variance និង corrective action', 'Risk register និង mitigation owner', 'Talent matrix និង Individual Development Plan'],
    questions: [
      { question: 'Manager ឃើញ KPI ធ្លាក់ ១ ខែ។ តើអ្វីជាជំហានល្អ?', choices: ['ប្តូរបុគ្គលិកភ្លាម', 'ពិនិត្យ trend, driver, data quality និង action owner', 'លាក់ report រហូត KPI ឡើង'], answer: 1, explanation: 'Manager ត្រូវយល់ driver និង trend មុនសម្រេច intervention ដែលមានផលប៉ះពាល់។' },
      { question: 'Budget លើសផែនការ 15%។ Report ល្អគួរមានអ្វី?', choices: ['តួលេខតែមួយ', 'Variance cause, forecast, risk និង corrective action', 'ការពន្យល់ថាគ្រប់គ្នាចំណាយច្រើន'], answer: 1, explanation: 'ការគ្រប់គ្រងត្រូវការមូលហេតុ ផលប៉ះពាល់ទៅមុខ និង action ដែលមាន owner។' },
      { question: 'Manager ល្អគួរចំណាយពេលច្រើនលើអ្វី?', choices: ['ធ្វើការរបស់កូនក្រុមជំនួស', 'កំណត់ទិសដៅ កែលម្អប្រព័ន្ធ និងអភិវឌ្ឍអ្នកដឹកនាំ', 'ពិនិត្យ message រាល់ 5 នាទី'], answer: 1, explanation: 'តម្លៃរបស់ Manager គឺបង្កើតប្រព័ន្ធ និងមនុស្សដែលអាចផ្តល់លទ្ធផលបានជាបន្តបន្ទាប់។' },
    ],
  },
  {
    id: 'manager-director', from: 'Manager', to: 'Head / Director', title: 'ពីលទ្ធផលនាយកដ្ឋាន ទៅលទ្ធផលអាជីវកម្ម', overview: 'Head/Director គិតឆ្លងផ្នែក យល់ customer, revenue, cost, cash និងrisk។ គាត់បង្កើតជម្រើសយុទ្ធសាស្ត្រ ដឹកនាំការផ្លាស់ប្តូរ និងត្រៀមអ្នកដឹកនាំជំនាន់បន្ទាប់។',
    learn: ['យល់ business model, customer value, revenue driver, cost structure និង cash flow', 'បកស្រាយ market signal និងបង្កើត strategic choices ជាមួយ trade-off', 'Align ផ្នែកជាច្រើនតាម enterprise outcome មិនតាម silo KPI', 'ដឹកនាំ change ដោយ stakeholder map, communication និង adoption metric', 'គ្រប់គ្រង governance, risk, ethics និង succession pipeline'],
    practice: ['សរសេរ business case សម្រាប់ initiative មួយ មាន ROI, risk និង scenario', 'ដឹកនាំ cross-functional review និងដោះស្រាយ conflict រវាង KPI ផ្នែក', 'បង្កើត strategy-on-a-page និង communication plan សម្រាប់ការផ្លាស់ប្តូរ'],
    evidence: ['Business case និង decision record', 'Cross-functional result និង stakeholder feedback', 'Strategy map, leading/lagging indicators', 'Succession slate និង readiness plan'],
    questions: [
      { question: 'Project ល្អសម្រាប់ផ្នែកអ្នក តែប៉ះ cash flow ក្រុមហ៊ុន។ Director គួរធ្វើអ្វី?', choices: ['បន្តព្រោះ KPI ផ្នែកសំខាន់ជាង', 'វាយតម្លៃ enterprise trade-off និងបង្ហាញជម្រើស', 'លាក់ cost ពី Finance'], answer: 1, explanation: 'Director ត្រូវ optimize សម្រាប់ក្រុមហ៊ុនទាំងមូល មិនមែននាយកដ្ឋានខ្លួនតែមួយ។' },
      { question: 'ការផ្លាស់ប្តូរប្រព័ន្ធថ្មីមាន resistance។ តើ strategy ណាល្អ?', choices: ['បង្ខំឱ្យប្រើដោយមិនពន្យល់', 'ស្គាល់ stakeholder, ស្តាប់ barrier, pilot និងវាស់ adoption', 'ប្តូរប្រព័ន្ធម្តងទៀតភ្លាម'], answer: 1, explanation: 'ការផ្លាស់ប្តូរជោគជ័យត្រូវការទាំង solution និង adoption របស់មនុស្ស។' },
      { question: 'ភស្តុតាងសំខាន់សម្រាប់ Director readiness គឺអ្វី?', choices: ['ធ្វើការយូរជាងគេ', 'លទ្ធផលឆ្លងផ្នែក ការសម្រេចចិត្តយុទ្ធសាស្ត្រ និង leadership pipeline', 'មាន title ធំក្នុង email'], answer: 1, explanation: 'ថ្នាក់ Director ត្រូវបង្ហាញ enterprise impact និងសមត្ថភាពបង្កើតអ្នកដឹកនាំផ្សេងទៀត។' },
    ],
  },
];

const ANSWERS_KEY = 'lyhaw.promotion-lab-answers';
const TASKS_KEY = 'lyhaw.promotion-lab-tasks';

function readRecord(key: string) {
  try { const value = JSON.parse(localStorage.getItem(key) || '{}'); return value && typeof value === 'object' ? value as Record<string, number | boolean> : {}; } catch { return {}; }
}

export function PromotionLearningLab() {
  const [activeId, setActiveId] = useState(stages[0].id);
  const [answers, setAnswers] = useState<Record<string, number | boolean>>(() => readRecord(ANSWERS_KEY));
  const [tasks, setTasks] = useState<Record<string, number | boolean>>(() => readRecord(TASKS_KEY));
  const stage = stages.find((item) => item.id === activeId)!;
  const correct = stage.questions.filter((question, index) => answers[`${stage.id}-${index}`] === question.answer).length;
  const answered = stage.questions.filter((_, index) => typeof answers[`${stage.id}-${index}`] === 'number').length;
  const taskCount = stage.practice.filter((_, index) => tasks[`${stage.id}-${index}`] === true).length;
  const ready = correct === stage.questions.length && taskCount === stage.practice.length;
  const completedStages = useMemo(() => stages.filter((item) => item.questions.every((question, index) => answers[`${item.id}-${index}`] === question.answer) && item.practice.every((_, index) => tasks[`${item.id}-${index}`] === true)).length, [answers, tasks]);

  const answerQuestion = (index: number, choice: number) => setAnswers((current) => { const next = { ...current, [`${stage.id}-${index}`]: choice }; localStorage.setItem(ANSWERS_KEY, JSON.stringify(next)); return next; });
  const toggleTask = (index: number) => setTasks((current) => { const key = `${stage.id}-${index}`; const next = { ...current, [key]: current[key] !== true }; localStorage.setItem(TASKS_KEY, JSON.stringify(next)); return next; });

  return <section className="bg-secondary">
    <div className="container-wide section-space">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-accent"><FlaskConical className="h-4 w-4" /> Promotion Readiness Lab</p><h2 className="mt-4 text-3xl font-extrabold leading-[1.45] text-primary sm:text-4xl">រៀន អនុវត្ត និងបង្ហាញភស្តុតាង<br /><span className="text-accent">ជាមួយតេស្តយល់ដឹងនៅគ្រប់កម្រិត</span></h2><p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">ការចុចថា “បានរៀន” មិនទាន់បង្ហាញថាត្រៀមឡើងតំណែងទេ។ Lab នេះត្រូវឱ្យអ្នកយល់គោលគំនិត ធ្វើកិច្ចការក្នុងការងារពិត ប្រមូលភស្តុតាង និងឆ្លង Scenario Test។</p></div><div className="border-l-2 border-accent pl-5"><strong className="text-4xl font-extrabold text-primary">{completedStages}/{stages.length}</strong><p className="mt-1 text-sm text-muted-foreground">កម្រិតបានបញ្ចប់</p></div></div>

      <div role="tablist" aria-label="ជ្រើសកម្រិត Promotion Lab" className="mt-9 grid gap-px border border-border bg-border lg:grid-cols-5">{stages.map((item, index) => { const complete = item.questions.every((question, questionIndex) => answers[`${item.id}-${questionIndex}`] === question.answer) && item.practice.every((_, taskIndex) => tasks[`${item.id}-${taskIndex}`] === true); return <button key={item.id} type="button" role="tab" aria-selected={activeId === item.id} onClick={() => setActiveId(item.id)} className={`min-h-24 p-4 text-left ${activeId === item.id ? 'bg-primary text-primary-foreground' : 'bg-card text-primary hover:bg-muted'}`}><span className={`text-xs font-bold ${activeId === item.id ? 'text-accent' : 'text-muted-foreground'}`}>LEVEL {index + 1} {complete && '· PASSED'}</span><span className="mt-2 block text-sm font-extrabold">{item.from} → {item.to}</span></button>; })}</div>

      <motion.div key={stage.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-background">
        <div className="grid gap-6 bg-primary p-6 text-primary-foreground lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-bold uppercase text-accent">{stage.from} → {stage.to}</p><h3 className="mt-2 text-2xl font-extrabold">{stage.title}</h3><p className="mt-3 max-w-4xl text-sm leading-7 text-primary-foreground/65">{stage.overview}</p></div><div className={`min-w-36 border p-4 text-center ${ready ? 'border-accent bg-accent text-accent-foreground' : 'border-primary-foreground/20'}`}><strong className="block text-2xl font-extrabold">{ready ? 'READY' : `${correct}/${stage.questions.length}`}</strong><span className="mt-1 block text-xs font-bold">{ready ? 'ត្រៀមកម្រិតបន្ទាប់' : 'ចម្លើយត្រឹមត្រូវ'}</span></div></div>

        <div className="grid gap-px bg-border lg:grid-cols-3">
          <div className="bg-card p-6"><p className="flex items-center gap-2 text-xs font-bold uppercase text-accent"><BookOpen className="h-4 w-4" /> 1. រៀនឱ្យយល់</p><div className="mt-5 space-y-4">{stage.learn.map((item, index) => <div key={item} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center bg-primary text-xs font-bold text-accent">{index + 1}</span><p className="text-sm leading-7 text-muted-foreground">{item}</p></div>)}</div></div>
          <div className="bg-card p-6"><p className="flex items-center gap-2 text-xs font-bold uppercase text-accent"><Target className="h-4 w-4" /> 2. អនុវត្តក្នុងការងារពិត</p><div className="mt-5 space-y-3">{stage.practice.map((item, index) => { const done = tasks[`${stage.id}-${index}`] === true; return <button key={item} type="button" onClick={() => toggleTask(index)} className={`flex w-full gap-3 border p-4 text-left ${done ? 'border-primary bg-secondary' : 'border-border'}`}><span className={`grid h-7 w-7 shrink-0 place-items-center border ${done ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>{done && <Check className="h-4 w-4" />}</span><span className="text-sm leading-7 text-muted-foreground">{item}</span></button>; })}</div><p className="mt-4 text-xs font-semibold text-muted-foreground">បានអនុវត្ត {taskCount}/{stage.practice.length}</p></div>
          <div className="bg-card p-6"><p className="flex items-center gap-2 text-xs font-bold uppercase text-accent"><ClipboardCheck className="h-4 w-4" /> 3. បង្ហាញភស្តុតាង</p><div className="mt-5 space-y-4">{stage.evidence.map((item) => <div key={item} className="flex gap-3"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent" /><p className="text-sm leading-7 text-muted-foreground">{item}</p></div>)}</div><div className="mt-6 border-l-4 border-accent bg-muted p-4"><p className="text-xs font-bold text-primary">Evidence Rule</p><p className="mt-2 text-xs leading-6 text-muted-foreground">ភស្តុតាងល្អត្រូវមានកាលបរិច្ឆេទ បរិបទ សកម្មភាពរបស់អ្នក លទ្ធផលដែលវាស់បាន និង feedback ពីអ្នកពាក់ព័ន្ធ។ កុំប្រើព័ត៌មានសម្ងាត់ដោយគ្មានការអនុញ្ញាត។</p></div></div>
        </div>

        <div className="border-t border-border p-6 sm:p-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="flex items-center gap-2 text-xs font-bold uppercase text-accent"><FlaskConical className="h-4 w-4" /> 4. Scenario Understanding Test</p><h3 className="mt-2 text-2xl font-extrabold text-primary">សាកល្បងថាអ្នកយល់ និងអាចសម្រេចចិត្តបាន</h3></div><div className="text-sm font-bold text-primary">បានឆ្លើយ {answered}/{stage.questions.length} · ត្រឹមត្រូវ {correct}/{stage.questions.length}</div></div>
          <div className="mt-7 space-y-5">{stage.questions.map((question, questionIndex) => { const answerKey = `${stage.id}-${questionIndex}`; const selected = answers[answerKey]; const hasAnswered = typeof selected === 'number'; return <article key={question.question} className="border border-border p-5"><div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center bg-primary text-sm font-bold text-accent">{questionIndex + 1}</span><h4 className="font-extrabold leading-7 text-primary">{question.question}</h4></div><div className="mt-4 grid gap-2 md:grid-cols-3">{question.choices.map((choice, choiceIndex) => { const chosen = selected === choiceIndex; const correctChoice = hasAnswered && question.answer === choiceIndex; return <button key={choice} type="button" onClick={() => answerQuestion(questionIndex, choiceIndex)} className={`min-h-20 border p-3 text-left text-sm font-semibold leading-6 ${correctChoice ? 'border-primary bg-primary text-primary-foreground' : chosen ? 'border-accent bg-secondary text-primary' : 'border-border text-muted-foreground hover:border-accent'}`}>{choice}</button>; })}</div>{hasAnswered && <div className={`mt-4 border-l-4 p-4 ${selected === question.answer ? 'border-primary bg-secondary' : 'border-accent bg-muted'}`}><p className="text-sm font-bold text-primary">{selected === question.answer ? 'ត្រឹមត្រូវ' : 'សូមព្យាយាមម្តងទៀត'}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{question.explanation}</p></div>}</article>; })}</div>
          <div className={`mt-7 flex items-start gap-4 p-5 ${ready ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>{ready ? <Award className="h-7 w-7 shrink-0" /> : <LockKeyhole className="h-7 w-7 shrink-0 text-accent" />}<div><p className="font-extrabold">{ready ? `អ្នកបានបញ្ចប់ Lab ${stage.from} → ${stage.to}` : 'លក្ខខណ្ឌឆ្លងកម្រិត'}</p><p className={`mt-1 text-sm leading-6 ${ready ? 'text-accent-foreground/75' : 'text-primary-foreground/65'}`}>{ready ? 'បន្តរក្សាភស្តុតាងពិត និងសន្ទនាជាមួយអ្នកគ្រប់គ្រងអំពី readiness សម្រាប់តំណែងបន្ទាប់។' : `ត្រូវឆ្លើយត្រឹមត្រូវ ${stage.questions.length}/${stage.questions.length} និងបំពេញកិច្ចការអនុវត្ត ${stage.practice.length}/${stage.practice.length}។ តេស្តនេះជាការវាយតម្លៃខ្លួនឯង មិនជំនួសការវាយតម្លៃផ្លូវការរបស់ក្រុមហ៊ុនទេ។`}</p></div></div>
        </div>
      </motion.div>
    </div>
  </section>;
}
