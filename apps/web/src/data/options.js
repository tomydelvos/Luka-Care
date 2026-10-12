export const WHO_OPTIONS = [
  { id: "dewasa", label: "Dewasa" },
  { id: "anak", label: "Anak (1–12 th)" },
  { id: "bayi", label: "Bayi (di bawah 1 th)" },
  { id: "lansia", label: "Lansia (di atas 60 th)" },
];

export const AREA_OPTIONS = [
  { id: "tangan", label: "Tangan atau jari" },
  { id: "lengan", label: "Lengan" },
  { id: "lutut", label: "Lutut atau siku" },
  { id: "kaki", label: "Kaki atau telapak" },
  { id: "badan", label: "Badan" },
  { id: "wajah", label: "Wajah atau kepala" },
  { id: "kelamin", label: "Area kelamin" },
];

export const CONDITION_OPTIONS = [
  { id: "berdarah", label: "Masih berdarah sedikit" },
  { id: "basah", label: "Basah atau berair" },
  { id: "kering", label: "Kering" },
];

export const SIZE_OPTIONS = [
  { id: "kecil", label: "Lebih kecil dari koin" },
  { id: "sedang", label: "Lebih kecil dari telapak tangan" },
  { id: "besar", label: "Lebih besar dari telapak tangan" },
];

export const REDNESS_OPTIONS = [
  { id: "tidak", label: "Tidak ada" },
  { id: "sedikit", label: "Sedikit, di tepi luka" },
  { id: "meluas", label: "Makin melebar" },
];

export const FLUID_OPTIONS = [
  { id: "tidak", label: "Tidak ada" },
  { id: "bening", label: "Bening, sedikit" },
  { id: "nanah", label: "Keruh atau nanah" },
];

export const labelOf = (options, id) => options.find((o) => o.id === id)?.label ?? "-";
