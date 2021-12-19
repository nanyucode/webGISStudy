<template>
  <div class="map-container">
    <div class="draw-container-container" v-if="drawToolShow">
      <div class="draw-item draw-close" @click="closeDrawTool()"><i class="fa fa-chevron-right"></i></div>
      <div :class='["draw-item",`draw-${item.type}`]' v-for="(item,index) in drawTypes" :key="index" @click="drawGraph(item.type)">{{item.name}}</div>
    </div>
    <map-left-chart :cityList='cityList' @switchCity='initCameraWay2'></map-left-chart>
    <div class="map" id='map'>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import 'ol/ol.css'
  import {
    Map,
    View,
    Feature,
    VectorTile
  } from 'ol'
  import TileLayer from 'ol/layer/Tile'
  import * as olControl from 'ol/control';
  import XYZ from 'ol/source/XYZ'
  import OSM from 'ol/source/OSM'
  import ZoomSlider from 'ol/control/ZoomSlider'
  import * as olCoordinate from 'ol/coordinate';
  import {
    Vector as VectorLayer
  } from 'ol/layer';
  import ZoomToExtent from 'ol/control/ZoomToExtent';
  import VectorSource from 'ol/source/Vector';
  import Cluster from 'ol/source/Cluster';
  import {
    GeoJSON,
    WFS
  } from 'ol/format'
  import {
    and as andFilter,
    equalTo as equalToFilter,
    like as likeFilter,
  } from 'ol/format/filter';
  import {
    fromLonLat
  } from 'ol/proj';
  import {
    bbox
  } from 'ol/loadingstrategy'
  import {
    Style,
    Stroke,
    Fill,
    Circle,
    Icon
  } from 'ol/style'
  import {
    toSize
  } from 'ol/size'
  import {
    colorEncodeId
  } from 'ol/renderer/webgl/Layer';
  import {
    Polygon,
    MultiPolygon
  } from "ol/geom";
  import Point from 'ol/geom/Point';
  import TileArcGISRest from 'ol/source/TileArcGISRest';
  import Draw from 'ol/interaction/Draw';
  import MapLeftChart from './MapLeftChart.vue'
  export default {
    components: {
      MapLeftChart
    },
    name: 'Map',
    props: {
      msg: String
    },
    data() {
      return {
        map: null,
        view: null,
        cityList: [],
        cameraLayer: null,
        draw:null,
        drawSource:null,
        drawToolShow:true,//绘制工具是否显示？
        drawTypes: [{
          name: '点',
          type: 'Point'
        }, {
          name: '线',
          type: 'LineString'
        }, {
          name: '面',
          type: 'Polygon'
        }, {
          name: '圆',
          type: "Circle"
        }]
      }
    },
    created() {

    },
    async mounted() {
      this.initMap();
      this.initZoomSide();
      // this.addPoint()
      await this.initCameraWay2()
      await this.initXianMap()
      // this.initCameraPoint();
      // this.addGeoJson(testJson)
    },
    methods: {
      initMap() {
        this.view = new this.$ol.View({
          center: [110.2905, 19.0607],
          projection: 'EPSG:4326',
          minZoom: 2,
          zoom: 9
        })
        this.map = new this.$ol.Map({
          target: 'map',
          // controls: olControl.defaults().extend([new olControl.OverviewMap({
          //   layers: [
          //     new TileLayer({
          //       source: new XYZ({
          //         url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
          //       })
          //     }),
          //   ],
          //   collapsed: 'u00BB',
          //   label: '\u00AB',
          //   collapsed: false,
          // }), new olControl.FullScreen()]),
          layers: [
            new TileLayer({
              source: new TileArcGISRest({
                url: 'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunityENG/MapServer'
              })
            }),
          ],
          view: this.view,
        })
      },
      async initCameraWay2(city = '海口市') {
        // console.log('1111',this.map.getLayers())
        // let cameraLayer = this.map.getLayerByName('cameraPiont');
        // console.log(cameraLayer)
        // this.map.removeLayer(cameraLayer)
        // let pan = this.view.animate({
        //   duration: 3000,
        //         source: this.view.getCenter()
        // })
        // this.view.setCenter([117.2,39.1])
        this.view.setZoom(10)
        this.map.removeLayer(this.cameraLayer)
        let featureRequest2 = new WFS().writeGetFeature({
          srsName: 'EPSG:4326',
          featureNS: 'http://hainanmap.org',
          featurePrefix: 'hainan',
          featureTypes: ['camera'],
          outputFormat: 'application/json',
          filter: equalToFilter('市', city),
        })
        let res = await this.$axiosPostNoQs('http://8.130.54.254:8090/geoserver/hainan/wfs', new XMLSerializer()
          .serializeToString(featureRequest2), {
            'Content-Type': 'application/json'
          });
        let res2 = await fetch('http://8.130.54.254:8090/geoserver/hainan/wfs', {
          method: 'POST',
          body: new XMLSerializer().serializeToString(featureRequest2)
        })
        let json = await res2.json()
        let source = new VectorSource({
          features: (new GeoJSON({
            featureProjection: 'EPSG:4326'
          })).readFeatures(json)
        });
        let clusterSource = new Cluster({
          distance: 40,
          source: source,
        })
        this.cameraLayer = new VectorLayer({
          source: clusterSource,
          style: new Style({
            stroke: new Stroke({
              color: 'rgba(0, 0,0,1)',
              width: 2,
            }),
            image: new Icon({
              scale: 0.16,
              src: require('../../assets/images/camera.png')
            }),
            fill: new Fill({
              color: 'rgba(256,256,256,1)'
            }),
            visible: true
          })
        });
        this.map.addLayer(this.cameraLayer);
      },
      async initCameraPoint() {
        let wfsSource = await new Promise((resolve) => {
          resolve(
            new VectorSource({
              format: new GeoJSON(),
              projection: 'EPSG:4326',
              url: "http://8.130.54.254:8090/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite:camera&maxFeatures=50&outputFormat=application%2Fjson",
              strategy: bbox
            })
          )
        })
        var fill = new Fill({
          color: 'rgba(255,255,255,0.4)'
        });

        let wfsVectorLayer = new VectorLayer({
          name: 'cameraPiont',
          source: wfsSource,
          style: new Style({
            stroke: new Stroke({
              color: 'rgba(0, 0,0,1)',
              width: 2,
            }),
            image: new Icon({
              scale: 0.2,
              src: require('../../assets/images/camera.png')
            }),
            fill: new Fill({
              color: 'rgba(256,256,256,1)'
            }),
            visible: true
          })
        });
        this.map.addLayer(wfsVectorLayer);
      },
      async getXainMap() {

      },
      async initXianMap() {
        // let wfsSourece = new VectorSource({
        //   format:new GeoJSON(),
        //   url:'http://8.130.54.254:8090/geoserver/hainan/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=hainan:hainan_xian&maxFeatures=50&outputFormat=application%2Fjson',
        //   strategy:bbox
        // });
        // let wfsVectorLayer = new VectorLayer({
        //   source:wfsSourece,
        //   style:new Style({
        //     stroke: new Stroke({
        //       color: 'rgba(0, 0,0,1)',
        //       width: 2,
        //     }),
        //     image: new Icon({
        //       scale: 0.2,
        //       src: require('../../assets/images/camera.png')
        //     }),
        //     fill: new Fill({
        //       color: 'rgba(256,256,56,.1)'
        //     }),
        //     visible: true
        //   })
        // })
        // this.map.addLayer(wfsVectorLayer)
        let res = await this.$axiosGet(
          'http://8.130.54.254:8090/geoserver/hainan/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=hainan:hainan_xian&maxFeatures=50&outputFormat=application%2Fjson'
          );
        let json = res.data;
        let xianList = res.data.features.map(value => {
          return value.properties
        })
        let xianName = xianList.map(value => {
          return value['县']
        })
        this.cityList = Array.from(new Set(xianName));
        console.log(this.cityList)
        let wfsSource = new VectorSource({
          features: (new GeoJSON({
            featureProjection: 'EPSG:4326'
          })).readFeatures(res.data),
        });
        console.log('222', wfsSource)
        let wfsVectorLayer = new VectorLayer({
          source: wfsSource,
          style: new Style({
            stroke: new Stroke({
              color: '#DD5044',
              width: 2,
            }),
            fill: new Fill({
              color: 'rgba(256,256,256,0.1)'
            }),
            visible: true
          })
        });
        this.map.addLayer(wfsVectorLayer)
      },

      addPoint() {
        let points = [
          [117.2, 39.1],
          [117.27, 31.86],
          [114.085947, 22.547],
          [104.06, 30.67]
        ];
        let style = new Style({
          stroke: new Stroke({
            color: 'rgba(0, 0,0,1)',
            width: 2,
          }),
          image: new Icon({
            scale: 0.2,
            src: require('../../assets/images/pointer.png')
          }),
          fill: new Fill({
            color: 'rgba(256,256,56,.1)'
          }),
          visible: true
        })

        function setPoint(points = []) {
          let pointsToGeo = [];
          points.forEach(point => {
            let iconFeature = new Feature({
              geometry: new Point(point)
            });
            iconFeature.setStyle(style)
            pointsToGeo.push(iconFeature);
          });
          return pointsToGeo
        };
        let vectorSoure = new VectorSource({
          features: setPoint(points)
        });
        let vectorLayer = new VectorLayer({
          source: vectorSoure,
        });
        this.map.addLayer(vectorLayer);

      },
      addGeoJson(geo = {}) {
        this.areaLayer = new VectorLayer({
          source: new VectorSource({
            features: [],
          }),
        });
        let features = geo.features;
        for (let i in features) {
          let areaFeature = {};
          if (features[i].geometry.type == "MultiPolygon") {
            areaFeature = new Feature({
              geometry: new MultiPolygon(features[i].geometry.coordinates),
            });
          } else if (features[i].geometry.type == "Polygon") {
            areaFeature = new Feature({
              geometry: new Polygon(features[i].geometry.coordinates),
            });
          }
          areaFeature.setStyle(
            new Style({
              fill: new Fill({
                color: "#4e98f444"
              }),
              stroke: new Stroke({
                width: 3,
                color: [71, 137, 227, 1],
              }),
            })
          );
          areaFeature.setProperties(features[i].properties);
          this.areaLayer.getSource().addFeature(areaFeature);
        }
      },
      drawGraph(type) {
        //openLayer中draw函数的基本思路，new一个Source，然后添加到map中，最后draw函数添加资源到新建的Source中
          // this.draw.finishDrawing()
          this.draw = null
        // this.draw.finishDrawing()
        let drawSource = new VectorSource();
        this.map.addLayer(new VectorLayer({
          source:drawSource
        }))
        this.draw = new Draw({
          source: drawSource,
          type: type,
          style: new Style({
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new Stroke({
              color: '#ffcc33',
              width: 2
            }),
            image: new Circle({
              radius: 7,
              fill: new Fill({
                color: '#ffcc33'
              })
            })
          })
        });
        this.map.addInteraction(this.draw)

      },
      adjustZoom(index) {
        let zoom = this.view.getZoom() + index;
        this.view.setZoom(zoom);
        // this.view.adjustZoom(index)
      },
      rotateMap() {
        this.view.adjustRotation(10)
      },
      initZoomSide() {
        let zoomSlider = new ZoomSlider();
        this.map.addControl(zoomSlider)
      },
      closeDrawTool(){
        this.drawToolShow = !this.drawToolShow
        console.log('test');
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .map-container {
    width: 100%;
    height: 100%;
  }

  .map-container {
    position: relative;
  }

  .map {
    position: absolute;
    right: 0;
    width: 80%;
    height: 100%;
  }

  .map-button {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    z-index: 1;
    width: 100%;
    height: 6%;
    color: #fff;
    font-size: 26px;
  }

  .eye {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12%;
    height: 12%;
    z-index: 1;
  }

  .map-button div {
    margin-right: 2vw;
  }

  .draw-container-container {
    position: absolute;
    top: 6%;
    right: 20%;
    display: flex;
    width: 40%;
    height: 8%;
    z-index: 10;
    background-color: rgba(96, 125, 139, 0.7);
  }
  .draw-close{
    align-items: center;
  }

  .draw-item {
    display: flex;
    justify-content: center;
    width: 20%;
    height: 100%;
    background-size: 50% 50%;
    background-repeat: no-repeat;
    background-position: center 80%;
    color: #fff;
    font-weight: bolder;
  }

  .draw-item+.draw-item {
    border-left: 2px solid #455A64;
  }

  .draw-Point {
    background-image: url("../../assets/images/point.svg");
  }

  .draw-LineString {
    background-image: url('../../assets/images/line.svg');
  }

  .draw-Polygon {
    background-image: url('../../assets/images/polygon.svg');
  }

  .draw-Circle {
    background-image: url('../../assets/images/circle.svg');
  }
</style>