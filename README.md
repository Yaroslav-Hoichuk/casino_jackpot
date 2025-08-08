# Casino Jackpot 🎰

**Casino Jackpot** — простий слот-джекпот (frontend + backend) для навчальних / демонстраційних цілей. Репозиторій містить окремі папки `backend` і `frontend`. :contentReference[oaicite:1]{index=1}

---

## Структура репозиторію

/backend - Node.js / Express API
/frontend - React
README.md - цей файл

## Особливості

- API для реєстрації / логіну користувача (JWT).
- Логіка кидків / спіну з керуванням кредитами гравця (серверна логіка).
- Проста UI-частина для відображення барабанів, балансу гравця та результату спіну.
- Розділення frontend/backend для локальної розробки.


## Вимоги

- Node.js 16+ (рекомендовано LTS)
- npm або yarn
- MongoDB (локально або Atlas) — якщо backend використовує базу
- (Опціонально) Docker — якщо хочете контейнеризувати


## Налаштування та запуск — backend

1. Перейдіть у папку `backend`:
   ```bash
   cd backend
2. встановіть залежності
    npm install
   # або
   yarn install

3. створіть .env

PORT=8989
MONGO_URI=mongodb://localhost:27017/casino_jackpot
JWT_SECRET=your_jwt_secret

4. Перевірка базових маршрутів
GET http://localhost:8989/api/users/
GET http://localhost:8989/api/users/:id
POST http://localhost:8989/api/auth/register
POST http://localhost:8989/api/auth/login


## Налаштування та запуск - frontend

1. Перейдіть у папку `frontend`:
   ```bash
   cd frontend
2. Встановіть залежності
    npm install
   # або
   yarn install

3. Запуск:

  npm run dev
# або
  npm start


