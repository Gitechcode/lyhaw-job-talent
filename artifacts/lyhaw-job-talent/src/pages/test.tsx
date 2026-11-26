import { useState } from 'react';
import { Link } from 'wouter';
import {
  Brain, Heart, ChevronRight, ChevronLeft, CheckCircle2,
  RotateCcw, Trophy, Star, Zap, Shield, Users, Lightbulb,
  ArrowRight, BarChart3, X, BookOpen, Target, TrendingUp,
  Cpu, PenTool, DollarSign, Handshake, Stethoscope, GraduationCap,
  Building2, Megaphone, Package, Coffee, Clock3, ListChecks, Route,
  Gauge, BriefcaseBusiness, Info, CircleDot,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type IQCategory = 'logic' | 'pattern' | 'math' | 'spatial' | 'verbal';
type EQCategory = 'self-awareness' | 'self-regulation' | 'motivation' | 'empathy' | 'social';

type IQQuestion = {
  id: number;
  question: string;
  questionKh: string;
  options: string[];
  optionsKh: string[];
  correct: number;
  explanation: string;
  category: IQCategory;
};

type EQQuestion = {
  id: number;
  question: string;
  questionKh: string;
  category: EQCategory;
  reversed?: boolean;
};

type CareerCluster = {
  id: string;
  icon: React.ReactNode;
  titleKh: string;
  titleEn: string;
  descKh: string;
  color: string;
  bg: string;
  roles: string[];
  rolesKh: string[];
  skills: string[];
  skillsKh: string[];
  certifications: string[];
  learningPath: string[];
  learningPathKh: string[];
  salary: string;
};

// ─── IQ Questions ─────────────────────────────────────────────────────────────
const iqQuestions: IQQuestion[] = [
  { id:1, question:"2, 4, 8, 16, ___?", questionKh:"2, 4, 8, 16, ___?", options:["24","32","28","20"], optionsKh:["24","32","28","20"], correct:1, explanation:"Each doubles the previous (×2). 16×2=32.", category:'pattern' },
  { id:2, question:"All roses are flowers. All flowers need water. Therefore:", questionKh:"ក្លិន្ទទាំងអស់ជាផ្កា។ ផ្កាទាំងអស់ត្រូវការទឹក។ ដូច្នេះ:", options:["Roses don't need water","Roses need water","Water grows flowers","Flowers are roses"], optionsKh:["ក្លិន្ទមិនត្រូវការទឹក","ក្លិន្ទត្រូវការទឹក","ទឹកដុះផ្កា","ផ្កាជាក្លិន្ទ"], correct:1, explanation:"By syllogism: roses → flowers → need water.", category:'logic' },
  { id:3, question:"Which is the odd one out? 3, 5, 11, 14, 17, 23", questionKh:"ណាមួយខុស? 3, 5, 11, 14, 17, 23", options:["3","14","17","23"], optionsKh:["3","14","17","23"], correct:1, explanation:"14 is even; all others are odd primes.", category:'pattern' },
  { id:4, question:"A train travels 60 km in 45 minutes. Speed in km/h?", questionKh:"រថភ្លើងធ្វើដំណើរ 60 គម ក្នុង 45 នាទី។ ល្បឿន?", options:["70","75","80","90"], optionsKh:["70","75","80","90"], correct:2, explanation:"60 ÷ 0.75 = 80 km/h.", category:'math' },
  { id:5, question:"Mary is taller than Jane. Jane is shorter than Sue. Who is tallest?", questionKh:"Mary ខ្ពស់ជាង Jane។ Jane ទាបជាង Sue។ នរណាខ្ពស់ជាង?", options:["Mary","Jane","Sue","Cannot determine"], optionsKh:["Mary","Jane","Sue","មិនអាចកំណត់"], correct:3, explanation:"We know Mary>Jane and Sue>Jane, but cannot compare Mary and Sue.", category:'logic' },
  { id:6, question:"What is 15% of 200?", questionKh:"15% នៃ 200 ស្មើ?", options:["25","30","35","40"], optionsKh:["25","30","35","40"], correct:1, explanation:"0.15 × 200 = 30.", category:'math' },
  { id:7, question:"○ □ △ ○ □ ___ What comes next?", questionKh:"○ □ △ ○ □ ___ អ្វីដែលមកបន្ទាប់?", options:["○","□","△","◇"], optionsKh:["○","□","△","◇"], correct:2, explanation:"The sequence repeats: circle, square, triangle.", category:'pattern' },
  { id:8, question:"5 workers build a wall in 10 days. How many days for 2 workers?", questionKh:"កម្មករ 5 នាក់ 10 ថ្ងៃ។ កម្មករ 2 នាក់ ប៉ុន្មានថ្ងៃ?", options:["20","25","15","30"], optionsKh:["20 ថ្ងៃ","25 ថ្ងៃ","15 ថ្ងៃ","30 ថ្ងៃ"], correct:1, explanation:"Total = 5×10 = 50 worker-days. 50÷2 = 25 days.", category:'math' },
  { id:9, question:"Book : Reading :: Fork : ___", questionKh:"សៀវភៅ : ការអាន :: កែវ : ___", options:["Kitchen","Eating","Cooking","Spoon"], optionsKh:["បន្ទប់ម្ហូប","ការញ៉ាំ","ចំអិន","ស្លាបព្រា"], correct:1, explanation:"Book is used for reading; fork is used for eating.", category:'verbal' },
  { id:10, question:"1, 1, 2, 3, 5, 8, ___ (Fibonacci)", questionKh:"1, 1, 2, 3, 5, 8, ___ (ហ្វីបូណាចី)", options:["11","13","12","10"], optionsKh:["11","13","12","10"], correct:1, explanation:"5 + 8 = 13 (each = sum of previous two).", category:'pattern' },
  { id:11, question:"Square area = 64 cm². Side length = ?", questionKh:"ការ៉េផ្ទៃ = 64 ស.មែ²។ ចំហៀង = ?", options:["6 cm","8 cm","9 cm","7 cm"], optionsKh:["6 ស.មែ","8 ស.មែ","9 ស.មែ","7 ស.មែ"], correct:1, explanation:"Side = √64 = 8 cm.", category:'math' },
  { id:12, question:"Apple, Banana, Cherry, Carrot — odd one out?", questionKh:"Apple, Banana, Cherry, Carrot — ណាខុស?", options:["Apple","Banana","Cherry","Carrot"], optionsKh:["Apple","Banana","Cherry","Carrot"], correct:3, explanation:"Carrot is a vegetable; the rest are fruits.", category:'verbal' },
  { id:13, question:"Today is Wednesday. 100 days from now = ?", questionKh:"ថ្ងៃនេះ ពុធ។ 100 ថ្ងៃក្រោយ = ?", options:["Monday","Friday","Saturday","Thursday"], optionsKh:["ច័ន្ទ","សុក្រ","សៅរ៍","ព្រហស្បតិ៍"], correct:1, explanation:"100 mod 7 = 2. Wednesday + 2 = Friday.", category:'logic' },
  { id:14, question:"If A=1, B=2, C=3…what is the value of 'CAB'?", questionKh:"A=1, B=2, C=3… 'CAB' = ?", options:["312","321","123","132"], optionsKh:["312","321","123","132"], correct:0, explanation:"C=3, A=1, B=2 → 312.", category:'verbal' },
  { id:15, question:"A is B's father. B is C's mother. What is A to C?", questionKh:"A ជាឪពុករបស់ B។ B ជាម្ដាយរបស់ C។ A ជាអ្វីចំពោះ C?", options:["Uncle","Father","Grandfather","Brother"], optionsKh:["មា","ឪពុក","ជីដូន/ជីតា","បងប្អូន"], correct:2, explanation:"A is B's father, B is C's mother → A is C's grandfather.", category:'logic' },
  { id:16, question:"4, 9, 16, 25, ___?", questionKh:"4, 9, 16, 25, ___?", options:["30","32","36","49"], optionsKh:["30","32","36","49"], correct:2, explanation:"These are consecutive squares: 2², 3², 4², 5², so the next is 6² = 36.", category:'pattern' },
  { id:17, question:"Task A must finish before B, and B before C. Which order is valid?", questionKh:"ការងារ A ត្រូវចប់មុន B ហើយ B ត្រូវចប់មុន C។ លំដាប់ណាត្រឹមត្រូវ?", options:["B → A → C","A → C → B","A → B → C","C → B → A"], optionsKh:["B → A → C","A → C → B","A → B → C","C → B → A"], correct:2, explanation:"Both conditions are satisfied only by A → B → C.", category:'logic' },
  { id:18, question:"An $80 item is discounted by 25%. What is the final price?", questionKh:"ទំនិញតម្លៃ $80 បញ្ចុះ 25%។ តម្លៃចុងក្រោយប៉ុន្មាន?", options:["$55","$60","$65","$70"], optionsKh:["$55","$60","$65","$70"], correct:1, explanation:"25% of $80 is $20, so $80 − $20 = $60.", category:'math' },
  { id:19, question:"↑ → ↓ ← ___ Which direction comes next?", questionKh:"↑ → ↓ ← ___ ទិសណាមកបន្ទាប់?", options:["↑","→","↓","←"], optionsKh:["↑","→","↓","←"], correct:0, explanation:"The arrow rotates 90 degrees clockwise each step, returning to ↑.", category:'spatial' },
  { id:20, question:"Recruitment is to candidate as sales is to ___", questionKh:"ការជ្រើសរើសបុគ្គលិក ទាក់ទងនឹងបេក្ខជន ដូចការលក់ទាក់ទងនឹង ___", options:["Invoice","Customer","Warehouse","Meeting"], optionsKh:["វិក្កយបត្រ","អតិថិជន","ឃ្លាំង","កិច្ចប្រជុំ"], correct:1, explanation:"Recruitment works with candidates; sales works with customers.", category:'verbal' },
  { id:21, question:"The average of 70, 80 and 90 is?", questionKh:"មធ្យមភាគនៃ 70, 80 និង 90 ស្មើប៉ុន្មាន?", options:["75","80","85","90"], optionsKh:["75","80","85","90"], correct:1, explanation:"(70 + 80 + 90) ÷ 3 = 80.", category:'math' },
  { id:22, question:"You face north, turn right, turn right, then turn left. Which direction now?", questionKh:"អ្នកបែរមុខទៅជើង បត់ស្តាំ បត់ស្តាំ ហើយបត់ឆ្វេង។ ឥឡូវបែរទៅទិសណា?", options:["North","East","South","West"], optionsKh:["ជើង","កើត","ត្បូង","លិច"], correct:1, explanation:"North → East → South → East.", category:'spatial' },
  { id:23, question:"A, C, F, J, O, ___?", questionKh:"A, C, F, J, O, ___?", options:["T","U","V","W"], optionsKh:["T","U","V","W"], correct:1, explanation:"The gaps increase by 1: +2, +3, +4, +5, then +6 gives U.", category:'pattern' },
  { id:24, question:"Four staff process 120 cases in 6 hours equally. Cases per staff per hour?", questionKh:"បុគ្គលិក 4 នាក់ ដោះស្រាយ 120 ករណីក្នុង 6 ម៉ោងស្មើៗគ្នា។ ម្នាក់ដោះស្រាយបានប៉ុន្មានករណីក្នុងមួយម៉ោង?", options:["4","5","6","8"], optionsKh:["4","5","6","8"], correct:1, explanation:"120 ÷ 4 staff ÷ 6 hours = 5 cases per staff per hour.", category:'math' },
  { id:25, question:"A cube has how many faces?", questionKh:"គូបមួយមានផ្ទៃប៉ុន្មាន?", options:["4","6","8","12"], optionsKh:["4","6","8","12"], correct:1, explanation:"A cube has 6 square faces.", category:'spatial' },
];

// ─── EQ Questions ─────────────────────────────────────────────────────────────
const eqQuestions: EQQuestion[] = [
  { id:1, question:"I can easily identify what emotions I feel in the moment.", questionKh:"ខ្ញុំដឹងច្បាស់ពីអ្វីដែលខ្ញុំកំពុងមានអារម្មណ៍ក្នុងពេលនោះ។", category:'self-awareness' },
  { id:2, question:"I understand how my emotions affect my decisions.", questionKh:"ខ្ញុំយល់ពីរបៀបដែលអារម្មណ៍ប៉ះពាល់ការសម្រេចចិត្ត។", category:'self-awareness' },
  { id:3, question:"I know my personal strengths and areas for growth.", questionKh:"ខ្ញុំដឹងពីចំណុចខ្លាំង និងចំណុចត្រូវអភិវឌ្ឍ។", category:'self-awareness' },
  { id:4, question:"I rarely understand why I feel the way I do.", questionKh:"ខ្ញុំកម្រដឹងហេតុផលពីអារម្មណ៍ខ្ញុំ។", category:'self-awareness', reversed:true },
  { id:5, question:"I stay calm under significant pressure.", questionKh:"ខ្ញុំនៅស្ងប់ ទោះជានៅក្រោមសម្ពាធខ្លាំង។", category:'self-regulation' },
  { id:6, question:"I control impulsive feelings and behaviors well.", questionKh:"ខ្ញុំគ្រប់គ្រងអារម្មណ៍ និងអាកប្បកិរិយានោះបានល្អ។", category:'self-regulation' },
  { id:7, question:"I often react angrily when things don't go my way.", questionKh:"ខ្ញុំច្រើនខឹង ពេលដែលអ្វីៗមិនដំណើរការបានល្អ។", category:'self-regulation', reversed:true },
  { id:8, question:"I adapt well when unexpected changes occur.", questionKh:"ខ្ញុំសម្របខ្លួនបានល្អ ពេលមានការផ្លាស់ប្ដូរ។", category:'self-regulation' },
  { id:9, question:"I set meaningful goals and work consistently toward them.", questionKh:"ខ្ញុំកំណត់គោលដៅ ហើយខិតខំ ឆ្ពោះទៅរកវាដោយស្ថិតស្ថេរ។", category:'motivation' },
  { id:10, question:"I feel driven to improve and achieve excellence.", questionKh:"ខ្ញុំតែងមានការជំរុញ ដើម្បីកែលម្អ និងឈានដល់ភាពល្អ។", category:'motivation' },
  { id:11, question:"I give up easily when I face obstacles.", questionKh:"ខ្ញុំបោះបង់ ពេលជួបឧបសគ្គ។", category:'motivation', reversed:true },
  { id:12, question:"I stay optimistic even in difficult situations.", questionKh:"ខ្ញុំមានសុទិដ្ឋិ ទោះជានៅស្ថានការណ៍លំបាក។", category:'motivation' },
  { id:13, question:"I can sense how others feel without them saying it.", questionKh:"ខ្ញុំដឹងអ្វីដែលអ្នកដទៃមានអារម្មណ៍ ទោះគេមិននិយាយ។", category:'empathy' },
  { id:14, question:"I listen attentively when others share their problems.", questionKh:"ខ្ញុំស្ដាប់យ៉ាងយកចិត្ត ពេលអ្នកដទៃចែករំលែក។", category:'empathy' },
  { id:15, question:"I find it difficult to understand why people feel what they feel.", questionKh:"ខ្ញុំពិបាកយល់ ហេតុអ្វីអ្នកដទៃមានអារម្មណ៍ដូច្នោះ។", category:'empathy', reversed:true },
  { id:16, question:"I put myself in others' shoes with ease.", questionKh:"ខ្ញុំអាចគិតក្នុងស្ថានភាពអ្នកដទៃបានដោយងាយ។", category:'empathy' },
  { id:17, question:"I navigate difficult conversations and conflicts effectively.", questionKh:"ខ្ញុំគ្រប់គ្រងការជជែក និងការប្រឈមបានល្អ។", category:'social' },
  { id:18, question:"I build and maintain genuine relationships easily.", questionKh:"ខ្ញុំបង្កើត និងរក្សាទំនាក់ទំនងបានដោយងាយ។", category:'social' },
  { id:19, question:"I struggle to work collaboratively in teams.", questionKh:"ខ្ញុំពិបាកធ្វើការជាក្រុម។", category:'social', reversed:true },
  { id:20, question:"I influence and inspire others through my communication.", questionKh:"ខ្ញុំមានឥទ្ធិពល ហើយជំរុញចិត្តអ្នកដទៃ។", category:'social' },
  { id:21, question:"After receiving feedback, I can name the emotion it creates before I respond.", questionKh:"ក្រោយទទួល Feedback ខ្ញុំអាចស្គាល់អារម្មណ៍របស់ខ្លួន មុនឆ្លើយតប។", category:'self-awareness' },
  { id:22, question:"I notice early signs that stress is affecting my body or concentration.", questionKh:"ខ្ញុំសង្កេតឃើញសញ្ញាដំបូង ពេលសម្ពាធប៉ះពាល់រាងកាយ ឬការផ្តោតអារម្មណ៍។", category:'self-awareness' },
  { id:23, question:"When a message upsets me, I pause before replying.", questionKh:"ពេលសារមួយធ្វើឱ្យខ្ញុំមិនសប្បាយចិត្ត ខ្ញុំផ្អាកសិន មុនឆ្លើយតប។", category:'self-regulation' },
  { id:24, question:"Under pressure, I send responses that I later regret.", questionKh:"ពេលមានសម្ពាធ ខ្ញុំតែងឆ្លើយតបរហ័ស ហើយសោកស្តាយនៅពេលក្រោយ។", category:'self-regulation', reversed:true },
  { id:25, question:"I break a large goal into weekly actions and track progress.", questionKh:"ខ្ញុំបំបែកគោលដៅធំជាសកម្មភាពប្រចាំសប្តាហ៍ និងតាមដានវឌ្ឍនភាព។", category:'motivation' },
  { id:26, question:"I use mistakes as information for the next attempt.", questionKh:"ខ្ញុំយកកំហុសធ្វើជាព័ត៌មានសម្រាប់កែលម្អការព្យាយាមលើកក្រោយ។", category:'motivation' },
  { id:27, question:"Before judging a colleague, I check whether I understand their situation.", questionKh:"មុនវាយតម្លៃមិត្តរួមការងារ ខ្ញុំពិនិត្យថាតើយល់ពីស្ថានភាពរបស់គេគ្រប់គ្រាន់ឬនៅ។", category:'empathy' },
  { id:28, question:"I adjust how I explain something based on the listener's needs.", questionKh:"ខ្ញុំកែសម្រួលរបៀបពន្យល់ តាមតម្រូវការរបស់អ្នកស្តាប់។", category:'empathy' },
  { id:29, question:"During conflict, I clarify the issue and desired outcome without attacking the person.", questionKh:"ពេលមានជម្លោះ ខ្ញុំនិយាយពីបញ្ហា និងលទ្ធផលដែលចង់បាន ដោយមិនវាយប្រហារមនុស្ស។", category:'social' },
  { id:30, question:"I confirm roles, owners and deadlines after a team discussion.", questionKh:"ក្រោយពិភាក្សាក្រុម ខ្ញុំបញ្ជាក់តួនាទី អ្នកទទួលខុសត្រូវ និង Deadline។", category:'social' },
];

const LIKERT = [
  { value:1, labelKh:'មិនយល់ស្របខ្លាំង', labelEn:'Strongly Disagree' },
  { value:2, labelKh:'មិនយល់ស្រប', labelEn:'Disagree' },
  { value:3, labelKh:'អព្យាក្រឹត', labelEn:'Neutral' },
  { value:4, labelKh:'យល់ស្រប', labelEn:'Agree' },
  { value:5, labelKh:'យល់ស្របខ្លាំង', labelEn:'Strongly Agree' },
];

// ─── Career Clusters ──────────────────────────────────────────────────────────
const careerClusters: CareerCluster[] = [
  {
    id: 'tech',
    icon: <Cpu className="h-6 w-6" />,
    titleKh: 'បច្ចេកវិទ្យា & ទិន្នន័យ',
    titleEn: 'Technology & Data',
    descKh: 'អ្នកមានការគិតប្រព័ន្ធ ចូលចិត្តដោះស្រាយបញ្ហាស្មុគ្រស្មាញ ហើយមានភ្នែកវិភាគ។ ជំនាញ IQ ខ្ពស់ជំរុញអ្នកឱ្យបំពេញការងារបច្ចេកទេស និងទិន្នន័យ។',
    color: 'text-primary',
    bg: 'bg-muted border-primary/30',
    roles: ['Software Engineer', 'Data Analyst', 'Backend Developer', 'DevOps Engineer', 'AI/ML Engineer', 'Cybersecurity Specialist'],
    rolesKh: ['វិស្វករសូហ្វ្វែរ', 'អ្នកវិភាគទិន្នន័យ', 'Developer Backend', 'វិស្វករ DevOps', 'វិស្វករ AI/ML', 'អ្នកជំនាញ Cybersecurity'],
    skills: ['Python / JavaScript', 'SQL & Databases', 'Cloud (AWS/GCP)', 'System Design', 'Data Visualization'],
    skillsKh: ['Python / JavaScript', 'SQL & ភ្ជាប់ទិន្នន័យ', 'Cloud (AWS/GCP)', 'ការរចនាប្រព័ន្ធ', 'ការបង្ហាញទិន្នន័យ'],
    certifications: ['Google Data Analytics', 'AWS Certified', 'Meta Frontend Certificate', 'CompTIA Security+'],
    learningPath: ['Start with Python basics', 'Learn SQL fundamentals', 'Build 2-3 portfolio projects', 'Get cloud certification', 'Apply to tech roles'],
    learningPathKh: ['រៀន Python មូលដ្ឋាន', 'រៀន SQL', 'បង្កើត Project 2-3', 'ទទួល Cloud Certificate', 'ដាក់ពាក្យការងារ Tech'],
    salary: '$600 – $2,000+',
  },
  {
    id: 'leadership',
    icon: <Target className="h-6 w-6" />,
    titleKh: 'ភាពជាអ្នកដឹកនាំ & គ្រប់គ្រង',
    titleEn: 'Leadership & Management',
    descKh: 'អ្នកមានការបញ្ចុះបញ្ចូល ការគ្រប់គ្រងក្រុម ការគ្រប់គ្រងខ្លួនឯង និងចក្ខុវិស័យយូរអង្វែង — ជំនាញទាំងនេះជាគ្រឹះល្អ ចំពោះតួនាទីដឹកនាំ។',
    color: 'text-primary',
    bg: 'bg-muted border-primary/30',
    roles: ['Project Manager', 'Operations Manager', 'HR Manager', 'Branch Manager', 'Business Development Manager', 'CEO/Director'],
    rolesKh: ['អ្នកគ្រប់គ្រងគម្រោង', 'អ្នកគ្រប់គ្រងប្រតិបត្តិការ', 'អ្នកគ្រប់គ្រង HR', 'អ្នកគ្រប់គ្រងសាខា', 'អ្នកអភិវឌ្ឍអាជីវកម្ម', 'CEO/នាយក'],
    skills: ['Strategic Planning', 'Team Leadership', 'Stakeholder Communication', 'KPI & OKR Setting', 'Conflict Resolution'],
    skillsKh: ['ការគ្រោងផែនការ', 'ការដឹកនាំក្រុម', 'ការទំនាក់ទំនងភ្នាក់ងារ', 'ការកំណត់ KPI & OKR', 'ការដោះស្រាយជម្លោះ'],
    certifications: ['PMP (Project Management)', 'SHRM-CP (HR)', 'Six Sigma Green Belt', 'MBA (Mini/Full)'],
    learningPath: ['Master communication skills', 'Lead small teams first', 'Study business strategy', 'Get PMP or equivalent', 'Grow into senior roles'],
    learningPathKh: ['ជំនាញទំនាក់ទំនង', 'ដឹកនាំក្រុមមូលដ្ឋានជាមុន', 'រៀនយុទ្ធសាស្ត្រអាជីវកម្ម', 'ទទួល PMP Certificate', 'ឈានឡើងតួនាទីជាន់ខ្ពស់'],
    salary: '$800 – $3,000+',
  },
  {
    id: 'hr',
    icon: <Users className="h-6 w-6" />,
    titleKh: 'ធនធានមនុស្ស & បណ្ដុះបណ្ដាល',
    titleEn: 'Human Resources & Training',
    descKh: 'ការយល់ចិត្ត ការស្ដាប់ ការជំរុញ និងការគ្រប់គ្រងទំនាក់ទំនង — ជំនាញទាំងនេះ ធ្វើឱ្យអ្នកក្លាយជា HR ល្អ ឬគ្រូបណ្ដុះបណ្ដាល។',
    color: 'text-primary',
    bg: 'bg-muted border-primary/30',
    roles: ['HR Officer', 'HR Business Partner', 'Training Officer', 'Recruitment Coordinator', 'L&D Specialist', 'Payroll Officer'],
    rolesKh: ['មន្ត្រី HR', 'ដៃគូ HR', 'មន្ត្រីបណ្ដុះបណ្ដាល', 'សម្របសម្រួលជ្រើសរើស', 'អ្នកជំនាញ L&D', 'មន្ត្រីប្រាក់ខែ'],
    skills: ['Recruitment & Interviewing', 'Training Design', 'Labor Law Basics', 'HRIS Systems', 'Employee Relations'],
    skillsKh: ['ជ្រើសរើស & បំពេញការសម្ភាសន៍', 'ការរចនាការបណ្ដុះបណ្ដាល', 'ច្បាប់ការងារ', 'ប្រព័ន្ធ HRIS', 'ទំនាក់ទំនងបុគ្គលិក'],
    certifications: ['SHRM-CP', 'CIPD Level 3/5', 'PHRi (HR Cert)', 'ATD Certificate (Training)'],
    learningPath: ['Study HR fundamentals', 'Learn labor law basics', 'Practice interviewing', 'Get SHRM or PHRi cert', 'Specialize in L&D or ER'],
    learningPathKh: ['រៀន HR មូលដ្ឋាន', 'ច្បាប់ការងារ', 'អនុវត្តសម្ភាសន៍', 'ទទួល SHRM/PHRi', 'ជំនាញ L&D ឬ ER'],
    salary: '$400 – $1,400',
  },
  {
    id: 'sales',
    icon: <Megaphone className="h-6 w-6" />,
    titleKh: 'លក់ & ទីផ្សារ',
    titleEn: 'Sales & Marketing',
    descKh: 'ជំនាញសង្គម ការបញ្ចុះបញ្ចូល ភាពឆ្លាតវៃ និងការជំរុញខ្ពស់ — គ្រឹះល្អ ចំពោះការងារលក់ ការទីផ្សារ និងការបំប្លែងអតិថិជន។',
    color: 'text-accent',
    bg: 'bg-secondary border-accent/40',
    roles: ['Sales Executive', 'Marketing Coordinator', 'Digital Marketer', 'Brand Manager', 'Account Manager', 'E-commerce Officer'],
    rolesKh: ['អ្នកប្រតិបត្តិការលក់', 'សម្របសម្រួលទីផ្សារ', 'អ្នកទីផ្សារឌីជីថល', 'អ្នកគ្រប់គ្រងម៉ាក', 'អ្នកគ្រប់គ្រង Account', 'មន្ត្រី E-commerce'],
    skills: ['CRM Tools', 'Digital Marketing (Meta/Google Ads)', 'Content Strategy', 'Sales Negotiation', 'Analytics'],
    skillsKh: ['ប្រព័ន្ធ CRM', 'ទីផ្សារឌីជីថល', 'យុទ្ធសាស្ត្រ Content', 'ការចរចាលក់', 'ការវិភាគ'],
    certifications: ['Google Digital Marketing', 'Meta Blueprint', 'HubSpot Sales Certificate', 'Salesforce CRM'],
    learningPath: ['Learn digital marketing basics', 'Master social media ads', 'Study consumer psychology', 'Build campaign portfolio', 'Move into senior sales/marketing'],
    learningPathKh: ['ទីផ្សារឌីជីថលមូលដ្ឋាន', 'ផ្សាយ Social Media', 'សិក្សាចិត្តសាស្ត្រ​អ្នកប្រើប្រាស់', 'Portfolio Campaign', 'ឈានឡើងតួនាទីខ្ពស់'],
    salary: '$400 – $1,800',
  },
  {
    id: 'finance',
    icon: <DollarSign className="h-6 w-6" />,
    titleKh: 'ហិរញ្ញវត្ថុ & គណនេយ្យ',
    titleEn: 'Finance & Accounting',
    descKh: 'ទេពកោសល្យ គណិតវិទ្យា ភ្នែកម៉ត់ ការគ្រប់គ្រងខ្លួន និងការចូលចិត្ត លេខ — ជំនាញទាំងនេះ ធ្វើឱ្យអ្នកល្អ ក្នុងហិរញ្ញវត្ថុ ឬ គណនេយ្យ។',
    color: 'text-primary',
    bg: 'bg-muted border-primary/30',
    roles: ['Accountant', 'Finance Officer', 'Auditor', 'Financial Analyst', 'Payroll Officer', 'Tax Consultant'],
    rolesKh: ['គណនេយ្យករ', 'មន្ត្រីហិរញ្ញវត្ថុ', 'អ្នកត្រួតពិនិត្យ', 'អ្នកវិភាគហិរញ្ញ', 'មន្ត្រីប្រាក់ខែ', 'ទីប្រឹក្សាពន្ធ'],
    skills: ['Excel & Financial Modeling', 'Accounting Software (QuickBooks)', 'IFRS/GAAP Basics', 'Tax Compliance', 'Financial Reporting'],
    skillsKh: ['Excel & ម៉ូដែលហិរញ្ញ', 'Software គណនេយ្យ', 'IFRS/GAAP', 'ការអនុលោមពន្ធ', 'របាយការណ៍ហិរញ្ញ'],
    certifications: ['ACCA Foundation', 'CPA Cambodia', 'QuickBooks Certified', 'CAT (Certified Accounting Technician)'],
    learningPath: ['Study accounting principles', 'Master Excel & financial tools', 'Learn tax basics', 'Get ACCA/CPA certification', 'Build toward senior finance roles'],
    learningPathKh: ['គោលការណ៍គណនេយ្យ', 'Excel & ឧបករណ៍ហិរញ្ញ', 'មូលដ្ឋានពន្ធ', 'ទទួល ACCA/CPA', 'ឈានឡើងហិរញ្ញ'],
    salary: '$500 – $1,600',
  },
  {
    id: 'creative',
    icon: <PenTool className="h-6 w-6" />,
    titleKh: 'រចនា & ការបង្កើត',
    titleEn: 'Creative & Design',
    descKh: 'ចិត្តរចនា ការគ្រប់គ្រងអារម្មណ៍ ការស្ដាប់ ការសំខាន់ ចំពោះ ការបង្ហាញ — អ្នកល្អ ក្នុងការបង្ហាញ ចំណុចខ្ពស់ ចំពោះ អ្នកដទៃ។',
    color: 'text-accent',
    bg: 'bg-secondary border-accent/40',
    roles: ['Graphic Designer', 'UI/UX Designer', 'Product Designer', 'Content Creator', 'Videographer', 'Social Media Executive'],
    rolesKh: ['អ្នករចនាក្រាហ្វិក', 'UI/UX Designer', 'Product Designer', 'Creator Content', 'អ្នកថតវីដេអូ', 'មន្ត្រីបណ្ដាញសង្គម'],
    skills: ['Figma / Adobe XD', 'Adobe Creative Suite', 'Brand Identity', 'UX Research', 'Video Editing (Premiere/CapCut)'],
    skillsKh: ['Figma / Adobe XD', 'Adobe Creative Suite', 'អត្ដសញ្ញាណម៉ាក', 'UX Research', 'កែវីដេអូ (Premiere/CapCut)'],
    certifications: ['Google UX Design Certificate', 'Adobe Certified Professional', 'Figma Advanced', 'Canva for Teams'],
    learningPath: ['Learn design fundamentals', 'Master Figma or Adobe', 'Build design portfolio', 'Study UX principles', 'Apply to creative agencies'],
    learningPathKh: ['មូលដ្ឋានការរចនា', 'Figma ឬ Adobe', 'Portfolio ការរចនា', 'UX Principles', 'ដាក់ពាក្យ Creative Agency'],
    salary: '$400 – $1,400',
  },
  {
    id: 'hospitality',
    icon: <Coffee className="h-6 w-6" />,
    titleKh: 'បដិសណ្ឋារកិច្ច & ទេសចរណ៍',
    titleEn: 'Hospitality & Tourism',
    descKh: 'ការយល់ចិត្ត ការទំនាក់ទំនង ភាពរួសរាយ ការសម្របខ្លួន — ជំនាញទាំងនេះ ធ្វើឱ្យអ្នក ចូលចិត្ត ហើយ ល្អ ក្នុងការ ផ្ដល់ ទំនាក់ ទំនង ភ្ញៀវ ។',
    color: 'text-accent',
    bg: 'bg-secondary border-accent/40',
    roles: ['Front Office Supervisor', 'Hotel Manager', 'Guest Relations Officer', 'Restaurant Manager', 'Event Coordinator', 'Tour Guide'],
    rolesKh: ['Supervisor Front Office', 'អ្នកគ្រប់គ្រងសណ្ឋាគារ', 'មន្ត្រីទំនាក់ទំនងភ្ញៀវ', 'អ្នកគ្រប់គ្រងភោជនីយដ្ឋាន', 'អ្នកសម្របសម្រួលព្រឹត្តិការណ៍', 'មគ្គុទ្ទេសក៍'],
    skills: ['Guest Service Excellence', 'Opera PMS / MICROS', 'English Communication', 'F&B Service', 'Event Planning'],
    skillsKh: ['ជំនាញ ​Guest Service', 'Opera PMS / MICROS', 'ភាសាអង់គ្លេស', 'F&B Service', 'ផែនការព្រឹត្តិការណ៍'],
    certifications: ['TESOL (English Teaching)', 'IHG / Marriott Training', 'ServSafe (Food Safety)', 'Event Management Certificate'],
    learningPath: ['Start in entry-level service roles', 'Master English communication', 'Get Opera PMS training', 'Earn hospitality certification', 'Grow into supervisory roles'],
    learningPathKh: ['ចាប់ផ្ដើមការងារ Entry-level', 'ភាសាអង់គ្លេស', 'Opera PMS Training', 'Certificate បដិសណ្ឋារ', 'ឈានឡើង Supervisor'],
    salary: '$300 – $1,200',
  },
  {
    id: 'logistics',
    icon: <Package className="h-6 w-6" />,
    titleKh: 'ប្រតិបត្តិការ & ភស្ដុភារ',
    titleEn: 'Operations & Supply Chain',
    descKh: 'ការគ្រប់គ្រងម៉ត់ ការរៀបចំ ការវិភាគ និង ការស្ថាបនា ប្រព័ន្ធ — ជំនាញ ទាំងនេះ ជំរុញ ប្រព័ន្ធ ប្រតិបត្តិការ ក្រុមហ៊ុន ។',
    color: 'text-sky-600',
    bg: 'bg-sky-50 border-sky-200',
    roles: ['Warehouse Supervisor', 'Procurement Officer', 'Logistics Coordinator', 'Operations Manager', 'Quality Control Officer', 'Store Manager'],
    rolesKh: ['Supervisor ឃ្លាំង', 'មន្ត្រីទំនិញ', 'អ្នកសម្របសម្រួលភស្ដុភារ', 'អ្នកគ្រប់គ្រងប្រតិបត្តិការ', 'មន្ត្រីគ្រប់គ្រងគុណភាព', 'អ្នកគ្រប់គ្រងហាង'],
    skills: ['Inventory Management', 'ERP Systems (SAP/Oracle)', 'Supplier Relations', 'Process Optimization', 'Quality Assurance'],
    skillsKh: ['គ្រប់គ្រងស្ដុក', 'ប្រព័ន្ធ ERP (SAP/Oracle)', 'ទំនាក់ទំនង Supplier', 'បង្កើនប្រសិទ្ធភាព', 'ធានាគុណភាព'],
    certifications: ['CPSM (Procurement)', 'Six Sigma Yellow Belt', 'SAP Fundamentals', 'APICS CSCP'],
    learningPath: ['Learn supply chain basics', 'Master Excel & inventory tools', 'Understand ERP systems', 'Get Six Sigma or CPSM', 'Advance to operations management'],
    learningPathKh: ['Supply Chain មូលដ្ឋាន', 'Excel & ឧបករណ៍ Inventory', 'ប្រព័ន្ធ ERP', 'Six Sigma ឬ CPSM', 'ប្រតិបត្តិការ Management'],
    salary: '$400 – $1,500',
  },
];

// ─── Scoring Engine ───────────────────────────────────────────────────────────
function calcIQ(ans: Record<number, number>) {
  const correct = iqQuestions.filter(q => ans[q.id] === q.correct).length;
  return { score: Math.round(85 + (correct / iqQuestions.length) * 60), correct, total: iqQuestions.length };
}

function calcEQ(ans: Record<number, number>) {
  const cats: EQCategory[] = ['self-awareness','self-regulation','motivation','empathy','social'];
  const breakdown: Record<EQCategory, number> = {} as Record<EQCategory, number>;
  cats.forEach(cat => {
    const qs = eqQuestions.filter(q => q.category === cat);
    const raw = qs.reduce((sum, q) => sum + (q.reversed ? 6 - (ans[q.id] ?? 3) : (ans[q.id] ?? 3)), 0);
    breakdown[cat] = Math.round((raw / (qs.length * 5)) * 100);
  });
  const total = Math.round(Object.values(breakdown).reduce((a, b) => a + b, 0) / cats.length);
  return { total, breakdown };
}

function recommend(iqScore: number, eqBreakdown: Record<EQCategory, number>): string[] {
  const results: string[] = [];
  const highEmpathy = eqBreakdown.empathy >= 65;
  const highSocial = eqBreakdown.social >= 65;
  const highMotivation = eqBreakdown.motivation >= 65;
  const highSelfReg = eqBreakdown['self-regulation'] >= 65;
  const highIQ = iqScore >= 115;
  const medIQ = iqScore >= 97;

  if (highIQ) results.push('tech');
  if (highIQ && (highSocial || highMotivation)) results.push('leadership');
  if (highEmpathy && highSocial) results.push('hr');
  if (highSocial && highMotivation) results.push('sales');
  if (highIQ && highSelfReg) results.push('finance');
  if (medIQ && highEmpathy) results.push('creative');
  if (highEmpathy && !highIQ) results.push('hospitality');
  if (medIQ && highSelfReg) results.push('logistics');

  // Ensure at least 3 recommendations
  const fallbacks = ['hr','sales','hospitality','logistics','creative'];
  for (const f of fallbacks) {
    if (results.length >= 3) break;
    if (!results.includes(f)) results.push(f);
  }
  return [...new Set(results)].slice(0, 4);
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Bar({ value, max=100, color='bg-accent' }: { value:number; max?:number; color?:string }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width:`${Math.round((value/max)*100)}%` }} />
    </div>
  );
}

function Badge({ label, color='bg-accent/10 text-accent' }: { label:string; color?:string }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>{label}</span>;
}

// ─── INTRO ────────────────────────────────────────────────────────────────────
function Intro({ onStart }: { onStart:()=>void }) {
  return (
    <div className="bg-background">
      <section className="border-b border-primary/20 bg-primary text-primary-foreground">
        <div className="container-wide grid min-h-[560px] items-center gap-10 py-14 lg:grid-cols-[1.15fr_.85fr] lg:py-20">
          <div className="animate-fade-up">
            <div className="mb-5 inline-flex items-center gap-2 border-l-4 border-accent pl-3 text-sm font-bold text-accent">
              <Gauge className="h-5 w-5" /> LY Haw Career Assessment
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.45] sm:text-5xl">
              ស្គាល់សមត្ថភាពខ្លួនឯង<br />មុនជ្រើសរើសផ្លូវអាជីព
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-primary-foreground/75">
              វាស់ការគិតវិភាគ និងបញ្ញាអារម្មណ៍របស់អ្នក ដើម្បីទទួលបានមុខតំណែងដែលសាកសម ជំនាញត្រូវអភិវឌ្ឍ និងផែនការរៀនបន្ទាប់។
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button onClick={onStart} className="inline-flex min-h-14 items-center gap-3 bg-accent px-7 text-base font-extrabold text-accent-foreground shadow-lg transition-transform hover:-translate-y-0.5">
                <ListChecks className="h-5 w-5" /> ចាប់ផ្ដើមតេស្តឥឡូវនេះ <ArrowRight className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 px-2 text-sm text-primary-foreground/70">
                <Clock3 className="h-4 w-4 text-accent" /> ប្រហែល 30–35 នាទី
              </div>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-3 border-t border-primary-foreground/15 pt-5">
              {[[55,'សំណួរ'],[2,'ដំណាក់កាល'],[8,'ក្រុមអាជីព']].map(([value,label])=>(
                <div key={label} className="border-r border-primary-foreground/15 pr-4 last:border-0">
                  <p className="text-2xl font-extrabold text-accent">{value}</p>
                  <p className="mt-1 text-xs text-primary-foreground/60">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="assessment-preview animate-slide-left relative border border-primary-foreground/20 bg-primary-foreground/[.07] p-5 sm:p-7">
            <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
            <div className="flex items-center justify-between border-b border-primary-foreground/15 pb-5">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center bg-accent text-accent-foreground"><BarChart3 className="h-6 w-6"/></span>
                <div><p className="text-[11px] font-bold uppercase text-accent">Example result</p><h2 className="mt-1 text-lg font-extrabold">Career Readiness Profile</h2></div>
              </div>
              <span className="flex items-center gap-1.5 border border-accent/40 px-2 py-1 text-[10px] font-bold text-accent"><span className="h-1.5 w-1.5 animate-pulse bg-accent"/> LIVE</span>
            </div>

            <div className="grid grid-cols-2 gap-px bg-primary-foreground/15">
              <div className="bg-primary p-4"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs font-bold"><Brain className="h-4 w-4 text-accent"/>IQ</span><strong className="text-xl text-accent">118</strong></div><div className="mt-3 h-1.5 bg-primary-foreground/15"><span className="assessment-bar block h-full w-[78%] bg-accent"/></div></div>
              <div className="bg-primary p-4"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs font-bold"><Heart className="h-4 w-4 text-accent"/>EQ</span><strong className="text-xl text-accent">82%</strong></div><div className="mt-3 h-1.5 bg-primary-foreground/15"><span className="assessment-bar delay-200 block h-full w-[82%] bg-accent"/></div></div>
            </div>

            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between"><p className="text-xs font-extrabold uppercase text-primary-foreground/55">Top Career Matches</p><Trophy className="h-4 w-4 text-accent"/></div>
              <div className="space-y-2">
                {[
                  {icon:<Users className="h-4 w-4"/>,role:'HR & People Development',match:'92%'},
                  {icon:<Target className="h-4 w-4"/>,role:'Leadership & Management',match:'87%'},
                  {icon:<Megaphone className="h-4 w-4"/>,role:'Sales & Communication',match:'81%'},
                ].map((item,index)=>(
                  <div key={item.role} style={{animationDelay:`${(index+2)*100}ms`}} className="animate-fade-up group flex items-center gap-3 border border-primary-foreground/10 bg-primary-foreground/[.05] p-3 transition-colors hover:border-accent/50 hover:bg-primary-foreground/10">
                    <span className="grid h-9 w-9 shrink-0 place-items-center bg-primary-foreground/10 text-accent transition-transform group-hover:scale-105">{item.icon}</span>
                    <span className="flex-1 text-xs font-bold sm:text-sm">{item.role}</span>
                    <strong className="text-sm text-accent">{item.match}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 border-t border-primary-foreground/15 pt-4 text-xs text-primary-foreground/65">
              <Route className="h-5 w-5 shrink-0 text-accent"/><span>ទទួលបានផែនការរៀន និងជំនាញដែលត្រូវអភិវឌ្ឍបន្ទាប់</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide py-12 sm:py-16">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase text-accent">អ្វីដែលអ្នកទទួលបាន</p>
            <h2 className="mt-2 text-2xl font-extrabold leading-10 text-primary sm:text-3xl">មិនត្រឹមតែទទួលបានពិន្ទុ<br/>ប៉ុន្តែដឹងថាត្រូវបន្តទៅណា</h2>
          </div>
          <p className="border-l-2 border-accent pl-5 text-sm leading-7 text-muted-foreground">តេស្តនេះជាឧបករណ៍សម្រាប់ស្គាល់ខ្លួនឯង និងរៀបចំផែនការអភិវឌ្ឍ មិនមែនជាការវិនិច្ឆ័យវេជ្ជសាស្ត្រ ឬការធានាការងារទេ។</p>
        </div>
        <div className="grid border border-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            {icon:<Brain className="h-6 w-6"/>,title:'IQ Score',text:'ឃើញកម្លាំងនៃការគិត និងការដោះស្រាយបញ្ហា'},
            {icon:<Heart className="h-6 w-6"/>,title:'EQ Profile',text:'យល់ពីអារម្មណ៍ ការសហការ និងការគ្រប់គ្រងខ្លួន'},
            {icon:<BriefcaseBusiness className="h-6 w-6"/>,title:'Career Match',text:'ផ្គូផ្គងក្រុមអាជីព និងមុខតំណែងដែលសាកសម'},
            {icon:<GraduationCap className="h-6 w-6"/>,title:'Learning Plan',text:'ទទួលបានជំនាញ និងផែនការរៀនជាជំហានៗ'},
          ].map((item)=>(
            <div key={item.title} className="border-b border-border p-6 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r lg:last:border-r-0">
              <div className="mb-4 grid h-11 w-11 place-items-center bg-muted text-primary">{item.icon}</div>
              <h3 className="font-extrabold text-primary">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-3">
          {[
            {number:'01',icon:<Brain className="h-5 w-5"/>,title:'ធ្វើ IQ Test',text:'ជ្រើសចម្លើយ 25 សំណួរ៖ Logic, Pattern, Math, Spatial និង Verbal'},
            {number:'02',icon:<Heart className="h-5 w-5"/>,title:'ស្គាល់ EQ Profile',text:'ឆ្លើយ 30 សំណួរអំពីអារម្មណ៍ សម្ពាធ Feedback និងការងារជាក្រុម'},
            {number:'03',icon:<Route className="h-5 w-5"/>,title:'បើក Career Map',text:'មើលមុខតំណែង ជំនាញ និងផែនការរៀនផ្ទាល់ខ្លួន'},
          ].map((step)=>(
            <div key={step.number} className="group bg-card p-6 transition-colors hover:bg-muted/60">
              <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center bg-primary text-accent transition-transform group-hover:-translate-y-1">{step.icon}</span><span className="text-2xl font-extrabold text-border">{step.number}</span></div>
              <h3 className="mt-5 font-extrabold text-primary">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-5 bg-primary px-6 py-7 text-primary-foreground sm:flex-row sm:px-8">
          <div className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center bg-accent text-accent-foreground"><Star className="h-6 w-6"/></span><div><p className="font-extrabold">ត្រៀមស្គាល់សមត្ថភាពរបស់អ្នកហើយឬនៅ?</p><p className="mt-1 text-xs text-primary-foreground/60">ឥតគិតថ្លៃ · មិនត្រូវការបង្កើតគណនី</p></div></div>
          <button onClick={onStart} className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-accent px-6 font-extrabold text-accent-foreground transition-transform hover:-translate-y-0.5 sm:w-auto">ចាប់ផ្ដើមឥឡូវនេះ <ArrowRight className="h-4 w-4"/></button>
        </div>
      </section>
    </div>
  );
}

// ─── IQ SCREEN ────────────────────────────────────────────────────────────────
function IQScreen({ answers, setAnswers, onDone, onExit }: { answers:Record<number,number>; setAnswers:(a:Record<number,number>)=>void; onDone:()=>void; onExit:()=>void }) {
  const [cur, setCur] = useState(0);
  const q = iqQuestions[cur];
  const total = iqQuestions.length;
  const answeredCount = Object.keys(answers).filter(k => iqQuestions.some(q=>q.id===Number(k))).length;
  const catKh: Record<IQCategory,string> = { logic:'ការគិតតាមហេតុផល', pattern:'ការស្គាល់លំនាំ', math:'គណិតវិទ្យា', spatial:'ការគិតតាមរូបភាព', verbal:'ការយល់ពាក្យ' };
  const goTo = (index:number) => setCur(Math.max(0, Math.min(total - 1, index)));

  return (
    <div className="min-h-dvh bg-muted/40">
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container-wide flex min-h-16 items-center justify-between gap-3 py-2">
          <div className="flex items-center gap-3 font-extrabold text-primary shrink-0"><span className="grid h-9 w-9 place-items-center bg-muted"><Brain className="h-5 w-5" /></span><span>IQ Assessment</span></div>
          <div className="hidden flex-1 max-w-sm sm:block"><Bar value={answeredCount} max={total} color="bg-primary" /></div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-extrabold text-primary">{answeredCount}/{total}</span>
            <button
              onClick={() => { if (window.confirm('ចង់ចេញពី IQ Test ពិតទេ? ចម្លើយទាំងអស់នឹងត្រូវបាត់បង់!')) onExit(); }}
              className="grid h-9 w-9 place-items-center border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              title="ចេញពីតេស្ត"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container-wide grid gap-6 py-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-10">
        <aside className="self-start border border-border bg-card p-5 lg:sticky lg:top-24">
          <p className="text-xs font-extrabold uppercase text-accent">ដំណាក់កាល 1 នៃ 2</p>
          <h2 className="mt-2 text-xl font-extrabold text-primary">ការគិត និងការវិភាគ</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">ជ្រើសចម្លើយដែលអ្នកគិតថាត្រឹមត្រូវបំផុត។ អ្នកអាចត្រឡប់មកកែចម្លើយបាន។</p>
          <div className="mt-5 border-y border-border py-4">
            <div className="mb-2 flex items-center justify-between text-xs font-bold"><span>វឌ្ឍនភាព</span><span className="text-primary">{Math.round((answeredCount/total)*100)}%</span></div>
            <Bar value={answeredCount} max={total} color="bg-primary" />
          </div>
          <details className="mt-5 border-y border-border py-3 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-extrabold text-primary"><span>បើកបញ្ជីសំណួរ</span><span>{answeredCount}/{total}</span></summary>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {iqQuestions.map((item,i) => (
                <button key={item.id} onClick={()=>goTo(i)} aria-label={`សំណួរ ${i+1}`}
                  className={`relative grid h-10 place-items-center border text-xs font-extrabold transition-colors ${i===cur?'border-primary bg-primary text-primary-foreground':answers[item.id]!==undefined?'border-accent bg-secondary text-primary':'border-border bg-background text-muted-foreground hover:border-primary/50'}`}>
                  {answers[item.id]!==undefined && i!==cur ? <CheckCircle2 className="h-4 w-4"/> : i+1}
                </button>
              ))}
            </div>
          </details>
          <div className="mt-5 hidden grid-cols-3 gap-2 lg:grid">
            {iqQuestions.map((item,i) => (
              <button key={item.id} onClick={()=>goTo(i)} aria-label={`សំណួរ ${i+1}`}
                className={`relative grid h-10 place-items-center border text-xs font-extrabold transition-colors ${i===cur?'border-primary bg-primary text-primary-foreground':answers[item.id]!==undefined?'border-accent bg-secondary text-primary':'border-border bg-background text-muted-foreground hover:border-primary/50'}`}>
                {answers[item.id]!==undefined && i!==cur ? <CheckCircle2 className="h-4 w-4"/> : i+1}
              </button>
            ))}
          </div>
          <div className="mt-5 flex gap-2 border-t border-border pt-4 text-xs leading-5 text-muted-foreground"><Info className="mt-0.5 h-4 w-4 shrink-0 text-accent"/><span>ចម្លើយត្រឹមត្រូវនឹងបង្ហាញជាមួយលទ្ធផល ដើម្បីរក្សាភាពត្រឹមត្រូវនៃតេស្ត។</span></div>
        </aside>

        <main className="border border-border bg-card">
          <div className="border-b border-border px-5 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-extrabold text-accent"><CircleDot className="h-4 w-4"/>{catKh[q.category]}</span>
              <span className="text-xs font-bold text-muted-foreground">សំណួរ {cur+1} / {total}</span>
            </div>
          </div>
          <div className="p-5 sm:p-8 lg:p-10">
            <h2 className="max-w-3xl text-xl font-extrabold leading-9 text-primary sm:text-2xl">{q.questionKh}</h2>
            {q.questionKh !== q.question && <p className="mt-2 text-sm leading-6 text-muted-foreground">{q.question}</p>}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {q.optionsKh.map((opt,i)=>{
                const sel = answers[q.id]===i;
                return (
                  <button key={i} onClick={()=>setAnswers({...answers,[q.id]:i})}
                    className={`min-h-16 w-full flex items-center gap-3 border p-4 text-left text-sm font-semibold transition-all ${sel?'border-primary bg-muted text-primary shadow-sm':'border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted/50'}`}>
                    <span className={`grid h-9 w-9 shrink-0 place-items-center text-xs font-extrabold ${sel?'bg-primary text-primary-foreground':'bg-muted text-primary'}`}>
                      {String.fromCharCode(65+i)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {sel&&<CheckCircle2 className="h-5 w-5 text-primary shrink-0"/>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border px-5 py-4 sm:px-8">
            <button onClick={()=>goTo(cur-1)} disabled={cur===0}
              className="flex min-h-11 items-center gap-1 border border-border px-4 text-sm font-bold disabled:opacity-35 hover:bg-muted">
              <ChevronLeft className="h-4 w-4"/>មុន
            </button>
            {cur<total-1?(
              <button onClick={()=>goTo(cur+1)} className="flex min-h-11 items-center gap-1 bg-primary px-5 text-sm font-bold text-primary-foreground hover:opacity-90">
                បន្ទាប់<ChevronRight className="h-4 w-4"/>
              </button>
            ):(
              <button onClick={onDone} disabled={answeredCount<total}
                className="flex min-h-11 items-center gap-2 bg-primary px-6 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">
                IQ Test រួចហើយ!<ChevronRight className="h-4 w-4"/>
              </button>
            )}
          </div>
          {answeredCount<total&&cur===total-1&&<p className="border-t border-border px-5 py-3 text-center text-xs text-accent">នៅសល់ {total-answeredCount} សំណួរមិនទាន់ឆ្លើយ។ ចុចលេខសំណួរខាងឆ្វេងដើម្បីត្រឡប់ទៅឆ្លើយ។</p>}
        </main>
      </div>
    </div>
  );
}

// ─── TRANSITION ───────────────────────────────────────────────────────────────
function Transition({ onStart }: { onStart:()=>void }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-3xl border border-border bg-card">
        <div className="grid md:grid-cols-[220px_1fr]">
          <div className="grid min-h-48 place-items-center bg-primary p-8 text-primary-foreground">
            <div className="text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-accent"/><p className="mt-4 text-sm font-bold">IQ Test បានបញ្ចប់</p></div>
          </div>
          <div className="p-7 sm:p-10">
            <p className="text-xs font-extrabold uppercase text-accent">ដំណាក់កាល 2 នៃ 2</p>
            <h2 className="mt-2 text-2xl font-extrabold text-primary">បន្តទៅកាន់ EQ Profile</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">សំណួរបន្ទាប់វាស់ការយល់អារម្មណ៍ ការគ្រប់គ្រងខ្លួន និងការធ្វើការជាមួយអ្នកដទៃ។ មិនមានចម្លើយត្រូវឬខុសទេ សូមជ្រើសចម្លើយដែលតំណាងឱ្យអ្នកពិតប្រាកដ។</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {[['Self-Awareness',Brain],['Empathy',Heart],['Social Skills',Users]].map(([label,Icon])=><div key={String(label)} className="flex items-center gap-2 border border-border px-3 py-3 text-xs font-bold text-primary"><Icon className="h-4 w-4 text-accent"/>{String(label)}</div>)}
            </div>
            <button onClick={onStart} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-accent px-6 font-extrabold text-accent-foreground hover:opacity-90 sm:w-auto">
              ចាប់ផ្ដើម EQ Test <ArrowRight className="h-5 w-5"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EQ SCREEN ────────────────────────────────────────────────────────────────
function EQScreen({ answers, setAnswers, onDone, onExit }: { answers:Record<number,number>; setAnswers:(a:Record<number,number>)=>void; onDone:()=>void; onExit:()=>void }) {
  const [cur, setCur] = useState(0);
  const total = eqQuestions.length;
  const q = eqQuestions[cur];
  const answeredCount = Object.keys(answers).filter(k=>eqQuestions.some(q=>q.id===Number(k))).length;

  const catBg: Record<EQCategory,string> = { 'self-awareness':'bg-muted text-primary','self-regulation':'bg-muted text-primary','motivation':'bg-secondary text-accent','empathy':'bg-secondary text-accent','social':'bg-muted text-primary' };
  const catKh: Record<EQCategory,string> = { 'self-awareness':'ការដឹងខ្លួន','self-regulation':'ការគ្រប់គ្រងខ្លួន','motivation':'ការជំរុញចិត្ត','empathy':'ការយល់ចិត្ត','social':'ជំនាញសង្គម' };

  const pick = (val:number) => {
    setAnswers({...answers,[q.id]:val});
    if (cur<total-1) setTimeout(()=>setCur(c=>c+1),220);
  };

  return (
    <div className="min-h-dvh bg-muted/40">
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container-wide flex min-h-16 items-center justify-between gap-3 py-2">
          <div className="flex items-center gap-3 font-extrabold text-primary shrink-0"><span className="grid h-9 w-9 place-items-center bg-secondary"><Heart className="h-5 w-5 text-accent"/></span><span>EQ Assessment</span></div>
          <div className="hidden flex-1 max-w-sm sm:block"><Bar value={answeredCount} max={total} color="bg-accent"/></div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-extrabold text-primary">{answeredCount}/{total}</span>
            <button
              onClick={() => { if (window.confirm('ចង់ចេញពី EQ Test ពិតទេ? ចម្លើយទាំងអស់នឹងត្រូវបាត់បង់!')) onExit(); }}
              className="grid h-9 w-9 place-items-center border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              title="ចេញពីតេស្ត"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container-wide grid gap-6 py-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-10">
        <aside className="self-start border border-border bg-card p-5 lg:sticky lg:top-24">
          <p className="text-xs font-extrabold uppercase text-accent">ដំណាក់កាល 2 នៃ 2</p>
          <h2 className="mt-2 text-xl font-extrabold text-primary">បញ្ញាអារម្មណ៍</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">ឆ្លើយតាមអាកប្បកិរិយាពិតរបស់អ្នក។ បន្ទាប់ពីជ្រើសរើស ប្រព័ន្ធនឹងទៅសំណួរបន្ទាប់ដោយស្វ័យប្រវត្តិ។</p>
          <div className="mt-5 border-y border-border py-4">
            <div className="mb-2 flex items-center justify-between text-xs font-bold"><span>វឌ្ឍនភាព</span><span className="text-primary">{Math.round((answeredCount/total)*100)}%</span></div>
            <Bar value={answeredCount} max={total} color="bg-accent" />
          </div>
          <details className="mt-5 border-y border-border py-3 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-extrabold text-primary"><span>បើកបញ្ជីសំណួរ</span><span>{answeredCount}/{total}</span></summary>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {eqQuestions.map((item,i)=>(
                <button key={item.id} onClick={()=>setCur(i)} aria-label={`សំណួរ ${i+1}`}
                  className={`grid h-10 place-items-center border text-xs font-extrabold transition-colors ${i===cur?'border-primary bg-primary text-primary-foreground':answers[item.id]!==undefined?'border-accent bg-secondary text-primary':'border-border bg-background text-muted-foreground hover:border-primary/50'}`}>
                  {answers[item.id]!==undefined && i!==cur ? <CheckCircle2 className="h-4 w-4"/> : i+1}
                </button>
              ))}
            </div>
          </details>
          <div className="mt-5 hidden grid-cols-4 gap-2 lg:grid">
            {eqQuestions.map((item,i)=>(
              <button key={item.id} onClick={()=>setCur(i)} aria-label={`សំណួរ ${i+1}`}
                className={`grid h-10 place-items-center border text-xs font-extrabold transition-colors ${i===cur?'border-primary bg-primary text-primary-foreground':answers[item.id]!==undefined?'border-accent bg-secondary text-primary':'border-border bg-background text-muted-foreground hover:border-primary/50'}`}>
                {answers[item.id]!==undefined && i!==cur ? <CheckCircle2 className="h-4 w-4"/> : i+1}
              </button>
            ))}
          </div>
        </aside>

        <main className="border border-border bg-card">
          <div className="border-b border-border px-5 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={`inline-flex items-center gap-2 text-xs font-extrabold ${catBg[q.category]}`}><CircleDot className="h-4 w-4"/>{catKh[q.category]}</span>
              <span className="text-xs font-bold text-muted-foreground">សំណួរ {cur+1} / {total}</span>
            </div>
          </div>
          <div className="p-5 sm:p-8 lg:p-10">
            <h2 className="max-w-3xl text-xl font-extrabold leading-9 text-primary sm:text-2xl">{q.questionKh}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{q.question}</p>

            <div className="mt-7 space-y-3">
              {LIKERT.map(opt=>{
                const sel = answers[q.id]===opt.value;
                return (
                  <button key={opt.value} onClick={()=>pick(opt.value)}
                    className={`min-h-14 w-full flex items-center gap-3 border p-3 text-left text-sm font-semibold transition-all ${sel?'border-accent bg-secondary text-primary':'border-border bg-background text-muted-foreground hover:border-accent/50 hover:bg-secondary/40'}`}>
                    <span className={`grid h-9 w-9 shrink-0 place-items-center text-xs font-extrabold ${sel?'bg-accent text-accent-foreground':'bg-muted text-primary'}`}>{opt.value}</span>
                    <span className="flex-1">{opt.labelKh}</span>
                    <span className="text-xs text-muted-foreground hidden sm:block">{opt.labelEn}</span>
                    {sel&&<CheckCircle2 className="h-5 w-5 text-accent shrink-0"/>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border px-5 py-4 sm:px-8">
            <button onClick={()=>setCur(c=>Math.max(0,c-1))} disabled={cur===0}
              className="flex min-h-11 items-center gap-1 border border-border px-4 text-sm font-bold disabled:opacity-35 hover:bg-muted">
              <ChevronLeft className="h-4 w-4"/>មុន
            </button>
            {cur<total-1?(
              <button onClick={()=>setCur(c=>c+1)} className="flex min-h-11 items-center gap-1 bg-primary px-5 text-sm font-bold text-primary-foreground hover:opacity-90">
                បន្ទាប់<ChevronRight className="h-4 w-4"/>
              </button>
            ):(
              <button onClick={onDone} disabled={answeredCount<total}
                className="flex min-h-11 items-center gap-2 bg-accent px-6 text-sm font-bold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-90">
                <Trophy className="h-4 w-4"/>មើលលទ្ធផល
              </button>
            )}
          </div>
          {answeredCount<total&&cur===total-1&&<p className="border-t border-border px-5 py-3 text-center text-xs text-accent">នៅសល់ {total-answeredCount} សំណួរមិនទាន់ឆ្លើយ។ ចុចលេខសំណួរខាងឆ្វេងដើម្បីត្រឡប់ទៅឆ្លើយ។</p>}
        </main>
      </div>
    </div>
  );
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────
function Results({ iqAns, eqAns, onRetake }: { iqAns:Record<number,number>; eqAns:Record<number,number>; onRetake:()=>void }) {
  const { score:iq, correct, total } = calcIQ(iqAns);
  const { total:eqTotal, breakdown } = calcEQ(eqAns);
  const recIds = recommend(iq, breakdown);
  const recs = recIds.map(id=>careerClusters.find(c=>c.id===id)!).filter(Boolean);

  const [activeRec, setActiveRec] = useState(0);
  const selected = recs[activeRec];

  const iqLevel = iq>=130?{l:'ឧត្ដម',e:'Very Superior',c:'text-primary',bg:'bg-muted'}:iq>=120?{l:'ខ្ពស់ខ្លាំង',e:'Superior',c:'text-primary',bg:'bg-muted'}:iq>=110?{l:'ខ្ពស់ជាងមធ្យម',e:'High Average',c:'text-primary',bg:'bg-muted'}:iq>=90?{l:'មធ្យម',e:'Average',c:'text-primary',bg:'bg-muted'}:{l:'ត្រូវអភិវឌ្ឍ',e:'Developing',c:'text-accent',bg:'bg-secondary'};
  const eqLevel = eqTotal>=80?{l:'ឧត្ដមភាពអារម្មណ៍',e:'Exceptional',c:'text-primary'}:eqTotal>=65?{l:'EQ ខ្ពស់',e:'High EQ',c:'text-primary'}:eqTotal>=50?{l:'EQ មធ្យម',e:'Average EQ',c:'text-primary'}:{l:'EQ កំពុងអភិវឌ្ឍ',e:'Developing',c:'text-accent'};

  const eqCats: {key:EQCategory;kh:string;icon:React.ReactNode;color:string}[] = [
    {key:'self-awareness',kh:'ការដឹងខ្លួន',icon:<Brain className="h-4 w-4"/>,color:'bg-primary'},
    {key:'self-regulation',kh:'ការគ្រប់គ្រងខ្លួន',icon:<Shield className="h-4 w-4"/>,color:'bg-primary'},
    {key:'motivation',kh:'ការជំរុញចិត្ត',icon:<Zap className="h-4 w-4"/>,color:'bg-accent'},
    {key:'empathy',kh:'ការយល់ចិត្ត',icon:<Heart className="h-4 w-4"/>,color:'bg-accent'},
    {key:'social',kh:'ជំនាញសង្គម',icon:<Users className="h-4 w-4"/>,color:'bg-primary'},
  ];

  const iqCats: {key:IQCategory;kh:string}[] = [
    {key:'logic',kh:'Logic'},
    {key:'pattern',kh:'Pattern'},
    {key:'math',kh:'Math'},
    {key:'verbal',kh:'Verbal'},
    {key:'spatial',kh:'Spatial'},
  ];

  return (
    <div className="min-h-dvh bg-muted">
      {/* Hero result banner */}
      <div className="bg-primary text-primary-foreground">
        <div className="container-wide py-12 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-accent shadow-lg">
            <Trophy className="h-8 w-8 text-accent-foreground"/>
          </div>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-accent">លទ្ធផល Career Assessment</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">IQ &amp; EQ Profile របស់អ្នក</h1>
        </div>
      </div>

      <div className="container-wide py-10 space-y-8">

        {/* ── Score cards ── */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* IQ */}
          <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted"><Brain className="h-6 w-6 text-primary"/></div>
              <div><p className="font-extrabold text-primary">IQ Score</p><p className="text-xs text-muted-foreground">Intelligence Quotient</p></div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-6xl font-extrabold text-primary">{iq}</div>
                <div className={`mt-1 font-bold ${iqLevel.c}`}>{iqLevel.l} <span className="text-sm font-normal text-muted-foreground">({iqLevel.e})</span></div>
              </div>
              <div className={`rounded-2xl px-4 py-3 text-center ${iqLevel.bg}`}>
                <p className="text-2xl font-extrabold text-primary">{correct}/{total}</p>
                <p className="text-xs text-muted-foreground">ត្រឹមត្រូវ</p>
              </div>
            </div>

            {/* IQ breakdown by category */}
            <div className="mt-6 grid grid-cols-5 gap-2">
              {iqCats.map(c=>{
                const qs = iqQuestions.filter(q=>q.category===c.key);
                const ok = qs.filter(q=>iqAns[q.id]===q.correct).length;
                const pct = qs.length?Math.round((ok/qs.length)*100):0;
                return (
                  <div key={c.key} className="text-center">
                    <div className="text-lg font-extrabold text-primary">{pct}<span className="text-xs">%</span></div>
                    <div className="mt-1 text-[10px] font-bold text-muted-foreground">{c.kh}</div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary rounded-full" style={{width:`${pct}%`}}/></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* EQ */}
          <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary"><Heart className="h-6 w-6 text-accent"/></div>
              <div><p className="font-extrabold text-primary">EQ Score</p><p className="text-xs text-muted-foreground">Emotional Intelligence</p></div>
            </div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="text-6xl font-extrabold text-primary">{eqTotal}<span className="text-2xl text-muted-foreground">%</span></div>
                <div className={`mt-1 font-bold ${eqLevel.c}`}>{eqLevel.l} <span className="text-sm font-normal text-muted-foreground">({eqLevel.e})</span></div>
              </div>
            </div>
            <div className="space-y-3">
              {eqCats.map(c=>(
                <div key={c.key}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="flex items-center gap-1.5 font-semibold text-primary">{c.icon}{c.kh}</span>
                    <span className="font-extrabold">{breakdown[c.key]}%</span>
                  </div>
                  <Bar value={breakdown[c.key]} color={c.color}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Career Recommendations ── */}
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/20"><Star className="h-6 w-6 text-accent"/></div>
            <div>
              <h2 className="text-xl font-extrabold text-primary">Career Paths ដែលសាកសម</h2>
              <p className="text-sm text-muted-foreground">ផ្អែកលើ IQ + EQ Profile ពិសេស</p>
            </div>
          </div>

          {/* Tab selector */}
          <div className="mb-4 flex gap-2 overflow-x-auto rounded-2xl border border-border bg-card p-1.5">
            {recs.map((r,i)=>(
              <button key={r.id} onClick={()=>setActiveRec(i)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${activeRec===i?'bg-primary text-primary-foreground shadow':'text-muted-foreground hover:bg-muted'}`}>
                {r.icon} {r.titleKh}
              </button>
            ))}
          </div>

          {/* Cluster detail */}
          {selected && (
            <div className={`rounded-3xl border p-7 ${selected.bg}`}>
              <div className="flex items-start gap-4 mb-5">
                <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/70 shadow-sm ${selected.color}`}>
                  {selected.icon}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-primary">{selected.titleKh}</h3>
                  <p className="text-xs text-muted-foreground">{selected.titleEn} · ប្រាក់ខែ {selected.salary}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground max-w-xl">{selected.descKh}</p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {/* Roles */}
                <div className="rounded-2xl bg-white/80 p-5">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-primary"><Briefcase className="h-4 w-4"/>តួនាទី</h4>
                  <div className="space-y-1.5">
                    {selected.rolesKh.map((r,i)=>(
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0"/>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="rounded-2xl bg-white/80 p-5">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-primary"><TrendingUp className="h-4 w-4"/>ជំនាញ</h4>
                  <div className="space-y-1.5">
                    {selected.skillsKh.map((s,i)=>(
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Badge label={s} color="bg-white border border-border text-primary" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="rounded-2xl bg-white/80 p-5">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-primary"><GraduationCap className="h-4 w-4"/>Certifications</h4>
                  <div className="space-y-2">
                    {selected.certifications.map((c,i)=>(
                      <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Star className="h-3.5 w-3.5 shrink-0 mt-0.5 text-accent"/>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning path */}
                <div className="rounded-2xl bg-white/80 p-5">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-primary"><BookOpen className="h-4 w-4"/>ផ្លូវវាស់ស្ទង់</h4>
                  <ol className="space-y-2">
                    {selected.learningPathKh.map((s,i)=>(
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/20 text-[10px] font-extrabold text-accent">{i+1}</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* CTA to jobs */}
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/jobs" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90">
                  <Building2 className="h-4 w-4"/>ស្វែងរក {selected.titleKh} ការងារ
                </Link>
                <Link href={`/jobs?category=${encodeURIComponent(selected.roles[0])}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold hover:bg-muted">
                  <ArrowRight className="h-4 w-4"/>មើលការងារ {selected.titleEn}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── Strengths & Gaps ── */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-7">
            <h3 className="mb-5 flex items-center gap-2 font-extrabold text-primary"><Zap className="h-5 w-5 text-accent"/>ចំណុចខ្លាំង</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              {iq>=115&&<div className="flex gap-3 items-start"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5"/><span>IQ ខ្ពស់ — ល្អ ចំពោះការដោះស្រាយ ប្រព័ន្ធ ស្មុគស្មាញ</span></div>}
              {breakdown.empathy>=65&&<div className="flex gap-3 items-start"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5"/><span>ការយល់ចិត្ត ខ្ពស់ — សម្ពន្ធ ការងារ ជាមួយ មនុស្ស</span></div>}
              {breakdown.social>=65&&<div className="flex gap-3 items-start"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5"/><span>ជំនាញ សង្គម ខ្ពស់ — Leadership ឬ Sales</span></div>}
              {breakdown.motivation>=65&&<div className="flex gap-3 items-start"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5"/><span>ការ ជំរុញ ខ្ពស់ — ល្អ ចំពោះ ប្រឌិត ចំណែក ខ្ពស់</span></div>}
              {breakdown['self-regulation']>=65&&<div className="flex gap-3 items-start"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5"/><span>ការ គ្រប់គ្រង ខ្លួន ល្អ — ស្ដូក ស្ដីi Finance ឬ Quality</span></div>}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-7">
            <h3 className="mb-5 flex items-center gap-2 font-extrabold text-primary"><Lightbulb className="h-5 w-5 text-accent"/>អ្វីដែលត្រូវអភិវឌ្ឍ</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              {iq<97&&<div className="flex gap-3 items-start"><ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5"/><span>ហ្វឹកហ្វឺន Logic ដោយ Puzzles, Sudoku, Math Problems</span></div>}
              {breakdown.empathy<55&&<div className="flex gap-3 items-start"><ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5"/><span>ស្ដាប់ ក្នុង Active Listening — ស្ដាប់ ដោយ សំណួរ</span></div>}
              {breakdown.social<55&&<div className="flex gap-3 items-start"><ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5"/><span>ចូលរួម ក្លឹប ឬ Volunteer — អភិវឌ្ឍ ជំនាញ ក្រុម</span></div>}
              {breakdown.motivation<55&&<div className="flex gap-3 items-start"><ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5"/><span>ប្រើ Goal-Setting Framework (SMART Goals)</span></div>}
              {breakdown['self-regulation']<55&&<div className="flex gap-3 items-start"><ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5"/><span>ហ្វឹក Mindfulness ឬ Breathing Techniques</span></div>}
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button onClick={onRetake} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-card py-4 text-sm font-bold hover:bg-muted">
            <RotateCcw className="h-4 w-4"/>ធ្វើ​តេស្ត​ម្ដងទៀត
          </button>
          <Link href="/jobs" className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-accent py-4 text-sm font-bold text-accent-foreground hover:opacity-90">
            ស្វែងរក​ការ​ងារ​ <ArrowRight className="h-4 w-4"/>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Need a local Briefcase re-export since it's a different import
function Briefcase({ className }: { className?:string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function TestPage() {
  const [phase, setPhase] = useState<'intro'|'iq'|'transition'|'eq'|'result'>('intro');
  const [iqAns, setIQAns] = useState<Record<number,number>>({});
  const [eqAns, setEQAns] = useState<Record<number,number>>({});

  const reset = () => { setPhase('intro'); setIQAns({}); setEQAns({}); };

  if (phase==='intro') return <Intro onStart={()=>setPhase('iq')}/>;
  if (phase==='iq') return <IQScreen answers={iqAns} setAnswers={setIQAns} onDone={()=>setPhase('transition')} onExit={reset}/>;
  if (phase==='transition') return <Transition onStart={()=>setPhase('eq')}/>;
  if (phase==='eq') return <EQScreen answers={eqAns} setAnswers={setEQAns} onDone={()=>setPhase('result')} onExit={reset}/>;
  return <Results iqAns={iqAns} eqAns={eqAns} onRetake={reset}/>;
}
