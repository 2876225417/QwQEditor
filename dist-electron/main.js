"use strict";
const {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  dialog,
  Notification
} = require("electron");
const { join } = require("path");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
let noteWindows = [];
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    backgroundMaterial: "acrylic",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
      // webSecurity: false,
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(join(__dirname, "../dist/index.html"));
  }
  win.on("maximize", () => {
    win.webContents.send("window-maximized");
  });
  win.on("unmaximize", () => {
    win.webContents.send("window-unmaximized");
  });
  ipcMain.on("window-control", (event, action) => {
    if (action === "minimize") win.minimize();
    if (action === "maximize") win.isMaximized() ? win.unmaximize() : win.maximize();
    if (action === "close") win.close();
  });
  ipcMain.handle("dialog:openDirectory", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"]
    });
    return result.filePaths[0];
  });
  ipcMain.on("start-download", async (event, { url, filename, downloadPath }) => {
    const filePath = `${downloadPath}/${filename}.pdf`;
    const writer = fs.createWriteStream(filePath);
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream"
    });
    const totalLength = response.headers["content-length"];
    let downloadedLength = 0;
    response.data.on("data", (chunk) => {
      downloadedLength += chunk.length;
      const progress = Math.round(downloadedLength / totalLength * 100);
      event.sender.send(`download-progress-${filename}`, progress);
    });
    response.data.pipe(writer);
    writer.on("finish", () => {
      event.sender.send(`download-success-${filename}`);
    });
    writer.on("error", (err) => {
      event.sender.send(`download-failure-${filename}`, err.message);
    });
  });
  ipcMain.handle("read-file-tree", async (event, directoryPath) => {
    const readDirectory = (dirPath) => {
      const items = fs.readdirSync(dirPath);
      return items.map((item) => {
        const fullPath = path.join(dirPath, item);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          return {
            name: item,
            isFolder: true,
            expanded: false,
            // 这里可以设置为 false，表示初始状态为折叠
            children: readDirectory(fullPath)
            // 递归读取子目录
          };
        } else if (stats.isFile() && item.endsWith(".pdf")) {
          return {
            name: item,
            isFolder: false
          };
        }
      }).filter((item) => item);
    };
    try {
      const fileTree = readDirectory(directoryPath);
      return fileTree;
    } catch (error) {
      console.error("Error reading directory:", error);
      return [];
    }
  });
  const ipinfoToken = "33a893cfdfece8";
  const openWeatherKey = "7e791510500b1afd1ea1bac6fe5e7c03";
  function getWeatherAndNotify() {
    axios.get("https://qintong.space/qwq/clientIP").then((ipResponse) => {
      const userIp = ipResponse.data.ip;
      console.log(userIp);
      return axios.get(`https://ipinfo.io/${userIp}/json?token=${ipinfoToken}`);
    }).then((locationResponse) => {
      const { city, region, country, loc } = locationResponse.data;
      const [lat, lon] = loc.split(",");
      return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherKey}&units=metric`, {
        timeout: 6e5
        // 设置超时时间为 10 秒
      });
    }).then((weatherResponse) => {
      const { main, weather } = weatherResponse.data;
      const temperature = main.temp;
      const weatherDescription = weather[0].description;
      const notification = {
        title: "当前天气信息",
        body: `温度: ${temperature}°C, 天气: ${weatherDescription}`
      };
      if (Notification.isSupported()) {
        new Notification(notification).show();
      }
    }).catch((error) => {
      console.error("Error:", error);
      console.error("Weather API Error:", error.message);
      const notification = {
        title: "天气信息获取失败",
        body: "无法获取当前天气信息，请检查网络连接。"
      };
      if (Notification.isSupported()) {
        new Notification(notification).show();
      }
    });
  }
  getWeatherAndNotify();
  ipcMain.on("open-note-window", (event) => {
    const noteWindow = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
        // 根据需要设置
      }
    });
    if (process.env.VITE_DEV_SERVER_URL) {
      noteWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/Library/NoteBook`);
    } else {
      noteWindow.loadFile(path.join(__dirname, "../dist/index.html"));
      noteWindow.webContents.on("did-finish-load", () => {
        noteWindow.webContents.executeJavaScript(`window.location.hash = '#/Library/NoteBook';`);
      });
    }
    noteWindows.push(noteWindow);
    noteWindow.on("closed", () => {
      noteWindows = noteWindows.filter((win2) => win2 !== noteWindow);
    });
    win.on("closed", () => {
      noteWindows.forEach((win2) => win2.close());
      noteWindows = [];
    });
  });
  win.webContents.on("did-finish-load", () => {
    const isDarkMode = nativeTheme.shouldUseDarkColors;
    win.webContents.send("initial-theme", isDarkMode);
  });
};
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
