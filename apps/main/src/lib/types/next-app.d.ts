declare module 'next' {
  export interface PageProps<P = {}, S = {}> {
    params: P;
    searchParams: S;
  }
}
