export {};

interface External {
  [key: string]: any;
}

declare global {
  interface Window {
    OnAsyncCallback: any;
    // external: External; // dis no work. we still don't override the one defined even with skipLibCheck set to true
  }
}
