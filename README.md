# react baidu map
## 添加地图标记

# Install

```
npm install react-map-bdmap --save
```

## API


属性| 描述 | 类型 | 默认值
---|--- | --- | ---
AK |秘钥 |string | 无
coords | 坐标|  array | []
showMarker | 展示提示信息 |boolean | false
showInfoWindow | 信息窗口 | func | 返回html字符串，请用es6模板字符串
onDrag | 拖动回调 监听dragend事件|  func | 无
setPlace | 手动设置位置后获取新位置的坐标，返回promise ,需要设置ref属性后调用| func | 无
callback | 地图加载后的回调函数| func | 无 
id | 地图实例id 默认"allmap" | string



# usage


```
 import  BDMap from "react-map-bdmap";
 const mapAK = "xxxx";//秘钥

 <BDMap
    AK={mapAK}
    coords={coords}
>
</BDMap>
```
