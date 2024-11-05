<template>
  <li>
    <div class="file-tree-node" @click="handleClick">
      <span>{{ node.name }}</span>
    </div>
    <ul v-if="node.children && node.children.length">
      <file-tree-node
          v-for="child in node.children"
          :key="child.path"
          :node="child"
          @node-click="$emit('node-click', child)"
      />
    </ul>
  </li>
</template>

<script>
export default {
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleClick() {
      this.$emit('node-click', this.node);
    }
  }
};
</script>

<style>
.file-tree-node {
  margin: 4px 0;
}
</style>
