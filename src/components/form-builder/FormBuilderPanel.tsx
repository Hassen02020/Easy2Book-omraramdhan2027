import type { FormDefinition, OfferReference } from '../../types/creator';

interface FormBuilderPanelProps {
  form: FormDefinition;
  offerRef: OfferReference;
  onChangeForm: (form: FormDefinition) => void;
  onChangeOfferRef: (offerRef: OfferReference) => void;
}

export function FormBuilderPanel({
  form,
  offerRef,
  onChangeForm,
  onChangeOfferRef,
}: FormBuilderPanelProps) {
  const toggleField = (
    idx: number,
    prop: 'enabled' | 'required',
    value: boolean
  ) => {
    const nextFields = form.fields.map((f, i) =>
      i === idx ? { ...f, [prop]: value } : f
    );
    onChangeForm({ ...form, fields: nextFields });
  };

  const updateFieldLabel = (idx: number, label: string) => {
    const nextFields = form.fields.map((f, i) =>
      i === idx ? { ...f, label } : f
    );
    onChangeForm({ ...form, fields: nextFields });
  };

  return (
    <div className="space-y-5">
      {/* External Offer Reference (Non-authoritative) */}
      <div className="rounded-xl border border-[#102D45]/12 bg-[#F5F7FA] p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#102D45]">
            Référence Offre Externe
          </span>
          <span className="rounded bg-white px-2 py-0.5 font-mono text-[10px] text-[#1C4967]">
            {offerRef.offerCode}
          </span>
        </div>
        <p className="text-[11px] text-slate-600 leading-snug">
          Pointeur vers le catalogue central Easy2Book (aucune base concurrente créée dans le Creator).
        </p>

        <div className="space-y-2">
          <div>
            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
              ID Offre Externe (`offerId`)
            </label>
            <input
              type="text"
              value={offerRef.externalOfferId}
              onChange={(e) =>
                onChangeOfferRef({
                  ...offerRef,
                  externalOfferId: e.target.value,
                })
              }
              className="w-full rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 font-mono text-xs text-[#102D45]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
              Libellé d’affichage (aperçu)
            </label>
            <input
              type="text"
              value={offerRef.displayLabel}
              onChange={(e) =>
                onChangeOfferRef({ ...offerRef, displayLabel: e.target.value })
              }
              className="w-full rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 text-xs text-[#102D45]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
              Tarif indicatif mis en cache
            </label>
            <input
              type="text"
              value={offerRef.cachedSummary.startingPriceLabel}
              onChange={(e) =>
                onChangeOfferRef({
                  ...offerRef,
                  cachedSummary: {
                    ...offerRef.cachedSummary,
                    startingPriceLabel: e.target.value,
                  },
                })
              }
              className="w-full rounded-lg border border-[#102D45]/15 bg-white px-2.5 py-1.5 text-xs text-[#102D45]"
            />
          </div>
        </div>
      </div>

      {/* Form General Metadata */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-[#102D45]">
          Configuration du Form Builder
        </p>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            ID Formulaire (`formId`)
          </label>
          <input
            type="text"
            value={form.formId}
            onChange={(e) => onChangeForm({ ...form, formId: e.target.value })}
            className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 font-mono text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Titre du formulaire
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onChangeForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Texte du bouton d’envoi
          </label>
          <input
            type="text"
            value={form.submitLabel}
            onChange={(e) =>
              onChangeForm({ ...form, submitLabel: e.target.value })
            }
            className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Message de confirmation
          </label>
          <textarea
            rows={2}
            value={form.confirmationMessage}
            onChange={(e) =>
              onChangeForm({ ...form, confirmationMessage: e.target.value })
            }
            className="w-full rounded-lg border border-[#102D45]/15 bg-[#F5F7FA] px-2.5 py-1.5 text-xs"
          />
        </div>
      </div>

      {/* Configurable Fields */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-[#102D45]">
          Champs du formulaire ({form.fields.filter((f) => f.enabled).length}/{form.fields.length} actifs)
        </p>
        <div className="space-y-2">
          {form.fields.map((field, idx) => (
            <div
              key={field.key}
              className="rounded-xl border border-[#102D45]/10 bg-white p-2.5 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#102D45]">
                  <input
                    type="checkbox"
                    checked={field.enabled}
                    onChange={(e) =>
                      toggleField(idx, 'enabled', e.target.checked)
                    }
                    className="accent-[#102D45]"
                  />
                  <span className="font-mono text-[11px] text-[#1C4967]">
                    {field.key}
                  </span>
                </label>
                <label className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <input
                    type="checkbox"
                    disabled={!field.enabled}
                    checked={field.required}
                    onChange={(e) =>
                      toggleField(idx, 'required', e.target.checked)
                    }
                    className="accent-[#E7B34C]"
                  />
                  Requis
                </label>
              </div>
              <input
                type="text"
                value={field.label}
                disabled={!field.enabled}
                onChange={(e) => updateFieldLabel(idx, e.target.value)}
                className="w-full rounded-lg border border-[#102D45]/10 bg-[#F5F7FA] px-2 py-1 text-xs disabled:opacity-50"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
