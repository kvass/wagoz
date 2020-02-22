<template>
<div>
    <h2>{{deskId}}</h2>
  <button @click="startCard" v-if="option.A">开始</button>
  <ul class="oringeCard">
    <li v-for="(card, index) in cards" @click="deskCard(card.num,index)" v-bind:class="[card.des, {open: card.open}]" :key='index' v-bind:title='card._id'>{{card.name}}</li>
  </ul>
  <section class="you">
    <ul>
      <li v-for="(card, index) in MMcards" @click="DIAOchu(card.num,index)" v-bind:class="[card.des, {open: card.open}]" :key='index' v-bind:title='card._id'>{{card.name}}</li>
    </ul>
    <ul>
      <li v-for="(card, index) in BBcards" v-bind:class="[card.des, {open: card.open}]" :key='index' v-bind:title='card.title'>{{card.name}}</li>
    </ul>
    <ul>
      <li v-for="(card, index) in UScards" v-bind:class="[card.des, {open: card.open}]" :key='index' v-bind:title='card.title'>{{card.name}}</li>
    </ul>
    <ul>
      <li v-for="(card, index) in DDcards" v-bind:class="[card.des, {open: card.open}]" :key='index' v-bind:title='card.title'>{{card.name}}</li>
    </ul>
    <ul class="openCard">
      <li v-for="(card, index) in OPENcards" @click="DIAOdiao(card.des)" v-bind:class="[card.des, {open: card.open}]" :key='index' v-bind:title='card.title'>{{card.name}}</li>
    </ul>
    <ul>
      <li v-for="(card, index) in MMQcards" v-bind:class="[card.des, {open: card.open}]" :key='index' v-bind:title='card.title'>{{card.name}}</li>
    </ul>
  </section>
 </div>
</template>

<script>

export default {
  data() {
    return {
        deskId: '非常标题',
      cards: [],
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
      DiaoQ: {chu: '', diao: '', fang: ''}     //钓红点-出-钓-计时器
    }
  },
  methods: {
    // 洗牌
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
      this.ad = !this.ad;
      this.option.A = !this.option.A;
      this.$http.post('http://localhost:3000/desk', this.cards).then(res => {
          window.console.log(res.data)
          this.deskId = res.data[0]._id
        });
    },
    // 切牌与翻牌
    deskCard(cardNum,cardIndex) {
        this.cards[cardIndex].open = true;
        let cardId = this.cards[cardIndex]._id
        window.console.log(cardId)
        //切牌
        this.cardsOld = this.cards.splice(0, cardIndex);
        this.cards = this.cards.concat(this.cardsOld);
        this.$http.post('http://localhost:3000/desk/cut', [this.deskId, cardId, 'kvass']).then(res => window.console.log(res.data));

        // 发牌
        this.FPJSQ = setInterval(() => {
          if (this.cards.length == 54 || this.cards.length == 50 || this.cards.length == 46 || this.cards.length == 42 || this.cards.length == 38 || this.cards.length == 34) {
            this.cards[this.cards.length-1].open = true;
            this.MMcards.unshift(this.cards.pop());
            this.$http.post('http://localhost:3000/desk/cut', [this.deskId, this.cards[this.cards.length-1], 'kvass']).then(res => window.console.log(res.data));
          } else if (this.cards.length == 53 || this.cards.length == 49 || this.cards.length == 45 || this.cards.length == 41 || this.cards.length == 37 || this.cards.length == 33) {
            this.BBcards.unshift(this.cards.pop())
          } else if (this.cards.length == 52 || this.cards.length == 48 || this.cards.length == 44 || this.cards.length == 40 || this.cards.length == 36 || this.cards.length == 32) {
            this.UScards.unshift(this.cards.pop())
          } else if (this.cards.length == 51 || this.cards.length == 47 || this.cards.length == 43 || this.cards.length == 39 || this.cards.length == 35 || this.cards.length == 31) {
            this.DDcards.unshift(this.cards.pop())
          } else if (this.cards.length <= 30 && this.cards.length > 24) {
            this.cards[this.cards.length-1].open = true;
            this.OPENcards.unshift(this.cards.pop())
          } else {
            clearInterval(this.FPJSQ);
            this.FPJSQ = null;
            let kingD = this.OPENcards.filter((item)=>{return item.num == 21 || item.num == 22});
            if (kingD.length == 2) {
              this.OPENcards.splice(this.OPENcards.indexOf(kingD[0]),1)
              this.OPENcards.splice(this.OPENcards.indexOf(kingD[1]),1)
              this.MMQcards = kingD;
            }

          }
        }, 50);
        // 发牌 end
    },
    //出牌\钓牌规则
    DIAOchu(cardNum,cardIndex) {
      let AAAB = this.MMcards.splice(cardIndex,1)[0];
      let DiaoQD;
      if (cardNum < 10) {
        DiaoQD = 10 - cardNum;
      } else if (cardNum == 21) {
        DiaoQD = 22;
      } else if (cardNum == 22) {
        DiaoQD = 21;
      } else {
        DiaoQD = cardNum;
      }

      function checkAdult(item) {
          return (item.num == parseInt(DiaoQD));
      }

      // setTimeout( () => {
        let DiaoA = this.OPENcards.filter(checkAdult)
        if (DiaoA != '') {
          this.MMQcards.unshift(AAAB)
          if (this.OPENcards.filter(checkAdult).length == 1) {
            this.OPENcards.splice(this.OPENcards.indexOf(DiaoA[0]),1)
            this.MMQcards.unshift(DiaoA[0])
          } else {
            let Dred = DiaoA.find((QA) => { return QA.des == 'A' || QA.des == 'C'})
            this.OPENcards.splice(this.OPENcards.indexOf(Dred),1)
            this.MMQcards.unshift(Dred)
          }
        } else {
          this.OPENcards.unshift(AAAB)
        }
      // }, 1000)
      // 执行翻牌动作
      // setTimeout( () => {
        this.cards[this.cards.length - 1].open = true;
      // }, 1500)

      let cardNum2 = this.cards[this.cards.length - 1].num
      // this.OPENcards.unshift(this.cards.pop())
      let DiaoQF;
      if (cardNum2 < 10) {
        DiaoQF = 10 - cardNum2;
      } else if (cardNum2 == 21) {
        DiaoQF = 22;
      } else if (cardNum2 == 22) {
        DiaoQF = 21;
      } else {
        DiaoQF = cardNum2;
      }

      // setTimeout( () => {//翻牌计时器开始
        let DiaoB = this.OPENcards.filter((item)=>{return item.num == parseInt(DiaoQF)});
        if (DiaoB != '') {
          window.console.log(DiaoB)
          this.MMQcards.unshift(this.cards.pop())
          // 若牌只有一张
          if (DiaoB.length == 1) {
            window.console.log(`有 1 牌`)
            this.OPENcards.splice(this.OPENcards.indexOf(DiaoB[0]),1)
            this.MMQcards.unshift(DiaoB[0])
          }
          // 若牌不只一张
          else {
            // 看是不是有 红桃、方块
            let Dred = DiaoB.find((QA) => { return QA.des == 'A' || QA.des == 'C'})
            if (Dred != 'undefined') {
            window.console.log(`是 红牌`)
              this.OPENcards.splice(this.OPENcards.indexOf(Dred),1)
              this.MMQcards.unshift(Dred)
            } else {
            window.console.log(`是 黑牌`)
              let Dblank = DiaoB.find((QB) => { return QB.des == 'B' || QB.des == 'D'})
              this.OPENcards.splice(this.OPENcards.indexOf(Dblank),1)
              this.MMQcards.unshift(Dblank)
            }
          }
        }
        else {
          this.OPENcards.unshift(this.cards.pop())
        }
      // }, 2500)//翻牌计时器结束
    },
    DIAOdiao(cardDes) {
      this.DiaoQ.diao = cardDes;
      window.console.log(`D${this.DiaoQ.diao}`);
      // if (this.DiaoQ.chu ) {

      // }
    },
    DIAOqi(cardDes) {
      this.DiaoQ.qi = cardDes;
      window.console.log('Q' + this.DiaoQ.qi)
    },
    DIAOCard() {
      this.DiaoQ.qi = this.MMcards.num;
      if (this.DiaoQ.qi === '') {
        this.DiaoQ.diao = this.MMcards.num
      }
    }
  },
  mounted() {
    this.$http('http://localhost:3000/goods').then((res) => this.cards = res.data)
  }
  // computed: {}
}
</script>

<style lang="scss" scoped>
.relative {
  position: relative;
  overflow: auto;
}
.move-enter {
  position: absolute;
  z-index: 9999;
  top: -500px;
}
.move-enter-active {
  position: absolute;
  z-index: 9999;
  transition: all 1s;
}
.move-enter-to {
  position: absolute;
  z-index: 9999;
  top: 0;
}

.move-leave {
  position: absolute;
  z-index: 9999;
  left: 0;
  box-shadow: 0 0 5px #333;
}
.move-leave-active {
  position: absolute;
  z-index: 9999;
  transition: all 1s;
}
.move-leave-to {
  left: 500px;
}
</style>
