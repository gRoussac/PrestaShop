<script setup>
import { inject, ref, watch } from "vue";

const bootstrap = inject("bootstrap");
const data = bootstrap.stepData || {};
const language = ref(data.language || "");

watch(language, () => {
  // Native submit: language reload only (no submitNext). Do not use requestSubmit()
  // with a Next submitter or the wizard would advance unexpectedly.
  const form = document.getElementById("mainForm");
  if (form) {
    HTMLFormElement.prototype.submit.call(form);
  }
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
