import { parseData, testimonialSchema } from './schema';
import { z } from 'zod';

/** Empty on purpose → the Testimonials section hides itself and leaves the navbar. Add entries to show it. */
export const testimonials = parseData('src/data/testimonials.ts', z.array(testimonialSchema), [
  // {
  //   quote: { en: '…', id: '…' },
  //   name: 'Full Name', role: { en: 'Role', id: 'Jabatan' }, org: 'Organization',
  //   photo: 'testimonials/name.jpg', // optional, src/assets/testimonials/
  // },
]);
