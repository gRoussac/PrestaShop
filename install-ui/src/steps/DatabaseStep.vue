<script setup>
import { inject, onMounted, onBeforeUnmount, reactive, ref } from "vue";
import { installGetJson } from "../lib/ajax.js";
import { loadDraft, saveDraft } from "../composables/useDraft.js";

const DRAFT_KEY = "gregoshop.install.database";
const bootstrap = inject("bootstrap");
const data = bootstrap.stepData || {};

const form = reactive({
  dbServer: data.databaseServer || "",
  dbName: data.databaseName || "",
  dbLogin: data.databaseLogin || "",
  dbPassword: data.databasePassword || "",
  db_prefix: data.databasePrefix || "",
  database_clear: !!data.databaseClear,
  rewrite_engine: "0",
});

const result = ref({
  visible: !!(data.errors && data.errors.length),
  ok: !(data.errors && data.errors.length),
  waiting: false,
  message: (data.errors || []).join("<br />"),
});

function persist() {
  saveDraft(
    DRAFT_KEY,
    {
      dbServer: form.dbServer,
      dbName: form.dbName,
      dbLogin: form.dbLogin,
      db_prefix: form.db_prefix,
      db_clear: form.database_clear,
    },
    ["dbPassword"],
  );
}

function restore() {
  const draft = loadDraft(DRAFT_KEY);
  if (!draft || !Object.keys(draft).length) {
    return;
  }
  ["dbServer", "dbName", "dbLogin", "db_prefix"].forEach((key) => {
    if (!form[key] && draft[key]) {
      form[key] = draft[key];
    }
  });
  if (
    draft.db_clear === true ||
    draft.db_clear === 1 ||
    draft.db_clear === "1"
  ) {
    form.database_clear = true;
  }
}

async function testDb() {
  result.value = { visible: true, ok: false, waiting: true, message: "&nbsp;" };
  try {
    const json = await installGetJson({
      checkDb: "true",
      dbServer: form.dbServer,
      dbName: form.dbName,
      dbLogin: form.dbLogin,
      dbPassword: form.dbPassword,
      db_prefix: form.db_prefix,
      clear: form.database_clear ? "1" : "0",
    });
    result.value = {
      visible: true,
      ok: !!json.success,
      waiting: false,
      message: json.message || "",
    };
  } catch (error) {
    result.value = {
      visible: true,
      ok: false,
      waiting: false,
      message: String(error.message || error),
    };
  }
}

onMounted(async () => {
  restore();
  persist();
  window.addEventListener("beforeunload", persist);
  try {
    await fetch("sandbox/anything.php", { cache: "no-store" });
    form.rewrite_engine = "1";
  } catch {
    form.rewrite_engine = "0";
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", persist);
});
</script>

<template>
  <div id="dbPart">
    <h2>{{ data.title }}</h2>
    <p v-html="data.introHtml"></p>
    <div id="formCheckSQL">
      <div class="field">
        <label for="dbServer">{{ data.labels.server }}</label>
        <input
          id="dbServer"
          v-model="form.dbServer"
          class="text"
          type="text"
          name="dbServer"
          size="25"
          @input="persist"
        />
        <span class="userInfos aligned">{{ data.labels.serverHelp }}</span>
      </div>
      <div class="field">
        <label for="dbName">{{ data.labels.name }}</label>
        <input
          id="dbName"
          v-model="form.dbName"
          class="text"
          type="text"
          name="dbName"
          size="10"
          @input="persist"
        />
      </div>
      <div class="field">
        <label for="dbLogin">{{ data.labels.login }}</label>
        <input
          id="dbLogin"
          v-model="form.dbLogin"
          class="text"
          type="text"
          name="dbLogin"
          size="10"
          @input="persist"
        />
      </div>
      <div class="field">
        <label for="dbPassword">{{ data.labels.password }}</label>
        <input
          id="dbPassword"
          v-model="form.dbPassword"
          class="text"
          type="password"
          name="dbPassword"
          size="10"
        />
      </div>
      <div class="field">
        <label for="db_prefix">{{ data.labels.prefix }}</label>
        <input
          id="db_prefix"
          v-model="form.db_prefix"
          class="text"
          type="text"
          name="db_prefix"
          @input="persist"
        />
      </div>
      <div class="field">
        <label for="db_clear">{{ data.labels.clear }}</label>
        <input
          id="db_clear"
          type="checkbox"
          name="database_clear"
          value="1"
          :checked="form.database_clear"
          @change="
            form.database_clear = $event.target.checked;
            persist();
          "
        />
      </div>
      <div class="field">
        <input
          id="btTestDB"
          class="button"
          type="button"
          :value="data.labels.test"
          @click="testDb"
        />
      </div>
      <input
        id="rewrite_engine"
        type="hidden"
        name="rewrite_engine"
        :value="form.rewrite_engine"
      />
      <p
        v-show="result.visible"
        id="dbResultCheck"
        :class="{
          errorBlock: !result.ok && !result.waiting,
          okBlock: result.ok && !result.waiting,
          waitBlock: result.waiting,
        }"
        v-html="result.message"
      ></p>
    </div>
  </div>
</template>
