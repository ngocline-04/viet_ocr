import { Button, Form, Input } from 'antd';

export default function LoginPage() {
  const onFinish = (values) => {
    console.log('Đăng nhập với:', values);
  };

  return (
    <div className="bg-color-surface flex min-h-screen items-center justify-center">
      <div className="bg-color-surface-secondary p-spacing-24 shadow-s sm:max-w-sm w-full max-w-xs rounded-radius-l text-center">
        {/* <img
          src="assets/svg/logo_tp.png"
          alt="Học viện Ngân hàng"
          className="mb-spacing-12 w-spacing-40 h-spacing-40 mx-auto object-contain"
        /> */}

        <h1 className="text-color-text-primary mb-spacing-16 text-20 font-semibold leading-28">
          Đăng nhập
        </h1>

        <Form name="login" onFinish={onFinish} layout="vertical" className="text-left">
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
          >
            <Input
              placeholder="Tài khoản"
              className="rounded-radius-s py-spacing-10 px-spacing-12 text-14 leading-20"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              placeholder="Mật khẩu"
              className="rounded-radius-s py-spacing-10 px-spacing-12 text-14 leading-20"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-primary text-white py-spacing-10 rounded-radius-s hover:opacity-90 w-full text-14 font-semibold leading-20 transition-opacity"
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
