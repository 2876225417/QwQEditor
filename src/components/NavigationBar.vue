<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
          expand-on-hover
          :theme="theme"
          permanent
          rail
          width="250"
          rounded
      >
        <v-list-item
            class="avatar-icon"
            prepend-avatar="https://ppqwqqq.space/wp-content/uploads/2024/11/61179629.jpg"
            nav
        >
          <v-list-item-content>
            <v-list-item-title
                :style="{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: fontColor,


            }">
                 ⭐ppQwQqq⭐
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-content>
            <v-list-item-title
                :style="{ fontSize: '10px', fontWeight: 'bold', color: fontColor }">
              Website: ppqwqqq.space
            </v-list-item-title>
          </v-list-item-content>


        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
            class="list-icon"
            prepend-icon="mdi-wechat"
            title="ppywfqq"
            nav
        ></v-list-item>

        <v-list-item
            class="list-icon"
            prepend-icon="mdi-github"
            title="2876225417"
            nav
        ></v-list-item>



        <v-divider></v-divider>

        <v-list
            density="compact"
            nav
        >
          <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard">
          </v-list-item>


          <v-list-item prepend-icon="mdi-forum" title="message" value="messages"></v-list-item>

          <v-list-group value="Users">
            <template v-slot:activator="{ props }">
              <v-list-item
                  v-bind="props"
                  prepend-icon="mdi-account-circle"
                  title="Users"
              ></v-list-item>
            </template>

            <v-list-group value="Admin">
              <template v-slot:activator="{ props }">
                <v-list-item
                    v-bind="props"
                    title="Admin"
                ></v-list-item>
              </template>

              <v-list-item
                  v-for="([title, icon], i) in admins"
                  :key="i"
                  :prepend-icon="icon"
                  :title="title"
                  :value="title"
              ></v-list-item>
            </v-list-group>

            <v-list-group value="Actions">
              <template v-slot:activator="{ props }">
                <v-list-item
                    v-bind="props"
                    title="Actions"
                ></v-list-item>
              </template>

              <v-list-item
                  v-for="([title, icon], i) in cruds"
                  :key="i"
                  :prepend-icon="icon"
                  :title="title"
                  :value="title"
              ></v-list-item>
            </v-list-group>
          </v-list-group>

          <v-list-item
              prepend-icon="mdi-forum"
              title="setting"
              value="setting"
              :to="{ path: '/pdfReader'}"
          ></v-list-item>

          <v-list-item
              prepend-icon="mdi-forum"
              title="FileTree"
              value="FileTree"
              :to="{ path: '/FileTree' }"
          >
          </v-list-item>

          <v-list-item
            prepend-icon="mdi-forum"
            title="Test"
            value="Test"
            :to="{ path: '/test'}"
          ></v-list-item>

          <v-list-item
              prepend-icon="mdi-forum"
              title="OpenGL"
              value="OpenGL"
              :to="{ path: '/OpenGL'}"
          ></v-list-item>

        </v-list>
      </v-navigation-drawer>
      <v-main style="height: 300px"></v-main>
    </v-layout>
  </v-card>
</template>
<script>
import { mapGetters } from "vuex";


export default {
  computed: {
    ...mapGetters([ 'isDarkMode' ]),
    theme(){
      return this.isDarkMode ? "dark" : "light";
    },
    fontColor(){
      return this.isDarkMode ? '#ffffff' : '#444';
    }
  }
}
</script>

<style scoped>

.item-font{
  color: white;

}

body.dark-mode .item-font{
  color: #f4f4f4;
}


.list-icon{
  left: 7px;


}

.avatar-icon{
  left: 7px;
}

.card{

}


</style>