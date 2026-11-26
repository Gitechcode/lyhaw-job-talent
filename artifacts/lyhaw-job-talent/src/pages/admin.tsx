import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import {
  useListCompanies,
  useListArticles,
  useGetDashboard,
} from '@workspace/api-client-react';
import type { Job, Company, Article, DashboardSummary } from '@workspace/api-client-react';
import {
  ArrowRight, Building2, Briefcase, FileText, LayoutDashboard,
  Plus, Pencil, Trash2, X, CheckCircle2, AlertCircle, Loader2,
  MapPin, Phone, Mail, Send, BadgeCheck,
  BookOpen, LockKeyhole, LogOut, Search,
} from 'lucide-react';

// ─── Logo ────────────────────────────────────────────────────────────────────
function Logo({ inverse = false, compactOnMobile = false }: { inverse?: boolean; compactOnMobile?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <img src="/lyhaw-logo.png" alt="LY Haw Logo" className="h-11 w-11 object-contain" />
      <span className={`${compactOnMobile ? 'hidden sm:block' : ''} leading-tight`}>
        <strong className={`block text-[15px] tracking-tight ${inverse ? 'text-primary-foreground' : 'text-primary'}`}>LY Haw Job Talent</strong>
        <small className={`block text-[11px] ${inverse ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>ការងារល្អ ចាប់ផ្តើមពីទីនេះ</small>
      </span>
    </Link>
  );
}

// ─── API helpers (direct fetch — no zod wrapper needed for admin) ─────────────
const API = '/api';
const ADMIN_SESSION_KEY = 'lyhaw.admin-key';

async function apiFetch(path: string, options?: RequestInit) {
  const adminKey = sessionStorage.getItem(ADMIN_SESSION_KEY) || '';
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(adminKey ? { 'X-Admin-Key': adminKey } : {}) },
    ...options,
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(payload?.error || `API error ${res.status}`);
  }
  return res.json();
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl text-sm font-semibold ${type === 'success' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}`}>
      {type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
      {msg}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="h-4 w-4" /></button>
    </div>
  );
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-primary/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-6 py-4 z-10">
          <h2 className="text-lg font-extrabold text-primary">{title}</h2>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

const inputClass = 'w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent';
const textareaClass = `${inputClass} resize-none`;
const selectClass = `${inputClass} cursor-pointer`;

// ─── Confirm delete ───────────────────────────────────────────────────────────
function ConfirmDialog({ label, onConfirm, onCancel }: { label: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/75 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl text-center">
        <Trash2 className="mx-auto mb-3 h-10 w-10 text-accent" />
        <h3 className="text-lg font-extrabold text-primary">លុបចេញ?</h3>
        <p className="mt-2 text-sm text-muted-foreground">"{label}" នឹងត្រូវបានលុបចោលជាអចិន្ត្រៃយ៍។</p>
        <div className="mt-5 flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-bold hover:bg-muted">បោះបង់</button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-bold text-accent-foreground hover:bg-accent/85">លុប</button>
        </div>
      </div>
    </div>
  );
}

// ─── JOBS TAB ─────────────────────────────────────────────────────────────────
function JobsTab({ toast }: { toast: (m: string, t: 'success' | 'error') => void }) {
  const { data: companiesData } = useListCompanies();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const companies = companiesData || [];

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Job | null>(null);
  const [confirm, setConfirm] = useState<Job | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch('/admin/jobs');
      setJobs(response.data || []);
    } catch {
      toast('មិនអាចទាញបញ្ជីការងារបានទេ', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void loadJobs(); }, []);

  const blank = {
    titleEnglish: '', titleKhmer: '', companyId: companies[0]?.id || '',
    category: '', location: 'Phnom Penh', jobType: 'Full-time',
    workArrangement: 'On-site', salary: '', experience: '', education: '',
    summary: '', description: '', deadline: '', featured: false, urgent: false,
    applicationEmail: '', applicationPhone: '', telegram: '',
    responsibilities: '', requirements: '', benefits: '', skills: '',
  };
  const [form, setForm] = useState(blank);

  function openCreate() { setForm({ ...blank, companyId: companies[0]?.id || '' }); setEditing(null); setModal('create'); }
  function openEdit(job: Job) {
    setEditing(job);
    setForm({
      titleEnglish: job.titleEnglish, titleKhmer: job.titleKhmer || '',
      companyId: job.company.id, category: job.category, location: job.location,
      jobType: job.jobType, workArrangement: job.workArrangement, salary: job.salary || '',
      experience: job.experience || '', education: job.education || '',
      summary: job.summary || '', description: job.description || '',
      deadline: job.deadline ? new Date(job.deadline).toISOString().slice(0, 10) : '',
      featured: job.featured, urgent: job.urgent,
      applicationEmail: job.applicationEmail || '', applicationPhone: job.applicationPhone || '',
      telegram: job.telegram || '',
      responsibilities: (job.responsibilities || []).join('\n'),
      requirements: (job.requirements || []).join('\n'),
      benefits: (job.benefits || []).join('\n'),
      skills: (job.skills || []).join(', '),
    });
    setModal('edit');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        ...form,
        responsibilities: form.responsibilities.split('\n').filter(Boolean),
        requirements: form.requirements.split('\n').filter(Boolean),
        benefits: form.benefits.split('\n').filter(Boolean),
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (modal === 'create') {
        await apiFetch('/jobs', { method: 'POST', body: JSON.stringify(body) });
        toast('បានបន្ថែមការងារ!', 'success');
      } else {
        await apiFetch(`/jobs/${editing!.id}`, { method: 'PUT', body: JSON.stringify(body) });
        toast('បានធ្វើបច្ចុប្បន្នភាព!', 'success');
      }
      setModal(null);
      await loadJobs();
    } catch {
      toast('មានបញ្ហា សូមព្យាយាមម្តងទៀត', 'error');
    } finally { setSaving(false); }
  }

  async function handleDelete(job: Job) {
    try {
      await apiFetch(`/jobs/${job.id}`, { method: 'DELETE' });
      toast('បានលុបការងារ!', 'success');
      setConfirm(null);
      await loadJobs();
    } catch { toast('មិនអាចលុបបានទេ', 'error'); }
  }

  const filtered = jobs.filter(j =>
    !search || `${j.titleEnglish} ${j.titleKhmer} ${j.company.name}`.toLowerCase().includes(search.toLowerCase())
  );

  const locations = ['Phnom Penh', 'Siem Reap', 'Battambang', 'Kampot', 'Sihanoukville', 'Kandal', 'Remote', 'Other'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
  const arrangements = ['On-site', 'Hybrid', 'Remote-friendly', 'Remote'];
  const categories = ['Sales & Marketing', 'Information Technology', 'Human Resources', 'Finance & Accounting', 'Administration', 'Hospitality & Tourism', 'Customer Service', 'Creative & Design', 'Supply Chain', 'Retail & Operations', 'Operations', 'Digital Commerce', 'Other'];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ស្វែងរកការងារ..." className={inputClass + ' max-w-sm'} />
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> បន្ថែមការងារ
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-primary">ការងារ</th>
                <th className="hidden px-4 py-3 text-left font-bold text-primary md:table-cell">ក្រុមហ៊ុន</th>
                <th className="hidden px-4 py-3 text-left font-bold text-primary lg:table-cell">ទីតាំង</th>
                <th className="hidden px-4 py-3 text-left font-bold text-primary lg:table-cell">ស្ថានភាព</th>
                <th className="px-4 py-3 text-right font-bold text-primary">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">មិនមានការងារ</td></tr>
              ) : filtered.map(job => (
                <tr key={job.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-primary">{job.titleKhmer || job.titleEnglish}</p>
                    <p className="text-xs text-muted-foreground">{job.titleEnglish} · {job.reference}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{job.company.name}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{job.location}</td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {job.featured && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-bold text-accent">Featured</span>}
                      {job.urgent && <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-accent">Urgent</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/jobs/${job.slug}`} className="rounded-lg border border-border p-1.5 hover:bg-muted" title="មើល"><ArrowRight className="h-4 w-4" /></Link>
                      <button onClick={() => openEdit(job)} className="rounded-lg border border-border p-1.5 hover:bg-muted" title="កែ"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setConfirm(job)} className="rounded-lg border border-accent/40 p-1.5 text-accent hover:bg-secondary" title="លុប"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirm && <ConfirmDialog label={confirm.titleEnglish} onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />}

      {modal && (
        <Modal title={modal === 'create' ? 'បន្ថែមការងារថ្មី' : 'កែប្រែការងារ'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="ចំណងជើងអង់គ្លេស *">
                <input required value={form.titleEnglish} onChange={e => setForm(f => ({ ...f, titleEnglish: e.target.value }))} className={inputClass} placeholder="e.g. Sales Executive" />
              </Field>
              <Field label="ចំណងជើងខ្មែរ">
                <input value={form.titleKhmer} onChange={e => setForm(f => ({ ...f, titleKhmer: e.target.value }))} className={inputClass} placeholder="e.g. អ្នកលក់" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="ក្រុមហ៊ុន *">
                <select required value={form.companyId} onChange={e => setForm(f => ({ ...f, companyId: e.target.value }))} className={selectClass}>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="ប្រភេទ *">
                <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={selectClass}>
                  <option value="">-- ជ្រើសរើស --</option>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="ទីតាំង *">
                <select required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className={selectClass}>
                  {locations.map(l => <option key={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="ប្រភេទការងារ">
                <select value={form.jobType} onChange={e => setForm(f => ({ ...f, jobType: e.target.value }))} className={selectClass}>
                  {jobTypes.map(j => <option key={j}>{j}</option>)}
                </select>
              </Field>
              <Field label="ការរៀបចំការងារ">
                <select value={form.workArrangement} onChange={e => setForm(f => ({ ...f, workArrangement: e.target.value }))} className={selectClass}>
                  {arrangements.map(a => <option key={a}>{a}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="ប្រាក់ខែ">
                <input value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} className={inputClass} placeholder="$500 - $700" />
              </Field>
              <Field label="បទពិសោធន៍">
                <input value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} className={inputClass} placeholder="2+ years" />
              </Field>
              <Field label="ផុតកំណត់">
                <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className={inputClass} />
              </Field>
            </div>
            <Field label="ការសិក្សា">
              <input value={form.education} onChange={e => setForm(f => ({ ...f, education: e.target.value }))} className={inputClass} placeholder="Bachelor's degree" />
            </Field>
            <Field label="សង្ខេប *">
              <textarea required rows={2} value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} className={textareaClass} />
            </Field>
            <Field label="ពិស្តារ">
              <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={textareaClass} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="ទំនួលខុសត្រូវ (1 ក្នុងមួយបន្ទាត់)">
                <textarea rows={3} value={form.responsibilities} onChange={e => setForm(f => ({ ...f, responsibilities: e.target.value }))} className={textareaClass} placeholder="Build relationships&#10;Report weekly..." />
              </Field>
              <Field label="លក្ខខណ្ឌ (1 ក្នុងមួយបន្ទាត់)">
                <textarea rows={3} value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} className={textareaClass} />
              </Field>
              <Field label="អត្ថប្រយោជន៍ (1 ក្នុងមួយបន្ទាត់)">
                <textarea rows={3} value={form.benefits} onChange={e => setForm(f => ({ ...f, benefits: e.target.value }))} className={textareaClass} />
              </Field>
            </div>
            <Field label="ជំនាញ (ដោយក្បៀស)">
              <input value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} className={inputClass} placeholder="React, TypeScript, CSS" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Email ដាក់ពាក្យ">
                <input type="email" value={form.applicationEmail} onChange={e => setForm(f => ({ ...f, applicationEmail: e.target.value }))} className={inputClass} />
              </Field>
              <Field label="ទូរស័ព្ទ">
                <input value={form.applicationPhone} onChange={e => setForm(f => ({ ...f, applicationPhone: e.target.value }))} className={inputClass} />
              </Field>
              <Field label="Telegram">
                <input value={form.telegram} onChange={e => setForm(f => ({ ...f, telegram: e.target.value }))} className={inputClass} placeholder="https://t.me/..." />
              </Field>
            </div>
            <div className="flex gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="rounded" />
                ការងារពិសេស (Featured)
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={form.urgent} onChange={e => setForm(f => ({ ...f, urgent: e.target.checked }))} className="rounded" />
                បន្ទាន់ (Urgent)
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModal(null)} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-bold hover:bg-muted">បោះបង់</button>
              <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-bold text-accent-foreground hover:opacity-90 disabled:opacity-60">
                {saving ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : modal === 'create' ? 'បន្ថែម' : 'រក្សាទុក'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── COMPANIES TAB ────────────────────────────────────────────────────────────
function CompaniesTab({ toast }: { toast: (m: string, t: 'success' | 'error') => void }) {
  const { data: companies = [], refetch, isLoading } = useListCompanies();
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Company | null>(null);
  const [confirm, setConfirm] = useState<Company | null>(null);
  const [saving, setSaving] = useState(false);

  const blank = { name: '', industry: '', location: 'Phnom Penh', description: '', website: '', logo: '', verified: false };
  const [form, setForm] = useState(blank);

  function openCreate() { setForm(blank); setEditing(null); setModal('create'); }
  function openEdit(c: Company) {
    setEditing(c);
    setForm({ name: c.name, industry: c.industry, location: c.location, description: c.description || '', website: c.website || '', logo: c.logo || '', verified: c.verified });
    setModal('edit');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'create') {
        await apiFetch('/companies', { method: 'POST', body: JSON.stringify(form) });
        toast('បានបន្ថែមក្រុមហ៊ុន!', 'success');
      } else {
        await apiFetch(`/companies/${editing!.id}`, { method: 'PUT', body: JSON.stringify(form) });
        toast('បានធ្វើបច្ចុប្បន្នភាព!', 'success');
      }
      setModal(null); refetch();
    } catch { toast('មានបញ្ហា', 'error'); }
    finally { setSaving(false); }
  }

  async function handleDelete(c: Company) {
    try {
      await apiFetch(`/companies/${c.id}`, { method: 'DELETE' });
      toast('បានលុបក្រុមហ៊ុន!', 'success');
      setConfirm(null); refetch();
    } catch { toast('មិនអាចលុបបានទេ', 'error'); }
  }

  const locations = ['Phnom Penh', 'Siem Reap', 'Battambang', 'Kampot', 'Sihanoukville', 'Other'];
  const industries = ['Technology', 'Retail & Consumer', 'Hospitality', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'NGO', 'Other'];

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> បន្ថែមក្រុមហ៊ុន
        </button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map(c => (
            <div key={c.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-secondary text-sm font-bold text-primary">
                    {c.logo ? <img src={c.logo} alt={c.name} className="h-full w-full object-contain" /> : c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-primary">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.industry}</p>
                  </div>
                </div>
                {c.verified && <BadgeCheck className="h-5 w-5 shrink-0 text-accent" />}
              </div>
              <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">{c.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {c.location}
              </div>
              <div className="mt-4 flex gap-2 border-t border-border pt-4">
                <button onClick={() => openEdit(c)} className="flex-1 rounded-lg border border-border py-1.5 text-xs font-bold hover:bg-muted">
                  <Pencil className="mr-1 inline h-3.5 w-3.5" /> កែ
                </button>
                <button onClick={() => setConfirm(c)} className="flex-1 rounded-lg border border-accent/40 py-1.5 text-xs font-bold text-accent hover:bg-secondary">
                  <Trash2 className="mr-1 inline h-3.5 w-3.5" /> លុប
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirm && <ConfirmDialog label={confirm.name} onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />}

      {modal && (
        <Modal title={modal === 'create' ? 'បន្ថែមក្រុមហ៊ុនថ្មី' : 'កែប្រែក្រុមហ៊ុន'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="ឈ្មោះក្រុមហ៊ុន *">
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="ឧស្សាហកម្ម *">
                <select required value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} className={selectClass}>
                  <option value="">-- ជ្រើស --</option>
                  {industries.map(i => <option key={i}>{i}</option>)}
                </select>
              </Field>
              <Field label="ទីតាំង *">
                <select required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className={selectClass}>
                  {locations.map(l => <option key={l}>{l}</option>)}
                </select>
              </Field>
            </div>
            <Field label="ពណ៌នា">
              <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={textareaClass} />
            </Field>
            <Field label="Website">
              <input type="url" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className={inputClass} placeholder="https://..." />
            </Field>
            <Field label="Logo URL">
              <input value={form.logo} onChange={e => setForm(f => ({ ...f, logo: e.target.value }))} className={inputClass} placeholder="https://..." />
            </Field>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={form.verified} onChange={e => setForm(f => ({ ...f, verified: e.target.checked }))} />
              ក្រុមហ៊ុនបានផ្ទៀងផ្ទាត់ (Verified)
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModal(null)} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-bold hover:bg-muted">បោះបង់</button>
              <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-bold text-accent-foreground hover:opacity-90 disabled:opacity-60">
                {saving ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : modal === 'create' ? 'បន្ថែម' : 'រក្សាទុក'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── ARTICLES TAB ─────────────────────────────────────────────────────────────
function ArticlesTab({ toast }: { toast: (m: string, t: 'success' | 'error') => void }) {
  const { data: articles = [], refetch, isLoading } = useListArticles();
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Article | null>(null);
  const [confirm, setConfirm] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);

  const blank = { title: '', category: '', excerpt: '', content: '', author: '', image: '', readTime: '3 min read' };
  const [form, setForm] = useState(blank);

  function openCreate() { setForm(blank); setEditing(null); setModal('create'); }
  async function openEdit(a: Article) {
    setEditing(a);
    setForm({ title: a.title, category: a.category, excerpt: a.excerpt, content: '', author: '', image: a.image || '', readTime: a.readTime || '3 min read' });
    setModal('edit');
    try {
      const detail = await apiFetch(`/articles/${a.slug}`);
      setForm({
        title: detail.title,
        category: detail.category,
        excerpt: detail.excerpt,
        content: detail.body || '',
        author: detail.author || '',
        image: detail.image || '',
        readTime: detail.readTime || '3 min read',
      });
    } catch {
      toast('មិនអាចទាញមាតិកាអត្ថបទពេញបានទេ', 'error');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'create') {
        await apiFetch('/articles', { method: 'POST', body: JSON.stringify(form) });
        toast('បានបន្ថែមអត្ថបទ!', 'success');
      } else {
        await apiFetch(`/articles/${editing!.id}`, { method: 'PUT', body: JSON.stringify(form) });
        toast('បានធ្វើបច្ចុប្បន្នភាព!', 'success');
      }
      setModal(null); refetch();
    } catch { toast('មានបញ្ហា', 'error'); }
    finally { setSaving(false); }
  }

  async function handleDelete(a: Article) {
    try {
      await apiFetch(`/articles/${a.id}`, { method: 'DELETE' });
      toast('បានលុបអត្ថបទ!', 'success');
      setConfirm(null); refetch();
    } catch { toast('មិនអាចលុបបានទេ', 'error'); }
  }

  const articleCategories = ['ការជ្រើសរើសបុគ្គលិក', 'ចំណេះដឹង HR', 'ព័ត៌មានការងារ', 'ការអភិវឌ្ឍអាជីព', 'ដំណឹងក្រុមហ៊ុន', 'Other'];

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> បន្ថែមអត្ថបទ
        </button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-primary">ចំណងជើង</th>
                <th className="hidden px-4 py-3 text-left font-bold text-primary md:table-cell">ប្រភេទ</th>
                <th className="hidden px-4 py-3 text-left font-bold text-primary lg:table-cell">ពេលវេលា</th>
                <th className="px-4 py-3 text-right font-bold text-primary">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {articles.length === 0 ? (
                <tr><td colSpan={4} className="py-12 text-center text-muted-foreground">មិនមានអត្ថបទ</td></tr>
              ) : articles.map(a => (
                <tr key={a.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-primary line-clamp-1">{a.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{a.excerpt}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{a.category}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{a.readTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(a)} className="rounded-lg border border-border p-1.5 hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setConfirm(a)} className="rounded-lg border border-accent/40 p-1.5 text-accent hover:bg-secondary"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirm && <ConfirmDialog label={confirm.title} onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />}

      {modal && (
        <Modal title={modal === 'create' ? 'បន្ថែមអត្ថបទថ្មី' : 'កែប្រែអត្ថបទ'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="ចំណងជើង *">
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputClass} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="ប្រភេទ *">
                <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={selectClass}>
                  <option value="">-- ជ្រើស --</option>
                  {articleCategories.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="ពេលវេលាអាន">
                <input value={form.readTime} onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))} className={inputClass} placeholder="5 min read" />
              </Field>
            </div>
            <Field label="អ្នកនិពន្ធ">
              <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className={inputClass} />
            </Field>
            <Field label="រូបភាព URL">
              <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className={inputClass} placeholder="https://..." />
            </Field>
            <Field label="សង្ខេប *">
              <textarea required rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} className={textareaClass} />
            </Field>
            <Field label="មាតិកា">
              <textarea rows={6} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className={textareaClass} placeholder="មាតិកាពេញលេញ..." />
            </Field>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModal(null)} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-bold hover:bg-muted">បោះបង់</button>
              <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-bold text-accent-foreground hover:opacity-90 disabled:opacity-60">
                {saving ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : modal === 'create' ? 'បន្ថែម' : 'រក្សាទុក'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

type AdminLesson = {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  summary: string;
  lessons: string[];
  published: boolean;
  updatedAt: string;
};

// ─── LESSONS TAB ──────────────────────────────────────────────────────────────
function LessonsTab({ toast }: { toast: (m: string, t: 'success' | 'error') => void }) {
  const blank = { title: '', category: 'ជំនាញការងារ', level: 'មូលដ្ឋាន', duration: '15 នាទី', summary: '', lessons: '', published: true };
  const [items, setItems] = useState<AdminLesson[]>([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<AdminLesson | null>(null);
  const [confirm, setConfirm] = useState<AdminLesson | null>(null);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try { setItems(await apiFetch('/lessons?admin=true')); }
    catch { toast('មិនអាចទាញមេរៀនបានទេ', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  function openCreate() { setEditing(null); setForm(blank); setModal(true); }
  function openEdit(item: AdminLesson) {
    setEditing(item);
    setForm({ title: item.title, category: item.category, level: item.level, duration: item.duration, summary: item.summary, lessons: item.lessons.join('\n'), published: item.published });
    setModal(true);
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, lessons: form.lessons.split('\n').map((line) => line.trim()).filter(Boolean) };
      await apiFetch(editing ? `/lessons/${editing.id}` : '/lessons', { method: editing ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      toast(editing ? 'បានកែប្រែមេរៀន!' : 'បានបន្ថែមមេរៀន!', 'success');
      setModal(false); await load();
    } catch { toast('មិនអាចរក្សាទុកមេរៀនបានទេ', 'error'); }
    finally { setSaving(false); }
  }

  async function remove(item: AdminLesson) {
    try { await apiFetch(`/lessons/${item.id}`, { method: 'DELETE' }); setConfirm(null); toast('បានលុបមេរៀន!', 'success'); await load(); }
    catch { toast('មិនអាចលុបមេរៀនបានទេ', 'error'); }
  }

  const filtered = items.filter((item) => !search || `${item.title} ${item.category} ${item.level}`.toLowerCase().includes(search.toLowerCase()));
  const categories = ['អាជីព', 'ភាពជាអ្នកដឹកនាំ', 'ជំនាញការងារ', 'ធនធានមនុស្ស', 'ចិត្តសាស្ត្រការងារ'];
  const levels = ['មូលដ្ឋាន', 'មធ្យម', 'កម្រិតខ្ពស់', 'ថ្នាក់ដឹកនាំ', 'គ្រប់កម្រិត'];

  return <div>
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex max-w-sm flex-1 items-center gap-2 border border-border bg-background px-3"><Search className="h-4 w-4 text-muted-foreground"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ស្វែងរកមេរៀន..." className="min-h-11 w-full bg-transparent text-sm outline-none"/></label>
      <button onClick={openCreate} className="inline-flex min-h-11 items-center justify-center gap-2 bg-accent px-4 text-sm font-bold text-accent-foreground"><Plus className="h-4 w-4"/>បន្ថែមមេរៀន</button>
    </div>
    {loading ? <div className="grid place-items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent"/></div> : <div className="overflow-x-auto border border-border bg-card">
      <table className="w-full min-w-[720px] text-sm"><thead className="border-b border-border bg-muted/50"><tr><th className="px-4 py-3 text-left">មេរៀន</th><th className="px-4 py-3 text-left">ប្រភេទ</th><th className="px-4 py-3 text-left">កម្រិត</th><th className="px-4 py-3 text-left">ស្ថានភាព</th><th className="px-4 py-3 text-right">សកម្មភាព</th></tr></thead>
      <tbody className="divide-y divide-border">{filtered.length ? filtered.map((item) => <tr key={item.id} className="hover:bg-muted/30"><td className="px-4 py-3"><p className="font-bold text-primary">{item.title}</p><p className="mt-1 max-w-lg truncate text-xs text-muted-foreground">{item.summary}</p></td><td className="px-4 py-3 text-muted-foreground">{item.category}</td><td className="px-4 py-3 text-muted-foreground">{item.level} · {item.duration}</td><td className="px-4 py-3"><span className={`inline-flex px-2 py-1 text-[11px] font-bold ${item.published ? 'bg-muted text-primary' : 'bg-secondary text-accent'}`}>{item.published ? 'Published' : 'Draft'}</span></td><td className="px-4 py-3"><div className="flex justify-end gap-2"><button onClick={() => openEdit(item)} title="កែ" className="grid h-9 w-9 place-items-center border border-border hover:bg-muted"><Pencil className="h-4 w-4"/></button><button onClick={() => setConfirm(item)} title="លុប" className="grid h-9 w-9 place-items-center border border-accent/40 text-accent hover:bg-secondary"><Trash2 className="h-4 w-4"/></button></div></td></tr>) : <tr><td colSpan={5} className="py-14 text-center text-muted-foreground">មិនទាន់មានមេរៀនពី Admin</td></tr>}</tbody></table>
    </div>}
    {confirm && <ConfirmDialog label={confirm.title} onConfirm={() => remove(confirm)} onCancel={() => setConfirm(null)}/>} 
    {modal && <Modal title={editing ? 'កែប្រែមេរៀន' : 'បង្កើតមេរៀនថ្មី'} onClose={() => setModal(false)}><form onSubmit={submit} className="space-y-4">
      <Field label="ចំណងជើងមេរៀន *"><input required value={form.title} onChange={(event) => setForm((current) => ({...current,title:event.target.value}))} className={inputClass}/></Field>
      <div className="grid gap-4 sm:grid-cols-3"><Field label="ប្រភេទ"><select value={form.category} onChange={(event) => setForm((current) => ({...current,category:event.target.value}))} className={selectClass}>{categories.map((value) => <option key={value}>{value}</option>)}</select></Field><Field label="កម្រិត"><select value={form.level} onChange={(event) => setForm((current) => ({...current,level:event.target.value}))} className={selectClass}>{levels.map((value) => <option key={value}>{value}</option>)}</select></Field><Field label="រយៈពេល"><input value={form.duration} onChange={(event) => setForm((current) => ({...current,duration:event.target.value}))} className={inputClass}/></Field></div>
      <Field label="សេចក្ដីសង្ខេប *"><textarea required rows={3} value={form.summary} onChange={(event) => setForm((current) => ({...current,summary:event.target.value}))} className={textareaClass}/></Field>
      <Field label="ចំណុចមេរៀន (មួយចំណុចក្នុងមួយបន្ទាត់)"><textarea rows={8} value={form.lessons} onChange={(event) => setForm((current) => ({...current,lessons:event.target.value}))} className={textareaClass} placeholder="ចំណុចទី១&#10;ចំណុចទី២&#10;លំហាត់អនុវត្ត"/></Field>
      <label className="flex items-center gap-3 border border-border p-3 text-sm font-bold"><input type="checkbox" checked={form.published} onChange={(event) => setForm((current) => ({...current,published:event.target.checked}))}/>Publish ទៅ Learning Center</label>
      <div className="flex gap-3 pt-2"><button type="button" onClick={() => setModal(false)} className="min-h-11 flex-1 border border-border font-bold">បោះបង់</button><button disabled={saving} className="min-h-11 flex-1 bg-accent font-bold text-accent-foreground">{saving ? <Loader2 className="mx-auto h-4 w-4 animate-spin"/> : 'រក្សាទុក'}</button></div>
    </form></Modal>}
  </div>;
}

// ─── DASHBOARD OVERVIEW ───────────────────────────────────────────────────────
function OverviewTab() {
  const dashboardQuery = useGetDashboard();
  const data = dashboardQuery.data as DashboardSummary | undefined;
  const metrics = data
    ? [
        { label: 'ការងារសរុប', value: data.totalJobs, color: 'bg-primary' },
        { label: 'កំពុងផ្សព្វផ្សាយ', value: data.publishedJobs, color: 'bg-primary' },
        { label: 'ការងារពិសេស', value: data.featuredJobs, color: 'bg-accent' },
        { label: 'បន្ទាន់', value: data.urgentJobs, color: 'bg-accent' },
        { label: 'ជិតផុតកំណត់', value: data.closingSoon, color: 'bg-accent' },
        { label: 'ក្រុមហ៊ុន', value: data.companies, color: 'bg-primary' },
      ]
    : [];

  return (
    <div>
      {dashboardQuery.isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map(m => (
              <div key={m.label} className="rounded-2xl border border-border bg-card p-5">
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${m.color} text-white`}>
                  <Briefcase className="h-5 w-5" />
                </div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <strong className="mt-1 block text-3xl font-extrabold text-primary">{m.value}</strong>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 font-bold text-primary">ព័ត៌មានទំនាក់ទំនង</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <a href="mailto:lyhawhrsolution@gmail.com" className="flex items-center gap-2 hover:text-primary"><Mail className="h-4 w-4 text-accent" /> lyhawhrsolution@gmail.com</a>
              <a href="tel:+85599885088" className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4 text-accent" /> +855 99 885 088</a>
              <a href="https://t.me/lyhawhrsolution" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary"><Send className="h-4 w-4 text-accent" /> Telegram</a>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> Matching Coffee, BE0, ផ្លូវលេខ 259, រាជធានីភ្នំពេញ</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const response = await fetch('/api/admin/session', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Admin-Key': password } });
      if (!response.ok) throw new Error('invalid');
      sessionStorage.setItem(ADMIN_SESSION_KEY, password);
      onSuccess();
    } catch { setError('លេខសម្ងាត់មិនត្រឹមត្រូវ ឬ server មិនទាន់កំណត់ ADMIN_PASSWORD'); }
    finally { setLoading(false); }
  }
  return <div className="grid min-h-dvh place-items-center bg-muted px-4 py-10"><div className="w-full max-w-md border border-border bg-card p-7 shadow-xl sm:p-9"><Logo/><div className="mt-8 grid h-14 w-14 place-items-center bg-primary text-accent"><LockKeyhole className="h-7 w-7"/></div><p className="mt-6 text-xs font-extrabold uppercase text-accent">Secure staff access</p><h1 className="mt-2 text-2xl font-extrabold text-primary">ចូល Staff Dashboard</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">បញ្ចូល Admin password ដើម្បីបង្កើត កែប្រែ និងលុបមាតិកា។</p><form onSubmit={submit} className="mt-7 space-y-4"><Field label="Admin password"><input autoFocus required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} placeholder="បញ្ចូលលេខសម្ងាត់"/></Field>{error && <p className="flex items-start gap-2 text-sm font-bold leading-6 text-accent"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0"/>{error}</p>}<button disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-accent px-5 font-extrabold text-accent-foreground disabled:opacity-50">{loading ? <Loader2 className="h-5 w-5 animate-spin"/> : <><LockKeyhole className="h-4 w-4"/>ចូល Dashboard</>}</button></form></div></div>;
}

// ─── MAIN ADMIN PAGE ──────────────────────────────────────────────────────────
export default function AdminPage() {
  type Tab = 'overview' | 'jobs' | 'companies' | 'articles' | 'lessons';
  const [authenticated, setAuthenticated] = useState(() => Boolean(sessionStorage.getItem(ADMIN_SESSION_KEY)));
  const [tab, setTab] = useState<Tab>('overview');
  const [toastMsg, setToastMsg] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!authenticated) return;
    void apiFetch('/admin/session', { method: 'POST' }).catch(() => {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      setAuthenticated(false);
    });
  }, []);

  function showToast(msg: string, type: 'success' | 'error') {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 4000);
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'ទិដ្ឋភាពរួម', icon: <LayoutDashboard className="h-4 w-4" /> },
    { key: 'jobs', label: 'ការងារ', icon: <Briefcase className="h-4 w-4" /> },
    { key: 'companies', label: 'ក្រុមហ៊ុន', icon: <Building2 className="h-4 w-4" /> },
    { key: 'articles', label: 'អត្ថបទ', icon: <FileText className="h-4 w-4" /> },
    { key: 'lessons', label: 'មេរៀន', icon: <BookOpen className="h-4 w-4" /> },
  ];

  if (!authenticated) return <AdminLogin onSuccess={() => setAuthenticated(true)} />;

  function logout() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthenticated(false);
  }

  return (
    <div className="min-h-dvh bg-muted">
      {/* Header */}
      <div className="border-b border-border bg-primary text-primary-foreground">
        <div className="container-wide flex h-20 items-center justify-between">
          <Logo inverse compactOnMobile />
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-primary-foreground/20 px-3 py-1 text-xs font-bold md:inline-flex">STAFF DASHBOARD</span>
            <Link href="/" aria-label="ទំព័រសាធារណៈ" className="inline-flex min-h-9 items-center rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-bold hover:bg-primary-foreground/20">
              <span className="hidden sm:inline">ទំព័រសាធារណៈ</span><ArrowRight className="h-3.5 w-3.5 sm:ml-1" />
            </Link>
            <button onClick={logout} title="ចាកចេញ" className="grid h-9 w-9 place-items-center border border-primary-foreground/20 text-primary-foreground/75 hover:border-accent hover:text-accent"><LogOut className="h-4 w-4"/></button>
          </div>
        </div>
      </div>

      <div className="container-wide py-8">
        {/* Page title */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-accent">ផ្ទៃការងារ</p>
          <h1 className="mt-1 text-2xl font-extrabold text-primary">គ្រប់គ្រងការជ្រើសរើសបុគ្គលិក</h1>
          <p className="mt-1 text-sm text-muted-foreground">បន្ថែម កែ លុប ការងារ ក្រុមហ៊ុន អត្ថបទ និងមេរៀន</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-border bg-card p-1.5">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${tab === t.key ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && <OverviewTab />}
        {tab === 'jobs' && <JobsTab toast={showToast} />}
        {tab === 'companies' && <CompaniesTab toast={showToast} />}
        {tab === 'articles' && <ArticlesTab toast={showToast} />}
        {tab === 'lessons' && <LessonsTab toast={showToast} />}
      </div>

      {toastMsg && <Toast msg={toastMsg.msg} type={toastMsg.type} onClose={() => setToastMsg(null)} />}
    </div>
  );
}
