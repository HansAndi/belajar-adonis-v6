## Requirement 
- Node.js >= 20.0.0

## Installation
1. Clone the repository
```bash
git clone https://github.com/HansAndi/belajar-adonis-v6.git
```
2. NPM Install
```bash
npm install
```
4. Copy .env.example to .env
```bash
cp .env.example .env
```
5. Setting .env
6. Generate key
```bash
node ace generate:key
```
7. Migrate & seeding database
```bash
node ace migration:run --seed
```
8. Run NPM
```bash
npm run dev || node ace serve --watch
```
