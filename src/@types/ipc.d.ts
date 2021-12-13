type DialogRet = {
  path: string;
  canceled: boolean;
};

type ReplaceInXlsxArgs = {
  folderPath: string;
  replaceItems: ReplaceItem[];
  // progressCallback: (progress: Progress) => void;
};

type ReplaceInXlsxRet = {
  success: boolean;
  path: string;
}[];

type ReplaceItem = {
  before: string;
  after: string;
  partial: boolean;
};

type Progress = {
  done: number;
  failed: number;
  total: number;
};

type ProgressCallback = (p: Progress) => void;
