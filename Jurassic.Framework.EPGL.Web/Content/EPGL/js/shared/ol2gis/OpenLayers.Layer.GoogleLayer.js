OpenLayers.Layer.GoogleLayer = OpenLayers.Class(OpenLayers.Layer.XYZ, {
    url: null,
    tileOrigin: null,
    tileSize: new OpenLayers.Size(256, 256),
    type: 'png',
    useScales: false,
    overrideDPI: false,
    initialize: function(name, url, options) {
    	this.lyrs = options.lyrs;
        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, arguments);
    },
    getURL: function (bounds) {
        var res = this.getResolution();
        var originTileX = (this.tileOrigin.lon + (res * this.tileSize.w/2));
        var originTileY = (this.tileOrigin.lat - (res * this.tileSize.h/2));
        var center = bounds.getCenterLonLat();
        var x = (Math.round(Math.abs((center.lon - originTileX) / (res * this.tileSize.w))));
        var y = (Math.round(Math.abs((originTileY - center.lat) / (res * this.tileSize.h)))); 
        var z = this.map.getZoom();
        var url = this.url;
        var s = '' + x + y + z;
        if (OpenLayers.Util.isArray(url)) {
            url = this.selectUrl(s, url);
        }
        //url = url + '?lyrs=${lyrs}&hl=zh-CN&gl=CN&z=${z}&x=${x}&y=${y}';//&L=4&X=12&Y=3
        //url = OpenLayers.String.format(url, {'lyrs': this.lyrs, 'x': x, 'y': y, 'z': z});
        url = url.replace("{z}", Math.abs(z));
        url = url.replace("{x}", Math.abs(x));
        url = url.replace("{y}", Math.abs(y) - 1);
        console.log(url);
        url = '/OpenlayerProxy.ashx?url=' + encodeURIComponent(url);
        return OpenLayers.Util.urlAppend(
            url, OpenLayers.Util.getParameterString(this.params)
        );
    },

    CLASS_NAME: 'OpenLayers.Layer.GoogleLayer'
}); 