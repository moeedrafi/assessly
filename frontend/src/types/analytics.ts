export interface StatsCard {
  totalUsers: number;
  totalCourses: number;
  totalQuizzes: number;
}

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  joinedCourses: { id: number; name: string }[];
}
