import { CategoryType } from '../types';

export interface SubCategoryItem {
  name: string;
  category: CategoryType;
  filterSubcategory?: string;
  badge?: string;
  image?: string;
  description?: string;
}

export interface MegaMenuItem {
  title: string;
  category: CategoryType;
  subcategories: SubCategoryItem[];
  featuredImage: string;
  featuredTitle: string;
  featuredSubtitle: string;
}

export const MAIN_NAV_ITEMS: {
  label: string;
  category?: CategoryType;
  page?: 'home' | 'shop' | 'about' | 'contact' | 'size-guide' | 'track-order';
  hasDropdown?: boolean;
  isHot?: boolean;
  megaMenu?: MegaMenuItem;
}[] = [
  {
    label: 'Home',
    page: 'home',
  },
  {
    label: 'Men',
    category: 'men',
    hasDropdown: true,
    megaMenu: {
      title: "Men's Footwear Masterclass",
      category: 'men',
      subcategories: [
        {
          name: 'Peshawari & Traditional Chappals',
          category: 'peshawari',
          filterSubcategory: 'Peshawari Chappal',
          badge: 'Signature',
          image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80',
          description: 'Handcrafted double tyre sole Kaptaan & Noruzi cuts.',
        },
        {
          name: 'Formal Italian Leather Shoes',
          category: 'formal',
          filterSubcategory: 'Formal Leather',
          badge: 'Executive',
          image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80',
          description: 'Full-grain calfskin Oxfords & Goodyear-welted Derbies.',
        },
        {
          name: 'Casual Loafers & Moccasins',
          category: 'casual',
          filterSubcategory: 'Loafers & Slip-ons',
          image: 'https://images.unsplash.com/photo-1582898950585-64ce74492db2?auto=format&fit=crop&w=600&q=80',
          description: 'Supple suede and burnished leather driving moccasins.',
        },
        {
          name: 'Sneakers & Streetwear',
          category: 'sneakers',
          filterSubcategory: 'Sneakers',
          badge: 'New Drop',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
          description: 'Nitrogen-rebound energy midsoles & breathable mesh.',
        },
        {
          name: 'Leather Boots & Chukkas',
          category: 'boots',
          filterSubcategory: 'Boots',
          image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&q=80',
          description: 'Rugged storm-welt ankle boots in oiled nubuck.',
        },
        {
          name: 'Comfort Sandals & Slides',
          category: 'sandals',
          filterSubcategory: 'Sandals',
          image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80',
          description: 'Anatomical cork footbed & padded leather straps.',
        },
      ],
      featuredImage: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80',
      featuredTitle: 'Kaptaan Noruzi Special Drop',
      featuredSubtitle: 'Double Tyre Tread • 100% Pure Cowhide Leather',
    },
  },
  {
    label: 'Women',
    category: 'women',
    hasDropdown: true,
    megaMenu: {
      title: "Women's Royal Atelier",
      category: 'women',
      subcategories: [
        {
          name: 'Handcrafted Bridal & Daily Khussa',
          category: 'khussa',
          filterSubcategory: 'Khussa',
          badge: 'Trending',
          image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
          description: 'Pure velvet with real Tilla, Kundan pearls & memory foam.',
        },
        {
          name: 'Block Heels & Evening Stilettos',
          category: 'heels',
          filterSubcategory: 'Heels',
          image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
          description: 'Ergonomic arch support with premium leather wrapping.',
        },
        {
          name: 'Kolhapuris & Traditional Flats',
          category: 'sandals',
          filterSubcategory: 'Flats & Kolhapuris',
          badge: 'Artisan',
          image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
          description: 'Braided genuine leather with cushioned sole.',
        },
        {
          name: 'Comfort Wedges & Platforms',
          category: 'heels',
          filterSubcategory: 'Wedges',
          image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80',
          description: 'Featherlight shock-absorbing cork and jute platforms.',
        },
        {
          name: 'Casual Street Sneakers',
          category: 'sneakers',
          filterSubcategory: 'Sneakers',
          image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
          description: 'Pastel silhouettes with all-day memory foam insoles.',
        },
        {
          name: 'Party Slippers & Slides',
          category: 'sandals',
          filterSubcategory: 'Sandals',
          image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
          description: 'Embellished strap mules with micro-suede comfort.',
        },
      ],
      featuredImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
      featuredTitle: 'Royal Zari Khussa Edition',
      featuredSubtitle: 'Hand-Embroidered Dabka • Guaranteed Bite-Free',
    },
  },
  {
    label: 'Peshawari',
    category: 'peshawari',
    hasDropdown: true,
    megaMenu: {
      title: 'Peshawari Heritage Atelier',
      category: 'peshawari',
      subcategories: [
        {
          name: 'Kaptaan Chappal (Double Tyre Sole)',
          category: 'peshawari',
          filterSubcategory: 'Peshawari Chappal',
          badge: 'Iconic',
          image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80',
          description: 'The national signature silhouette in full-grain cowhide.',
        },
        {
          name: 'Noruzi Cut (Hand-Braided Leather)',
          category: 'peshawari',
          filterSubcategory: 'Peshawari Chappal',
          image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80',
          description: 'Signature curved toe box with reinforced arch padding.',
        },
        {
          name: 'Zalmi & Quetta Special Editions',
          category: 'peshawari',
          filterSubcategory: 'Peshawari Chappal',
          badge: 'Limited',
          image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80',
          description: 'Deep mustard and chocolate tones for festive gatherings.',
        },
        {
          name: 'Shikarpuri & Traditional Cuts',
          category: 'peshawari',
          filterSubcategory: 'Peshawari Chappal',
          image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80',
          description: 'Classic heritage toe design with soft calf insole.',
        },
      ],
      featuredImage: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80',
      featuredTitle: 'Artisanal Tyre-Sole Peshawari',
      featuredSubtitle: '100% Genuine Pakistan Leather • Lifetime Stitch Warranty',
    },
  },
  {
    label: 'Sale',
    category: 'sale',
    isHot: true,
  },
  {
    label: 'About Us',
    page: 'about',
  },
  {
    label: 'Contact Us',
    page: 'contact',
  },
];

export const CATEGORIES_LIST: {
  id: CategoryType;
  name: string;
  subtitle: string;
  image: string;
  itemCount: number;
}[] = [
  {
    id: 'peshawari',
    name: 'Peshawari Chappals',
    subtitle: 'Kaptaan, Noruzi, Zalmi & Quetta cuts in pure cowhide leather',
    image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80',
    itemCount: 24,
  },
  {
    id: 'khussa',
    name: 'Handcrafted Khussas',
    subtitle: 'Royal Tilla embroidery, Kundan work & soft memory padding',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    itemCount: 30,
  },
  {
    id: 'formal',
    name: "Men's Formal Shoes",
    subtitle: 'Hand-burnished Italian calfskin Oxfords, Derbies & Monk Straps',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    itemCount: 18,
  },
  {
    id: 'heels',
    name: 'Women’s Heels & Pumps',
    subtitle: 'Block heels & stilettos with cloud metatarsal cushioning',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    itemCount: 22,
  },
  {
    id: 'sneakers',
    name: 'Sneakers & Streetwear',
    subtitle: 'Supercritical Nitrogen-rebound soles & breathable mesh',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    itemCount: 28,
  },
  {
    id: 'sale',
    name: 'Clearance & Flash Sale',
    subtitle: 'Up to 50% discount on seasonal handcrafted footwear',
    image: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80',
    itemCount: 35,
  },
];

export const HERO_SLIDES = [
  {
    id: 1,
    badge: 'Cash on Delivery Nationwide (All Pakistan)',
    title: 'The Master Peshawari Chappal Collection',
    subtitle: 'Hand-stitched in pure vegetable-tanned cowhide with signature durable tyre soles. Made for Pakistani royalty and festive occasions.',
    ctaText: 'Shop Peshawari Chappals',
    ctaCategory: 'peshawari' as CategoryType,
    secondaryCta: 'Shop Women’s Khussas',
    secondaryCategory: 'khussa' as CategoryType,
    image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1600&q=80',
    accentColor: 'from-amber-600/90 to-neutral-950/90',
  },
  {
    id: 2,
    badge: 'New Season Festivities',
    title: 'Royal Handcrafted Velvet & Tilla Khussas',
    subtitle: 'Adorned with intricate hand-embroidered dabka, zari, and soft memory-foam insoles. Guaranteed bite-free comfort all day long.',
    ctaText: 'Shop Women’s Khussas',
    ctaCategory: 'khussa' as CategoryType,
    secondaryCta: 'View Heels & Flats',
    secondaryCategory: 'women' as CategoryType,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1600&q=80',
    accentColor: 'from-rose-950/90 to-neutral-950/90',
  },
  {
    id: 3,
    badge: 'Free Express Delivery across Pakistan Over Rs. 3600',
    title: 'Executive Italian Leather & Urban Nitro Runners',
    subtitle: 'From boardroom Goodyear-welted oxfords to responsive street runners, engineered for Pakistan’s all-day wear.',
    ctaText: 'Shop Men’s Formal',
    ctaCategory: 'formal' as CategoryType,
    secondaryCta: 'Explore Sneakers',
    secondaryCategory: 'sneakers' as CategoryType,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80',
    accentColor: 'from-blue-950/90 to-neutral-950/90',
  },
];

export const FAQ_LIST = [
  {
    category: 'Shipping & Delivery in Pakistan',
    question: 'How long does delivery take across Pakistan?',
    answer: 'We dispatch via priority courier partners (TCS, Leopards, Trax). Major metropolitan areas (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad) receive deliveries in 2–3 business days. Other cities and rural areas take 3–4 business days.',
  },
  {
    category: 'Shipping & Delivery in Pakistan',
    question: 'How can I pay for my order in Pakistan?',
    answer: 'We accept Cash on Delivery (COD), instant mobile account transfers via JazzCash and EasyPaisa, as well as Online Banking / Raast and Debit/Credit Cards (Visa / Mastercard). You can submit your Transaction ID (TID) during checkout for automated payment verification.',
  },
  {
    category: 'Shipping & Delivery in Pakistan',
    question: 'What are the delivery charges?',
    answer: 'Delivery is completely FREE across Pakistan on all orders over Rs. 3600. For orders below Rs. 3600, a flat standard courier rate of Rs. 250 applies.',
  },
  {
    category: 'Sizing & Fit',
    question: 'How do I choose the correct shoe size?',
    answer: 'Our shoes follow standard European (EU) sizing used across Pakistan. If you normally wear size 42 in Bata or Servis, order size 42. For wide feet in Peshawari chappals or boots, we recommend going one size up.',
  },
  {
    category: 'Sizing & Fit',
    question: 'What if the shoe does not fit me properly?',
    answer: 'We provide an easy 7-day hassle-free size exchange policy across Pakistan. Simply contact our support desk or submit an exchange request, and we will arrange a replacement size swap at your doorstep.',
  },
  {
    category: 'SP Islamic Lifestyle & Materials',
    question: 'Are the Leather Khuffain (Leather Socks) compliant for Wudhu / Masah?',
    answer: 'Yes, our Leather Khuffain are crafted from halal-certified full grain soft cowhide, water-resistant, durable, and fully compliant with Islamic Shariah requirements for Masah over socks during travel and cold seasons.',
  },
  {
    category: 'Materials & Care',
    question: 'How do I maintain my genuine leather shoes and Peshawari chappals?',
    answer: 'Wipe off road dust with a dry soft cloth. Use our natural beeswax shoe polish once a month. For Peshawari chappals, store in the provided breathable cotton dust bag away from direct dampness.',
  },
];

export const STORE_LOCATIONS = [
  {
    city: 'Lahore (Flagship Store)',
    address: 'Shop #14, MM Alam Road, Gulberg III, Lahore, Punjab',
    hours: 'Mon - Sat: 11:00 AM - 11:00 PM | Sun: 2:00 PM - 11:00 PM',
  },
  {
    city: 'Karachi (Boutique & Experience Hub)',
    address: 'Level 1, Fashion Avenue, Dolmen Mall Clifton, Karachi, Sindh',
    hours: 'Mon - Sun: 11:00 AM - 11:30 PM',
  },
  {
    city: 'Islamabad (Centaurus Mall)',
    address: '2nd Floor, The Centaurus Mall, F-8/4, Jinnah Avenue, Islamabad',
    hours: 'Mon - Sun: 11:00 AM - 11:00 PM',
  },
];

export const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Larkana',
  'Sheikhupura',
  'Jhang',
  'Rahim Yar Khan',
  'Gujrat',
  'Mardan',
  'Kasur',
  'Dera Ghazi Khan',
  'Sahiwal',
  'Nawabshah',
  'Mingora (Swat)',
  'Mirpur (AJK)',
  'Muzaffarabad (AJK)',
  'Chiniot',
  'Kamoke',
  'Mandi Bahauddin',
  'Jhelum',
  'Sadiqabad',
  'Khanewal',
  'Hafizabad',
  'Kohat',
  'Dera Ismail Khan',
  'Turbat',
  'Khuzdar',
  'Chaman',
  'Hub',
  'Gwadar',
  'Gilgit',
  'Skardu',
  'Attock',
  'Vehari',
  'Kotli (AJK)',
  'Rawalakot (AJK)',
  'Bhimber (AJK)',
  'Nowshera',
  'Wah Cantt',
  'Taxila',
  'Mansehra',
  'Bannu',
  'Swabi',
  'Chakwal',
  'Mianwali',
  'Burewala',
  'Muzaffargarh',
  'Pakpattan',
  'Toba Tek Singh',
  'Bahawalnagar',
  'Khairpur',
  'Mirpur Khas',
  'Jacobabad',
  'Shikarpur',
  'Tando Adam',
  'Tando Allahyar',
  'Badin',
  'Dadu',
  'Charsadda',
  'Haripur',
  'Timergara',
  'Chitral',
  'Hunza',
  'Wazirabad',
  'Murree',
];

export const SIZE_CHART_DATA = {
  men: [
    { eu: 39, us: 6.5, uk: 6.0, cm: 24.5, inches: 9.6 },
    { eu: 40, us: 7.5, uk: 7.0, cm: 25.4, inches: 10.0 },
    { eu: 41, us: 8.5, uk: 8.0, cm: 26.0, inches: 10.2 },
    { eu: 42, us: 9.0, uk: 8.5, cm: 27.0, inches: 10.6 },
    { eu: 43, us: 10.0, uk: 9.5, cm: 27.9, inches: 11.0 },
    { eu: 44, us: 11.0, uk: 10.5, cm: 28.6, inches: 11.2 },
    { eu: 45, us: 12.0, uk: 11.5, cm: 29.4, inches: 11.6 },
    { eu: 46, us: 13.0, uk: 12.5, cm: 30.2, inches: 11.9 },
  ],
  women: [
    { eu: 36, us: 6.0, uk: 3.5, cm: 22.5, inches: 8.8 },
    { eu: 37, us: 6.5, uk: 4.0, cm: 23.0, inches: 9.0 },
    { eu: 38, us: 7.5, uk: 5.0, cm: 24.0, inches: 9.4 },
    { eu: 39, us: 8.5, uk: 6.0, cm: 25.0, inches: 9.8 },
    { eu: 40, us: 9.0, uk: 6.5, cm: 25.5, inches: 10.0 },
    { eu: 41, us: 10.0, uk: 7.5, cm: 26.5, inches: 10.4 },
  ],
};

export const SHOE_GRAM_GALLERY = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80',
    user: '@ahmed_lahore',
    tag: 'Kaptaan Chappal',
    likes: 382,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
    user: '@zara_karachi',
    tag: 'Royal Velvet Khussa',
    likes: 541,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    user: '@hamza_isb',
    tag: 'Nitro Pulse Runner',
    likes: 620,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
    user: '@usman_peshawar',
    tag: 'Zalmi Double Tyre Sole',
    likes: 419,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    user: '@bilal_faisalabad',
    tag: 'Goodyear Oxford',
    likes: 298,
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=600&q=80',
    user: '@fatima_multan',
    tag: 'Tilla Wedding Khussa',
    likes: 712,
  },
];

