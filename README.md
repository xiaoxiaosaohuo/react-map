# react baidu map
## 添加地图标记

# Install

```
npm install react-map-bdmap --save
```

## API


属性| 描述 | 类型
---|--- | ---
AK |秘钥 |无
coords | 坐标|  array
showSearch | 是否展示搜索功能 | false
showMarker | 展示提示信息 |function


# usage


```
 import  BDMap from "react-map-bdmap";
 const mapAK = "xxxx";//秘钥

 <BDMap
    AK={mapAK}
    showMarker={showMarker}
    coords={coords}
    showSearch={true}
>
    <Input placeholder="请输入地址" ></Input>
</BDMap>
```
