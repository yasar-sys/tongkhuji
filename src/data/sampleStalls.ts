export interface TeaStall {
  id: string;
  name_bn: string;
  name_en: string;
  owner_name: string;
  phone: string;
  division: string;
  district: string;
  upazila: string;
  lat: number;
  lng: number;
  open_time: string;
  close_time: string;
  description_bn: string;
  description_en: string;
  tea_price_min: number;
  tea_price_max: number;
  facilities: string[];
  rating: number;
  review_count: number;
  image_url: string;
  is_open: boolean;
}

export const divisions = [
  { bn: 'ঢাকা', en: 'Dhaka' },
  { bn: 'চট্টগ্রাম', en: 'Chittagong' },
  { bn: 'রাজশাহী', en: 'Rajshahi' },
  { bn: 'খুলনা', en: 'Khulna' },
  { bn: 'বরিশাল', en: 'Barisal' },
  { bn: 'সিলেট', en: 'Sylhet' },
  { bn: 'রংপুর', en: 'Rangpur' },
  { bn: 'ময়মনসিংহ', en: 'Mymensingh' },
];

export const sampleStalls: TeaStall[] = [
  {
    id: '1',
    name_bn: 'রহিম চাচার টঙ',
    name_en: "Rahim Chacha's Tong",
    owner_name: 'Rahim Uddin',
    phone: '01712345678',
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Dhanmondi',
    lat: 23.7461,
    lng: 90.3742,
    open_time: '06:00',
    close_time: '23:00',
    description_bn: 'ঢাকার ধানমন্ডিতে ৩০ বছরের পুরনো চায়ের দোকান। বিশেষ মালাই চা এবং আদা চায়ের জন্য বিখ্যাত।',
    description_en: 'A 30-year-old tea stall in Dhanmondi, Dhaka. Famous for special malai cha and ginger tea.',
    tea_price_min: 10,
    tea_price_max: 30,
    facilities: ['seating', 'tv'],
    rating: 4.5,
    review_count: 128,
    image_url: '',
    is_open: true,
  },
  {
    id: '2',
    name_bn: 'সিলেটি সাত রঙ চা',
    name_en: 'Sylheti Seven Layer Tea',
    owner_name: 'Kamal Hossain',
    phone: '01898765432',
    division: 'Sylhet',
    district: 'Sylhet',
    upazila: 'Sylhet Sadar',
    lat: 24.8949,
    lng: 91.8687,
    open_time: '05:30',
    close_time: '22:00',
    description_bn: 'সিলেটের বিখ্যাত সাত রঙ চা। প্রতিটি স্তর আলাদা স্বাদের।',
    description_en: 'Famous seven-layer tea of Sylhet. Each layer has a unique flavor.',
    tea_price_min: 40,
    tea_price_max: 80,
    facilities: ['seating', 'wifi'],
    rating: 4.8,
    review_count: 342,
    image_url: '',
    is_open: true,
  },
  {
    id: '3',
    name_bn: 'নদীর ধারের টঙ',
    name_en: 'Riverside Tong',
    owner_name: 'Abdul Karim',
    phone: '01555123456',
    division: 'Chittagong',
    district: 'Chittagong',
    upazila: 'Patenga',
    lat: 22.2352,
    lng: 91.7914,
    open_time: '07:00',
    close_time: '21:00',
    description_bn: 'পতেঙ্গা সমুদ্র সৈকতের কাছে। সূর্যাস্ত দেখতে দেখতে চা খাওয়ার অভিজ্ঞতা।',
    description_en: 'Near Patenga beach. Experience tea while watching the sunset.',
    tea_price_min: 15,
    tea_price_max: 35,
    facilities: ['seating', 'smoking_zone'],
    rating: 4.2,
    review_count: 89,
    image_url: '',
    is_open: false,
  },
  {
    id: '4',
    name_bn: 'বিশ্ববিদ্যালয় টঙ',
    name_en: 'University Tong',
    owner_name: 'Jamal Mia',
    phone: '01611223344',
    division: 'Rajshahi',
    district: 'Rajshahi',
    upazila: 'Rajshahi Sadar',
    lat: 24.3636,
    lng: 88.6241,
    open_time: '06:00',
    close_time: '00:00',
    description_bn: 'রাজশাহী বিশ্ববিদ্যালয়ের পাশে। শিক্ষার্থীদের আড্ডার প্রিয় জায়গা।',
    description_en: "Near Rajshahi University. Students' favorite hangout spot.",
    tea_price_min: 8,
    tea_price_max: 20,
    facilities: ['seating', 'wifi', 'tv'],
    rating: 4.0,
    review_count: 215,
    image_url: '',
    is_open: true,
  },
  {
    id: '5',
    name_bn: 'মামার টঙ',
    name_en: "Mama's Tong",
    owner_name: 'Habibur Rahman',
    phone: '01777654321',
    division: 'Khulna',
    district: 'Khulna',
    upazila: 'Khulna Sadar',
    lat: 22.8456,
    lng: 89.5403,
    open_time: '05:00',
    close_time: '22:30',
    description_bn: 'খুলনার সবচেয়ে পুরনো চায়ের দোকান। ৪০ বছর ধরে একই স্বাদ।',
    description_en: "Khulna's oldest tea stall. Same taste for 40 years.",
    tea_price_min: 10,
    tea_price_max: 25,
    facilities: ['seating'],
    rating: 4.6,
    review_count: 178,
    image_url: '',
    is_open: true,
  },
  {
    id: '6',
    name_bn: 'চা বাগান ক্যাফে',
    name_en: 'Tea Garden Cafe',
    owner_name: 'Sumon Das',
    phone: '01999876543',
    division: 'Sylhet',
    district: 'Moulvibazar',
    upazila: 'Sreemangal',
    lat: 24.3065,
    lng: 91.7297,
    open_time: '06:00',
    close_time: '20:00',
    description_bn: 'শ্রীমঙ্গলের চা বাগানের মাঝে। তাজা চা পাতার চা পান করুন।',
    description_en: 'Amidst Sreemangal tea gardens. Enjoy tea from fresh tea leaves.',
    tea_price_min: 20,
    tea_price_max: 60,
    facilities: ['seating', 'wifi', 'smoking_zone'],
    rating: 4.9,
    review_count: 456,
    image_url: '',
    is_open: true,
  },
];
