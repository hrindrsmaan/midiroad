/**
 * Real comments from the MidiRoad YouTube channel, shown under the buy
 * buttons. Copy them word for word; never edit or invent one. To add one,
 * crop the avatar into public/images/testimonials/ and add a row here.
 */
export type Testimonial = {
  handle: string;
  text: string;
  avatar: string;
};

export const TESTIMONIALS: Testimonial[] = [
  { handle: "@Prxxfy", text: "bro this is sick!!", avatar: "/images/testimonials/prxxfy.png" },
  { handle: "@flstudioboy", text: "respect bro, this kit hard asf", avatar: "/images/testimonials/flstudioboy.png" },
  { handle: "@Yungdawge404", text: "good stuff", avatar: "/images/testimonials/yungdawge404.png" },
  { handle: "@Luistwodu", text: "top", avatar: "/images/testimonials/luistwodu.png" },
];
