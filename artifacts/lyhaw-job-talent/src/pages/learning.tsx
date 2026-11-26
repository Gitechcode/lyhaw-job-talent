import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Brain,
  BookOpen,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Clock3,
  Compass,
  ExternalLink,
  Facebook,
  GraduationCap,
  Lightbulb,
  Rocket,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react';
import { Link } from 'wouter';
import { DiscAssessment } from '@/components/disc-assessment';
import { HrProblemClinic } from '@/components/hr-problem-clinic';
import { PromotionLearningLab } from '@/components/promotion-learning-lab';

type Topic = {
  id: string;
  title: string;
  category: 'អាជីព' | 'ភាពជាអ្នកដឹកនាំ' | 'ជំនាញការងារ' | 'ធនធានមនុស្ស' | 'ចិត្តសាស្ត្រការងារ';
  level: string;
  duration: string;
  summary: string;
  lessons: string[];
  modules?: { title: string; concept: string; example: string; practice: string }[];
  sources?: { title: string; publisher: string; url: string }[];
};

const psychologyTopics: Topic[] = [
  {
    id: 'workplace-psychology', title: 'ចិត្តសាស្ត្រក្នុងកន្លែងការងារ: យល់ខ្លួនឯង និងយល់អ្នកដទៃ', category: 'ចិត្តសាស្ត្រការងារ', level: 'គ្រប់កម្រិត', duration: '45 នាទី', summary: 'ស្គាល់របៀបដែលការយល់ឃើញ អារម្មណ៍ កម្លាំងចិត្ត និងបរិយាកាសក្រុមមានឥទ្ធិពលលើអាកប្បកិរិយា និងលទ្ធផលការងារ។',
    lessons: ['ការយល់ឃើញមិនតែងតែជាការពិត', 'ស្គាល់កត្តាជំរុញទឹកចិត្តរបស់មនុស្ស', 'គ្រប់គ្រងអារម្មណ៍មុនឆ្លើយតប', 'យល់ពីឥទ្ធិពលរបស់ក្រុម និងវប្បធម៌', 'កសាងទំនុកចិត្តតាមអាកប្បកិរិយាប្រចាំថ្ងៃ'],
    modules: [
      { title: 'ការយល់ឃើញ និងភាពលំអៀង', concept: 'មនុស្សពីរនាក់អាចមើលព្រឹត្តិការណ៍តែមួយខុសគ្នា ព្រោះបទពិសោធន៍ ការរំពឹងទុក និងអារម្មណ៍ខុសគ្នា។ មុនសន្និដ្ឋាន ត្រូវស្វែងរកការពិតដែលអាចផ្ទៀងផ្ទាត់បាន។', example: 'អ្នកគ្រប់គ្រងឆ្លើយសារខ្លី។ កុំសន្និដ្ឋានភ្លាមថាគាត់ខឹង អាចដោយសារគាត់កំពុងប្រជុំ ឬប្រញាប់។', practice: 'សរសេរ ៣ ជួរ៖ ការពិតដែលបានកើតឡើង ការបកស្រាយរបស់អ្នក និងព័ត៌មានដែលត្រូវសួរបន្ថែម។' },
      { title: 'កម្លាំងចិត្ត និងតម្រូវការរបស់បុគ្គលិក', concept: 'មនុស្សមិនត្រូវបានជំរុញដោយប្រាក់តែមួយមុខទេ។ ការទទួលស្គាល់ ឱកាសរៀន សិទ្ធិសម្រេចចិត្ត ភាពយុត្តិធម៌ និងអត្ថន័យការងារក៏សំខាន់។', example: 'បុគ្គលិកល្អម្នាក់ស្ងាត់ជាងមុន ព្រោះការងាររបស់គាត់មិនដែលទទួលការទទួលស្គាល់ ទោះ KPI ល្អក៏ដោយ។', practice: 'កំណត់កត្តា ៣ ដែលជំរុញទឹកចិត្តអ្នក និងសន្ទនាជាមួយអ្នកគ្រប់គ្រងអំពីវិធីភ្ជាប់វាទៅការងារ។' },
      { title: 'អារម្មណ៍ ការឆ្លើយតប និង EQ', concept: 'អារម្មណ៍ជាសញ្ញា មិនមែនជាការបញ្ជា។ ស្គាល់អារម្មណ៍ ដកដង្ហើម ផ្អាក ហើយជ្រើសការឆ្លើយតបដែលសមនឹងគោលដៅ។', example: 'ពេលទទួល feedback មិនល្អ អ្នកអាចសុំឧទាហរណ៍ និងពេលគិត មុនឆ្លើយការពារខ្លួន។', practice: 'ប្រើ STOP៖ Stop, Take a breath, Observe, Proceed នៅពេលមានសម្ពាធមួយសប្តាហ៍។' },
      { title: 'ទំនុកចិត្ត និងសុវត្ថិភាពផ្លូវចិត្ត', concept: 'ក្រុមដែលមានសុវត្ថិភាពផ្លូវចិត្តអាចសួរ ទទួលស្គាល់កំហុស និងលើកបញ្ហាដោយមិនខ្លាចការអាម៉ាស់។ វាមិនមែនមានន័យថាគ្មាន accountability ទេ។', example: 'ប្រធានក្រុមនិយាយថា “ប្រាប់ខ្ញុំឱ្យឆាប់ បើមានហានិភ័យ យើងដោះស្រាយបញ្ហា មិនស្វែងរកអ្នកទទួលកំហុសមុនទេ”។', practice: 'ក្នុងប្រជុំបន្ទាប់ សួរ “តើមានហានិភ័យអ្វីដែលយើងមិនទាន់និយាយ?” ហើយស្តាប់ដោយមិនកាត់ទោស។' },
    ],
  },
  {
    id: 'manager-manipulation-awareness', title: 'ស្គាល់ការគ្រប់គ្រងបែបបញ្ឆោត និងការពារខ្លួនដោយវិជ្ជាជីវៈ', category: 'ចិត្តសាស្ត្រការងារ', level: 'មធ្យម', duration: '55 នាទី', summary: 'ស្គាល់សញ្ញា Moving Goalposts, Gaslighting, Fear Pressure, Favoritism, Credit Taking និង Blame Shifting ដើម្បីការពារខ្លួនដោយការពិត និងព្រំដែនច្បាស់។',
    lessons: ['បែងចែកការដឹកនាំតឹងរ៉ឹងចេញពីការបញ្ឆោត', 'ស្គាល់សញ្ញា Moving Goalposts និង Gaslighting', 'ទប់ស្កាត់ Fear, Guilt និង Manufactured Urgency', 'ឆ្លើយតប Favoritism និង Divide-and-Rule', 'ការពារ Credit និងទំនួលខុសត្រូវរបស់ខ្លួន', 'ដឹងពេលណាត្រូវកត់ត្រា រាយការណ៍ ឬស្វែងរកជំនួយ'],
    modules: [
      { title: 'Moving Goalposts: ប្តូរគោលដៅក្រោយអ្នកធ្វើរួច', concept: 'គោលដៅ ឬស្តង់ដារត្រូវបានប្តូរជាបន្តបន្ទាប់ដោយមិនទទួលស្គាល់ការព្រមព្រៀងមុន ធ្វើឱ្យអ្នកមិនដែល “ល្អគ្រប់គ្រាន់”។', example: 'ដំបូងស្នើ report 5 ទំព័រ បន្ទាប់ពីប្រគល់វិញថាអ្នកគួរដឹងថាត្រូវមាន dashboard ផង ទោះមិនបានបញ្ជាក់។', practice: 'បញ្ជាក់ scope, deadline និង success criteria ជាលាយលក្ខណ៍អក្សរ ហើយពេលមានការប្តូរ សរសេរ impact និងសុំអាទិភាពថ្មី។' },
      { title: 'Gaslighting: ធ្វើឱ្យអ្នកសង្ស័យការចងចាំរបស់ខ្លួន', concept: 'បដិសេធពាក្យណែនាំ ឬព្រឹត្តិការណ៍ដែលបានកើតឡើងជាញឹកញាប់ ហើយបង្វែរឱ្យអ្នកគិតថាខ្លួនច្រឡំ ឬមិនមានសមត្ថភាព។', example: 'មេនិយាយ “ខ្ញុំមិនដែលប្រាប់ឱ្យធ្វើបែបនេះទេ” ទោះមានការណែនាំក្នុងការប្រជុំ។', practice: 'ផ្ញើ meeting recap ខ្លី៖ ការសម្រេចចិត្ត អ្នកទទួលខុសត្រូវ និង deadline។ រក្សាឯកសារការងារតាមគោលការណ៍ក្រុមហ៊ុន។' },
      { title: 'Fear, Guilt និង Manufactured Urgency', concept: 'ប្រើការភ័យខ្លាច ការខ្មាសអៀន ឬបន្ទាន់ក្លែងក្លាយ ដើម្បីឱ្យអ្នកយល់ព្រមដោយគ្មានពេលគិត និងមិនសួរអំពីអាទិភាព។', example: '“បើស្រឡាញ់ក្រុមហ៊ុន អ្នកត្រូវធ្វើដល់យប់” ឬ “គ្រប់គ្នាធ្វើបាន មានតែអ្នកទេដែលសួរ”។', practice: 'ឆ្លើយថា “ខ្ញុំអាចបញ្ចប់ A ឬ B នៅថ្ងៃនេះ។ សូមបញ្ជាក់មួយណាជាអាទិភាព និងអ្វីត្រូវផ្លាស់ deadline”។' },
      { title: 'Favoritism និង Divide-and-Rule', concept: 'ផ្តល់ព័ត៌មាន ឱកាស ឬស្តង់ដារខុសគ្នាដោយមិនមានហេតុផលការងារ ហើយធ្វើឱ្យក្រុមប្រកួតប្រជែងគ្នាជំនួសការសហការ។', example: 'មនុស្សម្នាក់ទទួល project ល្អជានិច្ច ខណៈអ្នកផ្សេងមិនដឹងលក្ខខណ្ឌជ្រើសរើស និងត្រូវប្រៀបធៀបជាសាធារណៈ។', practice: 'សួរលក្ខណៈវិនិច្ឆ័យ និង development opportunity ជាផ្លូវការ។ ផ្តោតលើ KPI និងកុំចូលរួមពាក្យចចាមអារ៉ាម។' },
      { title: 'Credit Taking និង Blame Shifting', concept: 'យកសមិទ្ធផលក្រុមជារបស់ខ្លួន ប៉ុន្តែបញ្ជូនកំហុសទៅកូនក្រុម។ ការការពារល្អគឺភាពច្បាស់លាស់ មិនមែនការវាយប្រហារ។', example: 'Presentation របស់អ្នកត្រូវបានបង្ហាញដោយគ្មានឈ្មោះអ្នក ប៉ុន្តែពេល data ខុស អ្នកត្រូវបានចោទតែម្នាក់ឯង។', practice: 'ប្រើ project update ដែលបង្ហាញ owner, contribution, decision និង risk។ ពេលមានកំហុស ទទួលផ្នែករបស់អ្នក ហើយបង្ហាញ root cause និង action plan។' },
      { title: 'ផ្លូវការពារ និងការស្វែងរកជំនួយ', concept: 'បញ្ហាមួយលើកអាចជាការយល់ច្រឡំ។ Pattern ដដែលៗដែលប៉ះពាល់សុខភាព កេរ្តិ៍ឈ្មោះ ឬការងារ ត្រូវការកំណត់ត្រា និងជំនួយតាម policy។', example: 'ការស្តីបន្ទោសជាសាធារណៈ និងប្តូររឿងពិតកើតឡើងរាល់សប្តាហ៍ ទោះអ្នកបានសន្ទនាផ្ទាល់រួច។', practice: 'កត់ថ្ងៃ ព្រឹត្តិការណ៍ ពាក្យដែលបាននិយាយ ភស្តុតាង និងផលប៉ះពាល់។ សុំការណែនាំពី HR, skip-level ឬអ្នកជំនាញសមស្រប ដោយផ្តោតលើការពិត។' },
    ],
  },
  {
    id: 'assertive-boundaries', title: 'ការនិយាយច្បាស់ និងកំណត់ព្រំដែនជាមួយអ្នកគ្រប់គ្រង', category: 'ចិត្តសាស្ត្រការងារ', level: 'មធ្យម', duration: '40 នាទី', summary: 'និយាយដោយគោរព ប៉ុន្តែមិនអនុញ្ញាតឱ្យ scope, deadline និងការគោរពត្រូវបានរំលោភជាបន្តបន្ទាប់។',
    lessons: ['បែងចែក Passive, Aggressive និង Assertive', 'ប្រើពាក្យការពិត–ផលប៉ះពាល់–សំណើ', 'ចរចាអាទិភាព និង deadline', 'កំណត់ព្រំដែនក្រៅម៉ោង', 'ដោះស្រាយការមិនយល់ព្រមដោយស្ងប់ស្ងាត់'],
    modules: [
      { title: 'Assertive មិនមែន Aggressive', concept: 'Assertive គឺនិយាយពីតម្រូវការ ការពិត និងព្រំដែនដោយត្រង់ និងគោរព។ Aggressive គឺបង្ខំ បន្ទោស ឬបន្ថយតម្លៃអ្នកដទៃ។', example: 'ជំនួស “អ្នកតែងតែឱ្យការងារយឺត” ប្រើ “ពេល brief មកក្រោយម៉ោង 4 វាប៉ះ deadline។ ខ្ញុំស្នើឱ្យបញ្ជាក់មុនថ្ងៃត្រង់”។', practice: 'សរសេរប្រយោគមួយតាមរូបមន្ត Situation–Impact–Request សម្រាប់បញ្ហាបច្ចុប្បន្ន។' },
      { title: 'ចរចាអាទិភាព មិននិយាយថា Yes គ្រប់យ៉ាង', concept: 'ការទទួលគ្រប់ការងារដោយមិនបញ្ជាក់ trade-off បង្កើតហានិភ័យ។ បង្ហាញ capacity និងសុំការសម្រេចចិត្តពី owner។', example: '“ខ្ញុំមាន A និង B ដែលត្រូវថ្ងៃសុក្រ។ បើ C ត្រូវមុន សូមជួយជ្រើសអ្វីត្រូវពន្យារ”។', practice: 'បង្កើតបញ្ជី Now, Next, Later ហើយយកទៅ sync ជាមួយអ្នកគ្រប់គ្រង។' },
      { title: 'ព្រំដែនក្រៅម៉ោង និងការងារបន្ទាន់', concept: 'កំណត់ channel និងលក្ខខណ្ឌសម្រាប់ emergency ដោយគោរពតួនាទី។ ព្រំដែនល្អត្រូវមានភាពបត់បែន និងស្មើភាព។', example: 'កំណត់ថាបន្ទាប់ម៉ោង 7 ឆ្លើយតែការហៅសម្រាប់ production incident; សារធម្មតាឆ្លើយព្រឹកបន្ទាប់។', practice: 'សន្ទនាជាមួយក្រុមអំពី response time, emergency definition និង backup person។' },
      { title: 'ពេលព្រំដែនមិនត្រូវបានគោរព', concept: 'រំលឹកការព្រមព្រៀង កត់ pattern និងឡើងកម្រិតជំនួយតាមសមាមាត្រ។ កុំគំរាម ឬប្រើពាក្យចោទប្រកាន់មុនមានការពិត។', example: 'បន្ទាប់ពី reminder ជាច្រើន deadline នៅតែប្តូរដោយគ្មានការព្រមព្រៀង និងប៉ះ performance review។', practice: 'រៀបចំ factual timeline និងសំណើដំណោះស្រាយ ២ ជម្រើសសម្រាប់សន្ទនាជាមួយ manager ឬ HR។' },
    ],
  },
  {
    id: 'ethical-office-strategy', title: 'យុទ្ធសាស្ត្រក្នុងកន្លែងការងារ ដោយមិនលេងល្បិច', category: 'ចិត្តសាស្ត្រការងារ', level: 'មធ្យម', duration: '42 នាទី', summary: 'យល់ពី power, stakeholder និងការសម្រេចចិត្ត ដើម្បីធ្វើការឆ្លាតវៃ រក្សាកេរ្តិ៍ឈ្មោះ និងមិនប្រើការបោកបញ្ឆោត។',
    lessons: ['គូស Stakeholder Map', 'យល់ Formal និង Informal Power', 'បង្កើតទំនុកចិត្តមុនត្រូវការជំនួយ', 'ធ្វើឱ្យការងារមើលឃើញដោយមិនអួត', 'ជ្រើសសមរភូមិ និងនិយាយនៅពេលត្រឹមត្រូវ'],
    modules: [
      { title: 'Stakeholder Map និងផលប្រយោជន៍', concept: 'ស្គាល់អ្នកសម្រេច អ្នកអនុវត្ត អ្នករងផលប៉ះពាល់ និងអ្នកអាចរារាំង។ សួរថាពួកគេត្រូវការអ្វី និងខ្លាចអ្វីដោយមិនសន្និដ្ឋាន។', example: 'Project HRIS ត្រូវការគាំទ្រពី HR, Finance, IT និងអ្នកប្រើប្រាស់ មិនមែនតែ approval របស់ CEO។', practice: 'គូស Influence/Interest matrix សម្រាប់ project មួយ និងកំណត់សារផ្សេងៗសម្រាប់ stakeholder នីមួយៗ។' },
      { title: 'បង្កើត Social Capital ដោយសុចរិត', concept: 'ជួយអ្នកដទៃ ចែករំលែកព័ត៌មានត្រឹមត្រូវ និងធ្វើតាមសន្យា។ Network ល្អកើតពីតម្លៃទៅវិញទៅមក មិនមែនការប្រើមនុស្ស។', example: 'អ្នកផ្ញើ template ដែលជួយផ្នែកផ្សេងសន្សំពេល ហើយពេល project រួម ពួកគេមានទំនុកចិត្តលើអ្នក។', practice: 'ជ្រើស stakeholder ៣ នាក់ ហើយសួរថាតើការងាររបស់អ្នកអាចកាត់បន្ថយបញ្ហារបស់ពួកគេយ៉ាងដូចម្តេច។' },
      { title: 'Visibility ដោយមិនលួច Credit', concept: 'រាយការណ៍លទ្ធផល បញ្ហា និង contribution របស់ក្រុមជាប្រចាំ។ ផ្តល់ឈ្មោះអ្នកចូលរួម និងភ្ជាប់ការងារទៅ business outcome។', example: 'Weekly update បង្ហាញ “ក្រុម A បញ្ចប់... លទ្ធផល... ហានិភ័យ... ជំហានបន្ទាប់...”។', practice: 'សរសេរ executive update 5 បន្ទាត់សម្រាប់ការងារសប្តាហ៍នេះ និងទទួលស្គាល់ contribution របស់មិត្តរួមការងារ។' },
      { title: 'ជ្រើសពេល និងរបៀបនិយាយ', concept: 'មតិត្រឹមត្រូវនៅពេលខុសអាចមិនមានឥទ្ធិពល។ រៀបចំ data សន្ទនាមុនជាមួយអ្នកពាក់ព័ន្ធ និងលើកបញ្ហានៅ forum ដែលអាចសម្រេចចិត្តបាន។', example: 'មុន steering meeting អ្នកពិភាក្សា risk ជាមួយ owner ហើយយក options និង recommendation ចូលប្រជុំ។', practice: 'សម្រាប់សំណើមួយ កំណត់ decision-maker, pre-alignment, data និងពេលស្នើសមស្រប។' },
    ],
  },
  {
    id: 'stress-burnout-resilience', title: 'សម្ពាធការងារ Burnout និងភាពធន់ផ្លូវចិត្ត', category: 'ចិត្តសាស្ត្រការងារ', level: 'គ្រប់កម្រិត', duration: '38 នាទី', summary: 'ស្គាល់សញ្ញាសម្ពាធរ៉ាំរ៉ៃ កាត់បន្ថយហានិភ័យ Burnout និងដឹងពេលណាត្រូវសុំជំនួយ។',
    lessons: ['បែងចែកសម្ពាធបណ្តោះអាសន្ន និង Burnout', 'ស្គាល់សញ្ញាផ្លូវកាយ អារម្មណ៍ និងអាកប្បកិរិយា', 'គ្រប់គ្រង workload និង recovery', 'សន្ទនាអំពី capacity ដោយប្រើការពិត', 'ដឹងពេលណាត្រូវស្វែងរកជំនួយវិជ្ជាជីវៈ'],
    modules: [
      { title: 'ស្គាល់សញ្ញាមុនពេលធ្ងន់', concept: 'សញ្ញាអាចមានការអស់កម្លាំង មិនចង់ធ្វើការ ខឹងងាយ គេងមិនលក់ ឬគុណភាពការងារធ្លាក់។ វាមិនមែនជាកំហ្សោយផ្ទាល់ខ្លួនទេ។', example: 'អ្នកដែលធ្លាប់សកម្មចាប់ផ្តើមពន្យារពេល គេចការប្រជុំ និងធ្វើកំហុសញឹកញាប់ជាច្រើនសប្តាហ៍។', practice: 'វាយតម្លៃ Energy, Sleep, Workload និងMood ពី 1–10 រៀងរាល់ថ្ងៃ ២ សប្តាហ៍ ដើម្បីមើល pattern។' },
      { title: 'Recovery និងការគ្រប់គ្រងថាមពល', concept: 'ការសម្រាកតូច ការបិទការងារ ការគេង និងពេលគ្មាន notification ជួយ recovery។ Productivity មិនមែនធ្វើការជាប់រហូតទេ។', example: 'កំណត់ focus block 50 នាទី សម្រាក 10 នាទី និង shutdown ritual ចុងថ្ងៃ។', practice: 'ជ្រើស recovery habit មួយ និងដាក់ក្នុង calendar ជារៀងរាល់ថ្ងៃ ៧ ថ្ងៃ។' },
      { title: 'សន្ទនាអំពី workload', concept: 'និយាយដោយ data៖ ចំនួនការងារ deadline capacity និង risk។ ស្នើ prioritize, resource ឬ scope adjustment។', example: '“មាន 42 ម៉ោងការងារសម្រាប់ 25 ម៉ោងដែលនៅសល់។ ខ្ញុំស្នើពន្យារ B ឬបន្ថែមអ្នកជួយ C”។', practice: 'រៀបចំ capacity table មួយសប្តាហ៍ និងយកទៅសន្ទនាជាមួយអ្នកគ្រប់គ្រង។' },
      { title: 'ពេលណាត្រូវស្វែងរកជំនួយ', concept: 'បើសញ្ញាបន្តយូរ ប៉ះការគេង ជីវិតប្រចាំថ្ងៃ ឬមានអារម្មណ៍មិនមានសុវត្ថិភាព ត្រូវទាក់ទងអ្នកជំនាញសុខភាព ឬសេវាជំនួយសមស្រប។', example: 'ការភ័យស្លន់ស្លោ ឬការគេងមិនលក់បន្តជាច្រើនសប្តាហ៍ មិនគួរដោះស្រាយតែម្នាក់ឯង។', practice: 'កត់បញ្ជីមនុស្ស និងសេវាដែលអាចទាក់ទង៖ មិត្តទុកចិត្ត HR/EAP និងអ្នកជំនាញសុខភាព។' },
    ],
    sources: [{ title: '职业人群心理健康促进指南', publisher: '陕西省卫生健康委员会', url: 'https://sxwjw.shaanxi.gov.cn/sy/tzgg/202504/P020250422666729007528.pdf' }],
  },
  {
    id: 'chinese-workplace-communication', title: 'និយាយឱ្យគេយល់៖ 换位思考 ការស្តាប់ និងការបញ្ជាក់ឡើងវិញ', category: 'ចិត្តសាស្ត្រការងារ', level: 'គ្រប់កម្រិត', duration: '48 នាទី', summary: 'មេរៀនបកសម្រួលពីទស្សនៈចិនអំពីការប្រាស្រ័យទាក់ទង៖ គិតពីមុខអ្នកស្តាប់ រៀបចំសារឱ្យច្បាស់ ស្តាប់ដោយមានប្រតិកម្ម និងបិទការសន្ទនាដោយ action។',
    lessons: ['ប្រើ 换位思考 ដើម្បីមើលតម្រូវការអ្នកស្តាប់', 'និយាយ Background–Point–Action', 'ស្តាប់ដោយសង្ខេប និងសួរបញ្ជាក់', 'បញ្ជាក់ owner, deadline និងស្តង់ដារ', 'ធ្វើ written recap ដើម្បីកាត់បន្ថយការយល់ខុស'],
    modules: [
      { title: '换位思考៖ ដាក់ខ្លួននៅទីតាំងអ្នកស្តាប់', concept: 'មុននិយាយ សួរថា អ្នកស្តាប់ដឹងអ្វីរួច ត្រូវសម្រេចអ្វី និងព្រួយបារម្ភអ្វី។ សារដែលច្បាស់សម្រាប់អ្នក មិនប្រាកដថាច្បាស់សម្រាប់គេទេ។', example: 'ជំនួសការរាយការណ៍លម្អិត ១០ នាទីទៅ Director អ្នកចាប់ផ្តើមពីលទ្ធផល ហានិភ័យ និងសេចក្ដីសម្រេចដែលត្រូវការ។', practice: 'ជ្រើសសារមួយ ហើយសរសេរ ៣ ជួរ៖ អ្នកស្តាប់ តម្រូវការរបស់គេ និង action ដែលអ្នកចង់បាន។' },
      { title: 'និយាយជារចនាសម្ព័ន្ធ Background–Point–Action', concept: 'ប្រាប់បរិបទខ្លី ចំណុចសំខាន់ និងជំហានបន្ទាប់។ កុំឱ្យអ្នកស្តាប់ស្វែងរកគំនិតសំខាន់ក្នុងរឿងវែង។', example: '“Customer A ប្ដូរ scope។ Deadline មានហានិភ័យ ២ ថ្ងៃ។ ខ្ញុំស្នើកាត់ feature B ឬបន្ថែម resource ម្នាក់”។', practice: 'ថតសំឡេង update ៦០ វិនាទី ហើយពិនិត្យថាមានបរិបទ ចំណុចសំខាន់ និងសំណើឬអត់។' },
      { title: 'ស្តាប់ដោយ反应៖ ឆ្លើយបង្ហាញថាបានយល់', concept: 'ការស្តាប់មិនមែនស្ងាត់ប៉ុណ្ណោះទេ។ ត្រូវសង្ខេបអ្វីដែលបានឮ បញ្ជាក់ចំណុចមិនច្បាស់ និងប្រាប់ថាយល់ព្រម ឬមិនយល់ព្រមត្រង់ណា។', example: '“ខ្ញុំយល់ថាអាទិភាពគឺ quality មុន speed ហើយ draft ត្រូវថ្ងៃពុធ។ តើត្រឹមត្រូវទេ?”', practice: 'ក្នុងការប្រជុំបន្ទាប់ សង្ខេបការសម្រេចចុងក្រោយក្នុង ៣ ប្រយោគ មុនបិទការប្រជុំ។' },
      { title: 'បិទ Loop នៃការប្រាស្រ័យទាក់ទង', concept: 'ការប្រាស្រ័យទាក់ទងមិនទាន់ចប់ បើគ្មាន feedback និងការបញ្ជាក់ការយល់ដូចគ្នា។ ការសរសេរ recap ជួយទប់ការចងចាំខុស និងការប្តូរគោលដៅ។', example: 'ក្រោយប្រជុំ ផ្ញើ decision, owner, deadline, risk និង next check-in ក្នុង chat ឬ email។', practice: 'បង្កើត template recap ៥ បន្ទាត់ ហើយប្រើវារយៈពេលមួយសប្តាហ៍។' },
    ],
    sources: [{ title: '三个方法教你提高职场沟通力', publisher: '人力资源和社会保障部', url: 'https://www.huadu.gov.cn/zdlyxxgk/jycy/jycyxx/content/post_10724686.html' }],
  },
  {
    id: 'upward-management-chinese-context', title: '向上沟通៖ រាយការណ៍ និងសហការជាមួយអ្នកគ្រប់គ្រងដោយភាពចាស់ទុំ', category: 'ចិត្តសាស្ត្រការងារ', level: 'មធ្យម', duration: '52 នាទី', summary: 'យល់ពីភាពខុសគ្នានៃតួនាទី អំណាច និងព័ត៌មាន រួចរៀបចំការសន្ទនាជាមួយមេដោយការពិត ជម្រើស និងការគោរព។',
    lessons: ['ស្គាល់គោលដៅ និងសម្ពាធរបស់អ្នកគ្រប់គ្រង', 'កុំសង្ឃឹមថាមេត្រូវយល់ដោយមិនប្រាប់', 'រាយការណ៍មុនកើតវិបត្តិ', 'យក options មិនយកតែបញ្ហា', 'មិនយល់ស្របដោយគោរព និងមាន data'],
    modules: [
      { title: 'បែងចែកតួនាទី មិនបញ្ចូលតម្លៃមនុស្ស', concept: 'មេ និងបុគ្គលិកមានព័ត៌មាន ទំនួលខុសត្រូវ និងហានិភ័យខុសគ្នា។ ការណែនាំដែលអ្នកមិនពេញចិត្តមិនស្មើនឹងការមិនគោរពអ្នកជាមនុស្សទេ តែត្រូវពិនិត្យការពិតជាមុន។', example: 'មេស្នើ update ញឹកញាប់ ព្រោះ client កំពុងតាមដាន មិនមែនចាំបាច់មានន័យថាគាត់មិនទុកចិត្តអ្នកទេ។', practice: 'កត់ “ការពិត–ការបកស្រាយ–សំណួរបញ្ជាក់” សម្រាប់អ្វីមួយដែលអ្នកកំពុងមិនសប្បាយចិត្ត។' },
      { title: '管理预期៖ គ្រប់គ្រងការរំពឹងទុក', concept: 'បញ្ជាក់ outcome, standard, deadline និងរបៀប update តាំងពីដំបូង។ ការរាយការណ៍មុនពេលមានបញ្ហាបង្កើតទំនុកចិត្តជាងការលាក់រហូតដល់ deadline។', example: 'នៅពេលគម្រោងចាប់ផ្តើម អ្នកព្រមព្រៀង weekly update និង threshold ដែលត្រូវ escalate។', practice: 'រៀបចំ one-page expectation agreement សម្រាប់ project បច្ចុប្បន្ន។' },
      { title: 'យកជម្រើសទៅ មិនយកបញ្ហាទៅតែប៉ុណ្ណោះ', concept: 'ពេលឡើងបញ្ហា បង្ហាញ impact, root cause, options និង recommendation។ អ្នកគ្រប់គ្រងនៅតែជាអ្នកសម្រេច ប៉ុន្តែអ្នកបង្ហាញ ownership។', example: '“Budget ខ្វះ 10%។ Option A កាត់ scope, B ពន្យារ ២ សប្តាហ៍។ ខ្ញុំណែនាំ A ព្រោះ customer value នៅសល់”។', practice: 'ប្រើ template Problem–Impact–Options–Recommendation លើបញ្ហាមួយក្នុងសប្តាហ៍នេះ។' },
      { title: 'មិនយល់ស្របដោយគោរព', concept: 'ផ្តោតលើគោលដៅរួម និងហានិភ័យ មិនវាយលើចរិតអ្នកសម្រេច។ បន្ទាប់ពីមានសេចក្ដីសម្រេច ត្រូវ support ឬលើកបញ្ហាតាម policy បើមានហានិភ័យសីលធម៌។', example: '“ខ្ញុំគាំទ្រគោលដៅលក់ ប៉ុន្តែ data បង្ហាញហានិភ័យ refund។ ខ្ញុំស្នើ pilot មុន rollout”។', practice: 'សរសេរប្រយោគ dissent មួយដែលមានគោលដៅរួម data និងសំណើ។' },
    ],
    sources: [{ title: '管理中的沟通艺术及方法', publisher: '人社部就业创业和职业培训平台', url: 'https://jc.mohrss.gov.cn/lesson/221' }],
  },
  {
    id: 'conflict-cooperation-strategy', title: '从冲突到合作៖ បម្លែងជម្លោះទៅជាកិច្ចសហការ', category: 'ចិត្តសាស្ត្រការងារ', level: 'មធ្យម', duration: '56 នាទី', summary: 'មើលជម្លោះជាដំណើរការដែលអាចគ្រប់គ្រងបាន៖ បន្ថយកម្ដៅ បំបែកមនុស្សចេញពីបញ្ហា ស្តាប់ផលប្រយោជន៍ និងបង្កើតកិច្ចព្រមព្រៀងថ្មី។',
    lessons: ['ស្គាល់ Task Conflict និង Relationship Conflict', 'ផ្អាក escalation មុនរកអ្នកខុស', 'ស្តាប់ទស្សនៈទាំងពីរ', 'ស្វែងរកផលប្រយោជន៍រួម', 'កត់ owner និង follow-up ក្រោយព្រមព្រៀង'],
    modules: [
      { title: 'កំណត់ប្រភេទជម្លោះ', concept: 'ជម្លោះលើគោលដៅ ធនធាន វិធីធ្វើការ និងទំនាក់ទំនងត្រូវការដំណោះស្រាយខុសគ្នា។ កុំយកការមិនយល់ស្របលើ task ទៅជាការវាយតម្លៃចរិត។', example: 'Marketing ចង់ launch លឿន ខណៈ Operations ចង់ test បន្ថែម។ នេះជាជម្លោះអាទិភាព មិនមែនមនុស្សម្នាក់ “មិនចង់សហការ” ទេ។', practice: 'សរសេរជម្លោះបច្ចុប្បន្នជាប្រយោគដែលគ្មានពាក្យវាយតម្លៃមនុស្ស។' },
      { title: '降温៖ បន្ថយកម្ដៅមុនដោះស្រាយ', concept: 'ពេលអារម្មណ៍ខ្ពស់ សមត្ថភាពស្តាប់ និងគិតជម្រើសធ្លាក់។ ផ្អាក កំណត់ពេលត្រឡប់មកវិញ និងរក្សាសុវត្ថិភាព។', example: 'ជំនួសការបន្តជជែកក្នុង group chat អ្នកស្នើ call 20 នាទីក្រោយពេលភាគីទាំងពីររៀបចំការពិត។', practice: 'រៀបចំប្រយោគ pause៖ “ខ្ញុំចង់ដោះស្រាយឱ្យល្អ សូមឱ្យយើងត្រឡប់មកនៅម៉ោង...”។' },
      { title: 'ស្តាប់ Position និង Interest', concept: 'Position គឺអ្វីដែលគេចង់បាន; interest គឺហេតុផលនៅពីក្រោយ។ ដំណោះស្រាយថ្មីកើតឡើងពេលយល់ interest របស់គ្នា។', example: '“ត្រូវ launch សុក្រ” អាចមកពី campaign contract ខណៈ “ត្រូវពន្យារ” មកពី data privacy risk។', practice: 'សួរ “អ្វីសំខាន់បំផុតសម្រាប់អ្នក?” និង “ហានិភ័យអ្វីដែលអ្នកចង់ការពារ?”។' },
      { title: 'កិច្ចព្រមព្រៀងដែលអាចតាមដាន', concept: 'ការសម្របសម្រួលចប់ដោយ owner, action, deadline និង review date មិនមែនដោយពាក្យ “យល់គ្នាហើយ”។', example: 'ក្រុមព្រម pilot 10% នៅសុក្រ ហើយ Operations review incident data នៅចន្ទ។', practice: 'កត់ agreement ៤ ជួរ និងផ្ញើឱ្យភាគីទាំងអស់បញ្ជាក់។' },
    ],
    sources: [{ title: '成员退出危机：沟通与冲突解决', publisher: '中国人民大学商学院', url: 'https://casecenter.rmbs.ruc.edu.cn/web/case_info.php?ID=790' }],
  },
  {
    id: 'feedback-psychological-safety', title: '反馈闭环 និងសុវត្ថិភាពផ្លូវចិត្តក្នុងក្រុម', category: 'ចិត្តសាស្ត្រការងារ', level: 'អ្នកដឹកនាំក្រុម', duration: '50 នាទី', summary: 'បង្កើតបរិយាកាសដែលមនុស្សហ៊ានសួរ រាយការណ៍ហានិភ័យ និងទទួល feedback ដោយមិនបន្ថយ accountability។',
    lessons: ['Feedback ត្រូវមានការឆ្លើយតបត្រឡប់', 'សួរបញ្ហាមុនបញ្ហាក្លាយជាវិបត្តិ', 'វាយលើអាកប្បកិរិយា មិនវាយលើមនុស្ស', 'អ្នកដឹកនាំទទួលស្គាល់កំហុសជាមុន', 'រក្សាស្តង់ដារ និងសុវត្ថិភាពជាមួយគ្នា'],
    modules: [
      { title: 'Feedback គឺ Loop មិនមែន Speech', concept: 'ការប្រាស្រ័យទាក់ទងពេញលេញត្រូវមានការផ្ញើសារ ការទទួល ការបញ្ជាក់ និងការកែសម្រួល។ អ្នកនិយាយច្រើនមិនធានាថាគេយល់ទេ។', example: 'បន្ទាប់ពីប្រគល់ការងារ មេសួរ “សូមពន្យល់ត្រឡប់ថា outcome និង first step ជាអ្វី?”។', practice: 'បន្ថែម check-back question មួយនៅចុងការប្រគល់ការងារទាំងអស់រយៈពេល ៧ ថ្ងៃ។' },
      { title: 'Leader Goes First', concept: 'បើអ្នកដឹកនាំលាក់កំហុស ក្រុមក៏លាក់ដែរ។ ការទទួលស្គាល់កំហុស និងអរគុណអ្នកលើកហានិភ័យបង្ហាញថាការពិតមានតម្លៃ។', example: 'Manager និយាយ “ការសម្រេចមុនរបស់ខ្ញុំខុស ព្រោះមិនបានសួរ Operations។ យើងនឹងកែ process”។', practice: 'ក្នុង retro បន្ទាប់ ចែករំលែកកំហុសមួយ និងការកែប្រព័ន្ធ មុនសួរក្រុម។' },
      { title: 'Challenge the Work, Respect the Person', concept: 'អាចសួរតឹងរឹងលើ data, quality និងrisk ដោយមិនប្រើការអាម៉ាស់ ការចំអក ឬស្តីបន្ទោសជាសាធារណៈ។', example: 'ជំនួស “អ្នកមិនប្រុងប្រយ័ត្ន” ប្រើ “ចំនួន ៣ ក្នុង report មិនត្រូវគ្នា។ តើ root cause និង check ថ្មីជាអ្វី?”។', practice: 'បម្លែង feedback វាយលើមនុស្ស ៣ ប្រយោគទៅជា behavior–impact–next step។' },
      { title: 'រៀនពី Near Miss', concept: 'បញ្ហាដែលជិតកើតគ្រោះថ្នាក់គឺទិន្នន័យសម្រាប់កែលម្អ។ ក្រុមសុវត្ថិភាពរាយការណ៍វាដោយមិនខ្លាចការសងសឹក ប៉ុន្តែនៅតែមានទំនួលខុសត្រូវ។', example: 'Invoice ខុសត្រូវបានចាប់មុនផ្ញើ។ ក្រុមពិនិត្យ process មិនសួរតែ “អ្នកណាធ្វើ?”។', practice: 'ធ្វើ 15-minute near-miss review៖ what happened, why, control ថ្មី និង owner។' },
    ],
    sources: [{ title: '管理心理学：组织沟通与反馈机制', publisher: '深圳职业技术大学', url: 'https://pingshen.szpu.edu.cn/__local/7/A5/82/C7F7AEAE763470A7B92D618FAC1_991D8092_16B5CE9.pdf' }],
  },
  {
    id: 'emotion-regulation-toolkit', title: '情绪调节工具箱៖ គ្រប់គ្រងអារម្មណ៍ដោយវិធីអាចអនុវត្តបាន', category: 'ចិត្តសាស្ត្រការងារ', level: 'គ្រប់កម្រិត', duration: '44 នាទី', summary: 'រៀនស្គាល់សញ្ញាអារម្មណ៍ បំបែកការពិតពីការគិត ស្ដារការគ្រប់គ្រងខ្លួន និងជ្រើស action ដែលមិនធ្វើឱ្យបញ្ហាធំឡើង។',
    lessons: ['ដាក់ឈ្មោះអារម្មណ៍ និងកម្លាំង 0–10', 'ប្រើ Grounding ដើម្បីត្រឡប់មកបច្ចុប្បន្ន', 'បំបែក Thought ចេញពី Fact', 'ប្រើការដកដង្ហើម និងការផ្អាក', 'ស្វែងរកជំនួយពេល self-help មិនគ្រប់គ្រាន់'],
    modules: [
      { title: 'Name It Before You Act', concept: 'អារម្មណ៍ដែលមិនបានស្គាល់ងាយបញ្ជាការឆ្លើយតប។ ដាក់ឈ្មោះថា ខឹង ភ័យ ខ្មាស ឬខកចិត្ត និងវាស់កម្លាំងពី 0–10។', example: 'មុនឆ្លើយ email អ្នកស្គាល់ថា “ខ្ញុំខ្មាស 7/10 និងខឹង 6/10” មិនមែន “គេកំពុងវាយប្រហារខ្ញុំ”។', practice: 'ធ្វើ Emotion Log ៣ ដងក្នុងមួយថ្ងៃ៖ event, emotion, intensity, need។' },
      { title: '着陆技术៖ Grounding ត្រឡប់មកបច្ចុប្បន្ន', concept: 'ពេលគំនិតរត់ទៅការភ័យខ្លាច សូមផ្តោតលើអ្វីដែលមើល ឮ និងប៉ះបាន ដើម្បីស្ដារការគ្រប់គ្រង មុនសម្រេចចិត្ត។', example: 'មុន presentation អ្នកកត់វត្ថុ ៥ ដែលមើលឃើញ សម្លេង ៤ និងអារម្មណ៍រាងកាយ ៣។', practice: 'សាកល្បង 5–4–3–2–1 grounding ម្តងក្នុងស្ថានភាពស្ងប់ ដើម្បីងាយប្រើពេលសម្ពាធ។' },
      { title: 'Thought មិនស្មើ Fact', concept: '“ខ្ញុំនឹងបរាជ័យ” គឺការព្យាករណ៍ មិនមែនការពិត។ ពិនិត្យភស្តុតាងគាំទ្រ ភស្តុតាងផ្ទុយ និងការបកស្រាយដែលមានតុល្យភាព។', example: 'Feedback មួយមិនល្អមិនស្មើនឹង career ចប់។ វាបង្ហាញ skill gap មួយដែលត្រូវមានផែនការ។', practice: 'សរសេរ Thought Record ១ សន្លឹកសម្រាប់គំនិតដែលរំខានជាងគេ។' },
      { title: 'ពេល Self-help មិនគ្រប់គ្រាន់', concept: 'បើអារម្មណ៍បន្តយូរ ប៉ះការគេង ការងារ ទំនាក់ទំនង ឬសុវត្ថិភាព ត្រូវស្វែងរកអ្នកជំនាញ។ ការសុំជំនួយគឺការគ្រប់គ្រងហានិភ័យ មិនមែនភាពទន់ខ្សោយ។', example: 'ការគេងមិនលក់ និងអស់សង្ឃឹមបន្តជាច្រើនសប្តាហ៍ត្រូវការការវាយតម្លៃពីអ្នកជំនាញសុខភាព។', practice: 'រៀបចំបញ្ជី contact សុវត្ថិភាព៖ មនុស្សទុកចិត្ត HR/EAP មណ្ឌលសុខភាព និង emergency support ក្នុងតំបន់។' },
    ],
    sources: [{ title: '如何保护职业人群的心理健康', publisher: '朝阳市卫生健康委员会', url: 'https://wjw.chaoyang.gov.cn/html/CYWSJ/202605/0177803327368134.html' }],
  },
  {
    id: 'adaptation-and-career-uncertainty', title: '适应力៖ សម្របខ្លួនពេលប្ដូរតួនាទី Restructure ឬអនាគតមិនច្បាស់', category: 'ចិត្តសាស្ត្រការងារ', level: 'គ្រប់កម្រិត', duration: '46 នាទី', summary: 'កាត់បន្ថយភាពភ័យខ្លាចដោយបែងចែកអ្វីដែលគ្រប់គ្រងបាន បង្កើតផែនការព័ត៌មាន ជំនាញ និងបណ្តាញគាំទ្រ។',
    lessons: ['បែងចែក Control, Influence និងConcern', 'កុំបំពេញចន្លោះព័ត៌មានដោយពាក្យចចាមអារ៉ាម', 'បង្កើត Plan A/B/C', 'រក្សា routine និងសុខភាពពេលមានការផ្លាស់ប្ដូរ', 'ដឹងសញ្ញាដែលត្រូវសុំជំនួយ'],
    modules: [
      { title: 'Control–Influence–Concern', concept: 'ការព្រួយលើអ្វីដែលគ្រប់គ្រងមិនបានប្រើថាមពលច្រើន។ បែងចែកអ្វីដែលអ្នកអាចធ្វើផ្ទាល់ អាចមានឥទ្ធិពល និងត្រូវតាមដានប៉ុណ្ណោះ។', example: 'អ្នកមិនអាចគ្រប់គ្រង restructure ទាំងមូល ប៉ុន្តែអាច update CV សួរ role clarity និងរៀន skill ថ្មី។', practice: 'គូសរង្វង់ ៣ និងដាក់ការព្រួយទាំងអស់ រួចជ្រើស action ២ ក្នុងរង្វង់ Control។' },
      { title: 'Information Hygiene', concept: 'ពេលព័ត៌មានខ្វះ មនុស្សងាយបង្កើតការសន្និដ្ឋានអាក្រក់។ ប្រើប្រភពផ្លូវការ កត់សំណួរ និងកំណត់ពេល update ជំនួសការតាម rumor រាល់ម៉ោង។', example: 'ក្រុមកំណត់ Q&A ជាមួយ HR រៀងរាល់សុក្រ និងរក្សាបញ្ជីសំណួរដែលមិនទាន់មានចម្លើយ។', practice: 'បិទ rumor channel មួយថ្ងៃ និងសរសេរសំណួរ ៥ សម្រាប់ប្រភពដែលមានអំណាចឆ្លើយ។' },
      { title: 'Plan A/B/C បង្កើតអារម្មណ៍គ្រប់គ្រង', concept: 'ផែនការជំនួសមិនមែន pessimism ទេ។ វាកាត់បន្ថយភាពភ័យដោយបម្លែងអនាគតមិនច្បាស់ទៅជាជំហានដែលអាចធ្វើបាន។', example: 'A បន្ត role បច្ចុប្បន្ន, B ផ្លាស់ទៅ team ផ្សេង, C ស្វែងរកការងារក្រៅក្នុង 90 ថ្ងៃ។', practice: 'សរសេរ trigger, first action និង resource សម្រាប់ Plan A/B/C។' },
      { title: 'សម្របខ្លួនដោយមិនបោះបង់ខ្លួនឯង', concept: 'ភាពបត់បែនមិនមានន័យថាទទួលគ្រប់អ្វី។ រក្សាតម្លៃ សុខភាព និងព្រំដែនសំខាន់ ខណៈរៀនវិធីថ្មី។', example: 'អ្នកទទួល role ថ្មី ប៉ុន្តែស្នើ training និង review workload ជំនួសការទទួលដោយស្ងាត់។', practice: 'កំណត់ non-negotiable ៣ និង flexible area ៣ សម្រាប់ការផ្លាស់ប្ដូរបច្ចុប្បន្ន។' },
    ],
    sources: [{ title: '关爱劳动者心理健康：别让隐形伤害偷走快乐', publisher: '福州市人民政府', url: 'https://www.fuzhou.gov.cn/zgfzzt/ylws/jbfk/202505/t20250514_5018733.htm' }],
  },
  {
    id: 'support-network-and-belonging', title: '社会支持៖ បង្កើតបណ្តាញមនុស្សដែលជួយអ្នករស់រាន និងរីកចម្រើន', category: 'ចិត្តសាស្ត្រការងារ', level: 'គ្រប់កម្រិត', duration: '40 នាទី', summary: 'កុំដោះស្រាយបញ្ហាការងារតែម្នាក់ឯង។ រៀនបង្កើតទំនាក់ទំនងដែលមានការផ្តល់តម្លៃទៅវិញទៅមក មិត្តពិភាក្សា mentor និងផ្លូវសុំជំនួយ។',
    lessons: ['បែងចែក Emotional, Informational និងPractical Support', 'ស្នើជំនួយឱ្យច្បាស់', 'ផ្តល់តម្លៃមុនស្នើអត្ថប្រយោជន៍', 'រក mentor និង peer circle', 'រក្សាការសម្ងាត់ និងព្រំដែន'],
    modules: [
      { title: 'ជំនួយមានច្រើនប្រភេទ', concept: 'ពេលខ្លះអ្នកត្រូវការអ្នកស្តាប់ ពេលខ្លះត្រូវការព័ត៌មាន ឬមនុស្សជួយធ្វើ។ បើមិនបញ្ជាក់ អ្នកអាចទទួលដំបូន្មានពេលចង់បានតែការស្តាប់។', example: '“ថ្ងៃនេះខ្ញុំចង់ឱ្យអ្នកស្តាប់ ១០ នាទី មិនទាន់ត្រូវការដំណោះស្រាយទេ”។', practice: 'សម្រាប់បញ្ហាមួយ កំណត់ថាត្រូវការ emotional, informational ឬ practical support។' },
      { title: 'ស្នើជំនួយដោយមាន Context', concept: 'សំណើល្អប្រាប់បញ្ហា អ្វីដែលបានសាកល្បង ជំនួយជាក់លាក់ និងពេលវេលា។ វាគោរពពេលអ្នកដទៃ និងបង្កើនឱកាសទទួលបានចម្លើយល្អ។', example: '“ខ្ញុំសាក A និង B ហើយ data នៅមិនត្រូវ។ អាច review formula 15 នាទីមុនម៉ោង 3 ទេ?”។', practice: 'សរសេរ help request តាម Context–Tried–Ask–Time។' },
      { title: 'Network មិនមែនការប្រើមនុស្ស', concept: 'ទំនាក់ទំនងរឹងមាំកើតពីភាពទុកចិត្ត ការចែករំលែក និងការធ្វើតាមសន្យា។ កុំទាក់ទងតែពេលត្រូវការអ្វីមួយ។', example: 'អ្នកចែក template ឱ្យ team ផ្សេង និងអរគុណការជួយជាសាធារណៈដោយផ្តល់ credit ត្រឹមត្រូវ។', practice: 'ជ្រើសមនុស្ស ៣ នាក់ ហើយផ្តល់ value តូចមួយដោយមិនស្នើអ្វីត្រឡប់ក្នុងសប្តាហ៍នេះ។' },
      { title: 'Support Map និងផ្លូវបន្ទាន់', concept: 'មានមនុស្សម្នាក់សម្រាប់គ្រប់បញ្ហាមិនគ្រប់ទេ។ បង្កើតផែនទី mentor, peer, manager, HR និងអ្នកជំនាញសុខភាពតាមប្រភេទតម្រូវការ។', example: 'បញ្ហា technical សួរ senior; career សួរ mentor; harassment ប្រើ policy និង HR; សុខភាពសួរអ្នកជំនាញ។', practice: 'គូស Support Map ៥ ប្រភេទ និងបំពេញយ៉ាងហោចណាស់មួយឈ្មោះក្នុងមួយប្រភេទ។' },
    ],
    sources: [{ title: '职业人群心理健康促进指南', publisher: '陕西省卫生健康委员会', url: 'https://sxwjw.shaanxi.gov.cn/sy/tzgg/202504/P020250422666729007528.pdf' }],
  },
];

const topics: Topic[] = [
  ...psychologyTopics,
  { id: 'intern-90-days', title: 'Intern 90-Day Playbook: ចាប់ផ្តើមការងារឱ្យបានល្អ', category: 'អាជីព', level: 'ចាប់ផ្តើម', duration: '25 នាទី', summary: 'ផែនការសម្រាប់អ្នកហាត់ការចាប់ពីថ្ងៃដំបូង ដើម្បីរៀនបានលឿន បង្កើតទំនុកចិត្ត និងត្រៀមក្លាយជា Officer។', lessons: ['ថ្ងៃ ១–៣០៖ ស្គាល់ក្រុមហ៊ុន SOP វប្បធម៌ និងសួរឱ្យច្បាស់មុនធ្វើ', 'ថ្ងៃ ៣១–៦០៖ ទទួលការងារតូចមួយដោយខ្លួនឯង និងរាយការណ៍ទាន់ពេល', 'ថ្ងៃ ៦១–៩០៖ បង្ហាញលទ្ធផលមួយដែលអាចវាស់វែងបាន និងស្នើ feedback', 'មកទាន់ពេល កត់ត្រាការងារ និងរក្សាការសម្ងាត់របស់ក្រុមហ៊ុន', 'កុំរង់ចាំតែការបញ្ជា៖ សង្កេតបញ្ហា ហើយស្នើជំនួយ ឬដំណោះស្រាយ', 'បង្កើត Portfolio តូច៖ ការងារដែលបានធ្វើ លទ្ធផល និងអ្វីដែលបានរៀន'] },
  { id: 'positive-thinking', title: 'Positive Thinking in the Workplace', category: 'ជំនាញការងារ', level: 'គ្រប់កម្រិត', duration: '18 នាទី', summary: 'បង្កើតផ្នត់គំនិតវិជ្ជមានដែលផ្អែកលើការពិត ដើម្បីឆ្លើយតបបញ្ហាដោយស្ងប់ស្ងាត់ ទទួល feedback និងធ្វើការជាមួយក្រុមបានល្អ។', lessons: ['បំបែកការពិតចេញពីការសន្និដ្ឋានអវិជ្ជមានរបស់ខ្លួន', 'ប្តូរពី “ខ្ញុំធ្វើមិនបាន” ទៅ “តើខ្ញុំត្រូវរៀនអ្វីបន្ថែម?”', 'ទទួល feedback ដោយស្តាប់ សួរបញ្ជាក់ និងកំណត់ជំហានកែលម្អ', 'ពេលមានបញ្ហា រាយការណ៍ការពិត ផលប៉ះពាល់ និងជម្រើសដំណោះស្រាយ', 'គោរពមិត្តរួមការងារ មិនបន្ទោស មិនផ្សព្វផ្សាយពាក្យចចាមអារ៉ាម', 'រក្សា Growth Mindset ដោយកត់ត្រាជ័យជម្នះតូចៗ និងមេរៀនប្រចាំសប្តាហ៍'] },
  { id: 'officer-readiness', title: 'ពី Intern ទៅ Officer: ធ្វើការដោយម្ចាស់ការ', category: 'អាជីព', level: 'មូលដ្ឋាន', duration: '22 នាទី', summary: 'រៀនគ្រប់គ្រងភារកិច្ច សម្រេច deadline និងបង្ហាញថាអ្នកអាចទទួលខុសត្រូវការងារប្រចាំថ្ងៃបាន។', lessons: ['យល់ JD, SOP និង KPI របស់តួនាទី', 'រៀបចំ Daily Priority និង Weekly Result', 'រាយការណ៍ស្ថានភាពមុន deadline មិនលាក់បញ្ហា', 'ពិនិត្យគុណភាពការងារមុនប្រគល់', 'កត់ត្រាលទ្ធផល និង feedback ជាភស្តុតាងសម្រាប់ការវាយតម្លៃ'] },
  { id: 'senior-readiness', title: 'ពី Officer ទៅ Senior: បង្កើតជំនាញ និងឥទ្ធិពល', category: 'អាជីព', level: 'មធ្យម', duration: '24 នាទី', summary: 'ផ្លាស់ពីអ្នកអនុវត្តការងារ ទៅអ្នកជំនាញដែលដោះស្រាយបញ្ហា បង្កើនគុណភាព និងជួយអ្នកដទៃ។', lessons: ['ស្គាល់ឫសគល់បញ្ហា និងស្នើដំណោះស្រាយជាមួយទិន្នន័យ', 'កែលម្អ process មួយឱ្យលឿន ឬមានគុណភាពជាងមុន', 'បង្ហាត់ Intern ឬ Officer ថ្មីដោយប្រើ checklist', 'ដឹកនាំ mini-project មួយពីផែនការដល់លទ្ធផល', 'បង្ហាញសមិទ្ធផលជាលេខ និងអ្វីដែលបានរៀន'] },
  { id: 'supervisor-readiness', title: 'ពី Senior ទៅ Supervisor: ដឹកនាំមនុស្សដំបូង', category: 'ភាពជាអ្នកដឹកនាំ', level: 'មធ្យម', duration: '28 នាទី', summary: 'រៀនបែងចែកការងារ ផ្តល់ feedback តាមដាន KPI និងដោះស្រាយជម្លោះក្នុងក្រុមតូច។', lessons: ['កំណត់លទ្ធផល និងស្តង់ដារឱ្យច្បាស់មុនប្រគល់ការងារ', 'ធ្វើ Daily Huddle និង Weekly One-on-One', 'ផ្តល់ feedback លើអាកប្បកិរិយា និងលទ្ធផល មិនវាយតម្លៃលើមនុស្ស', 'តាមដាន KPI ដោយរកបញ្ហា និងជួយក្រុមកែលម្អ', 'អភិវឌ្ឍអ្នកជំនួសតំណែងរបស់ខ្លួន'] },
  { id: 'manager-readiness', title: 'ពី Supervisor ទៅ Manager: គ្រប់គ្រងប្រព័ន្ធ និងលទ្ធផល', category: 'ភាពជាអ្នកដឹកនាំ', level: 'កម្រិតខ្ពស់', duration: '32 នាទី', summary: 'បង្កើតផែនការ ថវិកា KPI និងក្រុមដែលអាចផ្តល់លទ្ធផលដោយមិនពឹងអ្នកគ្រប់គ្រងគ្រប់រឿង។', lessons: ['បម្លែងគោលដៅក្រុមហ៊ុនទៅ Department Plan និង KPI', 'រៀបចំ resource, budget និង risk plan', 'ដឹកនាំអ្នកដឹកនាំក្រុម មិនគ្រប់គ្រងតែបុគ្គល', 'ប្រើ dashboard និង data សម្រាប់សម្រេចចិត្ត', 'គ្រប់គ្រង performance និងបង្កើត Individual Development Plan'] },
  { id: 'executive-readiness', title: 'ពី Manager ទៅ Head / Director: ដឹកនាំអាជីវកម្ម', category: 'ភាពជាអ្នកដឹកនាំ', level: 'ថ្នាក់ដឹកនាំ', duration: '35 នាទី', summary: 'រៀនគិតឆ្លងផ្នែក គ្រប់គ្រងហានិភ័យ និងភ្ជាប់យុទ្ធសាស្ត្រទៅលទ្ធផលអាជីវកម្មរយៈពេលវែង។', lessons: ['យល់ Business Model, customer, revenue, cost និង cash flow', 'បង្កើតយុទ្ធសាស្ត្រ ១–៣ ឆ្នាំ និងកំណត់អាទិភាព', 'ដឹកនាំការផ្លាស់ប្តូរ និងសម្របសម្រួលច្រើននាយកដ្ឋាន', 'រៀបចំ succession plan និង leadership pipeline', 'រាយការណ៍ហានិភ័យ លទ្ធផល និងជម្រើសទៅថ្នាក់ដឹកនាំដោយច្បាស់'] },
  { id: 'promotion-roadmap', title: 'ផែនការឡើងតំណែងក្នុងរយៈពេល ៩០ ថ្ងៃ', category: 'អាជីព', level: 'មធ្យម', duration: '18 នាទី', summary: 'បម្លែងបំណងចង់ឡើងតំណែងទៅជាផែនការដែលមានគោលដៅ ភស្តុតាង និងកាលវិភាគច្បាស់លាស់។', lessons: ['កំណត់តួនាទីគោលដៅ និងគម្លាតជំនាញ', 'បង្កើតលទ្ធផលដែលអាចវាស់វែងបាន', 'រៀបចំការសន្ទនាអំពីអាជីពជាមួយអ្នកគ្រប់គ្រង'] },
  { id: 'performance', title: 'ធ្វើការឱ្យមានលទ្ធផល មិនមែនត្រឹមតែរវល់', category: 'ជំនាញការងារ', level: 'មូលដ្ឋាន', duration: '12 នាទី', summary: 'រៀនជ្រើសរើសអាទិភាព គ្រប់គ្រងពេលវេលា និងរាយការណ៍លទ្ធផលឱ្យអ្នកគ្រប់គ្រងមើលឃើញ។', lessons: ['បែងចែកការងារបន្ទាន់ និងការងារសំខាន់', 'កំណត់លទ្ធផលប្រចាំសប្តាហ៍', 'រាយការណ៍បញ្ហាជាមួយដំណោះស្រាយ'] },
  { id: 'communication', title: 'ទំនាក់ទំនងប្រកបដោយវិជ្ជាជីវៈ', category: 'ជំនាញការងារ', level: 'មូលដ្ឋាន', duration: '15 នាទី', summary: 'និយាយ សរសេរ និងផ្តល់ព័ត៌មានត្រឡប់ឱ្យច្បាស់ ដោយរក្សាការគោរព និងទំនុកចិត្ត។', lessons: ['ប្រើសារខ្លី ច្បាស់ និងមានគោលបំណង', 'ស្តាប់ដើម្បីយល់ មុនឆ្លើយតប', 'ផ្តល់ feedback លើអាកប្បកិរិយា និងលទ្ធផល'] },
  { id: 'leadership-eq', title: 'EQ សម្រាប់អ្នកដឹកនាំក្រុម', category: 'ភាពជាអ្នកដឹកនាំ', level: 'មធ្យម', duration: '20 នាទី', summary: 'យល់ពីអារម្មណ៍ខ្លួនឯង និងក្រុម ដើម្បីដោះស្រាយសម្ពាធ និងបង្កើតបរិយាកាសការងារល្អ។', lessons: ['ស្គាល់សញ្ញាអារម្មណ៍មុនសម្រេចចិត្ត', 'គ្រប់គ្រងជម្លោះដោយមិនបន្ទោស', 'កសាងសុវត្ថិភាពផ្លូវចិត្តក្នុងក្រុម'] },
  { id: 'first-manager', title: 'ពីបុគ្គលិកឆ្នើមទៅអ្នកគ្រប់គ្រងដំបូង', category: 'ភាពជាអ្នកដឹកនាំ', level: 'កម្រិតខ្ពស់', duration: '24 នាទី', summary: 'ផ្លាស់ពីការធ្វើការផ្ទាល់ខ្លួន ទៅការកំណត់ទិសដៅ ប្រគល់ការងារ និងអភិវឌ្ឍសមាជិកក្រុម។', lessons: ['កំណត់ស្តង់ដារលទ្ធផលច្បាស់លាស់', 'ប្រគល់ការងារដោយមានការតាមដាន', 'ធ្វើ one-on-one ដែលជួយមនុស្សរីកចម្រើន'] },
  { id: 'problem-solving', title: 'គិត និងដោះស្រាយបញ្ហាបែបអ្នកគ្រប់គ្រង', category: 'ជំនាញការងារ', level: 'មធ្យម', duration: '17 នាទី', summary: 'រកឫសគល់បញ្ហា ប្រៀបធៀបជម្រើស និងស្នើដំណោះស្រាយដែលអាចអនុវត្តបាន។', lessons: ['បំបែករោគសញ្ញាចេញពីឫសគល់', 'ប្រើទិន្នន័យមុនការសន្និដ្ឋាន', 'បង្ហាញជម្រើស ហានិភ័យ និងអនុសាសន៍'] },
  { id: 'kpi', title: 'យល់ពី KPI និងការវាស់លទ្ធផល', category: 'ធនធានមនុស្ស', level: 'មធ្យម', duration: '16 នាទី', summary: 'កំណត់សូចនាករដែលភ្ជាប់ការងារប្រចាំថ្ងៃទៅគោលដៅក្រុម និងអាជីវកម្ម។', lessons: ['បែងចែក activity និង outcome', 'សរសេរ KPI ដែលអាចវាស់វែងបាន', 'តាមដាន និងកែផែនការជាប្រចាំ'] },
  { id: 'interview', title: 'ត្រៀមសម្ភាសន៍សម្រាប់តំណែងខ្ពស់ជាងមុន', category: 'អាជីព', level: 'មធ្យម', duration: '19 នាទី', summary: 'បង្ហាញភាពជាអ្នកដឹកនាំ លទ្ធផល និងសក្តានុពលរបស់អ្នកតាមរយៈឧទាហរណ៍ពិត។', lessons: ['រៀបចំរឿងរ៉ាវតាម STAR', 'បកស្រាយលទ្ធផលជាលេខ', 'សួរសំណួរដែលបង្ហាញការគិតជាអ្នកដឹកនាំ'] },
  { id: 'cv', title: 'CV ដែលបង្ហាញសមិទ្ធផល និងសក្តានុពល', category: 'អាជីព', level: 'មូលដ្ឋាន', duration: '14 នាទី', summary: 'កែ CV ពីបញ្ជីភារកិច្ចទៅជាឯកសារដែលបង្ហាញតម្លៃ និងលទ្ធផលរបស់អ្នក។', lessons: ['សរសេរសមិទ្ធផលដោយប្រើកិរិយាសព្ទខ្លាំង', 'បន្ថែមលេខ និងបរិបទ', 'សម្រប CV តាមតួនាទីគោលដៅ'] },
  { id: 'talent', title: 'Talent Management សម្រាប់ HR', category: 'ធនធានមនុស្ស', level: 'កម្រិតខ្ពស់', duration: '26 នាទី', summary: 'កំណត់បុគ្គលិកសក្តានុពល បង្កើតផែនការអភិវឌ្ឍ និងរៀបចំអ្នកបន្តតំណែង។', lessons: ['វាយតម្លៃ performance និង potential', 'បង្កើត Individual Development Plan', 'រៀបចំ succession plan សម្រាប់តួនាទីសំខាន់'] },
  { id: 'recruitment', title: 'ការជ្រើសរើសបុគ្គលិកប្រកបដោយគុណភាព', category: 'ធនធានមនុស្ស', level: 'មធ្យម', duration: '22 នាទី', summary: 'ចាប់ពីការសរសេរ JD រហូតដល់ការវាយតម្លៃបេក្ខជនដោយស្មើភាព និងមានទិន្នន័យ។', lessons: ['សរសេរ competency-based JD', 'រៀបចំ structured interview', 'ប្រើ scorecard ដើម្បីកាត់បន្ថយភាពលំអៀង'] },
  { id: 'conflict', title: 'គ្រប់គ្រងជម្លោះក្នុងក្រុម', category: 'ភាពជាអ្នកដឹកនាំ', level: 'កម្រិតខ្ពស់', duration: '21 នាទី', summary: 'ដោះស្រាយការមិនចុះសម្រុងដោយផ្តោតលើបញ្ហា ការពិត និងកិច្ចព្រមព្រៀងបន្ទាប់។', lessons: ['បំបែកមនុស្សចេញពីបញ្ហា', 'ស្វែងរកផលប្រយោជន៍រួម', 'កត់ត្រាកិច្ចព្រមព្រៀង និងតាមដាន'] },
];

const internToLeaderPath = [
  { from: 'Intern', to: 'Officer', topicId: 'officer-readiness', milestone: 'បំពេញផែនការ 90 ថ្ងៃ និងអាចគ្រប់គ្រងការងារប្រចាំថ្ងៃដោយខ្លួនឯង', proof: 'SOP checklist · Weekly result · Manager feedback' },
  { from: 'Officer', to: 'Senior', topicId: 'senior-readiness', milestone: 'ក្លាយជាអ្នកជំនាញ ដោះស្រាយបញ្ហា និងជួយបង្រៀនអ្នកថ្មី', proof: 'Improvement project · Measurable result · Mentoring record' },
  { from: 'Senior', to: 'Supervisor', topicId: 'supervisor-readiness', milestone: 'អាចដឹកនាំក្រុមតូច បែងចែកការងារ និងតាមដាន KPI', proof: 'Team KPI · Feedback log · Successor readiness' },
  { from: 'Supervisor', to: 'Manager', topicId: 'manager-readiness', milestone: 'អាចគ្រប់គ្រងផែនការ ថវិកា ប្រព័ន្ធ និងអភិវឌ្ឍក្រុម', proof: 'Department plan · Budget · Performance dashboard' },
  { from: 'Manager', to: 'Head / Director', topicId: 'executive-readiness', milestone: 'អាចដឹកនាំឆ្លងផ្នែក និងបង្កើតលទ្ធផលអាជីវកម្ម', proof: 'Business case · Strategy execution · Leadership pipeline' },
];

const categories = ['ទាំងអស់', 'អាជីព', 'ភាពជាអ្នកដឹកនាំ', 'ជំនាញការងារ', 'ចិត្តសាស្ត្រការងារ', 'ធនធានមនុស្ស'] as const;
const psychologyCourseIds = psychologyTopics.map((topic) => topic.id);
const videoSources = ['ទាំងអស់', 'LY Haw HR Solution', 'LY Haw'] as const;
type VideoSource = (typeof videoSources)[number];

const videoLessons = [
  {
    title: 'អ្នកដែលមានអំនួតដោយសារអត់ស្គាល់គោលដៅជីវិត',
    source: 'LY Haw HR Solution' as const,
    topic: 'គោលដៅ និងការស្គាល់ខ្លួនឯង',
    takeaway: 'រៀនបែងចែកទំនុកចិត្តចេញពីអំនួត និងកំណត់គោលដៅការងារដែលអាចវាស់វែងបាន។',
    href: 'https://www.facebook.com/reel/1622852772527267/',
  },
  {
    title: 'មនុស្សដែលមានអំនួត តែងតែចង់បានមុខមាត់',
    source: 'LY Haw HR Solution' as const,
    topic: 'អាកប្បកិរិយាក្នុងក្រុម',
    takeaway: 'យល់ពីរបៀបដែលការចង់បានមុខមាត់ប៉ះពាល់ការសហការ និងការទទួល Feedback។',
    href: 'https://www.facebook.com/reel/1113424857711375/',
  },
  {
    title: 'ធ្វើការច្រើនឆ្នាំតែនៅមួយកន្លែង៖ តើអ្នកមានជំងឺទាំង ៨ នេះទេ?',
    source: 'LY Haw HR Solution' as const,
    topic: 'ការរីកចម្រើនក្នុងអាជីព',
    takeaway: 'ពិនិត្យមើលថាតើបទពិសោធន៍កំពុងបង្កើនសមត្ថភាព ឬគ្រាន់តែធ្វើកិច្ចការដដែលៗ។',
    href: 'https://www.facebook.com/reel/1438646408201119/',
  },
  {
    title: 'មេមាន EQ ខ្ពស់ ទើបធ្វើឱ្យកូនចៅធ្វើការដោយរីករាយ',
    source: 'LY Haw HR Solution' as const,
    topic: 'ភាពជាអ្នកដឹកនាំ',
    takeaway: 'ស្គាល់តួនាទីរបស់ EQ ក្នុងការស្តាប់ ការផ្តល់ Feedback និងការបង្កើតទំនុកចិត្ត។',
    href: 'https://www.facebook.com/reel/1746321553116463/',
  },
  {
    title: 'កុំឃើញគេស្ងាត់ គិតថាគេមិនដឹងអី!',
    source: 'LY Haw' as const,
    topic: 'ការយល់អ្នកដទៃ',
    takeaway: 'កុំវាយតម្លៃសមត្ថភាពតាមការនិយាយច្រើនឬតិច ហើយរៀនស្តាប់មនុស្សស្ងាត់ក្នុងក្រុម។',
    href: 'https://www.facebook.com/reel/2878982109133855/',
  },
  {
    title: 'សញ្ញាទាំង ១០ នៃ “បុគ្គលិកបំណុល” ក្នុងក្រុមហ៊ុន',
    source: 'LY Haw' as const,
    topic: 'តម្លៃបុគ្គលិក',
    takeaway: 'ស្វែងយល់អាកប្បកិរិយាដែលបង្កើតបន្ទុកដល់ក្រុម និងផែនការប្តូរខ្លួនទៅជាបុគ្គលិកទ្រព្យ។',
    href: 'https://www.facebook.com/reel/1364827075725473/',
  },
  {
    title: 'រៀនគ្រប់គ្រងអារម្មណ៍ មុនដោះស្រាយបញ្ហា',
    source: 'LY Haw' as const,
    topic: 'Emotional Intelligence',
    takeaway: 'ប្រើការផ្អាក ស្គាល់អារម្មណ៍ និងជ្រើសការឆ្លើយតបដែលសមនឹងគោលដៅការងារ។',
    href: 'https://www.facebook.com/reel/958666493966571/',
  },
  {
    title: 'ហេតុអ្វីកូនចៅកាន់តែពូកែ កាន់តែលែងស្តាប់បង្គាប់អ្នក?',
    source: 'LY Haw' as const,
    topic: 'ការដឹកនាំបុគ្គលិកឆ្នើម',
    takeaway: 'ផ្លាស់ពីការបញ្ជាទៅការកំណត់ទិសដៅ ប្រគល់សិទ្ធិ និងបង្កើតការទទួលខុសត្រូវរួម។',
    href: 'https://www.facebook.com/reel/980770997691219/',
  },
];

const learningTabs = [
  { id: 'path', label: 'ផ្លូវឡើងតំណែង', shortLabel: 'ឡើងតំណែង', description: 'Intern រហូតដល់អ្នកដឹកនាំ', icon: TrendingUp },
  { id: 'psychology', label: 'ចិត្តសាស្ត្រការងារ', shortLabel: 'ចិត្តសាស្ត្រ', description: 'យល់អារម្មណ៍ និងការពារខ្លួន', icon: Brain },
  { id: 'clinic', label: 'ដោះស្រាយបញ្ហា', shortLabel: 'បញ្ហាការងារ', description: 'ស្វែងរក case និងដំណោះស្រាយ', icon: ShieldCheck },
  { id: 'disc', label: 'DISC Staff Test', shortLabel: 'DISC Test', description: 'ស្គាល់ទំនោរ និងចំណុចខ្លាំង', icon: Users },
  { id: 'videos', label: 'វីដេអូមេរៀន', shortLabel: 'វីដេអូ', description: 'មើល គិត និងយកទៅអនុវត្ត', icon: Video },
  { id: 'courses', label: 'មេរៀនទាំងអស់', shortLabel: 'មេរៀន', description: 'ស្វែងរកជំនាញដែលត្រូវរៀន', icon: BookOpen },
] as const;
type LearningTab = (typeof learningTabs)[number]['id'];
const STORAGE_KEY = 'lyhaw.learning-progress';

function readProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export default function LearningPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>('ទាំងអស់');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Topic | null>(null);
  const [completed, setCompleted] = useState<string[]>(readProgress);
  const [activeTab, setActiveTab] = useState<LearningTab>('path');
  const [videoSource, setVideoSource] = useState<VideoSource>('ទាំងអស់');
  const [adminTopics, setAdminTopics] = useState<Topic[]>([]);

  useEffect(() => {
    fetch('/api/lessons').then((response) => response.ok ? response.json() : []).then((items: Array<Record<string, unknown>>) => {
      setAdminTopics(items.map((item) => ({
        id: String(item.id), title: String(item.title),
        category: String(item.category) as Topic['category'], level: String(item.level),
        duration: String(item.duration), summary: String(item.summary),
        lessons: Array.isArray(item.lessons) ? item.lessons.map(String) : [],
      })));
    }).catch(() => setAdminTopics([]));
  }, []);

  const allTopics = useMemo(() => [...topics, ...adminTopics.filter((item) => !topics.some((topic) => topic.id === item.id))], [adminTopics]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return allTopics.filter((topic) => (category === 'ទាំងអស់' || topic.category === category) && (!term || `${topic.title} ${topic.summary} ${topic.category}`.toLowerCase().includes(term)));
  }, [allTopics, category, search]);

  const toggleComplete = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const progress = Math.round((completed.length / allTopics.length) * 100);

  const openLearningTab = (tab: LearningTab) => {
    setActiveTab(tab);
    requestAnimationFrame(() => document.getElementById('learning-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return <main className="min-h-dvh bg-background">
    <section className="overflow-hidden bg-primary text-primary-foreground">
      <div className="container-wide grid gap-10 py-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-20">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-accent"><Sparkles className="h-4 w-4" /> LY HAW LEARNING HUB</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.25] sm:text-6xl">រៀនថ្ងៃនេះ<br /><span className="text-accent">ត្រៀមខ្លួនសម្រាប់តំណែងបន្ទាប់។</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-primary-foreground/72">មេរៀនខ្លីៗជាភាសាខ្មែរ សម្រាប់បុគ្គលិក អ្នកគ្រប់គ្រង និងអ្នកជំនាញ HR ដែលចង់បង្កើនសមត្ថភាព និងបង្កើតលទ្ធផលល្អជាងមុន។</p>
          <div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={() => openLearningTab('courses')} className="inline-flex items-center rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-foreground">ចាប់ផ្តើមរៀន <ArrowRight className="ml-2 h-4 w-4" /></button><Link href="/jobs" className="inline-flex items-center rounded-xl border border-primary-foreground/25 px-5 py-3 text-sm font-bold hover:bg-primary-foreground/10">មើលឱកាសការងារ</Link></div>
        </div>
        <div className="border-l border-primary-foreground/15 pl-7 sm:pl-10">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-primary-foreground/55">Our Promise</p>
          <p className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">Consulting.<br /><span className="text-accent">Training.</span><br />Recruiting.</p>
          <p className="mt-5 max-w-sm text-sm leading-7 text-primary-foreground/65">ប្រឹក្សាឱ្យច្បាស់ · បណ្តុះបណ្តាលឱ្យខ្លាំង · ភ្ជាប់ទៅឱកាសដែលសមស្រប</p>
        </div>
      </div>
    </section>

    <section className="border-b border-border bg-muted">
      <div className="container-wide grid gap-4 py-8 md:grid-cols-3">
        {[
          [Compass, 'Consulting', 'យល់ពីបញ្ហា និងរៀបចំផ្លូវអាជីពឱ្យច្បាស់'],
          [GraduationCap, 'Training', 'អភិវឌ្ឍជំនាញដែលត្រូវការសម្រាប់តំណែងបន្ទាប់'],
          [BriefcaseBusiness, 'Recruiting', 'ភ្ជាប់សមត្ថភាពរបស់អ្នកទៅឱកាសការងារត្រឹមត្រូវ'],
        ].map(([Icon, title, description]) => <div key={title as string} className="flex gap-4 border-l-2 border-accent px-4 py-2"><Icon className="h-6 w-6 shrink-0 text-accent" /><div><h2 className="font-bold text-primary">{title as string}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{description as string}</p></div></div>)}
      </div>
    </section>

    <section id="learning-tabs" className="scroll-mt-4 border-b border-border bg-background">
      <div className="container-wide py-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">ជ្រើសផ្នែកសិក្សា</p><h2 className="mt-1 text-xl font-extrabold text-primary">ចុចមួយផ្នែក ដើម្បីអានដោយមិនចាំបាច់អូសវែង</h2></div>
          <p className="hidden text-sm text-muted-foreground lg:block">ប្ដូរផ្នែកភ្លាមៗ · មិន reload ទំព័រ</p>
        </div>
        <div role="tablist" aria-label="ផ្នែកសិក្សា" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {learningTabs.map(({ id, label, shortLabel, description, icon: Icon }) => {
            const isActive = activeTab === id;
            return <button key={id} type="button" role="tab" aria-selected={isActive} aria-controls={`learning-panel-${id}`} onClick={() => setActiveTab(id)} className={`flex min-h-20 items-center gap-3 border px-4 py-3 text-left transition-colors ${isActive ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-primary hover:border-accent'}`}>
              <span className={`grid h-10 w-10 shrink-0 place-items-center ${isActive ? 'bg-accent text-accent-foreground' : 'bg-secondary text-primary'}`}><Icon className="h-5 w-5" /></span>
              <span className="min-w-0"><strong className="block text-sm leading-6 sm:hidden lg:block">{label}</strong><strong className="hidden text-sm leading-6 sm:block lg:hidden">{shortLabel}</strong><span className={`mt-0.5 hidden text-xs leading-5 lg:block ${isActive ? 'text-primary-foreground/65' : 'text-muted-foreground'}`}>{description}</span></span>
            </button>;
          })}
        </div>
      </div>
    </section>

    {activeTab === 'path' && <div id="learning-panel-path" role="tabpanel" aria-label="ផ្លូវឡើងតំណែង">
    <section className="container-wide section-space">
      <div className="grid gap-8 lg:grid-cols-[1fr_.72fr] lg:items-end">
        <div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-accent"><Rocket className="h-4 w-4" /> Intern to Leader Academy</p><h2 className="mt-4 text-3xl font-extrabold leading-[1.45] text-primary sm:text-4xl">ចាប់ពី Intern ថ្ងៃដំបូង<br /><span className="text-accent">រហូតដល់អ្នកដឹកនាំកម្រិតខ្ពស់</span></h2></div>
        <p className="text-sm leading-7 text-muted-foreground">រៀនម្តងមួយកម្រិត អនុវត្តក្នុងការងារពិត និងរក្សាភស្តុតាងសមិទ្ធផល។ ការឡើងតំណែងមិនពឹងតែរយៈពេលធ្វើការទេ ប៉ុន្តែពឹងលើសមត្ថភាព លទ្ធផល និងភាពត្រៀមខ្លួន។</p>
      </div>

      <div className="mt-9 grid gap-px border border-border bg-border lg:grid-cols-2">
        <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-primary p-7 text-primary-foreground">
          <div className="flex items-center justify-between gap-4"><span className="grid h-12 w-12 place-items-center bg-accent text-accent-foreground"><Lightbulb className="h-6 w-6" /></span><span className="text-xs font-bold uppercase tracking-[.16em] text-accent">Required foundation</span></div>
          <h3 className="mt-6 text-2xl font-extrabold">Positive Thinking in the Workplace</h3>
          <p className="mt-3 text-sm leading-7 text-primary-foreground/65">គិតវិជ្ជមានមិនមែនមានន័យថាមិនមើលបញ្ហាទេ។ វាមានន័យថាមើលការពិត គ្រប់គ្រងអារម្មណ៍ និងស្វែងរកជំហានដែលអាចធ្វើបានបន្ទាប់។</p>
          <ul className="mt-6 space-y-3">{['ទទួល feedback ដោយមិនការពារខ្លួនភ្លាមៗ', 'និយាយពីដំណោះស្រាយ មិនត្រឹមតែបញ្ហា', 'កុំបន្ទោស កុំចចាមអារ៉ាម និងគោរពក្រុម', 'ប្រើ Growth Mindset ពេលជួបការងារថ្មី'].map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-primary-foreground/80"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{item}</li>)}</ul>
          <button type="button" onClick={() => setSelected(topics.find((topic) => topic.id === 'positive-thinking')!)} className="mt-7 inline-flex items-center bg-accent px-5 py-3 text-sm font-bold text-accent-foreground">បើកមេរៀន Positive Thinking <ArrowRight className="ml-2 h-4 w-4" /></button>
        </motion.article>
        <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .08 }} className="bg-secondary p-7">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-accent">First 90 days</p><h3 className="mt-3 text-2xl font-extrabold text-primary">Intern ត្រូវធ្វើអ្វីខ្លះ?</h3>
          <div className="mt-6 space-y-5">{[['ថ្ងៃ ១–៣០', 'រៀន SOP, វប្បធម៌, ឈ្មោះអ្នកពាក់ព័ន្ធ និងកត់ត្រាសំណួរ'], ['ថ្ងៃ ៣១–៦០', 'ធ្វើការងារតូចដោយខ្លួនឯង រាយការណ៍មុន deadline និងស្នើ feedback'], ['ថ្ងៃ ៦១–៩០', 'បង្កើតលទ្ធផលវាស់វែងបានមួយ និងបង្ហាញ Portfolio ទៅអ្នកគ្រប់គ្រង']].map(([period, action]) => <div key={period} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-border pb-5 last:border-0 last:pb-0"><strong className="text-sm text-accent">{period}</strong><p className="text-sm leading-6 text-muted-foreground">{action}</p></div>)}</div>
          <button type="button" onClick={() => setSelected(topics.find((topic) => topic.id === 'intern-90-days')!)} className="mt-7 inline-flex items-center border border-primary px-5 py-3 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground">បើក Intern 90-Day Playbook <ArrowRight className="ml-2 h-4 w-4" /></button>
        </motion.article>
      </div>

      <div className="mt-12"><div className="flex items-center gap-3"><TrendingUp className="h-6 w-6 text-accent" /><div><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">Promotion learning path</p><h3 className="mt-1 text-2xl font-extrabold text-primary">រៀន អនុវត្ត និងបង្ហាញភស្តុតាងនៅគ្រប់កម្រិត</h3></div></div>
        <div className="mt-7 border border-border bg-card">{internToLeaderPath.map((stage, index) => { const topic = topics.find((item) => item.id === stage.topicId)!; return <motion.article key={stage.topicId} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(index * .07, .25) }} className="grid gap-5 border-b border-border p-5 last:border-b-0 md:grid-cols-[4rem_1fr_1fr_auto] md:items-center"><span className="grid h-12 w-12 place-items-center bg-primary text-lg font-extrabold text-accent">{index + 1}</span><div><p className="text-xs font-bold uppercase text-accent">{stage.from} → {stage.to}</p><h4 className="mt-2 font-extrabold text-primary">{topic.title}</h4><p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.milestone}</p></div><div className="border-l-2 border-accent pl-4"><p className="text-xs font-bold uppercase text-muted-foreground">ភស្តុតាងត្រៀមឡើងតំណែង</p><p className="mt-2 text-sm font-semibold leading-6 text-primary">{stage.proof}</p></div><button type="button" onClick={() => setSelected(topic)} className="inline-flex h-11 items-center justify-center bg-primary px-4 text-sm font-bold text-primary-foreground">ចូលរៀន <BookOpen className="ml-2 h-4 w-4 text-accent" /></button></motion.article>; })}</div>
      </div>
    </section>

    <PromotionLearningLab />
    </div>}

    {activeTab === 'psychology' && <div id="learning-panel-psychology" role="tabpanel" aria-label="ចិត្តសាស្ត្រការងារ">
    <section className="bg-muted">
      <div className="container-wide section-space">
        <div className="grid gap-8 lg:grid-cols-[1fr_.72fr] lg:items-end">
          <div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-accent"><Brain className="h-4 w-4" /> Workplace Psychology Academy</p><h2 className="mt-4 text-3xl font-extrabold leading-[1.45] text-primary sm:text-4xl">ចិត្តសាស្ត្រ និងយុទ្ធសាស្ត្រ<br /><span className="text-accent">សម្រាប់រស់រាន និងរីកចម្រើនក្នុងកន្លែងការងារ</span></h2></div>
          <div><p className="text-sm leading-7 text-muted-foreground">មេរៀននេះជួយអ្នកយល់អាកប្បកិរិយា Power Dynamics និងការគ្រប់គ្រងបែបបញ្ឆោត ដើម្បីការពារខ្លួន និងឆ្លើយតបដោយសុចរិត។ មេរៀនថ្មីត្រូវបានបកសម្រួល និងសរសេរឡើងវិញពីប្រភពអប់រំរបស់ចិន។</p><div className="mt-5 flex flex-wrap gap-2"><span className="bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">{psychologyTopics.length} មេរៀន</span><span className="border border-border bg-card px-3 py-2 text-xs font-bold text-primary">{psychologyTopics.reduce((total, topic) => total + (topic.modules?.length || 0), 0)} ករណី និងលំហាត់</span><span className="border border-accent bg-card px-3 py-2 text-xs font-bold text-primary">ប្រភពចិនដែលអាចពិនិត្យបាន</span></div></div>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {psychologyCourseIds.map((id, index) => { const topic = topics.find((item) => item.id === id)!; const Icon = index === 1 ? ShieldCheck : index === 2 ? Scale : Brain; const isFeatured = index === 1; return <motion.article key={id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: Math.min(index * .04, .2) }} className={`flex min-h-80 flex-col border p-6 ${isFeatured ? 'border-accent bg-primary text-primary-foreground' : 'border-border bg-card'}`}><div className="flex items-start justify-between gap-4"><span className={`grid h-11 w-11 place-items-center ${isFeatured ? 'bg-accent text-accent-foreground' : 'bg-secondary text-primary'}`}><Icon className="h-6 w-6" /></span>{topic.sources?.length ? <span className={`text-[11px] font-bold ${isFeatured ? 'text-accent' : 'text-muted-foreground'}`}>ប្រភពចិន</span> : null}</div><p className="mt-6 text-xs font-bold uppercase text-accent">Lesson {String(index + 1).padStart(2, '0')}</p><h3 className={`mt-3 text-lg font-extrabold leading-8 ${isFeatured ? 'text-primary-foreground' : 'text-primary'}`}>{topic.title}</h3><p className={`mt-3 line-clamp-4 text-sm leading-7 ${isFeatured ? 'text-primary-foreground/65' : 'text-muted-foreground'}`}>{topic.summary}</p><div className="mt-auto pt-6"><p className={`mb-4 text-xs font-semibold ${isFeatured ? 'text-primary-foreground/50' : 'text-muted-foreground'}`}>{topic.modules?.length} ផ្នែកលម្អិត · {topic.duration}</p><button type="button" onClick={() => setSelected(topic)} className={`inline-flex w-full items-center justify-center px-4 py-3 text-sm font-bold ${isFeatured ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>បើកមេរៀន <BookOpen className="ml-2 h-4 w-4" /></button></div></motion.article>; })}
        </div>

        <div className="mt-8 grid gap-5 border-l-4 border-accent bg-card p-6 md:grid-cols-[auto_1fr] md:items-start"><ShieldCheck className="h-8 w-8 text-primary" /><div><h3 className="font-extrabold text-primary">ស្គាល់ដើម្បីការពារ មិនមែនរៀនដើម្បីបញ្ឆោត</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">ការដឹកនាំល្អប្រើភាពច្បាស់លាស់ យុត្តិធម៌ ការគោរព និង accountability។ បើអ្នកឃើញ pattern នៃការបង្ខំ បន្ទាបតម្លៃ ឬប្តូរការពិត សូមផ្តោតលើកំណត់ត្រា policy និងបណ្តាញជំនួយដែលមានសុវត្ថិភាព។ ករណីប៉ះពាល់សុខភាព ឬសុវត្ថិភាព គួរស្វែងរកអ្នកជំនាញសមស្រប។</p></div></div>
      </div>
    </section>
    </div>}

    {activeTab === 'clinic' && <div id="learning-panel-clinic" role="tabpanel" aria-label="ដោះស្រាយបញ្ហាការងារ">
    <HrProblemClinic />
    </div>}

    {activeTab === 'disc' && <div id="learning-panel-disc" role="tabpanel" aria-label="DISC Staff Assessment">
    <DiscAssessment />
    </div>}

    {activeTab === 'videos' && <div id="learning-panel-videos" role="tabpanel" aria-label="វីដេអូមេរៀន HR">
      <section className="container-wide section-space">
        <div className="grid gap-7 border-b border-border pb-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
          <div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-accent"><Video className="h-4 w-4" /> HR Video Lessons</p><h2 className="mt-3 text-3xl font-extrabold leading-[1.45] text-primary sm:text-4xl">មើលវីដេអូខ្លី<br /><span className="text-accent">ហើយបម្លែងជាមេរៀនអនុវត្តក្នុងការងារ</span></h2></div>
          <p className="text-sm leading-7 text-muted-foreground">វីដេអូនីមួយៗមានប្រធានបទ និងចំណុចដែលត្រូវយកទៅអនុវត្ត។ ចុចមើលនៅ Facebook ហើយត្រឡប់មកកត់សកម្មភាពមួយដែលអ្នកនឹងធ្វើនៅសប្តាហ៍នេះ។</p>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="ចម្រោះវីដេអូតាមប្រភព">{videoSources.map((source) => <button key={source} type="button" onClick={() => setVideoSource(source)} className={`border px-4 py-2 text-sm font-bold transition-colors ${videoSource === source ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:border-accent hover:text-primary'}`}>{source}</button>)}</div>
          <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Facebook className="h-4 w-4 text-accent" /> ប្រភពវីដេអូផ្លូវការពី Facebook</p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videoLessons.filter((lesson) => videoSource === 'ទាំងអស់' || lesson.source === videoSource).map((lesson, index) => <motion.article key={lesson.href} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(index * .05, .2) }} className="group flex min-h-[23rem] flex-col overflow-hidden border border-border bg-card transition-all hover:-translate-y-1 hover:border-accent hover:shadow-md">
            <div className="relative grid aspect-video place-items-center overflow-hidden bg-primary text-primary-foreground">
              <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(135deg,transparent_46%,hsl(var(--accent))_46%,hsl(var(--accent))_54%,transparent_54%)] [background-size:2rem_2rem]" />
              <span className="relative grid h-14 w-14 place-items-center rounded-full border border-accent bg-accent text-accent-foreground transition-transform group-hover:scale-110"><Video className="h-6 w-6" /></span>
              <span className="absolute left-4 top-4 bg-background px-2.5 py-1 text-[11px] font-bold text-primary">មេរៀន {String(index + 1).padStart(2, '0')}</span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-3"><span className="text-xs font-bold text-accent">{lesson.topic}</span><span className="shrink-0 text-[11px] font-semibold text-muted-foreground">{lesson.source}</span></div>
              <h3 className="mt-3 text-lg font-extrabold leading-8 text-primary">{lesson.title}</h3>
              <div className="mt-4 border-l-2 border-accent pl-3"><p className="text-xs font-bold text-primary">អ្វីត្រូវយកទៅអនុវត្ត</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{lesson.takeaway}</p></div>
              <a href={lesson.href} target="_blank" rel="noreferrer" className="mt-auto flex items-center justify-between border-t border-border pt-4 text-sm font-bold text-primary hover:text-accent">មើលវីដេអូដើម <ExternalLink className="h-4 w-4" /></a>
            </div>
          </motion.article>)}
        </div>

        <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-3">
          {[['១. មើល', 'ស្តាប់គំនិតសំខាន់ ហើយកត់ប្រយោគដែលប៉ះពាល់បញ្ហារបស់អ្នក។'], ['២. គិត', 'ប្រៀបធៀបមេរៀននឹងស្ថានភាពពិត ដោយបំបែកការពិតពីការសន្និដ្ឋាន។'], ['៣. អនុវត្ត', 'ជ្រើសសកម្មភាពតូចមួយ ធ្វើក្នុង ៧ ថ្ងៃ និងកត់លទ្ធផលដែលកើតឡើង។']].map(([title, text]) => <div key={title} className="bg-muted p-5"><h3 className="font-extrabold text-primary">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>)}
        </div>
      </section>
    </div>}

    {activeTab === 'courses' && <div id="learning-panel-courses" role="tabpanel" aria-label="មេរៀនទាំងអស់">
    <section className="container-wide section-space">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-accent">មេរៀនអភិវឌ្ឍអាជីព</p><h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">ជ្រើសរើសជំនាញដែលអ្នកចង់ពង្រឹង</h2></div>
        <div className="min-w-64"><div className="flex justify-between text-xs font-semibold text-muted-foreground"><span>វឌ្ឍនភាពរបស់អ្នក</span><span>{completed.length}/{allTopics.length} មេរៀន</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} /></div></div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-y border-border py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${category === item ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:border-accent hover:text-primary'}`}>{item}</button>)}</div>
        <label className="flex h-11 min-w-64 items-center gap-2 rounded-xl border border-border bg-card px-3"><Search className="h-4 w-4 text-accent" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ស្វែងរកមេរៀន" className="w-full bg-transparent text-sm outline-none" /></label>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((topic, index) => {
          const done = completed.includes(topic.id);
          return <motion.article key={topic.id} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(index * .04, .2) }} className="flex min-h-72 flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-accent/45 hover:shadow-md">
            <div className="flex items-start justify-between gap-3"><span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-primary">{topic.category}</span>{done && <span className="flex items-center gap-1 text-xs font-bold text-primary"><CheckCircle2 className="h-4 w-4" /> បានរៀន</span>}</div>
            <h3 className="mt-5 text-lg font-bold leading-7 text-primary">{topic.title}</h3>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{topic.summary}</p>
            <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-accent" />{topic.duration}</span><span>{topic.level}</span></div>
            <button type="button" onClick={() => setSelected(topic)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90">បើកមេរៀន <BookOpen className="h-4 w-4" /></button>
          </motion.article>;
        })}
      </div>
    </section>
    </div>}

    {activeTab === 'path' && <section className="bg-muted"><div className="container-wide section-space"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><Award className="h-10 w-10 text-accent" /><p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-accent">ផ្លូវទៅកាន់តំណែងបន្ទាប់</p><h2 className="mt-3 text-3xl font-extrabold leading-tight text-primary">ការឡើងតំណែងចាប់ផ្តើមពីការបង្ហាញថា អ្នកត្រៀមខ្លួនរួចហើយ។</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">បំពេញផ្លូវសិក្សា បង្កើតសមិទ្ធផលដែលវាស់វែងបាន ហើយពិភាក្សាគោលដៅអាជីពជាមួយអ្នកគ្រប់គ្រងរបស់អ្នក។</p></div><div className="grid gap-3 sm:grid-cols-2">{['វាយតម្លៃជំនាញបច្ចុប្បន្ន', 'ជ្រើសតួនាទីគោលដៅ', 'អនុវត្តជំនាញតាមមេរៀន', 'កត់ត្រាលទ្ធផល និងស្នើ feedback'].map((step, index) => <div key={step} className="flex items-center gap-4 border-b border-border bg-card p-5"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-sm font-extrabold text-accent-foreground">{index + 1}</span><p className="text-sm font-semibold leading-6 text-primary">{step}</p></div>)}</div></div></div></section>}

    {selected && <div className="fixed inset-0 z-50 grid place-items-center bg-primary/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelected(null)}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-background p-6 shadow-2xl sm:p-8" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4"><div><span className="text-xs font-bold text-accent">{selected.category} · {selected.duration}</span><h2 className="mt-3 text-2xl font-extrabold leading-9 text-primary">{selected.title}</h2></div><button type="button" onClick={() => setSelected(null)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-lg text-muted-foreground" aria-label="បិទ">×</button></div>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">{selected.summary}</p>
        <h3 className="mt-7 flex items-center gap-2 font-bold text-primary"><Target className="h-5 w-5 text-accent" /> អ្វីដែលអ្នកនឹងអនុវត្ត</h3>
        <div className="mt-4 space-y-3">{selected.lessons.map((lesson, index) => <div key={lesson} className="flex gap-3 rounded-xl bg-muted/70 p-4"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{index + 1}</span><p className="text-sm font-medium leading-7 text-primary">{lesson}</p></div>)}</div>
        {selected.modules && <div className="mt-8"><h3 className="flex items-center gap-2 text-lg font-extrabold text-primary"><Brain className="h-5 w-5 text-accent" /> មេរៀនលម្អិត និងករណីអនុវត្ត</h3><div className="mt-4 space-y-5">{selected.modules.map((module, index) => <article key={module.title} className="border border-border bg-card"><div className="flex gap-4 border-b border-border bg-primary p-5 text-primary-foreground"><span className="grid h-9 w-9 shrink-0 place-items-center bg-accent text-sm font-extrabold text-accent-foreground">{index + 1}</span><h4 className="font-extrabold leading-7">{module.title}</h4></div><div className="space-y-5 p-5"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-accent">គោលគំនិត</p><p className="mt-2 text-sm leading-7 text-muted-foreground">{module.concept}</p></div><div className="grid gap-4 sm:grid-cols-2"><div className="bg-secondary p-4"><p className="text-xs font-bold text-primary">ករណីឧទាហរណ៍</p><p className="mt-2 text-sm leading-7 text-muted-foreground">{module.example}</p></div><div className="border-l-4 border-accent bg-muted p-4"><p className="text-xs font-bold text-primary">លំហាត់អនុវត្ត</p><p className="mt-2 text-sm leading-7 text-muted-foreground">{module.practice}</p></div></div></div></article>)}</div></div>}
        {selected.sources?.length ? <div className="mt-7 border border-border bg-card p-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-accent">ប្រភពអានបន្ថែមពីចិន</p><div className="mt-3 space-y-3">{selected.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="flex items-start justify-between gap-4 border-b border-border pb-3 text-sm last:border-0 last:pb-0"><span><strong className="block leading-6 text-primary">{source.title}</strong><span className="text-xs text-muted-foreground">{source.publisher}</span></span><ExternalLink className="mt-1 h-4 w-4 shrink-0 text-accent" /></a>)}</div><p className="mt-4 text-xs leading-6 text-muted-foreground">LY Haw HR Solution បានបកសម្រួល និងរៀបចំឡើងវិញសម្រាប់បរិបទការងារនៅកម្ពុជា មិនមែនចម្លងអត្ថបទដើមទាំងស្រុងទេ។</p></div> : null}
        <div className="mt-7 rounded-xl border-l-4 border-accent bg-muted p-5"><p className="flex items-center gap-2 font-bold text-primary"><Users className="h-4 w-4 text-accent" /> លំហាត់អនុវត្ត</p><p className="mt-2 text-sm leading-7 text-muted-foreground">ជ្រើសរើសចំណុចមួយខាងលើ ហើយអនុវត្តក្នុងការងាររបស់អ្នកសប្តាហ៍នេះ។ កត់ត្រាអ្វីដែលបានធ្វើ លទ្ធផល និងមតិយោបល់ដែលអ្នកទទួលបាន។</p></div>
        <button type="button" onClick={() => toggleComplete(selected.id)} className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold ${completed.includes(selected.id) ? 'border border-primary/30 bg-muted text-primary' : 'bg-accent text-accent-foreground'}`}><Check className="h-4 w-4" />{completed.includes(selected.id) ? 'បានបញ្ចប់មេរៀននេះ' : 'សម្គាល់ថាបានរៀនរួច'}</button>
      </div>
    </div>}
  </main>;
}
