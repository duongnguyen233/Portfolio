export const getImageUrl = (path) => {
  if (/^(https?:)?\/\//.test(path)) {
    return path;
  }
  return new URL(`/assets/${path}`, import.meta.url).href;
};
