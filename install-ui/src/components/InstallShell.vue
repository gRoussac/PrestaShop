<script setup>
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  bootstrap: { type: Object, required: true },
});

const nextDisabled = ref(!props.bootstrap.nextButton);
const nextDisplay = ref("");

const stepList = computed(() => props.bootstrap.steps || []);
const menuSteps = computed(() => props.bootstrap.menuSteps || []);

function setNextDisabled(disabled) {
  nextDisabled.value = disabled;
}

/**
 * Same as legacy install.js: $('#btNext').hide() on forward submit.
 * Keep the input in the DOM so submitNext stays in the POST body
 * (Vue v-if removal would drop it).
 */
function onFormSubmit(event) {
  const submitName = (event.submitter && event.submitter.name) || "";
  if (submitName !== "submitPrevious") {
    nextDisplay.value = "none";
  }
}

onMounted(() => {
  window.__INSTALL_UI__ = {
    setNextDisabled,
  };
});
</script>

<template>
  <div id="container">
    <div id="loaderSpace">
      <div id="loader">&nbsp;</div>
    </div>

    <form id="mainForm" action="index.php" method="post" @submit="onFormSubmit">
      <div class="mainForm__header">
        <h1>{{ bootstrap.strings.installationAssistant }}</h1>

        <ul id="stepList_1" class="stepList">
          <li
            v-for="step in stepList"
            :key="step.name"
            :class="{ ok: step.finished }"
          >
            {{ step.label }}
          </li>
        </ul>
      </div>

      <div class="mainForm__content">
        <div id="leftpannel">
          <ol id="tabs">
            <li
              v-for="step in menuSteps"
              :key="step.name"
              :class="step.className"
            >
              <a v-if="step.href" :href="step.href">{{ step.label }}</a>
              <template v-else>{{ step.label }}</template>
            </li>
          </ol>
        </div>

        <div id="sheets" class="sheet shown">
          <div :id="'sheet_' + bootstrap.step" class="sheet shown clearfix">
            <noscript>
              <h4 class="errorBlock" style="margin-bottom: 10px">
                {{ bootstrap.strings.needJavascript }}
                <a
                  href="https://enable-javascript.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    :src="'theme/img/help.png'"
                    style="height: 16px; width: 16px"
                    alt=""
                  />
                </a>
              </h4>
            </noscript>

            <div>
              <slot />
            </div>
          </div>
        </div>
      </div>

      <div id="buttons" class="mainForm__footer">
        <input
          v-if="!bootstrap.isLastStep"
          id="btNext"
          class="button little"
          :class="{ disabled: nextDisabled }"
          type="submit"
          name="submitNext"
          :value="bootstrap.strings.next"
          :disabled="nextDisabled"
          :style="nextDisplay ? { display: nextDisplay } : undefined"
        />
        <input
          v-if="!bootstrap.isFirstStep && bootstrap.previousButton"
          id="btBack"
          class="button little"
          type="submit"
          name="submitPrevious"
          :value="bootstrap.strings.back"
        />
      </div>
    </form>
  </div>
</template>
