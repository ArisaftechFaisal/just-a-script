/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";
import CHANNELS from "./channels";

const getXlsxFilesInFolder = (
  base: string,
  files?: string[],
  result?: string[]
) => {
  const ext = "xlsx";
  files = files || fs.readdirSync(base, { encoding: "utf-8" });
  result = result || [];

  files.forEach((file) => {
    const newBase = path.join(base, file);
    if (fs.statSync(newBase).isDirectory()) {
      result = getXlsxFilesInFolder(
        newBase,
        fs.readdirSync(newBase, { encoding: "utf-8" }),
        result
      );
    } else if (file.substring(file.length - (ext.length + 1)) === `.${ext}`) {
      result?.push(newBase);
    }
  });
  return result;
};

const replaceInXlsxFile = async (
  filePath: string,
  replaceItems: ReplaceItem[]
): Promise<{ success: boolean; path: string }> => {
  try {
    // const workbook = await XlsxPopulate.fromFileAsync(filePath);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    replaceItems.forEach((item) => {
      workbook.eachSheet((sheet) => {
        sheet.eachRow((row) => {
          row.eachCell((cell) => {
            if (item.partial && cell.value?.toString().includes(item.before)) {
              cell.value = cell.value
                .toString()
                .replace(item.before, item.after);
              // eslint-disable-next-line eqeqeq
            } else if (!item.partial && cell.value?.toString() == item.before) {
              cell.value = item.after;
            }
          });
        });
      });
    });
    await workbook.xlsx.writeFile(filePath);
    return { success: true, path: filePath };
  } catch (e) {
    console.log(e);
    return { success: false, path: filePath };
  }
};

export const replaceInXlsxFilesInFolder = async (
  event: Electron.IpcMainEvent,
  args: ReplaceInXlsxArgs
): Promise<ReplaceInXlsxRet> => {
  const files = getXlsxFilesInFolder(args.folderPath);
  let done = 0;
  let failed = 0;
  const total = files.length;
  event.reply(CHANNELS.PROGRESS, { done, failed, total });
  const promises = files.map((f) => replaceInXlsxFile(f, args.replaceItems));
  promises.forEach((p) => {
    p.then(({ success }) => {
      if (success) {
        done++;
      } else {
        failed++;
      }
      event.reply(CHANNELS.PROGRESS, { done, failed, total });
    }).catch((e) => {
      console.error(e);
    });
  });
  return Promise.all(promises);
};

export default null;
