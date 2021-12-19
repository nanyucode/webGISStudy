<template>
  <div class="home">
    <div class="header">
      <img src="../assets/images/logo.png" alt="">
      <div>海南视频一张图管理与分析</div>
      <div class="nav">
      <div :class="['menu-item',{'menu-actived':index === menuIndex}]" v-for='(item,index) in menuList' :key='index'
        @click="switchMenu(item,index)">{{item.name}}<i class="fa fa-bandcamp" aria-hidden="true"></i></div>
    </div>

    </div>
    
    <div class="content-container">
      <router-view />
    </div>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  export default {
    name: 'Home',
    components: {},
    computed: {
      ...mapState({
        menuList: state => state.menuList,
        menuIndex: state => state.menuIndex
      })
    },
    methods: {
      switchMenu(menuInfo, index) {
        this.$store.dispatch('switchMenuIndex', index)
        this.$router.push(menuInfo.path)
      }
    }
  }
</script>
<style scoped>
    .content-container {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 92%;
    }

  .home {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 8%;
    background-color: #1F6B75;
    color: #fff;
    font-size: 24px;
    font-weight: bolder;
  }
  
    .nav {
      display: flex;
      width: 76%;
      height: 100%;
      color: #fff
    }

  .menu-item {
    display: flex;
    align-items: center;
    width: 40%;
    height: 100%;
  }

  .menu-actived {
    background-color: #1C8993;
  }
</style>