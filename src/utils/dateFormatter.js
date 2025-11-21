/**
 * Formata uma data para exibição relativa (ex: "há 2 horas", "há 3 dias")
 * ou data completa se for muito antiga
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Data não disponível'

  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  // Se a data for no futuro, retornar data formatada
  if (diffInSeconds < 0) {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Menos de 1 minuto
  if (diffInSeconds < 60) {
    return 'agora'
  }

  // Menos de 1 hora
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? 'há 1 minuto' : `há ${diffInMinutes} minutos`
  }

  // Menos de 24 horas
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return diffInHours === 1 ? 'há 1 hora' : `há ${diffInHours} horas`
  }

  // Menos de 7 dias
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return diffInDays === 1 ? 'há 1 dia' : `há ${diffInDays} dias`
  }

  // Menos de 30 dias
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? 'há 1 semana' : `há ${diffInWeeks} semanas`
  }

  // Menos de 1 ano
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? 'há 1 mês' : `há ${diffInMonths} meses`
  }

  // Mais de 1 ano - mostrar data completa
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Formata uma data para exibição completa com hora
 */
export const formatFullDateTime = (dateString) => {
  if (!dateString) return 'Data não disponível'

  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Formata uma data para exibição de data apenas
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Data não disponível'

  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

