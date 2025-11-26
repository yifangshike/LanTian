"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const bannersList = common_vendor.ref([]);
    const getBannerList = async () => {
      try {
        const db = common_vendor.tr.database();
        const res = await db.collection("banner").orderBy("sort", "asc").get();
        bannersList.value = res.result.data;
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/home/index.vue:199", "云数据库调用失败或未配置，使用默认图", e);
      }
    };
    common_vendor.onLoad(() => {
      getBannerList();
    });
    const navList = common_vendor.ref([
      { name: "官方活动", icon: "🚩", bg: "#E3F2FD", action: "event" },
      // 蓝色系
      { name: "路线库", icon: "🗺️", bg: "#E8F5E9", action: "route" },
      // 绿色系
      { name: "找搭子", icon: "🤝", bg: "#FFF3E0", action: "partner" },
      // 橙色系
      { name: "加入组织", icon: "👋", bg: "#F3E5F5", action: "join" },
      // 紫色系
      { name: "装备租赁", icon: "🎒", bg: "#EEEEEE", action: "gear" }
      // 灰色系
    ]);
    const handleNavClick = (nav) => {
      common_vendor.index.__f__("log", "at pages/home/index.vue:216", "点击导航", nav.name);
      if (nav.action === "event")
        common_vendor.index.switchTab({ url: "/pages/event/list" });
      if (nav.action === "route")
        common_vendor.index.switchTab({ url: "/pages/route/index" });
    };
    const tabs = ["热门活动", "精选路线", "社区动态"];
    const currentTab = common_vendor.ref(0);
    const activityList = common_vendor.ref([
      {
        title: "周末清凉溯溪一日游，黄陂大顶山",
        date: "06.25 周六",
        location: "武汉·黄陂",
        price: "128",
        status: "报名中",
        statusClass: "st-green",
        type: "溯溪",
        joined: 24,
        cover: "https://images.unsplash.com/photo-1465188162913-8fb5709d6d57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "环东湖骑行，追逐日落",
        date: "06.26 周日",
        location: "武汉·东湖绿道",
        price: "0",
        status: "已满员",
        statusClass: "st-gray",
        type: "骑行",
        joined: 50,
        cover: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      }
    ]);
    const routeList = common_vendor.ref([
      {
        title: "九峰山森林公园大环线",
        distance: "12.5",
        climb: "400",
        difficulty: "⭐⭐",
        cover: "https://images.unsplash.com/photo-1519331379826-f96808347a4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "木兰草原露营徒步线",
        distance: "8.0",
        climb: "120",
        difficulty: "⭐",
        cover: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      }
    ]);
    const postList = common_vendor.ref([
      {
        user: "户外小能手",
        time: "10分钟前",
        content: "今天天气真不错，打卡磨山！风景太美了~",
        imgs: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"]
      },
      {
        user: "老驴友",
        time: "2小时前",
        content: "分享一下我的新装备，轻量化背包确实香。",
        imgs: []
      }
    ]);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(bannersList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.imgUrl || "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            b: item.title
          }, item.title ? {
            c: common_vendor.t(item.title)
          } : {}, {
            d: item._id
          });
        }),
        b: bannersList.value.length === 0
      }, bannersList.value.length === 0 ? {} : {}, {
        c: common_vendor.f(navList.value, (nav, index, i0) => {
          return {
            a: common_vendor.t(nav.icon),
            b: nav.bg,
            c: common_vendor.t(nav.name),
            d: index,
            e: common_vendor.o(($event) => handleNavClick(nav), index)
          };
        }),
        d: common_vendor.f(tabs, (tab, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab),
            b: currentTab.value === index
          }, currentTab.value === index ? {} : {}, {
            c: index,
            d: currentTab.value === index ? 1 : "",
            e: common_vendor.o(($event) => currentTab.value = index, index)
          });
        }),
        e: currentTab.value === 0
      }, currentTab.value === 0 ? {
        f: common_vendor.f(activityList.value, (item, idx, i0) => {
          return {
            a: item.cover,
            b: common_vendor.t(item.status),
            c: common_vendor.n(item.statusClass),
            d: common_vendor.t(item.type),
            e: common_vendor.t(item.title),
            f: common_vendor.t(item.date),
            g: common_vendor.t(item.location),
            h: common_vendor.f(3, (n, k1, i1) => {
              return {
                a: n
              };
            }),
            i: common_vendor.t(item.joined),
            j: common_vendor.t(item.price),
            k: idx
          };
        })
      } : {}, {
        g: currentTab.value === 1
      }, currentTab.value === 1 ? {
        h: common_vendor.f(routeList.value, (route, idx, i0) => {
          return {
            a: route.cover,
            b: common_vendor.t(route.title),
            c: common_vendor.t(route.distance),
            d: common_vendor.t(route.climb),
            e: common_vendor.t(route.difficulty),
            f: idx
          };
        })
      } : {}, {
        i: currentTab.value === 2
      }, currentTab.value === 2 ? {
        j: common_vendor.f(postList.value, (post, idx, i0) => {
          return common_vendor.e({
            a: common_vendor.t(post.user),
            b: common_vendor.t(post.time),
            c: common_vendor.t(post.content),
            d: post.imgs
          }, post.imgs ? {
            e: common_vendor.f(post.imgs, (img, i, i1) => {
              return {
                a: i,
                b: img
              };
            })
          } : {}, {
            f: idx
          });
        })
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/index.js.map
