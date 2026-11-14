import type {
  AttributionSettings,
  BusinessUniverse,
  CreatorLanguage,
  FormFieldKey,
  WhatsAppActionConfig,
} from '../types/creator';

/**
 * EASY2BOOK LANDING PAGE CREATOR — INTEGRATION CONTRACTS FOR CLAUDE / BACKEND TEAM
 * ----------------------------------------------------------------------------------
 * Ce module définit strictement les contrats TypeScript d'intégration entre le
 * Landing Page Creator et le CRM externe existant d'Easy2Book.
 *
 * IMPORTANT :
 * - Aucune logique CRM, aucun pipeline, aucune table de leads n'est implémentée ici.
 * - Jusqu'au raccordement réel par l'équipe technique (Claude), toutes les soumissions
 *   passent par `SimulatedCrmAdapter` qui valide et journalise le payload en local.
 * - Un simple clic sur un bouton WhatsApp (`WhatsAppActionConfig`) N'EST JAMAIS
 *   considéré comme une soumission de lead CRM ni comme une réservation.
 */

export interface CrmIntegrationConfig {
  /** Endpoint configurable côté Paramètres du Creator (ex: fourni lors de l'intégration réelle) */
  endpointUrl: string;
  mode: 'simulated_adapter' | 'configured_webhook';
  timeoutMs: number;
  includeUtmAttribution: boolean;
}

export interface CrmLeadSubmissionContract {
  contractVersion: '1.0.0';
  /** Identifiant unique de la landing page dans le Creator */
  pageId: string;
  /** Identifiant externe de l'offre référencée (`OfferReference.externalOfferId`) */
  offerId: string;
  /** Univers métier Easy2Book */
  businessUniverse: BusinessUniverse;
  /** Langue de la page lors de la soumission */
  pageLanguage: CreatorLanguage;
  /** Attribution & UTM */
  acquisitionSource: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  /** Identifiant du formulaire configuré dans le Form Builder */
  formId: string;
  /** Horodatage ISO 8601 de la soumission */
  submittedAt: string;
  /** Valeurs saisies selon le FormDefinition */
  fields: Partial<Record<FormFieldKey, string | number | boolean>>;
}

export interface CrmAdapterDispatchResult {
  adapterType: 'SIMULATED_ADAPTER';
  accepted: boolean;
  payload: CrmLeadSubmissionContract;
  note: string;
}

export interface LandingPageCrmAdapter {
  readonly adapterName: string;
  submitLeadForm(
    payload: CrmLeadSubmissionContract,
    config: CrmIntegrationConfig
  ): Promise<CrmAdapterDispatchResult>;
}

/**
 * Adaptateur simulé utilisé tant que le raccordement vers le CRM externe
 * n'est pas branché. Ne déclenche aucun appel vers un CRM fictif.
 */
export const SimulatedCrmAdapter: LandingPageCrmAdapter = {
  adapterName: 'Easy2Book Simulated CRM Contract Adapter (Preview)',

  async submitLeadForm(
    payload: CrmLeadSubmissionContract,
    config: CrmIntegrationConfig
  ): Promise<CrmAdapterDispatchResult> {
    return {
      adapterType: 'SIMULATED_ADAPTER',
      accepted: true,
      payload,
      note: `Simulation locale réussie. Aucun envoi réseau effectué. Prêt pour raccordement vers "${config.endpointUrl || '[ENDPOINT_CRM_À_CONFIGURER]'}" via contrat v${payload.contractVersion}.`,
    };
  },
};

/**
 * Helper pour construire un lien WhatsApp direct sans créer de lead CRM.
 */
export function buildWhatsAppDirectHref(config: WhatsAppActionConfig): string {
  const digits = config.phoneNumber.replace(/\D/g, '');
  const international = digits.startsWith('216') ? digits : `216${digits}`;
  return `https://wa.me/${international}?text=${encodeURIComponent(
    config.prefilledMessage
  )}`;
}

export function buildCrmSubmissionPayload(params: {
  pageId: string;
  offerId: string;
  businessUniverse: BusinessUniverse;
  pageLanguage: CreatorLanguage;
  formId: string;
  attribution: AttributionSettings;
  fields: Partial<Record<FormFieldKey, string | number | boolean>>;
  includeUtm: boolean;
}): CrmLeadSubmissionContract {
  return {
    contractVersion: '1.0.0',
    pageId: params.pageId,
    offerId: params.offerId,
    businessUniverse: params.businessUniverse,
    pageLanguage: params.pageLanguage,
    acquisitionSource: params.attribution.acquisitionSource,
    utmSource: params.includeUtm ? params.attribution.utmSource : '',
    utmMedium: params.includeUtm ? params.attribution.utmMedium : '',
    utmCampaign: params.includeUtm ? params.attribution.utmCampaign : '',
    utmContent: params.includeUtm ? params.attribution.utmContent : '',
    formId: params.formId,
    submittedAt: new Date().toISOString(),
    fields: params.fields,
  };
}
