import Taro, { Component } from "@tarojs/taro";
import { View, Canvas } from "@tarojs/components";
import { CanvasSignProps, CanvasSignState } from "./index.interface";
import styles from "./index.module.less";

export class CanvasSign extends Component<CanvasSignProps, CanvasSignState> {
  constructor(props: CanvasSignProps) {
    super(props);
    this.state = {
      imgWidth: 0,
      imgHeight: 0,
      isClear: false,
      isExport: false
    };
  }
  static defaultProps: CanvasSignProps = {
    canvasWidth: "100vw",
    canvasHeight: "100vh",
    textOptions: [],
    lineOption: [],
    clearAction: false,
    exportAction: false,
    onCanvasExport: () => {}
  };
  public context = null;

  componentDidMount = () => {
    const { clearAction, exportAction } = this.props;
    this.setState({ isClear: clearAction, isExport: exportAction });
  };

  componentDidShow = () => {
    const { textOptions, lineOption } = this.props;
    const query = Taro.createSelectorQuery().in(this.$scope);
    const that = this;
    query.select("#myCanvas").boundingClientRect();
    query.exec(rect => {
      const width = rect[0].width;
      const height = rect[0].height;
      that.setState({
        imgWidth: width,
        imgHeight: height
      });
      const context = Taro.createCanvasContext("myCanvas", that.$scope);
      that.context = context;
      if (textOptions.length !== 0) {
        for (let i = 0; i < textOptions.length; i++) {
          that.canvasTextAutoLine(
            textOptions[i].text,
            context,
            textOptions[i].x,
            textOptions[i].y,
            textOptions[i].fontColor,
            textOptions[i].fontSize,
            textOptions[i].lineHeight,
            rect[0].width - textOptions[i].padding,
            textOptions[i].maxLines
          );
        }
      }
      // 分割线 lineOption
      if (lineOption.length !== 0) {
        for (let i = 0; i < lineOption.length; i++) {
          that.handleLine(
            context,
            lineOption[i].x,
            lineOption[i].y,
            lineOption[i]._x,
            lineOption[i]._y,
            lineOption[i].w
          );
        }
      }

      context.draw(true);
    });
  };

  handleLine = (ctx, x, y, _x, _y, w) => {
    ctx.moveTo(x, y);
    ctx.lineTo(_x, _y);
    if (w) ctx.setLineWidth(w);
    ctx.stroke();
  };

  canvasTextAutoLine = (
    str,
    ctx,
    initX,
    initY,
    fontColor,
    fontSize,
    lineHeight,
    canvasWidth,
    lines
  ) => {
    initX = initX || 0;
    initY = initY || 0;
    fontColor = fontColor || "#000000";
    fontSize = fontSize || 16;
    lineHeight = lineHeight || 15;
    canvasWidth = canvasWidth || 10;
    lines = lines || 1;

    let lineWidth = 0;
    let lastSubStrIndex = 0;
    const beginLineHeight = lineHeight;
    const beginY = initY;
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth - initX) {
        //减去initX,防止边界出现的问题
        if (initY >= beginY + beginLineHeight * (lines - 1)) {
          ctx.setStrokeStyle(fontColor);
          ctx.setLineWidth(1);
          ctx.setFontSize(fontSize);

          ctx.fillText(
            str.substring(lastSubStrIndex, i - 1) + "...",
            initX,
            initY
          );
          return;
        } else {
          ctx.setStrokeStyle(fontColor);
          ctx.setLineWidth(1);
          ctx.setFontSize(fontSize);
          ctx.fillText(str.substring(lastSubStrIndex, i), initX, initY);
          initY += lineHeight;
          lineWidth = 0;
          lastSubStrIndex = i;
        }
      }
      if (i == str.length - 1) {
        ctx.setStrokeStyle(fontColor);
        ctx.setLineWidth(1);
        ctx.setFontSize(fontSize);
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY);
      }
    }
  };

  /**记录开始点 */
  bindtouchstart = e => {
    this.context.moveTo(e.changedTouches[0].x, e.changedTouches[0].y);
  };

  /**记录移动点，刷新绘制 */
  bindtouchmove = e => {
    this.context.lineTo(e.changedTouches[0].x, e.changedTouches[0].y);
    this.context.stroke();
    this.context.draw(true);
    this.context.moveTo(e.changedTouches[0].x, e.changedTouches[0].y);
  };

  /**清空画布 */
  handleClear = () => {
    const { imgWidth, imgHeight } = this.state;
    const { textOptions, lineOption } = this.props;
    this.context.clearRect(0, 0, imgWidth, imgHeight);
    this.context.draw();
    this.context.setStrokeStyle("#000000");
    this.context.setLineWidth(1);
    this.context.setFontSize(10);

    const context = this.context;

    if (textOptions.length !== 0) {
      for (let i = 0; i < textOptions.length; i++) {
        this.canvasTextAutoLine(
          textOptions[i].text,
          context,
          textOptions[i].x,
          textOptions[i].y,
          textOptions[i].fontColor,
          textOptions[i].fontSize,
          textOptions[i].lineHeight,
          imgWidth - textOptions[i].padding,
          textOptions[i].maxLines
        );
      }
    }

    // 分割线
    if (lineOption.length !== 0) {
      for (let i = 0; i < lineOption.length; i++) {
        this.handleLine(
          context,
          lineOption[i].x,
          lineOption[i].y,
          lineOption[i]._x,
          lineOption[i]._y,
          lineOption[i].w
        );
      }
    }

    context.draw();
  };

  /**导出图片 */
  handleExport = () => {
    const { imgWidth, imgHeight } = this.state;
    const _this = this;
    this.context.draw(true, () => {
      setTimeout(() => {
        Taro.canvasToTempFilePath(
          {
            x: 0,
            y: 0,
            width: imgWidth,
            height: imgHeight,
            destWidth: imgWidth,
            destHeight: imgHeight,
            fileType: "jpg",
            canvasId: "myCanvas",
            success(res) {
              _this.props.onCanvasExport({ status: "ok", res });
            },
            fail(e) {
              _this.props.onCanvasExport({ status: "fail", e });
            }
          },
          _this.$scope
        );
      }, 0);
    });
  };

  componentWillReceiveProps(props) {
    const { clearAction, exportAction } = props;
    const { isClear, isExport } = this.state;
    if (isClear !== clearAction) {
      this.setState({ isClear: clearAction }, () => {
        this.handleClear();
      });
    }
    if (isExport !== exportAction) {
      this.setState({ isExport: exportAction }, () => {
        this.handleExport();
      });
    }
  }

  render() {
    const { canvasWidth, canvasHeight } = this.props;
    return (
      <View className={styles.CanvasSignMain}>
        <Canvas
          canvasId="myCanvas"
          id="myCanvas"
          style={{ width: canvasWidth, height: canvasHeight }}
          onTouchStart={this.bindtouchstart}
          onTouchMove={this.bindtouchmove}
          disableScroll
        ></Canvas>
      </View>
    );
  }
}
