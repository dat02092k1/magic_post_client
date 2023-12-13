import { Button, Form, Input, message } from "antd";
import Container from "../../components/Container";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { signin } from "../../repository/auth/auth";
import { useStoreActions, useStoreState } from "../../store/hook";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const Login = () => {
  const currentUser = useStoreState((state) => state.currentUser);
  const setUserInfo = useStoreActions((actions) => actions.setUserInfo);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    if (currentUser?.loggedIn) {
      navigate("/dashboard");
    }
  }, [currentUser?.loggedIn, navigate]);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const res = await signin(values.email, values.password);
      console.log(res);
      if (res.status === 200) {
        setUserInfo({
          role: res.data.user.role,
          email: res.data.user.email,
          name: res.data.user.name,
          loggedIn: true,
          id: res.data.user._id,
          workDepartment: res.data.user.departmentId,
        });
        setIsLoading(false);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      messageApi.error("Email đăng nhập hoặc mật khẩu không đúng");
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  return (
    <Container>
      {contextHolder}

      <div className="flex items-center justify-center mt-[100px]">
        <div>
          <h1 className="mb-4 text-4xl text-center">Đăng nhập vào hệ thống</h1>
          <Form
            onFinish={onFinish}
            name="login-form"
            className="flex flex-col justify-center max-w-md mx-auto"
          >
            <Form.Item name="email">
              <Input
                allowClear
                prefix={<UserOutlined />}
                size="large"
                type="email"
                placeholder="Nhập email của bạn"
              />
            </Form.Item>
            <Form.Item name="password">
              <Input.Password
                prefix={<LockOutlined />}
                required
                size="large"
                type="password"
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>

            <Button
              size="large"
              type="primary"
              htmlType="submit"
              disabled={isLoading}
            >
              Đăng nhập
            </Button>

            <Link to={"/home/forget-password"}>
              <Button type="link" className="float-right mt-4">
                <span className="text-base underline">Quên mật khẩu ?</span>
              </Button>
            </Link>
          </Form>
        </div>
      </div>
    </Container>
  );
};
export default Login;
