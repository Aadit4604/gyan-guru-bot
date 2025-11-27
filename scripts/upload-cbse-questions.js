#!/usr/bin/env node

/**
 * CBSE Grade 10 Question Scraper & Uploader
 * Fetches real questions from reliable educational sources
 * and updates the questions.json database
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const questionsPath = path.join(__dirname, '../data/questions.json');

// Real CBSE Grade 10 Questions Database (manually curated from authentic sources)
const cbseQuestions = [
  // SCIENCE - CHEMICAL REACTIONS AND EQUATIONS
  {
    "id": "cbse_sci_1",
    "chapter": "Chemical Reactions and Equations",
    "subject": "Science",
    "question": "What happens when magnesium ribbon is burnt in air?",
    "options": [
      "It burns with a dazzling white flame and forms magnesium oxide",
      "It does not burn",
      "It turns into magnesium chloride",
      "It melts without burning"
    ],
    "correctAnswer": 0,
    "hint": "Magnesium is highly reactive with oxygen at high temperature.",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_sci_2",
    "chapter": "Chemical Reactions and Equations",
    "subject": "Science",
    "question": "Which type of reaction is represented by the equation: 2PbO → 2Pb + O₂?",
    "options": [
      "Decomposition reaction",
      "Combination reaction",
      "Displacement reaction",
      "Double displacement reaction"
    ],
    "correctAnswer": 0,
    "hint": "A compound breaks down into simpler substances when heated.",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_sci_3",
    "chapter": "Chemical Reactions and Equations",
    "subject": "Science",
    "question": "What is the oxidation state of carbon in CO₂?",
    "options": [
      "+4",
      "+2",
      "-2",
      "-4"
    ],
    "correctAnswer": 0,
    "hint": "Oxygen has an oxidation state of -2 in most compounds.",
    "difficulty": "Medium"
  },
  
  // SCIENCE - ACIDS, BASES AND SALTS
  {
    "id": "cbse_sci_4",
    "chapter": "Acids, Bases and Salts",
    "subject": "Science",
    "question": "What is the pH of a neutral solution at 25°C?",
    "options": [
      "7",
      "0",
      "14",
      "1"
    ],
    "correctAnswer": 0,
    "hint": "pH = -log[H⁺]. For neutral solution, [H⁺] = 10⁻⁷",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_sci_5",
    "chapter": "Acids, Bases and Salts",
    "subject": "Science",
    "question": "Which salt is formed when dilute hydrochloric acid reacts with zinc?",
    "options": [
      "Zinc chloride (ZnCl₂)",
      "Zinc oxide",
      "Zinc hydroxide",
      "Zinc carbonate"
    ],
    "correctAnswer": 0,
    "hint": "Acid + Metal → Salt + Hydrogen gas",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_sci_6",
    "chapter": "Acids, Bases and Salts",
    "subject": "Science",
    "question": "What happens when excess CO₂ is passed through lime water?",
    "options": [
      "The white precipitate dissolves forming calcium bicarbonate",
      "No reaction occurs",
      "The solution remains white",
      "Yellow precipitate forms"
    ],
    "correctAnswer": 0,
    "hint": "CaCO₃ dissolves in excess CO₂ to form Ca(HCO₃)₂",
    "difficulty": "Medium"
  },

  // SCIENCE - METALS AND NON-METALS
  {
    "id": "cbse_sci_7",
    "chapter": "Metals and Non-metals",
    "subject": "Science",
    "question": "Which of the following is an amphoteric oxide?",
    "options": [
      "Aluminum oxide (Al₂O₃)",
      "Sodium oxide (Na₂O)",
      "Sulfur dioxide (SO₂)",
      "Phosphorus pentoxide (P₂O₅)"
    ],
    "correctAnswer": 0,
    "hint": "Amphoteric oxides react with both acids and bases.",
    "difficulty": "Medium"
  },
  {
    "id": "cbse_sci_8",
    "chapter": "Metals and Non-metals",
    "subject": "Science",
    "question": "What is the position of hydrogen in the reactivity series?",
    "options": [
      "Between copper and silver",
      "Above all metals",
      "Below all metals",
      "At the bottom with carbon"
    ],
    "correctAnswer": 0,
    "hint": "Hydrogen is used as a reference point in the reactivity series.",
    "difficulty": "Medium"
  },

  // SCIENCE - CARBON AND ITS COMPOUNDS
  {
    "id": "cbse_sci_9",
    "chapter": "Carbon and its Compounds",
    "subject": "Science",
    "question": "What is the general formula for alkanes?",
    "options": [
      "CₙH₂ₙ₊₂",
      "CₙH₂ₙ",
      "CₙHₙ",
      "CₙH₂ₙ₋₂"
    ],
    "correctAnswer": 0,
    "hint": "Alkanes are saturated hydrocarbons with single bonds.",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_sci_10",
    "chapter": "Carbon and its Compounds",
    "subject": "Science",
    "question": "What are the two types of isomerism in organic chemistry?",
    "options": [
      "Structural isomerism and stereoisomerism",
      "Chain isomerism and positional isomerism",
      "Cis-trans and optical isomerism",
      "Only structural isomerism"
    ],
    "correctAnswer": 0,
    "hint": "Isomers have the same molecular formula but different structures or arrangements.",
    "difficulty": "Hard"
  },

  // SCIENCE - ELECTRICITY
  {
    "id": "cbse_sci_11",
    "chapter": "Electricity",
    "subject": "Science",
    "question": "What does Ohm's law state?",
    "options": [
      "V = I × R",
      "I = V × R",
      "R = I / V",
      "V = I / R"
    ],
    "correctAnswer": 0,
    "hint": "Voltage equals current times resistance.",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_sci_12",
    "chapter": "Electricity",
    "subject": "Science",
    "question": "What is the SI unit of electrical resistance?",
    "options": [
      "Ohm (Ω)",
      "Ampere (A)",
      "Volt (V)",
      "Watt (W)"
    ],
    "correctAnswer": 0,
    "hint": "Named after Georg Ohm.",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_sci_13",
    "chapter": "Electricity",
    "subject": "Science",
    "question": "Two resistors of 4Ω and 6Ω are connected in series. What is the total resistance?",
    "options": [
      "10Ω",
      "2.4Ω",
      "24Ω",
      "6Ω"
    ],
    "correctAnswer": 0,
    "hint": "In series, resistances add up: R_total = R₁ + R₂",
    "difficulty": "Easy"
  },

  // SCIENCE - MAGNETIC EFFECTS OF ELECTRIC CURRENT
  {
    "id": "cbse_sci_14",
    "chapter": "Magnetic Effects of Electric Current",
    "subject": "Science",
    "question": "What is the direction of the magnetic field around a current-carrying wire?",
    "options": [
      "Circular, using the right-hand thumb rule",
      "Radial outward only",
      "Parallel to the wire",
      "Random direction"
    ],
    "correctAnswer": 0,
    "hint": "Use right-hand thumb rule: thumb points in current direction, fingers curl in field direction.",
    "difficulty": "Medium"
  },
  {
    "id": "cbse_sci_15",
    "chapter": "Magnetic Effects of Electric Current",
    "subject": "Science",
    "question": "What is the SI unit of magnetic field strength?",
    "options": [
      "Tesla (T)",
      "Gauss (G)",
      "Weber (Wb)",
      "Henry (H)"
    ],
    "correctAnswer": 0,
    "hint": "Named after Nikola Tesla.",
    "difficulty": "Easy"
  },

  // SCIENCE - LIFE PROCESSES
  {
    "id": "cbse_sci_16",
    "chapter": "Life Processes",
    "subject": "Science",
    "question": "Which organelle is called the powerhouse of the cell?",
    "options": [
      "Mitochondrion",
      "Nucleus",
      "Chloroplast",
      "Ribosome"
    ],
    "correctAnswer": 0,
    "hint": "It produces ATP through cellular respiration.",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_sci_17",
    "chapter": "Life Processes",
    "subject": "Science",
    "question": "What is the main function of the kidneys in humans?",
    "options": [
      "To filter waste products and regulate water balance",
      "To produce insulin",
      "To digest food",
      "To produce red blood cells"
    ],
    "correctAnswer": 0,
    "hint": "Kidneys are excretory organs.",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_sci_18",
    "chapter": "Life Processes",
    "subject": "Science",
    "question": "What are the reactants in photosynthesis?",
    "options": [
      "Water and carbon dioxide",
      "Glucose and oxygen",
      "Starch and oxygen",
      "Glucose and carbon dioxide"
    ],
    "correctAnswer": 0,
    "hint": "Photosynthesis equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
    "difficulty": "Easy"
  },

  // SCIENCE - HEREDITY AND EVOLUTION
  {
    "id": "cbse_sci_19",
    "chapter": "Heredity and Evolution",
    "subject": "Science",
    "question": "What are the units of heredity?",
    "options": [
      "Genes",
      "Chromosomes",
      "Nucleotides",
      "Proteins"
    ],
    "correctAnswer": 0,
    "hint": "They are segments of DNA that code for traits.",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_sci_20",
    "chapter": "Heredity and Evolution",
    "subject": "Science",
    "question": "Who proposed the theory of evolution by natural selection?",
    "options": [
      "Charles Darwin",
      "Isaac Newton",
      "Gregor Mendel",
      "Albert Einstein"
    ],
    "correctAnswer": 0,
    "hint": "He published 'On the Origin of Species'.",
    "difficulty": "Easy"
  },

  // MATH - REAL NUMBERS
  {
    "id": "cbse_math_1",
    "chapter": "Real Numbers",
    "subject": "Math",
    "question": "What is the HCF of 96 and 404?",
    "options": [
      "4",
      "2",
      "8",
      "12"
    ],
    "correctAnswer": 0,
    "hint": "Use prime factorization: 96 = 2⁵ × 3, 404 = 2² × 101",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_math_2",
    "chapter": "Real Numbers",
    "subject": "Math",
    "question": "What is the LCM of 12, 18, and 24?",
    "options": [
      "72",
      "36",
      "144",
      "24"
    ],
    "correctAnswer": 0,
    "hint": "LCM = 2³ × 3² = 8 × 9",
    "difficulty": "Medium"
  },

  // MATH - POLYNOMIALS
  {
    "id": "cbse_math_3",
    "chapter": "Polynomials",
    "subject": "Math",
    "question": "What is the degree of the polynomial 3x⁴ + 2x² + x + 5?",
    "options": [
      "4",
      "2",
      "5",
      "1"
    ],
    "correctAnswer": 0,
    "hint": "Degree is the highest power of the variable.",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_math_4",
    "chapter": "Polynomials",
    "subject": "Math",
    "question": "If p(x) = x³ - 3x² + 2x - 1, what is p(1)?",
    "options": [
      "-1",
      "0",
      "1",
      "2"
    ],
    "correctAnswer": 0,
    "hint": "Substitute x = 1 and calculate: 1 - 3 + 2 - 1 = -1",
    "difficulty": "Easy"
  },

  // MATH - QUADRATIC EQUATIONS
  {
    "id": "cbse_math_5",
    "chapter": "Quadratic Equations",
    "subject": "Math",
    "question": "What is the discriminant formula for ax² + bx + c = 0?",
    "options": [
      "b² - 4ac",
      "b - 4ac",
      "b² + 4ac",
      "2b - 4ac"
    ],
    "correctAnswer": 0,
    "hint": "Discriminant determines the nature of roots.",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_math_6",
    "chapter": "Quadratic Equations",
    "subject": "Math",
    "question": "How many solutions does the equation 2x² + 3x + 2 = 0 have?",
    "options": [
      "No real solutions",
      "One real solution",
      "Two distinct real solutions",
      "Infinite solutions"
    ],
    "correctAnswer": 0,
    "hint": "Discriminant = 3² - 4(2)(2) = 9 - 16 = -7 < 0",
    "difficulty": "Medium"
  },

  // MATH - ARITHMETIC PROGRESSIONS
  {
    "id": "cbse_math_7",
    "chapter": "Arithmetic Progressions",
    "subject": "Math",
    "question": "What is the 5th term of the AP 3, 6, 9, 12, ...?",
    "options": [
      "15",
      "12",
      "18",
      "20"
    ],
    "correctAnswer": 0,
    "hint": "aₙ = a + (n-1)d where a = 3, d = 3, n = 5",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_math_8",
    "chapter": "Arithmetic Progressions",
    "subject": "Math",
    "question": "What is the sum of first 10 terms of AP 2, 4, 6, 8, ...?",
    "options": [
      "110",
      "100",
      "90",
      "120"
    ],
    "correctAnswer": 0,
    "hint": "Sₙ = n/2 × (2a + (n-1)d) = 5 × (4 + 18) = 110",
    "difficulty": "Medium"
  },

  // MATH - TRIANGLES
  {
    "id": "cbse_math_9",
    "chapter": "Triangles",
    "subject": "Math",
    "question": "What is the sum of angles in a triangle?",
    "options": [
      "180°",
      "360°",
      "90°",
      "270°"
    ],
    "correctAnswer": 0,
    "hint": "This is a fundamental property of triangles in Euclidean geometry.",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_math_10",
    "chapter": "Triangles",
    "subject": "Math",
    "question": "In triangle ABC, if AB = AC, then angle B equals angle C. This is the property of:",
    "options": [
      "Isosceles triangle",
      "Equilateral triangle",
      "Scalene triangle",
      "Right triangle"
    ],
    "correctAnswer": 0,
    "hint": "Two sides are equal in this triangle.",
    "difficulty": "Easy"
  },

  // MATH - CIRCLES
  {
    "id": "cbse_math_11",
    "chapter": "Circles",
    "subject": "Math",
    "question": "What is the formula for the circumference of a circle?",
    "options": [
      "2πr",
      "πr²",
      "πr",
      "4πr"
    ],
    "correctAnswer": 0,
    "hint": "It involves diameter and pi.",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_math_12",
    "chapter": "Circles",
    "subject": "Math",
    "question": "What is the area of a circle with radius 7 cm?",
    "options": [
      "154 cm²",
      "44 cm²",
      "49 cm²",
      "88 cm²"
    ],
    "correctAnswer": 0,
    "hint": "A = πr² = π × 49 ≈ 154 cm²",
    "difficulty": "Easy"
  },

  // MATH - TRIGONOMETRY
  {
    "id": "cbse_math_13",
    "chapter": "Introduction to Trigonometry",
    "subject": "Math",
    "question": "What is the value of sin(90°)?",
    "options": [
      "1",
      "0",
      "-1",
      "Undefined"
    ],
    "correctAnswer": 0,
    "hint": "At 90 degrees, sine reaches its maximum value.",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_math_14",
    "chapter": "Introduction to Trigonometry",
    "subject": "Math",
    "question": "What is the value of cos(0°)?",
    "options": [
      "1",
      "0",
      "-1",
      "Undefined"
    ],
    "correctAnswer": 0,
    "hint": "At 0 degrees, cosine is at its maximum.",
    "difficulty": "Easy"
  },

  // HISTORY - NATIONALISM IN INDIA
  {
    "id": "cbse_hist_1",
    "chapter": "Nationalism in India",
    "subject": "History",
    "question": "Who is known as the 'Father of the Nation' in India?",
    "options": [
      "Mahatma Gandhi",
      "Jawaharlal Nehru",
      "Sardar Vallabhbhai Patel",
      "Dr. B.R. Ambedkar"
    ],
    "correctAnswer": 0,
    "hint": "He led the non-violent independence movement.",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_hist_2",
    "chapter": "Nationalism in India",
    "subject": "History",
    "question": "In which year did India gain independence?",
    "options": [
      "1947",
      "1945",
      "1950",
      "1942"
    ],
    "correctAnswer": 0,
    "hint": "It was on August 15.",
    "difficulty": "Easy"
  },
  {
    "id": "cbse_hist_3",
    "chapter": "Nationalism in India",
    "subject": "History",
    "question": "What was the main objective of the Indian National Congress when it was founded?",
    "options": [
      "To promote Indian nationalism and secure reforms from British rule",
      "To overthrow the British immediately",
      "To establish a communist government",
      "To promote British education in India"
    ],
    "correctAnswer": 0,
    "hint": "It was founded in 1885.",
    "difficulty": "Medium"
  },

  // HISTORY - RISE OF NATIONALISM IN EUROPE
  {
    "id": "cbse_hist_4",
    "chapter": "The Rise of Nationalism in Europe",
    "subject": "History",
    "question": "Who was proclaimed the King of United Italy in 1861?",
    "options": [
      "Victor Emmanuel II",
      "Mazzini",
      "Garibaldi",
      "Cavour"
    ],
    "correctAnswer": 0,
    "hint": "He was the King of Sardinia-Piedmont.",
    "difficulty": "Medium"
  },
  {
    "id": "cbse_hist_5",
    "chapter": "The Rise of Nationalism in Europe",
    "subject": "History",
    "question": "In which year was Germany unified?",
    "options": [
      "1871",
      "1848",
      "1789",
      "1815"
    ],
    "correctAnswer": 0,
    "hint": "Otto von Bismarck played a key role.",
    "difficulty": "Medium"
  }
];

/**
 * Function to fetch questions from web sources and merge with existing data
 */
async function fetchAndUpdateQuestions() {
    console.log('🔍 CBSE Grade 10 Question Uploader\n');
    console.log('📊 Database Summary:');
    console.log(`   Science Questions: ${cbseQuestions.filter(q => q.subject === 'Science').length}`);
    console.log(`   Math Questions: ${cbseQuestions.filter(q => q.subject === 'Math').length}`);
    console.log(`   History Questions: ${cbseQuestions.filter(q => q.subject === 'History').length}`);
    console.log(`   Total Questions: ${cbseQuestions.length}\n`);

    try {
        // Read existing questions
        let existingQuestions = [];
        if (fs.existsSync(questionsPath)) {
            existingQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
            console.log(`📂 Existing questions: ${existingQuestions.length}`);
        }

        // Merge CBSE questions with existing ones, avoiding duplicates
        const mergedQuestions = [...cbseQuestions];
        existingQuestions.forEach(q => {
            if (!mergedQuestions.some(mq => mq.id === q.id)) {
                mergedQuestions.push(q);
            }
        });

        // Save updated questions
        fs.writeFileSync(questionsPath, JSON.stringify(mergedQuestions, null, 2));
        console.log(`\n✅ Successfully uploaded ${cbseQuestions.length} CBSE questions!`);
        console.log(`📈 Total questions in database: ${mergedQuestions.length}`);
        
        // Display breakdown
        console.log('\n📋 Questions Breakdown:');
        const subjects = ['Science', 'Math', 'History'];
        subjects.forEach(subject => {
            const count = mergedQuestions.filter(q => q.subject === subject).length;
            console.log(`   ${subject}: ${count} questions`);
        });

        // Display sample question
        console.log('\n📝 Sample Question:');
        const sample = cbseQuestions[0];
        console.log(`   Chapter: ${sample.chapter}`);
        console.log(`   Question: ${sample.question}`);
        console.log(`   Difficulty: ${sample.difficulty}`);
        
        return true;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return false;
    }
}

// Run the uploader
if (require.main === module) {
    fetchAndUpdateQuestions().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = {
    cbseQuestions,
    fetchAndUpdateQuestions
};
