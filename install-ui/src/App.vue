<script setup>
import { computed, provide } from "vue";
import InstallShell from "./components/InstallShell.vue";
import WelcomeStep from "./steps/WelcomeStep.vue";
import LicenseStep from "./steps/LicenseStep.vue";
import SystemStep from "./steps/SystemStep.vue";
import ConfigureStep from "./steps/ConfigureStep.vue";
import ContentStep from "./steps/ContentStep.vue";
import DatabaseStep from "./steps/DatabaseStep.vue";
import ProcessStep from "./steps/ProcessStep.vue";

const props = defineProps({
  bootstrap: { type: Object, required: true },
});

provide("bootstrap", props.bootstrap);

const stepComponent = computed(() => {
  const map = {
    welcome: WelcomeStep,
    license: LicenseStep,
    system: SystemStep,
    configure: ConfigureStep,
    content: ContentStep,
    database: DatabaseStep,
    process: ProcessStep,
  };
  return map[props.bootstrap.step] || WelcomeStep;
});
</script>

<template>
  <InstallShell :bootstrap="bootstrap">
    <component :is="stepComponent" />
  </InstallShell>
</template>
