export interface Callbacks {}

export type Callback = {
  [key in keyof Callbacks]: ((props: Callbacks[key]) => void) | null;
};
