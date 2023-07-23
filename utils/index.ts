import pickBy from 'lodash/pickBy';
import isNil from 'lodash/isNil';
import { EditedSpecification, NewCategory, NewProduct } from '~/db/types';
import { SpecificationTypes } from '~/data';
import { ProductSpecification } from '~/types';

export function enumToOptions(from: Record<string, string | number>): Record<string, string | number> {
  return pickBy(from, (value, key) => {
    return !isNil(value) && isNaN(Number(key));
  });
}

export function createCategory(): NewCategory {
  return {
    name: '',
    description: '',
    slug: '',
    parent: -1,
    specifications: [],
  };
}

export function createSpecification(category = -1): EditedSpecification {
  return {
    name: '',
    type: SpecificationTypes.Input,
    description: '',
    options: [],
    category,
  };
}

export function createProduct(): NewProduct {
  return {
    name: '',
    slug: '',
    description: '',
    category: -1,
    more: [],
    specifications: [],
  };
}

export function createProductSpecification(): ProductSpecification {
  return {
    name: '',
    value: '',
  };
}

function toDouble(number: number): string {
  return number < 10 ? `0${number}` : `${number}`;
}

export function formatDate(date: string | number | Date): string {
  date = new Date(date);
  return `${toDouble(date.getMonth() + 1)}-${toDouble(date.getDate())} ${toDouble(date.getHours())}:${toDouble(date.getMinutes())}`;
}

export function formatFilter(filter: Record<string, string[]>): string {
  const result: string[] = [];
  for (const cateId in filter) {
    const values = filter[cateId];
    if (values.length) {
      result.push(`cate${cateId}=${values.join(';')}`);
    }
  }
  return result.join('||');
}

export function filterToObject(str: string): null | Record<string, string[]> {
  if (!str) { return null }

  const arr = str.split('||');
  return arr.reduce((acc, item) => {
    const [cateId, values] = item.split('=');
    acc[cateId.substring(4)] = values.split(';').filter(Boolean) as string[];
    return acc;
  }, {} as Record<string, string[]>);
}
