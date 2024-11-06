<template>
  <div class="input-dialog-overlay" v-if="visible" @click.self="close">
    <div class="input-dialog-content">
      <h3>{{ title }}</h3>
      <input type="text" v-model="userInput" />
      <div class="dialog-buttons">
        <button @click="confirm">确定</button>
        <button @click="close">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    visible: Boolean
  },
  data() {
    return {
      userInput: ""
    };
  },
  methods: {
    confirm() {
      this.$emit("confirm", this.userInput);
      this.close();
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.input-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.input-dialog-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
}

.dialog-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}

button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
