//轮播图
document.querySelectorAll('.head-nav .warpper ul li a').forEach(function (a) {
    a.addEventListener('mouseenter', function () {
        a.parentElement.classList.add('active');
    });
    a.addEventListener('mouseleave', function () {
        a.parentElement.classList.remove('active');
    });
});

const doms = {
    carouselContainer: document.querySelector('.head-carousel'), // 添加轮播图主容器
    carouselItems: document.querySelectorAll('.head-carousel .carousel-list img'),
    carouselList: document.querySelector('.head-carousel .carousel-list'),
    carouselLeft: document.querySelector('.head-carousel .carousel-left'),
    carouselRight: document.querySelector('.head-carousel .carousel-right'),
    carouselIndicatorDots: document.querySelectorAll('.head-carousel .carousel-indicator li')
};

const realImageCount = doms.carouselItems.length;
let currentRealIndex = 0;
let totalVisualItemCount = realImageCount;
let isTransitioning = false;

// 自动播放相关
let autoPlayInterval = null;
const autoPlayDelay = 3000; // 4秒

function updateIndicators(activeIndex) {
    if (realImageCount === 0) return;
    doms.carouselIndicatorDots.forEach((dot, i) => {
        dot.classList.toggle('carousel-active', i === activeIndex);
    });
}

function moveToVisualIndex(visualIndex, applyTransition = true) {
    if (totalVisualItemCount === 0) return;
    if (!applyTransition) {
        doms.carouselList.style.transition = 'none';
    }
    doms.carouselList.style.transform = `translateX(calc(-${visualIndex} / ${totalVisualItemCount} * 100%))`;
    if (!applyTransition) {
        void doms.carouselList.offsetWidth;
        doms.carouselList.style.transition = ''; // 恢复CSS中定义的过渡
    }
}

function setupSeamlessCarousel() {
    if (realImageCount <= 1) {
        if (realImageCount === 1) updateIndicators(0);
        return;
    }
    const firstImageClone = doms.carouselItems[0].cloneNode(true);
    const lastImageClone = doms.carouselItems[realImageCount - 1].cloneNode(true);
    doms.carouselList.appendChild(firstImageClone);
    doms.carouselList.insertBefore(lastImageClone, doms.carouselItems[0]);
    totalVisualItemCount = realImageCount + 2;
    currentRealIndex = 0;
    moveToVisualIndex(currentRealIndex + 1, false);
    updateIndicators(currentRealIndex);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

function startAutoPlay() {
    stopAutoPlay(); // 先停止任何已存在的定时器
    if (realImageCount > 1) { // 只有多于一张图片时才自动播放
        autoPlayInterval = setInterval(() => {
            goRight();
        }, autoPlayDelay);
    }
}

doms.carouselList.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (currentRealIndex === realImageCount) {
        currentRealIndex = 0;
        moveToVisualIndex(currentRealIndex + 1, false);
    } else if (currentRealIndex === -1) {
        currentRealIndex = realImageCount - 1;
        moveToVisualIndex(currentRealIndex + 1, false);
    }
    startAutoPlay(); // 动画结束后（包括无缝跳转后）重启自动播放计时
});

function goLeft() {
    if (isTransitioning || realImageCount <= 1) return;
    stopAutoPlay(); // 用户操作时停止自动播放
    isTransitioning = true;
    currentRealIndex--;
    let indicatorToShow = currentRealIndex;
    if (currentRealIndex < 0) {
        indicatorToShow = realImageCount - 1;
    }
    updateIndicators(indicatorToShow);
    moveToVisualIndex(currentRealIndex + 1);
}

function goRight() {
    if (isTransitioning || realImageCount <= 1) return;
    stopAutoPlay(); // 用户操作或自动播放触发时停止当前计时（如果由setInterval调用，stopAutoPlay在startAutoPlay内部已处理）
    isTransitioning = true;
    currentRealIndex++;
    let indicatorToShow = currentRealIndex;
    if (currentRealIndex >= realImageCount) {
        indicatorToShow = 0;
    }
    updateIndicators(indicatorToShow);
    moveToVisualIndex(currentRealIndex + 1);
}

// 事件监听
doms.carouselLeft.addEventListener('click', goLeft);
doms.carouselRight.addEventListener('click', goRight);

doms.carouselIndicatorDots.forEach((dot, index) => {
    dot.addEventListener('mouseenter', function () {
        if (isTransitioning || index === currentRealIndex || realImageCount <= 1) return;
        stopAutoPlay(); // 用户操作时停止自动播放
        isTransitioning = true;
        currentRealIndex = index;
        updateIndicators(currentRealIndex);
        moveToVisualIndex(currentRealIndex + 1);
    });
});

// 鼠标悬停控制自动播放
if (doms.carouselContainer) {
    doms.carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    doms.carouselContainer.addEventListener('mouseleave', startAutoPlay);
}

// 初始化轮播图
setupSeamlessCarousel();
startAutoPlay(); // 初始启动自动播放



//活动导航
document.querySelectorAll('.activity-banner .item ul li').forEach(function (li) {
    li.addEventListener('click', function () {
        // 先移除所有li的'on'类
        document.querySelectorAll('.activity-banner .item ul li').forEach(function (el) {
            el.classList.remove('on');
        });
        // 给当前点击的li加'on'类
        li.classList.add('on');
    });
});