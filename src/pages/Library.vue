<template>
  <div @contextmenu.prevent="showLibraryContextMenu($event)">
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
    </div>

    <div class="filter-container">
      <label for="category-filter">Filter by Category:</label>
      <select id="category-filter" v-model="selectedCategory">
        <option value="All">All</option>
        <option v-for="category in availableCategories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
      <span v-if="downloadPath">Selected Path: {{ downloadPath }}</span>
    </div>

    <div id="books-container">
      <p v-if="loading">Loading books...</p>
      <p v-else-if="error">{{ error }}</p>
      <div v-else>
        <div v-for="(books, category) in categorizedBooks" :key="category" class="category">
          <h2>{{ category }}</h2>
          <div v-for="book in books" :key="book.title" class="book">
            <img :src="`https://qintong.space${book.cover_link}`" :alt="book.title || 'Book Cover'" />
            <h3>{{ book.title || 'Book Title' }}</h3>
            <a v-if="book.book_link" @click.prevent="downloadBook(book)">Download</a>
            <span v-else>No download link available</span>
          </div>
        </div>
      </div>
      <!-- 原始翻页按钮 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>

    <div id="download-status" @click="showDownloadStatus" :style="circleStyle">
      <span>{{ currentDownloads }}</span>
    </div>



    <!-- 右键菜单 -->
    <div v-if="isLibraryContextMenuVisible" :style="libraryContextMenuStyle" class="context-menu">
      <ul>
        <li @click="openDownloadsPopup">查看已下载的书籍</li>
        <li @click="selectDownloadPath">选择下载路径</li>
        <li @click="prevPage">上一页</li>
        <li @click="nextPage">下一页</li>
        <li @click="closeDownloadsPopup">关闭</li>
      </ul>
    </div>

    <file-tree @context-menu="showFileTreeContextMenu"></file-tree>

    <!-- 弹窗结构 -->
    <div v-if="showDownloadsPopup">
      <h2>PDF 文件列表 ({{ downloadPath }})</h2>
      <file-tree :tree="fileTree"></file-tree> <!-- 使用文件树组件 -->
      <button @click="closeDownloadsPopup">关闭</button>
    </div>

    <!-- 输入弹窗 -->
    <InputDialog
        :title="dialogTitle"
        :visible="isDialogVisible"
        @confirm="handleDialogConfirm"
        @close="closeDialog"
    />
  </div>
</template>


<script>
import {
  saveBooks,
  getBooks,
  saveDownloadPath,
  getDownloadPath,
} from "../indexedDB.js";



import InputDialog from "../components/InputDialog.vue";
import FileTree from "../components/FileTree.vue";
const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");
import { mapState, mapMutations } from 'vuex';
import "../assets/styles/Library.css";


export default {
  components: {
    InputDialog,
    FileTree,
  },
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
      isDialogVisible: false,
      dialogTitle: "",
      dialogAction: null,
      currentFile: null,
      isContextMenuVisible: false,
      contextMenuStyle: {
        top: '0px',
        left: '0px',
      },
      fileTree: [],
      selectedItem: null,
      isLibraryContextMenuVisible: false,
      libraryContextMenuStyle: {},
    };
  },
  computed: {
    ...mapState(['isLibraryMenuVisible', 'isContextMenuVisible']), // 映射状态

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
    ...mapMutations(['setLibraryMenuVisible']), // 映射 setLibraryMenuVisible 方法

    hideLibraryMenu() {
      this.setLibraryMenuVisible(false); // 使用 mutation 隐藏菜单
    },

    showLibraryContextMenu(event) {
      // 检查 FileTree 是否有菜单显示，如果有，则关闭
      if (this.isContextMenuVisible) {
        this.hideContextMenu(); // 隐藏 FileTree 菜单
      }

      this.setLibraryMenuVisible(true); // 更新菜单状态

      this.isLibraryContextMenuVisible = true;

      // 设置上下文菜单的位置
      this.libraryContextMenuStyle = {
        top: `${event.clientY}px`,
        left: `${event.clientX}px`,
      };

      // 阻止事件冒泡
      event.stopPropagation();

      // 监听点击事件以隐藏菜单
      window.addEventListener('click', this.hideLibraryContextMenu);
    },
    hideLibraryContextMenu() {
      this.isLibraryContextMenuVisible = false;
      this.$store.commit('setLibraryMenuVisible', false); // 更新状态

      window.removeEventListener('click', this.hideLibraryContextMenu);
    },
    showFileTreeContextMenu(event) {
      // 将 FileTree 的上下文菜单状态设置为可见
      this.$refs.fileTree.showContextMenu(event);
    },
    handleMenuAction(action) {
      console.log(`Action selected: ${action}`);
      this.hideContextMenu();
    },
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
        const tree = await ipcRenderer.invoke('read-file-tree', this.downloadPath);

        console.log(tree);
        this.fileTree = tree;
        console.log("FileTree: ", this.fileTree);
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
    deleteFile(fileName) {
      const filePath = path.join(this.downloadPath, fileName);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("删除文件时出错：", err);
        } else {
          this.fetchPdfFiles();
        }
      });
    },
    showRenameDialog(file) {
      this.dialogTitle = `重命名 ${file}`;
      this.dialogAction = "rename";
      this.currentFile = file;
      this.isDialogVisible = true;
    },
    showCopyDialog(file) {
      this.dialogTitle = `复制 ${file} 到：`;
      this.dialogAction = "copy";
      this.currentFile = file;
      this.isDialogVisible = true;
    },
    showMoveDialog(file) {
      this.dialogTitle = `移动 ${file} 到：`;
      this.dialogAction = "move";
      this.currentFile = file;
      this.isDialogVisible = true;
    },
    handleDialogConfirm(userInput) {
      if (this.dialogAction === "rename") {
        this.renameFile(this.currentFile, userInput);
      } else if (this.dialogAction === "copy") {
        this.copyFile(this.currentFile, userInput);
      } else if (this.dialogAction === "move") {
        this.moveFile(this.currentFile, userInput);
      }
    },
    closeDialog() {
      this.isDialogVisible = false;
      this.currentFile = null;
      this.dialogAction = null;
    },
    renameFile(oldName, newName) {
      if (!newName.endsWith(".pdf")) {
        newName += ".pdf";
      }
      const oldPath = path.join(this.downloadPath, oldName);
      const newPath = path.join(this.downloadPath, newName);
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error("重命名文件时出错：", err);
        } else {
          this.fetchPdfFiles();
        }
      });
    },
    copyFile(fileName, destinationPath) {
      const sourcePath = path.join(this.downloadPath, fileName);
      const destPath = path.join(destinationPath, fileName);
      fs.copyFile(sourcePath, destPath, (err) => {
        if (err) {
          console.error("复制文件时出错：", err);
        } else {
          alert("文件复制成功！");
        }
      });
    },
    moveFile(fileName, destinationPath) {
      const sourcePath = path.join(this.downloadPath, fileName);
      const destPath = path.join(destinationPath, fileName);
      fs.rename(sourcePath, destPath, (err) => {
        if (err) {
          console.error("移动文件时出错：", err);
        } else {
          this.fetchPdfFiles();
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
    },
    isLibraryMenuVisible(newValue) {
      if (!newValue) {
        console.log("lib menu: ", this.isLibraryMenuVisible);
        this.hideLibraryMenu(); // 隐藏图书馆菜单
        this.isLibraryContextMenuVisible = false;
      }
    }
  },
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


