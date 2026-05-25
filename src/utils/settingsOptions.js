export const SETTINGS_STORAGE_KEY = 'pastel-tasks-settings'

export const ACCENT_OPTIONS = [
  {
    value: 'rose',
    label: 'Hồng kẹo',
    primary: '339 80% 67%',
    ring: '339 80% 67%',
    swatch: '#f178a8',
  },
  {
    value: 'mint',
    label: 'Bạc hà',
    primary: '160 55% 47%',
    ring: '160 55% 47%',
    swatch: '#43b995',
  },
  {
    value: 'sky',
    label: 'Xanh mây',
    primary: '202 78% 58%',
    ring: '202 78% 58%',
    swatch: '#4db0e6',
  },
  {
    value: 'lavender',
    label: 'Tím sữa',
    primary: '258 72% 68%',
    ring: '258 72% 68%',
    swatch: '#9d7bf0',
  },
  {
    value: 'peach',
    label: 'Đào mềm',
    primary: '18 83% 64%',
    ring: '18 83% 64%',
    swatch: '#ef8b58',
  },
]

export const DEFAULT_SETTINGS = {
  accent: 'rose',
  showGridBackground: true,
  reduceTransparency: true,
  defaultTaskFilter: 'all',
}

export function getAccentOption(value) {
  return ACCENT_OPTIONS.find((option) => option.value === value) ?? ACCENT_OPTIONS[0]
}
