<template>
  <div>
    <Top />
    <WellcomeAreaStart />
    <Nuxt />
    <Bottom />
  </div>
</template>
<script>
import Top from "~/components/Global/Top";
import Bottom from "~/components/Global/Bottom";
import WellcomeAreaStart from "~/components/WellcomeAreaStart";

export default {
  components: {WellcomeAreaStart, Bottom, Top},
  data: () => {
    return {
      networks: [
        { id: 0, name: "Main", url: "https://main.ton.dev/graphql" },
        { id: 1, name: "Labs Development", url: "https://net.ton.dev/graphql" },
        { id: 2, name: "Telegram Test Net", url: "https://testnet.ton.dev/graphql" }
      ]
    }
  },
  beforeMount() {
    this.$store.state.baseURL = this.networks[0].url;
  }
}
</script>

<style lang="scss">
.link-unstyled {
  &,
  &:visited,
  &:hover,
  &:active,
  &:focus,
  &:active:hover {
    font-style: inherit;
    color: inherit;
    background-color: transparent;
    font-size: inherit;
    text-decoration: none;
    font-variant: inherit;
    font-weight: inherit;
    line-height: inherit;
    font-family: inherit;
    border-radius: inherit;
    border: inherit;
    outline: inherit;
    box-shadow: inherit;
    padding: inherit;
    vertical-align: inherit;
  }
}
</style>
