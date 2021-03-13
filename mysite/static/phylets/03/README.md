# SpaceTime-Graph
helps drawing dynamic spacetime graph on websites
一个绘制动态的1+1维时空图的js项目
## 时空图
时空图中的基本元素包含坐标轴，世界线。根据狭义相对论，这些元素在不同参考系下符合洛伦兹变换。本项目可以绘制不同参考系的坐标轴和世界线，并自由地在不同参考系视角之间切换。

## js库
参见main.js 代码有详细注释，不过目前代码还比较乱，功能还不完善。
已经实现的功能包括基本元素的增减与绘制，参考系视角的切换。有待改善的包括辅助线的绘制，图例等其他必要ui的绘制，以及梳理用户接口的封装。


已经确定的主要函数：
1. 添加世界线：addWorldLine(name, x, v, lineColor)//name为名称，x为起始位置，v为运动速度，linecolor为世界线颜色
2. 删除世界线：removeWorldLine(name)//删除指定名称的世界线，若不能再会弹窗报错
3. 添加坐标轴：addAxis(name, x, v, canvas2d = bac2d)//添加坐标系，最后一个参数为所在的图层
4. 删除坐标轴：removeAxis(name)//删除指定名称的坐标轴
5. 居中世界线：centralizeWorldline(name)//将指定元素的起始点放在正中间显示
6. 切换惯性参考系视角：ChangeViewTo(name)//切换到指定名称的元素静止的惯性系

其余函数可能后续还会修改，如果想了解请阅读代码。
    
