import AppLayout from '@/layouts/app-layout';
import { Meta } from '@/layouts/Meta';
import { AppConfig } from '@/utils/AppConfig';

import { app, type NextPageWithLayout } from './_app';
import { Button, Card, Table, Tag } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { IconSvgLocal } from '@/components';
import { collection, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { showToast } from '@/components/toast';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import {filter} from 'lodash'
const db = getFirestore(app);
const ManageList: NextPageWithLayout = () => {
  const [data, setData] = useState([])
  
  const getListFile = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, 'fileStorage'));
    const dataList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setData(filter(dataList, (el:any) => !el?.notDisplay))
  }, [])
  useEffect(() => {
    getListFile();
  }, [getListFile()])
  const deleteDataById = async (id: string) => {
    try {
      const docRef = doc(db, 'fileStorage', id); // Tham chiếu tới document theo id
      await updateDoc(docRef, {notDisplay: true}); // Cập nhật dữ liệu
      showToast({type:"success",content:"Xoá file thành công"})
    } catch (error) {
      console.error('Error updating document:', error);
      showToast({type:"danger",content:"Xoá file không thành công"})
    }
  };
    const handleExport = async (result: any, name:string) => {
      const worksheet = XLSX.utils.json_to_sheet(result);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Bảng điểm');
  
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, `${name}.xlsx`);

    };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Tên file",
      dataIndex: "name",
    },
    {
      title: "Lớp",
      dataIndex: "class",
    },
    {
      title:'Ngày',
      dataIndex:'createdDate',
      render: (_: any, record: any) => {
        return <div>{dayjs(record?.createdDate||  undefined).format('DD/MM/YYYY')}</div>
      }
    },
    {
      title:'Bản ghi',
      render: () => {
        return <div>1</div>
      }
    },
    {
      title:'Trạng thái',
      render: () => {
        return <Tag color="green">Hoạt động</Tag>
      }
    },
    {
      title:'Thao tác',
      render: (_: any, record: any) => {
        return <div>
           <Button
              onClick={() => deleteDataById(record?.id)}
              type="ghost"
              icon={<IconSvgLocal name="IC_DELETE" height={24} width={24} classNames='text-error-500'/>}
            />
            <Button
              onClick={() => handleExport(record?.data, record?.name)}
              type="ghost"
              icon={<IconSvgLocal name="IC_DOWNLOAD" height={24} width={24} classNames='text-primary-500'/>}
            />
        </div>
      }
    }
  ]
  return (
    <>
      <Meta title={AppConfig.site_name} description={AppConfig.description} />
      <div className="flex size-full flex-col p-32">
        <h1 style={{ fontSize: 42, fontWeight: 'bold' }}>Quản lý danh sách bảng điểm</h1>
        <div className="mt-48 flex size-full flex-col justify-center">
            <Card>
        <Table
          bordered
          dataSource={data}
          columns={columns}
          rowKey="id"
          scroll={{ y: 500, x: 150 * []?.length}}
        />
      </Card>
            </div>
          </div>
       
    </>
  );
};
ManageList.Layout = AppLayout;

export default ManageList;
