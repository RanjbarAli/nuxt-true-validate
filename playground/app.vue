<template>
  <div>
    <input type="file" multiple @change="(event) => field1.set(event.target.files)">
    <pre>{{ field1 }}</pre>
  </div>
</template>

<script setup>
const field1 = TrueField({
  name: 'Ali',
  rules: 'required|size:between,5,7',
  default: null,
  each: true,
})
</script>
