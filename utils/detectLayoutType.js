// utils/detectLayoutType.js
export const detectLayoutType = (text) => {
  const supportedLayouts = ['carousel', 'grid', 'moodboard', 'timeline', 'storyboard', 'gallery'];

  const lowercase = text.toLowerCase();
  for (const layout of supportedLayouts) {
    if (lowercase.includes(layout)) {
      return layout;
    }
  }

  return null; // fallback if no layout found
};
