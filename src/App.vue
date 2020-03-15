<template>
  <div id="app">
      <!-- <component :is='currentCom' @toCardCom='changeCom' /> -->
       <!-- :getDeskID='{deskID,users}' -->
      <HelloWorld :users='users' :mycode='myCode' @mychoose='mychooseCode' />
      <Card v-show="options.CShow" @showModal='showModal' :users='changeU(users)' :mycode='myCode' />
      <Modal v-show='options.modal' />
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
            users: [
                {code: 'Z', state: false, sid: '', name: '寨', playing: false, sort: ''},
                {code: 'L', state: false, sid: '', name: '陆', playing: false, sort: ''},
                {code: 'F', state: false, sid: '', name: '峰', playing: false, sort: ''}
            ],
            myCode: '',
            options: {modal: false, CShow: false, Start: false}
        }
    },
    sockets:{  //在此接收由服务器发送过来的数据
        connect: function() {
            window.console.log('AS 连接成功');
        },
        roleMSG: function(msg) {
            this.users = msg;
        },
        DStartMsg: function (msg) {
            //返回：状态‘否’、deskID、pan的参与者
            this.options.CShow = true
            this.options.Start = true
            this.users = msg[2]
            // this.youIndex = 1
        }, // DStartMsg end
        DCutMsg: function(msg) {
            this.users = msg[2]
        }, //DCutMsg
        DiaoMsg: function(msg) {
            this.users = msg[1]
        },//DiaoMsg
        endMsg: function () {
            this.options.CShow = !this.options.CShow
        },
        againPMsg: function () {
            this.options.CShow = !this.options.CShow
        }
    },
    methods: {
        showModal(val) {
            window.console.log(val)
            this.options.modal = !this.options.modal
        },
        hideModal(val) {
            this.options.modal = val
        },
        mychooseCode(val) {
            this.myCode = val
        },
        changeU(arr) {
            if (this.options.Start) {
                let myIndex = arr.findIndex(item => item.code == this.myCode);
                if (myIndex == 0) {
                    let listOld = arr.pop();
                    arr.unshift(listOld);
                } else if (myIndex == 2) {
                    let listOld = arr.shift();
                    arr.push(listOld);
                }
                return arr
            } else {
                return arr
            }
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
