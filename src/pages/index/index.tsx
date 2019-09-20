import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { CanvasSign } from "../../components";
import styles from "./index.module.less";

interface State {
  isClear: boolean;
  isExport: boolean;
}
interface Props {}
export default class Index extends Component<Props, State> {
  config: Config = {
    navigationBarTitleText: "首页"
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      isClear: false,
      isExport: false
    };
  }
  handleClear = () => {
    this.setState({ isClear: !this.state.isClear });
  };
  handleExport = () => {
    this.setState({ isExport: !this.state.isExport });
  };
  handleExportFn = data => {
    console.log("画布图片:", data);
    if (data.status !== "ok") {
      Taro.showToast({ title: "保存图片失败", duration: 2000 });
    } else {
      Taro.showToast({
        title: "保存图片成功",
        icon: "success",
        duration: 2000
      });
    }
  };

  render() {
    const _textArr = [
      {
        text: "基于 Taro 小程序的一款 Canvas 签名插件",
        x: 10,
        y: 30,
        fontColor: "#000000",
        fontSize: 16,
        lineHeight: 15,
        padding: 20,
        maxLines: 2
      },
      {
        text: "可自定义文字和线段，可清除，可导出",
        x: 20,
        y: 100,
        fontColor: "#333333",
        fontSize: 12,
        lineHeight: 15,
        padding: 20,
        maxLines: 1
      }
    ];
    const _lineArr = [
      {
        x: 20,
        y: 110,
        _x: 230,
        _y: 110,
        w: 0.5
      }
    ];
    const { isClear, isExport } = this.state;
    return (
      <View className={styles.main}>
        <CanvasSign
          clearAction={isClear}
          exportAction={isExport}
          onCanvasExport={this.handleExportFn}
          canvasWidth="100vw"
          canvasHeight="90vh"
          textOptions={_textArr}
          lineOption={_lineArr}
        />
        <View className={styles.btns}>
          <View className={styles.clearBtn} onClick={this.handleClear}>
            清除
          </View>
          <View className={styles.submitBtn} onClick={this.handleExport}>
            提交
          </View>
        </View>
      </View>
    );
  }
}
