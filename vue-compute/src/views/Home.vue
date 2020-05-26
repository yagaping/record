<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <HelloWorld msg="Welcome to Your Vue 实验室"/>
    <div class="text"><span v-html="html"></span></div>
    <div>{{html}}</div>
    <p @click="clickMe($event)">click me</p>
    <div id="example">
      <p>Original message: "{{ message }}"</p>
      <p>Computed reversed message: "{{ reversedMessage() }}"</p>
    </div>
    <div :style="{color:'red'}">{{now}}</div>
    <div id="demo">{{ fullName }}（{{firstName +' '+ lastName}}）</div>
    <input v-model="question" placeholder="请输入" />
    <p>{{answer}}</p>
  </div>
</template>
<style scoped>
  .text{
    color:green;
  }
</style>
<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import _ from 'lodash'
export default {
  name: 'Home',
  data(){
    return {
        name:'yagaping123',
        message:"123456",
        firstName: 'Foo',
        lastName: 'Bar',
        now:'时间',
        question:'',
        answer:"I cannot give you an answer until you ask a question!",
        html:"<span>123456</span>"
    }
  },
  components: {
    HelloWorld
  },
  created(){
    this.onLoad();
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500);
    this.now = Date.now();
    console.log(this.address)
  },
  computed:{
    address(){
      return '江西吉安青原区'
    },
    fullName:{
       // getter
      get: function () {
        return this.firstName + ' ' + this.lastName
      },
      // setter
      set: function (newValue) {
        var names = newValue.split(' ')
        this.firstName = names[0]
        this.lastName = names[names.length - 1]
      }
    }
  },
  watch:{
      now(){
        console.log('now',this.now)
        this.now = Date.now()
      },
      fullName(newVal,oldVal){
        console.log('fullName',newVal,oldVal)
      },
      question(newQuestion, oldQuestion){
        console.log(newQuestion,oldQuestion);
        this.answer = 'Waiting for you to stop typing...'
        this.debouncedGetAnswer()
      }
  },
  methods:{
    onLoad(){
      this.$api.article.articleList({
        cn:8588,
        id:27251
      }).then(res => {
        console.log('success',res)
          // 获取数据成功后的其他操作
      }).catch( err => {
        console.log('error',err)
      })
    },
    clickMe(event){
      console.log(event.target)
      this.fullName = 'jiutian 忠己';
    },
    reversedMessage(){
      return this.message.split('').reverse().join('')
    },
     getAnswer() {
       console.log(5566)
      if (this.question.indexOf('?') === -1) {
        this.answer = 'Questions usually contain a question mark. ;-)'
        return
      }
      this.answer = 'Thinking...'
      var vm = this
      this.$api.article.search('https://yesno.wtf/api')
        .then(function (response) {
          vm.answer = _.capitalize(response.data.answer)
        })
        .catch(function (error) {
          vm.answer = 'Error! Could not reach the API. ' + error
        })
    }
  }
}
</script>
