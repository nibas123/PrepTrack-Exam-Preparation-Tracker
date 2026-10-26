import { ExamQuestionItem, QuizQuestion } from '../models/database.types';

export interface HcaQuestionDef {
  topic: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// ============================================================================
// PART A: GENERAL ENGLISH (50 QUESTIONS) - HIGH COURT OF KERALA PATTERN
// ============================================================================

export const KERALA_HCA_ENGLISH_POOL: HcaQuestionDef[] = [
  // 1. Prepositions & Phrasal Verbs
  {
    topic: 'Prepositions',
    question: 'The accused was acquitted _____ all the charges leveled against him.',
    options: ['from', 'of', 'with', 'by'],
    correct: 1,
    explanation: 'The verb "acquit" is idiomatically followed by the preposition "of" (acquit of charges).'
  },
  {
    topic: 'Prepositions',
    question: 'Citizens are bound to abide _____ the constitution and orders of the High Court.',
    options: ['with', 'to', 'by', 'on'],
    correct: 2,
    explanation: 'The standard idiom is "abide by", meaning to accept or obey a rule or decision.'
  },
  {
    topic: 'Prepositions',
    question: 'He is senior _____ me in the judicial service by two years.',
    options: ['than', 'to', 'from', 'over'],
    correct: 1,
    explanation: 'Adjectives ending in "-ior" (senior, junior, superior, inferior, prior) take "to", not "than".'
  },
  {
    topic: 'Prepositions',
    question: 'The committee members could not agree _____ a common consensus.',
    options: ['upon', 'with', 'to', 'for'],
    correct: 0,
    explanation: 'One agrees "with" a person, agrees "to" a proposal, and agrees "upon/on" a topic or consensus.'
  },
  {
    topic: 'Phrasal Verbs',
    question: 'The judge decided to _____ the hearing until next Tuesday.',
    options: ['call off', 'put off', 'carry on', 'turn down'],
    correct: 1,
    explanation: '"Put off" means to postpone or defer to a later date.'
  },
  {
    topic: 'Phrasal Verbs',
    question: 'The Supreme Court struck _____ the controversial amendment as unconstitutional.',
    options: ['down', 'off', 'out', 'away'],
    correct: 0,
    explanation: '"Strike down" means to declare a law or regulation invalid and unenforceable.'
  },

  // 2. Idioms & Phrases
  {
    topic: 'Idioms & Phrases',
    question: 'What is the meaning of the legal idiom "Status Quo"?',
    options: [
      'The existing state of affairs',
      'A supreme decision of law',
      'An emergency declared by the executive',
      'The previous criminal record'
    ],
    correct: 0,
    explanation: '"Status quo" is a Latin term signifying the current or existing state of affairs.'
  },
  {
    topic: 'Idioms & Phrases',
    question: 'The government took the controversial bill with "a pinch of salt". This means they:',
    options: [
      'Accepted it with total approval',
      'Viewed it with skepticism and doubt',
      'Rejected it immediately',
      'Passed it unanimously'
    ],
    correct: 1,
    explanation: 'To take something "with a pinch of salt" means to view it with skepticism or not completely believe it.'
  },
  {
    topic: 'Idioms & Phrases',
    question: 'The defense counsel argued "at the eleventh hour" to stay the eviction. "At the eleventh hour" means:',
    options: [
      'At eleven o\'clock precisely',
      'At the last possible moment',
      'Early in the morning',
      'After the deadline expired'
    ],
    correct: 1,
    explanation: '"At the eleventh hour" means at the very last moment or just before it is too late.'
  },
  {
    topic: 'Idioms & Phrases',
    question: 'What is the meaning of "Pro Bono"?',
    options: [
      'For the public good without charge',
      'Against the law',
      'Under temporary bail',
      'A permanent court injunction'
    ],
    correct: 0,
    explanation: '"Pro bono publico" (shortened to pro bono) means legal work undertaken voluntarily and without payment as a public service.'
  },
  {
    topic: 'Idioms & Phrases',
    question: 'To "burn the midnight oil" means:',
    options: [
      'To waste valuable resources',
      'To work or study late into the night',
      'To ignite a legal controversy',
      'To complete an assignment carelessly'
    ],
    correct: 1,
    explanation: '"To burn the midnight oil" means to study or work hard late into the night.'
  },

  // 3. One-Word Substitutions & Legal Terms
  {
    topic: 'One-Word Substitution',
    question: 'A written statement confirmed by oath or affirmation, for use as evidence in court:',
    options: ['Affidavit', 'Subpoena', 'Deposition', 'Testament'],
    correct: 0,
    explanation: 'An "Affidavit" is a written statement confirmed by oath or affirmation for court use.'
  },
  {
    topic: 'One-Word Substitution',
    question: 'An official pardon granted by the head of state to people convicted of political offenses:',
    options: ['Amnesty', 'Parole', 'Probation', 'Absolution'],
    correct: 0,
    explanation: '"Amnesty" is an official pardon for political or state offenses granted by the sovereign authority.'
  },
  {
    topic: 'One-Word Substitution',
    question: 'A judicial writ requiring a person to appear in court under a penalty for failure:',
    options: ['Subpoena', 'Caveat', 'Injunction', 'Affidavit'],
    correct: 0,
    explanation: 'A "Subpoena" is a writ ordering a person to attend court to give testimony or produce documents.'
  },
  {
    topic: 'One-Word Substitution',
    question: 'One who has long experience in a particular field, profession, or office:',
    options: ['Veteran', 'Novice', 'Amateur', 'Pedant'],
    correct: 0,
    explanation: 'A "Veteran" is an experienced person who has spent a long time in a profession or activity.'
  },
  {
    topic: 'One-Word Substitution',
    question: 'A person who hates or distrusts humankind:',
    options: ['Misanthrope', 'Philanthropist', 'Altruist', 'Misogynist'],
    correct: 0,
    explanation: 'A "Misanthrope" is someone who dislikes or distrusts human nature or society.'
  },
  {
    topic: 'One-Word Substitution',
    question: 'A person whose profession is to represent clients in a court of law and give legal advice:',
    options: ['Advocate', 'Arbitrator', 'Notary', 'Bailiff'],
    correct: 0,
    explanation: 'An "Advocate" is a legally qualified professional entitled to represent clients before courts.'
  },
  {
    topic: 'One-Word Substitution',
    question: 'Incapable of being corrected, reformed, or redeemed:',
    options: ['Incorrigible', 'Infallible', 'Irrevocable', 'Invulnerable'],
    correct: 0,
    explanation: '"Incorrigible" refers to a person or tendency that cannot be corrected or changed.'
  },

  // 4. Synonyms & Antonyms
  {
    topic: 'Vocabulary',
    question: 'Select the SYNONYM of the word "EXONERATE":',
    options: ['Absolve', 'Accuse', 'Implicate', 'Condemn'],
    correct: 0,
    explanation: '"Exonerate" means to officially declare someone not guilty of a crime; its synonym is "Absolve".'
  },
  {
    topic: 'Vocabulary',
    question: 'Select the SYNONYM of the word "PLAUSIBLE":',
    options: ['Credible', 'Unlikely', 'Spurious', 'Bizarre'],
    correct: 0,
    explanation: '"Plausible" means seeming reasonable or probable; its synonym is "Credible".'
  },
  {
    topic: 'Vocabulary',
    question: 'Select the SYNONYM of the word "RESCIND":',
    options: ['Revoke', 'Validate', 'Endorse', 'Initiate'],
    correct: 0,
    explanation: '"Rescind" means to revoke, cancel, or repeal a law, contract, or decision.'
  },
  {
    topic: 'Vocabulary',
    question: 'Select the ANTONYM of the word "MITIGATE":',
    options: ['Aggravate', 'Alleviate', 'Assuage', 'Pacify'],
    correct: 0,
    explanation: '"Mitigate" means to make less severe. The opposite is "Aggravate" (to make more severe or worse).'
  },
  {
    topic: 'Vocabulary',
    question: 'Select the ANTONYM of the word "STRINGENT":',
    options: ['Lenient', 'Rigorous', 'Severe', 'Inflexible'],
    correct: 0,
    explanation: '"Stringent" means strict, precise, and exacting. Its antonym is "Lenient".'
  },
  {
    topic: 'Vocabulary',
    question: 'Select the ANTONYM of the word "REPUDIATE":',
    options: ['Acknowledge', 'Disown', 'Reject', 'Renounce'],
    correct: 0,
    explanation: '"Repudiate" means to refuse to accept or acknowledge. The antonym is "Acknowledge" or "Embrace".'
  },

  // 5. Subject-Verb Agreement & Grammar
  {
    topic: 'Subject-Verb Agreement',
    question: 'Neither the magistrate nor the clerks _____ present in the court hall.',
    options: ['was', 'were', 'is', 'has been'],
    correct: 1,
    explanation: 'In "neither... nor" sentences, the verb agrees with the subject closest to it ("clerks" is plural, hence "were").'
  },
  {
    topic: 'Subject-Verb Agreement',
    question: 'The Bench, accompanied by senior registrars, _____ inspected the premises.',
    options: ['has', 'have', 'were', 'are'],
    correct: 0,
    explanation: 'When a singular subject ("The Bench") is joined by phrases like "accompanied by" or "as well as", the verb remains singular ("has").'
  },
  {
    topic: 'Subject-Verb Agreement',
    question: 'Every one of the petitions filed yesterday _____ scrutinized by the registry.',
    options: ['was', 'were', 'have been', 'are'],
    correct: 0,
    explanation: '"Every one" is singular and takes a singular verb ("was").'
  },
  {
    topic: 'Subject-Verb Agreement',
    question: 'A majority of the jury _____ in favour of the applicant.',
    options: ['is', 'are', 'was', 'were'],
    correct: 3,
    explanation: 'When "majority of the jury" refers to the individual members acting distinctively, plural verb "were" is appropriate.'
  },

  // 6. Voice & Direct/Indirect Speech
  {
    topic: 'Voice',
    question: 'Choose the correct PASSIVE form: "The Chief Justice signed the warrant."',
    options: [
      'The warrant was signed by the Chief Justice.',
      'The warrant is signed by the Chief Justice.',
      'The warrant had been signed by the Chief Justice.',
      'The Chief Justice was being signed by the warrant.'
    ],
    correct: 0,
    explanation: 'Simple past active "signed" converts into passive "was signed".'
  },
  {
    topic: 'Voice',
    question: 'Choose the correct ACTIVE form: "The witness was cross-examined by the prosecutor."',
    options: [
      'The prosecutor cross-examined the witness.',
      'The prosecutor was cross-examining the witness.',
      'The prosecutor had cross-examined the witness.',
      'The prosecutor cross-examines the witness.'
    ],
    correct: 0,
    explanation: 'Passive "was cross-examined" changes to active simple past "cross-examined".'
  },
  {
    topic: 'Direct & Indirect Speech',
    question: 'The Judge said to the witness, "Are you telling the truth?" Change to indirect speech:',
    options: [
      'The Judge asked the witness whether he was telling the truth.',
      'The Judge told the witness that if he was telling the truth.',
      'The Judge asked the witness if you are telling the truth.',
      'The Judge ordered the witness to tell the truth.'
    ],
    correct: 0,
    explanation: 'Yes/No questions convert with "whether/if" and present continuous changes to past continuous ("was telling").'
  },
  {
    topic: 'Direct & Indirect Speech',
    question: 'The counsel said, "Truth always prevails." Change to indirect speech:',
    options: [
      'The counsel said that truth always prevails.',
      'The counsel said that truth always prevailed.',
      'The counsel said that truth will always prevail.',
      'The counsel said that truth had always prevailed.'
    ],
    correct: 0,
    explanation: 'Universal truths, proverbs, and scientific facts do not change tense in indirect speech.'
  },

  // 7. Error Spotting & Sentence Correction
  {
    topic: 'Error Spotting',
    question: 'Identify the segment containing an error: "Scarcely had the judge (A) / taken his seat (B) / than the advocate began shouting (C) / No error (D)"',
    options: ['A', 'B', 'C', 'D'],
    correct: 2,
    explanation: 'Correlative conjunction "Scarcely" is paired with "when" or "before", never with "than". Segment (C) should read "when the advocate began shouting".'
  },
  {
    topic: 'Error Spotting',
    question: 'Identify the segment containing an error: "If I was the Chief Justice (A) / I would expedite (B) / all pending criminal appeals (C) / No error (D)"',
    options: ['A', 'B', 'C', 'D'],
    correct: 0,
    explanation: 'In hypothetical subjunctive conditionals, "were" is used with singular subjects: "If I were the Chief Justice...".'
  },
  {
    topic: 'Error Spotting',
    question: 'Identify the segment with an error: "One must not violate (A) / his oath of office (B) / under any pressure (C) / No error (D)"',
    options: ['A', 'B', 'C', 'D'],
    correct: 1,
    explanation: 'Pronoun "one" should be followed by the possessive pronoun "one\'s", not "his". It should be "one\'s oath of office".'
  },
  {
    topic: 'Question Tags',
    question: 'Choose the correct question tag: "The High Court pronounced the judgment yesterday, _____?"',
    options: ["didn't it", "did it", "wasn't it", "isn't it"],
    correct: 0,
    explanation: 'Positive simple past sentence with institution as subject takes negative tag "didn\'t it?".'
  },
  {
    topic: 'Question Tags',
    question: 'Choose the correct question tag: "Let us review the evidence, _____?"',
    options: ['shall we', 'will you', 'should we', "can't we"],
    correct: 0,
    explanation: 'Imperative sentences starting with "Let us" or "Let\'s" take the question tag "shall we?".'
  },

  // 8. Vocabulary & Confusing Words
  {
    topic: 'Vocabulary',
    question: 'The Registrar granted him permission to ______ the records for review.',
    options: ['cite', 'site', 'sight', 'slight'],
    correct: 0,
    explanation: '"Cite" means to quote or refer to evidence as justification.'
  },
  {
    topic: 'Vocabulary',
    question: 'A formal charge or accusation of a serious crime is called an ______.',
    options: ['indictment', 'inditement', 'incitement', 'indictation'],
    correct: 0,
    explanation: 'The correct spelling and legal term is "Indictment" (pronounced in-dite-ment).'
  },
  {
    topic: 'Sentence Improvement',
    question: 'Select the best replacement for the underlined phrase: "He is having two houses in Kochi."',
    options: ['He has two houses', 'He was having two houses', 'He is possess of two houses', 'No improvement'],
    correct: 0,
    explanation: 'Verbs of possession like "have", "own", and "belong" are not used in continuous tenses for state of possession.'
  },
  {
    topic: 'Sentence Improvement',
    question: 'Select the best replacement: "The police prevented the suspects to enter the court compound."',
    options: [
      'from entering the court compound',
      'to entering the court compound',
      'not to enter the court compound',
      'No improvement'
    ],
    correct: 0,
    explanation: 'The verb "prevent" is followed by preposition "from" + gerund ("prevented from entering").'
  },
  {
    topic: 'Vocabulary',
    question: 'Which of the following words is correctly spelt?',
    options: ['Surveillance', 'Surveilance', 'Survalience', 'Surveillence'],
    correct: 0,
    explanation: 'The correct spelling is "Surveillance".'
  },
  {
    topic: 'Vocabulary',
    question: 'Which of the following words is correctly spelt?',
    options: ['Maintenance', 'Maintainance', 'Maintenence', 'Mentenance'],
    correct: 0,
    explanation: 'The correct spelling is "Maintenance".'
  },
  {
    topic: 'Vocabulary',
    question: 'Which of the following words is correctly spelt?',
    options: ['Jurisdiction', 'Juresdiction', 'Jurisdision', 'Jurissdiction'],
    correct: 0,
    explanation: 'The correct spelling is "Jurisdiction".'
  },
  {
    topic: 'Vocabulary',
    question: 'The decision taken by the bench was "UNANIMOUS". This means:',
    options: [
      'Agreed upon by everyone without dissent',
      'Decided by a narrow majority',
      'Taken in secret chambers',
      'Approved only by the senior-most judge'
    ],
    correct: 0,
    explanation: '"Unanimous" means fully agreed upon by all parties or judges involved.'
  },
  {
    topic: 'Reading Comprehension',
    question: 'In legal terminology, "Caveat Emptor" translates to:',
    options: [
      'Let the buyer beware',
      'In good faith',
      'By the fact itself',
      'Pending the suit'
    ],
    correct: 0,
    explanation: '"Caveat emptor" is the commercial doctrine that the buyer alone is responsible for checking the quality of goods before purchasing.'
  },
  {
    topic: 'Reading Comprehension',
    question: 'What is the term for intentional disobedience to or disregard of a court of law or its orders?',
    options: ['Contempt of Court', 'Perjury', 'Treason', 'Malfeasance'],
    correct: 0,
    explanation: '"Contempt of Court" is any act that disrespects or obstructs a court in the administration of justice.'
  },
  {
    topic: 'Reading Comprehension',
    question: 'The crime of willfully telling an untruth or making a misrepresentation under oath is known as:',
    options: ['Perjury', 'Forgery', 'Hearsay', 'Defamation'],
    correct: 0,
    explanation: '"Perjury" is the offense of willfully making a false statement after taking an oath to tell the truth in judicial proceedings.'
  },
  {
    topic: 'Vocabulary',
    question: 'Select the synonym for "INJUNCTION":',
    options: ['Restraining order', 'Commendation', 'Indemnity', 'Acquittal'],
    correct: 0,
    explanation: 'An "Injunction" is an authoritative warning or judicial restraining order prohibiting a party from carrying out a specific act.'
  },
  {
    topic: 'Vocabulary',
    question: 'Select the antonym for "LUCID":',
    options: ['Ambiguous', 'Clear', 'Transparent', 'Coherent'],
    correct: 0,
    explanation: '"Lucid" means clear and easy to understand; its antonym is "Ambiguous" (vague, uncertain).'
  },
  {
    topic: 'Prepositions',
    question: 'The Supreme Court is endowed _____ the power to review its own decisions.',
    options: ['with', 'in', 'at', 'by'],
    correct: 0,
    explanation: 'The standard preposition after "endowed" is "with" (endowed with).'
  },
  {
    topic: 'Prepositions',
    question: 'He was warned _____ indulging in fraudulent practices.',
    options: ['against', 'for', 'with', 'on'],
    correct: 0,
    explanation: 'One is warned "against" doing something harmful or prohibited.'
  }
];

// ============================================================================
// PART B: GENERAL KNOWLEDGE & CONSTITUTION (40 QUESTIONS) - HCA PATTERN
// ============================================================================

export const KERALA_HCA_GK_POOL: HcaQuestionDef[] = [
  // 1. Facts about Kerala & Renaissance (15 Questions)
  {
    topic: 'Kerala Renaissance',
    question: 'In which year did Sree Narayana Guru consecrate the Shiva idol at Aruvippuram, marking a historic moment in the Kerala social renaissance?',
    options: ['1888', '1893', '1903', '1924'],
    correct: 0,
    explanation: 'Sree Narayana Guru consecrated the Aruvippuram Shiva temple in 1888, defying existing upper-caste restrictions.'
  },
  {
    topic: 'Kerala Renaissance',
    question: 'Which social reformer organized the historic "Villuvandi Samaram" (Bullock Cart strike) in 1893 to assert the right of marginalized communities to use public roads?',
    options: ['Ayyankali', 'Chattampi Swamikal', 'Vakkom Moulavi', 'Sahodaran Ayyappan'],
    correct: 0,
    explanation: 'Mahatma Ayyankali rode a decorated bullock cart on the public roads of Venganoor in 1893, breaking social bans.'
  },
  {
    topic: 'Kerala Renaissance',
    question: 'Who authored the influential sociological work "Pracheena Malayalam", challenging traditional caste hierarchies and Vedic interpretations?',
    options: ['Chattampi Swamikal', 'Sree Narayana Guru', 'Kumaran Asan', 'Brahmananda Sivayogi'],
    correct: 0,
    explanation: '"Pracheena Malayalam" was written by Chattampi Swamikal, establishing the ancient rights and equality of the indigenous people of Kerala.'
  },
  {
    topic: 'Kerala Renaissance',
    question: 'The historic "Temple Entry Proclamation" which opened government-controlled temples in Travancore to all Hindus was issued by Sri Chithira Thirunal Balarama Varma on:',
    options: ['12 November 1936', '1 November 1956', '15 August 1947', '26 January 1950'],
    correct: 0,
    explanation: 'The Temple Entry Proclamation was issued on 12 November 1936 by the Maharaja of Travancore, Sri Chithira Thirunal Balarama Varma.'
  },
  {
    topic: 'Kerala Renaissance',
    question: 'Who organized the pioneering "Mishra Bhojanam" (inter-caste community feast) at Cherai in 1917?',
    options: ['Sahodaran Ayyappan', 'K. Kelappan', 'T.K. Madhavan', 'Poykayil Yohannan'],
    correct: 0,
    explanation: 'Sahodaran K. Ayyappan organized the revolutionary Mishra Bhojanam on May 29, 1917, through the Sahodara Sangham.'
  },
  {
    topic: 'Kerala Renaissance',
    question: 'The famous "Vaikom Satyagraha" was launched in the year 1924 primarily for which purpose?',
    options: [
      'To secure entry for untouchables on public roads surrounding the Vaikom Temple',
      'For agricultural land distribution in Kottayam',
      'Against the British salt monopoly in Malabar',
      'For establishing Malayalam medium primary schools'
    ],
    correct: 0,
    explanation: 'The Vaikom Satyagraha (1924-25) fought for the civic right of lower castes to walk on public roads around the Vaikom Shiva temple.'
  },
  {
    topic: 'Kerala Renaissance',
    question: 'Who was revered as the "Kerala Gandhi" for his leadership in the Salt Satyagraha and Guruvayur Satyagraha?',
    options: ['K. Kelappan', 'A.K. Gopalan', 'P. Krishna Pillai', 'K.P. Kesava Menon'],
    correct: 0,
    explanation: 'K. Kelappan was widely known as "Kerala Gandhi" for his strict Gandhian principles and national movement leadership.'
  },
  {
    topic: 'Kerala Renaissance',
    question: 'Which prominent freedom fighter and journalist was the founder and editor of the fearless newspaper "Swadeshabhimani"?',
    options: ['Vakkom Abdul Khader Moulavi', 'K. Ramakrishna Pillai', 'C.V. Raman Pillai', 'K.P. Kesava Menon'],
    correct: 0,
    explanation: 'Vakkom Abdul Khader Moulavi was the founder-proprietor who established "Swadeshabhimani" in 1905, while K. Ramakrishna Pillai was its fiery editor.'
  },
  {
    topic: 'Kerala Geography',
    question: 'Which is the longest river in the State of Kerala?',
    options: ['Periyar', 'Bharathapuzha', 'Pamba', 'Chaliyar'],
    correct: 0,
    explanation: 'Periyar is the longest river flowing in Kerala with a length of 244 km (Bharathapuzha is second at 209 km).'
  },
  {
    topic: 'Kerala Geography',
    question: 'Silent Valley National Park, famous for preserving the rare Lion-tailed Macaque, is located in which district of Kerala?',
    options: ['Palakkad', 'Idukki', 'Wayanad', 'Kozhikode'],
    correct: 0,
    explanation: 'Silent Valley National Park is nestled in the Kundali Hills of the Western Ghats in the Palakkad district.'
  },
  {
    topic: 'Kerala Geography',
    question: 'What is the highest mountain peak in South India and the Western Ghats, located in Kerala?',
    options: ['Anamudi', 'Meesapulimala', 'Agasthyarkoodam', 'Doddabetta'],
    correct: 0,
    explanation: 'Anamudi, standing at an elevation of 2,695 meters in Idukki district, is the highest peak in South India.'
  },
  {
    topic: 'Kerala History',
    question: 'On which date was the unified State of Kerala officially formed on a linguistic basis?',
    options: ['1 November 1956', '15 August 1947', '26 January 1950', '1 July 1949'],
    correct: 0,
    explanation: 'Kerala state was formed on November 1, 1956 by merging Travancore-Cochin with the Malabar district of Madras State and Kasaragod.'
  },
  {
    topic: 'Kerala Geography',
    question: 'Which is the largest brackish water lake in Kerala and the longest lake in India?',
    options: ['Vembanad Lake', 'Ashtamudi Lake', 'Sasthamkotta Lake', 'Veli Lake'],
    correct: 0,
    explanation: 'Vembanad Lake spans over 2,000 sq km across Alappuzha, Kottayam, and Ernakulam, making it the longest lake in India.'
  },
  {
    topic: 'Kerala History',
    question: 'The historic "Malayali Memorial" was submitted to the Maharaja of Travancore in 1891 under the leadership of:',
    options: ['Barrister G.P. Pillai', 'Dr. Palpu', 'C. Kesavan', 'T.M. Nair'],
    correct: 0,
    explanation: 'The Malayali Memorial was drafted and presented under the stewardship of Barrister G.P. Pillai and K.P. Sankara Menon in 1891.'
  },
  {
    topic: 'Kerala Culture',
    question: 'The famous classical dance drama "Kathakali" originated in Kerala under the patronage of the Raja of Kottarakkara as an evolution from:',
    options: ['Ramanattam', 'Krishnanattam', 'Chakyar Koothu', 'Koodiyattam'],
    correct: 0,
    explanation: 'Kathakali originated in the 17th century as Ramanattam, created by the Raja of Kottarakkara.'
  },

  // 2. Indian Constitution & Judicial System (18 Questions)
  {
    topic: 'Indian Constitution',
    question: 'Under which Article of the Constitution of India does the High Court possess the power to issue Writs for the enforcement of Fundamental Rights and for any other purpose?',
    options: ['Article 226', 'Article 32', 'Article 214', 'Article 136'],
    correct: 0,
    explanation: 'Article 226 grants High Courts the power to issue prerogative writs (Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari) for fundamental rights and any other legal rights.'
  },
  {
    topic: 'Indian Constitution',
    question: 'The High Court of Kerala has judicial jurisdiction over the State of Kerala and which Union Territory?',
    options: ['Lakshadweep', 'Puducherry', 'Mahe', 'Andaman and Nicobar Islands'],
    correct: 0,
    explanation: 'Under the States Reorganisation Act 1956, the High Court of Kerala has jurisdiction over the State of Kerala and the Union Territory of Lakshadweep.'
  },
  {
    topic: 'Indian Constitution',
    question: 'Which constitutional writ literally translates from Latin as "You may have the body", used to secure release from unlawful detention?',
    options: ['Habeas Corpus', 'Mandamus', 'Quo Warranto', 'Certiorari'],
    correct: 0,
    explanation: '"Habeas Corpus" means "you shall have the body", used to release a person unlawfully detained by state authorities or private individuals.'
  },
  {
    topic: 'Indian Constitution',
    question: 'The Writ of "Mandamus" is issued by a superior court to:',
    options: [
      'Command a public official or body to perform a statutory legal duty',
      'Transfer a case from a lower tribunal to itself',
      'Inquire into the legality of a claim to public office',
      'Prevent a lower court from exceeding its territorial jurisdiction'
    ],
    correct: 0,
    explanation: '"Mandamus" literally means "We Command", directing a public authority or lower court to perform a mandatory public duty.'
  },
  {
    topic: 'Indian Constitution',
    question: 'What is the maximum retirement age for a Judge of the High Court in India?',
    options: ['62 years', '65 years', '60 years', '70 years'],
    correct: 0,
    explanation: 'A High Court judge holds office until 62 years of age (Supreme Court judges retire at 65 years).'
  },
  {
    topic: 'Indian Constitution',
    question: 'Under Article 217 of the Constitution, Judges of a High Court are appointed by:',
    options: [
      'The President of India',
      'The Chief Justice of India solely',
      'The Governor of the concerned State',
      'The Chief Minister in consultation with the High Court'
    ],
    correct: 0,
    explanation: 'High Court judges are appointed by the President of India after consultation with the CJI, Governor of the State, and the Chief Justice of the High Court.'
  },
  {
    topic: 'Indian Constitution',
    question: 'Which Article of the Constitution establishes that every High Court shall be a "Court of Record" having power to punish for contempt of itself?',
    options: ['Article 215', 'Article 129', 'Article 227', 'Article 231'],
    correct: 0,
    explanation: 'Article 215 declares every High Court to be a Court of Record with all powers, including power to punish for contempt (Supreme Court under Article 129).'
  },
  {
    topic: 'Indian Constitution',
    question: 'Which landmark Supreme Court case propounded the famous "Basic Structure Doctrine", ruling that Parliament cannot alter the basic framework of the Constitution?',
    options: [
      'Kesavananda Bharati v. State of Kerala (1973)',
      'Golaknath v. State of Punjab (1967)',
      'Maneka Gandhi v. Union of India (1978)',
      'Minerva Mills v. Union of India (1980)'
    ],
    correct: 0,
    explanation: 'The 13-judge bench in Kesavananda Bharati v. State of Kerala (1973) established the inviolable Basic Structure Doctrine.'
  },
  {
    topic: 'Indian Constitution',
    question: 'Which Constitutional Amendment Act added the words "Socialist, Secular, and Integrity" into the Preamble of the Indian Constitution?',
    options: ['42nd Amendment Act, 1976', '44th Amendment Act, 1978', '86th Amendment Act, 2002', '73rd Amendment Act, 1992'],
    correct: 0,
    explanation: 'The 42nd Amendment Act of 1976 (known as the mini-constitution) added Socialist, Secular, and Integrity to the Preamble.'
  },
  {
    topic: 'Indian Constitution',
    question: 'Right to Education for children between the ages of 6 and 14 was incorporated as a Fundamental Right under Article 21A by which amendment?',
    options: ['86th Amendment Act, 2002', '91st Amendment Act, 2003', '74th Amendment Act, 1992', '44th Amendment Act, 1978'],
    correct: 0,
    explanation: 'The 86th Constitutional Amendment Act, 2002 inserted Article 21A, guaranteeing free and compulsory education as a Fundamental Right.'
  },
  {
    topic: 'Indian Constitution',
    question: 'The Fundamental Rights in the Indian Constitution are inspired by which country\'s constitution?',
    options: ['United States of America (Bill of Rights)', 'United Kingdom', 'USSR', 'Ireland'],
    correct: 0,
    explanation: 'Part III Fundamental Rights are inspired by the American Bill of Rights.'
  },
  {
    topic: 'Indian Constitution',
    question: 'Article 44 of the Constitution of India provides for which Directive Principle of State Policy?',
    options: [
      'Uniform Civil Code for the citizens',
      'Separation of Judiciary from Executive',
      'Protection of Monuments and historic sites',
      'Organization of Village Panchayats'
    ],
    correct: 0,
    explanation: 'Article 44 states that the State shall endeavour to secure for the citizens a Uniform Civil Code throughout the territory of India.'
  },
  {
    topic: 'Indian Constitution',
    question: 'The Right to Information (RTI) Act in India received Presidential assent and came into full force in which year?',
    options: ['2005', '2002', '2008', '2010'],
    correct: 0,
    explanation: 'The landmark RTI Act came into force on October 12, 2005.'
  },
  {
    topic: 'Indian Constitution',
    question: 'The voting age in India was reduced from 21 years to 18 years by which Constitutional Amendment Act?',
    options: ['61st Amendment Act, 1988', '52nd Amendment Act, 1985', '73rd Amendment Act, 1992', '84th Amendment Act, 2001'],
    correct: 0,
    explanation: 'The 61st Constitutional Amendment Act, 1988 amended Article 326 to reduce the voting age from 21 to 18 years.'
  },
  {
    topic: 'Indian Constitution',
    question: 'Who described Article 32 (Right to Constitutional Remedies) as the "very soul of the Constitution and the very heart of it"?',
    options: ['Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Dr. Rajendra Prasad', 'Sardar Vallabhbhai Patel'],
    correct: 0,
    explanation: 'Dr. B.R. Ambedkar called Article 32 the "Heart and Soul" of the Indian Constitution because it empowers citizens to directly approach the Supreme Court.'
  },
  {
    topic: 'Indian Constitution',
    question: 'Under Article 227 of the Constitution, every High Court has superintendence over:',
    options: [
      'All courts and tribunals throughout the territories in relation to which it exercises jurisdiction',
      'Only Subordinate Munsiff courts',
      'Only Armed Forces courts-martial',
      'The State Legislature and Governor'
    ],
    correct: 0,
    explanation: 'Article 227 gives High Courts administrative and judicial superintendence over all courts and tribunals in its territorial jurisdiction (excluding armed forces tribunals).'
  },
  {
    topic: 'Indian Constitution',
    question: 'Which Schedule of the Indian Constitution lists the 22 official languages of India?',
    options: ['Eighth Schedule', 'Seventh Schedule', 'Ninth Schedule', 'Eleventh Schedule'],
    correct: 0,
    explanation: 'The Eighth Schedule of the Indian Constitution lists the 22 officially recognized languages.'
  },
  {
    topic: 'Indian Constitution',
    question: 'In which city is the seat of the High Court of Kerala permanently situated?',
    options: ['Ernakulam (Kochi)', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'],
    correct: 0,
    explanation: 'The permanent seat of the High Court of Kerala is at Ernakulam (Kochi).'
  },

  // 3. Science, Information Technology & Current Affairs (7 Questions)
  {
    topic: 'Science & IT',
    question: 'What is the full form of K-FON, the prestigious flagship telecommunication project launched by the Government of Kerala?',
    options: [
      'Kerala Fibre Optic Network',
      'Kerala Fast Online Network',
      'Kerala Fiber Optic National',
      'Kerala Federal Open Network'
    ],
    correct: 0,
    explanation: 'KFON stands for Kerala Fibre Optic Network, providing high-speed optical fiber connectivity across the state.'
  },
  {
    topic: 'Science & IT',
    question: 'The Indian Information Technology Act, providing legal framework for electronic governance and cyber crimes, was enacted in:',
    options: ['2000', '2005', '1998', '2012'],
    correct: 0,
    explanation: 'The Information Technology Act 2000 (IT Act) is the primary law in India dealing with cybercrime and electronic commerce.'
  },
  {
    topic: 'Science & IT',
    question: 'A malicious program that encrypts a computer\'s files and demands payment in exchange for the decryption key is termed:',
    options: ['Ransomware', 'Spyware', 'Adware', 'Phishing'],
    correct: 0,
    explanation: 'Ransomware is malware designed to deny access to computer systems or data until a ransom is paid.'
  },
  {
    topic: 'Science & IT',
    question: 'National Constitution Day (Samvidhan Diwas) is celebrated in India every year on:',
    options: ['26 November', '26 January', '15 August', '2 October'],
    correct: 0,
    explanation: 'November 26 is celebrated as Constitution Day because the Constituent Assembly adopted the Constitution on 26 November 1949.'
  },
  {
    topic: 'General Science',
    question: 'Which gas is predominantly responsible for the "Greenhouse Effect" warming the Earth\'s atmosphere?',
    options: ['Carbon Dioxide (CO2)', 'Nitrogen (N2)', 'Oxygen (O2)', 'Argon (Ar)'],
    correct: 0,
    explanation: 'Carbon dioxide, water vapour, methane, and ozone are the primary greenhouse gases.'
  },
  {
    topic: 'Current Affairs',
    question: 'Where is the headquarters of the International Court of Justice (ICJ) located?',
    options: ['The Hague, Netherlands', 'Geneva, Switzerland', 'New York, USA', 'Vienna, Austria'],
    correct: 0,
    explanation: 'The International Court of Justice is seated at the Peace Palace in The Hague, Netherlands.'
  },
  {
    topic: 'Current Affairs',
    question: 'What is the sanctioned judicial strength of Judges in the Supreme Court of India (including the Chief Justice of India)?',
    options: ['34', '31', '33', '35'],
    correct: 0,
    explanation: 'Under the Supreme Court (Number of Judges) Amendment Act 2019, the sanctioned strength is 34 judges (33 judges + 1 Chief Justice).'
  }
];

// ============================================================================
// PART C: BASIC MATHEMATICS & REASONING (10 QUESTIONS) - HCA PATTERN
// ============================================================================

export const KERALA_HCA_MATH_REASONING_POOL: HcaQuestionDef[] = [
  // Mathematics
  {
    topic: 'Percentages',
    question: 'A clerk\'s salary was increased by 20% and later decreased by 20%. What is the net change in his salary?',
    options: ['4% decrease', 'No change', '2% decrease', '4% increase'],
    correct: 0,
    explanation: 'Net change = x + y + (xy/100) = 20 - 20 - (400/100) = -4% (a 4% decrease).'
  },
  {
    topic: 'Time & Work',
    question: 'Assistant A can verify a case file in 6 hours, while Assistant B takes 12 hours. How long will they take working together?',
    options: ['4 hours', '3 hours', '5 hours', '4.5 hours'],
    correct: 0,
    explanation: 'Together in 1 hour = 1/6 + 1/12 = 3/12 = 1/4. Hence, they take 4 hours together.'
  },
  {
    topic: 'Simple Interest',
    question: 'Find the Simple Interest on ₹8,000 invested at 7.5% per annum for 3 years.',
    options: ['₹1,800', '₹1,600', '₹2,000', '₹1,500'],
    correct: 0,
    explanation: 'SI = (P × R × T) / 100 = (8000 × 7.5 × 3) / 100 = 80 × 22.5 = ₹1,800.'
  },
  {
    topic: 'Ratio & Proportion',
    question: 'The ratio of the ages of A and B is 4:5. After 5 years, the ratio becomes 5:6. What is the present age of A?',
    options: ['20 years', '25 years', '15 years', '30 years'],
    correct: 0,
    explanation: 'Let ages be 4x and 5x. (4x + 5)/(5x + 5) = 5/6 => 24x + 30 = 25x + 25 => x = 5. A\'s present age = 4 × 5 = 20 years.'
  },
  {
    topic: 'Speed, Time & Distance',
    question: 'A train 180 meters long crosses an electric pole in 9 seconds. What is the speed of the train in km/h?',
    options: ['72 km/h', '64 km/h', '80 km/h', '54 km/h'],
    correct: 0,
    explanation: 'Speed in m/s = 180 / 9 = 20 m/s. In km/h = 20 × (18 / 5) = 72 km/h.'
  },

  // Reasoning & Mental Ability
  {
    topic: 'Number Series',
    question: 'Find the missing number in the series: 3, 7, 15, 31, 63, ?',
    options: ['127', '125', '129', '126'],
    correct: 0,
    explanation: 'Pattern: Each number is × 2 + 1. 63 × 2 + 1 = 126 + 1 = 127.'
  },
  {
    topic: 'Coding & Decoding',
    question: 'If "COURT" is coded as "DPVSU", how will "BENCH" be coded in the same language?',
    options: ['CFODI', 'CFODG', 'DFODI', 'BGODI'],
    correct: 0,
    explanation: 'Each letter is shifted by +1: B->C, E->F, N->O, C->D, H->I => CFODI.'
  },
  {
    topic: 'Blood Relations',
    question: 'Pointing to a photograph, a woman said, "His mother is the only daughter of my mother." How is the woman related to the boy in the photograph?',
    options: ['Mother', 'Sister', 'Aunt', 'Grandmother'],
    correct: 0,
    explanation: '"The only daughter of my mother" is the woman herself. Therefore, she is the mother of the boy.'
  },
  {
    topic: 'Direction Sense',
    question: 'A man walks 4 km North, turns right and walks 3 km. How far is he from his starting point?',
    options: ['5 km', '7 km', '6 km', '4 km'],
    correct: 0,
    explanation: 'By Pythagoras theorem: sqrt(4^2 + 3^2) = sqrt(16 + 9) = sqrt(25) = 5 km.'
  },
  {
    topic: 'Letter Analogy',
    question: 'Complete the analogy: LAW : JUSTICE :: MEDICINE : ?',
    options: ['HEALTH', 'DOCTOR', 'HOSPITAL', 'PATIENT'],
    correct: 0,
    explanation: 'Law aims to achieve Justice; Medicine aims to achieve Health.'
  }
];

// Helper to convert HCA question definition to ExamQuestionItem
export function convertToExamQuestionItem(
  def: HcaQuestionDef,
  id: string,
  sectionCode: string,
  sectionName: string,
  questionNumber: number,
  marks: number = 1,
  negativeMarks: number = 0.25
): ExamQuestionItem {
  return {
    id,
    sectionCode,
    sectionName,
    questionNumber,
    subjectCode: sectionCode as any,
    topicName: def.topic,
    difficulty: def.difficulty || 'medium',
    questionText: def.question,
    options: def.options,
    correctOptionIndex: def.correct,
    explanation: def.explanation,
    marks,
    negativeMarks
  };
}

// Helper to convert to QuizQuestion
export function convertToQuizQuestion(
  def: HcaQuestionDef,
  id: string,
  subjectId: string
): QuizQuestion {
  return {
    id,
    subject_id: subjectId,
    topic_name: def.topic,
    question_text: def.question,
    options: def.options,
    correct_option_index: def.correct,
    explanation: def.explanation,
    difficulty: def.difficulty || 'medium'
  };
}
