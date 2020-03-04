<template>
<div>
    <h1 @click="createPan">{{deskID}}</h1>
    <h2>{{wwwc}}</h2>
    <ul class="oringeCard">
        <li v-for="(card, index) in cFilter(cards, 'DC')" @click="DCut(index)" :key='index'></li>
    </ul>
  <section class="you">
    <ul class="lArea">
      <li v-for="(card, index) in cFilter(cards, users[0].code)" :key='index'></li>
    </ul>
    <ul class="bArea">
      <li v-for="(card, index) in cFilter(cards, users[1].code)" @click="Diao(card._id)" v-bind:class="[card.des, {open: !card.open}]" :key='index' v-bind:title='card.title'>{{card.name}}</li>
    </ul>
    <ul class="rArea">
      <li v-for="(card, index) in cFilter(cards, users[2].code)" :key='index'></li>
    </ul>
    <ul class="openCard">
      <li v-for="(card, index) in cFilter(cards, 'WC')" v-bind:class="[card.des, {open: card.open}]" :key='index' v-bind:title='card.title'>{{card.name}}</li>
      <li v-for="(card, index) in cFilter(cards, 'NC' + users[1].code)" v-bind:class="[card.des, 'nc', {open: card.open}]" :key='index'>{{card.name}}</li>
    </ul>
    <ul class="brArea">
      <li v-for="(card, index) in cFilter(cards, 'MC' + users[1].code)" v-bind:class="[card.des, {open: card.open}]" :key='index' v-bind:title='card.title'>{{card.name}}</li>
    </ul>
  </section>
 </div>
</template>

<script>

export default {
    data() {
        return {
            cards: [
                {code: 'Z', state: false, sid: '', name: '寨', sort: ''},
                {code: 'L', state: false, sid: '', name: '陆', sort: ''},
                {code: 'F', state: false, sid: '', name: '峰', sort: ''}
            ],                    //保存由 createDeskMsg OCards 里传来的值
            cardsOld: [],                 //总牌
            MMcards: [],                  //玩家N1的牌
            MMQcards: [],                 //玩家N1钓的牌
            BBcards: [],                  //玩家N2的牌
            BBQcards: [],                 //玩家N2钓的牌
            UScards: [],                  //玩家N3的牌
            USQcards: [],                 //玩家N3钓的牌
            DDcards: [],                  //玩家N4的牌
            DDQcards: [],                 //玩家N4钓的牌
            OPENcards: [],                //桌面上翻起的牌
            GPcards: [],                  //桌面上剩下的牌
            FPJSQ: null,                  //发牌计时器
            option: {A: 'true',B: 'true'},          //按钮操作相关的开关
            DiaoQ: {chu: '', diao: '', fang: ''},     //钓红点-出-钓-计时器
            id: '',
            users: '',//保存由 createDeskMsg 里传来的值
            deskID: '',//保存由 createDeskMsg 里传来的值
            startGo: true, //抢头家的按钮 由HW最后传来的 否 而显示出来
            wwwc: '',
            isMe: false
        }
    },
    sockets: {  //在此接收由服务器发送过来的数据
        connect: function() {
            window.console.log('CS 连接成功');
        },
        DCutMsg: function(msg) {
            this.deskID = msg[3]
        }, //DCutMsg
        DCutMsg2: function(msg) {
            window.console.log(msg)
            this.wwwc = msg
        },
        DCutMsg3: function(msg) {
            window.console.log(msg)
            // this.wwwc = msg
        },
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
            window.console.log('出牌了')
        },
        DiaoMsg2: function(msg) {
            this.cards = msg
            window.console.log('找到翻牌了')
        }
    },
    methods: {
        DCut(cardIndex) {
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
            this.$socket.emit('Diao', this.cards);
            window.console.log('点击了: '+ NCIndex);
            window.console.log(this.cards);

            //找出所有翻出来的牌 WC
            let WCards = this.cards.filter(item => item.own == 'WC')
            let that = this
            const DiaoChu = function() {

                let NCard = that.cards.find(item => item.own == 'NC' + myCode)
                let num = NCard.num
                let DiaoNum
                if (num < 10) {
                    DiaoNum = 10 - num;
                } else if (num == 20) {
                    DiaoNum = 21;
                } else if (num == 21) {
                    DiaoNum = 20;
                } else {
                    DiaoNum = num;
                }

                //找出所有能‘对’的牌
                let DiaoCards = WCards.filter(item => item.num == DiaoNum)
                //判断 有没有 ‘对’的牌
                if (DiaoCards.length == 0) {
                    window.console.log('没有牌')
                    NCard.own = 'WC'
                } else if (DiaoCards.length == 1) {
                    window.console.log('只有一张牌')
                    that.cards.find(item => item._id == DiaoCards[0]._id).own = 'MC' + myCode
                    NCard.own = 'MC' + myCode
                } else if (DiaoCards.length > 1) {
                    window.console.log('多于一张牌')
                    let DiaoAC = DiaoCards.find(item => item.des == 'A' || item.des == 'C')
                    if(!DiaoAC) {
                        DiaoAC = DiaoCards.find(item => item.des == 'B' || item.des == 'D')
                    }
                    that.cards.find(item => item._id == DiaoAC._id).own = 'MC' + myCode
                    NCard.own = 'MC' + myCode
                }
                that.$socket.emit('Diao', that.cards);
            }
            setTimeout(DiaoChu, 500)//setTimeout end

            let DiaoFuan = function() {
                let DCards = that.cards.filter(item => item.own == 'DC')
                let lastDC = DCards[DCards.length - 1]
                    window.console.log(lastDC._id)
                that.cards.find(item => item._id == lastDC._id).open = true
                that.cards.find(item => item._id == lastDC._id).own = 'NC' + myCode
                that.$socket.emit('Diao', that.cards);
            }
            setTimeout(DiaoFuan, 700)//setTimeout end
            setTimeout(DiaoChu, 1200)//setTimeout end
            // this.$socket.emit('Diao', id);
            // if (this.isMe) {
                // 屏蔽
            // } else {
            //     return false
            // }
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
