import { useState, useEffect } from 'react'
import axios from 'axios'

function useRequestData(url, initialState) {
  const [data, setData] = useState(initialState)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (url) {
      setIsLoading(true)
      axios
        .get(url)
        .then((response) => {
          setData(response.data)
          setIsLoading(false)
        })
        .catch((err) => {
          setError(err)
          setIsLoading(false)
        })
    }
  }, [url])

  return [data, isLoading, error]
}

export default useRequestData

