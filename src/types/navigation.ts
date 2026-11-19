export interface CategoryItem {
  id: string;
  name: string;
  order: number;
  row: 1 | 2;
  image: string;
  url: string;
  description: string;
  badge?: string;
  initialOffset: {
    x: number; // relative start offset percentage from car center
    y: number;
    rotate: number;
  };
}
