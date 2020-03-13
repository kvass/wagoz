<template>
<div>
    <h1 @click="createPan">{{deskID}}</h1>
    <div class="DCards">
        <div v-for="(card, index) in cFilter(cards, 'DC')" @click="DCut(index)" :key='"DC-" + index'></div>
    </div>
    <div class="WCards" v-show="cFilter(cards, 'WC').length > 0">
      <div v-for="(card, index) in sortByKey(cFilter(cards, 'WC'), 'sort')" v-bind:class="[card.des, 'CCC' + card.sort, {open: card.open}]" :key='"WC" + index' v-bind:title='card.title'>{{card.name}}</div>
      <div v-for="(card, index) in cFilter(cards, 'NC' + users[1].code)" v-bind:class="[card.des, 'nc', {open: card.open}]" :key='"NC" + index'>{{card.name}}</div>
    </div>
    <div class="UPcards">
      <div v-for="(card, index) in cFilter(cards, users[0].code)" :key='users[0].code + index'></div>
    </div>
    <div class="UNcards">
      <div v-for="(card, index) in cFilter(cards, users[2].code)" :key='"AC" + index'></div>
    </div>
    <div class="UMcards">
      <div v-for="(card, index) in cFilter(cards, users[1].code)" @click="Diao(card._id)" v-bind:class="[card.des, {open: !card.open}]" :key='users[1].code + index' v-bind:title='card.title'>{{card.name}}</div>
    </div>
    <div v-bind:class="['MYcards', {XModal: option.Modal}]" @click="showMycards">
      <div v-for="(card, index) in sortByKey(cFilter(cards, 'MC' + users[1].code), 'sort')" v-bind:class="[card.des, {open: card.open}]" :key='"MC" + index' v-bind:title='card.title'>{{card.name}}</div>
    </div>
 </div>
</template>

<script>

export default {
    data() {
        return {
            cards: [],                    //保存由 createDeskMsg OCards 里传来的值
            cardsOld: [],                 //总牌
            option: {A: true,B: true,Modal: false},          //按钮操作相关的开关
            DiaoQ: {chu: '', diao: '', fang: ''},     //钓红点-出-钓-计时器
            id: '',
            users: [
                {code: 'Z', state: false, sid: '', name: '寨', sort: ''},
                {code: 'L', state: false, sid: '', name: '陆', sort: ''},
                {code: 'F', state: false, sid: '', name: '峰', sort: ''}
            ],//保存由 createDeskMsg 里传来的值
            deskID: '',//保存由 createDeskMsg 里传来的值
            startGo: true, //抢头家的按钮 由HW最后传来的 否 而显示出来
            panID: '',
            isMe: false
        }
    },
    sockets: {  //在此接收由服务器发送过来的数据
        connect: function() {
            window.console.log('CS 连接成功');
        },
        DCutMsg: function(msg) {
            this.panID = msg[0]
            this.deskID = msg[3]
        }, //DCutMsg
        DStartMsg: function(msg) {
            this.showHW = msg[0]
            this.deskID = msg[1]
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
        }, //DStartMsg end
        sendCards: function(msg) {
            this.cards = msg
        }, //sendCards end
        createPanMsg: function(msg) {
            this.cards = msg[1]
        }, //endcreatePanMsg end
        dealCardMsg: function(msg) {
            this.cards = msg
        },
        DiaoMsg: function(msg) {
            this.cards = msg
        }
    },
    methods: {
        // 普通数据的排序方法
        sortNumber(a, b) {
            return a - b

        },
        //数组对象方法排序:
        sortByKey(array, key) {
            return array.sort(function (a, b) {
                var x = a[key];
                var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        },
        DCut(cardIndex) {
            // window.console.log('点了：' + cardIndex)
            // this.$socket.emit('DCut', deskID);
            // this.cards[cardIndex].open = true;
            //切牌
            let cardsOld = this.cards.splice(0, cardIndex);
            this.cards = this.cards.concat(cardsOld);
            this.$socket.emit('DCut', this.deskID, this.users, this.cards);
        }, //DCut end
        createPan() {
            this.$socket.emit('createPan', this.deskID, this.usersID);
        }, //DCut end
        cFilter: function (Acards, X) {
            return Acards.filter((item) => {
                return item.own == X
            })
        },
        //出牌
        Diao(id) {
            let NCIndex = this.cards.findIndex(item => item._id == id)
            let myCode = this.cards[NCIndex].own
            this.cards[NCIndex].own = 'NC' + myCode
            this.cards[NCIndex].open = true
            this.$socket.emit('Diao', this.cards, myCode, this.panID);
            // if (this.isMe) {
                // 屏蔽
            // } else {
            //     return false
            // }
        },
        showMycards() {
            this.option.Modal = !this.option.Modal
            window.console.log('点击了: '+ '字如其人');
            this.$emit('showModal', '字如其人')
        }
    },
    mounted() {
        // this.$socket.emit('connect', 1)
        // this.$options.methods.createPan()
    }
}
</script>

<style lang="scss" scoped>
.relative {
  position: relative;
  overflow: auto;
}
.lArea,
.rArea,
.bArea,
.brArea {
    position: fixed;
    top: 50px;
    left: 50px;
    width: 220px;
    li {
        margin-left: -50px;
    }
}
.rArea {
    left: auto;
    right: 0px;
    justify-content: flex-end;
}
.bArea {
    top: auto;
    bottom: 50px;
    left: 50%;
    width: 800px;
    margin-left: -400px;
    justify-content: center;
    li {
        margin: 15px;
    }
}
.brArea {
    top: auto;
    left: auto;
    bottom: 50px;
    right: 0px;
    width: 220px;
    justify-content: flex-end;
    li {
        margin-left: -50px;
    }
}
.openCard {
    position: relative;
    position: fixed;
    top: 400px;
    width: 500px!important;
    margin-left: -250px;
    left: 50%;
    .nc {
        position: absolute;
        top: 15px;
        right: -100px;
    }
}
.oringeCard {
    position: fixed;
    top: 50px;
    justify-content: center;
    width: 100%;
}
</style>
