import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/datamonitor',
  name: 'Datamonitor',
  component: LAYOUT,
  redirect: '/datamonitor/monitorcomp',
  meta: {
    orderNo: 4,
    icon: 'ion:grid-outline',
    title: t('routes.dashboard.datamonitor'),
  },
  children: [
    {
      path: 'monitorcomp',
      name: 'Monitorcomp',
      component: () => import('/@/views/sys/monitorcomp/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.dashboard.monitorcomp'),
      },
    },
    {
      path: 'searchdata',
      name: 'Searchdata',
      component: () => import('/@/views/sys/searchdata/index.vue'),
      meta: {
        title: t('routes.dashboard.searchdata'),
      },
    },
    {
      path: 'intervaldata',
      name: 'Intervaldata',
      component: () => import('/@/views/sys/intervaldata/index.vue'),
      meta: {
        title: t('routes.dashboard.intervaldata'),
      },
    },
  ],
};

export default dashboard;
