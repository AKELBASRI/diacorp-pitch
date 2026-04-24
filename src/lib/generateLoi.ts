import {PDFDocument, StandardFonts, rgb} from 'pdf-lib';

export type LoiData = {
  activity: 'industry' | 'agro' | 'zone' | 'other';
  company: string;
  ice: string;
  city: string;
  industry: string;
  mw: number;
  hoursPerDay: number;
  coldStorage: boolean;
  cbam: boolean;
  years: number;
  name: string;
  role: string;
  email: string;
  phone: string;
};

export type LoiLocale = 'fr' | 'en' | 'ar';

type Strings = {
  headerBrand: string;
  headerCity: string;
  dateLabel: (d: string) => string;
  title: string;
  subject: (activity: LoiData['activity']) => string;
  salutation: string;
  bodyIntro: (data: LoiData) => string[];
  needsIntro: string;
  needsSuffix: (hours: number, years: number) => string;
  durationSuffix: string;
  tagCold: string;
  tagCbam: string;
  rest: string[];
  signedBy: string;
  contact: string;
  footer: string;
  idPrefix: string;
  langNotice?: string;
};

const FR: Strings = {
  headerBrand: 'DIACORP ENERGY SARL',
  headerCity: 'Casablanca · Maroc · contact@diacorp.energy',
  dateLabel: (d) => `Casablanca, ${d}`,
  title: 'Lettre d’Intention',
  subject: (a) =>
    a === 'agro'
      ? 'Solution énergétique pour activités agricoles et agro-industrielles'
      : a === 'zone'
      ? 'Approvisionnement énergétique pour zone industrielle'
      : 'Expression d’intérêt pour approvisionnement énergétique',
  salutation: 'Madame, Monsieur,',
  bodyIntro: (d) =>
    d.activity === 'agro'
      ? [
          `Suite à nos échanges, la société ${d.company} exprime son intérêt pour l’exploration d’une solution énergétique structurée en partenariat avec DiaCorp Energy, visant à accompagner nos activités agricoles et agro-industrielles sur notre site principal de ${d.city}.`,
          '',
          'Cette réflexion porte notamment sur l’optimisation des coûts énergétiques liés à l’irrigation, le cold storage, et les opérations de transformation associées.'
        ]
      : [
          `Par la présente, la société ${d.company} (ICE : ${d.ice || '—'}), dont le site principal est situé à ${d.city}, confirme son intérêt à explorer une collaboration avec DiaCorp Energy relative à la structuration d’une solution d’approvisionnement énergétique long terme pour son activité ${
            d.industry || '(à préciser)'
          }.`,
          '',
          'Cette démarche s’inscrit dans une phase exploratoire visant à évaluer les possibilités d’alignement entre nos besoins énergétiques et les solutions proposées.'
        ],
  needsIntro: 'À titre indicatif, notre besoin énergétique est estimé à environ :',
  needsSuffix: (h, y) => `  (${h} h/jour, contrat ${y} ans)`,
  durationSuffix: 'ans',
  tagCold: 'Cold storage 24/7',
  tagCbam: 'Exportateur UE · CBAM',
  rest: [
    'Nous exprimons notre intérêt à poursuivre les discussions, notamment en vue d’évaluer la faisabilité d’un éventuel accord de type Power Purchase Agreement (PPA), sous réserve des conditions techniques, réglementaires et financières applicables.',
    '',
    'Cette lettre ne constitue en aucun cas un engagement contractuel ferme, mais reflète une intention de coopération et d’échange dans le cadre de la phase de structuration du projet.',
    '',
    'Nous restons disponibles pour approfondir ces échanges.',
    '',
    'Veuillez agréer, Madame, Monsieur, l’expression de nos salutations distinguées.'
  ],
  signedBy: 'Signé par',
  contact: 'Contact',
  footer:
    'Lettre d’Intention générée depuis l’Espace Off-taker DiaCorp Energy · dia-pitch.vercel.app',
  idPrefix: 'ID :'
};

const EN: Strings = {
  headerBrand: 'DIACORP ENERGY SARL',
  headerCity: 'Casablanca · Morocco · contact@diacorp.energy',
  dateLabel: (d) => `Casablanca, ${d}`,
  title: 'Letter of Intent',
  subject: (a) =>
    a === 'agro'
      ? 'Energy supply solution for agricultural and agri-industrial activities'
      : a === 'zone'
      ? 'Energy supply for industrial zone'
      : 'Expression of interest for energy supply',
  salutation: 'Dear Sir or Madam,',
  bodyIntro: (d) =>
    d.activity === 'agro'
      ? [
          `Following our discussions, ${d.company} hereby expresses its interest in exploring a structured energy solution in partnership with DiaCorp Energy, intended to support our agricultural and agri-industrial operations at our main site in ${d.city}.`,
          '',
          'This exploration relates in particular to optimizing the energy costs associated with irrigation, cold storage, and associated processing operations.'
        ]
      : [
          `By the present letter, ${d.company} (ICE: ${d.ice || '—'}), whose main site is located in ${d.city}, confirms its interest in exploring a collaboration with DiaCorp Energy relating to the structuring of a long-term energy supply solution for its ${
            d.industry || '(to be specified)'
          } activity.`,
          '',
          'This step is part of an exploratory phase aimed at assessing the possibilities of alignment between our energy needs and the proposed solutions.'
        ],
  needsIntro: 'As an indication, our energy need is estimated at approximately:',
  needsSuffix: (h, y) => `  (${h} h/day, ${y}-year contract)`,
  durationSuffix: 'years',
  tagCold: '24/7 cold storage',
  tagCbam: 'EU exporter · CBAM',
  rest: [
    'We express our interest in continuing these discussions, in particular with a view to assessing the feasibility of a possible Power Purchase Agreement (PPA), subject to the applicable technical, regulatory, and financial conditions.',
    '',
    'This letter does not constitute a firm contractual commitment, but rather reflects an intention to cooperate and to continue the exchange as part of the project structuring phase.',
    '',
    'We remain available to discuss further.',
    '',
    'Yours sincerely,'
  ],
  signedBy: 'Signed by',
  contact: 'Contact',
  footer:
    'Letter of Intent generated from the DiaCorp Energy Off-taker Portal · dia-pitch.vercel.app',
  idPrefix: 'ID:'
};

// Arabic users get a French LOI (administrative language in Morocco),
// with a small Arabic notice at the top explaining this.
const AR: Strings = {
  ...FR,
  langNotice: 'النسخة الفرنسية — اللغة الإدارية المعتمدة في المغرب'
};

function strings(locale: LoiLocale): Strings {
  if (locale === 'en') return EN;
  if (locale === 'ar') return AR;
  return FR;
}

function dateFor(locale: LoiLocale): string {
  const d = new Date();
  if (locale === 'en')
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  return d.toLocaleDateString('fr-FR');
}

const COPPER = rgb(0.706, 0.42, 0.102);
const INK = rgb(0.11, 0.102, 0.082);
const INK_MUTED = rgb(0.29, 0.275, 0.22);
const LINE = rgb(0.847, 0.812, 0.725);

export async function generateLoiPdf(
  data: LoiData,
  locale: LoiLocale = 'fr'
): Promise<Uint8Array> {
  const S = strings(locale);
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const W = page.getWidth();
  const H = page.getHeight();

  const times = await pdf.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const timesItalic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const margin = 54;
  let y = H - margin;

  // Arabic-locale notice (if present) at very top
  if (S.langNotice) {
    page.drawText(S.langNotice, {
      x: margin,
      y,
      size: 8,
      font: helv,
      color: INK_MUTED
    });
    y -= 14;
  }

  // Header — brand
  page.drawText(S.headerBrand, {
    x: margin,
    y,
    size: 9,
    font: helvBold,
    color: COPPER
  });
  page.drawText(S.headerCity, {
    x: margin,
    y: y - 12,
    size: 8,
    font: helv,
    color: INK_MUTED
  });
  page.drawText(S.dateLabel(dateFor(locale)), {
    x: W - margin - 140,
    y,
    size: 9,
    font: helv,
    color: INK_MUTED
  });

  y -= 28;
  page.drawLine({
    start: {x: margin, y},
    end: {x: W - margin, y},
    thickness: 0.8,
    color: INK
  });

  y -= 36;
  page.drawText(S.title, {
    x: margin,
    y,
    size: 22,
    font: timesBold,
    color: INK
  });

  y -= 20;
  page.drawText(S.subject(data.activity), {
    x: margin,
    y,
    size: 11,
    font: timesBold,
    color: COPPER
  });

  y -= 32;
  const intro = [S.salutation, '', ...S.bodyIntro(data)];
  const paraSize = 11;
  const lineH = 15;
  const paraWidth = W - margin * 2;

  for (const p of intro) {
    const lines = wrapText(p, times, paraSize, paraWidth);
    for (const line of lines) {
      page.drawText(line, {
        x: margin,
        y,
        size: paraSize,
        font: times,
        color: INK
      });
      y -= lineH;
    }
    y -= 6;
  }

  y -= 8;
  page.drawText(S.needsIntro, {
    x: margin,
    y,
    size: 11,
    font: times,
    color: INK
  });
  y -= 28;

  const mwText = `${data.mw} MW`;
  page.drawText(mwText, {
    x: margin,
    y,
    size: 24,
    font: timesBold,
    color: COPPER
  });
  const mwWidth = timesBold.widthOfTextAtSize(mwText, 24);
  page.drawText(S.needsSuffix(data.hoursPerDay, data.years), {
    x: margin + mwWidth + 6,
    y: y + 3,
    size: 10,
    font: timesItalic,
    color: INK_MUTED
  });
  y -= 10;

  const tags: string[] = [];
  if (data.coldStorage) tags.push(S.tagCold);
  if (data.cbam) tags.push(S.tagCbam);
  if (tags.length > 0) {
    y -= 18;
    let tagX = margin;
    for (const tag of tags) {
      const w = helv.widthOfTextAtSize(tag, 9) + 18;
      page.drawRectangle({
        x: tagX,
        y: y - 4,
        width: w,
        height: 18,
        borderColor: COPPER,
        borderWidth: 0.6,
        color: rgb(0.96, 0.925, 0.84)
      });
      page.drawText(tag, {
        x: tagX + 9,
        y: y + 2,
        size: 9,
        font: helv,
        color: COPPER
      });
      tagX += w + 8;
    }
    y -= 6;
  }

  y -= 28;
  for (const p of S.rest) {
    const lines = wrapText(p, times, paraSize, paraWidth);
    for (const line of lines) {
      if (y < 150) break;
      page.drawText(line, {
        x: margin,
        y,
        size: paraSize,
        font: times,
        color: INK
      });
      y -= lineH;
    }
    y -= 6;
  }

  // Signature block
  y = 180;
  page.drawLine({
    start: {x: margin, y},
    end: {x: W - margin, y},
    thickness: 0.4,
    color: LINE
  });
  y -= 16;
  page.drawText(S.signedBy, {
    x: margin,
    y,
    size: 9,
    font: helv,
    color: INK_MUTED
  });
  y -= 16;
  page.drawText(data.name, {
    x: margin,
    y,
    size: 13,
    font: timesBold,
    color: INK
  });
  y -= 14;
  page.drawText(data.role, {
    x: margin,
    y,
    size: 10,
    font: timesItalic,
    color: INK_MUTED
  });
  y -= 14;
  page.drawText(data.company, {
    x: margin,
    y,
    size: 10,
    font: helv,
    color: INK_MUTED
  });

  const infoX = W - margin - 180;
  let yi = 148;
  page.drawText(S.contact, {
    x: infoX,
    y: yi,
    size: 9,
    font: helv,
    color: INK_MUTED
  });
  yi -= 14;
  page.drawText(data.email, {
    x: infoX,
    y: yi,
    size: 10,
    font: helvBold,
    color: INK
  });
  yi -= 14;
  page.drawText(data.phone, {
    x: infoX,
    y: yi,
    size: 10,
    font: helv,
    color: INK
  });

  page.drawLine({
    start: {x: margin, y: 48},
    end: {x: W - margin, y: 48},
    thickness: 0.4,
    color: LINE
  });
  page.drawText(S.footer, {
    x: margin,
    y: 32,
    size: 7.5,
    font: helv,
    color: INK_MUTED
  });
  page.drawText(`${S.idPrefix} LOI-${Date.now().toString(36).toUpperCase()}`, {
    x: W - margin - 150,
    y: 32,
    size: 7.5,
    font: helv,
    color: INK_MUTED
  });

  return await pdf.save();
}

function wrapText(text: string, font: any, size: number, maxWidth: number): string[] {
  if (!text) return [''];
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? current + ' ' + word : word;
    const w = font.widthOfTextAtSize(test, size);
    if (w > maxWidth) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function triggerDownload(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as BlobPart], {type: 'application/pdf'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

type MailCopy = {
  subject: (co: string, mw: number) => string;
  body: (d: LoiData) => string;
};

const MAIL_FR: MailCopy = {
  subject: (co, mw) => `LOI · ${co} · ${mw} MW`,
  body: (d) =>
    [
      'Bonjour,',
      '',
      `Je soussigné(e) ${d.name} (${d.role}) déclare l’intérêt de ${d.company} pour un approvisionnement énergétique avec DiaCorp Energy.`,
      '',
      `Activité : ${d.activity}`,
      `Site principal : ${d.city}`,
      `Sous-secteur : ${d.industry || '—'}`,
      `ICE : ${d.ice || '—'}`,
      '',
      `Besoin estimé : ${d.mw} MW · ${d.hoursPerDay} h/jour · contrat ${d.years} ans`,
      d.coldStorage ? 'Cold storage : oui (24/7)' : 'Cold storage : non',
      d.cbam ? 'Export UE / CBAM : oui' : 'Export UE / CBAM : non',
      '',
      `Contact : ${d.email} · ${d.phone}`,
      '',
      'Vous trouverez en pièce jointe notre Lettre d’Intention signée.',
      '',
      'Cordialement,',
      d.name,
      d.company
    ].join('\n')
};

const MAIL_EN: MailCopy = {
  subject: (co, mw) => `LOI · ${co} · ${mw} MW`,
  body: (d) =>
    [
      'Hello,',
      '',
      `I, the undersigned ${d.name} (${d.role}), express ${d.company}'s interest in energy supply from DiaCorp Energy.`,
      '',
      `Sector: ${d.activity}`,
      `Main site: ${d.city}`,
      `Sub-sector: ${d.industry || '—'}`,
      `ICE: ${d.ice || '—'}`,
      '',
      `Estimated need: ${d.mw} MW · ${d.hoursPerDay} h/day · ${d.years}-year contract`,
      d.coldStorage ? '24/7 cold storage: yes' : '24/7 cold storage: no',
      d.cbam ? 'EU export / CBAM: yes' : 'EU export / CBAM: no',
      '',
      `Contact: ${d.email} · ${d.phone}`,
      '',
      'Please find attached our signed Letter of Intent.',
      '',
      'Best regards,',
      d.name,
      d.company
    ].join('\n')
};

const MAIL_AR: MailCopy = {
  subject: (co, mw) => `LOI · ${co} · ${mw} MW`,
  body: (d) =>
    [
      'السلام عليكم،',
      '',
      `أنا الموقع أسفله ${d.name} (${d.role})، أعبّر عن اهتمام ${d.company} بتزويد طاقي مع ديا كورب إنرجي.`,
      '',
      `القطاع : ${d.activity}`,
      `الموقع الرئيسي : ${d.city}`,
      `القطاع الفرعي : ${d.industry || '—'}`,
      `ICE : ${d.ice || '—'}`,
      '',
      `الحاجة المقدّرة : ${d.mw} ميجاواط · ${d.hoursPerDay} س/ي · عقد ${d.years} سنة`,
      d.coldStorage ? 'تبريد ٢٤/٧ : نعم' : 'تبريد ٢٤/٧ : لا',
      d.cbam ? 'تصدير UE / CBAM : نعم' : 'تصدير UE / CBAM : لا',
      '',
      `التواصل : ${d.email} · ${d.phone}`,
      '',
      'تجدون مرفقة رسالة النوايا الموقّعة (بالفرنسية، كلغة إدارية).',
      '',
      'تحياتنا،',
      d.name,
      d.company
    ].join('\n')
};

export function buildMailto(data: LoiData, locale: LoiLocale = 'fr'): string {
  const copy =
    locale === 'en' ? MAIL_EN : locale === 'ar' ? MAIL_AR : MAIL_FR;
  const subject = copy.subject(data.company, data.mw);
  const body = copy.body(data);
  return `mailto:contact@diacorp.energy?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}
