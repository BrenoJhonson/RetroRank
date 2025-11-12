import { useState } from 'react'

function useForm(initialState) {
  const [form, setForm] = useState(initialState)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  const resetForm = () => {
    setForm(initialState)
  }

  return [form, handleInputChange, resetForm]
}

export default useForm

