import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  ClipboardCheck,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';

type DiscType = 'D' | 'I' | 'S' | 'C';
type Answers = Record<number, DiscType>;

type DiscQuestion = {
  id: number;
  situation: string;
  prompt: string;
  options: { type: DiscType; text: string }[];
};

const STORAGE_KEY = 'lyhaw.disc-assessment-answers';

const questions: DiscQuestion[] = [
  { id: 1, situation: 'Project ថ្មីមានពេលខ្លី', prompt: 'តើអ្នកធ្វើអ្វីមុនគេ?', options: [
    { type: 'D', text: 'កំណត់គោលដៅ ហើយចាប់ផ្តើមសកម្មភាពភ្លាម' },
    { type: 'I', text: 'ហៅក្រុមមកបង្កើតថាមពល និងគំនិតរួម' },
    { type: 'S', text: 'សួរថាអ្នកណាត្រូវការជំនួយ និងរៀបចំការសហការ' },
    { type: 'C', text: 'ពិនិត្យ requirement, risk និងស្តង់ដារឱ្យច្បាស់' },
  ] },
  { id: 2, situation: 'ចូលរួមក្រុមថ្មី', prompt: 'អាកប្បកិរិយាដែលធម្មជាតិបំផុតសម្រាប់អ្នកគឺ?', options: [
    { type: 'I', text: 'ណែនាំខ្លួន និងស្គាល់មនុស្សឱ្យបានច្រើន' },
    { type: 'S', text: 'ស្តាប់ សង្កេត និងជួយក្រុមដោយស្ងប់ស្ងាត់' },
    { type: 'C', text: 'ស្វែងយល់ពី process, role និងការរំពឹងទុក' },
    { type: 'D', text: 'សួរគោលដៅ និងអ្វីដែលត្រូវសម្រេចឱ្យបានលឿន' },
  ] },
  { id: 3, situation: 'ក្រុមមានការមិនយល់ស្រប', prompt: 'តើអ្នកចូលរួមដោះស្រាយយ៉ាងដូចម្តេច?', options: [
    { type: 'S', text: 'ស្តាប់ភាគីទាំងពីរ និងរកចំណុចដែលអាចយល់ព្រមគ្នា' },
    { type: 'C', text: 'ប្រមូលការពិត និងវាយតម្លៃជម្រើសតាមលក្ខណៈវិនិច្ឆ័យ' },
    { type: 'D', text: 'កំណត់បញ្ហាសំខាន់ ហើយជំរុញឱ្យមានសេចក្ដីសម្រេច' },
    { type: 'I', text: 'បន្ថយភាពតានតឹង និងនាំក្រុមត្រឡប់ទៅការសន្ទនា' },
  ] },
  { id: 4, situation: 'ត្រូវធ្វើបទបង្ហាញ', prompt: 'តើអ្នកផ្តោតលើអ្វីជាងគេ?', options: [
    { type: 'C', text: 'Data ត្រឹមត្រូវ រចនាសម្ព័ន្ធ និងប្រភពច្បាស់' },
    { type: 'D', text: 'សេចក្ដីសម្រេច និងលទ្ធផលដែលចង់បាន' },
    { type: 'I', text: 'រឿងរ៉ាវ ថាមពល និងការចូលរួមរបស់អ្នកស្តាប់' },
    { type: 'S', text: 'ល្បឿននិយាយស្រួលស្តាប់ និងការពន្យល់គ្រប់គ្នាឱ្យយល់' },
  ] },
  { id: 5, situation: 'មេទម្លាក់ការងារបន្ទាន់', prompt: 'ការឆ្លើយតបដំបូងរបស់អ្នកជាទូទៅគឺ?', options: [
    { type: 'D', text: 'សួរ priority ហើយសម្រេចអ្វីត្រូវធ្វើមុន' },
    { type: 'S', text: 'ពិនិត្យថាក្រុមអាចចែកការងារជួយគ្នាយ៉ាងដូចម្តេច' },
    { type: 'I', text: 'សន្ទនាឱ្យឃើញរូបភាពធំ និងលើកទឹកចិត្តក្រុម' },
    { type: 'C', text: 'បញ្ជាក់ scope, deadline និងផលប៉ះពាល់លើការងារចាស់' },
  ] },
  { id: 6, situation: 'ត្រូវធ្វើការងារដដែលៗ', prompt: 'អ្វីជួយអ្នករក្សាគុណភាព?', options: [
    { type: 'S', text: 'រក្សាចង្វាក់ការងារស្ថិតស្ថេរ និងជួយមិត្តរួមការងារ' },
    { type: 'C', text: 'ប្រើ checklist និងតាមដានកំហុសលម្អិត' },
    { type: 'I', text: 'បង្កើតបរិយាកាសរីករាយ និងទំនាក់ទំនងជាមួយក្រុម' },
    { type: 'D', text: 'កំណត់ target ហើយស្វែងរកវិធីធ្វើឱ្យលឿនជាងមុន' },
  ] },
  { id: 7, situation: 'ទទួល Feedback មិនល្អ', prompt: 'តើអ្នកមានទំនោរឆ្លើយតបបែបណា?', options: [
    { type: 'C', text: 'សុំឧទាហរណ៍ ស្តង់ដារ និងចំណុចដែលត្រូវកែ' },
    { type: 'I', text: 'ពិភាក្សាបើកចំហ និងរក្សាទំនាក់ទំនងវិជ្ជមាន' },
    { type: 'D', text: 'សួរលទ្ធផលដែលរំពឹង ហើយរៀបចំ action ភ្លាម' },
    { type: 'S', text: 'ស្តាប់ដោយស្ងប់ ហើយគិតមុនឆ្លើយតប' },
  ] },
  { id: 8, situation: 'ប្រជុំដែលគ្មានសេចក្ដីសម្រេច', prompt: 'តើអ្នកធ្វើអ្វី?', options: [
    { type: 'I', text: 'បើកឱ្យមនុស្សចែកគំនិត និងរក្សាថាមពលសន្ទនា' },
    { type: 'D', text: 'សង្ខេបជម្រើស និងស្នើឱ្យជ្រើសមួយ' },
    { type: 'S', text: 'សួរមតិអ្នកដែលមិនទាន់បាននិយាយ' },
    { type: 'C', text: 'កំណត់ព័ត៌មានដែលខ្វះ មុនធ្វើសេចក្ដីសម្រេច' },
  ] },
  { id: 9, situation: 'ផែនការផ្លាស់ប្ដូរភ្លាមៗ', prompt: 'អ្វីធ្វើឱ្យអ្នកមានទំនុកចិត្តឡើងវិញ?', options: [
    { type: 'D', text: 'ស្គាល់គោលដៅថ្មី និងសិទ្ធិសម្រេចរបស់ខ្ញុំ' },
    { type: 'C', text: 'ទទួលបានហេតុផល Data និងផែនការលម្អិត' },
    { type: 'S', text: 'មានពេលសម្របខ្លួន និងការគាំទ្រពីក្រុម' },
    { type: 'I', text: 'បានពិភាក្សា និងឃើញឱកាសក្នុងការផ្លាស់ប្ដូរ' },
  ] },
  { id: 10, situation: 'ត្រូវដឹកនាំមនុស្សដំបូង', prompt: 'អ្វីជារបៀបធម្មជាតិរបស់អ្នក?', options: [
    { type: 'I', text: 'បង្កើតចក្ខុវិស័យ និងជំរុញទឹកចិត្តក្រុម' },
    { type: 'S', text: 'គាំទ្រ ស្តាប់ និងបង្កើតទំនុកចិត្ត' },
    { type: 'D', text: 'កំណត់ target និងទំនួលខុសត្រូវច្បាស់' },
    { type: 'C', text: 'បង្កើត process, KPI និងស្តង់ដារគុណភាព' },
  ] },
  { id: 11, situation: 'Customer មិនពេញចិត្ត', prompt: 'តើអ្នកចូលដោះស្រាយបែបណា?', options: [
    { type: 'S', text: 'ស្តាប់ដោយអត់ធ្មត់ និងធ្វើឱ្យគេមានអារម្មណ៍ថាត្រូវបានយល់' },
    { type: 'D', text: 'ទទួលខុសត្រូវ និងផ្តល់ជម្រើសដោះស្រាយភ្លាម' },
    { type: 'C', text: 'ពិនិត្យកិច្ចព្រមព្រៀង និង root cause ឱ្យបានត្រឹមត្រូវ' },
    { type: 'I', text: 'បង្កើតទំនាក់ទំនងឡើងវិញ និងបង្ហាញភាពជឿជាក់' },
  ] },
  { id: 12, situation: 'ជ្រើសរើសការងារថ្មីមួយ', prompt: 'អ្វីទាក់ទាញអ្នកជាងគេ?', options: [
    { type: 'C', text: 'ជំនាញជ្រៅ ប្រព័ន្ធច្បាស់ និងគុណភាពខ្ពស់' },
    { type: 'I', text: 'មនុស្សថ្មី បណ្តាញ និងឱកាសបង្ហាញគំនិត' },
    { type: 'S', text: 'ក្រុមមានទំនុកចិត្ត និងបរិយាកាសស្ថិតស្ថេរ' },
    { type: 'D', text: 'បញ្ហាប្រឈម សិទ្ធិសម្រេច និងលទ្ធផលធំ' },
  ] },
  { id: 13, situation: 'មិត្តរួមការងារធ្វើខុស', prompt: 'តើអ្នកមានទំនោរធ្វើអ្វីមុន?', options: [
    { type: 'D', text: 'ផ្តោតលើការកែបញ្ហា និងទប់ផលប៉ះពាល់' },
    { type: 'I', text: 'និយាយដោយវិជ្ជមាន ដើម្បីរក្សាទឹកចិត្ត' },
    { type: 'C', text: 'រកមូលហេតុ និងកែ checklist ឬ process' },
    { type: 'S', text: 'សួរថាគេត្រូវការជំនួយអ្វី ហើយ coach ដោយស្ងប់' },
  ] },
  { id: 14, situation: 'មានគំនិតកែលម្អថ្មី', prompt: 'តើអ្នកបង្ហាញគំនិតដូចម្តេច?', options: [
    { type: 'I', text: 'និយាយពីអត្ថប្រយោជន៍ និងធ្វើឱ្យមនុស្សរំភើប' },
    { type: 'C', text: 'រៀបចំ data, risk និង pilot plan' },
    { type: 'D', text: 'បង្ហាញបញ្ហា លទ្ធផល និងសេចក្ដីសម្រេចដែលត្រូវការ' },
    { type: 'S', text: 'សួរមតិក្រុម និងបង្កើតការយល់ព្រមបន្តិចម្តងៗ' },
  ] },
  { id: 15, situation: 'ថ្ងៃដែលការងារច្រើនខ្លាំង', prompt: 'តើអ្នកគ្រប់គ្រងខ្លួនបែបណា?', options: [
    { type: 'S', text: 'រក្សាល្បឿនស្ថិតស្ថេរ និងទាក់ទងក្រុមជាប្រចាំ' },
    { type: 'D', text: 'កាត់អ្វីមិនសំខាន់ ហើយជំរុញការងារស្នូល' },
    { type: 'I', text: 'សហការជាមួយមនុស្ស និងរក្សាថាមពលវិជ្ជមាន' },
    { type: 'C', text: 'រៀបអាទិភាព និងពិនិត្យគុណភាពតាម checklist' },
  ] },
  { id: 16, situation: 'សមិទ្ធផលរបស់ក្រុមជោគជ័យ', prompt: 'អ្វីដែលអ្នកចង់ធ្វើបន្ទាប់?', options: [
    { type: 'D', text: 'កំណត់គោលដៅបន្ទាប់ដែលធំជាងមុន' },
    { type: 'S', text: 'អរគុណមនុស្សទាំងអស់ និងរក្សាចង្វាក់ក្រុម' },
    { type: 'C', text: 'កត់ lesson learned និងធ្វើឱ្យ process កាន់តែល្អ' },
    { type: 'I', text: 'អបអរ និងចែករំលែករឿងជោគជ័យជាមួយអ្នកដទៃ' },
  ] },
];

const profiles: Record<DiscType, {
  name: string;
  khmerName: string;
  headline: string;
  strengths: string[];
  watchouts: string[];
  communication: string;
  environment: string;
  development: string[];
}> = {
  D: {
    name: 'Dominance', khmerName: 'អ្នកជំរុញលទ្ធផល', headline: 'ផ្តោតលើគោលដៅ ល្បឿន ការប្រកួតប្រជែង និងសេចក្ដីសម្រេច។',
    strengths: ['សម្រេចចិត្តរហ័ស', 'ហ៊ានទទួលបញ្ហាប្រឈម', 'ជំរុញក្រុមទៅលទ្ធផល', 'និយាយច្បាស់ និងត្រង់'],
    watchouts: ['អាចប្រញាប់ពេក', 'អាចមើលរំលងអារម្មណ៍អ្នកដទៃ', 'អាចមិនស្តាប់ព័ត៌មានលម្អិតគ្រប់គ្រាន់'],
    communication: 'និយាយខ្លី ចំគោលដៅ បង្ហាញលទ្ធផល ជម្រើស និង deadline។',
    environment: 'ការងារមានសិទ្ធិសម្រេច គោលដៅច្បាស់ និងបញ្ហាប្រឈម។',
    development: ['ផ្អាកស្តាប់មុនសម្រេច', 'សួរផលប៉ះពាល់លើមនុស្ស', 'បន្ថែម quality checkpoint មុនប្រគល់'],
  },
  I: {
    name: 'Influence', khmerName: 'អ្នកបង្កើតឥទ្ធិពល', headline: 'ផ្តោតលើមនុស្ស ថាមពល គំនិតថ្មី និងការបញ្ចុះបញ្ចូល។',
    strengths: ['ទំនាក់ទំនងល្អ', 'បង្កើតបណ្តាញបានលឿន', 'លើកទឹកចិត្តក្រុម', 'បង្ហាញគំនិតគួរឱ្យចាប់អារម្មណ៍'],
    watchouts: ['អាចសន្យាច្រើនជាងសមត្ថភាព', 'អាចខ្វះ follow-up', 'អាចរំខានដោយគំនិតថ្មីៗ'],
    communication: 'ចាប់ផ្តើមពីរូបភាពធំ អនុញ្ញាតឱ្យពិភាក្សា ហើយបិទដោយ action ជាលាយលក្ខណ៍អក្សរ។',
    environment: 'ការងារជាមួយមនុស្ស មានភាពច្នៃប្រឌិត និងទទួលស្គាល់ contribution។',
    development: ['កត់ owner និង deadline រាល់ការសន្យា', 'បែងចែកពេល social និង focus', 'ពិនិត្យការពិតមុនបញ្ចុះបញ្ចូល'],
  },
  S: {
    name: 'Steadiness', khmerName: 'អ្នករក្សាស្ថិរភាព', headline: 'ផ្តោតលើការគាំទ្រ ភាពស្ថិតស្ថេរ ការសហការ និងទំនុកចិត្ត។',
    strengths: ['ស្តាប់ដោយអត់ធ្មត់', 'សហការល្អ', 'គួរឱ្យទុកចិត្ត', 'រក្សាក្រុមឱ្យមានស្ថិរភាព'],
    watchouts: ['អាចជៀសវាងជម្លោះយូរពេក', 'អាចពិបាកនិយាយថា “ទេ”', 'អាចត្រូវការពេលសម្របខ្លួននឹងការផ្លាស់ប្ដូរ'],
    communication: 'ផ្តល់បរិបទ ពេលគិត ការគាំទ្រ និងជំហានផ្លាស់ប្ដូរដែលអាចទាយទុកបាន។',
    environment: 'ក្រុមគាំទ្រគ្នា តួនាទីច្បាស់ និងមានពេលធ្វើការដោយស្ថិតស្ថេរ។',
    development: ['លើកបញ្ហាឱ្យឆាប់ជាងមុន', 'ហាត់និយាយព្រំដែនដោយគោរព', 'ស្នើភាពច្បាស់ពេលមានការផ្លាស់ប្ដូរ'],
  },
  C: {
    name: 'Conscientiousness', khmerName: 'អ្នកធានាគុណភាព', headline: 'ផ្តោតលើភាពត្រឹមត្រូវ ស្តង់ដារ ការវិភាគ និងការគ្រប់គ្រងហានិភ័យ។',
    strengths: ['វិភាគលម្អិត', 'រក្សាគុណភាពខ្ពស់', 'សម្រេចតាមការពិត', 'បង្កើតប្រព័ន្ធ និងស្តង់ដារ'],
    watchouts: ['អាចគិតយូរពេកមុនធ្វើ', 'អាចទាមទារភាពល្អឥតខ្ចោះ', 'អាចមើលទៅស្ងាត់ ឬតឹងរឹង'],
    communication: 'ផ្តល់ data, criteria, logic និងពេលសួរសំណួរ។ កុំបង្ខំឱ្យសម្រេចដោយគ្មានព័ត៌មានគ្រប់គ្រាន់។',
    environment: 'មានស្តង់ដារច្បាស់ ពេលផ្តោត និងទិន្នន័យសម្រាប់វាយតម្លៃ។',
    development: ['កំណត់ “good enough” និង deadline', 'ចែករំលែកគំនិតមុនពេលវាល្អឥតខ្ចោះ', 'បន្ថែមទំនាក់ទំនងមនុស្សទៅក្នុងការវិភាគ'],
  },
};

function readAnswers(): Answers {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return value && typeof value === 'object' ? value as Answers : {};
  } catch {
    return {};
  }
}

export function DiscAssessment() {
  const [phase, setPhase] = useState<'intro' | 'test' | 'result'>(() => Object.keys(readAnswers()).length === questions.length ? 'result' : 'intro');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>(readAnswers);

  const scores = useMemo(() => {
    const result: Record<DiscType, number> = { D: 0, I: 0, S: 0, C: 0 };
    Object.values(answers).forEach((type) => { if (type in result) result[type] += 1; });
    return result;
  }, [answers]);

  const ranking = useMemo(() => (Object.entries(scores) as [DiscType, number][]).sort((a, b) => b[1] - a[1]), [scores]);
  const answeredCount = Object.keys(answers).length;
  const primary = ranking[0][0];
  const secondary = ranking[1][0];
  const profile = profiles[primary];
  const question = questions[current];

  const choose = (type: DiscType) => {
    const next = { ...answers, [question.id]: type };
    setAnswers(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const finish = () => {
    if (answeredCount === questions.length) setPhase('result');
  };

  const reset = () => {
    setAnswers({});
    setCurrent(0);
    setPhase('intro');
    localStorage.removeItem(STORAGE_KEY);
  };

  if (phase === 'intro') return <section className="bg-secondary">
    <div className="container-wide section-space">
      <div className="grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-center">
        <div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-accent"><BarChart3 className="h-4 w-4" /> DISC Staff Assessment</p><h2 className="mt-4 text-3xl font-extrabold leading-[1.45] text-primary sm:text-5xl">ស្គាល់របៀបធ្វើការរបស់អ្នក<br /><span className="text-accent">មុនជ្រើសផ្លូវអភិវឌ្ឍបន្ទាប់</span></h2><p className="mt-5 max-w-3xl text-sm leading-8 text-muted-foreground">ឆ្លើយ 16 ស្ថានការណ៍តាមអាកប្បកិរិយាដែលអ្នកធ្វើញឹកញាប់បំផុត មិនមែនចម្លើយដែលមើលទៅល្អបំផុត។ លទ្ធផលបង្ហាញទំនោរ Dominance, Influence, Steadiness និង Conscientiousness។</p><button type="button" onClick={() => setPhase('test')} className="mt-7 inline-flex items-center bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground">ចាប់ផ្តើម DISC Test <ArrowRight className="ml-2 h-4 w-4 text-accent" /></button></div>
        <div className="grid grid-cols-2 gap-px border border-border bg-border">{(['D', 'I', 'S', 'C'] as DiscType[]).map((type) => <div key={type} className="bg-card p-5"><span className="grid h-11 w-11 place-items-center bg-primary text-lg font-extrabold text-accent">{type}</span><p className="mt-4 font-extrabold text-primary">{profiles[type].name}</p><p className="mt-1 text-xs leading-6 text-muted-foreground">{profiles[type].khmerName}</p></div>)}</div>
      </div>
      <div className="mt-8 flex gap-3 border-l-4 border-accent bg-card p-5"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><p className="text-xs leading-6 text-muted-foreground"><strong className="text-primary">ចំណាំសម្រាប់ HR៖</strong> DISC បង្ហាញទំនោរអាកប្បកិរិយា មិនវាស់ IQ ជំនាញបច្ចេកទេស សុចរិតភាព ឬតម្លៃមនុស្សទេ។ មិនគួរប្រើលទ្ធផលនេះតែមួយមុខសម្រាប់ជ្រើសរើស ដាក់តំណែង ឬបញ្ចប់ការងារបុគ្គលិកឡើយ។</p></div>
    </div>
  </section>;

  if (phase === 'test') return <section className="bg-muted">
    <div className="container-wide max-w-5xl section-space">
      <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-accent">DISC STAFF ASSESSMENT</p><h2 className="mt-2 text-2xl font-extrabold text-primary">ស្ថានការណ៍ {current + 1} / {questions.length}</h2></div><div className="flex items-center gap-4"><strong className="text-sm text-primary">បានឆ្លើយ {answeredCount}/{questions.length}</strong><button type="button" onClick={reset} className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary"><RefreshCcw className="mr-1.5 h-3.5 w-3.5" /> ចាប់ផ្តើមឡើងវិញ</button></div></div>
      <div className="mt-5 h-2 overflow-hidden bg-background"><div className="h-full bg-accent transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
      <motion.div key={question.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="mt-7 border border-border bg-card p-6 sm:p-9">
        <p className="text-sm font-bold text-accent">{question.situation}</p><h3 className="mt-3 text-2xl font-extrabold leading-10 text-primary">{question.prompt}</h3>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">{question.options.map((option) => { const selected = answers[question.id] === option.type; return <button key={option.type} type="button" onClick={() => choose(option.type)} className={`flex min-h-24 items-start gap-3 border p-4 text-left text-sm font-semibold leading-7 transition-colors ${selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground hover:border-accent hover:text-primary'}`}><span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center border ${selected ? 'border-accent bg-accent text-accent-foreground' : 'border-border'}`}>{selected && <Check className="h-4 w-4" />}</span>{option.text}</button>; })}</div>
      </motion.div>
      <div className="mt-5 flex items-center justify-between gap-4"><button type="button" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)} className="inline-flex h-11 items-center border border-border px-4 text-sm font-bold text-primary disabled:opacity-35"><ArrowLeft className="mr-2 h-4 w-4" /> ថយក្រោយ</button>{current < questions.length - 1 ? <button type="button" disabled={!answers[question.id]} onClick={() => setCurrent((value) => value + 1)} className="inline-flex h-11 items-center bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-35">បន្ទាប់ <ArrowRight className="ml-2 h-4 w-4 text-accent" /></button> : <button type="button" disabled={answeredCount !== questions.length} onClick={finish} className="inline-flex h-11 items-center bg-accent px-5 text-sm font-bold text-accent-foreground disabled:opacity-35"><ClipboardCheck className="mr-2 h-4 w-4" /> មើលលទ្ធផល</button>}</div>
    </div>
  </section>;

  return <section className="bg-background">
    <div className="container-wide section-space">
      <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
        <aside className="bg-primary p-7 text-primary-foreground"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-accent"><Sparkles className="h-4 w-4" /> Your DISC Blend</p><div className="mt-7 flex items-end gap-3"><strong className="text-7xl font-extrabold text-accent">{primary}{secondary}</strong><span className="pb-2 text-sm text-primary-foreground/60">Primary + Secondary</span></div><h2 className="mt-5 text-2xl font-extrabold">{profile.khmerName}</h2><p className="mt-3 text-sm leading-7 text-primary-foreground/68">{profile.headline}</p><div className="mt-7 space-y-4">{ranking.map(([type, score]) => <div key={type}><div className="mb-1.5 flex justify-between text-xs font-bold"><span>{type} · {profiles[type].name}</span><span>{Math.round((score / questions.length) * 100)}%</span></div><div className="h-2 bg-primary-foreground/12"><div className="h-full bg-accent" style={{ width: `${(score / questions.length) * 100}%` }} /></div></div>)}</div><button type="button" onClick={reset} className="mt-8 inline-flex items-center border border-primary-foreground/25 px-4 py-3 text-sm font-bold"><RefreshCcw className="mr-2 h-4 w-4" /> ធ្វើតេស្តម្ដងទៀត</button></aside>
        <div>
          <div className="grid gap-px border border-border bg-border sm:grid-cols-2"><article className="bg-card p-6"><p className="flex items-center gap-2 text-xs font-bold uppercase text-accent"><Target className="h-4 w-4" /> ចំណុចខ្លាំង</p><div className="mt-5 space-y-3">{profile.strengths.map((item) => <p key={item} className="flex gap-3 text-sm leading-7 text-muted-foreground"><Check className="mt-1 h-4 w-4 shrink-0 text-primary" />{item}</p>)}</div></article><article className="bg-card p-6"><p className="flex items-center gap-2 text-xs font-bold uppercase text-accent"><ShieldCheck className="h-4 w-4" /> ចំណុចត្រូវប្រយ័ត្ន</p><div className="mt-5 space-y-3">{profile.watchouts.map((item) => <p key={item} className="text-sm leading-7 text-muted-foreground">• {item}</p>)}</div></article></div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2"><article className="border-l-4 border-accent bg-secondary p-5"><MessageCircle className="h-6 w-6 text-primary" /><h3 className="mt-3 font-extrabold text-primary">របៀបទំនាក់ទំនងជាមួយអ្នក</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{profile.communication}</p></article><article className="border-l-4 border-primary bg-muted p-5"><Users className="h-6 w-6 text-primary" /><h3 className="mt-3 font-extrabold text-primary">បរិយាកាសដែលជួយអ្នករីកចម្រើន</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{profile.environment}</p></article></div>
          <article className="mt-5 border border-border bg-card p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-accent">ផែនការអភិវឌ្ឍ 30 ថ្ងៃ</p><div className="mt-5 grid gap-3 sm:grid-cols-3">{profile.development.map((item, index) => <div key={item} className="bg-muted p-4"><span className="grid h-8 w-8 place-items-center bg-primary text-sm font-extrabold text-accent">{index + 1}</span><p className="mt-3 text-sm font-semibold leading-7 text-primary">{item}</p></div>)}</div></article>
          <p className="mt-5 text-xs leading-6 text-muted-foreground">លទ្ធផលនេះជាការឆ្លុះបញ្ចាំងអាកប្បកិរិយាដែលអ្នកបានជ្រើសក្នុងស្ថានការណ៍ 16។ មនុស្សអាចបង្ហាញទម្រង់ខុសគ្នាតាមតួនាទី បរិបទ និងពេលវេលា។ សម្រាប់ការសម្រេចចិត្ត HR សំខាន់ៗ ត្រូវប្រើការសម្ភាសន៍មានរចនាសម្ព័ន្ធ ភស្តុតាងការងារ និងឧបករណ៍វាយតម្លៃដែលមានសុពលភាពរួមគ្នា។</p>
        </div>
      </div>
    </div>
  </section>;
}
