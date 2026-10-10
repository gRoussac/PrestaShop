<script setup>
import { inject, onMounted, ref, watch } from "vue";

const bootstrap = inject("bootstrap");
const data = bootstrap.stepData || {};
const agreed = ref(!!data.licenceAgrement);

function syncNext() {
  window.__INSTALL_UI__?.setNextDisabled(!agreed.value);
}

watch(agreed, syncNext);
onMounted(syncNext);
</script>

<template>
  <h2 id="licenses-agreement">{{ data.title }}</h2>
  <p>
    <strong>{{ data.intro }}</strong>
  </p>
  <div class="infosLicense" v-html="data.licenseHtml"></div>

  <div class="checkLicense">
    <input
      id="set_license"
      type="checkbox"
      class="required"
      name="licence_agrement"
      value="1"
      style="margin-top: 2px"
      :checked="agreed"
      @change="agreed = $event.target.checked"
    />
    <div>
      <label for="set_license">
        <strong>{{ data.agreeLabel }}</strong>
      </label>
    </div>
  </div>

  <div class="infosBlock">
    <h4>{{ data.privacyTitle }}</h4>
    <p v-html="data.privacyHtml"></p>
  </div>
</template>
