import { PortfolioContent } from '../models/portfolio.model';

export const SITE_CONTENT: PortfolioContent = {
  personalInfo: {
    name: 'Carla Di Lascio',
    headline: 'personalInfo.headline',
    subheadline: 'personalInfo.subheadline',
    roles: [
      'personalInfo.roles.0',
      'personalInfo.roles.1',
      'personalInfo.roles.2',
      'personalInfo.roles.3',
      'personalInfo.roles.4',
    ],
    specializations: [
      'personalInfo.specializations.0',
      'personalInfo.specializations.1',
      'personalInfo.specializations.2',
      'personalInfo.specializations.3',
      'personalInfo.specializations.4',
    ],
    phone: '327 623 1815',
    phoneRaw: '+393276231815',
    email: 'dilascio.carla@gmail.com',
    address: 'Via Vasto, 20 – 83100 Avellino (AV)',
    availability: 'personalInfo.availability',
    quote: 'personalInfo.quote',
    introText: ['personalInfo.introText.0', 'personalInfo.introText.1'],
    medicalDisclaimer: 'personalInfo.medicalDisclaimer',
    formNotice: 'personalInfo.formNotice',
  },
  methods: [
    {
      slug: 'cromopuntura',
      title: 'methods.cromopuntura.title',
      shortDescription: 'methods.cromopuntura.shortDescription',
      treatmentExplanation: 'methods.cromopuntura.treatmentExplanation',
      carlaApproach: 'methods.cromopuntura.carlaApproach',
      description: 'methods.cromopuntura.description',
      goals: [
        'methods.cromopuntura.goals.0',
        'methods.cromopuntura.goals.1',
        'methods.cromopuntura.goals.2',
        'methods.cromopuntura.goals.3',
      ],
      sessionFormat: 'methods.cromopuntura.sessionFormat',
      audience: [
        'methods.cromopuntura.audience.0',
        'methods.cromopuntura.audience.1',
        'methods.cromopuntura.audience.2',
      ],
      cautions: 'methods.cromopuntura.cautions',
      theme: {
        primary: 'var(--color-aqua)',
        badge: 'bg-aqua-light text-aqua-dark border-aqua/30',
        border: 'border-aqua/30',
        bgLight: 'bg-aqua-light/50',
      },
      icon: 'cromo',
    },
    {
      slug: 'kinesiologia-emozionale',
      title: 'methods.kinesiologiaEmozionale.title',
      shortDescription: 'methods.kinesiologiaEmozionale.shortDescription',
      treatmentExplanation:
        'methods.kinesiologiaEmozionale.treatmentExplanation',
      carlaApproach: 'methods.kinesiologiaEmozionale.carlaApproach',
      description: 'methods.kinesiologiaEmozionale.description',
      goals: [
        'methods.kinesiologiaEmozionale.goals.0',
        'methods.kinesiologiaEmozionale.goals.1',
        'methods.kinesiologiaEmozionale.goals.2',
        'methods.kinesiologiaEmozionale.goals.3',
      ],
      sessionFormat: 'methods.kinesiologiaEmozionale.sessionFormat',
      audience: [
        'methods.kinesiologiaEmozionale.audience.0',
        'methods.kinesiologiaEmozionale.audience.1',
        'methods.kinesiologiaEmozionale.audience.2',
      ],
      cautions: 'methods.kinesiologiaEmozionale.cautions',
      theme: {
        primary: 'var(--color-coral)',
        badge: 'bg-coral-light text-coral-dark border-coral/30',
        border: 'border-coral/30',
        bgLight: 'bg-coral-light/50',
      },
      icon: 'kinesio',
    },
    {
      slug: 'suonoterapia-vibrazionale',
      title: 'methods.suonoterapiaVibrazionale.title',
      shortDescription: 'methods.suonoterapiaVibrazionale.shortDescription',
      treatmentExplanation:
        'methods.suonoterapiaVibrazionale.treatmentExplanation',
      carlaApproach: 'methods.suonoterapiaVibrazionale.carlaApproach',
      description: 'methods.suonoterapiaVibrazionale.description',
      goals: [
        'methods.suonoterapiaVibrazionale.goals.0',
        'methods.suonoterapiaVibrazionale.goals.1',
        'methods.suonoterapiaVibrazionale.goals.2',
        'methods.suonoterapiaVibrazionale.goals.3',
      ],
      sessionFormat: 'methods.suonoterapiaVibrazionale.sessionFormat',
      audience: [
        'methods.suonoterapiaVibrazionale.audience.0',
        'methods.suonoterapiaVibrazionale.audience.1',
        'methods.suonoterapiaVibrazionale.audience.2',
      ],
      cautions: 'methods.suonoterapiaVibrazionale.cautions',
      theme: {
        primary: 'var(--color-lavender)',
        badge: 'bg-lavender-light text-lavender-dark border-lavender/30',
        border: 'border-lavender/30',
        bgLight: 'bg-lavender-light/50',
      },
      icon: 'suono',
    },
    {
      slug: 'arte-terapia',
      title: 'methods.arteTerapia.title',
      shortDescription: 'methods.arteTerapia.shortDescription',
      treatmentExplanation: 'methods.arteTerapia.treatmentExplanation',
      carlaApproach: 'methods.arteTerapia.carlaApproach',
      description: 'methods.arteTerapia.description',
      goals: [
        'methods.arteTerapia.goals.0',
        'methods.arteTerapia.goals.1',
        'methods.arteTerapia.goals.2',
        'methods.arteTerapia.goals.3',
      ],
      sessionFormat: 'methods.arteTerapia.sessionFormat',
      audience: [
        'methods.arteTerapia.audience.0',
        'methods.arteTerapia.audience.1',
        'methods.arteTerapia.audience.2',
      ],
      cautions: 'methods.arteTerapia.cautions',
      theme: {
        primary: 'var(--color-powder)',
        badge: 'bg-powder-light text-powder-dark border-powder/30',
        border: 'border-powder/30',
        bgLight: 'bg-powder-light/50',
      },
      icon: 'arte',
    },
  ],
  journeys: [
    {
      id: 'individuali',
      title: 'journeys.individuali.title',
      subtitle: 'journeys.individuali.subtitle',
      description: 'journeys.individuali.description',
      goal: 'journeys.individuali.goal',
      format: 'journeys.individuali.format',
      details: [
        'journeys.individuali.details.0',
        'journeys.individuali.details.1',
        'journeys.individuali.details.2',
      ],
    },
    {
      id: 'gruppi',
      title: 'journeys.gruppi.title',
      subtitle: 'journeys.gruppi.subtitle',
      description: 'journeys.gruppi.description',
      goal: 'journeys.gruppi.goal',
      format: 'journeys.gruppi.format',
      details: [
        'journeys.gruppi.details.0',
        'journeys.gruppi.details.1',
        'journeys.gruppi.details.2',
      ],
    },
    {
      id: 'aziende-sociale',
      title: 'journeys.aziendeSociale.title',
      subtitle: 'journeys.aziendeSociale.subtitle',
      description: 'journeys.aziendeSociale.description',
      goal: 'journeys.aziendeSociale.goal',
      format: 'journeys.aziendeSociale.format',
      details: [
        'journeys.aziendeSociale.details.0',
        'journeys.aziendeSociale.details.1',
        'journeys.aziendeSociale.details.2',
      ],
    },
    {
      id: 'collaborazioni-sanitarie',
      title: 'journeys.collaborazioniSanitarie.title',
      subtitle: 'journeys.collaborazioniSanitarie.subtitle',
      description: 'journeys.collaborazioniSanitarie.description',
      goal: 'journeys.collaborazioniSanitarie.goal',
      format: 'journeys.collaborazioniSanitarie.format',
      details: [
        'journeys.collaborazioniSanitarie.details.0',
        'journeys.collaborazioniSanitarie.details.1',
        'journeys.collaborazioniSanitarie.details.2',
      ],
    },
  ],
  approachPrinciples: [
    {
      title: 'approachPrinciples.attentiveListening.title',
      description: 'approachPrinciples.attentiveListening.description',
    },
    {
      title: 'approachPrinciples.respectForIndividualTiming.title',
      description:
        'approachPrinciples.respectForIndividualTiming.description',
    },
    {
      title: 'approachPrinciples.bodyEmotionalAwareness.title',
      description: 'approachPrinciples.bodyEmotionalAwareness.description',
    },
    {
      title: 'approachPrinciples.creativityAsResource.title',
      description: 'approachPrinciples.creativityAsResource.description',
    },
    {
      title: 'approachPrinciples.multidisciplinaryIntegration.title',
      description:
        'approachPrinciples.multidisciplinaryIntegration.description',
    },
    {
      title: 'approachPrinciples.nonJudgment.title',
      description: 'approachPrinciples.nonJudgment.description',
    },
  ],
  pillars: [
    {
      title: 'pillars.continuousTraining.title',
      description: 'pillars.continuousTraining.description',
    },
    {
      title: 'pillars.gentleNonInvasivePractices.title',
      description: 'pillars.gentleNonInvasivePractices.description',
    },
    {
      title: 'pillars.personCentered.title',
      description: 'pillars.personCentered.description',
    },
    {
      title: 'pillars.ethicsTransparency.title',
      description: 'pillars.ethicsTransparency.description',
    },
  ],
  artistBio: {
    exhibitionCities: [
      'artistBio.exhibitionCities.0',
      'artistBio.exhibitionCities.1',
      'artistBio.exhibitionCities.2',
      'artistBio.exhibitionCities.3',
      'artistBio.exhibitionCities.4',
      'artistBio.exhibitionCities.5',
    ],
  },
};
