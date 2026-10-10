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
const MIN_SCORE = 3;
const MIN_LENGTH = 8;
const MAX_LENGTH = 72;

const bootstrap = inject("bootstrap");
const data = bootstrap.stepData || {};
const translations = data.passwordTranslations || {};

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
const fieldErrors = data.fieldErrors || {};

zxcvbnOptions.setOptions({
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
});

const passwordValid = computed(() => {
  if (!form.admin_password) {
    return true;
  }
  const result = zxcvbn(form.admin_password);
  return (
    result.score >= MIN_SCORE &&
    form.admin_password.length >= MIN_LENGTH &&
    form.admin_password.length <= MAX_LENGTH
  );
});

const strengthLabel = computed(() => translations[passwordScore.value] || "");

const strengthColor = computed(() => {
  if (passwordScore.value <= 1) return "#BA151A";
  if (passwordScore.value === 2) return "#FFA000";
  return "#207F4B";
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
  if (!form.admin_password) {
    passwordScore.value = 0;
    passwordError.value = "";
    window.__INSTALL_UI__?.setNextDisabled(false);
    return;
  }
  const result = zxcvbn(form.admin_password);
  passwordScore.value = result.score;
  const valid = passwordValid.value;
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
        <input
          id="infosPassword"
          v-model="form.admin_password"
          autocomplete="off"
          type="password"
          class="text required"
          name="admin_password"
          :class="
            form.admin_password
              ? passwordValid
                ? 'border-success'
                : 'border-danger'
              : ''
          "
        />
        <div v-if="form.admin_password" class="password-strength-feedback">
          <div class="progress-container">
            <div
              class="progress-bar"
              :style="{
                width: passwordScore * 20 + 20 + '%',
                backgroundColor: strengthColor,
                visibility: 'visible',
              }"
            ></div>
          </div>
          <div class="password-strength-text">{{ strengthLabel }}</div>
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
