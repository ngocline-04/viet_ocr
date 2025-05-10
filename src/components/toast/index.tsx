import { notification } from 'antd';
import { createRef, forwardRef, useImperativeHandle } from 'react';

import type { ToastProps } from '@/components/toast/type';
import { TYPE_TOAST } from '@/components/toast/type';

import { IconSvgLocal } from '../icon-vec-local';

function handleToastContent(props: ToastProps) {
  return <div className={`mr-28 pr-4 ${props.wrapClassName || ''}`}>{props.content}</div>;
}

function handleToastIcon(props: ToastProps) {
  if (props.icon) {
    return (
      <IconSvgLocal
        name={props.icon.name}
        fill={props.icon.fill}
        height={props.icon.height}
        width={props.icon.width}
      />
    );
  }

  switch (props.type) {
    case TYPE_TOAST.INFO:
      return <IconSvgLocal name="ICON_INFO" fill="rgb(var(--link-600))" height={24} width={24} />;
    case TYPE_TOAST.SUCCESS:
      return (
        <IconSvgLocal name="ICON_CHECK" fill="rgb(var(--success-600))" height={24} width={24} />
      );
    case TYPE_TOAST.WARNING:
      return (
        <IconSvgLocal name="ICON_WARNING" fill="rgb(var(--pending-600))" height={24} width={24} />
      );
    case TYPE_TOAST.ERROR:
      return <IconSvgLocal name="ICON_CLOSE" fill="rgb(var(--error-600))" height={24} width={24} />;
    default:
      return null;
  }
}

// eslint-disable-next-line react/display-name
const Component = forwardRef((_: any, ref) => {
  const [api, contextHolder] = notification.useNotification();

  useImperativeHandle(ref, () => ({
    show: (props: ToastProps) => {
      api.open({
        message: handleToastContent(props),
        duration: props.timeShow || 3,
        icon: handleToastIcon(props),
      });
    },
  }));

  return <div>{contextHolder}</div>;
});

type Toast = {
  show: (data: { type?: TYPE_TOAST; content: string }) => void;
};
export const ToastRef = createRef<Toast>();

export const ToastView = () => <Component ref={ToastRef} />;

export const showToast = (props: ToastProps) => {
  ToastRef.current?.show(props);
};
