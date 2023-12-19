import { Button, Form, Input, Steps, message } from "antd";

import Container from "../../components/Container";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkVerifyCode, forgetPassword } from "../../repository/auth/auth";
import { useForm } from "antd/es/form/Form";

const ForgetPassword = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = useForm();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    if (values.email === undefined) {
      messageApi.error("Vui lòng nhập email");
      return;
    }
    // Nếu tồn tại email thì gửi code và chuyển sang bước 2
    if (current === 0) {
      setIsLoading(true);
      const res = await forgetPassword(values.email);
      if (res.status === 200) {
        setCurrent(current + 1);
        setIsLoading(false);
      }
    }
    if (current === 1) {
      setInfo({
        token: values.OTP,
      });
      setCurrent(current + 1);
    }
    if (current === 2) {
      const data = {
        password: values.newPassword,
        token: info.token,
      };
      setIsLoading(true);
      try {
        const res = await checkVerifyCode(data);
        if (res.status === 200) {
          setIsLoading(false);
          messageApi.success("Đổi mật khẩu thành công");
          form.resetFields();
          setCurrent(0);
          navigate("/home/login");
        }
      } catch (err) {
        setIsLoading(false);
        messageApi.error("Đổi mật khẩu thất bại");
        console.log(err);
      }
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [info, setInfo] = useState({});

  // useEffect(async () => {
  //   await checkVerifyCode(info);
  // }, [info, flag]);

  const stepButton = () => {
    let text = "";
    if (current === 0) {
      text = "Gửi mã xác minh";
    } else if (current === 1) {
      text = "Xác nhận";
    } else {
      text = "Khôi phục tài khoản";
    }
    return (
      <Button
        loading={isLoading}
        className={current === 0 || current === 2 ? "w-full" : ""}
        size="large"
        type="primary"
        htmlType="submit"
      >
        {text}
      </Button>
    );
  };
  const backButton = () => {
    if (current === 1) {
      return (
        <Button
          size="large"
          type="default"
          onClick={() => setCurrent(current - 1)}
        >
          Quay lại
        </Button>
      );
    }
    return null;
  };
  const steps = [
    {
      title: "Email đã đăng ký",
      content: (
        <>
          <Form.Item name="email">
            <Input
              size="large"
              type="email"
              placeholder="Nhập email đã đăng ký"
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Mã xác minh",
      content: (
        <>
          <Form.Item name="OTP">
            <Input size="large" type="text" placeholder="Nhập mã OTP" />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Nhập mật khẩu mới",
      content: (
        <>
          <Form.Item name="newPassword">
            <Input
              size="large"
              type="text"
              placeholder="Mật khẩu mới của bạn"
            />
          </Form.Item>
        </>
      ),
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  return (
    <>
      {contextHolder}
      <Container>
        <div className="flex items-center justify-center mt-[100px]">
          <div>
            <h1 className="mb-4 text-4xl text-center">Đặt lại mật khẩu</h1>
            <Steps current={current} items={items} />
            <Form
              form={form}
              onFinish={onFinish}
              name="forget-password-form"
              className="flex flex-col justify-center max-w-md mx-auto"
            >
              <div className="mt-[20px]">{steps[current].content}</div>
              <div className="flex items-center justify-between">
                {backButton()}
                {stepButton()}
              </div>
            </Form>
            <Link to={"/home/login"}>
              <Button type="link" className="float-right mt-4">
                <span className="text-base underline">Đăng nhập?</span>
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ForgetPassword;
