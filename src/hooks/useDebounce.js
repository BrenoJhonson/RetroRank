import { useState, useEffect } from 'react'

/**
 * Hook customizado para debounce de valores
 * @param {any} value - Valor a ser debounced
 * @param {number} delay - Delay em milissegundos (padrão: 300ms)
 * @returns {any} - Valor debounced
 */
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Configurar timer para atualizar o valor após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Limpar timer se o valor mudar antes do delay
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce

