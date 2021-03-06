const { contextBridge, ipcRenderer } = require("electron");
const CHANNELS = require("./channels");
// import { contextBridge, ipcRenderer } from "electron";
// import CHANNELS from "./channels";

contextBridge.exposeInMainWorld("electron", {
  selectFolder() {
    return ipcRenderer.invoke(CHANNELS.SELECT_FOLDER);
  },
  replaceInXlsx(args) {
    return ipcRenderer.send(CHANNELS.EXECUTE_REPLACE_IN_XLSX, args);
  },
  onProgress(callback) {
    ipcRenderer.on(CHANNELS.PROGRESS, (_, args) => callback(args));
  },
  openContainingFolder(path) {
    ipcRenderer.invoke(CHANNELS.OPEN_CONTAINING_FOLDER, path);
  },
  ipcRenderer: {
    myPing() {
      ipcRenderer.send("ipc-example", "ping");
    },
    on(channel, func) {
      const validChannels = ["ipc-example"];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ["ipc-example"];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
