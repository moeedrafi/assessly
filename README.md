# 💬 Assessly

Built a full-stack role-based quiz platform with separate Student and Teacher portals using Next.js App Router and NestJS.

## Tech Stack

- Frontend: Next.js, TailwindCSS, Tanstack Query, Tanstack Form, Tanstack Table, Nuqs, Axios
- Backend: Nest.js, Express.js, TypeORM
- Database: PostgreSQL

## 🚀 Features

- 🎓 Built a role-based quiz platform with separate Student and Teacher experiences, including course enrollment via course codes, quiz management, and analytics dashboards.
- 📊 Developed analytics dashboards for both teachers and students, featuring course performance metrics, quiz statistics, and score comparisons against course averages.
- 📝 Built fully type-safe forms using TanStack Form and Zod, with server state managed through TanStack Query for efficient data fetching and caching.
- 🔐 Implemented secure authentication and authorization using JWT, refresh token cookies, custom guards, and role-based access control.
- 🛡️ Engineered an anti-cheating quiz experience with fullscreen enforcement, focus-loss detection, tab visibility monitoring, and one-time timed quiz attempts.
- ⚡ Implemented reusable pagination, filtering, and typed URL search parameters using Nuqs, keeping application state synchronized with the browser URL.

## Things I Learned

- Built my first production-style application with NestJS, gaining hands-on experience with authentication, authorization, guards, custom decorators, interceptors, serialization, validation pipes, and modular backend architecture.
- Implemented scalable pagination, filtering, and standardized API response metadata while working with TypeORM and PostgreSQL.
- Learned to manage type-safe URL state using Nuqs alongside TanStack Query for modern server-state management.

## Planned Improvements

- Generate quiz questions automatically from uploaded PDF files using AI.
- Deploy the application with Docker and CI/CD pipelines.

## Installation & Setup

1. Clone the repository:
   <pre>git clone https://github.com/moeedrafi/assessly.git
   cd chat-app</pre>
2. Install dependencies:
   <pre>cd frontend 
     npm install</pre>
   <pre>cd backend 
     npm install</pre>
3. Set up environment variables for frontend and backend (create a .env file):

   backend:
   <pre>PORT=8000
      DATABASE_URL=
      NODE_ENV=
      FRONTEND_URL=
      CORS=
      JWT_SECRET=
      JWT_REFRESH_SECRET=
      RESET_PASSWORD_SECRET=
      RESET_PASSWORD_EXPIRY=
      HOST=
      SMTP_USER=
      SMTP_PASS=
      SENDER_EMAIL=
   </pre>
   frontend:
   <pre>NEXT_PUBLIC_API_URL=
   </pre>
5. Run both frontend and backend:
   <pre>npm run dev and npm run start:dev</pre>
