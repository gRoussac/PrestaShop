<script setup>
import { computed, inject, ref } from "vue";

const MODULES_SELECTED = 1;
const bootstrap = inject("bootstrap");
const data = bootstrap.stepData || {};

const theme = ref(data.theme || (data.themes?.[0]?.name ?? ""));
const moduleAction = ref(data.moduleAction ?? 0);
const selectedModules = ref([...(data.selectedModules || [])]);
const selectAll = ref(!!data.selectAll);
const search = ref("");

const showModuleList = computed(
  () => Number(moduleAction.value) === MODULES_SELECTED,
);

const filteredCategories = computed(() => {
  const needle = search.value.toLowerCase();
  return (data.categories || [])
    .map((category) => {
      const modules = (category.modules || []).filter((module) => {
        if (!needle) {
          return true;
        }
        return module.displayName.toLowerCase().includes(needle);
      });
      return { ...category, modules };
    })
    .filter((category) => category.modules.length > 0);
});

function toggleSelectAll() {
  if (selectAll.value) {
    selectedModules.value = (data.categories || []).flatMap((category) =>
      category.modules.map((module) => module.name),
    );
  } else {
    selectedModules.value = [];
  }
}

function onModuleToggle() {
  const allNames = (data.categories || []).flatMap((category) =>
    category.modules.map((module) => module.name),
  );
  selectAll.value =
    allNames.length > 0 &&
    allNames.every((name) => selectedModules.value.includes(name));
}
</script>

<template>
  <div id="contentInfosBlock">
    <h2>{{ data.title }}</h2>

    <input
      v-if="(data.themes || []).length === 1"
      type="hidden"
      name="theme"
      :value="theme"
    />

    <div v-else class="field clearfix theme-selection">
      <label class="aligned">
        {{ data.themeLabel }}
        <p class="theme-infos userInfos aligned">{{ data.themeHelp }}</p>
      </label>
      <div class="contentinput">
        <div class="themes-container">
          <div v-for="item in data.themes" :key="item.name" class="theme-card">
            <label>
              <input
                v-model="theme"
                type="radio"
                name="theme"
                :value="item.name"
                style="vertical-align: top"
                autocomplete="off"
              />
              {{ item.displayName }}
              <div class="image-block">
                <img :src="'../' + item.preview" :alt="item.displayName" />
              </div>
              <p class="theme-version">
                <strong>{{ data.versionLabel }}</strong> {{ item.version }}
              </p>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="field clearfix">
      <label class="aligned">{{ data.modulesLabel }}</label>
      <div class="contentinput">
        <ul class="modules-select-type">
          <li v-for="option in data.moduleOptions" :key="option.value">
            <label>
              <input
                v-model="moduleAction"
                type="radio"
                name="module-action"
                :value="option.value"
                style="vertical-align: top"
                autocomplete="off"
              />
              {{ option.label }}
            </label>
          </li>
        </ul>
      </div>
      <p class="userInfos aligned">{{ data.modulesHelp }}</p>

      <div v-show="showModuleList" id="modules-container">
        <div>
          <input
            id="search-for-module"
            v-model="search"
            type="text"
            name="search"
            :placeholder="data.searchPlaceholder"
          />
        </div>
        <div>
          <label>
            <input
              v-model="selectAll"
              type="checkbox"
              name="select-all"
              @change="toggleSelectAll"
            />
            {{ data.selectAllLabel }}
          </label>
        </div>
        <dl>
          <template v-for="category in filteredCategories" :key="category.name">
            <dt>{{ category.label }}</dt>
            <dd v-for="module in category.modules" :key="module.name">
              <label>
                <input
                  v-model="selectedModules"
                  type="checkbox"
                  name="modules[]"
                  :value="module.name"
                  autocomplete="off"
                  @change="onModuleToggle"
                />
                {{ module.displayName }}
              </label>
            </dd>
          </template>
        </dl>
      </div>
    </div>
  </div>
</template>
