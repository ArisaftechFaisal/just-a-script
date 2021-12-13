import { BrowserWindow, dialog, ipcMain, shell } from "electron";
import CHANNELS from "./channels";
import { replaceInXlsxFilesInFolder } from "./operations";

const initIpcMain = (): void => {
  ipcMain.handle(CHANNELS.SELECT_FOLDER, async (e): Promise<DialogRet> => {
    const win = BrowserWindow.fromWebContents(e.sender);
    // eslint-disable-next-line eqeqeq
    if (win == undefined) return { path: "", canceled: true };
    const res = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
      buttonLabel: "Select",
      defaultPath: "",
    });
    return {
      path: res.filePaths[0],
      canceled: res.canceled,
    } as DialogRet;
  });

  ipcMain.on(
    CHANNELS.EXECUTE_REPLACE_IN_XLSX,
    async (event, args: ReplaceInXlsxArgs): Promise<ReplaceInXlsxRet> => {
      return replaceInXlsxFilesInFolder(event, args);
    }
  );

  ipcMain.handle(CHANNELS.OPEN_CONTAINING_FOLDER, (_, path: string) => {
    shell.showItemInFolder(path);
  });
};

export default initIpcMain;
