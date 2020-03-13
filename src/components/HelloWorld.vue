<template>
    <div>
        <div v-bind:class="['deskBG', {angState: !option.showHW}]" v-show="option.userbar">
            <h2></h2>
            <div v-bind:class="'usersBar Modal'">
                <div v-for="(user, index) in users" @click="chooseRole(index)" :key='index' v-bind:class="[user.code, {empty: !user.state}, {'Y': index == youIndex}]"><span>{{user.id}}</span></div>
            </div>
        </div>
        <div v-show="option.end" class='pageEnd'>
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
            <div class="btnBar"><div></div></div>
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
            users: [
                {code: 'Z', state: false, sid: '', name: '寨', sort: ''},
                {code: 'L', state: false, sid: '', name: '陆', sort: ''},
                {code: 'F', state: false, sid: '', name: '峰', sort: ''}
            ],
            youIndex: -1,
            youCode: '',
            cards: [],
            panId: '',
            deskId: '',
            socketID: '',
            score: '',
            option: {showHW: true, end: false, userbar: true}
        }
    },
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
        DCutMsg2: function(msg) {
            this.wwwc = msg
        },
        roleMSG: function(msg) {
            this.users = msg;
        },
        DStartMsg: function (msg) {
            //返回：状态‘否’、deskID、pan的参与者
            this.option.showHW = msg[0]
            let nowUsers = msg[2]
            let myIndex = nowUsers.findIndex(item => item.code == this.youCode);
            if (myIndex == 0) {
                let listOld = nowUsers.pop();
                nowUsers.unshift(listOld);
            } else if (myIndex == 2) {
                let listOld = nowUsers.shift();
                nowUsers.push(listOld);
            }
            this.users = nowUsers
            this.youIndex = 1
        },
        endMsg: function (msg) {
            this.score = msg
            this.option.end = !this.option.end
            this.option.userbar = !this.option.userbar
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
                        this.youCode = this.users[mIndex].code
                        this.$socket.emit('chooseRole', this.users, mIndex)
                    }
                } else {
                    if (this.youIndex != mIndex) {
                        if (!this.users[mIndex].state) {
                            this.users[this.youIndex].state = false
                            this.users[mIndex].state = true
                            this.$socket.emit('chooseRole', this.users, mIndex, this.youIndex)
                            // window.console.log(mIndex, this.youIndex)
                            this.youIndex = mIndex
                            this.youCode = this.users[mIndex].code
                        }
                    }
                }
            }
        }, //chooseRole end
        //创建desk & 开始
        createDesk() {
            this.$socket.emit('createDesk', this.users);
            // this.$emit('toCardCom', 'Card');
        } //DStart end
    },
    mounted() {
        // this.$http('http://localhost:3000/goods').then((res) => this.cards = res.data)
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
        height: 100px;
    // @include px(border-width, 25);
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
.memberBar {
    ol {
        margin: 0;
        li {
            position: absolute;
            position: fixed;
            width: 50px;
            height: 50px;
            font-size: 32px;
            line-height: 50px;
            z-index: 9999;
            &:nth-child(1) {
                left: 20px;
                top: 20px;
            }
            &:nth-child(2) {
                left: 20px;
                bottom: 20px;
            }
            &:nth-child(3) {
                right: 20px;
                top: 20px;
            }
        }
    }
}
</style>
