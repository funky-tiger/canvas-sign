/**
 * CanvasSign.state 参数类型
 *
 * @export
 * @interface CanvasSignState
 */
export interface CanvasSignState {
    imgWidth: number
    imgHeight: number
    isClear: boolean
    isExport: boolean
}

/**
 * CanvasSign.props 参数类型
 *
 * @export
 * @interface CanvasSignProps
 */
export interface CanvasSignProps {
    canvasWidth?: string
    canvasHeight?: string
    textOptions?: TextOptions[]
    lineOption?: LineOptions[]
    clearAction?: boolean
    exportAction?: boolean
    onCanvasExport?: Function
}

interface TextOptions {
    text: string
    x?: number
    y?: number
    fontColor?: string
    fontSize?: number
    lineHeight?: number
    padding?: number
    maxLines?: number
}
interface LineOptions {
    x: number
    y: number
    _x: number
    _y: number
    w?: number
}
