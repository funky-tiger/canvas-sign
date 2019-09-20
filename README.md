## 基于 Taro 小程序的一款 Canvas 签名插件

### 应用场景

> 关于合同/协议 需要手写签字的业务场景 注: 该插件仅适用于Taro微信小程序， 其他端没有进行测试

### 使用方法

```js
1. /*安装*/ npm i canvas-sign -S

2. /*引入*/ import { CanvasSign } from "canvas-sign";

3. /*使用*/ <CanvasSign
              canvasWidth={String}
              canvasHeight={String}
              textOptions={Array}
              lineOption={Array}
              clearAction={Boolean}
              exportAction={Boolean}
              onCanvasExport={Function}
            />
```

### 相关 API

#### canvasWidth / canvasHeight 画布尺寸

> type: String

- example:

```js
const canvasWidth = "100vw";
const canvasHeight = "100vh";
```

#### textOptions 文本

> type: Array

- example:

```js
const textOptions = [
      {
        text: "基于 Taro 小程序的一款 Canvas 签名插件",
        x: 50,
        y: 30,
        fontColor: "#000000",
        fontSize: 16,
        lineHeight: 15,
        padding: 20,
        maxLines: 1
      },
      /*参数详解*/
      {
        text: 文本内容,
        x: 位置x,
        y: 位置y,
        fontColor: 字体颜色,
        fontSize: 字体大小,
        lineHeight: 字体行高,
        padding: 字体水平边距,
        maxLines: 最大行数 超出显示省略号
      }
    ];
```

#### lineOption 线段

> type: Array

- example:

```js
const lineOption = [
  {
    x: 20,
    y: 215,
    _x: 300,
    _y: 215,
    w: 0.5
  },
  /*参数详解*/
  {
    x: 线段起始点x,
    y: 线段起始点y,
    _x: 线段结束点x,
    _y: 线段结束点y,
    w: 线段宽度
  }
];
```

#### 清除画布行为 clearAction

> type: Boolean

- example:

```js
const clearAction = false;

/*注： 开发者只需改变该布尔值即可清除画布*/
```

#### 将画布导出为图片行为 exportAction

> type: Boolean

- example:

```js
const exportAction = false;

/*注：获取画布图片需两个参数： 1.exportAction  2.onCanvasExport
  开发者只需改变该布尔值即可导出画布，导出后的画布通过回调函数onCanvasExport的参数拿到
  需开发者手动提供该回调函数 onCanvasExport*/

/*注： 目前只支持.jpg格式*/
```

#### 获取画布导出后的图片的回掉 onCanvasExport

> type: Function

- example:

```js
const onCanvasExport = data => {
  console.log("监听到exportAction的值发生变化后获取到的画布图片:", data);
  /*注： 开发者只需改变该布尔值即可清除画布*/
};
```
