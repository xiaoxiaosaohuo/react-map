import React, { PureComponent } from "react";

import { is, fromJS } from "immutable";
const isString = function (str) {
    return Object.prototype.toString.call(str) === "[object String]";
};

class BDMap extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loaded: !!window.BMap
        }
        this.map = null;
        this.src = `https://api.map.baidu.com/api?v=2.0&ak=${props.AK}`;
        this.mapId = props.id || "allmap";
    }
    //加载baidumap script
    loadJScript = () => {
        if (typeof BMap != 'undefined') {
            return;
        } else {
            let bmapSrc = `https://api.map.baidu.com/api?v=2.0&ak=${this.props.AK}&callback=init`;
            let script = document.querySelector(`script[src='${bmapSrc}']`);
            if (!script) {
                script = document.createElement("script");
                script.src = bmapSrc;
                document.body.appendChild(script);
            }

        }
    }
    //初始化

    init = (coords) => {
        const { showMarker } = this.props;
        this.autoMap(coords);
        if (showMarker) {
            if (Array.isArray(coords)) {
                coords.forEach(coord => {
                    this.addMarker(coord);
                })
            } else {
                this.addMarker(coords);
            }

        }

        this.addScroll();

    }

    //自动添加标记
    autoMap = (coords) => {
        const { center } = this.props;
        let centerPoint = null;
        if (Array.isArray(coords)) {
            centerPoint = new BMap.Point(coords[0].lng, coords[0].lat);
        } else {
            centerPoint = new BMap.Point(coords.lng, coords.lat);
        }
        if (!centerPoint) {
            centerPoint = new BMap.Point(center.lng, center.lat)
        }

        this.map.centerAndZoom(centerPoint, 16);  // 初始化地图,设置中心点坐标和地图级别


    }
    //添加滚动
    addScroll = () => {
        this.map.enableScrollWheelZoom(true);
    }
    //添加比例尺和放大缩小空间
    addRulers = () => {
        //添加比例尺和放大缩小控件
        var top_left_control = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT });// 左
        var top_right_navigation = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL }); //右上角，仅包含平移和缩放按钮
        this.map.addControl(top_left_control);
        this.map.addControl(top_right_navigation);
    }

    //添加标记
    addMarker = (coord) => {

        this.map.clearOverlays();
        const point = new BMap.Point(coord.lng, coord.lat);

        const marker = new BMap.Marker(point);

        this.map.addOverlay(marker);

        if (this.props.showInfoWindow) {
            const content = this.props.showInfoWindow(coord);
            const infoWindow = new BMap.InfoWindow(content);
            marker.addEventListener("click", () => { this.map.openInfoWindow(infoWindow, point); });

        }

        marker.enableDragging();
        marker.addEventListener("dragend", (e) => {
            this.props.onDrag && this.props.onDrag(e)
        })
    }
    //删除标注
    deletePoint = () => {
        const allOverlay = this.map.getOverlays();
        for (var i = 0; i < allOverlay.length - 1; i++) {
            if (allOverlay[i].getLabel().content == "我是id=1") {
                this.map.removeOverlay(allOverlay[i]);
                return false;
            }
        }
    }

    //智能搜索
    componentWillMount() {
        this.loadJScript();

    }
    componentDidMount() {
        const timeoutPromise = (timeout) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, timeout);
            });
        }
        const waitUntil = (props) => {
            return new Promise((resolve, reject) => {
                const map = new BMap.Map(this.mapId);
                resolve(map);
            }).catch(err => {
                console.log("there's no BMap yet. Waitting ...", err);
                return timeoutPromise(300).then(() => {
                    return waitUntil(props);
                });
            });
        }
        waitUntil(this.props).then(map => {
            // console.log(`[+] bmap loaded`, map);
            this.map = map
            this.init(this.props.coords);
            this.forceUpdate();

            this.props.callback && this.props.callback(map);
        });
    }


    componentWillReceiveProps(nextProps) {
        const prev = fromJS(this.props.coords)
        const next = fromJS(nextProps.coords);
        if (!is(prev, next)) {
            this.init(nextProps.coords)
        }
    }



    //设置位置
    setPlace = (myValue) => {
        const localSearch = new BMap.LocalSearch(this.map);
        localSearch.search(myValue);
        return new Promise((resolve, reject) => {
            localSearch.setSearchCompleteCallback((searchResult) => {
                const point = searchResult.getPoi(0).point;
                this.map.centerAndZoom(point, 16);
                this.addMarker(point)
                resolve(point)

            })
        })

    }

    render() {
        const styleA = {
            height: 500,
            position: 'relative'
        };
        const styleB = Object.assign({}, styleA, this.props.style)


        return (
            <div style={styleB}>

                <div id={this.mapId} style={{ height: "100%" }} >

                </div>

            </div>
        )

    }
}

BDMap.defaultProps = {
    center: {
        lat: "39.94746",
        lng: "116.359764",
    },
    style: {}
}
export default BDMap
