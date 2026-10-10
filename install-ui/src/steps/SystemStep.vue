<script setup>
import { inject } from "vue";

const bootstrap = inject("bootstrap");
const data = bootstrap.stepData || {};
</script>

<template>
  <h2>{{ data.title }}</h2>

  <h3 v-if="data.requiredSuccess" class="okBlock">{{ data.okMessage }}</h3>
  <h3 v-else class="errorBlock">{{ data.errorMessage }}</h3>

  <hr />

  <template v-for="(categories, type) in data.testsRender" :key="type">
    <ul :id="type">
      <template v-for="(category, cIndex) in categories" :key="cIndex">
        <li class="title" :class="{ ok: category.success == 1 }">
          {{ category.title }}
        </li>
        <li
          v-for="(lang, id, index) in category.checks"
          :key="String(id) + '-' + index"
          class="required"
          :class="[
            index === 0 ? 'first' : '',
            data.tests?.[type]?.checks?.[id] || 'fail',
          ]"
        >
          <span v-html="lang"></span>
        </li>
      </template>
    </ul>
  </template>

  <hr />
  <p>
    <input
      class="button button--secondary"
      type="submit"
      id="req_bt_refresh"
      :value="data.refreshLabel"
    />
  </p>
</template>
