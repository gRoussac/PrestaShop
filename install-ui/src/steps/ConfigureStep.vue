<script setup>
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import { installGetJson } from "../lib/ajax.js";
import {
  isBlankInstallValue,
  loadDraft,
  saveDraft,
} from "../composables/useDraft.js";

const DRAFT_KEY = "gregoshop.install.configure";
const TIMEZONE_ISOS = ["br", "us", "ca", "ru", "me", "au", "id"];
const bootstrap = inject("bootstrap");
const data = bootstrap.stepData || {};
const translations = data.passwordTranslations || {};
const minLength = Number(data.passwordMinLength) || 8;
const maxLength = Number(data.passwordMaxLength) || 72;
const minScore = Number(data.passwordMinScore) || 3;

const form = reactive({
  shop_name: data.shopName || "",
  shop_country: data.shopCountry || "0",
  shop_timezone: data.shopTimezone || "0",
  enable_ssl: data.enableSsl ? "1" : "0",
  admin_firstname: data.adminFirstname || "",
  admin_lastname: data.adminLastname || "",
  admin_email: data.adminEmail || "",
  admin_password: data.adminPassword || "",
  admin_password_confirm: data.adminPasswordConfirm || "",
});

const showTimezone = ref(TIMEZONE_ISOS.includes(form.shop_country));
const passwordScore = ref(0);
const passwordError = ref("");
const passwordLengthOk = ref(false);
const passwordScoreOk = ref(false);
const popoverHtml = ref("");
const fieldErrors = data.fieldErrors || {};

zxcvbnOptions.setOptions({
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
});

function sprintfLike(template, ...args) {
  let i = 0;
  return String(template).replace(/%[sd]/g, () => String(args[i++]));
}

function strengthColorFor(score) {
  if (score <= 1) return "#BA151A";
  if (score === 2) return "#FFA000";
  return "#207F4B";
}

const passwordValid = computed(() => {
  if (!form.admin_password) {
    return true;
  }
  return passwordScoreOk.value && passwordLengthOk.value;
});

const strengthLabel = computed(
  () =>
    translations[String(passwordScore.value)] ||
    translations[passwordScore.value] ||
    "",
);

const strengthColor = computed(() => strengthColorFor(passwordScore.value));

const strengthPercent = computed(() => passwordScore.value * 20 + 20);

const lengthRequirementText = computed(() =>
  sprintfLike(data.passwordLengthTranslation || "", minLength, maxLength),
);

const scoreRequirementText = computed(() =>
  sprintfLike(
    data.passwordScoreTranslation || "",
    translations[String(minScore)] || translations[minScore] || "",
  ),
);

const passwordInputClass = computed(() => {
  if (!form.admin_password) {
    return "text required";
  }
  return passwordValid.value
    ? "form-control border border-success"
    : "form-control border border-danger";
});

function persist() {
  saveDraft(
    DRAFT_KEY,
    {
      shop_name: form.shop_name,
      shop_country: form.shop_country,
      shop_timezone: form.shop_timezone,
      enable_ssl: form.enable_ssl === "1",
      admin_firstname: form.admin_firstname,
      admin_lastname: form.admin_lastname,
      admin_email: form.admin_email,
    },
    ["admin_password", "admin_password_confirm"],
  );
}

function restore() {
  const draft = loadDraft(DRAFT_KEY);
  if (!draft || !Object.keys(draft).length) {
    return;
  }
  const map = {
    shop_name: "shop_name",
    admin_firstname: "admin_firstname",
    admin_lastname: "admin_lastname",
    admin_email: "admin_email",
  };
  Object.entries(map).forEach(([formKey, draftKey]) => {
    if (
      isBlankInstallValue(form[formKey]) &&
      !isBlankInstallValue(draft[draftKey])
    ) {
      form[formKey] = draft[draftKey];
    }
  });
  if (isBlankInstallValue(form.shop_country) && draft.shop_country) {
    form.shop_country = draft.shop_country;
  }
  if (
    !isBlankInstallValue(draft.shop_timezone) &&
    isBlankInstallValue(form.shop_timezone)
  ) {
    form.shop_timezone = draft.shop_timezone;
  }
  if (typeof draft.enable_ssl !== "undefined") {
    form.enable_ssl = draft.enable_ssl ? "1" : "0";
  }
  showTimezone.value = TIMEZONE_ISOS.includes(form.shop_country);
}

async function onCountryChange() {
  showTimezone.value = TIMEZONE_ISOS.includes(form.shop_country);
  persist();
  try {
    const json = await installGetJson({
      timezoneByIso: "true",
      iso: form.shop_country,
    });
    if (json.success) {
      form.shop_timezone = json.message;
    }
  } catch {
    // Keep current timezone.
  }
}

function evaluatePassword() {
  const passwordValue = form.admin_password;
  if (!passwordValue) {
    passwordScore.value = 0;
    passwordError.value = "";
    passwordLengthOk.value = false;
    passwordScoreOk.value = false;
    popoverHtml.value = "";
    window.__INSTALL_UI__?.setNextDisabled(false);
    return;
  }

  const result = zxcvbn(passwordValue);
  passwordScore.value = result.score;
  passwordLengthOk.value =
    passwordValue.length >= minLength && passwordValue.length <= maxLength;
  passwordScoreOk.value = result.score >= minScore;

  const tips = [];
  if (result.feedback.warning && result.feedback.warning in translations) {
    tips.push(translations[result.feedback.warning]);
  }
  (result.feedback.suggestions || []).forEach((suggestion) => {
    if (suggestion in translations) {
      tips.push(translations[suggestion]);
    }
  });
  popoverHtml.value = tips.join("<br>");

  const valid = passwordScoreOk.value && passwordLengthOk.value;
  passwordError.value = valid ? "" : data.passwordMustBeStrong;
  window.__INSTALL_UI__?.setNextDisabled(!valid);
}

function onFormClick(event) {
  const target = event.target;
  if (target && target.name) {
    document
      .getElementById("mainForm")
      ?.setAttribute("data-submit-name", target.name);
  }
}

function onFormSubmit(event) {
  persist();
  const formEl = event.target;
  const submitName =
    formEl.getAttribute("data-submit-name") ||
    (event.submitter && event.submitter.name) ||
    "";
  if (submitName === "submitPrevious") {
    return;
  }
  if (form.admin_password && !passwordValid.value) {
    event.preventDefault();
    event.stopImmediatePropagation();
    window.__INSTALL_UI__?.setNextDisabled(false);
    passwordError.value = data.passwordMustBeStrong;
  }
}

watch(
  () => form.admin_password,
  () => evaluatePassword(),
);

onMounted(() => {
  restore();
  persist();
  evaluatePassword();
  const formEl = document.getElementById("mainForm");
  formEl?.addEventListener("click", onFormClick);
  formEl?.addEventListener("submit", onFormSubmit);
  window.addEventListener("beforeunload", persist);
  if (isBlankInstallValue(form.shop_timezone)) {
    onCountryChange();
  }
});

onBeforeUnmount(() => {
  const formEl = document.getElementById("mainForm");
  formEl?.removeEventListener("click", onFormClick);
  formEl?.removeEventListener("submit", onFormSubmit);
  window.removeEventListener("beforeunload", persist);
});
</script>

<template>
  <div id="infosShopBlock">
    <h2>{{ data.storeTitle }}</h2>

    <div class="field clearfix">
      <label for="infosShop" class="aligned"
        >{{ data.labels.shopName }}<sup class="required">*</sup></label
      >
      <div class="contentinput">
        <input
          id="infosShop"
          v-model="form.shop_name"
          class="text required"
          type="text"
          name="shop_name"
          @input="persist"
        />
      </div>
      <span v-if="fieldErrors.shop_name" class="result aligned errorTxt">{{
        fieldErrors.shop_name
      }}</span>
    </div>

    <div class="field clearfix">
      <label for="infosCountry" class="aligned"
        >{{ data.labels.country }}<sup class="required">*</sup></label
      >
      <div class="contentinput">
        <select
          id="infosCountry"
          v-model="form.shop_country"
          name="shop_country"
          @change="onCountryChange"
        >
          <option
            v-for="country in data.countries"
            :key="String(country.iso)"
            :value="country.iso"
          >
            {{ country.name }}
          </option>
        </select>
      </div>
      <span v-if="fieldErrors.shop_country" class="result aligned errorTxt">{{
        fieldErrors.shop_country
      }}</span>
    </div>

    <div v-show="showTimezone" id="timezone_div" class="field clearfix">
      <label for="infosTimezone" class="aligned"
        >{{ data.labels.timezone }}<sup class="required">*</sup></label
      >
      <div class="contentinput">
        <select
          id="infosTimezone"
          v-model="form.shop_timezone"
          name="shop_timezone"
          @change="persist"
        >
          <option value="0">{{ data.selectTimezone }}</option>
          <option v-for="tz in data.timezones" :key="tz" :value="tz">
            {{ tz }}
          </option>
        </select>
      </div>
      <span v-if="fieldErrors.shop_timezone" class="result aligned errorTxt">{{
        fieldErrors.shop_timezone
      }}</span>
    </div>

    <div class="field clearfix">
      <label class="aligned">{{ data.labels.enableSsl }}</label>
      <div class="contentinput radio-inline">
        <label>
          <input
            v-model="form.enable_ssl"
            type="radio"
            name="enable_ssl"
            value="1"
            autocomplete="off"
            @change="persist"
          />
          {{ data.yes }}
        </label>
        <label>
          <input
            v-model="form.enable_ssl"
            type="radio"
            name="enable_ssl"
            value="0"
            autocomplete="off"
            @change="persist"
          />
          {{ data.no }}
        </label>
      </div>
    </div>

    <h2 style="margin-top: 20px">{{ data.accountTitle }}</h2>

    <div class="field clearfix">
      <label for="infosFirstname" class="aligned"
        >{{ data.labels.firstname }}<sup class="required">*</sup></label
      >
      <div class="contentinput">
        <input
          id="infosFirstname"
          v-model="form.admin_firstname"
          class="text required"
          type="text"
          name="admin_firstname"
          @input="persist"
        />
      </div>
      <span
        v-if="fieldErrors.admin_firstname"
        class="result aligned errorTxt"
        >{{ fieldErrors.admin_firstname }}</span
      >
    </div>

    <div class="field clearfix">
      <label for="infosName" class="aligned"
        >{{ data.labels.lastname }}<sup class="required">*</sup></label
      >
      <div class="contentinput">
        <input
          id="infosName"
          v-model="form.admin_lastname"
          class="text required"
          type="text"
          name="admin_lastname"
          @input="persist"
        />
      </div>
      <span v-if="fieldErrors.admin_lastname" class="result aligned errorTxt">{{
        fieldErrors.admin_lastname
      }}</span>
    </div>

    <div class="field clearfix">
      <label for="infosEmail" class="aligned"
        >{{ data.labels.email }}<sup class="required">*</sup></label
      >
      <div class="contentinput">
        <input
          id="infosEmail"
          v-model="form.admin_email"
          class="text required"
          type="text"
          name="admin_email"
          @input="persist"
        />
      </div>
      <p class="userInfos aligned">{{ data.emailHelp }}</p>
      <span v-if="fieldErrors.admin_email" class="result aligned errorTxt">{{
        fieldErrors.admin_email
      }}</span>
    </div>

    <div class="field field-password clearfix">
      <label for="infosPassword" class="aligned"
        >{{ data.labels.password }}<sup class="required">*</sup></label
      >
      <div class="contentinput">
        <div
          class="popover fade bs-popover-top"
          :class="{ 'd-none': !popoverHtml }"
          role="tooltip"
          x-placement="top"
        >
          <div class="arrow"></div>
          <h3 class="popover-header"></h3>
          <div class="popover-body" v-html="popoverHtml"></div>
        </div>

        <input
          id="infosPassword"
          v-model="form.admin_password"
          autocomplete="off"
          type="password"
          name="admin_password"
          :data-minlength="minLength"
          :data-maxlength="maxLength"
          :data-minscore="minScore"
          :class="passwordInputClass"
        />

        <div
          class="password-strength-feedback"
          :class="{ 'd-none': !form.admin_password }"
        >
          <div class="progress-container">
            <div
              class="progress-bar"
              :style="{
                width: strengthPercent + '%',
                backgroundColor: strengthColor,
                visibility: 'visible',
              }"
            >
              <div></div>
            </div>
          </div>
          <div class="password-strength-text">{{ strengthLabel }}</div>
          <div class="password-requirements">
            <p class="password-requirements-length">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                :class="{ 'text-success': passwordLengthOk }"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
              <span>{{ lengthRequirementText }}</span>
            </p>
            <p class="password-requirements-score">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                :class="{ 'text-success': passwordScoreOk }"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
              <span>{{ scoreRequirementText }}</span>
            </p>
          </div>
        </div>
      </div>
      <p v-if="!fieldErrors.admin_password" class="userInfos aligned">
        {{ data.passwordHelp }}
      </p>
      <span v-if="fieldErrors.admin_password" class="result aligned errorTxt">{{
        fieldErrors.admin_password
      }}</span>
      <span
        v-show="passwordError"
        class="result aligned errorTxt js-password-client-error"
        >{{ passwordError }}</span
      >
    </div>

    <div class="field clearfix">
      <label class="aligned" for="infosPasswordRepeat"
        >{{ data.labels.passwordConfirm }}<sup class="required">*</sup></label
      >
      <div class="contentinput">
        <input
          id="infosPasswordRepeat"
          v-model="form.admin_password_confirm"
          type="password"
          autocomplete="off"
          class="text required"
          name="admin_password_confirm"
        />
      </div>
      <span
        v-if="fieldErrors.admin_password_confirm"
        class="result aligned errorTxt"
        >{{ fieldErrors.admin_password_confirm }}</span
      >
    </div>
  </div>
</template>
