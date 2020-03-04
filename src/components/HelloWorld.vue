<template>
    <div v-bind:class="{memberBar: !showHW}">
        <h2>{{wwwc}}</h2>
        <ol>
            <li v-for="(user, index) in users" @click="chooseRole(index)" :key='index' v-bind:class="[{empty: !user.state}, {'Y': index == youIndex}]">{{user.code}}<span>{{user.id}}</span></li>
        </ol>
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
            youIndex: '-1',
            youCode: '',
            cards: [],
            panId: '',
            deskId: '',
            socketID: '',
            wwwc: '',
            showHW: true
        }
    },
    sockets:{  //在此接收由服务器发送过来的数据
        connect: function() {
            window.console.log('HW 连接成功');
            this.youIndex == '-1'
        },
        disconnect: function() {
            window.console.log('HW socket 断开了')
        },
        reconnect: function() {
            window.console.log('HW 重新联系')
        },
        DCutMsg2: function(msg) {
            window.console.log(msg)
            this.wwwc = msg
        },
        roleMSG: function(msg) {
            this.users = msg;
        },
        DStartMsg: function (msg) {
            this.showHW = msg[0]
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
        },
        YesiamMSG2: function (params) {
            window.console.log(params);
        }
        // DStartMsg: function(msg) {
        //     this.cards = msg[0]
        //     this.panId = msg[1]
        //     this.deskId = msg[2]
        // } //DStartMsg end
    },
    methods:{
        // 挑选角色
        chooseRole(mIndex) {
            let userChNum = this.users.filter(item => item.state == true).length;
            if (userChNum < 4) {
                if (this.youIndex == '-1') {
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
                            window.console.log(mIndex, this.youIndex)
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
