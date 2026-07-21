<template>
  <div class="map-container">
    <div class="title">
      <div class="subTitle">海仿智能安全用电卫士系统</div>
    </div>

    <div class="card">
      <baidu-map class="bm-view" :zoom="zoom" :center="center" :map-click="false" @ready="handleMapReady"
        v-loading="isLoading" element-loading-text="正在加载地图..." element-loading-background="rgba(0, 0, 0, 0.8)">
        <!-- 动态渲染所有设备标记点 -->
        <DeviceMarker v-for="deviceId in deviceIds" :key="deviceId" :device-id="deviceId"
          :position="getDevicePosition(deviceId)" :status="getDeviceStatus(deviceId)" @click="handleDeviceClick" />
      </baidu-map>
    </div>

    <div class="status-legend" aria-label="设备状态颜色说明">
      <span><img src="/green.svg" alt="">正常</span>
      <span><img src="/red.svg" alt="">充电</span>
    </div>

    <!-- 设备信息弹窗 -->
    <DeviceInfoDialog v-model:visible="dialogVisible" :device-id="selectedDeviceId" :device-data="selectedDeviceData"
      @close="handleDialogClose" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DeviceMarker from './DeviceMarker.vue';
import DeviceInfoDialog from './DeviceInfoDialog.vue';
import { useDeviceData } from '../composables/useDeviceData';
import { useSignalR } from '../composables/useSignalR';
import { useLoading } from '../composables/useLoading';
import { deviceApi } from '../services/api';
import { handleApiError } from '../utils/errorHandler';
import type { MapCenter } from '../types/config';

// 地图配置
const center = ref<MapCenter>({ lng: 121.40953, lat: 31.260756 });
const zoom = ref<number>(18);
const mapTheme = [{ featureType: 'poi', elementType: 'all', stylers: { visibility: 'off' } }];

// 弹窗状态
const dialogVisible = ref<boolean>(false);
const selectedDeviceId = ref<string | null>(null);

// 使用加载状态
const { isLoading, withLoading } = useLoading('map');

// 使用设备数据管理
const {
  deviceIds,
  updateDeviceData,
  getDeviceStatus,
  getDevicePosition,
  getDeviceData
} = useDeviceData();

// 获取选中设备的数据
const selectedDeviceData = computed(() => {
  if (!selectedDeviceId.value) return null;
  return getDeviceData(selectedDeviceId.value);
});

// 使用SignalR连接
const { isConnected, connectionError } = useSignalR({
  onMessage: (message) => {
    updateDeviceData(message);
  },
  onConnect: () => {
    console.log('SignalR连接成功');
  },
  onDisconnect: () => {
    console.log('SignalR连接断开');
  },
  onError: (error) => {
    console.error('SignalR连接错误:', error);
  }
});

// 地图准备就绪处理
const handleMapReady = ({ map }): void => {
  center.value = { lng: 121.492300, lat: 31.269737 };
  zoom.value = 20;
  map.setMapStyleV2({
    styleJson: [{
      "featureType": "land",
      "elementType": "geometry",
      "stylers": {
        "color": "#242f3eff"
      }
    }, {
      "featureType": "manmade",
      "elementType": "geometry",
      "stylers": {
        "color": "#242f3eff"
      }
    }, {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": {
        "color": "#17263cff"
      }
    }, {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": {
        "color": "#9e7d60ff"
      }
    }, {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": {
        "color": "#554631ff"
      }
    }, {
      "featureType": "districtlabel",
      "elementType": "labels.text.fill",
      "stylers": {
        "color": "#d69563ff"
      }
    }, {
      "featureType": "districtlabel",
      "elementType": "labels.text.stroke",
      "stylers": {
        "color": "#17263cff",
        "weight": 3
      }
    }, {
      "featureType": "poilabel",
      "elementType": "labels.text.fill",
      "stylers": {
        "color": "#d69563ff"
      }
    }, {
      "featureType": "poilabel",
      "elementType": "labels.text.stroke",
      "stylers": {
        "color": "#17263cff",
        "weight": 3
      }
    }, {
      "featureType": "subway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "railway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "poilabel",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "subwaylabel",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "subwaylabel",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "tertiarywaysign",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "tertiarywaysign",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "provincialwaysign",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "provincialwaysign",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "nationalwaysign",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "nationalwaysign",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "highwaysign",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "highwaysign",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "green",
      "elementType": "geometry",
      "stylers": {
        "color": "#263b3eff"
      }
    }, {
      "featureType": "nationalwaysign",
      "elementType": "labels.text.fill",
      "stylers": {
        "color": "#d0021bff"
      }
    }, {
      "featureType": "nationalwaysign",
      "elementType": "labels.text.stroke",
      "stylers": {
        "color": "#ffffffff"
      }
    }, {
      "featureType": "city",
      "elementType": "labels",
      "stylers": {
        "visibility": "on"
      }
    }, {
      "featureType": "city",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "city",
      "elementType": "labels.text.fill",
      "stylers": {
        "color": "#d69563ff"
      }
    }, {
      "featureType": "city",
      "elementType": "labels.text.stroke",
      "stylers": {
        "color": "#17263cff"
      }
    }, {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": {
        "color": "#d69563ff"
      }
    }, {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": {
        "color": "#242f3eff"
      }
    }, {
      "featureType": "local",
      "elementType": "geometry.fill",
      "stylers": {
        "color": "#38414eff"
      }
    }, {
      "featureType": "local",
      "elementType": "geometry.stroke",
      "stylers": {
        "color": "#ffffff00"
      }
    }, {
      "featureType": "fourlevelway",
      "elementType": "geometry.fill",
      "stylers": {
        "color": "#38414eff"
      }
    }, {
      "featureType": "fourlevelway",
      "elementType": "geometry.stroke",
      "stylers": {
        "color": "#ffffff00"
      }
    }, {
      "featureType": "tertiaryway",
      "elementType": "geometry.fill",
      "stylers": {
        "color": "#38414eff"
      }
    }, {
      "featureType": "tertiaryway",
      "elementType": "geometry.stroke",
      "stylers": {
        "color": "#ffffff00"
      }
    }, {
      "featureType": "tertiaryway",
      "elementType": "labels.text.fill",
      "stylers": {
        "color": "#759879ff"
      }
    }, {
      "featureType": "fourlevelway",
      "elementType": "labels.text.fill",
      "stylers": {
        "color": "#759879ff"
      }
    }, {
      "featureType": "highway",
      "elementType": "labels.text.fill",
      "stylers": {
        "color": "#759879ff"
      }
    }, {
      "featureType": "highway",
      "elementType": "geometry.fill",
      "stylers": {
        "color": "#9e7d60ff"
      }
    }, {
      "featureType": "highway",
      "elementType": "geometry.stroke",
      "stylers": {
        "color": "#554631ff"
      }
    }, {
      "featureType": "provincialway",
      "elementType": "geometry.fill",
      "stylers": {
        "color": "#9e7d60ff"
      }
    }, {
      "featureType": "provincialway",
      "elementType": "geometry.stroke",
      "stylers": {
        "color": "#554631ff"
      }
    }, {
      "featureType": "tertiaryway",
      "elementType": "labels.text.stroke",
      "stylers": {
        "color": "#1a2e1cff"
      }
    }, {
      "featureType": "fourlevelway",
      "elementType": "labels.text.stroke",
      "stylers": {
        "color": "#1a2e1cff"
      }
    }, {
      "featureType": "highway",
      "elementType": "labels.text.stroke",
      "stylers": {
        "color": "#1a2e1cff"
      }
    }, {
      "featureType": "nationalway",
      "elementType": "labels.text.stroke",
      "stylers": {
        "color": "#1a2e1cff"
      }
    }, {
      "featureType": "nationalway",
      "elementType": "labels.text.fill",
      "stylers": {
        "color": "#759879ff"
      }
    }, {
      "featureType": "nationalway",
      "elementType": "geometry.fill",
      "stylers": {
        "color": "#9e7d60ff"
      }
    }, {
      "featureType": "nationalway",
      "elementType": "geometry.stroke",
      "stylers": {
        "color": "#554631ff"
      }
    }, {
      "featureType": "cityhighway",
      "elementType": "geometry.fill",
      "stylers": {
        "color": "#9e7d60ff"
      }
    }, {
      "featureType": "cityhighway",
      "elementType": "geometry.stroke",
      "stylers": {
        "color": "#554631ff"
      }
    }, {
      "featureType": "arterial",
      "elementType": "geometry.fill",
      "stylers": {
        "color": "#9e7d60ff"
      }
    }, {
      "featureType": "arterial",
      "elementType": "geometry.stroke",
      "stylers": {
        "color": "#554631fa"
      }
    }, {
      "featureType": "medicallabel",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "medicallabel",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "entertainmentlabel",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "entertainmentlabel",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "estatelabel",
      "elementType": "labels",
      "stylers": {
        "visibility": "on"
      }
    }, {
      "featureType": "estatelabel",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "businesstowerlabel",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "businesstowerlabel",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "companylabel",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "companylabel",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "governmentlabel",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "governmentlabel",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "restaurantlabel",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "restaurantlabel",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "hotellabel",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "hotellabel",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "shoppinglabel",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "shoppinglabel",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "lifeservicelabel",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "lifeservicelabel",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "carservicelabel",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "carservicelabel",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "financelabel",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "financelabel",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "otherlabel",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "otherlabel",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "airportlabel",
      "elementType": "labels",
      "stylers": {
        "visibility": "on"
      }
    }, {
      "featureType": "airportlabel",
      "elementType": "labels.text.fill",
      "stylers": {
        "color": "#d69563ff"
      }
    }, {
      "featureType": "airportlabel",
      "elementType": "labels.text.stroke",
      "stylers": {
        "color": "#17263cff"
      }
    }, {
      "featureType": "airportlabel",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "highway",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "6"
      }
    }, {
      "featureType": "highway",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "7"
      }
    }, {
      "featureType": "highway",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "8"
      }
    }, {
      "featureType": "highway",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "9"
      }
    }, {
      "featureType": "highway",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "10"
      }
    }, {
      "featureType": "highway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "6"
      }
    }, {
      "featureType": "highway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "7"
      }
    }, {
      "featureType": "highway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "8"
      }
    }, {
      "featureType": "highway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "9"
      }
    }, {
      "featureType": "highway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "10"
      }
    }, {
      "featureType": "nationalway",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "6"
      }
    }, {
      "featureType": "nationalway",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "7"
      }
    }, {
      "featureType": "nationalway",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "8"
      }
    }, {
      "featureType": "nationalway",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "9"
      }
    }, {
      "featureType": "nationalway",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "10"
      }
    }, {
      "featureType": "nationalway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "6"
      }
    }, {
      "featureType": "nationalway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "7"
      }
    }, {
      "featureType": "nationalway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "8"
      }
    }, {
      "featureType": "nationalway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "9"
      }
    }, {
      "featureType": "nationalway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "10"
      }
    }, {
      "featureType": "nationalway",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "6"
      }
    }, {
      "featureType": "nationalway",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "7"
      }
    }, {
      "featureType": "nationalway",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "8"
      }
    }, {
      "featureType": "nationalway",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "9"
      }
    }, {
      "featureType": "nationalway",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "10"
      }
    }, {
      "featureType": "highway",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "6"
      }
    }, {
      "featureType": "highway",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "7"
      }
    }, {
      "featureType": "highway",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "8"
      }
    }, {
      "featureType": "highway",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "9"
      }
    }, {
      "featureType": "highway",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "10"
      }
    }, {
      "featureType": "provincialway",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "8,9",
        "level": "8"
      }
    }, {
      "featureType": "provincialway",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "8,9",
        "level": "9"
      }
    }, {
      "featureType": "provincialway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "8,9",
        "level": "8"
      }
    }, {
      "featureType": "provincialway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "8,9",
        "level": "9"
      }
    }, {
      "featureType": "provincialway",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "8,9",
        "level": "8"
      }
    }, {
      "featureType": "provincialway",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "8,9",
        "level": "9"
      }
    }, {
      "featureType": "cityhighway",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "6"
      }
    }, {
      "featureType": "cityhighway",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "7"
      }
    }, {
      "featureType": "cityhighway",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "8"
      }
    }, {
      "featureType": "cityhighway",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "9"
      }
    }, {
      "featureType": "cityhighway",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "10"
      }
    }, {
      "featureType": "cityhighway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "6"
      }
    }, {
      "featureType": "cityhighway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "7"
      }
    }, {
      "featureType": "cityhighway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "8"
      }
    }, {
      "featureType": "cityhighway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "9"
      }
    }, {
      "featureType": "cityhighway",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "10"
      }
    }, {
      "featureType": "cityhighway",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "6"
      }
    }, {
      "featureType": "cityhighway",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "7"
      }
    }, {
      "featureType": "cityhighway",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "8"
      }
    }, {
      "featureType": "cityhighway",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "9"
      }
    }, {
      "featureType": "cityhighway",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "6,10",
        "level": "10"
      }
    }, {
      "featureType": "arterial",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "9,10",
        "level": "9"
      }
    }, {
      "featureType": "arterial",
      "stylers": {
        "curZoomRegionId": "0",
        "curZoomRegion": "9,10",
        "level": "10"
      }
    }, {
      "featureType": "arterial",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "9,10",
        "level": "9"
      }
    }, {
      "featureType": "arterial",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "9,10",
        "level": "10"
      }
    }, {
      "featureType": "arterial",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "9,10",
        "level": "9"
      }
    }, {
      "featureType": "arterial",
      "elementType": "labels",
      "stylers": {
        "visibility": "off",
        "curZoomRegionId": "0",
        "curZoomRegion": "9,10",
        "level": "10"
      }
    }, {
      "featureType": "building",
      "elementType": "geometry.topfill",
      "stylers": {
        "color": "#2a3341ff"
      }
    }, {
      "featureType": "building",
      "elementType": "geometry.sidefill",
      "stylers": {
        "color": "#313b4cff"
      }
    }, {
      "featureType": "building",
      "elementType": "geometry.stroke",
      "stylers": {
        "color": "#1a212eff"
      }
    }, {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": {
        "color": "#759879ff"
      }
    }, {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": {
        "color": "#1a2e1cff"
      }
    }, {
      "featureType": "provincialway",
      "elementType": "labels.text.fill",
      "stylers": {
        "color": "#759879ff"
      }
    }, {
      "featureType": "cityhighway",
      "elementType": "labels.text.fill",
      "stylers": {
        "color": "#759879ff"
      }
    }, {
      "featureType": "arterial",
      "elementType": "labels.text.fill",
      "stylers": {
        "color": "#759879ff"
      }
    }, {
      "featureType": "provincialway",
      "elementType": "labels.text.stroke",
      "stylers": {
        "color": "#1a2e1cff"
      }
    }, {
      "featureType": "cityhighway",
      "elementType": "labels.text.stroke",
      "stylers": {
        "color": "#1a2e1cff"
      }
    }, {
      "featureType": "arterial",
      "elementType": "labels.text.stroke",
      "stylers": {
        "color": "#1a2e1cff"
      }
    }, {
      "featureType": "local",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "manmade",
      "elementType": "labels.text.fill",
      "stylers": {
        "color": "#d69563ff"
      }
    }, {
      "featureType": "manmade",
      "elementType": "labels.text.stroke",
      "stylers": {
        "color": "#17263cff"
      }
    }, {
      "featureType": "subwaystation",
      "elementType": "geometry",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "transportationlabel",
      "elementType": "labels.icon",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "transportationlabel",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "estate",
      "elementType": "geometry",
      "stylers": {
        "color": "#2a3341ff"
      }
    }, {
      "featureType": "estatelabel",
      "elementType": "labels.text.fill",
      "stylers": {
        "opacity": "ff"
      },
      "styleType": "poilabel"
    }]
  });
};

// 设备标记点击处理
const handleDeviceClick = (deviceId: string): void => {
  selectedDeviceId.value = deviceId;
  dialogVisible.value = true;
};

// 弹窗关闭处理
const handleDialogClose = (): void => {
  selectedDeviceId.value = null;
  dialogVisible.value = false;
};

// 获取设备列表
const fetchDevices = async (): Promise<void> => {
  await withLoading(async () => {
    try {
      const devices = await deviceApi.getDeviceList();
      console.log('设备列表:', devices);
    } catch (error) {
      console.error('获取设备列表失败:', error);
      handleApiError(error, '/Device/GetList');
    }
  }, { message: '正在加载设备列表...' });
};

// 组件挂载时初始化
onMounted(() => {
  fetchDevices();
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

.title {
  background-image: url("/imgs/bg.png");
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 60px;
  width: 100%;
  z-index: 1;
}

.subTitle {
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 10px;
  font-size: 2.5rem;
  color: #fff;
}

.card {
  width: 100%;
  height: 100%;
}

.bm-view {
  width: 100%;
  height: 100%;
}

.status-legend {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 1;
  display: flex;
  gap: 16px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.status-legend span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-legend img {
  width: 16px;
  height: 20px;
}
</style>
