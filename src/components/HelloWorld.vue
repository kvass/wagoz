<template>
    <div>
        <ol>
            <li v-for="(mem, index) in users" @click="chooseRole(index)" :key='index' v-bind:class="[{empty: !mem.state}, {'Y': index == youIndex}]">{{mem.name}}<span>{{mem.id}}</span></li>
        </ol>
        <h2>{{deskId}}</h2>
        <button @click="startCard" :disabled="!startGo" v-bind:class="['btnStart', {'active': startGo}]">开始</button>
        <ul class="oringeCard">
            <li v-for="(card, index) in cards" @click="deskCard(card.num,index)" v-bind:class="[card.des, {open: !card.open}]" :key='index' v-bind:title='card._id'>{{card.name}}</li>
        </ul>
    </div>
</template>
<script>
export default{
    data: () => {
        return {
            msg:"aaaa",
            backdata:'',
            users: [
                {code: 'Z', state: false, id: '', name: '寨'},
                {code: 'L', state: false, id: '', name: '陆'},
                {code: 'F', state: false, id: '', name: '峰'}
            ],
            youIndex: '-1',
            cards: [],
            deskId: '',
            startGo: true
        }
    },
    sockets:{  //在此接收又服务器发送过来的数据  ps：注意此处的方法名要与服务器的发送的事件保持一致才能接收到
        connect: function() {            //与ws:127.0.0.1:8000连接后回调
            // window.console.log('vue socket 连接成功');
        },
        TT: function(value) {
            // window.console.log(value);//监听login(后端向前端emit  login的回调)
            this.backdata=value;
        },
        roleMSG: function(msg) {
            this.users = msg;
        },
        YesiamMSG2: function(msg) {
            // this.youIndex = msg;
            window.console.log('session里的:' + msg)
        }
    },
    methods:{
        // 打乱
        shuffle(arr) {
        var i, j, temp;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
        },
        //洗牌
        startCard() {
            this.cards = this.$options.methods.shuffle(this.cards);
            this.$forceUpdate();
            this.$http.post('http://localhost:3000/desk', this.cards).then(res => {
                // window.console.log(res.data)
                this.deskId = res.data[0]._id
            });
        },
        Login(){
            this.$socket.emit('login', this.msg);
        },
        // 挑选角色
        chooseRole(mIndex) {
            if (this.youIndex == '-1') {
                if (!this.users[mIndex].state) {
                    this.users[mIndex].state = true
                    this.youIndex = mIndex
                    this.$socket.emit('chooseRole', this.users, mIndex)
                }
            } else {
                if (this.youIndex != mIndex) {
                    if (!this.users[mIndex].state) {
                        this.users[this.youIndex].state = false
                        this.users[mIndex].state = true
                        this.youIndex = mIndex
                        this.$socket.emit('chooseRole', this.users, mIndex)
                    }
                }
            }
        }
    },
    mounted() {
        this.$http('http://localhost:3000/goods').then((res) => this.cards = res.data)
    }
  }
</script>

<style scoped lang="scss">
.btnStart {
    display: block;
    margin: 50px auto;
    width: 220px;
    height: 80px;
    line-height: 80px;
    outline: 0;
    border-radius: 8px;
    border: 2px solid #999;
    background: #ccc;
    color: #666;
    font-size: 25px;
    text-align: center;
    cursor: pointer;
    &.active {
        border: 0;
        background: #6291CD;
        color: #fff;
        &:hover {
            box-shadow: 0 0 5px rgba($color: #6291cd, $alpha: .5)
        }
    }
}
    ol {
        display: flex;
        margin: 100px auto;
        width: 500px;
        justify-content: center;
        li {
            margin: 15px;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 2px solid #EDAC02;
            background: #EDAC02;
            text-align: center;
            font-size: 60px;
            color: #fff;
            line-height: 120px;
            cursor: pointer;
            box-shadow: 0 0 5px rgba($color: #EDAC02, $alpha: .7);
            &:nth-child(2) {
                border-color: #EA9288;
                background: #EA9288;
                box-shadow: 0 0 5px rgba($color: #EA9288, $alpha: .7)
            }
            &:nth-child(3) {
                border-color: #98D1E7;
                background: #98D1E7;
                box-shadow: 0 0 5px rgba($color: #6291CD, $alpha: .7)
            }
            &.empty {
                border-color: #dcdcdc!important;
                background: #f3f4f5;
                color: #999;
                box-shadow: none;
            }
            &.Y {
                border-color: red!important;
            }
            span {display: block;margin-top: -35px;font-size: 6px;line-height: 20px;color: #000;}
        }
    }
</style>
