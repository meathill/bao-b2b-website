import pickBy from 'lodash/pickBy';
import isNil from 'lodash/isNil';
import { NewCategory, NewProduct, NewSpecification } from '~/db/types';
import { SpecificationTypes } from '~/data';

export function enumToOptions(from: Record<string, string | number>): Record<string, string | number> {
  return pickBy(from, (value, key) => {
    return !isNil(value) && isNaN(Number(key));
  });
}

export function createCategory(): NewCategory {
  return {
    id: 0,
    name: '',
    description: '',
    slug: '',
    parent: 0,
    specifications: [],
  };
}

export function createSpecification(category: number): NewSpecification {
  return {
    id: 0,
    name: '',
    type: SpecificationTypes.Input,
    description: '',
    options: [],
    category,
  };
}

export function createProduct(): NewProduct {
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
