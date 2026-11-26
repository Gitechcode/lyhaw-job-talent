import { useRef, useState, type FormEvent } from 'react';
import {
  Brain,
  BriefcaseBusiness,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UploadCloud,
  FileText,
  X,
} from 'lucide-react';
import { Link } from 'wouter';
import { useRequestUploadUrl } from '@workspace/api-client-react';

// ─── Types ──────────────────────────────────────────────────────────────────

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

// ─── Constants ───────────────────────────────────────────────────────────────

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_EXTS = new Set(['pdf', 'doc', 'docx']);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const services = [
  {
    id: 'assessment',
    icon: Brain,
    label: 'ស្វែងយល់ពីខ្លួនឯង',
    title: 'ស្គាល់ខ្លួនឯង — ខ្ញុំជានរណា?',
    desc: 'ធ្វើតេស្ត IQ & EQ ស្វែងរកចំណុចខ្លាំង និងជ្រើសរើសវិថីអាជីពដែលត្រូវជាមួយអ្នក។',
    href: '/test',
    cta: 'ចាប់ផ្តើមតេស្ត',
    accent: 'hsl(38 95% 42%)',   // amber-ish navy brand gold — WCAG AA
    iconCls: 'bg-amber-50 text-amber-700',
    ringCls: 'focus-visible:ring-amber-500',
    borderHover: 'hover:border-amber-400',
  },
  {
    id: 'jobs',
    icon: BriefcaseBusiness,
    label: 'ស្វែងរកការងារ',
    title: 'ខ្ញុំចង់បានការងារល្អ',
    desc: 'ស្វែងរកការងារពីក្រុមហ៊ុនដែលបានផ្ទៀងផ្ទាត់ — ប្រាក់ខែច្បាស់ លក្ខខណ្ឌស្មើភាព។',
    href: '/jobs',
    cta: 'ស្វែងរកការងារ',
    accent: 'hsl(152 60% 32%)',  // emerald dark — AA on white
    iconCls: 'bg-emerald-50 text-emerald-700',
    ringCls: 'focus-visible:ring-emerald-500',
    borderHover: 'hover:border-emerald-400',
    primary: true,
  },
  {
    id: 'recruit',
    icon: Users,
    label: 'ជ្រើសរើសបុគ្គលិក',
    title: 'ខ្ញុំស្វែងរកបុគ្គលិក',
    desc: 'ជ្រើសរើសបុគ្គលិកមានជំនាញ ឆ្លើយតបទៅនឹងតម្រូវការក្រុមហ៊ុនបានរហ័ស។',
    href: '/contact',
    cta: 'ទំនាក់ទំនង',
    accent: 'hsl(213 80% 32%)',  // navy blue
    iconCls: 'bg-blue-50 text-blue-700',
    ringCls: 'focus-visible:ring-blue-500',
    borderHover: 'hover:border-blue-400',
  },
  {
    id: 'hr-consulting',
    icon: Building2,
    label: 'ដំណោះស្រាយ HR',
    title: 'ខ្ញុំត្រូវការដំណោះស្រាយ HR',
    desc: 'ប្រឹក្សាបង្កើតគោលការណ៍ HR រចនាសម្ព័ន្ធស្ថាប័ន និងអនុលោមភាពច្បាប់ការងារ។',
    href: null, // opens inline inquiry form
    cta: 'ស្នើសុំប្រឹក្សា',
    accent: 'hsl(270 60% 38%)',  // purple dark — AA on white
    iconCls: 'bg-purple-50 text-purple-700',
    ringCls: 'focus-visible:ring-purple-500',
    borderHover: 'hover:border-purple-400',
  },
  {
    id: 'learning',
    icon: TrendingUp,
    label: 'អភិវឌ្ឍខ្លួន',
    title: 'ខ្ញុំត្រូវការអភិវឌ្ឍខ្លួន',
    desc: 'ពង្រីកសក្តានុពលតាមរយៈចំណេះដឹង HR ជំនាញទន់ និងភាពជាអ្នកដឹកនាំ។',
    href: '/learning',
    cta: 'ចូលរៀន',
    accent: 'hsl(346 70% 38%)',  // rose dark — AA on white
    iconCls: 'bg-rose-50 text-rose-700',
    ringCls: 'focus-visible:ring-rose-500',
    borderHover: 'hover:border-rose-400',
  },
] as const;

// ─── CV Upload ───────────────────────────────────────────────────────────────

function validateFile(file: File): string | null {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_EXTS.has(ext) && !ALLOWED_TYPES.has(file.type)) {
    return 'ទ្រង់ទ្រាយឯកសារមិនត្រឹមត្រូវ។ សូមប្រើ PDF, DOC ឬ DOCX ។';
  }
  if (file.size > MAX_BYTES) {
    return `ឯកសារធំពេក (${(file.size / 1024 / 1024).toFixed(1)} MB)។ ទំហំអតិបរមា ១០ MB ។`;
  }
  if (file.size < 1) {
    return 'ឯកសារទទេ។ សូមជ្រើសរើសឯកសារ CV ឡើងវិញ។';
  }
  return null;
}

function getContentType(file: File): string {
  if (file.type && ALLOWED_TYPES.has(file.type)) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'doc') return 'application/msword';
  return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
}

function CvUploadSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const upload = useRequestUploadUrl();

  const reset = () => {
    setFile(null);
    setStatus('idle');
    setValidationError(null);
    setServerError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const submitFile = async (candidate: File) => {
    const err = validateFile(candidate);
    if (err) { setValidationError(err); setStatus('idle'); return; }
    setValidationError(null);
    setServerError(null);
    setFile(candidate);
    setStatus('uploading');
    try {
      const contentType = getContentType(candidate);
      const res = await upload.mutateAsync({ data: { name: candidate.name, size: candidate.size, contentType } });
      const put = await fetch(res.uploadURL, { method: 'PUT', headers: { 'Content-Type': contentType }, body: candidate });
      if (!put.ok) throw new Error(`HTTP ${put.status}`);
      setStatus('success');
    } catch {
      setStatus('error');
      setServerError('មិនអាចផ្ញើ CV បានទេ។ សូមព្យាយាមម្តងទៀត ឬផ្ញើតាម Email ។');
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void submitFile(f);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  return (
    <section aria-labelledby="cv-section-title" className="border-t border-border bg-muted/40">
      <div className="container-wide py-12 sm:py-14">
        <div className="mx-auto max-w-2xl">
          {/* Heading */}
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/60">ផ្ញើ CV</p>
          <h2 id="cv-section-title" className="mt-1.5 text-xl font-extrabold text-primary sm:text-2xl">
            ផ្ញើ CV របស់អ្នកមកយើង
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            ក្រុមការងារ LY Haw នឹងពិនិត្យ CV និងស្វែងរកឱកាសការងារដែលស័ក្តិសមបំផុតសម្រាប់អ្នក។
            ព័ត៌មានរបស់អ្នកនឹងត្រូវបានរក្សាជាឯកជន —{' '}
            <Link href="/privacy" className="font-medium text-primary underline underline-offset-2 hover:text-accent">
              គោលការណ៍ឯកជនភាព
            </Link>
            ។
          </p>

          {/* Upload area */}
          {status !== 'success' && (
            <div
              role="button"
              tabIndex={0}
              aria-label="ជ្រើសរើស ឬទម្លាក់ CV នៅទីនេះ"
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
              className={[
                'mt-5 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                dragging
                  ? 'border-primary bg-primary/5'
                  : validationError
                  ? 'border-destructive/50 bg-destructive/5'
                  : 'border-border bg-background hover:border-primary/50 hover:bg-primary/3',
              ].join(' ')}
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
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-semibold text-primary">
                    កំពុងផ្ញើ <span className="font-bold">{file?.name}</span>…
                  </p>
                </>
              ) : file && !validationError ? (
                <>
                  <FileText className="h-8 w-8 text-primary/60" />
                  <p className="text-sm text-muted-foreground">{file.name}</p>
                </>
              ) : (
                <>
                  <UploadCloud className="h-8 w-8 text-primary/50" />
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      ទម្លាក់ CV នៅទីនេះ ឬ{' '}
                      <span className="underline underline-offset-2">ចុចជ្រើសរើសឯកសារ</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">PDF, DOC, DOCX · រហូតដល់ ១០ MB</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Explicit choose-file button for motor/keyboard users */}
          {status === 'idle' && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-primary transition-colors hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <UploadCloud className="h-4 w-4" />
              ជ្រើសរើសឯកសារ CV
            </button>
          )}

          {/* Validation error */}
          {validationError && (
            <div role="alert" className="mt-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-destructive">{validationError}</p>
                <button onClick={reset} className="mt-1 text-xs text-destructive/80 underline hover:text-destructive">
                  ជ្រើសរើសឯកសារផ្សេង
                </button>
              </div>
            </div>
          )}

          {/* Server error */}
          {status === 'error' && serverError && (
            <div role="alert" className="mt-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-destructive">{serverError}</p>
                <button onClick={reset} className="mt-1 text-xs text-destructive/80 underline hover:text-destructive">
                  ព្យាយាមម្តងទៀត
                </button>
              </div>
            </div>
          )}

          {/* Success */}
          {status === 'success' && (
            <div role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">
                    {file?.name} — បានផ្ញើដោយជោគជ័យ!
                  </p>
                  <p className="mt-1 text-sm leading-6 text-emerald-700">
                    ក្រុមការងារ LY Haw នឹងពិនិត្យ CV របស់អ្នក ហើយទំនាក់ទំនងក្នុងរយៈពេល ២–៣ ថ្ងៃធ្វើការ។
                  </p>
                </div>
              </div>
              <button
                onClick={reset}
                className="mt-3 text-xs font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
              >
                ផ្ញើ CV ម្តងទៀត
              </button>
            </div>
          )}

          {/* Fallback email */}
          <p className="mt-5 text-xs text-muted-foreground">
            ឬផ្ញើ CV ដោយផ្ទាល់តាម{' '}
            <a href="mailto:lyhawhrsolution@gmail.com" className="font-medium text-primary underline-offset-2 hover:underline">
              lyhawhrsolution@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── HR Consulting Inquiry ────────────────────────────────────────────────────

function HrConsultingPanel({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  // Trap focus inside panel & restore on close
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab') return;
    const el = dialogRef.current;
    if (!el) return;
    const focusable = Array.from(
      el.querySelectorAll<HTMLElement>('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])')
    ).filter((n) => !n.hasAttribute('disabled'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  // Focus first element on mount
  const panelRef = (el: HTMLDivElement | null) => {
    if (el) { (dialogRef as React.MutableRefObject<HTMLDivElement | null>).current = el; setTimeout(() => firstFocusRef.current?.focus(), 10); }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hr-consulting-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-primary/60 backdrop-blur-[2px] sm:items-center sm:p-4"
      onClick={(e) => { if (e.currentTarget === e.target) onClose(); }}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-lg rounded-t-2xl bg-background px-6 pb-8 pt-6 shadow-2xl sm:rounded-2xl sm:px-8"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/55">HR Consulting</p>
            <h2 id="hr-consulting-title" className="mt-1 text-xl font-extrabold text-primary">
              ស្នើសុំប្រឹក្សា HR
            </h2>
          </div>
          <button
            ref={firstFocusRef}
            type="button"
            onClick={onClose}
            aria-label="បិទ"
            className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-5 text-sm leading-7 text-muted-foreground">
          ទំនាក់ទំនងក្រុមការងារ LY Haw ដោយផ្ទាល់ ដើម្បីពិភាក្សាអំពីការបង្កើត HR Policy, Organizational Design,
          Labor Law Compliance, ឬការបណ្តុះបណ្តាលផ្ទៃក្នុង។
        </p>

        <div className="space-y-3">
          <a
            href="tel:+85599885088"
            className="flex min-h-[48px] items-center gap-3 rounded-xl border border-border bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Phone className="h-4 w-4 shrink-0" />
            <span>+855 99 885 088</span>
            <span className="ml-auto text-xs font-normal text-primary-foreground/70">ទូរស័ព្ទ</span>
          </a>
          <a
            href="mailto:lyhawhrsolution@gmail.com"
            className="flex min-h-[48px] items-center gap-3 rounded-xl border border-border bg-background px-5 py-3 text-sm font-bold text-primary transition-colors hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Mail className="h-4 w-4 shrink-0" />
            <span>lyhawhrsolution@gmail.com</span>
          </a>
          <a
            href="https://t.me/lyhawhrsolution"
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[48px] items-center gap-3 rounded-xl border border-border bg-background px-5 py-3 text-sm font-bold text-primary transition-colors hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Send className="h-4 w-4 shrink-0" />
            <span>Telegram</span>
          </a>
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          ឬចូលទំព័រ{' '}
          <Link href="/contact" onClick={onClose} className="font-medium text-primary underline-offset-2 hover:underline">
            ទំនាក់ទំនង
          </Link>{' '}
          ដើម្បីបំពេញបែបបទស្នើសុំ។
        </p>
      </div>
    </div>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({
  service,
  onHrConsult,
  isPrimary,
}: {
  service: (typeof services)[number];
  onHrConsult: () => void;
  isPrimary: boolean;
}) {
  const Icon = service.icon;

  const cardCls = [
    'group relative flex flex-col rounded-xl border bg-card transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    service.ringCls,
    service.borderHover,
    isPrimary
      ? 'border-primary shadow-[0_0_0_2px_hsl(var(--primary)/0.12)] hover:shadow-md'
      : 'border-border hover:shadow-sm',
  ].join(' ');

  const inner = (
    <div className="flex h-full flex-col p-5 sm:p-6">
      {/* Icon + optional "primary" badge */}
      <div className="flex items-center justify-between">
        <span className={`inline-grid h-10 w-10 place-items-center rounded-lg ${service.iconCls}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        {isPrimary && (
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold text-primary-foreground">
            ស្វែងរក
          </span>
        )}
      </div>

      {/* Text */}
      <div className="mt-4 flex-1">
        <h2 className="text-[15px] font-extrabold leading-snug text-primary">{service.title}</h2>
        <p className="mt-2 text-[13px] leading-[1.7] text-muted-foreground">{service.desc}</p>
      </div>

      {/* CTA */}
      <div className="mt-5 flex items-center gap-1.5 text-[13px] font-bold text-primary group-hover:gap-2.5 group-focus-visible:gap-2.5">
        <span>{service.cta}</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5" aria-hidden="true" />
      </div>
    </div>
  );

  // HR Consulting opens panel instead of navigating
  if (service.id === 'hr-consulting') {
    return (
      <button
        type="button"
        onClick={onHrConsult}
        className={`${cardCls} text-left`}
        aria-haspopup="dialog"
      >
        {inner}
      </button>
    );
  }

  return (
    <Link href={service.href!} className={cardCls}>
      {inner}
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CareerPage() {
  const [showHrPanel, setShowHrPanel] = useState(false);
  // Restore focus to the HR card button after panel closes
  const hrCardRef = useRef<HTMLButtonElement | null>(null);

  const openHrPanel = () => setShowHrPanel(true);
  const closeHrPanel = () => {
    setShowHrPanel(false);
    // Restore focus to the trigger
    setTimeout(() => {
      const btn = document.querySelector<HTMLButtonElement>('[data-service="hr-consulting"]');
      btn?.focus();
    }, 10);
  };

  return (
    <>
      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="border-b border-border/60 bg-background pb-10 pt-10 sm:pt-12">
          <div className="container-wide">
            {/* Eyebrow */}
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/55">
              LY Haw HR Solution · Career Center
            </p>

            {/* Headline + actions in one row on desktop */}
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="display-title text-2xl font-extrabold text-primary sm:text-3xl md:text-4xl leading-[1.25]">
                  តើអ្នកត្រូវការអ្វីនៅថ្ងៃនេះ?
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
                  ជ្រើសរើសសេវាកម្មមួយខាងក្រោម ហើយយើងនឹងជួយអ្នកឱ្យឈានទៅមុខ។
                </p>
              </div>

              {/* Primary + secondary actions */}
              <div className="flex flex-wrap gap-2 shrink-0">
                <Link
                  href="/jobs"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-px hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  ស្វែងរកការងារ <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/test"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold text-primary transition-all hover:border-primary/50 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  ស្វែងយល់ពីខ្លួនឯង
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Service cards ─────────────────────────────────── */}
        <section aria-labelledby="services-heading" className="bg-muted/30 py-10 sm:py-12">
          <div className="container-wide">
            <h2 id="services-heading" className="sr-only">សេវាកម្មចម្បង</h2>

            {/* 5 cards: 3-col then 2-col on desktop, 1-col on mobile */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 3).map((svc) => (
                <ServiceCard
                  key={svc.id}
                  service={svc}
                  onHrConsult={openHrPanel}
                  isPrimary={svc.primary === true}
                />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 lg:max-w-[calc(66.67%+0.5rem)]">
              {services.slice(3).map((svc) => (
                <ServiceCard
                  key={svc.id}
                  service={svc}
                  onHrConsult={openHrPanel}
                  isPrimary={false}
                />
              ))}
            </div>

            {/* HR consulting trigger accessible label */}
            <p className="mt-6 text-xs text-muted-foreground">
              * ការប្រឹក្សា HR ត្រូវការទំនាក់ទំនងដោយផ្ទាល់ — ចុចលើ «ខ្ញុំត្រូវការដំណោះស្រាយ HR» ដើម្បីចាប់ផ្តើម។
            </p>
          </div>
        </section>

        {/* ── CV Upload ─────────────────────────────────────── */}
        <CvUploadSection />
      </main>

      {/* ── HR Consulting Panel ───────────────────────────── */}
      {showHrPanel && <HrConsultingPanel onClose={closeHrPanel} />}
    </>
  );
}
