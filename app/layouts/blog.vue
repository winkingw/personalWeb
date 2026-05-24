<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
  >
    <CoreAppHeader />
    <main class="flex-1">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
          <div>
            <slot />
          </div>
          <aside class="hidden lg:block">
            <div class="sticky top-24">
              <slot name="sidebar" />
            </div>
          </aside>
        </div>
      </div>
    </main>
    <CoreAppFooter />
    <CoreBackToTop />
  </div>
</template>
