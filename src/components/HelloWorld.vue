<template>
 <div class="test3">
  <div class="msg" ref="box">
   <div v-for="item in list" :key="msg-item" :class="[item.type,'msg-item']">
    <p>
     {{item.content}}
    </p>
   </div>
  </div>
  <div class="input-group">
   <input type="text" v-model="contentText">
   <button @click="sendText">发送</button>
  </div>
 </div>
</template>

<script>
 export default {
  name: "index3",
  data() {
   return {
    list: [],//聊天记录的数组
    contentText: "",//input输入的值
   }
  },
  methods: {
   //发送聊天信息
    sendText() {
    let that = this;
    this.list = [...this.list, {type: "mine", content: this.contentText}];//通过type字段进行区分是自己（mine）发的还是系统（robot）返回的
    this.backText(function () {
     that.contentText = "";//加回调在得到返回数据的时候清除输入框的内容
    });
   },
   backText(callback) {
    let that = this;
    if (window.WebSocket) {
     let ws = new WebSocket("ws://localhost:8001/");
     ws.onopen = function (e) {
      window.console.log("链接服务器成功");
      window.console.log("that.contentText is" + e.data, that.contentText);
      ws.send(that.contentText);
      callback();
     };
     ws.onclose = function (e) {
      window.console.log("服务器关闭" + e.data)
     };
     ws.onerror = function () {
      window.console.log("服务器出错")
     };
     ws.onmessage = function (e) {
      that.list = [...that.list, {type: "robot", content: e.data}]
     }
    }
   }
  },
  watch: {
   //监听list,当有修改的时候进行div的屏幕滚动，确保能看到最新的聊天
   list: function () {
    let that = this;
    setTimeout(() => {
     that.$refs.box.scrollTop = that.$refs.box.scrollHeight;
    }, 0);
    //加setTimeout的原因：由于vue采用虚拟dom，我每次生成新的消息时获取到的div的scrollHeight的值是生成新消息之前的值，所以造成每次都是最新的那条消息被隐藏掉了
   }
  },
  mounted() {
  }
 };


</script>

<style scoped lang="scss">
 .test3 {
  text-align: center;
  height: 500px;
  width: 500px;
  border: 5px solid #ddd;
 }

 .msg {
  width: 400px;
  height: 400px;
  overflow: auto;
  padding-top: 5px;
  border: 1px solid red;
  display: inline-block;
  margin-bottom: 6px;

  .msg-item {
   position: relative;
   overflow: hidden;
   p {
    display: inline-block;
    border-radius: 40px;
    background: #3C3D5A;
    color: white;
    padding: 2px 12px;
    margin: 0 0 2px 0;
    max-width: 70%;
    text-align: left;
    box-sizing: border-box;
   }

   &.mine {
    p {
     float: right;
     background: aquamarine;
     color: white;
    }
   }
  }
 }
</style>
