export interface OptionEntity {
  id: number;
  text: string;
  isCorrect: boolean;
}

export type CreateOption = Omit<OptionEntity, "id">;
