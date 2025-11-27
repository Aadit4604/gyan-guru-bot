# CBSE Grade 10 Questions Database

## Overview
Real, authentic Grade 10 CBSE questions have been uploaded to the bot's question database. These are curated from actual CBSE exam patterns and textbooks.

## Current Database Stats
- **Total Questions**: 69
- **Science**: 34 questions
- **Math**: 27 questions  
- **History**: 8 questions

### Science Topics Covered
1. Chemical Reactions and Equations
2. Acids, Bases and Salts
3. Metals and Non-metals
4. Carbon and its Compounds
5. Electricity
6. Magnetic Effects of Electric Current
7. Life Processes
8. Heredity and Evolution

### Math Topics Covered
1. Real Numbers (HCF, LCM)
2. Polynomials
3. Quadratic Equations
4. Arithmetic Progressions
5. Triangles
6. Circles
7. Introduction to Trigonometry

### History Topics Covered
1. The Rise of Nationalism in Europe
2. Nationalism in India
3. Indian Independence Movement

## Uploading Questions

### Method 1: Using npm script
```bash
npm run upload-questions
```

### Method 2: Direct execution
```bash
node scripts/upload-cbse-questions.js
```

### Output
```
📊 Database Summary:
   Science Questions: 20
   Math Questions: 14
   History Questions: 5
   Total Questions: 39

✅ Successfully uploaded 39 CBSE questions!
📈 Total questions in database: 69
```

## Question Format
Each question follows this structure:
```json
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
}
```

## Question Difficulty Levels
- **Easy**: Basic recall and fundamental concepts
- **Medium**: Application and analysis of concepts
- **Hard**: Complex problem-solving and synthesis

## How Questions Are Used

### In Practice Mode
```
/practice [optional: chapter]
→ Gets random question (70% AI-generated, 30% from database)
```

### In Match Mode
```
/match @opponent [duration: 5/10/15/20 questions]
→ Each round uses a question (AI or database)
```

### Fallback System
If AI-generated questions fail:
- Automatically uses database questions
- Ensures bot always has questions to serve
- Maintains seamless experience

## Adding More Questions

To add more CBSE questions, edit `scripts/upload-cbse-questions.js`:

```javascript
const cbseQuestions = [
  {
    "id": "cbse_sci_21",  // Unique ID
    "chapter": "Chapter Name",
    "subject": "Science|Math|History",
    "question": "Your question here?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": 0,  // Index of correct option
    "hint": "Helpful hint",
    "difficulty": "Easy|Medium|Hard"
  },
  // Add more questions...
];
```

Then run:
```bash
npm run upload-questions
```

## Data Files
- **Questions Database**: `data/questions.json`
- **Uploader Script**: `scripts/upload-cbse-questions.js`
- **Size**: ~1036 lines (69 questions)

## Quality Assurance
All questions are:
- ✅ CBSE Grade 10 curriculum aligned
- ✅ Verified for accuracy
- ✅ Following official textbook content
- ✅ Properly formatted JSON
- ✅ Tested with correct answers

## Future Enhancements
- Add more questions for complete chapter coverage
- Include past year exam questions
- Add question difficulty adjustment
- Add question source attribution
- Create question editor interface

## Support
For issues or to add more questions, contact the admin.
