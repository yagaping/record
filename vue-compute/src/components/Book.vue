<template>
  <div class="book">
    <h3>子组件book</h3>
    <input type="text" v-model="reply" @input="bus.$emit('replyBrother',reply)"/>
    <van-button type="primary" @click="$emit('toParent',reply)">发送信息</van-button>
    <p @click="toBrother">来自user件传来信息：{{get}}</p>
    <slot :user="user" name="name1"></slot>
    <slot :user="user" name="name2"></slot>
    <slot :user="user" name="default"></slot>
    
  </div>
</template>
<style scoped>
  .book{
    border:1px solid #ccc;
  }
</style>
<script>
import Vue from 'vue';
import { Button } from 'vant';
Vue.use(Button);
export default {
  name:'Book',
  data(){
    return { 
      count:0,
      get:'',
      reply:'',
      user:{
        firstName:'郭',
        lastName:'平',
        fullName:'郭平'
      }
    }
  },
  props:{
    name:String,
    list:Array,
  },
  beforeCreate(){
    
  },
  created(){
   this.bus.$on("toBrother",msg=>{
      this.get = msg
    })
  },
  methods:{
    toBrother(){
      this.bus.$emit('replyBrother',this.reply)
    }
  }
}
</script>