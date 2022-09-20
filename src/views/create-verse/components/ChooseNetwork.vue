<template>
  <div>
    <div>Choose Network</div>
    <a-space>
      <img src="public/images/networks/ic_imversed.svg" />
      <a-select
        ref="select"
        v-model:value="network"
        style="width: 120px"
        @focus="focus"
        @change="handleChange"
      >
        <a-select-option value="imversed-testnet"><img src="public/images/networks/ic_imversed.svg" />Imversed Testnet</a-select-option>
        <a-select-option value="imversed"><img src="public/images/networks/ic_imversed.svg" />Imversed</a-select-option>
        <a-select-option value="ethereum" disabled><img src="public/images/networks/ic_ethereum.svg" /> Ethereum</a-select-option>
      </a-select>
    </a-space>
  </div>


</template>
<script lang="ts">
import type { SelectProps } from "ant-design-vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const focus = () => {
      console.log("focus");
    };

    const handleChange = (value: string) => {
      console.log(`selected ${value}`);
    };

    return {
      focus,
      handleChange,
      network: ref("Imversed Testnet")
    };
  }
});
</script>

