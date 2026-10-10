export type Work = {
  id: string;
  number: string;
  title: string;
  location: string;
  year: string;
  category: string;
  description: string;
  /** Cover image (list + hero) */
  image: string;
  /** Full gallery for the project detail page */
  images: string[];
};

export const WORKS: Work[] = [
  {
    id: "nadapuram-kozhikode",
    number: "01",
    title: "Residence at Nadapuram",
    location: "Nadapuram, Kozhikode",
    year: "2024",
    category: "Residence",
    description:
      "A residence rooted in Kozhikode — composed for climate, privacy, and the quiet rituals of everyday living.",
    image: "/images/works/nadapuram-kozhikode/01.jpg",
    images: ["/images/works/nadapuram-kozhikode/01.jpg"],
  },
  {
    id: "kanjirappally-kottayam",
    number: "02",
    title: "Residence at Kanjirappally",
    location: "Kanjirappally, Kottayam",
    year: "2024",
    category: "Residence",
    description:
      "A Kottayam home with a clear architectural silhouette — shade, proportion, and a strong sense of place.",
    image: "/images/works/arch.png",
    images: ["/images/works/arch.png"],
  },
  {
    id: "kothamangalam-ernakulam",
    number: "03",
    title: "Residence at Kothamangalam",
    location: "Kothamangalam, Ernakulam",
    year: "2024",
    category: "Residence",
    description:
      "Contemporary Kerala living in Ernakulam — volumes shaped for light, air, and lasting material honesty.",
    image: "/images/works/kothamangalam-ernakulam/01.jpg",
    images: ["/images/works/kothamangalam-ernakulam/01.jpg"],
  },
  {
    id: "nadapuram-kozhikode-2",
    number: "04",
    title: "Residence at Nadapuram",
    location: "Nadapuram, Kozhikode",
    year: "2023",
    category: "Residence",
    description:
      "A second Nadapuram residence — calm interiors and a grounded presence within its Kozhikode setting.",
    image: "/images/works/nadapuram-kozhikode-2/01.jpg",
    images: ["/images/works/nadapuram-kozhikode-2/01.jpg"],
  },
  {
    id: "muvattupuzha-ernakulam",
    number: "05",
    title: "Residence at Muvattupuzha",
    location: "Muvattupuzha, Ernakulam",
    year: "2023",
    category: "Residence",
    description:
      "Family living at Muvattupuzha — structured for comfort, daylight, and a measured outdoor connection.",
    image: "/images/works/muvattupuzha-ernakulam/01.jpg",
    images: ["/images/works/muvattupuzha-ernakulam/01.jpg"],
  },
  {
    id: "kothamangalam-ernakulam-2",
    number: "06",
    title: "Residence at Kothamangalam",
    location: "Kothamangalam, Ernakulam",
    year: "2023",
    category: "Residence",
    description:
      "An Ernakulam residence with a composed elevation — clarity of form and careful site response.",
    image: "/images/works/kothamangalam-ernakulam-2/01.jpg",
    images: ["/images/works/kothamangalam-ernakulam-2/01.jpg"],
  },
  {
    id: "perumbavoor-ernakulam",
    number: "07",
    title: "Residence at Perumbavoor",
    location: "Perumbavoor, Ernakulam",
    year: "2023",
    category: "Residence",
    description:
      "A Perumbavoor home shaped for everyday ease — warm atmosphere and a clear architectural language.",
    image: "/images/works/perumbavoor-ernakulam/01.png",
    images: ["/images/works/perumbavoor-ernakulam/01.png"],
  },
  {
    id: "perumbavoor-ernakulam-2",
    number: "08",
    title: "Residence at Perumbavoor",
    location: "Perumbavoor, Ernakulam",
    year: "2022",
    category: "Residence",
    description:
      "Exterior presence and spatial calm — a residence that balances mass, void, and lived-in comfort.",
    image: "/images/works/perumbavoor-ernakulam-2/01.jpg",
    images: ["/images/works/perumbavoor-ernakulam-2/01.jpg"],
  },
  {
    id: "aluva-ernakulam",
    number: "09",
    title: "Residence at Aluva",
    location: "Aluva, Ernakulam",
    year: "2022",
    category: "Residence",
    description:
      "An Aluva residence with a confident form — crafted for light, privacy, and lasting character.",
    image: "/images/works/aluva-ernakulam/cover.jpg",
    images: ["/images/works/aluva-ernakulam/cover.jpg"],
  },
  {
    id: "aluva-ernakulam-2",
    number: "10",
    title: "Residence at Aluva",
    location: "Aluva, Ernakulam",
    year: "2022",
    category: "Residence",
    description:
      "Layered volumes and warm material reading — a family home tuned to its Ernakulam context.",
    image: "/images/works/aluva-ernakulam-2/cover.jpg",
    images: ["/images/works/aluva-ernakulam-2/cover.jpg"],
  },
  {
    id: "kothamangalam-ernakulam-3",
    number: "11",
    title: "Residence at Kothamangalam",
    location: "Kothamangalam, Ernakulam",
    year: "2022",
    category: "Residence",
    description:
      "A Kothamangalam residence with a strong exterior presence — shade, structure, and a sense of arrival.",
    image: "/images/works/kothamangalam-ernakulam-3/01.jpg",
    images: ["/images/works/kothamangalam-ernakulam-3/01.jpg"],
  },
  {
    id: "interior-nadapuram-kozhikode",
    number: "12",
    title: "Interior at Nadapuram",
    location: "Nadapuram, Kozhikode",
    year: "",
    category: "Interior",
    description:
      "An interior for a Kozhikode home — rooms shaped for light, material warmth, and the pace of daily living.",
    image: "/images/works/interior-nadapuram-kozhikode/01.jpg",
    images: [
      "/images/works/interior-nadapuram-kozhikode/01.jpg",
      "/images/works/interior-nadapuram-kozhikode/02.jpg",
      "/images/works/interior-nadapuram-kozhikode/03.jpg",
      "/images/works/interior-nadapuram-kozhikode/04.jpg",
      "/images/works/interior-nadapuram-kozhikode/05.jpg",
    ],
  },
  {
    id: "interior-kothamangalam-ernakulam",
    number: "13",
    title: "Interior at Kothamangalam",
    location: "Kothamangalam, Ernakulam",
    year: "",
    category: "Interior",
    description:
      "Interior design in Ernakulam — finishes, furniture, and light composed for a calm, lived-in home.",
    image: "/images/works/interior-kothamangalam-ernakulam/01.jpg",
    images: [
      "/images/works/interior-kothamangalam-ernakulam/01.jpg",
      "/images/works/interior-kothamangalam-ernakulam/02.jpg",
      "/images/works/interior-kothamangalam-ernakulam/03.jpg",
      "/images/works/interior-kothamangalam-ernakulam/04.jpg",
    ],
  },
  {
    id: "interior-kuwait",
    number: "14",
    title: "Interior at Kuwait",
    location: "Kuwait",
    year: "",
    category: "Interior",
    description:
      "A Kuwait interior — layered materials and a clear spatial order, tuned for comfort and presence.",
    image: "/images/works/interior-kuwait/01.jpg",
    images: [
      "/images/works/interior-kuwait/01.jpg",
      "/images/works/interior-kuwait/02.jpg",
      "/images/works/interior-kuwait/03.jpg",
    ],
  },
];

export const WORK_CATEGORIES = [
  "All",
  ...Array.from(new Set(WORKS.map((w) => w.category))),
];

export function getWorkById(id: string) {
  return WORKS.find((w) => w.id === id);
}

export function getWorkNeighbors(id: string) {
  const index = WORKS.findIndex((w) => w.id === id);
  if (index < 0) return { prev: null, next: null, index: -1 };

  return {
    index,
    prev: WORKS[(index - 1 + WORKS.length) % WORKS.length],
    next: WORKS[(index + 1) % WORKS.length],
  };
}
