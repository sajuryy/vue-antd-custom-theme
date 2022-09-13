# vue-antd-theme

This template should help get you started developing with Vue 3 in Vite and Ant Design UIKit library.

There were added the  npm packages to the clean vue3 + vite project: 

- npm install -D less 
- npm install ant-design-vue

The next changes were added to project files:

to the vite.config.ts
```typescript
 css: {
    preprocessorOptions:{
      less: {
        modifyVars: {
          "primary-color": "#9FA3EF",
          "error-color": "#FF3C38",
          "btn-primary-color": "#090A17"
        },
        javascriptEnabled: true,
      },
    },
  }
```

to the main.ts
```typescript
//...
import Antd from "ant-design-vue"
import "ant-design-vue/dist/antd.dark.less"

//...
app.use(Antd)
//...
```

Feel free to use antd-vue components like:
```html
      <a-button type="primary">Primary Button</a-button>
      <a-button>Default Button</a-button>
      <a-button type="dashed">Dashed Button</a-button>
      <a-button type="text">Text Button</a-button>
      <a-button type="link">Link Button</a-button>

```

