import { Button, message, Upload, type UploadProps } from 'antd';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { undefined } from 'zod';

import { IconSvgLocal } from '@/components';
import AppLayout from '@/layouts/app-layout';
import { Meta } from '@/layouts/Meta';
import { AppConfig } from '@/utils/AppConfig';

import type { NextPageWithLayout } from './_app';

const Home: NextPageWithLayout = () => {
  const [uploading, setUploading] = useState(false);
  const [fileSaver, setFileSaver] = useState({
    name: '',
    data: [],
  });
  const handleExport = (data) => {
    const cleanedData = data?.slice(2);
    // return;
    const result = cleanedData.map((row, index) => {
      const parseNumber = (value) => {
        if (!value) return '';
        const cleaned = value
          .toString()
          .replace(',', '.')
          .replace(/[^\d.+-]/g, '');
        return Number.isNaN(parseFloat(cleaned)) ? '' : parseFloat(cleaned);
      };

      return {
        SBD: index + 1,
        'Mã sinh viên': row[1],
        'Điểm CC': parseNumber(row[4]),
        KT1: parseNumber(row[5]),
        KT2: parseNumber(row[6]),
        'Số tờ': parseNumber(row[7]) || 1,
        'Điểm thi': parseNumber(row[9]),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(result);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bảng điểm');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'bang_diem.xlsx');
  };
  // const handleExport = (data: any) => {
  //   // Bỏ các dòng đầu không chứa dữ liệu sinh viên
  //   const filteredData = data.filter((row) => row.length > 2 && row[1]);

  //   const result = filteredData.map((row, index) => {
  //     const studentCode = row[1];
  //     const numericValues = row
  //       .slice(4) // Bỏ SBD, MSSV, họ tên, ngày sinh
  //       .map((cell: any) => {
  //         // Chuẩn hóa số
  //         const value = (cell || '')
  //           .toString()
  //           .replace(',', '.')
  //           .replace(/[^\d.+-]/g, '');
  //         return isNaN(parseFloat(value)) ? null : parseFloat(value);
  //       })
  //       .filter((v) => v !== null);

  //     // Trích riêng điểm theo thứ tự yêu cầu
  //     const [diemCC, kt1, kt2, soTo, diemThi] = [
  //       numericValues[0] || '',
  //       numericValues[1] || '',
  //       numericValues[2] || '',
  //       numericValues[3] || '',
  //       numericValues[numericValues.length - 1] || '',
  //     ];

  //     return {
  //       SBD: index + 1,
  //       'Mã sinh viên': studentCode,
  //       'Điểm CC': diemCC,
  //       KT1: kt1,
  //       KT2: kt2,
  //       'Số tờ': soTo,
  //       'Điểm thi': diemThi,
  //     };
  //   });

  //   // Tạo file Excel
  //   const worksheet = XLSX.utils.json_to_sheet(result);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Diem');

  //   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  //   saveAs(dataBlob, 'bang_diem.xlsx');
  // };
  const handleUpload = async (file: File) => {
    setFileSaver(undefined);
    const formData = new FormData();
    formData.append('image', file);
    try {
      setUploading(true);
      const res = await axios.post('http://127.0.0.1:8000/process_image/', formData, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Chuyển đổi thành công!');
      setFileSaver({
        name: file?.name,
        data: res?.data?.result,
      });
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi gửi ảnh đến API!');
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    showUploadList: false,
    beforeUpload: (file) => {
      handleUpload(file);
      return false; // ngăn antd tự upload
    },
  };

  return (
    <>
      <Meta title={AppConfig.site_name} description={AppConfig.description} />

      <div className="flex size-full flex-col p-32">
        <h1 style={{ fontSize: 42, fontWeight: 'bold' }}>OCR BẢNG ĐIỂM</h1>
        <div className="mt-48 flex size-full justify-center">
          <div
            style={{
              borderWidth: 1,
              borderStyle: 'dashed',
              width: '100%',
              height: 400,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 12,
            }}
          >
            <div style={{ borderWidth: 1, borderRadius: 8, padding: 4, marginBottom: 16 }}>
              <IconSvgLocal name="IC_ARROW_DOWN" width={56} height={56} />
            </div>
            <div
              style={{ fontSize: 24, fontWeight: 'lighter', marginBottom: 16 }}
              className="w-full text-center"
            >
              Kéo thả ảnh vào đây, hoặc chọn ảnh
            </div>
            <Upload {...uploadProps}>
              <Button type="primary" loading={uploading}>
                Chuyển đổi
              </Button>
            </Upload>
            {fileSaver?.name && (
              <div className="mt-24 flex flex-row items-center">
                <div className="flex flex-row items-center justify-between rounded-radius-m bg-color-100 px-32">
                  <div>{fileSaver?.name}</div>
                  <Button
                    type="text"
                    icon={<IconSvgLocal name="IC_CLOSE" height={24} width={24} />}
                    loading={uploading}
                    onClick={() => setFileSaver(undefined)}
                  />
                </div>
                <Button
                  type="primary"
                  className="ml-16"
                  onClick={() => handleExport(fileSaver?.data)}
                >
                  Lưu file
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

Home.Layout = AppLayout;

export default Home;
