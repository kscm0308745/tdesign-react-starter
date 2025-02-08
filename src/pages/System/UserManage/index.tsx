import React, { useEffect, useState } from 'react';
// import Styles from './index.module.less';
import CommonStyle from 'styles/common.module.less';
import { BrowserRouterProps } from 'react-router-dom';
import {
  Button,
  Col,
  Row,
  SelectOptions,
  Space,
  Switch,
  Table,
  TableRowData,
  Tree,
  TreeNodeModel,
  TreeProps,
} from 'tdesign-react';
import { Icon } from 'tdesign-icons-react';
import classNames from 'classnames';
import { getDept, getUsers } from 'services/system';
import { TreeOptionData } from 'tdesign-react/es/common';

const SystemManage: React.FC<BrowserRouterProps> = () => {
  const [itemDatas, setItemDatas] = useState<{ label: string; children: boolean }[]>();
  const [userInfoList, setUserInfoList] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);

  async function dept({ pid }: { pid: string }) {
    const result = await getDept({ pid });
    // eslint-disable-next-line arrow-body-style
    const data = result.data.content.map((item: any) => {
      return { ...item, children: item.hasChildren };
    });
    return data;
  }

  async function loadUsers(params: { page: number; size: number }) {
    const result = await getUsers(params);
    setUserInfoList(result.data.content);
  }

  const init = async () => {
    setItemDatas(await dept({ pid: '' }));
    loadUsers({ page: 0, size: 10 });
  };

  useEffect(() => {
    init();
  }, []);

  const onTableSelectChange = (value: (string | number)[], { selectedRowData }: SelectOptions<TableRowData>) => {
    setSelectedRowKeys(value);
    console.log(value, selectedRowData);
  };

  function selected(context: {
    node: TreeNodeModel<TreeOptionData<string | number>>;
    e: React.MouseEvent<HTMLDivElement>;
  }) {
    console.log(context.node);
  }

  const renderIcon2: TreeProps['icon'] = (node) => {
    let name = '';
    if (node.getChildren(true)) {
      if (!node.expanded) {
        name = 'caret-right';
      } else if (node.loading) {
        name = 'loading';
      } else {
        name = 'caret-down';
      }
    }
    return <Icon name={name} />;
  };
  return (
    <div className={classNames(CommonStyle.pageWithPadding, CommonStyle.pageWithColor)}>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32, xl: 32, xxl: 40 }}>
        <Col span={2}>
          <Space direction='vertical'>
            <Tree
              data={itemDatas}
              hover
              lazy
              load={(node) => dept({ pid: node.data.id })}
              icon={renderIcon2}
              onClick={selected}
              activable={true}
            />
          </Space>
        </Col>
        <Col span={10}>
          <Table
            columns={[
              {
                colKey: 'row-select',
                fixed: 'left',
                type: 'multiple',
                // width: 50,
              },
              {
                align: 'left',
                width: 80,
                ellipsis: true,
                colKey: 'username',
                title: '用户名',
              },
              {
                align: 'left',
                width: 80,
                ellipsis: true,
                colKey: 'nickName',
                title: '昵称',
              },
              {
                align: 'left',
                width: 60,
                ellipsis: true,
                colKey: 'gender',
                title: '性别',
              },
              {
                align: 'left',
                width: 80,
                ellipsis: true,
                colKey: 'phone',
                title: '电话',
              },
              {
                align: 'left',
                width: 100,
                ellipsis: true,
                colKey: 'email',
                title: '邮箱',
              },
              {
                align: 'left',
                width: 100,
                ellipsis: true,
                colKey: 'amount',
                title: '部门',
                cell({ row }) {
                  return row.dept.name;
                },
              },
              {
                align: 'left',
                width: 80,
                ellipsis: true,
                colKey: 'enabled',
                title: '状态',
                cell({ row }) {
                  return <Switch size='large' value={row.enabled} />;
                },
              },
              {
                align: 'left',
                width: 100,
                ellipsis: true,
                colKey: 'createTime',
                title: '创建日期',
              },
              {
                align: 'left',
                fixed: 'right',
                width: 120,
                colKey: 'op',
                title: '操作',
                cell() {
                  return (
                    <>
                      <Button theme='primary' variant='text'>
                        管理
                      </Button>
                      <Button theme='primary' variant='text'>
                        删除
                      </Button>
                    </>
                  );
                },
              },
            ]}
            // loading={loading}
            data={userInfoList}
            rowKey='id'
            selectedRowKeys={selectedRowKeys}
            verticalAlign='middle'
            hover
            onSelectChange={onTableSelectChange}
            // pagination={{
            //   pageSize,
            //   total,
            //   current,
            //   showJumper: true,
            //   onCurrentChange(current, pageInfo) {
            //     dispatch(
            //       getList({
            //         pageSize: pageInfo.pageSize,
            //         current: pageInfo.current,
            //       }),
            //     );
            //   },
            //   onPageSizeChange(size) {
            //     dispatch(
            //       getList({
            //         pageSize: size,
            //         current: 1,
            //       }),
            //     );
            //   },
            // }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default React.memo(SystemManage);
