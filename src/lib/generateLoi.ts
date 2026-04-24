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

const COPPER = rgb(0.706, 0.42, 0.102);
const INK = rgb(0.11, 0.102, 0.082);
const INK_MUTED = rgb(0.29, 0.275, 0.22);
const LINE = rgb(0.847, 0.812, 0.725);

export async function generateLoiPdf(data: LoiData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const W = page.getWidth();
  const H = page.getHeight();

  const times = await pdf.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const timesItalic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const margin = 54;
  let y = H - margin;

  // Header — brand
  page.drawText('DIACORP ENERGY SARL', {
    x: margin,
    y,
    size: 9,
    font: helvBold,
    color: COPPER
  });
  page.drawText('Casablanca · Maroc · contact@diacorp.energy', {
    x: margin,
    y: y - 12,
    size: 8,
    font: helv,
    color: INK_MUTED
  });
  // Right: date
  const dateStr = new Date().toLocaleDateString('fr-FR');
  page.drawText(`Casablanca, ${dateStr}`, {
    x: W - margin - 110,
    y,
    size: 9,
    font: helv,
    color: INK_MUTED
  });

  // Rule
  y -= 28;
  page.drawLine({
    start: {x: margin, y},
    end: {x: W - margin, y},
    thickness: 0.8,
    color: INK
  });

  // Title
  y -= 36;
  page.drawText('Lettre d’Intention', {
    x: margin,
    y,
    size: 22,
    font: timesBold,
    color: INK
  });

  // Subject
  y -= 20;
  const subject =
    data.activity === 'agro'
      ? 'Solution énergétique pour activités agricoles et agro-industrielles'
      : data.activity === 'zone'
      ? 'Approvisionnement énergétique pour zone industrielle'
      : 'Expression d’intérêt pour approvisionnement énergétique';
  page.drawText(subject, {
    x: margin,
    y,
    size: 11,
    font: timesBold,
    color: COPPER
  });

  // Body paragraphs
  y -= 32;
  const body =
    data.activity === 'agro'
      ? [
          'Madame, Monsieur,',
          '',
          `Suite à nos échanges, la société ${data.company} exprime son intérêt pour l’exploration d’une solution énergétique structurée en partenariat avec DiaCorp Energy, visant à accompagner nos activités agricoles et agro-industrielles sur notre site principal de ${data.city}.`,
          '',
          'Cette réflexion porte notamment sur l’optimisation des coûts énergétiques liés à l’irrigation, le cold storage, et les opérations de transformation associées.'
        ]
      : [
          'Madame, Monsieur,',
          '',
          `Par la présente, la société ${data.company} (ICE : ${data.ice || '—'}), dont le site principal est situé à ${data.city}, confirme son intérêt à explorer une collaboration avec DiaCorp Energy relative à la structuration d’une solution d’approvisionnement énergétique long terme pour son activité ${
            data.industry || '(à préciser)'
          }.`,
          '',
          'Cette démarche s’inscrit dans une phase exploratoire visant à évaluer les possibilités d’alignement entre nos besoins énergétiques et les solutions proposées.'
        ];

  const paraSize = 11;
  const lineH = 15;
  const paraWidth = W - margin * 2;

  for (const p of body) {
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

  // Needs block
  y -= 8;
  page.drawText('À titre indicatif, notre besoin énergétique est estimé à environ :', {
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
  page.drawText(
    `  (${data.hoursPerDay} h/jour, contrat ${data.years} ans)`,
    {
      x: margin + mwWidth + 6,
      y: y + 3,
      size: 10,
      font: timesItalic,
      color: INK_MUTED
    }
  );
  y -= 10;

  // Attributes tags
  const tags: string[] = [];
  if (data.coldStorage) tags.push('Cold storage 24/7');
  if (data.cbam) tags.push('Exportateur UE · CBAM');
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

  // Rest of body
  y -= 28;
  const rest = [
    'Nous exprimons notre intérêt à poursuivre les discussions, notamment en vue d’évaluer la faisabilité d’un éventuel accord de type Power Purchase Agreement (PPA), sous réserve des conditions techniques, réglementaires et financières applicables.',
    '',
    'Cette lettre ne constitue en aucun cas un engagement contractuel ferme, mais reflète une intention de coopération et d’échange dans le cadre de la phase de structuration du projet.',
    '',
    'Nous restons disponibles pour approfondir ces échanges.',
    '',
    'Veuillez agréer, Madame, Monsieur, l’expression de nos salutations distinguées.'
  ];
  for (const p of rest) {
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
  page.drawText('Signé par', {
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

  // Contact info right-aligned
  const infoX = W - margin - 180;
  let yi = 148;
  page.drawText('Contact', {
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

  // Footer
  page.drawLine({
    start: {x: margin, y: 48},
    end: {x: W - margin, y: 48},
    thickness: 0.4,
    color: LINE
  });
  page.drawText(
    'Lettre d’Intention générée depuis l’Espace Off-taker DiaCorp Energy · dia-pitch.vercel.app',
    {
      x: margin,
      y: 32,
      size: 7.5,
      font: helv,
      color: INK_MUTED
    }
  );
  page.drawText(`ID : LOI-${Date.now().toString(36).toUpperCase()}`, {
    x: W - margin - 130,
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

export function buildMailto(data: LoiData): string {
  const lines = [
    'Bonjour,',
    '',
    `Je soussigné(e) ${data.name} (${data.role}) déclare l’intérêt de ${data.company} pour un approvisionnement énergétique avec DiaCorp Energy.`,
    '',
    `Activité : ${data.activity}`,
    `Site principal : ${data.city}`,
    `Sous-secteur : ${data.industry || '—'}`,
    `ICE : ${data.ice || '—'}`,
    '',
    `Besoin estimé : ${data.mw} MW · ${data.hoursPerDay} h/jour · contrat ${data.years} ans`,
    data.coldStorage ? 'Cold storage : oui (24/7)' : 'Cold storage : non',
    data.cbam ? 'Export UE / CBAM : oui' : 'Export UE / CBAM : non',
    '',
    `Contact : ${data.email} · ${data.phone}`,
    '',
    'Vous trouverez en pièce jointe notre Lettre d’Intention signée.',
    '',
    'Cordialement,',
    data.name,
    data.company
  ];
  const subject = `LOI · ${data.company} · ${data.mw} MW`;
  return `mailto:contact@diacorp.energy?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(lines.join('\n'))}`;
}
