// Move direction types to a dedicated file
export type Direction = 'horizontal' | 'vertical' | 'diagonal';

export const BASE_DIRECTIONS: Direction[] = ['horizontal', 'vertical', 'diagonal'];

export interface DirectionVector {
  x: number;
  y: number;
}