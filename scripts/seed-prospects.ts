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
  },

  // ========================================================================
  //   N A T I O N A L   —   hors Oriental
  //   Modèle exclusif : install on-site PV + BESS (pas de cable plant→site).
  //   Toutes les sources sont publiques (sites corporates, presse, registres).
  // ========================================================================

  // ===================  Nord — Tanger / Tétouan / Al Hoceïma  ===================
  {
    name: 'Renault Tanger Mediterranée',
    sector: 'Automotive assembly',
    city: 'Mellousa',
    address: 'Tanger Free Zone, Mellousa',
    estimatedMw: '30–50 MW',
    energyProfile:
      "Usine d'assemblage Renault (Dacia Sandero/Logan). Lignes peinture + soudure très énergivores. CBAM exposure forte.",
    website: 'https://www.renault.ma',
    status: 'cold',
    priority: 1,
    notes: 'Le plus gros offtaker industriel privé du Maroc. Cible stratégique.'
  },
  {
    name: 'Tanger Med Port Authority (TMPA)',
    sector: 'Port / logistics',
    city: 'Tanger Med',
    address: 'Port Tanger Med, Ksar es-Seghir',
    estimatedMw: '8–20 MW',
    energyProfile:
      "Hub portuaire #1 d'Afrique. Grues, frigorifique, éclairage 24/7, datacenter de gestion.",
    website: 'https://www.tangermed.ma',
    status: 'cold',
    priority: 1
  },
  {
    name: 'Yazaki Maroc — TFZ Tanger',
    sector: 'Auto wiring harness',
    city: 'Tanger TFZ',
    address: 'Tanger Free Zone',
    estimatedMw: '3–8 MW',
    energyProfile:
      "Faisceaux de câbles auto. Activité 3×8, clim importante, salles propres.",
    status: 'cold',
    priority: 2
  },
  {
    name: 'Cimat — Cimenterie Tétouan',
    sector: 'Cement',
    city: 'Tétouan',
    address: 'Cimenterie Cimat, Tétouan',
    estimatedMw: '8–18 MW',
    energyProfile: 'Cimenterie — broyeur cru/clinker, four. CBAM exposure.',
    status: 'cold',
    priority: 1
  },
  {
    name: 'Coca-Cola Atlas Bottling — Tanger',
    sector: 'Beverages',
    city: 'Tanger',
    address: 'Zone industrielle Gzenaya, Tanger',
    estimatedMw: '1–3 MW',
    energyProfile: 'Embouteillage + cold storage. Toiture vaste — fit on-site PV.',
    status: 'cold',
    priority: 2
  },

  // ===================  Atlantique nord — Rabat / Salé / Kénitra  ===================
  {
    name: 'Stellantis Maroc — Kénitra (PSA)',
    sector: 'Automotive assembly',
    city: 'Kenitra',
    address: 'Atlantic Free Zone, Kénitra',
    estimatedMw: '25–50 MW',
    energyProfile:
      "Usine Stellantis (ex-PSA) — Peugeot 208 + Citroën Ami + futurs EV. Lignes peinture, soudure, montage.",
    website: 'https://www.stellantis.com',
    status: 'cold',
    priority: 1,
    notes: 'Cible n°1 atlantique nord. CBAM + ESG du groupe = argument fort.'
  },
  {
    name: 'Lesaffre Maroc',
    sector: 'Food processing — yeast',
    city: 'Kenitra',
    address: 'Kénitra industrielle',
    estimatedMw: '3–8 MW',
    energyProfile: 'Levure + extraits. Fermentation + séchage. 24/7.',
    website: 'https://www.lesaffre.com',
    status: 'cold',
    priority: 2
  },
  {
    name: 'Centrale Danone — Salé',
    sector: 'Agri — dairy',
    city: 'Salé',
    address: 'Sidi Allal El Bahraoui, Salé',
    estimatedMw: '4–10 MW',
    energyProfile:
      'Plus grosse laiterie du Maroc. Pasteurisation, UHT, conditionnement, cold chain. 24/7.',
    website: 'https://www.centralelaitiere.com',
    status: 'cold',
    priority: 1
  },

  // ===================  Centre nord — Fès / Meknès  ===================
  {
    name: 'Cimenterie Holcim — Fès',
    sector: 'Cement',
    city: 'Fès',
    address: 'Aïn Cheggag, Fès',
    estimatedMw: '10–25 MW',
    energyProfile: 'Cimenterie. CBAM exposure forte.',
    website: 'https://www.holcim.ma',
    status: 'cold',
    priority: 1
  },
  {
    name: 'Cosumar — Sucrerie SUTA Sidi Slimane',
    sector: 'Sugar refining',
    city: 'Sidi Slimane',
    address: 'Sucrerie SUTA, Sidi Slimane',
    estimatedMw: '5–12 MW',
    energyProfile:
      'Sucrerie de canne. Pic saisonnier campagne sucrière. Vapeur + élec.',
    website: 'https://www.cosumar.co.ma',
    status: 'cold',
    priority: 2
  },
  {
    name: 'Aéroport Fès-Saiss',
    sector: 'Infrastructure — airport',
    city: 'Fès',
    address: 'Aéroport International Fès-Saiss',
    estimatedMw: '0.8–2 MW',
    energyProfile: 'Terminal + tour + balisage + clim. 24/7.',
    status: 'cold',
    priority: 3
  },

  // ===================  Casablanca métropole  ===================
  {
    name: 'Renault SOMACA — Casablanca',
    sector: 'Automotive assembly',
    city: 'Aïn Sebaâ',
    address: 'Aïn Sebaâ, Casablanca',
    estimatedMw: '8–20 MW',
    energyProfile:
      "Plus ancien site auto Maroc. Assemble Dacia Logan + utilitaires. Lignes peinture + montage.",
    website: 'https://www.renault.ma',
    status: 'cold',
    priority: 1
  },
  {
    name: 'Cosumar HQ + Raffinerie — Casablanca',
    sector: 'Sugar refining',
    city: 'Casablanca',
    address: 'Roches Noires, Casablanca',
    estimatedMw: '12–25 MW',
    energyProfile:
      'Raffinerie sucre principale. Vapeur + électrique. Continu.',
    website: 'https://www.cosumar.co.ma',
    status: 'cold',
    priority: 1
  },
  {
    name: 'LafargeHolcim — Cimenterie Bouskoura',
    sector: 'Cement',
    city: 'Bouskoura',
    address: 'Cimenterie Bouskoura, Casa',
    estimatedMw: '15–30 MW',
    energyProfile: 'Cimenterie majeure. CBAM exposure.',
    website: 'https://www.lafargeholcim.ma',
    status: 'cold',
    priority: 1
  },
  {
    name: 'Aéroport Mohammed V',
    sector: 'Infrastructure — airport',
    city: 'Nouaceur',
    address: 'Aéroport Mohammed V, Nouaceur',
    estimatedMw: '4–10 MW',
    energyProfile: 'Plus gros aéroport Maroc. Terminal 1+2 + cargo. 24/7.',
    status: 'cold',
    priority: 2
  },
  {
    name: 'Marsa Maroc — Port Casablanca',
    sector: 'Port / logistics',
    city: 'Casablanca',
    address: 'Port de Casablanca',
    estimatedMw: '3–8 MW',
    energyProfile: 'Grues, terminaux, frigo. Public via TGR.',
    website: 'https://www.marsamaroc.co.ma',
    status: 'cold',
    priority: 2
  },
  {
    name: 'Maghreb Steel — Mohammedia',
    sector: 'Steel',
    city: 'Mohammedia',
    address: 'Zone industrielle, Mohammedia',
    estimatedMw: '20–45 MW',
    energyProfile: "Tôles laminées à froid. Four électrique. CBAM exposure.",
    website: 'https://www.maghrebsteel.ma',
    status: 'cold',
    priority: 1
  },

  // ===================  Casa Sud — Settat / Berrechid / Khouribga / Jorf Lasfar  ===================
  {
    name: 'OCP Khouribga — mines de phosphate',
    sector: 'Mining — phosphate',
    city: 'Khouribga',
    address: 'Site OCP Khouribga',
    estimatedMw: '40–80 MW',
    energyProfile:
      "Plus gros bassin phosphate au monde. Excavation, lavage, slurry pipeline 200km vers Jorf. Continu.",
    website: 'https://www.ocpgroup.ma',
    status: 'cold',
    priority: 1,
    notes: 'OCP a déjà commencé sa transition solaire — cible top-priority.'
  },
  {
    name: 'OCP Jorf Lasfar — Phosphate Hub',
    sector: 'Phosphate / chemicals',
    city: 'Jorf Lasfar',
    address: 'Plateforme industrielle Jorf Lasfar, El Jadida',
    estimatedMw: '150–250 MW agrégé',
    energyProfile:
      "Plus gros hub de transformation phosphate au monde. Maroc Phosphore + EMAPHOS + IMACID + JFC. Acide phosphorique + DAP/NPK.",
    website: 'https://www.ocpgroup.ma',
    status: 'cold',
    priority: 1,
    notes:
      'Cluster industriel monstrueux. Multi-tenant PPA + arbitrage BESS très pertinent. Viser un contrat-cadre groupe.'
  },
  {
    name: 'Cosumar — Sucrerie SURAC Sidi Bennour',
    sector: 'Sugar refining',
    city: 'Sidi Bennour',
    address: 'SURAC, Sidi Bennour, Doukkala',
    estimatedMw: '6–15 MW',
    energyProfile:
      'Sucrerie betterave + canne. Bagasse cogen + élec. Saisonnier.',
    status: 'cold',
    priority: 2
  },
  {
    name: 'Holcim — Cimenterie Settat',
    sector: 'Cement',
    city: 'Settat',
    address: 'Cimenterie Settat',
    estimatedMw: '8–18 MW',
    energyProfile: 'Cimenterie. CBAM exposure.',
    status: 'cold',
    priority: 2
  },

  // ===================  Béni Mellal-Khénifra  ===================
  {
    name: 'Cosumar — Sucrerie SUNABEL Béni Mellal',
    sector: 'Sugar refining',
    city: 'Béni Mellal',
    address: 'SUNABEL, Béni Mellal',
    estimatedMw: '4–10 MW',
    energyProfile: 'Sucrerie betterave Tadla. Saisonnier campagne.',
    status: 'cold',
    priority: 2
  },

  // ===================  Marrakech / Safi  ===================
  {
    name: 'OCP Maroc Phosphore — Safi',
    sector: 'Phosphate / chemicals',
    city: 'Safi',
    address: 'Maroc Phosphore Safi',
    estimatedMw: '60–120 MW',
    energyProfile:
      "Site historique de transformation phosphate (avant Jorf). Acide phosphorique, soufrique, engrais.",
    website: 'https://www.ocpgroup.ma',
    status: 'cold',
    priority: 1
  },
  {
    name: 'Cimenterie Ciments du Maroc — Safi',
    sector: 'Cement',
    city: 'Safi',
    address: 'Cimenterie Safi',
    estimatedMw: '10–22 MW',
    energyProfile: 'Cimenterie. CBAM exposure.',
    website: 'https://www.cimentsdumaroc.com',
    status: 'cold',
    priority: 2
  },
  {
    name: 'Cluster hôtelier Marrakech (palais & resorts)',
    sector: 'Hospitality / leisure',
    city: 'Marrakech',
    address: 'Palmeraie, Hivernage, Médina',
    estimatedMw: '20–40 MW agrégé',
    energyProfile:
      "Centaines d'hôtels haut de gamme — Mamounia, Royal Mansour, RIU, Es Saadi, Palmeraie Resorts. Clim massive été. Toitures + terrains pour PV.",
    status: 'cold',
    priority: 1,
    notes:
      'Approcher fédération hôtelière + grands groupes (Accor, RIU, Iberostar) pour contrat-cadre multi-sites.'
  },
  {
    name: 'Aéroport Marrakech-Menara',
    sector: 'Infrastructure — airport',
    city: 'Marrakech',
    address: 'Aéroport Marrakech-Menara',
    estimatedMw: '2–5 MW',
    energyProfile: 'Trafic touristique majeur. 24/7.',
    status: 'cold',
    priority: 3
  },

  // ===================  Souss-Massa — Agadir  ===================
  {
    name: 'COPAG — Coopérative Agricole Tarougant',
    sector: 'Agri — dairy + citrus',
    city: 'Aït Iaaza',
    address: 'Tarougant, Aït Iaaza',
    estimatedMw: '5–12 MW',
    energyProfile:
      'Plus grosse coopérative agro Maroc. Lait Jaouda + agrumes + viandes. Cold chain massive.',
    website: 'https://www.copag.ma',
    status: 'cold',
    priority: 1
  },
  {
    name: 'Marsa Maroc — Port Agadir',
    sector: 'Port / logistics',
    city: 'Agadir',
    address: 'Port d\'Agadir',
    estimatedMw: '1–3 MW',
    energyProfile: 'Pêche industrielle + container. Cold storage poisson.',
    status: 'cold',
    priority: 2
  },
  {
    name: 'Cluster hôtelier Agadir (zone balnéaire)',
    sector: 'Hospitality / leisure',
    city: 'Agadir',
    address: 'Front de mer + Founty',
    estimatedMw: '8–18 MW agrégé',
    energyProfile:
      "Stations balnéaires (RIU, Iberostar, Robinson Club, Sofitel). Clim été + chauffage piscines.",
    status: 'cold',
    priority: 2
  },
  {
    name: 'Aéroport Al-Massira Agadir',
    sector: 'Infrastructure — airport',
    city: 'Agadir',
    address: 'Aéroport Al-Massira',
    estimatedMw: '1.5–4 MW',
    energyProfile: 'Trafic touristique. 24/7.',
    status: 'cold',
    priority: 3
  },

  // ===================  Sahara — Laâyoune / Dakhla  ===================
  {
    name: 'OCP Phosboucraâ — Laâyoune',
    sector: 'Mining — phosphate',
    city: 'Boucraâ',
    address: 'Mines de Boucraâ → port Laâyoune (conveyor 100km)',
    estimatedMw: '25–60 MW',
    energyProfile:
      "Mine + plus long convoyeur du monde (100km vers Laâyoune Plage). Continu. Solar fit excellent (irradiation Sahara).",
    website: 'https://www.ocpgroup.ma',
    status: 'cold',
    priority: 1
  },
  {
    name: 'Conserveries pélagiques Dakhla',
    sector: 'Food processing — fish',
    city: 'Dakhla',
    address: 'Zone industrielle Dakhla',
    estimatedMw: '3–8 MW agrégé',
    energyProfile:
      "Cluster conserveries sardine + farine de poisson. Cold chain + cuisson + séchage. Saisonnier mais récurrent.",
    status: 'cold',
    priority: 2,
    notes: 'Approcher la fédération de la pêche pélagique.'
  },
  {
    name: 'Aéroport Hassan I — Laâyoune',
    sector: 'Infrastructure — airport',
    city: 'Laâyoune',
    address: 'Aéroport Hassan I',
    estimatedMw: '0.5–1.5 MW',
    energyProfile: 'Aéroport régional. Solar fit excellent (irradiation).',
    status: 'cold',
    priority: 3
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
