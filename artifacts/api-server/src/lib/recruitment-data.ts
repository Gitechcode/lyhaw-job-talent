import type {
  Article,
  ArticleDetail,
  Company,
  CompanyDetail,
  DashboardSummary,
  Job,
} from "@workspace/api-zod";

const companies: Company[] = [
  {
    id: "company-001",
    name: "Mekong Retail Group",
    slug: "mekong-retail-group",
    industry: "Retail & Consumer",
    location: "Phnom Penh",
    verified: true,
    logo: "",
    description:
      "A growing Cambodian retail group building everyday experiences for families across the country.",
    website: "https://example.com",
  },
  {
    id: "company-002",
    name: "Sangkat Digital",
    slug: "sangkat-digital",
    industry: "Technology",
    location: "Phnom Penh",
    verified: true,
    logo: "",
    description:
      "A product team creating practical digital tools for Cambodian businesses.",
    website: null,
  },
  {
    id: "company-003",
    name: "Tonle Hospitality",
    slug: "tonle-hospitality",
    industry: "Hospitality",
    location: "Siem Reap",
    verified: true,
    logo: "",
    description:
      "A hospitality team focused on warm service, local culture, and memorable stays.",
    website: null,
  },
];

const media = (type: "cover" | "poster" | "gallery", alt: string) => ({
  type,
  url: "",
  alt,
  caption: null,
});

const jobs: Job[] = [
  {
    id: "job-001",
    reference: "LYH-2601",
    slug: "senior-sales-executive-mekong-retail",
    titleKhmer: "បុគ្គលិកផ្នែកលក់ជាន់ខ្ពស់",
    titleEnglish: "Senior Sales Executive",
    position: "Senior Sales Executive",
    company: companies[0],
    category: "Sales & Marketing",
    location: "Phnom Penh",
    jobType: "Full-time",
    workArrangement: "On-site",
    salary: "$700 - $1,000",
    vacancies: 2,
    experience: "2+ years",
    education: "Bachelor's degree",
    summary:
      "Lead retail partnerships and help a fast-moving Cambodian business grow with confidence.",
    description:
      "We are looking for an energetic sales professional who understands customer relationships, follows through on opportunities, and enjoys working with a collaborative commercial team.",
    responsibilities: [
      "Build and maintain relationships with retail partners.",
      "Prepare weekly sales updates and opportunity plans.",
      "Coordinate with marketing and operations teams.",
    ],
    requirements: [
      "At least 2 years of experience in sales or business development.",
      "Strong communication and presentation skills.",
      "Comfortable using spreadsheets and CRM tools.",
    ],
    skills: ["Sales planning", "Negotiation", "Microsoft Office"],
    benefits: ["Performance bonus", "Annual health check", "Career development"],
    applicationInstructions:
      "Send your CV with the job reference in the email subject.",
    applicationEmail: "careers@lyhawhrsolution.com",
    applicationPhone: "+855 12 555 018",
    telegram: "https://t.me/lyhawhrsolution",
    publishedAt: new Date("2026-09-20T00:00:00Z"),
    deadline: new Date("2026-10-15T00:00:00Z"),
    featured: true,
    urgent: true,
    coverImage: null,
    posterImage: null,
    gallery: [media("cover", "Mekong Retail team at work")],
  },
  {
    id: "job-002",
    reference: "LYH-2602",
    slug: "frontend-developer-sangkat-digital",
    titleKhmer: "អ្នកអភិវឌ្ឍន៍ Frontend",
    titleEnglish: "Frontend Developer",
    position: "Frontend Developer",
    company: companies[1],
    category: "Information Technology",
    location: "Phnom Penh",
    jobType: "Full-time",
    workArrangement: "Hybrid",
    salary: "$900 - $1,400",
    vacancies: 1,
    experience: "2 - 4 years",
    education: "Relevant degree or equivalent experience",
    summary:
      "Build clear, fast product experiences for businesses that are moving online.",
    description:
      "Join a product-minded team where you will turn thoughtful designs into accessible, responsive interfaces used by Cambodian businesses.",
    responsibilities: [
      "Build reusable React and TypeScript components.",
      "Work with product and design to improve user flows.",
      "Review code and support a healthy frontend standard.",
    ],
    requirements: [
      "Professional experience with React and TypeScript.",
      "Working knowledge of responsive CSS and accessibility.",
      "A careful, collaborative approach to problem solving.",
    ],
    skills: ["React", "TypeScript", "CSS", "Git"],
    benefits: ["Hybrid schedule", "Learning budget", "Team retreats"],
    applicationInstructions:
      "Please include links to one or two projects you are proud of.",
    applicationEmail: "jobs@sangkatdigital.com",
    applicationPhone: "+855 10 555 232",
    telegram: "https://t.me/lyhawhrsolution",
    publishedAt: new Date("2026-09-18T00:00:00Z"),
    deadline: new Date("2026-10-22T00:00:00Z"),
    featured: true,
    urgent: false,
    coverImage: null,
    posterImage: null,
    gallery: [media("cover", "Sangkat Digital product team")],
  },
  {
    id: "job-003",
    reference: "LYH-2603",
    slug: "front-office-supervisor-tonle-hospitality",
    titleKhmer: "អ្នកគ្រប់គ្រងផ្នែក Front Office",
    titleEnglish: "Front Office Supervisor",
    position: "Front Office Supervisor",
    company: companies[2],
    category: "Hospitality & Tourism",
    location: "Siem Reap",
    jobType: "Full-time",
    workArrangement: "On-site",
    salary: "$500 - $700",
    vacancies: 1,
    experience: "2+ years",
    education: "Hospitality or related field",
    summary:
      "Make every guest arrival feel welcoming, organized, and distinctly Cambodian.",
    description:
      "This role supports the front office team and helps create calm, memorable guest experiences from check-in through departure.",
    responsibilities: [
      "Guide daily front office operations and shift handovers.",
      "Support guest requests with warmth and good judgment.",
      "Coach team members and maintain service standards.",
    ],
    requirements: [
      "Prior experience in a hotel front office role.",
      "Conversational English; Khmer is required.",
      "A calm and service-focused working style.",
    ],
    skills: ["Guest service", "Team leadership", "Opera PMS"],
    benefits: ["Staff meals", "Uniform provided", "Service charge"],
    applicationInstructions:
      "Send your CV and a short introduction to the recruitment team.",
    applicationEmail: "hr@tonlehospitality.com",
    applicationPhone: "+855 63 555 111",
    telegram: "https://t.me/lyhawhrsolution",
    publishedAt: new Date("2026-09-16T00:00:00Z"),
    deadline: new Date("2026-10-08T00:00:00Z"),
    featured: false,
    urgent: true,
    coverImage: null,
    posterImage: null,
    gallery: [],
  },
  {
    id: "job-004",
    reference: "LYH-2604",
    slug: "hr-admin-officer-phnom-penh",
    titleKhmer: "មន្ត្រីរដ្ឋបាល និងធនធានមនុស្ស",
    titleEnglish: "HR & Admin Officer",
    position: "HR & Admin Officer",
    company: companies[0],
    category: "Human Resources",
    location: "Phnom Penh",
    jobType: "Full-time",
    workArrangement: "On-site",
    salary: "$550 - $800",
    vacancies: 1,
    experience: "1 - 2 years",
    education: "Bachelor's degree",
    summary:
      "Support a people-first team with organized HR administration and thoughtful communication.",
    description:
      "You will support recruitment coordination, staff records, office administration, and the small details that help people do their best work.",
    responsibilities: [
      "Coordinate interview schedules and candidate communication.",
      "Maintain staff documentation and HR records.",
      "Support office administration and internal events.",
    ],
    requirements: [
      "One year of experience in HR or administration.",
      "Good written Khmer and English communication.",
      "Strong organization and confidentiality.",
    ],
    skills: ["HR administration", "Communication", "Organization"],
    benefits: ["Paid leave", "Training opportunities", "Supportive team"],
    applicationInstructions:
      "Use the subject line HR Admin Officer - LYH-2604.",
    applicationEmail: "careers@lyhawhrsolution.com",
    applicationPhone: "+855 12 555 018",
    telegram: "https://t.me/lyhawhrsolution",
    publishedAt: new Date("2026-09-14T00:00:00Z"),
    deadline: new Date("2026-10-05T00:00:00Z"),
    featured: false,
    urgent: false,
    coverImage: null,
    posterImage: null,
    gallery: [],
  },
];

const articles: ArticleDetail[] = [
  {
    id: "article-001",
    slug: "how-to-prepare-for-interview",
    title: "How to prepare for a job interview",
    excerpt:
      "Simple steps to make a strong first impression and speak with confidence.",
    category: "Career advice",
    publishedAt: new Date("2026-09-12T00:00:00Z"),
    readTime: "5 min read",
    image: "",
    body:
      "Good preparation is not about memorizing perfect answers. Read the job description, learn what the company does, and prepare two or three examples that show how you solve problems. Bring thoughtful questions and give yourself time to arrive calmly. Most importantly, be honest about what you know and what you are ready to learn.",
  },
  {
    id: "article-002",
    slug: "spot-a-safe-job-opportunity",
    title: "How to spot a safe job opportunity",
    excerpt:
      "Know what to check before sharing personal information or accepting an offer.",
    category: "Recruitment safety",
    publishedAt: new Date("2026-09-10T00:00:00Z"),
    readTime: "4 min read",
    image: "",
    body:
      "A legitimate opportunity should clearly name the employer, job responsibilities, location, and contact person. Be careful when someone asks for money, your account password, or original identity documents. When in doubt, contact LY Haw HR Solution through the official links on this website before taking the next step.",
  },
  {
    id: "article-003",
    slug: "write-a-clear-cv",
    title: "Write a CV employers can understand quickly",
    excerpt:
      "A clear CV helps your experience speak for itself in the first review.",
    category: "Career advice",
    publishedAt: new Date("2026-09-06T00:00:00Z"),
    readTime: "6 min read",
    image: "",
    body:
      "Start with the experience most relevant to the role. Use short bullet points that describe the result of your work, not only the task. Keep dates and job titles consistent, check your contact details, and make sure the document is easy to read on a phone.",
  },
];

export const recruitmentCompanies = companies;
export const recruitmentJobs = jobs;
export const recruitmentArticles = articles;

export const dashboardSummary: DashboardSummary = {
  totalJobs: 12,
  draftJobs: 3,
  scheduledJobs: 1,
  publishedJobs: jobs.length,
  featuredJobs: jobs.filter((job) => job.featured).length,
  urgentJobs: jobs.filter((job) => job.urgent).length,
  closingSoon: 2,
  closedJobs: 1,
  expiredJobs: 1,
  archivedJobs: 0,
  companies: companies.length,
  categories: 8,
};

export function getCompanyDetail(slug: string): CompanyDetail | undefined {
  const company = companies.find((item) => item.slug === slug);
  if (!company) return undefined;
  return {
    ...company,
    jobs: jobs.filter((job) => job.company.slug === slug),
  };
}

export function getArticleDetail(slug: string): ArticleDetail | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getArticlePreview(article: ArticleDetail): Article {
  const { body: _body, ...preview } = article;
  return preview;
}