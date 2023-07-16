import { Category } from '~/db/types';
import { ApiResponse } from '~/types';

export const useProductStore = defineStore('product', () => {
  const categories = ref<Record<string, Category>>({});

  async function refreshCategories() {
    const { data } = await $fetch<ApiResponse<Category[]>>('/api/categories');
    setCategories(data as Category[]);
  }
  function setCategories(cats: Category[]) {
    for (const category of cats) {
      categories.value[category.id] = category;
    }
  }

  return {
    categories,
    refreshCategories,
    setCategories,
  };
});
