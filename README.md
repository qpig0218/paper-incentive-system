# Paper Incentive System

論文發表獎勵系統 - 奇美醫院

## Features

- AI-powered PDF analysis with OCR
- Automatic paper type classification
- JCR Impact Factor lookup
- Smart reward calculation based on Chi Mei rules
- Paper gallery with card-based responsive design
- Career history tracking
- Marquee announcements

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- React Dropzone

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- OpenAI API (for AI features)

## Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL
- OpenAI API Key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/paper-incentive-system.git
cd paper-incentive-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your database and API keys
```

4. Set up the database:
```bash
npm run db:generate
npm run db:migrate
```

5. Start development servers:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173
The backend API will be available at http://localhost:3001

## Project Structure

```
paper-incentive-system/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── types/           # TypeScript types
│   └── ...
├── backend/                  # Express backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   └── types/           # TypeScript types
│   └── prisma/              # Database schema
└── ...
```

## Reward Calculation Rules

### SCI/SSCI Papers

| Paper Type | Base Reward |
|------------|-------------|
| Original Article (IF < 2) | NT$ 60,000 |
| Original Article (IF ≥ 2) | NT$ 70,000 |
| Original Article (IF ≥ 3) | NT$ 80,000 |
| Original Article (IF ≥ 4) | NT$ 90,000 |
| Original Article (IF ≥ 5) | NT$ 100,000 |
| Case Report | NT$ 25,000 |
| Review | NT$ 40,000 |
| Letter/Note | NT$ 15,000 |
| Image | NT$ 8,000 |

### Non-SCI Papers

| Paper Type | Base Reward |
|------------|-------------|
| Original Article | NT$ 15,000 |
| Case Report | NT$ 10,000 |
| Review | NT$ 12,000 |
| Letter | NT$ 5,000 |

### Special Bonuses
- 醫療品質雜誌: +50%
- 醫學教育雜誌: +100%

### Author Role Multipliers
- First/Corresponding Author: 100%
- Second Author: 50%
- Third to Sixth Author: 20%

## License

MIT
