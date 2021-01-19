export interface ResponsType {
  ok: 1 | -1;
  data: any;
}

export interface PagingData<D> {
  page: number;
  more: boolean;
  list: D;
}
