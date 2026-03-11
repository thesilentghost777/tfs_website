import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectType =
  | 'site_mesure'
  | 'ecommerce'
  | 'portfolio'
  | 'vitrine'
  | 'app_web'
  | 'app_mobile'
  | 'app_pc'
  | 'app_tv'
  | 'automatisation';

type StoreTarget = 'none' | 'playstore' | 'appstore' | 'both';

interface FormData {
  appName: string;
  projectType: ProjectType | '';
  storeTarget: StoreTarget;
  payment: boolean;
  auth: boolean;
  authTypes: string[];
  googleMap: boolean;
  chatbot: boolean;
  dashboard: boolean;
  multiLang: boolean;
  notifications: boolean;
  offlineMode: boolean;
  adminPanel: boolean;
  deadline: string;
}

// ─── Pricing Engine ───────────────────────────────────────────────────────────

const BASE_PRICES: Record<ProjectType, number> = {
  site_mesure:    400000,
  ecommerce:      450000,
  portfolio:      100000,
  vitrine:        150000,
  app_web:        300000,
  app_mobile:    1200000,
  app_pc:         600000,
  app_tv:         800000,
  automatisation: 250000,
};

const PROJECT_LABELS: Record<ProjectType, string> = {
  site_mesure:    'Site Web Sur Mesure',
  ecommerce:      'Site E-Commerce',
  portfolio:      'Portfolio',
  vitrine:        'Site Vitrine',
  app_web:        'Application Web',
  app_mobile:     'Application Mobile',
  app_pc:         'Application PC',
  app_tv:         'Application TV',
  automatisation: 'Automatisation',
};

const PROJECT_ICONS: Record<ProjectType, string> = {
  site_mesure:    '🌐',
  ecommerce:      '🛒',
  portfolio:      '🎨',
  vitrine:        '🏪',
  app_web:        '💻',
  app_mobile:     '📱',
  app_pc:         '🖥️',
  app_tv:         '📺',
  automatisation: '⚙️',
};

const PROJECT_DESCS: Record<ProjectType, string> = {
  site_mesure:    'Design & développement 100% personnalisé',
  ecommerce:      'Boutique en ligne avec gestion des ventes',
  portfolio:      'Vitrine de vos travaux et compétences',
  vitrine:        'Présentation professionnelle de votre activité',
  app_web:        'Application accessible via navigateur',
  app_mobile:     'App iOS / Android native ou hybride',
  app_pc:         'Application de bureau Windows / macOS / Linux',
  app_tv:         'App Android TV / Smart TV',
  automatisation: 'Scripts, bots, workflows & intégrations',
};

const STORE_COSTS: Record<StoreTarget, number> = {
  none:      0,
  playstore: 30000,
  appstore:  120000,
  both:      150000,
};

const EURO_RATE = 655.957;
const USD_RATE  = 605;

// Types qui ont besoin de l'option store
const STORE_TYPES: ProjectType[] = ['app_mobile'];

// Types pour lesquels les options avancées d'app sont pertinentes
const ADVANCED_OPTS_ALL: ProjectType[] = [
  'site_mesure', 'ecommerce', 'portfolio', 'vitrine',
  'app_web', 'app_mobile', 'app_pc', 'app_tv',
];

function computePrice(form: FormData): { total: number; breakdown: { label: string; amount: number }[] } {
  if (!form.projectType) return { total: 0, breakdown: [] };
  const breakdown: { label: string; amount: number }[] = [];

  const base = BASE_PRICES[form.projectType];
  breakdown.push({ label: `${PROJECT_LABELS[form.projectType]} (base)`, amount: base });

  if (STORE_TYPES.includes(form.projectType as ProjectType) && form.storeTarget !== 'none') {
    const storeCost = STORE_COSTS[form.storeTarget];
    const storeLabel =
      form.storeTarget === 'both'      ? 'Hébergement Play Store + App Store' :
      form.storeTarget === 'playstore' ? 'Hébergement Play Store' :
                                         'Hébergement App Store';
    breakdown.push({ label: storeLabel, amount: storeCost });
  }

  if (form.payment)    breakdown.push({ label: 'Intégration paiement / API',                          amount: 80000 });
  if (form.auth) {
    const authExtra = form.authTypes.length > 1 ? form.authTypes.length * 15000 : 20000;
    breakdown.push({ label: `Authentification (${form.authTypes.join(', ') || 'Standard'})`,          amount: authExtra });
  }
  if (form.googleMap)  breakdown.push({ label: 'Intégration Google Maps',                             amount: 25000 });
  if (form.chatbot)    breakdown.push({ label: 'ChatBot IA intégré',                                  amount: 150000 });
  if (form.dashboard)  breakdown.push({ label: 'Dashboard & Analytics',                               amount: 60000 });
  if (form.multiLang)  breakdown.push({ label: 'Multi-langue (i18n)',                                 amount: 30000 });
  if (form.notifications) breakdown.push({ label: 'Notifications Push / Email',                      amount: 20000 });
  if (form.offlineMode)   breakdown.push({ label: 'Mode hors-ligne (PWA / cache)',                    amount: 40000 });
  if (form.adminPanel)    breakdown.push({ label: "Panneau d'administration",                         amount: 80000 });

  // Automatisation : pas d'options avancées d'app, on skippe tout sauf paiement/auth
  // (déjà géré via les toggles visibles uniquement selon le type)

  // Deadline urgency
  const now = new Date();
  if (form.deadline) {
    const dl   = new Date(form.deadline);
    const diff = Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 0 && diff < 30) {
      const urgency = Math.round((base * 0.5) / 1000) * 1000;
      breakdown.push({ label: 'Majoration délai urgent (<30j)', amount: urgency });
    } else if (diff >= 30 && diff < 60) {
      const urgency = Math.round((base * 0.2) / 1000) * 1000;
      breakdown.push({ label: 'Majoration délai court (<60j)', amount: urgency });
    }
  }

  const total = breakdown.reduce((s, b) => s + b.amount, 0);
  return { total, breakdown };
}

function formatFCFA(n: number) { return n.toLocaleString('fr-FR') + ' FCFA'; }
function formatEUR(n: number)  { return (n / EURO_RATE).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' €'; }
function formatUSD(n: number)  { return (n / USD_RATE).toLocaleString('fr-FR',  { maximumFractionDigits: 0 }) + ' $'; }

// ─── Sub-components ───────────────────────────────────────────────────────────

const StepHeader = ({ step, total, title, desc }: { step: number; total: number; title: string; desc: string }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
        Étape {step} / {total}
      </span>
      <div className="flex-1 h-[1px] bg-border/40" />
    </div>
    <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{desc}</p>
  </div>
);

const SelectCard = ({
  selected, onClick, label, desc, icon
}: { selected: boolean; onClick: () => void; label: string; desc?: string; icon?: string }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 ${
      selected
        ? 'border-primary bg-primary/10 text-foreground'
        : 'border-border/50 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon && <span className="text-lg">{icon}</span>}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {desc && <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{desc}</div>}
      </div>
      {selected && (
        <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  </button>
);

const Toggle = ({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: () => void }) => (
  <label className="flex items-center justify-between gap-4 py-3 border-b border-border/30 cursor-pointer group">
    <div>
      <div className="text-sm font-medium group-hover:text-foreground transition-colors">{label}</div>
      {desc && <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>}
    </div>
    <div
      className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${checked ? 'bg-primary' : 'bg-muted-foreground/20'}`}
      onClick={onChange}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${checked ? 'left-6' : 'left-1'}`} />
    </div>
  </label>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const TOTAL_STEPS = 4;

const PriceEstimator = () => {
  const [open, setOpen]             = useState(false);
  const [step, setStep]             = useState(1);
  const [submitted, setSubmitted]   = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<'cahier' | 'rdv' | null>(null);
  const [whatsapp, setWhatsapp]     = useState('');
  const [pdfFile, setPdfFile]       = useState<File | null>(null);
  const modalRef                    = useRef<HTMLDivElement>(null);
  const overlayRef                  = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormData>({
    appName:       '',
    projectType:   '',
    storeTarget:   'none',
    payment:       false,
    auth:          false,
    authTypes:     [],
    googleMap:     false,
    chatbot:       false,
    dashboard:     false,
    multiLang:     false,
    notifications: false,
    offlineMode:   false,
    adminPanel:    false,
    deadline:      '',
  });

  const { total, breakdown } = computePrice(form);

  const isAutomat = form.projectType === 'automatisation';
  const hasStore  = STORE_TYPES.includes(form.projectType as ProjectType);
  const hasAdvanced = ADVANCED_OPTS_ALL.includes(form.projectType as ProjectType);

  // Open/close animation
  useEffect(() => {
    if (!modalRef.current || !overlayRef.current) return;
    if (open) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(modalRef.current,   { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' });
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  const closeModal = () => {
    if (!modalRef.current || !overlayRef.current) return;
    gsap.to(modalRef.current,   { opacity: 0, y: 20, scale: 0.97, duration: 0.25, ease: 'power2.in' });
    gsap.to(overlayRef.current, {
      opacity: 0, duration: 0.25, onComplete: () => {
        setOpen(false);
        setStep(1);
        setSubmitted(false);
        setDeliveryMode(null);
      }
    });
  };

  const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const canNext = () => {
    if (step === 1) return form.appName.trim().length > 0 && form.projectType !== '';
    if (step === 4) return form.deadline !== '';
    return true;
  };

  const toggleAuth = (type: string) => {
    setForm(f => ({
      ...f,
      authTypes: f.authTypes.includes(type)
        ? f.authTypes.filter(t => t !== type)
        : [...f.authTypes, type],
    }));
  };

  const handleSubmit = () => {
    if (deliveryMode === 'rdv') {
      const msg = encodeURIComponent(`Bonjour, je veux prendre rdv au sujet de mon projet "${form.appName}" (${form.projectType ? PROJECT_LABELS[form.projectType as ProjectType] : ''})`);
      window.open(`https://wa.me/237696087354?text=${msg}`, '_blank');
    } else {
      setSubmitted(true);
    }
  };

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-primary text-white font-semibold text-sm shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label="Estimer le prix de mon projet"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
      <span className="hidden sm:inline">Estimer mon projet</span>
      <span className="sm:hidden">Devis</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 bg-background shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-border/40 bg-background/95 backdrop-blur-sm">
            <div>
              <span className="text-xs font-medium text-primary uppercase tracking-[0.2em]">Tech Forge Solutions</span>
              <h2 className="text-lg font-bold mt-0.5">Estimateur de prix</h2>
            </div>
            <button
              onClick={closeModal}
              className="w-8 h-8 rounded-full bg-muted/40 hover:bg-muted/70 transition-colors flex items-center justify-center"
              aria-label="Fermer"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-border/30">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>

          <div className="px-6 py-8">

            {/* ── STEP 1 : Identité du projet ── */}
            {step === 1 && (
              <div>
                <StepHeader
                  step={1} total={TOTAL_STEPS}
                  title="Votre projet"
                  desc="Commençons par les bases — quel type de solution cherchez-vous ?"
                />
                <div className="space-y-5">
                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom du projet / application</label>
                    <input
                      type="text"
                      value={form.appName}
                      onChange={e => setForm(f => ({ ...f, appName: e.target.value }))}
                      placeholder="Ex: MonApp, TFS Shop, Mon Portfolio..."
                      className="w-full px-4 py-3 rounded-xl border border-border/60 bg-muted/20 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:bg-muted/40 transition-all text-sm"
                    />
                  </div>

                  {/* Type de projet — grille 3 colonnes sur md */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Type de service</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {(Object.keys(PROJECT_LABELS) as ProjectType[]).map(k => (
                        <SelectCard
                          key={k}
                          selected={form.projectType === k}
                          onClick={() => setForm(f => ({ ...f, projectType: k, storeTarget: 'none' }))}
                          label={PROJECT_LABELS[k]}
                          desc={PROJECT_DESCS[k]}
                          icon={PROJECT_ICONS[k]}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2 : Distribution & Fonctionnalités ── */}
            {step === 2 && (
              <div>
                <StepHeader
                  step={2} total={TOTAL_STEPS}
                  title="Distribution & Fonctionnalités"
                  desc={isAutomat
                    ? "Précisez les intégrations et modules nécessaires à votre automatisation."
                    : "Où sera déployée votre solution et quelles fonctionnalités clés faut-il ?"}
                />
                <div className="space-y-6">

                  {/* Store — seulement pour app_mobile */}
                  {hasStore && (
                    <div>
                      <label className="block text-sm font-medium mb-3">Publication sur store</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['none', 'playstore', 'appstore', 'both'] as StoreTarget[]).map(s => (
                          <SelectCard
                            key={s}
                            selected={form.storeTarget === s}
                            onClick={() => setForm(f => ({ ...f, storeTarget: s }))}
                            label={s === 'none' ? 'Pas de store' : s === 'playstore' ? 'Play Store' : s === 'appstore' ? 'App Store' : 'Les deux'}
                            icon={s === 'none' ? '🚫' : s === 'playstore' ? '🤖' : s === 'appstore' ? '🍎' : '🌍'}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Automatisation : modules spécifiques */}
                  {isAutomat ? (
                    <div>
                      <label className="block text-sm font-medium mb-1">Modules d'automatisation</label>
                      <div className="mt-2">
                        <Toggle
                          label="Intégration paiement / API de paiement"
                          desc="MTN MoMo, Orange Money, Stripe, PayPal..."
                          checked={form.payment}
                          onChange={() => setForm(f => ({ ...f, payment: !f.payment }))}
                        />
                        <Toggle
                          label="ChatBot IA / Agent autonome"
                          desc="Assistant, traitement automatique, NLP"
                          checked={form.chatbot}
                          onChange={() => setForm(f => ({ ...f, chatbot: !f.chatbot }))}
                        />
                        <Toggle
                          label="Dashboard & Analytics"
                          desc="Tableaux de bord, métriques, alertes"
                          checked={form.dashboard}
                          onChange={() => setForm(f => ({ ...f, dashboard: !f.dashboard }))}
                        />
                        <Toggle
                          label="Notifications Push / Email"
                          desc="Alertes automatiques, rapports programmés"
                          checked={form.notifications}
                          onChange={() => setForm(f => ({ ...f, notifications: !f.notifications }))}
                        />
                        <Toggle
                          label="Panneau d'administration"
                          desc="Back-office pour piloter les automatisations"
                          checked={form.adminPanel}
                          onChange={() => setForm(f => ({ ...f, adminPanel: !f.adminPanel }))}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Paiement & Auth pour tous les autres */
                    <div>
                      <label className="block text-sm font-medium mb-1">Paiement & Sécurité</label>
                      <div className="mt-2">
                        <Toggle
                          label="Intégration paiement / API de paiement"
                          desc="MTN MoMo, Orange Money, Stripe, PayPal..."
                          checked={form.payment}
                          onChange={() => setForm(f => ({ ...f, payment: !f.payment }))}
                        />
                        <Toggle
                          label="Authentification utilisateur"
                          desc="Gestion de comptes, connexion sécurisée"
                          checked={form.auth}
                          onChange={() => setForm(f => ({ ...f, auth: !f.auth }))}
                        />
                      </div>
                      {form.auth && (
                        <div className="mt-3 ml-2 grid grid-cols-2 gap-2">
                          {['Google', 'Facebook', 'GitHub', 'Apple', 'Email/Password'].map(t => (
                            <SelectCard
                              key={t}
                              selected={form.authTypes.includes(t)}
                              onClick={() => toggleAuth(t)}
                              label={t}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 3 : Options avancées ── */}
            {step === 3 && (
              <div>
                <StepHeader
                  step={3} total={TOTAL_STEPS}
                  title="Options avancées"
                  desc="Chaque option enrichit votre projet — et son estimation."
                />
                {isAutomat ? (
                  <p className="text-sm text-muted-foreground py-4 text-center italic">
                    Les options avancées ont déjà été configurées à l'étape précédente pour l'automatisation. Passez à l'étape suivante.
                  </p>
                ) : (
                  <div>
                    <Toggle label="Intégration Google Maps"          desc="Cartographie, géolocalisation, itinéraires"          checked={form.googleMap}     onChange={() => setForm(f => ({ ...f, googleMap:     !f.googleMap }))} />
                    <Toggle label="ChatBot IA"                        desc="Assistant intelligent intégré à l'app"               checked={form.chatbot}       onChange={() => setForm(f => ({ ...f, chatbot:       !f.chatbot }))} />
                    <Toggle label="Dashboard & Analytics"             desc="Tableaux de bord, statistiques, KPIs"                checked={form.dashboard}     onChange={() => setForm(f => ({ ...f, dashboard:     !f.dashboard }))} />
                    <Toggle label="Multi-langue (i18n)"               desc="Application disponible en plusieurs langues"         checked={form.multiLang}     onChange={() => setForm(f => ({ ...f, multiLang:     !f.multiLang }))} />
                    <Toggle label="Notifications Push / Email"        desc="Alertes, rappels, marketing automation"              checked={form.notifications} onChange={() => setForm(f => ({ ...f, notifications: !f.notifications }))} />
                    <Toggle label="Mode hors-ligne (PWA / cache)"     desc="Fonctionne sans connexion internet"                  checked={form.offlineMode}   onChange={() => setForm(f => ({ ...f, offlineMode:   !f.offlineMode }))} />
                    <Toggle label="Panneau d'administration"          desc="Back-office pour gérer les données"                  checked={form.adminPanel}    onChange={() => setForm(f => ({ ...f, adminPanel:    !f.adminPanel }))} />
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 4 : Délai & Résultat ── */}
            {step === 4 && (
              <div>
                <StepHeader
                  step={4} total={TOTAL_STEPS}
                  title="Délai & Estimation"
                  desc="Quand souhaitez-vous la livraison ? Plus c'est urgent, plus il y a une majoration."
                />

                <div className="mb-8">
                  <label className="block text-sm font-medium mb-2">Date de livraison souhaitée</label>
                  <input
                    type="date"
                    value={form.deadline}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-muted/20 text-foreground focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>

                {/* Price result */}
                {form.deadline && (
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 md:p-6 mb-6">
                    <div className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-4">
                      Estimation — {form.appName} ({form.projectType ? PROJECT_LABELS[form.projectType as ProjectType] : ''})
                    </div>
                    <div className="space-y-2 mb-5">
                      {breakdown.map((b, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{b.label}</span>
                          <span className="font-medium text-xs tabular-nums">{formatFCFA(b.amount)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border/40 pt-4">
                      <div className="flex justify-between items-baseline">
                        <span className="text-base font-semibold">Total estimé</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gradient">{formatFCFA(total)}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            ≈ {formatEUR(total)} · ≈ {formatUSD(total)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 italic">
                      * Estimation indicative. Le devis définitif sera établi après étude de votre cahier des charges.
                    </p>
                  </div>
                )}

                {/* Delivery options */}
                {form.deadline && (
                  <div>
                    <div className="text-sm font-medium mb-3">Comment souhaitez-vous procéder ?</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                      <SelectCard
                        selected={deliveryMode === 'cahier'}
                        onClick={() => setDeliveryMode('cahier')}
                        label="Soumettre mon cahier des charges"
                        desc="Envoyez un PDF décrivant votre projet"
                        icon="📄"
                      />
                      <SelectCard
                        selected={deliveryMode === 'rdv'}
                        onClick={() => setDeliveryMode('rdv')}
                        label="Prendre un rendez-vous"
                        desc="Discussion directe sur WhatsApp"
                        icon="📅"
                      />
                    </div>

                    {deliveryMode === 'cahier' && !submitted && (
                      <div className="space-y-3 p-4 rounded-xl border border-border/40 bg-muted/10">
                        <div>
                          <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Votre numéro WhatsApp</label>
                          <input
                            type="tel"
                            value={whatsapp}
                            onChange={e => setWhatsapp(e.target.value)}
                            placeholder="+237 6XX XXX XXX"
                            className="w-full px-3 py-2.5 rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Cahier des charges (PDF)</label>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={e => setPdfFile(e.target.files?.[0] ?? null)}
                            className="w-full text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-border/60 file:text-xs file:font-medium file:bg-muted/30 file:text-foreground hover:file:bg-muted/50 file:transition-colors cursor-pointer"
                          />
                        </div>
                      </div>
                    )}

                    {deliveryMode === 'cahier' && submitted && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-lg mb-2">Envoyé avec succès !</h4>
                        <p className="text-muted-foreground text-sm">Notre équipe vous contactera sous 24h au {whatsapp}.</p>
                      </div>
                    )}

                    {deliveryMode && !submitted && (
                      <button
                        onClick={handleSubmit}
                        disabled={deliveryMode === 'cahier' && (!whatsapp || !pdfFile)}
                        className="w-full mt-4 py-3.5 rounded-xl font-semibold text-sm bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
                      >
                        {deliveryMode === 'rdv' ? '📅 Prendre RDV sur WhatsApp' : '📤 Envoyer mon dossier'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Navigation ── */}
            {!(step === 4 && submitted) && (
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/30">
                {step > 1 ? (
                  <button onClick={prevStep} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Retour
                  </button>
                ) : <div />}

                {step < TOTAL_STEPS && (
                  <button
                    onClick={nextStep}
                    disabled={!canNext()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-all duration-200 active:scale-[0.98]"
                  >
                    Suivant
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceEstimator;