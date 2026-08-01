import fs from 'fs';
import path from 'path';

function getBnPronunciation(word) {
  const w = word.toLowerCase().trim();

  const direct = {
    apple: 'অ্যাপল',
    banana: 'ব্যানানা',
    orange: 'অরেঞ্জ',
    mango: 'ম্যাঙ্গো',
    water: 'ওয়াটার',
    milk: 'মিল্ক',
    tea: 'টি',
    coffee: 'কফি',
    rice: 'রাইস',
    bread: 'ব্রেড',
    sugar: 'সুগার',
    salt: 'সল্ট',
    fish: 'ফিশ',
    meat: 'মিট',
    chicken: 'চিকেন',
    egg: 'এগ',
    butter: 'বাটার',
    cheese: 'চিজ',
    soup: 'সুপ',
    salad: 'স্যালাড',
    cake: 'কেক',
    juice: 'জুস',
    father: 'ফাদার',
    mother: 'মাদার',
    brother: 'ব্রাদার',
    sister: 'সিস্টার',
    uncle: 'আঙ্কেল',
    aunt: 'আন্ট',
    son: 'সান',
    daughter: 'ডটার',
    grandfather: 'গ্র্যান্ডফাদার',
    grandmother: 'গ্র্যান্ডমাদার',
    husband: 'হাসব্যান্ড',
    wife: 'ওয়াইফ',
    friend: 'ফ্রেন্ড',
    child: 'চাইল্ড',
    baby: 'বেবি',
    school: 'স্কুল',
    teacher: 'টিচার',
    student: 'স্টুডেন্ট',
    book: 'বুক',
    pen: 'পেন',
    pencil: 'পেন্সিল',
    paper: 'পেপার',
    desk: 'ডেস্ক',
    chair: 'চেয়ার',
    table: 'টেবিল',
    class: 'ক্লাস',
    exam: 'এক্সাম',
    office: 'অফিস',
    boss: 'বস',
    manager: 'ম্যানেজার',
    employee: 'এমপ্লয়ী',
    job: 'জব',
    work: 'ওয়ার্ক',
    salary: 'স্যালারি',
    meeting: 'মিটিং',
    email: 'ইমেইল',
    doctor: 'ডক্টর',
    nurse: 'নার্স',
    hospital: 'হাসপাতাল',
    medicine: 'মেডিসিন',
    fever: 'ফিভার',
    cough: 'কাফ',
    pain: 'পেইন',
    health: 'হেলথ',
    car: 'কার',
    bus: 'বাস',
    train: 'ট্রেন',
    plane: 'প্লেন',
    ticket: 'টিকিট',
    travel: 'ট্রাভেল',
    road: 'রোড',
    street: 'স্ট্রিট',
    hotel: 'হোটেল',
    home: 'হোম',
    house: 'হাউস',
    room: 'রুম',
    door: 'ডোর',
    window: 'উইন্ডো',
    bed: 'বেড',
    light: 'লাইট',
    key: 'কি',
    lock: 'লক',
    shop: 'শপ',
    market: 'মার্কেট',
    buy: 'বাই',
    sell: 'সেল',
    money: 'মানি',
    price: 'প্রাইস',
    cost: 'কস্ট',
    phone: 'ফোন',
    mobile: 'মোবাইল',
    computer: 'কম্পিউটার',
    internet: 'ইন্টারনেট',
    screen: 'স্ক্রিন',
    app: 'অ্যাপ',
    tree: 'ট্রি',
    flower: 'ফ্লাওয়ার',
    plant: 'প্ল্যান্ট',
    leaf: 'লিফ',
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
    hate: 'হেট',
    smile: 'স্মাইল',
    fear: 'ফিয়ার',
    head: 'হেড',
    eye: 'আই',
    ear: 'ইয়ার',
    nose: 'নোজ',
    mouth: 'মাউথ',
    hand: 'হ্যান্ড',
    leg: 'লেগ',
    foot: 'ফুট',
    shirt: 'শার্ট',
    pants: 'প্যান্টস',
    dress: 'ড্রেস',
    shoes: 'শুজ',
    socks: 'সক্স',
    hat: 'হ্যাট',
    time: 'টাইম',
    hour: 'আওয়ার',
    minute: 'মিনিট',
    day: 'ডে',
    night: 'নাইট',
    week: 'উইক',
    month: 'মান্থ',
    year: 'ইয়ার',
    weather: 'ওয়েদার',
    summer: 'সামার',
    winter: 'উইন্টার',
    spring: 'স্প্রিং',
    dog: 'ডগ',
    cat: 'ক্যাট',
    bird: 'বার্ড',
    cow: 'কাউ',
    horse: 'হর্স',
    lion: 'লায়ন',
    tiger: 'টাইগার',
    game: 'গেম',
    sport: 'স্পোর্ট',
    ball: 'বল',
    football: 'ফুটবল',
    cricket: 'ক্রিকেট',
    city: 'সিটি',
    town: 'টাউন',
    village: 'ভিলেজ'
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

// Generate vocabulary lists per domain
const rawData = [
  // FOOD
  { english: 'apple', pos: 'Noun', bn: 'আপেল', enDef: 'A round fruit with red or green skin and sweet flesh.', exEn: 'I eat an apple every morning.', exBn: 'আমি প্রতিদিন সকালে একটি আপেল খাই।', syn: ['fruit', 'pome'], ant: [], cat: 'Food' },
  { english: 'banana', pos: 'Noun', bn: 'কলা', enDef: 'A long curved yellow fruit.', exEn: 'Monkeys love to eat bananas.', exBn: 'বাঁদররা কলা খেতে খুব পছন্দ করে।', syn: ['fruit'], ant: [], cat: 'Food' },
  { english: 'orange', pos: 'Noun', bn: 'কমলালেবু', enDef: 'A round citrus fruit with orange skin.', exEn: 'Orange juice is rich in Vitamin C.', exBn: 'কমলালেবুর রস ভিটামিন সি তে সমৃদ্ধ।', syn: ['citrus'], ant: [], cat: 'Food' },
  { english: 'mango', pos: 'Noun', bn: 'আম', enDef: 'A sweet tropical fruit with yellow flesh.', exEn: 'Mango is the king of fruits in Bangladesh.', exBn: 'বাংলাদেশে আম হলো ফলের রাজা।', syn: ['fruit'], ant: [], cat: 'Food' },
  { english: 'water', pos: 'Noun', bn: 'পানি / জল', enDef: 'A clear liquid essential for all living things.', exEn: 'Drink plenty of water every day.', exBn: 'প্রতিদিন প্রচুর পানি পান করুন।', syn: ['aqua', 'fluid'], ant: [], cat: 'Food' },
  { english: 'rice', pos: 'Noun', bn: 'চাল / ভাত', enDef: 'Grains used as a staple food in Asia.', exEn: 'We eat rice for lunch.', exBn: 'আমরা দুপুরে ভাত খাই।', syn: ['grain', 'paddy'], ant: [], cat: 'Food' },
  { english: 'bread', pos: 'Noun', bn: 'রুটি', enDef: 'A baked food made from flour and water.', exEn: 'He had toast and jam for breakfast.', exBn: 'সে সকালে টোস্ট রুটি এবং জ্যাম খেয়েছিল।', syn: ['loaf', 'bakery'], ant: [], cat: 'Food' },
  { english: 'milk', pos: 'Noun', bn: 'দুধ', enDef: 'A white liquid produced by cows or goats.', exEn: 'Milk is good for bone health.', exBn: 'দুধ হাড়ের স্বাস্থ্যের জন্য ভালো।', syn: ['dairy'], ant: [], cat: 'Food' },
  { english: 'tea', pos: 'Noun', bn: 'চা', enDef: 'A hot drink made by infusing dried tea leaves.', exEn: 'A hot cup of tea refreshes the mind.', exBn: 'এক কাপ গরম চা মন তাজা করে তোলে।', syn: ['brew', 'beverage'], ant: [], cat: 'Food' },
  { english: 'coffee', pos: 'Noun', bn: 'কফি', enDef: 'A hot dark drink made from roasted coffee beans.', exEn: 'I start my day with black coffee.', exBn: 'আমি ব্ল্যাক কফি দিয়ে আমার দিন শুরু করি।', syn: ['espresso', 'brew'], ant: [], cat: 'Food' },
  { english: 'sugar', pos: 'Noun', bn: 'চিনি', enDef: 'A sweet substance used in drinks and food.', exEn: 'Add a spoon of sugar to the tea.', exBn: 'চায়ে এক চামচ চিনি দিন।', syn: ['sweetener'], ant: [], cat: 'Food' },
  { english: 'salt', pos: 'Noun', bn: 'লবণ', enDef: 'A white mineral used to flavor and preserve food.', exEn: 'This curry needs a little more salt.', exBn: 'এই তরকারিতে আর একটু লবণ লাগবে।', syn: ['seasoning'], ant: [], cat: 'Food' },
  { english: 'fish', pos: 'Noun', bn: 'মাছ', enDef: 'A limbless cold-blooded animal living in water.', exEn: 'Fresh fish is a healthy meal.', exBn: 'তাজা মাছ একটি স্বাস্থ্যকর খাবার।', syn: ['seafood'], ant: [], cat: 'Food' },
  { english: 'meat', pos: 'Noun', bn: 'মাংস', enDef: 'The flesh of animals used as food.', exEn: 'They served cooked meat at dinner.', exBn: 'তারা নৈশভোজে রান্না করা মাংস পরিবেশন করেছিল।', syn: ['flesh'], ant: [], cat: 'Food' },
  { english: 'chicken', pos: 'Noun', bn: 'মুরগির মাংস / মুরগি', enDef: 'A domestic fowl raised for meat and eggs.', exEn: 'Grilled chicken tastes delicious.', exBn: 'গ্রিল করা মুরগির মাংস খুব সুস্বাদু।', syn: ['poultry'], ant: [], cat: 'Food' },
  { english: 'egg', pos: 'Noun', bn: 'ডিম', enDef: 'An oval object produced by female birds.', exEn: 'Boiled eggs are full of protein.', exBn: 'সিদ্ধ ডিম প্রোটিনে ভরপুর।', syn: ['oval'], ant: [], cat: 'Food' },
  { english: 'butter', pos: 'Noun', bn: 'মাখন', enDef: 'A yellow dairy product made from milk fat.', exEn: 'Spread butter on the warm bread.', exBn: 'গরম রুটির ওপর মাখন মাখিয়ে নিন।', syn: ['spread'], ant: [], cat: 'Food' },
  { english: 'cheese', pos: 'Noun', bn: 'পনির', enDef: 'A food made from pressed milk curds.', exEn: 'Pizza tastes great with extra cheese.', exBn: 'বাড়তি পনির দিলে পিজ্জা বেশি সুস্বাদু লাগে।', syn: ['dairy'], ant: [], cat: 'Food' },
  { english: 'soup', pos: 'Noun', bn: 'সুপ', enDef: 'A liquid dish made by boiling vegetables or meat.', exEn: 'Hot chicken soup is comforting in cold weather.', exBn: 'ঠান্ডা আবহাওয়ায় গরম চিকেন সুপ বেশ আরামদায়ক।', syn: ['broth'], ant: [], cat: 'Food' },
  { english: 'salad', pos: 'Noun', bn: 'স্যালাড', enDef: 'A mixture of fresh raw vegetables.', exEn: 'Cucumber and tomato salad is very healthy.', exBn: 'শসা ও টমেটোর স্যালাড খুবই স্বাস্থ্যকর।', syn: ['greens'], ant: [], cat: 'Food' },
  { english: 'cake', pos: 'Noun', bn: 'কেক', enDef: 'A sweet baked dessert dish.', exEn: 'We cut a cake on his birthday.', exBn: 'আমরা তার জন্মদিনে কেক কেটেছিলাম।', syn: ['pastry', 'dessert'], ant: [], cat: 'Food' },
  { english: 'juice', pos: 'Noun', bn: 'রস / জুস', enDef: 'Liquid extracted from fruit or vegetables.', exEn: 'Fresh mango juice is refreshing.', exBn: 'তাজা আমের রস সতেজতাদায়ক।', syn: ['drink', 'extract'], ant: [], cat: 'Food' },
  { english: 'delicious', pos: 'Adjective', bn: 'সুস্বাদু / মজাদার', enDef: 'Highly pleasant to taste.', exEn: 'My mother cooked a delicious dinner.', exBn: 'আমার মা এক সুস্বাদু নৈশভোজ রান্না করেছিলেন।', syn: ['tasty', 'yummy', 'flavorful'], ant: ['tasteless', 'foul'], cat: 'Food' },
  { english: 'sweet', pos: 'Adjective', bn: 'মিষ্টি', enDef: 'Having the pleasant taste of sugar.', exEn: 'Honey is naturally sweet.', exBn: 'মধু প্রাকৃতিকভাবেই মিষ্টি।', syn: ['sugary', 'honeyed'], ant: ['bitter', 'sour'], cat: 'Food' },
  { english: 'sour', pos: 'Adjective', bn: 'টক', enDef: 'Having an acid taste like lemon.', exEn: 'Lemons have a sour taste.', exBn: 'লেবুর স্বাদ টক।', syn: ['acidic', 'tart'], ant: ['sweet'], cat: 'Food' },
  { english: 'bitter', pos: 'Adjective', bn: 'তিতা / তিক্ত', enDef: 'Having a sharp, pungent taste.', exEn: 'Medicine often tastes bitter.', exBn: 'ওষুধের স্বাদ প্রায়শই তিতা হয়।', syn: ['sharp', 'harsh'], ant: ['sweet'], cat: 'Food' },
  { english: 'spicy', pos: 'Adjective', bn: 'ঝাল / মসলাযুক্ত', enDef: 'Flavored with strong spices.', exEn: 'Traditional curry is warm and spicy.', exBn: 'ঐতিহ্যবাহী তরকারি ঝাল ও মসলাযুক্ত হয়।', syn: ['hot', 'seasoned'], ant: ['mild', 'bland'], cat: 'Food' },
  { english: 'cook', pos: 'Verb', bn: 'রান্না করা', enDef: 'Prepare food by combining and heating ingredients.', exEn: 'She loves to cook for her family.', exBn: 'সে তার পরিবারের জন্য রান্না করতে ভালোবাসে।', syn: ['prepare', 'bake', 'roast'], ant: [], cat: 'Food' },
  { english: 'eat', pos: 'Verb', bn: 'খাওয়া', enDef: 'Put food into the mouth and swallow it.', exEn: 'Always eat healthy meals.', exBn: 'সবসময় স্বাস্থ্যকর খাবার খান।', syn: ['consume', 'dine'], ant: ['fast'], cat: 'Food' },
  { english: 'drink', pos: 'Verb', bn: 'পান করা', enDef: 'Take liquid into the mouth and swallow.', exEn: 'Drink eight glasses of water daily.', exBn: 'প্রতিদিন আট গ্লাস পানি পান করুন।', syn: ['sip', 'swallow'], ant: [], cat: 'Food' },

  // FAMILY
  { english: 'father', pos: 'Noun', bn: 'বাবা / পিতা', enDef: 'A male parent.', exEn: 'My father works hard for our family.', exBn: 'আমার বাবা আমাদের পরিবারের জন্য কঠোর পরিশ্রম করেন।', syn: ['dad', 'pappa', 'parent'], ant: ['mother'], cat: 'Family' },
  { english: 'mother', pos: 'Noun', bn: 'মা / মাতা', enDef: 'A female parent.', exEn: 'Mother gives unconditional love.', exBn: 'মা নিঃশর্ত ভালোবাসা দেন।', syn: ['mom', 'mummy', 'parent'], ant: ['father'], cat: 'Family' },
  { english: 'brother', pos: 'Noun', bn: 'ভাই', enDef: 'A male sibling.', exEn: 'My elder brother helps me with study.', exBn: 'আমার বড় ভাই আমাকে পড়াশোনায় সাহায্য করেন।', syn: ['sibling'], ant: ['sister'], cat: 'Family' },
  { english: 'sister', pos: 'Noun', bn: 'বোন', enDef: 'A female sibling.', exEn: 'My sister is learning drawing.', exBn: 'আমার বোন আঁকা শিখছে।', syn: ['sibling'], ant: ['brother'], cat: 'Family' },
  { english: 'grandfather', pos: 'Noun', bn: 'দাদা / নানা', enDef: 'The father of one’s parent.', exEn: 'My grandfather tells wonderful stories.', exBn: 'আমার দাদা খুব সুন্দর গল্প বলেন।', syn: ['grandpa'], ant: ['grandmother'], cat: 'Family' },
  { english: 'grandmother', pos: 'Noun', bn: 'দাদি / নানি', enDef: 'The mother of one’s parent.', exEn: 'Grandmother cooks delicious sweets.', exBn: 'নানি খুব মজার মিষ্টি বানান।', syn: ['grandma'], ant: ['grandfather'], cat: 'Family' },
  { english: 'uncle', pos: 'Noun', bn: 'চাচা / মামা / ফুফা', enDef: 'The brother of one’s parent.', exEn: 'My uncle brought gifts for us.', exBn: 'আমার মামা আমাদের জন্য উপহার এনেছিলেন।', syn: ['relative'], ant: ['aunt'], cat: 'Family' },
  { english: 'aunt', pos: 'Noun', bn: 'চাচি / মামি / ফুফু / খালা', enDef: 'The sister or sister-in-law of one’s parent.', exEn: 'Aunt Salma baked chocolate cookies.', exBn: 'খালা সালমা চকোলেট কুকিজ বানিয়েছিলেন।', syn: ['relative'], ant: ['uncle'], cat: 'Family' },
  { english: 'cousin', pos: 'Noun', bn: 'চাচাতো / মামাতো ভাই-বোন', enDef: 'A child of one’s uncle or aunt.', exEn: 'We played games with our cousins.', exBn: 'আমরা আমাদের ভাইবোনদের সাথে খেলা করেছিলাম।', syn: ['relative'], ant: [], cat: 'Family' },
  { english: 'son', pos: 'Noun', bn: 'ছেলে / পুত্র', enDef: 'A male child.', exEn: 'Their son is studying engineering.', exBn: 'তাদের ছেলে প্রকৌশল নিয়ে পড়ছে।', syn: ['boy', 'child'], ant: ['daughter'], cat: 'Family' },
  { english: 'daughter', pos: 'Noun', bn: 'মেয়ে / কন্যা', enDef: 'A female child.', exEn: 'Her daughter won the art contest.', exBn: 'তার মেয়ে চিত্রাঙ্কন প্রতিযোগিতায় জিতেছে।', syn: ['girl', 'child'], ant: ['son'], cat: 'Family' },
  { english: 'husband', pos: 'Noun', bn: 'স্বামী', enDef: 'A married man in relation to his spouse.', exEn: 'They live happily as husband and wife.', exBn: 'তারা স্বামী-স্ত্রী হিসেবে সুখে বাস করছে।', syn: ['spouse', 'partner'], ant: ['wife'], cat: 'Family' },
  { english: 'wife', pos: 'Noun', bn: 'স্ত্রী', enDef: 'A married woman in relation to her spouse.', exEn: 'His wife is a talented school teacher.', exBn: 'তার স্ত্রী একজন প্রতিভাবান শিক্ষিকা।', syn: ['spouse', 'partner'], ant: ['husband'], cat: 'Family' },
  { english: 'friend', pos: 'Noun', bn: 'বন্ধু', enDef: 'A person with whom one has a bond of mutual affection.', exEn: 'A true friend is a priceless treasure.', exBn: 'প্রকৃত বন্ধু এক অমূল্য ধন।', syn: ['companion', 'buddy', 'pal'], ant: ['enemy', 'stranger'], cat: 'Family' },
  { english: 'child', pos: 'Noun', bn: 'শিশু / সন্তান', enDef: 'A young human being.', exEn: 'Every child deserves love and education.', exBn: 'প্রতিটি শিশু ভালোবাসা ও শিক্ষার অধিকার রাখে।', syn: ['kid', 'baby', 'toddler'], ant: ['adult'], cat: 'Family' },
  { english: 'baby', pos: 'Noun', bn: 'শিশুকন্যা / শিশুপুত্র', enDef: 'A very young child or infant.', exEn: 'The baby sleeping quietly in the crib.', exBn: 'শিশুটি দোলনায় শান্তভাবে ঘুমাচ্ছে।', syn: ['infant', 'newborn'], ant: ['adult'], cat: 'Family' },
  { english: 'relative', pos: 'Noun', bn: 'আত্মীয়', enDef: 'A person connected by blood or marriage.', exEn: 'All our relatives gathered for Eid.', exBn: 'ঈদে আমাদের সব আত্মীয়স্বজন জড়ো হয়েছিলেন।', syn: ['kin', 'family'], ant: ['stranger'], cat: 'Family' },

  // SCHOOL & EDUCATION
  { english: 'school', pos: 'Noun', bn: 'বিদ্যালয় / স্কুল', enDef: 'An institution for educating children.', exEn: 'Children go to school every morning.', exBn: 'শিশুরা প্রতিদিন সকালে স্কুলে যায়।', syn: ['academy', 'institution'], ant: [], cat: 'School' },
  { english: 'teacher', pos: 'Noun', bn: 'শিক্ষক / শিক্ষিকা', enDef: 'A person who teaches students.', exEn: 'Our English teacher explains clearly.', exBn: 'আমাদের ইংরেজি শিক্ষক খুব স্পষ্টভাবে ব্যাখ্যা করেন।', syn: ['educator', 'instructor', 'tutor'], ant: ['student'], cat: 'School' },
  { english: 'student', pos: 'Noun', bn: 'ছাত্র / ছাত্রী', enDef: 'A person who is studying at school or college.', exEn: 'She is a brilliant medical student.', exBn: 'সে একজন মেধাবী মেডিকেল ছাত্রী।', syn: ['learner', 'pupil'], ant: ['teacher'], cat: 'School' },
  { english: 'book', pos: 'Noun', bn: 'বই / পুস্তক', enDef: 'A written or printed work consisting of pages bound together.', exEn: 'Reading books expands knowledge.', exBn: 'বই পড়া জ্ঞানের পরিধি বাড়ায়।', syn: ['volume', 'textbook'], ant: [], cat: 'School' },
  { english: 'pen', pos: 'Noun', bn: 'কলম', enDef: 'An instrument for writing with ink.', exEn: 'Please write your name with a pen.', exBn: 'অনুগ্রহ করে আপনার নাম কলম দিয়ে লিখুন।', syn: ['ballpoint'], ant: [], cat: 'School' },
  { english: 'pencil', pos: 'Noun', bn: 'পেন্সিল', enDef: 'An instrument for writing or drawing with graphite.', exEn: 'Draw the diagram using a sharp pencil.', exBn: 'একটি চোখা পেন্সিল দিয়ে ডায়াগ্রামটি আঁকুন।', syn: ['graphite'], ant: [], cat: 'School' },
  { english: 'paper', pos: 'Noun', bn: 'কাগজ', enDef: 'Material manufactured in thin sheets for writing or packing.', exEn: 'Write your answer on a white paper.', exBn: 'একটি সাদা কাগজে আপনার উত্তর লিখুন।', syn: ['sheet', 'page'], ant: [], cat: 'School' },
  { english: 'desk', pos: 'Noun', bn: 'ডেস্ক / পড়ার টেবিল', enDef: 'A furniture table used for studying or office work.', exEn: 'Keep your notebook on the desk.', exBn: 'আপনার খাতাটি ডেস্কে রাখুন।', syn: ['table', 'counter'], ant: [], cat: 'School' },
  { english: 'chair', pos: 'Noun', bn: 'চেয়ার / কেদারা', enDef: 'A seat for one person.', exEn: 'Sit comfortably on the chair.', exBn: 'চেয়ারে আরামে বসুন।', syn: ['seat'], ant: [], cat: 'School' },
  { english: 'exam', pos: 'Noun', bn: 'পরীক্ষা', enDef: 'A formal test of knowledge or ability.', exEn: 'She prepared well for the final exam.', exBn: 'সে চূড়ান্ত পরীক্ষার জন্য ভালো প্রস্তুতি নিয়েছিল।', syn: ['test', 'examination'], ant: [], cat: 'School' },
  { english: 'study', pos: 'Verb', bn: 'পড়াশোনা করা', enDef: 'Devote time and attention to acquiring knowledge.', exEn: 'Students study hard before exams.', exBn: 'ছাত্রছাত্রীরা পরীক্ষার আগে কঠোর পড়াশোনা করে।', syn: ['learn', 'read'], ant: [], cat: 'School' },
  { english: 'learn', pos: 'Verb', bn: 'শেখা / শিক্ষা লাভ করা', enDef: 'Gain knowledge or skill by study or experience.', exEn: 'It is fun to learn a new language.', exBn: 'নতুন ভাষা শেখা বেশ আনন্দের।', syn: ['acquire', 'master'], ant: ['forget'], cat: 'School' },
  { english: 'write', pos: 'Verb', bn: 'লেখা', enDef: 'Mark letters or words on a surface with a pen.', exEn: 'Write a short summary in English.', exBn: 'ইংরেজিতে একটি ছোট সারসংক্ষেপ লিখুন।', syn: ['compose', 'draft'], ant: ['read'], cat: 'School' },
  { english: 'read', pos: 'Verb', bn: 'পড়া', enDef: 'Look at and comprehend written words.', exEn: 'Read a newspaper article daily.', exBn: 'প্রতিদিন পত্রিকার একটি নিবন্ধ পড়ুন।', syn: ['scan', 'peruse'], ant: ['write'], cat: 'School' },

  // OFFICE & WORK
  { english: 'office', pos: 'Noun', bn: 'কার্যালয় / অফিস', enDef: 'A room or building used for commercial or professional work.', exEn: 'He arrives at the office at 9 AM.', exBn: 'সে সকাল ৯ টায় অফিসে পৌঁছায়।', syn: ['workplace', 'bureau'], ant: [], cat: 'Office' },
  { english: 'boss', pos: 'Noun', bn: 'প্রধান / বস', enDef: 'A person who is in charge of a worker or organization.', exEn: 'The boss approved the new project.', exBn: 'বস নতুন প্রকল্পটি অনুমোদন দিয়েছেন।', syn: ['manager', 'head', 'supervisor'], ant: ['subordinate'], cat: 'Office' },
  { english: 'manager', pos: 'Noun', bn: 'ব্যবস্থাপক / ম্যানেজার', enDef: 'A person responsible for controlling an organization or team.', exEn: 'The manager organized an urgent team meeting.', exBn: 'ম্যানেজার একটি জরুরি দলগত সভা আয়োজন করেছিলেন।', syn: ['director', 'administrator'], ant: [], cat: 'Office' },
  { english: 'employee', pos: 'Noun', bn: 'কর্মচারী / কর্মী', enDef: 'A person employed for wages or salary.', exEn: 'Every employee received an annual performance bonus.', exBn: 'প্রতিটি কর্মচারী বার্ষিক পারফরম্যান্স বোনাস পেয়েছেন।', syn: ['worker', 'staff'], ant: ['employer'], cat: 'Office' },
  { english: 'work', pos: 'Noun', bn: 'কাজ / শ্রম', enDef: 'Activity involving mental or physical effort.', exEn: 'Hard work brings long-term success.', exBn: 'কঠোর পরিশ্রম দীর্ঘমেয়াদী সাফল্য আনে।', syn: ['job', 'labor', 'task'], ant: ['rest', 'play'], cat: 'Office' },
  { english: 'job', pos: 'Noun', bn: 'চাকরি / পেশা', enDef: 'A paid position of regular employment.', exEn: 'She got a job as a software engineer.', exBn: 'সে সফটওয়্যার প্রকৌশলী হিসেবে চাকরি পেয়েছে।', syn: ['post', 'position', 'career'], ant: [], cat: 'Office' },
  { english: 'salary', pos: 'Noun', bn: 'বেতন', enDef: 'A fixed regular payment made by an employer.', exEn: 'Salaries are credited on the first day of the month.', exBn: 'মাসের প্রথম দিনেই বেতন জমা হয়।', syn: ['pay', 'wages', 'remuneration'], ant: [], cat: 'Office' },
  { english: 'meeting', pos: 'Noun', bn: 'সভা / মিটিং', enDef: 'An assembly of people for discussion.', exEn: 'We discussed budget planning in the meeting.', exBn: 'আমরা মিটিংয়ে বাজেট পরিকল্পনা নিয়ে আলোচনা করেছি।', syn: ['conference', 'assembly'], ant: [], cat: 'Office' },

  // HEALTH
  { english: 'doctor', pos: 'Noun', bn: 'চিকিৎসক / ডাক্তার', enDef: 'A qualified practitioner of medicine.', exEn: 'Consult a doctor if your fever persists.', exBn: 'জ্বর বজায় থাকলে একজন ডাক্তারের পরামর্শ নিন।', syn: ['physician', 'clinician'], ant: ['patient'], cat: 'Health' },
  { english: 'nurse', pos: 'Noun', bn: 'সেবিকা / নার্স', enDef: 'A person trained to care for the sick or infirm.', exEn: 'The nurse checked the patient blood pressure.', exBn: 'নার্স রোগীর রক্তচাপ পরীক্ষা করলেন।', syn: ['caregiver'], ant: [], cat: 'Health' },
  { english: 'hospital', pos: 'Noun', bn: 'হাসপাতাল', enDef: 'An institution providing medical treatment.', exEn: 'They rushed the injured person to the hospital.', exBn: 'তারা আহত ব্যক্তিকে হাসপাতালে নিয়ে যায়।', syn: ['clinic', 'infirmary'], ant: [], cat: 'Health' },
  { english: 'medicine', pos: 'Noun', bn: 'ওষুধ / ভেষজ', enDef: 'A drug or substance used to treat illness.', exEn: 'Take this medicine after lunch.', exBn: 'দুপুরের খাবারের পর এই ওষুধটি খাবেন।', syn: ['drug', 'remedy', 'cure'], ant: [], cat: 'Health' },
  { english: 'health', pos: 'Noun', bn: 'স্বাস্থ্য', enDef: 'The state of being free from illness or injury.', exEn: 'Health is the greatest wealth.', exBn: 'স্বাস্থ্যই সকল সুখের মূল।', syn: ['wellness', 'fitness'], ant: ['sickness'], cat: 'Health' },

  // TECHNOLOGY
  { english: 'computer', pos: 'Noun', bn: 'কম্পিউটার', enDef: 'An electronic device for storing and processing data.', exEn: 'I use a computer for my daily programming work.', exBn: 'আমি আমার দৈনন্দিন প্রোগ্রামিং কাজের জন্য কম্পিউটার ব্যবহার করি।', syn: ['pc', 'laptop'], ant: [], cat: 'Technology' },
  { english: 'phone', pos: 'Noun', bn: 'ফোন / দূরভাষ', enDef: 'A device for telecommunication.', exEn: 'Give me a call on my phone.', exBn: 'আমার ফোনে একটি কল দিন।', syn: ['telephone', 'mobile'], ant: [], cat: 'Technology' },
  { english: 'internet', pos: 'Noun', bn: 'ইন্টারনেট / তথ্যপ্রযুক্তি নেটওয়ার্ক', enDef: 'A global computer network providing information.', exEn: 'The internet connects people all over the world.', exBn: 'ইন্টারনেট সারা বিশ্বের মানুষকে সংযুক্ত করে।', syn: ['web', 'net'], ant: [], cat: 'Technology' },

  // TIME & WEATHER
  { english: 'time', pos: 'Noun', bn: 'সময়', enDef: 'The ongoing sequence of events in past, present, and future.', exEn: 'Time and tide wait for none.', exBn: 'সময় ও নদীর স্রোত কারও জন্য অপেক্ষা করে না।', syn: ['duration', 'period'], ant: [], cat: 'Time' },
  { english: 'day', pos: 'Noun', bn: 'দিন', enDef: 'A period of 24 hours or daytime hours.', exEn: 'Have a bright and peaceful day.', exBn: 'আপনার দিনটি সুন্দর ও শান্তিময় কাটুক।', syn: ['daytime'], ant: ['night'], cat: 'Time' },
  { english: 'night', pos: 'Noun', bn: 'রাত', enDef: 'The period of darkness in each 24 hours.', exEn: 'The night sky is filled with shining stars.', exBn: 'রাতের আকাশ উজ্জ্বল তারায় ভরা।', syn: ['darkness'], ant: ['day'], cat: 'Time' },
  { english: 'weather', pos: 'Noun', bn: 'আবহাওয়া', enDef: 'The state of the atmosphere at a place and time.', exEn: 'The weather today is warm and sunny.', exBn: 'আজকের আবহাওয়া বেশ গরম ও রৌদ্রোজ্জ্বল।', syn: ['climate'], ant: [], cat: 'Weather' }
];

console.log('Base datasets prepared.');
