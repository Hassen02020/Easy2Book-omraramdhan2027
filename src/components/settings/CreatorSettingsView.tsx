import { Code2, RotateCcw, ShieldAlert, Volume2, Workflow } from 'lucide-react';
import { VOICE_OPTIONS } from '../../data/campaignData';
import type { CreatorLanguage, CreatorSettings } from '../../types/creator';

interface CreatorSettingsViewProps {
  settings: CreatorSettings;
  onUpdateSettings: (next: CreatorSettings) => void;
  onResetDemoData: () => void;
}

const CONTRACT_SCHEMA_PREVIEW = `export interface CrmLeadSubmissionContract {
  contractVersion: '1.0.0';
  pageId: string;
  offerId: string; // OfferReference.externalOfferId
  businessUniverse: 'omra' | 'voyages' | 'hotels_tunisie' | 'visa';
  pageLanguage: 'fr' | 'en' | 'ar';
  acquisitionSource: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  formId: string;
  submittedAt: string; // ISO 8601
  fields: Partial<Record<FormFieldKey, string | number | boolean>>;
}`;

export function CreatorSettingsView({
  settings,
  onUpdateSettings,
  onResetDemoData,
}: CreatorSettingsViewProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#102D45]">
            Paramètres du Creator & Contrats d’intégration
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Configuration locale du Studio et spécification préparée pour le futur raccordement au CRM Easy2Book.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetDemoData}
          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-800 hover:bg-rose-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Réinitialiser les données de démo
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Studio Settings */}
        <section className="rounded-2xl border border-[#102D45]/10 bg-white p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#102D45]">
            Préférences générales du Studio
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#102D45] mb-1">
              Langue par défaut des nouvelles pages
            </label>
            <select
              value={settings.defaultLanguage}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  defaultLanguage: e.target.value as CreatorLanguage,
                })
              }
              className="w-full rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-xs font-semibold"
            >
              <option value="fr">Français (FR)</option>
              <option value="ar">Arabe RTL (AR)</option>
              <option value="en">Anglais (EN)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102D45] mb-1">
              Numéro WhatsApp Business par défaut
            </label>
            <input
              type="text"
              value={settings.defaultWhatsappNumber}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  defaultWhatsappNumber: e.target.value,
                })
              }
              className="w-full rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 font-mono text-xs"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#102D45] mb-1">
              <Volume2 className="h-3.5 w-3.5 text-[#C8922A]" />
              Voix off par défaut du Studio (Vidéo 9:16)
            </label>
            <select
              value={settings.defaultVoiceId || 'Charon'}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  defaultVoiceId: e.target.value,
                })
              }
              className="w-full rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 text-xs font-semibold text-[#102D45]"
            >
              {VOICE_OPTIONS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.id} — {v.descriptionFr}
                </option>
              ))}
            </select>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {VOICE_OPTIONS.slice(0, 4).map((v) => {
                const active = (settings.defaultVoiceId || 'Charon') === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() =>
                      onUpdateSettings({
                        ...settings,
                        defaultVoiceId: v.id,
                      })
                    }
                    className={`rounded-lg border px-2.5 py-2 text-left transition-colors ${
                      active
                        ? 'border-[#102D45] bg-[#102D45] text-white'
                        : 'border-[#102D45]/12 bg-[#F5F7FA] text-[#102D45] hover:border-[#E7B34C]'
                    }`}
                  >
                    <p className="text-xs font-bold">{v.id}</p>
                    <p
                      className={`text-[10px] ${
                        active ? 'text-[#E7B34C]' : 'text-slate-600'
                      }`}
                    >
                      {v.descriptionFr}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center justify-between rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-3 text-xs font-semibold text-[#102D45]">
            <span>Sauvegarde automatique dans l’éditeur</span>
            <input
              type="checkbox"
              checked={settings.autoSaveEnabled}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  autoSaveEnabled: e.target.checked,
                })
              }
              className="h-4 w-4 accent-[#102D45]"
            />
          </label>
        </section>

        {/* CRM Adapter Configuration */}
        <section className="rounded-2xl border border-[#102D45]/10 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="inline-flex items-center gap-2 text-sm font-bold text-[#102D45]">
              <Workflow className="h-4 w-4 text-[#1C4967]" />
              Adaptateur d’intégration CRM externe
            </h2>
            <span className="rounded bg-[#E7B34C]/20 px-2 py-0.5 text-[10px] font-bold text-[#102D45]">
              SimulatedCrmAdapter
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102D45] mb-1">
              Endpoint CRM cible (configurable pour intégration)
            </label>
            <input
              type="url"
              value={settings.crmIntegration.endpointUrl}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  crmIntegration: {
                    ...settings.crmIntegration,
                    endpointUrl: e.target.value,
                  },
                })
              }
              className="w-full rounded-xl border border-[#102D45]/15 bg-[#F5F7FA] px-3 py-2 font-mono text-xs"
            />
          </div>

          <label className="flex items-center justify-between rounded-xl border border-[#102D45]/10 bg-[#F5F7FA] p-3 text-xs font-semibold text-[#102D45]">
            <span>Inclure l’attribution & UTM dans le contrat</span>
            <input
              type="checkbox"
              checked={settings.crmIntegration.includeUtmAttribution}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  crmIntegration: {
                    ...settings.crmIntegration,
                    includeUtmAttribution: e.target.checked,
                  },
                })
              }
              className="h-4 w-4 accent-[#102D45]"
            />
          </label>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-950 flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
            <div>
              <p className="font-bold">Périmètre strict du Creator</p>
              <p className="mt-0.5 leading-relaxed">
                Aucun CRM, pipeline ou stockage de leads n’est exécuté dans ce module. Un clic sur un bouton WhatsApp reste un lien direct (`trackAsCrmLead: false`).
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* TypeScript Contract Schema Preview */}
      <section className="rounded-2xl border border-[#102D45]/10 bg-white p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#102D45]">
          <Code2 className="h-4 w-4 text-[#1C4967]" />
          Contrat TypeScript prêt pour raccordement (`src/integration-contracts/crmAdapter.ts`)
        </div>
        <pre
          dir="ltr"
          className="overflow-x-auto rounded-xl bg-[#102D45] p-4 font-mono text-xs text-slate-100 leading-relaxed"
        >
          {CONTRACT_SCHEMA_PREVIEW}
        </pre>
      </section>
    </div>
  );
}
