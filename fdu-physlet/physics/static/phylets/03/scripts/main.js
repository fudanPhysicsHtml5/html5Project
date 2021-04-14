//初始化canvas对象
var background = document.getElementById("background")
var bac2d = background.getContext("2d")
var spacetime = document.getElementById("spacetime")
var spa2d = spacetime.getContext("2d")
var ui = document.getElementById("ui")
var ui2d = ui.getContext("2d")
//获取页面元素
var name_input = document.getElementById("name")
var target_type_input = document.getElementById("target type")
var x_input = document.getElementById("x")
var v_input = document.getElementById("v")
var color0_input = document.getElementById("color0")
var alpha0_input = document.getElementById("alpha0")
var color1_input = document.getElementById("color1")
var alpha1_input = document.getElementById("alpha1")
var action_mode = document.getElementById("action mode")
var run_button = document.getElementById("run")
var addtocode_button = document.getElementById("add to code")
var run_code_button = document.getElementById("run code")
var export_png_button = document.getElementById("export png")
var code_input = document.getElementById("code")

//全局变量
var canvas_wid = background.clientWidth//画布宽度
var canvas_hei = background.clientHeight//画布长度
var canvas_margin = 40//边缘宽度 使用该参数调整画布大小

var WorldLineList = new Map()//世界线map
var AxisList = new Map()//坐标系map
var backgroundElements = new Map()//背景层上的辅助元素

var staticSpeed = 0 //静止参考系的速度

//常用图形
var axis = new Path2D()//坐标轴
var grid = new Path2D()//坐标网格
function setPath2D() {
    //坐标轴
    let wid = canvas_wid / 2 - canvas_margin
    let hei = canvas_hei - 2 * canvas_margin
    axis.moveTo(wid, 0)
    axis.lineTo(-wid, 0)
    axis.moveTo(0, 0)
    axis.lineTo(0, hei)
    axis.moveTo(-5, hei - 5)//y轴箭头
    axis.lineTo(0, hei)
    axis.lineTo(5, hei - 5)
    axis.moveTo(wid - 5, 5)//x轴箭头
    axis.lineTo(wid, 0)
    axis.lineTo(wid - 5, -5)
    //坐标网格
    let interval = 10//网格间隔宽度
    for (let i = -wid / interval; i < wid / interval; i++) {//纵轴
        grid.moveTo(interval * i, 0)
        grid.lineTo(interval * i, hei)
    }
    for (let i = 0; i < hei / interval; i++) {//纵轴
        grid.moveTo(-wid, interval * i)
        grid.lineTo(wid, interval * i)
    }
}

//时空图元素的类
class Axis {
    constructor(name = "defaultAxis", x = 0, v = 0, layer = bac2d) {
        //初始化属性，不可修改
        this.name = name
        this.x = x
        this.v = v
        this.layer = layer
    }
    //内部属性，不要直接修改和访问
    axisColor = "black"
    gridColor = "grey"
    showGrid = false

    //修改内部属性的方法
    setColor(gridC = "grey", axisC = "black") {
        //设置颜色
        this.axisColor = axisC
        this.gridColor = gridC
    }
    setshowGrid(TorF = !this.showGrid) {//无参数时默认为反转状态
        //设置是否显示网格
        this.showGrid = TorF
    }
    //静态元素绘制方法
    DrawGrid(canvas2d = this.layer, setgridColor = this.gridColor) {
        //绘制坐标网格
        canvas2d.save()
        Lorentz_transform(staticSpeed, canvas2d)

        Lorentz_transform(-this.v, canvas2d)
        canvas2d.translate(this.x, 0)

        canvas2d.strokeStyle = setgridColor
        canvas2d.stroke(grid)
        canvas2d.restore()
    }

    DrawAxis(canvas2d = this.layer, setaxisColor = this.axisColor) {
        //绘制坐标系
        canvas2d.save()
        Lorentz_transform(staticSpeed, canvas2d)

        Lorentz_transform(-this.v, canvas2d)
        canvas2d.translate(this.x, 0)

        canvas2d.strokeStyle = setaxisColor
        canvas2d.stroke(axis)
        canvas2d.restore()
    }

    DrawLight(canvas2d = this.layer, lightColor = "yellow") {
        //画出光的世界线(辅助线)
        canvas2d.save()
        canvas2d.translate(this.x, 0)
        canvas2d.beginPath()
        canvas2d.moveTo(0, 0)
        canvas2d.beginPath()
        canvas2d.moveTo(canvas_hei, canvas_hei)
        canvas2d.lineTo(0, 0)
        canvas2d.moveTo(-canvas_hei, canvas_hei)
        canvas2d.lineTo(0, 0)
        canvas2d.closePath()
        canvas2d.strokeStyle = lightColor
        canvas2d.stroke()
        canvas2d.restore()
    }

    DrawHyperbola(distance, ylift = 0, canvas2d = this.layer, color = "orange") {
        //绘制校准曲线（双曲线）
        canvas2d.save()
        //canvas2d.translate(this.x,0)
        canvas2d.moveTo(0, 0)
        canvas2d.beginPath()
        canvas2d.moveTo(distance * 1 / Math.cos(-Math.PI * 1.5 + 0.001) + this.x, distance * Math.tan(-Math.PI / 2 - 0.001))
        for (let t = -Math.PI * 1.5 + 0.001; t < -Math.PI / 2 - 0.001; t = t + 0.01) {
            var hyperx = distance * 1 / Math.cos(t) + this.x
            var hypery = distance * Math.tan(t) + ylift
            canvas2d.lineTo(hyperx, hypery)
        }
        canvas2d.moveTo(distance * 1 / Math.cos(-Math.PI / 2 + 0.001) + this.x, distance * Math.tan(Math.PI / 2 - 0.001))
        for (let t = -Math.PI / 2 + 0.001; t < Math.PI / 2 - 0.001; t = t + 0.01) {
            var hyperx = distance * 1 / Math.cos(t) + this.x
            var hypery = distance * Math.tan(t) + ylift
            canvas2d.lineTo(hyperx, hypery)
        }
        canvas2d.moveTo(0, 0)
        canvas2d.closePath()
        canvas2d.strokeStyle = color
        canvas2d.stroke()
        canvas2d.restore()
    }
}

class WorldLine {
    constructor(name, x, v, lineColor = "blue") {
        //初始化属性，不可修改
        this.name = name
        this.x = x
        this.v = v
        this.lineColor = lineColor
    }

    //修改内部属性的方法
    setColor(lineColor) {
        //设置颜色
        this.lineColor = lineColor
    }

    //静态元素绘制方法
    DrawWorldLine(canvas2d = spa2d, setlineColor = this.lineColor) {
        //绘制速度v的世界线
        canvas2d.save()
        Lorentz_transform(staticSpeed, canvas2d)
        Lorentz_transform(-this.v, canvas2d)
        canvas2d.translate(this.x, 0)
        canvas2d.beginPath()
        canvas2d.moveTo(0, 0)
        canvas2d.lineTo(0, canvas_hei)
        canvas2d.closePath()
        canvas2d.strokeStyle = setlineColor
        canvas2d.stroke()
        canvas2d.restore()
    }
}

//坐标变换
function trans_Descartes(canvas2d) {
    //从原绘图坐标系切换到笛卡尔坐标系
    canvas2d.translate(0, background.clientHeight)
    canvas2d.scale(1, -1)
    canvas2d.translate(canvas_wid / 2, canvas_margin)
}
function Lorentz_transform(v, canvas2d) {
    //洛沦兹变换
    let gamma = 1 / Math.sqrt(1 - v * v)
    canvas2d.transform(gamma, -gamma * v, -gamma * v, gamma, 0, 0)
}


//动画函数
function clearCanvas(canvas2d) {
    //清空画布
    canvas2d.save()
    canvas2d.resetTransform()
    canvas2d.clearRect(0, 0, canvas_wid, canvas_hei)
    canvas2d.restore()
}

function Draw() {
    //读取元素并绘制
    clearCanvas(spa2d)
    for (let axis of AxisList.values()) {
        axis.DrawAxis()
        if (axis.showGrid) {
            axis.DrawGrid()
        }
    }
    for (let worldline of WorldLineList.values()) {
        worldline.DrawWorldLine()
    }
}

function DrawBackground() {
    //绘制背景元素
    for (let bacEle of backgroundElements.values()) {
        bacEle.DrawAxis()
        if (axis.showGrid) {
            axis.DrawGrid()
        }
    }
}

function TransformAnimation(StartSpeed, TargetSpeed) {
    //不同速度的惯性系间切换动画
    var now = StartSpeed
    var dv = (TargetSpeed - StartSpeed) / 60
    var draw = function (time) {
        staticSpeed = now
        Draw()
        now += dv
        if (Math.abs(now - TargetSpeed) <= dv+0.01) {
            if (Math.abs(staticSpeed - TargetSpeed) > 0.001) {
                dv = 0.001 * dv/Math.abs(dv)
                wl = window.requestAnimationFrame(draw);
            }
            else {
            window.cancelAnimationFrame(wl)
            }
        }
        else {
            wl = window.requestAnimationFrame(draw);
        }
    }
    draw()
}

//用户接口
function addWorldLine(name, x, v, lineColor) {
    //添加世界线
    if (WorldLineList.has(name)) {//检测名称是否重复
        return 0//调用函数时，可以使用if(!addWorldLine)处理名字重复的异常
    }
    else {
        WorldLineList.set(name, new WorldLine(name, x, v, lineColor))
        return 1
    }
}
function removeWorldLine(name) {
    //删除世界线
    if (WorldLineList.has(name)) {//检测名称是否存在
        WorldLineList.delete(name)
        return 1
    }
    else {
        alert("不存在该元素，请检查名称是否正确")
        return 0
    }
}
function addAxis(name, x, v, canvas2d = bac2d) {
    //添加坐标系
    if (AxisList.has(name)) {//检测名称存在
        return 0
    }
    else {
        if (canvas2d === bac2d) {//如果在背景层则加入背景元素map
            backgroundElements.set(name, new Axis(name, x, v, canvas2d))
            DrawBackground()
        }
        else {
            AxisList.set(name, new Axis(name, x, v, canvas2d))

        }
        return 1
    }
}
function removeAxis(name) {
    //删除坐标系
    if (AxisList.has(name)) {//检测名称是否存在
        AxisList.delete(name)
        return 1
    }
    else {
        alert("不存在该元素，请检查名称是否正确")
        return 0
    }
}

function removeBackground(name) {//背景元素的设定有待商榷
    //删除背景元素
    if (backgroundElements.has(name)) {
        backgroundElements.delete(name)
    }
    else {
        alert("不存在该元素，请检查名称是否正确")
    }

}

function centralizeWorldline(name) {
    //将指定名称的世界线居中绘制
    var x = WorldLineList.get(name).x
    for (let axis of AxisList.values()) {
        axis.x -= x
    }
    for (let worldline of WorldLineList.values()) {
        worldline.x -= x
    }
    Draw()
}

function ChangeViewTo(name) {
    //切换到指定名称的惯性系的视角
    var v = WorldLineList.get(name).v
    console.log("target speed is", v)
    TransformAnimation(staticSpeed, v)
}

function DrawLight(axis_name, color = "yellow", canvas2d = bac2d) {
    //绘制指定坐标系光的世界线
    if (AxisList.has(axis_name)) {
        AxisList.get(axis_name).DrawLight(canvas2d, color)
    }
    else if (backgroundElements.has(axis_name)) {
        backgroundElements.get(axis_name).DrawLight(canvas2d, color)
    }
}


function DrawHyperbola(axis_name, distance, ylift = 0, color = "orange", canvas2d = bac2d) {
    //绘制指定坐标系距离x的校准曲线
    if (AxisList.has(axis_name)) {
        AxisList.get(axis_name).DrawHyperbola(distance, ylift, spa2d, color)
    }
    else if (backgroundElements.has(axis_name)) {
        backgroundElements.get(axis_name).DrawHyperbola(distance, ylift, canvas2d, color)
    }
}


//-----------------------------------//
//   以下是示例网页的相关函数        //
//-----------------------------------//


//页面事件
String.prototype.format = function () {
    //格式化字符串的辅助函数
    if (arguments.length == 0) return this;
    var param = arguments[0];
    var s = this;
    if (typeof (param) == 'object') {
        for (var key in param)
            s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
        return s;
    } else {
        for (var i = 0; i < arguments.length; i++)
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        return s;
    }
}


//网页上的控制面板还只是半成品
run_button.onclick = function () {
    //响应执行按钮
    var index = action_mode.selectedIndex
    switch (action_mode.options[index].value) {
        case "add":
            var typeIndex = target_type_input.selectedIndex
            switch (target_type_input.options[typeIndex].value) {
                case "worldline":
                    color = color0_input.value + parseInt(alpha0_input.value).toString(16)
                    addWorldLine(name_input.value, x_input.value, v_input.value, color)
                    Draw()
                    var str = "addWorldLine({0},{1},{2},{3})\n".format(name_input.value, x_input.value, v_input.value, color)
                    code_input.value += str
                    break
                case "background axis":
                    addAxis(name_input.value, x_input.value, v_input.value, bac2d)
                    break
                case "axis":
                    color0 = color0_input.value + parseInt(alpha0_input.value).toString(16)
                    color1 = color1_input.value + parseInt(alpha1_input.value).toString(16)
                    addAxis(name_input.value, x_input.value, v_input.value, spa2d)
                    AxisList.get(name_input.value).setColor(color1, color0)
                    var str1 = "addAxis({0},{1},{2},{3})\n".format(name_input.value, x_input.value, v_input.value, "spa2d")
                    var str = "AxisList.get({0}).setColor({1},{2})\n".format(name_input.value, color1, color0)
                    code_input.value += str1
                    code_input.value += str
                    Draw()
                    break
                case "light":
                    //color0 = color0_input.value +  parseInt(alpha0_input.value).toString(16)
                    //color0_input.value = "yellow"
                    //alpha0_input.value = 255
                    DrawLight(name_input.value)
                    var str = "DrawLight({0})\n".format(name_input.value)
                    code_input.value += str
                    break
                case "hyperbola":
                    DrawHyperbola("basic", x_input.value)
                    var str = "DrawHyperbola({0},{1})\n".format("basic", x_input.value)
                    code_input.value += str
                    break
                default:
                    break
            }
            break;
        case "remove":
            var typeIndex = target_type_input.selectedIndex
            switch (target_type_input.options[typeIndex].value) {
                case "worldline":
                    removeWorldLine(name_input.value)
                    Draw()
                    break
                case "background axis":
                    removeBackground(name_input.value)
                    Draw()
                    break
                case "axis":
                    removeAxis(name_input.value)
                    Draw()
                    break
                case "light":
                    //color0 = color0_input.value +  parseInt(alpha0_input.value).toString(16)
                    //color0_input.value = "yellow"
                    //alpha0_input.value = 255
                    Draw()
                    break
                case "hyperbola":
                    DrawHyperbola("basic", x_input.value)
                    Draw()
                    break
                default:
                    break
            }
            break;
        case "centralize":
            centralizeWorldline(name_input.value)
            break
        case "changeview":
            ChangeViewTo(name_input.value)
            break
        default:
            break;
    }
}

run_code_button.onclick = function () {
    var code = code_input.value
    console.log(code)
    eval(code)
}

export_png_button.onclick = function() {
    // 另存为图像
    var image0 = new Image();
    var image1 = new Image();
    image0.src = background.toDataURL("image/png");
	image1.src = spacetime.toDataURL("image/png");
    //js似乎没有IO功能？？怎么处理有待改进
}




//初始化
function init() {
    setPath2D()
    trans_Descartes(bac2d)
    trans_Descartes(spa2d)
    bac2d.save()
    spa2d.save()
    addAxis("basic", 0, 0)
}


//主程序

function TrainandPark() {
    //车库佯谬的时空图
    addAxis("parkhead", 150, 0, spa2d)
    AxisList.get("parkhead").setColor("grey", "#00000000")
    addAxis("trainhead", 0, 0.6, spa2d)
    AxisList.get("trainhead").setColor("grey", "green")
    //addAxis("traintail", -100, 0.7, spa2d)
    //AxisList.get("traintail").setColor("grey", "green")
    AxisList.get("trainhead").setshowGrid()
    //AxisList.get("parkhead").setshowGrid()
    addWorldLine("trainhead", 0, 0.6)
    addWorldLine("traintail", -100, 0.6)
    addWorldLine("parkhead", 150, 0, "red")
    addWorldLine("parktail", 50, 0, "red")
    Draw()
    //DrawLight("basic")
    //DrawHyperbola("basic", 100, 200)
    ChangeViewTo("trainhead")
    centralizeWorldline("trainhead")
    //DrawHyperbola("basic",100,125)
    ChangeViewTo()
}

init()
TrainandPark()

