import migration from "figma:asset/e0b708ff6603c76fd37fd215f5e6f97b35be4085.png";
import alpenglow from "figma:asset/a70245acab034155d8e19a5310d3e68e2af85fb2.png";
import lastLight from "figma:asset/eb1a8fdf1f7b41775b7d9021634f03a83422c5d2.png";
import sparkWater from "figma:asset/11d13bfd1c6f863f125873e106e04a0a602afc28.png";
import bison from "figma:asset/23036640c49471ba188c2ba9bb06f8fd93ebfd41.png";
import moonrise from "figma:asset/49e32ffdc03d677d100cdf4a7f80e1065785de04.png";
import autumnFlanks from "figma:asset/f6d49c35219d4b7130bdcc65d690d1b2567ea12c.png";

export interface Print {
  id: number;
  title: string;
  year: number;
  dimensions: string;
  edition: string;
  price: number | null;
  available: boolean;
  image: string;
  objectPosition?: string;
  /** Shopify product handle — verify against your store admin URL */
  shopifyHandle: string;
}

export const prints: Print[] = [
  {
    id: 1,
    title: "Migration",
    year: 2025,
    dimensions: '8 × 12"',
    edition: "Edition of 25",
    price: 420,
    available: true,
    image: migration,
    shopifyHandle: "aloft-8x12",
  },
  {
    id: 2,
    title: "Alpenglow",
    year: 2025,
    dimensions: '11 × 14"',
    edition: "Edition of 20",
    price: 380,
    available: true,
    image: alpenglow,
    objectPosition: "center top",
    shopifyHandle: "mt-fee-11x14",
  },
  {
    id: 3,
    title: "Tantalus Sunrise",
    year: 2025,
    dimensions: '12 × 18"',
    edition: "Edition of 15",
    price: 480,
    available: true,
    image: lastLight,
    shopifyHandle: "tantalus-sunrise-12x18",
  },
  {
    id: 4,
    title: "Still Water",
    year: 2024,
    dimensions: '8 × 12"',
    edition: "Edition of 20",
    price: 360,
    available: true,
    image: sparkWater,
    shopifyHandle: "glistening-sea-8x12",
  },
  {
    id: 5,
    title: "The Crossing",
    year: 2024,
    dimensions: '12 × 18"',
    edition: "Edition of 15",
    price: 500,
    available: true,
    image: bison,
    shopifyHandle: "paradise-valley-buffalo-12x18",
  },
  {
    id: 6,
    title: "Moonrise",
    year: 2020,
    dimensions: '8 × 20"',
    edition: "Edition of 20",
    price: 340,
    available: true,
    image: moonrise,
    shopifyHandle: "tantalus-moonrise-8x20",
  },
  {
    id: 7,
    title: "Autumn Flanks",
    year: 2024,
    dimensions: '24 × 36"',
    edition: "Edition of 10",
    price: 560,
    available: true,
    image: autumnFlanks,
    shopifyHandle: "tszil-24x36",
  },
  {
    id: 8,
    title: "Mount Phi",
    year: 2025,
    dimensions: '24 × 36"',
    edition: "Edition of 10",
    price: null,
    available: true,
    image: alpenglow,
    objectPosition: "center top",
    shopifyHandle: "mt-fee-24x36",
  },
  {
    id: 9,
    title: "Tszil",
    year: 2024,
    dimensions: '18 × 24"',
    edition: "Edition of 10",
    price: null,
    available: true,
    image: autumnFlanks,
    shopifyHandle: "tszil-18x24",
  },
];