import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    title: 'Carla Di Lascio | Arte Terapia & Benessere Integrato',
  },
  {
    path: 'chi-sono',
    loadComponent: () => import('./features/about/about').then((m) => m.About),
    title: 'Chi sono | Carla Di Lascio',
  },
  {
    path: 'chi-sono-artista',
    loadComponent: () =>
      import('./features/artist-bio/artist-bio').then((m) => m.ArtistBio),
    title: 'Carla Di Lascio, Artista | Pittrice e Ceramista',
  },
  {
    path: 'cromopuntura',
    loadComponent: () =>
      import('./features/methods/method-page').then((m) => m.MethodPage),
    data: { slug: 'cromopuntura' },
    title: 'Cromopuntura | Carla Di Lascio',
  },
  {
    path: 'kinesiologia-emozionale',
    loadComponent: () =>
      import('./features/methods/method-page').then((m) => m.MethodPage),
    data: { slug: 'kinesiologia-emozionale' },
    title: 'Kinesiologia Emozionale | Carla Di Lascio',
  },
  {
    path: 'suonoterapia-vibrazionale',
    loadComponent: () =>
      import('./features/methods/method-page').then((m) => m.MethodPage),
    data: { slug: 'suonoterapia-vibrazionale' },
    title: 'Suonoterapia Vibrazionale | Carla Di Lascio',
  },
  {
    path: 'arte-terapia',
    loadComponent: () =>
      import('./features/methods/method-page').then((m) => m.MethodPage),
    data: { slug: 'arte-terapia' },
    title: 'Arte Terapia | Carla Di Lascio',
  },
  {
    path: 'percorsi',
    loadComponent: () =>
      import('./features/journeys/journeys').then((m) => m.Journeys),
    title: 'Percorsi | Carla Di Lascio',
  },
  {
    path: 'contatti',
    loadComponent: () =>
      import('./features/contact/contact').then((m) => m.Contact),
    title: 'Contatti | Carla Di Lascio',
  },
  {
    path: 'theme-preview',
    loadComponent: () =>
      import('./features/theme-preview/theme-preview').then(
        (m) => m.ThemePreview,
      ),
    title: 'Anteprima Tema & Spartan | Carla Di Lascio',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
