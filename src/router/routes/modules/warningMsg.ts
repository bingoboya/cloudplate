import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/warningMsg',
  name: 'WarningMsg',
  component: LAYOUT,
  redirect: '/warningMsg/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.dashboard.warningMsg'),
    orderNo: 5,
  },
  children: [
    {
      path: 'index',
      name: 'WarningMsgPage',
      component: () => import('/@/views/sys/warningMsg/index.vue'),
      meta: {
        title: t('routes.dashboard.warningMsg'),
        icon: 'simple-icons:about-dot-me',
        hideMenu: true,
      },
    },
  ],
};

export default dashboard;
