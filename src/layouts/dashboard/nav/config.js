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
    title: 'Sản phẩm',
    path: '/dashboard/product',
    icon: icon('ic_blog'),
  },
  {
    title: 'Thương hiệu',
    path: '/dashboard/brand',
    icon: icon('ic_blog'),
  },
  {
    title: 'Loại sản phẩm',
    path: '/dashboard/category',
    icon: icon('ic_blog'),
  },
  {
    title: 'Tin tức',
    path: '/dashboard/news',
    icon: icon('ic_blog'),
  },
  {
    title: 'Bài viết giới thiệu',
    path: '/dashboard/about-company',
    icon: icon('ic_blog'),
  },
];

export default navConfig;
