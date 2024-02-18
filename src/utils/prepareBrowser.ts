import betterFocus from '@/utils/betterFocus.ts';

export function prepareBrowser() {
  // Делаем фокус только по табу
  const focusEngine = betterFocus(document.documentElement, 'focus-disabled');
  focusEngine.start();
}
