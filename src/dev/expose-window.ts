/* eslint-disable */
// @ts-nocheck
import {
  createObservable,
  createDerivation,
  from,
  take,
  pipe,
  debounceTime,
  interval,
  distinctUntilChanged,
  of,
  map,
  fromEvent,
  future,
} from '../core/index.ts';
import { autorun } from 'mobx';

window.autorun = autorun;
window.createObservable = createObservable;
window.createDerivation = createDerivation;
window.from = from;
window.take = take;
window.pipe = pipe;
window.debounceTime = debounceTime;
window.interval = interval;
window.distinctUntilChanged = distinctUntilChanged;
window.of = of;
window.map = map;
window.fromEvent = fromEvent;
window.future = future;
