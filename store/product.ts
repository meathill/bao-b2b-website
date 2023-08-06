import { Category } from '~/db/types';
import { ApiResponse } from '~/types';

export const useProductStore = defineStore('product', () => {
  let categoryP: Promise<Category[]>;
  const isLoaded = ref<boolean>(false);
  const categories = ref<Record<string, Category>>({});

  async function refreshCategories(): Promise<Category[]> {
    if (categoryP) { return categoryP }

    categoryP = _refreshCategories();
    const data = await categoryP;
    setCategories(data);
    return data as Category[];
  }
  async function _refreshCategories(): Promise<Category[]> {
    const { data } = await $fetch<ApiResponse<Category[]>>('/api/categories');
    isLoaded.value = true;
    return (data || []) as Category[];
  }
  function setCategories(cats: Category[]) {
    for (const category of cats) {
      categories.value[category.id] = category;
    }
  }

  return {
    isLoaded,
    categories,
    refreshCategories,
    setCategories,
  };
});
