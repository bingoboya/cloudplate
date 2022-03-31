import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/shouye',
  name: 'Shouye',
  component: LAYOUT,
  redirect: '/shouye/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.dashboard.shouye'),
    orderNo: 3,
  },
  children: [
    {
      path: 'index',
      name: 'ShouyePage',
      component: () => import('/@/views/sys/shouye/index.vue'),
      meta: {
        title: t('routes.dashboard.shouye'),
        icon: 'simple-icons:about-dot-me',
        hideMenu: true,
      },
    },
  ],
};

export default dashboard;
