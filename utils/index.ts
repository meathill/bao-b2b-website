import pickBy from 'lodash/pickBy';
import isNil from 'lodash/isNil'
import {NewCategory, NewProduct, Specification, SpecTypes} from '~/db/kysely';

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

export function createSpecification(): Specification {
  return {
    name: '',
    description: '',
    type: SpecTypes.String,
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
