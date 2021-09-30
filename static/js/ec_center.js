var ec_center = echarts.init(document.getElementById('c2'), "dark");

// var mydata = [{'name': '上海', 'value': 318}, {'name': '齐齐哈尔市', 'value': 318},{'name': '云南', 'value': 162}];

var ec_center_option = {
    title: {
        text: '',
        subtext: '',
        x: 'left'
    },
    tooltip: {
        trigger: 'item'
    },
    //左侧小导航图标
    visualMap: {
        show: true,
        x: 'left',
        y: 'bottom',
        textStyle: {
            fontSize: 8,
        },
        splitList: [{ start: 1, end: 9 },
        { start: 10, end: 99 },
        { start: 100, end: 999 },
        { start: 1000, end: 9999 },
        { start: 10000 }],
        color: ['#8A3310', '#C64918', '#E55B25', '#F2AD92', '#F9DCD1']
    },
    //配置属性
    series: [{
        name: '累计确诊人数',
        type: 'map',
        mapType: 'china',
        roam: false, //拖动和缩放
        itemStyle: {
            normal: {
                borderWidth: .5, //区域边框宽度
                borderColor: '#009fe8', //区域边框颜色
                areaColor: "#ffefd5", //区域颜色
            },
            emphasis: { //鼠标滑过地图高亮的相关设置
                borderWidth: .5,
                borderColor: '#4b0082',
                areaColor: "#fff",
            }
        },
        label: {
            normal: {
                show: true, //省份名称
                fontSize: 8,
            },
            emphasis: {
                show: true,
                fontSize: 8,
            }
        },
        data: [] //mydata //数据
    }]
};
ec_center.setOption(ec_center_option);


var ec_center = echarts.init(document.getElementById('c2'), "dark");
var oBack = document.getElementById("back");

var catches = {};

var provinces = [
    "shanghai",
    "hebei",
    "shanxi",
    "neimenggu",
    "liaoning",
    "jilin",
    "heilongjiang",
    "jiangsu",
    "zhejiang",
    "anhui",
    "fujian",
    "jiangxi",
    "shandong",
    "henan",
    "hubei",
    "hunan",
    "guangdong",
    "guangxi",
    "hainan",
    "sichuan",
    "guizhou",
    "yunnan",
    "xizang",
    "shanxi1",
    "gansu",
    "qinghai",
    "ningxia",
    "xinjiang",
    "beijing",
    "tianjin",
    "chongqing",
    "xianggang",
    "aomen",
    "taiwan",
];

var provincesText = [
    "上海",
    "河北",
    "山西",
    "内蒙古",
    "辽宁",
    "吉林",
    "黑龙江",
    "江苏",
    "浙江",
    "安徽",
    "福建",
    "江西",
    "山东",
    "河南",
    "湖北",
    "湖南",
    "广东",
    "广西",
    "海南",
    "四川",
    "贵州",
    "云南",
    "西藏",
    "陕西",
    "甘肃",
    "青海",
    "宁夏",
    "新疆",
    "北京",
    "天津",
    "重庆",
    "香港",
    "澳门",
    "台湾",
];



oBack.onclick = function () {
    loadMap("china", "中国");
    oBack.style.setProperty('display', 'none');
};

loadMap("china", "中国");


// 加载地图
function loadMap(mapType, name) {
    var ec_center_option = {
        title: {
            text: name || mapType,
            left: "center",
            subtext: '',
            x: 'left'
        },
        //左侧小导航图标
        visualMap: {
            show: true,
            x: 'left',
            y: 'bottom',
            textStyle: {
                fontSize: 8,
            },
            splitList: [{ start: 1, end: 9 },
            { start: 10, end: 99 },
            { start: 100, end: 999 },
            { start: 1000, end: 9999 },
            { start: 10000 }],
            color: ['#8A3310', '#C64918', '#E55B25', '#F2AD92', '#F9DCD1']
        },
        //配置属性
        series: [{
            name: "累计确诊人数",
            type: "map",
            // mapType: 'china',
            mapType,
            roam: false, //是否开启鼠标缩放和平移漫游
            itemStyle: {
                //地图区域的多边形 图形样式
                normal: {
                    borderWidth: .5, //区域边框宽度
                    borderColor: '#009fe8', //区域边框颜色
                    areaColor: "#ffefd5", //区域颜色
                    //是图形在默认状态下的样式
                },
                emphasis: { //鼠标滑过地图高亮的相关设置
                    borderWidth: .5,
                    borderColor: '#4b0082',
                    areaColor: "#fff",
                }
            },
            label: {
                normal: {
                    show: true, //省份名称
                    fontSize: 8,
                },
                emphasis: {
                    show: true,
                    fontSize: 8,
                }
            },
            data: this.mydata //mydata //数据
            // aspectScale: mapType === "china" ? 0.75 : 1,
            // top: "10%", //组件距离容器的距离
        },
        ],
    };

    // 清理画布
    ec_center.clear();

    ec_center.setOption(ec_center_option);

    ec_center.off("click");

    if (mapType === "china") {
        // 全国时，添加click 进入省级
        ec_center.on("click", function (param) {
            //遍历取到provincesText 中的下标  去拿到对应的省js
            for (var i = 0; i < provincesText.length; i++) {
                if (param.name === provincesText[i]) {
                    //显示对应省份的方法
                    showProvince(provinces[i], provincesText[i]);
                    break;
                }
            }
            oBack.style.setProperty('display', 'block');
        });
    } else {
        // 省份，添加双击 回退到全国
        ec_center.on("dblclick", function () {
            loadMap("china", "中国");
        });
    }
}



// 展示对应的省
function showProvince(mapType, name) {
    //这写省份的js都是通过在线构建工具生成的，保存在本地，需要时加载使用即可，最好不要一开始全部直接引入。
    if (catches[name]) {
        loadMap(name);
    } else {
        catches[mapType] = true;

        loadBdScript(
            "$" + mapType + "JS",
            "../static/js/province/" + mapType + ".js",
            function () {
                loadMap(name);
            }
        );
    }
}

// 加载对应的JS
function loadBdScript(scriptId, url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) {
        //IE
        script.onreadystatechange = function () {
            if (
                script.readyState === "loaded" ||
                script.readyState === "complete"
            ) {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {
        // Others
        script.onload = function () {
            callback();
        };
    }
    script.src = url;
    script.id = scriptId;
    document.getElementsByTagName("head")[0].appendChild(script);
}
