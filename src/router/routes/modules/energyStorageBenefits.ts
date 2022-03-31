import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/energyStorageBenefits',
  name: 'EnergyStorageBenefits',
  component: LAYOUT,
  redirect: '/energyStorageBenefits/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.dashboard.energyStorageBenefits'),
    orderNo: 6,
  },
  children: [
    {
      path: 'index',
      name: 'EnergyStorageBenefitsPage',
      component: () => import('/@/views/sys/energyStorageBenefits/index.vue'),
      meta: {
        title: t('routes.dashboard.energyStorageBenefits'),
        icon: 'simple-icons:about-dot-me',
        hideMenu: true,
      },
    },
  ],
};

export default dashboard;
