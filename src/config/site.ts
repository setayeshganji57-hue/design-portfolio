/**
 * Site-wide facts and contact details.
 *
 * Only verified information belongs here. Anything left empty is handled
 * gracefully by the templates (an honest "to be added" state, never a broken
 * link or a fake value).
 */

export interface ProfessionalLink {
  label: string;
  url: string;
}

export interface SiteConfig {
  name: string;
  role: string;
  location: string;
  /** One short line shown above the homepage composition. */
  intro: string;
  /** Short first-person paragraphs for the About page. Keep to verified facts. */
  about: string[];
  education: { level: string; field: string; institution: string }[];
  practice: string[];
  availability: string;
  /** Leave empty until a public address is confirmed. */
  email: string;
  /** International format, e.g. +39 ... Leave empty to hide. */
  phone: string;
  links: ProfessionalLink[];
  /**
   * CV file placed in /public/documents (e.g. "/documents/setayesh-ganji-cv.pdf").
   * The download link only appears if the file actually exists at build time.
   */
  cv: { label: string; path: string }[];
  /** Portrait image in src/assets/media (e.g. "portrait.jpg"). Empty → designed placeholder. */
  portrait: { file: string; alt: string } | null;
}

export const site: SiteConfig = {
  name: 'Setayesh Ganji',
  role: 'Visual & Multimedia Designer',
  location: 'Based in Italy',
  intro:
    'Visual and multimedia designer based in Italy, working across identity, illustration, interfaces, motion, film and interactive 3D.',
  about: [
    'I’m a visual and multimedia designer based in Italy.',
    'My practice spans graphic design, illustration, branding, digital interfaces, motion, film, and interactive and 3D projects.',
    'I’m open to design employment and freelance collaborations.',
  ],
  education: [
    {
      level: 'Master’s studies',
      field: 'Design, Multimedia and Visual Communication',
      institution: 'Sapienza University of Rome',
    },
    {
      level: 'Bachelor’s studies',
      field: 'Graphic and Visual Design',
      institution: 'University of Tehran',
    },
  ],
  practice: [
    'Graphic design',
    'Illustration',
    'Branding',
    'Digital interfaces',
    'Motion',
    'Film',
    'Interactive & 3D',
  ],
  availability: 'Open to design employment and freelance work.',
  email: 'Setayesh.gannji@gmail.com',
  phone: '+39 351 855 7278',
  links: [
    { label: 'Behance', url: 'https://www.behance.net/setayeshganji1' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/setayesh-ganji-1b680a114' },
  ],
  cv: [{ label: 'Curriculum vitae (PDF)', path: '/documents/setayesh-ganji-cv.pdf' }],
  portrait: null,
};
