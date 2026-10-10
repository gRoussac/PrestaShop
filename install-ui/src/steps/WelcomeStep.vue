<script setup>
import { inject, ref, watch } from "vue";

const bootstrap = inject("bootstrap");
const data = bootstrap.stepData || {};
const language = ref(data.language || "");

watch(language, () => {
  document.getElementById("mainForm")?.requestSubmit();
});
</script>

<template>
  <div v-if="data.canUpgrade" class="warnBlock">
    <img
      :src="'theme/img/pict_error.png'"
      alt=""
      style="vertical-align: middle"
    />
    &nbsp;
    <span v-html="data.upgradeWarningHtml"></span>
  </div>

  <h2>{{ data.title }}</h2>
  <p>{{ data.intro }}</p>

  <template v-if="(data.languages || []).length > 1">
    <h3>{{ data.continueIn }}</h3>
    <select id="langList" name="language" v-model="language">
      <option v-for="lang in data.languages" :key="lang.iso" :value="lang.iso">
        {{ lang.name }}
      </option>
    </select>
  </template>

  <p>{{ data.languageNote }}</p>
</template>
