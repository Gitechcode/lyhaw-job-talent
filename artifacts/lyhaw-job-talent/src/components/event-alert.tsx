import { type ReactNode, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Phone,
  Users,
  X,
} from 'lucide-react';

type SiteEvent = {
  id: string;
  title: string;
  topic: string;
  date: string;
  time: string;
  location: string;
  image: string;
  teamPrice: string;
  singlePrice: string;
  phoneNumbers: string[];
};

const events: SiteEvent[] = [
  {
    id: 'workplace-survival-2026-10-30',
    title: 'កម្មវិធី ១ ថ្ងៃ៖ យុទ្ធសាស្ត្ររស់រានក្នុងកន្លែងការងារ',
    topic: 'របៀបចាកចេញពី Comfort Zone និងរីកចម្រើនក្នុងអាជីព',
    date: '30 តុលា 2026',
    time: '8:00 ព្រឹក - 5:00 ល្ងាច',
    location: 'CJCC, រាជធានីភ្នំពេញ',
    image: '/events/workplace-survival-training.jpg',
    teamPrice: '$50 / នាក់',
    singlePrice: '$60 / នាក់',
    phoneNumbers: ['099 88 50 88', '090 88 50 88'],
  },
];

function EventDetails({ event, onClose }: { event: SiteEvent; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Restore focus to trigger on unmount
    const trigger = document.activeElement as HTMLElement | null;
    return () => { trigger?.focus(); };
  }, []);

  useEffect(() => {
    // Auto-focus close button on open
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
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
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return <motion.div
    ref={dialogRef}
    role="dialog"
    aria-modal="true"
    aria-labelledby="event-dialog-title"
    className="fixed inset-0 z-[80] flex items-end justify-center bg-primary/65 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onMouseDown={(mouseEvent) => {
      if (mouseEvent.currentTarget === mouseEvent.target) onClose();
    }}
  >
    <motion.div
      className="event-dialog relative grid max-h-[94vh] w-full max-w-4xl overflow-y-auto bg-background shadow-2xl sm:max-h-[88vh] sm:grid-cols-[minmax(0,.9fr)_minmax(360px,1.1fr)] sm:rounded-md"
      initial={{ opacity: 0, y: 20, scale: .99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: .99 }}
      transition={{ duration: .2, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="បិទព័ត៌មានកម្មវិធី"
        className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-primary shadow-sm transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
      ><X className="h-4 w-4" /></button>
      <div className="flex items-center bg-muted p-4 sm:min-h-full sm:p-5">
        <img src={event.image} alt={`Poster ${event.title}`} className="aspect-square h-auto w-full rounded-sm object-contain object-center shadow-sm sm:aspect-auto sm:max-h-[72vh]" />
      </div>
      <div className="flex flex-col p-6 sm:p-8 lg:p-9">
        <div className="flex items-center gap-3"><span className="h-px w-8 bg-accent" /><span className="text-[11px] font-bold uppercase tracking-[.16em] text-accent">Upcoming Event</span></div>
        <h2 id="event-dialog-title" className="mt-4 pr-10 text-2xl font-extrabold leading-[1.55] text-primary sm:text-[28px]">{event.title}</h2>
        <p className="mt-3 border-b border-border pb-6 text-sm font-medium leading-7 text-muted-foreground">{event.topic}</p>

        <div className="mt-2 divide-y divide-border">
          <EventFact icon={<CalendarDays />} label="កាលបរិច្ឆេទ" value={event.date} />
          <EventFact icon={<Clock3 />} label="ម៉ោង" value={event.time} />
          <EventFact icon={<MapPin />} label="ទីតាំង" value={event.location} />
        </div>

        <div className="mt-5 grid grid-cols-2 divide-x divide-border border-y border-border bg-secondary/70 py-4">
          <div className="px-4"><p className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground"><Users className="h-4 w-4 text-accent" /> ចុះឈ្មោះជាក្រុម</p><p className="mt-2 text-lg font-extrabold text-primary">{event.teamPrice}</p></div>
          <div className="px-4"><p className="text-[11px] font-bold text-muted-foreground">ចូលរួមម្នាក់ឯង</p><p className="mt-2 text-lg font-extrabold text-primary">{event.singlePrice}</p></div>
        </div>

        <div className="mt-auto pt-6">
          <p className="mb-3 text-xs font-semibold text-muted-foreground">សម្រាប់ការចុះឈ្មោះ និងសួរព័ត៌មាន</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {event.phoneNumbers.map((number, index) => <a key={number} href={`tel:${number.replaceAll(' ', '')}`} className={`inline-flex min-h-11 items-center justify-center gap-2 border px-4 text-sm font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${index === 0 ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90' : 'border-border bg-background text-primary hover:border-primary'}`}><Phone className="h-4 w-4" /> {number}</a>)}
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>;
}


function EventFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="flex min-h-16 items-center gap-3 py-3">
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-accent [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
    <div><p className="text-[10px] font-bold text-muted-foreground">{label}</p><p className="mt-0.5 text-sm font-extrabold leading-6 text-primary">{value}</p></div>
  </div>;
}

export function EventAlert() {
  const [activeEvent, setActiveEvent] = useState<SiteEvent | null>(null);
  const [visibleEvents, setVisibleEvents] = useState<SiteEvent[]>([]);

  useEffect(() => {
    setVisibleEvents(events.filter((event) => sessionStorage.getItem(`lyhaw-event-dismissed:${event.id}`) !== 'true'));
  }, []);

  if (!visibleEvents.length) return null;

  const event = visibleEvents[0];
  const dismiss = () => {
    sessionStorage.setItem(`lyhaw-event-dismissed:${event.id}`, 'true');
    setVisibleEvents((current) => current.filter((item) => item.id !== event.id));
  };

  return <>
    <aside
      data-testid="event-alert"
      className="relative z-30 border-b border-border bg-background text-primary"
      aria-label="កម្មវិធីថ្មី"
    >
      <div className="container-wide relative flex min-h-[62px] items-center gap-3 py-2.5 pr-10 sm:gap-4">
        <CalendarDays className="hidden h-5 w-5 shrink-0 text-accent sm:block" />
        <div className="min-w-0 flex-1 border-l-2 border-accent pl-3 sm:border-l-0 sm:pl-0">
          <p className="truncate text-[13px] font-extrabold sm:text-sm">{event.title}</p>
          <p className="mt-1 flex gap-x-3 text-[10px] font-medium text-muted-foreground sm:text-[11px]"><span>{event.date}</span><span className="hidden md:inline">{event.time}</span><span className="hidden sm:inline">{event.location}</span></p>
        </div>
        <button type="button" onClick={() => setActiveEvent(event)} className="hidden min-h-9 shrink-0 items-center gap-2 px-2 text-xs font-extrabold text-primary transition-colors hover:text-accent sm:inline-flex">ព័ត៌មានលម្អិត <ArrowRight className="h-3.5 w-3.5" /></button>
        <button type="button" onClick={() => setActiveEvent(event)} aria-label="មើលព័ត៌មានកម្មវិធី" className="grid h-9 w-9 shrink-0 place-items-center text-primary sm:hidden"><ArrowRight className="h-4 w-4" /></button>
        <button type="button" onClick={dismiss} aria-label="បិទការជូនដំណឹងកម្មវិធី" className="absolute right-0 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-muted-foreground transition-colors hover:text-primary"><X className="h-3.5 w-3.5" /></button>
      </div>
    </aside>
    <AnimatePresence>{activeEvent && <EventDetails event={activeEvent} onClose={() => setActiveEvent(null)} />}</AnimatePresence>
  </>;
}
