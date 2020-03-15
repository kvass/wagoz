<template>
    <div>
        <div v-bind:class="['deskBG', {play: options.play}]" v-show="options.userbar">
            <h2></h2>
            <div v-bind:class="'usersBar'">
                <div v-for="(user, index) in users" @click="chooseRole(index)" :key='index' v-bind:class="[user.code, {empty: !user.state}, {active: user.playing}, {'Y': index == youIndex}]"><span>{{user.id}}</span></div>
            </div>
            <div class='timeLine'></div>
        </div>
        <div v-show="options.end" class='pageEnd'>
            <h2></h2>
            <div class='resultList'>
                <div v-bind:class="['user', {lost: score[users[0].code] < 0}]">
                    <div v-bind:class="['avatar', users[0].code]"></div>
                    <div class="name">{{users[0].name}}</div>
                    <div class="score">{{score[users[0].code]}}</div>
                </div>
                <div v-bind:class="['user', 'me', {lost: score[users[1].code] < 0}]">
                    <div v-bind:class="['avatar', users[1].code]"></div>
                    <div class="name">{{users[1].name}}</div>
                    <div class="score">{{score[users[1].code]}}</div>
                </div>
                <div v-bind:class="['user', {lost: score[users[2].code] < 0}]">
                    <div v-bind:class="['avatar', users[2].code]"></div>
                    <div class="name">{{users[2].name}}</div>
                    <div class="score">{{score[users[2].code]}}</div>
                </div>
            </div>
            <div class="btnBar"><div @click="againPlay"></div></div>
            <div class="exit"></div>
        </div>
    </div>
</template>
<script>
export default{
    data: () => {
        return {
            msg:"aaaa",
            backdata:'',
            youIndex: -1,
            youCode: '',
            cards: [],
            panId: '',
            deskId: '',
            socketID: '',
            score: '',
            options: {showHW: true, end: false, userbar: true, play: false}
        }
    },
    props: [
        'users',
        'mycode'
    ],
    sockets:{  //在此接收由服务器发送过来的数据
        connect: function() {
            window.console.log('HW 连接成功');
            // this.$socket.emit('reload', this.users)
            window.console.log('HW 又跑了一次连接成功');
        },
        disconnect: function() {
            window.console.log('HW socket 断开了')
        },
        reconnect: function() {
            window.console.log('HW 重新连接')
        },
        reloadMSG: function (msg) {
            this.users = msg
            this.youIndex = -1
        },
        DStartMsg: function () {
            this.options.play = !this.options.play
        },
        endMsg: function (msg) {
            this.score = msg
            this.options.end = !this.options.end
            this.options.userbar = !this.options.userbar
        },
        againPMsg: function (msg) {
            this.options.end = !this.options.end
            this.options.showHW = !msg
            this.options.userbar = !this.options.userbar
        }
    },
    methods:{
        // 挑选角色
        chooseRole(mIndex) {
            let userChNum = this.users.filter(item => item.state == true).length;
            if (userChNum < 4) {
                if (this.youIndex == -1) {
                    if (!this.users[mIndex].state) {
                        this.users[mIndex].state = true
                        this.youIndex = mIndex
                        let code = this.users[mIndex].code
                        this.$socket.emit('chooseRole', this.users, mIndex)
                        this.$emit('mychoose', code)
                    }
                } else {
                    if (this.youIndex != mIndex) {
                        if (!this.users[mIndex].state) {
                            this.users[this.youIndex].state = false
                            this.users[mIndex].state = true
                            this.$socket.emit('chooseRole', this.users, mIndex, this.youIndex)
                            // window.console.log(mIndex, this.youIndex)
                            let code = this.users[mIndex].code
                            this.youIndex = mIndex
                            this.$emit('mychoose', code)
                        }
                    }
                }
            }
        }, //chooseRole end
        //创建desk & 开始
        createDesk() {
            this.$socket.emit('createDesk', this.users);
            // this.$emit('toCardCom', 'Card');
        }, //DStart end
        againPlay() {
            this.$socket.emit('againPlay');

        }, //againPlay end
        exit() {
            this.$socket.emit('exit');
        }
    },
    mounted() {
        // this.$http('http://localhost:3000/goods').then((res) => this.cards = res.data)
    }
  }
</script>

<style scoped lang="scss">
</style>
