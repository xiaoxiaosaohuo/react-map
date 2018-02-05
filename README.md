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
showSearch | 是否展示搜索功能 | bool | false
showMarker | 展示提示信息 |function | 无
onDrag | 拖动回调 监听dragend事件|  func | 无
getPoint | 手动设置位置后获取新位置的坐标，返回promise | func | 无
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
