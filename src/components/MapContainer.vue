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
const handleMapReady = (): void => {
  center.value = { lng: 121.492300, lat: 31.269737 };
  zoom.value = 20;
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
