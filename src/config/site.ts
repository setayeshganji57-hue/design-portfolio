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
    'Hi! I’m Setayesh Ganji, a 29-year-old visual and multimedia designer based in Italy.',
    'With more than eight years of experience across design education and practice, my journey began with a Bachelor degree in Graphic Design at the University of Tehran and continued with a Master’s in Design, Multimedia and Visual Communication at Sapienza University of Rome. Exposure to diverse creative and cultural contexts—from Tehran and Dubai to Rome, Amsterdam, Tokyo, Istanbul and other cities—has shaped the way I see, think, and approach design: with curiosity, adaptability, and an appreciation for different perspectives.',
    'I work at the intersection of visual communication, digital experiences, and creative storytelling. From building distinctive brand identities to designing digital products, developing visual narratives, and experimenting with motion and interactive media, I bring ideas to life through thoughtful concepts and cohesive visual systems.',
    'I look beyond individual visuals and screens to understand the people using a product, the problems it needs to solve, and the goals behind it. For me, good design is where these perspectives meet—combining clarity, character, and purpose.',
    'I bring a hands-on, detail-oriented, analytic approach to every project, from the first idea to the final execution. I’m currently open to design opportunities and freelance collaborations in Europe and internationally.',
  ],
  availability: 'Open to design employment and freelance work.',
  email: 'Setayeesh.ganji@gmail.com',
  phone: '+39 351 855 7278',
  links: [
    { label: 'Behance', url: 'https://www.behance.net/setayeshganji1' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/setayesh-ganji-1b680a114' },
  ],
  cv: [{ label: 'Curriculum vitae (PDF)', path: '/documents/setayesh-ganji-cv.pdf' }],
  portrait: { file: 'portrait.jpg', alt: 'Portrait of Setayesh Ganji in a black blazer and white shirt' },
};
