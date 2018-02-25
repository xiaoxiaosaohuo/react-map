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

  class MyPage extends PureComponent{
    constructor(props){
        super(props);
    }
    
    componentDidMount(){
        console.log(this.map)
    }
    onPressEnter = (e)=>{
        this.map.setPlace(e.target.value)
        .then((point)=>{
            console.log(point);
            
        })
        
    }
    showInfoWindow = (point)=>{
        return `<div>
                <span>看到积分了</span>
            </div>
        `
    }
    onDrag = (e)=>{
        console.log(e.point);
    }
    render(){
        return(

        <div style={{height:4000}}>
            <ScrollNotice dataSource={data}  duration={3} />
            <Input onPressEnter={this.onPressEnter}>
            </Input>
            <Map
                AK={mapAK}
                id="shuaige"
                coords={[{
                    lat: "39.94746",
                    lng: "116.359764",}]}
                style={{ height: 400 }}
                showMarker
                showInfoWindow={this.showInfoWindow}
                ref={(ref)=>this.map=ref}
            >
                
            </Map>
            <div style={{margin:"40px"}}>
                <Map
                    AK={mapAK}
                    id="jinxin"
                    coords={[{
                        lat: "40.94746",
                        lng: "116.359764",
                    }]}
                    showMarker
                    style={{ height: 400 }}
                >
                    
                </Map>
                </div>
            
        </div>



    )
    }
}

export default MyPage;
```
