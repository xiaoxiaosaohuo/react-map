import React ,{PureComponent} from "react";
import  "./styles/style.css";
import {is,fromJS} from "immutable";

class BDMap extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            loaded:!!window.BMap
        }
        this.searchText="";
        this.map=null;
        this.src=`https://api.map.baidu.com/api?v=2.0&ak=${props.AK}`
    }
    loadBmap = () => {
          this.init();
        window.mapOnLoad = null;
    }
    //加载baidumap script
    loadJScript =()=> {
         window.mapOnLoad = this.loadBmap;
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = `${this.src}&callback=mapOnLoad`;
		document.body.appendChild(script);
	}
    //添加标记
    addMarker = (coord) =>{

        this.map.clearOverlays();
        const  point = new BMap.Point(coord.lng,coord.lat);
        this.map.centerAndZoom(point, 16);
        const marker = new BMap.Marker(point);

        this.map.addOverlay(marker);

        if(this.props.showMarker){
            const content  = this.props.showMarker(coord);
            var infoWindow = new BMap.InfoWindow(content);
            marker.addEventListener("click",  ()=> { this.map.openInfoWindow(infoWindow,point); });

        }

        marker.enableDragging();
        marker.addEventListener("dragend", (e)=>{
            this.props.onDrag&&this.props.onDrag(e)
        })
    }
    //自动添加标记
   autoMap = (coords) => {
       this.createMap();
       // 初始化地图,设置中心点坐标和地图级别，以最后一个坐标为基准
       if(Array.isArray(coords)){
           coords.forEach(coord =>{
               this.addMarker(coord);
           })
       }else{
           this.addMarker(coords);
       }

    }
    //添加滚动
    addScroll = ()=>{
        this.map.enableScrollWheelZoom(true);
    }
    //添加比例尺和放大缩小空间
    addRulers = ()=>{
        //添加比例尺和放大缩小控件
        var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT});// 左
        var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
        this.map.addControl(top_left_control);
        this.map.addControl(top_right_navigation);
    }
//初始化
  createMap = ()=>{
      this.map = new BMap.Map("allmap");
  }
   init = ()=>{
        // this.createMap();
       if(this.props.coords){
            this.autoMap(this.props.coords);
            this.addRulers();
            this.addScroll();
        }else {
            //获取当前地址
            var geolocation = new BMap.Geolocation();
            //这是个异步调用
            geolocation.getCurrentPosition((r) =>{
                console.log('获取到当前地址',r);
                const coords=[{
                    lat:"39.94746",
                    lng:"116.359764",
                    shopCount:'',
                    shopName:'暂无数据',
                    tel:'暂无数据',
                    address:'暂无数据',
                }];
                this.autoMap(r.point);
                this.addRulers();
                this.addScroll();
            });
        }
   }
   //删除标注
    deletePoint =()=>{
		const  allOverlay = this.map.getOverlays();
		for (var i = 0; i < allOverlay.length -1; i++){
			if(allOverlay[i].getLabel().content == "我是id=1"){
				this.map.removeOverlay(allOverlay[i]);
				return false;
			}
		}
	}
    //智能搜索
    componentWillMount(){
        this.loadJScript();
    }

    componentWillReceiveProps(nextProps){
        const prev = fromJS(this.props.coords)
        const next = fromJS(nextProps.coords);
        if(!is(prev,next)){
            //  this.map = new BMap.Map("allmap");
            this.autoMap(nextProps.coords)
        }
    }
    //搜索框内容改变
    onSearchChange = (e)=>{
        this.searchText = e.target.value;
        if(!e.target.value){
            return false
        }
        this.setPlace(this.searchText)
    }
   
    onBlur = (value)=>{
        if(!value){
            return false
        }
        this.setPlace(value)
    }

    //设置位置
    setPlace = (myValue)=>{
        const localSearch = new BMap.LocalSearch(this.map);
        localSearch.search(myValue);
        if(this.props.getPoint&& typeof this.props.getPoint === 'function' ){
            this.props.getPoint(new Promise((resolve, reject)=>{
                localSearch.setSearchCompleteCallback((searchResult) => {
                   const point = searchResult.getPoi(0).point;
                   this.addMarker(point)
                   resolve(point)

                })
            }))
        }else{
            localSearch.setSearchCompleteCallback((searchResult) => {
               const point = searchResult.getPoi(0).point;
               this.addMarker(point)
            })
        }
    }

    render(){
        const {showSearch,style} = this.props;
        return(
            <div className="mapwrapper" style={style}>

                {showSearch&&this.props.children&&React.cloneElement(this.props.children,{onPressEnter:this.onSearchChange,onBlur:this.onBlur})}

                <div id="allmap" className="mapwrapper">

                </div>
            </div>
        )

    }
}

BDMap.defaultProps={
    coords:[],
    showSearch:false
}
export default BDMap
