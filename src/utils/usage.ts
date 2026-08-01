export interface WordUsageExample {
  context: string;
  english: string;
  bengali: string;
}

export interface WordUsageData {
  usageNotes?: string;
  collocations?: string[];
  examples: WordUsageExample[];
}

export function generateOfflineUsageData(
  word: string,
  meaning: string,
  partOfSpeech: string,
  existingExample?: string,
  existingExampleBn?: string
): WordUsageData {
  const w = word.trim().toLowerCase();
  const pos = (partOfSpeech || 'noun').toLowerCase();

  // Curated collocations and offline examples for common words
  const collocationsMap: Record<string, { notes: string; collocations: string[]; examples: WordUsageExample[] }> = {
    house: {
      notes: "‘House’ সাধারণত মানুষের বসবাসের স্থায়ী গৃহ বা ভবন নির্দেশ করতে ব্যবহৃত হয়।",
      collocations: [
        "Move house (বাড়ি পরিবর্তন করা)",
        "House rules (বাড়ির নিয়মকানুন)",
        "In-house training (আভ্যন্তরীণ প্রশিক্ষণ)",
        "Housewarming party (গৃহপ্রবেশ অনুষ্ঠান)"
      ],
      examples: [
        {
          context: "দৈনন্দিন কথোপকথন (Daily Conversation)",
          english: "We decided to stay inside the house during the heavy rainfall.",
          bengali: "মুষলধারে বৃষ্টির সময় আমরা ঘরের ভেতরে থাকার সিদ্ধান্ত নিয়েছিলাম।"
        },
        {
          context: "প্রফেশনাল ব্যবহার (Professional Usage)",
          english: "The company handles all software development in-house.",
          bengali: "কোম্পানিটি সমস্ত সফটওয়্যার ডেভেলপমেন্ট প্রতিষ্ঠানের নিজস্ব টিমে সম্পন্ন করে।"
        }
      ]
    },
    love: {
      notes: "‘Love’ শব্দটি বিশেষ্য (Noun) এবং ক্রিয়া (Verb) উভয় হিসেবেই ব্যাপকভাবে ব্যবহৃত হয়।",
      collocations: [
        "Fall in love (প্রেমে পড়া)",
        "Unconditional love (শর্তহীন ভালোবাসা)",
        "Love at first sight (প্রথম দর্শনে প্রেম)",
        "Send my love (আমার ভালোবাসা পৌছে দিও)"
      ],
      examples: [
        {
          context: "দৈনন্দিন ব্যবহার (Daily Conversation)",
          english: "She loves reading books in her free time.",
          bengali: "সে তার অবসর সময়ে বই পড়তে খুব ভালোবাসে।"
        },
        {
          context: "পারিবারিক ও সামাজিক (Family & Social)",
          english: "Parents show unconditional love for their children.",
          bengali: "বাবা-মা তাদের সন্তানদের প্রতি শর্তহীন ভালোবাসা প্রদর্শন করেন।"
        }
      ]
    },
    book: {
      notes: "‘Book’ বিশেষ্য ছাড়াও ‘বুক করা/সংরক্ষণ করা’ অর্থে ক্রিয়া পদ হিসেবে ব্যবহৃত হয়।",
      collocations: [
        "Book a ticket (টিকিট বুক করা)",
        "By the book (নিয়ম মেনে)",
        "Open book (উন্মুক্ত বা স্পষ্ট চরিত্র)",
        "Bookworm (বইয়ের পোকা)"
      ],
      examples: [
        {
          context: "বিশেষ্য হিসেবে ব্যবহার (Noun Usage)",
          english: "This book contains valuable insights into history.",
          bengali: "এই বইটিতে ইতিহাসের মূল্যবান তথ্য রয়েছে।"
        },
        {
          context: "ক্রিয়া হিসেবে ব্যবহার (Verb Usage)",
          english: "I need to book a flight for my upcoming trip.",
          bengali: "আমার আসন্ন ভ্রমণের জন্য একটি ফ্লাইট বুক করা দরকার।"
        }
      ]
    },
    water: {
      notes: "‘Water’ বিশেষ্য ছাড়াও গাছে পানি দেওয়া বা চোখে পানি আসার ক্ষেত্রে ব্যবহৃত হয়।",
      collocations: [
        "Boiled water (ফুটানো পানি)",
        "Mouth-watering (জিভে পানি আসার মতো সুস্বাদু)",
        "Water the plants (গাছে পানি দেওয়া)",
        "Deep water (সংকট বা বিপদের মধ্যে)"
      ],
      examples: [
        {
          context: "দৈনন্দিন স্বাস্থ্য (Daily Health)",
          english: "Drinking enough water daily keeps you hydrated and active.",
          bengali: "প্রতিদিন পর্যাপ্ত পানি পান আপনাকে সতেজ ও সক্রিয় রাখে।"
        },
        {
          context: "ক্রিয়াপদ হিসেবে ব্যবহার (Verb Usage)",
          english: "Don't forget to water the garden in the evening.",
          bengali: "সন্ধ্যায় বাগানে পানি দিতে ভুলবেন না।"
        }
      ]
    }
  };

  if (collocationsMap[w]) {
    return collocationsMap[w];
  }

  // Dynamic template based on POS
  const defaultCollocations: string[] = [
    `Use ${word} in context (${meaning}-এর প্রাসঙ্গিক ব্যবহার)`,
    `Common expression with ${word} (${word}-এর সাধারণ প্রয়োগ)`,
    `Proper phrasing of ${word} (সঠিক বাক্যরীতি)`
  ];

  const defaultExamples: WordUsageExample[] = [];

  if (existingExample) {
    defaultExamples.push({
      context: "মূল বাক্যে প্রয়োগ (Primary Example)",
      english: existingExample,
      bengali: existingExampleBn || meaning
    });
  }

  if (pos.includes('noun')) {
    defaultExamples.push({
      context: "দৈনন্দিন বাক্যে ব্যবহার (Daily Usage)",
      english: `Understanding the concept of ${word} helps in effective communication.`,
      bengali: `${meaning}-এর ধারণা বোঝা কার্যকর যোগাযোগের জন্য সহায়ক।`
    });
  } else if (pos.includes('verb')) {
    defaultExamples.push({
      context: "ক্রিয়াপদ হিসেবে প্রয়োগ (Action Usage)",
      english: `It is essential to ${word} with care and consistency.`,
      bengali: `যথাযথ মনোযোগ ও ধারাবাহিকতার সাথে এটি করা প্রয়োজন।`
    });
  } else if (pos.includes('adj')) {
    defaultExamples.push({
      context: "বিশেষণ হিসেবে প্রয়োগ (Descriptive Usage)",
      english: `He gave a very ${word} response during the discussion.`,
      bengali: `আলোচনার সময় সে একটি অত্যন্ত চমৎকার ও প্রাসঙ্গিক উত্তর দিয়েছিল।`
    });
  } else {
    defaultExamples.push({
      context: "সাধারণ বাক্যে প্রয়োগ (General Context)",
      english: `The word '${word}' is commonly used when discussing ${meaning}.`,
      bengali: `'${word}' শব্দটি সাধারণত ${meaning} সম্পর্কে আলোচনা করার সময় ব্যবহৃত হয়।`
    });
  }

  return {
    usageNotes: `'${word}' (${meaning}) শব্দটি সঠিকভাবে বাক্যে প্রয়োগ করার নিয়ম ও সাধারণ উদাহরণ।`,
    collocations: defaultCollocations,
    examples: defaultExamples
  };
}
