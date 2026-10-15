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
  /** About page paragraphs, in the owner's own words. */
  about: string[];
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
    'I’m Setayesh Ganji, a visual and multimedia designer based in Italy. My eight-year journey through design education and practice began at the University of Tehran and continued with a master’s in Design, Multimedia and Visual Communication at Sapienza University of Rome. Working across Tehran, Dubai, Rome, Amsterdam, and Istanbul has broadened my visual perspective and taught me to approach different audiences, cultures, and creative challenges with curiosity and adaptability.',
    'I help founders, businesses, and creative teams turn ideas into distinctive identities and clear, engaging digital experiences. My practice connects branding, graphic design, illustration, UI, motion, and interactive design, allowing me to carry a coherent visual direction across different formats. Developing my own digital products has also taught me to think beyond individual screens—to consider what people need, what a business wants to achieve, and how design can connect the two. I bring thoughtful experimentation, attention to detail, and a hands-on approach, from the first conversation to the final execution. I’m open to design roles and freelance collaborations in Italy and internationally.',
  ],
  availability: 'Open to design employment and freelance work.',
  email: 'Setayeesh.ganji@gmail.com',
  phone: '+39 351 855 7278',
  links: [
    { label: 'Behance', url: 'https://www.behance.net/setayeshganji1' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/setayesh-ganji-1b680a114' },
  ],
  cv: [{ label: 'Curriculum vitae (PDF)', path: '/documents/setayesh-ganji-cv.pdf' }],
  portrait: null,
};
