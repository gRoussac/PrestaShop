<script setup>
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  bootstrap: { type: Object, required: true },
});

const emitSubmitName = ref("");
const nextDisabled = ref(!props.bootstrap.nextButton);
const showNext = ref(true);

const stepList = computed(() => props.bootstrap.steps || []);
const menuSteps = computed(() => props.bootstrap.menuSteps || []);

function setSubmitName(name) {
  emitSubmitName.value = name;
}

function onFormSubmit(event) {
  const submitName =
    emitSubmitName.value || (event.submitter && event.submitter.name) || "";
  if (submitName !== "submitPrevious") {
    showNext.value = false;
  }
}

function setNextDisabled(disabled) {
  nextDisabled.value = disabled;
}

defineExpose({ setNextDisabled });

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
          v-if="!bootstrap.isLastStep && showNext"
          id="btNext"
          class="button little"
          :class="{ disabled: nextDisabled }"
          type="submit"
          name="submitNext"
          :value="bootstrap.strings.next"
          :disabled="nextDisabled"
          @click="setSubmitName('submitNext')"
        />
        <input
          v-if="!bootstrap.isFirstStep && bootstrap.previousButton"
          id="btBack"
          class="button little"
          type="submit"
          name="submitPrevious"
          :value="bootstrap.strings.back"
          @click="setSubmitName('submitPrevious')"
        />
      </div>
    </form>
  </div>
</template>
