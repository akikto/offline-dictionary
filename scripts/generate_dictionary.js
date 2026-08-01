import fs from 'fs';
import path from 'path';

// Phonetic engine to map English sounds to easy Bengali pronunciations
function generateBengaliPronunciation(word) {
  const w = word.toLowerCase();
  
  // Direct override mapping for common words
  const overrides = {
    apple: 'অ্যাপল',
    banana: 'ব্যানানা',
    water: 'ওয়াটার',
    book: 'বুক',
    pen: 'পেন',
    pencil: 'পেন্সিল',
    paper: 'পেপার',
    school: 'স্কুল',
    teacher: 'টিচার',
    student: 'স্টুডেন্ট',
    father: 'ফাদার',
    mother: 'মাদার',
    brother: 'ব্রাদার',
    sister: 'সিস্টার',
    doctor: 'ডক্টর',
    nurse: 'নার্স',
    hospital: 'হাসপাতাল / হসপিটাল',
    car: 'কার',
    bus: 'বাস',
    train: 'ট্রেন',
    plane: 'প্লেন',
    home: 'হোম',
    house: 'হাউস',
    room: 'রুম',
    food: 'ফুড',
    rice: 'রাইস',
    bread: 'ব্রেড',
    milk: 'মিল্ক',
    tea: 'টি',
    coffee: 'কফি',
    sugar: 'সুগার',
    salt: 'সল্ট',
    time: 'টাইম',
    day: 'ডে',
    night: 'নাইট',
    sun: 'সান',
    moon: 'মুন',
    star: 'স্টার',
    sky: 'স্কাই',
    rain: 'রেইন',
    cloud: 'ক্লাউড',
    wind: 'উইন্ড',
    happy: 'হ্যাপি',
    sad: 'স্যাড',
    love: 'লাভ',
    friend: 'ফ্রেন্ড',
    office: 'অফিস',
    work: 'ওয়ার্ক',
    job: 'জব',
    money: 'মানি',
    shop: 'শপ',
    market: 'মার্কেট',
    buy: 'বাই',
    sell: 'সেল',
    phone: 'ফোন',
    mobile: 'মোবাইল',
    computer: 'কম্পিউটার',
    internet: 'ইন্টারনেট',
    cat: 'ক্যাট',
    dog: 'ডগ',
    bird: 'বার্ড',
    fish: 'ফিশ',
    cow: 'কাউ',
    horse: 'হর্স',
    tree: 'ট্রি',
    flower: 'ফ্লাওয়ার',
    city: 'সিটি',
    town: 'টাউন',
    village: 'ভিলেজ',
    country: 'কান্ট্রি',
    shirt: 'শার্ট',
    pants: 'প্যান্টস',
    shoes: 'শুজ',
    hat: 'হ্যাট',
    bag: 'ব্যাগ',
    clock: 'ক্লক',
    watch: 'ওয়াচ',
    table: 'টেবিল',
    chair: 'চেয়ার',
    door: 'ডোর',
    window: 'উইন্ডো',
    bed: 'বেড',
    light: 'লাইট',
    key: 'কি',
    lock: 'লক',
    road: 'রোড',
    street: 'স্ট্রিট',
    ticket: 'টিকিট',
    music: 'মিউজিক',
    song: 'সং',
    movie: 'মুভি',
    game: 'গেম',
    sport: 'স্পোর্ট',
    health: 'হেলথ',
    weather: 'ওয়েদার'
  };

  if (overrides[w]) return overrides[w];

  // Algorithmic sound converter for Bengali pronunciation
  let p = w;
  p = p.replace(/tion$/g, 'শন');
  p = p.replace(/sion$/g, 'শন');
  p = p.replace(/ment$/g, 'মেন্ট');
  p = p.replace(/able$/g, 'এবল');
  p = p.replace(/ful$/g, 'ফুল');
  p = p.replace(/less$/g, 'লেস');
  p = p.replace(/ness$/g, 'নেস');
  p = p.replace(/ing$/g, 'ইং');
  p = p.replace(/ed$/g, 'এড');
  p = p.replace(/er$/g, 'ার');
  p = p.replace(/or$/g, 'র');
  p = p.replace(/ly$/g, 'লি');
  p = p.replace(/y$/g, 'ি');
  p = p.replace(/ch/g, 'চ');
  p = p.replace(/sh/g, 'শ');
  p = p.replace(/th/g, 'থ');
  p = p.replace(/ph/g, 'ফ');
  p = p.replace(/ck/g, 'ক');
  p = p.replace(/qu/g, 'কু');
  p = p.replace(/ee/g, 'ি');
  p = p.replace(/ea/g, 'ি');
  p = p.replace(/oo/g, 'ু');
  p = p.replace(/ou/g, 'াউ');
  p = p.replace(/ow/g, 'াও');
  p = p.replace(/ai/g, 'েই');
  p = p.replace(/ay/g, 'েই');
  p = p.replace(/oi/g, 'য়');
  p = p.replace(/oy/g, 'য়');
  p = p.replace(/a/g, 'া');
  p = p.replace(/b/g, 'ব');
  p = p.replace(/c/g, 'ক');
  p = p.replace(/d/g, 'ড');
  p = p.replace(/e/g, 'ে');
  p = p.replace(/f/g, 'ফ');
  p = p.replace(/g/g, 'গ');
  p = p.replace(/h/g, 'হ');
  p = p.replace(/i/g, 'ি');
  p = p.replace(/j/g, 'জ');
  p = p.replace(/k/g, 'ক');
  p = p.replace(/l/g, 'ল');
  p = p.replace(/m/g, 'ম');
  p = p.replace(/n/g, 'ন');
  p = p.replace(/o/g, 'ও');
  p = p.replace(/p/g, 'প');
  p = p.replace(/r/g, 'র');
  p = p.replace(/s/g, 'স');
  p = p.replace(/t/g, 'ট');
  p = p.replace(/u/g, 'ু');
  p = p.replace(/v/g, 'ভ');
  p = p.replace(/w/g, 'ওয়');
  p = p.replace(/x/g, 'ক্স');
  p = p.replace(/z/g, 'জ');

  return p;
}

console.log('Script loaded successfully.');
