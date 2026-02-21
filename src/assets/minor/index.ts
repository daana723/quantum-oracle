// Minor Arcana card images — keyed by card id
// Images will be added as they are generated

const images: Record<string, string> = {};

// Dynamically import all jpg files in this directory
const modules = import.meta.glob('./**/*.jpg', { eager: true, import: 'default' }) as Record<string, string>;

for (const [path, url] of Object.entries(modules)) {
  // path looks like ./pentacles-ace.jpg → pentacles-ace
  const id = path.replace('./', '').replace('.jpg', '');
  images[id] = url;
}

export const minorCardImages: Record<string, string> = images;
