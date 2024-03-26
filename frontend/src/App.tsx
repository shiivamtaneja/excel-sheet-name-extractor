import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  selectedFile: File
}

function App() {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const BASE_URL = import.meta.env.VITE_APP_API_GATEWAY;

      const response = await fetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify({
          files: data.selectedFile
        })
      })

      if (response.ok) {
        const responseData = await response.json()

        console.log(responseData)
      }

    } catch (error) {
      console.error(error)
    }
  };

  return (
    <section className="main-container">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <label className="container">
          <h1>Upload Excel File here</h1>
          <input type="file" accept=".xlsx" {...register('selectedFile', { required: true })} />
          {errors.selectedFile && <span>File is required</span>}
        </label>

        <input type="submit" />
      </form>
    </section>
  )
}

export default App
