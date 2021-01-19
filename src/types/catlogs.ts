export interface Catlog {
  title: string;
  id: number;
  type: 0 | 1 | 2;
  iconName: string;
}

export type Catlogs = Catlog[];
