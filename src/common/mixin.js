import BackTop from 'components/content/backTop/BackTop.vue';

import {BACK_TOP_DISTANCE} from "common/const";
import {debounce} from './utils';

export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 500);

    this.itemImageListener = () => {
      refresh();
    };

    this.$bus.$on('itemImageLoad', this.itemImageListener);
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backTopClick() {
      this.$refs.scroll.scrollTo(0, 0, 600);
    },
    listenShowBackTop(position) {
      this.isShowBackTop = (-position.y) > BACK_TOP_DISTANCE;
    }
  }
}