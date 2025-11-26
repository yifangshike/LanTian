<template>
  <view class="home-container">
    <!-- 1. 顶部导航栏 (自定义导航栏 + 搜索) -->
    <view class="custom-header">
      <!-- 状态栏占位 -->
      <view class="status-bar"></view> 
      <view class="header-content">
        <view class="location-box">
          <text class="city-text">武汉</text>
          <text class="arrow-down">▼</text>
        </view>
        <view class="search-box">
          <text class="search-icon">🔍</text>
          <text class="placeholder">搜索路线、活动、搭子</text>
        </view>
        <view class="message-box">
          <text class="msg-icon">🔔</text>
          <view class="badge"></view>
        </view>
      </view>
    </view>

    <!-- 2. 轮播图 Banner (已接入云数据库) -->
    <view class="banner-wrapper">
      <swiper
        class="main-swiper"
        circular
        autoplay
        interval="4000"
        duration="500"
        indicator-dots
        indicator-active-color="#03c610"
        indicator-color="rgba(255,255,255,0.6)"
      >
        <swiper-item v-for="item in bannersList" :key="item._id">
          <view class="swiper-item-content">
            <image
              class="banner-img"
              :src="item.imgUrl || 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'" 
              mode="aspectFill"
            />
            <!-- 渐变遮罩，让文字更清晰 -->
            <view class="banner-mask"></view>
            <text class="banner-title" v-if="item.title">{{ item.title }}</text>
          </view>
        </swiper-item>
        <!-- 兜底假数据，防止数据库无数据时空白 -->
        <block v-if="bannersList.length === 0">
           <swiper-item>
             <image class="banner-img" src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" mode="aspectFill" />
           </swiper-item>
        </block>
      </swiper>
    </view>

    <!-- 3. 金刚区 (悬浮卡片风格) -->
    <view class="nav-card">
      <view class="nav-item" v-for="(nav, index) in navList" :key="index" @click="handleNavClick(nav)">
        <view class="nav-icon-wrapper" :style="{ background: nav.bg }">
          <text class="nav-icon">{{ nav.icon }}</text>
        </view>
        <text class="nav-name">{{ nav.name }}</text>
      </view>
    </view>

    <!-- 4. 滚动通知栏 -->
    <view class="notice-bar">
      <text class="notice-tag">公告</text>
      <swiper class="notice-swiper" vertical autoplay circular interval="3000">
        <swiper-item class="notice-item">
          <text class="notice-text">本周六黄陂徒步活动因雨延期，请注意查看群通知。</text>
        </swiper-item>
        <swiper-item class="notice-item">
          <text class="notice-text">俱乐部新版积分规则上线，签到送积分！</text>
        </swiper-item>
      </swiper>
      <text class="arrow-right">></text>
    </view>

    <!-- 5. 精选推荐 (瓷片区) -->
    <view class="featured-grid">
      <view class="featured-item big-card" style="background-image: url('https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80');">
        <view class="glass-mask">
          <text class="ft-title">新人必读</text>
          <text class="ft-desc">装备 / 避坑指南</text>
        </view>
      </view>
      <view class="featured-col">
        <view class="featured-item small-card bg-blue">
          <text class="ft-title-sm">领队风采</text>
          <text class="ft-desc-sm">专业大咖带队</text>
          <text class="ft-icon">👨‍🌾</text>
        </view>
        <view class="featured-item small-card bg-orange">
          <text class="ft-title-sm">积分商城</text>
          <text class="ft-desc-sm">免费兑换装备</text>
          <text class="ft-icon">🎁</text>
        </view>
      </view>
    </view>

    <!-- 6. 吸顶 Tab 栏 -->
    <view class="sticky-tabs">
      <view 
        class="tab-item" 
        v-for="(tab, index) in tabs" 
        :key="index" 
        :class="{ active: currentTab === index }"
        @click="currentTab = index"
      >
        <text class="tab-text">{{ tab }}</text>
        <view class="tab-line" v-if="currentTab === index"></view>
      </view>
    </view>

    <!-- 7. 内容列表 (根据 Tab 切换) -->
    <view class="content-area">
      <!-- 热门活动 -->
      <view v-if="currentTab === 0" class="activity-list">
        <view class="activity-card" v-for="(item, idx) in activityList" :key="idx">
          <view class="act-cover">
            <image :src="item.cover" mode="aspectFill" class="act-img" />
            <view class="act-tag" :class="item.statusClass">{{ item.status }}</view>
            <view class="act-type">{{ item.type }}</view>
          </view>
          <view class="act-info">
            <text class="act-title">{{ item.title }}</text>
            <view class="act-meta">
              <text class="meta-item">📅 {{ item.date }}</text>
              <text class="meta-item">📍 {{ item.location }}</text>
            </view>
            <view class="act-bottom">
              <view class="user-avatars">
                 <view class="avatar" v-for="n in 3" :key="n"></view>
                 <text class="enroll-text">已报{{ item.joined }}人</text>
              </view>
              <text class="price">¥{{ item.price }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 推荐路线 -->
      <view v-if="currentTab === 1" class="route-list">
        <view class="route-card" v-for="(route, idx) in routeList" :key="idx">
          <image :src="route.cover" mode="aspectFill" class="route-img" />
          <view class="route-info">
            <text class="route-title">{{ route.title }}</text>
            <view class="route-data">
              <text class="data-num">{{ route.distance }}km</text>
              <text class="data-label">全程</text>
              <text class="divider">|</text>
              <text class="data-num">{{ route.climb }}m</text>
              <text class="data-label">爬升</text>
              <text class="divider">|</text>
              <text class="data-num level">{{ route.difficulty }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 社区动态 -->
      <view v-if="currentTab === 2" class="post-waterfall">
        <!-- 简单列表模拟 -->
        <view class="post-card" v-for="(post, idx) in postList" :key="idx">
          <view class="post-header">
            <view class="post-avatar"></view>
            <view class="post-user">
              <text class="name">{{ post.user }}</text>
              <text class="time">{{ post.time }}</text>
            </view>
          </view>
          <text class="post-txt">{{ post.content }}</text>
          <view class="post-imgs" v-if="post.imgs">
             <image v-for="(img, i) in post.imgs" :key="i" :src="img" mode="aspectFill" class="p-img" />
          </view>
        </view>
      </view>
    </view>

    <!-- 底部安全距离 -->
    <view style="height: 40px;"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// --- 1. 轮播图逻辑 ---
const bannersList = ref([]);
const getBannerList = async () => {
  // 模拟云函数调用，如果未配置云开发会报错，所以加 try-catch
  try {
    const db = uniCloud.database();
    const res = await db.collection('banner').orderBy('sort', 'asc').get();
    bannersList.value = res.result.data;
  } catch (e) {
    console.log('云数据库调用失败或未配置，使用默认图', e);
  }
}
onLoad(() => {
  getBannerList();
});

// --- 2. 金刚区数据 ---
const navList = ref([
  { name: '官方活动', icon: '🚩', bg: '#E3F2FD', action: 'event' }, // 蓝色系
  { name: '路线库', icon: '🗺️', bg: '#E8F5E9', action: 'route' },  // 绿色系
  { name: '找搭子', icon: '🤝', bg: '#FFF3E0', action: 'partner' }, // 橙色系
  { name: '加入组织', icon: '👋', bg: '#F3E5F5', action: 'join' },  // 紫色系
  { name: '装备租赁', icon: '🎒', bg: '#EEEEEE', action: 'gear' }   // 灰色系
]);

const handleNavClick = (nav) => {
  console.log('点击导航', nav.name);
  if(nav.action === 'event') uni.switchTab({ url: '/pages/event/list' });
  if(nav.action === 'route') uni.switchTab({ url: '/pages/route/index' });
};

// --- 3. Tab 切换 ---
const tabs = ['热门活动', '精选路线', '社区动态'];
const currentTab = ref(0);

// --- 4. 模拟数据 ---
const activityList = ref([
  {
    title: '周末清凉溯溪一日游，黄陂大顶山',
    date: '06.25 周六',
    location: '武汉·黄陂',
    price: '128',
    status: '报名中',
    statusClass: 'st-green',
    type: '溯溪',
    joined: 24,
    cover: 'https://images.unsplash.com/photo-1465188162913-8fb5709d6d57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: '环东湖骑行，追逐日落',
    date: '06.26 周日',
    location: '武汉·东湖绿道',
    price: '0',
    status: '已满员',
    statusClass: 'st-gray',
    type: '骑行',
    joined: 50,
    cover: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
]);

const routeList = ref([
  {
    title: '九峰山森林公园大环线',
    distance: '12.5',
    climb: '400',
    difficulty: '⭐⭐',
    cover: 'https://images.unsplash.com/photo-1519331379826-f96808347a4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: '木兰草原露营徒步线',
    distance: '8.0',
    climb: '120',
    difficulty: '⭐',
    cover: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
]);

const postList = ref([
  {
    user: '户外小能手',
    time: '10分钟前',
    content: '今天天气真不错，打卡磨山！风景太美了~',
    imgs: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80']
  },
  {
    user: '老驴友',
    time: '2小时前',
    content: '分享一下我的新装备，轻量化背包确实香。',
    imgs: []
  }
]);
</script>

<style lang="scss">
// 变量
$primary-color: #03c610;
$text-main: #333;
$text-sub: #999;
$bg-color: #F5F7FA;

.home-container {
  background-color: $bg-color;
  min-height: 100vh;
}

// 1. 自定义 Header
.custom-header {
  background-color: #fff;
  padding-bottom: 10px;
  position: sticky;
  top: 0;
  z-index: 100;
  
  .status-bar {
    height: var(--status-bar-height); // 适配刘海屏
  }
  
  .header-content {
    display: flex;
    align-items: center;
    padding: 10px 15px 0;
    height: 44px;
  }
  
  .location-box {
    display: flex;
    align-items: center;
    margin-right: 15px;
    .city-text { font-size: 14px; font-weight: bold; color: $text-main; }
    .arrow-down { font-size: 10px; color: $text-main; margin-left: 4px; }
  }
  
  .search-box {
    flex: 1;
    background-color: #F0F2F5;
    height: 32px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    
    .search-icon { font-size: 12px; margin-right: 6px; }
    .placeholder { font-size: 13px; color: #aaa; }
  }
  
  .message-box {
    margin-left: 15px;
    position: relative;
    .msg-icon { font-size: 20px; }
    .badge {
      position: absolute;
      top: 0;
      right: -2px;
      width: 8px;
      height: 8px;
      background-color: red;
      border-radius: 50%;
    }
  }
}

// 2. Banner
.banner-wrapper {
  background-color: #fff;
  padding: 10px 15px;
}
.main-swiper {
  height: 160px;
  border-radius: 12px;
  overflow: hidden;
  transform: translateY(0); // 修复圆角
  
  .banner-img { width: 100%; height: 100%; }
  .swiper-item-content { position: relative; width: 100%; height: 100%; }
  .banner-mask {
    position: absolute;
    bottom: 0; left: 0; width: 100%; height: 40%;
    background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
  }
  .banner-title {
    position: absolute;
    bottom: 12px; left: 12px;
    color: #fff; font-size: 15px; font-weight: bold;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }
}

// 3. 金刚区
.nav-card {
  background-color: #fff;
  margin: 0 15px 10px;
  padding: 15px 0;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.nav-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 6px;
  .nav-icon { font-size: 22px; }
}
.nav-name { font-size: 12px; color: $text-main; font-weight: 500; }

// 4. 通知栏
.notice-bar {
  margin: 0 15px 10px;
  background-color: #fff;
  border-radius: 8px;
  padding: 0 10px;
  height: 40px;
  display: flex;
  align-items: center;
  
  .notice-tag {
    font-size: 11px; color: #fff; background-color: #FF9800;
    padding: 2px 6px; border-radius: 4px; margin-right: 10px;
  }
  .notice-swiper { flex: 1; height: 40px; }
  .notice-item { display: flex; align-items: center; }
  .notice-text { font-size: 12px; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .arrow-right { color: #ccc; font-size: 12px; }
}

// 5. 瓷片区
.featured-grid {
  display: flex;
  margin: 0 15px 15px;
  gap: 10px;
  height: 160px;
}
.featured-item {
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}
.big-card {
  flex: 1.2;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  
  .glass-mask {
    width: 100%;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(4px);
    padding: 10px;
  }
  .ft-title { display: block; font-size: 15px; font-weight: bold; color: #333; }
  .ft-desc { font-size: 11px; color: #666; }
}
.featured-col {
  flex: 0.8;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.small-card {
  flex: 1;
  padding: 10px;
  position: relative;
  
  &.bg-blue { background-color: #E1F5FE; }
  &.bg-orange { background-color: #FFF3E0; }
  
  .ft-title-sm { font-size: 14px; font-weight: bold; color: #333; display: block; }
  .ft-desc-sm { font-size: 10px; color: #666; }
  .ft-icon { position: absolute; bottom: 5px; right: 5px; font-size: 24px; opacity: 0.8; }
}

// 6. 吸顶 Tabs
.sticky-tabs {
  position: sticky;
  top: calc(var(--status-bar-height) + 54px); // 54 = header height + padding
  background-color: $bg-color;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 90;
  
  .tab-item {
    position: relative;
    padding-bottom: 4px;
    &.active {
      .tab-text { font-size: 18px; font-weight: bold; color: #333; }
      .tab-line {
        position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
        width: 20px; height: 3px; background-color: $primary-color; border-radius: 2px;
      }
    }
    .tab-text { font-size: 16px; color: #999; transition: all 0.2s; }
  }
}

// 7. 内容区
.content-area {
  padding: 0 15px;
}

// 活动卡片
.activity-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  
  .act-cover {
    height: 150px;
    position: relative;
    .act-img { width: 100%; height: 100%; }
    .act-tag {
      position: absolute; top: 10px; left: 10px;
      padding: 4px 8px; border-radius: 4px; font-size: 11px; color: #fff; font-weight: bold;
      &.st-green { background-color: $primary-color; }
      &.st-gray { background-color: #ccc; }
    }
    .act-type {
      position: absolute; bottom: 10px; left: 10px;
      background: rgba(0,0,0,0.6); color: #fff;
      padding: 2px 6px; font-size: 10px; border-radius: 4px;
    }
  }
  
  .act-info { padding: 12px; }
  .act-title { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 8px; display: block; }
  .act-meta { display: flex; gap: 12px; margin-bottom: 12px; }
  .meta-item { font-size: 12px; color: #666; }
  
  .act-bottom {
    display: flex; justify-content: space-between; align-items: center;
    .user-avatars {
      display: flex; align-items: center;
      .avatar { width: 20px; height: 20px; border-radius: 50%; background-color: #ddd; margin-right: -6px; border: 1px solid #fff; }
      .enroll-text { font-size: 11px; color: #999; margin-left: 12px; }
    }
    .price { font-size: 18px; font-weight: bold; color: #FF5722; }
  }
}

// 路线卡片
.route-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  
  .route-img { width: 80px; height: 80px; border-radius: 8px; margin-right: 12px; }
  .route-info { flex: 1; }
  .route-title { font-size: 15px; font-weight: bold; color: #333; margin-bottom: 8px; display: block; }
  .route-data {
    display: flex; align-items: baseline;
    .data-num { font-size: 14px; font-weight: bold; color: #333; margin-right: 2px; }
    .data-label { font-size: 10px; color: #999; }
    .divider { margin: 0 8px; color: #eee; font-size: 10px; }
    .level { color: #FF9800; }
  }
}

// 帖子卡片
.post-card {
  background-color: #fff;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 12px;
  
  .post-header {
    display: flex; align-items: center; margin-bottom: 10px;
    .post-avatar { width: 32px; height: 32px; border-radius: 50%; background-color: #eee; margin-right: 10px; }
    .post-user { 
      .name { font-size: 13px; font-weight: bold; color: #333; display: block; }
      .time { font-size: 10px; color: #ccc; }
    }
  }
  .post-txt { font-size: 14px; color: #333; line-height: 1.6; margin-bottom: 10px; display: block; }
  .post-imgs {
    display: flex; gap: 6px;
    .p-img { width: 100px; height: 100px; border-radius: 6px; }
  }
}
</style>
