import { ClientInfo, QuotationItem } from '~/db/types';

const LOCAL_STORAGE_KEY = 'quotation';
const LOCAL_CLIENT_INFO_KEY = 'clientInfo';

export const useQuotationStore = defineStore('quotation', () => {
  const quotations = ref<Record<string, QuotationItem>>({});
  const clientInfo = ref<ClientInfo>();

  const quotationNumber = computed<number>(() => {
    return Object.keys(quotations.value).length;
  });

  function init(): void {
    let local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      quotations.value = JSON.parse(local);
    }
    local = localStorage.getItem(LOCAL_CLIENT_INFO_KEY);
    if (local) {
      clientInfo.value = JSON.parse(local);
    }
  }
  function save(): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotations.value));
  }
  function addQuotation(quotation: QuotationItem): void {
    const current = quotations.value[quotation.productId];
    if (current) {
      quotation = {
        ...quotation,
        quantity: quotation.quantity + current.quantity,
      };
    }
    quotations.value[quotation.productId] = quotation;
    save();
  }
  function removeQuotation(id: string): void {
    delete quotations.value[id];
    save();
  }
  function saveClientInfo(info: ClientInfo): void {
    clientInfo.value = info;
    localStorage.setItem(LOCAL_CLIENT_INFO_KEY, JSON.stringify(info));
  }

  return {
    quotations,
    quotationNumber,
    clientInfo,

    init,
    addQuotation,
    removeQuotation,
    saveClientInfo,
  };
});
