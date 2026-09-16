/**
 * /demo — data pro výstavní ukázku s jedním vybraným asistentem.
 *
 * Každý záznam popisuje obchodní kontext, schopnosti, ukázkový hovor a otázky
 * jednoho virtuálního asistenta. Data slouží jako společný zdroj pro přepínání
 * obsahu showroomu mezi jednotlivými asistenty.
 *
 * Identifikátory Vapi jsou demonstrační placeholders; produkční hodnoty se mají
 * načítat z mapy environment variables. Ceny a provozní fakta odpovídají
 * původním scénářům v projektu.
 */

import type { IconName } from '@/components/shared/Icon';

export interface AssistantDemo {
  id: string;
  name: string;
  category: string;
  companyType: string;
  shortDescription: string;
  description: string;
  capabilities: string[];
  script: { step: string; label: string; text: string }[];
  canAdd: string[];
  exampleQuestions: string[];
  vapiAssistantId?: string;
  icon: IconName;
}

export const ASSISTANTS: AssistantDemo[] = [
  {
    id: 'klara',
    name: 'Klára',
    category: 'Kadeřnictví a salony',
    companyType: 'Salon Krása & Styl',
    shortDescription: 'Virtuální recepční pro kadeřnictví',
    description:
      'Klára zvedá telefon za Salon Krása & Styl, odpovídá na dotazy ke službám, cenám a otevírací době a pomáhá zákazníkům s objednáním i změnou termínu. Složitější požadavky předá člověku.',
    capabilities: [
      'odpovídá na služby',
      'vysvětlí ceny',
      'sdělí otevírací dobu',
      'pomůže s objednáním',
      'řeší změnu termínu',
      'předá požadavek člověku',
      'odpovídá i mimo pracovní dobu',
    ],
    script: [
      {
        step: '01',
        label: 'Klient zavolá',
        text: '',
      },
      {
        step: '02',
        label: 'Klára se představí',
        text: 'Dobrý den, tady Klára ze Salonu Krása & Styl. Jak vám můžu pomoct?',
      },
      {
        step: '03',
        label: 'Klient se zeptá na službu',
        text: 'Kolik stojí dámský střih?',
      },
      {
        step: '04',
        label: 'Klára odpoví',
        text: 'Dámský střih u nás začíná na 650 Kč. Pokud chcete i foukanou, můžeme ji přidat k objednávce.',
      },
      {
        step: '05',
        label: 'Klára nabídne další krok',
        text: 'Chcete rovnou najít volný termín?',
      },
    ],
    canAdd: [
      '+ Rezervace termínů',
      '+ Google Calendar',
      '+ Přepojení na člověka',
      '+ SMS po hovoru',
      '+ Zpracování poptávky',
      '+ FAQ',
      '+ Cenové informace',
      '+ CRM',
      '+ Kontrola dostupnosti',
      '+ Vícejazyčná komunikace',
    ],
    exampleQuestions: [
      'Jaká je vaše otevírací doba?',
      'Můžu si objednat termín na střih?',
      'Kolik stojí dámský střih?',
      'Děláte i barvení?',
      'Můžu termín přesunout?',
    ],
    vapiAssistantId: 'vapi_klara_salon',
    icon: 'scissors',
  },
  {
    id: 'anna',
    name: 'Anna',
    category: 'Restaurace a bistra',
    companyType: 'Restaurace U Kozla',
    shortDescription: 'Virtuální recepční pro restauraci',
    description:
      'Anna přijímá telefonáty za Restauraci U Kozla, pomáhá s rezervacemi stolů, odpovídá na otevírací dobu, denní nabídku a dotazy k alergenům. Větší akce a nejasné požadavky předá personálu.',
    capabilities: [
      'přijímá rezervace stolů',
      'odpovídá na otevírací dobu',
      'vysvětlí denní nabídku',
      'zodpoví dotazy k alergenům',
      'domluví stůl pro větší skupinu',
      'řeší změnu rezervace',
      'předá požadavek personálu',
      'odpovídá i mimo pracovní dobu',
    ],
    script: [
      {
        step: '01',
        label: 'Klient zavolá',
        text: '',
      },
      {
        step: '02',
        label: 'Anna se představí',
        text: 'Dobrý den, tady Anna z Restaurace U Kozla. Chcete si rezervovat stůl, nebo se na něco zeptat?',
      },
      {
        step: '03',
        label: 'Klient se zeptá na rezervaci',
        text: 'Dobrý den, máte dnes večer volný stůl pro čtyři osoby a do kolika jste otevření?',
      },
      {
        step: '04',
        label: 'Anna odpoví',
        text: 'Samozřejmě. Otevřeno máme od 11:00 do 23:00, v pátek a v sobotu do půlnoci. Napište mi den a čas — stůl rezervuji a potvrdím.',
      },
      {
        step: '05',
        label: 'Anna nabídne další krok',
        text: 'Chcete rovnou zadat rezervaci? Případně vám řeknu i denní nabídku a alergeny.',
      },
    ],
    canAdd: [
      '+ Online rezervace stolů',
      '+ Propojení s rezervačním systémem',
      '+ Připomenutí rezervace e-mailem',
      '+ SMS připomenutí',
      '+ Správa zasedacího plánu',
      '+ Denní menu z administračního panelu',
      '+ Informace o alergenech',
      '+ Předání požadavku personálu',
      '+ Vícejazyčná komunikace',
      '+ Hodnocení návštěvy po hovoru',
    ],
    exampleQuestions: [
      'Můžu si rezervovat stůl na 4 osoby?',
      'Jakou máte otevírací dobu?',
      'Máte dnes něco k obědu?',
      'Máte bezlepkové jídlo?',
      'Zvládnete oslavu pro 12 lidí?',
    ],
    vapiAssistantId: 'vapi_anna_restaurant',
    icon: 'utensils',
  },
  {
    id: 'tomas',
    name: 'Tomáš',
    category: 'Služby a B2B',
    companyType: 'Recepce.tech — Služby',
    shortDescription: 'Obchodní asistent pro služby a B2B',
    description:
      'Tomáš představuje služby Recepce.tech, vysvětluje cenu a průběh realizace webu a pomáhá zájemcům připravit poptávku nebo nezávaznou konzultaci. Detailní technické otázky předá týmu.',
    capabilities: [
      'vysvětlí nabízené služby',
      'sdělí cenu webu od 49 000 Kč',
      'odpoví na dobu realizace',
      'představí údržbu po spuštění',
      'pomůže připravit poptávku',
      'domluví nezávaznou konzultaci',
      'předá detailní dotaz týmu',
      'odpovídá i mimo pracovní dobu',
    ],
    script: [
      {
        step: '01',
        label: 'Klient zavolá',
        text: '',
      },
      {
        step: '02',
        label: 'Tomáš se představí',
        text: 'Dobrý den, tady Tomáš z Recepce.tech. S čím vám můžu pomoct?',
      },
      {
        step: '03',
        label: 'Klient se zeptá na cenu webu',
        text: 'Kolik stojí web a jak dlouho trvá realizace?',
      },
      {
        step: '04',
        label: 'Tomáš odpoví',
        text: 'Web na míru nabízíme od 49 000 Kč. Standardní realizace zabere 4–6 týdnů od zadání do spuštění.',
      },
      {
        step: '05',
        label: 'Tomáš nabídne další krok',
        text: 'Chcete si domluvit nezávaznou konzultaci a probrat, co přesně potřebujete?',
      },
    ],
    canAdd: [
      '+ Automatizované zadání poptávky',
      '+ Propojení s CRM',
      '+ Kalendář konzultací',
      '+ E-mailové shrnutí po hovoru',
      '+ Šablony nabídek',
      '+ Návaznost na projektový systém',
      '+ Kontrola kapacity týmu',
      '+ Předání technickému specialistovi',
      '+ Vícejazyčná komunikace',
      '+ Pravidelný reporting hovorů',
    ],
    exampleQuestions: [
      'Jaké služby nabízíte?',
      'Kolik stojí web?',
      'Jak dlouho trvá realizace?',
      'Nabízíte i údržbu a změny po spuštění?',
      'Chci si domluvit konzultaci.',
    ],
    vapiAssistantId: 'vapi_tomas_services',
    icon: 'wrench',
  },
  {
    id: 'eva',
    name: 'Eva',
    category: 'E-commerce a prodej',
    companyType: 'Recepce.tech — Prodej',
    shortDescription: 'Obchodní asistent pro e-commerce',
    description:
      'Eva pomáhá zákazníkům e-shopu s výběrem produktů, dostupností, stavem objednávky a vrácením zboží. Umí také předat konverzaci operátorovi a vysvětlit podmínky služby Recepce.tech.',
    capabilities: [
      'odpovídá na produktové dotazy',
      'vysvětlí dostupnost zboží',
      'zkontroluje stav objednávky',
      'připraví informace o vrácení',
      'doporučí vhodný produkt',
      'předá konverzaci operátorovi',
      'vysvětlí cenu od 2 900 Kč/měsíc',
      'nabídne 14denní pilot',
    ],
    script: [
      {
        step: '01',
        label: 'Klient zavolá',
        text: '',
      },
      {
        step: '02',
        label: 'Eva se představí',
        text: 'Dobrý den, tady Eva z Recepce.tech. Hledáte něco konkrétního, nebo se chcete poradit?',
      },
      {
        step: '03',
        label: 'Klient se zeptá na asistenta pro e-shop',
        text: 'Máte virtuálního asistenta pro e-shop a kolik stojí měsíčně?',
      },
      {
        step: '04',
        label: 'Eva odpoví',
        text: 'Ano. Umí odpovídat na dostupnost zboží, stav objednávky a vrácení. Cena začíná na 2 900 Kč/měsíc podle počtu konverzací a kanálů.',
      },
      {
        step: '05',
        label: 'Eva nabídne další krok',
        text: 'Chcete si domluvit 14denní pilot a nastavit asistenta na vaše FAQ?',
      },
    ],
    canAdd: [
      '+ Propojení s e-shopem',
      '+ Kontrola skladových zásob',
      '+ Sledování stavu objednávky',
      '+ Automatizované vyřízení vrácení',
      '+ Integrace s CRM',
      '+ Doporučování produktů',
      '+ Slevové a věrnostní akce',
      '+ Předání živému operátorovi',
      '+ Vícejazyčná komunikace',
      '+ Shrnutí hovoru do zákaznického profilu',
    ],
    exampleQuestions: [
      'Máte virtuálního asistenta pro e-shop?',
      'Jak funguje předání živému operátorovi?',
      'Integrujete se s našim CRM?',
      'Kolik to stojí měsíčně?',
      'Můžu si to vyzkoušet zdarma?',
    ],
    vapiAssistantId: 'vapi_eva_sales',
    icon: 'building',
  },
];
