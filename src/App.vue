<template>
  <div id="app">
      <!-- <component :is='currentCom' @toCardCom='changeCom' /> -->
       <!-- :getDeskID='{deskID,users}' -->
      <HelloWorld />
      <Card v-show="!showHW" @showModal='showModal' />
      <Modal v-show='option.modal' />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import       Card from './components/Card.vue'
import      Modal from './components/modal.vue'


export default {
    name: 'app',
    components: {
        HelloWorld,
        Card,
        Modal
    },
    data() {
        return {
            currentCom: 'HelloWorld',
             showHW: true,
             deskID: '',
              users: '',
            option: {modal: false}
        }
    },
    sockets:{  //在此接收由服务器发送过来的数据
        connect: function() {
            window.console.log('AS 连接成功');
        },
        DStartMsg: function(msg) {
            //返回：状态‘否’、deskID、pan的参与者
            this.showHW = msg[0]
            // this.modelOp = msg[0]
            // this.deskID = msg[1]
            // this.users = msg[2]
        } //createDeskMsg end
    },
    methods: {
        showModal(val) {
            window.console.log(val)
            this.option.modal = !this.option.modal
        },
        hideModal(val) {
            this.option.modal = val
        }
        // changeCom(vul) {
        //     // this.currentCom = vul
        // }
    },//methods end
    computed: {

    },
    created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
    }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
