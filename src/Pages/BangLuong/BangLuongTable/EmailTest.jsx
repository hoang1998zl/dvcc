import React from 'react';
import emailjs from 'emailjs-com';

export function EmailButton() {
  function sendEmail(e) {
    e.preventDefault();

    const templateParams = {
      from_email: 'anbinh.weos.vn@gmail.com', // email gửi
      to_email: 'anbinh.weos.vn@gmail.com', // email nhận
      subject: 'Labortracking',
      from_name: 'Labortracking',
      to_name: 'Nhan vien 1',
      Full_Name: 'Vũ Đình Cường',
      Employee_ID: '123456',
      Position: 'Developer',
      Tax_code: '123456789',
      Payroll_period: 'June, 2022',
      Date_of_payment: '',
      Actual_working_days: '22',
      Standard_working_days: '22',
      Actual_Salary: '22,000,000',
      Total_earning: '22,000,000',
      Social_Insurance: '1,760,000',
      Medical_Insurance: '330,000',
      Unemployment_Insurance: '220,000',
      Personal_Income_Tax: '853,500',
      Total_Deduction: '3,163,500',
      Net_Take_Home: '18,836,500',
      Total_taxable_income: '22,000,000',
      Personal_tax_deduction: '9,000,000',
      Dependent_tax_deduction: '',
      Total_Assessable_Income: '10,690,000',
      YTD_Total_Earning: '66,000,000',
      YTD_Taxable_Income: '66,000,000',
      YTD_Assessable_Income: '32,070,000',
      YTD_PIT: '2,560,500',
      YTD_SMUI_EE: '6,930,000',
      YTD_Personal_Deduction: '27,000,000',
    };

    emailjs.send('service_va6pt0h', 'template_k32n4d9', templateParams, 'kcSayHW-xS0iuCuAx')
      .then((result) => {
        console.log(result);
      }, (error) => {
        console.log(error.text);
      });
  }

  return (
    <button
      onClick={sendEmail}
      className='border-orange-400 border-2 rounded-md px-2 py-1 text-orange-400 hover:text-white hover:bg-orange-400'
    >
      Test Send Email
    </button>
  );
}
