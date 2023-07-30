import { Quotation, QuotationItem } from '~/db/types';

const LOCAL_STORAGE_KEY = 'quotation';

export const useQuotationStore = defineStore('quotation', () => {
  const quotations = ref<Record<string, QuotationItem>>({});

  const quotationNumber = computed<number>(() => {
    return Object.keys(quotations.value).length;
  });

  function init(): void {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      quotations.value = JSON.parse(local);
    }
  }
  function save(): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotations.value));
  }
  function addQuotation(quotation: QuotationItem): void {
    quotations.value[quotation.productId] = quotation;
    save();
  }
  function removeQuotation(id: string): void {
    delete quotations.value[id];
    save();
  }

  return {
    quotations,
    quotationNumber,

    init,
    addQuotation,
    removeQuotation,
  };
});
