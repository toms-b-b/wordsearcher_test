import { PuzzleConfig } from '../types';
import { MIN_GRID_SIZE } from './constants';

export function validateGridSize(size: number, minRequired: number = MIN_GRID_SIZE): number {
  if (isNaN(size) || !Number.isFinite(size)) {
    return minRequired;
  }
  
  // Ensure integer and not smaller than minimum required
  const validSize = Math.max(Math.floor(size), minRequired);
  
  // Cap at a reasonable maximum
  return Math.min(validSize, 100);
}

export function validateFontSize(size: number): number {
  if (isNaN(size) || !Number.isFinite(size)) {
    return 16; // Default safe value
  }
  
  // Ensure integer and within reasonable bounds
  return Math.min(Math.max(Math.floor(size), 8), 24);
}

export function validateConfig(config: Partial<PuzzleConfig>, minGridSize: number): string[] {
  const errors: string[] = [];
  
  if (!config.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!Array.isArray(config.words) || config.words.length === 0) {
    errors.push('At least one word is required');
  }
  
  if (config.gridSize && config.gridSize < minGridSize) {
    errors.push(`Grid size must be at least ${minGridSize} to accommodate the longest word`);
  }
  
  return errors;
}