import { type FormEvent, type ReactNode, useMemo, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useGetArticle, useGetCompany, useGetDashboard, useGetJob, useListArticles, useListCompanies, useListJobs, useRequestUploadUrl } from '@workspace/api-client-react';
import type { Article, ArticleDetail, Company, CompanyDetail, DashboardSummary, Job, ListJobsParams } from '@workspace/api-client-react';
import { ArrowRight, BadgeCheck, Brain, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock3, ExternalLink, Facebook, Filter, GraduationCap, Instagram, Mail, MapPin, Menu, Music2, Phone, Quote, Search, Send, Share2, ShieldCheck, Sparkles, TrendingUp, Users, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import AdminPage from '@/pages/admin';
import TestPage from '@/pages/test';
import DiscoverPage from '@/pages/discover';
import LearningPage from '@/pages/learning';
import CareerPage from '@/pages/career';
import { EventAlert } from '@/components/event-alert';
import { curatedHrArticles, hrArticleCategories } from '@/data/hr-articles';
import businessTeamImage from '@assets/generated_images/lyhaw-business-team.jpg';
import techTeamImage from '@assets/generated_images/lyhaw-tech-team.jpg';
import hospitalityImage from '@assets/generated_images/lyhaw-hospitality.jpg';

const queryClient = new QueryClient();

const copy = {
  brand: 'LY Haw HR Solution',
  khBrand: 'Consulting · Training · Recruiting',
  nav: { jobs: 'ការងារ', companies: 'ក្រុមហ៊ុន', articles: 'អត្ថបទ HR', about: 'អំពីយើង', contact: 'ទំនាក់ទំនង' },
  search: 'ស្វែងរកការងារ ឬជំនាញ',
  allLocations: 'គ្រប់ទីតាំង',
  allCategories: 'គ្រប់ប្រភេទការងារ',
};

function formatDate(value?: string | null) {
  if (!value) return 'មិនទាន់កំណត់';
  try { return new Intl.DateTimeFormat('km-KH', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)); } catch { return value; }
}

function MediaPlaceholder({ label = 'LY HAW', className = '' }: { label?: string; className?: string }) {
  return <div data-testid="media-placeholder" className={`media-placeholder relative flex min-h-28 items-center justify-center overflow-hidden text-center ${className}`}>
    <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full border border-primary/10" />
    <div className="absolute -bottom-14 -left-8 h-28 w-28 rounded-full border border-accent/15" />
    <div className="relative z-10 flex flex-col items-center gap-2">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-xs font-extrabold tracking-normal text-primary-foreground shadow-sm">LH</span>
      <span className="text-[10px] font-extrabold uppercase tracking-[.18em] text-primary/55">{label}</span>
    </div>
  </div>;
}

function getMediaImage(alt: string) {
  const normalized = alt.toLowerCase();
  if (/(developer|engineer|technology|software|data|it support|designer|product|qa|devops|analyst|technical)/.test(normalized)) return techTeamImage;
  if (/(hotel|hospitality|guest|chef|restaurant|front office|housekeeping|reservation|concierge|tour|spa|barista)/.test(normalized)) return hospitalityImage;
  return businessTeamImage;
}

function ImgOrPlaceholder({ src, alt, className = '', label }: { src?: string | null; alt: string; className?: string; label?: string }) {
  if (!src?.trim()) return <div className={`relative overflow-hidden ${className}`}><img src={getMediaImage(alt)} alt={alt} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-primary/10 to-transparent" /><span className="absolute bottom-3 left-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.16em] text-primary">{label || 'LY HAW'}</span></div>;
  return <img src={src} alt={alt} className={`object-cover ${className}`} onError={(event) => { event.currentTarget.style.display = 'none'; event.currentTarget.parentElement?.classList.add('media-failed'); }} />;
}

function Logo({ inverse = false }: { inverse?: boolean }) {
  return <Link href="/" data-testid="link-brand" className="group flex min-w-0 items-center gap-3">
    <span className="grid h-12 w-12 shrink-0 place-items-center overflow-visible"><img src="/lyhaw-logo.png" alt="LY Haw HR Solution Logo" className="h-12 w-12 scale-125 object-contain drop-shadow-sm transition-transform duration-300" /></span>
    <span className="leading-tight">
      <strong className={`block whitespace-nowrap text-sm font-extrabold sm:text-[15px] ${inverse ? 'text-primary-foreground' : 'text-primary'}`}>LY Haw HR Solution</strong>
      <small className={`mt-1 block whitespace-nowrap text-[9px] font-semibold uppercase sm:text-[10px] ${inverse ? 'text-primary-foreground/65' : 'text-muted-foreground'}`}>Consulting · Training · Recruiting</small>
    </span>
  </Link>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [location] = useLocation();
  const mainLinks = [[`/career`, 'Career Center'], [`/jobs`, 'ស្វែងរក'], [`/learning`, 'រៀន HR'], [`/companies`, copy.nav.companies]];
  const moreLinks = [[`/articles`, copy.nav.articles], [`/test`, 'តេស្ត IQ & EQ'], [`/about`, copy.nav.about], [`/contact`, copy.nav.contact], [`/safety`, 'សុវត្ថិភាព']];
  const links = [...mainLinks, ...moreLinks];
  const isActive = (href: string) => location === href || (href !== '/' && location.startsWith(`${href}/`));
  return <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 shadow-[0_4px_20px_hsl(var(--primary)/.05)] backdrop-blur-md">
    <div className="hidden bg-primary text-primary-foreground lg:block">
      <div className="container-wide flex h-9 items-center justify-between text-[11px]">
        <p className="font-semibold uppercase tracking-[.14em] text-primary-foreground/70"><span className="text-accent">Consulting</span><span className="mx-2 text-primary-foreground/30">•</span>Training<span className="mx-2 text-primary-foreground/30">•</span>Recruiting</p>
        <div className="flex items-center gap-5 text-primary-foreground/70"><a href="tel:+85599885088" className="flex items-center gap-1.5 hover:text-accent"><Phone className="h-3.5 w-3.5" /> +855 99 885 088</a><a href="mailto:lyhawhrsolution@gmail.com" className="flex items-center gap-1.5 hover:text-accent"><Mail className="h-3.5 w-3.5" /> lyhawhrsolution@gmail.com</a></div>
      </div>
    </div>
    <div className="container-wide flex h-[76px] items-center justify-between gap-6">
      <Logo />
      <nav aria-label="ការរុករកចម្បង" className="hidden items-center gap-1 text-[13px] font-semibold xl:flex">
        {mainLinks.map(([href, label]) => <Link key={href} href={href} data-nav-link data-nav-active={isActive(href) ? 'true' : 'false'} aria-current={isActive(href) ? 'page' : undefined} data-testid={`link-nav-${href.slice(1)}`} className={`rounded-lg px-3 py-2.5 transition-colors ${isActive(href) ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}>{label}</Link>)}
        <div className="relative">
          <button type="button" onClick={() => setMoreOpen((value) => !value)} aria-expanded={moreOpen} className={`flex items-center gap-1 rounded-lg px-3 py-2.5 transition-colors ${moreLinks.some(([href]) => isActive(href)) ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}>ច្រើនទៀត <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} /></button>
          {moreOpen && <div className="absolute right-0 top-[calc(100%+12px)] w-52 overflow-hidden rounded-xl border border-border bg-card p-2 shadow-xl">{moreLinks.map(([href, label]) => <Link key={href} href={href} onClick={() => setMoreOpen(false)} className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm ${isActive(href) ? 'bg-secondary font-bold text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}><span>{label}</span>{isActive(href) && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}</Link>)}</div>}
        </div>
      </nav>
      <div className="hidden items-center gap-2 xl:flex">
        <Link href="/learning" title="មជ្ឈមណ្ឌលរៀន HR" className="grid h-10 w-10 place-items-center rounded-full border border-border text-primary transition-colors hover:border-accent hover:text-accent"><GraduationCap className="h-5 w-5" /></Link>
        <Link href="/jobs" data-testid="link-browse-header" className="inline-flex items-center rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground shadow-sm transition-transform hover:-translate-y-0.5">រកការងារ <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </div>
      <button type="button" aria-label={open ? 'បិទម៉ឺនុយ' : 'បើកម៉ឺនុយ'} aria-expanded={open} data-testid="button-mobile-menu" onClick={() => setOpen(!open)} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-card text-primary shadow-sm xl:hidden">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
    </div>
    {open && <div className="border-t border-border bg-background xl:hidden">
      <div className="container-wide py-5">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.16em] text-accent">Consulting · Training · Recruiting</p>
        <nav aria-label="ម៉ឺនុយទូរស័ព្ទ" className="grid gap-1 sm:grid-cols-2">{links.map(([href, label]) => <Link onClick={() => setOpen(false)} key={href} href={href} data-testid={`link-mobile-${href.slice(1)}`} className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold ${isActive(href) ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}><span>{label}</span>{isActive(href) && <span className="h-2 w-2 rounded-full bg-accent" />}</Link>)}</nav>
        <div className="mt-4 grid grid-cols-2 gap-3"><a href="tel:+85599885088" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-3 text-xs font-bold text-primary"><Phone className="h-4 w-4 text-accent" /> ទាក់ទងយើង</a><Link href="/jobs" onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-3 py-3 text-xs font-bold text-accent-foreground">រកការងារ <ArrowRight className="h-4 w-4" /></Link></div>
      </div>
    </div>}
  </header>;
}

function Footer() {
  const socialLinks = [
    { href: 'https://web.facebook.com/lyhawhrsolution', label: 'Facebook', icon: <Facebook className="h-4 w-4" />, testId: 'link-facebook' },
    { href: 'https://www.tiktok.com/@ly.haw.hr.solution', label: 'TikTok', icon: <Music2 className="h-4 w-4" />, testId: 'link-tiktok' },
    { href: 'https://t.me/lyhawhrsolution', label: 'Telegram', icon: <Send className="h-4 w-4" />, testId: 'link-telegram' },
  ];
  return <footer className="mt-20 border-t border-border bg-primary text-primary-foreground">
    <div className="container-wide grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div><Logo inverse /><p className="mt-5 max-w-xs text-sm leading-7 text-primary-foreground/70">បណ្តាញការងារដែលជួយអ្នកស្វែងរកឱកាសពិតប្រាកដនៅកម្ពុជា ដោយច្បាស់លាស់ និងមានទំនុកចិត្ត។</p><div className="mt-5 flex gap-2">{socialLinks.map((social) => <a key={social.label} href={social.href} aria-label={social.label} target="_blank" rel="noreferrer" data-testid={social.testId} className="rounded-full border border-primary-foreground/20 p-2 hover:bg-primary-foreground/10">{social.icon}</a>)}</div></div>
      <div><h3 className="mb-4 text-sm font-bold text-accent">សម្រាប់អ្នកស្វែងរកការងារ</h3><div className="space-y-3 text-sm text-primary-foreground/70"><Link href="/career" className="block font-bold text-primary-foreground hover:text-accent">My Career Center</Link><Link href="/jobs" data-testid="link-footer-jobs" className="block hover:text-primary-foreground">ស្វែងរកការងារ</Link><Link href="/learning" className="block hover:text-primary-foreground">មជ្ឈមណ្ឌលរៀន HR</Link><Link href="/companies" data-testid="link-footer-companies" className="block hover:text-primary-foreground">ក្រុមហ៊ុនកំពុងជ្រើសរើស</Link><Link href="/safety" data-testid="link-footer-safety" className="block hover:text-primary-foreground">ចំណុចសុវត្ថិភាព</Link></div></div>
      <div><h3 className="mb-4 text-sm font-bold text-accent">ស្វែងយល់បន្ថែម</h3><div className="space-y-3 text-sm text-primary-foreground/70"><Link href="/about" className="block hover:text-primary-foreground">អំពី LY Haw</Link><Link href="/articles" className="block hover:text-primary-foreground">អត្ថបទ HR</Link><Link href="/faq" className="block hover:text-primary-foreground">សំណួរញឹកញាប់</Link><Link href="/admin" className="block hover:text-primary-foreground">Staff Dashboard</Link></div></div>
      <div><h3 className="mb-4 text-sm font-bold text-accent">ទំនាក់ទំនង</h3><div className="space-y-3 text-sm text-primary-foreground/70"><a href="tel:+85599885088" className="flex gap-2 hover:text-primary-foreground"><Phone className="h-4 w-4 shrink-0" /> +855 99 885 088</a><a href="mailto:lyhawhrsolution@gmail.com" className="flex gap-2 hover:text-primary-foreground"><Mail className="h-4 w-4 shrink-0" /> lyhawhrsolution@gmail.com</a><p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0" /> Matching Coffee, BE0, ផ្លូវលេខ 259, រាជធានីភ្នំពេញ</p></div></div>
    </div>
    <div className="border-t border-primary-foreground/10"><div className="container-wide flex flex-col justify-between gap-3 py-5 text-xs text-primary-foreground/55 sm:flex-row"><span>© 2026 LY Haw HR Solution. រក្សាសិទ្ធិគ្រប់យ៉ាង។</span><span><Link href="/privacy" className="mr-4 hover:text-primary-foreground">ឯកជនភាព</Link><Link href="/terms" className="hover:text-primary-foreground">លក្ខខណ្ឌ</Link></span></div></div>
  </footer>;
}

function Shell({ children }: { children: ReactNode }) { return <><Header /><EventAlert />{children}<CVDropzone /><Footer /></>; }

function SectionHeading({ eyebrow, title, href, linkLabel = 'មើលទាំងអស់' }: { eyebrow: string; title: string; href?: string; linkLabel?: string }) {
  return <div className="mb-8 flex items-end justify-between gap-4"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-accent">{eyebrow}</p><h2 className="display-title text-2xl font-extrabold text-primary sm:text-3xl">{title}</h2></div>{href && <Link href={href} data-testid={`link-section-${href.slice(1)}`} className="shrink-0 text-sm font-bold text-primary hover:text-accent">{linkLabel} <ArrowRight className="ml-1 inline h-4 w-4" /></Link>}</div>;
}

function SearchPanel({ compact = false }: { compact?: boolean }) {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(location.split('?')[1] || '');
  const [value, setValue] = useState(params.get('search') || '');
  const submit = (event: FormEvent) => { event.preventDefault(); const next = new URLSearchParams(); if (value.trim()) next.set('search', value.trim()); setLocation(`/jobs${next.toString() ? `?${next}` : ''}`); };
  return <form onSubmit={submit} data-testid="form-job-search" className={`flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-md sm:flex-row ${compact ? 'max-w-3xl' : ''}`}>
    <label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl px-3"><Search className="h-5 w-5 text-accent" /><input data-testid="input-search-jobs" value={value} onChange={(e) => setValue(e.target.value)} placeholder={copy.search} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label>
    <button data-testid="button-submit-search" type="submit" className="min-h-12 rounded-xl bg-accent px-6 text-sm font-bold text-accent-foreground transition-transform hover:-translate-y-0.5">ស្វែងរកការងារ</button>
  </form>;
}

const ALLOWED_CV_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_CV_EXTS = new Set(['pdf', 'doc', 'docx']);
const MAX_CV_BYTES = 10 * 1024 * 1024;

function validateCvFile(file: File): string | null {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_CV_EXTS.has(ext) && !ALLOWED_CV_TYPES.has(file.type)) {
    return 'ទ្រង់ទ្រាយមិនត្រឹមត្រូវ។ សូមប្រើ PDF, DOC ឬ DOCX ។';
  }
  if (file.size > MAX_CV_BYTES) {
    return `ឯកសារធំពេក (${(file.size / 1024 / 1024).toFixed(1)} MB)។ ទំហំអតិបរមា ១០ MB ។`;
  }
  if (file.size < 1) return 'ឯកសារទទេ — សូមជ្រើសរើសឯកសារ CV ។';
  return null;
}

function getCvContentType(file: File): string {
  if (file.type && ALLOWED_CV_TYPES.has(file.type)) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'doc') return 'application/msword';
  return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
}

function CVDropzone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const upload = useRequestUploadUrl();

  const reset = () => {
    setFile(null); setStatus('idle'); setValidationError(null); setServerError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const submitFile = async (candidate: File) => {
    const err = validateCvFile(candidate);
    if (err) { setValidationError(err); setFile(null); return; }
    setValidationError(null); setServerError(null); setFile(candidate); setStatus('uploading');
    try {
      const contentType = getCvContentType(candidate);
      const res = await upload.mutateAsync({ data: { name: candidate.name, size: candidate.size, contentType } });
      const put = await fetch(res.uploadURL, { method: 'PUT', headers: { 'Content-Type': contentType }, body: candidate });
      if (!put.ok) throw new Error(`HTTP ${put.status}`);
      setStatus('success');
    } catch {
      setStatus('error');
      setServerError('មិនអាចផ្ញើ CV បានទេ។ សូមព្យាយាមម្តងទៀត ឬផ្ញើតាម Email ។');
    }
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); setDragging(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) void submitFile(dropped);
  };

  return (
    <section aria-labelledby="cv-dropzone-title" className="container-wide py-14">
      <div className="overflow-hidden rounded-2xl bg-primary text-primary-foreground">
        <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          {/* Left: copy */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">ចង់ចូលរួមជាមួយក្រុមហ៊ុនល្អ?</p>
            <h2 id="cv-dropzone-title" className="mt-2 text-xl font-extrabold sm:text-2xl">ផ្ញើ CV របស់អ្នកមកយើង</h2>
            <p className="mt-2 max-w-xs text-sm leading-7 text-primary-foreground/75">
              ក្រុមការងារ LY Haw នឹងពិនិត្យ ហើយស្វែងរកឱកាសការងារដែលស័ក្តិសម។ PDF, DOC ឬ DOCX · រហូតដល់ ១០ MB ។
            </p>
            <a href="mailto:lyhawhrsolution@gmail.com" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-accent/80">
              <Mail className="h-4 w-4" /> lyhawhrsolution@gmail.com
            </a>
          </div>

          {/* Right: upload */}
          <div>
            {status !== 'success' && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-7 text-center transition-colors ${
                  dragging ? 'border-accent bg-accent/10' : 'border-primary-foreground/25 bg-primary-foreground/8 hover:border-accent/60'
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="sr-only"
                  aria-hidden="true"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) void submitFile(f); }}
                />
                {status === 'uploading' ? (
                  <p className="text-sm font-semibold">កំពុងផ្ញើ {file?.name}…</p>
                ) : (
                  <p className="text-sm font-semibold">{file?.name ?? 'ទម្លាក់ CV នៅទីនេះ'}</p>
                )}
                <p className="mt-1 text-xs text-primary-foreground/60">PDF, DOC, DOCX · ≤ ១០ MB</p>
              </div>
            )}

            {/* Explicit choose-file button */}
            {status === 'idle' && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                ជ្រើសរើសឯកសារ CV
              </button>
            )}

            {/* Validation error */}
            {validationError && (
              <div role="alert" className="mt-3 rounded-lg bg-accent/15 px-4 py-3 text-sm font-semibold text-accent">
                {validationError}{' '}
                <button onClick={reset} className="underline opacity-80 hover:opacity-100">ជ្រើសរើសម្តងទៀត</button>
              </div>
            )}

            {/* Server error */}
            {status === 'error' && serverError && (
              <div role="alert" className="mt-3 rounded-lg bg-accent/15 px-4 py-3 text-sm font-semibold text-accent">
                {serverError}{' '}
                <button onClick={reset} className="underline opacity-80 hover:opacity-100">ព្យាយាមម្តងទៀត</button>
              </div>
            )}

            {/* Success */}
            {status === 'success' && (
              <div role="status" className="mt-3 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-5 py-4">
                <p className="text-sm font-bold">✓ {file?.name} — បានផ្ញើជោគជ័យ!</p>
                <p className="mt-1 text-xs leading-6 text-primary-foreground/75">
                  ក្រុមការងារនឹងទំនាក់ទំនងក្នុងរយៈ ២–៣ ថ្ងៃធ្វើការ។
                </p>
                <button onClick={reset} className="mt-2 text-xs text-accent underline">ផ្ញើ CV ម្តងទៀត</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


function JobCard({ job, featured = false }: { job: Job; featured?: boolean }) {
  return <Link href={`/jobs/${job.slug}`} data-testid={`card-job-${job.id}`} className={`group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${featured ? 'md:grid md:grid-cols-[.85fr_1.15fr]' : ''}`}>
    <div className={`relative ${featured ? 'min-h-52 md:min-h-full' : 'h-28'}`}><ImgOrPlaceholder src={job.coverImage || job.posterImage} alt={job.titleEnglish} label={featured ? 'FEATURED ROLE' : job.company.name.slice(0, 2)} className="h-full w-full" />{job.urgent && <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-accent-foreground">ត្រូវការបន្ទាន់</span>}</div>
    <div className="p-5 sm:p-6">
      <div className="mb-3 flex items-start justify-between gap-3"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-primary">{job.category}</span>{!featured && job.urgent && <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-bold text-accent">បន្ទាន់</span>}</div><span className="text-xs text-muted-foreground">{job.reference}</span></div>
      <h3 data-testid={`text-job-title-${job.id}`} className="text-lg font-bold leading-snug text-primary group-hover:text-accent">{job.titleKhmer || job.titleEnglish}</h3>
      {job.titleEnglish && <p className="mt-1 text-xs text-muted-foreground">{job.titleEnglish}</p>}
      <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-foreground"><Building2Icon /> <span className="truncate">{job.company.name}</span>{job.company.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />}</p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground"><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-accent" />{job.location}</span><span className="flex items-center gap-1"><BriefcaseBusiness className="h-3.5 w-3.5 text-accent" />{job.jobType}</span><span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5 text-accent" />{formatDate(job.deadline)}</span></div>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4"><span className="text-sm font-bold text-primary">{job.salary || 'ប្រាក់ខែពិភាក្សា'}</span><ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" /></div>
    </div>
  </Link>;
}

function Building2Icon() { return <Building2 className="h-4 w-4 text-accent" />; }

function LoadingCards({ count = 3 }: { count?: number }) { return <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: count }).map((_, i) => <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card p-5"><div className="skeleton h-4 w-24 rounded" /><div className="skeleton mt-5 h-7 w-4/5 rounded" /><div className="skeleton mt-3 h-4 w-3/5 rounded" /><div className="skeleton mt-8 h-4 w-full rounded" /><div className="skeleton mt-3 h-4 w-2/3 rounded" /></div>)}</div>; }

function QueryError({ label = 'មិនអាចផ្ទុកទិន្នន័យបានទេ' }: { label?: string }) { return <div data-testid="status-error" className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center"><p className="font-bold text-destructive">{label}</p><p className="mt-2 text-sm text-muted-foreground">សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។</p></div>; }

function Home() {
  return <Shell>
    <main className="bg-background">
      {/* ── Hero ── */}
      <section className="border-b border-border/60 pb-10 pt-10 sm:pt-14">
        <div className="container-wide">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/55">LY Haw HR Solution</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="display-title text-2xl font-extrabold text-primary sm:text-3xl md:text-4xl leading-[1.25]">
                តើអ្នកត្រូវការអ្វីនៅថ្ងៃនេះ?
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
                ជ្រើសរើសសេវាកម្មមួយខាងក្រោម ហើយយើងនឹងជួយអ្នកឱ្យឈានទៅមុខ។
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Link href="/jobs" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-px hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                ស្វែងរកការងារ <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/test" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold text-primary transition-all hover:border-primary/50 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                ស្វែងយល់ពីខ្លួនឯង
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services quick links ── */}
      <section className="bg-muted/30 py-10 sm:py-12">
        <div className="container-wide">
          <h2 className="sr-only">សេវាកម្មចម្បង</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: BriefcaseBusiness, title: 'ស្វែងរកការងារ', desc: 'ការងារពីក្រុមហ៊ុនដែលបានផ្ទៀងផ្ទាត់', href: '/jobs', primary: true },
              { icon: Brain, title: 'ស្វែងយល់ពីខ្លួនឯង', desc: 'ធ្វើតេស្ត IQ & EQ ស្វែងរកទិសដៅអាជីព', href: '/test', primary: false },
              { icon: Users, title: 'ស្វែងរកបុគ្គលិក', desc: 'ជ្រើសរើសបុគ្គលិកមានជំនាញ', href: '/contact', primary: false },
              { icon: Building2, title: 'ដំណោះស្រាយ HR', desc: 'ប្រឹក្សា HR Policy & Compliance', href: '/career', primary: false },
              { icon: TrendingUp, title: 'អភិវឌ្ឍខ្លួន', desc: 'ចំណេះដឹង HR ជំនាញ ភាពជាអ្នកដឹកនាំ', href: '/learning', primary: false },
            ].map((svc) => (
              <Link
                key={svc.href + svc.title}
                href={svc.href}
                className={[
                  'group flex items-center gap-4 rounded-xl border bg-card px-5 py-4 text-sm transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  svc.primary ? 'border-primary/30 shadow-sm hover:border-primary/60 hover:shadow' : 'border-border hover:border-primary/30 hover:shadow-sm',
                ].join(' ')}
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${svc.primary ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary'}`}>
                  <svc.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-primary leading-snug">{svc.title}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{svc.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured jobs ── */}
      <FeaturedJobsSection />
    </main>
  </Shell>;
}

function FeaturedJobsSection() {
  const { data, isLoading, isError } = useListJobs({ featured: true, limit: 3 } as ListJobsParams);
  if (isError) return null;
  return (
    <section className="container-wide py-10 sm:py-12">
      <SectionHeading eyebrow="ការងារផ្តល់អនុសាសន៍" title="ការងារដែលបើកទទួលឥឡូវ" href="/jobs" />
      {isLoading ? <LoadingCards count={3} /> : data?.data?.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.data.slice(0, 3).map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      ) : null}
    </section>
  );
}

function CareerGateway() {
  const paths = [
    {
      icon: Brain,
      number: '01',
      title: 'ស្គាល់ខ្លួនឯងខ្ញុំជានរណា?',
      text: 'ធ្វើតេស្ត IQ & EQ ស្វែងរកចំណុចខ្លាំង ចំណុចខ្សោយ និងទិសដៅអាជីពដែលស័ក្តិសមបំផុតសម្រាប់អ្នក។',
      href: '/test',
      action: 'ធ្វើតេស្ត IQ & EQ',
    },
    {
      icon: BriefcaseBusiness,
      number: '02',
      title: 'ខ្ញុំចង់បានការងារល្អ',
      text: 'ស្វែងរកឱកាសការងារពីក្រុមហ៊ុនឈានមុខដែលបានផ្ទៀងផ្ទាត់ ទទួលបានប្រាក់បៀវត្សរ៍សមរម្យ និងបរិយាកាសល្អ។',
      href: '/jobs',
      action: 'ស្វែងរកការងារ',
    },
    {
      icon: Users,
      number: '03',
      title: 'ខ្ញុំស្វែងរកបុគ្គលិក',
      text: 'ជ្រើសរើសបុគ្គលិកមានសក្តានុពល ជំនាញច្បាស់លាស់ និងត្រូវនឹងវប្បធម៌ស្ថាប័នរបស់អ្នកបានយ៉ាងឆាប់រហ័ស។',
      href: '/contact',
      action: 'ស្វែងរកបុគ្គលិក',
    },
    {
      icon: Building2,
      number: '04',
      title: 'ខ្ញុំត្រូវការដំណោះស្រាយធនធានមនុស្ស',
      text: 'ប្រឹក្សាយោបល់យុទ្ធសាស្ត្រ HR រៀបចំប្រព័ន្ធគ្រប់គ្រង ច្បាប់ការងារ និងបង្កើនប្រសិទ្ធភាពការងារក្នុងក្រុមហ៊ុន។',
      href: '/about',
      action: 'ដំណោះស្រាយ HR',
    },
    {
      icon: TrendingUp,
      number: '05',
      title: 'ខ្ញុំត្រូវការអភិវឌ្ឍខ្លួន',
      text: 'រៀនសូត្រពីអត្ថបទ HR ជំនាញភាពជាអ្នកដឹកនាំ ផែនការអាជីព និងការបណ្តុះបណ្តាលដើម្បីឈានទៅមុខ។',
      href: '/learning',
      action: 'ចូលរៀនអភិវឌ្ឍខ្លួន',
    },
  ];
  return (
    <section className="border-b border-border bg-muted">
      <div className="container-wide section-space">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-accent">LY HAW HR SOLUTION · សេវាកម្មចម្បង</p>
            <h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">ចាប់ផ្តើមពីអ្វីដែលអ្នកត្រូវការថ្ងៃនេះ</h2>
          </div>
          <Link href="/career" className="inline-flex items-center text-sm font-bold text-primary hover:text-accent">
            បើក My Career Center <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {paths.map((path) => (
            <Link
              key={path.title}
              href={path.href}
              className="group flex min-h-64 flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <path.icon className="h-8 w-8 text-accent" />
                <span className="text-xs font-extrabold text-primary/35">{path.number}</span>
              </div>
              <h3 className="mt-6 text-lg font-extrabold text-primary leading-snug">{path.title}</h3>
              <p className="mt-2.5 text-xs leading-6 text-muted-foreground">{path.text}</p>
              <span className="mt-auto flex items-center pt-5 text-xs font-bold text-accent">
                {path.action} <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompaniesStrip({ companies }: { companies: Company[] }) {
  return <section className="border-y border-border bg-card"><div className="container-wide section-space"><SectionHeading eyebrow="ដៃគូរបស់យើង" title="ក្រុមហ៊ុនដែលកំពុងស្វែងរកអ្នក" href="/companies" /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{(companies.length ? companies.slice(0, 4) : []).map((company) => <Link href={`/companies/${company.slug}`} key={company.id} data-testid={`card-company-${company.id}`} className="group rounded-2xl border border-border p-5 hover:border-accent/50 hover:shadow-sm"><div className="flex items-center gap-3"><div className="h-12 w-12 overflow-hidden rounded-xl bg-secondary">{company.logo ? <img src={company.logo} alt={company.name} className="h-full w-full object-contain" /> : <div className="grid h-full place-items-center text-sm font-bold text-primary">{company.name.slice(0, 2).toUpperCase()}</div>}</div><div><h3 className="font-bold text-primary group-hover:text-accent">{company.name}</h3><p className="mt-1 text-xs text-muted-foreground">{company.industry}</p></div></div><p className="mt-4 line-clamp-2 text-xs leading-5 text-muted-foreground">{company.description}</p></Link>)}{!companies.length && <EmptyState title="ក្រុមហ៊ុនកំពុងបន្ថែមព័ត៌មាន" action="/companies" />}</div></div></section>;
}

function ArticlesStrip({ articles, loading }: { articles: Article[]; loading: boolean }) {
  return <section className="container-wide section-space"><SectionHeading eyebrow="ចំណេះដឹងសម្រាប់អាជីព" title="អត្ថបទ HR ថ្មីៗ" href="/articles" />{loading ? <LoadingCards count={3} /> : <div className="grid gap-5 md:grid-cols-3">{articles.slice(0, 3).map((article) => <Link href={`/articles/${article.slug}`} key={article.id} data-testid={`card-article-${article.id}`} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-md"><ImgOrPlaceholder src={article.image} alt={article.title} label="HR INSIGHT" className="h-40 w-full" /><div className="p-5"><div className="flex items-center justify-between text-xs text-accent"><span>{article.category}</span><span>{article.readTime}</span></div><h3 className="mt-3 font-bold leading-6 text-primary group-hover:text-accent">{article.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{article.excerpt}</p><p className="mt-4 text-xs text-muted-foreground">{formatDate(article.publishedAt)}</p></div></Link>)}</div>}</section>;
}

const hrQuotes = [
  {
    text: 'រឿង ៣ យ៉ាងដែលអ្នកធ្វើការត្រូវដឹងឱ្យច្បាស់',
    author: 'LY Haw',
    topic: 'ការងារ និងអាជីព',
    href: 'https://www.facebook.com/reel/1481616970685394/',
  },
  {
    text: 'ពេលស្លាបមិនទាន់រឹង កុំទាន់ប្រឹងហើរ!',
    author: 'LY Haw',
    topic: 'ការអភិវឌ្ឍខ្លួន',
    href: 'https://www.facebook.com/reel/2089402608382766/',
  },
  {
    text: 'មេមាន EQ ខ្ពស់ ទើបធ្វើឱ្យកូនចៅធ្វើការដោយរីករាយ',
    author: 'LY Haw HR Solution',
    topic: 'ភាពជាអ្នកដឹកនាំ',
    href: 'https://www.facebook.com/reel/1746321553116463/',
  },
  {
    text: 'មុននឹងក្លាយជាបុគ្គលិកឆ្នើម ត្រូវឆ្លងកាត់រឿងជាច្រើន',
    author: 'LY Haw HR Solution',
    topic: 'ការរីកចម្រើនក្នុងអាជីព',
    href: 'https://www.facebook.com/reel/1086509854078490/',
  },
];

function HRQuotes() {
  return <section className="overflow-hidden bg-primary text-primary-foreground">
    <div className="container-wide section-space">
      <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-accent">គំនិតសម្រាប់អ្នកធ្វើការ</p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">ពាក្យខ្លីៗ ដែលជួយឱ្យការងារ<br className="hidden sm:block" /> និងការដឹកនាំកាន់តែប្រសើរ</h2>
        </div>
        <div className="max-w-sm"><p className="text-sm leading-7 text-primary-foreground/65">ដកស្រង់ពីមាតិកាអប់រំអំពីអាជីព ការគ្រប់គ្រង និងធនធានមនុស្សរបស់ LY Haw។</p><Link href="/learning" className="mt-4 inline-flex items-center text-sm font-bold text-accent">ចូលរៀនមេរៀន HR <ArrowRight className="ml-2 h-4 w-4" /></Link></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {hrQuotes.map((quote, index) => <motion.a
          key={quote.href}
          href={quote.href}
          target="_blank"
          rel="noreferrer"
          data-testid={`link-hr-quote-${index}`}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, delay: index * 0.07 }}
          className="group flex min-h-56 flex-col justify-between rounded-2xl border border-primary-foreground/15 bg-primary-foreground/[.07] p-6 transition-colors hover:border-accent/60 hover:bg-primary-foreground/[.11] sm:p-7"
        >
          <div>
            <Quote className="h-8 w-8 text-accent" aria-hidden="true" />
            <blockquote className="mt-5 text-xl font-semibold leading-9 sm:text-2xl sm:leading-10">“{quote.text}”</blockquote>
          </div>
          <div className="mt-7 flex items-end justify-between gap-4 border-t border-primary-foreground/15 pt-4">
            <div><p className="font-bold text-accent">{quote.author}</p><p className="mt-1 text-xs text-primary-foreground/55">{quote.topic}</p></div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-foreground/70 transition-colors group-hover:text-accent">មើលប្រភព <ExternalLink className="h-3.5 w-3.5" /></span>
          </div>
        </motion.a>)}
      </div>
    </div>
  </section>;
}

function SafetyBanner() { return <section className="container-wide pb-20"><div className="relative overflow-hidden rounded-3xl bg-secondary p-7 sm:p-10"><div className="relative max-w-2xl"><div className="mb-4 inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"><ShieldCheck className="mr-2 h-4 w-4" /> សុវត្ថិភាពជាមុន</div><h2 className="text-2xl font-extrabold text-primary sm:text-3xl">កុំបង់ប្រាក់ដើម្បីដាក់ពាក្យការងារ</h2><p className="mt-3 max-w-xl text-sm leading-7 text-primary/70">LY Haw មិនដែលទាមទារថ្លៃសេវាពីអ្នកស្វែងរកការងារ។ ស្វែងយល់ពីវិធីសម្គាល់ការងារក្លែងក្លាយ និងទំនាក់ទំនងមកយើង ប្រសិនបើមានការសង្ស័យ។</p><Link href="/safety" data-testid="link-safety-banner" className="mt-5 inline-flex items-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90">អានព័ត៌មានសុវត្ថិភាព <ArrowRight className="ml-2 h-4 w-4" /></Link></div><ShieldCheck className="absolute -bottom-10 -right-6 h-48 w-48 text-primary/10" /></div></section>; }

function EmptyState({ title, action }: { title: string; action?: string }) { return <div data-testid="status-empty" className="rounded-2xl border border-dashed border-border bg-muted/40 p-12 text-center"><BriefcaseBusiness className="mx-auto h-8 w-8 text-accent/70" /><p className="mt-3 font-semibold text-primary">{title}</p>{action && <Link href={action} className="mt-4 inline-block text-sm font-bold text-accent">ត្រឡប់ទៅស្វែងរកការងារ <ArrowRight className="ml-1 inline h-4 w-4" /></Link>}</div>; }

function JobsPage() {
  const [location, setLocation] = useLocation();
  const qs = useMemo(() => new URLSearchParams(location.split('?')[1] || ''), [location]);
  const rawPage = Number(qs.get('page') || 1);
  const selectedLocation = qs.get('location');
  const locationParam = selectedLocation === 'ភ្នំពេញ' ? 'Phnom Penh' : selectedLocation === 'សៀមរាប' ? 'Siem Reap' : undefined;
  const params: ListJobsParams = { search: qs.get('search') || undefined, category: qs.get('category') || undefined, location: locationParam, jobType: qs.get('jobType') || undefined, workArrangement: qs.get('workArrangement') || undefined, featured: qs.get('featured') === 'true' ? true : undefined, urgent: qs.get('urgent') === 'true' ? true : undefined, sort: (qs.get('sort') as ListJobsParams['sort']) || 'newest', page: Number.isFinite(rawPage) ? rawPage : 1, limit: 9 };
  const query = useListJobs(params);
  const update = (key: string, value: string) => { const next = new URLSearchParams(qs); if (value) next.set(key, value); else next.delete(key); next.delete('page'); setLocation(`/jobs${next.toString() ? `?${next}` : ''}`); };
  const data = query.data;
  return <Shell><main className="container-wide section-space"><div className="mb-10 max-w-2xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-accent">ឱកាសការងារកម្ពុជា</p><h1 className="display-title text-4xl font-extrabold text-primary sm:text-5xl">ស្វែងរកការងារ<br /><span className="text-accent">ដែលសមនឹងអ្នក។</span></h1><p className="mt-4 leading-7 text-muted-foreground">តម្រងព័ត៌មានងាយៗ ដើម្បីឲ្យអ្នកចំណាយពេលលើអ្វីដែលសំខាន់។</p></div><div className="mb-8 rounded-2xl border border-border bg-card p-3 shadow-sm"><div className="flex flex-col gap-3 lg:flex-row"><label className="flex flex-1 items-center gap-3 rounded-xl bg-muted/60 px-4 py-2.5"><Search className="h-5 w-5 text-accent" /><input data-testid="input-jobs-search" value={qs.get('search') || ''} onChange={(e) => update('search', e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') update('search', (e.target as HTMLInputElement).value); }} placeholder={copy.search} className="w-full bg-transparent text-sm outline-none" /></label><label className="flex items-center gap-2 rounded-xl bg-muted/60 px-4 py-2.5 text-sm"><MapPin className="h-4 w-4 text-accent" /><select data-testid="select-location" value={qs.get('location') || ''} onChange={(e) => update('location', e.target.value)} className="bg-transparent outline-none"><option value="">គ្រប់ទីតាំង</option><option value="ភ្នំពេញ">ភ្នំពេញ</option><option value="សៀមរាប">សៀមរាប</option><option value="ខេត្តផ្សេងៗ">ខេត្តផ្សេងៗ</option></select></label><label className="flex items-center gap-2 rounded-xl bg-muted/60 px-4 py-2.5 text-sm"><Filter className="h-4 w-4 text-accent" /><select data-testid="select-sort" value={qs.get('sort') || 'newest'} onChange={(e) => update('sort', e.target.value)} className="bg-transparent outline-none"><option value="newest">ថ្មីបំផុត</option><option value="deadline">ជិតផុតកំណត់</option><option value="salary">ប្រាក់ខែខ្ពស់</option></select></label></div><div className="mt-3 flex flex-wrap gap-2"><button type="button" data-testid="button-filter-featured" onClick={() => update('featured', qs.get('featured') === 'true' ? '' : 'true')} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${qs.get('featured') === 'true' ? 'border-accent bg-accent text-accent-foreground' : 'border-border text-muted-foreground'}`}>ការងារដែលបានជ្រើសរើស</button><button type="button" data-testid="button-filter-urgent" onClick={() => update('urgent', qs.get('urgent') === 'true' ? '' : 'true')} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${qs.get('urgent') === 'true' ? 'border-accent bg-accent text-accent-foreground' : 'border-border text-muted-foreground'}`}>ត្រូវការបន្ទាន់</button>{qs.toString() && <button type="button" data-testid="button-clear-filters" onClick={() => setLocation('/jobs')} className="rounded-full px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/10">លុបតម្រងទាំងអស់</button>}</div></div><div className="mb-5 flex items-center justify-between"><p data-testid="text-job-count" className="text-sm text-muted-foreground">{data?.meta?.total ?? 0} តួនាទីកំពុងផ្សព្វផ្សាយ</p><span className="text-xs text-muted-foreground">ទំព័រ {data?.meta?.page || 1} / {data?.meta?.totalPages || 1}</span></div>{query.isLoading ? <LoadingCards count={6} /> : query.isError ? <QueryError /> : data?.data?.length ? <><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{data.data.map((job) => <JobCard key={job.id} job={job} />)}</div><div className="mt-10 flex items-center justify-center gap-3"><button disabled={(data.meta.page || 1) <= 1} type="button" data-testid="button-pagination-prev" onClick={() => update('page', String(Math.max(1, (data.meta.page || 1) - 1)))} className="rounded-xl border border-border p-2 disabled:opacity-40"><ChevronLeft className="h-5 w-5" /></button><span className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">{data.meta.page}</span><button disabled={(data.meta.page || 1) >= (data.meta.totalPages || 1)} type="button" data-testid="button-pagination-next" onClick={() => update('page', String((data.meta.page || 1) + 1))} className="rounded-xl border border-border p-2 disabled:opacity-40"><ChevronRight className="h-5 w-5" /></button></div></> : <EmptyState title="រកមិនឃើញការងារដែលត្រូវនឹងលក្ខខណ្ឌ" action="/jobs" />}</main></Shell>;
}

function JobDetailPage() {
  const { slug = '' } = useParams();
  const query = useGetJob(slug);
  const job = query.data;
  const relatedQuery = useListJobs({ category: job?.category, limit: 4, sort: 'newest' });
  if (query.isLoading) return <Shell><main className="container-wide section-space"><LoadingCards count={1} /></main></Shell>;
  if (query.isError || !job) return <Shell><main className="container-wide section-space"><QueryError label="មិនអាចរកឃើញការងារនេះទេ" /></main></Shell>;
  const relatedJobs = (relatedQuery.data?.data || []).filter((item) => item.id !== job.id).slice(0, 3);
  return <Shell><main><section className="bg-primary text-primary-foreground"><div className="container-wide py-12"><Link href="/jobs" data-testid="link-back-jobs" className="mb-8 inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground"><ChevronLeft className="h-4 w-4" /> ត្រឡប់ទៅបញ្ជីការងារ</Link><div className="grid gap-8 lg:grid-cols-[1fr_340px]"><div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">{job.category}</span>{job.urgent && <span className="rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-bold">ត្រូវការបន្ទាន់</span>}</div><h1 data-testid="text-job-detail-title" className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">{job.titleKhmer || job.titleEnglish}</h1><p className="mt-3 text-lg text-primary-foreground/70">{job.titleEnglish}</p><p className="mt-6 flex items-center gap-2 text-sm font-semibold"><Building2Icon /> {job.company.name} <span className="text-primary-foreground/40">·</span> {job.location}</p></div><div className="overflow-hidden rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10"><ImgOrPlaceholder src={job.coverImage || job.posterImage} alt={job.titleEnglish} label="JOB COVER" className="h-52 w-full" /></div></div></div></section><div className="container-wide grid gap-10 py-12 lg:grid-cols-[1fr_340px]"><article className="min-w-0"><div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-4">{[[<MapPin />, 'ទីតាំង', job.location], [<BriefcaseBusiness />, 'ប្រភេទ', job.jobType], [<Clock3 />, 'បទពិសោធន៍', job.experience], [<CalendarDays />, 'ផុតកំណត់', formatDate(job.deadline)]].map(([icon, label, value], i) => <div key={i} className="border-border px-2 py-2 sm:border-r last:border-0"><span className="flex items-center gap-1 text-xs text-muted-foreground">{icon} {label}</span><strong className="mt-2 block text-sm text-primary">{value}</strong></div>)}</div><div className="prose prose-slate mt-10 max-w-none prose-headings:text-primary prose-p:leading-8"><h2>អំពីតួនាទីនេះ</h2><p>{job.description || job.summary}</p><ContentList title="តួនាទី និងការទទួលខុសត្រូវ" items={job.responsibilities} /><ContentList title="លក្ខខណ្ឌតម្រូវ" items={job.requirements} /><ContentList title="អត្ថប្រយោជន៍" items={job.benefits} /><h2>របៀបដាក់ពាក្យ</h2><p>{job.applicationInstructions || 'សូមរៀបចំប្រវត្តិរូបសង្ខេប និងទំនាក់ទំនងទៅកាន់ក្រុមការងារតាមព័ត៌មានខាងស្តាំ។'}</p></div>{job.posterImage && <div className="mt-10"><h2 className="mb-4 text-xl font-extrabold text-primary">Poster ការងារ</h2><img data-testid="img-job-poster" src={job.posterImage} alt={`Poster ${job.titleEnglish}`} className="max-h-[700px] rounded-2xl border border-border object-contain" /></div>}{job.gallery?.length ? <div className="mt-10"><h2 className="mb-4 text-xl font-extrabold text-primary">រូបភាពបន្ថែម</h2><div className="grid gap-3 sm:grid-cols-2">{job.gallery.map((media, index) => <figure key={`${media.url}-${index}`} className="overflow-hidden rounded-2xl border border-border bg-card"><img data-testid={`img-job-gallery-${index}`} src={media.url} alt={media.alt || `${job.titleEnglish} ${index + 1}`} className="h-48 w-full object-cover" />{media.caption && <figcaption className="p-3 text-xs text-muted-foreground">{media.caption}</figcaption>}</figure>)}</div></div> : null}{relatedJobs.length ? <section className="mt-14 border-t border-border pt-10"><SectionHeading eyebrow="ឱកាសស្រដៀងគ្នា" title="ការងារផ្សេងទៀតដែលអ្នកអាចចាប់អារម្មណ៍" href="/jobs" /><div className="grid gap-4 md:grid-cols-3">{relatedJobs.map((item) => <JobCard key={item.id} job={item} />)}</div></section> : null}</article><aside className="space-y-5"><div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">ចាប់ផ្តើមថ្ងៃនេះ</p><h2 className="mt-2 text-xl font-extrabold text-primary">ត្រៀមដាក់ពាក្យ?</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">អានការណែនាំខាងក្រោម ហើយទំនាក់ទំនងទៅកាន់អ្នកជ្រើសរើសដោយផ្ទាល់។</p>{job.applicationEmail && <a href={`mailto:${job.applicationEmail}`} data-testid="button-apply-email" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-accent-foreground hover:bg-accent/90"><Mail className="h-4 w-4" /> ផ្ញើប្រវត្តិរូបតាម Email</a>}{job.applicationPhone && <a href={`tel:${job.applicationPhone}`} data-testid="button-apply-phone" className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-bold text-primary hover:bg-muted"><Phone className="h-4 w-4" /> {job.applicationPhone}</a>}{job.telegram && <a href={job.telegram} target="_blank" rel="noreferrer" data-testid="button-apply-telegram" className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-bold text-primary hover:bg-muted"><Send className="h-4 w-4" /> ទំនាក់ទំនងតាម Telegram</a>}<div className="mt-5 border-t border-border pt-4 text-xs leading-6 text-muted-foreground"><ShieldCheck className="mr-1 inline h-4 w-4 text-accent" /> មិនត្រូវបង់ប្រាក់សម្រាប់ការដាក់ពាក្យ។</div></div><div className="rounded-2xl bg-muted p-5"><p className="text-xs font-bold text-muted-foreground">ចែករំលែកការងារនេះ</p><button type="button" data-testid="button-share-job" onClick={() => { if (navigator.share) navigator.share({ title: job.titleEnglish, url: window.location.href }); }} className="mt-3 flex items-center gap-2 text-sm font-bold text-primary hover:text-accent"><Share2 className="h-4 w-4" /> ចែករំលែក</button></div></aside></div></main></Shell>;
}

function ContentList({ title, items }: { title: string; items?: string[] }) { if (!items?.length) return null; return <><h2>{title}</h2><ul>{items.map((item, index) => <li key={index}>{item}</li>)}</ul></>; }

function CompaniesPage() {
  const query = useListCompanies();
  const jobsQuery = useListJobs({ limit: 200, sort: 'newest' });
  const [companySearch, setCompanySearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const companies = query.data || [];
  const jobs = jobsQuery.data?.data || [];
  const industries = useMemo(() => [...new Set(companies.map((company) => company.industry).filter(Boolean))].sort(), [companies]);
  const companyLocations = useMemo(() => [...new Set(companies.map((company) => company.location).filter(Boolean))].sort(), [companies]);
  const openJobsByCompany = useMemo(() => jobs.reduce<Record<string, number>>((counts, job) => {
    counts[job.company.id] = (counts[job.company.id] || 0) + 1;
    return counts;
  }, {}), [jobs]);
  const filteredCompanies = useMemo(() => {
    const term = companySearch.trim().toLowerCase();
    return companies.filter((company) => (!term || `${company.name} ${company.industry} ${company.description} ${company.location}`.toLowerCase().includes(term)) && (!industry || company.industry === industry) && (!companyLocation || company.location === companyLocation));
  }, [companies, companyLocation, companySearch, industry]);
  const verifiedCount = companies.filter((company) => company.verified).length;
  const clearCompanyFilters = () => { setCompanySearch(''); setIndustry(''); setCompanyLocation(''); };

  return <Shell><main>
    <section className="bg-primary text-primary-foreground">
      <div className="container-wide grid gap-10 py-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:py-16">
        <div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-accent"><Building2 className="h-4 w-4" /> បណ្តាញក្រុមហ៊ុននៅកម្ពុជា</p><h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.35] sm:text-5xl">ស្គាល់ក្រុមហ៊ុន<br /><span className="text-accent">មុនពេលអ្នកដាក់ពាក្យ។</span></h1><p className="mt-5 max-w-2xl text-sm leading-7 text-primary-foreground/70">ស្វែងរកព័ត៌មានក្រុមហ៊ុន វិស័យការងារ ទីតាំង និងឱកាសដែលកំពុងបើក ដើម្បីជ្រើសរើសកន្លែងការងារដែលសមនឹងអ្នក។</p></div>
        <div className="grid grid-cols-3 gap-px border border-primary-foreground/15 bg-primary-foreground/15">{[[companies.length, 'ក្រុមហ៊ុន'], [verifiedCount, 'បានផ្ទៀងផ្ទាត់'], [jobs.length, 'ការងារកំពុងបើក']].map(([value, label]) => <div key={label} className="bg-primary p-4 sm:p-5"><strong className="block text-2xl font-extrabold text-accent sm:text-3xl">{value}</strong><span className="mt-2 block text-[11px] leading-5 text-primary-foreground/55">{label}</span></div>)}</div>
      </div>
    </section>

    <section className="container-wide section-space">
      <div className="grid gap-3 border-y border-border py-5 lg:grid-cols-[1fr_230px_230px]">
        <label className="flex min-h-12 items-center gap-3 border border-border bg-card px-4"><Search className="h-5 w-5 text-accent" /><input value={companySearch} onChange={(event) => setCompanySearch(event.target.value)} placeholder="ស្វែងរកឈ្មោះក្រុមហ៊ុន ឬវិស័យ..." className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label>
        <label className="flex min-h-12 items-center gap-2 border border-border bg-card px-4"><BriefcaseBusiness className="h-4 w-4 text-accent" /><select value={industry} onChange={(event) => setIndustry(event.target.value)} aria-label="តម្រងតាមវិស័យ" className="w-full bg-transparent text-sm text-primary outline-none"><option value="">គ្រប់វិស័យ</option>{industries.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="flex min-h-12 items-center gap-2 border border-border bg-card px-4"><MapPin className="h-4 w-4 text-accent" /><select value={companyLocation} onChange={(event) => setCompanyLocation(event.target.value)} aria-label="តម្រងតាមទីតាំង" className="w-full bg-transparent text-sm text-primary outline-none"><option value="">គ្រប់ទីតាំង</option>{companyLocations.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      </div>
      <div className="mb-6 mt-7 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-extrabold text-primary">ក្រុមហ៊ុនកំពុងជ្រើសរើស</h2><p className="mt-1 text-sm text-muted-foreground">រកឃើញ {filteredCompanies.length} ក្នុងចំណោម {companies.length} ក្រុមហ៊ុន</p></div>{(companySearch || industry || companyLocation) && <button type="button" onClick={clearCompanyFilters} className="inline-flex min-h-10 items-center gap-2 border border-border px-3 text-xs font-bold text-primary hover:border-accent"><X className="h-4 w-4" /> សម្អាតតម្រង</button>}</div>
      {query.isLoading ? <LoadingCards count={6} /> : query.isError ? <QueryError /> : filteredCompanies.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filteredCompanies.map((company) => <CompanyCard key={company.id} company={company} openJobs={openJobsByCompany[company.id] || 0} />)}</div> : <EmptyState title="រកមិនឃើញក្រុមហ៊ុនដែលត្រូវនឹងលក្ខខណ្ឌ" />}
    </section>
  </main></Shell>;
}

function CompanyCard({ company, openJobs = 0 }: { company: Company; openJobs?: number }) { return <Link href={`/companies/${company.slug}`} data-testid={`card-company-page-${company.id}`} className="group relative flex min-h-[21rem] flex-col overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-accent hover:shadow-md"><span className="absolute inset-x-0 top-0 h-1 bg-accent" /><div className="flex items-start justify-between gap-4"><div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-secondary">{company.logo ? <img src={company.logo} alt={company.name} className="h-full w-full object-contain p-1" /> : <span className="text-lg font-extrabold text-primary">{company.name.slice(0, 2).toUpperCase()}</span>}</div>{company.verified && <span className="flex items-center gap-1 border border-accent/35 bg-accent/10 px-2 py-1 text-[11px] font-bold text-primary"><BadgeCheck className="h-3.5 w-3.5 text-accent" /> បានផ្ទៀងផ្ទាត់</span>}</div><p className="mt-6 text-[11px] font-bold uppercase tracking-[.12em] text-accent">{company.industry}</p><h2 className="mt-2 text-xl font-extrabold leading-8 text-primary transition-colors group-hover:text-accent">{company.name}</h2><p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-4 w-4 text-accent" /> {company.location}</p><p className="mt-5 line-clamp-3 text-sm leading-7 text-muted-foreground">{company.description}</p><div className="mt-auto flex items-center justify-between border-t border-border pt-5"><span className="flex items-center gap-2 text-xs font-bold text-primary"><BriefcaseBusiness className="h-4 w-4 text-accent" /> {openJobs} ការងារកំពុងបើក</span><span className="grid h-9 w-9 place-items-center border border-border text-primary transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground" aria-label="មើលក្រុមហ៊ុន"><ArrowRight className="h-4 w-4" /></span></div></Link>; }

function CompanyDetailPage() {
  const { slug = '' } = useParams();
  const query = useGetCompany(slug);
  const company = query.data as CompanyDetail | undefined;
  if (query.isLoading) return <Shell><main className="container-wide section-space"><LoadingCards count={2} /></main></Shell>;
  if (query.isError || !company) return <Shell><main className="container-wide section-space"><QueryError label="មិនអាចរកឃើញក្រុមហ៊ុននេះទេ" /></main></Shell>;
  return <Shell><main><section className="bg-muted"><div className="container-wide py-14"><Link href="/companies" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ChevronLeft className="h-4 w-4" /> ក្រុមហ៊ុនទាំងអស់</Link><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="grid h-24 w-24 place-items-center overflow-hidden rounded-3xl bg-card shadow-sm">{company.logo ? <img src={company.logo} alt={company.name} className="h-full w-full object-contain" /> : <span className="text-2xl font-extrabold text-primary">{company.name.slice(0, 2).toUpperCase()}</span>}</div><div><div className="flex items-center gap-2 text-xs font-bold text-accent">{company.verified && <><BadgeCheck className="h-4 w-4" /> ក្រុមហ៊ុនបានផ្ទៀងផ្ទាត់</>}</div><h1 className="mt-2 text-4xl font-extrabold text-primary">{company.name}</h1><p className="mt-2 text-sm text-muted-foreground">{company.industry} · {company.location}</p></div></div></div></section><div className="container-wide grid gap-10 py-12 lg:grid-cols-[.8fr_1.2fr]"><div><h2 className="text-2xl font-extrabold text-primary">អំពីក្រុមហ៊ុន</h2><p className="mt-4 whitespace-pre-line text-sm leading-8 text-muted-foreground">{company.description}</p>{company.website && <a href={company.website} target="_blank" rel="noreferrer" data-testid="link-company-website" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-accent">ចូលទៅកាន់គេហទំព័រ <ArrowRight className="h-4 w-4" /></a>}</div><div><SectionHeading eyebrow="ឱកាសបច្ចុប្បន្ន" title={`${company.jobs?.length || 0} តួនាទីកំពុងជ្រើសរើស`} />{company.jobs?.length ? <div className="space-y-4">{company.jobs.map((job) => <JobCard key={job.id} job={job} />)}</div> : <EmptyState title="មិនទាន់មានការងារផ្សព្វផ្សាយ" />}</div></div></main></Shell>;
}

function ArticlesPage() {
  const query = useListArticles();
  const [category, setCategory] = useState<(typeof hrArticleCategories)[number]>('ទាំងអស់');
  const [articleSearch, setArticleSearch] = useState('');
  const allArticles = useMemo<Article[]>(() => {
    const curatedSlugs = new Set(curatedHrArticles.map((article) => article.slug));
    return [...curatedHrArticles, ...(query.data || []).filter((article) => !curatedSlugs.has(article.slug))];
  }, [query.data]);
  const filteredArticles = useMemo(() => {
    const term = articleSearch.trim().toLowerCase();
    return allArticles.filter((article) => (category === 'ទាំងអស់' || article.category === category) && (!term || `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(term)));
  }, [allArticles, articleSearch, category]);
  const featured = filteredArticles[0];
  return <Shell><main>
    <section className="bg-primary text-primary-foreground"><div className="container-wide grid gap-10 py-14 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:py-18"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-accent">LY HAW HR KNOWLEDGE LIBRARY</p><h1 className="mt-4 text-4xl font-extrabold leading-[1.35] sm:text-6xl">អត្ថបទសម្រាប់ការងារ<br /><span className="text-accent">និងការរីកចម្រើនរបស់មនុស្សគ្រប់គ្នា</span></h1><p className="mt-5 max-w-3xl text-base leading-8 text-primary-foreground/65">អានបទពិសោធន៍ ការពន្យល់ និងវិធីអនុវត្តលើការលើកទឹកចិត្ត ចំណុចខ្លាំង ចំណុចខ្សោយ វិន័យការងារ ចិត្តសាស្ត្រ ទំនាក់ទំនង និងភាពជាអ្នកដឹកនាំ។</p></div><div className="grid grid-cols-2 gap-px bg-primary-foreground/15"><div className="bg-primary p-5"><strong className="text-4xl font-extrabold text-accent">{allArticles.length}+</strong><p className="mt-2 text-xs text-primary-foreground/55">អត្ថបទអាចអានបាន</p></div><div className="bg-primary p-5"><strong className="text-4xl font-extrabold text-accent">{hrArticleCategories.length - 1}</strong><p className="mt-2 text-xs text-primary-foreground/55">ប្រភេទចំណេះដឹង HR</p></div></div></div></section>

    <section className="container-wide section-space"><div className="grid gap-5 border-y border-border py-5 lg:grid-cols-[1fr_auto] lg:items-center"><div className="flex flex-wrap gap-2">{hrArticleCategories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`min-h-10 border px-3 text-xs font-bold transition-colors ${category === item ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:border-accent hover:text-primary'}`}>{item}</button>)}</div><label className="flex h-11 min-w-72 items-center gap-2 border border-border bg-card px-3"><Search className="h-4 w-4 text-accent" /><input value={articleSearch} onChange={(event) => setArticleSearch(event.target.value)} placeholder="ស្វែងរកអត្ថបទ HR..." className="w-full bg-transparent text-sm outline-none" /></label></div>

      {featured ? <><motion.section key={featured.slug} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-10 grid overflow-hidden border border-border bg-secondary lg:grid-cols-[.9fr_1.1fr]"><ImgOrPlaceholder src={featured.image} alt={featured.title} label="FEATURED HR INSIGHT" className="min-h-72 w-full" /><div className="flex flex-col justify-center p-7 sm:p-10"><p className="text-xs font-bold uppercase tracking-[.16em] text-accent">អត្ថបទណែនាំ · {featured.category}</p><h2 className="mt-4 text-3xl font-extrabold leading-[1.45] text-primary">{featured.title}</h2><p className="mt-4 text-sm leading-8 text-muted-foreground">{featured.excerpt}</p><div className="mt-6 flex items-center justify-between text-xs text-muted-foreground"><span>{featured.readTime}</span><span>{formatDate(featured.publishedAt)}</span></div><Link href={`/articles/${featured.slug}`} className="mt-7 inline-flex w-fit items-center bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">អានអត្ថបទពេញ <ArrowRight className="ml-2 h-4 w-4 text-accent" /></Link></div></motion.section><div className="mt-10 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-accent">អត្ថបទទាំងអស់</p><h2 className="mt-2 text-2xl font-extrabold text-primary">ចំណេះដឹងដែលអាចយកទៅអនុវត្តក្នុងការងារ</h2></div><span className="text-sm font-semibold text-muted-foreground">រកឃើញ {filteredArticles.length} អត្ថបទ</span></div><div className="mt-6 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">{filteredArticles.map((article) => <ArticleCard key={article.id} article={article} />)}</div></> : <div className="mt-12"><EmptyState title="មិនមានអត្ថបទត្រូវនឹងការស្វែងរក" /></div>}
    </section>
  </main></Shell>;
}

function ArticleCard({ article }: { article: Article }) { return <Link href={`/articles/${article.slug}`} data-testid={`card-article-page-${article.id}`} className="group flex min-h-[23rem] flex-col bg-card p-6 transition-colors hover:bg-secondary"><div className="flex items-center justify-between text-xs font-semibold text-accent"><span>{article.category}</span><span>{article.readTime}</span></div><h2 className="mt-6 text-xl font-extrabold leading-8 text-primary group-hover:text-accent">{article.title}</h2><p className="mt-4 line-clamp-4 text-sm leading-7 text-muted-foreground">{article.excerpt}</p><div className="mt-auto flex items-center justify-between border-t border-border pt-5"><span className="text-xs text-muted-foreground">{formatDate(article.publishedAt)}</span><span className="grid h-9 w-9 place-items-center border border-border text-primary group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground"><ArrowRight className="h-4 w-4" /></span></div></Link>; }

function ArticleDetailPage() {
  const { slug = '' } = useParams();
  const curatedArticle = curatedHrArticles.find((item) => item.slug === slug);
  const query = useGetArticle(slug, { query: { enabled: !curatedArticle, queryKey: ['/api/articles', slug] } });
  const article = curatedArticle || query.data as ArticleDetail | undefined;
  if (!curatedArticle && query.isLoading) return <Shell><main className="container-wide section-space"><LoadingCards count={1} /></main></Shell>;
  if (!article) return <Shell><main className="container-wide section-space"><QueryError label="មិនអាចរកឃើញអត្ថបទនេះទេ" /></main></Shell>;
  return <Shell><main><section className="bg-primary text-primary-foreground"><div className="container-wide py-12 sm:py-16"><Link href="/articles" className="inline-flex items-center gap-2 text-sm text-primary-foreground/65 hover:text-accent"><ChevronLeft className="h-4 w-4" /> អត្ថបទទាំងអស់</Link><p className="mt-10 text-xs font-bold uppercase tracking-[.2em] text-accent">{article.category} · {article.readTime}</p><h1 data-testid="text-article-title" className="mt-4 max-w-5xl text-4xl font-extrabold leading-[1.4] sm:text-6xl">{article.title}</h1><p className="mt-6 max-w-3xl text-lg leading-9 text-primary-foreground/65">{article.excerpt}</p><p className="mt-6 text-xs text-primary-foreground/45">{formatDate(article.publishedAt)} · LY Haw HR Solution</p></div></section><div className="container-wide grid gap-10 py-12 lg:grid-cols-[1fr_18rem]"><article className="mx-auto w-full max-w-3xl"><ImgOrPlaceholder src={article.image} alt={article.title} label="HR KNOWLEDGE" className="h-64 w-full sm:h-96" /><div className="mt-10">{article.body.split('\n').map((paragraph, i) => { const text = paragraph.trim(); if (!text) return null; if (text.startsWith('## ')) return <h2 key={i} className="mb-4 mt-10 text-2xl font-extrabold leading-9 text-primary first:mt-0">{text.slice(3)}</h2>; return <p key={i} className="mb-5 text-base leading-9 text-muted-foreground">{text}</p>; })}</div><div className="mt-12 border-l-4 border-accent bg-secondary p-6"><p className="font-extrabold text-primary">យកមេរៀនទៅអនុវត្ត</p><p className="mt-2 text-sm leading-7 text-muted-foreground">ជ្រើសចំណុចមួយពីអត្ថបទនេះ អនុវត្តក្នុងការងាររយៈពេលមួយសប្តាហ៍ ហើយកត់អ្វីដែលអ្នកបានធ្វើ លទ្ធផល និង feedback ដែលទទួលបាន។</p><Link href="/learning" className="mt-5 inline-flex items-center text-sm font-bold text-primary">បន្តទៅ Learning Hub <ArrowRight className="ml-2 h-4 w-4 text-accent" /></Link></div></article><aside><div className="sticky top-24 border-t-2 border-accent pt-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-accent">ប្រធានបទ</p><p className="mt-2 font-extrabold text-primary">{article.category}</p><p className="mt-5 text-sm leading-7 text-muted-foreground">អត្ថបទអប់រំសម្រាប់ការអភិវឌ្ឍបុគ្គលិក និងកន្លែងការងារដែលមានការគោរព។</p><Link href="/articles" className="mt-6 inline-flex items-center text-sm font-bold text-primary">រកអត្ថបទផ្សេងទៀត <ArrowRight className="ml-2 h-4 w-4 text-accent" /></Link></div></aside></div></main></Shell>;
}

function InfoPage({ kind }: { kind: 'about' | 'contact' | 'faq' | 'privacy' | 'terms' | 'safety' }) {
  const content = {
    about: { eyebrow: 'អំពី LY HAW', title: 'យើងធ្វើឲ្យការស្វែងរកការងារ មានភាពច្បាស់លាស់ និងមានមនុស្សនៅពីក្រោយ។', intro: 'LY Haw HR Solution គឺជាក្រុមការងារជ្រើនរើសបុគ្គលិកក្នុងស្រុក ដែលភ្ជាប់មនុស្សមានទេពកោសល្យទៅកាន់ក្រុមហ៊ុនដែលមានការទទួលខុសត្រូវ។' },
    contact: { eyebrow: 'ទំនាក់ទំនង', title: 'មានសំណួរ? មកនិយាយជាមួយយើង។', intro: 'ក្រុមការងាររបស់យើងត្រៀមជួយអ្នកស្វែងយល់អំពីតួនាទី ក្រុមហ៊ុន និងដំណើរការដាក់ពាក្យ។' },
    faq: { eyebrow: 'សំណួរញឹកញាប់', title: 'ចម្លើយសម្រាប់ចំណុចដែលអ្នកចង់ដឹង។', intro: 'ព័ត៌មានសាមញ្ញៗ ដើម្បីឲ្យដំណើរការស្វែងរកការងាររបស់អ្នកមានភាពងាយស្រួល។' },
    privacy: { eyebrow: 'ឯកជនភាព', title: 'ព័ត៌មានរបស់អ្នក ស្ថិតនៅក្នុងការយកចិត្តទុកដាក់របស់យើង។', intro: 'យើងប្រើព័ត៌មានដែលអ្នកចែករំលែក ដើម្បីជួយភ្ជាប់អ្នកទៅនឹងឱកាសដែលសមស្រប និងរក្សាវាដោយការទទួលខុសត្រូវ។' },
    terms: { eyebrow: 'លក្ខខណ្ឌប្រើប្រាស់', title: 'ការប្រើប្រាស់ LY Haw ដោយច្បាស់លាស់ និងគោរពគ្នា។', intro: 'ការណែនាំទាំងនេះជួយឲ្យអ្នក និងក្រុមហ៊ុនប្រើប្រាស់ព័ត៌មានការងារបានដោយស្មោះត្រង់។' },
    safety: { eyebrow: 'សុវត្ថិភាពអ្នកស្វែងរកការងារ', title: 'ឱកាសពិតប្រាកដ គួរតែមានភាពច្បាស់លាស់។', intro: 'LY Haw មិនដែលទាមទារថ្លៃសេវាពីអ្នកស្វែងរកការងារ។ កុំផ្ញើពាក្យសម្ងាត់ ឬព័ត៌មានហិរញ្ញវត្ថុទៅកាន់អ្នកដែលអះអាងថាជាអ្នកជ្រើសរើស។' },
  }[kind];
  return <Shell><main className="container-wide section-space"><div className="mx-auto max-w-3xl"><p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-accent">{content.eyebrow}</p><h1 className="display-title text-4xl font-extrabold leading-tight text-primary sm:text-6xl">{content.title}</h1><p className="mt-7 text-lg leading-8 text-muted-foreground">{content.intro}</p><div className="mt-12 space-y-8">{kind === 'contact' ? <div className="grid gap-4 sm:grid-cols-3"><ContactCard icon={<Phone />} title="ទូរស័ព្ទ" value="+855 99 885 088" /><ContactCard icon={<Mail />} title="អ៊ីមែល" value="lyhawhrsolution@gmail.com" /><ContactCard icon={<MapPin />} title="ទីតាំង" value="Matching Coffee, BE0, ផ្លូវលេខ 259, រាជធានីភ្នំពេញ" /></div> : kind === 'faq' ? <div className="space-y-3">{['តើការដាក់ពាក្យមានការគិតថ្លៃទេ?', 'តើខ្ញុំអាចដាក់ពាក្យតាមវិធីណា?', 'តើខ្ញុំអាចពិនិត្យសុវត្ថិភាពការងារបានដូចម្តេច?'].map((q, i) => <details key={q} open={i === 0} className="rounded-2xl border border-border bg-card p-5"><summary data-testid={`faq-question-${i}`} className="cursor-pointer font-bold text-primary">{q}</summary><p className="mt-3 text-sm leading-7 text-muted-foreground">{i === 0 ? 'ទេ។ LY Haw មិនដែលទាមទារថ្លៃសេវាពីអ្នកស្វែងរកការងារ។' : 'អ្នកអាចប្រើព័ត៌មាន Email ទូរស័ព្ទ ឬ Telegram ដែលមាននៅក្នុងទំព័រការងារ។'}</p></details>)}</div> : <div className="rounded-3xl bg-muted p-7 sm:p-10"><ShieldCheck className="h-9 w-9 text-accent" /><h2 className="mt-5 text-2xl font-extrabold text-primary">{kind === 'safety' ? 'ចំណុចសំខាន់ៗដែលត្រូវចងចាំ' : 'គោលការណ៍របស់យើង'}</h2><ul className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground"><li className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent" /> ព័ត៌មានការងារត្រូវបានបង្ហាញឲ្យច្បាស់ និងងាយពិនិត្យ។</li><li className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent" /> កុំផ្ញើប្រាក់ ឬឯកសារសម្ងាត់ទៅកាន់ប្រភពដែលមិនអាចផ្ទៀងផ្ទាត់បាន។</li><li className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent" /> ប្រសិនបើសង្ស័យ សូមទាក់ទងក្រុមការងារ LY Haw ដោយផ្ទាល់។</li></ul></div>}</div></div></main></Shell>;
}

function ContactCard({ icon, title, value }: { icon: ReactNode; title: string; value: string }) {
  const displayValue = title === 'ទូរស័ព្ទ' ? '+855 99 885 088' : title === 'អ៊ីមែល' ? 'lyhawhrsolution@gmail.com' : value;
  return <div className="rounded-2xl border border-border bg-card p-5"><span className="text-accent">{icon}</span><h3 className="mt-4 text-sm font-bold text-primary">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{displayValue}</p></div>;
}

// AdminPage is now imported from @/pages/admin



function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/career"><Shell><CareerPage /></Shell></Route><Route path="/jobs"><Shell><DiscoverPage /></Shell></Route><Route path="/jobs/:slug" component={JobDetailPage} /><Route path="/learning"><Shell><LearningPage /></Shell></Route><Route path="/companies" component={CompaniesPage} /><Route path="/companies/:slug" component={CompanyDetailPage} /><Route path="/articles" component={ArticlesPage} /><Route path="/articles/:slug" component={ArticleDetailPage} /><Route path="/about"><InfoPage kind="about" /></Route><Route path="/contact"><InfoPage kind="contact" /></Route><Route path="/faq"><InfoPage kind="faq" /></Route><Route path="/privacy"><InfoPage kind="privacy" /></Route><Route path="/terms"><InfoPage kind="terms" /></Route><Route path="/safety"><InfoPage kind="safety" /></Route><Route path="/test"><Shell><TestPage /></Shell></Route><Route path="/admin" component={AdminPage} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
