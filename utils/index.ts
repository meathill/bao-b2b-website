import { Category, Product, Specification } from '~/types';

export function createCategory(): Category {
  return {
    id: 0,
    name: '',
    description: '',
    slug: '',
    parent: 0,
    specifications: [],
  };
}

export function createSpecification(): Specification {
  return {
    name: '',
    description: '',
    type: '',
  };
}

export function createProduct(): Product {
  return {
    id: 0,
    name: '',
    slug: '',
    description: '',
    category: 0,
    more: [],
  };
}

function toDouble(number: number): string {
  return number < 10 ? `0${number}` : `${number}`;
}

export function formatDate(date: string | number | Date): string {
  date = new Date(date);
  return `${toDouble(date.getMonth() + 1)}-${toDouble(date.getDate())} ${toDouble(date.getHours())}:${toDouble(date.getMinutes())}`;
}
