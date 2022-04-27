/// <reference types="chrome"/>

declare namespace NodeJS {
  interface Global {
    chrome: typeof chrome;
  }
}
