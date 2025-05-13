import { Button, Form, Input } from 'antd';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs} from 'firebase/firestore';
import { get } from 'lodash';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { IconSvgLocal } from '@/components';
import { showDialog } from '@/components/dialog';
import { hideLoading, showLoading } from '@/components/loading';
import { setInfoUser } from '@/stores/authSlice';
import { db } from './_app';

export default function LoginPage() {
  const auth = getAuth();
  const dispatch = useDispatch();
  const router = useRouter();
  const onLogin = useCallback(
    (data: any) => {
      const email = get(data, 'username', '');
      const password = get(data, 'password', '');
      showLoading();
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const { user } = userCredential;

          const querySnapshot = await getDocs(collection(db, 'users'));

          querySnapshot.forEach((doc) => {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const data = doc.data();
            if (data.uid == user?.uid) {
              dispatch(
                setInfoUser({
                  email: data?.email,
                  uid: data?.uid,
                  name: data?.name,
                  role: data?.role,
                })
              );
            }
          });
          router.push('/home');
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode == 'auth/invalid-credential') {
            showDialog({
              title: 'Lỗi hệ thống',
              image: {
                name: 'IC_AUTHEN_ERROR',
                width: 80,
                height: 80,
                fill: 'text-error-500',
              },
              content: 'Tài khoản hoặc mật khẩu không đúng. Vui lòng kiểm tra lại!',
              actions: [
                {
                  title: 'Thử lại',
                  type: 'secondary',
                },
              ],
            });
          }
          if (errorCode == 'auth/invalid-email') {
            showDialog({
              title: 'Lỗi hệ thống',
              image: {
                name: 'IC_AUTHEN_ERROR',
                width: 80,
                height: 80,
                fill: 'text-error-500',
              },
              content:
                'Người dùng không tồn tại. Vui lòng liên hệ ADMIN để được tạo mới tài khoản!',
              actions: [
                {
                  title: 'Thử lại',
                  type: 'secondary',
                },
              ],
            });
          }
        })
        .finally(() => {
          hideLoading();
        });
    },
    [auth]
  );
  return (
    <div className="flex min-h-screen items-center justify-center bg-common-1000">
      <div className="flex w-full max-w-xs flex-col rounded-radius-l bg-color-100 p-32 text-center shadow-down-xs shadow-color-200 mobile:max-w-sm">
        <IconSvgLocal name="IC_LOGO_TP" classNames="h-[80px] mb-16" />
        <h1 className="mb-16 text-20">Đăng nhập</h1>

        <Form name="login" onFinish={onLogin} layout="vertical" className="text-left">
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Vui lòng nhập tài khoản!' },
              { type: 'email', message: 'Email không đúng định dạng!' },
            ]}
          >
            <Input placeholder="Tài khoản" className="px-10 text-14 leading-20" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password placeholder="Mật khẩu" className="px-10 text-14 leading-20" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="py-10 rounded-radius-s hover:opacity-90 w-full text-14 font-semibold leading-20 text-common-1000 transition-opacity"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-spacing-12 text-center">
          <a href="#" className="text-primary text-14 leading-20 hover:underline">
            Quên mật khẩu?
          </a>
        </div>
      </div>
    </div>
  );
}
