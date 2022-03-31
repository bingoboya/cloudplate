import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

// 优化调度
const dashboard: AppRouteModule = {
  path: '/optimizedschedule',
  name: 'Optimizedschedule',
  component: LAYOUT,
  redirect: '/optimizedschedule/strategyoptimizate',
  meta: {
    orderNo: 7,
    icon: 'ion:grid-outline',
    title: t('routes.dashboard.strategyoptimizate'),
  },
  children: [
    {
      path: 'strategyoptimizate',
      name: 'Strategyoptimizate',
      component: () => import('/@/views/sys/strategyoptimizate/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.dashboard.strategyoptimizate'),
      },
    },
    {
      path: 'historyrecord',
      name: 'Historyrecord',
      component: () => import('/@/views/sys/historyrecord/index.vue'),
      meta: {
        title: t('routes.dashboard.historyrecord'),
      },
    },
  ],
};

export default dashboard;
