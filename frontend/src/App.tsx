import axios from "axios";

import { SubmitHandler, useForm } from "react-hook-form";

import { saveAs } from 'file-saver';

type Inputs = {
  selectedFiles: FileList
}

function formatData(data: { fileName: string, sheets: string[] }[]) {
  let formattedData = '';
  
  data.forEach(item => {
    formattedData += `Filename - ${item.fileName}\nSheets - ${item.sheets.join(', ')}\n______\n\n`;
  });
  
  return formattedData;
}

function App() {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const BASE_URL = import.meta.env.VITE_APP_API_GATEWAY;

      const response = await axios.post(BASE_URL, { files: data.selectedFiles }, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        const data = response.data;

        const formattedText = formatData(data.data);

        const blob = new Blob([formattedText], { type: 'text/plain' });

        saveAs(blob, `data.txt`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="main-container">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <label className="container">
          <h1>Upload Excel Files here</h1>
          <input type="file" accept=".xlsx" {...register('selectedFiles', { required: true })} multiple />
          {errors.selectedFiles && <span>File is required</span>}
        </label>

        <input type="submit" />
      </form>
    </section>
  )
}

export default App
