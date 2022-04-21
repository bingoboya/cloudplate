import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/energyStorageBenefits',
  name: 'EnergyStorageBenefits',
  component: LAYOUT,
  redirect: '/energyStorageBenefits/strategyoptimizate1',
  meta: {
    hideChildrenInMenu: false,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.dashboard.energyStorageBenefitsTitle'),
    orderNo: 6,
  },
  children: [
    {
      path: 'benefitsdata',
      name: 'BenefitsData',
      component: () => import('/@/views/sys/BenefitsData/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.dashboard.benefitsDataTitle'),
      },
    },
    {
      path: 'benefitsAnalysis',
      name: 'BenefitsAnalysis',
      component: () => import('/@/views/sys/BenefitsAnalysis/index.vue'),
      meta: {
        title: t('routes.dashboard.benefitsAnalysisTitle'),
      },
    },
  ],
};

export default dashboard;
