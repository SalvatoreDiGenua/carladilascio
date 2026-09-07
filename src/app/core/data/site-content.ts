import { PortfolioContent } from '../models/portfolio.model';

export const SITE_CONTENT: PortfolioContent = {
  personalInfo: {
    name: 'Carla Di Lascio',
    headline: 'Ritrovare equilibrio attraverso arte, ascolto e consapevolezza',
    subheadline:
      'Percorsi di arte terapia, benessere integrato e tecniche vibrazionali per accompagnare la persona nella conoscenza di sé.',
    roles: [
      'Docente di Arte specializzata in Arte Terapia',
      'Operatrice in Suono Terapia vibrazionale con campane tibetane',
      'Esperta in Cromopuntura e frequenze di luce',
      'Esperta in tecniche di meditazione guidata',
      'Esperta in Kinesiologia emozionale',
    ],
    specializations: [
      'Arte Terapia',
      'Cromopuntura',
      'Suonoterapia Vibrazionale',
      'Kinesiologia Emozionale',
      'Meditazione Guidata',
    ],
    phone: '327 623 1815',
    phoneRaw: '+393276231815',
    email: 'dilascio.carla@gmail.com',
    address: 'Via Vasto, 20 – 83100 Avellino (AV)',
    availability: 'Si riceve esclusivamente su appuntamento.',
    quote:
      'Ogni persona possiede un linguaggio interiore. A volte, per ascoltarlo, servono colori, suoni, movimento e spazio.',
    introText: [
      'A volte dentro di noi si accumulano ferite silenziose. Se non vengono portate alla consapevolezza, finiscono per guidare le nostre scelte, alimentando uno stato di stress continuo.',
      'Le metodologie utilizzate nascono da anni di studio, insegnamento e ricerca sul campo: strumenti dolci e non invasivi pensati per migliorare la qualità della vita, favorire lo sviluppo personale e accompagnare ogni persona nel riconoscimento del proprio sé più autentico.',
    ],
    medicalDisclaimer:
      'Nota informativa: Le attività, i percorsi e le metodologie presentate in questo sito riguardano il benessere integrato, la crescita personale e l’educazione all’ascolto di sé. Non costituiscono atti medici, terapie sanitarie né diagnosi, e non sostituiscono in alcun modo il parere, le cure o le prescrizioni di medici, psicoterapeuti o altri professionisti sanitari abilitati.',
    formNotice: '',
  },
  methods: [
    {
      slug: 'cromopuntura',
      title: 'Cromopuntura',
      shortDescription:
        'Applicazione non invasiva di fasci di luce colorata su punti e zone cutanee per stimolare il riequilibrio energetico e fisico.',
      treatmentExplanation:
        'La cromopuntura è una tecnica vibrazionale dolce che trasmette specifiche lunghezze d’onda cromatiche attraverso una penna ottica su punti precisi della pelle, simili a quelli usati nelle discipline orientali. La luce agisce come stimolo informativo per sostenere i processi di autoregolazione dell’organismo, senza aghi e senza dolore.',
      carlaApproach:
        'Carla inizia ogni seduta accogliendo lo stato di affaticamento e le tensioni corporee della persona. Non applica schemi rigidi: individua i punti da trattare attraverso un ascolto attento del momento presente, accompagnando la persona in una pausa protetta dove la luce favorisce il rilassamento del sistema nervoso e la distensione dei sovraccarichi emotivi.',
      description:
        'Un metodo delicato e mirato, utile per alleggerire gli stati di tensione psicofisica, migliorare la qualità del riposo e favorire una rinnovata sensazione di armonia corporea.',
      goals: [
        'Sostenere la riduzione dello stress e della stanchezza cronica',
        'Favorire un ritmo sonno-veglia più regolare',
        'Riequilibrarsi durante momenti di transizione o sovraccarico emotivo',
        'Riconnettersi con la percezione serena del proprio corpo',
      ],
      sessionFormat:
        'La seduta si svolge in un ambiente silenzioso e raccolto. La persona rimane comodamente distesa e vestita, mentre la penna cromatica viene appoggiata con delicatezza sui punti selezionati.',
      audience: [
        'Persone che attraversano periodi di forte stress o ansia',
        'Chi cerca un approccio di benessere dolce e privo di invasività',
        'Adulti, ragazzi e anziani sensibili ai trattamenti convenzionali',
      ],
      cautions:
        'La cromopuntura non sostituisce trattamenti medici o fisioterapici. In presenza di patologie conclamate, opera esclusivamente come supporto al benessere soggettivo.',
      theme: {
        primary: 'var(--color-aqua)',
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        border: 'border-emerald-200',
        bgLight: 'bg-emerald-50/50',
      },
      icon: 'cromo',
    },
    {
      slug: 'kinesiologia-emozionale',
      title: 'Kinesiologia Emozionale',
      shortDescription:
        'Valutazione della risposta neuromuscolare per individuare e sciogliere blocchi emotivi e tensioni memorizzate nel corpo.',
      treatmentExplanation:
        'La kinesiologia emozionale utilizza il test muscolare di precisione come biofeedback naturale. Quando una persona vive uno stress prolungato o un’emozione non espressa, il sistema muscolare riflette questo sovraccarico con una temporanea perdita di tono. Il test permette di mappare i punti di attrito emotivo memorizzati nella fisiologia.',
      carlaApproach:
        'Carla adopera il test muscolare come un canale di dialogo rispettoso, senza giudizio e senza forzature. Aiuta la persona a dare un nome chiaro alle ferite silenziose o ai condizionamenti del passato che continuano a generare ansia o blocchi relazionali, guidando poi specifiche stimolazioni per disinnescare la carica emotiva associata.',
      description:
        'Uno strumento efficace per comprendere l’origine di comportamenti ripetitivi o difficoltà relazionali, trasformando la consapevolezza corporea in una risorsa di chiarificazione interiore.',
      goals: [
        'Riconoscere e disinnescare schemi reattivi legati a vecchie ferite',
        'Migliorare la gestione dell’ansia e della sicurezza personale',
        'Superare situazioni di stallo decisionale o relazionale',
        'Sviluppare maggiore chiarezza e coerenza tra corpo ed emozioni',
      ],
      sessionFormat:
        'Seduta individuale di ascolto e test muscolare dolce (generalmente sul braccio). Si individuano i fattori di stress e si applicano tecniche di riequilibrio non invasive.',
      audience: [
        'Persone che sentono di ripetere schemi limitanti nelle relazioni o nel lavoro',
        'Chi avverte somatizzazioni fisiche legate a tensioni emotive',
        'Chiunque desideri approfondire la conoscenza autentica di sé',
      ],
      cautions:
        'Non si tratta di una psicoterapia né di una diagnosi psichiatrica. Nei percorsi con problematiche cliniche, si lavora in raccordo con i sanitari di riferimento.',
      theme: {
        primary: 'var(--color-coral)',
        badge: 'bg-rose-50 text-rose-800 border-rose-200',
        border: 'border-rose-200',
        bgLight: 'bg-rose-50/50',
      },
      icon: 'kinesio',
    },
    {
      slug: 'suonoterapia-vibrazionale',
      title: 'Suonoterapia Vibrazionale',
      shortDescription:
        'Trattamento acustico e frequenziale con campane tibetane per distendere il sistema nervoso e favorire la meditazione profonda.',
      treatmentExplanation:
        'La suonoterapia vibrazionale impiega i toni armonici e le oscillazioni fisiche prodotte dalle campane tibetane e da strumenti accordati. Le onde sonore si propagano attraverso i liquidi e i tessuti corporei, inducendo un rapido rallentamento delle frequenze cerebrali verso ritmi alfa e theta, propri degli stati meditativi rigenerativi.',
      carlaApproach:
        'Grazie alla sua esperienza nelle tecniche vibrazionali e nella meditazione guidata, Carla orchestra i suoni calibrando l’intensità e la vicinanza degli strumenti in base alla sensibilità di chi riceve. Crea un ambiente protetto e accogliente nel quale la persona può abbandonare le difese quotidiane e lasciarsi cullare dalla risonanza acustica.',
      description:
        'Un bagno di vibrazioni che dissolve le rigidità muscolari e placa il chiacchiericcio mentale, risvegliando un senso spontaneo di centratura e pace interiore.',
      goals: [
        'Placare l’iperattività mentale e l’ansia acuta',
        'Sciogliere contratture e tensioni fisiche diffuse',
        'Sperimentare stati di rilassamento e meditazione profonda',
        'Favorire un recupero energetico rigenerante',
      ],
      sessionFormat:
        'La persona si accomoda distesa su un lettino o materassino. Le campane vengono suonate nello spazio circostante e, dove opportuno, posizionate con delicatezza sul corpo vestito.',
      audience: [
        'Chi fatica a staccare la mente e soffre di ritmi frenetici',
        'Persone desiderose di sperimentare la meditazione sonora',
        'Piccoli gruppi in cerca di un’esperienza collettiva distensiva',
      ],
      cautions:
        'Non è raccomandata in caso di portatori di pacemaker, epilessia grave non controllata o nelle prime settimane di gravidanza senza previo parere medico.',
      theme: {
        primary: 'var(--color-lavender)',
        badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        border: 'border-indigo-200',
        bgLight: 'bg-indigo-50/50',
      },
      icon: 'suono',
    },
    {
      slug: 'arte-terapia',
      title: 'Arte Terapia',
      shortDescription:
        'Percorso espressivo con linguaggi visivi e materici per dare forma all’interiorità, elaborare emozioni e rafforzare l’autostima.',
      treatmentExplanation:
        'L’arte terapia sfrutta il potenziale comunicativo di colori, pittura, disegno, argilla e collage come canali di espressione pre-verbale. Permette di proiettare all’esterno sentimenti, conflitti o vissuti complessi che spesso non trovano parole adeguate per essere descritti o compresi.',
      carlaApproach:
        'Da docente di arte e specialista in arte terapia, Carla non si concentra sull’abilità tecnica o sul giudizio estetico del manufatto. Accompagna la persona o il gruppo con rispetto, offrendo stimoli visivi e materiali adatti a liberare l’immaginazione. L’opera creata diventa uno specchio da osservare insieme, senza interpretazioni precostituite ma valorizzando il significato che la persona stessa vi attribuisce.',
      description:
        'Uno spazio protetto di sperimentazione creativa in cui ritrovare fiducia nelle proprie risorse, favorire la resilienza e consolidare un’autostima autentica.',
      goals: [
        'Rafforzare l’autostima e la fiducia nelle proprie capacità creative',
        'Elaborare e dare forma a emozioni difficili (ansia, dolore, cambiamento)',
        'Esplorare nuove prospettive di fronte a difficoltà relazionali',
        'Favorire processi di inclusione, condivisione e crescita personale',
      ],
      sessionFormat:
        'Incontri individuali o laboratori di gruppo in cui si alternano momenti di accoglienza, produzione artistica libera o guidata, e riflessione condivisa.',
      audience: [
        'Persone di ogni età (non è richiesta alcuna competenza artistica)',
        'Piccoli gruppi, contesti scolastici ed educativi',
        'Ambienti aziendali e sociali per percorsi di team building ed empowerment',
      ],
      cautions:
        'L’arte terapia non sostituisce la psicoterapia clinica; in ambiti terapeutici si inserisce come attività complementare in accordo con gli specialisti di cura.',
      theme: {
        primary: 'var(--color-powder)',
        badge: 'bg-sky-50 text-sky-800 border-sky-200',
        border: 'border-sky-200',
        bgLight: 'bg-sky-50/50',
      },
      icon: 'arte',
    },
  ],
  journeys: [
    {
      id: 'individuali',
      title: 'Percorsi Individuali',
      subtitle: 'Un cammino su misura per le tue esigenze personali',
      description:
        'Uno spazio intimo e riservato in cui definire insieme gli obiettivi di benessere: dalla gestione dell’ansia al recupero delle proprie risorse creative, integrando le diverse metodologie secondo le necessità del momento.',
      goal: 'Ascolto profondo, consapevolezza dei propri bisogni e rilascio delle tensioni accumulate.',
      format:
        'Incontri personalizzati su appuntamento presso lo studio di Avellino.',
      details: [
        'Valutazione iniziale dello stato di benessere e degli obiettivi',
        'Integrazione flessibile tra arte terapia, cromopuntura e suoni',
        'Rispetto rigoroso dei ritmi personali e totale assenza di giudizio',
      ],
    },
    {
      id: 'gruppi',
      title: 'Piccoli Gruppi & Laboratori',
      subtitle: 'Condivisione, risonanza ed espressione comune',
      description:
        'Esperienze a numero chiuso dedicate a laboratori esperienziali di arte terapia, meditazione sonora e percorsi a tema per sperimentare la ricchezza del confronto e del sostegno reciproco.',
      goal: 'Sviluppare empatia, riscoprire la creatività condivisa e rafforzare le capacità relazionali.',
      format: 'Cicli di incontri o workshop tematici a piccoli gruppi.',
      details: [
        'Laboratori artistici su temi specifici (autostima, emozioni, cambiamento)',
        'Sessioni di rilassamento armonico con campane tibetane',
        'Ambiente protetto, empatico e non giudicante',
      ],
    },
    {
      id: 'aziende-sociale',
      title: 'Contesti Speciali, Aziendali & Sociali',
      subtitle: 'Benessere integrato, empowerment e coesione',
      description:
        'Interventi progettati per team aziendali, organizzazioni, enti educativi e comunità per favorire il clima relazionale, prevenire il burn-out e stimolare il pensiero laterale attraverso l’arte.',
      goal: 'Sostenere il benessere organizzativo, la coesione di squadra e la creatività collettiva.',
      format:
        'Progetti modulari in sede o presso strutture dedicate, concordati su obiettivi specifici.',
      details: [
        'Laboratori di espressione visiva per la coesione di gruppo',
        'Percorsi di gestione dello stress lavorativo e defaticamento mentale',
        'Metodologie adattate ai contesti sociali e di inclusione',
      ],
    },
    {
      id: 'collaborazioni-sanitarie',
      title: 'Collaborazione con Professionisti Sanitari',
      subtitle: 'Integrazione e supporto interdisciplinare',
      description:
        'Disponibilità a collaborare con medici, psicologi, psichiatri e neurologi all’interno di percorsi multidisciplinari, dove le metodologie di benessere integrato affiancano i protocolli di cura prescritti.',
      goal: 'Fornire un supporto complementare e non invasivo all’interno di percorsi di cura strutturati.',
      format:
        'Raccordo continuativo con il team curante e rispetto del piano terapeutico principale.',
      details: [
        'Interventi di supporto per problematiche neurologiche e psichiatriche',
        'Attività dolci di stimolazione sensoriale ed espressiva',
        'Comunicazione trasparente e confini professionali rigorosi',
      ],
    },
  ],
  approachPrinciples: [
    {
      title: 'Ascolto Attento',
      description:
        'Ogni persona porta con sé una storia unica. L’ascolto privo di fretta è il primo strumento per comprendere bisogni reali e sensibilità.',
    },
    {
      title: 'Rispetto dei Tempi Individuali',
      description:
        'Nessuna forzatura. Il percorso procede alla velocità necessaria per metabolizzare ogni passaggio con serenità.',
    },
    {
      title: 'Consapevolezza Corporea ed Emotiva',
      description:
        'Imparare a riconoscere i segnali del corpo e le emozioni permette di disinnescare reazioni automatiche di stress.',
    },
    {
      title: 'Creatività come Risorsa',
      description:
        'L’atto creativo apre strade inaspettate dove il pensiero razionale trova ostacoli o ripetizioni.',
    },
    {
      title: 'Integrazione Multidisciplinare',
      description:
        'Corpo, suono, colore e parola lavorano insieme per offrire un’esperienza equilibrata e completa.',
    },
    {
      title: 'Assenza di Giudizio',
      description:
        'Uno spazio protetto in cui ogni espressione, dubbio o emozione viene accolto con dignità e delicatezza.',
    },
  ],
  pillars: [
    {
      title: 'Formazione Continua',
      description:
        'Anni di studio nell’insegnamento artistico e nella specializzazione in arte terapia e tecniche vibrazionali.',
    },
    {
      title: 'Pratiche Dolci e Non Invasive',
      description:
        'Metodologie delicate che rispettano l’integrità fisica e psichica di chi vi si accosta.',
    },
    {
      title: 'Centralità della Persona',
      description:
        'Nessun protocollo standardizzato: ogni incontro risponde alla situazione contingente e agli obiettivi concordati.',
    },
    {
      title: 'Etica e Trasparenza',
      description:
        'Confini deontologici chiari, collaborazione con la medicina ufficiale e nessuna falsa promessa.',
    },
  ],
};
