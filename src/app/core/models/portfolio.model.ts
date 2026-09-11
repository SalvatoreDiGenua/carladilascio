export interface MethodColorTheme {
  primary: string;
  badge: string;
  border: string;
  bgLight: string;
}

export interface MethodItem {
  slug: string;
  title: string;
  shortDescription: string;
  treatmentExplanation: string;
  carlaApproach: string;
  description: string;
  goals: string[];
  sessionFormat: string;
  audience: string[];
  cautions: string;
  theme: MethodColorTheme;
  icon: 'cromo' | 'kinesio' | 'suono' | 'arte';
}

export interface JourneyItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  goal: string;
  format: string;
  details: string[];
}

export interface AboutPillar {
  title: string;
  description: string;
}

export interface PortfolioContent {
  personalInfo: {
    name: string;
    headline: string;
    subheadline: string;
    roles: string[];
    specializations: string[];
    phone: string;
    phoneRaw: string;
    email: string;
    address: string;
    availability: string;
    quote: string;
    introText: string[];
    medicalDisclaimer: string;
  };
  methods: MethodItem[];
  journeys: JourneyItem[];
  approachPrinciples: {
    title: string;
    description: string;
  }[];
  pillars: AboutPillar[];
  artistBio: {
    exhibitionCities: string[];
  };
}
