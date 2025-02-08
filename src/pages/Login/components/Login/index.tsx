import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  MessagePlugin,
  Input,
  Checkbox,
  Button,
  FormInstanceFunctions,
  SubmitContext,
  Image,
} from 'tdesign-react';
import { LockOnIcon, UserIcon, BrowseOffIcon, BrowseIcon } from 'tdesign-icons-react';
import classnames from 'classnames';
import { login } from 'modules/user';

import Style from './index.module.less';
import { getCode, getLogin } from 'services/user';
import { encrypt } from 'utils/rsaEncrypt';
import { useDispatch } from 'react-redux';

const { FormItem } = Form;

export type ELoginType = 'password' | 'phone' | 'qrcode';

export default function Login() {
  const [showPsw, toggleShowPsw] = useState(false);
  const formRef = useRef<FormInstanceFunctions>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [codeImg, setCodeImg] = useState('');
  const uuid = useRef('');

  async function code() {
    const result = await getCode();
    setCodeImg(result.data.img);
    uuid.current = result.data.uuid;
  }

  useEffect(() => {
    code();
  }, []);

  const onSubmit = async (e: SubmitContext) => {
    if (e.validateResult === true) {
      try {
        const formValue = formRef.current?.getFieldsValue?.(true) || {};
        const result: any = await getLogin({
          username: '',
          code: '',
          ...formValue,
          password: encrypt(formValue.password),
          uuid: uuid.current,
        });

        dispatch(login(result.data));
        MessagePlugin.success('登录成功');
        navigate('/dashboard/base');
      } catch (err: Error | any) {
        MessagePlugin.error(`登录失败,${err.message}`);
      }
    }
  };

  return (
    <div>
      <Form
        ref={formRef}
        className={classnames(Style.itemContainer, `login-password`)}
        labelWidth={0}
        onSubmit={onSubmit}
      >
        <FormItem name='username' rules={[{ required: true, message: '账号必填', type: 'error' }]}>
          <Input size='large' placeholder='请输入账号' prefixIcon={<UserIcon />}></Input>
        </FormItem>
        <FormItem name='password' rules={[{ required: true, message: '密码必填', type: 'error' }]}>
          <Input
            size='large'
            type={showPsw ? 'text' : 'password'}
            clearable
            placeholder='请输入登录密码'
            prefixIcon={<LockOnIcon />}
            suffixIcon={
              showPsw ? (
                <BrowseIcon onClick={() => toggleShowPsw((current) => !current)} />
              ) : (
                <BrowseOffIcon onClick={() => toggleShowPsw((current) => !current)} />
              )
            }
          />
        </FormItem>
        <FormItem name='code' rules={[{ required: true, message: '账号必填', type: 'error' }]}>
          <Input
            size='large'
            placeholder='请输入验证码'
            prefixIcon={<UserIcon />}
            style={{ marginRight: '20px' }}
          ></Input>
          <Image src={codeImg} style={{ background: 'none' }} onClick={() => code()}></Image>
        </FormItem>
        <div className={classnames(Style.checkContainer, Style.rememberPwd)}>
          <Checkbox>记住账号</Checkbox>
          <span className={Style.checkContainerTip}>忘记账号？</span>
        </div>

        <FormItem className={Style.btnContainer}>
          <Button block size='large' type='submit'>
            登录
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}
