<template>
  <ul>
    <li v-for="item in tree" :key="item.name"
        @contextmenu.prevent="showContextMenu($event, item)"
        @mouseenter="hoveredItem = item.name"
        @mouseleave="hoveredItem = null">
      <span :class="{ 'hovered': hoveredItem === item.name }" @click="toggle(item)" style="cursor: pointer;">
        <font-awesome-icon :icon="item.isFolder ? (item.expanded ? 'folder' : 'folder-closed') : 'file'" />
        {{ item.name }}
      </span>
      <div v-if="item.isFolder && item.expanded">
        <file-tree :tree="item.children"></file-tree>
      </div>
    </li>
  </ul>

  <!-- 上下文菜单 -->
  <div v-if="isContextMenuVisible" :style="contextMenuStyle" class="context-menu">
    <ul>
      <li @click="deleteFile(selectedItem)">删除</li>
      <li @click="showRenameDialog(selectedItem)">重命名</li>
      <li @click="showCopyDialog(selectedItem)">复制</li>
      <li @click="showMoveDialog(selectedItem)">移动</li>
      <li @click="createNewFolder(selectedItem)">新建文件夹</li>
    </ul>
  </div>
</template>

<script>

import { mapState, mapMutations } from 'vuex';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";



export default {
  components: { FontAwesomeIcon },
  props: {
    tree: Array, // 接收树状结构数据
  },
  computed: {
    ...mapState(['isLibraryMenuVisible']),
  },
  data() {
    return {
      isContextMenuVisible: false,
      contextMenuStyle: {
        top: '0px',
        left: '0px',
      },
      selectedItem: null, // 当前选中的文件或文件夹
      hoveredItem: null, // 当前悬停的文件或文件夹

    };
  },
  methods: {
    ...mapMutations(['setLibraryMenuVisible']), // 映射 mutation

    toggle(item) {
      if (item.isFolder) {
        item.expanded = !item.expanded; // 切换展开状态

      }
    },
    showContextMenu(event, item) {
      this.setLibraryMenuVisible(false);
      // 先检查是否有其他菜单存在
      if (this.isContextMenuVisible) {
        this.hideContextMenu(); // 隐藏当前菜单
      }

      this.selectedItem = item;
      this.isContextMenuVisible = true;

      console.log("contextmenu newval: ", this.isContextMenuVisible);


      // 设置上下文菜单的位置
      this.contextMenuStyle = {
        top: `${event.clientY}px`,
        left: `${event.clientX}px`,
      };

      // 阻止事件冒泡
      event.stopPropagation();

      // 监听点击事件以隐藏菜单
      window.addEventListener('click', this.hideContextMenu);
    },
    hideContextMenu() {
      this.isContextMenuVisible = false;
      window.removeEventListener('click', this.hideContextMenu);
    },
    deleteFile(item) {
      // 删除文件的逻辑
    },
    showRenameDialog(item) {
      // 重命名文件的逻辑
    },
    showCopyDialog(item) {
      // 复制文件的逻辑
    },
    showMoveDialog(item) {
      // 移动文件的逻辑
    },
  },
  watch: {
    isLibraryMenuVisible(newVal) {
      console.log("library newval: ", newVal);
      if (newVal) {
        this.isContextMenuVisible = false; // 隐藏 FileTree 菜单
      }
    }
  }
};
</script>

<style scoped>
.hovered {
  background-color: #e0e0e0; /* 悬停时的背景色 */
  color: #000; /* 悬停时的文字颜色 */
}

.context-menu {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  z-index: 1000;
}

.context-menu ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.context-menu li {
  padding: 8px 12px;
  cursor: pointer;
}

.context-menu li:hover {
  background: #f0f0f0;
}
</style>
