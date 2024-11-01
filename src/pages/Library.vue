<template>
  <div>
    <div class="book-count-container">
      <div class="background-circle"></div>
      <div class="icon-circle">
        <div class="icon"></div>
      </div>
      <h1>ppQwQqq's<br>BookShelf</h1>
      <div class="book-count-box">
        已收录书籍: <span id="bookCount">{{ books.length }}</span>
      </div>
      <div class="decorative-text">
        Keep adding books to expand your knowledge!
      </div>
      <div>
        <button @click="selectDownloadPath">Choose Download Path</button>
        <span v-if="downloadPath">Selected Path: {{ downloadPath }}</span>
      </div>
    </div>

    <div class="filter-container">
      <label for="category-filter">Filter by Category:</label>
      <select id="category-filter" v-model="selectedCategory">
        <option value="All">All</option>
        <option v-for="category in availableCategories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>


    <div id="books-container">
      <p v-if="loading">Loading books...</p>
      <p v-else-if="error">{{ error }}</p>
      <div v-else>
        <div v-for="(books, category) in categorizedBooks" :key="category" class="category">
          <h2>{{ category }}</h2>
          <div v-for="book in books" :key="book.title" class="book">
            <img :src="`https://qintong.space${book.cover_link}`" :alt="book.title || 'Book Cover'"/>
            <h3>{{ book.title || 'Book Title' }}</h3>
            <a v-if="book.book_link" @click.prevent="downloadBook(book)">Download</a>
            <span v-else>No download link available</span>
          </div>
        </div>
      </div>
      <!-- 翻页按钮 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>

    <div id="download-status" @click="showDownloadStatus" :style="circleStyle">
      <span>{{ currentDownloads }}</span>
    </div>

    <!-- 弹窗结构 -->
    <div v-if="showDownloadsPopup" class="popup-overlay" @click.self="closeDownloadsPopup">
      <div class="popup-content">
        <h2>PDF Files in {{ downloadPath }}</h2>
        <ul>
          <li v-for="file in pdfFiles" :key="file">
            {{ file }}
            <button @click="deleteFile(file)">Delete</button>
            <button @click="promptRename(file)">Rename</button>
            <button @click="promptCopy(file)">Copy</button>
            <button @click="promptMove(file)">Move</button>
          </li>
        </ul>
        <button @click="closeDownloadsPopup">Close</button>
      </div>
    </div>


    <button @click="openDownloadsPopup">View Downloaded Books</button>






  </div>
</template>

<script>
import {
  saveBooks,
  getBooks,
  saveDownloadPath,
  getDownloadPath,
} from "../indexedDB.js";

const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

export default {
  data() {
    return {
      books: [],
      loading: true,
      error: null,
      currentPage: 1,
      booksPerPage: 5,
      downloadPath: "",
      currentDownloads: 0,
      downloadProgress: {},
      selectedCategory: "All",
      pdfFiles: [],
      showDownloadsPopup: false,
    };
  },
  computed: {
    circleStyle() {
      const totalProgress = Object.values(this.downloadProgress).reduce((acc, { progress }) => acc + progress, 0);
      const averageProgress = totalProgress / (this.currentDownloads || 1);

      // 使用更复杂的渐变效果
      const background = `linear-gradient(to top, rgba(76, 175, 80, 1) ${averageProgress}%, rgba(76, 175, 80, 0.3) ${averageProgress}%)`;

      return {
        background,
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        padding: '10px',
        color: '#fff'
      };
    },

    availableCategories() {
      const categories = this.books.map(book => book.category);
      return ["All", ...new Set(categories)];
    },
    filteredBooks() {
      if (this.selectedCategory === "All") {
        return this.books;
      }
      return this.books.filter(book => book.category === this.selectedCategory);
    },


    booksCountMessage() {
      return `Total books: ${this.books.length}`;
    },
    categorizedBooks() {
      const filtered = this.filteredBooks; // 使用过滤后的书籍列表
      const categories = {};
      const startIndex = (this.currentPage - 1) * this.booksPerPage;
      const endIndex = startIndex + this.booksPerPage;
      const paginatedBooks = filtered.slice(startIndex, endIndex);

      paginatedBooks.forEach((book) => {
        if (!categories[book.category]) {
          categories[book.category] = [];
        }
        categories[book.category].push(book);
      });
      return categories;
    },
    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.booksPerPage);
    }
  },
  methods: {
    // 删除文件的方法...
    promptRename(file) {
      const newName = prompt('Enter new name for the file:', file);
      if (newName) {
        this.renameFile(file, newName);
      }
    },
    promptCopy(file) {
      const destinationPath = prompt('Enter the destination path to copy the file to:');
      if (destinationPath) {
        this.copyFile(file, destinationPath);
      }
    },
    promptMove(file) {
      const destinationPath = prompt('Enter the destination path to move the file to:');
      if (destinationPath) {
        this.moveFile(file, destinationPath);
      }
    },
    async fetchPdfFiles() {
      if (!this.downloadPath) {
        console.error("Download path is not set.");
        return;
      }

      try {
        // 调用主进程方法读取 PDF 文件
        const files = await ipcRenderer.invoke('read-pdf-files', this.downloadPath);
        this.pdfFiles = files;
      } catch (error) {
        console.error('Error fetching PDF files:', error);
      }
    },
    openDownloadsPopup() {
      this.fetchPdfFiles(); // 打开弹窗时加载 PDF 文件
      this.showDownloadsPopup = true;
    },
    closeDownloadsPopup() {
      this.showDownloadsPopup = false;
    },
    // 删除文件
    deleteFile(fileName) {
      const filePath = path.join(this.downloadPath, fileName);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          this.fetchPdfFiles(); // 重新加载文件列表
        }
      });
    },
    // 重命名文件
    renameFile(oldName, newName) {
      if (!newName.endsWith('.pdf')) {
        newName += '.pdf'; // 确保新名称有 .pdf 后缀
      }
      const oldPath = path.join(this.downloadPath, oldName);
      const newPath = path.join(this.downloadPath, newName);
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error('Error renaming file:', err);
        } else {
          this.fetchPdfFiles(); // 重新加载文件列表
        }
      });
    },
    // 复制文件
    copyFile(fileName, destinationPath) {
      const sourcePath = path.join(this.downloadPath, fileName);
      const destPath = path.join(destinationPath, fileName);
      fs.copyFile(sourcePath, destPath, (err) => {
        if (err) {
          console.error('Error copying file:', err);
        } else {
          alert('File copied successfully!');
        }
      });
    },
    // 剪切文件（移动文件）
    moveFile(fileName, destinationPath) {
      const sourcePath = path.join(this.downloadPath, fileName);
      const destPath = path.join(destinationPath, fileName);
      fs.rename(sourcePath, destPath, (err) => {
        if (err) {
          console.error('Error moving file:', err);
        } else {
          this.fetchPdfFiles(); // 重新加载文件列表
        }
      });
    },

    async fetchBooks() {
      try {
        const cachedBooks = await getBooks();
        let shouldFetchFromAPI = true;

        console.log("Cached Books Data:", cachedBooks);

        if (cachedBooks && cachedBooks.length > 0) {
          this.books = cachedBooks;
          shouldFetchFromAPI = false;
        }

        const timestamp = new Date().getTime();
        const response = await fetch(`https://qintong.space/qwq/BooksFetch?t=${timestamp}`, {
          method: "GET",
          headers: {
            Authorization: "youwenfei1025",
            "Cache-Control": "no-cache",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch books");

        const data = await response.json();
        console.log("Fetched Books Data from API:", data);

        if (!deepEqual(normalizeData(data), normalizeData(cachedBooks))) {
          console.log("Data is different. Updating IndexedDB with new data.");
          this.books = data;
          await saveBooks(data);
        } 

      } catch (error) {
        this.error = "Failed to load books.";
        console.error("Error fetching books:", error);
      } finally {
        this.loading = false;
      }
    },
    async selectDownloadPath(){
      const path = await ipcRenderer.invoke("dialog:openDirectory");
      if(path){
        this.downloadPath = path;
        await saveDownloadPath(path);
        console.log("Download path saved");
      }
    },
    async loadPath(){
      this.downloadPath = await getDownloadPath() || "";
    },
    async downloadBook(book) {
      const bookLink = `https://qintong.space${book.book_link}`;
      console.log('Download link:', bookLink);

      // 确保 downloadPath 存在
      if (!this.downloadPath) {
        alert('Please select a download path first.');
        // console.log("Please select a download path first");
        return;
      }


      // 更新当前下载数量和进度
      this.currentDownloads++;
      this.downloadProgress[book.title] = { progress: 0 };

      try {
        // 发送下载请求，包含用户选择的路径
        ipcRenderer.send('start-download', { url: bookLink, filename: book.title, downloadPath: this.downloadPath });

        // 监听下载进度事件
        ipcRenderer.on(`download-progress-${book.title}`, (event, progress) => {
          this.updateDownloadProgress(book.title, progress);
        });

        // 监听下载成功事件
        ipcRenderer.once(`download-success-${book.title}`, () => {
          this.currentDownloads--;
          console.log("Download successfully");
          // alert(`${book.title} downloaded successfully!`);
          this.updateDownloadProgress(book.title, 100); // 下载完成，更新进度

          this.showBubbleMessage(`${book.title} download successfully!`)

          setTimeout(() => {
            this.downloadProgress[book.title] = { progress: 0 };
          }, 500);
        });

        // 监听下载失败事件
        ipcRenderer.once(`download-failure-${book.title}`, (event, message) => {
          this.currentDownloads--;
          console.log("Failed to download.");
          //alert(`Failed to download ${book.title}: ${message}`);
        });

      } catch (error) {
        console.error('Error downloading book:', error);
        this.currentDownloads--;
        console.log("Error: ", error);
        // alert(`Error: ${error.message}`);
      }
    },

    updateDownloadProgress(title, progress) {
      if (this.downloadProgress[title]) {
        this.downloadProgress[title].progress = progress;
      }
    },


    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    showBubbleMessage(message){
      const bubble = document.createElement("div");
      bubble.className = "bubble-message";
      bubble.textContent = message;
      document.body.appendChild(bubble);

      setTimeout(() => {
        bubble.classList.add("fade-out");
      }, 3000);

      bubble.addEventListener("transitionend", () => {
        bubble.remove();
      })

    }
  },
  mounted() {
    this.fetchBooks();
    this.loadPath();
    if(this.downloadPath){
      this.fetchPdfFiles();
    }
    },
  watch: {
    selectedCategory() {
      this.currentPage = 1; // 重置页码
    }
  }
};

// 标准化对象数组函数，移除
// 或调整不一致的属性
function normalizeData(data) {
  return data.map(item => {
    const {id, ...rest} = item; // 移除 id 属性
    return {...rest}; // 返回没有 id 属性的对象
  });
}

// 深度比较函数，比较两个对象数组是否相同
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null || typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}
</script>


<style>

.popup-content ul {
  list-style-type: none;
  padding: 0;
}

.popup-content li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.popup-content button {
  margin-left: 5px;
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.popup-content button:hover {
  background-color: #45a049;
}



.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.popup-content h2 {
  margin-top: 0;
}

.popup-content button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.popup-content button:hover {
  background-color: #45a049;
}


.filter-container {
  margin: 20px 0;
  display: flex;
  align-items: center;
}

.filter-container label {
  margin-right: 10px;
  font-weight: bold;
}

.filter-container select {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}


.download-indicator {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #4caf50; /* 默认颜色 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.download-indicator:hover {
  background-color: #388e3c; /* 悬停颜色 */
}

#download-status {
  position: fixed;
  bottom: 80px;
  right: 20px;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.bubble-message {
  position: fixed;
  bottom: 100px;
  right: 20px;
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s ease, transform 0.5s ease;
  z-index: 1000;
}

.bubble-message.fade-out {
  opacity: 0;
  transform: translateY(-20px);
}



.book-count-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 40px;
  padding: 20px;
  background: linear-gradient(135deg, #dfe9f3, #fff);
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  overflow: hidden;
}

.book-count-box {
  background: linear-gradient(135deg, #6c63ff, #536dfe);
  color: white;
  padding: 20px 40px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  font-size: 1.8em;
  position: relative;
  z-index: 1;
}

.book-count-box:before {
  content: '';
  position: absolute;
  top: -10px;
  right: -10px;
  bottom: -10px;
  left: -10px;
  background: linear-gradient(135deg, #48bb78, #38a169);
  z-index: -1;
  border-radius: 20px;
  opacity: 0.6;
}

.book-count-box span {
  font-weight: bold;
  font-size: 2.5em;
}

.decorative-text {
  font-size: 1.2em;
  color: #4a5568;
  margin-top: 10px;
  text-align: center;
  font-style: italic;
  animation: fadeIn 2s ease-in-out;
}

.background-circle {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(76, 201, 240, 0.2);
  top: -40px;
  right: -40px;
  animation: pulse 6s infinite;
}

.icon-circle {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 183, 77, 0.4);
  bottom: -30px;
  left: -30px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 6s infinite;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  color: #333;
  margin: 0;
}

h1 {
  text-align: center;
}

.category {
  margin: 20px 0;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.category h2 {
  margin: 0;
  padding: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
}

.book {
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.book img {
  width: 80px;
  height: 120px;
  margin-right: 20px;
}

.book h3 {
  margin: 0;
  flex: 1;
}

.book a {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  cursor: pointer;
}

.book a:hover {
  background-color: #0056b3;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
  padding: 5px 15px;
  font-size: 14px;
  cursor: pointer;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
