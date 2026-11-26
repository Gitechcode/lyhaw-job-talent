import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { useListJobs, useListCompanies, useListArticles } from '@workspace/api-client-react';
import type { Job, Company, Article } from '@workspace/api-client-react';
import {
  Search, BriefcaseBusiness, Building2, BookOpen,
  MapPin, Clock3, BadgeCheck, ChevronRight, Sparkles,
  Filter, X, Zap, ArrowRight, CalendarDays, CircleDollarSign,
} from 'lucide-react';

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type Tab = 'all' | 'jobs' | 'companies' | 'articles';

const TABS: { id: Tab; labelKh: string; icon: React.ReactNode }[] = [
  { id: 'all',       labelKh: 'ទាំងអស់',     icon: <Sparkles className="h-4 w-4" /> },
  { id: 'jobs',      labelKh: 'ការងារ',       icon: <BriefcaseBusiness className="h-4 w-4" /> },
  { id: 'companies', labelKh: 'ក្រុមហ៊ុន',   icon: <Building2 className="h-4 w-4" /> },
  { id: 'articles',  labelKh: 'អត្ថបទ HR',   icon: <BookOpen className="h-4 w-4" /> },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(v?: string | null) {
  if (!v) return '';
  try { return new Intl.DateTimeFormat('km-KH', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(v)); }
  catch { return v; }
}

function matchQ(q: string, ...fields: (string | undefined | null)[]) {
  if (!q.trim()) return true;
  const lq = q.toLowerCase();
  return fields.some(f => f?.toLowerCase().includes(lq));
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job }: { job: Job }) {
  const companyName = job.company?.name || '';
  const companyLogo = job.company?.logo || '';
  return (
    <Link href={`/jobs/${job.slug}`} className="block h-full">
      <article className="card-hover group relative flex h-full min-h-[22rem] cursor-pointer flex-col overflow-hidden rounded-lg border border-border bg-card p-5 shadow-sm">
        <span className="absolute inset-x-0 top-0 h-1 bg-primary transition-colors group-hover:bg-accent" />
        <div className="flex items-start justify-between gap-4">
          {companyLogo ? (
            <img src={companyLogo} alt={companyName} className="h-12 w-12 shrink-0 rounded-lg border border-border bg-white object-contain p-1" />
          ) : (
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-secondary text-xs font-extrabold text-primary">
              {companyName ? companyName.slice(0, 2).toUpperCase() : 'LY'}
            </div>
          )}
          <div className="flex flex-wrap justify-end gap-1.5">
            {job.urgent && <span className="inline-flex items-center gap-1 border border-accent/35 bg-accent/10 px-2 py-1 text-[10px] font-bold text-primary"><Zap className="h-3 w-3 text-accent" /> បន្ទាន់</span>}
            {job.featured && <span className="inline-flex items-center gap-1 border border-border bg-secondary px-2 py-1 text-[10px] font-bold text-primary"><Sparkles className="h-3 w-3 text-accent" /> បានជ្រើសរើស</span>}
          </div>
        </div>
        <p className="mt-5 text-[11px] font-bold uppercase tracking-[.12em] text-accent">{job.category}</p>
        <h3 className="mt-2 line-clamp-2 text-lg font-extrabold leading-7 text-primary transition-colors group-hover:text-accent">{job.titleKhmer || job.titleEnglish}</h3>
        {job.titleKhmer && job.titleEnglish !== job.titleKhmer && <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{job.titleEnglish}</p>}
        <p className="mt-4 flex items-center gap-2 text-sm font-bold text-primary"><Building2 className="h-4 w-4 shrink-0 text-accent" /> {companyName}</p>
        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-y border-border py-4 text-xs text-muted-foreground">
          <span className="flex min-w-0 items-center gap-1.5"><MapPin className="h-4 w-4 shrink-0 text-accent" /><span className="truncate">{job.location}</span></span>
          <span className="flex min-w-0 items-center gap-1.5"><Clock3 className="h-4 w-4 shrink-0 text-accent" /><span className="truncate">{job.jobType}</span></span>
          {job.salary && <span className="col-span-2 flex items-center gap-1.5 font-bold text-primary"><CircleDollarSign className="h-4 w-4 shrink-0 text-accent" /> {job.salary}</span>}
        </div>
        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="text-[11px] text-muted-foreground">ផុតកំណត់: {fmtDate(job.deadline)}</span>
          <span className="flex items-center gap-1 text-xs font-bold text-primary transition-colors group-hover:text-accent">
            មើលព័ត៌មាន <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    </Link>
  );
}

// ─── Company Card ─────────────────────────────────────────────────────────────
function CompanyCard({ company }: { company: Company }) {
  return (
    <Link href={`/companies/${company.slug}`}>
      <article className="card-hover group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm cursor-pointer">
        <div className="flex items-center gap-3">
          {company.logo
            ? <img src={company.logo} alt={company.name} className="h-14 w-14 shrink-0 rounded-xl object-contain border border-border p-1 bg-white" />
            : <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary/10 text-xl font-extrabold text-primary">{company.name?.[0]}</div>
          }
          <div className="min-w-0">
            <h3 className="font-extrabold text-primary leading-snug line-clamp-1 group-hover:text-accent transition-colors">{company.name}</h3>
            {company.industry && <p className="text-xs text-muted-foreground mt-0.5">{company.industry}</p>}
            {company.verified && (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                <BadgeCheck className="h-3 w-3" /> Verified
              </span>
            )}
          </div>
        </div>
        {company.description && (
          <p className="text-xs leading-5 text-muted-foreground line-clamp-2">{company.description}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {company.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{company.location}</span>}
          </div>
          <span className="text-xs font-bold text-accent group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            មើល <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </article>
    </Link>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <article className="card-hover group flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm cursor-pointer">
        {article.image && (
          <img src={article.image} alt={article.title} className="h-20 w-24 shrink-0 rounded-xl object-cover" />
        )}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          {article.category && (
            <span className="text-[11px] font-bold uppercase tracking-wide text-accent">{article.category}</span>
          )}
          <h3 className="text-sm font-extrabold text-primary leading-snug line-clamp-2 group-hover:text-accent transition-colors">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-5">{article.excerpt}</p>
          )}
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-auto">
            {article.author && <span>{article.author}</span>}
            {article.publishedAt && <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{fmtDate(article.publishedAt)}</span>}
            {article.readTime && <span className="flex items-center gap-1"><Clock3 className="h-3 w-3" />{article.readTime} នាទី</span>}
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Main DiscoverPage ────────────────────────────────────────────────────────
export default function DiscoverPage() {
  const [tab, setTab] = useState<Tab>('jobs');
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleJobs, setVisibleJobs] = useState(12);
  const [smartMatchOpen, setSmartMatchOpen] = useState(false);
  const [matchCategory, setMatchCategory] = useState('');
  const [matchLocation, setMatchLocation] = useState('');
  const [matchArrangement, setMatchArrangement] = useState('');
  const [showMatchResults, setShowMatchResults] = useState(false);

  const { data: jobsData } = useListJobs({ limit: 200, sort: 'newest' });
  const { data: companiesData } = useListCompanies();
  const { data: articlesData } = useListArticles();

  const jobs: Job[] = ((jobsData as any)?.data || (jobsData as any)?.jobs || []) as Job[];
  const companies: Company[] = ((companiesData as any)?.data || (Array.isArray(companiesData) ? companiesData : []) || []) as Company[];
  const articles: Article[] = ((articlesData as any)?.data || (Array.isArray(articlesData) ? articlesData : []) || []) as Article[];

  // Filter
  const filteredJobs = useMemo(() =>
    jobs.filter(j =>
      matchQ(q, j.titleEnglish, j.titleKhmer, j.category, j.company?.name, j.location, j.summary) &&
      (location ? j.location?.toLowerCase().includes(location.toLowerCase()) : true)
    ), [jobs, q, location]);

  const filteredCompanies = useMemo(() =>
    companies.filter(c =>
      matchQ(q, c.name, c.industry, c.description, c.location) &&
      (location ? c.location?.toLowerCase().includes(location.toLowerCase()) : true)
    ), [companies, q, location]);

  const filteredArticles = useMemo(() =>
    articles.filter(a =>
      matchQ(q, a.title, a.category, a.excerpt, a.author)
    ), [articles, q]);

  const totalCount = filteredJobs.length + filteredCompanies.length + filteredArticles.length;

  const locations = useMemo(() => {
    const s = new Set<string>();
    jobs.forEach(j => j.location && s.add(j.location));
    companies.forEach(c => c.location && s.add(c.location));
    return [...s].sort();
  }, [jobs, companies]);
  const categories = useMemo(() => [...new Set(jobs.map(job => job.category).filter(Boolean))].sort(), [jobs]);
  const workArrangements = useMemo(() => [...new Set(jobs.map(job => job.workArrangement).filter(Boolean))].sort(), [jobs]);
  const hasMatchCriteria = Boolean(matchCategory || matchLocation || matchArrangement);
  const recommendedJobs = useMemo(() => jobs.map(job => {
    let score = 42;
    const reasons: string[] = [];
    if (matchCategory && job.category === matchCategory) { score += 30; reasons.push('ត្រូវនឹងវិស័យ'); }
    if (matchLocation && job.location === matchLocation) { score += 18; reasons.push('ទីតាំងត្រូវគ្នា'); }
    if (matchArrangement && job.workArrangement === matchArrangement) { score += 8; reasons.push('របៀបធ្វើការត្រូវគ្នា'); }
    if (job.featured) { score += 4; reasons.push('ក្រុមការងារណែនាំ'); }
    return { job, score: Math.min(score, 98), reasons };
  }).sort((a, b) => b.score - a.score).slice(0, 3), [jobs, matchArrangement, matchCategory, matchLocation]);
  const resetSmartMatch = () => {
    setMatchCategory('');
    setMatchLocation('');
    setMatchArrangement('');
    setShowMatchResults(false);
  };

  return (
    <div className="min-h-dvh bg-[#f5f7f4]">

      {/* ── Hero Search Bar ── */}
      <div className="bg-primary text-primary-foreground">
        <div className="container-wide grid gap-9 py-11 lg:grid-cols-[.85fr_1.15fr] lg:items-end lg:py-14">
          <div className="animate-fade-up">
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-accent"><BriefcaseBusiness className="h-4 w-4" /> ឱកាសការងារនៅកម្ពុជា</p>
            <h1 className="text-3xl font-extrabold leading-[1.4] sm:text-5xl">រកការងារដែលសម<br /><span className="text-accent">នឹងជំនាញរបស់អ្នក។</span></h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-primary-foreground/70">ស្វែងរកតាមតួនាទី ក្រុមហ៊ុន និងទីតាំង ហើយមើលព័ត៌មានសំខាន់ៗមុនពេលដាក់ពាក្យ។</p>
          </div>

          {/* Search input */}
          <div className="animate-fade-up delay-100 w-full">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="តួនាទី ជំនាញ ឬឈ្មោះក្រុមហ៊ុន..."
                  className="w-full rounded-lg border-0 bg-white py-4 pl-12 pr-10 text-sm text-primary shadow-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {q && (
                  <button type="button" title="សម្អាតការស្វែងរក" onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                title="តម្រងទីតាំង"
                aria-label="បើកតម្រងទីតាំង"
                className={`grid h-13 w-13 shrink-0 place-items-center rounded-lg border text-sm font-bold transition-colors ${showFilters ? 'bg-accent text-accent-foreground border-accent' : 'bg-white text-primary border-white hover:bg-secondary'}`}
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>

            {/* Location filter */}
            {showFilters && (
              <div className="animate-fade-up mt-3 flex gap-2">
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="flex-1 rounded-lg border-0 bg-white px-4 py-3 text-sm text-primary shadow focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">គ្រប់ទីតាំង</option>
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                {location && (
                  <button onClick={() => setLocation('')} className="rounded-lg bg-white px-4 py-3 text-xs font-bold text-muted-foreground hover:text-primary">
                    ត្រឡប់
                  </button>
                )}
              </div>
            )}

            {/* Stats strip */}
            <div className="animate-fade-up delay-200 mt-6 grid grid-cols-3 gap-px border border-primary-foreground/15 bg-primary-foreground/15">
              {[
                { n: filteredJobs.length,      l: 'ការងារ' },
                { n: filteredCompanies.length, l: 'ក្រុមហ៊ុន' },
                { n: filteredArticles.length,  l: 'អត្ថបទ HR' },
              ].map(s => (
                <div key={s.l} className="bg-primary p-3 text-left sm:p-4">
                  <div className="text-2xl font-extrabold text-accent">{s.n}</div>
                  <div className="mt-1 text-[11px] text-primary-foreground/60">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="sticky top-[76px] z-30 border-b border-border bg-white/95 shadow-sm backdrop-blur-md lg:top-[112px]">
        <div className="container-wide">
          <div className="flex gap-1 overflow-x-auto py-2 no-scrollbar">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); if (t.id === 'jobs') setVisibleJobs(12); }}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                  tab === t.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-primary'
                }`}
              >
                {t.icon}
                {t.labelKh}
                {t.id !== 'all' && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${tab === t.id ? 'bg-primary-foreground/20' : 'bg-muted text-muted-foreground'}`}>
                    {t.id === 'jobs' ? filteredJobs.length : t.id === 'companies' ? filteredCompanies.length : filteredArticles.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── AI Smart Match ── */}
      <section data-testid="ai-smart-match" className="border-b border-border bg-secondary">
        <div className="container-wide py-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary text-accent"><Sparkles className="h-6 w-6 animate-pulse" /></span>
              <div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-accent">AI Smart Match</p><h2 className="mt-1 text-xl font-extrabold text-primary">ឱ្យ AI ជួយជ្រើសការងារដែលសមនឹងអ្នក</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">ជ្រើសចំណូលចិត្ត 3 ចំណុច ហើយទទួលបានការណែនាំដែលមានហេតុផលច្បាស់លាស់។</p></div>
            </div>
            <button type="button" aria-expanded={smartMatchOpen} onClick={() => setSmartMatchOpen(value => !value)} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground">{smartMatchOpen ? 'បិទ Smart Match' : 'ចាប់ផ្តើម Smart Match'} <ChevronRight className={`h-4 w-4 transition-transform ${smartMatchOpen ? 'rotate-90' : ''}`} /></button>
          </div>

          {smartMatchOpen && <div className="animate-fade-up mt-6 border-t border-border pt-6">
            <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
              <label className="flex min-h-12 flex-col justify-center border border-border bg-card px-4"><span className="text-[10px] font-bold uppercase text-muted-foreground">វិស័យការងារ</span><select value={matchCategory} onChange={event => { setMatchCategory(event.target.value); setShowMatchResults(false); }} className="mt-1 w-full bg-transparent text-sm font-bold text-primary outline-none"><option value="">ជ្រើសគ្រប់វិស័យ</option>{categories.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
              <label className="flex min-h-12 flex-col justify-center border border-border bg-card px-4"><span className="text-[10px] font-bold uppercase text-muted-foreground">ទីតាំងដែលចង់ធ្វើការ</span><select value={matchLocation} onChange={event => { setMatchLocation(event.target.value); setShowMatchResults(false); }} className="mt-1 w-full bg-transparent text-sm font-bold text-primary outline-none"><option value="">ជ្រើសគ្រប់ទីតាំង</option>{locations.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
              <label className="flex min-h-12 flex-col justify-center border border-border bg-card px-4"><span className="text-[10px] font-bold uppercase text-muted-foreground">របៀបធ្វើការ</span><select value={matchArrangement} onChange={event => { setMatchArrangement(event.target.value); setShowMatchResults(false); }} className="mt-1 w-full bg-transparent text-sm font-bold text-primary outline-none"><option value="">គ្រប់របៀបធ្វើការ</option>{workArrangements.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
              <button type="button" disabled={!hasMatchCriteria} onClick={() => setShowMatchResults(true)} className="min-h-12 rounded-lg bg-accent px-5 text-sm font-bold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-45">វិភាគឥឡូវនេះ</button>
            </div>

            {showMatchResults && <div className="mt-7">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-accent">លទ្ធផល AI Recommendation</p><h3 className="mt-1 text-xl font-extrabold text-primary">ការងារ 3 មុខដែលសមនឹងអ្នកបំផុត</h3></div><button type="button" onClick={resetSmartMatch} className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary"><X className="h-4 w-4" /> កំណត់ឡើងវិញ</button></div>
              <div className="grid gap-4 lg:grid-cols-3">{recommendedJobs.map(({ job, score, reasons }, index) => <Link key={job.id} href={`/jobs/${job.slug}`} className="group flex min-h-56 flex-col rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-md"><div className="flex items-start justify-between gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-xs font-extrabold text-accent">{index + 1}</span><div className="text-right"><strong className="text-2xl font-extrabold text-primary">{score}%</strong><p className="text-[10px] font-bold uppercase text-muted-foreground">Match</p></div></div><div className="mt-3 h-1.5 overflow-hidden bg-muted"><div className="h-full bg-accent" style={{ width: `${score}%` }} /></div><p className="mt-5 text-[11px] font-bold uppercase tracking-[.1em] text-accent">{job.category}</p><h4 className="mt-2 line-clamp-2 font-extrabold leading-7 text-primary group-hover:text-accent">{job.titleKhmer || job.titleEnglish}</h4><p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><Building2 className="h-3.5 w-3.5 text-accent" /> {job.company.name}</p><div className="mt-auto flex flex-wrap gap-1.5 pt-5">{reasons.length ? reasons.map(reason => <span key={reason} className="border border-accent/25 bg-accent/10 px-2 py-1 text-[10px] font-bold text-primary">{reason}</span>) : <span className="text-[11px] text-muted-foreground">ការងារថ្មីដែលក្រុមការងារណែនាំ</span>}</div></Link>)}</div>
            </div>}
          </div>}
        </div>
      </section>

      {/* ── Content ── */}
      <div className="container-wide py-8">

        {totalCount === 0 && q && (
          <div className="py-20 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-lg font-bold text-muted-foreground">មិនមាន​លទ្ធផល​សម្រាប់ "<span className="text-primary">{q}</span>"</p>
            <p className="mt-2 text-sm text-muted-foreground">សាកល្បងពាក្យផ្សេង ឬ ជម្រះ Filter</p>
            <button onClick={() => { setQ(''); setLocation(''); }} className="mt-5 rounded-xl border border-border px-5 py-2.5 text-sm font-bold hover:bg-muted">
              ជម្រះការស្វែងរក
            </button>
          </div>
        )}

        {/* ── ALL tab ── */}
        {tab === 'all' && totalCount > 0 && (
          <div className="space-y-10">

            {/* Jobs section */}
            {filteredJobs.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-extrabold text-primary">
                    <BriefcaseBusiness className="h-5 w-5 text-accent" />
                    ការងារ
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-sm text-accent">{filteredJobs.length}</span>
                  </h2>
                  <Link href="/jobs" className="flex items-center gap-1 text-sm font-bold text-accent hover:underline">
                    មើលទាំងអស់ <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredJobs.slice(0, 6).map(j => <JobCard key={j.id} job={j} />)}
                </div>
                {filteredJobs.length > 6 && (
                  <div className="mt-4 text-center">
                    <button onClick={() => setTab('jobs')} className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold hover:bg-muted">
                      មើល​ការ​ងារ​ទាំង {filteredJobs.length}
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Companies section */}
            {filteredCompanies.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-extrabold text-primary">
                    <Building2 className="h-5 w-5 text-accent" />
                    ក្រុមហ៊ុន
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-sm text-accent">{filteredCompanies.length}</span>
                  </h2>
                  <Link href="/companies" className="flex items-center gap-1 text-sm font-bold text-accent hover:underline">
                    មើលទាំងអស់ <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCompanies.slice(0, 6).map(c => <CompanyCard key={c.id} company={c} />)}
                </div>
                {filteredCompanies.length > 6 && (
                  <div className="mt-4 text-center">
                    <button onClick={() => setTab('companies')} className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold hover:bg-muted">
                      មើល​ក្រុម​ហ៊ុន​ទាំង {filteredCompanies.length}
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Articles section */}
            {filteredArticles.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-extrabold text-primary">
                    <BookOpen className="h-5 w-5 text-accent" />
                    អត្ថបទ HR
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-sm text-accent">{filteredArticles.length}</span>
                  </h2>
                  <Link href="/articles" className="flex items-center gap-1 text-sm font-bold text-accent hover:underline">
                    មើលទាំងអស់ <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {filteredArticles.slice(0, 5).map(a => <ArticleCard key={a.id} article={a} />)}
                </div>
                {filteredArticles.length > 5 && (
                  <div className="mt-4 text-center">
                    <button onClick={() => setTab('articles')} className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold hover:bg-muted">
                      មើល​អត្ថបទ​ទាំង {filteredArticles.length}
                    </button>
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* ── JOBS tab ── */}
        {tab === 'jobs' && (
          <div>
            {filteredJobs.length === 0
              ? <EmptyState icon={<BriefcaseBusiness className="h-10 w-10" />} label="មិនមានការងារ" />
              : <><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-accent">បញ្ជីការងារថ្មីៗ</p><h2 className="mt-2 text-2xl font-extrabold text-primary">{filteredJobs.length} តួនាទីកំពុងជ្រើសរើស</h2></div><p className="text-xs text-muted-foreground">កំពុងបង្ហាញ {Math.min(visibleJobs, filteredJobs.length)} តួនាទី</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredJobs.slice(0, visibleJobs).map(j => <JobCard key={j.id} job={j} />)}
                </div>{visibleJobs < filteredJobs.length && <div className="mt-9 flex justify-center"><button type="button" onClick={() => setVisibleJobs((count) => count + 12)} className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground">មើលការងារ 12 បន្ថែម <ChevronRight className="h-4 w-4" /></button></div>}</>
            }
          </div>
        )}

        {/* ── COMPANIES tab ── */}
        {tab === 'companies' && (
          <div>
            {filteredCompanies.length === 0
              ? <EmptyState icon={<Building2 className="h-10 w-10" />} label="មិនមានក្រុមហ៊ុន" />
              : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCompanies.map(c => <CompanyCard key={c.id} company={c} />)}
                </div>
            }
          </div>
        )}

        {/* ── ARTICLES tab ── */}
        {tab === 'articles' && (
          <div>
            {filteredArticles.length === 0
              ? <EmptyState icon={<BookOpen className="h-10 w-10" />} label="មិនមានអត្ថបទ" />
              : <div className="flex flex-col gap-3">
                  {filteredArticles.map(a => <ArticleCard key={a.id} article={a} />)}
                </div>
            }
          </div>
        )}

        {/* Quick links */}
        {!q && tab === 'all' && (
          <div className="mt-12 rounded-3xl border border-border bg-card p-7">
            <h3 className="mb-5 flex items-center gap-2 font-extrabold text-primary">
              <Zap className="h-5 w-5 text-accent" /> ការងារ Featured
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.filter(j => j.featured).slice(0, 3).map(j => <JobCard key={j.id} job={j} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="py-20 text-center text-muted-foreground">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-muted">{icon}</div>
      <p className="font-bold">{label}</p>
    </div>
  );
}
