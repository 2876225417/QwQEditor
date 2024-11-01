<template>
  <div>
    <h1>Library</h1>
    <div id="books-count">{{ booksCountMessage }}</div>
    <div id="books-container">
      <p v-if="loading">Loading books...</p>
      <p v-else-if="error">{{ error }}</p>
      <div v-else>
        <div v-for="(books, category) in categorizedBooks" :key="category" class="category">
          <h2>{{ category }}</h2>
          <div v-for="book in books" :key="book.title" class="book">
            <img :src="`https://qintong.space${book.cover_link}`" :alt="book.title || 'Book Cover'" />
            <h3>{{ book.title || 'Book Title' }}</h3>
            <a :href="`https://qintong.space${book.book_link}`" target="_blank">Download</a>
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
  </div>
</template>

<script>
import { saveBooks, getBooks, saveConfig, getConfig } from "../indexedDB.js";

// 标准化对象数组函数，移除或调整不一致的属性
function normalizeData(data) {
  return data.map(item => {
    const { id, ...rest } = item; // 移除 id 属性
    return { ...rest }; // 返回没有 id 属性的对象
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

export default {
  data() {
    return {
      books: [],
      loading: true,
      error: null,
      currentPage: 1, // 当前页码
      booksPerPage: 5, // 每页显示的书籍数量
    };
  },
  computed: {
    booksCountMessage() {
      return `Total books: ${this.books.length}`;
    },
    categorizedBooks() {
      const categories = {};
      // 根据当前页码计算显示的书籍范围
      const startIndex = (this.currentPage - 1) * this.booksPerPage;
      const endIndex = startIndex + this.booksPerPage;

      // 截取当前页显示的书籍
      const paginatedBooks = this.books.slice(startIndex, endIndex);

      paginatedBooks.forEach((book) => {
        if (!categories[book.category]) {
          categories[book.category] = [];
        }
        categories[book.category].push(book);
      });
      return categories;
    },
    totalPages() {
      return Math.ceil(this.books.length / this.booksPerPage);
    }
  },
  methods: {
    async fetchBooks() {
      try {
        // 尝试从 IndexedDB 获取缓存的数据
        const cachedBooks = await getBooks();
        let shouldFetchFromAPI = true;

        // 输出缓存的书籍数据
        console.log("Cached Books Data:", cachedBooks);

        // 如果缓存存在，先使用缓存数据
        if (cachedBooks && cachedBooks.length > 0) {
          this.books = cachedBooks;
          shouldFetchFromAPI = false; // 初步假设无需从 API 获取数据
        }

        // 加载最新数据的逻辑
        const timestamp = new Date().getTime(); // 防止浏览器缓存
        const response = await fetch(`https://qintong.space/qwq/BooksFetch?t=${timestamp}`, {
          method: "GET",
          headers: {
            Authorization: "youwenfei1025",
            "Cache-Control": "no-cache", // 禁用缓存
          },
        });

        if (!response.ok) throw new Error("Failed to fetch books");

        const data = await response.json();

        // 输出从 API 获取的新书籍数据
        console.log("Fetched Books Data from API:", data);

        // 标准化数据格式
        const normalizedCachedBooks = normalizeData(cachedBooks);
        const normalizedFetchedData = normalizeData(data);

        // 使用深度比较函数检查数据是否相同
        const isDataSame = deepEqual(normalizedFetchedData, normalizedCachedBooks);
        console.log("Is the data from API same as cached data?", isDataSame);

        // 如果数据不同，则更新
        if (!isDataSame) {
          console.log("Data is different. Updating IndexedDB with new data.");
          this.books = data; // 使用最新数据
          await saveBooks(data); // 保存到 IndexedDB
        } else {
          console.log("Data is the same. No update needed.");
        }

      } catch (error) {
        this.error = "Failed to load books.";
        console.error("Error fetching books:", error);
      } finally {
        this.loading = false;
      }
    },
    // 翻页功能
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
    }
  },
  mounted() {
    this.fetchBooks();
  },
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  color: #333;
  margin: 0;
  padding: 20px;
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
