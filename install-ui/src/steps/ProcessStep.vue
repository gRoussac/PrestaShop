<script setup>
import { inject, onMounted, ref } from "vue";
import { installGetJson } from "../lib/ajax.js";

const bootstrap = inject("bootstrap");
const data = bootstrap.stepData || {};
const steps = data.processSteps || [];

const installing = ref(true);
const done = ref(false);
const progress = ref(0);
const currentLabel = ref("");
const errorHtml = ref("");
const warningHtml = ref("");
const showPassword = ref(false);
const failedKey = ref("");
const successKeys = ref([]);

let busy = false;
let currentIndex = 0;

async function runStep(step) {
  currentLabel.value = `${step.lang}...`;
  if (step.subtasks && step.subtasks.length) {
    await runSubtasks(step);
    return;
  }
  const json = await installGetJson({ [step.key]: "true" });
  if (!json || json.success !== true) {
    throw { step, message: json?.message || "Unknown error" };
  }
  if (json.warning) {
    warningHtml.value += `<p>${json.warning}</p>`;
  }
  successKeys.value = [...successKeys.value, step.key];
}

async function runSubtasks(step) {
  for (let i = 0; i < step.subtasks.length; i += 1) {
    const params = {
      [step.key]: "true",
      subtask: String(i),
      ...step.subtasks[i],
    };
    const json = await installGetJson(params);
    if (!json || json.success !== true) {
      throw { step, message: json?.message || "Unknown error" };
    }
    if (json.warning) {
      warningHtml.value += `<p>${json.warning}</p>`;
    }
    progress.value = Math.ceil(
      currentIndex * (100 / steps.length) +
        ((i + 1) * (100 / steps.length)) / step.subtasks.length,
    );
  }
  successKeys.value = [...successKeys.value, step.key];
}

async function start() {
  if (busy) {
    return;
  }
  busy = true;
  installing.value = true;
  done.value = false;
  errorHtml.value = "";
  try {
    for (currentIndex = 0; currentIndex < steps.length; currentIndex += 1) {
      await runStep(steps[currentIndex]);
      progress.value = Math.ceil(((currentIndex + 1) * 100) / steps.length);
    }
    currentLabel.value = data.doneLabel;
    installing.value = false;
    done.value = true;
  } catch (error) {
    installing.value = false;
    failedKey.value = error.step?.key || "";
    errorHtml.value = formatErrors(error.message);
  } finally {
    busy = false;
  }
}

function formatErrors(errors) {
  if (!errors) {
    return "";
  }
  if (typeof errors === "string") {
    return `<ol><li>1: ${errors.replace(/\n/g, "<br>")}</li></ol>`;
  }
  return `<ol><li>1: ${String(errors)}</li></ol>`;
}

onMounted(start);
</script>

<template>
  <div v-show="!done" id="install_process_form">
    <div id="progress_bar">
      <h2 class="installing">{{ currentLabel }}</h2>
      <div class="total">
        <div class="progress" :style="{ width: progress + '%' }"></div>
        <span>{{ progress }}%</span>
      </div>
      <ol class="process_list">
        <li
          v-for="step in steps"
          :id="'process_step_' + step.key"
          :key="step.key"
          class="process_step"
          :class="{
            success: successKeys.includes(step.key),
            fail: failedKey === step.key,
          }"
          :style="{
            display:
              successKeys.includes(step.key) || failedKey === step.key
                ? 'list-item'
                : 'none',
          }"
        >
          {{ step.lang }}
        </li>
      </ol>
      <div v-show="errorHtml" id="error_process">
        <h3>{{ data.errorTitle }}</h3>
        <p v-html="data.errorHelpHtml"></p>
        <div v-html="errorHtml"></div>
      </div>
    </div>
  </div>

  <div v-show="warningHtml" id="warning_process">
    <h3>{{ data.warningTitle }}</h3>
    <div v-html="warningHtml"></div>
  </div>

  <div v-show="done" id="install_process_success">
    <div class="clearfix">
      <h2>{{ data.successTitle }}</h2>
      <p>{{ data.successIntro }}</p>
      <p>{{ data.loginRemember }}</p>
      <table
        cellpadding="0"
        cellspacing="0"
        border="0"
        id="resultInstall"
        width="620"
      >
        <tr class="odd">
          <td class="label">{{ data.emailLabel }}</td>
          <td class="resultEnd">{{ data.adminEmail }}</td>
        </tr>
        <tr>
          <td class="label">{{ data.passwordLabel }}</td>
          <td class="resultEnd">
            <span id="password_content">{{
              showPassword ? data.adminPassword : data.passwordMasked
            }}</span>
            <span v-if="!showPassword" id="password_display">
              <a href="#" @click.prevent="showPassword = true">{{
                data.displayLabel
              }}</a
              >)
            </span>
          </td>
        </tr>
      </table>
      <button
        class="button"
        type="button"
        @click="
          showPassword = true;
          window.print();
        "
      >
        {{ data.printLabel }}
      </button>
      <hr />
      <h3 class="messagesBlock">{{ data.deleteInstallFolder }}</h3>
      <div class="fo-bo-container">
        <div
          id="boBlock"
          class="blockInfoEnd clearfix"
          @click="window.open('../' + data.adminFolderName)"
        >
          <img :src="'theme/img/visu_boBlock.png'" alt="" />
          <div class="bo-infos">
            <h3>{{ data.boTitle }}</h3>
            <p class="description">{{ data.boDescription }}</p>
            <a class="button button--small" target="_blank">{{
              data.boButton
            }}</a>
          </div>
        </div>
        <div
          id="foBlock"
          class="blockInfoEnd last clearfix"
          @click="window.open('../')"
        >
          <img :src="'theme/img/visu_foBlock.png'" alt="" />
          <div class="bo-infos">
            <h3>{{ data.foTitle }}</h3>
            <p class="description">{{ data.foDescription }}</p>
            <a class="button button--small" target="_blank">{{
              data.foButton
            }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
