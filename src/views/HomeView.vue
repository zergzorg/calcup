<template>
  <div class="home-stub">
    <h1>CalcUP</h1>
    <p>Агрегатор онлайн-калькуляторов</p>
    <nav>
      <RouterLink to="/workspace">Рабочий стол</RouterLink>
      <RouterLink to="/finance/credit">Кредитный калькулятор</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.home-stub {
  padding: 2rem;
  font-family: system-ui, sans-serif;
}
.home-stub nav {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
