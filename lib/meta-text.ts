/** Google’s snippet limit. Longer copy stays in JSON-LD and on the page. */
export const META_DESCRIPTION_LIMIT = 160;

/**
 * Meta description tag text. Strings already within the limit are returned
 * unchanged. Longer ones are cut on a word boundary, never mid-word.
 */
export function fitMetaDescription(description: string): string {
  if (description.length <= META_DESCRIPTION_LIMIT) return description;
  const cut = description.slice(0, META_DESCRIPTION_LIMIT + 1);
  const space = cut.lastIndexOf(" ");
  const end = space >= META_DESCRIPTION_LIMIT - 40 ? space : META_DESCRIPTION_LIMIT;
  return description.slice(0, end).replace(/[.,;:\s]+$/, "");
}
