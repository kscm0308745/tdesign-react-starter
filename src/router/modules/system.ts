import { lazy } from 'react';
import { ViewModuleIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';

const result: IRouter[] = [
  {
    path: '/system',
    meta: {
      title: '系统管理',
      Icon: ViewModuleIcon,
    },
    children: [
      {
        path: 'user',
        Component: lazy(() => import('pages/System/UserManage')),
        meta: {
          title: '用户管理',
        },
      },
    ],
  },
];

export default result;
