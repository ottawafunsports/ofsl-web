export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'partial':
      return 'bg-yellow-100 text-yellow-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    case 'pending':
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatPaymentMethod = (method: string | null) => {
  if (!method) return '-';
  
  if (method === 'stripe') return 'ONLINE';
  
  return method.replace('_', '-').toUpperCase();
};