<template>
<div>
    <div v-bind:class="['DCards', {DCold: !option.DC}]">
        <div v-for="(card, index) in cFilter(cards, 'DC')" @click="DCut(index)" :key='"DC-" + index'></div>
    </div>
    <div class="WCards" v-show="cFilter(cards, 'WC').length > 0">
      <div v-for="(card, index) in sortByKey(cFilter(cards, 'WC'), 'sort')" v-bind:class="[card.des, 'CCC' + card.sort, {open: card.open}]" :key='"WC" + index' v-bind:title='card.title'>{{card.name}}</div>
      <div v-for="(card, index) in cFilter(cards, 'NC' + users[1].code)" v-bind:class="[card.des, 'nc', {open: card.open}]" :key='"NC" + index'>{{card.name}}</div>
    </div>
    <div class="UPcards">
      <div v-for="(card, index) in cFilter(cards, users[0].code)" :key='users[0].code + index'>{{users[0].code}}</div>
    </div>
    <div class="UNcards">
      <div v-for="(card, index) in cFilter(cards, users[2].code)" :key='users[2].code + index'>{{users[2].code}}</div>
    </div>
    <div v-bind:class="['UMcards', {des: !users[1].playing}]">
      <div v-for="(card, index) in cFilter(cards, users[1].code)" @click="Diao(card._id)" v-bind:class="[card.des, {open: !card.open}, {active: users[1].playing}]" :key='users[1].code + index' v-bind:title='card.title'>{{card.name}}</div>
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
            //初始数据
            cards: [],                              //保存由 DStartMsg OCards 里传来的值
            option: {Modal: false, DC: false},      //按钮操作相关的开关
            deskID: '',//保存由 DStartMsg 里传来的值
            panID: '',
            myCode: ''
        }
    },
    props: [
        'users',
        'mycode'
    ],
    sockets: {  //在此接收由服务器发送过来的数据
        connect: function() {
            window.console.log('CS 连接成功');
        },
        DStartMsg: function(msg) {
            this.showHW = msg[0]
            this.deskID = msg[1]
            window.console.log('初始条件')
            window.console.log(msg[2])
            this.myCode = this.users[1].code
        }, //DStartMsg end
        sendCards: function(msg) {
            this.cards = msg
        }, //sendCards end
        DCutMsg: function(msg) {
            this.panID = msg[0]
            this.deskID = msg[3]
            this.option.DC = !this.option.DC
        }, //DCutMsg
        dealCardMsg: function(msg) {
            this.cards = msg
        },
        DiaoMsg: function(msg) {
            this.cards = msg[0]
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
            if (this.users[1].playing) {
                window.console.log('切牌了马在跑')
                let cardsOld = this.cards.splice(0, cardIndex);
                this.cards = this.cards.concat(cardsOld);
                this.$socket.emit('DCut', this.deskID, this.users, this.cards);
            } else {
                window.console.log('切不到糕')
                return false
            }
        }, //DCut end
        cFilter: function (Acards, X) {
            return Acards.filter((item) => {
                return item.own == X
            })
        },
        //出牌
        Diao(id) {
            if (this.users[1].playing) {
                window.console.log('点了马在跑')
                let NCIndex = this.cards.findIndex(item => item._id == id)
                let myCode = this.cards[NCIndex].own
                this.cards[NCIndex].own = 'NC' + myCode
                this.cards[NCIndex].open = true
                this.users[1].playing = false
                this.users[2].playing = true
                this.$socket.emit('Diao', this.cards, myCode, this.panID, this.users);
            } else {
                window.console.log('点了但没用')
                return false
            }
        },
        showMycards() {
            this.option.Modal = !this.option.Modal
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
