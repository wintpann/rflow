/* eslint-disable */
// @ts-nocheck
import {
  createObservable,
  Observable,
  createDerivation,
} from '../core/observable/lib.ts';
import { autorun } from 'mobx';

window.Observable = Observable;
window.createObservable = createObservable;
window.createDerivation = createDerivation;
window.autorun = autorun;
