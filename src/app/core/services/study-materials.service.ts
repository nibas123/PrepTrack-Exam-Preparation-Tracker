import { Injectable } from '@angular/core';

export interface LegalConceptTopic {
  id: string;
  title: string;
  subject: string;
  category: 'constitution' | 'crpc_bnss' | 'cpc' | 'ipc_bns' | 'evidence_bsa' | 'high_court_rules' | 'general_english' | 'gk_current_affairs';
  difficulty: 'Foundation' | 'Moderate' | 'Advanced';
  summary: string;
  sectionsOrArticles: string[];
  keyPrinciples: string[];
  landmarkJudgments: string[];
  revisionNotes: string[];
  examTags: string[];
}

export interface LandmarkJudgment {
  id: string;
  caseName: string;
  year: number;
  bench: string;
  articlesOrSections: string;
  ratioDecidendi: string;
  constitutionalSignificance: string;
  examTakeaway: string;
}

export interface LegalMaxim {
  id: string;
  latin: string;
  englishMeaning: string;
  subjectArea: string;
  application: string;
}

export interface DescriptiveEssayModel {
  id: string;
  title: string;
  category: 'Constitutional Law' | 'Judicial Reforms & Administration' | 'Technology & Law' | 'Social Justice & Human Rights';
  targetWords: number;
  outline: {
    introduction: string;
    constitutionalLegalContext: string;
    challengesAndIssues: string;
    judicialPrecedents: string;
    recommendationsWayForward: string;
    conclusion: string;
  };
  modelContent: string;
  keyLegalCitations: string[];
}

export interface PrecisExercise {
  id: string;
  title: string;
  sourceExam: string;
  originalText: string;
  originalWords: number;
  targetWordsRange: string;
  suggestedTitles: string[];
  modelPrecis: string;
  modelWords: number;
  keyPointsPreserved: string[];
  commonMistakesToAvoid: string[];
}

export interface TranslationExercise {
  id: string;
  title: string;
  direction: 'English to Malayalam' | 'Malayalam to English';
  sourceParagraph: string;
  modelTranslation: string;
  legalGlossaryKeys: { term: string; meaning: string }[];
}

export interface HighCourtPostPlan {
  postId: string;
  postTitle: string;
  department: string;
  cadre: string;
  payScale: string;
  eligibility: string;
  ageLimit: string;
  selectionStages: {
    stageNumber: number;
    stageName: string;
    totalMarks: number;
    duration: string;
    details: string;
    negativeMarking: string;
  }[];
  subjectWeightage: { subject: string; marks: number; percentage: number }[];
  studyPlan60Days: { phase: string; days: string; focus: string; recommendedActions: string }[];
}

export interface FlashcardItem {
  id: string;
  category: string;
  questionOrPrompt: string;
  answerOrExplanation: string;
  citationOrSection: string;
  mastered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StudyMaterialsService {

  // =========================================================================
  // 1. LEGAL CONCEPTS & STATUTORY REVISION MODULES
  // =========================================================================
  readonly legalTopics: LegalConceptTopic[] = [
    {
      id: 'topic-const-writs',
      title: 'High Court Writ Jurisdiction (Article 226 vs Article 32)',
      subject: 'Indian Constitution',
      category: 'constitution',
      difficulty: 'Advanced',
      summary: 'Article 226 empowers the High Court to issue prerogative writs (Habeas Corpus, Mandamus, Prohibition, Quo Warranto, and Certiorari) throughout its territorial jurisdiction for the enforcement of Fundamental Rights and for any other purpose.',
      sectionsOrArticles: ['Article 226', 'Article 227', 'Article 32', 'Article 215'],
      keyPrinciples: [
        'Writ jurisdiction under Art 226 is wider than Art 32 of Supreme Court because it covers Fundamental Rights and "any other purpose" (legal rights).',
        'Article 226 is discretionary; courts exercise self-imposed restraint where effective alternative statutory remedy exists (except for fundamental right violations or failure of natural justice).',
        'Territorial jurisdiction exists if the cause of action arises wholly or in part within the state (Art 226(2)).',
        'Article 227 provides superintendence over all courts and tribunals in the state (supervisory, not appellate).'
      ],
      landmarkJudgments: [
        'L. Chandra Kumar v. Union of India (1997) - Art 226 & 227 are part of the Basic Structure.',
        'Whirlpool Corporation v. Registrar of Trade Marks (1998) - Alternative remedy is not an absolute bar.',
        'Radhey Shyam v. Chhabi Nath (2015) - Judicial orders of civil courts are not amendable to writ of certiorari under Art 226; Art 227 applies.'
      ],
      revisionNotes: [
        'Habeas Corpus: To produce detained person ("you may have the body"). Available against State and private individuals.',
        'Mandamus: Commands a public official/statutory authority to perform a mandatory legal duty.',
        'Certiorari: Quashes orders passed without jurisdiction or in breach of natural justice.',
        'Prohibition: Issued to prevent an inferior court/tribunal from exceeding its jurisdiction (issued before order passed).',
        'Quo Warranto: Inquires into legality of claim by person holding a public substantive office.'
      ],
      examTags: ['Kerala HCA Stage 1', 'Munsiff Prelims', 'High Court Rules']
    },
    {
      id: 'topic-const-high-courts',
      title: 'High Courts in the States: Structure, Appointment & Powers',
      subject: 'Indian Constitution',
      category: 'constitution',
      difficulty: 'Moderate',
      summary: 'Articles 214 to 231 of the Constitution govern High Courts in India as constitutional courts of record with plenary jurisdiction.',
      sectionsOrArticles: ['Article 214', 'Article 215', 'Article 216', 'Article 217', 'Article 222', 'Article 225'],
      keyPrinciples: [
        'Every High Court is a Court of Record (Art 215) and has all powers of such court including power to punish for contempt of itself.',
        'Judges are appointed by the President under warrant under his hand and seal after consultation with CJI, Governor, and Chief Justice of High Court (Art 217).',
        'Retirement age for High Court Judges is 62 years (under Art 217(1)).',
        'High Court judges can be transferred by President after consultation with CJI (Art 222).',
        'Parliament may by law establish a common High Court for two or more States (Art 231) - e.g. Kerala High Court covers Kerala and Lakshadweep UT.'
      ],
      landmarkJudgments: [
        'Second Judges Case (1993) & Third Judges Case (1998) - Collegium system established.',
        'NJAC Case (Supreme Court Advocates-on-Record Association v. UOI, 2015) - Struck down 99th Constitutional Amendment restoring Collegium.'
      ],
      revisionNotes: [
        'Kerala High Court seat: Ernakulam (Kochi). Jurisdiction: State of Kerala & UT of Lakshadweep.',
        'Oath taken before Governor of the State (Art 219, Third Schedule).',
        'Removal procedure is identical to Supreme Court judge (Art 217(1)(b) r/w Art 124(4)).'
      ],
      examTags: ['Constitution GK', 'Judicial Hierarchy', 'Kerala HCA']
    },
    {
      id: 'topic-cpc-res-judicata',
      title: 'Res Judicata (Section 11) & Stay of Suit (Section 10) CPC',
      subject: 'Civil Procedure Code',
      category: 'cpc',
      difficulty: 'Advanced',
      summary: 'Principles preventing multiplicity of proceedings, ensuring finality of judicial determinations (Interest reipublicae ut sit finis litium).',
      sectionsOrArticles: ['Section 10 CPC (Res Sub Judice)', 'Section 11 CPC (Res Judicata)', 'Section 151 (Inherent Powers)'],
      keyPrinciples: [
        'Section 10 (Res Sub Judice): Bars the trial (not institution) of a subsequent suit where matter directly and substantially in issue is pending in a previously instituted suit between same parties.',
        'Section 11 (Res Judicata): Bars court from trying any suit or issue in which matter directly and substantially in issue has been heard and finally decided by a competent court in a former suit.',
        'Constructive Res Judicata (Explanation IV): Any matter which might and ought to have been made a ground of defense or attack shall be deemed to have been a matter directly and substantially in issue.',
        'Applies to execution proceedings (Explanation VII) and writ petitions (Daryao v. State of UP).'
      ],
      landmarkJudgments: [
        'Daryao v. State of UP (1961) - Res judicata applies to writ petitions under Art 32/226.',
        'Satyadhyan Ghosal v. Deorajin Debi (1960) - Principle of finality prevents re-agitation of concluded matters.'
      ],
      revisionNotes: [
        'Res Judicata applies to issues already decided; Section 10 applies to matters currently pending.',
        'Exceptions: Judgment obtained by fraud/collusion (Sec 44 Evidence Act), court lacked inherent subject-matter jurisdiction.'
      ],
      examTags: ['Munsiff Prelims', 'HCA Legal Assistant', 'Civil Procedure']
    },
    {
      id: 'topic-crpc-bnss-fir-bail',
      title: 'Criminal Procedure: Cognizable Offenses, FIR & Bail Provisions',
      subject: 'Criminal Procedure (CrPC / BNSS)',
      category: 'crpc_bnss',
      difficulty: 'Moderate',
      summary: 'Essential criminal procedural mechanisms governing registration of information, police investigation, arrest safeguards, and bail granting.',
      sectionsOrArticles: ['Section 154 CrPC / Sec 173 BNSS', 'Section 41A CrPC / Sec 35 BNSS', 'Section 437/439 CrPC / Sec 480/483 BNSS', 'Section 438 CrPC / Sec 482 BNSS'],
      keyPrinciples: [
        'Registration of FIR is mandatory under Sec 154 CrPC / 173 BNSS if the information discloses commission of a cognizable offense.',
        'Section 41A notice must be issued when arrest is not required for offenses punishable with up to 7 years imprisonment (Arnesh Kumar guidelines).',
        'Bail in bailable offenses is a matter of right (Sec 436); bail in non-bailable offenses is discretionary (Sec 437/439).',
        'Anticipatory Bail (Sec 438 CrPC / Sec 482 BNSS): Directed to High Court or Sessions Court by a person apprehending arrest for a non-bailable offense.'
      ],
      landmarkJudgments: [
        'Lalita Kumari v. Govt. of UP (2014) - Mandatory registration of FIR under Sec 154 for cognizable offenses.',
        'Arnesh Kumar v. State of Bihar (2014) - Strict compliance with Sec 41/41A prior to arrest in offenses punishable up to 7 years.',
        'Sushila Aggarwal v. State (NCT of Delhi) (2020) - Protection granted under Sec 438 should not invariably be limited to a fixed period.'
      ],
      revisionNotes: [
        'Cognizable: Police officer may arrest without warrant and investigate without magistrate order.',
        'Non-cognizable: Requires magistrate order/warrant under Sec 155.',
        'Zero FIR: Can be lodged at any police station regardless of territorial jurisdiction, later transferred to relevant police station.'
      ],
      examTags: ['Kerala HCA GK/Law', 'Munsiff Prelims', 'Criminal Law']
    },
    {
      id: 'topic-evidence-admissions-confessions',
      title: 'Law of Evidence: Admissions, Confessions & Dying Declarations',
      subject: 'Indian Evidence Act / Bharatiya Sakshya Adhiniyam',
      category: 'evidence_bsa',
      difficulty: 'Advanced',
      summary: 'Key concepts governing extra-judicial and judicial admissions, police confessions, section 27 discoveries, and statements of persons who cannot be called as witnesses.',
      sectionsOrArticles: ['Sec 17-21 Evidence Act', 'Sec 24-27 Evidence Act', 'Sec 32(1) Dying Declaration', 'Sec 101-105 Burden of Proof'],
      keyPrinciples: [
        'Confession made to a police officer cannot be proved against a person accused of any offense (Sec 25).',
        'Confession by accused while in police custody is inadmissible unless made in immediate presence of a Magistrate (Sec 26).',
        'Section 27 (Doctrine of Confirmation by Subsequent Recovery): So much of information which relates distinctly to the fact thereby discovered is admissible.',
        'Dying Declaration (Sec 32(1)): Statement made by person as to cause of his death or circumstances of transaction resulting in death is relevant even if declarant was not expecting death when making it (differs from English law).'
      ],
      landmarkJudgments: [
        'Pulukuri Kottaya v. Emperor (1947) - Leading Privy Council authority on Sec 27 recovery.',
        'Sharad Birdhichand Sarda v. State of Maharashtra (1984) - Principles of dying declaration and circumstantial evidence "Panchsheel".',
        'Kashmira Singh v. State of MP (1952) - Evidentiary value of confession of co-accused (Sec 30).'
      ],
      revisionNotes: [
        'Nemo moriturus praesumitur mentire: "A person on the verge of death is not presumed to lie."',
        'Burden of proof lies on the person who desires court to give judgment (Sec 101). In criminal cases, prosecution must prove guilt beyond reasonable doubt.'
      ],
      examTags: ['Munsiff Prelims', 'Evidence Act', 'Kerala HCA']
    },
    {
      id: 'topic-kerala-high-court-act',
      title: 'Kerala High Court Act, 1958 & Court Rules Administration',
      subject: 'High Court Rules & Local Laws',
      category: 'high_court_rules',
      difficulty: 'Moderate',
      summary: 'Statutory framework governing business, jurisdiction, single judge and division bench references, and appeals within the High Court of Kerala.',
      sectionsOrArticles: ['Section 3 (Powers of Single Judge)', 'Section 4 (Powers of Division Bench)', 'Section 5 (Appeals from Single Judge)', 'High Court Rules of Kerala 1971'],
      keyPrinciples: [
        'Section 3 enumerates matters that can be heard and disposed of by a Single Judge (bail applications, revision petitions, specific civil appeals).',
        'Section 4: Division Bench hears appeals against decrees/orders of subordinate civil courts exceeding pecuniary limit, writ petitions against constitutional authorities, and references on question of law.',
        'Section 5: Intra-court Appeal (Writ Appeal) lies to a Division Bench from a judgment or order of a Single Judge in exercise of original jurisdiction (Art 226).',
        'No appeal lies under Section 5 against an order passed by a Single Judge in exercise of supervisory jurisdiction under Article 227.'
      ],
      landmarkJudgments: [
        'K.S. Das v. State of Kerala (1992) - Maintainability of Writ Appeal under Section 5 against interlocutory orders.',
        'Shalabh Saxena v. High Court of Kerala - Judicial administrative hierarchy and registry compliance.'
      ],
      revisionNotes: [
        'Registry of Kerala High Court is headed by the Registrar General.',
        'Registrar (Judicial), Registrar (Vigilance), Registrar (Administration) manage specialized branches.',
        'Kerala High Court was inaugurated on 1st November 1956 following the States Reorganisation Act.'
      ],
      examTags: ['Kerala HCA Specific', 'Service Rules', 'Court Administration']
    }
  ];

  // =========================================================================
  // 2. LANDMARK JUDGMENTS ARCHIVE
  // =========================================================================
  readonly landmarkJudgments: LandmarkJudgment[] = [
    {
      id: 'lj-1',
      caseName: 'Kesavananda Bharati v. State of Kerala',
      year: 1973,
      bench: '13-Judge Constitutional Bench (7:6 majority)',
      articlesOrSections: 'Article 368, Article 13, Part III',
      ratioDecidendi: 'Parliament has wide constituent power to amend any part of the Constitution under Article 368, but this power does not extend to altering or damaging the "Basic Structure" or essential framework of the Constitution.',
      constitutionalSignificance: 'Protected judicial review, federalism, secularism, democracy, and fundamental rights from being abrogated by legislative majorities.',
      examTakeaway: 'Landmark decision originating from Kerala (Edneer Mutt, Kasaragod) that established the Basic Structure Doctrine in Indian jurisprudence.'
    },
    {
      id: 'lj-2',
      caseName: 'Maneka Gandhi v. Union of India',
      year: 1978,
      bench: '7-Judge Constitutional Bench',
      articlesOrSections: 'Article 21, Article 19, Article 14 (Golden Triangle)',
      ratioDecidendi: 'The procedure established by law under Article 21 must be "just, fair, and reasonable", and not arbitrary, fanciful, or oppressive. Articles 14, 19, and 21 are mutually inclusive and form the Golden Triangle of constitutional liberty.',
      constitutionalSignificance: 'Imported the substantive American concept of "Due Process" into Article 21, transforming it into an expansive reservoir of human rights.',
      examTakeaway: 'Overruled A.K. Gopalan (1950) and established that procedural fairness is indispensable for deprivation of personal liberty.'
    },
    {
      id: 'lj-3',
      caseName: 'Justice K.S. Puttaswamy (Retd.) v. Union of India',
      year: 2017,
      bench: '9-Judge Constitutional Bench (Unanimous 9:0)',
      articlesOrSections: 'Article 21, Part III',
      ratioDecidendi: 'The Right to Privacy is an intrinsic and fundamental part of the Right to Life and Personal Liberty under Article 21 and is protected by the entire Part III of the Constitution.',
      constitutionalSignificance: 'Overruled M.P. Sharma (1954) and Kharak Singh (1962). Formulated the three-fold proportionality test: Legitimate State Aim, Proportionality, and Legal backing.',
      examTakeaway: 'Crucial for modern constitutional law and data protection topics in descriptive and objective tests.'
    },
    {
      id: 'lj-4',
      caseName: 'Navtej Singh Johar v. Union of India',
      year: 2018,
      bench: '5-Judge Constitutional Bench (Unanimous)',
      articlesOrSections: 'Section 377 IPC, Articles 14, 15, 19, 21',
      ratioDecidendi: 'Section 377 IPC, insofar as it criminalizes consensual sexual conduct between adults in private, is violative of Articles 14, 15, 19, and 21 of the Constitution.',
      constitutionalSignificance: 'Enunciated Constitutional Morality over popular morality and recognized self-determination, autonomy, and dignity as fundamental rights.',
      examTakeaway: 'Overruled Suresh Kumar Koushal (2013) and affirmed the doctrine of Progressive Realization of Rights.'
    },
    {
      id: 'lj-5',
      caseName: 'D.K. Basu v. State of West Bengal',
      year: 1997,
      bench: 'Division Bench (Kuldip Singh & A.S. Anand, JJ.)',
      articlesOrSections: 'Article 21, Article 22, Criminal Procedure',
      ratioDecidendi: 'Laid down 11 mandatory guidelines and procedural safeguards to be observed by police and arresting agencies during arrest and detention to prevent custodial torture and deaths.',
      constitutionalSignificance: 'Custodial torture is a gross violation of human dignity. Mandated arrest memos, notification to relatives, medical examination every 48 hours, and right to meet counsel.',
      examTakeaway: 'These guidelines were later incorporated into Sections 41A, 41B, 41C, and 41D of CrPC by the 2008 Amendment Act.'
    }
  ];

  // =========================================================================
  // 3. ESSENTIAL HIGH COURT LEGAL MAXIMS
  // =========================================================================
  readonly legalMaxims: LegalMaxim[] = [
    {
      id: 'lm-1',
      latin: 'Audi Alteram Partem',
      englishMeaning: 'Hear the other side / No one should be condemned unheard.',
      subjectArea: 'Principles of Natural Justice & Administrative Law',
      application: 'Essential rule of procedural fairness in judicial, quasi-judicial, and administrative decisions affecting individual rights.'
    },
    {
      id: 'lm-2',
      latin: 'Nemo Debet Esse Judex In Propria Causa',
      englishMeaning: 'No one should be a judge in their own cause (Rule against bias).',
      subjectArea: 'Natural Justice & Judicial Conduct',
      application: 'Bars any judge or decision-maker with personal, pecuniary, or subject-matter bias from presiding over a dispute.'
    },
    {
      id: 'lm-3',
      latin: 'Actus Non Facit Reum Nisi Mens Sit Rea',
      englishMeaning: 'An act does not make a person guilty unless the mind is also guilty.',
      subjectArea: 'Criminal Law & IPC / BNS',
      application: 'Foundational doctrine requiring both physical act (actus reus) and blameworthy mental state (mens rea) for criminal liability.'
    },
    {
      id: 'lm-4',
      latin: 'Interest Reipublicae Ut Sit Finis Litium',
      englishMeaning: 'It is in the interest of the State that there should be an end to litigation.',
      subjectArea: 'Civil Procedure & Jurisprudence (Sec 11 CPC)',
      application: 'Underlying public policy rationale behind Res Judicata and the Law of Limitation.'
    },
    {
      id: 'lm-5',
      latin: 'Stare Decisis Et Non Quieta Movere',
      englishMeaning: 'To stand by decisions and not disturb settled matters (Doctrine of Precedent).',
      subjectArea: 'Judicial Precedents & Article 141',
      application: 'Subordinate courts are bound by the ratio decidendi of superior courts to maintain judicial predictability and certainty.'
    },
    {
      id: 'lm-6',
      latin: 'Ignorantia Facti Excusat, Ignorantia Juris Non Excusat',
      englishMeaning: 'Ignorance of fact excuses, ignorance of law does not excuse.',
      subjectArea: 'IPC / Criminal Jurisprudence (Sec 76 & 79 IPC)',
      application: 'Mistake of fact in good faith is a general defense; ignorance of law is not recognized as a defense.'
    },
    {
      id: 'lm-7',
      latin: 'Ubi Jus Ibi Remedium',
      englishMeaning: 'Where there is a right, there is a remedy.',
      subjectArea: 'Constitutional Law (Ashby v. White & Art 32/226)',
      application: 'A legal right without a judicial mechanism to enforce it is toothless; justifies writ remedies.'
    },
    {
      id: 'lm-8',
      latin: 'Res Ipsa Loquitur',
      englishMeaning: 'The thing speaks for itself.',
      subjectArea: 'Law of Torts & Negligence',
      application: 'Rule of evidence shifting the burden of proof to the defendant when the accident could not have occurred without negligence.'
    },
    {
      id: 'lm-9',
      latin: 'Volenti Non Fit Injuria',
      englishMeaning: 'No injury is done to one who consents.',
      subjectArea: 'Law of Torts & Civil Law',
      application: 'A person who voluntarily incurs a known risk cannot sue for damages resulting from that risk.'
    },
    {
      id: 'lm-10',
      latin: 'Salus Populi Est Suprema Lex',
      englishMeaning: 'The welfare of the people is the supreme law.',
      subjectArea: 'Public Law & Police Powers of State',
      application: 'Individual rights may be reasonably restricted by valid law in the paramount interest of public health, safety, and order.'
    }
  ];

  // =========================================================================
  // 4. DESCRIPTIVE WRITING LAB: MODEL ESSAYS FOR HIGH COURT
  // =========================================================================
  readonly modelEssays: DescriptiveEssayModel[] = [
    {
      id: 'essay-1',
      title: 'Judicial Activism vs. Judicial Restraint: Striking the Constitutional Equilibrium',
      category: 'Constitutional Law',
      targetWords: 350,
      outline: {
        introduction: 'Definition of judicial activism as proactive defense of constitutional values versus judicial restraint respecting legislative/executive prerogative.',
        constitutionalLegalContext: 'Doctrine of Separation of Powers under Articles 50, 121, 211, and judicial review under Articles 13, 32, and 226.',
        challengesAndIssues: 'Allegations of "judicial overreach" or "judicial legislation" when courts enter policy formation vs necessity of judicial intervention in executive apathy.',
        judicialPrecedents: 'Kesavananda Bharati, Vishaka v. State of Rajasthan (gap-filling), and Asif Hameed v. State of J&K (restraint guidelines).',
        recommendationsWayForward: 'Self-imposed judicial restraint, adherence to constitutional discipline, and principled intervention only in clear rights violations.',
        conclusion: 'The judiciary must act as a balance wheel, guarding liberty without usurping the democratic mandate of representative governance.'
      },
      keyLegalCitations: ['Article 50', 'Article 226', 'Vishaka Guidelines (1997)', 'Asif Hameed (1989)'],
      modelContent: `The constitutional architecture of India is premised on a delicate equilibrium among the Legislature, the Executive, and the Judiciary. While the legislature articulates democratic will through statutes and the executive implements public policy, the judiciary acts as the sentinel on the qui vive, guarding the Constitution against statutory overreach and administrative tyranny. Within this triadic framework, the debate between judicial activism and judicial restraint assumes profound significance.

Judicial activism represents the philosophy wherein courts dynamically interpret constitutional provisions to enforce fundamental rights, cure executive inertia, and fill legislative vacuums. Emerging forcefully through Public Interest Litigation (PIL) spearheaded by Justices P.N. Bhagwati and V.R. Krishna Iyer in the late 1970s, activism liberalized the traditional rule of locus standi. In landmark verdicts such as *Vishaka v. State of Rajasthan (1997)*, the Supreme Court formulated workplace sexual harassment guidelines in the complete absence of statutory law, demonstrating how judicial intervention can safeguard vital human rights. Similarly, the expansiveness of Article 21—encompassing the right to clean environment, privacy, and speedy trial—is the direct harvest of principled judicial activism.

However, when activism crosses the threshold into judicial overreach, it imperils the doctrine of separation of powers. Instances where courts undertake fiscal administration, cancel statutory tenders without arbitrariness, or enact policy directives disrupt executive accountability. As cautioned in *Divisional Manager, Aravali Golf Club v. Chander Haas (2008)*, judges must exercise judicial restraint and not assume the role of an unelected legislature.

In conclusion, judicial activism and restraint are not antithetical; rather, they are complementary facets of judicial discretion. The High Court, as a constitutional court of record under Article 215 and 226, must remain an assertive guarantor of fundamental freedoms while practicing enlightened self-restraint. True constitutionalism thrives when the bench remains vigilant against rights infringements yet scrupulously respectful of the democratic prerogatives of coordinate branches.`
    },
    {
      id: 'essay-2',
      title: 'Artificial Intelligence and Modernization of Courts: Transformation of Judicial Administration',
      category: 'Technology & Law',
      targetWords: 320,
      outline: {
        introduction: 'The exponential influx of litigation in Indian courts and the imperative shift toward technology under the e-Courts Mission Mode Project.',
        constitutionalLegalContext: 'Article 21 (Right to Speedy Justice), Supreme Court AI Committee initiatives (SUPACE, SUVAS).',
        challengesAndIssues: 'Algorithmic bias, digital divide among litigants and rural advocates, data security, and preservation of open justice principles.',
        judicialPrecedents: 'Swapnil Tripathi v. Supreme Court of India (Live Streaming of court proceedings as part of Art 21 and 19(1)(a)).',
        recommendationsWayForward: 'Hybrid court infrastructure, AI for translation, case docket management, automatic summons serving, while preserving human judicial reasoning.',
        conclusion: 'Technology must serve as an amplifier of justice, not a surrogate for human empathy and constitutional discernment.'
      },
      keyLegalCitations: ['e-Courts Project Phase III', 'Article 21 Speedy Trial', 'Swapnil Tripathi (2018)', 'SUPACE & SUVAS Portals'],
      modelContent: `With over four crore cases pending across the Indian judicial hierarchy, the integration of Artificial Intelligence (AI) and modern digital infrastructure has shifted from an administrative convenience to an existential constitutional imperative. Under the aegis of the e-Courts Mission Mode Project, Indian courts are witnessing an epochal paradigm shift aimed at operationalizing the promise of accessible, expeditious justice enshrined in Article 21.

The induction of AI tools presents transformative advantages for court registries and judicial officers. Specialized neural translation engines like SUVAS (Supreme Court Vidhik Anuvaad Software) translate judgments and pleadings from English into regional vernacular languages, democratizing access to justice for common litigants. Concurrently, assistive systems like SUPACE (Supreme Court Portal for Assistance in Court's Efficiency) aggregate case facts, highlight statutory contradictions, and streamline case management. In High Court registries, automated scrutiny engines can instantly identify defect filings, verify court fees, and optimize cause-list generation, drastically curtailing administrative delays.

Nevertheless, the deployment of AI in adjudication demands constitutional vigilance. Algorithmic bias, opaque decision-making ('black-box' systems), and the pervasive digital divide across tier-two and tier-three legal fraternities pose acute challenges. Crucially, algorithmic assistance must never substitute for human judicial judgment, particularly in sentencing, assessing witness demeanor, and evaluating discretionary equities.

As the High Court of Kerala pioneered paperless digital courts and automated e-filing systems, the trajectory is unequivocal. The future of judicial administration lies in a judicious synthesis: leveraging artificial intelligence for routine workflow optimization while anchoring core adjudicative sovereignty firmly in human conscience and constitutional jurisprudence.`
    }
  ];

  // =========================================================================
  // 5. PRÉCIS WRITING MASTER CLASS: SOLVED HIGH COURT EXERCISES
  // =========================================================================
  readonly precisExercises: PrecisExercise[] = [
    {
      id: 'precis-1',
      title: 'The Independence of the Judiciary and Constitutional Democracy',
      sourceExam: 'High Court of Kerala Assistant Official Descriptive Paper',
      originalWords: 186,
      targetWordsRange: '60 - 65 words',
      suggestedTitles: [
        'Independence of the Judiciary: Bedrock of Democracy',
        'Judicial Independence and the Rule of Law',
        'Guardians of Constitutional Liberty'
      ],
      originalText: `The independence of the judiciary is not an ornament for the embellishment of democratic institutions, nor is it a privilege created for the benefit of judges themselves. It is the cardinal condition without which the rule of law cannot survive in any civilized state. In a constitutional democracy governed by a written charter, laws are passed by the legislature and executed by the executive. Inevitably, conflicts arise between citizens and the state, or between competing organs of governance. If the judiciary were subordinate to political masters or vulnerable to popular whims, the rights of vulnerable minorities would be compromised and constitutional guarantees reduced to dead letters. A judge must be insulated from financial dependence, executive retribution, and populist hysteria so that justice can be administered without fear or favor. The public faith in the integrity of the courts is the real sanction behind judicial decrees. When judicial independence is weakened, democracy degenerates into elected authoritarianism, because liberty requires an impartial arbiter who speaks truth to power with institutional fortitude.`,
      modelWords: 62,
      modelPrecis: `Judicial independence is essential for sustaining the rule of law and safeguarding constitutional democracy, rather than being a judicial privilege. An autonomous judiciary resolves disputes impartially between citizens and the state without fear of executive interference or public pressure. Preserving judges from retribution inspires public trust, preventing democratic governance from degenerating into authoritarianism through fearless enforcement of constitutional rights.`,
      keyPointsPreserved: [
        'Judicial independence is vital for rule of law, not a privilege of judges.',
        'Impartial dispute resolution between citizens and executive.',
        'Shielding judges maintains public confidence and prevents authoritarianism.'
      ],
      commonMistakesToAvoid: [
        'Copying sentences verbatim from the passage (deducts up to 50% marks).',
        'Omitting a suitable title (carries 2 to 3 distinct marks in High Court marking scheme).',
        'Exceeding or falling below the 1/3rd word count threshold by more than 5 words.',
        'Writing in the first person ("I think", "in my opinion"). Always use neutral, indirect speech.'
      ]
    },
    {
      id: 'precis-2',
      title: 'Alternative Dispute Resolution (ADR) and Civil Justice Administration',
      sourceExam: 'Kerala High Court Descriptive Test Model Paper',
      originalWords: 195,
      targetWordsRange: '62 - 68 words',
      suggestedTitles: [
        'Alternative Dispute Resolution: A Catalyst for Speedy Justice',
        'Transforming Civil Justice through Mediation and Arbitration',
        'The Promise of ADR in Indian Courts'
      ],
      originalText: `The formal court system in India, characterized by rigid procedural technicalities, adversarial litigation, and protracted appeals, has led to severe congestion in judicial dockets. Litigants often spend decades pursuing justice, resulting in financial ruin and psychological distress. In this backdrop, Alternative Dispute Resolution (ADR) mechanisms—such as arbitration, conciliation, mediation, and Lok Adalats—offer an indispensable panacea. Section 89 of the Code of Civil Procedure mandates courts to explore non-adversarial settlements where elements of compromise exist. Unlike traditional court battles that end in a winner-takes-all verdict, mediation focuses on consensus, confidentiality, and preserving commercial or familial relationships. Furthermore, Lok Adalats have disposed of millions of petty disputes without court fees, rendering final settlements against which no appeal lies. Embracing ADR does not undermine the authority of formal courts; rather, it decongests dockets so that judges can dedicate sufficient attention to intricate constitutional and statutory questions. A robust ADR ecosystem transforms justice from a distant, expensive privilege into an expeditious reality for common citizens.`,
      modelWords: 64,
      modelPrecis: `Severe court congestion caused by rigid procedures and prolonged appeals necessitates Alternative Dispute Resolution mechanisms. Enforced under Section 89 CPC, processes like arbitration, mediation, and Lok Adalats resolve disputes confidentially, economically, and collaboratively. By fostering mutual consensus and final settlements, ADR preserves relationships and unburdens formal courts, enabling judges to focus on complex constitutional questions while delivering accessible justice.`,
      keyPointsPreserved: [
        'Court congestion caused by procedural technicalities.',
        'ADR (Section 89 CPC, mediation, Lok Adalats) provides accessible, confidential resolution.',
        'Decongests formal courts to prioritize constitutional matters.'
      ],
      commonMistakesToAvoid: [
        'Inserting personal legal knowledge not present in the original text.',
        'Missing Section 89 CPC reference which was explicitly highlighted.'
      ]
    }
  ];

  // =========================================================================
  // 6. HIGH COURT MULTI-POST PREPARATION PATHS & OFFICIAL PATTERNS
  // =========================================================================
  readonly highCourtPosts: HighCourtPostPlan[] = [
    {
      postId: 'hck-assistant',
      postTitle: 'High Court Assistant (HCA)',
      department: 'High Court Establishment, Ernakulam',
      cadre: 'Category 1 - Direct Recruitment',
      payScale: '₹ 39,300 - 83,000 (Scale of Pay)',
      eligibility: 'Bachelor\'s Degree in any discipline with at least 50% marks from a recognized university. Computer knowledge required.',
      ageLimit: '18 - 36 years (Concessions for SC/ST/OBC and Court Service candidates as per rules)',
      selectionStages: [
        {
          stageNumber: 1,
          stageName: 'Objective Written Test',
          totalMarks: 100,
          duration: '75 Minutes (1 hr 15 mins)',
          details: '100 OMR-based MCQs. Part A: General English (50 M), Part B: GK & Constitution (40 M), Part C: Basic Math & Reasoning (10 M).',
          negativeMarking: '0.25 negative marks for each incorrect answer.'
        },
        {
          stageNumber: 2,
          stageName: 'Descriptive Written Examination',
          totalMarks: 60,
          duration: '60 Minutes (Conducted immediately after Objective Test)',
          details: 'Written English paper: Précis Writing, English Comprehension, and Essay Writing. Evaluated only for candidates securing minimum cutoff in Objective test.',
          negativeMarking: 'No negative marking; subjective rubric scoring.'
        },
        {
          stageNumber: 3,
          stageName: 'Interview / Viva-Voce',
          totalMarks: 10,
          duration: '15 - 20 Minutes per candidate',
          details: 'Conducted before High Court Judges/Committee. Minimum cutoff 35% (3.5 marks). Final rank list based on Stage 2 (60 M) + Stage 3 (10 M) = 70 Marks.',
          negativeMarking: 'N/A'
        }
      ],
      subjectWeightage: [
        { subject: 'Part A: General English (Grammar & Vocabulary)', marks: 50, percentage: 50 },
        { subject: 'Part B: Indian Constitution & General Knowledge', marks: 40, percentage: 40 },
        { subject: 'Part C: Basic Mathematics & Reasoning', marks: 10, percentage: 10 }
      ],
      studyPlan60Days: [
        { phase: 'Phase 1: Foundation', days: 'Days 1 - 20', focus: 'English Grammar (Prepositions, Tenses, Concord) + Indian Constitution Articles 1-51A & Writs', recommendedActions: 'Complete 30 topics in Syllabus Tracker; practice 20 MCQs daily.' },
        { phase: 'Phase 2: Core Mastery', days: 'Days 21 - 40', focus: 'High Court Rules, Kerala Geography/Current Affairs + Descriptive Précis Rules', recommendedActions: 'Take 2 Full Mock Tests weekly; draft 1 précis and 1 essay every 3 days.' },
        { phase: 'Phase 3: High-Intensity Simulation', days: 'Days 41 - 60', focus: 'Full-length 75-min timed simulations, Sectional Speed Drills & Question Palette review', recommendedActions: 'Simulate 100-question timed exams with negative marking; analyze weak areas.' }
      ]
    },
    {
      postId: 'hck-munsiff-magistrate',
      postTitle: 'Kerala Judicial Service (Munsiff-Magistrate)',
      department: 'Subordinate Judicial Service of Kerala',
      cadre: 'Gazetted Judicial Service',
      payScale: '₹ 77,840 - 1,36,520 (Revised National Judicial Pay Commission)',
      eligibility: 'Degree in Law (LL.B / B.A. LL.B) recognized by Bar Council of India. Active enrollment as an Advocate.',
      ageLimit: 'Up to 35 years (Relaxable up to 38 for OBC, 40 for SC/ST)',
      selectionStages: [
        {
          stageNumber: 1,
          stageName: 'Preliminary Examination (Screening)',
          totalMarks: 100,
          duration: '2 Hours (120 Minutes)',
          details: '100 MCQs covering Part A (Substantive Law: Constitution, IPC, Contract, Torts), Part B (Procedural Law: CPC, CrPC, Evidence), Part C (Kerala Local Laws).',
          negativeMarking: '0.33 negative marking per wrong answer.'
        },
        {
          stageNumber: 2,
          stageName: 'Main Written Examination',
          totalMarks: 400,
          duration: '4 Papers of 3 Hours each',
          details: 'Paper I (English & Translation 100 M), Paper II (Civil Law I 100 M), Paper III (Civil Law II 100 M), Paper IV (Criminal Law 100 M).',
          negativeMarking: 'Subjective legal problem solving and judgment writing.'
        },
        {
          stageNumber: 3,
          stageName: 'Viva-Voce / Interview',
          totalMarks: 50,
          duration: 'Judicial interview at High Court',
          details: 'Evaluates legal acumen, character, and suitability for magisterial office.',
          negativeMarking: 'N/A'
        }
      ],
      subjectWeightage: [
        { subject: 'Substantive Civil & Criminal Law', marks: 45, percentage: 45 },
        { subject: 'Procedural Law (CPC, CrPC, Evidence)', marks: 40, percentage: 40 },
        { subject: 'Local Acts (Kerala Building Lease, Land Reforms)', marks: 15, percentage: 15 }
      ],
      studyPlan60Days: [
        { phase: 'Phase 1: Bare Acts', days: 'Days 1 - 25', focus: 'Thorough bare act readings of CPC, CrPC, Evidence, IPC, Contract Act', recommendedActions: 'Memorize sections, key provisos, and landmark Supreme Court ratios.' },
        { phase: 'Phase 2: Local Acts & Procedural Details', days: 'Days 26 - 45', focus: 'Kerala Buildings (Lease and Rent Control) Act, Specific Relief, Transfer of Property', recommendedActions: 'Solve 10 years of Munsiff-Magistrate prelims papers.' },
        { phase: 'Phase 3: Speed & Judgment Writing', days: 'Days 46 - 60', focus: 'Case-problem solving, framing of issues, and charge drafting', recommendedActions: 'Timed mock tests with negative marking; legal drafting exercises.' }
      ]
    },
    {
      postId: 'hck-clerk-typist',
      postTitle: 'Court Clerk & Typist / Confidential Assistant',
      department: 'High Court Subordinate Services',
      cadre: 'Category 3 - Ministerial Staff',
      payScale: '₹ 27,900 - 63,700',
      eligibility: 'Degree in any discipline + KGTE in Typewriting (English) Lower/Higher. Computer Office Automation Certification.',
      ageLimit: '18 - 36 years',
      selectionStages: [
        {
          stageNumber: 1,
          stageName: 'Objective Written Test',
          totalMarks: 100,
          duration: '75 Minutes',
          details: 'General English (30 M), Computer Knowledge & Office Automation (40 M), General Knowledge & Current Affairs (30 M).',
          negativeMarking: '0.25 negative marks per incorrect answer.'
        },
        {
          stageNumber: 2,
          stageName: 'Typing & Speed Test',
          totalMarks: 100,
          duration: '10 Minutes Speed Test',
          details: 'English typing test at 40 words per minute on computerized keyboard with error threshold.',
          negativeMarking: 'Penalty for omission and spelling inaccuracies.'
        }
      ],
      subjectWeightage: [
        { subject: 'Computer Knowledge & Automation', marks: 40, percentage: 40 },
        { subject: 'General English & Vocabulary', marks: 30, percentage: 30 },
        { subject: 'GK & Constitution Basics', marks: 30, percentage: 30 }
      ],
      studyPlan60Days: [
        { phase: 'Phase 1', days: 'Days 1 - 20', focus: 'Computer hardware, MS Office shortcuts, keyboard architecture, and basic English grammar', recommendedActions: 'Daily 30 minutes typing practice + computer awareness quiz.' },
        { phase: 'Phase 2', days: 'Days 21 - 40', focus: 'Kerala GK, High Court history, operating systems, networking fundamentals', recommendedActions: 'Speed drill quizzes; daily 40 wpm typing passages.' },
        { phase: 'Phase 3', days: 'Days 41 - 60', focus: 'Full objective mock papers + timed error-free typing exercises', recommendedActions: 'Simulate full exam conditions.' }
      ]
    },
    {
      postId: 'hck-stenographer',
      postTitle: 'Stenographer Grade II (High Court Registry)',
      department: 'High Court Judicial & Confidential Registry',
      cadre: 'Stenographic Cadre',
      payScale: '₹ 39,300 - 83,000',
      eligibility: 'Bachelor\'s Degree + KGTE in Shorthand (English) Higher & Typewriting (English) Higher.',
      ageLimit: '18 - 36 years',
      selectionStages: [
        {
          stageNumber: 1,
          stageName: 'Dictation & Shorthand Test',
          totalMarks: 100,
          duration: '5 Mins Dictation at 80-100 wpm + 45 Mins Transcription',
          details: 'Legal judgment passage dictation followed by computerized transcription.',
          negativeMarking: 'Deduction for shorthand inaccuracies and spelling errors.'
        },
        {
          stageNumber: 2,
          stageName: 'General English & Legal Terminology Test',
          totalMarks: 50,
          duration: '45 Minutes',
          details: 'Punctuation, spelling of legal terms, syntax, and sentence correction.',
          negativeMarking: '0.25 negative marks.'
        }
      ],
      subjectWeightage: [
        { subject: 'Shorthand Transcription & Accuracy', marks: 70, percentage: 70 },
        { subject: 'English Grammar & Legal Spelling', marks: 30, percentage: 30 }
      ],
      studyPlan60Days: [
        { phase: 'Phase 1', days: 'Days 1 - 20', focus: 'Legal shorthand outlines, legal maxims, court judgment dictations', recommendedActions: 'Daily 4 passages shorthand practice.' },
        { phase: 'Phase 2', days: 'Days 21 - 40', focus: 'Speed building (80 to 100 wpm) + English punctuation and vocabulary', recommendedActions: 'Timed transcription drills.' },
        { phase: 'Phase 3', days: 'Days 41 - 60', focus: 'Full simulation of dictation and computer transcription tests', recommendedActions: 'Review error rates and verify legal terminology.' }
      ]
    }
  ];

  // =========================================================================
  // 7. INTERACTIVE REVISION FLASHCARDS
  // =========================================================================
  readonly flashcards: FlashcardItem[] = [
    {
      id: 'fc-1',
      category: 'Indian Constitution',
      questionOrPrompt: 'Which Article empowers the High Court to issue writs for the enforcement of Fundamental Rights and for any other purpose?',
      answerOrExplanation: 'Article 226 of the Constitution of India. It has broader scope than Article 32 (Supreme Court) as it includes "for any other purpose" (legal rights).',
      citationOrSection: 'Constitution Art. 226'
    },
    {
      id: 'fc-2',
      category: 'Indian Constitution',
      questionOrPrompt: 'What is the retirement age of a High Court Judge versus a Supreme Court Judge in India?',
      answerOrExplanation: 'A High Court Judge retires at 62 years (Article 217(1)). A Supreme Court Judge retires at 65 years (Article 124(2)).',
      citationOrSection: 'Art. 217(1) & Art. 124(2)'
    },
    {
      id: 'fc-3',
      category: 'Legal Maxims',
      questionOrPrompt: 'What does the Latin maxim "Audi Alteram Partem" translate to, and what constitutional principle does it represent?',
      answerOrExplanation: '"Hear the other side / No one should be condemned unheard." It is the cornerstone of Natural Justice (Article 14 & 21 procedural fairness).',
      citationOrSection: 'Natural Justice Principle'
    },
    {
      id: 'fc-4',
      category: 'Civil Procedure Code',
      questionOrPrompt: 'Which section of the Code of Civil Procedure, 1908 incorporates the doctrine of Res Judicata?',
      answerOrExplanation: 'Section 11 of the CPC. It bars courts from trying any suit or issue in which the matter directly and substantially in issue has been heard and finally decided.',
      citationOrSection: 'Section 11 CPC'
    },
    {
      id: 'fc-5',
      category: 'Criminal Procedure',
      questionOrPrompt: 'Which landmark Supreme Court decision made the registration of an FIR mandatory under Section 154 CrPC for cognizable offenses?',
      answerOrExplanation: 'Lalita Kumari v. Government of Uttar Pradesh (2014) 2 SCC 1, by a 5-Judge Constitution Bench.',
      citationOrSection: 'Lalita Kumari (2014)'
    },
    {
      id: 'fc-6',
      category: 'Evidence Act / BSA',
      questionOrPrompt: 'What is the legal validity of a confession made to a police officer under the Indian Evidence Act?',
      answerOrExplanation: 'Under Section 25, a confession made to a police officer cannot be proved against an accused. Under Section 26, it is inadmissible unless made in the immediate presence of a Magistrate.',
      citationOrSection: 'Section 25 & 26 IEA'
    },
    {
      id: 'fc-7',
      category: 'Kerala High Court Facts',
      questionOrPrompt: 'When was the High Court of Kerala inaugurated, and what territories does its territorial jurisdiction cover?',
      answerOrExplanation: 'Inaugurated on 1st November 1956 at Ernakulam (Kochi). Its territorial jurisdiction encompasses the State of Kerala and the Union Territory of Lakshadweep.',
      citationOrSection: 'Kerala High Court Act 1958'
    },
    {
      id: 'fc-8',
      category: 'Constitutional Amendments',
      questionOrPrompt: 'Which Constitutional Amendment Act introduced 10% reservation for Economically Weaker Sections (EWS)?',
      answerOrExplanation: '103rd Constitutional Amendment Act, 2019 (added Article 15(6) and Article 16(6)), upheld in Janhit Abhiyan v. Union of India (2022).',
      citationOrSection: '103rd Amendment 2019'
    }
  ];

  // Helper getters
  getAllLegalTopics(): LegalConceptTopic[] {
    return this.legalTopics;
  }

  getLandmarkJudgments(): LandmarkJudgment[] {
    return this.landmarkJudgments;
  }

  getLegalMaxims(): LegalMaxim[] {
    return this.legalMaxims;
  }

  getModelEssays(): DescriptiveEssayModel[] {
    return this.modelEssays;
  }

  getPrecisExercises(): PrecisExercise[] {
    return this.precisExercises;
  }

  getHighCourtPosts(): HighCourtPostPlan[] {
    return this.highCourtPosts;
  }

  getFlashcards(): FlashcardItem[] {
    return this.flashcards;
  }
}
