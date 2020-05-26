<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{childBook}}</p>
    <User />
    <Book @toParent="getChild" >
      <template #name1="childProps">
        <p>{{ childProps.user.firstName }}</p>
      </template>
      <template #name2="childProps">
        <p>{{ childProps.user.lastName }}</p>
      </template>
      <template #default="{user:aa}">
        <p>{{ aa.fullName }}</p>
      </template>
    </Book>
    <button @click="test">改变slotProps</button>
    <input type="text" v-focus>
  </div>
</template>
<script>
import User from '@/components/User.vue'
import Book from '@/components/Book.vue'
import { Button } from 'vant';
export default {
  data(){
    return {
      name:'九天',
      list:[5,6,7],
      childBook:'555',
      slotProps:{
        a:1,
        b:2
      }
    }
  },
  components:{
    User,
    Book
  },
  beforeCreate(){
    console.log('beforeCreate',this.name)
  },
  created(){
    console.log('created',this.$el)
    this.submit();
  },
  beforeMount(){
    console.log('beforeMount',this.$el)
  },
  mounted(){
    console.log('mounted',this.$el)
  },
  beforeDestroy(){
    console.log('beforeDestroy',this.$el)
  },
  destroyed(){
    console.log('destroyed',this.$el)
  },
  methods:{
      test(){
        this.slotProps.a = 88;
        console.log(this.slotProps)
      },
      submit(){
        this.$store.commit('increment')
        console.log(this.$store.state.count)
      },
      getChild( text ){
        this.childBook = text;
      },
      getBookChild( text ){
        console.log('toBookChild',text)
      },
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus()
      },
      bind(el){
        el.value = '自动获得焦点'
      },
      update(newVal,oldVal ){
          console.log(newVal,oldVal);
      }
    }
  }
}
</script>