"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

require("./style.css");

var _immutable = require("immutable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BDMap = function (_PureComponent) {
    (0, _inherits3.default)(BDMap, _PureComponent);

    function BDMap(props) {
        (0, _classCallCheck3.default)(this, BDMap);

        var _this = (0, _possibleConstructorReturn3.default)(this, (BDMap.__proto__ || (0, _getPrototypeOf2.default)(BDMap)).call(this, props));

        _this.loadBmap = function () {
            _this.init();
            window.mapOnLoad = null;
        };

        _this.loadJScript = function () {
            window.mapOnLoad = _this.loadBmap;
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = _this.src + "&callback=mapOnLoad";
            document.body.appendChild(script);
        };

        _this.addMarker = function (coord) {
            var point = new BMap.Point(coord.longitude, coord.latitude);
            var marker = new BMap.Marker(point);
            _this.map.addOverlay(marker);
            if (_this.props.showMarker) {
                var content = _this.props.showMarker(coord);
                var infoWindow = new BMap.InfoWindow(content);
                marker.addEventListener("click", function () {
                    this.openInfoWindow(infoWindow);
                });
            }
        };

        _this.autoMap = function (coords) {
            _this.map.clearOverlays();
            var lastCoord = coords[coords.length - 1];
            var lastPoint = new BMap.Point(lastCoord.longitude, lastCoord.latitude);
            _this.map.centerAndZoom(lastPoint, 16);
            coords.forEach(function (coord) {
                _this.addMarker(coord);
            });
        };

        _this.addScroll = function () {
            _this.map.enableScrollWheelZoom(true);
        };

        _this.addRulers = function () {
            var top_left_control = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT });
            var top_right_navigation = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL });
            _this.map.addControl(top_left_control);
            _this.map.addControl(top_right_navigation);
        };

        _this.init = function () {
            _this.map = new BMap.Map("allmap");
            if (_this.props.coords.length > 0) {
                _this.autoMap(_this.props.coords);
                _this.addRulers();
                _this.addScroll();
            } else {
                var geolocation = new BMap.Geolocation();

                geolocation.getCurrentPosition(function (r) {
                    console.log('获取到当前地址', r);
                    var coords = [{
                        latitude: "39.94746",
                        longitude: "116.359764",
                        shopCount: '',
                        shopName: '暂无数据',
                        tel: '暂无数据',
                        address: '暂无数据'
                    }];
                    _this.autoMap(coords);
                    _this.addRulers();
                    _this.addScroll();
                });
            }
        };

        _this.deletePoint = function () {
            var allOverlay = _this.map.getOverlays();
            for (var i = 0; i < allOverlay.length - 1; i++) {
                if (allOverlay[i].getLabel().content == "我是id=1") {
                    _this.map.removeOverlay(allOverlay[i]);
                    return false;
                }
            }
        };

        _this.onSearchChange = function (e) {
            _this.searchText = e.target.value;
            if (!e.target.value) {
                return false;
            }
            _this.setPlace(_this.searchText);
        };

        _this.setPlace = function (myValue) {
            _this.map.clearOverlays();
            var localSearch = new BMap.LocalSearch(_this.map);
            localSearch.search(myValue);
            localSearch.setSearchCompleteCallback(function (searchResult) {
                var point = searchResult.getPoi(0).point;
                _this.map.centerAndZoom(point, 16);
                var marker = new BMap.Marker(point);
                _this.map.addOverlay(marker);
            });
        };

        _this.state = {
            loaded: !!window.BMap
        };
        _this.searchText = "";
        _this.map = null;
        _this.src = "http://api.map.baidu.com/api?v=2.0&ak=" + props.AK;
        return _this;
    }

    (0, _createClass3.default)(BDMap, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            this.loadJScript();
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            var prev = (0, _immutable.fromJS)(this.props.coords);
            var next = (0, _immutable.fromJS)(nextProps.coords);
            if (!(0, _immutable.is)(prev, next)) {
                this.autoMap(nextProps.coords);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var showSearch = this.props.showSearch;

            return _react2.default.createElement(
                "div",
                { className: "mapwrapper" },
                showSearch && this.props.children && _react2.default.cloneElement(this.props.children, { onPressEnter: this.onSearchChange }),
                _react2.default.createElement("div", { id: "allmap", className: "mapwrapper" })
            );
        }
    }]);
    return BDMap;
}(_react.PureComponent);

BDMap.defaultProps = {
    coords: [],
    showSearch: false
};
exports.default = BDMap;