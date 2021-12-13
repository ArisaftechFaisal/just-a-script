declare global {
  interface Window {
    electron: Sandbox;
  }
}

export interface Sandbox {
  selectFolder: () => Promise<DialogRet>;
  replaceInXlsx: (args: ReplaceInXlsxArgs) => Promise<ReplaceInXlsxRet>;
  onProgress: (callback: (p: Progress) => void) => void;
  openContainingFolder: (path: string) => void;
}
