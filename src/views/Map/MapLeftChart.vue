<template>
    <div class="map-left-chart">
        <div class="city-container">
            <div class="city-item" v-for="(item,index) in hainanCity" :key=index @click="selectCity(item)">{{item.city}}</div>
        </div>
    </div>

</template>

<script>
import {hainanCity} from './hainan'
    export default {
        name: 'MapLeftChart',
        props: {
            cityList: {
                type: Array,
                default: () => []
            }
        },
        data(){
            return {
                hainanCity:[]
            }
        },
        created() {
            this.hainanCity = hainanCity()
            console.log('1111', hainanCity())
        },
        methods: {
            async getHainanXian() {
                let res = await fetch('')
            },
            selectCity(city){
                console.log(city.city)
                this.$emit('switchCity',city.city)
            }
        }

    }
</script>

<style scoped>
    .map-left-chart {
        position: absolute;
        left: 0;
        width: 20%;
        height: 100%;
        background-color: #278189;
        color:#fff
    }
    .city-container{
        display: grid;
        grid-template-rows: 1fr 2fr 2fr 2fr 2fr 2fr;
        grid-template-columns: repeat(4,20%);
        justify-content: space-around;
        align-content: space-around;
        grid-row-gap:2%;
        width: 100%;
        height: 50%;
    }
    .city-container::before{
        content: '城市列表';
        grid-column: 1/5;
        display: flex;
        align-items: center;
        color: #00BCD4;
        font-weight: bolder;
        font-style: italic;
    }
    .city-item{
        display: flex;
        align-items: center;
        justify-content: center;
        border: 4px solid #00BCD4;
    }
</style>
