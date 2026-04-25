/**
 * Seed the prospects table with publicly known high-energy-consumption
 * businesses across Morocco's Oriental region. The list is sourced from
 * publicly available information (company websites, official directories,
 * press coverage) and is intended as a *starting point* for outreach —
 * addresses should be verified on Google Maps before any visit.
 *
 * Run inside the tools container:
 *   docker compose --env-file .env --profile tools run --rm tools \
 *     sh -c "npm install --no-audit --no-fund && npx tsx scripts/seed-prospects.ts"
 */
import {sql} from 'drizzle-orm';
import {db} from '../src/db/client';
import {prospects, type NewProspect} from '../src/db/schema';

const SEED: NewProspect[] = [
  // ===================  Mining & metallurgy  ===================
  {
    name: 'Compagnie Minière de Touissit (CMT)',
    sector: 'Mining — lead/zinc',
    city: 'Touissit',
    address: 'Site minier de Touissit, Province de Jerada',
    estimatedMw: '5–15 MW',
    energyProfile:
      'Mine de plomb-zinc en activité. Forte consommation continue (concasseurs, ventilation, pompage). PPA solaire + stockage très adapté.',
    website: 'https://www.cmt.ma',
    status: 'cold',
    priority: 1,
    notes:
      "Holding Osead/CMT cotée à la Bourse de Casa. Public et bien documenté. Première cible Oriental."
  },
  {
    name: 'Sonasid Nador',
    sector: 'Steel rebar mill',
    city: 'Nador',
    address: 'Zone industrielle Selouane, Nador',
    estimatedMw: '20–40 MW',
    energyProfile:
      'Aciérie électrique (four à arc) — l\'un des plus gros consommateurs électriques industriels du nord. Exposé CBAM.',
    website: 'https://www.sonasid.ma',
    status: 'cold',
    priority: 1,
    notes:
      "Filiale Nucor / Riva. Site de Nador a un four électrique gourmand. Levier CBAM = argument d'entrée fort."
  },
  {
    name: 'Maroc Phosphore (OCP) — Al Hoceima ?',
    sector: 'Phosphate / chemicals',
    city: 'Selouane (Nador)',
    address: 'À vérifier sur Google Maps',
    estimatedMw: 'TBD',
    energyProfile:
      "Usine de transformation. À vérifier la présence active dans l'Oriental.",
    status: 'cold',
    priority: 3,
    notes: 'À vérifier — peut ne pas être actif dans la région.'
  },

  // ===================  Cement & construction  ===================
  {
    name: 'Holcim Maroc — Usine Oujda',
    sector: 'Cement',
    city: 'Oujda',
    address: 'Route de Berkane, Oujda',
    estimatedMw: '10–25 MW',
    energyProfile:
      'Cimenterie — process gourmand (broyeur, four). PPA solaire + récupération chaleur fatale très pertinent.',
    website: 'https://www.holcim.ma',
    status: 'cold',
    priority: 1,
    notes: 'Filiale LafargeHolcim. Forte exposition CBAM et taxe carbone.'
  },
  {
    name: 'Briqueterie Bouzaiane Maâmar Oujda (BMO)',
    sector: 'Bricks / ceramics',
    city: 'Oujda',
    address: 'Route de Taourirt, Oujda',
    estimatedMw: '0.5–2 MW',
    energyProfile:
      'Four de cuisson (gaz + électrique), mélangeurs, séchoirs. Petit à moyen offtaker idéal pour install on-site.',
    status: 'cold',
    priority: 2
  },
  {
    name: 'Briqueteries de la Région Orientale',
    sector: 'Bricks / ceramics',
    city: 'Oujda / Berkane',
    address: 'Multiples sites — à cartographier',
    estimatedMw: '0.3–1 MW chacune',
    energyProfile: 'Cluster de briqueteries — opportunité agrégation.',
    status: 'cold',
    priority: 2,
    notes: 'Approcher le syndicat des briqueteries.'
  },

  // ===================  Agriculture & cold chain  ===================
  {
    name: "Frumat — Citrus exporters Berkane",
    sector: 'Agri-export — citrus',
    city: 'Berkane',
    address: 'Zone industrielle de Madagh, Berkane',
    estimatedMw: '0.5–2 MW',
    energyProfile:
      'Stations de conditionnement + cold storage agrumes. Pic saisonnier (octobre–avril). Excellent fit on-site PV.',
    status: 'cold',
    priority: 1,
    notes: "L'un des plus grands exportateurs d'agrumes de la région."
  },
  {
    name: 'Domaines Agricoles — Berkane',
    sector: 'Agri-export — citrus',
    city: 'Berkane',
    address: 'Plaine de Triffa, Berkane',
    estimatedMw: '1–3 MW',
    energyProfile:
      'Irrigation goutte-à-goutte + cold storage. Eau pompée 24/7 en saison.',
    status: 'cold',
    priority: 1
  },
  {
    name: "Coopérative laitière de l'Oriental",
    sector: 'Agri — dairy',
    city: 'Taourirt',
    address: 'Zone industrielle, Taourirt',
    estimatedMw: '0.3–1 MW',
    energyProfile:
      'Refroidissement lait, pasteurisation, conditionnement. 24/7.',
    status: 'cold',
    priority: 2
  },
  {
    name: 'Huilerie / oléicole — Taourirt',
    sector: 'Agri — olive oil',
    city: 'Taourirt',
    address: 'Plusieurs unités — à recenser',
    estimatedMw: '0.2–0.8 MW chacune',
    energyProfile:
      "Trituration olive + chauffage process. Saisonnier mais récurrent.",
    status: 'cold',
    priority: 3,
    notes: 'Cluster — approcher la fédération oléicole.'
  },
  {
    name: 'Unimer — Conserverie poisson Nador',
    sector: 'Food processing — fish',
    city: 'Nador / Beni Ensar',
    address: 'Port de Beni Ensar / zone industrielle Nador',
    estimatedMw: '1–3 MW',
    energyProfile:
      "Conserverie + cold storage poisson. Energy intensive.",
    website: 'https://www.unimer.ma',
    status: 'cold',
    priority: 1
  },

  // ===================  Industrial zones  ===================
  {
    name: 'Zone Industrielle Selouane (Nador)',
    sector: 'Industrial zone',
    city: 'Selouane (Nador)',
    address: 'Zone industrielle de Selouane, Nador',
    estimatedMw: '20–60 MW agrégé',
    energyProfile:
      "Multiple tenants — automobile, textile, métallurgie légère. Modèle BESS + multi-tenant PPA.",
    status: 'cold',
    priority: 1,
    notes:
      'Approcher la SAPS / l\'autorité gestionnaire de la zone pour un contrat-cadre multi-tenant.'
  },
  {
    name: 'Parc Industriel Madagh (Berkane)',
    sector: 'Industrial zone',
    city: 'Berkane',
    address: 'Parc industriel de Madagh, Berkane',
    estimatedMw: '5–15 MW agrégé',
    energyProfile: "Hub agro-export. PPA + stockage approprié.",
    status: 'cold',
    priority: 1
  },
  {
    name: 'Zone Industrielle de Bouarfa',
    sector: 'Industrial zone',
    city: 'Bouarfa',
    address: 'Périphérie de Bouarfa, Province de Figuig',
    estimatedMw: '2–8 MW',
    energyProfile:
      'Petite zone — proche site DIA potentiel. Câble direct envisageable.',
    status: 'cold',
    priority: 2
  },

  // ===================  Hospitality & tourism  ===================
  {
    name: 'Mediterranea Saïdia (resort + golf)',
    sector: 'Hospitality / leisure',
    city: 'Saïdia',
    address: 'Saïdia Med, Plage de Saïdia',
    estimatedMw: '3–8 MW',
    energyProfile:
      'Multi-hôtels (Iberostar, Be Live, Barceló) + golf 36 trous + marina. Forte clim + chauffage piscines + irrigation golf. Saisonnier mais récurrent.',
    status: 'cold',
    priority: 1,
    notes: 'Approcher le gestionnaire CDG Développement / Saïdia Med.'
  },
  {
    name: 'Iberostar Saïdia',
    sector: 'Hospitality',
    city: 'Saïdia',
    address: 'Mediterrania Saïdia',
    estimatedMw: '0.5–1.5 MW',
    energyProfile: 'Hôtel 5* — clim, eau chaude, restaurants.',
    status: 'cold',
    priority: 2
  },
  {
    name: 'Marchica Med (Nador lagoon)',
    sector: 'Tourism / development',
    city: 'Nador',
    address: 'Lagune de Marchica, Nador',
    estimatedMw: '5–15 MW (projet)',
    energyProfile:
      'Mégaprojet en cours — opportunité partenaire stratégique long-terme.',
    status: 'cold',
    priority: 1,
    notes: 'Marchica Med Société (CDG Développement). Cibler les phases nouvelles.'
  },

  // ===================  Healthcare  ===================
  {
    name: 'CHU Mohammed VI Oujda',
    sector: 'Healthcare — hospital',
    city: 'Oujda',
    address: 'Route de Sidi Yahya, Oujda',
    estimatedMw: '2–5 MW',
    energyProfile:
      'Hôpital universitaire — consommation 24/7 (clim, IRM/scanner, blocs op). Critère uptime + stockage backup.',
    status: 'cold',
    priority: 1
  },
  {
    name: 'Hôpital Al Farabi Oujda',
    sector: 'Healthcare',
    city: 'Oujda',
    address: 'Boulevard Mohammed V, Oujda',
    estimatedMw: '0.8–2 MW',
    energyProfile: "Hôpital provincial. Consommation 24/7.",
    status: 'cold',
    priority: 2
  },
  {
    name: 'Hôpital Provincial Berkane',
    sector: 'Healthcare',
    city: 'Berkane',
    address: 'Avenue Hassan II, Berkane',
    estimatedMw: '0.5–1 MW',
    energyProfile: 'Hôpital régional.',
    status: 'cold',
    priority: 3
  },
  {
    name: 'Hôpital Hassani Nador',
    sector: 'Healthcare',
    city: 'Nador',
    address: "Quartier Tarrast, Nador",
    estimatedMw: '0.5–1 MW',
    energyProfile: 'Hôpital provincial.',
    status: 'cold',
    priority: 3
  },

  // ===================  Education & public  ===================
  {
    name: 'Université Mohammed Premier (UMP) Oujda',
    sector: 'Education — university',
    city: 'Oujda',
    address: 'Avenue Mohammed VI, Oujda',
    estimatedMw: '1.5–4 MW',
    energyProfile:
      'Campus principal + facultés satellites + cités U. Opportunité contrat-cadre éducation.',
    website: 'https://www.ump.ma',
    status: 'cold',
    priority: 1,
    notes: 'Approcher la Présidence + le service Patrimoine.'
  },
  {
    name: 'ENSA Oujda',
    sector: 'Education',
    city: 'Oujda',
    address: "Complexe universitaire Al Qods, Oujda",
    estimatedMw: '0.3–0.8 MW',
    energyProfile: 'École d\'ingénieurs — laboratoires + amphis.',
    status: 'cold',
    priority: 2
  },

  // ===================  Retail / logistics  ===================
  {
    name: 'Marjane Oujda',
    sector: 'Retail — hypermarket',
    city: 'Oujda',
    address: 'Route d\'Ahfir, Oujda',
    estimatedMw: '0.5–1.2 MW',
    energyProfile:
      "Hypermarché — clim + cold chain. Toiture massive : opportunité PV on-site.",
    status: 'cold',
    priority: 2
  },
  {
    name: 'Marjane Nador',
    sector: 'Retail — hypermarket',
    city: 'Nador',
    address: 'Route Ras Kebdana, Nador',
    estimatedMw: '0.4–1 MW',
    energyProfile: 'Idem Marjane Oujda.',
    status: 'cold',
    priority: 2
  },
  {
    name: 'BIM / Carrefour Market — réseau Oriental',
    sector: 'Retail — discount',
    city: 'Multi-villes',
    address: 'Réseau de magasins',
    estimatedMw: '0.05–0.2 MW par magasin',
    energyProfile:
      'Réseau distribué — opportunité contrat-cadre on-site PV multi-sites.',
    status: 'cold',
    priority: 3
  },

  // ===================  Public infrastructure  ===================
  {
    name: 'Aéroport Oujda Angads',
    sector: 'Infrastructure — airport',
    city: 'Oujda',
    address: 'Aéroport International Oujda Angads',
    estimatedMw: '1–3 MW',
    energyProfile:
      'Terminal + tour de contrôle + balisage + clim. 24/7 critique.',
    status: 'cold',
    priority: 2
  },
  {
    name: 'Aéroport Nador El Aroui',
    sector: 'Infrastructure — airport',
    city: 'Nador',
    address: 'Aéroport International Nador El Aroui',
    estimatedMw: '0.5–1.5 MW',
    energyProfile: 'Idem Aéroport Oujda mais plus petit.',
    status: 'cold',
    priority: 3
  },

  // ===================  Water utility  ===================
  {
    name: 'RADEEMA / RADEEO Oujda — pompage eau',
    sector: 'Utility — water',
    city: 'Oujda',
    address: 'Stations de pompage régionales',
    estimatedMw: '2–6 MW agrégé',
    energyProfile:
      'Pompage AEP + station d\'épuration. Consommation continue.',
    status: 'cold',
    priority: 2,
    notes: 'Approcher la régie RADEEO.'
  }
];

async function main() {
  console.log(`🌱  seeding ${SEED.length} prospects…`);
  // Idempotent: skip rows whose `name` already exists.
  let inserted = 0;
  for (const p of SEED) {
    const existing = await db.execute(
      sql`SELECT id FROM prospects WHERE name = ${p.name} LIMIT 1`
    );
    if ((existing.rows as unknown[]).length > 0) continue;
    await db.insert(prospects).values(p);
    inserted += 1;
  }
  console.log(`✅  inserted ${inserted} new prospects (skipped ${SEED.length - inserted}).`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('seed failed:', err);
    process.exit(1);
  });
