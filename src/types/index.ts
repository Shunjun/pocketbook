declare interface EventFn<D> {
  (e: D): void;
  (): void;
}
