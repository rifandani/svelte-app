/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Readable } from 'svelte/store';

export type Stores =
  | Readable<any>
  | [Readable<any>, ...Array<Readable<any>>]
  | Array<Readable<any>>;
