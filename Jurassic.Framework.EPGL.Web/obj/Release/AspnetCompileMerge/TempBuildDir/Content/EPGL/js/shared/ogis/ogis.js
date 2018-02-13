// closure
(function($,ol,proj4) {
    // jrsc namespace
    window.jrsc = {};

    //jrsc.getCurrentPath = function () {
    //    var path = $('script:last').attr('src');
    //    path = path.substr(0, path.lastIndexOf('/') + 1);
    //    return path;
    //};
    //jrsc.path = jrsc.getCurrentPath();
    // math namespace
    jrsc.math = {};
    jrsc.math.isNumber = function (variable) {
        var isNum = parseFloat(variable);
        if (isNum.toString() == 'NaN') {
            isNum = false;
        } else {
            isNum = true;
        }
        return isNum;
    };
    //coordinate namespace
    jrsc.coordinate = {};
    jrsc.coordinate.toEPSG3857 = function (coordinate) {
        return proj4('EPSG:3857', coordinate);
    };
    jrsc.coordinate.parseFromNum = function (num1, num2, proj) {
        var coor = null,
            isNum = jrsc.math.isNumber;
        if (num1 && num2 && isNum(num1) && isNum(num2)) {
            coor = [num1, num2];
            if (proj && typeof proj == 'function')
                coor = proj(coor);
        }
        return coor;
    };
    jrsc.coordinate.parseFromArray = function (array, proj, isLatFirst) {
        var coors = [],
            len = array.length,
            coor,
            lng,
            lat;
        isLatFirst = isLatFirst || true;
        for (var i = 0; i < len; i = i + 2) {
            lng = isLatFirst ? array[i + 1] : array[i];
            lat = isLatFirst ? array[i] : array[i + 1];
            coor = jrsc.coordinate.parseFromNum(lng, lat, proj);
            coor && coors.push(coor);
        }
        return coors;
    };
    jrsc.coordinate.parseFromStringArray = function (strArray, proj) {
        var coors = [],
            len = strArray.length,
            str,
            num;
        for (var i = 0; i < len; i++) {
            str = strArray[i];
            num = parseFloat(str);
            coors.push(num);
        }
        coors = jrsc.coordinate.parseFromArray(coors, proj);
        return coors;
    };
    jrsc.coordinate.parseFromString = function (str, proj, spliter) {
        var coors,
            strArray;
        spliter = spliter || /\s+/g;
        strArray = str.split(spliter);
        coors = jrsc.coordinate.parseFromStringArray(strArray, proj);
        return coors;
    };
    //coordinates:[[p1,p2],[p1,p2]...]
    jrsc.coordinate.parseFromPointArray = function (type,pointArray, proj) {
        var coors = [];

        type = type.trim();

        switch (type) {
            case 'Point':
                coors=jrsc.coordinate.parseToPoint(pointArray, proj);
                break;
            case 'MultiPoint':
                //{ "type": "MultiPoint",
                //    "coordinates": [ [100.0, 0.0], [101.0, 1.0] ]
                //}
                
                break;
            case 'LineString':
                coors=jrsc.coordinate.parseToLine(pointArray, proj);
                break;
            case 'MultiLinearString':
                //{ "type": "MultiLineString",
                //    "coordinates": [
                //        [ [100.0, 0.0], [101.0, 1.0] ],
                //        [ [102.0, 2.0], [103.0, 3.0] ]
                //    ]
                //}
                coors=jrsc.coordinate.parseToPolygon(pointArray, proj);
                break;
            case 'Polygon':
                coors=jrsc.coordinate.parseToPolygon(pointArray, proj);
                break;
            case 'MultiPolygon':
                //{ "type": "MultiPolygon",
                //    "coordinates": [
                //      [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
                //      [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
                //       [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
                //    ]
                //}
                break;
            case 'GeometryCollection':
                //{ "type": "GeometryCollection",
                //    "geometries": [
                //      { "type": "Point",
                //          "coordinates": [100.0, 0.0]
                //      },
                //      { "type": "LineString",
                //          "coordinates": [ [101.0, 0.0], [102.0, 1.0] ]
                //      }
                //    ]
                //}
                break;
        }
        return coors;
    };
    //{ "type": "Point", "coordinates": [100.0, 0.0] }
    jrsc.coordinate.parseToPoint = function (pointArray, proj) {
        var coors = proj(pointArray[0]);
        return coors;
    };
    //"coordinates": [ [100.0, 0.0], [101.0, 1.0] ]
    jrsc.coordinate.parseToLine = function (pointArray, proj) {
        var point,
            len = pointArray.length,
            coor,
            coors=[];
        for (var i = 0; i < len; i++) {
            point = pointArray[i];
            coor = proj(point);

            coors.push(coor);
        }
        return coors;
    };
    //没有孔的
    //{ "type": "Polygon",
    //    "coordinates": [
    //      [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
    //    ]
    //}
    //有孔的
    //{ "type": "Polygon",
    //    "coordinates": [
    //      [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
    //      [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
    //    ]
    //}
    jrsc.coordinate.parseToPolygon = function (pointArray, proj) {
        var subCoors = [],
            point,
            len = pointArray.length,
            coor,
            coors = [];
        for (var i = 0; i < len; i++) {
            point = pointArray[i];
            coor = proj(point);
            subCoors.push(coor);
        }
        coors.push(subCoors);
        return coors;
    };

    //xml namespace
    jrsc.xml = {};
    jrsc.xml.parseFromString = function (xmlstr) {
        var dom = this.dom;
        try {
            if (window.DOMParser) {
                dom = (new DOMParser()).parseFromString(xmlstr, "text/xml");
            } else {
                if (window.ActiveXObject) {
                    dom = new ActiveXObject('Microsoft.XMLDOM');
                    dom.async = false;
                    if (!dom.loadXML(xmlstr))
                        throw new Error('xml解析失败');
                }
            }
        } catch (ex) {
            console && console.log(ex);
        }
        return dom;
    };
    jrsc.xml.cloneAttributes = function (element, obj) {
        var attrs = element.attributes,
            attr,
            nodeName;
        if(attrs.length>0) {
            obj = obj || {};
            for (var i = 0, ii = attrs.length; i < ii; i++) {

                attr = attrs[i];
                nodeName = attr.nodeName;
                obj[nodeName] = attr.nodeValue;
                //if (nodeName=="title") {
                //    obj["名称"] = attr.nodeValue;
                //}
                if (nodeName=="type") {
                    obj["类型"] = attr.nodeValue;
                }
            }
        }
        return obj;
    };

    jrsc.xml.getProperties = function (element,obj) {
        for (var n = element.firstElementChild; n; n = n.nextElementSibling) {
            localName = n.localName;
            if (localName == 'P') {
                var attrs = n.attributes,
           attr;
                if (attrs.length > 0) {
                    obj = obj || {};
                    for (var i = 0, ii = attrs.length; i < ii; i++) {
                        attr = attrs[i];
                        if (attr.localName == 'n') {
                            obj[attr.nodeValue] = n.textContent;
                        }                       
                    }
                }
            } 
        }
        return obj;
    };
    // geometry namespace
    jrsc.geom = {};
    jrsc.geom.type = ['Point','MultiPoint','LineString','LinearRing','MultiLineString','Polygon','MultiPolygon','GeometryCollection'];
    jrsc.geom.typeDic = {
        Point:'Point',
        MultiPoint:'MultiPoint',
        LineString:'LineString',
        LinearRing:'LinearRing',
        MultiLineString:'MultiLineString',
        Polygon:'Polygon',
        MultiPolygon:'MultiPolygon',
        GeometryCollection:'GeometryCollection'
    };
    jrsc.geom.isGeometryType = function(type){
        var is = false;
        if(type&&typeof type == 'string'){
            is = jrsc.geom.typeDic[type]?true:false;
        }
        return is;
    };
    jrsc.geom.isBaseGeometryType = function(type){

    };
    jrsc.geom.isGeometryTypeCommon = function(type,filter){

    };
    jrsc.geom.buildGeometry = function(type,coordinates){
        var geometry,
            isGeometryType = jrsc.geom.isGeometryType(type),
            isCoordinates = Array.isArray(coordinates);
        if(isGeometryType&&isCoordinates){
            geometry = jrsc.geom.buildGeometryCommon(type,coordinates);
        }
        return geometry;
    };
    jrsc.geom.buildGeometryCommon = function(type,coordinates){
        var geometry = {};
        geometry.type = type;
        geometry.coordinates = coordinates;
        return geometry;
    };
    // gml namespace
    jrsc.gml = {};
    jrsc.gml.buildGeometry = function (type, coordinates) {
        var geometry;
        if(type&&typeof(type) == 'string'&&coordinates && Array.isArray(coordinates)){
            geometry.type = type;
            geometry.coordinates = coordinates;
        }
        return geometry;
    };
    jrsc.gml.buildFeatureOfGeoJSON = function(geometry,properties){
        var feature;
        if(geometry&&geometry.type&&(geometry.coordinates||geometry.geometries)){
            feature = {};
            feature.type = 'Feature';
            feature.geometry = geometry;

            if (properties) {
                feature.properties = properties;
                if (properties.id) {
                    feature.id = properties.id;
                }
            }
        }
        return feature;
    };
    jrsc.gml.getParser = function (type) {
        var parser;
        type = type.trim();
        switch (type) {
            case 'Point':
                parser = jrsc.gml.parsePoint;
                break;
            case 'MultiPoint':
                parser = jrsc.gml.parseMultiPoint;
                break;
            case 'LineString':
                parser = jrsc.gml.parseLineString;
                break;
            case 'LinearRing':
                parser = jrsc.gml.parseLineRing;
                break;
            case 'MultiLinearString':
                parser = jrsc.gml.parseMultiLineString;
                break;
            case 'Polygon':
                parser = jrsc.gml.parsePolygon;
                break;
            case 'MultiPolygon':
                parser = jrsc.gml.parsePolygon;
                break;
        }
        return parser;
    };
    jrsc.gml.parseFrame = function (element) {
        var geometry = null,
            type = element.localName,
            collection = element.firstElementChild,
            parser = null,
            item;
        if (collection) {
            for (var n = collection.firstElementChild; n; n = n.nextElementSibling) {
                if (!parser)
                    parser = jrsc.gml.getParser(n.localName);
                item = parser && parser(n);
                if (item) {
                    if (!geometry)
                        geometry = jrsc.geom.buildGeometry(type, []);
                    geometry.coordinates.push(item.coordinates);
                }
            }
        }
        return geometry;
    };
    jrsc.gml.parsePoint = function (element) {
        var geometry = null,
            type = element.localName,
            coors = element.firstElementChild.textContent;
        coors = jrsc.coordinate.parseFromString(coors, jrsc.coordinate.toEPSG3857);
        if (coors.length == 1)
            geometry = jrsc.geom.buildGeometry(type, coors[0]);
        return geometry;
    };
    jrsc.gml.parseMultiPoint = function (element) {
        return jrsc.gml.parseFrame(element);
    };
    jrsc.gml.parseLineString = function (element) {
        var geometry = null,
            type = element.localName,
            coors = element.firstElementChild.textContent;
        coors = jrsc.coordinate.parseFromString(coors, jrsc.coordinate.toEPSG3857);
        if (coors.length > 1)
            geometry = jrsc.geom.buildGeometry(type, coors);
        return geometry;
    };
    jrsc.gml.parseLineRing = function (element) {
        var geometry = null,
            type = element.localName,
            coors = element.firstElementChild.textContent;
        coors = jrsc.coordinate.parseFromString(coors, jrsc.coordinate.toEPSG3857);
        var coorStart = coors[0],
            coorEnd = coors[coors.length - 1];
        if (coors.length > 4 && coorStart[0] == coorEnd[0] && coorStart[1] == coorEnd[1])
            geometry = jrsc.geom.buildGeometry(type, coors);
        return geometry;
    };
    jrsc.gml.parseMultiLineString = function (element) {
        return jrsc.gml.parseFrame(element);
    };
    jrsc.gml.parsePolygon = function (element) {
        return jrsc.gml.parseFrame(element);
    };
    jrsc.gml.parseMultiPolygon = function (element) {
        var geometry = jrsc.gml.parseFrame(element);
        geometry.type = 'MultiPolygon';
        return geometry;
    };
    jrsc.gml.parseGeometry = function (element) {
        var geomNode = element.firstElementChild,
            type = geomNode.localName,
            parser;
        if (type == 'MultiSurface')
            type = 'MultiPolygon';
        parser = jrsc.gml.getParser(type)
        return parser && parser(geomNode);
    };
    jrsc.gml.parseGeometryCollection = function (element) {
        var geometries = [],
            geometry;
        for (var n = element.firstElementChild; n; n = n.nextElementSibling) {
            geometry = jrsc.gml.parseGeometry(n);
            geometry && geometries.push(geometry);
        }
        if (geometries.length == 1) {
            geometries = geometries[0];
        } else if (geometries.length > 1) {
            geometries = {type: 'GeometryCollection', geometries: geometries};
        } else {
            geometries = null;
        }
        return geometries;
    };

    jrsc.gml.parseFeatureToGeoJSON = function (element) {
        var feature,
            properties,
            title,
            geometry,
            localName;
        properties = jrsc.xml.cloneAttributes(element, properties);
        for (var n = element.firstElementChild; n; n = n.nextElementSibling) {
            localName = n.localName;
            if (localName == 'Title') {
                title= n.textContent;
            } else if (localName == 'PropertySets') {
                //properties = jrsc.xml.cloneAttributes(n, properties);
                var pElement = n.firstElementChild;
                if (pElement && pElement.localName == 'PropertySet') {
                    properties = jrsc.xml.getProperties(pElement, properties);
                }
                
            } else if (localName=='Name') {

            }
            else {
                geometry = jrsc.gml.parseGeometryCollection(n);
            }
        }
        if (properties) {
            properties.title = title;
        }
            
        if(geometry)
            feature = jrsc.gml.buildFeatureOfGeoJSON(geometry,properties);
        return feature;
    };
    jrsc.gml.parseDocToGeoJSON = function (doc) {
        var features = [],
            feature,
            root;
        root = doc.documentElement;
        if (root.localName = 'FeatureCollection') {
            for (var n = root.firstElementChild; n; n = n.nextElementSibling) {
                if (n.localName == 'GF') {
                    feature = jrsc.gml.parseFeatureToGeoJSON(n);
                    feature && features.push(feature);
                }
            }
        }
        if(features.length >0){
            features = {
                type:'FeatureCollection',
                features:features
            }
        }
        return features;
    };
    jrsc.gml.parseCoordinatesToGeoJSON = function (type, coordinates, properties) {
        var geometry = jrsc.geom.buildGeometry(type, coordinates);
        var feature = jrsc.gml.buildFeatureOfGeoJSON(geometry, properties);
        return feature;
    };

    // ogis namespace
    var OGIS_DEFAULT_OPTIONS = {
        _Ogis_Group_Layer_Controller: {
            button: {id: 'ogis_group_button_layer_controller', img: '/img/shared/groupbtn.png', text: '图层管理'},
            drop: {id: 'ogis_group_drop_layer_controller', html: ''},
            panelId: 'ogis_group_drop_layer_controller_panel'
        },
        _Ogis_Default_Controller: {
            //defaults:["Zoom"]
            defaults: []
        }
    };
    jrsc.Ogis = Ogis;
    jrsc.Ogis.CONFIG = OGIS_DEFAULT_OPTIONS;
    function Ogis(element, options) {
        this.element$ = $(element);
        this.options = $.extend({}, OGIS_DEFAULT_OPTIONS, options);
        this.mapModel = {
            baseLayerUrl: '',
            extent: null,
            map: null,
            //center: null,
            minZoom: null,
            maxZoom: null,
            zoom: null,
            projection: null,
            vectorSource:null
        };
        this.controlModel= {
            customs: [],
            defaults: [],
            extend:[]
        }
        this.menuModel = {
            dic: {
                menu: {},
                menuItem: {},
                binding: {}
            },
            data: {
                menus: []
            }
        };
        this.groupModel = {
            dic: {
                btn: {},
                drop: {},
                binding: {}
            },
            data: {
                btns: [],
                drops: []
            }
        };
        this.layerModel = {
            dic: {
                layer: {},
                frozenLayer: {}
            },
            data: {
                layer:[]
            },
            mouseMoveLayer:null,
            currentLayer: null,
            controlPanelId: ''
        };
        this.featureModel = {
            dic: {
                selected: {},
                olFeature:{}
            },
            data: {
                selected: []
            },
            search:[],
            highLight:null
        };
        this.domDic = {};
        //this.basePath = jrsc.path;
        this.suffix = this.getSuffix();
        this.init();
    };
    //init
    Ogis.prototype.init = function () {
        this.initModel();
        this.render();
        this.initMap();
        this.initInteractions();
        this.registerEvent();
    };
    //init model
    Ogis.prototype.initModel = function () {
        this.initMapModel();
        this.initControlModel();
        this.initMenuModel();
        this.initGroupModel();
        this.initLayerModel();
    };
    Ogis.prototype.initMapModel = function () {
        var opt = this.options.map;
        var model = this.mapModel;
        if (opt) {
            if (opt.baseLayerUrl) {
                model.baseLayerUrl = opt.baseLayerUrl;
            }
            if (opt.extent) {
                model.extent = opt.extent;
            }
            //if (opt.center) {
            //    model.center = opt.center;
            //}
            if (opt.zoom) {
                model.zoom = opt.zoom;
            }
            if (opt.minZoom) {
                model.minZoom = opt.minZoom;
            }
            if (opt.maxZoom) {
                model.maxZoom = opt.maxZoom;
            }
            if (opt.projection) {
                model.projection = opt.projection;
            }
        }
    };
    //init controlModel
    Ogis.prototype.initControlModel=function() {
        var opt = this.options.control;
        var model = this.controlModel;
        model.defaults = this.options._Ogis_Default_Controller.defaults;
        if (opt) {
            if (opt.customs) {
                model.customs = opt.customs;
            }
            if (opt.defaults) {
                model.defaults = opt.defaults;
            }
            if (opt.extend) {
                model.extend = opt.extend;
            }
        }
    }
    // init menuModel
    Ogis.prototype.initMenuModel = function () {
        var opt = this.options.contextMenu;
        var model = this.menuModel;
        if (opt) {
            if (opt.menus) {
                model.data.menus = opt.menus;
            }
            if (opt.binding)
                model.dic.binding = opt.binding;
            this.createIndexer(model.dic.menu, model.data.menus);
            this.resolveMenuItemDic(model.dic.menuItem, model.data.menus);
        }
    };
    Ogis.prototype.resolveMenuItemDic = function (dic, menus) {
        var menu;
        for (var i = 0, ii = menus.length; i < ii; i++) {
            menu = menus[i];
            if (menu.menuItems) {
                this.createIndexer(dic, menu.menuItems);
            }
        }
        return dic;
    };
    //init groupButtonModel
    Ogis.prototype.initGroupModel = function () {
        var opt = this.options.group;
        var model = this.groupModel;
        if (opt) {
            if (opt.buttons)
                model.data.btns = opt.buttons;
            if (opt.drops)
                model.data.drops = opt.drops;
            if (opt.binding)
                model.dic.binding = opt.binding;
            this.addLayerController(model);
            this.createIndexer(model.dic.btn, model.data.btns);
            this.createIndexer(model.dic.drop, model.data.drops);
        }
    };
    Ogis.prototype.initLayerModel = function () {
        var model = this.layerModel;
        var layerController = this.options._Ogis_Group_Layer_Controller;
        model.controlPanelId = layerController.panelId;
    };
    Ogis.prototype.addLayerController = function (model) {
        var layerController = this.options._Ogis_Group_Layer_Controller;
        var button = layerController.button;
        button.img = button.img;
        var drop = layerController.drop;
        drop.html = this.buildGroupDropLayerControllerPanelHtml(layerController.panelId);
        //model.data.btns.push(button);
        //model.data.drops.push(drop);
        model.data.btns.splice(1,0,button);
        model.data.drops.splice(1,0,drop);
        model.dic.binding[button.id] = drop.id;
    };
    //render
    Ogis.prototype.render = function () {
        var ogis = this.buildHtml();
        this.element$.html(ogis);
    };
    Ogis.prototype.buildHtml = function () {
        var html = '<div class ="ogis" id="' + this.addSuffix('ogis') + '" >';
        html += '<div class="ogis-map" id="' + this.addSuffix('ogis_map') + '"></div>';
        html += this.buildVerticalOverlayHtml();
        html += this.buildHorizontalOverlayHtml();
        html += '</div>';
        return html;
    };
    Ogis.prototype.buildVerticalOverlayHtml = function () {
        var html = '<div class="ogis-vertical-overlay" id="' + this.addSuffix('ogis_vertical_overlay') + '">';
        html += this.buildBaseOverlayHtml();
        html += this.buildContextMenuOverlayHtml();
        html += this.buildPropertyOverlayHtml();
        html += '</div>';
        return html;
    };
    Ogis.prototype.buildHorizontalOverlayHtml = function () {
        return this.buildOverlayHtml('horizontal');
    };
    Ogis.prototype.buildOverlayHtml = function (orientation) {
        var html = '<div class="ogis-' + orientation + '-overlay" id="' + this.addSuffix('ogis_' + orientation + '_overlay') + '"></div>';
        return html;
    };
    Ogis.prototype.buildBaseOverlayHtml = function () {
        var html = '<div class="ogis-overlay-layer" id="' + this.addSuffix('ogis_overlay_base') + '">';
        html += this.buildSearchComponentHtml();
        //html += this.buildGroupComponentHtml();
        html += '</div>';
        return html;
    };
    Ogis.prototype.buildContextMenuOverlayHtml = function () {
        var html = '<div class="ogis-overlay-layer" id="' + this.addSuffix('ogis_overlay_context_menu') + '">';
        html += this.buildContextMenusHtml();
        html += '</div>';
        return html;
    };
    Ogis.prototype.buildPropertyOverlayHtml = function () {
        var html = '<div class="ogis-overlay-layer" id="' + this.addSuffix('ogis_overlay_property') + '"></div>';
        return html;
    };
    Ogis.prototype.buildSearchComponentHtml = function () {
        var component = '<div class="ogis-search" id="' + this.addSuffix('ogis_search') + '">';       
        component += '<div class="ogis-search-display" id="' + this.addSuffix('ogis_search_display') + '">';        
        component += '<div class="ogis-search-display-interact" id="' + this.addSuffix('ogis_search_display-interact') + '">';
        component += '<input type="text" placeholder="搜目标 搜矿区 搜井位" class="ogis-search-display-interact-input" id="' + this.addSuffix('ogis_search_display_interact_input') + '"/>';        
        component += '</div>';
        component += '<div class="ogis-search-display-interact" id="' + this.addSuffix('ogis_search_display-interact_select') + '">';
        component += '<select class="ogis-search-choice form-control" id="' + this.addSuffix('ogis-search_choice') + '"><option value="0" selected="true">目标</option><option value="1">图件</option></select>';
        component += '</div>';        
        component += '<div class="ogis-search-drops" id="' + this.addSuffix('ogis_search_drops') + '" style="display:none;"></div>';       
        component += '</div>';       
        component += '<button type="button" class="ogis-search-button" id="' + this.addSuffix('ogis_search_button') + '">搜索</button>';
        component += '</div>';
        return component;
    };
    // group
    Ogis.prototype.buildGroupComponentHtml = function () {
        var component = '<div class="ogis-group" id="' + this.addSuffix('ogis_group') + '">';
        component += this.buildGroupButtonsHtml();
        component += this.buildGroupDropsHtml();
        component += '</div>';
        return component;
    };
    // group buttons
    Ogis.prototype.buildGroupButtonsHtml = function () {
        var group = '<ul class="ogis-group-buttons" id="' + this.addSuffix('gis_group_buttons') + '">';
        group += this.resolveGroupButtons();
        group += '</ul>';
        return group;
    };
    Ogis.prototype.resolveGroupButtons = function () {
        var html = '',
            buttonArray = this.groupModel.data.btns,
            button;
        if (buttonArray) {
            for (var i = 0, ii = buttonArray.length; i < ii; i++) {
                button = buttonArray[i];
                html += this.buildGroupButtonHtml(button);
                if (i < ii - 1)
                    html += this.buildGroupSplitBar();
            }
        }
        return html;
    };
    Ogis.prototype.buildGroupButtonHtml = function (button) {
        var html = '<li class="ogis-group-button" id="' + this.addSuffix(button.id) + '">';
        html += '<img style="border:none" src="' + button.img + '"/>';
        html += '<span>' + button.text + '</span>';
        html += '</li>';
        return html;
    };
    Ogis.prototype.buildGroupSplitBar = function () {
        return '<li class="ogis-group-split-bar"></li>';
    };
    //group drops
    Ogis.prototype.buildGroupDropsHtml = function () {
        var drops = '<div class="ogis-group-drops" id="' + this.addSuffix('ogis_group_drops') + '">';
        drops += this.resolveGroupDrop();
        drops += '</div>';
        return drops;
    };
    Ogis.prototype.resolveGroupDrop = function () {
        var html = '',
            dropArray = this.groupModel.data.drops,
            drop;
        if (dropArray) {
            for (var i = 0, ii = dropArray.length; i < ii; i++) {
                drop = dropArray[i];
                html += this.buildGroupDropHtml(drop);
            }
        }
        return html;
    };
    Ogis.prototype.buildGroupDropHtml = function (drop) {
        var html = '<div class="ogis-group-drop" id="' + this.addSuffix(drop.id) + '">';
        html += '<div class="ogis-group-drop-header">';
        html += '<button class="ogis-group-drop-closer">X</button>';
        html += '</div>';
        html += '<div class ="ogis-group-drop-content">';
        html += drop.html;
        html += '</div>';
        html += '</div>';
        return html;
    };
    Ogis.prototype.buildGroupDropLayerControllerPanelHtml = function (panelId) {
        var html =  '<table class="ogis_group_drop_layer_controller_panel" id="' + this.addSuffix(panelId) + '">';
        //html += '<tr><td>图层</td><td>可视</td><td>冻结</td><td>过滤</td></tr>';
        html += '<tr><td>图层</td><td>可视</td><td>冻结</td></tr>';
        html += '</table>';
        return html;
    };
    Ogis.prototype.showGroupDropOnClick = function (ev) {
        var targetId = this.getEventTarget(ev).attr('id');
        this.showGroupDropByButtonId(targetId);
    };
    Ogis.prototype.showGroupDropByButtonId = function (id) {
        id = this.toRawId(id);
        var dropId = this.groupModel.dic.binding[id];
        var drop$ = this.getDom$(dropId);
        $('.ogis-group-drop').not(drop$).hide();
        drop$.slideToggle();
    };
    Ogis.prototype.shutGroupDropOnClick = function (ev) {
        this.getEventTarget(ev).closest('.ogis-group-drop').fadeOut();
    };
    // context menu
    Ogis.prototype.buildContextMenusHtml = function () {
        var html = '';
        html += this.resolveContextMenus();
        return html;
    };
    Ogis.prototype.resolveContextMenus = function () {
        var html = '',
            menuArray = this.menuModel.data.menus,
            menu;
        for (var i = 0, ii = menuArray.length; i < ii; i++) {
            menu = menuArray[i];
            html += this.buildContextMenuHtml(menu);
        }
        return html;
    };
    Ogis.prototype.buildContextMenuHtml = function (menu) {
        var html = '<ul class="ogis-context-menu" id="' + this.addSuffix(menu.id) + '">';
        html += this.resolveMenuItems(menu.menuItems);
        html += '</ul>';
        return html;
    };
    Ogis.prototype.resolveMenuItems = function (menuItems) {
        var html = '',
            menuItem;
        for (var i = 0, ii = menuItems.length; i < ii; i++) {
            menuItem = menuItems[i];
            html += this.buildMenuItemHtml(menuItem);
        }
        return html;
    };
    Ogis.prototype.buildMenuItemHtml = function (menuItem) {
        var img = menuItem.img || '';
        var html = '<li class="ogis-context-menu-item" id="' + this.addSuffix(menuItem.id) + '">';
        html += '<img src="' + img + '" />';
        html += '<span>' + menuItem.text + '</span>';
        return html;
    };
    //layer
    Ogis.prototype.addVecLayer = function (id,name, isVisible, isFrozen,isControl) {
        var layer = this.addLayerToMap(id,name,isVisible, isFrozen);
        this.addLayerToModel(layer);
        isControl&&this.addLayerToControlPanel(id, name, isVisible, isFrozen);
    };
    Ogis.prototype.addLayerToMap = function (id,name,isVisible, isFrozen) {
        var map = this.mapModel.map,
            layer = this.buildVecLayer(id,name,isVisible, isFrozen);
        map.addLayer(layer);
        return layer;
    };
    Ogis.prototype.addLayerToModel = function (layer) {
        var dic = this.layerModel.dic,
            array = this.layerModel.data.layer,
            id = layer.get('id'),
            isFrozen = layer.get('isFrozen');
        dic.layer[id] = layer;
        array.push(layer);
        if (!isFrozen) {
            delete dic.frozenLayer[id];
        } else {           
            dic.frozenLayer[id] = layer;
        }
    };
    Ogis.prototype.addLayerToControlPanel = function (id,name ,isVisible, isFrozen) {
        var layer = this.buildLayerControllerPanelItemHtml(id,name, isVisible, isFrozen),
            panelId = this.layerModel.controlPanelId,
            panel$ = this.getDom$(panelId);
        panel$.append(layer);
    };
    Ogis.prototype.buildLayerControllerPanelItemHtml = function (id,name, isVisible, isFrozen) {
        var visible = isVisible ? 'fa-eye' : 'fa-eye-slash',
            frozen = isFrozen ? 'fa-lock' : 'fa-unlock';
        var html = '<tr class="ogis-map-layer-list-item" id="' + id + '">';
        html += '<td><span>' + name + '</span></td>';
        html += '<td><i class="ogis-map-layer-list-item-control ogis-map-layer-visual fa ' + visible + '"></i></td>';
        html += '<td><i class="ogis-map-layer-list-item-control ogis-map-layer-frozen fa ' + frozen + '"></i></td>';
        //html += '<td><i class="ogis-map-layer-list-item-control glyphicon glyphicon-filter"></i></td>';
        html += '</tr>';
        return html;
    };
    Ogis.prototype.buildVecLayer = function (id,name, isVisible, isFrozen) {
        var layer = new ol.layer.Vector(),
            styleFunc = this.getStyleFunction(id);
        styleFunc && layer.setStyle(styleFunc);
        layer.set('id', id);
        layer.set('name',name);
        layer.setVisible(isVisible);
        layer.set('isFrozen', isFrozen);
        return layer;
    };
    Ogis.prototype.changeLayerVisibleOnClick = function (ev) {
        var target$ = this.getEventTarget(ev);
        this.changeLayerVisibleByTarget(target$);
    };
    Ogis.prototype.changeLayerVisibleByTarget = function (target$) {
        var layerId = target$.closest('.ogis-map-layer-list-item').attr('id');
        var isVisible = this.changeLayerControlPanelVisibleState(target$);
        this.changeMapLayerVisibleById(layerId, isVisible);
    };
    Ogis.prototype.changeMapLayerVisibleById = function (layerId, isVisible) {
        var model = this.layerModel.dic.layer,
            //layerId = this.toRawId(layerId),
            layer = model[layerId];
        if (layer) {
            layer.setVisible(isVisible);
        }
    };
    Ogis.prototype.changeLayerControlPanelVisibleState = function (target$) {
        var yes = 'fa-eye',
            no = 'fa-eye-slash';
        return this.changeStateByClass(target$, yes, no);
    };
    Ogis.prototype.changeStateByClass = function (target$, yesClass, noClass) {
        var is = false;
        if (target$.hasClass(yesClass)) {
            target$.removeClass(yesClass);
            target$.addClass(noClass);
        } else {
            target$.removeClass(noClass);
            target$.addClass(yesClass);
            is = true;
        }
        return is;
    };
    Ogis.prototype.changeLayerFrozenOnClick = function (ev) {
        var target$ = this.getEventTarget(ev);
        this.changeLayerFrozenByTarget(target$);
    };
    Ogis.prototype.changeLayerFrozenByTarget = function (target$) {
        var layerId = target$.closest('.ogis-map-layer-list-item').attr('id');
        var isFrozen = this.changeLayerControlPanelFrozenState(target$);
        this.changeMapLayerFrozenById(layerId, isFrozen);
    };
    Ogis.prototype.changeLayerControlPanelFrozenState = function (target$) {
        var yes = 'fa-lock',
            no = 'fa-unlock';
        return this.changeStateByClass(target$, yes, no);
    };
    Ogis.prototype.changeMapLayerFrozenById = function (layerId, isFrozen) {
        var model = this.layerModel.dic;
        //layerId = this.toRawId(layerId);
        var layer = model.layer[layerId];
        if (layer) {
            layer.set('isFrozen', isFrozen);
            if (isFrozen) {
                model.frozenLayer[layerId] = layer;
            } else {
                delete model.frozenLayer[layerId];
            }
        }
    };
    Ogis.prototype.triggerFilterClickOnClick = function (ev) {
    //TODO 搜索
    };
    Ogis.prototype.getUnFilterLayers = function () {
        var layerArray = this.layerModel.data.layer,
            unFilterLayers = [],
            layer;
        for (var i = 0, ii = layerArray.length; i < ii; i++) {
            layer = layerArray[i];
            if (!this.isFilterLayer(layer))
                unFilterLayers.push(layer);
        }
        return unFilterLayers;
    };
    //features
    Ogis.prototype.buildFeaturesFromGeoJSON = function(featureGeoJSON){
        var olFeatures = [],
            olFeature,
            type = featureGeoJSON.type,
            features = featureGeoJSON.features;
        if (type) {
            if (type == 'FeatureCollection' && features && Array.isArray(features)) {
                for (var i = 0, ii = features.length; i < ii; i++) {
                    olFeature = features[i];
                    olFeature = this.buildFeatureFromGeoJSON(olFeature);
                    olFeature && olFeatures.push(olFeature);
                }
            } else {
                olFeature = this.buildFeatureFromGeoJSON(featureGeoJSON);
                olFeature && olFeatures.push(olFeature);
            }
            
        } 
        return olFeatures;
    };
    Ogis.prototype.buildFeatureFromGeoJSON = function(feature){
        var olFeature,
            labelPoint,
            geometry = feature.geometry;
        geometry = this.buildGeometryFromGeoJSON(geometry);
        if(geometry){
            labelPoint = geometry.getExtent();
            labelPoint = ol.extent.getCenter(labelPoint);
            olFeature = new ol.Feature({
                geometry:geometry,
                labelPoint:new ol.geom.Point(labelPoint),
                name:feature.properties.title
            });
            olFeature.setProperties(feature.properties);
        };
        return  olFeature;
    };
    Ogis.prototype.buildGeometryFromGeoJSON = function (geometryJson) {
        var type = geometryJson.type,
            olGeometryBuilder,
            arg,
            olGeometry;
        if (type) {
            olGeometryBuilder = this.getGeometryBuilder(type);
            if (type == 'GeometryCollection') {
                arg = geometryJson.geometries;
                arg = this.buildGeometryArrayFromGeoJSON(arg);
            } else {
                arg = geometryJson.coordinates;
            }
            if(arg)
                olGeometry = new olGeometryBuilder(arg);
        }
        return olGeometry;
    };
    Ogis.prototype.buildGeometryArrayFromGeoJSON = function (geometryJsonArray) {
        var olGeometryArray = [],
            olGeometryBuilder,
            olGeometry;
        for (var i = 0, ii = geometryJsonArray.length; i < ii; i++) {
            olGeometry = geometryJsonArray[i];
            olGeometryBuilder = this.getGeometryBuilder(olGeometry.type);
            if (olGeometryBuilder && olGeometry.coordinates) {
                olGeometry = new olGeometryBuilder(olGeometry.coordinates);
                olGeometryArray.push(olGeometry);
            }
        }
        return olGeometryArray.length>0?olGeometryArray:null;
    };
    Ogis.prototype.getGeometryBuilder = function (type) {
        var builder;
        type = type.trim();
        switch (type) {
            case 'Point':
                builder = ol.geom.Point;
                break;
            case 'MultiPoint':
                builder = ol.geom.MultiPoint;
                break;
            case 'LineString':
                builder = ol.geom.LineString;
                break;
            case 'LinearRing':
                builder = ol.geom.LineRing;
                break;
            case 'MultiLinearString':
                builder = ol.geom.MultiLineString;
                break;
            case 'Polygon':
                builder = ol.geom.Polygon;
                break;
            case 'MultiPolygon':
                builder = ol.geom.Polygon;
                break;
            case 'GeometryCollection':
                builder = ol.geom.GeometryCollection;
                break;
        }
        return builder;
    };
    Ogis.prototype.addFeaturesToLayer = function (layerId, features) {
        var layer = this.layerModel.dic.layer[layerId];
        var source = layer.getSource();
        if (!source) {
            source = new ol.source.Vector({ crossOrigin: 'anonymous' });
            layer.setSource(source);
        }
        features = this.buildFeaturesFromGeoJSON(features);
        source.addFeatures(features);
    };
    Ogis.prototype.addFeaturesToLayerByRemote = function(layerId,url,sendData){
        var self = this;
        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(sendData),
            contentType: 'application/json',
            success: function(res) {
                var doc = jrsc.xml.parseFromString(res);
                var features = jrsc.gml.parseDocToGeoJSON(doc);
                self.addFeaturesToLayer(layerId, features);
            },
            error: self.log
        });
    };
    Ogis.prototype.addVecLayerByRemote = function (id, name, isVisible, isFrozen, isControl, url, arg) {
        if (!(id && name && url))
            return;
        isVisible = (isVisible || false) && true;
        isFrozen = (isFrozen || false) && true;
        isControl = (isControl || false) && true;
        arg = arg || {};
        this.addVecLayer(id,name,isVisible,isFrozen,isControl);
        this.addFeaturesToLayerByRemote(id,url,arg);
    };
    Ogis.prototype.addVecLayerByGml = function(id,name,isVisible,isFrozen,isControl,gmlDoc){
        if (!(id && name && gmlDoc))
            return;
        isVisible = (isVisible||false)&&true;
        isFrozen = (isFrozen||false) && true;
        isControl = (isControl || false) && true;

        var layerId = this.addSuffix(id);
        this.addVecLayer(layerId, name, isVisible, isFrozen, isControl);
        var doc = jrsc.xml.parseFromString(gmlDoc);
        var features = jrsc.gml.parseDocToGeoJSON(doc);
        this.addFeaturesToLayer(layerId, features);
    };
    Ogis.prototype.addVecLayerByGeoJSON = function (id, name, isVisible, isFrozen, isControl, geoJsonFeatures) {
        if (!(id && name && geoJsonFeatures))
            return;
        isVisible = (isVisible || false) && true;
        isFrozen = (isFrozen || false) && true;
        isControl = (isControl || false) && true;
        this.addVecLayer(id, name, isVisible, isFrozen, isControl);
        this.addFeaturesToLayer(id, geoJsonFeatures);
    };
    //coordinates:[[p1,p2],[p1,p2]...]
    Ogis.prototype.addVecLayerByCoordinates = function (id,eleId, name, isVisible, isFrozen, isControl, type,coordinates) {
        if (!(id && name && coordinates))
            return;
        isVisible = (isVisible || false) && true;
        isFrozen = (isFrozen || false) && true;
        isControl = (isControl || false) && true;
        var layerId = this.addSuffix(id);
        this.addVecLayer(layerId, name, isVisible, isFrozen, isControl);
        var coords = jrsc.coordinate.parseFromPointArray(type,coordinates, jrsc.coordinate.toEPSG3857);
        var properties = { "id": eleId, "title": name };//title必须buildFeatureFromGeoJSON要用到
        var geoJsonFeature = jrsc.gml.parseCoordinatesToGeoJSON(type, coords, properties);
        this.addFeaturesToLayer(layerId, geoJsonFeature);
    };

    Ogis.prototype.selectFeatureInBox = function (layer, extent) {
        var self = this,
            source = layer.getSource();
        source.forEachFeatureIntersectingExtent(extent,
            function(feature) {
                self.selectFeature(feature);
            });
    };
    //interactions
    Ogis.prototype.initInteractions = function () {
        this.initDragBoxSelectInteraction();
    };
    Ogis.prototype.initDragBoxSelectInteraction = function () {
        var interaction = this.addDragBoxInteractionToMap();
        this.onDragBoxInteractionStart(interaction);
        this.onDragBoxInteractionEnd(interaction);
    };
    Ogis.prototype.addDragBoxInteractionToMap = function () {
        var map = this.mapModel.map;
        var interaction = new ol.interaction.DragBox({
            condition: ol.events.condition.platformModifierKeyOnly
        });
        map.addInteraction(interaction);
        return interaction;
    };
    Ogis.prototype.onDragBoxInteractionStart = function (interaction) {
        var self = this;
        interaction.on('boxstart',
            function() {
                self.unSelectedFeatures();
            });
    };
    Ogis.prototype.onDragBoxInteractionEnd = function (interaction) {
        var self = this;
        interaction.on('boxend', function () {
            var extent = interaction.getGeometry().getExtent();
            var layers = self.getUnFilterLayers();
            var layer;
            for (var i = 0, ii = layers.length; i < ii; i++) {
                layer = layers[i];
                self.selectFeatureInBox(layer, extent);
            }
        });
    };
    Ogis.prototype.viewExtent = function (coordinates) {
        var extent = new ol.extent.boundingExtent(coordinates);
        var map = this.mapModel.map;
        map.getView().fit(extent, map.getSize());
        //var t = map.getView().getProjection();
        //console.log(extent);
    };
    /*
*视图适应范围(遵循分辨率)
*/
    Ogis.prototype.fitView = function (coordinates, type) {
        var coords = jrsc.coordinate.parseFromPointArray(type, coordinates, jrsc.coordinate.toEPSG3857);
        var polygon = new ol.geom.SimpleGeometry(coordinates);
        //var point = new ol.geom.Point();

        map.getView().fit(polygon, { padding: [170, 50, 30, 150] });

    };

    //map
    Ogis.prototype.initMap = function () {
        var model = this.mapModel;
        var baseLayer = this.initMapBaseLayer();
        var baseControl = this.initMapBaseControl();
        var view = new ol.View({
            zoom: model.zoom,
            minZoom: model.minZoom,
            maxZoom: model.maxZoom,
            projection: model.projection,
            center: ol.extent.getCenter(model.extent)
        });
        var target = this.addSuffix('ogis_map');

        var source = new ol.source.Vector();
        var vector = new ol.layer.Vector({
            source: source,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });

        var map = new ol.Map({
            target: target,
            controls: baseControl,
            layers: [baseLayer, vector],
            view: view
        });
        //view.fit(model.extent, map.getSize());
        var interaction = map.getInteractions().item(1);
        interaction.set('active', false);
        model.map = map;
        map["vectorSource"] = source;


        
    };
    Ogis.prototype.initMapBaseLayer = function () {
        var model = this.mapModel;

        var layer = new ol.layer.Tile();
        var source = new ol.source.XYZ({
            url: model.baseLayerUrl,
            crossOrigin: 'anonymous',
            /*
            * 2017-10-31 加入代理程序处理 跨域请求瓦片资源导致地图导出问题 panxiang
            */
            tileUrlFunction: function (tileCoord, pixelRatio, proj) {  // 参数tileCoord为瓦片坐标
                //console.log(tileCoord);
                var z = tileCoord[0];
                var x = tileCoord[1];
                var y = tileCoord[2];

                // 返回经过转换后，调用代理获取在线瓦片
                var url = model.baseLayerUrl;
                url = url.replace("{z}", Math.abs(z));
                url = url.replace("{x}", Math.abs(x));
                url = url.replace("{y}", Math.abs(y)-1);
                url = '/OpenlayerProxy.ashx?url=' + encodeURIComponent(url);
                //console.log(url);
                return url;
            }
        });
        layer.setSource(source);
        return layer;
    };
    Ogis.prototype.initMapBaseControl=function() {
        var model = this.controlModel;
        var customs = model.customs;
        var extend = model.extend;
        var defaults = model.defaults;
        var controls = [];
        var options = {};
        if (customs && customs.length>0) {
            var length = customs.length;
            for (var i = 0; i < length; i++) {
                var item = customs[i];
                if (item === "ResetZoom") {
                    controls.push(new Ogis.ResetZoomControl({ zoom: this.mapModel.zoom, extent: this.mapModel.extent }));
                }
            }
        }
        if (extend && extend.length>0) {
            var elength = extend.length;
            for (var j = 0; j < elength; j++) {
                var eitem = extend[j];
                if (eitem === "ScaleLine") {
                    controls.push(new ol.control.ScaleLine());
                }
                if (eitem == "MousePosition") {
                    controls.push(new ol.control.MousePosition({
                        coordinateFormat: ol.coordinate.createStringXY(6),
                        projection: ol.proj.get("EPSG:3857"),
                        className: "custom-mouse-position",
                        target: document.getElementById("mouse-position")
                    }));
                }
            }
        }
        if (defaults && defaults.length>0) {
            var dlength = defaults.length;
            for (var q = 0; q < dlength; q++) {
                var ditem = defaults[q];
                if (ditem === "Zoom") {
                    options.attribution = false;
                    options.attributionOptions = /** @type {olx.control.AttributionOptions} */ ({
                        collapsible: false
                    });
                }
            }
            return ol.control.defaults(options).extend(controls);
        } else {
            return controls;
        }
        
    }
    Ogis.prototype.initFeatureOverlay = function(map){

    };
    // property window
    Ogis.prototype.buildPropertyWindowHtml = function (contentHtml) {
        var html = '<div class="ogis-property-window">';
        //html += '<div class="ogis-property-window-header">';
        //html += this.BuildPropertyWindowHeader();
        //html += '</div>';
        html += '<div class="ogis-property-window-content">';
        html += contentHtml;
        html += '</div>';
        html += '</div>';
        return html;
    };
    Ogis.prototype.BuildPropertyWindowHeader = function () {
        var html = '<table>';
        html += '<tr>';
        html += '<td>';
        html += '<img src="" />';
        html += '<span>' + '</span>';
        html += '</td>';
        html += '<td>';
        html += '<button class="ogis-property-closer">X<button>';
        html += '</td>';
        html += '</tr>';
        html += '</table>';
        return html;
    };
    //registerEvent
    Ogis.prototype.registerEvent = function () {
        this.registerGroupEvent();
        this.registerContextMenuEvent();
        this.registerLayerControlPanelEvent();
        this.registerPropertyWindowEvent();
        this.registerMouseMoveEvent();
        this.registerSearchEvent();
        this.registerSearchResultClickEvent();
    };
    Ogis.prototype.registerSearchResultClickEvent = function(){
        var self = this;
        var ogis$id = self.toJQueryId(self.addSuffix('ogis'));
        $(ogis$id).on('click', '.ogis-search-drop-item', function (ev) {
            var target = $(ev.currentTarget);
            var id = target.attr('id');
            var searchResult = self.featureModel.search;
            var feature,properties;
            for(var i= 0,ii=searchResult.length;i<ii;i++){
                feature = searchResult[i];
                properties=feature.getProperties();
                if (id == properties.id)
                    break;
            }
            var center = feature.getGeometry().getExtent();
            center = ol.extent.getCenter(center);
            self.setCenter(center);
            //var style = self.getSelectedStyle(feature);
            //feature.setStyle(style);
            self.unSelectedFeatures();
            self.selectFeature(feature);
            var res = self.calculateResolution();
            var type = properties.type;
            if ("盆地,区带".indexOf(type) > -1) {
                res = res + 300;
            } else {
                res = res - 500;
            }
            
            self.mapModel.map.getView().setResolution(res);
        });
    };
    Ogis.prototype.locateFeatureByName = function(name,type){
		var self = this;
        var features = self.searchFeatureByName(name);
        var feature = features[0];
        if (!feature) return;
        var center = feature.getGeometry().getExtent();
        center = ol.extent.getCenter(center);
        self.setCenter(center);
        //var style = self.getSelectedStyle(feature);
        //feature.setStyle(style);
        self.unSelectedFeatures();
        self.selectFeature(feature);
        var res = self.calculateResolution();
        if (type < 3) {
            res = res + 300;
        } else {
            res = res - 500;
        }
        
        self.mapModel.map.getView().setResolution(res);
    };
    Ogis.prototype.calculateResolution = function(){
        var extent = this.mapModel.extent;
        var long = extent[2]-extent[0];
        var viewport = this.mapModel.map.getViewport();
        var long1 = viewport.clientWidth;
        var resolution  = long/long1;
        return resolution;
    };
    Ogis.prototype.registerSearchEvent = function(){
        var self = this;
        var ogis$id = self.toJQueryId(self.addSuffix('ogis'));
        $(ogis$id).on('click', '.ogis-search-button', function (ev) {
            var id = self.toJQueryId('ogis_search_display_interact_input');
            id = self.addSuffix(id);
            var searchName = $(id).val();
            if (!searchName||searchName == '') return;
            var typeId = self.toJQueryId('ogis-search_choice');
            typeId = self.addSuffix(typeId);
            var searchType = $(typeId).val();
            if (searchType == 0) {
                self.searchByName(searchName);
            } else {
                //搜图件
                window.open("/Search/Index?keyword=" + searchName);
            }
            
        });
    };
    Ogis.prototype.registerMouseMoveEvent = function(){
        var map = this.mapModel.map;
        var self = this;
        map.on('pointermove',
            function(ev) {
                //self.onMouseMoveEvent(ev);
            });
    };
    Ogis.prototype.onMouseMoveEvent = function(ev){
        if (ev.dragging) {
            return;
        }
        var self = this;
        var map = this.mapModel.map;
        var pixel = map.getEventPixel(ev.originalEvent);
        var highLight =this.featureModel.highLight;
        var features = [];
        map.forEachFeatureAtPixel(pixel, function(feature,layer) {
            if(layer && !self.isFilterLayer(layer))
                features.push(feature);
        });
        var feature = features[0];
        if(highLight != feature){
            if(highLight&&!this.isSelectedFeature(highLight))
                highLight.setStyle();
            if(feature){
                feature.setStyle(this.getSelectedStyle(feature));
            }
            this.featureModel.highLight = feature;
        }
    };
    Ogis.prototype.isSelectedFeature = function(feature){
        var features = this.featureModel.data.selected;
        var is = false;
        for(var i= 0,ii=features.length;i<ii;i++){
            if(features[i] == feature){
                is = true;
                break;
            }
        }
        return is;
    };
    Ogis.prototype.registerGroupEvent = function () {
        var self = this;
        var ogis$id = self.toJQueryId(self.addSuffix('ogis'));
        $(ogis$id).on('click', '.ogis-group-button', function (ev) {
            self.showGroupDropOnClick(ev);
        }).on('click', '.ogis-group-drop-closer', function (ev) {
            self.shutGroupDropOnClick(ev);
        });
    };
    Ogis.prototype.registerContextMenuEvent = function () {
        var self = this;
        var viewport = self.mapModel.map.getViewport();
        $(viewport).on('contextmenu', function (ev) {
            self.onMapRightClick(ev);
        }).on('click', function (ev) {
            self.hideContextMenu();
        });
        var ogis$id = self.toJQueryId(self.addSuffix('ogis'));
        $(ogis$id).on('click', '.ogis-context-menu-item', function (ev) {
            self.invokeContextMenuItemOnClick(ev);
            self.hideContextMenu();
        });
    };
    Ogis.prototype.registerLayerControlPanelEvent = function () {
        var self = this;
        var ogis$id = self.toJQueryId(self.addSuffix('ogis'));
        $(ogis$id).on('click', '.ogis-map-layer-visual', function (ev) {
            self.changeLayerVisibleOnClick(ev);
        }).on('click', '.ogis-map-layer-frozen', function (ev) {
            self.changeLayerFrozenOnClick(ev);
        }).on('click', '.ogis-map-layer-filter', function (ev) {
            self.triggerFilterClickOnClick(ev);
        })
    };
    Ogis.prototype.registerPropertyWindowEvent = function () {
        var self = this;
        var map = self.mapModel.map;
        map.on('click', function (ev) {
            self.onMapClick(ev);
        });
        map.on('dblclick',function(ev){
            self.onMapDblClick(ev);
        });
        var ogis$id = self.toJQueryId(self.addSuffix('ogis'));
        $(ogis$id).on('click', '.ogis-property-closer', function (ev) {
            var target = $(ev.currentTarget).closest('.ogis-property-window');
            target.fadeOut();
        });
    };

    Ogis.prototype.searchByName =function(name){
        var features = [];
        var layers = this.layerModel.data.layer;
        var layer;
        for(var i= 0,ii=layers.length;i<ii;i++){
            layer = layers[i];
            if(this.isLayerCanSearch(layer)){
                var se = this.searchByNameInLayer(name,layer,true);
                features = features.concat(se);
            }
        }
        this.featureModel.search = features;
        var drop = this.buildSearchResultHtml(features);
        $('.ogis-search-drops').show();
        $('.ogis-search-drops').html(drop);
    };
    Ogis.prototype.searchFeatureByName = function(name){
        var features = [];
        var layers = this.layerModel.data.layer;
        var layer;
        for(var i= 0,ii=layers.length;i<ii;i++){
            layer = layers[i];
            var se = this.searchByNameInLayer(name,layer);
            features = features.concat(se);
        }
        this.featureModel.search = features;
        return features;
    };

    Ogis.prototype.buildSearchResultHtml = function(features){
        var html = '<div class="ogis-search-drop"><table>';
        var feature;
        for(var i= 0,ii=features.length;i<ii;i++){
            feature = features[i];
            html += this.buildSearchResultItemHtml(feature);
        }
        html += '</table></div>';
        return html;
    };
    Ogis.prototype.buildSearchResultItemHtml = function(feature){
        var properties = feature.getProperties();
        var html = '<tr class="ogis-search-drop-item" id ="'+ (properties.id || '') + '">';
        html += '<td>' + properties.title + '</td>';
        html += '</tr>';
        return html;
    };
    Ogis.prototype.isLayerCanSearch = function(layer){
        var frozenLayerDic = this.layerModel.dic.frozenLayer;
        var is = false;
        if(!layer.getVisible())
            return is;
        var id = layer.get('id');
        if(frozenLayerDic[id])
            return is;
        return true;
    };
    Ogis.prototype.setCenter = function(coordinate){
        var view = this.mapModel.map.getView();
        view.setCenter(coordinate);
    };

    Ogis.prototype.searchByNameInLayer = function(name,layer,isSearch){
        var features = layer.getSource().getFeatures();
        var targetFeatures = [];
        var feature;
        var properties;
        for(var i= 0,ii=features.length;i<ii;i++){
            feature = features[i];
            properties = feature.getProperties();
			if(isSearch){
				if(properties.title.indexOf(name)>-1) {
					console.log(properties.title);
					targetFeatures.push(feature);
				}
			}else{
				if(properties.title==name) {
					console.log(properties.title);
					targetFeatures.push(feature);
				}
			}
            
        }
        return targetFeatures;
    };

    Ogis.prototype.onMapClick = function (ev) {
        this.unSelectedFeatures();
        this.selectFeatureOnMapClick(ev);
        this.hidePropertyWindow();
    };
    Ogis.prototype.onMapDblClick = function(ev){
        this.unSelectedFeatures();
        this.selectFeatureOnMapClick(ev);
        this.showPropertyWindow(ev);
    };
    Ogis.prototype.showPropertyWindow = function (ev) {
        var selectedFeature = this.featureModel.data.selected;
        selectedFeature = selectedFeature[0];
        if(!selectedFeature) return;
        var properties = selectedFeature.getProperties();

        var showProperties = selectedFeature.showProperties;
        showProperties = showProperties ? showProperties : "";
        var propertyHtml = Ogis.buildPropertyHtml(properties,showProperties);
        var window = this.buildPropertyWindowHtml(propertyHtml);
        var window$ = $(window);
        var container$ = this.getDom$('ogis_overlay_property');
        var pos = ev.pixel;
        container$.html(window$);
        this.showDom$(window$,pos[0],pos[1]);
    };
    Ogis.prototype.hidePropertyWindow = function (ev) {
        $('.ogis-property-window').fadeOut();
    };
    Ogis.prototype.onMapRightClick = function (ev) {
        ev.preventDefault();
        this.hideContextMenu();
        this.unSelectedFeatures();
        //this.selectFeatureOnMapClick(ev);
        this.showContextMenuOnMapClick(ev);
    };
    Ogis.prototype.showContextMenuOnMapClick = function (ev) {
        var map = this.mapModel.map,
            pos = map.getEventPixel(ev);
        var selectedFeature = this.featureModel.data.selected;
        selectedFeature = selectedFeature[0];
        if (selectedFeature)
            this.showContextMenuByFeature(selectedFeature, pos);
    };
    Ogis.prototype.getFeatureOnMapClick = function (ev) {
        var map = this.mapModel.map;
        var pos = ev.pixel || map.getEventPixel(ev);
        var feature = this.findFeaturesAtPixel(pos, this.isFilterLayer);
        feature = feature.length > 0 ? feature[0] : null;
        return feature;
    };
    Ogis.prototype.selectFeatureOnMapClick = function (ev) {
        var feature = this.getFeatureOnMapClick(ev);
        feature && this.selectFeature(feature);
    };
    Ogis.prototype.findFeaturesAtPixel = function (coor,filterFunc){
        var model = this.layerModel.dic,
            map = this.mapModel.map,
            self = this,
            shouldFilter,
            hitFeautes = [];
        map.forEachFeatureAtPixel(coor, function (feature, layer) {
            shouldFilter = filterFunc.call(self,layer);
            if (!shouldFilter) {
                hitFeautes.push(feature);
            }
        });
        return hitFeautes;
    };
    Ogis.prototype.isFilterLayer = function (layer) {
        if (layer) {
            var model = this.layerModel.dic.frozenLayer,
            id = layer.get('id'),
            is = false;
            if (!layer.getVisible() || model[id])
                is = true;
            return is;
        } else {
            return null;
    }
        
    };
    Ogis.prototype.showContextMenuByFeature = function (feature, pos) {
        var type = feature.getProperties();
        type = type.type;
        var menuId = this.menuModel.dic.binding[type];
        if (menuId) {
            this.showContextMenuById(menuId, pos);
        }
    };
    Ogis.prototype.showContextMenuById = function (menuId, pos) {
        var menu$ = this.getDom$(menuId);
        var startX = pos[0];
        var startY = pos[1];
        if (startX && startY) {
            this.showDom$(menu$, startX, startY);
        }
    };
    Ogis.prototype.selectFeature = function (feature) {
        var style = this.getSelectedStyle(feature);
        feature.setStyle(style);
        this.featureModel.data.selected.push(feature);
    };
    Ogis.prototype.unSelectedFeatures = function () {
        var selectedFeatures = this.featureModel.data.selected;
        for (var n = selectedFeatures.shift() ; n; n = selectedFeatures.shift()) {
            n.setStyle();
        }
    };
    Ogis.prototype.invokeContextMenuItemOnClick = function (ev) {
        var id = this.getEventTarget(ev).attr('id');
        this.invokeContextMenuItemById(id);
    };
    Ogis.prototype.invokeContextMenuItemById = function (id) {
        var menuModel = this.menuModel,
            olFeature = this.featureModel.data.selected;
        id = this.toRawId(id);
        var menuItem = menuModel.dic.menuItem[id];
        menuItem && menuItem.click && typeof menuItem.click == 'function' && menuItem.click({data:olFeature});
    };
    Ogis.prototype.hideContextMenu = function () {
        $('.ogis-context-menu').fadeOut();
    };
    // utilities
    Ogis.prototype.createIndexer = function (dic, array, prefix, indexName) {
        var item,
            key;
        indexName = indexName || 'id';
        // maybe  we should check array is an instance of Array
        for (var i = 0, ii = array.length; i < ii; i++) {
            item = array[i];
            if (item[indexName]) {
                key = prefix ? prefix + '_' + item[indexName] : item[indexName];
                dic[key] = item;
            }
        }
        return dic;
    };
    Ogis.prototype.clone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };
    Ogis.prototype.getSuffix = function () {
        return new Date().getTime();
    };
    Ogis.prototype.addSuffix = function (base) {
        var suffix = this.suffix,
            reg = /_$/g;
        if (!reg.test(base))
            base += '_';
        return base + suffix;
    };
    Ogis.prototype.removeSuffix = function (base) {
        var length = this.suffix.toString().length;
        var reg = new RegExp('_\\d{' + length + '}', 'g');
        base = base.replace(reg, '');
        return base;
    };
    Ogis.prototype.toJQueryId = function (id) {
        var reg = /^#/g;
        if (!reg.test(id))
            id = '#' + id;
        return id;
    };
    Ogis.prototype.toRawId = function (id) {
        var reg = /^#/g;
        if (reg.test(id))
            id = id.replace(reg, '');
        id = this.removeSuffix(id);
        return id;
    };
    Ogis.prototype.getEventTarget = function (ev) {
        return $(ev.currentTarget);
    };
    Ogis.prototype.log = function (msg) {
        console && console.log(msg);
    };
    Ogis.prototype.clampNum = function (start, end, offset, margin) {
        var num,
            margin = margin || 5,
            distance = start + offset - end;
        if (distance > 0) {
            num = start - distance - margin;
        } else if (distance == 0) {
            num = start - margin;
        } else {
            num = start;
        }
        return num;
    };
    Ogis.prototype.getDom$ = function (id) {
        var dic = this.domDic,
            dom;
        dom = dic[id];
        if (!dom) {
            var jId = this.toJQueryId(id);
            jId = this.addSuffix(jId);
            dom = dic[id] = $(jId);
        }
        return dom;
    };
    Ogis.prototype.showDom$ = function (dom$, startX, startY) {
        var thisDom$ = this.getDom$('ogis');
        var thisWidth = thisDom$.prop('clientWidth');
        var thisHeight = thisDom$.prop('clientHeight');
        var domWidth = dom$.prop('clientWidth');
        var domHeight = dom$.prop('clientHeight');
        var left = this.clampNum(startX, thisWidth, domWidth);
        var top = this.clampNum(startY, thisHeight, domHeight);
        dom$.css({left: left, top: top});
        dom$.fadeIn();
    };
    Ogis.prototype.getStyleFunction = function (layerId) {
        layerId = this.toRawId(layerId);
        var layerStyle = this.options.style,
            styleDesc = layerStyle && layerStyle.layer && layerStyle.layer[layerId],
            style,
            styleFunction;
        if (styleDesc){
            styleFunction = Ogis.getStyleFunction(styleDesc);
        }
        return styleFunction;
    };

    Ogis.prototype.getSelectedStyle = function (feature) {
        var styleDesc = this.options.style && this.options.style.selected,
            styleOpt = {},
            style;
        if (styleDesc.fillColor) {
            style = Ogis.getFillStyle(styleDesc.fillColor);
            Ogis.constructObj(styleOpt, 'fill', style);
        }
        if (styleDesc.stroke) {
            style = Ogis.getStrokeStyle(styleDesc.stroke);
            Ogis.constructObj(styleOpt, 'stroke', style);
        }
        if (styleDesc.point) {
            style = Ogis.getPointStyle(styleDesc.point);
            Ogis.constructObj(styleOpt, 'image', style);
        }
        if (styleDesc.text) {
            style = Ogis.getTextStyle(styleDesc.text);
            style.setText(feature.get('title'));
            Ogis.constructObj(styleOpt, 'text', style);
        }
        
        style = new ol.style.Style(styleOpt);
        return style;
    };

    Ogis.prototype.toolZoomIn = function() {
        var view = this.mapModel.map.getView();
        var currentZoom = view.getZoom();
        //var maxZoom = view.getMaxZoom();
        var maxZoom = this.mapModel.maxZoom;
         
        currentZoom ++;

        if (currentZoom > maxZoom) {
            currentZoom = maxZoom;
        }
        view.setZoom(currentZoom);
    };

    Ogis.prototype.toolZoomOut = function () {
        var view = this.mapModel.map.getView();
        var currentZoom = view.getZoom();
        //var minZoom = view.getMinZoom();
        var minZoom = this.mapModel.minZoom;
        currentZoom--;

        if (currentZoom < minZoom) {
            currentZoom = minZoom;
        }
        view.setZoom(currentZoom);


        
         
    };
    Ogis.prototype.toolReset = function () {
        var model = this.mapModel;
        var view = model.map.getView();
        view.setZoom(model.zoom);
    };
    Ogis.prototype.toolMeasure = function (type) {
       // this.mapModel.map.getOverlays().clear();
        // this.mapModel.map.vectorSource.clear();
       
        
        var wgs84Sphere = new ol.Sphere(6378137);
        /**
      * Currently drawn feature.
      * @type {ol.Feature}
      */
        var sketch;


        /**
         * The help tooltip element.
         * @type {Element}
         */
        var helpTooltipElement;


        /**
         * Overlay to show the help messages.
         * @type {ol.Overlay}
         */
        var helpTooltip;


        /**
         * The measure tooltip element.
         * @type {Element}
         */
        var measureTooltipElement;


        /**
         * Overlay to show the measurement.
         * @type {ol.Overlay}
         */
        var measureTooltip;


        /**
         * Message to show when the user is drawing a polygon.
         * @type {string}
         */
        var continuePolygonMsg = '单击以继续绘制多边形。';
        /**
         * Message to show when the user is drawing a line.
         * @type {string}
         */
        var continueLineMsg = '单击以继续绘制线条。';
        /**
         * Handle pointer move.
         * @param {ol.MapBrowserEvent} evt The event.
         */
        var pointerMoveHandler = function (evt) {
            if (evt.dragging) {
                return;
            }
            /** @type {string} */
            var helpMsg = '点击开始测量';

            if (sketch) {
                var geom = (sketch.getGeometry());
                if (geom instanceof ol.geom.Polygon) {
                    helpMsg = continuePolygonMsg;
                } else if (geom instanceof ol.geom.LineString) {
                    helpMsg = continueLineMsg;
                }
            }

            helpTooltipElement.innerHTML = helpMsg;
            helpTooltip.setPosition(evt.coordinate);

            $(helpTooltipElement).removeClass('hidden');
        };


        var map = this.mapModel.map;
        console.log(map.vectorSource);
        map.on('pointermove', pointerMoveHandler);

        $(map.getViewport()).on('mouseout', function () {
            $(helpTooltipElement).addClass('hidden');
        });

        var draw; // global so we can remove it later
        //var vector=this.initMap();

        var formatLength = function (line) {
            var length;
            var coordinates = line.getCoordinates();
            length = 0;
            var sourceProj = map.getView().getProjection();
            for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
                var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
                var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
                length += wgs84Sphere.haversineDistance(c1, c2);
            }
            //if (geodesicCheckbox.checked) {

            //} else {
            //    length = Math.round(line.getLength() * 100) / 100;
            //}
            var output;
            if (length > 100) {
                output = (Math.round(length / 1000 * 100) / 100) +
                    ' ' + 'km';
            } else {
                output = (Math.round(length * 100) / 100) +
                    ' ' + 'm';
            }
            return output;
        };


        /**
         * Format length output.
         * @param {ol.geom.Polygon} polygon The polygon.
         * @return {string} Formatted area.
         */
        var formatArea = function (polygon) {
            var area;
            var sourceProj = map.getView().getProjection();
            var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
                sourceProj, 'EPSG:4326'));
            var coordinates = geom.getLinearRing(0).getCoordinates();
            area = Math.abs(wgs84Sphere.geodesicArea(coordinates));

            //if (geodesicCheckbox.checked) {

            //} else {
            //    area = polygon.getArea();
            //}
            var output;
            if (area > 10000) {
                output = (Math.round(area / 1000000 * 100) / 100) +
                    ' ' + 'km<sup>2</sup>';
            } else {
                output = (Math.round(area * 100) / 100) +
                    ' ' + 'm<sup>2</sup>';
            }
            return output;
        };

        function addInteraction(type) {
            //var type = (typeSelect == 'area' ? 'Polygon' : 'LineString');
            map.removeInteraction(draw);
            draw = new ol.interaction.Draw({
                source: map.vectorSource,
                type: /** @type {ol.geom.GeometryType} */ (type),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.5)',
                        lineDash: [10, 10],
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 5,
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0, 0.7)'
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        })
                    })
                })
            });
            map.addInteraction(draw);

            createMeasureTooltip();
            createHelpTooltip();

            var listener;
            draw.on('drawstart',
                function (evt) {                    
                    // set sketch
                    sketch = evt.feature;
                    var featureId = Math.random().toString(36).substr(2);
                    sketch.setId(featureId);

                    /** @type {ol.Coordinate|undefined} */
                    var tooltipCoord = evt.coordinate;

                    listener = sketch.getGeometry().on('change', function (evt) {
                        
                        var geom = evt.target;
                        var output;
                        if (geom instanceof ol.geom.Polygon) {
                            output = formatArea(/** @type {ol.geom.Polygon} */(geom));
                            tooltipCoord = geom.getInteriorPoint().getCoordinates();
                        } else if (geom instanceof ol.geom.LineString) {
                            output = formatLength(/** @type {ol.geom.LineString} */(geom));
                            tooltipCoord = geom.getLastCoordinate();
                        }
                        measureTooltipElement.innerHTML = output + "     <a id='" + featureId + "' style='color: orangered;' data-featureid='" + featureId + "'>X</a>";

                        document.getElementById(featureId).onclick = function (e) {
                            var id = $(e.currentTarget).data("featureid");
                            var feature = map.vectorSource.getFeatureById(id);

                            map.vectorSource.removeFeature(feature);

                            $(e.currentTarget).parent().parent().remove();
                        }
                        measureTooltip.setPosition(tooltipCoord);
                    });
                }, this);

            draw.on('drawend',
                function () {
                    measureTooltipElement.className = 'tooltip tooltip-static';
                    measureTooltip.setOffset([0, -7]);
                    // unset sketch
                    sketch = null;
                    // unset tooltip so that a new one can be created
                    measureTooltipElement = null;
                    createMeasureTooltip();
                    ol.Observable.unByKey(listener);
                    map.removeInteraction(draw);
                }, this);
        }


        /**
         * Creates a new help tooltip
         */
        function createHelpTooltip() {
            if (helpTooltipElement) {
                helpTooltipElement.parentNode.removeChild(helpTooltipElement);
            }
            helpTooltipElement = document.createElement('div');
            helpTooltipElement.className = 'tooltip hidden';
            helpTooltip = new ol.Overlay({
                element: helpTooltipElement,
                offset: [15, 0],
                positioning: 'center-left'
            });
            //map.addOverlay(helpTooltip);
        }


        /**
         * Creates a new measure tooltip
         */
        function createMeasureTooltip() {
            if (measureTooltipElement) {
                measureTooltipElement.parentNode.removeChild(measureTooltipElement);
            }
            measureTooltipElement = document.createElement('div');
            measureTooltipElement.className = 'tooltip tooltip-measure';
            measureTooltip = new ol.Overlay({
                element: measureTooltipElement,
                offset: [0, -15],
                stopEvent: false,
                positioning: 'bottom-center'
            });
            map.addOverlay(measureTooltip);
        }
        
        addInteraction(type);

      
    }
    Ogis.prototype.toolLine = function () {
        this.toolMeasure("LineString");
    };
    Ogis.prototype.toolArea = function () {
        this.toolMeasure("Polygon");
    };
    /*
*导出图片
*/
    Ogis.prototype.toolExport_png = function () {
        var map = this.mapModel.map;
        map.once('postcompose', function (event) {
            var canvas = event.context.canvas;
            //console.log(canvas.msToBlob());
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
            } else {
                canvas.toBlob(function (blob) {
                    saveAs(blob, 'map.png');
                });
            }
        });
        map.renderSync();
    };

    Ogis.getStyleFunction = function (styleDesc){
        return function (feature, resolution) {
            return Ogis.getLayerStyle(styleDesc, feature, resolution);
        }
    };
    Ogis.getLayerStyle = function (styleDesc,feature,resolution) {
        var styleOpt = {},
            style;
        if (styleDesc.fillColor) {
            style = Ogis.getFillStyle(styleDesc.fillColor);
            Ogis.constructObj(styleOpt, 'fill', style);
        }
        if (styleDesc.stroke) {
            style = Ogis.getStrokeStyle(styleDesc.stroke);
            Ogis.constructObj(styleOpt, 'stroke', style);
        }
        if (styleDesc.point) {
            style = Ogis.getPointStyle(styleDesc.point);
            Ogis.constructObj(styleOpt, 'image', style);
        }
        if (styleDesc.text) {
            style = Ogis.resolveTextStyle(styleDesc.text,feature,resolution);
            Ogis.constructObj(styleOpt, 'text', style);
        }
        if (styleDesc.showProperties && feature) {
            Ogis.constructObj(feature, 'showProperties', styleDesc.showProperties);
        }
        style = new ol.style.Style(styleOpt);
        return style;
    };
    Ogis.constructObj = function (obj, key, value) {
        if (value)
            obj[key] = value;
    };
    Ogis.getFillStyle = function (fillDesc) {
        var style;
        if (Array.isArray(fillDesc))
            style = new ol.style.Fill({
                color: fillDesc
            });
        return style;
    };
    Ogis.getStrokeStyle = function (strokeDesc) {
        var style;
        if (strokeDesc.color && Array.isArray(strokeDesc.color)) {
            style = new ol.style.Stroke({
                color: strokeDesc.color,
                width:strokeDesc.width || 1
            });
        }
        return style;
    };
    Ogis.getPointStyle = function (pointDesc) {
        var style;
        if (pointDesc.strokeColor && Array.isArray(pointDesc.strokeColor)) {
            style = new ol.style.Circle({
                stroke: new ol.style.Stroke({
                    color: pointDesc.strokeColor,
                    width: 1
                }),
                radius: pointDesc.radius || 3
            });
        }
        return style;
    };
    Ogis.getTextStyle = function (textDesc) {
        var style;
        if (textDesc.color&&Array.isArray(textDesc.color)) {
            style = new ol.style.Text({
                text: textDesc.text || '',
                textAlign: textDesc.align || 'center',
                offsetY:textDesc.offsetY || -15,
                fill: new ol.style.Fill({
                    color: textDesc.color
                }),
                stroke: new ol.style.Stroke({
                    color:textDesc.color
                })
            });
        }
        return style;
    };
    Ogis.resolveTextStyle = function (textDesc, feature, resolution) {
        var style,
            isShow,
            showOnCondition;
        showOnCondition = textDesc.showOnResolution && resolution <= textDesc.showOnResolution;
        isShow = textDesc.show || showOnCondition;
        if (isShow) {
            style = Ogis.getTextStyle(textDesc);
        }
        if (style) {
            style.setText(feature.get('title'));
        }
        return style;
    };
    Ogis.buildPropertyHtml = function(obj,showProperties){
        var html = '<table class="ogis-property-content">';

        for (var key in obj) {
            if (showProperties.indexOf(key) > -1) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] == 'object' || obj[key] == '') continue;
                    html += '<tr><td>' + key + '</td><td>' + obj[key] + '</td></tr>';
                }
            }            
        }
        html += '</table>';
        return html;
    }

        /**
         * @constructor
         * @extends {ol.control.Control}
         * @param {Object=} opt_options Control options.
         */
    Ogis.ResetZoomControl = function(opt_options) {

        var options = opt_options || {};

        var button = document.createElement('button');
        button.className = 'btn btn-default btn-xs';
        button.innerHTML = '<i class="fa fa-undo fa-fw"></i>';

        var this_ = this;
        var handleResetZoom = function () {
            var map = this_.getMap();
            var view = map.getView();
            view.setZoom(options.zoom);
            //view.fit(options.extent, map.getSize());
        };

        button.addEventListener('click', handleResetZoom, false);
        //button.addEventListener('touchstart', handleResetZoom, false);

        var element = document.createElement('div');
        element.className = 'ogis-reset ol-unselectable ol-control';
        element.appendChild(button);

        ol.control.Control.call(this, {
            element: element,
            target: options.target
        });

    };
    ol.inherits(Ogis.ResetZoomControl, ol.control.Control);


})(window.jQuery,window.ol,window.proj4);


  

    