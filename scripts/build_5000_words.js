import fs from 'fs';
import path from 'path';

function toBnPronunciation(word) {
  const w = word.toLowerCase().trim();

  const direct = {
    apple: 'অ্যাপল', banana: 'ব্যানানা', orange: 'অরেঞ্জ', mango: 'ম্যাঙ্গো', water: 'ওয়াটার',
    milk: 'মিল্ক', tea: 'টি', coffee: 'কফি', rice: 'রাইস', bread: 'ব্রেড', sugar: 'সুগার',
    salt: 'সল্ট', fish: 'ফিশ', meat: 'মিট', chicken: 'চিকেন', egg: 'এগ', butter: 'বাটার',
    cheese: 'চিজ', soup: 'সুপ', salad: 'স্যালাড', cake: 'কেক', juice: 'জুস', father: 'ফাদার',
    mother: 'মাদার', brother: 'ব্রাদার', sister: 'সিস্টার', uncle: 'আঙ্কেল', aunt: 'আন্ট',
    son: 'সান', daughter: 'ডটার', grandfather: 'গ্র্যান্ডফাদার', grandmother: 'গ্র্যান্ডমাদার',
    husband: 'হাসব্যান্ড', wife: 'ওয়াইফ', friend: 'ফ্রেন্ড', child: 'চাইল্ড', baby: 'বেবি',
    school: 'স্কুল', teacher: 'টিচার', student: 'স্টুডেন্ট', book: 'বুক', pen: 'পেন',
    pencil: 'পেন্সিল', paper: 'পেপার', desk: 'ডেস্ক', chair: 'চেয়ার', table: 'টেবিল',
    office: 'অফিস', boss: 'বস', manager: 'ম্যানেজার', employee: 'এমপ্লয়ী', job: 'জব',
    work: 'ওয়ার্ক', salary: 'স্যালারি', meeting: 'মিটিং', email: 'ইমেইল', doctor: 'ডক্টর',
    nurse: 'নার্স', hospital: 'হাসপাতাল', medicine: 'মেডিসিন', health: 'হেলথ', car: 'কার',
    bus: 'বাস', train: 'ট্রেন', plane: 'প্লেন', ticket: 'টিকিট', travel: 'ট্রাভেল',
    home: 'হোম', house: 'হাউস', room: 'রুম', door: 'ডোর', window: 'উইন্ডো', bed: 'বেড',
    light: 'লাইট', key: 'কি', lock: 'লক', shop: 'শপ', market: 'মার্কেট', buy: 'বাই',
    sell: 'সেল', money: 'মানি', price: 'প্রাইস', phone: 'ফোন', mobile: 'মোবাইল',
    computer: 'কম্পিউটার', internet: 'ইন্টারনেট', tree: 'ট্রি', flower: 'ফ্লাওয়ার',
    sun: 'সান', moon: 'মুন', star: 'স্টার', sky: 'স্কাই', rain: 'রেইন', cloud: 'ক্লাউড',
    happy: 'হ্যাপি', sad: 'স্যাড', love: 'লাভ', head: 'হেড', eye: 'আই', ear: 'ইয়ার',
    nose: 'নোজ', mouth: 'মাউথ', hand: 'হ্যান্ড', leg: 'লেগ', shirt: 'শার্ট', pants: 'প্যান্টস',
    shoes: 'শুজ', time: 'টাইম', hour: 'আওয়ার', minute: 'মিনিট', day: 'ডে', night: 'নাইট',
    weather: 'ওয়েদার', summer: 'সামার', winter: 'উইন্টার', dog: 'ডগ', cat: 'ক্যাট', bird: 'বার্ড'
  };

  if (direct[w]) return direct[w];

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

// Write Python generator script to generate 5000+ everyday English words with Bengali translations,
// simple English definitions, daily life sentences, Bengali sentence translations, synonyms, antonyms and categories!
