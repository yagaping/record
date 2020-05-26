<template>
  <div class="my">
      <router-link to="/">Home</router-link> |
      <router-link to="/my/10/like">like</router-link> |
      <router-link to="/my/8">play</router-link>
      <router-view/>
      <p>{{$store.state.count}}</p>
  </div>
</template>

<script>

import { mapActions } from 'vuex'
export default {
  name: 'My',
  computed:{

  },
  created(){
    this.increment();
    console.log(this.$store.state.count)
  },
  mounted(){
    
  },
  methods:{
       ...mapActions([
         'increment',
         'incrementBy',
       ]),
       ...mapActions({
         add:'increment'
       })
  }
}
</script>
