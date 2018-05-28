"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

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

var _immutable = require("immutable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isString = function isString(str) {
    return Object.prototype.toString.call(str) === "[object String]";
};

var BDMap = function (_PureComponent) {
    (0, _inherits3.default)(BDMap, _PureComponent);

    function BDMap(props) {
        (0, _classCallCheck3.default)(this, BDMap);

        var _this = (0, _possibleConstructorReturn3.default)(this, (BDMap.__proto__ || (0, _getPrototypeOf2.default)(BDMap)).call(this, props));

        _this.loadJScript = function () {
            if (typeof BMap != 'undefined') {
                return;
            } else {
                var bmapSrc = "https://api.map.baidu.com/api?v=3.0&ak=" + _this.props.AK + "&callback=init";
                var script = document.querySelector("script[src='" + bmapSrc + "']");
                if (!script) {
                    script = document.createElement("script");
                    script.src = bmapSrc;
                    document.body.appendChild(script);
                }
            }
        };

        _this.init = function (coords) {
            var showMarker = _this.props.showMarker;

            _this.autoMap(coords);
            if (showMarker) {
                if (Array.isArray(coords)) {
                    coords.forEach(function (coord) {
                        _this.addMarker(coord);
                    });
                } else {
                    _this.addMarker(coords);
                }
            }

            _this.addScroll();
        };

        _this.autoMap = function (coords) {
            var center = _this.props.center;

            var centerPoint = null;
            if (Array.isArray(coords)) {
                centerPoint = new BMap.Point(coords[0].lng, coords[0].lat);
            } else {
                centerPoint = new BMap.Point(coords.lng, coords.lat);
            }
            if (!centerPoint) {
                centerPoint = new BMap.Point(center.lng, center.lat);
            }

            _this.map.centerAndZoom(centerPoint, 16);
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

        _this.addMarker = function (coord) {

            _this.map.clearOverlays();
            var point = new BMap.Point(coord.lng, coord.lat);

            var marker = new BMap.Marker(point);

            _this.map.addOverlay(marker);

            if (_this.props.showInfoWindow) {
                var content = _this.props.showInfoWindow(coord);
                var infoWindow = new BMap.InfoWindow(content);
                marker.addEventListener("click", function () {
                    _this.map.openInfoWindow(infoWindow, point);
                });
            }

            marker.enableDragging();
            marker.addEventListener("dragend", function (e) {
                _this.props.onDrag && _this.props.onDrag(e);
            });
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

        _this.getCurrentPoint = function () {
            return _this.currentPoint;
        };

        _this.setPlace = function (myValue) {
            var localSearch = new BMap.LocalSearch(_this.map);
            localSearch.search(myValue);
            return new _promise2.default(function (resolve, reject) {
                localSearch.setSearchCompleteCallback(function (searchResult) {
                    var point = searchResult.getPoi(0).point;
                    _this.map.centerAndZoom(point, 16);
                    _this.addMarker(point);
                    resolve(point);
                });
            });
        };

        _this.analysis = function (pt, city) {
            var geoc = new BMap.Geocoder();
            geoc.getLocation(new BMap.Point(pt.lng, pt.lat), function (res) {
                _this.map.clearOverlays();
                geoc.getPoint(res.address, function (pt) {
                    var point = new BMap.Point(pt.lng, pt.lat);
                    var marker = new BMap.Marker(point);
                    _this.currentPoint = pt;
                    _this.map.centerAndZoom(point, 12);
                    _this.map.panTo(point);
                    _this.map.addOverlay(marker);
                    var templ = "<div class=\"iploc-inf\"> \n                    <div class=\"ipLocTitle\">\n                        <span class=\"normal\">\n                            \u6211\u5728\n                        </span>\n                        <strong>\n                            " + res.address + " \n                         </strong>\n                         <span class=\"normal\">\n                            \u9644\u8FD1\n                         </span>\n                    </div>     \n                </div>\n                ";
                    marker.setLabel(new BMap.Label(templ, { offset: new BMap.Size(20, -10) }));
                }, city);
            });
        };

        _this.setInitPlace = function () {
            var geolocation = new BMap.Geolocation();
            var self = _this;
            _this.map.enableScrollWheelZoom(true);
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == 0) {
                    var city = r.address.city;

                    self.analysis(r.point, city);
                } else {
                    alert("抱歉，定位失败");
                }
            }, { enableHighAccuracy: true });
        };

        _this.state = {
            loaded: !!window.BMap
        };
        _this.map = null;
        _this.src = "https://api.map.baidu.com/api?v=3.0&ak=" + props.AK;
        _this.mapId = props.id || "allmap";
        _this.currentPoint = null;
        return _this;
    }

    (0, _createClass3.default)(BDMap, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            this.loadJScript();
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            var timeoutPromise = function timeoutPromise(timeout) {
                return new _promise2.default(function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, timeout);
                });
            };
            var waitUntil = function waitUntil(props) {
                return new _promise2.default(function (resolve, reject) {
                    var map = new BMap.Map(_this2.mapId);
                    resolve(map);
                }).catch(function (err) {
                    console.log("there's no BMap yet. Waitting ...", err);
                    return timeoutPromise(300).then(function () {
                        return waitUntil(props);
                    });
                });
            };
            waitUntil(this.props).then(function (map) {
                _this2.map = map;
                if (!_this2.props.coords) {
                    _this2.setInitPlace();
                } else {
                    _this2.init(_this2.props.coords);
                }

                _this2.props.callback && _this2.props.callback(map);
            });
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            var prev = (0, _immutable.fromJS)(this.props.coords);
            var next = (0, _immutable.fromJS)(nextProps.coords);
            if (!(0, _immutable.is)(prev, next)) {
                this.init(nextProps.coords);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var styleA = {
                height: 500,
                position: 'relative'
            };
            var styleB = (0, _assign2.default)({}, styleA, this.props.style);

            return _react2.default.createElement(
                "div",
                { style: styleB },
                _react2.default.createElement("div", { id: this.mapId, style: { height: "100%" } })
            );
        }
    }]);
    return BDMap;
}(_react.PureComponent);

BDMap.defaultProps = {
    center: {
        lat: "39.94746",
        lng: "116.359764"
    },
    style: {}
};
exports.default = BDMap;