// Styles
import '@mdi/font/css/materialdesignicons.css'; // 引入 Material Design Icons
import 'vuetify/styles'; // 引入 Vuetify 样式
import { createVuetify } from 'vuetify'; // 引入创建 Vuetify 的函数

// 组件引入（如有需要）
import {
    VBtn,
    VRadio,
    VRadioGroup,
    VImg,
    VSwitch,
    VTextField,
    VSelect,
    VIcon,
    VToolbar,
    VCheckbox,
    VAutocomplete,
    VProgressLinear,
    VMenu,
    VList,
    VListItem,
    VListItemTitle,
    VCol,
    VRow,
    VContainer,
    VSpacer,
    VNavigationDrawer,
    VMain,
    VApp,
    VAppBar,
    VLayout,
    VDivider,
    VCard,
    VSheet,
    VAppBarNavIcon,
    VListGroup,
    VCardItem,
    VCardText,

} from 'vuetify/components'; // 引入 Vuetify 组件

// 创建 Vuetify 实例
export default createVuetify({
    components: {
        VBtn, // 注册 VBtn 组件
        VRadio,
        VRadioGroup,
        VImg,
        VSwitch,
        VTextField,
        VSelect,
        VIcon,
        VToolbar,
        VCheckbox,
        VAutocomplete,
        VProgressLinear,
        VMenu,
        VList,
        VListItem,
        VListItemTitle,
        VRow,
        VContainer,
        VSpacer,
        VCol,
        VNavigationDrawer,
        VMain,
        VApp,
        VAppBar,
        VLayout,
        VDivider,
        VCard,
        VSheet,
        VAppBarNavIcon,
        VListGroup,
        VCardItem,
        VCardText,
    },
    aliases: {
        VBtnPrimary: VBtn, // 自定义别名

    },
    defaults: {
        VBtnPrimary: {
            class: ['v-btn--primary', 'text-none'], // 默认样式
        },
        VBtn: {
            variant: 'flat', // 默认变体
        },
        VRadio: {
            color: "primary",
        },
        VRadioGroup: {
            color: "primary",
        }
    },

});
