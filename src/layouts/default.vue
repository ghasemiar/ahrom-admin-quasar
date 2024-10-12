<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      dense
      class="tw-bg-surface-light bor tw-border tw-m-2 tw-rounded-xl"
    >
      <q-toolbar class="tw-h-[3.5rem] tw-text-primary">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title dense> اهرم </q-toolbar-title>
        <q-btn
          flat
          dense
          class="tw-mx-2 tw-p-2"
          icon="fa-solid fa-user"
          :to="{ name: 'profile-create' }"
        />
        <q-btn
          flat
          dense
          label="خروج از حساب"
          class="tw-mx-2 tw-p-2 tw-text-center"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="260"
      :breakpoint="1200"
      class="tw-flex tw-flex-col tw-bg-surface-light tw-text-primary-0 text-sm"
    >
      <q-scroll-area class="fit tw-px-2 text-sm">
        <div class="tw-flex">
          <!-- <img class="tw-mt-4" style="width: 64px; height: 64px;" src="~/assets/favicon.png" /> -->

          <div class="tw-my-8 tw-grid tw-grid-cols-1 bg-transparent">
            <span class="tw-mx-4 tw-text-lg tw-text-primary tw-font-bold">
              سامانه املاک اهرم
            </span>
          </div>
          <q-separator dark />
        </div>

        <drawer-list :nodes="linksList" />
      </q-scroll-area>
      <!-- <q-list class="tw-flex-grow">
        <drawer-items
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list> -->
    </q-drawer>

    <q-page-container style="background: #f8f7fa">
      <app-breadcrumb separator="<" />
      <router-view class="md:tw-p-2" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DrawerItems, { DrawerItemsInterface } from 'components/DrawerItems.vue';
import AppBreadcrumb from 'components/AppBreadcrumb.vue';
import { useAuthStore } from 'stores/auth.store';
import DrawerList from 'components/drawer/DrawerList.vue';

defineOptions({
  name: 'MainLayout',
});
const { logout } = useAuthStore();
const linksList = [
  {
    icon: 'fa-solid fa-blog',
    title: 'مقالات',

    separator_name: 'مقاله',
    to: '/blog',
  },
  {
    icon: 'fa-solid fa-list',
    title: 'دسته بندی ها',
    separator: false,
    to: '/category',
  },
  {
    icon: 'fa-solid fa-tag',
    title: 'برچسب ها',
    separator: false,
    to: '/tag',
  },

  {
    icon: 'fa-solid fa-image',
    title: 'تصاویر',

    separator_name: 'رسانه',
    to: '/image',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style></style>
