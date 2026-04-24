import type { RouteRecordRaw } from 'vue-router'
import { CATEGORIES } from '../data/categories'
import { CALCULATORS } from '../data/calculators'

const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { layout: 'site' },
  },
  {
    path: '/workspace',
    name: 'workspace',
    component: () => import('../views/WorkspaceView.vue'),
    meta: { layout: 'workspace', noindex: true },
  },
  {
    path: '/credit-calc',
    redirect: '/finance/credit',
  },
]

const categoryRoutes: RouteRecordRaw[] = CATEGORIES.map(category => ({
  path: category.path,
  name: `category-${category.slug}`,
  component: () => import('../views/CategoryView.vue'),
  meta: { layout: 'site', categorySlug: category.slug },
}))

const calculatorRoutes: RouteRecordRaw[] = CALCULATORS
  .filter(calc => calc.status !== 'planned')
  .map(calc => ({
    path: calc.path,
    name: `calc-${calc.id}`,
    component: () => import('../views/CalculatorView.vue'),
    meta: {
      layout: 'site',
      categorySlug: calc.categorySlug,
      toolSlug: calc.slug,
      noindex: calc.status === 'soon',
    },
  }))

const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('../views/NotFoundView.vue'),
  meta: { layout: 'site', noindex: true },
}

export const routes = [
  ...staticRoutes,
  ...categoryRoutes,
  ...calculatorRoutes,
  notFoundRoute,
]
