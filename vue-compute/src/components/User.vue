<template>
  <div class="user">
    <h3>子组件User</h3>
    <a href="javascript:void(0)"  @click="add"> number:{{count}}{{name}}</a>
    <p v-for="(item, idx) in list" :key="idx" @click="toParent(count)">{{item}}</p>
    <van-button type="primary" @click="toBrother()">给兄弟组件传值</van-button>
    <p>{{getReply}}</p>
  </div>
</template>
<style scoped>
  .user{
    border:1px solid #ccc;
    margin-bottom: 10px;
  }
</style>
<script>
import Vue from 'vue';
import { Button } from 'vant';
Vue.use(Button);
export default {
  name:'User',
  data(){
    return { 
      count:0,
      brother:'hello my brother',
      getReply:'',
    }
  },
  props:{
    name:String,
    list:Array,
  },
  created(){
    this.bus.$on('replyBrother',msg=>{
      this.getReply = msg;
    })
    console.log(this.props)
  },
  methods:{
    add(){
      this.count += 1;
      this.bus.$emit("toBrother",this.count)
    },
    toParent(item){
      this.$emit('toChild',item);
    },
    toBrother(){
      this.bus.$emit("toBrother",this.brother)
    }
  }
}
</script>