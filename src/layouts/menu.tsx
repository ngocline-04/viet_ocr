import type { MenuProps } from 'antd';
import { Divider, Space } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { forwardRef, memo, useCallback, useEffect, useMemo, useState } from 'react';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import type { IconSvgTypes } from '@/assets/svg';
import { IconSvgLocal, TextBase } from '@/components';
import { ROUTES } from '@/config/routes';
import { selectLanguage, setLanguage } from '@/stores/globalSlice';
import { changeLanguage } from '@/utils/i18n/i18n';

interface MenuNav {
  icon?: IconSvgTypes;
  label?: ReactNode;
  link?: string;
}

const Component = forwardRef((props, ref) => {
  const [keyActive, setKeyActive] = useState('');
  const [isVietnamese, setIsVietnamese] = useState(true);

  const language = useSelector(selectLanguage);
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const activeClassName = 'body-text-16-bold text-color-50 mobile:body-text-14-bold';
  const inactiveClassName = 'body-text-16-regular text-color-50 mobile:body-text-14-regular';

  const menuData: MenuNav[] = useMemo(
    () => [
      { label: <TextBase>OCR BẢNG ĐIỂM</TextBase>, link: ROUTES.HOME },
      { label: <TextBase>QUẢN LÝ DANH SÁCH</TextBase>, link: ROUTES.MANAGE },
    ],
    [keyActive]
  );

  const onClick: MenuProps['onClick'] = useCallback(() => {
    const newLang = isVietnamese ? 'en' : 'vi';
    setIsVietnamese(!isVietnamese);
    dispatch(setLanguage(newLang));
    changeLanguage(newLang);
  }, [dispatch, isVietnamese]);

  useEffect(() => {
    const currentRoute = router.pathname;
    const activeMenuItem = menuData.find((item) => currentRoute === item.link);
    if (activeMenuItem) {
      setKeyActive(activeMenuItem.link || '');
    }
  }, [router.pathname, menuData]);

  const menuFixed = useMemo(() => {
    return (
      <div className="h-full w-[260px] bg-primary-500 px-24 py-16">
        <Space className="mb-[42px] flex w-full items-center justify-between">
          <IconSvgLocal name="IC_LOGO_TP" classNames="h-[80px]" />
        </Space>

        <Space className="flex flex-col items-start">
          {menuData.map((item, i) => (
            <Link
              key={i}
              href={item.link || '#'}
              className={`${
                keyActive === item.link ? `${activeClassName}` : inactiveClassName
              } ${i === menuData.length - 1 ? 'mb-4' : 'mb-24'}`} // Thêm padding để có không gian xung quanh
            >
              <div className="px-8 py-12">{item?.label}</div>
            </Link>
          ))}
        </Space>

        <Divider />
      </div>
    );
  }, [keyActive, language, menuData, t, onClick]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* ✅ Menu cố định bên trái */}
      {menuFixed}

      <div className="flex-1">
        {/* Nội dung chính của trang */}
        {props.children}
      </div>
    </div>
  );
});

const MenuCustom = memo(Component, isEqual);
export default MenuCustom;
