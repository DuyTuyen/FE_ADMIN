// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Doanh thu',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Tài khoản',
    path: '/dashboard/user',
    icon: icon('ic_blog'),
  },
  {
    title: 'Sản phẩm',
    path: '/dashboard/products',
    icon: icon('ic_blog'),
  },
  {
    title: 'Loại',
    path: '/dashboard/category',
    icon: icon('ic_blog'),
  },
  {
    title: 'Thương hiệu',
    path: '/dashboard/brand',
    icon: icon('ic_blog'),
  },
  {
    title: 'Nhập hàng',
    path: '/dashboard/importorder',
    icon: icon('ic_blog'),
  },
  {
    title: 'Đơn hàng',
    path: '/dashboard/order',
    icon: icon('ic_blog'),
  },
  {
    title: 'Lô hàng',
    path: '/dashboard/consignment',
    icon: icon('ic_blog'),
  },
  // {
  //   title: 'Chức vụ',
  //   path: '/dashboard/role',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'Quyền hạn',
  //   path: '/dashboard/permission',
  //   icon: icon('ic_blog'),
  // },
];

export default navConfig;
